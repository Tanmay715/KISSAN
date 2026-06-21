const axios = require('axios');

class MandiService {
  constructor() {
    this.base_url = process.env.MANDI_API_BASE_URL
      || 'https://mandi-api-production.up.railway.app';
    this.client = axios.create({
      baseURL: this.base_url,
      timeout: 15000,
    });
  }

  async getAllPrices() {
    const response = await this.client.get('/api/mandi/prices');
    return response.data;
  }

  async getPricesByState(state) {
    const response = await this.client.get(`/api/mandi/prices/state/${encodeURIComponent(state)}`);
    return response.data;
  }

  async getPricesByCrop(crop) {
    const response = await this.client.get(`/api/mandi/prices/crop/${encodeURIComponent(crop)}`);
    return response.data;
  }

  async searchPrices({ crop, state, limit = 50 }) {
    let prices = await this.getAllPrices();

    if (!Array.isArray(prices)) {
      return [];
    }

    if (state) {
      const state_lower = state.toLowerCase();
      prices = prices.filter((item) => item.state?.toLowerCase().includes(state_lower));
    }

    if (crop) {
      const crop_lower = crop.toLowerCase();
      prices = prices.filter((item) => item.commodity?.toLowerCase().includes(crop_lower));
    }

    return prices.slice(0, limit);
  }
}

module.exports = MandiService;
