import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.style.setProperty('--bg-main', '#0F172A')
      root.style.setProperty('--card-bg', '#1E293B')
      root.style.setProperty('--item-bg', '#1E293B')
      root.style.setProperty('--border-color', '#334155')
      root.style.setProperty('--text-main', '#F8FAFC')
      root.style.setProperty('--text-muted', '#94A3B8')
      root.style.setProperty('--progress-bg', '#334155')
      root.style.setProperty('--alert-bg', '#7F1D1D')
      root.style.setProperty('--alert-border', '#991B1B')
      root.style.setProperty('--alert-text', '#FEE2E2')
      root.style.backgroundColor = '#0F172A'
      localStorage.setItem('theme', 'dark')
    } else {
      root.style.setProperty('--bg-main', '#F9FAFB')
      root.style.setProperty('--card-bg', '#fff')
      root.style.setProperty('--item-bg', '#F9FAFB')
      root.style.setProperty('--border-color', '#E5E7EB')
      root.style.setProperty('--text-main', '#1E1B4B')
      root.style.setProperty('--text-muted', '#6B7280')
      root.style.setProperty('--progress-bg', '#E5E7EB')
      root.style.setProperty('--alert-bg', '#FEF2F2')
      root.style.setProperty('--alert-border', '#FCA5A5')
      root.style.setProperty('--alert-text', '#991B1B')
      root.style.backgroundColor = '#F9FAFB'
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-main)', 
      color: 'var(--text-main)',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {/* Barra de Navegação Superior Oficial */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', background: darkMode ? '#1E1B4B' : '#1E1B4B', // Mantém roxo ou muda se quiser
        color: '#fff', marginBottom: 32
      }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>✓ TaskFlow</span>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Início</Link>
          <Link to="/tasks" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tarefas</Link>
        </div>
        
        {/* O botão de trocar de tema agora fica acessível em todas as abas! */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '6px 14px', background: darkMode ? '#334155' : 'rgba(255,255,255,0.15)',
            border: 'none', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}
        >
          {darkMode ? '☀️ Claro' : '🌙 Escuro'}
        </button>
      </nav>

      {/* Conteúdo da página injetado de forma segura */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
        <Outlet />
      </div>
    </div>
  )
}