import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Task } from '../data/schema'
import { useTasksService } from '../services/tasks-service'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id'>) => Promise<Task>
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  } = useTasksService()
  
  return (
    <TasksContext.Provider 
      value={{ 
        open, 
        setOpen, 
        currentRow, 
        setCurrentRow, 
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
