import { Component, input } from '@angular/core';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-id-ticket',
  imports: [],
  templateUrl: './id-ticket.html',
  styleUrl: './id-ticket.css',
})
export class IdTicket {
  id = input.required<Ticket['id']>();
}
