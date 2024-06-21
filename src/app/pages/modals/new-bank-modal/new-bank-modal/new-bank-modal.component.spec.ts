import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBankModalComponent } from './new-bank-modal.component';

describe('NewBankModalComponent', () => {
  let component: NewBankModalComponent;
  let fixture: ComponentFixture<NewBankModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBankModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewBankModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
