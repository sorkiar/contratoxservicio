import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { DestinatarioModel } from '../../model/facturacion/destinatarioModel';

@Injectable({ providedIn: 'root' })
export class DestinatarioService {
  private baseUrl = `${environment.apiUrl}/destinatarios`;

  constructor(private http: HttpClient) {}

  listar(docNumber?: string, name?: string, status?: number): Observable<Response_Generico<DestinatarioModel[]>> {
    let params = new HttpParams();
    if (docNumber) params = params.set('docNumber', docNumber);
    if (name) params = params.set('name', name);
    if (status != null) params = params.set('status', status.toString());
    return this.http.get<Response_Generico<DestinatarioModel[]>>(`${this.baseUrl}/listar`, { params });
  }

  registrar(form: { docType: string; docNumber: string; name: string; address: string | null }): Observable<Response_Generico<DestinatarioModel>> {
    return this.http.post<Response_Generico<DestinatarioModel>>(this.baseUrl, form);
  }

  actualizar(id: number, form: { docType: string; docNumber: string; name: string; address: string | null }): Observable<Response_Generico<DestinatarioModel>> {
    return this.http.put<Response_Generico<DestinatarioModel>>(`${this.baseUrl}/${id}`, form);
  }

  cambiarEstado(id: number, status: number): Observable<Response_Generico<DestinatarioModel>> {
    return this.http.patch<Response_Generico<DestinatarioModel>>(`${this.baseUrl}/${id}/estado`, { status });
  }
}
