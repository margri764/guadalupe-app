import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCreditcardModalComponent } from './new-creditcard-modal.component';

describe('NewCreditcardModalComponent', () => {
  let component: NewCreditcardModalComponent;
  let fixture: ComponentFixture<NewCreditcardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCreditcardModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCreditcardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
