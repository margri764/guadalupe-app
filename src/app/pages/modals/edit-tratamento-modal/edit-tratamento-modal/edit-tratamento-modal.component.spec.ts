import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTratamentoModalComponent } from './edit-tratamento-modal.component';

describe('EditTratamentoModalComponent', () => {
  let component: EditTratamentoModalComponent;
  let fixture: ComponentFixture<EditTratamentoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTratamentoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTratamentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
