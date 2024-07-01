import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountDrawerComponent } from './verify-account-drawer.component';

describe('VerifyAccountDrawerComponent', () => {
  let component: VerifyAccountDrawerComponent;
  let fixture: ComponentFixture<VerifyAccountDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyAccountDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyAccountDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
