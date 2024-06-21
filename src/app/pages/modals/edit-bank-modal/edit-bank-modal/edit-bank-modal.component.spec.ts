import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankModalComponent } from './edit-bank-modal.component';

describe('EditBankModalComponent', () => {
  let component: EditBankModalComponent;
  let fixture: ComponentFixture<EditBankModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBankModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBankModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
