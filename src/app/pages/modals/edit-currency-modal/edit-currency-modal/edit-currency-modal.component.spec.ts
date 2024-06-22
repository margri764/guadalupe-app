import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurrencyModalComponent } from './edit-currency-modal.component';

describe('EditCurrencyModalComponent', () => {
  let component: EditCurrencyModalComponent;
  let fixture: ComponentFixture<EditCurrencyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCurrencyModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCurrencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
