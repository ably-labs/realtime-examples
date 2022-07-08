import { Outlet } from 'react-router-dom'
import InfoCard from './InfoCard'

const Layout = () => {
  return (
    <main className="h-screen flex items-center justify-center font-sans">
      <Outlet />
      <div className="absolute left-12 bottom-12">
        <InfoCard />
      </div>
    </main>
  )
}

export default Layout
