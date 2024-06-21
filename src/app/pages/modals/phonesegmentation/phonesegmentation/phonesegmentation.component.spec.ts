import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonesegmentationComponent } from './phonesegmentation.component';

describe('PhonesegmentationComponent', () => {
  let component: PhonesegmentationComponent;
  let fixture: ComponentFixture<PhonesegmentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhonesegmentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhonesegmentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
