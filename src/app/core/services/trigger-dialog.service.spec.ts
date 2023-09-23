import { TestBed } from '@angular/core/testing';

import { TriggerDialogService } from './trigger-dialog.service';

describe('TriggerDialogService', () => {
  let service: TriggerDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriggerDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
