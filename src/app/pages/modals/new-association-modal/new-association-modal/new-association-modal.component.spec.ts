import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssociationModalComponent } from './new-association-modal.component';

describe('NewAssociationModalComponent', () => {
  let component: NewAssociationModalComponent;
  let fixture: ComponentFixture<NewAssociationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAssociationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAssociationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
