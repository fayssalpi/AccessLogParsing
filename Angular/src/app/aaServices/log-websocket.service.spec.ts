import { TestBed } from '@angular/core/testing';

import { LogWebsocketService } from './log-websocket.service';

describe('LogWebsocketService', () => {
  let service: LogWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
