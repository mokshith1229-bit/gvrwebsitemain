import React from 'react';

const CODConfirmationModal = ({ isOpen, onClose, onConfirm, totalAmount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="bg-stone-50 border-b border-stone-100 px-8 py-5 text-center">
                    <h3 className="text-xl font-serif font-bold text-stone-900">Confirm Cash on Delivery</h3>
                </div>

                {/* Body */}
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>

                    <p className="text-stone-600 mb-6 leading-relaxed">
                        You are about to place an order with <span className="font-bold text-stone-900">Cash on Delivery</span>.
                        Please ensure you have the exact amount ready when your package arrives.
                    </p>

                    <div className="bg-stone-50 rounded-2xl p-4 mb-8 border border-stone-100">
                        <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Total Amount to Pay</p>
                        <p className="text-3xl font-bold text-stone-900">₹{totalAmount}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-xl font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-all uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/20 uppercase tracking-widest text-xs"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>

                {/* Footer Subtle Note */}
                <div className="px-8 pb-6 text-center">
                    <p className="text-[10px] text-stone-400">
                        By confirming, you agree to our Terms of Service and Shipping Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CODConfirmationModal;
