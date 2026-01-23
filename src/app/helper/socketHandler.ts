// import { Server, Socket } from 'socket.io';
// import Message from '../modules/message/message.model';

// const users: { userId: string; socketId: string }[] = [];

// export const socketHandler = (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     console.log('✅ User connected:', socket.id);

//     // Add user to online list
//     socket.on('addUser', (userId: string) => {
//       if (!users.find((u) => u.userId === userId)) {
//         users.push({ userId, socketId: socket.id });
//       }
//       io.emit('getUsers', users);
//     });

//     // Send message
//     socket.on(
//       'sendMessage',
//       async ({ senderId, receiverId, conversationId, message }) => {
//         const newMsg = await Message.create({
//           senderId,
//           receiverId,
//           conversationId,
//           message,
//         });

//         const receiver = users.find((u) => u.userId === receiverId);
//         if (receiver) {
//           io.to(receiver.socketId).emit('receiveMessage', newMsg);
//         }
//       },
//     );

//     // Disconnect
//     socket.on('disconnect', () => {
//       const index = users.findIndex((u) => u.socketId === socket.id);
//       if (index !== -1) users.splice(index, 1);
//       console.log('❌ User disconnected:', socket.id);
//       io.emit('getUsers', users);
//     });
//   });
// };

//=====================================================

// import { Server, Socket } from 'socket.io';
// import Message from '../modules/message/message.model';

// const users: { userId: string; socketId: string }[] = [];

// export const socketHandler = (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     console.log('✅ User connected:', socket.id);

//     // Add user to online list
//     socket.on('addUser', (userId: string) => {
//       // Fix: Update socketId if user reconnects
//       const existingUserIndex = users.findIndex((u) => u.userId === userId);
//       if (existingUserIndex !== -1) {
//         users[existingUserIndex].socketId = socket.id;
//       } else {
//         users.push({ userId, socketId: socket.id });
//       }
//       console.log('👤 User added:', userId, 'Total:', users.length);
//       io.emit('getUsers', users);
//     });

//     // Send message
//     socket.on(
//       'sendMessage',
//       async ({ senderId, receiverId, conversationId, message }) => {
//         try {
//           const newMsg = await Message.create({
//             senderId,
//             receiverId,
//             conversationId,
//             message,
//           });

//           // Fix: Convert Mongoose document to plain object
//           const messageData = newMsg.toObject();

//           // Send to receiver
//           const receiver = users.find((u) => u.userId === receiverId);
//           if (receiver) {
//             io.to(receiver.socketId).emit('receiveMessage', messageData);
//           }

//           // Fix: Send confirmation to sender
//           socket.emit('messageSent', messageData);
//         } catch (error) {
//           console.error('Error sending message:', error);
//           socket.emit('messageError', { error: 'Failed to send message' });
//         }
//       },
//     );

//     // Disconnect
//     socket.on('disconnect', () => {
//       const index = users.findIndex((u) => u.socketId === socket.id);
//       if (index !== -1) users.splice(index, 1);
//       console.log('❌ User disconnected:', socket.id);
//       io.emit('getUsers', users);
//     });
//   });
// };

//=======================================================================

// import { Server, Socket } from 'socket.io';
// import Message from '../modules/message/message.model';
// import { canMessage } from '../utils/canMessage';

// const users: { userId: string; socketId: string }[] = [];

// export const socketHandler = (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     socket.on('addUser', (userId: string) => {
//       const existing = users.find((u) => u.userId === userId);
//       if (existing) {
//         existing.socketId = socket.id;
//       } else {
//         users.push({ userId, socketId: socket.id });
//       }
//       io.emit('getUsers', users);
//     });

//     socket.on(
//       'sendMessage',
//       async ({ senderId, receiverId, conversationId, message }) => {
//         try {
//           await canMessage(senderId, receiverId);

//           const newMsg = await Message.create({
//             senderId,
//             receiverId,
//             conversationId,
//             message,
//           });

//           const data = newMsg.toObject();

//           const receiver = users.find((u) => u.userId === receiverId);
//           if (receiver) {
//             io.to(receiver.socketId).emit('receiveMessage', data);
//           }

//           socket.emit('messageSent', data);
//         } catch (error: any) {
//           socket.emit('messageError', {
//             error: error.message,
//           });
//         }
//       },
//     );

//     socket.on('disconnect', () => {
//       const index = users.findIndex((u) => u.socketId === socket.id);
//       if (index !== -1) users.splice(index, 1);
//       io.emit('getUsers', users);
//     });
//   });
// };


//==========================================================================

// socketHandler.ts
import { Server, Socket } from 'socket.io';
import { canMessage } from '../utils/canMessage';
import Message from '../modules/message/message.model';

interface IUserSocket {
  userId: string;
  socketId: string;
}

const users: IUserSocket[] = [];

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('✅ User connected:', socket.id);

    // Add user
    socket.on('addUser', (userId: string) => {
      const existing = users.find(u => u.userId === userId);
      if (existing) existing.socketId = socket.id;
      else users.push({ userId, socketId: socket.id });
      io.emit('getUsers', users);
    });

    // Send message
    socket.on('sendMessage', async ({ senderId, receiverId, conversationId, message }) => {
      try {
        await canMessage(senderId, receiverId);

        const newMsg = await Message.create({ senderId, receiverId, conversationId, message });

        // Emit to receiver if online
        const receiver = users.find(u => u.userId === receiverId);
        if (receiver) io.to(receiver.socketId).emit('receiveMessage', newMsg);

        // Emit to sender
        socket.emit('messageSent', newMsg);
      } catch (error: any) {
        socket.emit('messageError', { error: error.message });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      const index = users.findIndex(u => u.socketId === socket.id);
      if (index !== -1) users.splice(index, 1);
      io.emit('getUsers', users);
      console.log('❌ User disconnected:', socket.id);
    });
  });
};


