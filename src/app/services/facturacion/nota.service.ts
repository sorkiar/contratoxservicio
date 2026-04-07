import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { NotaRequest, NotaResponse } from '../../model/facturacion/notaModels';

@Injectable({ providedIn: 'root' })
export class NotaService {
  private baseUrl = `${environment.apiUrl}/notas`;

  constructor(private http: HttpClient) {}

  listar(saleId?: number, status?: string, startDate?: string, endDate?: string): Observable<Response_Generico<NotaResponse[]>> {
    let params = new HttpParams();
    if (saleId != null) params = params.set('saleId', saleId.toString());
    if (status) params = params.set('status', status);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<Response_Generico<NotaResponse[]>>(`${this.baseUrl}/listar`, { params });
  }

  obtenerPorId(id: number): Observable<Response_Generico<NotaResponse>> {
    return this.http.get<Response_Generico<NotaResponse>>(`${this.baseUrl}/${id}`);
  }

  crear(form: NotaRequest): Observable<Response_Generico<NotaResponse>> {
    return this.http.post<Response_Generico<NotaResponse>>(this.baseUrl, form);
  }
}
