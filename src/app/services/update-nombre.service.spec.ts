import { TestBed } from '@angular/core/testing';

import { UpdateNombreService } from './update-nombre.service';

describe('UpdateNombreService', () => {
  let service: UpdateNombreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateNombreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
