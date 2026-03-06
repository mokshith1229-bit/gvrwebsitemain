import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="animate-in fade-in duration-500 py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold mb-4 text-stone-900">Return and Refund Policy</h1>
                    <p className="text-stone-500 text-sm italic">Last updated: 15 October 2025</p>
                </div>

                <div className="space-y-12 text-stone-600 leading-relaxed">
                    {/* Welcome */}
                    <section>
                        <p className="text-lg">Thank you for shopping at <span className="text-amber-700 font-medium">gvrcashewmerchants.com</span>.</p>
                        <p className="mt-4">If for any reason, you are not completely satisfied with a purchase, we invite you to review our policy on refunds and returns. The following terms are applicable for any products that you’ve purchased from us.</p>
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
                                    <li className="flex gap-2"><strong>You:</strong> The individual or entity using the service.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Order Cancellation Rights */}
                    <section>
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Your Order Cancellation Rights</h3>
                        <p className="mb-4">You are entitled to cancel your order within <strong>14 days</strong> without giving any reason for doing so.</p>
                        <p className="text-sm italic mb-6">The deadline for canceling an Order is 14 days from the date on which you received the goods or on which a third party you have appointed takes possession of the product delivered.</p>

                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                            <p className="text-sm text-amber-900">In order to exercise your right of cancellation, you must inform us of your decision by means of a clear statement via email.</p>
                            <p className="mt-2 text-sm font-bold text-amber-900">We will reimburse you no later than 14 days from the day on which we receive the returned Goods.</p>
                        </div>
                    </section>

                    {/* Conditions for Returns */}
                    <section>
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Conditions for Returns</h3>
                        <p className="mb-6">In order for the Goods to be eligible for a return, please make sure that:</p>
                        <ul className="list-disc pl-5 space-y-3 mb-8">
                            <li>The goods were purchased in the last 14 days</li>
                            <li>The goods are in the original packaging</li>
                        </ul>

                        <h4 className="font-bold text-stone-900 mb-4 underline decoration-amber-500 underline-offset-4">The following goods cannot be returned:</h4>
                        <ul className="grid md:grid-cols-2 gap-6">
                            {[
                                "Personalized or clearly customized goods.",
                                "Perishable goods or items past their expiry date.",
                                "Items unsealed after delivery (hygiene/health protection).",
                                "Items inseparably mixed with other items after delivery."
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-sm bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                                    <span className="text-amber-600 font-bold">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Returning Goods */}
                    <section className="bg-stone-900 text-stone-300 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-4">Returning Goods</h3>
                        <p className="text-sm leading-relaxed mb-6">You are responsible for the cost and risk of returning the goods to Us. You should send the goods to the following address:</p>
                        <p className="text-white font-medium mb-6">GVR Cashew Merchants, Suryabagh, Leelamahal Jn., Visakhapatnam-530020</p>
                        <p className="text-xs italic opacity-70">We recommend an insured and trackable mail service. We cannot be held responsible for goods damaged or lost in return shipment.</p>
                    </section>

                    {/* Contact Us */}
                    <section className="pt-12 border-t text-center">
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Contact Us</h3>
                        <div className="inline-flex flex-col sm:flex-row gap-8 text-sm bg-stone-50 px-10 py-6 rounded-2xl border border-stone-100">
                            <div>
                                <p className="font-bold text-stone-900 mb-1">Email</p>
                                <p>gvrcashewmerchants9@gmail.com</p>
                            </div>
                            <div className="w-px h-12 bg-stone-200 hidden sm:block"></div>
                            <div>
                                <p className="font-bold text-stone-900 mb-1">Phone</p>
                                <p>+91 98481 90498</p>
                                <p>+91 77023 87008</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
