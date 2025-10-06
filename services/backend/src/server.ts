import http from 'http';
import app from './index';

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
