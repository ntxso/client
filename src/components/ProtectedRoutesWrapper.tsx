// ProtectedRoutesWrapper.tsx adında yeni bir bileşen oluşturun
import { Outlet } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const ProtectedRoutesWrapper = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}

export default ProtectedRoutesWrapper