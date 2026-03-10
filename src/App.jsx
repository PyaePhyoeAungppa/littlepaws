import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import FloatingCart from './components/cart/FloatingCart';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Checkout from './pages/Checkout';
import ServiceDetails from './pages/ServiceDetails';
import Discover from './pages/Discover';
import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';
import ProductDetails from './pages/ProductDetails';
import MerchantLogin from './pages/merchant/Login';
import MerchantDashboard from './pages/merchant/Dashboard';
import UserLogin from './pages/user/Login';
import UserProfile from './pages/user/Profile';
import UserWishlist from './pages/user/Wishlist';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/service/:id" element={<ServiceDetails />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/pets" element={<Pets />} />
                        <Route path="/pets/:id" element={<PetDetails />} />

                        <Route path="/user/login" element={<UserLogin />} />
                        <Route path="/user/profile" element={<UserProfile />} />
                        <Route path="/user/wishlist" element={<UserWishlist />} />

                        <Route path="/merchant/login" element={<MerchantLogin />} />
                        <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
                    </Routes>
                </main>
                <Footer />
                <BottomNav />
                <FloatingCart />
            </div>
        </BrowserRouter>
    );
}

export default App;
