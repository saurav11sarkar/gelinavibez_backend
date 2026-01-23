// import Conversation from './conversation.model';
// import AppError from '../../error/appError';
// import User from '../user/user.model';
// import { userRole } from '../user/user.constant';

// // const createConversation = async (userId: string, receiverId: string) => {
// //   if (userId === receiverId) {
// //     throw new AppError(400, "You can't create a conversation with yourself");
// //   }

// //   // Check if conversation already exists
// //   const existing = await Conversation.findOne({
// //     members: { $all: [userId, receiverId] },
// //   });

// //   if (existing) {
// //     return existing;
// //   }

// //   const conversation = await Conversation.create({
// //     members: [userId, receiverId],
// //   });

// //   return conversation;
// // };

// // const getAllConversations = async (userId: string) => {
// //   // Return all conversations where current user is a member

// //   const conversations = await Conversation.find({
// //     members: { $in: [userId] },
// //   }).populate('members', 'firstName lastName email profileImage role');

// //   return conversations;
// // };

// //====================================

// import { canMessage } from '../../utils/canMessage';

// const createConversation = async (userId: string, receiverId: string) => {
//   if (userId === receiverId) {
//     throw new AppError(400, "You can't chat with yourself");
//   }

//   //  Permission Check
//   await canMessage(userId, receiverId);

//   const existing = await Conversation.findOne({
//     members: { $all: [userId, receiverId] },
//   });

//   if (existing) return existing;

//   return await Conversation.create({
//     members: [userId, receiverId],
//   });
// };

// //======================================

// // const createConversation = async (userId: string, receiverId: string) => {
// //   if (userId === receiverId) {
// //     throw new AppError(400, "You can't chat with yourself");
// //   }

// //   const existing = await Conversation.findOne({
// //     members: { $all: [userId, receiverId] },
// //   });

// //   if (existing) return existing;

// //   return await Conversation.create({
// //     members: [userId, receiverId],
// //   });
// // };

// // ADMIN / SUPERADMIN CAN SEE ALL
// const getAllConversations = async (userId: string) => {
//   const user = await User.findById(userId);

//   if (!user) throw new AppError(404, 'User not found');
//   const query =
//     user.role === 'admin' || user.role === 'superadmin'
//       ? {}
//       : { members: { $in: [userId] } };

//   return await Conversation.find(query)
//     .populate('members', 'firstName lastName email profileImage role')
//     .sort({ updatedAt: -1 });
// };

// export const conversationService = {
//   createConversation,
//   getAllConversations,
// };



import AppError from '../../error/appError';
import Conversation from './conversation.model';
import User from '../user/user.model';
import { canMessage } from '../../utils/canMessage';

const createConversation = async (userId: string, receiverId: string) => {
  await canMessage(userId, receiverId);

  const existing = await Conversation.findOne({
    members: { $all: [userId, receiverId] },
  });

  if (existing) return existing;

  return Conversation.create({ members: [userId, receiverId] });
};

const getAllConversations = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const query =
    ['admin', 'superadmin'].includes(user.role)
      ? {}
      : { members: { $in: [userId] } };

  return Conversation.find(query)
    .populate('members', 'firstName lastName email profileImage role')
    .sort({ updatedAt: -1 });
};

export const conversationService = {
  createConversation,
  getAllConversations,
};
