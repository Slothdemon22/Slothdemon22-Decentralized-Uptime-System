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

        console.log('Message from server ', event.data);

      }        


}
main();