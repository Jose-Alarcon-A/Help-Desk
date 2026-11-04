import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type VarianteIndicador =
    | 'neutra'
    | 'principal'
    | 'azul'
    | 'ambar'
    | 'verde'
    | 'roja';

@Component({
  selector: 'app-tarjeta-indicador',
  imports: [MatIconModule],
  templateUrl: './tarjeta-indicador.html',
  styleUrl: './tarjeta-indicador.css',
})
export class TarjetaIndicador {
  readonly titulo = input.required<string>();
  readonly valor = input.required<string | number>();

  readonly descripcion = input('');
  readonly apoyo = input('');
  readonly unidad = input('');

  readonly icono = input('anatytics');
  readonly variante = input<VarianteIndicador>('neutra');
}
