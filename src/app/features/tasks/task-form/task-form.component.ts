import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnChanges {
  @Input() project_id!: number;
  @Input() editTask?: Task;
  @Output() submitTask = new EventEmitter<Task>();
  @Output() cancelEdit = new EventEmitter<void>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editTask'] && this.editTask) {
      this.form.patchValue({
        title: this.editTask.title,
        description: this.editTask.description,
        status: this.editTask.status,
        priority: this.editTask.priority,
        deadline: this.editTask.deadline,
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const task: Task = {
        ...(this.editTask ?? {
          id: Date.now(),
          created_at: new Date().toISOString(),
          project_id: this.project_id,
        }),
        ...this.form.value,
      };
      this.submitTask.emit(task);
      this.form.reset({ status: 'pending', priority: 'medium' });
    }
  }

  cancel() {
    this.form.reset({ status: 'pending', priority: 'medium' });
    this.cancelEdit.emit();
  }
}
