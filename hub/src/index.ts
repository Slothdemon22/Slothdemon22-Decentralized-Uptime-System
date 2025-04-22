import express, { json } from 'express';
import { Server, WebSocketServer,WebSocket } from 'ws'; 
import mongoose from 'mongoose';
import { connectDB } from './utils/connectDB';
import Website from './models/Website';


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
connectDB()

wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
  
    ws.on('message', (message: Buffer) => {
      
      const messageString = message.toString();
      const parsedMessage = JSON.parse(messageString);
     
   
      
     
     if(parsedMessage.type === 'register') {
        const { validatorID } = parsedMessage;
        availableValidators.push({ validatorID, socket: ws });
        console.log('Validator registered:', validatorID);
        ws.send(JSON.stringify({ type: 'registered', validatorID }));
      }
      if(parsedMessage.type === 'validate') {
     
        const { validatorID, website, statusCode, latency,status } = parsedMessage;
        console.log('Received validation from validator:', validatorID, statusCode, latency,status);
       
        // const newTick = new WebsiteTick({ validatorID, status, latency });
        // await newTick.save();
      }
      
  ;
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
      const index = availableValidators.findIndex((validator) => validator.socket === ws);
      if (index !== -1) {
        availableValidators.splice(index, 1);
      }
      console.log('Available validators:', availableValidators);
    });
  
    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  });


  setInterval(() => {
    
       availableValidators.forEach(async(validator) => {
        console.log("validator",validator.validatorID);
     //  console.log(validator.socket);
       const websites=await Website.find({});
        // console.log("websites",websites);
        
        validator.socket.send(JSON.stringify({ type: 'ping',websites}));
        

       })
  }, 10 *1000);