import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { Project } from '../../../models/project.model';
import { Task, TaskStatus } from '../../../models/task.model';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';
import { DeleteModalComponent } from '../../../shared/components/delete-modal/delete-modal.component'; // ✅ Modal

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, RouterModule, DeleteModalComponent],
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
  editMode = false;
  editTask: Task | undefined = undefined;

  // ✅ Modal state
  showModal = signal(false);
  modalTitle = signal('');
  modalMessage = signal('');
  modalConfirmAction = signal<() => void>(() => {});

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject(id);
    this.loadTasks(id);
  }

  async loadProject(id: number) {
    this.project = await this.projectService.getProjectById(id);

    if (!this.project) {
      this.project = await this.projectService.getProjectByIdFromSupabase(id);
    }
  }

  async loadTasks(project_id: number) {
    this.tasks = await this.taskService.getTasksForProject(project_id);
  }

  async onSubmitTask(task: Task) {
    if (this.editTask) {
      await this.taskService.updateTask(task);
    } else {
      await this.taskService.addTask({
        ...task,
        project_id: this.project?.id ?? task.project_id,
      });
    }

    this.editTask = undefined;
    await this.loadTasks(task.project_id);
  }

  startEditTask(task: Task) {
    this.editTask = { ...task };
  }

  cancelEditTask() {
    this.editTask = undefined;
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

  // ✅ Modal for single task
  openDeleteTaskModal(taskId: number) {
    this.modalTitle.set('Ta bort uppgift');
    this.modalMessage.set('Vill du verkligen ta bort denna uppgift?');
    this.modalConfirmAction.set(async () => {
      await this.taskService.deleteTask(taskId);
      if (this.project) {
        await this.loadTasks(this.project.id);
      }
      this.closeModal();
    });
    this.showModal.set(true);
  }

  // ✅ Modal for whole project
  openDeleteProjectModal() {
    if (!this.project) return;

    this.modalTitle.set('Ta bort projekt');
    this.modalMessage.set(`Vill du verkligen ta bort projektet "${this.project.name}"? Alla uppgifter tas också bort.`);
    this.modalConfirmAction.set(async () => {
      const taskDeletions = this.tasks.map((t) => this.taskService.deleteTask(t.id));
      await Promise.all(taskDeletions);
      await this.projectService.deleteProject(this.project!.id);
      this.closeModal();
      this.router.navigate(['/projects']);
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  confirmDelete() {
    this.modalConfirmAction()();
  }

  enableEdit() {
    this.editMode = true;
  }

  async saveProjectChanges(updated: Partial<Project>) {
    if (!this.project) return;

    const updatedProject: Project = {
      ...this.project,
      ...updated,
    };

    await this.projectService.updateProject(updatedProject);
    await this.loadProject(updatedProject.id);
    this.editMode = false;
  }

  cancelEdit() {
    this.editMode = false;
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

  get isDelayed(): boolean {
    if (!this.project) return false;
    const deadlinePassed = new Date(this.project.deadline) < new Date();
    const allDone = this.tasks.every((t) => t.status === 'done');
    return deadlinePassed && !allDone;
  }

  get status(): 'pending' | 'in_progress' | 'done' {
    if (this.tasks.length === 0) return 'pending';
    const allDone = this.tasks.every((t) => t.status === 'done');
    const anyInProgress = this.tasks.some((t) => t.status === 'in_progress');
    if (allDone) return 'done';
    if (anyInProgress) return 'in_progress';
    return 'pending';
  }
}
