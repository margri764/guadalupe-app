import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddressegmentationModalComponent } from './new-addressegmentation-modal.component';

describe('NewAddressegmentationModalComponent', () => {
  let component: NewAddressegmentationModalComponent;
  let fixture: ComponentFixture<NewAddressegmentationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAddressegmentationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAddressegmentationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
