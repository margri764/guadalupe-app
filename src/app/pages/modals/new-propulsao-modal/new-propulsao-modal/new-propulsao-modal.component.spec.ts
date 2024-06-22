import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPropulsaoModalComponent } from './new-propulsao-modal.component';

describe('NewPropulsaoModalComponent', () => {
  let component: NewPropulsaoModalComponent;
  let fixture: ComponentFixture<NewPropulsaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPropulsaoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPropulsaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
