import { TestBed, inject } from '@angular/core/testing';

import { MetaCoinService } from './meta-coin.service';

describe('MetaCoinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetaCoinService]
    });
  });

  it('should be created', inject([MetaCoinService], (service: MetaCoinService) => {
    expect(service).toBeTruthy();
  }));
});
