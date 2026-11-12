import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Tickets } from './pages/tickets/tickets';
import { TicketForm } from './pages/ticket-form/ticket-form';
import { TicketDetalle } from './pages/ticket-detalle/ticket-detalle';
import { Kanban } from './pages/kanban/kanban';
import { Reportes } from './pages/reportes/reportes';
import { Error404 } from './pages/error404/error404';
import { Usuarios } from './pages/usuarios/usuarios';
import { UsuarioForm } from './pages/usuario-form/usuario-form';
import { UsuarioDetalle } from './pages/usuario-detalle/usuario-detalle';

import { requiereRoles, sesionGuard } from './guards/acceso-guard';
import { Login } from './pages/login/login';
import { SinAcceso } from './pages/sin-acceso/sin-acceso';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'sin-acceso',
    canActivate: [sesionGuard],
    component: SinAcceso
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [sesionGuard]
  },
  {
    path: 'tickets',
    component: Tickets,
    canActivate: [sesionGuard]
  },
  {
    path: 'tickets/nuevo',
    component: TicketForm,
    canActivate: [requiereRoles('Administrador', 'Soporte')]
  },
  {
    path: 'tickets/editar/:id',
    component: TicketForm,
    canActivate: [requiereRoles('Administrador', 'Soporte')]
  },
  {
    path: 'tickets/:id',
    component: TicketDetalle,
    canActivate: [sesionGuard]
  },
  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [sesionGuard]
  },
  {
    path: 'usuarios/nuevo',
    component: UsuarioForm,
    canActivate: [sesionGuard]
  },
  {
    path: 'usuarios/editar/:id',
    component: UsuarioForm,
    canActivate: [sesionGuard]
  },
  {
    path: 'usuarios/:id',
    component: UsuarioDetalle,
    canActivate: [sesionGuard]
  },
  {
    path: 'kanban',
    component: Kanban,
    canActivate: [requiereRoles('Administrador', 'Soporte')]
  },
  {
    path: 'reportes',
    component: Reportes,
    canActivate: [requiereRoles('Administrador')]
  },
  {
    path: '**',
    redirectTo: 'error404'
  }
];
