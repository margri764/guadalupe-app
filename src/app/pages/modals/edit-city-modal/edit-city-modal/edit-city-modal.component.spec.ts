import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCityModalComponent } from './edit-city-modal.component';

describe('EditCityModalComponent', () => {
  let component: EditCityModalComponent;
  let fixture: ComponentFixture<EditCityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCityModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
