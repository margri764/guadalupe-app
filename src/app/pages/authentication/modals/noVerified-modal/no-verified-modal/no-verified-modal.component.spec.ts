import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoVerifiedModalComponent } from './no-verified-modal.component';

describe('NoVerifiedModalComponent', () => {
  let component: NoVerifiedModalComponent;
  let fixture: ComponentFixture<NoVerifiedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoVerifiedModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoVerifiedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
