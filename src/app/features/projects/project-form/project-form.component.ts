import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent {
  @Output() submitProject = new EventEmitter<Project>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      deadline: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.valid) {
      const newProject: Project = {
        id: Date.now(), // enkel ID-generator
        tasks: [],
        ...this.form.value,
      };
      this.submitProject.emit(newProject);
      this.form.reset();
    }
  }
}
