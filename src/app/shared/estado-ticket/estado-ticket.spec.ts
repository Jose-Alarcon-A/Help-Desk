import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoTicket } from './estado-ticket';

describe('EstadoTicket', () => {
  let component: EstadoTicket;
  let fixture: ComponentFixture<EstadoTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadoTicket);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('estado', 'Abierto');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el estado con su clase correspondiente', () => {
    const span = (fixture.nativeElement as HTMLElement)
      .querySelector('span.estado');

    expect(span?.textContent?.trim()).toBe('Abierto');
    expect(span?.classList.contains('abierto')).toBe(true);
  });
});
