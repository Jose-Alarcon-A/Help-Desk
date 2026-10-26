import { Component, input } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-rol-usuario',
  imports: [],
  templateUrl: './rol-usuario.html',
  styleUrl: './rol-usuario.css',
})
export class RolUsuario {
  rol = input.required<Usuario['rol']>();
}
