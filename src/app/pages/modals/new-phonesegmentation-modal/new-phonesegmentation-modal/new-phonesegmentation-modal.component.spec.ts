import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPhonesegmentationModalComponent } from './new-phonesegmentation-modal.component';

describe('NewPhonesegmentationModalComponent', () => {
  let component: NewPhonesegmentationModalComponent;
  let fixture: ComponentFixture<NewPhonesegmentationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPhonesegmentationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPhonesegmentationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
