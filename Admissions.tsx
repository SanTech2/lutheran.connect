import React from 'react';
import { CheckCircle, Download, CreditCard } from 'lucide-react';

const Admissions: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">Join Our Family</h1>
                    <p className="text-lg text-gray-600">
                        We welcome students from all backgrounds to apply for admission to LISS.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Requirements */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                        <ul className="space-y-4">
                            {[
                                "Competed Application Form",
                                "Two Recent Passport Photos",
                                "Copy of Birth Certificate",
                                "Last School Report Card",
                                "Passing Entrance Exam Score",
                                "Interview with Administration"
                            ].map((req, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Process */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply</h2>
                        <div className="space-y-6">
                            {[
                                { step: 1, title: "Purchase Form", desc: "Buy an application form from the Business Office ($10 USD / 2000 LRD)." },
                                { step: 2, title: "Submit Documents", desc: "Return the completed form with all required documents." },
                                { step: 3, title: "Entrance Exam", desc: "Sit for the placement test in Math and English." },
                                { step: 4, title: "Enrollment", desc: "Upon acceptance, pay the registration fees to secure the spot." },
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                                        {step.step}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{step.title}</h4>
                                        <p className="text-sm text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fees Info */}
                <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">School Fees & Payments</h3>
                            <p className="text-gray-600 mb-4">
                                We accept tuition payments in both United States Dollars (USD) and Liberian Dollars (LRD).
                                Parents can conveniently pay via Mobile Money (Orange Money / MTN Momo) or direct bank deposit.
                            </p>
                            <button className="text-blue-700 font-bold hover:underline">
                                View Current Fee Schedule →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-10 rounded-full shadow-xl transition-all flex items-center gap-2 mx-auto">
                        <Download size={20} />
                        Download Application Form
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Admissions;
