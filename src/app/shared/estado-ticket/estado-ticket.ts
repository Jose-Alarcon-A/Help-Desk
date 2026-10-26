import { Component, input } from '@angular/core';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-estado-ticket',
  imports: [],
  templateUrl: './estado-ticket.html',
  styleUrl: './estado-ticket.css',
})
export class EstadoTicket {

  estado = input.required<Ticket['estado']>();

}
