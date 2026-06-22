import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Homestays from './pages/Homestays'
import Planner from './pages/Planner'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardOverview from './pages/dashboard/Overview'
import ComponentShowcase from './pages/ComponentShowcase'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homestays" element={<Homestays />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/components" element={<ComponentShowcase />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}