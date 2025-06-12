import { Injectable, signal } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { supabase } from '../../../supabase';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([]);

  get tasks() {
    return this._tasks.asReadonly();
  }

  constructor() {}

  async getTasksForProject(project_id: number): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Kunde inte hämta tasks:', error);
      return [];
    }

    this._tasks.set(data as Task[]);
    return data as Task[];
  }

  async addTask(task: Omit<Task, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select();

    if (error) {
      console.error('Kunde inte lägga till task:', error);
      return;
    }

    const newTask = data?.[0];
    if (newTask) {
      this._tasks.update((current) => [newTask, ...current]);
    }
  }

  async updateTask(updated: Task) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updated.title,
        description: updated.description,
        priority: updated.priority,
        status: updated.status,
        deadline: updated.deadline,
      })
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Kunde inte uppdatera task:', error);
      return;
    }

    const task = data?.[0];
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? task : t))
    );
  }

  async deleteTask(taskId: number) {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Kunde inte ta bort task:', error);
      return;
    }

    this._tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }
}
