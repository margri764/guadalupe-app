import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiocesesComponent } from './dioceses.component';

describe('DiocesesComponent', () => {
  let component: DiocesesComponent;
  let fixture: ComponentFixture<DiocesesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiocesesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiocesesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
