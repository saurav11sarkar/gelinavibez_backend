// import MessagingRequest from './messagingRequest.model';
// import AppError from '../../error/appError';

// const createRequest = async (requesterId: string, targetId: string) => {
//   if (requesterId === targetId) {
//     throw new AppError(400, 'Invalid request');
//   }

//   const exists = await MessagingRequest.findOne({
//     requester: requesterId,
//     target: targetId,
//     status: 'pending',
//   });

//   if (exists) {
//     throw new AppError(400, 'Request already sent');
//   }

//   return MessagingRequest.create({
//     requester: requesterId,
//     target: targetId,
//   });
// };

// const getAllPending = async () => {
//   return MessagingRequest.find({ status: 'pending' })
//     .populate('requester', 'firstName lastName role email')
//     .populate('target', 'firstName lastName role email');
// };

// export const messagingRequestService = {
//   createRequest,
//   getAllPending,
// };



import MessagingRequest from './messagingRequest.model';
import AppError from '../../error/appError';
import User from '../user/user.model';
import Conversation from '../conversation/conversation.model';

const createRequest = async (requesterId: string, targetId: string) => {
  if (requesterId === targetId) {
    throw new AppError(400, 'Invalid request');
  }

  const exists = await MessagingRequest.findOne({
    requester: requesterId,
    target: targetId,
    status: 'pending',
  });

  if (exists) {
    throw new AppError(400, 'Request already sent');
  }

  return MessagingRequest.create({
    requester: requesterId,
    target: targetId,
  });
};

const getAllPending = async () => {
  return MessagingRequest.find({ status: 'pending' })
    .populate('requester', 'firstName lastName role email')
    .populate('target', 'firstName lastName role email');
};

const actionRequest = async (requestId: string, action: 'approved' | 'rejected') => {
  const request = await MessagingRequest.findById(requestId);
  if (!request) throw new AppError(404, 'Request not found');

  if (action === 'approved') {
    request.status = 'approved';

    // Bi-directional permission
    await User.findByIdAndUpdate(request.requester, {
      $addToSet: { messagingPermissions: request.target },
    });
    await User.findByIdAndUpdate(request.target, {
      $addToSet: { messagingPermissions: request.requester },
    });

    // Create conversation if not exists
    const existing = await Conversation.findOne({
      members: { $all: [request.requester, request.target] },
    });

    if (!existing) {
      await Conversation.create({
        members: [request.requester, request.target],
      });
    }
  } else if (action === 'rejected') {
    request.status = 'rejected';
  }

  await request.save();
  return request;
};

export const messagingRequestService = {
  createRequest,
  getAllPending,
  actionRequest,
};

