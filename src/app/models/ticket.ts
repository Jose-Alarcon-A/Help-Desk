export interface Ticket {
  id: number;
  asunto: string;
  descripcion: string;
  estado: 'Abierto' | 'Cerrado' | 'En proceso';
  prioridad: 'Alta' | 'Media' | 'Baja';
  fechaCreacion: string;
}
