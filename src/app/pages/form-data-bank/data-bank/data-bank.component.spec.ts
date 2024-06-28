import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataBankComponent } from './data-bank.component';

describe('DataBankComponent', () => {
  let component: DataBankComponent;
  let fixture: ComponentFixture<DataBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataBankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
