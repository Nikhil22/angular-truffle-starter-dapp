import { TestBed, inject } from '@angular/core/testing';

import { MetaCoinService } from './meta-coin.service';
import {Web3Service} from './services'

describe('MetaCoinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetaCoinService, Web3Service]
    });
  });

  it('should be created', inject([MetaCoinService], (service: MetaCoinService) => {
    expect(service).toBeTruthy();
  }));
});
