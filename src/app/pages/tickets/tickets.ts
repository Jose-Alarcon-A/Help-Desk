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

import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';


@Component({
  selector: 'app-tickets',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe
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
    'fechaCreacion'
  ];

  dataSource = new MatTableDataSource<Ticket>();

  private ticketService = inject(TicketService);

  tickets = signal<Ticket[]>([]);

  cargando = signal(true);

  error = signal(false);

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

}
