import { TestBed } from '@angular/core/testing';

import { ChartButtonService } from './chart-button.service';

describe('ChartButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartButtonService = TestBed.get(ChartButtonService);
    expect(service).toBeTruthy();
  });
});
