
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';

import AccountModal from './components/AccountModal';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentPage from './components/PaymentPage';
import ProfilePage from './components/ProfilePage';
import { PRODUCTS } from './constants';

const App = () => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [user, setUser] = useState(null); // { name: 'User', email: '...', addresses: [] }
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [view, setView] = useState('home');
    const [profileTab, setProfileTab] = useState('orders');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [viewPolicy, setViewPolicy] = useState(null); // 'shipping', 'refund', 'terms'
    const [adminProducts, setAdminProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                const data = await response.json();
                if (Array.isArray(data)) {
                    // Normalize image URLs: If relative, prepend backend URL
                    const processedData = data.map(product => {
                        let imageUrl = product.image;
                        if (imageUrl && !imageUrl.startsWith('http')) {
                            // Remove leading slash if present to avoid double slashes if we were just concatting, 
                            // but safer to just handle the join clean.
                            // Actually, let's just check if it starts with http.
                            // If not, assume it needs the localhost:5000 prefix.
                            // Also handling if the path already has a leading / or not.
                            const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
                            imageUrl = `http://localhost:5000${cleanPath}`;
                        }
                        return { ...product, image: imageUrl };
                    });
                    setAdminProducts(processedData);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId) ||
        adminProducts.find(p => p.id === selectedProductId || p._id === selectedProductId);

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        // For standard "Add to Cart", we show the sidebar
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // View Navigation Handlers
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
            setProfileTab('orders'); // Default back to orders when clicking Nav "My Account"
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
        // Add to cart without opening sidebar
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        setIsCartOpen(false);
        setView('checkout');
        window.scrollTo(0, 0);
    };

    const [pendingOrder, setPendingOrder] = useState(null);
    const [userOrders, setUserOrders] = useState([]);

    const fetchUserOrders = async (currentUser) => {
        if (!currentUser) return;
        try {
            const response = await fetch('http://localhost:5000/orders');
            if (response.ok) {
                const allOrders = await response.json();
                // Filter orders by customer name or email. 
                // Since our mock login doesn't have true auth, we'll try to match by name or email if available in order.
                // Looking at backend/orders.json, it uses customerName.
                const filtered = allOrders.filter(order =>
                    order.customerName?.toLowerCase() === currentUser.name?.toLowerCase() ||
                    order.customerEmail === currentUser.email
                );
                setUserOrders(filtered.reverse()); // Show newest first
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    useEffect(() => {
        if (user && view === 'profile') {
            fetchUserOrders(user);
        }
    }, [user, view]);

    const handleCheckoutSuccess = (orderData, isOnlinePayment) => {
        if (isOnlinePayment) {
            setPendingOrder(orderData);
            setView('payment');
            window.scrollTo(0, 0);
        } else {
            // COD Success
            alert("Order placed successfully! Thank you for shopping with GVR Cashew.");
            setCart([]);
            setView('home');
        }
    };

    const handlePaymentComplete = async () => {
        if (!pendingOrder) return;

        // In a real app, verify payment here. For now, just save order.
        try {
            const finalOrder = {
                ...pendingOrder,
                status: 'Paid',
                paymentMethod: 'online',
                customerEmail: user?.email // Add email for tracking
            };

            const response = await fetch('http://localhost:5000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalOrder),
            });

            if (response.ok) {
                alert("Payment Successful! Order placed.");
                setCart([]);
                setPendingOrder(null);
                setView('home');
            } else {
                alert("Failed to save order. Please contact support.");
            }
        } catch (error) {
            console.error("Error saving online order:", error);
            alert("Network error. Please make sure the backend is running.");
        }
    };

    const handleLogin = (userData) => {
        setUser({ ...userData, addresses: [] });
        setIsAccountOpen(false); // Close Modal on success
    };

    const handleLogout = () => {
        setUser(null);
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

    const handleSaveAddress = (address) => {
        if (user) {
            setUser({ ...user, addresses: [...user.addresses, address] });
        }
    };

    const handleUpdateProfile = (updatedData) => {
        if (user) {
            setUser({ ...user, ...updatedData });
        }
    };

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

                        {/* Featured Section */}
                        <section className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-4 text-center">
                                <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">GVR Cashew Merchants</h2>
                                <p className="text-stone-500 max-w-2xl mx-auto mb-16">Since 1981, we've built a legacy of trust, offering the finest selection of dry fruits, nuts, seeds, dates, and spices to Visakhapatnam and beyond.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 group hover:border-amber-200 transition-colors">
                                        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h3 className="font-bold text-xl mb-3">100% Organic</h3>
                                        <p className="text-stone-500 text-sm">No artificial preservatives or processing agents. Just nature's goodness.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 group hover:border-amber-200 transition-colors">
                                        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <h3 className="font-bold text-xl mb-3">Fresh Harvest</h3>
                                        <p className="text-stone-500 text-sm">Directly shipped within 48 hours of vacuum sealing for maximum crunch.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 group hover:border-amber-200 transition-colors">
                                        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        </div>
                                        <h3 className="font-bold text-xl mb-3">Global Export</h3>
                                        <p className="text-stone-500 text-sm">Preferred bulk supplier for retailers across 12 countries.</p>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={(p) => addToCart(p, 1)}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}

                                {adminProducts?.length > 0 && adminProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id || product._id || index}
                                        product={product}
                                        onAddToCart={(p) => addToCart(p, 1)}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>
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

                {view === 'bulk' && (
                    <section className="animate-in fade-in duration-500 py-24 bg-white">
                        <div className="max-w-4xl mx-auto px-4 text-center">
                            <span className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4 block">Institutional Sales</span>
                            <h2 className="text-5xl font-serif font-bold mb-6">Bulk & Wholesale</h2>
                            <p className="text-stone-500 mb-12 text-lg">Are you a retailer, distributor, or looking for corporate gifting? Get exclusive wholesale pricing and custom packaging solutions.</p>

                            <div className="bg-stone-50 p-10 rounded-3xl border border-stone-200 text-left">
                                <form className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Company Name</label>
                                        <input type="text" className="w-full bg-white border-stone-200 rounded-xl p-4" placeholder="Acme Retail" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Contact Person</label>
                                        <input type="text" className="w-full bg-white border-stone-200 rounded-xl p-4" placeholder="Jane Smith" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Requirement (Approx MT)</label>
                                        <select className="w-full bg-white border-stone-200 rounded-xl p-4">
                                            <option>500kg - 1 Ton</option>
                                            <option>1 Ton - 5 Tons</option>
                                            <option>5 Tons +</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <button className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-800 transition-colors uppercase tracking-widest">
                                            Request Wholesale Catalog
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                )}

                {view === 'policy' && (
                    <section className="animate-in fade-in duration-500 py-24 bg-white">
                        <div className="max-w-3xl mx-auto px-4">
                            <h1 className="text-4xl font-serif font-bold mb-8 text-stone-900 capitalize">{viewPolicy ? viewPolicy.replace('-', ' ') : 'Policies'}</h1>

                            {viewPolicy === 'shipping' && (
                                <div className="space-y-6 text-stone-600 leading-relaxed">
                                    <h3 className="text-xl font-bold text-stone-800">Shipping Policy</h3>
                                    <p>We provide exclusive delivery services across India. To ensure freshness, all orders are packed within 24 hours of confirmation.</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Standard Delivery:</strong> 3-7 business days depending on the location.</li>
                                        <li><strong>Shipping Partners:</strong> We use trusted courier services to ensure your package arrives safely.</li>
                                        <li><strong>Tracking:</strong> Tracking details will be shared via email/SMS once shipped.</li>
                                    </ul>
                                </div>
                            )}

                            {viewPolicy === 'refund' && (
                                <div className="space-y-6 text-stone-600 leading-relaxed">
                                    <h3 className="text-xl font-bold text-stone-800">Refund & Return Policy</h3>
                                    <p>Your satisfaction is our priority. If you receive a damaged or incorrect item, please contact us within 24 hours of delivery.</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Returns:</strong> Accepted only for damaged or wrong products. Proof of damage (photos) may be required.</li>
                                        <li><strong>Refunds:</strong> Processed within 5-7 business days after the return is verified.</li>
                                        <li><strong>Cancellation:</strong> Orders can be cancelled before they are shipped.</li>
                                    </ul>
                                </div>
                            )}

                            {viewPolicy === 'terms' && (
                                <div className="space-y-6 text-stone-600 leading-relaxed">
                                    <h3 className="text-xl font-bold text-stone-800">Terms & Conditions</h3>
                                    <p>Welcome to GVR Cashew Merchants. By using our website, you agree to these terms.</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Use of Site:</strong> Content is for personal use only. Pricing and availability are subject to change.</li>
                                        <li><strong>Privacy:</strong> We value your privacy and do not share your data with third parties for marketing purposes.</li>
                                        <li><strong>Jurisdiction:</strong> All disputes are subject to Visakhapatnam jurisdiction.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {view === 'detail' && selectedProduct && (
                    <ProductDetailPage
                        product={selectedProduct}
                        onAddToCart={addToCart}
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
                        onLogout={handleLogout}
                        onSaveAddress={handleSaveAddress}
                        onUpdateProfile={handleUpdateProfile}
                        initialTab={profileTab}
                    />
                )}
            </main>

            <footer className="bg-stone-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <img src="/logo.jpg" alt="GVR Cashew Merchants" className="h-14 w-auto object-contain" />
                        </div>
                        <p className="text-stone-400 max-w-sm leading-relaxed text-sm">
                            Quality since 1981. Bringing you the finest dry fruits, nuts, seeds, and spices. From our family to yours so you can live a healthier life.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-500 uppercase tracking-widest text-xs mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li><button onClick={() => handleNavigate('home')} className="hover:text-white">Home</button></li>
                            <li><button onClick={() => handleNavigate('shop')} className="hover:text-white">Shop All</button></li>
                            <li><button onClick={() => handleNavigate('about')} className="hover:text-white">Our Story</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-500 uppercase tracking-widest text-xs mb-6">Contact</h4>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li>Suryabagh, Near Leela Mahal Jct.</li>
                            <li>Visakhapatnam - 530020</li>
                            <li>Andhra Pradesh, India</li>
                            <li>gvrcashewmerchants9@gmail.com</li>
                            <li>+91 9848190498</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-stone-500 text-xs uppercase tracking-widest font-bold">
                    <p>© 2026 GVR Cashew Merchants. All rights reserved.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <button onClick={() => handlePolicyClick('shipping')} className="hover:text-white">Shipping Policy</button>
                        <button onClick={() => handlePolicyClick('refund')} className="hover:text-white">Refund Policy</button>
                        <button onClick={() => handlePolicyClick('terms')} className="hover:text-white">Terms of Service</button>
                    </div>
                </div>
            </footer>

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
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
