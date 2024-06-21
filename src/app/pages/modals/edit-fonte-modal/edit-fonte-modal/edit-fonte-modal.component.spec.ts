import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFonteModalComponent } from './edit-fonte-modal.component';

describe('EditFonteModalComponent', () => {
  let component: EditFonteModalComponent;
  let fixture: ComponentFixture<EditFonteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFonteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFonteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
