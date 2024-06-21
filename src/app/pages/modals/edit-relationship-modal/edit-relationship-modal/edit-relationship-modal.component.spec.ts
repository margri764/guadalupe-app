import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRelationshipModalComponent } from './edit-relationship-modal.component';

describe('EditRelationshipModalComponent', () => {
  let component: EditRelationshipModalComponent;
  let fixture: ComponentFixture<EditRelationshipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRelationshipModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRelationshipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
