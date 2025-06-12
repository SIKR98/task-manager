import { Injectable, signal } from '@angular/core';
import { Task } from '../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([]);

  get tasks() {
    return this._tasks.asReadonly();
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

  getTasksForProject(projectId: number): Task[] {
    return this._tasks().filter((t) => t.projectId === projectId);
  }
}
