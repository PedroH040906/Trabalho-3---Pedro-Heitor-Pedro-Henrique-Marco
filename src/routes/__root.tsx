import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navbar } from '../components/Navbar'

export const Route = createRootRoute({
  component: () => (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
})
