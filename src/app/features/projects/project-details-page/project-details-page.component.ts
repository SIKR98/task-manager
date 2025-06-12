import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { Project } from '../../../models/project.model';
import { Task, TaskStatus } from '../../../models/task.model';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './project-details-page.component.html',
})
export class ProjectDetailsPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  project?: Project;
  tasks: Task[] = [];
  filter: 'all' | TaskStatus = 'all';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject(id);
    this.loadTasks(id);
  }

  async loadProject(id: number) {
    this.project = await this.projectService.getProjectById(id);
  }

  async loadTasks(project_id: number) {
    this.tasks = await this.taskService.getTasksForProject(project_id);
  }

  async onAddTask(task: Task) {
    await this.taskService.addTask({
      ...task,
      project_id: task.project_id,
    });
    await this.loadTasks(task.project_id);
  }

  async cycleTaskStatus(task: Task) {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      pending: 'in_progress',
      in_progress: 'done',
      done: 'pending',
    };

    const updated: Task = {
      ...task,
      status: nextStatusMap[task.status],
    };

    await this.taskService.updateTask(updated);
    await this.loadTasks(task.project_id);
  }

  async deleteTask(taskId: number) {
    await this.taskService.deleteTask(taskId);
    if (this.project) {
      await this.loadTasks(this.project.id);
    }
  }

  async confirmDeleteProject() {
    if (!this.project) return;

    const confirmed = confirm(`Vill du verkligen ta bort projektet "${this.project.name}"?`);
    if (confirmed) {
      await this.projectService.deleteProject(this.project.id);
      this.router.navigate(['/projects']);
    }
  }

  get filteredTasks(): Task[] {
    if (this.filter === 'all') return this.tasks;
    return this.tasks.filter((t) => t.status === this.filter);
  }

  get projectProgress(): string {
    if (this.tasks.length === 0) return 'Inga uppgifter';
    const doneCount = this.tasks.filter((t) => t.status === 'done').length;
    return `${Math.round((doneCount / this.tasks.length) * 100)}%`;
  }
}
