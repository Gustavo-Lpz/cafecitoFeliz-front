import { TestBed } from '@angular/core/testing';

import { SearchServiceTs } from './search.service.ts';

describe('SearchServiceTs', () => {
  let service: SearchServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
