import { Injectable, signal } from '@angular/core';
import { Project } from '../../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private _projects = signal<Project[]>([
    {
      id: 1,
      name: 'Portfolio-sida',
      description: 'En webbplats för att visa mitt arbete.',
      deadline: '2025-06-30',
      tasks: [],
    },
    {
      id: 2,
      name: 'Skolprojekt',
      description: 'Grupparbete i programmering.',
      deadline: '2025-07-10',
      tasks: [],
    },
  ]);

  get projects() {
    return this._projects.asReadonly();
  }

  addProject(project: Project) {
    this._projects.update((list) => [...list, project]);
  }

  updateProject(updated: Project) {
    this._projects.update((list) =>
      list.map((p) => (p.id === updated.id ? updated : p))
    );
  }

  deleteProject(id: number) {
    this._projects.update((list) => list.filter((p) => p.id !== id));
  }

  getProjectById(id: number): Project | undefined {
    return this._projects().find((p) => p.id === id);
  }
}
