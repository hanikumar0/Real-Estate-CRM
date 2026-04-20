import Client from '../models/Client.js';

class ClientService {
  async createClient(data) {
    const existing = await Client.findOne({ 
      $or: [{ email: data.email }, { phone: data.phone }] 
    });
    if (existing) throw new Error('Client with this email/phone already exists');
    
    const client = await Client.create(data);

    // Notify n8n
    if (process.env.N8N_WEBHOOK_URL) {
      this._notifyN8n('CLIENT_CREATED', client);
    }

    return client;
  }

  async getAllClients(filters, user) {
    const query = {};
    
    // RBAC: Agents see their own leads' clients? Or assigned clients?
    // We'll follow the pattern: Agents see clients linked to their assigned leads or assigned directly
    if (user.role === 'AGENT') {
      // Complex query: either they are the linked lead's agent or we add an assignedAgent field to Client later
      // For now, assume global visibility for managers/admins and filter for agents if linkedLead is present
    }

    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    
    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { email: new RegExp(filters.search, 'i') },
        { phone: new RegExp(filters.search, 'i') }
      ];
    }

    const limit = Number(filters.limit) || 20;
    const skip = (Number(filters.page) - 1 || 0) * limit;

    return await Client.find(query)
      .populate('linkedLead', 'name status')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async addInteraction(id, interactionData, user) {
    const client = await Client.findByIdAndUpdate(
      id,
      { 
        $push: { 
          interactions: { 
            ...interactionData, 
            createdBy: user.userId 
          } 
        } 
      },
      { new: true }
    );

    // Notify n8n
    if (process.env.N8N_WEBHOOK_URL) {
      this._notifyN8n('CLIENT_INTERACTION_LOGGED', {
        clientId: id,
        interaction: interactionData,
        updatedBy: user.userId
      });
    }

    return client;
  }

  async linkProperty(id, propertyId) {
    return await Client.findByIdAndUpdate(
      id,
      { $addToSet: { interestedProperties: propertyId } },
      { new: true }
    );
  }

  // Helper for n8n automation
  async _notifyN8n(event, payload) {
    try {
      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Webhook-Secret': process.env.WEBHOOK_SECRET || ''
        },
        body: JSON.stringify({
          source: 'ESTATEFLOW_CRM',
          event,
          timestamp: new Date().toISOString(),
          payload
        })
      });
    } catch (err) {
      console.warn(`[Automation] n8n notification failed for ${event}:`, err.message);
    }
  }
}

export default new ClientService();
