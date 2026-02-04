
import React, { useState } from 'react';

const ProductDetailPage = ({ product, onAddToCart, onBuyNow, onBack }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <nav className="flex mb-8 text-sm text-stone-500 space-x-2">
                <button onClick={onBack} className="hover:text-amber-800 transition-colors">Shop</button>
                <span>/</span>
                <span className="text-stone-400">{product.category}</span>
                <span>/</span>
                <span className="font-medium text-stone-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-200 bg-white cursor-pointer hover:border-amber-600 transition-colors">
                                <img src={product.image} alt="" className="w-full h-full object-cover opacity-60" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">{product.name}</h1>

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-200'}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-stone-400 text-sm">42 Customer Reviews</span>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm mb-8">
                        <div className="flex items-baseline space-x-2 mb-4">
                            <span className="text-3xl font-bold text-stone-900">₹{product.price}</span>
                            <span className="text-stone-400 line-through">₹{product.price + 200}</span>
                            <span className="text-green-600 font-bold text-sm">Save ₹200</span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed mb-6">
                            {product.description} Available in premium vacuum-sealed packaging to preserve freshness.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                                <span className="text-sm font-medium text-stone-600">Weight</span>
                                <span className="font-bold text-stone-900">{product.weight || '250g'}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                                <span className="text-sm font-medium text-stone-600">Grade</span>
                                <span className="font-bold text-stone-900">{product.tags && product.tags[0] ? product.tags[0] : 'Premium'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border-2 border-stone-200 rounded-xl px-4 py-2">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 font-bold text-stone-400 hover:text-amber-800">-</button>
                                <span className="px-6 font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="p-2 font-bold text-stone-400 hover:text-amber-800">+</button>
                            </div>
                            <button
                                onClick={() => onAddToCart(product, quantity)}
                                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/10"
                            >
                                Add to Cart
                            </button>
                        </div>
                        <button
                            onClick={() => onBuyNow(product, quantity)}
                            className="w-full bg-stone-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all"
                        >
                            Buy Now
                        </button>
                    </div>

                    <div className="mt-8 flex items-center space-x-6 text-xs text-stone-500 font-medium uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>Free Delivery</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>100% Organic</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
