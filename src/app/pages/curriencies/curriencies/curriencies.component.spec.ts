import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrienciesComponent } from './curriencies.component';

describe('CurrienciesComponent', () => {
  let component: CurrienciesComponent;
  let fixture: ComponentFixture<CurrienciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrienciesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrienciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
