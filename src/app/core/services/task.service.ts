import { Injectable, signal } from '@angular/core';
import { Task } from '../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([
    {
      id: 1,
      projectId: 1,
      title: 'Skapa layout',
      description: 'Skapa grundlayout för portfolion',
      status: 'in-progress',
      priority: 'high',
      deadline: '2025-06-15',
    },
    {
      id: 2,
      projectId: 1,
      title: 'Skriv om mig-sida',
      description: '',
      status: 'pending',
      priority: 'medium',
      deadline: '2025-06-20',
    },
    {
      id: 3,
      projectId: 2,
      title: 'Fixa Git-repo',
      description: '',
      status: 'done',
      priority: 'low',
      deadline: '2025-06-10',
    },
  ]);

  get tasks() {
    return this._tasks.asReadonly();
  }

  getTasksForProject(projectId: number) {
    return this._tasks().filter((task) => task.projectId === projectId);
  }

  addTask(task: Task) {
    this._tasks.update((list) => [...list, task]);
  }

  updateTask(updated: Task) {
    this._tasks.update((list) =>
      list.map((t) => (t.id === updated.id ? updated : t))
    );
  }

  deleteTask(id: number) {
    this._tasks.update((list) => list.filter((t) => t.id !== id));
  }
}
