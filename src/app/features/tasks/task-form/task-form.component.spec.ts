import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    component.project_id = 1; // behövs för submit()
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when required fields are empty', () => {
    component.form.setValue({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      deadline: '',
    });
    expect(component.form.invalid).toBeTrue();
  });

  it('should emit submitTask when form is valid and creating new task', () => {
    const emitSpy = spyOn(component.submitTask, 'emit') as jasmine.Spy;

    component.form.setValue({
      title: 'Ny uppgift',
      description: 'Beskrivning',
      status: 'in_progress',
      priority: 'high',
      deadline: '2025-12-31',
    });

    component.submit();

    expect(emitSpy).toHaveBeenCalled();
    const task = emitSpy.calls.mostRecent().args[0] as Task;
    expect(task.title).toBe('Ny uppgift');
    expect(task.status).toBe('in_progress');
    expect(task.project_id).toBe(1);
  });

  it('should patch form when editTask is set', () => {
    const task: Task = {
      id: 10,
      title: 'Redigera uppgift',
      description: 'Beskrivning',
      status: 'done',
      priority: 'low',
      deadline: '2025-11-30',
      project_id: 2,
      created_at: new Date().toISOString(),
    };

    component.editTask = task;

    component.ngOnChanges({
      editTask: {
        currentValue: task,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.form.value.title).toBe('Redigera uppgift');
    expect(component.form.value.status).toBe('done');
  });

  it('should emit cancelEdit and reset form when cancel() is called', () => {
    const cancelSpy = spyOn(component.cancelEdit, 'emit') as jasmine.Spy;

    component.cancel();

    expect(cancelSpy).toHaveBeenCalled();
    expect(component.form.value.priority).toBe('medium');
    expect(component.form.value.status).toBe('pending');
  });
});
