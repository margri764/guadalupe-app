import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitiesComponent } from './unities.component';

describe('UnitiesComponent', () => {
  let component: UnitiesComponent;
  let fixture: ComponentFixture<UnitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
