import { Component, input } from '@angular/core';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-prioridad-ticket',
  imports: [],
  templateUrl: './prioridad-ticket.html',
  styleUrl: './prioridad-ticket.css',
})
export class PrioridadTicket {
  prioridad = input.required<Ticket['prioridad']>();
}
