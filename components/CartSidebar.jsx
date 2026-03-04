
import React from 'react';

const CartSidebar = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onProceedToCheckout }) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-stone-800">Your Cart</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-lg">Your cart is empty</p>
                            <button
                                onClick={onClose}
                                className="text-amber-700 font-semibold hover:underline"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={`${item.id}-${item.weight}`} className="flex space-x-4">
                                <img src={item.image || item.thumbnailUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-stone-50" />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-semibold text-stone-800 text-sm">{item.name}</h4>
                                        <span className="font-bold text-stone-900 text-sm">₹{item.price * item.quantity}</span>
                                    </div>
                                    <p className="text-xs text-stone-500 mb-2">{item.weight}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-stone-200 rounded-lg">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.weight, -1)}
                                                className="px-2 py-1 hover:bg-stone-50"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.weight, 1)}
                                                className="px-2 py-1 hover:bg-stone-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => onRemove(item.id, item.weight)}
                                            className="text-stone-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-stone-100 bg-stone-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-stone-500">Subtotal</span>
                            <span className="text-xl font-bold text-stone-900">₹{total}</span>
                        </div>
                        <button
                            onClick={onProceedToCheckout}
                            className="w-full bg-amber-700 text-white py-4 rounded-xl font-bold hover:bg-amber-800 transition-colors shadow-lg shadow-amber-700/20"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
