import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCongregatioModalComponent } from './view-congregatio-modal.component';

describe('ViewCongregatioModalComponent', () => {
  let component: ViewCongregatioModalComponent;
  let fixture: ComponentFixture<ViewCongregatioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCongregatioModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCongregatioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
