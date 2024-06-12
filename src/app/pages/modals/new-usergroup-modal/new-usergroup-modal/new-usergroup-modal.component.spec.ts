import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUsergroupModalComponent } from './new-usergroup-modal.component';

describe('NewUsergroupModalComponent', () => {
  let component: NewUsergroupModalComponent;
  let fixture: ComponentFixture<NewUsergroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUsergroupModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewUsergroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
