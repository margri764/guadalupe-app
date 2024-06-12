import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrupalalarmModalComponent } from './edit-grupalalarm-modal.component';

describe('EditGrupalalarmModalComponent', () => {
  let component: EditGrupalalarmModalComponent;
  let fixture: ComponentFixture<EditGrupalalarmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGrupalalarmModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGrupalalarmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
