import React, { useState, useMemo, useEffect } from 'react';

const ProductDetailPage = ({ product, onAddToCart, onBuyNow, onBack }) => {
    const [quantity, setQuantity] = useState(1);

    // thumbnailUrl — primary image (from backend `thumbnail` field, resolved in Redux)
    // mediaImages  — full gallery array (from backend `media` array, resolved in Redux)
    const thumbnailUrl = product.thumbnailUrl || null;
    const mediaImages = Array.isArray(product.mediaImages) && product.mediaImages.length > 0
        ? product.mediaImages
        : (thumbnailUrl ? [thumbnailUrl] : []);  // fallback: use thumbnail as the only gallery item

    // Track which gallery image is currently shown in the main viewer
    const [activeImage, setActiveImage] = useState(0);
    const displayImage = mediaImages[activeImage] || thumbnailUrl;

    // Consolidate variants: If product has variants, use them. 
    // Otherwise, automatically generate 250g, 500g, and 1000g variants for the user.
    const allVariants = useMemo(() => {
        if (product.variants && product.variants.length > 0) return product.variants;

        const basePrice = product.price || 0;
        const baseMRP = product.mrp || (basePrice + 200);

        return [
            { weight: '250g', price: basePrice, mrp: baseMRP, stock: 99 },
            { weight: '500g', price: Math.round(basePrice * 1.9), mrp: Math.round(baseMRP * 1.9), stock: 99 },
            { weight: '1000g', price: Math.round(basePrice * 3.7), mrp: Math.round(baseMRP * 3.7), stock: 99 }
        ];
    }, [product]);

    // Variant state
    const [selectedVariant, setSelectedVariant] = useState(allVariants[0]);

    // Sync selectedVariant when allVariants changes (product changes)
    useEffect(() => {
        setSelectedVariant(allVariants[0]);
    }, [allVariants]);

    const currentPrice = selectedVariant?.price || product.price;
    const currentWeight = selectedVariant?.weight || (product.weight && product.weight !== '250g' ? product.weight : '250g');
    const currentMRP = selectedVariant?.mrp || product.mrp || (currentPrice + 200);

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
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            // Placeholder when no image is available
                            <div className="w-full h-full flex items-center justify-center bg-stone-100">
                                <span className="text-6xl">🥜</span>
                            </div>
                        )}
                    </div>

                    {/* Gallery Thumbnails — real images from backend media array */}
                    {mediaImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {mediaImages.map((url, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${activeImage === i ? 'border-amber-600' : 'border-stone-200 hover:border-amber-400'
                                        }`}
                                >
                                    <img src={url} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
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
                            <span className="text-3xl font-bold text-stone-900">₹{currentPrice}</span>
                            <span className="text-stone-400 line-through">₹{currentMRP}</span>
                            <span className="text-green-600 font-bold text-sm">Save ₹{currentMRP - currentPrice}</span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed mb-6">
                            {product.description} Available in premium vacuum-sealed packaging to preserve freshness.
                        </p>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Select Weight</span>
                                <div className="flex flex-wrap gap-3">
                                    {allVariants.map((v, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-6 py-2.5 rounded-xl font-bold transition-all border-2 text-sm shadow-sm ${selectedVariant?.weight === v.weight
                                                ? 'border-amber-600 bg-amber-600 text-white translate-y-[-1px] shadow-amber-900/10'
                                                : 'border-stone-100 bg-white text-stone-600 hover:border-amber-200'
                                                }`}
                                        >
                                            {v.weight}
                                        </button>
                                    ))}
                                </div>
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
                                onClick={() => onAddToCart({ ...product, price: currentPrice, weight: currentWeight }, quantity)}
                                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/10"
                            >
                                Add to Cart
                            </button>
                        </div>
                        <button
                            onClick={() => onBuyNow({ ...product, price: currentPrice, weight: currentWeight }, quantity)}
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
