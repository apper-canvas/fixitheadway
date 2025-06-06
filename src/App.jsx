import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import HomePage from '@/components/pages/HomePage'
import LoginPage from '@/components/pages/auth/LoginPage'
import RegisterPage from '@/components/pages/auth/RegisterPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-opacity duration-300">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/">
                    <LoginPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/">
                    <RegisterPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
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
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App