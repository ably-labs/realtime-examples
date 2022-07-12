import { Outlet } from 'react-router-dom'
import InfoCard from './InfoCard'

const Layout = () => {
  return (
    <main className="h-screen flex items-center justify-center font-sans">
      <Outlet />
      <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
        <InfoCard />
      </div>
    </main>
  )
}

export default Layout
