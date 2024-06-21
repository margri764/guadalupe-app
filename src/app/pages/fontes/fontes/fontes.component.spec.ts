import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontesComponent } from './fontes.component';

describe('FontesComponent', () => {
  let component: FontesComponent;
  let fixture: ComponentFixture<FontesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FontesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
