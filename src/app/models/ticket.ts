export interface Ticket {
  id: string;
  asunto: string;
  descripcion: string;
  estado: 'Abierto' | 'Cerrado' | 'En proceso';
  prioridad: 'Alta' | 'Media' | 'Baja';
  fechaCreacion: string;
}
