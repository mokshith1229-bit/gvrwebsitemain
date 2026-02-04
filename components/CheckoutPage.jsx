
import React from 'react';

const CheckoutPage = ({ items, onBack, onSuccess }) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 40;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="flex items-center text-stone-500 hover:text-amber-800 transition-colors">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Shopping
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Forms */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-stone-200">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Shipping Address</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">First Name</label>
                                <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="John" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Last Name</label>
                                <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="Doe" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Street Address</label>
                                <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="123 Cashew Lane" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">City</label>
                                <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="Kollam" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Postal Code</label>
                                <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500" placeholder="691001" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-stone-200">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Payment Method</h2>
                        <div className="space-y-4">
                            <label className="flex items-center p-4 border-2 border-amber-600 rounded-2xl bg-amber-50/50 cursor-pointer">
                                <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-amber-700 focus:ring-amber-500" />
                                <div className="ml-4 flex-1">
                                    <span className="block font-bold text-stone-900">Cash on Delivery</span>
                                    <span className="block text-sm text-stone-500">Pay when your premium nuts arrive</span>
                                </div>
                                <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </label>
                            <label className="flex items-center p-4 border border-stone-200 rounded-2xl cursor-not-allowed opacity-50">
                                <input type="radio" name="payment" disabled className="h-4 w-4 text-stone-300" />
                                <div className="ml-4 flex-1">
                                    <span className="block font-bold text-stone-400">Online UPI / Card</span>
                                    <span className="block text-sm text-stone-400">Coming soon for secure payments</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
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

                        <div className="border-t border-white/10 pt-6 space-y-3">
                            <div className="flex justify-between text-stone-400">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-stone-400">
                                <span>Shipping</span>
                                <span>₹{shipping}</span>
                            </div>
                            <div className="flex justify-between text-stone-400">
                                <span>Tax (GST 5%)</span>
                                <span>₹{tax}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10 text-amber-500">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button
                            onClick={onSuccess}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold transition-all mt-8 shadow-xl shadow-amber-900/50"
                        >
                            Complete Purchase
                        </button>
                        <p className="text-[10px] text-stone-500 text-center mt-4 uppercase tracking-widest">
                            Secure Checkout • Fast Shipping • Guaranteed Quality
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
