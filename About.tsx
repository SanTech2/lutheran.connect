import React from 'react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-900 py-12 px-8 text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">About Us</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto">
                        A tradition of excellence, faith, and community service.
                    </p>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Our History</h2>
                        <div className="prose text-gray-600 leading-relaxed">
                            <p>
                                Founded in 1990, the Lutheran International School System (LISS) has grown from a small community initiative to one of Liberia's premier educational institutions.
                                Despite the challenges faced by our nation, LISS has remained a beacon of hope and stability, providing uninterrupted quality education to thousands of students.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
                        <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                            <p className="text-lg text-blue-900 font-medium italic">
                                "To educate the whole child—spiritually, intellectually, physically, and socially—empowering them to serve God and humanity with integrity and excellence."
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Core Values</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Faith", desc: "We integrate Christian values into every aspect of learning." },
                                { title: "Excellence", desc: "We strive for the highest standards in academics and character." },
                                { title: "Integrity", desc: "We promote honesty and accountability in all actions." },
                                { title: "Service", desc: "We encourage students to give back to their communities." },
                            ].map((val, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700 font-bold min-w-[40px] text-center">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{val.title}</h3>
                                        <p className="text-gray-600 text-sm">{val.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;

