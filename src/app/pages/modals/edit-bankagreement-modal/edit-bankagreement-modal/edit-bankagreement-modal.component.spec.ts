import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankagreementModalComponent } from './edit-bankagreement-modal.component';

describe('EditBankagreementModalComponent', () => {
  let component: EditBankagreementModalComponent;
  let fixture: ComponentFixture<EditBankagreementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBankagreementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBankagreementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
