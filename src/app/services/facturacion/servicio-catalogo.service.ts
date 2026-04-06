import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { ServicioModel } from '../../model/facturacion/servicioModel';
import { CategoriaServicioModel } from '../../model/facturacion/categoriaServicioModel';

@Injectable({ providedIn: 'root' })
export class ServicioCatalogoService {
  private baseUrl = `${environment.apiUrl}/servicios`;
  private catUrl = `${environment.apiUrl}/categoria-servicio`;

  constructor(private http: HttpClient) {}

  listar(name?: string, sku?: string, serviceCategoryId?: number, status?: number): Observable<Response_Generico<ServicioModel[]>> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (sku) params = params.set('sku', sku);
    if (serviceCategoryId != null) params = params.set('serviceCategoryId', serviceCategoryId.toString());
    if (status != null) params = params.set('status', status.toString());
    return this.http.get<Response_Generico<ServicioModel[]>>(`${this.baseUrl}/listar`, { params });
  }

  registrar(dataJson: string): Observable<Response_Generico<ServicioModel>> {
    return this.http.post<Response_Generico<ServicioModel>>(this.baseUrl, dataJson, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  actualizar(id: number, dataJson: string): Observable<Response_Generico<ServicioModel>> {
    return this.http.put<Response_Generico<ServicioModel>>(`${this.baseUrl}/${id}`, dataJson, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  cambiarEstado(id: number, status: number): Observable<Response_Generico<ServicioModel>> {
    return this.http.patch<Response_Generico<ServicioModel>>(`${this.baseUrl}/${id}/estado`, { status });
  }

  siguienteSku(): Observable<Response_Generico<string>> {
    return this.http.get<Response_Generico<string>>(`${this.baseUrl}/siguiente-sku`);
  }

  getCategorias(): Observable<Response_Generico<CategoriaServicioModel[]>> {
    return this.http.get<Response_Generico<CategoriaServicioModel[]>>(`${this.catUrl}/listar`, {
      params: { estado: '1' },
    });
  }
}
