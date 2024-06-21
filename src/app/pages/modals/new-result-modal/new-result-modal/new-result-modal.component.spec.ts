import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResultModalComponent } from './new-result-modal.component';

describe('NewResultModalComponent', () => {
  let component: NewResultModalComponent;
  let fixture: ComponentFixture<NewResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewResultModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
