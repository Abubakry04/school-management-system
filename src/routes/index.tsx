import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/PageLoader';

// Helper for lazy loading named exports
const lazyNamed = <T extends Record<string, any>, K extends keyof T>(
  loader: () => Promise<T>,
  name: K
) => lazy(() => loader().then((m) => ({ default: m[name] as React.ComponentType<any> })));

// Auth Pages
const LoginPage = lazyNamed(() => import('../pages/auth/LoginPage'), 'LoginPage');
const NotFoundPage = lazyNamed(() => import('../pages/common/NotFoundPage'), 'NotFoundPage');

// Admin Pages
const AdminDashboard = lazyNamed(() => import('../pages/admin/AdminDashboard'), 'AdminDashboard');
const StudentsPage = lazyNamed(() => import('../pages/admin/StudentsPage'), 'StudentsPage');
const StudentProfilePage = lazyNamed(() => import('../pages/admin/StudentProfilePage'), 'StudentProfilePage');
const TeachersPage = lazyNamed(() => import('../pages/admin/TeachersPage'), 'TeachersPage');
const TeacherProfilePage = lazyNamed(() => import('../pages/admin/TeacherProfilePage'), 'TeacherProfilePage');
const ClassesPage = lazyNamed(() => import('../pages/admin/ClassesPage'), 'ClassesPage');
const SubjectsPage = lazyNamed(() => import('../pages/admin/SubjectsPage'), 'SubjectsPage');
const AdmissionsPage = lazyNamed(() => import('../pages/admin/AdmissionsPage'), 'AdmissionsPage');
const AttendancePage = lazyNamed(() => import('../pages/admin/AttendancePage'), 'AttendancePage');
const ResultsPage = lazyNamed(() => import('../pages/admin/ResultsPage'), 'ResultsPage');
const FeesPage = lazyNamed(() => import('../pages/admin/FeesPage'), 'FeesPage');
const TimetablePage = lazyNamed(() => import('../pages/admin/TimetablePage'), 'TimetablePage');
const AnnouncementsPage = lazyNamed(() => import('../pages/admin/AnnouncementsPage'), 'AnnouncementsPage');
const SettingsPage = lazyNamed(() => import('../pages/admin/SettingsPage'), 'SettingsPage');

// Teacher Pages
const TeacherDashboard = lazyNamed(() => import('../pages/teacher/TeacherDashboard'), 'TeacherDashboard');
const TeacherClassesPage = lazyNamed(() => import('../pages/teacher/TeacherClassesPage'), 'TeacherClassesPage');
const TeacherAttendancePage = lazyNamed(() => import('../pages/teacher/TeacherAttendancePage'), 'TeacherAttendancePage');
const TeacherGradesPage = lazyNamed(() => import('../pages/teacher/TeacherGradesPage'), 'TeacherGradesPage');
const TeacherAssignmentsPage = lazyNamed(() => import('../pages/teacher/TeacherAssignmentsPage'), 'TeacherAssignmentsPage');
const TeacherTimetablePage = lazyNamed(() => import('../pages/teacher/TeacherTimetablePage'), 'TeacherTimetablePage');
const TeacherAnnouncementsPage = lazyNamed(() => import('../pages/teacher/TeacherAnnouncementsPage'), 'TeacherAnnouncementsPage');

// Student Pages
const StudentDashboard = lazyNamed(() => import('../pages/student/StudentDashboard'), 'StudentDashboard');
const StudentResultsPage = lazyNamed(() => import('../pages/student/StudentResultsPage'), 'StudentResultsPage');
const StudentAssignmentsPage = lazyNamed(() => import('../pages/student/StudentAssignmentsPage'), 'StudentAssignmentsPage');
const StudentAttendancePage = lazyNamed(() => import('../pages/student/StudentAttendancePage'), 'StudentAttendancePage');
const StudentTimetablePage = lazyNamed(() => import('../pages/student/StudentTimetablePage'), 'StudentTimetablePage');
const StudentFeesPage = lazyNamed(() => import('../pages/student/StudentFeesPage'), 'StudentFeesPage');
const StudentAnnouncementsPage = lazyNamed(() => import('../pages/student/StudentAnnouncementsPage'), 'StudentAnnouncementsPage');

// Parent Pages
const ParentDashboard = lazyNamed(() => import('../pages/parent/ParentDashboard'), 'ParentDashboard');
const ParentResultsPage = lazyNamed(() => import('../pages/parent/ParentResultsPage'), 'ParentResultsPage');
const ParentAttendancePage = lazyNamed(() => import('../pages/parent/ParentAttendancePage'), 'ParentAttendancePage');
const ParentFeesPage = lazyNamed(() => import('../pages/parent/ParentFeesPage'), 'ParentFeesPage');
const ParentAnnouncementsPage = lazyNamed(() => import('../pages/parent/ParentAnnouncementsPage'), 'ParentAnnouncementsPage');

export const AppRoutes: React.FC = () => {
  const { role } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
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
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="admissions" element={<AdmissionsPage />} />
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
            <Route path="assignments" element={<TeacherAssignmentsPage />} />
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
            <Route path="assignments" element={<StudentAssignmentsPage />} />
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

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
