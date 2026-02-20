
import React from 'react';

const PaymentPage = ({ amount, onPaymentComplete, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="flex items-center text-stone-500 hover:text-amber-800 transition-colors">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Checkout
                </button>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-xl max-w-lg mx-auto text-center">
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">Complete Your Payment</h2>

                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 mb-8">
                    <p className="text-stone-500 text-sm uppercase tracking-widest font-bold mb-2">Total Amount to Pay</p>
                    <p className="text-4xl font-bold text-amber-600">₹{amount}</p>
                </div>

                <div className="mb-8">
                    <p className="text-stone-600 mb-4">Scan QR code to pay via UPI</p>
                    <div className="bg-white p-4 inline-block rounded-2xl border-2 border-stone-100 shadow-inner">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=gvrcashew@upi&pn=GVR%20Cashew&am=${amount}&cu=INR"
                            alt="Payment QR Code"
                            className="w-48 h-48 object-contain"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onPaymentComplete}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 flex items-center justify-center space-x-2"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>Payment Completed</span>
                    </button>

                    <p className="text-xs text-stone-400">
                        Clicking this button will confirm your order. <br />
                        Please ensure the payment is successful before proceeding.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
