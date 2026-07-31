import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaslistComponent } from './categoriaslist.component';

describe('CategoriaslistComponent', () => {
  let component: CategoriaslistComponent;
  let fixture: ComponentFixture<CategoriaslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
