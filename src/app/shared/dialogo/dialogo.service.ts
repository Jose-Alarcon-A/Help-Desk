import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Dialogo } from './dialogo';
import { DialogoConfirmOptions, DialogoData, TipoDialogo } from './dialogo-data';

@Injectable({ providedIn: 'root' })
export class DialogoService {
  private dialog = inject(MatDialog);

  info(titulo: string, mensaje: string, textoCerrar?: string): MatDialogRef<Dialogo> {
    return this.abrir('info', titulo, mensaje, { textoCerrar });
  }

  error(titulo: string, mensaje: string, textoAceptar?: string): MatDialogRef<Dialogo> {
    return this.abrir('error', titulo, mensaje, { textoAceptar });
  }

  warn(titulo: string, mensaje: string, textoAceptar?: string): MatDialogRef<Dialogo> {
    return this.abrir('warn', titulo, mensaje, { textoAceptar });
  }

  confirm(titulo: string, mensaje: string, opciones?: DialogoConfirmOptions): void {
    const { aceptar, cancelar, ...textos } = opciones ?? {};

    const ref = this.abrir('confirm', titulo, mensaje, textos);

    ref.afterClosed().subscribe(resultado => {
      if (resultado === true) {
        aceptar?.();
      } else {
        cancelar?.();
      }
    });
  }

  private abrir(
    tipo: TipoDialogo,
    titulo: string,
    mensaje: string,
    textos: Partial<Pick<DialogoData, 'textoCerrar' | 'textoAceptar' | 'textoConfirmar' | 'textoCancelar'>> = {}
  ): MatDialogRef<Dialogo> {
    return this.dialog.open(Dialogo, {
      width: '430px',
      maxWidth: '95vw',
      disableClose: tipo === 'confirm',
      data: { tipo, titulo, mensaje, ...textos }
    });
  }
}
