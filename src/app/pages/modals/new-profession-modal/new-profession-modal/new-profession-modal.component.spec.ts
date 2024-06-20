import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProfessionModalComponent } from './new-profession-modal.component';

describe('NewProfessionModalComponent', () => {
  let component: NewProfessionModalComponent;
  let fixture: ComponentFixture<NewProfessionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProfessionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewProfessionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
