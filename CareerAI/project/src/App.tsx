import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Skills } from './pages/Skills';
import { Courses } from './pages/Courses';
import { Mentors } from './pages/Mentors';
import { Chat } from './pages/Chat';
import { Credentials } from './pages/Credentials';
import { VR } from './pages/VR';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Layout>
                  <Goals />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <Skills />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Courses />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentors"
            element={
              <ProtectedRoute>
                <Layout>
                  <Mentors />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Layout>
                  <Chat />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/credentials"
            element={
              <ProtectedRoute>
                <Layout>
                  <Credentials />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vr"
            element={
              <ProtectedRoute>
                <Layout>
                  <VR />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
