import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const CheckoutPage = ({ items, onBack, onSuccess, user, onOpenLogin, onOpenAddresses }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        flat: '',
        area: '',
        city: '',
        state: '',
        pinCode: '',
        mobile: '',
        paymentMethod: 'cod' // Default to Cash on Delivery
    });

    const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Auto-fill form if user is logged in
    useEffect(() => {
        if (user && user.addresses && user.addresses.length > 0) {
            setSelectedAddressIndex(0);
            const addr = user.addresses[0];
            setFormData(prev => ({
                ...prev,
                firstName: addr.firstName || user.name?.split(' ')[0] || '',
                lastName: addr.lastName || user.name?.split(' ')[1] || '',
                flat: addr.flat || '',
                area: addr.area || '',
                city: addr.city || '',
                state: addr.state || '',
                pinCode: addr.pinCode || '',
                mobile: addr.mobile || user.phone || ''
            }));
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ')[1] || '',
                mobile: user.phone || ''
            }));
        }
    }, [user]);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 40;
    const tax = Math.round(subtotal * 0.05);

    // Calculate Discount
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.couponType === 'percentage') {
            discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
            if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
                discountAmount = appliedCoupon.maxDiscount;
            }
        } else if (appliedCoupon.couponType === 'flat') {
            discountAmount = appliedCoupon.discountValue;
        }
    }

    const total = Math.max(0, subtotal + shipping + tax - discountAmount);
    const isFormValid = formData.firstName && formData.mobile && formData.flat && formData.area && formData.city && formData.state && formData.pinCode;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplying(true);
        setCouponError('');
        setCouponSuccess('');

        try {
            const response = await fetch('http://localhost:5000/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, orderValue: subtotal })
            });

            const data = await response.json();
            if (response.ok) {
                setAppliedCoupon(data);
                setCouponSuccess(`'${data.couponCode}' applied successfully!`);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#b45309', '#f59e0b', '#78350f', '#fef3c7']
                });
            } else {
                setAppliedCoupon(null);
                setCouponError(data.message || 'Invalid coupon');
            }
        } catch (error) {
            setCouponError('Failed to apply coupon');
        } finally {
            setIsApplying(false);
        }
    };

    const handleAddressSelect = (index) => {
        setSelectedAddressIndex(index);
        if (index === -1) {
            setFormData(prev => ({ ...prev, flat: '', area: '', city: '', state: '', pinCode: '', mobile: user?.phone || '' }));
        } else {
            const addr = user.addresses[index];
            setFormData(prev => ({
                ...prev,
                firstName: addr.firstName || user.name?.split(' ')[0] || '',
                lastName: addr.lastName || user.name?.split(' ')[1] || '',
                flat: addr.flat || '',
                area: addr.area || '',
                city: addr.city || '',
                state: addr.state || '',
                pinCode: addr.pinCode || '',
                mobile: addr.mobile || user.phone || ''
            }));
        }
    };

    const handleRazorpayPayment = async (orderData) => {
        setIsProcessingPayment(true);
        try {
            // 1. Create Order on Backend
            const res = await fetch('http://localhost:5000/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalAmount: total })
            });
            const rzpOrder = await res.json();

            // 2. Open Razorpay Popup
            const options = {
                key: "rzp_test_SCODRISGhZ2J6p", // MUST MATCH BACKEND KEY
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: "GVR Cashews",
                description: "Premium Quality Nuts & Spices",
                order_id: rzpOrder.id,
                handler: async function (response) {
                    // 3. On Payment Success
                    const finalOrder = {
                        ...orderData,
                        paymentMethod: 'ONLINE',
                        status: 'PAID',
                        paymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature
                    };

                    const saveRes = await fetch('http://localhost:5000/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(finalOrder)
                    });

                    if (saveRes.ok) {
                        onSuccess(finalOrder, false);
                    } else {
                        alert("Payment successful but failed to save order. Please contact support.");
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: user?.email,
                    contact: formData.mobile
                },
                theme: { color: "#b45309" },
                modal: {
                    ondismiss: function () {
                        setIsProcessingPayment(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert(`Payment Failed: ${response.error.description}`);
                setIsProcessingPayment(false);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to initiate payment. Please try again.");
            setIsProcessingPayment(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (!user) {
            onOpenLogin();
            return;
        }

        if (!isFormValid) {
            alert("Please fill in all required shipping fields.");
            return;
        }

        const fullAddress = `${formData.flat}, ${formData.area}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;
        const orderData = {
            customerName: `${formData.firstName} ${formData.lastName}`.trim(),
            customerPhone: formData.mobile,
            customerEmail: user?.email,
            products: items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
            totalAmount: total,
            couponCode: appliedCoupon ? appliedCoupon.couponCode : null,
            discountAmount: discountAmount,
            shippingAddress: { address: fullAddress, city: formData.city, postalCode: formData.pinCode },
            billingAddress: { address: fullAddress, city: formData.city, postalCode: formData.pinCode },
            status: 'Pending',
            paymentMethod: formData.paymentMethod,
            orderDate: new Date().toISOString()
        };

        if (formData.paymentMethod === 'online') {
            await handleRazorpayPayment(orderData);
            return;
        }

        // COD Flow
        try {
            const response = await fetch('http://localhost:5000/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                onSuccess(orderData, false);
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Network error. Please make sure the backend is running.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="flex items-center text-stone-500 hover:text-amber-800 transition-colors">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Shopping
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-stone-200">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Shipping Address</h2>

                        {user && user.addresses && user.addresses.length > 0 && (
                            <div className="mb-8">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Select from Saved Addresses</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {user.addresses.map((addr, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleAddressSelect(idx)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressIndex === idx ? 'border-amber-600 bg-amber-50' : 'border-stone-100 hover:border-stone-200'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm text-stone-900">{addr.addressType || 'Home'}</span>
                                                {selectedAddressIndex === idx && (
                                                    <div className="w-4 h-4 rounded-full bg-amber-600 flex items-center justify-center">
                                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-stone-600 leading-tight">
                                                {addr.flat}, {addr.area}<br />
                                                {addr.city}, {addr.state} - {addr.pinCode}
                                            </p>
                                        </div>
                                    ))}
                                    <div onClick={onOpenAddresses} className="p-4 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all border-stone-200 hover:border-stone-300 hover:bg-stone-50">
                                        <span className="font-bold text-sm text-stone-900 mb-1">+ Use New Address</span>
                                        <p className="text-[10px] text-stone-500">Manage addresses in profile</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">First Name *</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="John" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="Doe" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Mobile Number *</label>
                                <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="+91 9876543210" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Flat / House No / Building *</label>
                                <input type="text" name="flat" value={formData.flat} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="Flat 101" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Area / Locality / Street *</label>
                                <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="Suryabagh" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">City *</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="Visakhapatnam" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">State *</label>
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="Andhra Pradesh" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">PIN Code *</label>
                                <input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="530020" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-stone-200">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Payment Method</h2>
                        <div className="space-y-4">
                            <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-amber-600 bg-amber-50/50' : 'border-stone-200'}`}>
                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="h-4 w-4 text-amber-700 focus:ring-amber-500" />
                                <div className="ml-4 flex-1">
                                    <span className="block font-bold text-stone-900">Cash on Delivery</span>
                                    <span className="block text-sm text-stone-500">Pay when your order arrives</span>
                                </div>
                                <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </label>

                            <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-amber-600 bg-amber-50/50' : 'border-stone-200'}`}>
                                <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={handleInputChange} className="h-4 w-4 text-amber-700 focus:ring-amber-500" />
                                <div className="ml-4 flex-1">
                                    <span className="block font-bold text-stone-900">Online Payment</span>
                                    <span className="block text-sm text-stone-500">UPI, Cards, Net Banking</span>
                                </div>
                                <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-stone-900 text-white p-8 rounded-3xl sticky top-24">
                        <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center space-x-3">
                                        <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold text-amber-500">{item.quantity}x</span>
                                        <span className="text-stone-300">{item.name}</span>
                                    </div>
                                    <span className="font-bold">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-6 pt-6 border-t border-white/10">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Promo Code</label>
                            <div className="flex gap-2">
                                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none uppercase" />
                                <button onClick={handleApplyCoupon} disabled={isApplying || !couponCode} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                                    {isApplying ? '...' : 'Apply'}
                                </button>
                            </div>
                            {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                            {couponSuccess && <p className="text-green-400 text-xs mt-2">{couponSuccess}</p>}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-stone-400"><span>Subtotal</span><span>₹{subtotal}</span></div>
                            <div className="flex justify-between text-stone-400"><span>Shipping</span><span>₹{shipping}</span></div>
                            <div className="flex justify-between text-stone-400"><span>Tax (GST 5%)</span><span>₹{tax}</span></div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-green-400 font-bold">
                                    <span>Discount ({appliedCoupon?.couponCode})</span>
                                    <span>-₹{discountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10 text-amber-500">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCompleteOrder}
                            disabled={!user || !isFormValid || isProcessingPayment}
                            className={`w-full py-4 rounded-xl font-bold transition-all mt-8 shadow-xl flex items-center justify-center space-x-2 ${!user || !isFormValid || isProcessingPayment
                                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/50'
                                }`}
                        >
                            <span>
                                {isProcessingPayment ? 'Processing...' :
                                    (!user ? 'Login to Continue' :
                                        (!isFormValid ? 'Enter Details to Proceed' :
                                            (formData.paymentMethod === 'online' ? 'Proceed to Pay' : 'Place Order')))}
                            </span>
                            {!isProcessingPayment && user && isFormValid && formData.paymentMethod === 'online' && (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
