import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssociationModalComponent } from './edit-association-modal.component';

describe('EditAssociationModalComponent', () => {
  let component: EditAssociationModalComponent;
  let fixture: ComponentFixture<EditAssociationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssociationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAssociationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
