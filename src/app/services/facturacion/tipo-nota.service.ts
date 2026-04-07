import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { TipoNotaModel } from '../../model/facturacion/notaModels';

@Injectable({ providedIn: 'root' })
export class TipoNotaService {
  private baseUrl = `${environment.apiUrl}/tipo-nota`;

  constructor(private http: HttpClient) {}

  listar(categoria?: string): Observable<Response_Generico<TipoNotaModel[]>> {
    let params = new HttpParams().set('status', '1');
    if (categoria) params = params.set('categoria', categoria);
    return this.http.get<Response_Generico<TipoNotaModel[]>>(`${this.baseUrl}/listar`, { params });
  }
}
