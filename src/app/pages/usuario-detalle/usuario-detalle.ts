import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-usuario-detalle',
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './usuario-detalle.html',
  styleUrl: './usuario-detalle.css',
})
export class UsuarioDetalle implements OnInit {

  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);

  usuario = signal<Usuario | null>(null);
  cargando = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id == null) {
      this.error.set(true);
      this.cargando.set(false);
      return;
    }

    this.cargarUsuario(id);

  }

  private cargarUsuario(id: string): void {
    this.cargando.set(true);
    this.error.set(false);

    this.usuarioService.obtenerUsuario(id).subscribe({

      next: (usuario) => {
        this.usuario.set(usuario);
        this.cargando.set(false);
      },
      error: () => {
        console.error('Error al obtener el usuario');
        this.error.set(true);
        this.cargando.set(false);
      }

    });
  }

}
