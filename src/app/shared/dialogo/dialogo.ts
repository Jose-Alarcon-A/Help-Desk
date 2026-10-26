import { Component, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogoData, TipoDialogo } from './dialogo-data';

const iconos: Record<TipoDialogo, string> = {
  info: 'info',
  error: 'cancel',
  warn: 'warning_amber',
  confirm: 'help_outline',
};

@Component({
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-dialogo',
  styleUrl: './dialogo.css',
  templateUrl: './dialogo.html',
})
export class Dialogo {
  data = inject<DialogoData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<Dialogo, boolean>);

  icono = computed(() => iconos[this.data.tipo]);

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
