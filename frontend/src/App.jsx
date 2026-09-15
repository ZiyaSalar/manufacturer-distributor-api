import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterProduct from './pages/RegisterProduct';
import CreateShipment from './pages/CreateShipment';
import CheckInventory from './pages/CheckInventory';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<RegisterProduct />} />
          <Route path="/shipments" element={<CreateShipment />} />
          <Route path="/inventory" element={<CheckInventory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;