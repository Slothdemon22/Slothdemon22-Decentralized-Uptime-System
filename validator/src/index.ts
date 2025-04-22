import express from 'express';
import { Server, WebSocketServer,WebSocket } from 'ws'; 


const app = express();
const PORT = 3000;
let validatorID=Math.floor(Math.random()*10);




function main()
{
    const socket = new WebSocket('ws://localhost:5050');
    socket.onopen = function () {
        console.log('Connected to server');
        socket.send(JSON.stringify({ type: 'register', validatorID }));
      };
      socket.onmessage = function (event) {
       
      
        try {
          const incomingData=event.data.toString()
          const data = JSON.parse(incomingData); // ✅ use event.data
          if (data.type === 'ping') {
            console.log('Received ping from server', data);
            //pinging website
            // You could send back a pong:
            data.websites.forEach(async (website: any) => {
              try {
                const url = new URL(`https://${website.url}`);
                const startTime = Date.now();
            
                const res = await fetch(url.toString());
                const latency = Date.now() - startTime;
                const statusCode = res.status;
                const status = res.status === 200 ? "Good" : "Bad";
            
                socket.send(JSON.stringify({
                  type: 'validate',
                  validatorID,
                  website,
                  statusCode,
                  latency,
                  status
                }));
              } catch (err) {
                console.error(`Invalid URL or fetch failed for ${website.url}`, err);
                socket.send(JSON.stringify({
                  type: 'validate',
                  validatorID,
                  website,
                  statusCode: 0,
                  latency: 0,
                  status: 'Invalid URL'
                }));
              }
            });
              
           
          }
        } catch (err) {
          console.error('Failed to parse message:', err);
        }
      };


}
main();