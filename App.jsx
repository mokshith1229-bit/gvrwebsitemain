
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import AccountModal from './components/AccountModal';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentPage from './components/PaymentPage';
import ProfilePage from './components/ProfilePage';
import ContactPage from './components/ContactPage';
import ShippingPolicy from './components/ShippingPolicy';
import TermsConditions from './components/TermsConditions';
import RefundPolicy from './components/RefundPolicy';
import PrivacyPolicy from './components/PrivacyPolicy';


// Redux: product actions & selectors
import { fetchProducts, selectProductsLoading, selectProductsError, selectFilteredProducts } from './store/slices/productSlice';

// Redux: cart actions & selectors
import { addToCart, removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartCount } from './store/slices/cartSlice';

// Redux: user actions & selectors
import {
    loginUser, logoutUser, updateUserProfile,
    addUserAddress, updateUserAddress, deleteUserAddress, fetchUserAddresses,
    saveAddress, updateProfile, deleteAddress, selectUser
} from './store/slices/userSlice';

// Redux: order actions & selectors
import {
    fetchUserOrders, setPendingOrder, clearPendingOrder, prependOrder,
    selectUserOrders, selectOrdersLoading, selectOrdersError, selectPendingOrder
} from './store/slices/orderSlice';

// Central API config — change BASE_URL in api.js to switch environments
import { ORDERS_URL } from './api';

