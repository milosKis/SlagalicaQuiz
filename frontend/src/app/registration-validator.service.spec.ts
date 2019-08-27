import { TestBed } from '@angular/core/testing';

import { RegistrationValidatorService } from './registration-validator.service';

describe('RegistrationValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationValidatorService = TestBed.get(RegistrationValidatorService);
    expect(service).toBeTruthy();
  });
});
