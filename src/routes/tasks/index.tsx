import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { Task } from '../../types/task'
import { useTasks } from '../../store/tasksStore'
import { StatusBadge } from '../../components/StatusBadge'
import { PriorityBadge } from '../../components/PriorityBadge'
import { TaskForm } from '../../components/TaskForm'

export const Route = createFileRoute('/tasks/')({
  component: TasksPage,
})

const col = createColumnHelper<Task>()

function TasksPage() {
  const { tasks, addTask, deleteManyTasks } = useTasks()
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [showForm, setShowForm] = useState(false)

  const columns = useMemo(() => [
    col.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          style={{ cursor: 'pointer' }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          style={{ cursor: 'pointer' }}
          onClick={e => e.stopPropagation()}
        />
      ),
      size: 40,
    }),
    col.accessor('title', {
      header: 'Título',
      cell: info => (
        <span style={{ fontWeight: 600, color: '#1E1B4B' }}>{info.getValue()}</span>
      ),
    }),
    col.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={info.getValue()} />,
      filterFn: 'equals',
    }),
    col.accessor('priority', {
      header: 'Prioridade',
      cell: info => <PriorityBadge priority={info.getValue()} />,
      filterFn: 'equals',
    }),
    col.accessor('dueDate', {
      header: 'Prazo',
      cell: info => info.getValue() ? (
        <span style={{ fontSize: 13, color: '#6B7280' }}>{info.getValue()}</span>
      ) : (
        <span style={{ fontSize: 13, color: '#D1D5DB' }}>—</span>
      ),
    }),
    col.accessor('createdAt', {
      header: 'Criada em',
      cell: info => <span style={{ fontSize: 13, color: '#6B7280' }}>{info.getValue()}</span>,
    }),
  ], [])

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting, columnFilters, globalFilter, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  const selectedIds = table.getSelectedRowModel().rows.map(r => r.original.id)

  function handleDeleteSelected() {
    if (confirm(`Excluir ${selectedIds.length} tarefa(s)?`)) {
      deleteManyTasks(selectedIds)
      setRowSelection({})
    }
  }

  const thStyle: React.CSSProperties = {
    padding: '10px 14px', textAlign: 'left', fontSize: 12,
    fontWeight: 700, color: '#6B7280', textTransform: 'uppercase',
    letterSpacing: 0.5, background: '#F9FAFB', cursor: 'pointer',
    userSelect: 'none', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    padding: '12px 14px', fontSize: 14, color: '#374151',
    borderTop: '1px solid #F3F4F6',
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1E1B4B' }}>Tarefas</h1>
          <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>
            {table.getFilteredRowModel().rows.length} tarefa(s) encontrada(s)
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px', background: '#4F46E5', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          + Nova tarefa
        </button>
      </div>

      {/* Modal de nova tarefa */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#1E1B4B' }}>Nova tarefa</h2>
            <TaskForm
              onSave={(data) => { addTask(data); setShowForm(false) }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '16px 20px',
        border: '1px solid #E5E7EB', marginBottom: 16,
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <input
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="🔍  Buscar tarefas..."
          style={{
            flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 8,
            border: '1px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit',
          }}
        />
        <select
          value={(columnFilters.find(f => f.id === 'status')?.value as string) ?? ''}
          onChange={e => {
            const val = e.target.value
            setColumnFilters(prev =>
              val ? [...prev.filter(f => f.id !== 'status'), { id: 'status', value: val }]
                : prev.filter(f => f.id !== 'status')
            )
          }}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="in-progress">Em andamento</option>
          <option value="done">Concluída</option>
        </select>
        <select
          value={(columnFilters.find(f => f.id === 'priority')?.value as string) ?? ''}
          onChange={e => {
            const val = e.target.value
            setColumnFilters(prev =>
              val ? [...prev.filter(f => f.id !== 'priority'), { id: 'priority', value: val }]
                : prev.filter(f => f.id !== 'priority')
            )
          }}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          <option value="">Todas as prioridades</option>
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>

        {/* Visibilidade de colunas */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {table.getAllLeafColumns().filter(c => c.id !== 'select').map(col => (
            <label key={col.id} style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={col.getIsVisible()}
                onChange={col.getToggleVisibilityHandler()}
              />
              {typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}
            </label>
          ))}
        </div>
      </div>

      {/* Ação de exclusão em massa */}
      {selectedIds.length > 0 && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
          padding: '10px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 14, color: '#991B1B', fontWeight: 500 }}>
            {selectedIds.length} tarefa(s) selecionada(s)
          </span>
          <button onClick={handleDeleteSelected} style={{
            background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Excluir selecionadas
          </button>
        </div>
      )}

      {/* Tabela */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th key={header.id} style={{ ...thStyle, width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ ...tdStyle, textAlign: 'center', padding: 48, color: '#9CA3AF' }}>
                  Nenhuma tarefa encontrada. Crie uma nova!
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  onClick={() => navigate({ to: '/tasks/$id', params: { id: row.original.id } })}
                  style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F5F3FF')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={tdStyle}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginação */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderTop: '1px solid #F3F4F6', background: '#FAFAFA',
        }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} style={btnStyle(!table.getCanPreviousPage())}>«</button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} style={btnStyle(!table.getCanPreviousPage())}>‹</button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} style={btnStyle(!table.getCanNextPage())}>›</button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} style={btnStyle(!table.getCanNextPage())}>»</button>
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 13, fontFamily: 'inherit' }}
          >
            {[5, 8, 15, 25].map(s => <option key={s} value={s}>{s} por página</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E7EB',
    background: disabled ? '#F9FAFB' : '#fff', color: disabled ? '#D1D5DB' : '#374151',
    cursor: disabled ? 'default' : 'pointer', fontSize: 14,
  }
}
