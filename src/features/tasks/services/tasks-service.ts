import { useState, useCallback } from 'react';
import supabase from '@/lib/supabase/client';
import { Task } from '../data/schema';
import { toast } from 'sonner';

export const useTasksService = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      
      setTasks(data as Task[]);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch tasks, please try again later';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTaskById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Task;
    } catch (err: any) {
      const errorMessage = err.message || `获取任务 ${id} 失败`;
      toast.error(errorMessage);
      throw err;
    }
  };

  const createTask = async (task: Omit<Task, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();
      
      if (error) throw error;
      
      const newTask = data as Task;
      setTasks((prev) => [...prev, newTask]);
      toast.success('Task created successfully');
      
      return newTask;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create task';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error(`Task with ID ${id} not found`);
      }
      
      const updatedTask = Array.isArray(data) ? data[0] as Task : data as Task;

      toast.success('Task updated successfully');
      
      return updatedTask;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to update task ${id}`;
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted successfully');
    } catch (err: any) {
      const errorMessage = err.message || `Failed to delete task ${id}`;
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
  };
};
