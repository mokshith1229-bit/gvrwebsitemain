import React from 'react';

const ContactPage = () => {
    return (
        <div className="animate-in fade-in duration-500 py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-serif font-bold mb-6 text-stone-900">Contact Us</h1>
                    <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed text-lg">
                        We'd love to hear from you! Whether you have questions about our products, need support, or want to provide feedback, our team is here to help.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* Left Column: Contact Details */}
                    <div className="space-y-12">
                        <section>
                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-6">Store Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900 text-lg">GVR Cashew Merchants</p>
                                        <p className="text-amber-700 font-medium">gvrcashewmerchants.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900">Address</p>
                                        <p className="text-stone-500">GVR Cashew Merchants, Suryabagh, Leelamahal Jn., Visakhapatnam-530020</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-6">Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900">Call Us</p>
                                        <p className="text-stone-500">+91 98481 90498</p>
                                        <p className="text-stone-500">+91 77023 87008</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900">Email Us</p>
                                        <p className="text-stone-500">gvrcashewmerchants9@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4">Business Hours</h3>
                            <p className="text-stone-900 font-bold mb-1">Mon - Sat: 10:00 AM - 10:00 PM</p>
                            <p className="text-stone-500 text-sm">We typically respond to inquiries between these hours during business days.</p>
                        </section>
                    </div>

                    {/* Right Column: Support & Follow */}
                    <div className="space-y-12">
                        <section>
                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-6">Customer Support</h3>
                            <p className="text-stone-600 mb-6 text-sm italic">Our customer support team is available to assist you with:</p>
                            <ul className="space-y-4">
                                {[
                                    { text: 'Product inquiries and information', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                    { text: 'Order status and shipping updates', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1' },
                                    { text: 'Returns and refund requests', icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3' },
                                    { text: 'Technical support & Feedback', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-stone-700 group">
                                        <svg className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                        <span className="text-sm font-medium">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-6">Follow Us</h3>
                            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                                Stay connected with us for the latest updates, promotions, and news about our products and services.
                            </p>
                            <div className="flex gap-4">
                                {['Instagram', 'Facebook', 'WhatsApp'].map((platform) => (
                                    <button key={platform} className="px-6 py-3 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all">
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="pt-8 border-t border-stone-100">
                            <p className="text-stone-400 text-sm italic">
                                Thank you for choosing GVR Cashew Merchants. We look forward to serving you!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
