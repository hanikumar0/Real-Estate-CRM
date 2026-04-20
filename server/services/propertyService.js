import Property from '../models/Property.js';

class PropertyService {
  async createProperty(data, user) {
    return await Property.create({
      ...data,
      agentId: user.userId
    });
  }

  async getAllProperties(filters, user) {
    const query = {};
    
    // RBAC: Agents see their own, Admin/Manager see all
    if (user.role === 'AGENT') {
      query.agentId = user.userId;
    }

    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const limit = Number(filters.limit) || 12;
    const skip = (Number(filters.page) - 1 || 0) * limit;

    return await Property.find(query)
      .populate('agentId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async updateProperty(id, data, user) {
    const property = await Property.findById(id);
    if (!property) throw new Error('Property not found');

    if (user.role === 'AGENT' && property.agentId.toString() !== user.userId) {
      throw new Error('Unauthorized');
    }

    return await Property.findByIdAndUpdate(id, data, { new: true });
  }

  async linkLead(id, leadId) {
    return await Property.findByIdAndUpdate(
      id,
      { $addToSet: { linkedLeads: leadId } },
      { new: true }
    );
  }
}

export default new PropertyService();
