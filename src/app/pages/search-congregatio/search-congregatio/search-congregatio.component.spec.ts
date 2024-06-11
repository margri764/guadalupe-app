import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCongregatioComponent } from './search-congregatio.component';

describe('SearchCongregatioComponent', () => {
  let component: SearchCongregatioComponent;
  let fixture: ComponentFixture<SearchCongregatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCongregatioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchCongregatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
