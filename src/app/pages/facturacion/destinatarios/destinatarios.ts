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
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CargaComponent } from '../../../components/carga/carga.component';
import { DestinatarioService } from '../../../services/facturacion/destinatario.service';
import { DestinatarioModel } from '../../../model/facturacion/destinatarioModel';

@Component({
  selector: 'app-destinatarios',
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
    ToastModule,
    TooltipModule,
    CargaComponent,
  ],
  templateUrl: './destinatarios.html',
  styleUrl: './destinatarios.scss',
  providers: [ConfirmationService, MessageService],
})
export class Destinatarios {
  spinner: boolean = false;
  loading: boolean = false;
  destinatarioDialog: boolean = false;

  listaDestinatarios = signal<DestinatarioModel[]>([]);
  destinatarioModel = signal<DestinatarioModel>(new DestinatarioModel());
  searchValue: any;

  tiposDocumento = [
    { label: 'DNI', value: 'DNI' },
    { label: 'RUC', value: 'RUC' },
  ];

  constructor(
    private destinatarioService: DestinatarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarDestinatarios();
  }

  private cargarDestinatarios() {
    this.spinner = true;
    this.destinatarioService.listar().subscribe({
      next: (response) => {
        this.spinner = false;
        if (response?.mensaje == 'EXITO') {
          this.listaDestinatarios.set(response.data);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
          this.listaDestinatarios.set([]);
        }
      },
      error: () => {
        this.spinner = false;
        this.listaDestinatarios.set([]);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar destinatarios' });
      },
    });
  }

  openDestinatarioDialog() {
    this.destinatarioModel.set(new DestinatarioModel());
    this.destinatarioDialog = true;
  }

  editDestinatario(destinatario: DestinatarioModel) {
    this.destinatarioModel.set({ ...destinatario });
    this.destinatarioDialog = true;
  }

  desactivarDestinatario(destinatario: DestinatarioModel) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas desactivar este destinatario?',
      accept: () => {
        this.destinatarioService.cambiarEstado(destinatario.id!, 0).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Destinatario desactivado' });
              this.cargarDestinatarios();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
            }
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar' }),
        });
      },
    });
  }

  activarDestinatario(destinatario: DestinatarioModel) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas activar este destinatario?',
      accept: () => {
        this.destinatarioService.cambiarEstado(destinatario.id!, 1).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Destinatario activado' });
              this.cargarDestinatarios();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
            }
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al activar' }),
        });
      },
    });
  }

  saveDestinatario() {
    const d = this.destinatarioModel();
    if (!d.docType) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El Tipo de Documento es requerido' });
      return;
    }
    if (!d.docNumber?.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El Número de Documento es requerido' });
      return;
    }
    if (!d.name?.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El Nombre es requerido' });
      return;
    }

    const form = { docType: d.docType, docNumber: d.docNumber, name: d.name, address: d.address };

    const request$ = d.id
      ? this.destinatarioService.actualizar(d.id, form)
      : this.destinatarioService.registrar(form);

    request$.subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Destinatario guardado correctamente' });
          this.cargarDestinatarios();
          this.destinatarioDialog = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.mensaje });
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar destinatario' }),
    });
  }
}
