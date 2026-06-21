import { Link } from '@tanstack/react-router'

export function Navbar() {
  return (
    <nav style={{
      background: '#1E1B4B',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      height: 56,
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    }}>
      <span style={{ color: '#A5B4FC', fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>
        ✓ TaskFlow
      </span>
      <Link
        to="/"
        style={{ color: '#C7D2FE', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
        activeProps={{ style: { color: '#fff', borderBottom: '2px solid #818CF8', paddingBottom: 2 } }}
      >
        Início
      </Link>
      <Link
        to="/tasks"
        style={{ color: '#C7D2FE', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
        activeProps={{ style: { color: '#fff', borderBottom: '2px solid #818CF8', paddingBottom: 2 } }}
      >
        Tarefas
      </Link>
    </nav>
  )
}
