import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import { generateLayoutRoute } from './routes/generateLayout.js';
import { generateImageRoute } from './routes/generateImage.js';
import { exportRoute } from './routes/export.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;
const WS_PORT = 1234;

// WebSocket server for Yjs collaboration
const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
  console.log('Yjs WebSocket connection established');
});

console.log(`🚀 Yjs WebSocket server running on ws://localhost:${WS_PORT}`);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.amazonaws.com", "https://*.cloudfront.net"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Routes
app.use('/api/generate/layout', generateLayoutRoute);
app.use('/api/generate/image', generateImageRoute);
app.use('/api/export', exportRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 ArtifyPro Backend running on http://localhost:${PORT}`);
  console.log(`🔗 Yjs WebSocket server running on ws://localhost:${WS_PORT}`);
});