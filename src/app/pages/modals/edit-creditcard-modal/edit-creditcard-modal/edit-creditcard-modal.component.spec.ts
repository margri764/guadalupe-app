import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditcardModalComponent } from './edit-creditcard-modal.component';

describe('EditCreditcardModalComponent', () => {
  let component: EditCreditcardModalComponent;
  let fixture: ComponentFixture<EditCreditcardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCreditcardModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCreditcardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
