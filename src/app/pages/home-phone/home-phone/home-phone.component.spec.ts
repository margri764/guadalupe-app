import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePhoneComponent } from './home-phone.component';

describe('HomePhoneComponent', () => {
  let component: HomePhoneComponent;
  let fixture: ComponentFixture<HomePhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePhoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
