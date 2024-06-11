import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupusersModalComponent } from './view-groupusers-modal.component';

describe('ViewGroupusersModalComponent', () => {
  let component: ViewGroupusersModalComponent;
  let fixture: ComponentFixture<ViewGroupusersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGroupusersModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewGroupusersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
