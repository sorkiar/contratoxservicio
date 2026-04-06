import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { SaleRequest, SaleResponse } from '../../model/facturacion/ventaModels';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private baseUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  listar(clientId?: number, saleStatus?: string, startDate?: string, endDate?: string): Observable<Response_Generico<SaleResponse[]>> {
    let params = new HttpParams();
    if (clientId != null) params = params.set('clientId', clientId.toString());
    if (saleStatus) params = params.set('saleStatus', saleStatus);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<Response_Generico<SaleResponse[]>>(`${this.baseUrl}/listar`, { params });
  }

  obtenerPorId(id: number): Observable<Response_Generico<SaleResponse>> {
    return this.http.get<Response_Generico<SaleResponse>>(`${this.baseUrl}/${id}`);
  }

  crear(form: SaleRequest): Observable<Response_Generico<SaleResponse>> {
    return this.http.post<Response_Generico<SaleResponse>>(this.baseUrl, form);
  }
}
