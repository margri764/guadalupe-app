import { TestBed } from '@angular/core/testing';

import { PropulsaoService } from './propulsao.service';

describe('PropulsaoService', () => {
  let service: PropulsaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropulsaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
