import { TestBed } from '@angular/core/testing';

import { PedidoItemService } from './pedido-item.service';

describe('PedidoItemService', () => {
  let service: PedidoItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
