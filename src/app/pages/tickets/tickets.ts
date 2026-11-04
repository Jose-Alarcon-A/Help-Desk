import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { MatIconModule } from '@angular/material/icon';
import { EstadoTicket } from '../../shared/estado-ticket/estado-ticket';
import { PrioridadTicket } from '../../shared/prioridad-ticket/prioridad-ticket';
import { AccionesTicket } from '../../shared/acciones-ticket/acciones-ticket';
import { IdTicket } from '../../shared/id-ticket/id-ticket';
import { DialogoService } from '../../shared/dialogo/dialogo.service';

@Component({
  selector: 'app-tickets',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EstadoTicket,
    PrioridadTicket,
    AccionesTicket,
    IdTicket
],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {

  private ticketService = inject(TicketService);
  private dialogo = inject(DialogoService);

  columnas: string[] = [
    'id',
    'asunto',
    'estado',
    'prioridad',
    'fechaCreacion',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Ticket>();

  cargando = signal(true);
  error = signal(false);
  eliminandoId = signal<string | null>(null);

  filtros = {
    texto:'',
    estado:'',
    prioridad:'',
    fechaDesde:'',
    fechaHasta:''
  };

  constructor(){
    this.dataSource.filterPredicate = (
      ticket: Ticket,
      filtroJson : string
    ): boolean => {
      const criterios = JSON.parse(filtroJson) as typeof this.filtros;
      const texto = criterios.texto.trim().toLocaleLowerCase();
      const coincideTexto = texto === '' || [
        ticket.id,
        ticket.asunto,
        ticket.descripcion,
        ticket.estado,
        ticket.prioridad,
      ].some(valor => String(valor).toLocaleLowerCase().includes(texto));
      const coincideEstado = criterios.estado === '' || ticket.estado === criterios.estado;
      const coincidePrioridad = criterios.prioridad === '' || ticket.prioridad === criterios.prioridad;
      const fechaTicket = ticket.fechaCreacion.slice(0, 10);
      const coincideFechaDesde = criterios.fechaDesde === '' || fechaTicket >= criterios.fechaDesde;
      const coincideFechaHasta = criterios.fechaHasta === '' || fechaTicket <= criterios.fechaHasta;

      return coincideTexto && coincideEstado && coincidePrioridad && coincideFechaDesde && coincideFechaHasta;
    };
  }

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.dataSource.filter = JSON.stringify(this.filtros);
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando.set(true);
    this.error.set(false);

    this.ticketService.obtenerTickets().subscribe({
      next: (tickets) => {
        this.dataSource.data = tickets;
        this.cargando.set(false);
      },

      error: (error) => {
        console.error('Error al cargar tickets:', error);
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  aplicarBusqueda(valor: string): void {
    this.filtros.texto = valor;
    this.aplicarFiltros();
  }

  aplicarFiltroEstado(valor: string): void {
    this.filtros.estado = valor;
    this.aplicarFiltros();
  }

  aplicarFiltroPrioridad(valor: string): void {
    this.filtros.prioridad = valor;
    this.aplicarFiltros();
  }

  aplicarFechaDesde(valor: Date | null): void {
    const fecha = valor ? valor.toISOString().slice(0, 10) : '';
    this.filtros.fechaDesde = fecha;

    if(this.filtros.fechaDesde !== '' && this.filtros.fechaDesde > this.filtros.fechaHasta) {
      this.filtros.fechaHasta = this.filtros.fechaDesde;
    }

    this.aplicarFiltros();
  }

  aplicarFechaHasta(valor: Date | null): void {
    const fecha = valor ? valor.toISOString().slice(0, 10) : '';
    this.filtros.fechaHasta = fecha;

    if(this.filtros.fechaHasta !== '' && this.filtros.fechaHasta < this.filtros.fechaDesde) {
      this.filtros.fechaDesde = this.filtros.fechaHasta;
    }

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.dataSource.filter = JSON.stringify(this.filtros);
    this.dataSource.paginator?.firstPage();
  }

  parseFecha(fechaStr: string): Date | null {
    if (!fechaStr) return null;
    const partes = fechaStr.split('-');
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  }

  eliminar(ticket: Ticket): void {
    this.dialogo.confirm(
      'Eliminar ticket',
      '¿Está seguro que desea eliminar el ticket?',
      {
        textoConfirmar: 'Eliminar',
        variante: 'warn',
        aceptar: () => this.eliminarTicket(ticket)
      }
    );
  }

  limpiarFiltros(): void {
    this.filtros = {
      texto:'',
      estado:'',
      prioridad:'',
      fechaDesde:'',
      fechaHasta:''
    }
    this.aplicarFiltros();
  }

  get sinResultado(): boolean {
    return this.dataSource.filteredData.length === 0;
  }

  private eliminarTicket(ticket: Ticket): void {
    this.eliminandoId.set(ticket.id);

    this.ticketService.eliminarTicket(ticket.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.cargarTickets();
        this.dialogo.info('Eliminado', 'El ticket fue eliminado correctamente.');
      },
      error: (error) => {
        console.error('Error al intentar eliminar el ticket:', error);
        this.eliminandoId.set(null);
        this.dialogo.error('Error', 'No fue posible eliminar el ticket. Intente nuevamente.');
      }
    });
  }
}
