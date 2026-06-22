import { createFileRoute, Link } from '@tanstack/react-router'
import { useTasks } from '../store/tasksStore'
import { StatusBadge } from '../components/StatusBadge'
import { useMemo } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: 'var(--card-bg, #fff)', borderRadius: 16, padding: '20px 24px',
      border: '1px solid var(--border-color, #E5E7EB)', flex: 1, minWidth: 160,
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      transition: 'all 0.2s ease',
    }}>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted, #6B7280)', fontWeight: 600 }}>{label}</p>
      <p style={{ margin: '8px 0 0', fontSize: 36, fontWeight: 700, color }}>{value}</p>
    </div>
  )
}

function HomePage() {
  const { tasks } = useTasks()

  // Métricas do workspace
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const pending = tasks.filter(t => t.status === 'pending').length
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  // Validação de prazos vencidos
  const todayStr = new Date().toISOString().slice(0, 10)
  const overdueTasksCount = tasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'done').length

  const recent = [...tasks]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3)

  const chartData = useMemo(() => {
    if (total === 0) return { strokeDash: '0 100' }
    const doneRatio = (done / total) * 100
    return { strokeDash: `${doneRatio} ${100 - doneRatio}` }
  }, [total, done])

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Título sem o botão (o botão agora fica na navbar global) */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>
          Visão geral
        </h1>
        <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
          Acompanhe o progresso do seu workspace
        </p>
      </div>

      {/* Alerta de Vencidos */}
      {overdueTasksCount > 0 && (
        <div style={{
          background: 'var(--alert-bg, #FEF2F2)', border: '1px solid', borderColor: 'var(--alert-border, #FCA5A5)',
          borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--alert-text, #991B1B)' }}>
            Atenção: Tens {overdueTasksCount} tarefa(s) prioritária(s) com o prazo de entrega vencido!
          </span>
        </div>
      )}

      {/* Grid de Estatísticas */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total de tarefas" value={total} color="var(--text-main)" />
        <StatCard label="Concluídas" value={done} color="#059669" />
        <StatCard label="Em andamento" value={inProgress} color="#2563EB" />
        <StatCard label="Pendentes" value={pending} color="#D97706" />
        <StatCard label="Alta prioridade" value={highPriority} color="#DC2626" />
      </div>

      {/* Seção Central: Progresso + Gráfico */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
        
        <div style={{
          background: 'var(--card-bg)', borderRadius: 16, padding: '24px 28px',
          border: '1px solid var(--border-color)', flex: 2, minWidth: 300,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 15 }}>Progresso geral</span>
            <span style={{ fontWeight: 700, color: '#4F46E5', fontSize: 15 }}>{pct}%</span>
          </div>
          <div style={{ background: 'var(--progress-bg, #E5E7EB)', borderRadius: 999, height: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #4F46E5, #6366F1)',
              borderRadius: 999, transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            {done} de {total} tarefas completadas com sucesso.
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)', borderRadius: 16, padding: '20px 24px',
          border: '1px solid var(--border-color)', flex: 1, minWidth: 240,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: 20
        }}>
          <div style={{ position: 'relative', width: 90, height: 90 }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--progress-bg, #F3F4F6)" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4F46E5" strokeWidth="4"
                strokeDasharray={chartData.strokeDash} strokeDashoffset="0" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--text-main)'
            }}>
              {pct}%
            </div>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>Taxa de Entrega</h4>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)', lineHeight: '16px' }}>
              Proporção visual de itens finalizados dentro do sistema.
            </p>
          </div>
        </div>

      </div>

      {/* Lista de Recentes */}
      <div style={{
        background: 'var(--card-bg)', borderRadius: 16, padding: '24px 28px', border: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Tarefas recentes</h2>
          <Link to="/tasks" style={{ color: '#4F46E5', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Ver todas →
          </Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: 12 }}>Nenhuma tarefa encontrada.</p>
          ) : (
            recent.map(task => (
              <Link key={task.id} to="/tasks/$id" params={{ id: task.id }} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 18px', background: 'var(--item-bg, #F9FAFB)', borderRadius: 12,
                  border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateX(4px)'
                    e.currentTarget.style.borderColor = '#4F46E5'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.borderColor = 'var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ 
                      fontWeight: 600, 
                      color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-main)', 
                      fontSize: 14,
                      textDecoration: task.status === 'done' ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span style={{ fontSize: 12, color: task.dueDate < todayStr && task.status !== 'done' ? '#EF4444' : 'var(--text-muted)', fontWeight: task.dueDate < todayStr && task.status !== 'done' ? 600 : 400 }}>
                        Prazo: {task.dueDate} {task.dueDate < todayStr && task.status !== 'done' ? '(Vencida)' : ''}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}