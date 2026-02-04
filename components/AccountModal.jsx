
import React, { useState } from 'react';

const AccountModal = ({ isOpen, onClose, user, onLogin, onLogout, onSaveAddress }) => {
    if (!isOpen) return null;

    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [newAddress, setNewAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ name: name || 'User', email });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (newAddress.trim()) {
            onSaveAddress(newAddress);
            setNewAddress('');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar content */}
            <div className="w-full max-w-md bg-white h-full shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-right duration-500">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h2 className="text-xl font-serif font-bold text-stone-800">
                        {user ? `Hello, ${user.name}` : (isLoginView ? 'Welcome Back' : 'Create Account')}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {!user ? (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-stone-50 border-stone-200 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {!isLoginView && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-stone-50 border-stone-200 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-stone-50 border-stone-200 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="w-full bg-amber-700 hover:bg-amber-800 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20 uppercase tracking-widest text-sm">
                                    {isLoginView ? 'Sign In' : 'Create Account'}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-stone-500 text-sm">
                                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        onClick={() => setIsLoginView(!isLoginView)}
                                        className="ml-2 text-amber-700 font-bold hover:underline"
                                    >
                                        {isLoginView ? 'Sign Up' : 'Log In'}
                                    </button>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-stone-400 uppercase mb-4">Saved Addresses</h3>
                                {user.addresses && user.addresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {user.addresses.map((addr, idx) => (
                                            <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-start space-x-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm text-stone-600">{addr}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-stone-400 text-sm italic">No saved addresses yet.</p>
                                )}

                                <form onSubmit={handleAddressSubmit} className="mt-4">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            className="flex-1 bg-white border border-stone-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                            placeholder="Add new address..."
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newAddress.trim()}
                                            className="bg-stone-900 text-white px-4 rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-stone-800 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="pt-8 border-t border-stone-100">
                                <button
                                    onClick={onLogout}
                                    className="w-full border border-stone-200 text-stone-600 py-3 rounded-xl font-bold hover:bg-stone-50 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
