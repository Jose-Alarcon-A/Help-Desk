import { Component, input, output } from '@angular/core';
import { Ticket } from '../../../models/ticket';
import { TarjetaTicket } from '../../tarjeta-ticket/tarjeta-ticket';
import { CdkDrag, CdkDropList, CdkDragDrop, CdkDragHandle } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-kanban-columna',
  imports: [TarjetaTicket, CdkDrag, CdkDropList],
  templateUrl: './kanban-columna.html',
  styleUrl: './kanban-columna.css',
})
export class KanbanColumna {
  titulo = input.required<string>();
  estado = input.required<Ticket['estado']>();
  tickets = input.required<Ticket[]>();

  cambiarEstado = output<{
    ticket: Ticket;
    nuevoEstado: Ticket['estado'];
  }>();

  /*
  listaId = input.required<string>();
  listaConectada = input<string[]>([]);
*/
  moverTicket = output<{
    ticket: Ticket,
    estadoDestino: Ticket['estado'];
  }>();

  soltarTicket(evento: CdkDragDrop<Ticket[]>): void
  {
    const ticket = evento.item.data as Ticket;

    if(ticket.estado === this.estado()){
      return;
    }
    this.moverTicket.emit ({
      ticket,
      estadoDestino: this.estado()
    });
  }
}
