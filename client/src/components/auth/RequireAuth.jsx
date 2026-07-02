import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-cream-100 dark:bg-forest-900">
        <div className="h-12 w-12 rounded-full border-4 border-forest-100 border-t-forest-600 animate-spin" aria-label="Loading" />
      </div>
    )
  }

  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location }} />

  return children
}
