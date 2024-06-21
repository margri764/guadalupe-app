import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCityModalComponent } from './new-city-modal.component';

describe('NewCityModalComponent', () => {
  let component: NewCityModalComponent;
  let fixture: ComponentFixture<NewCityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCityModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
