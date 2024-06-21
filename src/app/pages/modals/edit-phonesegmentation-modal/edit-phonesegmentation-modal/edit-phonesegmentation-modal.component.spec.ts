import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhonesegmentationModalComponent } from './edit-phonesegmentation-modal.component';

describe('EditPhonesegmentationModalComponent', () => {
  let component: EditPhonesegmentationModalComponent;
  let fixture: ComponentFixture<EditPhonesegmentationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPhonesegmentationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPhonesegmentationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
