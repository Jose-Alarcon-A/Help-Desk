import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-tickets',
  imports: [
    MatCardModule,
    MatIconModule,
    DatePipe
  ],
  styleUrl: './tickets.css',
  templateUrl: './tickets.html',
})
export class Tickets implements OnInit {

  private ticketService = inject(TicketService);

  tickets = signal<Ticket[]>([]);

  cargando = signal(true);

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {

    this.ticketService.obtenerTickets().subscribe({

      next: (datos) => {
        this.tickets.set(datos);

        this.cargando.set(false);

      },

      error: (error) => {
        console.error('Error al obtener los tickets');

        this.cargando.set(false);

      }

    });

  }

}
