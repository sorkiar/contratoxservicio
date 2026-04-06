import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { ProductoModel } from '../../model/facturacion/productoModel';
import { CategoriaProductoModel } from '../../model/facturacion/categoriaProductoModel';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private baseUrl = `${environment.apiUrl}/productos`;
  private catUrl = `${environment.apiUrl}/categoria-producto`;

  constructor(private http: HttpClient) {}

  listar(name?: string, sku?: string, categoryId?: number, status?: number): Observable<Response_Generico<ProductoModel[]>> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (sku) params = params.set('sku', sku);
    if (categoryId != null) params = params.set('categoryId', categoryId.toString());
    if (status != null) params = params.set('status', status.toString());
    return this.http.get<Response_Generico<ProductoModel[]>>(`${this.baseUrl}/listar`, { params });
  }

  registrar(dataJson: string, mainImage?: File): Observable<Response_Generico<ProductoModel>> {
    const formData = new FormData();
    formData.append('data', dataJson);
    if (mainImage) formData.append('mainImage', mainImage);
    return this.http.post<Response_Generico<ProductoModel>>(this.baseUrl, formData);
  }

  actualizar(id: number, dataJson: string): Observable<Response_Generico<ProductoModel>> {
    const formData = new FormData();
    formData.append('data', dataJson);
    return this.http.put<Response_Generico<ProductoModel>>(`${this.baseUrl}/${id}`, formData);
  }

  cambiarEstado(id: number, status: number): Observable<Response_Generico<ProductoModel>> {
    return this.http.patch<Response_Generico<ProductoModel>>(`${this.baseUrl}/${id}/estado`, { status });
  }

  siguienteSku(): Observable<Response_Generico<string>> {
    return this.http.get<Response_Generico<string>>(`${this.baseUrl}/siguiente-sku`);
  }

  getCategorias(): Observable<Response_Generico<CategoriaProductoModel[]>> {
    return this.http.get<Response_Generico<CategoriaProductoModel[]>>(`${this.catUrl}/listar`, {
      params: { estado: '1' },
    });
  }
}
