const { Server } = require('socket.io');

let io;

const init = (server) => {
  try {
    // Check if we are in a serverless environment (Vercel)
    if (process.env.VERCEL) {
      console.log('[socket]: Running on Vercel. Persistant WebSockets are not supported. Skipping init.');
      return null;
    }

    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log(`[socket]: User connected ${socket.id}`);
      socket.on('disconnect', () => {
        console.log(`[socket]: User disconnected ${socket.id}`);
      });
    });

    return io;
  } catch (error) {
    console.warn('[socket]: Failed to initialize Socket.io:', error.message);
    return null;
  }
};

const getIO = () => {
  // If io isn't initialized (like on Vercel), return a mock object to prevent crashes
  if (!io) {
    return {
      emit: () => { /* No-op on Vercel */ }
    };
  }
  return io;
};

module.exports = { init, getIO };
