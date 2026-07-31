import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosFilaComponent } from './pedidos-fila.component';

describe('PedidosFilaComponent', () => {
  let component: PedidosFilaComponent;
  let fixture: ComponentFixture<PedidosFilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosFilaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosFilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
