import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  @Input() project_id!: number;
  @Output() submitTask = new EventEmitter<Task>();

  form: FormGroup;

  priorities: TaskPriority[] = ['low', 'medium', 'high'];
  statuses: TaskStatus[] = ['pending', 'in_progress', 'done'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['pending'],
      priority: ['medium'],
      deadline: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.valid) {
      const task: Task = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        project_id: this.project_id,
        ...this.form.value,
      };
      this.submitTask.emit(task);
      this.form.reset({ status: 'pending', priority: 'medium' });
    }
  }
}
