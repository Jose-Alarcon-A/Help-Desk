export type TipoDialogo = 'info' | 'error' | 'warn' | 'confirm';

export interface DialogoData {
    tipo: TipoDialogo;
    titulo: string;
    mensaje: string;
    textoCerrar?: string;
    textoAceptar?: string;
    textoConfirmar?: string;
    textoCancelar?: string;
}

export interface DialogoConfirmOptions {
    aceptar?: () => void;
    cancelar?: () => void;
    textoConfirmar?: string;
    textoCancelar?: string;
}
