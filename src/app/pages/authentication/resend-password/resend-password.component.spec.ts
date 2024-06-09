import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendPasswordComponent } from './resend-password.component';

describe('ResendPasswordComponent', () => {
  let component: ResendPasswordComponent;
  let fixture: ComponentFixture<ResendPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
