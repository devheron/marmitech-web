import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasdetailsComponent } from './categoriasdetails.component';

describe('CategoriasdetailsComponent', () => {
  let component: CategoriasdetailsComponent;
  let fixture: ComponentFixture<CategoriasdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
