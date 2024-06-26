import { NextFunction, Request, Response } from "express";

class TokenBucket{
    store: Map<string, number>;
    interval: ReturnType<typeof setInterval>;

    constructor() {
        this.store = new Map();
        this.interval =  setInterval(() => {this.fillBucket()}, 1000);
    }

    private async fillBucket(){
        for(let [key, value] of this.store){
            if(value < 10){
                this.store.set(key, value+1);
            }
        }
      
    }

    public close(){
        clearInterval(this.interval);
    }

   
    public async handleRequest(req: Request, res: Response, next: NextFunction){
        // get IP address of the client 
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        if(typeof ip !== 'string') return res.status(400).send("Anonymous request \n");
        
        const count = this.store.get(ip);
        
        if(count == undefined){
            this.store.set(ip, 9);
            next();
            return;
        }

        if(count == 0){
            res.status(429).send('Too many requests. Please try again later\n');
            return;
        }

        this.store.set(ip, count - 1);
        next();

    }
}
export default TokenBucket;