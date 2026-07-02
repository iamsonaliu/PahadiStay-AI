import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'

import Home from './pages/Home'
import Homestays from './pages/Homestays'
import HomestayDetail from './pages/HomestayDetail'
import Planner from './pages/Planner'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import RequireAuth from './components/auth/RequireAuth'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Bookings from './pages/dashboard/Bookings'
import Reviews from './pages/dashboard/Reviews'
import Analytics from './pages/dashboard/Analytics'

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/homestays" element={<Homestays />} />
                <Route path="/homestays/:id" element={<HomestayDetail />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
                  element={<RequireAuth><DashboardLayout /></RequireAuth>}
                >
                  <Route index element={<Overview />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
