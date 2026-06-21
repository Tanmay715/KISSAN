import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import Orders from './pages/Orders';
import MandiPrices from './pages/MandiPrices';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/mandi-prices" element={<MandiPrices />} />
        </Routes>
      </main>
      <footer style={{ background: 'var(--green-900)', color: 'white', padding: '2rem 0', marginTop: '3rem', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>🌾 KISSAN</p>
          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Empowering farmers. Connecting communities.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
