import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPropulsaoModalComponent } from './setting-propulsao-modal.component';

describe('SettingPropulsaoModalComponent', () => {
  let component: SettingPropulsaoModalComponent;
  let fixture: ComponentFixture<SettingPropulsaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingPropulsaoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingPropulsaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
