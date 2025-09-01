import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from "./pages/CollectionPage";
import OrdersDetailPage from './pages/OrdersDetailPage'; // ✅ Correct import
import MyOrdersPage from './pages/MyOrdersPage'; // ✅ Ensure this is imported if not already
import ProductDetails from './components/Products/ProductDetails';

import { Toaster } from "sonner";
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLayout from './components/Admin/AdminLayout'; // ✅ Add this import or adjust to the correct path
import AdminHomePage from './pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';
import CreateProduct from './components/Admin/CreateProduct';

import {Provider} from "react-redux";
import store from "./redux/store";
import ProtectedRoute from './components/Common/ProtectedRoute';


const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
  <Route path="/" element={<UserLayout />} >
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="profile" element={<Profile />} />
    <Route path="collections/:collection" element={<CollectionPage />} />
    <Route path="product/:id" element={<ProductDetails />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="order-confirmation" element={<OrderConfirmationPage />} />
    <Route path="order/:id" element={<OrdersDetailPage />} /> 
    <Route path="my-orders" element={<MyOrdersPage />} />
  </Route>

  {/* ✅ NESTED admin route */}
  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
    <Route index element={<AdminHomePage />} />
    <Route path="users" element= {<UserManagement />} />
    <Route path="products" element= {<ProductManagement />} />
    <Route path="products/create" element={<CreateProduct />} />
    <Route path="products/:id/edit" element= {<EditProductPage />} />
    <Route path="orders" element= {<OrderManagement />} />
  </Route>
</Routes>

    </BrowserRouter>
    </Provider>
  );
};

export default App;
