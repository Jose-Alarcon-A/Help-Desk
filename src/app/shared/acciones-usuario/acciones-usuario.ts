import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../models/usuario';

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule],
  selector: 'app-acciones-usuario',
  styleUrl: './acciones-usuario.css',
  templateUrl: './acciones-usuario.html',
})
export class AccionesUsuario {
  usuario = input.required<Usuario>();
  eliminando = input(false);

  eliminar = output<Usuario>();

  solicitarEliminacion(): void {
    this.eliminar.emit(this.usuario());
  }
}
