import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { setupWSConnection } from 'y-websocket/bin/utils';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '1234');

// Create WebSocket server
const wss = new WebSocketServer({
  port: PORT,
  perMessageDeflate: false,
});

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  console.log('New WebSocket connection established');

  // Set up Yjs WebSocket connection
  setupWSConnection(ws as any, req);

  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`🚀 ArtifyPro Collaboration Server running on ws://localhost:${PORT}`);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});