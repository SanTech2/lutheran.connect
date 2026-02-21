import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import About from './About';
import Academics from './Academics';
import Admissions from './Admissions';
import Contact from './Contact';
import Login from './Login';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersTable from './pages/admin/UsersTable';
import FinancePage from './pages/admin/FinancePage';
import ClassesPage from './pages/admin/ClassesPage';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AttendancePage from './pages/teacher/AttendancePage';
import GradesEntry from './pages/teacher/GradesEntry';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyGrades from './pages/student/MyGrades';
import MyAttendance from './pages/student/MyAttendance';
import MyFees from './pages/student/MyFees';

// Parent pages
import ParentDashboard from './pages/parent/ParentDashboard';

import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  ClipboardCheck,
  PenSquare,
  GraduationCap,
  Calendar,
} from 'lucide-react';

// Nav configs
const adminNavItems = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Classes', path: '/admin/classes', icon: BookOpen },
  { name: 'Finance', path: '/admin/finance', icon: CreditCard },
];

const teacherNavItems = [
  { name: 'Overview', path: '/teacher', icon: LayoutDashboard },
  { name: 'Attendance', path: '/teacher/attendance', icon: ClipboardCheck },
  { name: 'Grades', path: '/teacher/grades', icon: PenSquare },
];

const studentNavItems = [
  { name: 'Overview', path: '/student', icon: LayoutDashboard },
  { name: 'My Grades', path: '/student/grades', icon: GraduationCap },
  { name: 'Attendance', path: '/student/attendance', icon: Calendar },
  { name: 'Fees', path: '/student/fees', icon: CreditCard },
];

const parentNavItems = [
  { name: 'Overview', path: '/parent', icon: LayoutDashboard },
];

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="academics" element={<Academics />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<DashboardLayout items={adminNavItems} title="Admin Portal" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersTable />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="finance" element={<FinancePage />} />
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher" element={<DashboardLayout items={teacherNavItems} title="Teacher Portal" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="grades" element={<GradesEntry />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<DashboardLayout items={studentNavItems} title="Student Portal" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="grades" element={<MyGrades />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="fees" element={<MyFees />} />
          </Route>
        </Route>

        {/* Parent Routes */}
        <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
          <Route path="/parent" element={<DashboardLayout items={parentNavItems} title="Parent Portal" />}>
            <Route index element={<ParentDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
