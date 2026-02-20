
import React, { useState } from 'react';

const AccountModal = ({ isOpen, onClose, user, onLogin, onLogout, onSaveAddress }) => {
    if (!isOpen) return null;

    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ name: name || 'User', email });
    };

    return (
        <div className={`fixed inset-0 z-[60] flex pointer-events-none ${user ? 'justify-end' : 'justify-center items-center'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity pointer-events-auto"
                onClick={onClose}
            />

            {/* CONTENT */}
            {!user ? (
                // PREMIUM LOGIN CARD
                <div className="relative z-10 w-full max-w-[400px] pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-stone-900 px-8 py-6 text-center">
                            <span className="font-serif font-bold text-2xl text-white tracking-wider">GVR</span>
                            <p className="text-amber-500 text-xs uppercase tracking-widest font-bold mt-1">Premium Cashew Merchants</p>
                        </div>

                        <div className="p-8">
                            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2 text-center">
                                {isLoginView ? 'Welcome Back' : 'Join Our Community'}
                            </h2>
                            <p className="text-stone-500 text-sm text-center mb-8">
                                {isLoginView ? 'Sign in to access your orders and addresses' : 'Create an account for a seamless shopping experience'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-wide mb-2">
                                        {isLoginView ? 'Email Address' : 'Full Name'}
                                    </label>
                                    {!isLoginView && (
                                        <input
                                            type="text"
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all mb-4"
                                            placeholder="Eg. John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    )}
                                    {isLoginView ? (
                                        <input
                                            type="email"
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                        />
                                    ) : (
                                        <>
                                            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wide mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all mb-4"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                            />
                                        </>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-wide mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {!isLoginView && <p className="text-xs text-stone-400 mt-2">Must be at least 6 characters.</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-stone-900 hover:bg-amber-700 text-white rounded-xl py-3.5 text-sm font-bold shadow-lg shadow-stone-900/20 transition-all uppercase tracking-widest mt-4"
                                >
                                    {isLoginView ? 'Sign In' : 'Create Account'}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                                <p className="text-sm text-stone-500">
                                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        onClick={() => setIsLoginView(!isLoginView)}
                                        className="ml-2 font-bold text-amber-700 hover:text-amber-800 transition-colors"
                                    >
                                        {isLoginView ? 'Sign Up' : 'Log In'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // PREMIUM LOGGED IN CARD
                <div className="relative z-10 w-full max-w-[500px] pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-stone-50 border-b border-stone-100 px-8 py-5 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-xl font-serif font-bold text-stone-900">
                                    Hello, {user.name}
                                </h2>
                                {!isAddingAddress && <p className="text-xs text-stone-500 uppercase tracking-wide mt-1">Manage your profile</p>}
                                {isAddingAddress && <p className="text-xs text-stone-500 uppercase tracking-wide mt-1">Add New Address</p>}
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {!isAddingAddress ? (
                                // ADDRESS LIST VIEW
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Saved Addresses</h3>
                                        {user.addresses && user.addresses.length > 0 ? (
                                            <div className="space-y-3">
                                                {user.addresses.map((addr, idx) => (
                                                    <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-start space-x-3 group hover:border-amber-200 transition-colors">
                                                        <div className="mt-1 text-amber-600">
                                                            {addr.addressType === 'Office' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>}
                                                            {addr.addressType === 'Home' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}
                                                            {(!addr.addressType || addr.addressType === 'Other') && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="font-bold text-sm text-stone-800">{addr.firstName} {addr.lastName}</span>
                                                                <span className="text-[10px] bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded font-bold uppercase">{addr.addressType || 'Home'}</span>
                                                            </div>
                                                            <p className="text-sm text-stone-600 leading-relaxed">
                                                                {addr.flat}, {addr.area}<br />
                                                                {addr.city}, {addr.state} - {addr.pinCode}<br />
                                                                Phone: {addr.mobile}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                                <p className="text-stone-400 text-sm">No saved addresses yet.</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="w-full py-4 rounded-xl border-2 border-dashed border-stone-300 text-stone-500 font-bold hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50 transition-all flex items-center justify-center space-x-2 group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Add New Address</span>
                                    </button>

                                    <div className="pt-6 border-t border-stone-100">
                                        <button
                                            onClick={onLogout}
                                            className="w-full bg-stone-100 text-stone-600 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // ADD ADDRESS FORM
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Country</label>
                                        <div className="flex items-center space-x-2 border border-stone-200 rounded-lg px-3 py-2.5 bg-stone-50 text-stone-400 cursor-not-allowed">
                                            <span className="text-lg">🇮🇳</span>
                                            <span className="text-sm font-medium">India</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">First Name *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={addressForm.firstName}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={addressForm.lastName}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">Mobile Number *</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-200 bg-stone-50 text-stone-500 text-sm font-medium">
                                                +91
                                            </span>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                required
                                                pattern="[0-9]{10}"
                                                className="flex-1 border border-stone-200 rounded-r-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                                placeholder="10-digit number"
                                                value={addressForm.mobile}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">PIN Code *</label>
                                            <input
                                                type="text"
                                                name="pinCode"
                                                required
                                                pattern="[0-9]{6}"
                                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={addressForm.pinCode}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                required
                                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={addressForm.state}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={addressForm.city}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">Area/Locality *</label>
                                            <input
                                                type="text"
                                                name="area"
                                                required
                                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                                value={addressForm.area}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">Flat no/Building, Street name *</label>
                                        <input
                                            type="text"
                                            name="flat"
                                            required
                                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                            value={addressForm.flat}
                                            onChange={handleFormChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-900 uppercase mb-1">Landmark</label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                            value={addressForm.landmark}
                                            onChange={handleFormChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-900 uppercase mb-2">Address Type</label>
                                        <div className="flex space-x-3">
                                            {['Home', 'Office', 'Other'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => handleFormChange({ target: { name: 'addressType', value: type } })}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${addressForm.addressType === type
                                                        ? 'bg-amber-50 border-amber-500 text-amber-700'
                                                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingAddress(false)}
                                            className="flex-1 bg-white border border-stone-200 text-stone-600 py-3 rounded-xl font-bold hover:bg-stone-50 transition-colors text-sm uppercase tracking-wide"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition-colors text-sm uppercase tracking-wide shadow-lg shadow-stone-900/10"
                                        >
                                            Save Address
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountModal;
