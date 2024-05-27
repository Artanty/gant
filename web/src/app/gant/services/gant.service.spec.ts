import { TestBed } from '@angular/core/testing';

import { GantService } from './gant.service';

describe('GantService', () => {
  let service: GantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
