const axios = require('axios');

const VEHICLE_SERVICE_URL = process.env.VEHICLE_SERVICE_URL || 'http://localhost:5003/api';

/**
 * Get vehicle recommendations based on budget and type
 * @param {Object} options - { budget, vehicleType, raw }
 * @returns {Promise<Array>} Array of recommended vehicles
 */
async function recommend(options = {}) {
  try {
    const { budget = null, vehicleType = null, raw = '' } = options;

    // Build query params
    const params = new URLSearchParams();
    if (budget) params.append('maxPrice', budget);
    if (vehicleType) params.append('bodyType', vehicleType);

    // If neither budget nor type, try to extract from raw message
    if (!budget && !vehicleType && raw) {
      // Use natural language extraction
      const budgetMatch = raw.match(/(\d+)\s*(?:million|m|lakh|लाख)/i);
      if (budgetMatch) {
        params.append('maxPrice', parseInt(budgetMatch[1]) * 1000000);
      }
    }

    const response = await axios.get(`${VEHICLE_SERVICE_URL}/vehicles?${params.toString()}`);
    
    // Return top 5 recommendations sorted by trust score
    const vehicles = response.data.data || response.data || [];
    return vehicles
      .sort((a, b) => {
        const scoreA = a.trustEvaluation?.score || a.trust?.score || 0;
        const scoreB = b.trustEvaluation?.score || b.trust?.score || 0;
        return scoreB - scoreA;
      })
      .slice(0, 5)
      .map(v => ({
        id: v._id,
        title: `${v.year} ${v.make} ${v.model}`,
        price: v.price,
        mileage: v.mileage,
        image: v.images?.[0] || null,
        trustScore: v.trustEvaluation?.score || v.trust?.score || 0,
        trustGrade: v.trustEvaluation?.grade || v.trust?.grade || 'N/A'
      }));
  } catch (error) {
    console.error('Recommendation service error:', error.message);
    return []; // Return empty array on error
  }
}

module.exports = { recommend };
