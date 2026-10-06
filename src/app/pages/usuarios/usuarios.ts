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


@Component({
  selector: 'app-usuarios',
  imports: [
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  columnas: string[] = [
    'id',
    'nombre',
    'correo',
    'rol'
  ];

  dataSource = new MatTableDataSource<Usuario>();

  private usuarioService = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);

  cargando = signal(true);

  error = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.cargarUsuarios();
  }


  cargarUsuarios(): void {

    this.usuarioService.obtenerUsuarios().subscribe({

      next: (datos) => {

        this.usuarios.set(datos);

        this.dataSource.data = datos;

        this.cargando.set(false);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });

      },

      error: (error) => {

        console.error('Error al obtener los usuarios');

        this.error.set(true);

        this.cargando.set(false);

      }

    });

  }

}
