import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import mongoose from 'mongoose';
import { connectDB } from './utils/connectDB';
import Website from './models/Website';
import WebsiteTick from './models/WebisteTicks';
import { randomUUID } from 'crypto';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import Validator from './models/Validator';

const app = express();
const PORT = 5050;

const availableValidators: { validatorID: string; socket: WebSocket }[] = [];
const CALLBACKS: { [key: string]: (data: any) => void } = {};

app.use(express.json());

const expressServer = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server: expressServer });
connectDB();

wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 New WebSocket connection');

  ws.on('message', async (message: Buffer) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

    
      if (parsedMessage.type === 'register') {
        const { message: signedMessage, signature, publicKey,ip,location } = parsedMessage;
        const validatorID = publicKey; 

        const isValid = await verifyMessage(signedMessage, signature, publicKey);
        if (!isValid) {
          console.error('❌ Invalid message signature');
          return;
        }

        let validatorDoc = await Validator.findOne({ publicKey:validatorID });
        if (!validatorDoc) {
          validatorDoc = new Validator({ publicKey, ip, location });
          await validatorDoc.save();
          console.log('🆕 New validator saved to DB:', validatorID);
        }

        if (!availableValidators.some((v) => v.validatorID === validatorID)) {
          availableValidators.push({ validatorID, socket: ws });
          console.log('✅ Validator registered:', validatorID);
          ws.send(JSON.stringify({ type: 'registered',validatorID: validatorDoc._id }));
        }
      }


      if (parsedMessage.type === 'validate') {
        const { ID } = parsedMessage;
        if (CALLBACKS[ID]) {
          await CALLBACKS[ID](parsedMessage);
          delete CALLBACKS[ID];
        }
      }
    } catch (err) {
      console.error('❗ Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    console.log('🔌 Validator disconnected');
    const index = availableValidators.findIndex((v) => v.socket === ws);
    if (index !== -1) availableValidators.splice(index, 1);
  });

  ws.on('error', (error: Error) => {
    console.error('💥 WebSocket error:', error);
  });
});


setInterval(async () => {
  try {
    const websitesToMonitor = await Website.find({ disabled: false });

    for (const website of websitesToMonitor) {
      const callbackID = randomUUID();

      availableValidators.forEach((validator) => {
        try {
          validator.socket.send(
            JSON.stringify({
              type: 'ping',
              callbackID,
              websites: [{ url: website.url }],
            })
          );

          CALLBACKS[callbackID] = async (data: any) => {
            try {
              const { statusCode, latency, status, validatorID } = data;

              console.log(`🔁 Validator ${validatorID} responded:`, statusCode, latency, status);

              const newTick = new WebsiteTick({
                validatorID,
                status,
                latency,
                statusCode,
              });

              await newTick.save();
              console.log('✅ Tick saved:', newTick._id);

              const websiteToUpdate = await Website.findById(website._id);
              if (websiteToUpdate) {
                websiteToUpdate.Ticks.push(newTick._id as mongoose.Types.ObjectId);
                await websiteToUpdate.save();
                console.log('🌐 Website updated:', website.url);
              } else {
                console.error('❌ Website not found:', website._id);
              }
            } catch (err) {
              console.error('❗ Error saving tick or updating website:', err);
            }
          };

          // Optional: Clean up stale callbacks after timeout
          // setTimeout(() => delete CALLBACKS[callbackID], 30000);
        } catch (err) {
          console.error('❗ Failed to send ping:', err);
        }
      });
    }
  } catch (err) {
    console.error('❗ Error in monitoring interval:', err);
  }
}, 5 *60 * 1000);

// Message verification
async function verifyMessage(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Uint8Array.from(JSON.parse(signature));
    const publicKeyBytes = new PublicKey(publicKey).toBytes();

    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    console.log('🔐 Signature verification result:', isValid);
    return isValid;
  } catch (err) {
    console.error('❗ Error verifying message:', err);
    return false;
  }
}
