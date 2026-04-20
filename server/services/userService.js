import User from '../models/User.js';

class UserService {
  async createUser(data) {
    return await User.create(data);
  }

  async getAllUsers(filters) {
    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;
    
    return await User.find(query).select('-password').sort({ createdAt: -1 });
  }

  async updateUser(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  async getPerformanceAnalytics() {
    return await User.aggregate([
      { $match: { role: 'AGENT', status: 'ACTIVE' } },
      { 
        $project: { 
          name: 1, 
          email: 1, 
          performance: 1,
          conversionRate: {
            $cond: [
              { $gt: ["$performance.leadsAssigned", 0] },
              { $multiply: [{ $divide: ["$performance.leadsConverted", "$performance.leadsAssigned"] }, 100] },
              0
            ]
          }
        } 
      },
      { $sort: { "performance.totalRevenue": -1 } }
    ]);
  }

  async getWorkloadOverview() {
    return await User.aggregate([
      { $match: { role: 'AGENT' } },
      { $group: { _id: "$agentProfile.region", totalLeads: { $sum: "$workload.activeLeads" }, agentCount: { $sum: 1 } } }
    ]);
  }
}

export default new UserService();
