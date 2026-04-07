import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CargaComponent } from '../../../components/carga/carga.component';
import { ComprobanteService } from '../../../services/facturacion/comprobante.service';
import { ComprobanteModel } from '../../../model/facturacion/comprobanteModel';

@Component({
  selector: 'app-comprobantes',
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
    FieldsetModule, SelectModule, ToastModule, TooltipModule,
    IconFieldModule, InputIconModule, InputTextModule, CargaComponent,
  ],
  templateUrl: './comprobantes.html',
  styleUrl: './comprobantes.scss',
  providers: [MessageService],
})
export class Comprobantes {
  spinner = false;
  loading = false;
  searchValue: any;

  // ─── Filtros ──────────────────────────────────────────────────────────────
  statusFilter = '';
  tipoFilter = '';
  startDate = '';
  endDate = '';

  readonly statusOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Aceptado', value: 'ACEPTADO' },
    { label: 'Rechazado', value: 'RECHAZADO' },
    { label: 'Error', value: 'ERROR' },
  ];

  readonly tipoOptions = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Factura', value: '01' },
    { label: 'Boleta', value: '03' },
    { label: 'Nota de Crédito', value: '07' },
    { label: 'Nota de Débito', value: '08' },
    { label: 'Guía de Remisión', value: '09' },
  ];

  // ─── Datos ────────────────────────────────────────────────────────────────
  listaComprobantes = signal<ComprobanteModel[]>([]);

  // ─── Estados de acción por id ─────────────────────────────────────────────
  reenviadoId: number | null = null;
  regenerandoId: number | null = null;

  constructor(
    private comprobanteService: ComprobanteService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarComprobantes();
  }

  cargarComprobantes() {
    this.spinner = true;
    this.comprobanteService.listar(
      this.statusFilter || undefined,
      this.tipoFilter || undefined,
      this.startDate || undefined,
      this.endDate || undefined,
    ).subscribe({
      next: (r) => {
        this.spinner = false;
        if (r?.mensaje == 'EXITO') this.listaComprobantes.set(r.data);
        else { this.listaComprobantes.set([]); this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje }); }
      },
      error: () => {
        this.spinner = false;
        this.listaComprobantes.set([]);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar comprobantes' });
      },
    });
  }

  // ─── Tipo de documento ────────────────────────────────────────────────────
  getTipoDocLabel(doc: ComprobanteModel): string {
    switch (doc.tipoDocumentoCodigo) {
      case '01': return 'Factura';
      case '03': return 'Boleta';
      case '07': return 'Nota de Crédito';
      case '08': return 'Nota de Débito';
      case '09': return 'Guía de Remisión';
      default: return doc.tipoDocumentoNombre ?? doc.tipoDocumentoCodigo;
    }
  }

  private getTipoDocCategoria(doc: ComprobanteModel): 'documento' | 'nota' | 'guia' {
    if (doc.tipoEntidad === 'NOTA') return 'nota';
    if (doc.tipoEntidad === 'GUIA') return 'guia';
    return 'documento';
  }

  getDocNumero(doc: ComprobanteModel): string {
    if (!doc.serie || !doc.correlativo) return '—';
    return `${doc.serie}-${String(doc.correlativo).padStart(8, '0')}`;
  }

  getTipoSeverity(doc: ComprobanteModel): 'info' | 'warn' | 'success' | 'secondary' {
    const cat = this.getTipoDocCategoria(doc);
    if (cat === 'nota') return 'warn';
    if (cat === 'guia') return 'success';
    return 'info';
  }

  getSunatSeverity(status?: string): 'success' | 'danger' | 'warn' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'ACEPTADO': return 'success';
      case 'RECHAZADO': return 'danger';
      case 'PENDIENTE': return 'warn';
      default: return 'secondary';
    }
  }

  // ─── Acciones disponibles ─────────────────────────────────────────────────
  puedeReenviar(doc: ComprobanteModel): boolean {
    return doc.status !== 'ACEPTADO';
  }

  puedeRegenerarPdf(doc: ComprobanteModel): boolean {
    return !!(doc.serie && doc.correlativo);
  }

  // ─── Reenvío a SUNAT ─────────────────────────────────────────────────────
  reenviar(doc: ComprobanteModel) {
    this.reenviadoId = doc.id;
    const cat = this.getTipoDocCategoria(doc);
    const obs$ = cat === 'nota'
      ? this.comprobanteService.reenviarNota(doc.id)
      : cat === 'guia'
        ? this.comprobanteService.reenviarGuia(doc.id)
        : this.comprobanteService.reenviarDocumento(doc.id);

    obs$.subscribe({
      next: (r) => {
        this.reenviadoId = null;
        if (r?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento enviado a SUNAT correctamente' });
          this.cargarComprobantes();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje });
        }
      },
      error: () => {
        this.reenviadoId = null;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al reenviar el documento' });
      },
    });
  }

  // ─── Regenerar PDF ───────────────────────────────────────────────────────
  regenerarPdf(doc: ComprobanteModel) {
    this.regenerandoId = doc.id;
    const cat = this.getTipoDocCategoria(doc);
    const obs$ = cat === 'nota'
      ? this.comprobanteService.regenerarPdfNota(doc.id)
      : cat === 'guia'
        ? this.comprobanteService.regenerarPdfGuia(doc.id)
        : this.comprobanteService.regenerarPdfDocumento(doc.id);

    obs$.subscribe({
      next: (r) => {
        this.regenerandoId = null;
        if (r?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'PDF Regenerado', detail: 'El PDF se generó correctamente' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje });
        }
      },
      error: () => {
        this.regenerandoId = null;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al regenerar el PDF' });
      },
    });
  }

  abrirPdf(url: string) {
    window.open(url, '_blank');
  }
}
