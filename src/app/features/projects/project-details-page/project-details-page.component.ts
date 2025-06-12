import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  project?: Project;
  tasks: Task[] = [];

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.project = this.projectService.getProjectById(id);

    if (this.project) {
      this.tasks = this.taskService.getTasksForProject(this.project.id);
    }
  }

  onAddTask(task: Task) {
    this.taskService.addTask(task);
    this.tasks = this.taskService.getTasksForProject(task.projectId);
  }

  cycleTaskStatus(task: Task) {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      'pending': 'in-progress',
      'in-progress': 'done',
      'done': 'pending',
    };

    const updatedTask: Task = {
      ...task,
      status: nextStatusMap[task.status],
    };

    this.taskService.updateTask(updatedTask);
    this.tasks = this.taskService.getTasksForProject(task.projectId);
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
    if (this.project) {
      this.tasks = this.taskService.getTasksForProject(this.project.id);
    }
  }

  filter: 'all' | 'pending' | 'in-progress' | 'done' = 'all';

  get filteredTasks(): Task[] {
    if (this.filter === 'all') return this.tasks;
    return this.tasks.filter(t => t.status === this.filter);
  }




}
