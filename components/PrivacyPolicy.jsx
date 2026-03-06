import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="animate-in fade-in duration-500 py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold mb-4 text-stone-900">Privacy Policy</h1>
                    <p className="text-stone-500 text-sm italic">Last updated: 15 October 2025</p>
                </div>

                <div className="space-y-12 text-stone-600 leading-relaxed text-sm lg:text-base">
                    {/* Welcome */}
                    <section>
                        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                        <p className="mt-4">We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
                    </section>

                    {/* Interpretation and Definitions */}
                    <section className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Interpretation and Definitions</h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-stone-900 mb-2">Interpretation</h4>
                                <p className="text-xs">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-stone-900 mb-3">Definitions</h4>
                                <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                                    <li><strong>Account:</strong> A unique account created for You.</li>
                                    <li><strong>Company:</strong> GVR Cashew Merchants, Visakhapatnam-530020.</li>
                                    <li><strong>Cookies:</strong> Small files placed on Your device.</li>
                                    <li><strong>Country:</strong> India</li>
                                    <li><strong>Device:</strong> Computer, cellphone or digital tablet.</li>
                                    <li><strong>Personal Data:</strong> Information relating to an identified individual.</li>
                                    <li><strong>Service:</strong> The Website (gvrcashewmerchants.com).</li>
                                    <li><strong>Usage Data:</strong> Data collected automatically (e.g. visit duration).</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Types of Data Collected */}
                    <section className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-stone-800 mb-4">Personal Data</h3>
                            <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information, including but not limited to:</p>
                            <ul className="flex flex-wrap gap-3 mt-4">
                                {['Email Address', 'First & Last Name', 'Phone Number', 'Full Address', 'ZIP/Postal Code'].map((item) => (
                                    <li key={item} className="bg-stone-100 px-4 py-2 rounded-full text-stone-700 font-medium text-xs">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-stone-800 mb-4">Usage Data</h3>
                            <p>Usage Data is collected automatically when using the Service. This may include Your Device's IP address, browser type, version, pages visited, time spent, and diagnostic data.</p>
                        </div>
                    </section>

                    {/* Tracking & Cookies */}
                    <section className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Tracking Technologies and Cookies</h3>
                        <p className="mb-6">We use Cookies and similar tracking technologies (beacons, tags, scripts) to track activity and improve Our Service.</p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                                <h4 className="font-bold text-stone-900 mb-2 text-sm">Essential Cookies</h4>
                                <p className="text-xs">Necessary to provide services and prevent fraudulent use of accounts.</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                                <h4 className="font-bold text-stone-900 mb-2 text-sm">Acceptance Cookies</h4>
                                <p className="text-xs">Identify if users have accepted the use of cookies on the Website.</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                                <h4 className="font-bold text-stone-900 mb-2 text-sm">Functionality Cookies</h4>
                                <p className="text-xs">Remember choices like login details or language preferences.</p>
                            </div>
                        </div>
                    </section>

                    {/* Use of Your Personal Data */}
                    <section>
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Use of Your Personal Data</h3>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                            {[
                                { title: "Service Maintenance", desc: "Monitor usage and maintain the Service." },
                                { title: "Account Management", desc: "Manage Your registration as a user." },
                                { title: "Contract Performance", desc: "Undertake purchase contracts for products." },
                                { title: "Contacting You", desc: "Via email, phone, or SMS regarding updates." },
                                { title: "Marketing", desc: "Provide news and special offers (opt-out available)." },
                                { title: "Business Transfers", desc: "Evaluate mergers or asset sales." }
                            ].map((item) => (
                                <div key={item.title} className="border-l-2 border-amber-600 pl-4">
                                    <h4 className="font-bold text-stone-900 text-sm mb-1">{item.title}</h4>
                                    <p className="text-xs">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Security & Retention */}
                    <section className="bg-stone-900 text-stone-300 p-8 rounded-3xl">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Retention of Data</h3>
                                <p className="text-xs leading-relaxed">We retain Your Personal Data only for as long as is necessary for the purposes set out in this policy, complying with legal obligations and resolving disputes.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Security</h3>
                                <p className="text-xs leading-relaxed">While We strive to use commercially acceptable means to protect Your Personal Data, remember that no method of transmission over the Internet is 100% secure.</p>
                            </div>
                        </div>
                    </section>

                    {/* Policy Updates */}
                    <section>
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Changes to this Policy</h3>
                        <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date.</p>
                    </section>

                    {/* Contact Us */}
                    <section className="pt-12 border-t text-center">
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Contact Us</h3>
                        <p className="text-stone-500 text-sm mb-4">If you have any questions about this Privacy Policy, You can contact us:</p>
                        <div className="inline-block bg-stone-50 px-8 py-4 rounded-2xl border border-stone-100">
                            <p className="font-bold text-stone-900 mb-1 text-sm">By Email</p>
                            <p className="text-amber-700 font-medium">gvrcashewmerchants9@gmail.com</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
