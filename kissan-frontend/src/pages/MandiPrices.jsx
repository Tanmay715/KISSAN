import { useEffect, useState } from 'react';
import { api } from '../api/client';

function MandiPrices() {
  const [prices, setPrices] = useState([]);
  const [crop, setCrop] = useState('');
  const [state, setState] = useState('');
  const [is_loading, setIsLoading] = useState(true);

  const loadPrices = () => {
    setIsLoading(true);
    const params = { limit: 50 };
    if (crop) params.crop = crop;
    if (state) params.state = state;

    api.getMandiPrices(params)
      .then(setPrices)
      .catch(() => setPrices([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadPrices();
  };

  return (
    <div className="container page">
      <h1 className="page-title">Live Mandi Prices</h1>
      <p className="page-subtitle">
        Real-time wholesale prices from Indian mandis (Agmarknet / data.gov.in)
      </p>

      <form className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }} onSubmit={handleSearch}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Crop / Commodity</label>
            <input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g. Wheat, Tomato, Rice" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>State</label>
            <input value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Kerala, Punjab" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'end' }}>Search</button>
        </div>
      </form>

      {is_loading ? (
        <div className="loading">Fetching mandi prices...</div>
      ) : prices.length === 0 ? (
        <div className="empty-state card"><h3>No prices found</h3><p>Try different search terms</p></div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--green-50)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Commodity</th>
                <th style={{ padding: '1rem' }}>Market</th>
                <th style={{ padding: '1rem' }}>State</th>
                <th style={{ padding: '1rem' }}>Min (₹/q)</th>
                <th style={{ padding: '1rem' }}>Max (₹/q)</th>
                <th style={{ padding: '1rem' }}>Modal (₹/q)</th>
                <th style={{ padding: '1rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, index) => (
                <tr key={index} style={{ borderTop: '1px solid var(--gray-200)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{item.commodity}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>{item.market}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>{item.state}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>{item.min_price?.toLocaleString()}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>{item.max_price?.toLocaleString()}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--green-700)', fontWeight: 600 }}>
                    {item.modal_price?.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--gray-500)' }}>{item.arrival_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
        Prices are in ₹ per quintal (100 kg). Data sourced from Agmarknet via public API.
      </p>
    </div>
  );
}

export default MandiPrices;
