import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { vi } from 'vitest';

import { Dialogo } from './dialogo';
import { DialogoService } from './dialogo.service';
import { DialogoData, TipoDialogo } from './dialogo-data';

describe('Dialogo', () => {
  let closeSpy: ReturnType<typeof vi.fn>;
  let fixture: ComponentFixture<Dialogo>;

  async function crearDialogo(tipo: TipoDialogo, textos: Partial<DialogoData> = {}): Promise<void> {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: { tipo, titulo: 'Título', mensaje: 'Mensaje', ...textos }
    });
    TestBed.overrideProvider(MatDialogRef, { useValue: { close: closeSpy } });

    fixture = TestBed.createComponent(Dialogo);
    await fixture.whenStable();
  }

  function botones(): NodeListOf<HTMLButtonElement> {
    return (fixture.nativeElement as HTMLElement)
      .querySelectorAll('mat-dialog-actions button');
  }

  beforeEach(async () => {
    closeSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Dialogo],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: closeSpy } }
      ]
    }).compileComponents();
  });

  it('should create', async () => {
    await crearDialogo('info');

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('info: muestra solo el botón Cerrar con icono info', async () => {
    await crearDialogo('info');

    const elemento = fixture.nativeElement as HTMLElement;

    expect(botones().length).toBe(1);
    expect(botones()[0].textContent?.trim()).toBe('Cerrar');
    expect(elemento.querySelector('.icono mat-icon')?.textContent?.trim()).toBe('info');
  });

  it('error: muestra solo el botón Aceptar con icono cancel', async () => {
    await crearDialogo('error');

    const elemento = fixture.nativeElement as HTMLElement;

    expect(botones().length).toBe(1);
    expect(botones()[0].textContent?.trim()).toBe('Aceptar');
    expect(elemento.querySelector('.icono mat-icon')?.textContent?.trim()).toBe('cancel');
  });

  it('warn: muestra solo el botón Aceptar con icono warning_amber', async () => {
    await crearDialogo('warn');

    const elemento = fixture.nativeElement as HTMLElement;

    expect(botones().length).toBe(1);
    expect(botones()[0].textContent?.trim()).toBe('Aceptar');
    expect(elemento.querySelector('.icono mat-icon')?.textContent?.trim()).toBe('warning_amber');
  });

  it('confirm: muestra los botones Cancelar y Aceptar con icono help_outline', async () => {
    await crearDialogo('confirm');

    const elemento = fixture.nativeElement as HTMLElement;

    expect(botones().length).toBe(2);
    expect(botones()[0].textContent?.trim()).toBe('Cancelar');
    expect(botones()[1].textContent?.trim()).toBe('Aceptar');
    expect(elemento.querySelector('.icono mat-icon')?.textContent?.trim()).toBe('help_outline');
  });

  it('confirm: permite personalizar los textos de los botones', async () => {
    await crearDialogo('confirm', { textoConfirmar: 'Eliminar', textoCancelar: 'Salir' });

    expect(botones()[0].textContent?.trim()).toBe('Salir');
    expect(botones()[1].textContent?.trim()).toBe('Eliminar');
  });

  it('confirmar cierra el diálogo con true', async () => {
    await crearDialogo('confirm');

    fixture.componentInstance.confirmar();

    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('cancelar cierra el diálogo con false', async () => {
    await crearDialogo('confirm');

    fixture.componentInstance.cancelar();

    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('cerrar cierra el diálogo sin resultado', async () => {
    await crearDialogo('info');

    fixture.componentInstance.cerrar();

    expect(closeSpy).toHaveBeenCalledWith();
  });
});

describe('DialogoService', () => {
  let service: DialogoService;
  let openSpy: ReturnType<typeof vi.fn>;
  let afterClosed$: Subject<boolean | undefined>;

  beforeEach(() => {
    afterClosed$ = new Subject<boolean | undefined>();

    openSpy = vi.fn(() => ({
      afterClosed: (): Observable<boolean | undefined> => afterClosed$.asObservable(),
      close: vi.fn()
    }));

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open: openSpy } }]
    });

    service = TestBed.inject(DialogoService);
  });

  function ultimaLlamada(): { data: DialogoData, disableClose: boolean } {
    const config = openSpy.mock.calls[0][1];
    return { data: config.data, disableClose: config.disableClose };
  }

  it('info abre un diálogo de tipo info con cierre por fondo', () => {
    service.info('Guardado', 'Operación exitosa');

    expect(openSpy.mock.calls[0][0]).toBe(Dialogo);
    expect(ultimaLlamada().data.tipo).toBe('info');
    expect(ultimaLlamada().data.titulo).toBe('Guardado');
    expect(ultimaLlamada().data.mensaje).toBe('Operación exitosa');
    expect(ultimaLlamada().disableClose).toBe(false);
  });

  it('error abre un diálogo de tipo error', () => {
    service.error('Error', 'Algo falló', 'Vale');

    expect(ultimaLlamada().data.tipo).toBe('error');
    expect(ultimaLlamada().data.textoAceptar).toBe('Vale');
  });

  it('warn abre un diálogo de tipo warn', () => {
    service.warn('Advertencia', 'Cuidado');

    expect(ultimaLlamada().data.tipo).toBe('warn');
  });

  it('confirm abre un diálogo que no se cierra por fondo', () => {
    service.confirm('Confirmar', '¿Continuar?');

    expect(ultimaLlamada().data.tipo).toBe('confirm');
    expect(ultimaLlamada().disableClose).toBe(true);
  });

  it('confirm ejecuta aceptar al confirmar', () => {
    const aceptar = vi.fn();
    const cancelar = vi.fn();

    service.confirm('Confirmar', '¿Continuar?', { aceptar, cancelar });

    afterClosed$.next(true);

    expect(aceptar).toHaveBeenCalledTimes(1);
    expect(cancelar).not.toHaveBeenCalled();
  });

  it('confirm ejecuta cancelar al cancelar', () => {
    const aceptar = vi.fn();
    const cancelar = vi.fn();

    service.confirm('Confirmar', '¿Continuar?', { aceptar, cancelar });

    afterClosed$.next(false);

    expect(aceptar).not.toHaveBeenCalled();
    expect(cancelar).toHaveBeenCalledTimes(1);
  });

  it('confirm ejecuta cancelar cuando el diálogo se cierra sin resultado', () => {
    const cancelar = vi.fn();

    service.confirm('Confirmar', '¿Continuar?', { cancelar });

    afterClosed$.next(undefined);

    expect(cancelar).toHaveBeenCalledTimes(1);
  });

  it('confirm funciona sin callbacks', () => {
    service.confirm('Confirmar', '¿Continuar?');

    afterClosed$.next(true);

    expect(openSpy).toHaveBeenCalledTimes(1);
  });
});
