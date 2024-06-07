import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCongressComponent } from './form-congress.component';

describe('FormCongressComponent', () => {
  let component: FormCongressComponent;
  let fixture: ComponentFixture<FormCongressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCongressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCongressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
