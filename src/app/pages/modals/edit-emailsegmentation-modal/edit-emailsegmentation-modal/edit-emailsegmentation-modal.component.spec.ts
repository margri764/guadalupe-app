import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailsegmentationModalComponent } from './edit-emailsegmentation-modal.component';

describe('EditEmailsegmentationModalComponent', () => {
  let component: EditEmailsegmentationModalComponent;
  let fixture: ComponentFixture<EditEmailsegmentationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmailsegmentationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEmailsegmentationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
