import { Component, Signal, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { Task } from '../../../models/task.model';
import { DeadlineStatusPipe } from '../../../shared/pipes/deadline-status.pipe';
import { HoverHighlightDirective } from '../../../shared/directives/hover-highlight.directive';
import { FormsModule } from '@angular/forms';

type ExtendedProject = Project & {
  progress: number;
  delayed: boolean;
};

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProjectFormComponent,
    DeadlineStatusPipe,
    HoverHighlightDirective,
  ],
  templateUrl: './projects-page.component.html',
})
export class ProjectsPageComponent {
  projects!: Signal<Project[]>;
  tasks!: Signal<Task[]>;

  filter: 'all' | 'pending' | 'in_progress' | 'done' | 'delayed' = 'all';
  searchTerm = signal(''); // ✅ Sökterm signal
  editingProject: Project | null = null;

  filteredProjects!: Signal<ExtendedProject[]>;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {
    this.projects = this.projectService.projects;
    this.tasks = this.taskService.tasks;

    this.filteredProjects = computed(() => {
      const allProjects = this.projects();
      const taskList = this.tasks();
      const term = this.searchTerm().toLowerCase();

      return allProjects
        .map((project) => {
          const relatedTasks = taskList.filter((t) => t.project_id === project.id);
          const total = relatedTasks.length;
          const done = relatedTasks.filter((t) => t.status === 'done').length;

          const progress = total > 0 ? Math.round((done / total) * 100) : 0;
          const delayed = relatedTasks.some(
            (t) => t.status !== 'done' && new Date(t.deadline) < new Date()
          );

          return {
            ...project,
            progress,
            delayed,
          };
        })
        .filter((project) => {
          const matchesSearch = project.name.toLowerCase().includes(term);

          if (!matchesSearch) return false;

          switch (this.filter) {
            case 'done':
              return project.progress === 100;
            case 'pending':
              return project.progress === 0;
            case 'in_progress':
              return project.progress > 0 && project.progress < 100;
            case 'delayed':
              return project.delayed;
            default:
              return true;
          }
        })
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    });

    effect(() => {
      const projects = this.projects();
      projects.forEach((p) => this.taskService.loadTasks(p.id));
    });
  }

  onAddProject(project: Omit<Project, 'id'>) {
    this.projectService.addProject(project);
  }

  onUpdateProject(updated: Project) {
    this.projectService.updateProject(updated);
    this.editingProject = null;
  }

  onCancelEdit() {
    this.editingProject = null;
  }

  editProject(project: Project) {
    this.editingProject = { ...project };
  }

  async confirmDeleteProject(project: Project) {
    const confirmed = confirm(`Vill du verkligen ta bort projektet "${project.name}"?`);
    if (!confirmed) return;

    const tasksToDelete = this.tasks().filter((t) => t.project_id === project.id);
    for (const task of tasksToDelete) {
      await this.taskService.deleteTask(task.id);
    }

    await this.projectService.deleteProject(project.id);
  }
}
