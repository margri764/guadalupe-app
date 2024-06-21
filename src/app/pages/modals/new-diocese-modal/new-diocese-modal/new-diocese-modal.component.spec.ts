import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDioceseModalComponent } from './new-diocese-modal.component';

describe('NewDioceseModalComponent', () => {
  let component: NewDioceseModalComponent;
  let fixture: ComponentFixture<NewDioceseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDioceseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDioceseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
