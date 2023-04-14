import { TestBed } from '@angular/core/testing';

import { DipsService } from './dips.service';

describe('DipsService', () => {
  let service: DipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
