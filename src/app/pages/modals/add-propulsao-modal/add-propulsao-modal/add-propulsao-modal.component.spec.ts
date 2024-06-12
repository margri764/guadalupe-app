import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropulsaoModalComponent } from './add-propulsao-modal.component';

describe('AddPropulsaoModalComponent', () => {
  let component: AddPropulsaoModalComponent;
  let fixture: ComponentFixture<AddPropulsaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPropulsaoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPropulsaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
