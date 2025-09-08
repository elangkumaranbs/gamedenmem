import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateMember from './pages/CreateMember';
import ViewMembers from './pages/ViewMembers';
import ProtectedRoute from './components/ProtectedRoute';
import { SupabaseProvider } from './context/SupabaseContext';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

function App() {
  const { isLoading } = useAuthStore();

  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black premium-black-gradient">
          <Navbar />
          <main className="w-full">
            {isLoading ? (
              <div className="min-h-screen premium-black-gradient flex items-center justify-center">
                <div className="text-center">
                  <div className="gaming-gradient w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-white">Initializing...</p>
                </div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/create-member"
                  element={
                    <ProtectedRoute>
                      <div className="pt-20 px-6 lg:px-12">
                        <CreateMember />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/view-members"
                  element={
                    <ProtectedRoute>
                      <div className="pt-20 px-6 lg:px-12">
                        <ViewMembers />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </SupabaseProvider>
  );
}

export default App;