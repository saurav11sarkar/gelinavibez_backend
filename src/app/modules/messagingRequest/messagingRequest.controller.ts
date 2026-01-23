// import catchAsync from '../../utils/catchAsycn';
// import sendResponse from '../../utils/sendResponse';
// import MessagingRequest from './messagingRequest.model';
// import User from '../user/user.model';
// import Conversation from '../conversation/conversation.model';

// const sendRequest = catchAsync(async (req, res) => {
//   const requesterId = req.user.id;
//   const { targetId } = req.body;

//   const result = await MessagingRequest.create({
//     requester: requesterId,
//     target: targetId,
//   });

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: 'Messaging request sent',
//     data: result,
//   });
// });

// const getAllRequests = catchAsync(async (req, res) => {
//   const result = await MessagingRequest.find({ status: 'pending' })
//     .populate('requester', 'firstName lastName role email')
//     .populate('target', 'firstName lastName role email');

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'All messaging requests',
//     data: result,
//   });
// });

// const actionMessagingRequest = catchAsync(async (req, res) => {
//   const { requestId, action } = req.body;

//   const request = await MessagingRequest.findById(requestId);
//   if (!request) {
//     return res.status(404).json({ message: 'Request not found' });
//   }

//   if (action === 'approved') {
//     request.status = 'approved';

//     await User.findByIdAndUpdate(request.requester, {
//       $addToSet: { messagingPermissions: request.target },
//     });

//     await Conversation.create({
//       members: [request.requester, request.target],
//     });
//   }

//   if (action === 'rejected') {
//     request.status = 'rejected';
//   }

//   await request.save();

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: `Request ${action}d successfully`,
//     data: request,
//   });
// });

// export const messagingRequestController = {
//   sendRequest,
//   getAllRequests,
//   actionMessagingRequest,
// };



import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { messagingRequestService } from './messagingRequest.service';

const sendRequest = catchAsync(async (req, res) => {
  const requesterId = req.user.id;
  const { targetId } = req.body;

  const result = await messagingRequestService.createRequest(requesterId, targetId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Messaging request sent',
    data: result,
  });
});

const getAllRequests = catchAsync(async (req, res) => {
  const result = await messagingRequestService.getAllPending();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All pending requests',
    data: result,
  });
});

const actionMessagingRequest = catchAsync(async (req, res) => {
  const { requestId, action } = req.body;

  const result = await messagingRequestService.actionRequest(requestId, action);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Request ${action}d successfully`,
    data: result,
  });
});

export const messagingRequestController = {
  sendRequest,
  getAllRequests,
  actionMessagingRequest,
};
