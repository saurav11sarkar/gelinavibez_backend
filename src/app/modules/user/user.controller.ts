import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import pick from '../../helper/pick';
import { userService } from './user.service';
// import User from '../user/user.model';

const createUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.createUser(userId, req.body, req.ip || '');
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'name',
    'email',
    'role',
    'firstName',
    'lastName',
    'verified',
    'approvedLandlordBrokerAdmin',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await userService.getAllUser(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await userService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUserById = catchAsync(async (req, res) => {
  const file = req.file;
  const userId = req.user.id;
  // console.log(file);
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await userService.updateUserById(
    userId,
    req.params.id,
    fromData,
    file,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUserById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.deleteUserById(userId, req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const profile = catchAsync(async (req, res) => {
  const result = await userService.profile(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const requestAdmin = catchAsync(async (req, res) => {
  const result = await userService.requestAdmin(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin request sent successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const result = await userService.updateAdmin(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin request updated successfully',
    data: result,
  });
});
const allRequestAdmin = catchAsync(async (req, res) => {
  const fileters = pick(req.query, ['searchTerm', 'role', 'name', 'email']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await userService.allRequestAdmin(fileters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin request fetched successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const result = await userService.deleteAdmin(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin request deleted successfully',
    data: result,
  });
});

const updateAccessRoutes = catchAsync(async (req, res) => {
  const { accessRoutes } = req.body;
  const result = await userService.updateAccessRoutes(
    req.params.id,
    accessRoutes,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access routes updated successfully',
    data: result,
  });
});

const approvedLandlordBrokerAdmin = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.approvedLandlordBrokerAdmin(
    userId,
    req.params.id,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User approved successfully',
    data: result,
  });
});

const rejectedLandlordBrokerAdmin = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.rejectedLandlordBrokerAdmin(
    userId,
    req.params.id,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User rejected successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const file = req.file;
  const userId = req.user.id;
  // console.log(file);
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await userService.updateProfile(userId, fromData, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

// const grantMessagingPermission = catchAsync(async (req, res) => {
//   const { userId, targetUserId } = req.body;

//   await User.findByIdAndUpdate(userId, {
//     $addToSet: { messagingPermissions: targetUserId },
//   });

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Messaging permission granted',
//   });
// });

export const userController = {
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  profile,
  requestAdmin,
  updateAdmin,
  allRequestAdmin,
  deleteAdmin,
  updateAccessRoutes,
  approvedLandlordBrokerAdmin,
  rejectedLandlordBrokerAdmin,
  updateProfile,
  // grantMessagingPermission,
};
