import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './providers/WalletProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/auth/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { ProfileOnboarding } from './components/onboarding/ProfileOnboarding';
import { Layout } from './components/layout/Layout';
import { DiscoverPage } from './pages/DiscoverPage';
import { MatchesPage } from './pages/MatchesPage';
import { ProfilePage } from './pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AuthenticatedRedirect() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (user) {
    // Check if user needs to complete profile onboarding
    if (!user.profileCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/app/discover" replace />;
  }
  
  return <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthenticatedRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <ProfileOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="discover" element={<DiscoverPage />} />
                      <Route path="matches" element={<MatchesPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="*" element={<Navigate to="discover" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}

export default App;
