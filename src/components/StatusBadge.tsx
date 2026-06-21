import type { TaskStatus } from '../types/task'

const config: Record<TaskStatus, { label: string; style: React.CSSProperties }> = {
  pending: {
    label: 'Pendente',
    style: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
  },
  'in-progress': {
    label: 'Em andamento',
    style: { background: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' },
  },
  done: {
    label: 'Concluída',
    style: { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  },
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, style } = config[status]
  return (
    <span style={{ ...style, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}
