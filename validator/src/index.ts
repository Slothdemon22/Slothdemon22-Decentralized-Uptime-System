import { Keypair } from '@solana/web3.js';
import { WebSocket } from 'ws';
import "dotenv/config";
import nacl from 'tweetnacl';

let validatorID: string |null=null

function main() {
  const socket = new WebSocket('ws://localhost:5050');

  socket.onopen = () => {
    console.log('🔌 Connected to server');
  
   
  
    
    const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!)));
    console.log('🔑 Public Key:', keypair.publicKey.toString());
  
   
    const message = `register:${validatorID}:${Date.now()}`;
    const messageBytes = new TextEncoder().encode(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  
   
    socket.send(JSON.stringify({
      type: 'register',
      validatorID,
      location:"Lahore",
      ip:"127.0.0.1",
      message,
      signature: JSON.stringify(Array.from(signature)),
      publicKey: keypair.publicKey.toString()
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data.toString());
      if(data.type === 'registered'){
        console.log("Validator registered",data.validatorID)
        validatorID = data.validatorID

      }
      
      if (data.type === 'ping') {
        console.log(' Received ping:', data);
        

        data.websites.forEach(async (website: any) => {
          try {
            const url = new URL(`${website.url}`);
            const startTime = Date.now();
            const res = await fetch(url.toString());
            const latency = Date.now() - startTime;
            const statusCode = res.status;
            const status = statusCode === 200 ? 'Good' : 'Bad';
            console.log("Repsonse",statusCode,latency,status)
            socket.send(
              JSON.stringify({
                type: 'validate',
                validatorID,
                ID: data.callbackID,
                statusCode,
                latency,
                status,
              })
            
            );
          } catch (err) {
            console.error(` Fetch failed for ${website.url}:`, err);

            socket.send(
              JSON.stringify({
                type: 'validate',
                validatorID,
                ID: data.callbackID,
                statusCode: 503,
                latency: 2000,
                status: 'Bad',
              })
            );
          }
        });
      }
    } catch (err) {
      console.error(' Failed to parse message or handle ping:', err);
    }
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  socket.onclose = () => {
    console.log('🔌 Connection closed');
    process.exit(0);
  };
}

main();
