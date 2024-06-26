import TokenBucket from './token-bucket/token-bucket';
import express from 'express';

export const createServer = () => {
    const app = express();
    const rateLimiter = new TokenBucket();
    
    app.use('/limited', async (req, res, next) => {
        rateLimiter.handleRequest(req, res, next)
    });

    app.get('/limited', async (req, res) => {
        return res.status(200).send("limited request");
    });
    
    app.get('/unlimited', async (req, res) => {
        return res.status(200).send("Unlimited request");
    });
    
    const server = app.listen(3000, () => {
        console.log("server is running....");
    });

    server.on('close', () => {
        rateLimiter.close()
    })

    return server;
}

