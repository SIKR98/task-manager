import { Injectable, signal } from '@angular/core';
import { Project } from '../../models/project.model';
import { supabase } from '../../../supabase';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private _projects = signal<Project[]>([]);

  get projects() {
    return this._projects.asReadonly();
  }

  constructor() {
    this.loadProjects();
  }

  async loadProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Kunde inte hämta projekt:', error);
      return;
    }

    this._projects.set(data as Project[]);
  }

  getProjectById(id: number): Project | undefined {
    return this._projects().find((p) => p.id === id);
  }

  async getProjectByIdFromSupabase(id: number): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Kunde inte hämta projekt från Supabase:', error);
      return;
    }

    return data as Project;
  }

  async addProject(project: Omit<Project, 'id'>) {
    const payload = {
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      priority: project.priority,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select();

    if (error) {
      console.error('Kunde inte lägga till projekt:', error);
      return;
    }

    const newProject = data?.[0];
    this._projects.update((projects) => [newProject, ...projects]);
  }

  async updateProject(updatedProject: Project) {
    const { id, ...updatedFields } = updatedProject;

    const { data, error } = await supabase
      .from('projects')
      .update(updatedFields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Kunde inte uppdatera projekt:', error);
      return;
    }

    const updated = data?.[0];
    this._projects.update((projects) =>
      projects.map((p) => (p.id === id ? updated : p))
    );
  }

  async deleteProject(projectId: number) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Kunde inte ta bort projekt:', error);
      return;
    }

    this._projects.update((projects) =>
      projects.filter((p) => p.id !== projectId)
    );
  }
}
