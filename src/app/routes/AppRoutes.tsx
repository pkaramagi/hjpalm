import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@/layouts/main';
import {
  ChangePasswordPage,
  ForgotPasswordPage,
  LockScreenPage,
  SignInPage,
  UserDetailsPage,
} from '@/features/auth/pages'; // Adjust the path based on your directory structure
import { ResumeLayout } from '@/features/resume/components/ResumeLayout';
import { ResumeSectionPage, ResumeViewPage } from '@/features/resume/pages';

import { HomePage } from '@/pages/home';

export function AppRoutes() {
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
      <Route path="/auth/user-details" element={<UserDetailsPage />} />
      <Route
        path="/resume"
        element={
          <MainLayout>
            <ResumeLayout />
          </MainLayout>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path=":sectionPath" element={<ResumeSectionPage />} />
        <Route path="/resume/view" element={<ResumeViewPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
