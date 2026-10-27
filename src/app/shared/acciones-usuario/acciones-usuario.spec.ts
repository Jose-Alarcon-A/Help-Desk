import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccionesUsuario } from './acciones-usuario';
import { Usuario } from '../../models/usuario';

const usuario: Usuario = {
  id: '1',
  nombre: 'Ana Pérez',
  correo: 'ana.perez@correo.com',
  rol: 'Administrador'
};

describe('AccionesUsuario', () => {
  let component: AccionesUsuario;
  let fixture: ComponentFixture<AccionesUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccionesUsuario],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AccionesUsuario);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('usuario', usuario);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emite el usuario al solicitar la eliminación', () => {
    const recibidos: Usuario[] = [];
    component.eliminar.subscribe(u => recibidos.push(u));

    component.solicitarEliminacion();

    expect(recibidos.length).toBe(1);
    expect(recibidos[0]).toBe(usuario);
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
