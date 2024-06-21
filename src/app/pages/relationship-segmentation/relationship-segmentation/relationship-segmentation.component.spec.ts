import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipSegmentationComponent } from './relationship-segmentation.component';

describe('RelationshipSegmentationComponent', () => {
  let component: RelationshipSegmentationComponent;
  let fixture: ComponentFixture<RelationshipSegmentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelationshipSegmentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelationshipSegmentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
