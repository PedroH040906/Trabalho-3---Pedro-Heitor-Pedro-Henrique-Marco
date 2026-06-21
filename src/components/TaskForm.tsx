import { useState } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../types/task'

interface Props {
  initial?: Partial<Task>
  onSave: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function TaskForm({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'pending')
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('O título é obrigatório.'); return }
    onSave({ title: title.trim(), description, status, priority, dueDate: dueDate || undefined })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid #D1D5DB', fontSize: 14, boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit',
  }
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Título *</label>
        <input style={inputStyle} value={title} onChange={e => { setTitle(e.target.value); setError('') }} placeholder="Nome da tarefa" />
        {error && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{error}</p>}
      </div>

      <div>
        <label style={labelStyle}>Descrição</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Detalhes da tarefa..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
            <option value="pending">Pendente</option>
            <option value="in-progress">Em andamento</option>
            <option value="done">Concluída</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Prioridade</label>
          <select style={inputStyle} value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Prazo</label>
        <input type="date" style={inputStyle} value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
        <button type="button" onClick={onCancel} style={{
          padding: '8px 20px', borderRadius: 8, border: '1px solid #D1D5DB',
          background: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Cancelar
        </button>
        <button type="submit" style={{
          padding: '8px 20px', borderRadius: 8, border: 'none',
          background: '#4F46E5', color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Salvar tarefa
        </button>
      </div>
    </form>
  )
}
