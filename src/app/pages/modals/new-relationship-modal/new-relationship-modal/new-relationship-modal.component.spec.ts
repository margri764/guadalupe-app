import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRelationshipModalComponent } from './new-relationship-modal.component';

describe('NewRelationshipModalComponent', () => {
  let component: NewRelationshipModalComponent;
  let fixture: ComponentFixture<NewRelationshipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRelationshipModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRelationshipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
