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
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { CargaComponent } from '../../../components/carga/carga.component';
import { ServicioCatalogoService } from '../../../services/facturacion/servicio-catalogo.service';
import { ServicioModel } from '../../../model/facturacion/servicioModel';
import { CategoriaServicioModel } from '../../../model/facturacion/categoriaServicioModel';

@Component({
  selector: 'app-servicios',
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
    CommonModule,
    InputNumberModule,
    ToastModule,
    TextareaModule,
    TooltipModule,
    CheckboxModule,
    CargaComponent,
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
  providers: [ConfirmationService, MessageService],
})
export class Servicios {
  spinner: boolean = false;
  loading: boolean = false;
  servicioDialog: boolean = false;

  listaServicios = signal<ServicioModel[]>([]);
  listaCategorias = signal<CategoriaServicioModel[]>([]);
  servicioModel = signal<ServicioModel>(new ServicioModel());
  searchValue: any;

  constructor(
    private servicioService: ServicioCatalogoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarListados();
  }

  private cargarListados() {
    this.cargarServicios();
    this.cargarCategorias();
  }

  cargarServicios() {
    this.spinner = true;
    this.servicioService.listar().subscribe({
      next: (response) => {
        this.spinner = false;
        if (response?.mensaje == 'EXITO') {
          this.listaServicios.set(response.data);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
          this.listaServicios.set([]);
        }
      },
      error: () => {
        this.spinner = false;
        this.listaServicios.set([]);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar servicios' });
      },
    });
  }

  private cargarCategorias() {
    this.servicioService.getCategorias().subscribe({
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

  openServicioDialog() {
    this.servicioModel.set(new ServicioModel());
    this.servicioDialog = true;
    this.servicioService.siguienteSku().subscribe({
      next: (r) => {
        if (r?.mensaje == 'EXITO') {
          this.servicioModel.update((m) => ({ ...m, sku: r.data }));
        }
      },
      error: () => {},
    });
  }

  editServicio(servicio: ServicioModel) {
    this.servicioModel.set({ ...servicio });
    this.servicioDialog = true;
  }

  desactivarServicio(servicio: ServicioModel) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas desactivar este servicio?',
      accept: () => {
        this.servicioService.cambiarEstado(servicio.id!, 0).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio desactivado' });
              this.cargarServicios();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
            }
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar' }),
        });
      },
    });
  }

  activarServicio(servicio: ServicioModel) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas activar este servicio?',
      accept: () => {
        this.servicioService.cambiarEstado(servicio.id!, 1).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio activado' });
              this.cargarServicios();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
            }
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al activar' }),
        });
      },
    });
  }

  saveServicio() {
    const s = this.servicioModel();
    if (!s.name?.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo Nombre es requerido' });
      return;
    }
    if (!s.serviceCategoryId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La Categoría de Servicio es requerida' });
      return;
    }

    const dataJson = JSON.stringify({
      name: s.name,
      serviceCategoryId: s.serviceCategoryId,
      chargeUnitId: s.chargeUnitId,
      pricePen: s.pricePen,
      estimatedTime: s.estimatedTime,
      expectedDelivery: s.expectedDelivery,
      requiresMaterials: s.requiresMaterials,
      requiresSpecification: s.requiresSpecification,
      includesDescription: s.includesDescription,
      excludesDescription: s.excludesDescription,
      conditions: s.conditions,
      shortDescription: s.shortDescription,
      detailedDescription: s.detailedDescription,
    });

    const request$ = s.id
      ? this.servicioService.actualizar(s.id, dataJson)
      : this.servicioService.registrar(dataJson);

    request$.subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio guardado correctamente' });
          this.cargarServicios();
          this.servicioDialog = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar servicio' }),
    });
  }
}
