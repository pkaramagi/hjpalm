import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { MainHorizontalLayout, MainLayout } from '@/layouts/main';
import {
  AccountSettingsPage,
  ChangePasswordPage,
  ForgotPasswordPage,
  LockScreenPage,
  SignInPage,
  UserDetailsPage,
} from '@/features/auth/pages'; // Adjust the path based on your directory structure
import { ResumeLayout } from '@/features/resume/components/ResumeLayout';
import {
  ResumeAddPage,
  ResumeHomePage,
  ResumeSearchPage,
  ResumeSectionPage,
  ResumeViewPage,
} from '@/features/resume/pages';
import { UserListPage } from '@/features/admin/pages/UserListPage';

import { HomePage } from '@/pages/home';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function AppRoutes() {
  const location = useLocation();
  const { locked } = useAuth();

  if (locked && location.pathname !== '/auth/lock-screen') {
    return <Navigate to="/auth/lock-screen" replace />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/lock-screen" element={<LockScreenPage />} />
      <Route path="/auth/change-password" element={<ChangePasswordPage />} />
      <Route path="/auth/settings" element={<MainLayout><AccountSettingsPage /> </MainLayout>} />
      <Route path="/auth/user-details" element={<UserDetailsPage />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/users" replace />}
      />
      <Route
        path="/admin/users"
        element={
          <MainLayout>
            <UserListPage />
          </MainLayout>
        }
      />
      <Route
        path="/resumes"
        element={
          <MainLayout>
            <ResumeHomePage />
          </MainLayout>
        }
      />
      <Route
        path="/resume/search"
        element={
          <MainLayout>
            <ResumeSearchPage />
          </MainLayout>
        }
      />
      <Route
        path="/resume/add"
        element={
          <MainLayout>
            <ResumeAddPage />
          </MainLayout>
        }
      />
      <Route
        path="/resume/:resumeId"
        element={
          <MainLayout>
            <ResumeLayout />
          </MainLayout>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="view" element={<ResumeViewPage />} />
        <Route path=":sectionPath" element={<ResumeSectionPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
