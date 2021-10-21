import { TestBed } from '@angular/core/testing';

import { NgxGiphyGridService } from './ngx-giphy-grid.service';

describe('NgxGiphyGridService', () => {
  let service: NgxGiphyGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGiphyGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
