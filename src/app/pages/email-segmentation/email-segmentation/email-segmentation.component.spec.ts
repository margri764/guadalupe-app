import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSegmentationComponent } from './email-segmentation.component';

describe('EmailSegmentationComponent', () => {
  let component: EmailSegmentationComponent;
  let fixture: ComponentFixture<EmailSegmentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSegmentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailSegmentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
