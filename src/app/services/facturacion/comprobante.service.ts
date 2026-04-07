import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { ComprobanteModel } from '../../model/facturacion/comprobanteModel';

@Injectable({ providedIn: 'root' })
export class ComprobanteService {
  private baseUrl = `${environment.apiUrl}/comprobantes`;

  constructor(private http: HttpClient) {}

  listar(status?: string, tipoComprobante?: string, startDate?: string, endDate?: string): Observable<Response_Generico<ComprobanteModel[]>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (tipoComprobante) params = params.set('tipoComprobante', tipoComprobante);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<Response_Generico<ComprobanteModel[]>>(`${this.baseUrl}/sunat/listar`, { params });
  }

  // ─── Reenvío a SUNAT ─────────────────────────────────────────────────────
  reenviarDocumento(id: number): Observable<Response_Generico<ComprobanteModel>> {
    return this.http.post<Response_Generico<ComprobanteModel>>(`${this.baseUrl}/documentos/${id}/reenviar`, {});
  }

  reenviarNota(id: number): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(`${this.baseUrl}/notas/${id}/reenviar`, {});
  }

  reenviarGuia(id: number): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(`${this.baseUrl}/guias/${id}/reenviar`, {});
  }

  // ─── Regenerar PDF ───────────────────────────────────────────────────────
  regenerarPdfDocumento(id: number): Observable<Response_Generico<ComprobanteModel>> {
    return this.http.post<Response_Generico<ComprobanteModel>>(`${this.baseUrl}/documentos/${id}/regenerar-pdf`, {});
  }

  regenerarPdfNota(id: number): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(`${this.baseUrl}/notas/${id}/regenerar-pdf`, {});
  }

  regenerarPdfGuia(id: number): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(`${this.baseUrl}/guias/${id}/regenerar-pdf`, {});
  }
}
