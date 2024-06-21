import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResultModalComponent } from './edit-result-modal.component';

describe('EditResultModalComponent', () => {
  let component: EditResultModalComponent;
  let fixture: ComponentFixture<EditResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditResultModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
