import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccionesTicket } from './acciones-ticket';
import { Ticket } from '../../models/ticket';

const ticket: Ticket = {
  id: '1',
  asunto: 'Sin conexión',
  descripcion: 'No hay internet en el piso 2',
  estado: 'Abierto',
  prioridad: 'Alta',
  fechaCreacion: '2026-01-15'
};

describe('AccionesTicket', () => {
  let component: AccionesTicket;
  let fixture: ComponentFixture<AccionesTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccionesTicket],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AccionesTicket);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ticket', ticket);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emite el ticket al solicitar la eliminación', () => {
    const recibidos: Ticket[] = [];
    component.eliminar.subscribe(t => recibidos.push(t));

    component.solicitarEliminacion();

    expect(recibidos.length).toBe(1);
    expect(recibidos[0]).toBe(ticket);
  });

  it('deshabilita el botón eliminar cuando eliminando es true', async () => {
    fixture.componentRef.setInput('eliminando', true);
    await fixture.whenStable();

    const boton = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('button.eliminar');

    expect(boton?.disabled).toBe(true);
  });

  it('habilita el botón eliminar cuando eliminando es false', async () => {
    const boton = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('button.eliminar');

    expect(boton?.disabled).toBe(false);
  });
});
