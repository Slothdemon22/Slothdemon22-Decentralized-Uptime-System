import { WebSocket } from 'ws';

const validatorID = "68068e2f016d8c83c687baeb"

function main() {
  const socket = new WebSocket('ws://localhost:5050');

  socket.onopen = () => {
    console.log(' Connected to server');
    socket.send(JSON.stringify({ type: 'register', validatorID }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data.toString());

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
                statusCode: 0,
                latency: 0,
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
  };
}

main();
