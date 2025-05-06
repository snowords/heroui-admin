import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTasks } from '../context/tasks-context'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, deleteTask } = useTasks()
  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setCurrentRow(null)
            }}
            handleConfirm={async () => {
              try {
                await deleteTask(currentRow.id)
                setOpen(null)
                setCurrentRow(null)
              } catch (error) {
                console.error('Failed to delete task', error)
              }
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
