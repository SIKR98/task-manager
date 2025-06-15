import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../../models/project.model';

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when required fields are empty', () => {
    component.form.setValue({
      name: '',
      description: '',
      deadline: '',
      priority: '',
    });
    expect(component.form.invalid).toBeTrue();
  });

  it('should emit submitProject when form is valid', () => {
    const emitSpy = spyOn(component.submitProject, 'emit') as jasmine.Spy;

    component.form.setValue({
      name: 'Testprojekt',
      description: 'Beskrivning',
      deadline: '2025-12-31',
      priority: 'high',
    });

    component.submit();

    expect(emitSpy).toHaveBeenCalled();
    const emitted = emitSpy.calls.mostRecent().args[0] as Project;
    expect(emitted.name).toBe('Testprojekt');
    expect(emitted.priority).toBe('high');
  });

  it('should patch form values if @Input project is set', () => {
    const project: Project = {
      id: 1,
      name: 'Existerande',
      description: 'Redigera detta',
      deadline: '2025-10-10',
      priority: 'medium',
      created_at: new Date().toISOString(),
    };

    component.project = project;
    component.ngOnChanges({
      project: {
        currentValue: project,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.form.value.name).toBe('Existerande');
    expect(component.form.value.priority).toBe('medium');
  });

  it('should reset form and emit cancel on cancelEdit()', () => {
    const cancelSpy = spyOn(component.cancel, 'emit') as jasmine.Spy;

    component.cancelEdit();

    expect(cancelSpy).toHaveBeenCalled();
    expect(component.form.value.priority).toBe('medium');
  });
});
