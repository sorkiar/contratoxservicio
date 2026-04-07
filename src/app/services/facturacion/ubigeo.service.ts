import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { UbigeoModel } from '../../model/facturacion/guiaModels';

@Injectable({ providedIn: 'root' })
export class UbigeoService {
  private baseUrl = `${environment.apiUrl}/ubigeos`;

  constructor(private http: HttpClient) {}

  listar(status?: number): Observable<Response_Generico<UbigeoModel[]>> {
    let params = new HttpParams();
    if (status != null) params = params.set('status', status.toString());
    return this.http.get<Response_Generico<UbigeoModel[]>>(`${this.baseUrl}/listar`, { params });
  }
}
