import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAgreementComponent } from './bank-agreement.component';

describe('BankAgreementComponent', () => {
  let component: BankAgreementComponent;
  let fixture: ComponentFixture<BankAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAgreementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
