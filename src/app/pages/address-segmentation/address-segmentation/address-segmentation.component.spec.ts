import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSegmentationComponent } from './address-segmentation.component';

describe('AddressSegmentationComponent', () => {
  let component: AddressSegmentationComponent;
  let fixture: ComponentFixture<AddressSegmentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressSegmentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressSegmentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
