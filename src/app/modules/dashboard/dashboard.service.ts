import Apartment from '../apartment/apartment.model';
import { Payment } from '../payment/payment.model';
import Service from '../service/service.model';
import Tenant from '../tenant/tenant.model';
import User from '../user/user.model';

const dashboardViewCount = async () => {
  const [apartment, service, user, booking] = await Promise.all([
    Apartment.countDocuments(),
    Service.countDocuments(),
    User.countDocuments(),
    Tenant.countDocuments(),
  ]);

  const totalEarningResult = await Payment.aggregate([
    {
      $match: { status: 'approved' },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const totalEarning = totalEarningResult[0]?.total || 0;

  return { apartment, service, counstomer: user, booking, totalEarning };
};

const getMonthlyEarnings = async (year: number) => {
  const earnings = await Payment.aggregate([
    {
      $match: {
        status: 'approved',
        paymentDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$paymentDate' },
        totalEarnings: { $sum: '$amount' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // convert month number to name and fill missing months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthlyData = months.map((month, index) => {
    const found = earnings.find((e) => e._id === index + 1);
    return {
      month,
      totalEarnings: found ? found.totalEarnings : 0,
    };
  });

  return monthlyData;
};

export const dashboardService = {
  dashboardViewCount,
  getMonthlyEarnings,
};
