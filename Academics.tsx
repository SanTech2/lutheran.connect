import React from 'react';
import { BookOpen, GraduationCap, Microscope, Calculator } from 'lucide-react';

const Academics: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">Academic Excellence</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our comprehensive curriculum challenges students to think critically and prepares them for success in a global society.
                    </p>
                </div>

                {/* Divisions */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: "Elementary School", grades: "Grades 1-6", desc: "Building a strong foundation in literacy, numeracy, and social skills." },
                        { title: "Junior High", grades: "Grades 7-9", desc: "Fostering independence and exploring new subjects and interests." },
                        { title: "Senior High", grades: "Grades 10-12", desc: "Preparing for WAEC and higher education with rigorous coursework." },
                    ].map((div, i) => (
                        <div key={i} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{div.title}</h3>
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                                {div.grades}
                            </span>
                            <p className="text-gray-600">{div.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Departments */}
                <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Departments</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: BookOpen, name: "Language Arts", color: "text-red-500", bg: "bg-red-50" },
                            { icon: Calculator, name: "Mathematics", color: "text-blue-500", bg: "bg-blue-50" },
                            { icon: Microscope, name: "Science", color: "text-green-500", bg: "bg-green-50" },
                            { icon: GraduationCap, name: "Social Studies", color: "text-purple-500", bg: "bg-purple-50" },
                        ].map((dept, i) => (
                            <div key={i} className={`${dept.bg} p-6 rounded-xl text-center hover:transform hover:scale-105 transition-transform`}>
                                <dept.icon className={`h-10 w-10 ${dept.color} mx-auto mb-3`} />
                                <h4 className="font-bold text-gray-800">{dept.name}</h4>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Calendar Note */}
                <div className="bg-blue-900 text-white rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Academic Calendar</h3>
                    <p className="mb-6">
                        We follow the Ministry of Education's academic calendar, consisting of two semesters per year.
                        The First Semester typically runs from September to January, and the Second Semester from February to June.
                    </p>
                    <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg transition-colors">
                        Download 2024-2025 Calendar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Academics;
