import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import SafetyBanner from '@/components/layout/safety_banner';
import { ProtectedRoute, AdminRoute } from '@/src/components/ProtectedRoute';

// Public Pages
import HomePage from '@/src/pages/HomePage';
import PropertiesPage from '@/src/pages/PropertiesPage';
import PropertyDetailPage from '@/src/pages/PropertyDetailPage';
import SearchPage from '@/app/(public)/search/page';
import AboutPage from '@/app/(public)/about/page';
import ContactPage from '@/app/(public)/contact/page';
import HowItWorksPage from '@/app/(public)/how-it-works/page';
import SafetyPage from '@/app/(public)/safety/page';
import SupportPage from '@/app/(public)/support/page';
import TermsPage from '@/app/(public)/terms/page';
import PrivacyPage from '@/app/(public)/privacy/page';
import PricingPage from '@/app/(public)/privacy/pricing/page';
import BlogPage from '@/app/(public)/blog/page';
import NotFoundPage from '@/app/not-found';

// Auth Pages
import LoginPage from '@/app/(auth)/login/page';
import SignupPage from '@/app/(auth)/signup/page';
import ForgotPasswordPage from '@/app/(auth)/forgot_password/page';
import ResetPasswordPage from '@/app/(auth)/reset_password/page';

// Dashboard Pages
import DashboardPage from '@/app/dashboard/page';
import MyPropertiesPage from '@/app/dashboard/properties/page';
import NewPropertyPage from '@/app/dashboard/properties/new/page';
import PropertyEditPage from '@/app/dashboard/properties/[id]/page';
import MyInterestsPage from '@/app/dashboard/interests/page';
import NotificationsPage from '@/app/dashboard/notifications/page';
import ProfilePage from '@/app/dashboard/profile/page';
import SettingsPage from '@/app/dashboard/settings/page';

// Admin Pages
import AdminOverviewPage from '@/app/admin/page';
import AdminPropertiesPage from '@/app/admin/properties/page';
import AdminUsersPage from '@/app/admin/users/page';
import AdminPlansPage from '@/app/admin/plans/page';
import AdminReportsPage from '@/app/admin/reports/page';
import AdminSettingsPage from '@/app/admin/settings/page';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <SafetyBanner />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy/pricing" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot_password" element={<ForgotPasswordPage />} />
            <Route path="/reset_password" element={<ResetPasswordPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties"
              element={
                <ProtectedRoute>
                  <MyPropertiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties/new"
              element={
                <ProtectedRoute>
                  <NewPropertyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties/:id"
              element={
                <ProtectedRoute>
                  <PropertyEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/interests"
              element={
                <ProtectedRoute>
                  <MyInterestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminOverviewPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <AdminRoute>
                  <AdminPropertiesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <AdminRoute>
                  <AdminPlansPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <AdminReportsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettingsPage />
                </AdminRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
