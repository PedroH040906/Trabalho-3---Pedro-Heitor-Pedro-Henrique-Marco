import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTasks } from '../../store/tasksStore'
import { StatusBadge } from '../../components/StatusBadge'
import { PriorityBadge } from '../../components/PriorityBadge'
import { TaskForm } from '../../components/TaskForm'
import type { Task } from '../../types/task'

export const Route = createFileRoute('/tasks/$id')({
  component: TaskDetailPage,
})

function TaskDetailPage() {
  const { id } = Route.useParams()
  const { getTaskById, updateTask, deleteTask } = useTasks()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  const task = getTaskById(id)

  if (!task) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ fontSize: 48, margin: 0 }}>🔍</p>
        <h2 style={{ color: '#1E1B4B', marginTop: 16 }}>Tarefa não encontrada</h2>
        <Link to="/tasks" style={{ color: '#4F46E5', fontWeight: 600 }}>← Voltar para tarefas</Link>
      </div>
    )
  }

  function handleSave(data: Omit<Task, 'id' | 'createdAt'>) {
    updateTask({ ...task!, ...data })
    setEditing(false)
  }

  function handleDelete() {
    if (confirm('Excluir esta tarefa permanentemente?')) {
      deleteTask(task!.id)
      navigate({ to: '/tasks' })
    }
  }

  function cycleStatus() {
    const next = { pending: 'in-progress', 'in-progress': 'done', done: 'pending' } as const
    updateTask({ ...task!, status: next[task!.status] })
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: '#6B7280' }}>
        <Link to="/" style={{ color: '#4F46E5', textDecoration: 'none' }}>Início</Link>
        <span>/</span>
        <Link to="/tasks" style={{ color: '#4F46E5', textDecoration: 'none' }}>Tarefas</Link>
        <span>/</span>
        <span style={{ color: '#374151' }}>{task.title}</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {/* Header do card */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1E1B4B', lineHeight: 1.3 }}>
              {task.title}
            </h1>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => setEditing(true)} style={{
                padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB',
                background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                ✏️ Editar
              </button>
              <button onClick={handleDelete} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: '#FEE2E2', color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                🗑 Excluir
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Corpo */}
        <div style={{ padding: '24px 28px' }}>
          {editing ? (
            <>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1E1B4B' }}>Editar tarefa</h3>
              <TaskForm initial={task} onSave={handleSave} onCancel={() => setEditing(false)} />
            </>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Descrição
                </p>
                <p style={{ margin: 0, fontSize: 15, color: '#374151', lineHeight: 1.6 }}>
                  {task.description || <span style={{ color: '#D1D5DB' }}>Sem descrição.</span>}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>Criada em</p>
                  <p style={{ margin: 0, fontSize: 15, color: '#374151' }}>{task.createdAt}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>Prazo</p>
                  <p style={{ margin: 0, fontSize: 15, color: task.dueDate ? '#374151' : '#D1D5DB' }}>
                    {task.dueDate ?? 'Sem prazo definido'}
                  </p>
                </div>
              </div>

              {/* Ação rápida de status */}
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 20 }}>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: '#6B7280' }}>
                  Avançar status rapidamente:
                </p>
                <button onClick={cycleStatus} style={{
                  padding: '10px 20px', background: '#4F46E5', color: '#fff', border: 'none',
                  borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  {task.status === 'pending' && '▶ Iniciar tarefa'}
                  {task.status === 'in-progress' && '✔ Marcar como concluída'}
                  {task.status === 'done' && '↩ Reabrir tarefa'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/tasks" style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none' }}>
          ← Voltar para a lista
        </Link>
      </div>
    </div>
  )
}
