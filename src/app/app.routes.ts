import { Routes } from '@angular/router';

import { Reportes } from './pages/reportes/reportes';
import { Kanban } from './pages/kanban/kanban';
import { Tickets } from './pages/tickets/tickets';
import { Dashboard } from './pages/dashboard/dashboard';
import { Error404 } from './pages/error404/error404';
import { Acerca } from './pages/acerca/acerca';

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
    path: 'kanban',
    component: Kanban
  },
  {
    path: 'reportes',
    component: Reportes
  },
  {
    path: 'acerca',
    component: Acerca
  },
  {
    path: '**',
    component: Error404
  }
];

