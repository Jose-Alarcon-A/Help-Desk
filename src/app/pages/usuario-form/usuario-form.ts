import { Component, inject, signal, OnInit} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css'
})
export class UsuarioForm implements OnInit{

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  modoEdicion = signal(false);

  guardando = signal(false);
  errorGuardado = signal(false);

  cargando = signal(false);
  errorCargado = signal(false);

  usuarioId: string | null = null;

  usuarioForm = this.fb.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    ],

    correo: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    rol: [
      'Usuario' as Usuario['rol'],
      Validators.required
    ]
  });

  ngOnInit() : void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id !== null) {
      this.usuarioId = id;
      this.modoEdicion.set(true);

      this.cargarUsuario(this.usuarioId);
    }
  }

  cargarUsuario(id: string):void {
    this.cargando.set(true);
    this.errorCargado.set(false);

    this.usuarioService.obtenerUsuario(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        });
        this.cargando.set(false);
      },

      error: (error) => {
        console.error("Error al cargar el usuario:", error);
        this.errorCargado.set(true);
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {

    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.errorGuardado.set(false);

    const valores = this.usuarioForm.getRawValue();

    const datosUsuario: Omit<Usuario, 'id'> = {
      nombre: valores.nombre ?? '',
      correo: valores.correo ?? '',
      rol: valores.rol ?? 'Usuario'
    };

    if (this.modoEdicion() && this.usuarioId !== null) {

      this.usuarioService.actualizarUsuario(this.usuarioId, datosUsuario).subscribe({
        next: () => {
          this.guardando.set(false);
          this.router.navigate(['/usuarios']);
        },

        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
          this.errorGuardado.set(true);
          this.guardando.set(false);
        }
      });

      return;
    }

    this.usuarioService.crearUsuario(datosUsuario).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/usuarios']);
      },

      error: (error) => {
        console.error('Error al crear el usuario:', error);
        this.errorGuardado.set(true);
        this.guardando.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}
