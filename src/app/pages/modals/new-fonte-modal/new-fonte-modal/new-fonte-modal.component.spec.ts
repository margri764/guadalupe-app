import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFonteModalComponent } from './new-fonte-modal.component';

describe('NewFonteModalComponent', () => {
  let component: NewFonteModalComponent;
  let fixture: ComponentFixture<NewFonteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFonteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFonteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
