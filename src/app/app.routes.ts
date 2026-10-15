import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Tickets } from './pages/tickets/tickets';
import { TicketForm } from './pages/ticket-form/ticket-form';
import { TicketDetalle } from './pages/ticket-detalle/ticket-detalle';
import { Kanban } from './pages/kanban/kanban';
import { Reportes } from './pages/reportes/reportes';
import { Error404 } from './pages/error404/error404';
import { Usuarios } from './pages/usuarios/usuarios';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'tickets',
    component: Tickets
  },
  {
    path: 'tickets/nuevo',
    component: TicketForm
  },
  {
    path: 'tickets/editar/:id',
    component: TicketForm
  },
  {
    path: 'tickets/:id',
    component: TicketDetalle
  },
  {
    path: 'usuarios',
    component: Usuarios
  },
  {
    path: 'kanban',
    component: Kanban
  },
  {
    path: 'reportes',
    component: Reportes
  },
  {
    path: '**',
    component: Error404
  }
];
