import { Component, input } from '@angular/core';
import { Ticket } from '../../../models/ticket';
import { TarjetaTicket } from '../../tarjeta-ticket/tarjeta-ticket';


@Component({
  selector: 'app-kanban-columna',
  imports: [TarjetaTicket],
  templateUrl: './kanban-columna.html',
  styleUrl: './kanban-columna.css',
})
export class KanbanColumna {
  titulo = input.required<string>();
  estado = input.required<Ticket['estado']>();
  tickets = input.required<Ticket[]>();
}
