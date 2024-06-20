import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamentoComponent } from './tratamento.component';

describe('TratamentoComponent', () => {
  let component: TratamentoComponent;
  let fixture: ComponentFixture<TratamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TratamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
