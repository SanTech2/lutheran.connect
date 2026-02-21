import React from 'react';
import { ArrowRight, Book, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-blue-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 opacity-90"></div>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-800/50 border border-blue-400/30 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm">
                        Excellence in Education Since 1990
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Building Leaders <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">For Tomorrow</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Lutheran International School System provides a world-class education rooted in Christian values, fostering academic excellence and character development in Liberia.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/admissions" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2">
                            Apply Now <ArrowRight size={20} />
                        </Link>
                        <Link to="/about" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center">
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Curved Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-gray-50">
                        <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
                        {[
                            {
                                icon: Book,
                                title: "Academic Excellence",
                                desc: "Rigorous curriculum designed to challenge and inspire students to reach their full potential."
                            },
                            {
                                icon: Users,
                                title: "Experienced Faculty",
                                desc: "Dedicated teachers committed to nurturing every student's individual talents and needs."
                            },
                            {
                                icon: Trophy,
                                title: "Holistic Development",
                                desc: "Focus on sports, arts, and character building alongside traditional academics."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-t-4 border-blue-600">
                                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                    <feature.icon className="text-blue-600 h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "30+", label: "Years of Excellence" },
                            { number: "1500+", label: "Students Enrolled" },
                            { number: "100%", label: "Graduation Rate" },
                            { number: "50+", label: "Qualified Teachers" },
                        ].map((stat, i) => (
                            <div key={i} className="p-6">
                                <div className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">{stat.number}</div>
                                <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-800 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
                    <p className="text-blue-200 mb-10 max-w-2xl mx-auto text-lg">
                        Admissions are open for the upcoming academic year. Secure a spot for your child today and invest in their future.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/admissions" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg transition-colors">
                            Start Application
                        </Link>
                        <Link to="/contact" className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors border border-blue-700">
                            Contact Admissions
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
