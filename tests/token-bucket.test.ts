import axios from "axios";
import { createServer } from "..";
import { sleep } from "../utils/sleep";
const serverUrl = 'http://localhost:3000/limited';

describe('Testing token bucket', () => {
    const server = createServer();
    afterAll((done) => {
      server.close(() => {
        done();
      });
    });
    
    const client = axios.create({ validateStatus: () => true });

    it("should reject requet once bucket is empty", async () => {
        const promises = [];
        for (let i = 0; i < 10; i++) {
          promises.push(client.get(serverUrl));
        }
    
        const responses = await Promise.all(promises);
        responses.forEach((response) => {
          expect(response.status).toBe(200);
        });
    
        // Next request should get rejected
        const response = await client.get(serverUrl);
        expect(response.status).toBe(429);
    })

    it("should be able to send request after 1 second", async () => {
     
     await sleep(1000);
     const response = await client.get(serverUrl);
     expect(response.status).toBe(200);
    })
})