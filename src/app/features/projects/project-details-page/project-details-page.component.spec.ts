import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailsPageComponent } from './project-details-page.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProjectDetailsPageComponent', () => {
  let component: ProjectDetailsPageComponent;
  let fixture: ComponentFixture<ProjectDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') return '1';
                  return null;
                }
              }
            },
            // Om du använder .params i ngOnInit (observable)
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
