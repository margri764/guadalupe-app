import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongregatioComponent } from './congregatio.component';

describe('CongregatioComponent', () => {
  let component: CongregatioComponent;
  let fixture: ComponentFixture<CongregatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongregatioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CongregatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
