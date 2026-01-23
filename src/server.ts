import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { socketHandler } from './app/helper/socketHandler';
import http from 'http';
import { Server } from 'socket.io';


const PORT = config.port;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

socketHandler(io);

const main = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    }

    const mongo = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected: ${mongo.connection.host}`);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('❌ Error starting server:', error.message || error);
    process.exit(1);
  }
};

main();
