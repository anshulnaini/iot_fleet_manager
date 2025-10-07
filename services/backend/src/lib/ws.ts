import { WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer;

export function setWSServer(server: WebSocketServer) {
  console.log('WebSocket server set');
  wss = server;
}

export function broadcast(message: object) {
  console.log('Broadcasting message:', message);
  if (!wss) {
    console.log('WebSocket server not set, cannot broadcast');
    return;
  }

  const data = JSON.stringify(message);
  console.log(`Broadcasting to ${wss.clients.size} clients`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Sending message to client');
      client.send(data);
    } else {
      console.log('Client not ready, cannot send message');
    }
  });
}
