import type { TaskPriority } from '../types/task'

const config: Record<TaskPriority, { label: string; style: React.CSSProperties }> = {
  low: {
    label: '↓ Baixa',
    style: { background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' },
  },
  medium: {
    label: '→ Média',
    style: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
  },
  high: {
    label: '↑ Alta',
    style: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
  },
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, style } = config[priority]
  return (
    <span style={{ ...style, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}
