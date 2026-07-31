import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricolistComponent } from './historicolist.component';

describe('HistoricolistComponent', () => {
  let component: HistoricolistComponent;
  let fixture: ComponentFixture<HistoricolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricolistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
