import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricodetailsComponent } from './historicodetails.component';

describe('HistoricodetailsComponent', () => {
  let component: HistoricodetailsComponent;
  let fixture: ComponentFixture<HistoricodetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricodetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricodetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
