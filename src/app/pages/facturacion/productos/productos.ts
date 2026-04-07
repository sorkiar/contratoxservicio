import { Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { CargaComponent } from '../../../components/carga/carga.component';
import { ProductoService } from '../../../services/facturacion/producto.service';
import { ProductoModel } from '../../../model/facturacion/productoModel';
import { CategoriaProductoModel } from '../../../model/facturacion/categoriaProductoModel';

@Component({
  selector: 'app-productos',
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    FieldsetModule,
    DialogModule,
    ConfirmDialogModule,
    FloatLabelModule,
    CommonModule,
    InputNumberModule,
    ToastModule,
    TextareaModule,
    TooltipModule,
    CargaComponent,
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
  providers: [ConfirmationService, MessageService],
})
export class Productos {
  spinner: boolean = false;
  loading: boolean = false;
  productoDialog: boolean = false;

  listaProductos = signal<ProductoModel[]>([]);
  listaCategorias = signal<CategoriaProductoModel[]>([]);
  productoModel = signal<ProductoModel>(new ProductoModel());
  searchValue: any;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarListados();
  }

  private cargarListados() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.spinner = true;
    this.productoService.listar().subscribe({
      next: (response) => {
        this.spinner = false;
        if (response?.mensaje == 'EXITO') {
          this.listaProductos.set(response.data);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
          this.listaProductos.set([]);
        }
      },
      error: () => {
        this.spinner = false;
        this.listaProductos.set([]);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar productos' });
      },
    });
  }

  private cargarCategorias() {
    this.productoService.getCategorias().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaCategorias.set(response.data);
        } else {
          this.listaCategorias.set([]);
        }
      },
      error: () => this.listaCategorias.set([]),
    });
  }

  openProductoDialog() {
    const model = new ProductoModel();
    this.productoModel.set(model);
    this.productoDialog = true;
    this.productoService.siguienteSku().subscribe({
      next: (r) => {
        if (r?.mensaje == 'EXITO') {
          this.productoModel.update((m) => ({ ...m, sku: r.data }));
        }
      },
      error: () => {},
    });
  }

  editProducto(producto: ProductoModel) {
    this.productoModel.set({ ...producto });
    this.productoDialog = true;
  }

  desactivarProducto(producto: ProductoModel) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas desactivar este producto?',
      accept: () => {
        this.productoService.cambiarEstado(producto.id!, 0).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto desactivado' });
              this.cargarProductos();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
            }
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar' }),
        });
      },
    });
  }

  activarProducto(producto: ProductoModel) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas activar este producto?',
      accept: () => {
        this.productoService.cambiarEstado(producto.id!, 1).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto activado' });
              this.cargarProductos();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
            }
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al activar' }),
        });
      },
    });
  }

  saveProducto() {
    const p = this.productoModel();
    if (!p.name?.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo Nombre es requerido' });
      return;
    }
    if (!p.categoryId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La Categoría es requerida' });
      return;
    }

    const dataJson = JSON.stringify({
      name: p.name,
      categoryId: p.categoryId,
      unitMeasureId: p.unitMeasureId,
      salePricePen: p.salePricePen,
      estimatedCostPen: p.estimatedCostPen,
      brand: p.brand,
      model: p.model,
      shortDescription: p.shortDescription,
      technicalSpec: p.technicalSpec,
    });

    const request$ = p.id
      ? this.productoService.actualizar(p.id, dataJson)
      : this.productoService.registrar(dataJson);

    request$.subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto guardado correctamente' });
          this.cargarProductos();
          this.productoDialog = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar producto' }),
    });
  }
}
