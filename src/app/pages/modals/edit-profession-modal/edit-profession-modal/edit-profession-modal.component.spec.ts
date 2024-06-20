import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfessionModalComponent } from './edit-profession-modal.component';

describe('EditProfessionModalComponent', () => {
  let component: EditProfessionModalComponent;
  let fixture: ComponentFixture<EditProfessionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfessionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProfessionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
