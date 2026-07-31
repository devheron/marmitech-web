import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosItemlistComponent } from './pedidos-itemlist.component';

describe('PedidosItemlistComponent', () => {
  let component: PedidosItemlistComponent;
  let fixture: ComponentFixture<PedidosItemlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosItemlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosItemlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
