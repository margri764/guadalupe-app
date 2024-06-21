import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddressegmentationModalComponent } from './edit-addressegmentation-modal.component';

describe('EditAddressegmentationModalComponent', () => {
  let component: EditAddressegmentationModalComponent;
  let fixture: ComponentFixture<EditAddressegmentationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddressegmentationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAddressegmentationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
