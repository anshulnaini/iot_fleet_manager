import http from 'http';
import app from './index';
import { WebSocketServer } from 'ws';
import { setWSServer } from './lib/ws';

const port = process.env.PORT || 4000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/live' });
setWSServer(wss);

server.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
