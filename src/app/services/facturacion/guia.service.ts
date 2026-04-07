import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { GuiaRequest, GuiaResponse } from '../../model/facturacion/guiaModels';

@Injectable({ providedIn: 'root' })
export class GuiaService {
  private baseUrl = `${environment.apiUrl}/guias-remision`;

  constructor(private http: HttpClient) {}

  listar(clientId?: number, status?: string, startDate?: string, endDate?: string): Observable<Response_Generico<GuiaResponse[]>> {
    let params = new HttpParams();
    if (clientId != null) params = params.set('clientId', clientId.toString());
    if (status) params = params.set('status', status);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<Response_Generico<GuiaResponse[]>>(`${this.baseUrl}/listar`, { params });
  }

  obtenerPorId(id: number): Observable<Response_Generico<GuiaResponse>> {
    return this.http.get<Response_Generico<GuiaResponse>>(`${this.baseUrl}/${id}`);
  }

  crear(form: GuiaRequest): Observable<Response_Generico<GuiaResponse>> {
    return this.http.post<Response_Generico<GuiaResponse>>(this.baseUrl, form);
  }
}
