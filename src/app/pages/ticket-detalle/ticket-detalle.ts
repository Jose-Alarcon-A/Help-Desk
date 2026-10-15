import { Component, OnInit, inject, signal } from '@angular/core';
import {DatePipe} from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-ticket-detalle',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './ticket-detalle.html',
  styleUrl: './ticket-detalle.css',
})
export class TicketDetalle implements OnInit {

  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);

  ticket = signal<Ticket | null>(null);
  cargando = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id == null) {
      this.error.set(true);
      this.cargando.set(false);
      return;
    }

    this.cargarTicket(id);

  }

  private cargarTicket(id: string): void {
    this.cargando.set(true);
    this.error.set(false);

    this.ticketService.obtenerTicket(id).subscribe({

      next: (ticket) => {
        this.ticket.set(ticket);
        this.cargando.set(false);
      },
      error: () => {
        console.error('Error al obtener el ticket');
        this.error.set(true);
        this.cargando.set(false);
      }

    });
  }

}
