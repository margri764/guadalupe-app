import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddressComponent } from './form-address.component';

describe('FormAddressComponent', () => {
  let component: FormAddressComponent;
  let fixture: ComponentFixture<FormAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
