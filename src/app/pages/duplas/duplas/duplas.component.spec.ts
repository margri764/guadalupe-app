import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplasComponent } from './duplas.component';

describe('DuplasComponent', () => {
  let component: DuplasComponent;
  let fixture: ComponentFixture<DuplasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DuplasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
