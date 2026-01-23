// import Message from './message.model';
// import { IMessage } from './message.interface';
// import AppError from '../../error/appError';

// // Create message
// // const createMessage = async (userId: string, payload: IMessage) => {
// //   const message = await Message.create({ ...payload, senderId: userId });
// //   return message;
// // };

// import { canMessage } from '../../utils/canMessage';

// const createMessage = async (userId: string, payload: IMessage) => {
//   await canMessage(userId, payload.receiverId.toString());

//   const message = await Message.create({
//     ...payload,
//     senderId: userId,
//   });

//   return message;
// };

// // Get all messages by conversation
// const getMessagesByConversation = async (
//   userId: string,
//   conversationId: string,
// ) => {
//   const messages = await Message.find({ conversationId })
//     .populate('senderId', 'firstName lastName profileImage')
//     .populate('receiverId', 'firstName lastName profileImage');
//   return messages;
// };

// // Update message
// const updateMessage = async (
//   userId: string,
//   id: string,
//   payload: Partial<IMessage>,
// ) => {
//   const message = await Message.findById(id);
//   if (!message) throw new AppError(404, 'Message not found');
//   if (message.senderId.toString() !== userId)
//     throw new AppError(403, 'Not authorized');

//   return await Message.findByIdAndUpdate(id, payload, { new: true });
// };

// // Delete message
// const deleteMessage = async (userId: string, id: string) => {
//   const message = await Message.findById(id);
//   if (!message) throw new AppError(404, 'Message not found');
//   if (message.senderId.toString() !== userId)
//     throw new AppError(403, 'Not authorized');

//   await Message.findByIdAndDelete(id);
// };

// export const messageService = {
//   createMessage,
//   getMessagesByConversation,
//   updateMessage,
//   deleteMessage,
// };



import Message from './message.model';
import AppError from '../../error/appError';
import { IMessage } from './message.interface';
import { canMessage } from '../../utils/canMessage';

const createMessage = async (userId: string, payload: IMessage) => {
  await canMessage(userId, payload.receiverId.toString());

  return Message.create({
    ...payload,
    senderId: userId,
  });
};

const getMessagesByConversation = async (userId: string, conversationId: string) => {
  return Message.find({ conversationId })
    .populate('senderId', 'firstName lastName profileImage')
    .populate('receiverId', 'firstName lastName profileImage');
};

const updateMessage = async (userId: string, id: string, payload: Partial<IMessage>) => {
  const message = await Message.findById(id);
  if (!message) throw new AppError(404, 'Message not found');
  if (message.senderId.toString() !== userId) throw new AppError(403, 'Not authorized');

  return Message.findByIdAndUpdate(id, payload, { new: true });
};

const deleteMessage = async (userId: string, id: string) => {
  const message = await Message.findById(id);
  if (!message) throw new AppError(404, 'Message not found');
  if (message.senderId.toString() !== userId) throw new AppError(403, 'Not authorized');

  await Message.findByIdAndDelete(id);
};

export const messageService = {
  createMessage,
  getMessagesByConversation,
  updateMessage,
  deleteMessage,
};
