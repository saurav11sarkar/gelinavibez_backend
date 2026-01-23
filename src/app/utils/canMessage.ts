
// import AppError from '../error/appError';
// import User from '../modules/user/user.model';

// export const canMessage = async (senderId: string, receiverId: string) => {
//   if (senderId === receiverId) {
//     throw new AppError(400, "You can't message yourself");
//   }

//   const [sender, receiver] = await Promise.all([
//     User.findById(senderId),
//     User.findById(receiverId),
//   ]);

//   if (!sender || !receiver) {
//     throw new AppError(404, 'User not found');
//   }

//   // Admin / Superadmin can message anyone
//   if (['admin', 'superadmin'].includes(sender.role)) return true;

//   // Anyone can message Admin / Superadmin
//   if (['admin', 'superadmin'].includes(receiver.role)) return true;

//   // Check permission
//   const allowed = sender.messagingPermissions?.some(
//     (id) => id.toString() === receiver._id.toString(),
//   );

//   if (!allowed) {
//     throw new AppError(403, 'Messaging permission not granted');
//   }

//   return true;
// };

//===============================================
import AppError from '../error/appError';
import User from '../modules/user/user.model';

export const canMessage = async (senderId: string, receiverId: string) => {
  if (senderId === receiverId) {
    throw new AppError(400, "You can't message yourself");
  }

  const [sender, receiver] = await Promise.all([
    User.findById(senderId),
    User.findById(receiverId),
  ]);

  if (!sender || !receiver) {
    throw new AppError(404, 'User not found');
  }

  const ADMIN_ROLES = ['admin', 'superadmin'];

  if (ADMIN_ROLES.includes(sender.role)) return true;

  if (ADMIN_ROLES.includes(receiver.role)) return true;

  const allowed = sender.messagingPermissions?.some(
    (id) => id.toString() === receiver._id.toString(),
  );

  if (!allowed) {
    throw new AppError(403, 'Messaging permission not granted');
  }

  return true;
};
