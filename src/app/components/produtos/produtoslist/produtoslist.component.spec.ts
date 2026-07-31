import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoslistComponent } from './produtoslist.component';

describe('ProdutoslistComponent', () => {
  let component: ProdutoslistComponent;
  let fixture: ComponentFixture<ProdutoslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
