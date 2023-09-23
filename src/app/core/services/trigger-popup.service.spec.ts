import { TestBed } from '@angular/core/testing';

import { TriggerPopupService } from './trigger-popup.service';

describe('TriggerPopupService', () => {
  let service: TriggerPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriggerPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
