import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import des composants
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import BooksPage from './pages/BooksPage';
import LibrariesPage from './pages/LibrariesPage';
import LibraryPage from './pages/LibraryPage';
import BookDetailPage from './pages/BookDetailPage';
import FaqPage from './pages/FaqPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Composant pour protéger l'accès à l'application
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/bibliotheques"
            element={<LibrariesPage />}
          />
          {/* Ancienne route conservée avec redirection propre */}
          <Route
            path="/libraries"
            element={<Navigate to="/bibliotheques" replace />}
          />
          <Route
            path="/livres"
            element={<BooksPage />}
          />
          <Route
            path="/bibliotheque/:id"
            element={<LibraryPage />}
          />
          <Route
            path="/livre/:id"
            element={<BookDetailPage />}
          />
          <Route
            path="/faq"
            element={<FaqPage />}
          />
          {/* Routes legacy redirections */}
          <Route path="/books" element={<Navigate to="/livres" replace />} />
          <Route path="/book/:id" element={<Navigate to="/livre/:id" replace />} />
          <Route path="/library/:id" element={<Navigate to="/bibliotheque/:id" replace />} />
          <Route
            path="/admin"
            element={<ProtectedRoute permission="ADMIN_DASHBOARD"><AdminDashboard /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;