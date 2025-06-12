import { Routes } from '@angular/router';
import { ProjectsPageComponent } from './features/projects/projects-page/projects-page.component';
import { ProjectDetailsPageComponent } from './features/projects/project-details-page/project-details-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'projects/:id', component: ProjectDetailsPageComponent },
  { path: '**', redirectTo: 'projects' }
];
