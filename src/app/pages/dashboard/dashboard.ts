import { Component, computed, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';
import { TarjetaIndicador } from '../../shared/tarjeta-indicador/tarjeta-indicador';
import { GraficoTickets, type SerieTickets } from '../../shared/grafico-tickets/grafico-tickets';

type FiltroPrioridad = Ticket['prioridad'] | 'Todas';

interface ResumenTickets {
  total: number;
  abiertos: number;
  enProceso: number;
  cerrados: number;
  altaPendientes: number;
}
@Component({
  imports: [TarjetaIndicador, DecimalPipe, FormsModule, MatButtonModule, GraficoTickets],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tickets = signal<Ticket[]>([]);
  readonly cargando = signal(false);
  readonly errorCarga = signal('');
  readonly prioridadSeleccionada = signal<FiltroPrioridad>('Todas');

  readonly opcionesProridad:FiltroPrioridad[] = [
    'Todas',
    'Baja',
    'Media',
    'Alta'
  ];

  readonly ticketsFiltrados = computed(() => {
    const prioridad = this.prioridadSeleccionada();
    const tickets = this.tickets();

    return prioridad === 'Todas' ? tickets : tickets.filter(ticket => ticket.prioridad === prioridad);
  });

  readonly alcance = computed(() => {
    const prioridad = this.prioridadSeleccionada();

    return  prioridad === 'Todas' ? 'Todas las prioridades' : `Prioridad ${prioridad.toLocaleLowerCase()}`;
  });

  readonly resumen = computed<ResumenTickets>(() => {
    const inicial: ResumenTickets = {
      total: 0,
      abiertos: 0,
      enProceso: 0,
      cerrados: 0,
      altaPendientes: 0
    }

    return this.ticketsFiltrados().reduce((acumulado, ticket) => {
      acumulado.total += 1;

      switch (ticket.estado) {
        case 'Abierto': acumulado.abiertos += 1;
                        break;
        case 'En proceso': acumulado.enProceso += 1;
                        break;
        case 'Cerrado': acumulado.cerrados += 1;
                        break;
      }

      if (ticket.prioridad === 'Alta' && ticket.estado !=='Cerrado') {
        acumulado.altaPendientes += 1;
      }

      return acumulado;
    }, inicial);
  });

  readonly pendientes = computed(() => {
    const resumen = this.resumen();

    return resumen.abiertos + resumen.cerrados;
  });

  // clase 10-11-2026
  readonly serieEstados = computed<SerieTickets[]>(() => {
    const resumen = this.resumen();

    return [
      { etiqueta: 'Abiertos', cantidad: resumen.abiertos, color: '#2e4edf' },
      { etiqueta: 'En proceso', cantidad: resumen.enProceso, color: '#ff9800' },
      { etiqueta: 'Cerrados', cantidad: resumen.cerrados, color: '#4caf50' }
    ];
  });

  readonly serieCierre = computed<SerieTickets[]>(() => [
      { etiqueta: 'Pendientes',
        cantidad: this.pendientes(), color: '#2563eb'
      },
      { etiqueta: 'Cerrados',
        cantidad: this.resumen().cerrados, color: '#b45309'
      }
    ]
  );

  //Tarea1 Clase
  readonly seriePendientesPorPrioridad = computed<SerieTickets[]>(() => {
  const tickets = this.ticketsFiltrados();

  const contar = (prioridad: Ticket['prioridad']) =>
    tickets.filter(t =>
      t.prioridad === prioridad &&
      (t.estado === 'Abierto' || t.estado === 'En proceso')
    ).length;

    return [
      { etiqueta: 'Baja',   cantidad: contar('Baja'),   color: '#4caf50' },
      { etiqueta: 'Media',  cantidad: contar('Media'),  color: '#ff9800' },
      { etiqueta: 'Alta',   cantidad: contar('Alta'),   color: '#f44336' }
    ];
  });
  //Tarea2 Clase
  readonly totalPendientes = computed(() => {
    const r = this.resumen();
    return r.abiertos + r.enProceso;
  });

  readonly serieComposicionPendiente = computed<SerieTickets[]>(() => {
    const r = this.resumen();
    return [
      { etiqueta: 'Abiertos', cantidad: r.abiertos, color: '#2e4edf' },
      { etiqueta: 'En proceso', cantidad: r.enProceso, color: '#ff9800' }
    ];
  });

//Tarea3 clase
  readonly serieTicketsPorDia = computed<SerieTickets[]>(() => {
    const tickets = this.ticketsFiltrados();

    const porDia = new Map<string, number>();
    for (const t of tickets) {
      porDia.set(t.fechaCreacion, (porDia.get(t.fechaCreacion) ?? 0) + 1);
    }

    return Array.from(porDia.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, cantidad]) => ({ etiqueta: fecha, cantidad, color: '#2e4edf' }));
  });

// clase 10-11-2026


  readonly porcentajeCerrados = computed(() => {
    const resumen = this.resumen();

    return resumen.total === 0 ? 0 : (resumen.cerrados / resumen.total) * 100;
  });

  readonly estadoPrioridadAlta = computed(() => {
    const prioridad = this.prioridadSeleccionada();

    if (prioridad === 'Baja' || prioridad === 'Media') {
      return 'La selección excluye la prioridad alta';
    }

    return this.resumen().altaPendientes > 0 ? 'Hay pendientes de prioridad alta' : 'Sin pendientes de prioridad alta'
  });

  readonly tituloOperacional = computed(() => {
    if (this.resumen().total === 0){
      return 'Sin tickets en la selección';
    }

    return this.pendientes() === 0 ? 'Todos los tickets de la selección están cerrados' : 'Hay tickets pendientes de cierre';
  });

  readonly textoOperacional = computed (() => {
    const resumen = this.resumen();

    if (resumen.total === 0) {
      return 'Seleccione otra prioridad o registre nuevos tickets'
    }

    if (this.pendientes() === 0) {
      return `Tickets cerrados: ${resumen.cerrados}`;
    }

    return [
      `Abiertos: ${resumen.abiertos}`,
      `En proceso: ${resumen.enProceso}`,
      `Cerrados: ${resumen.cerrados}`,
      `Pendientes de prioridad: ${resumen.altaPendientes}`
    ].join(' ');
  });

  ngOnInit(): void {
    this.cargarTickets();
  }

  cambiarPrioridad(prioridad: FiltroPrioridad): void {
    this.prioridadSeleccionada.set(prioridad);
  }

  limpiarFiltro(): void {
    this.prioridadSeleccionada.set('Todas');
  }

  cargarTickets(): void {
    if (this.cargando()) {
      return;
    }

    this.cargando.set(true);
    this.errorCarga.set('');

    this.ticketService.obtenerTickets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tickets) => {
          this.tickets.set(tickets);
          this.cargando.set(false);
        },
        error: (error: unknown) => {
          console.error('Error al cargar el dashboard:', error);
          this.errorCarga.set('No fue posible catgar los indicadores');
          this.cargando.set(false);
        }
      });
  }
}
