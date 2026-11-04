import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { KanbanColumna } from './kanban-columna/kanban-columna';
import { CdkDropListGroup} from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [KanbanColumna, CdkDropListGroup, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatIconModule],
  selector: 'app-kanban',
  styleUrl: './kanban.css',
  templateUrl: './kanban.html',
})
export class Kanban implements OnInit{
  private ticketService = inject(TicketService);

  estados = [
    {
      nombre: 'Abierto',
      titulo: 'Abiertos'
    },
    {
      nombre: 'En proceso',
      titulo: 'En proceso'
    },
    {
      nombre: 'Cerrado',
      titulo: 'Cerrados'
    }
  ] as const;

  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  errorCarga = signal(false);
  actualizandoId = signal(<string | null>(null));
  mensajeError = signal('');

  filtros = signal<{
    texto: string;
    estado: string;
    prioridad: string;
    fechaDesde: string;
    fechaHasta: string;
  }>({
    texto: '',
    estado: '',
    prioridad: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  ticketsFiltrados = computed(() => {
    const f = this.filtros();
    const texto = f.texto.trim().toLocaleLowerCase();
    return this.tickets().filter(ticket => {
      const coincideTexto = texto === '' || [
        ticket.id,
        ticket.asunto,
        ticket.descripcion,
        ticket.estado,
        ticket.prioridad
      ].some(valor => String(valor).toLocaleLowerCase().includes(texto));
      const coincideEstado = f.estado === '' || ticket.estado === f.estado;
      const coincidePrioridad = f.prioridad === '' || ticket.prioridad === f.prioridad;
      const fechaTicket = ticket.fechaCreacion.slice(0, 10);
      const coincideDesde = f.fechaDesde === '' || fechaTicket >= f.fechaDesde;
      const coincideHasta = f.fechaHasta === '' || fechaTicket <= f.fechaHasta;
      return coincideTexto && coincideEstado && coincidePrioridad && coincideDesde && coincideHasta;
    }).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  });

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando.set(true);
    this.errorCarga.set(false);

    this.ticketService.obtenerTickets().subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error("Error al cargar tickets: ", error)
        this.cargando.set(false);
        this.errorCarga.set(true);
      }
    });
  }

  ticketsPorEstado(estado: Ticket['estado']): Ticket[] {
    return this.ticketsFiltrados().filter(ticket => ticket.estado === estado);
  }

  aplicarBusqueda(valor: string): void {
    this.filtros.update(f => ({ ...f, texto: valor }));
  }

  aplicarFiltroEstado(valor: string): void {
    this.filtros.update(f => ({ ...f, estado: valor }));
  }

  aplicarFiltroPrioridad(valor: string): void {
    this.filtros.update(f => ({ ...f, prioridad: valor }));
  }

  aplicarFechaDesde(valor: Date | null): void {
    const fecha = valor ? valor.toISOString().slice(0, 10) : '';
    this.filtros.update(f => {
      let hasta = f.fechaHasta;
      if (fecha !== '' && fecha > f.fechaHasta) {
        hasta = fecha;
      }
      return { ...f, fechaDesde: fecha, fechaHasta: hasta };
    });
  }

  aplicarFechaHasta(valor: Date | null): void {
    const fecha = valor ? valor.toISOString().slice(0, 10) : '';
    this.filtros.update(f => {
      let desde = f.fechaDesde;
      if (fecha !== '' && fecha < f.fechaDesde) {
        desde = fecha;
      }
      return { ...f, fechaDesde: desde, fechaHasta: fecha };
    });
  }

  limpiarFiltros(): void {
    this.filtros.set({
      texto: '',
      estado: '',
      prioridad: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  }

  parseFecha(fechaStr: string): Date | null {
    if (!fechaStr) return null;
    const partes = fechaStr.split('-');
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  }

  actualizarEstado(ticket: Ticket, nuevoEstado: Ticket['estado']): void
  {
    if (ticket.estado === nuevoEstado || this.actualizandoId() === ticket.id)
    {
      return;
    }
    this.actualizandoId.set(ticket.id);
    this.mensajeError.set('');

    const datosActualizados: Omit<Ticket, 'id'> = {
      asunto: ticket.asunto,
      descripcion: ticket.descripcion,
      estado: nuevoEstado,
      prioridad: ticket.prioridad,
      fechaCreacion: ticket.fechaCreacion
    };

    this.ticketService.actualizarTicket(ticket.id, datosActualizados).subscribe({
      next: (ticketGuardado) => {
        this.tickets.update(lista => lista.map(actual => actual.id === ticketGuardado.id ? ticketGuardado: actual));

        this.actualizandoId.set(null);
      },
      error: (error) => {
        console.error('Error al intentar cambiar el estado del ticket', error);

        this.mensajeError.set('No fue posible cambiar el estado.');

        this.actualizandoId.set(null);
      }
    });
  }
}
