import { TestBed } from '@angular/core/testing';

import { HistoricoComprasService } from './historico-compras.service';

describe('HistoricoComprasService', () => {
  let service: HistoricoComprasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoComprasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
