import {
  Component,
  OnInit,
  ViewChild,
  inject,
  signal
} from '@angular/core';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';
import { RolUsuario } from '../../shared/rol-usuario/rol-usuario';
import { CorreoUsuario } from '../../shared/correo-usuario/correo-usuario';
import { AccionesUsuario } from '../../shared/acciones-usuario/acciones-usuario';
import { DialogoService } from '../../shared/dialogo/dialogo.service';


@Component({
  selector: 'app-usuarios',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RolUsuario,
    CorreoUsuario,
    AccionesUsuario
],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  columnas: string[] = [
    'id',
    'nombre',
    'correo',
    'rol',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Usuario>();

  private usuarioService = inject(UsuarioService);

  private dialogo = inject(DialogoService);

  cargando = signal(true);

  error = signal(false);

  eliminandoId = signal<string | null>(null);

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }


  ngOnInit(): void {
    this.cargarUsuarios();
  }


  cargarUsuarios(): void {
    this.cargando.set(true);
    this.error.set(false);

    this.usuarioService.obtenerUsuarios().subscribe({

      next: (datos) => {

        this.dataSource.data = datos;

        this.cargando.set(false);

      },

      error: (error) => {

        console.error('Error al obtener los usuarios', error);

        this.error.set(true);

        this.cargando.set(false);

      }

    });

  }

  eliminarUsuario(usuario: Usuario): void {
    this.dialogo.confirm(
      'Eliminar usuario',
      `¿Estás seguro de eliminar el usuario ${usuario.nombre}?`,
      {
        textoConfirmar: 'Eliminar',
        aceptar: () => this.eliminar(usuario)
      }
    );
  }

  private eliminar(usuario: Usuario): void {
    this.eliminandoId.set(usuario.id);

    this.usuarioService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al eliminar el usuario', error);
        this.eliminandoId.set(null);
        this.dialogo.error('Error', 'No fue posible eliminar el usuario. Intente nuevamente.');
      }
    });
  }


}
