import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IntroPage from './pages/auth/IntroPage';
import LoginPage from './pages/auth/LoginPage';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentGroups from './pages/student/StudentGroups';
import StudentTutors from './pages/student/StudentTutor';
import StudentSchedule from './pages/student/StudentSchedule';
import StudentClasses from './pages/student/StudentClasses';
import StudentSessions from './pages/student/StudentSession';
import StudentFeedback from './pages/student/StudentFeedback';
import StudentDocuments from './pages/student/StudentDocuments';

import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorClasses from './pages/tutor/TutorClasses';
import TutorRequests from './pages/tutor/TutorRequest';
import TutorProgress from './pages/tutor/TutorProgress';
import TutorSchedule from './pages/tutor/TutorSchedule';
import TutorFeedback from './pages/tutor/TutorFeedback';
import TutorDocuments from './pages/tutor/TutorDocuments';

import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Không có navbar */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Có navbar */}
        <Route element={<Navbar />}>

          {/* Student */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/groups" element={<StudentGroups />} />
          <Route path="/student/schedule" element={<StudentSchedule />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/tutors" element={<StudentTutors />} />
          <Route path="/student/feedback" element={<StudentFeedback />} />
          <Route path="/student/documents" element={<StudentDocuments />} />
          <Route path="/student/sessions" element={<StudentSessions />} />

          {/* Tutor */}
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/classes" element={<TutorClasses />} />
          <Route path="/tutor/schedule" element={<TutorSchedule />} />
          <Route path="/tutor/progress" element={<TutorProgress />} />
          <Route path="/tutor/feedback" element={<TutorFeedback />} />
          <Route path="/tutor/documents" element={<TutorDocuments />} />
          <Route path="/tutor/requests" element={<TutorRequests />} />

          {/* Staff + Admin */}
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
