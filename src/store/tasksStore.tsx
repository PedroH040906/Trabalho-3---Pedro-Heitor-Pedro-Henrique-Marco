import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Task } from '../types/task'

const STORAGE_KEY = 'gerenciador-tarefas'

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Instalar Node.js, VSCode e extensões necessárias para o projeto.',
    status: 'done',
    priority: 'high',
    createdAt: '2025-06-01',
    dueDate: '2025-06-03',
  },
  {
    id: '2',
    title: 'Estudar TanStack Router',
    description: 'Ler a documentação oficial e entender file-based routing e loaders.',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2025-06-02',
    dueDate: '2025-06-10',
  },
  {
    id: '3',
    title: 'Implementar TanStack Table',
    description: 'Criar tabela com sorting, filtering e paginação usando headless UI.',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2025-06-03',
    dueDate: '2025-06-12',
  },
  {
    id: '4',
    title: 'Criar componentes reutilizáveis',
    description: 'StatusBadge, PriorityBadge, TaskCard e FilterBar.',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-06-04',
    dueDate: '2025-06-15',
  },
  {
    id: '5',
    title: 'Adicionar persistência com localStorage',
    description: 'Garantir que as tarefas sejam salvas entre sessões do navegador.',
    status: 'pending',
    priority: 'low',
    createdAt: '2025-06-05',
    dueDate: '2025-06-18',
  },
  {
    id: '6',
    title: 'Escrever documentação do projeto',
    description: 'Criar README com instruções de instalação e uso do sistema.',
    status: 'pending',
    priority: 'low',
    createdAt: '2025-06-06',
  },
]

type Action =
  | { type: 'ADD'; task: Task }
  | { type: 'UPDATE'; task: Task }
  | { type: 'DELETE'; id: string }
  | { type: 'DELETE_MANY'; ids: string[] }

function reducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'ADD':
      return [action.task, ...state]
    case 'UPDATE':
      return state.map((t) => (t.id === action.task.id ? action.task : t))
    case 'DELETE':
      return state.filter((t) => t.id !== action.id)
    case 'DELETE_MANY':
      return state.filter((t) => !action.ids.includes(t.id))
    default:
      return state
  }
}

function loadFromStorage(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialTasks
  } catch {
    return initialTasks
  }
}

interface TasksContextValue {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void
  deleteManyTasks: (ids: string[]) => void
  getTaskById: (id: string) => Task | undefined
}

const TasksContext = createContext<TasksContextValue | null>(null)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(reducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(data: Omit<Task, 'id' | 'createdAt'>) {
    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    dispatch({ type: 'ADD', task })
  }

  function updateTask(task: Task) {
    dispatch({ type: 'UPDATE', task })
  }

  function deleteTask(id: string) {
    dispatch({ type: 'DELETE', id })
  }

  function deleteManyTasks(ids: string[]) {
    dispatch({ type: 'DELETE_MANY', ids })
  }

  function getTaskById(id: string) {
    return tasks.find((t) => t.id === id)
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, deleteManyTasks, getTaskById }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used inside TasksProvider')
  return ctx
}
