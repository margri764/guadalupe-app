import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResultfonteModalComponent } from './add-resultfonte-modal.component';

describe('AddResultfonteModalComponent', () => {
  let component: AddResultfonteModalComponent;
  let fixture: ComponentFixture<AddResultfonteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddResultfonteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddResultfonteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
