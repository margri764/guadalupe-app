import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropulsoesComponent } from './propulsoes.component';

describe('PropulsoesComponent', () => {
  let component: PropulsoesComponent;
  let fixture: ComponentFixture<PropulsoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropulsoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropulsoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
