import Property from '../models/Property.js';
import Lead from '../models/Lead.js';

class MatchingService {
  /**
   * Matches properties for a specific lead based on their preferences
   */
  async getMatchesForLead(leadId) {
    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error('Lead not found');

    const { budget, preferences } = lead;
    
    // Search criteria
    const query = {
      status: 'AVAILABLE',
      price: { $lte: budget * 1.1 } // Show properties up to 10% over budget
    };

    if (preferences?.propertyType) {
        query.type = preferences.propertyType;
    }

    // Advanced: Location fuzzy matching (if location is provided in preferences)
    if (preferences?.location) {
        query.location = { $regex: preferences.location, $options: 'i' };
    }

    const properties = await Property.find(query).limit(10).sort({ price: 1 });
    
    // Calculate a "Match Score" for each property
    return properties.map(p => {
        let score = 0;
        
        // 1. Price match (max 50 points)
        if (p.price <= budget) score += 50;
        else score += 30; // Slightly over budget but still relevant

        // 2. Type match (30 points)
        if (p.type === preferences?.propertyType) score += 30;

        // 3. Asset features match (20 points)
        if (preferences?.minSize && p.size >= preferences.minSize) score += 10;
        if (preferences?.bedrooms && p.bedrooms >= preferences.bedrooms) score += 10;

        return {
            ...p.toObject(),
            matchScore: score
        };
    }).sort((a, b) => b.matchScore - a.score);
  }

  /**
   * Matches leads for a specific property (Reverse Matching)
   */
  async getLeadsForProperty(propertyId) {
    const property = await Property.findById(propertyId);
    if (!property) throw new Error('Property not found');

    const query = {
        budget: { $gte: property.price * 0.9 }, // Leads with budget within 90% of price
        'preferences.propertyType': property.type
    };

    return await Lead.find(query).limit(10).sort({ budget: -1 });
  }
}

export default new MatchingService();
