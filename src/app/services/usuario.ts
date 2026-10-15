import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private apiUrl = 'http://localhost:3000/usuarios';

    constructor(private http:HttpClient) {}

    obtenerUsuarios():Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    obtenerUsuario(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }

    crearUsuario(usuario: Omit<Usuario, 'id'>):Observable<Usuario> {
        return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    actualizarUsuario(id: string, usuario: Omit<Usuario, 'id'>):Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
    }

    eliminarUsuario(id: string):Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
