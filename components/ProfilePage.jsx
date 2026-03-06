import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, onLogout, onSaveAddress, onDeleteAddress, onUpdateProfile, orders = [], ordersLoading = false, ordersError = null, initialTab = 'orders', onRefreshOrders }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [addressForm, setAddressForm] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        pinCode: '',
        state: '',
        city: '',
        area: '',
        flat: '',
        landmark: '',
        addressType: 'Home'
    });

    const [profileForm, setProfileForm] = useState({
        firstName: user.firstName || user.name.split(' ')[0] || '',
        lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        mobile: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || ''
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditAddress = (index) => {
        const addr = user.addresses[index];
        setAddressForm({ ...addr });
        setEditingIndex(index);
        setIsAddingAddress(true);
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        onSaveAddress(addressForm, editingIndex);
        setAddressForm({
            firstName: '',
            lastName: '',
            mobile: '',
            pinCode: '',
            state: '',
            city: '',
            area: '',
            flat: '',
            landmark: '',
            addressType: 'Home'
        });
        setIsAddingAddress(false);
        setEditingIndex(-1);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
        setIsEditingProfile(true);
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        onUpdateProfile({
            ...profileForm,
            name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
            phone: profileForm.mobile
        });
        setIsEditingProfile(false);
        alert("Profile updated successfully!");
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                // ── Tracking helpers ──────────────────────────────────────────
                const TRACKING_STEPS = [
                    'Order Placed',
                    'Confirmed',
                    'Shipped',
                    'Out for Delivery',
                    'Delivered',
                ];

                const getStepIndex = (status = '') => {
                    const s = status.toLowerCase().trim();

                    // ── Cancelled / Failed ───────────────────────────
                    if (['cancelled', 'canceled', 'rejected', 'failed', 'returned'].includes(s)) return -1;

                    // ── Delivered / Completed ────────────────────────
                    if (['delivered', 'completed', 'done'].includes(s)) return 4;

                    // ── Out for Delivery ─────────────────────────────
                    if (['out for delivery', 'out_for_delivery', 'out-for-delivery',
                        'on the way', 'last mile'].includes(s)) return 3;

                    // ── Shipped / In Transit / Dispatched ────────────
                    if (['shipped', 'dispatched', 'in transit', 'in_transit',
                        'intransit', 'packed', 'ready to ship', 'ready for pickup'].includes(s)) return 2;

                    // ── Confirmed / Accepted / Paid ──────────────────
                    // 'Accepted' is the real status set by the Omni dashboard on acceptance
                    if (['confirmed', 'accepted', 'approved', 'paid', 'captured',
                        'payment confirmed', 'processing'].includes(s)) return 1;

                    // ── Pending / default = Order Placed ─────────────
                    return 0;
                };

                const statusBadgeClass = (status = '') => {
                    const s = status.toLowerCase().trim();

                    if (['delivered', 'completed', 'done', 'paid', 'captured', 'payment confirmed'].includes(s))
                        return 'bg-green-50 border-green-200 text-green-700';

                    if (['shipped', 'dispatched', 'in transit', 'in_transit', 'intransit',
                        'packed', 'ready to ship'].includes(s))
                        return 'bg-blue-50 border-blue-200 text-blue-700';

                    if (['out for delivery', 'out_for_delivery', 'out-for-delivery',
                        'on the way'].includes(s))
                        return 'bg-purple-50 border-purple-200 text-purple-700';

                    if (['confirmed', 'accepted', 'approved', 'processing'].includes(s))
                        return 'bg-teal-50 border-teal-200 text-teal-700';

                    if (['cancelled', 'canceled', 'rejected', 'failed', 'returned'].includes(s))
                        return 'bg-red-50 border-red-200 text-red-700';

                    return 'bg-amber-50 border-amber-200 text-amber-700'; // pending / default
                };

                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-serif font-bold text-stone-900">Your Orders</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                                    {orders.length} Orders
                                </span>
                                {onRefreshOrders && (
                                    <button
                                        onClick={onRefreshOrders}
                                        disabled={ordersLoading}
                                        title="Refresh order status from dashboard"
                                        className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-widest transition-all ${ordersLoading
                                            ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                                            : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-3.5 w-3.5 ${ordersLoading ? 'animate-spin' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        {ordersLoading ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {orders.length > 0 ? (
                            <div className="space-y-6">
                                {orders.map((order, idx) => {
                                    const stepIdx = getStepIndex(order.status);
                                    const isCancelled = order.status?.toLowerCase() === 'cancelled';

                                    return (
                                        <div key={order._id || order.id || idx} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:border-amber-200 transition-colors group">
                                            {/* Order Header */}
                                            <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4">
                                                <div className="flex flex-wrap gap-6">
                                                    <div>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Order Date</p>
                                                        <p className="text-sm font-bold text-stone-900">
                                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                                        <p className="text-sm font-bold text-stone-900">₹{order.totalAmount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Payment</p>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${(order.paymentMethod || '').toUpperCase() === 'COD'
                                                            ? 'bg-stone-50 border-stone-200 text-stone-600'
                                                            : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                            }`}>
                                                            {(order.paymentMethod || 'COD').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Status</p>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${statusBadgeClass(order.status)}`}>
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Order #</p>
                                                    <p className="text-xs font-mono font-bold text-stone-600">{order._id || order.id || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                {/* Tracking Timeline */}
                                                {!isCancelled ? (
                                                    <div className="mb-6">
                                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Tracking Status</p>
                                                        <div className="relative flex items-center justify-between">
                                                            {/* connector line behind steps */}
                                                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-200 z-0" />
                                                            <div
                                                                className="absolute top-4 left-0 h-0.5 bg-amber-500 z-0 transition-all duration-700"
                                                                style={{ width: stepIdx >= 0 ? `${(stepIdx / (TRACKING_STEPS.length - 1)) * 100}%` : '0%' }}
                                                            />
                                                            {TRACKING_STEPS.map((step, sIdx) => {
                                                                const done = sIdx <= stepIdx;
                                                                const active = sIdx === stepIdx;
                                                                return (
                                                                    <div key={step} className="relative z-10 flex flex-col items-center" style={{ minWidth: '60px' }}>
                                                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${done
                                                                            ? 'bg-amber-500 border-amber-500 shadow-md shadow-amber-200'
                                                                            : 'bg-white border-stone-200'
                                                                            } ${active ? 'ring-2 ring-amber-300 ring-offset-1' : ''}`}>
                                                                            {done ? (
                                                                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            ) : (
                                                                                <span className="w-2 h-2 rounded-full bg-stone-300" />
                                                                            )}
                                                                        </div>
                                                                        <p className={`text-[9px] text-center mt-2 font-bold leading-tight max-w-[54px] ${active ? 'text-amber-700' : done ? 'text-stone-700' : 'text-stone-300'
                                                                            }`}>{step}</p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                                        <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <p className="text-sm font-bold text-red-600">This order has been cancelled.</p>
                                                    </div>
                                                )}

                                                {/* Products */}
                                                <div className="space-y-4 pt-4 border-t border-stone-100">
                                                    {(order.products || order.items || []).map((item, pIdx) => (
                                                        <div key={pIdx} className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-amber-700 text-xs font-bold">
                                                                    {item.quantity}x
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-stone-900">{item.name}</p>
                                                                    <p className="text-xs text-stone-500">Unit Price: ₹{item.price}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-bold text-stone-900">₹{item.price * item.quantity}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end space-x-4">
                                                    <button className="text-xs font-bold text-amber-700 uppercase tracking-widest hover:text-amber-800 transition-colors">Download Invoice</button>
                                                    <button className="text-xs font-bold text-stone-500 uppercase tracking-widest hover:text-stone-900 transition-colors">View Details</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-stone-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="text-lg font-serif font-bold text-stone-900">No orders yet</h3>
                                <p className="text-stone-500 text-sm mt-1">Start shopping to see your orders here.</p>
                            </div>
                        )}
                    </div>
                );
            case 'addresses':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-serif font-bold text-stone-900">My Addresses</h2>
                            {!isAddingAddress && (
                                <button
                                    onClick={() => setIsAddingAddress(true)}
                                    className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-700 transition-colors shadow-lg shadow-stone-900/10"
                                >
                                    + Add New Address
                                </button>
                            )}
                        </div>

                        {!isAddingAddress ? (
                            <div className="space-y-4">
                                {user.addresses && user.addresses.length > 0 ? (
                                    <div className="grid gap-4">
                                        {user.addresses.map((addr, idx) => (
                                            <div key={idx} className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm flex items-start space-x-4 group hover:border-amber-200 transition-colors">
                                                <div className="p-3 bg-stone-50 rounded-xl text-amber-600">
                                                    {addr.addressType === 'Office' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>}
                                                    {addr.addressType === 'Home' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}
                                                    {(!addr.addressType || addr.addressType === 'Other') && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-bold text-stone-900">{addr.firstName} {addr.lastName}</span>
                                                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-stone-200">{addr.addressType || 'Home'}</span>
                                                    </div>
                                                    <p className="text-stone-600 text-sm leading-relaxed">
                                                        {addr.flat}, {addr.area}<br />
                                                        {addr.city}, {addr.state} - {addr.pinCode}<br />
                                                        <span className="font-medium text-stone-800 mt-1 inline-block">Mobile: {addr.mobile}</span>
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditAddress(idx)}
                                                        className="text-stone-400 hover:text-amber-700 text-xs font-bold uppercase transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-stone-300">|</span>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this address?")) {
                                                                onDeleteAddress(idx);
                                                            }
                                                        }}
                                                        className="text-stone-400 hover:text-red-600 text-xs font-bold uppercase transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                                        <p className="text-stone-500 font-medium">No saved addresses found.</p>
                                        <p className="text-stone-400 text-xs mt-1">Add a new address to speed up checkout.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-serif font-bold text-stone-900 mb-6">
                                    {editingIndex > -1 ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <form onSubmit={handleAddressSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Country */}
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Country *</label>
                                            <div className="flex items-center space-x-3 border border-stone-200 rounded-xl px-4 py-3 bg-stone-50 text-stone-400 cursor-not-allowed">
                                                <span className="text-xl">🇮🇳</span>
                                                <span className="font-medium">India</span>
                                            </div>
                                        </div>

                                        {/* Personal Details */}
                                        <div>
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">First Name *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.firstName}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.lastName}
                                                onChange={handleFormChange}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Mobile Number *</label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 text-stone-500 text-sm font-bold">
                                                    +91
                                                </span>
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    className="flex-1 border border-stone-200 rounded-r-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                    placeholder="10-digit number"
                                                    value={addressForm.mobile}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Location Details */}
                                        <div>
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">PIN Code *</label>
                                            <input
                                                type="text"
                                                name="pinCode"
                                                required
                                                pattern="[0-9]{6}"
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.pinCode}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                required
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.state}
                                                onChange={handleFormChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.city}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Area / Locality *</label>
                                            <input
                                                type="text"
                                                name="area"
                                                required
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.area}
                                                onChange={handleFormChange}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Flat no / Building, Street name *</label>
                                            <input
                                                type="text"
                                                name="flat"
                                                required
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.flat}
                                                onChange={handleFormChange}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Landmark</label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                                value={addressForm.landmark}
                                                onChange={handleFormChange}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Address Type</label>
                                            <div className="flex space-x-4">
                                                {['Home', 'Office', 'Other'].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => handleFormChange({ target: { name: 'addressType', value: type } })}
                                                        className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${addressForm.addressType === type
                                                            ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm'
                                                            : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-4 border-t border-stone-100 flex items-center justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingAddress(false);
                                                setEditingIndex(-1);
                                            }}
                                            className="px-8 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors uppercase tracking-widest text-xs"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors uppercase tracking-widest text-xs shadow-xl shadow-stone-900/10"
                                        >
                                            Save Address
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                );
            case 'profile':
                return (
                    <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-serif font-bold text-stone-900 uppercase tracking-tight">Edit Profile</h2>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                                {/* First Name */}
                                <div className="relative group border-b-2 border-stone-200 focus-within:border-amber-500 transition-all">
                                    <label className="absolute -top-5 left-0 text-[11px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-amber-500">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        className="peer w-full bg-transparent border-none outline-none text-stone-900 font-bold py-2 px-0"
                                        placeholder=" "
                                        value={profileForm.firstName}
                                        onChange={handleProfileChange}
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="relative group border-b-2 border-stone-200 focus-within:border-amber-500 transition-all">
                                    <label className="absolute -top-5 left-0 text-[11px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-amber-500">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="peer w-full bg-transparent border-none outline-none text-stone-900 font-bold py-2 px-0"
                                        placeholder=" "
                                        value={profileForm.lastName}
                                        onChange={handleProfileChange}
                                    />
                                </div>

                                {/* Email Id */}
                                <div className="md:col-span-2 relative group border-b-2 border-stone-200 focus-within:border-amber-500 transition-all">
                                    <label className="absolute -top-5 left-0 text-[11px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-amber-500">
                                        Email Id *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="peer w-full bg-transparent border-none outline-none text-stone-900 font-bold py-2 px-0"
                                        placeholder=" "
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                    />
                                </div>

                                {/* Mobile Number */}
                                <div className="md:col-span-2 relative group border-b-2 border-stone-200 focus-within:border-amber-500 transition-all">
                                    <label className="absolute -top-5 left-0 text-[11px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-amber-500">
                                        Mobile Number *
                                    </label>
                                    <div className="flex justify-between items-center">
                                        <input
                                            type="tel"
                                            name="mobile"
                                            required
                                            className="peer w-full bg-transparent border-none outline-none text-stone-900 font-bold py-2 px-0"
                                            placeholder=" "
                                            value={profileForm.mobile}
                                            onChange={handleProfileChange}
                                        />
                                        <button type="button" className="text-[11px] font-bold text-amber-900 uppercase tracking-widest hover:text-amber-700 whitespace-nowrap ml-4">CHANGE</button>
                                    </div>
                                </div>

                                {/* DOB */}
                                <div className="md:col-span-2 relative group border-b-2 border-stone-200 focus-within:border-amber-500 transition-all">
                                    <label className="absolute -top-5 left-0 text-[11px] font-bold text-stone-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-amber-500">
                                        DOB
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="date"
                                            name="dob"
                                            className="peer w-full bg-transparent border-none outline-none text-stone-900 font-bold py-2 px-0"
                                            value={profileForm.dob}
                                            onChange={handleProfileChange}
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-2 text-[12px] text-stone-500">Share your DOB to get special gifts on the 1st day of your birthday month</p>

                            {/* Gender */}
                            <div className="pt-4">
                                <label className="block text-[17px] font-bold text-stone-900 mb-4">Gender</label>
                                <div className="flex flex-wrap gap-4">
                                    {['Male', 'Female', 'Other'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => {
                                                setProfileForm(prev => ({ ...prev, gender: g }));
                                                setIsEditingProfile(true);
                                            }}
                                            className={`min-w-[140px] py-4 px-8 rounded-xl text-[14px] font-bold border transition-all ${profileForm.gender === g
                                                ? 'bg-amber-400 border-amber-400 text-stone-900 shadow-md transform scale-105'
                                                : 'bg-white border-stone-200 text-stone-400 hover:border-stone-300'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={!isEditingProfile}
                                    className={`px-24 py-5 rounded-xl font-bold uppercase tracking-widest text-[13px] transition-all shadow-xl ${isEditingProfile
                                        ? 'bg-stone-900 text-white hover:bg-amber-700 shadow-stone-900/20 active:scale-95'
                                        : 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                        <p className="text-stone-400">Coming Soon</p>
                    </div>
                );
        }
    };

    const menuItems = [
        { id: 'orders', label: 'My Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'addresses', label: 'My Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    return (
        <div className="min-h-screen bg-stone-50 py-12 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">My Account</h1>
                <p className="text-stone-500 mb-8">Manage your profile, orders, and addresses.</p>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-stone-100 bg-stone-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-500 font-bold text-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wide font-bold">Welcome back,</p>
                                        <p className="font-bold text-stone-900 truncate max-w-[150px]">{user.name}</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-2">
                                {menuItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => activeTab !== item.id && setActiveTab(item.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold mb-1 ${activeTab === item.id
                                            ? 'bg-stone-900 text-white shadow-md'
                                            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        <span>{item.label}</span>
                                        {activeTab === item.id && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                                <div className="my-2 border-t border-stone-100"></div>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-bold"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
