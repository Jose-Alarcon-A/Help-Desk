import {
  Component,
  OnInit,
  ViewChild,
  inject,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import { MatIconModule } from '@angular/material/icon';

import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-tickets',
  imports: [
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    RouterLink
],
  styleUrl: './tickets.css',
  templateUrl: './tickets.html',
})
export class Tickets implements OnInit {

  columnas: string[] = [
    'id',
    'asunto',
    'estado',
    'prioridad',
    'fechaCreacion',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Ticket>();

  private ticketService = inject(TicketService);

  tickets = signal<Ticket[]>([]);

  cargando = signal(true);

  error = signal(false);

  eliminandoId = signal<string | null>(null);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {

    this.ticketService.obtenerTickets().subscribe({

      next: (tickets) => {

        this.tickets.set(tickets);

        this.dataSource.data = tickets;

        this.cargando.set(false);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });

      },

      error: (error) => {

        console.error('Error al obtener los tickets', error);

        this.error.set(true);

        this.cargando.set(false);

      }

    });

  }

  eliminarTicket(ticket: Ticket): void {
    const confirmado = confirm(`¿Estás seguro de eliminar ticket ${ticket.asunto}?`);

    if(!confirmado){
      return;
    }

    this.eliminandoId.set(ticket.id);

    this.ticketService.eliminarTicekt(ticket.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.cargarTickets();
      },
      error: (error) => {
        console.error('Error al eliminar el ticket', error);
        this.eliminandoId.set(null);
      }
    });

  }


}
