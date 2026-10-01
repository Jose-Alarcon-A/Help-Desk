import { Component, OnInit, inject, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-usuarios',
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {

  private usuarioService = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);

  cargando = signal(true);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({

      next: (datos) => {
        this.usuarios.set(datos);
        this.cargando.set(false);
      },

      error: (error) => {
        console.error('Error al obtener los usuarios');
        this.cargando.set(false);
      }

    });
  }

}
