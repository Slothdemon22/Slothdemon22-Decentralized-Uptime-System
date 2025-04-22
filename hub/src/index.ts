import express, { json } from 'express';
import { Server, WebSocketServer,WebSocket } from 'ws'; 
import mongoose from 'mongoose';


const app = express();
const PORT = 5050;

const availableValidators:{validatorID:string,socket:WebSocket}[] = [];
const CALLBACKS:{[key:string]:(data:any)=>void} = {};
const cost=100;
app.use(express.json());
const expressServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const wss = new WebSocketServer({ server: expressServer });


wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
  
    ws.on('message', (message: Buffer) => {
      
      const messageString = message.toString();
      console.log(`Received: ${messageString}`);
   
      
      ws.send(`Server received: ${messageString}`);
      console.log(JSON.parse(messageString));
      availableValidators.push({validatorID:JSON.parse(messageString).validatorID,socket:ws});
      console.log(availableValidators.length);
      
    //   wss.clients.forEach((client) => {
    //     if (client !== ws && client.readyState === WebSocket.OPEN) {
    //       client.send(`User said: ${messageString}`);
    //     }
    //   });
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  
    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  });


  setInterval(() => {
       availableValidators.forEach((validator) => {
        console.log("validator",validator.validatorID);
        console.log(validator.socket);
        validator.socket.send(JSON.stringify({ type: 'ping', cost:Math.floor(Math.random()*100 )}));
        

       })
  }, 2 *1000);