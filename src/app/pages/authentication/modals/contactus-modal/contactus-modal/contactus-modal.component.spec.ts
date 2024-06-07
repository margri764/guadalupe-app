import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusModalComponent } from './contactus-modal.component';

describe('ContactusModalComponent', () => {
  let component: ContactusModalComponent;
  let fixture: ComponentFixture<ContactusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactusModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
