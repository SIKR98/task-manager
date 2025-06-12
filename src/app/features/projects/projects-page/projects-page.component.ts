import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectFormComponent],
  templateUrl: './projects-page.component.html',
})
export class ProjectsPageComponent {
  projects: Signal<Project[]>;

  constructor(private projectService: ProjectService) {
    this.projects = this.projectService.projects;
  }

  onAddProject(project: Project) {
    this.projectService.addProject(project);
  }
}
