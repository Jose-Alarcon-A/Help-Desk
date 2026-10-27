import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Ticket } from '../../models/ticket';


@Component({
  selector: 'app-tarjeta-ticket',
  imports: [
    MatCardModule,
    DatePipe
  ],
  templateUrl: './tarjeta-ticket.html',
  styleUrl: './tarjeta-ticket.css',
})
export class TarjetaTicket {
  ticket = input.required<Ticket>();
}
