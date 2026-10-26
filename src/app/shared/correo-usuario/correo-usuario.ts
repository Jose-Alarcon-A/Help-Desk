import { Component, input } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-correo-usuario',
  imports: [],
  templateUrl: './correo-usuario.html',
  styleUrl: './correo-usuario.css',
})
export class CorreoUsuario {
  correo = input.required<Usuario['correo']>();
}
