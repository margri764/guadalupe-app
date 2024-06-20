import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTratamentoModalComponent } from './new-tratamento-modal.component';

describe('NewTratamentoModalComponent', () => {
  let component: NewTratamentoModalComponent;
  let fixture: ComponentFixture<NewTratamentoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTratamentoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTratamentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
