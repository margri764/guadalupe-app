import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmailsegmentationModalComponent } from './new-emailsegmentation-modal.component';

describe('NewEmailsegmentationModalComponent', () => {
  let component: NewEmailsegmentationModalComponent;
  let fixture: ComponentFixture<NewEmailsegmentationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEmailsegmentationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEmailsegmentationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
