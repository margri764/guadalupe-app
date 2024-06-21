import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCitydioceseModalComponent } from './add-citydiocese-modal.component';

describe('AddCitydioceseModalComponent', () => {
  let component: AddCitydioceseModalComponent;
  let fixture: ComponentFixture<AddCitydioceseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCitydioceseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCitydioceseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
