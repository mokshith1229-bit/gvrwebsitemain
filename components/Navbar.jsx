
import React from 'react';

const Navbar = ({ cartCount, onCartClick, onAssistantClick, onAccountClick, onNavigate, onSearch, searchQuery }) => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => onNavigate('home')}
                    >
                        <img src="/logo.jpg" alt="GVR Cashew" className="h-14 w-auto object-contain" />
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
                        <button onClick={() => onNavigate('home')} className="hover:text-amber-700 transition-colors uppercase tracking-wider text-sm font-bold">Home</button>
                        <button onClick={() => onNavigate('shop')} className="hover:text-amber-700 transition-colors uppercase tracking-wider text-sm font-bold">Shop</button>
                        <button onClick={() => onNavigate('about')} className="hover:text-amber-700 transition-colors uppercase tracking-wider text-sm font-bold">Our Story</button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-stone-100 border-none rounded-full text-sm focus:ring-2 focus:ring-amber-500 w-64 focus:w-80 transition-all duration-300 outline-none"
                                value={searchQuery}
                                onChange={(e) => {
                                    onSearch(e.target.value);
                                    if (e.target.value) onNavigate('shop');
                                }}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-4 w-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <button
                            onClick={onAccountClick}
                            className="p-2 text-stone-600 hover:text-amber-700 transition-colors flex items-center space-x-2"
                            title="Account"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>

                        </button>


                        <button
                            onClick={onCartClick}
                            className="relative p-2 text-stone-600 hover:text-amber-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
