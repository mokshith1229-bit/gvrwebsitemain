import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="animate-in fade-in duration-500 py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold mb-4 text-stone-900">Shipping Policy</h1>
                    <p className="text-stone-500 text-sm italic">Last updated: 03 September 2025</p>
                </div>

                <div className="space-y-12 text-stone-600 leading-relaxed">
                    {/* Welcome */}
                    <section>
                        <p className="text-lg">Thank you for shopping at <span className="text-amber-700 font-medium">gvrcashewmerchants.com</span>.</p>
                        <p className="mt-4">This Shipping Policy outlines the terms and conditions for shipping and delivery of products purchased from our store. Please read this policy carefully before placing your order.</p>
                    </section>

                    {/* Interpretation and Definitions */}
                    <section className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Interpretation and Definitions</h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-stone-900 mb-2">Interpretation</h4>
                                <p className="text-sm">The words in which the initial letter is capitalised have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in the plural.</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-stone-900 mb-3">Definitions</h4>
                                <ul className="grid md:grid-cols-2 gap-4 text-sm">
                                    <li className="flex gap-2"><strong>Company:</strong> GVR Cashew Merchants</li>
                                    <li className="flex gap-2"><strong>Goods:</strong> Items offered for sale.</li>
                                    <li className="flex gap-2"><strong>Orders:</strong> Request by you to purchase goods.</li>
                                    <li className="flex gap-2"><strong>Website:</strong> gvrcashewmerchants.com</li>
                                    <li className="flex gap-2"><strong>Shipping:</strong> Process of delivering goods.</li>
                                    <li className="flex gap-2"><strong>Delivery:</strong> Receipt of goods by customer.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Shipping Information */}
                    <section className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-bold text-stone-800 mb-4">Processing Time</h3>
                            <p className="text-sm">Orders are typically processed within <strong>1-2 business days</strong> after payment confirmation. During peak seasons or sales, processing times may be extended to 3-5 business days.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-stone-800 mb-4">Shipping Methods</h3>
                            <p className="text-sm">We offer standard shipping with delivery times of <strong>3-7 business days</strong>. Costs and times may vary based on your location and total weight.</p>
                        </div>
                    </section>

                    {/* Delivery & Address */}
                    <section className="space-y-8">
                        <div className="border-l-4 border-amber-600 pl-6">
                            <h3 className="text-xl font-bold text-stone-800 mb-2">Delivery Address</h3>
                            <p className="text-sm">Please ensure that your delivery address is complete and accurate. We are not responsible for delays or failed deliveries due to incorrect or incomplete address information.</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-stone-800 mb-4">Order Tracking</h3>
                            <p className="text-sm">Once your order ships, you will receive a confirmation email with tracking information. You can track your order status through our website or using the tracking number provided by our shipping partner.</p>
                        </div>
                    </section>

                    {/* International & Restrictions */}
                    <section className="bg-stone-900 text-stone-300 p-8 rounded-3xl">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">International Shipping</h3>
                                <p className="text-sm leading-relaxed">We ship worldwide. International times and costs vary significantly based on destination. Customers are responsible for any customs duties, taxes, or fees applied by their country.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Shipping Restrictions</h3>
                                <p className="text-sm leading-relaxed">Some items may have restrictions due to size, weight, or regulatory requirements. These will be clearly indicated on the product page during your purchase.</p>
                            </div>
                        </div>
                    </section>

                    {/* Damaged & Lost */}
                    <section>
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Damaged or Lost Packages</h3>
                        <p className="text-sm">If your package arrives damaged or is lost in transit, please contact us immediately. We will work with our shipping partners to resolve the issue and ensure you receive your order or a full refund.</p>
                    </section>

                    {/* Contact Us */}
                    <section className="pt-12 border-t text-center">
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Contact Us</h3>
                        <div className="grid sm:grid-cols-3 gap-6 text-sm">
                            <div>
                                <p className="font-bold text-stone-900 mb-1">Email</p>
                                <p>gvrcashewmerchants9@gmail.com</p>
                            </div>
                            <div>
                                <p className="font-bold text-stone-900 mb-1">Phone</p>
                                <p>+91 98481 90498</p>
                                <p>+91 77023 87008</p>
                            </div>
                            <div>
                                <p className="font-bold text-stone-900 mb-1">Address</p>
                                <p>Suryabagh, Leelamahal Jn.</p>
                                <p>Visakhapatnam-530020</p>
                            </div>
                        </div>
                        <p className="mt-12 text-xs text-stone-400">We reserve the right to modify this Shipping Policy at any time. Changes will be effective immediately upon posting to our website.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
