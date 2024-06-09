import { TestBed } from '@angular/core/testing';

import { CongregatioService } from './congregatio.service';

describe('CongregatioService', () => {
  let service: CongregatioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongregatioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
