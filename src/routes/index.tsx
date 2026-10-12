import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { StudentsPage } from '../pages/admin/StudentsPage';
import { StudentProfilePage } from '../pages/admin/StudentProfilePage';
import { TeachersPage } from '../pages/admin/TeachersPage';
import { TeacherProfilePage } from '../pages/admin/TeacherProfilePage';
import { ClassesPage } from '../pages/admin/ClassesPage';
import { AttendancePage } from '../pages/admin/AttendancePage';
import { ResultsPage } from '../pages/admin/ResultsPage';
import { FeesPage } from '../pages/admin/FeesPage';
import { TimetablePage } from '../pages/admin/TimetablePage';
import { AnnouncementsPage } from '../pages/admin/AnnouncementsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

// Teacher Pages
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { TeacherClassesPage } from '../pages/teacher/TeacherClassesPage';
import { TeacherAttendancePage } from '../pages/teacher/TeacherAttendancePage';
import { TeacherGradesPage } from '../pages/teacher/TeacherGradesPage';
import { TeacherTimetablePage } from '../pages/teacher/TeacherTimetablePage';
import { TeacherAnnouncementsPage } from '../pages/teacher/TeacherAnnouncementsPage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentResultsPage } from '../pages/student/StudentResultsPage';
import { StudentAttendancePage } from '../pages/student/StudentAttendancePage';
import { StudentTimetablePage } from '../pages/student/StudentTimetablePage';
import { StudentFeesPage } from '../pages/student/StudentFeesPage';
import { StudentAnnouncementsPage } from '../pages/student/StudentAnnouncementsPage';

// Parent Pages
import { ParentDashboard } from '../pages/parent/ParentDashboard';
import { ParentResultsPage } from '../pages/parent/ParentResultsPage';
import { ParentAttendancePage } from '../pages/parent/ParentAttendancePage';
import { ParentFeesPage } from '../pages/parent/ParentFeesPage';
import { ParentAnnouncementsPage } from '../pages/parent/ParentAnnouncementsPage';

export const AppRoutes: React.FC = () => {
  const { role } = useAuth();

  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root redirector */}
      <Route
        path="/"
        element={
          role ? <Navigate to={`/${role}/dashboard`} replace /> : <Navigate to="/login" replace />
        }
      />

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentProfilePage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="teachers/:id" element={<TeacherProfilePage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* TEACHER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/teacher" element={<DashboardLayout role="teacher" />}>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="attendance" element={<TeacherAttendancePage />} />
          <Route path="grades" element={<TeacherGradesPage />} />
          <Route path="timetable" element={<TeacherTimetablePage />} />
          <Route path="announcements" element={<TeacherAnnouncementsPage />} />
        </Route>
      </Route>

      {/* STUDENT ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<DashboardLayout role="student" />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="results" element={<StudentResultsPage />} />
          <Route path="attendance" element={<StudentAttendancePage />} />
          <Route path="timetable" element={<StudentTimetablePage />} />
          <Route path="fees" element={<StudentFeesPage />} />
          <Route path="announcements" element={<StudentAnnouncementsPage />} />
        </Route>
      </Route>

      {/* PARENT ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
        <Route path="/parent" element={<DashboardLayout role="parent" />}>
          <Route index element={<Navigate to="/parent/dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="results" element={<ParentResultsPage />} />
          <Route path="attendance" element={<ParentAttendancePage />} />
          <Route path="fees" element={<ParentFeesPage />} />
          <Route path="announcements" element={<ParentAnnouncementsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          role ? <Navigate to={`/${role}/dashboard`} replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};