const App = () => {
    const dispatch = useDispatch();

    // ── UI-only state (not global, kept as local useState) ──────
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [view, setView] = useState('home');
    const [profileTab, setProfileTab] = useState('orders');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [viewPolicy, setViewPolicy] = useState(null); // 'shipping', 'refund', 'terms', 'privacy', 'contact'

    const [orderSuccessMsg, setOrderSuccessMsg] = useState(''); // success toast after order

    // ── Redux Selectors ─────────────────────────────────────────
    // Read global state from the Redux store
    const productsLoading = useSelector(selectProductsLoading);
    const productsError = useSelector(selectProductsError);
    const filteredProducts = useSelector(selectFilteredProducts(activeCategory, searchQuery));
    const cart = useSelector(selectCartItems);
    const cartCount = useSelector(selectCartCount);
    const user = useSelector(selectUser);
    const userOrders = useSelector(selectUserOrders);
    const ordersLoading = useSelector(selectOrdersLoading);
    const ordersError = useSelector(selectOrdersError);
    const pendingOrder = useSelector(selectPendingOrder);

    // Derive selectedProduct from Redux store
    const allProducts = useSelector((state) => state.products.items);
    const selectedProduct = allProducts.find(
        (p) => p.id === selectedProductId || p._id === selectedProductId
    );

    // ── Fetch Products on Mount ─────────────────────────────────
    useEffect(() => {
        // Dispatch the async thunk to load products from the backend
        dispatch(fetchProducts());

        // Note: Login persistence is handled automatically in userSlice.js
        // via localStorage initialization in the initialState.
    }, [dispatch]);

    // ── Fetch User Orders when Profile is Viewed ────────────────
    useEffect(() => {
        if (user && view === 'profile') {
            dispatch(fetchUserOrders(user));
        }
    }, [user, view, dispatch]);

    // ── Fetch User Addresses on Login ───────────────────────────
    useEffect(() => {
        if (user?._id) {
            dispatch(fetchUserAddresses(user._id));
        }
    }, [user?._id, dispatch]);

    // ── Cart Handlers ───────────────────────────────────────────
    const handleAddToCart = (product, quantity = 1) => {
        dispatch(addToCart({ product, quantity }));
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (id, weight) => {
        dispatch(removeFromCart({ id, weight }));
    };

    const handleUpdateQuantity = (id, weight, delta) => {
        dispatch(updateQuantity({ id, weight, delta }));
    };

    // ── View Navigation Handlers ────────────────────────────────
    const handleViewDetails = (id) => {
        setSelectedProductId(id);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const handleNavigate = (newView) => {
        setView(newView);
        setSelectedProductId(null);
        setViewPolicy(null);
        if (newView === 'profile') {
            setProfileTab('orders');
        }
        window.scrollTo(0, 0);
    };

    const handlePolicyClick = (policyName) => {
        setView('policy');
        setViewPolicy(policyName);
        window.scrollTo(0, 0);
    };

    const handleProceedToCheckout = () => {
        setIsCartOpen(false);
        setView('checkout');
        window.scrollTo(0, 0);
    };

    const handleBuyNow = (product, quantity) => {
        // Clear old items first for a clean "Buy Now" experience
        dispatch(clearCart());
        dispatch(addToCart({ product, quantity }));
        setIsCartOpen(true);
    };

    // ── Order Handlers ──────────────────────────────────────────
    const handleCheckoutSuccess = (orderData, isOnlinePayment) => {
        const msg = isOnlinePayment
            ? '🎉 Payment successful! Your order has been placed.'
            : '✅ Order placed successfully! Thank you for shopping with GVR Cashew.';

        // Optimistically add the order so it shows up instantly
        dispatch(prependOrder(orderData));
        dispatch(clearCart());

        // Show toast
        setOrderSuccessMsg(msg);
        setTimeout(() => setOrderSuccessMsg(''), 5000);

        // Redirect to My Orders
        setProfileTab('orders');
        setView('profile');
        window.scrollTo(0, 0);

        // Immediately fetch from backend to get the real server-confirmed order
        // (includes _id, server timestamps, etc.)
        if (user) dispatch(fetchUserOrders(user));
    };

    const handlePaymentComplete = async () => {
        if (!pendingOrder) return;

        try {
            const finalOrder = {
                ...pendingOrder,
                status: 'Paid',
                paymentMethod: 'online',
                customerEmail: user?.email,
            };

            const response = await fetch(ORDERS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalOrder),
            });

            if (response.ok) {
                dispatch(prependOrder(finalOrder));
                dispatch(clearCart());
                dispatch(clearPendingOrder());
                setOrderSuccessMsg('🎉 Payment successful! Your order has been placed.');
                setTimeout(() => setOrderSuccessMsg(''), 5000);
                setProfileTab('orders');
                setView('profile');
                window.scrollTo(0, 0);
                if (user) dispatch(fetchUserOrders(user));
            } else {
                alert("Failed to save order. Please contact support.");
            }
        } catch (error) {
            console.error("Error saving online order:", error);
            alert("Network error. Please make sure the backend is running.");
        }
    };

    // ── User Handlers ───────────────────────────────────────────
    const handleLogin = (userData) => {
        dispatch(loginUser(userData));
        setIsAccountOpen(false);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        setView('home');
    };

    const handleAccountClick = () => {
        if (user) {
            setView('profile');
            setProfileTab('orders');
            window.scrollTo(0, 0);
        } else {
            setIsAccountOpen(true);
        }
    };

    const handleOpenAddresses = () => {
        setView('profile');
        setProfileTab('addresses');
        window.scrollTo(0, 0);
    };

    const handleSaveAddress = (address, editIndex = -1) => {
        if (user?._id) {
            if (editIndex > -1) {
                const addressId = user.addresses[editIndex]._id || user.addresses[editIndex].id;
                dispatch(updateUserAddress({ userId: user._id, addressId, address }));
            } else {
                dispatch(addUserAddress({ userId: user._id, address }));
            }
        } else {
            // Fallback for mock users/unsaved states
            dispatch(saveAddress(address));
        }
    };

    const handleDeleteAddress = (index) => {
        if (user?._id) {
            const addressId = user.addresses[index]._id || user.addresses[index].id;
            dispatch(deleteUserAddress({ userId: user._id, addressId }));
        } else {
            dispatch(deleteAddress(index));
        }
    };

    const handleUpdateProfile = (updatedData) => {
        if (user?._id) {
            dispatch(updateUserProfile({ userId: user._id, updatedData }));
        } else {
            // Fallback for mock users/unsaved states
            dispatch(updateProfile(updatedData));
        }
    };

    // ── Render ──────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Navbar
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                onAccountClick={handleAccountClick}
                onNavigate={handleNavigate}
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
            />

            <main className="flex-1">
                {/* ── Order Success Toast ────────────────────────────── */}
                {orderSuccessMsg && (
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 bg-white border border-green-200 shadow-2xl shadow-green-900/10 rounded-2xl px-6 py-4 max-w-sm">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-stone-900">{orderSuccessMsg}</p>
                            <button
                                onClick={() => setOrderSuccessMsg('')}
                                className="ml-auto text-stone-400 hover:text-stone-600"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                {view === 'home' && (
                    <>
                        {/* Hero Section */}
                        <section className="relative h-[80vh] overflow-hidden">
                            <div className="absolute inset-0">
                                <img
                                    src="/hero.png"
                                    className="w-full h-full object-cover"
                                    alt="Premium Cashews Selection"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent" />
                            </div>

                            <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
                                <div className="max-w-2xl animate-in slide-in-from-left duration-1000">
                                    <span className="bg-amber-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block">
                                        Direct from the Farms
                                    </span>
                                    <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-[1.1]">
                                        Premium. Fresh. <br />
                                        <span className="text-amber-500">Authentic.</span>
                                    </h1>
                                    <p className="text-lg text-stone-200 mb-8 max-w-lg leading-relaxed">
                                        GVR Cashew Merchants - Bringing you the finest dry fruits and spices since 1981. Experience 40+ years of quality and trust.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => handleNavigate('shop')}
                                            className="bg-amber-700 hover:bg-amber-800 text-white px-10 py-5 rounded-xl font-bold transition-all shadow-xl shadow-amber-900/20 uppercase tracking-widest text-sm"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Redesigned Featured Section */}
                        <section className="relative py-24 bg-[#FDFAF4] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/marble_bg.png')" }}>
                            <div className="absolute inset-0 bg-white/70"></div> {/* Soft overlay to ensure readability */}
                            <div className="relative max-w-7xl mx-auto px-4 z-10">
                                {/* 1. Brand Introduction Area */}
                                <div className="text-center mb-20 relative">
                                    <div className="flex items-center justify-center gap-6 mb-6">
                                        <div className="h-px bg-amber-700/30 w-16 md:w-32"></div>
                                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">GVR Cashew Merchants</h2>
                                        <div className="h-px bg-amber-700/30 w-16 md:w-32"></div>
                                    </div>
                                    <p className="text-stone-600 max-w-3xl mx-auto text-lg leading-relaxed font-medium">
                                        Since 1981, we've built a legacy of trust, offering the finest selection of dry fruits, nuts, seeds, dates, and spices to Visakhapatnam and beyond.
                                    </p>
                                </div>

                                {/* 2. Feature Cards Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 mb-28 group/cards">
                                    {/* Card 1 */}
                                    <div className="relative pt-6 px-10 pb-12 rounded-[2rem] bg-gradient-to-b from-[#FEFCF8] to-white border border-[#cfaa6b]/50 shadow-xl shadow-[#cfaa6b]/10 hover:-translate-y-2 transition-all duration-300 text-center ring-2 ring-[#cfaa6b]/20 hover:ring-[#cfaa6b]/50">
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#997a3c] to-[#b38d46] text-white text-xs font-bold tracking-[0.2em] px-8 py-2.5 rounded-full uppercase shadow-lg shadow-[#b38d46]/30 w-max border border-[#cfaa6b]/40">
                                            — 100% ORGANIC —
                                        </div>
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#d9a036] to-[#b3832c] text-white rounded-[1.25rem] flex items-center justify-center mx-auto mt-8 mb-6 shadow-md shadow-[#b3832c]/30">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <h3 className="font-extrabold text-[#1c1917] text-2xl mb-3 font-serif">100% Organic</h3>
                                        <p className="text-[#57534e] text-sm leading-relaxed px-2">No artificial preservatives or processing agents. Just nature's goodness.</p>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="relative pt-6 px-10 pb-12 rounded-[2rem] bg-gradient-to-b from-[#FEFCF8] to-white border border-[#cfaa6b]/50 shadow-xl shadow-[#cfaa6b]/10 hover:-translate-y-2 transition-all duration-300 text-center">
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#de9d28] to-[#c78b1e] text-white text-xs font-bold tracking-[0.2em] px-8 py-2.5 rounded-full uppercase shadow-lg shadow-[#c78b1e]/30 w-max border border-[#ebb754]/40">
                                            — FRESH & CRUNCHY —
                                        </div>
                                        <div className="w-16 h-16 bg-[#F8F3E9] text-[#a17015] rounded-[1.25rem] flex items-center justify-center mx-auto mt-8 mb-6 border border-[#e8dcc5] shadow-inner shadow-[#e8dcc5]/50">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <h3 className="font-bold text-[#1c1917] text-2xl mb-3 font-serif">Fresh Harvest</h3>
                                        <p className="text-[#57534e] text-sm leading-relaxed px-2">Directly shipped within 48 hours of vacuum sealing for maximum crunch.</p>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="relative pt-6 px-10 pb-12 rounded-[2rem] bg-gradient-to-b from-[#FEFCF8] to-white border border-[#cfaa6b]/50 shadow-xl shadow-[#cfaa6b]/10 hover:-translate-y-2 transition-all duration-300 text-center sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none w-full">
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#87996c] to-[#76875d] text-white text-xs font-bold tracking-[0.2em] px-8 py-2.5 rounded-full uppercase shadow-lg shadow-[#76875d]/30 w-max border border-[#a2b487]/40">
                                            — WORLDWIDE DELIVERY —
                                        </div>
                                        <div className="w-16 h-16 bg-[#F8F3E9] text-[#a17015] rounded-[1.25rem] flex items-center justify-center mx-auto mt-8 mb-6 border border-[#e8dcc5] shadow-inner shadow-[#e8dcc5]/50">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        </div>
                                        <h3 className="font-bold text-[#1c1917] text-2xl mb-3 font-serif">Global Export</h3>
                                        <p className="text-[#57534e] text-sm leading-relaxed px-2">Preferred premium supplier for retailers across multiple countries.</p>
                                    </div>
                                </div>

                                {/* 3. Promotional Banner Section */}
                                <div className="bg-[#FAF7EF] rounded-[2.5rem] border border-stone-200/80 shadow-2xl shadow-[#b58c42]/10 overflow-hidden flex flex-col md:flex-row items-stretch relative z-20 group max-w-6xl mx-auto">
                                    <div className="w-full md:w-5/12 relative overflow-hidden h-72 md:h-auto min-h-[320px]">
                                        {/* Image wrapper to ensure no clipping issues with rounded corners */}
                                        <div className="absolute inset-0">
                                            <img src="/promo_bowl.png" alt="Mixed Dry Fruits Bowl" className="w-full h-full object-cover rounded-t-[2.5rem] md:rounded-r-none md:rounded-l-[2.5rem] transition-transform duration-1000 group-hover:scale-105" />
                                        </div>
                                        {/* Seamless fade overlay to blend the image gently into the right side bg */}
                                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#FAF7EF] hidden md:block"></div>
                                    </div>

                                    <div className="w-full md:w-7/12 p-10 md:p-14 lg:p-16 flex flex-col justify-center items-start text-left relative z-10 bg-[#FAF7EF] rounded-b-[2.5rem] md:rounded-l-none md:rounded-r-[2.5rem]">
                                        <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-stone-900 mb-6 leading-[1.2]">
                                            Premium Quality, <br className="hidden lg:block" /> Direct from Farmers
                                        </h2>
                                        <p className="text-stone-600 text-lg mb-10 max-w-md leading-relaxed">
                                            Experience the purest dry fruits and nuts, sourced directly from the best farms and delivered straight to your door.
                                        </p>
                                        <button
                                            onClick={() => handleNavigate('shop')}
                                            className="bg-gradient-to-b from-[#bd8e37] to-[#aa7d2a] hover:from-[#c8983f] hover:to-[#b78931] text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-[#aa7d2a]/30 transition-all hover:-translate-y-1 transform scale-100 hover:scale-105 tracking-wider text-sm"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {view === 'shop' && (
                    <div className="animate-in fade-in duration-500">
                        {/* Page Header */}
                        <div className="bg-stone-900 text-white py-16">
                            <div className="max-w-7xl mx-auto px-4">
                                <h1 className="text-4xl font-serif font-bold mb-4">Shop Premium Cashews</h1>
                                <p className="text-stone-400">Discover our full range of grades and flavors.</p>
                            </div>
                        </div>

                        {/* Categories Bar */}
                        <div className="bg-white border-b border-stone-200 sticky top-20 z-40">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="flex space-x-8 overflow-x-auto py-6 no-scrollbar">
                                    {['All', 'Dry Fruits & Nuts', 'Seeds', 'Dates', 'Spices'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`text-sm font-bold whitespace-nowrap transition-colors uppercase tracking-widest ${activeCategory === cat ? 'text-amber-800 border-b-2 border-amber-800 pb-2' : 'text-stone-400 hover:text-stone-600'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <section className="max-w-7xl mx-auto px-4 py-16">

                            {/* Loading State */}
                            {productsLoading && (
                                <div className="text-center py-20">
                                    <div className="inline-block w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-stone-500 text-sm">Loading products...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {!productsLoading && productsError && (
                                <div className="text-center py-20">
                                    <p className="text-red-500 font-medium">{productsError}</p>
                                </div>
                            )}

                            {/* No Products State */}
                            {!productsLoading && !productsError && filteredProducts.length === 0 && (
                                <div className="text-center py-20">
                                    <span className="text-6xl block mb-4">🥜</span>
                                    <p className="text-stone-500 text-lg font-medium">No products available</p>
                                    <p className="text-stone-400 text-sm mt-2">Check back soon or try a different category.</p>
                                </div>
                            )}

                            {/* Product Cards from Backend */}
                            {!productsLoading && !productsError && filteredProducts.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredProducts.map((product, index) => (
                                        <ProductCard
                                            key={product.id || product._id || index}
                                            product={product}
                                            onAddToCart={(p) => handleAddToCart(p, 1)}
                                            onViewDetails={handleViewDetails}
                                        />
                                    ))}
                                </div>
                            )}

                        </section>
                    </div>
                )}

                {view === 'about' && (
                    <section className="animate-in slide-in-from-bottom-4 duration-700 py-24 bg-stone-900 text-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-4xl font-serif font-bold mb-8 leading-tight">
                                        Heritage of <br /><span className="text-amber-500">Quality & Trust</span>
                                    </h2>
                                    <p className="text-stone-400 mb-8 leading-relaxed">
                                        Established in Visakhapatnam, <strong>GVR Cashew Merchants</strong> has been a cornerstone of quality in the dry fruits and spices industry for over four decades. Our journey began with a simple promise: to provide the freshest and highest quality products to our customers.
                                    </p>
                                    <p className="text-stone-400 mb-8 leading-relaxed">
                                        We take pride in our direct sourcing methods, ensuring that every cashew, date, and spice that reaches your table is of premium grade. Our offline store at Suryabagh has served generations of families, and now we bring that same commitment to our online store.
                                    </p>
                                    <div className="space-y-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-700/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">Double Graded</h4>
                                                <p className="text-stone-400 text-sm">Every single nut is visually inspected twice to ensure zero blemishes and maximum size consistency.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-700/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9-9H3m9 9L3 5m0 0l4 8" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">Sustainably Sourced</h4>
                                                <p className="text-stone-400 text-sm">We work directly with farmers to ensure fair trade practices and the freshest possible harvest.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <img src="/about/heritage.png" className="rounded-3xl h-64 w-full object-cover" alt="GVR Heritage Store" />
                                    <img src="/products/cashew-w180.png" className="rounded-3xl h-64 w-full object-cover translate-y-8" alt="Premium Quality Cashews" />
                                </div>
                            </div>
                        </div>
                    </section>
                )}



                {view === 'policy' && (
                    <>
                        {viewPolicy === 'shipping' && <ShippingPolicy />}
                        {viewPolicy === 'refund' && <RefundPolicy />}
                        {viewPolicy === 'terms' && <TermsConditions />}
                        {viewPolicy === 'privacy' && <PrivacyPolicy />}
                        {viewPolicy === 'contact' && <ContactPage />}
                    </>
                )}


                {view === 'detail' && selectedProduct && (
                    <ProductDetailPage
                        product={selectedProduct}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onBack={() => setView('shop')}
                    />
                )}

                {view === 'checkout' && (
                    <CheckoutPage
                        items={cart}
                        user={user}
                        onOpenLogin={() => setIsAccountOpen(true)}
                        onBack={() => setView('shop')}
                        onSuccess={handleCheckoutSuccess}
                        onSaveAddress={handleSaveAddress}
                        onOpenAddresses={handleOpenAddresses}
                    />
                )}

                {view === 'payment' && pendingOrder && (
                    <PaymentPage
                        amount={pendingOrder.totalAmount}
                        onPaymentComplete={handlePaymentComplete}
                        onBack={() => setView('checkout')}
                    />
                )}

                {view === 'profile' && user && (
                    <ProfilePage
                        user={user}
                        orders={userOrders}
                        ordersLoading={ordersLoading}
                        ordersError={ordersError}
                        onLogout={handleLogout}
                        onSaveAddress={handleSaveAddress}
                        onDeleteAddress={handleDeleteAddress}
                        onUpdateProfile={handleUpdateProfile}
                        initialTab={profileTab}
                        onRefreshOrders={() => dispatch(fetchUserOrders(user))}
                    />
                )}
            </main>

            <footer className="bg-stone-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <img src="/logo.jpg" alt="GVR Cashew Merchants" className="h-14 w-auto object-contain" />
                        </div>
                        <p className="text-stone-400 max-w-sm leading-relaxed text-sm">
                            Quality since 1981. Bringing you the finest dry fruits, nuts, seeds, and spices. From our family to yours.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-500 uppercase tracking-widest text-xs mb-6">Company</h4>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li><button onClick={() => handleNavigate('home')} className="hover:text-white transition-colors duration-200 ease-in-out">Home</button></li>
                            <li><button onClick={() => handleNavigate('shop')} className="hover:text-white transition-colors duration-200 ease-in-out">Shop All</button></li>
                            <li><button onClick={() => handleNavigate('about')} className="hover:text-white transition-colors duration-200 ease-in-out">Our Story</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-500 uppercase tracking-widest text-xs mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li><button onClick={() => handlePolicyClick('contact')} className="hover:text-white transition-colors duration-200 ease-in-out">Contact Us</button></li>
                            <li><button onClick={() => handlePolicyClick('shipping')} className="hover:text-white transition-colors duration-200 ease-in-out">Shipping Policy</button></li>
                            <li><button onClick={() => handlePolicyClick('terms')} className="hover:text-white transition-colors duration-200 ease-in-out">Terms & Conditions</button></li>
                            <li><button onClick={() => handlePolicyClick('refund')} className="hover:text-white transition-colors duration-200 ease-in-out">Refund Policy</button></li>
                            <li><button onClick={() => handlePolicyClick('privacy')} className="hover:text-white transition-colors duration-200 ease-in-out">Privacy Policy</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-500 uppercase tracking-widest text-xs mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li>Suryabagh, Near Leela Mahal Jct.</li>
                            <li>Visakhapatnam - 530020</li>
                            <li>gvrcashewmerchants9@gmail.com</li>
                            <li>+91 9848190498</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-stone-500 text-xs uppercase tracking-widest font-bold">
                    <p>© 2026 GVR Cashew Merchants. All rights reserved.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <button onClick={() => handlePolicyClick('shipping')} className="hover:text-white transition-colors duration-200 ease-in-out">Shipping</button>
                        <button onClick={() => handlePolicyClick('refund')} className="hover:text-white transition-colors duration-200 ease-in-out">Refunds</button>
                        <button onClick={() => handlePolicyClick('privacy')} className="hover:text-white transition-colors duration-200 ease-in-out">Privacy</button>
                    </div>
                </div>
            </footer>


            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                onProceedToCheckout={handleProceedToCheckout}
            />

            <AccountModal
                isOpen={isAccountOpen}
                onClose={() => setIsAccountOpen(false)}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onSaveAddress={handleSaveAddress}
            />
        </div>
    );
};

export default App;
