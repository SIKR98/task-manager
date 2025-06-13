import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnChanges {
  @Input() project?: Project;
  @Output() submitProject = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      deadline: ['', Validators.required],
      priority: ['medium', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      this.form.patchValue({
        name: this.project.name,
        description: this.project.description,
        deadline: this.project.deadline,
        priority: this.project.priority,
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const isEditing = !!this.project;

      const project: Project = {
        id: isEditing ? this.project!.id : Date.now(),
        created_at: isEditing ? this.project!.created_at : new Date().toISOString(),
        ...this.form.value,
      };

      this.submitProject.emit(project);
      this.form.reset({ priority: 'medium' });
    }
  }

  cancelEdit() {
    this.form.reset({ priority: 'medium' });
    this.cancel.emit();
  }
}
