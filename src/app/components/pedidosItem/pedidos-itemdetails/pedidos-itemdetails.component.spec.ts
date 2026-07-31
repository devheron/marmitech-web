import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosItemdetailsComponent } from './pedidos-itemdetails.component';

describe('PedidosItemdetailsComponent', () => {
  let component: PedidosItemdetailsComponent;
  let fixture: ComponentFixture<PedidosItemdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosItemdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosItemdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
