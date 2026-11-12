import { Component, computed, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../models/ticket';
import { Sesion } from '../../services/sesion';

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule],
  selector: 'app-acciones-ticket',
  styleUrl: './acciones-ticket.css',
  templateUrl: './acciones-ticket.html',
})
export class AccionesTicket {
  ticket = input.required<Ticket>();
  eliminando = input(false);

  eliminar = output<Ticket>();

  private readonly sesion = inject(Sesion);

  readonly puedeEditar = computed(() => this.sesion.tieneAlgunRol(['Soporte', 'Administrador']));

  readonly puedeEliminar = computed(() => this.sesion.tieneAlgunRol(['Soporte', 'Administrador']));

  solicitarEliminacion(): void {
    this.eliminar.emit(this.ticket());
  }

}
