import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBankagreementModalComponent } from './new-bankagreement-modal.component';

describe('NewBankagreementModalComponent', () => {
  let component: NewBankagreementModalComponent;
  let fixture: ComponentFixture<NewBankagreementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBankagreementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewBankagreementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
