import { createFileRoute, Link } from '@tanstack/react-router'
import { useTasks } from '../store/tasksStore'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '24px 28px',
      border: '1px solid #E5E7EB', flex: 1, minWidth: 140,
    }}>
      <p style={{ margin: 0, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{label}</p>
      <p style={{ margin: '8px 0 0', fontSize: 36, fontWeight: 700, color }}>{value}</p>
    </div>
  )
}

function HomePage() {
  const { tasks } = useTasks()

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const pending = tasks.filter(t => t.status === 'pending').length
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const recent = [...tasks]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1E1B4B' }}>
          Visão geral
        </h1>
        <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: 15 }}>
          Acompanhe o progresso das suas tarefas
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total de tarefas" value={total} color="#1E1B4B" />
        <StatCard label="Concluídas" value={done} color="#059669" />
        <StatCard label="Em andamento" value={inProgress} color="#2563EB" />
        <StatCard label="Pendentes" value={pending} color="#D97706" />
        {highPriority > 0 && <StatCard label="Alta prioridade" value={highPriority} color="#DC2626" />}
      </div>

      {/* Barra de progresso */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '24px 28px',
        border: '1px solid #E5E7EB', marginBottom: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, color: '#1E1B4B', fontSize: 15 }}>Progresso geral</span>
          <span style={{ fontWeight: 700, color: '#4F46E5', fontSize: 15 }}>{pct}%</span>
        </div>
        <div style={{ background: '#E5E7EB', borderRadius: 99, height: 12, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
            borderRadius: 99, transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ margin: '10px 0 0', fontSize: 13, color: '#6B7280' }}>
          {done} de {total} tarefas concluídas
        </p>
      </div>

      {/* Tarefas recentes */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1px solid #E5E7EB',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1E1B4B' }}>Tarefas recentes</h2>
          <Link to="/tasks" style={{ color: '#4F46E5', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Ver todas →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recent.map(task => (
            <Link key={task.id} to="/tasks/$id" params={{ id: task.id }} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 10, border: '1px solid #F3F4F6', background: '#FAFAFA',
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#C7D2FE')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#F3F4F6')}
              >
                <span style={{ fontSize: 18 }}>
                  {task.status === 'done' ? '✅' : task.status === 'in-progress' ? '🔄' : '⏳'}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0, fontSize: 14, fontWeight: 600,
                    color: task.status === 'done' ? '#9CA3AF' : '#111827',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                      Prazo: {task.dueDate}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
