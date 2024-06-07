import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPdfComponent } from './open-pdf.component';

describe('OpenPdfComponent', () => {
  let component: OpenPdfComponent;
  let fixture: ComponentFixture<OpenPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
