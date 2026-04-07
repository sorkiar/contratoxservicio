import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { CargaComponent } from '../../../components/carga/carga.component';
import { NotaService } from '../../../services/facturacion/nota.service';
import { TipoNotaService } from '../../../services/facturacion/tipo-nota.service';
import { VentaService } from '../../../services/facturacion/venta.service';
import { ProductoService } from '../../../services/facturacion/producto.service';
import { ServicioCatalogoService } from '../../../services/facturacion/servicio-catalogo.service';
import { NotaResponse, TipoNotaModel, NotaItemForm, NotaRequest } from '../../../model/facturacion/notaModels';
import { SaleResponse } from '../../../model/facturacion/ventaModels';
import { ProductoModel } from '../../../model/facturacion/productoModel';
import { ServicioModel } from '../../../model/facturacion/servicioModel';

// Tipos de nota que auto-cargan items de la venta
const AUTO_LOAD_TYPES = ['C01', 'D02'];
// Tipos que bloquean edición de items (solo lectura)
const LOCKED_TYPES = ['C01'];

@Component({
  selector: 'app-notas',
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
    FieldsetModule, DialogModule, InputTextModule, InputNumberModule,
    SelectModule, TextareaModule, ToastModule, TooltipModule,
    IconFieldModule, InputIconModule, DividerModule, CargaComponent,
  ],
  templateUrl: './notas.html',
  styleUrl: './notas.scss',
  providers: [MessageService],
})
export class Notas {
  spinner = false;
  loading = false;
  searchValue: any;

  // ─── Dialogs ──────────────────────────────────────────────────────────────
  notaFormDialog = false;
  detalleDialog = false;
  buscarVentaDialog = false;
  agregarProductoDialog = false;
  agregarServicioDialog = false;
  servicioRapidoDialog = false;

  // ─── Listado ─────────────────────────────────────────────────────────────
  listaNotas = signal<NotaResponse[]>([]);
  notaDetalle = signal<NotaResponse | null>(null);

  // ─── Form nota ───────────────────────────────────────────────────────────
  ventaSeleccionada = signal<SaleResponse | null>(null);
  tiposNota = signal<TipoNotaModel[]>([]);
  tipoNotaSeleccionado = signal<TipoNotaModel | null>(null);
  tipoNotaCodigo = '';
  motivo = '';
  items = signal<NotaItemForm[]>([]);

  // ─── Cálculos reactivos ──────────────────────────────────────────────────
  totalNota = computed(() => this.items().reduce((acc, i) => acc + i.subtotal, 0));
  igvNota = computed(() => this.totalNota() * (18 / 118));
  subtotalNota = computed(() => this.totalNota() - this.igvNota());

  // ─── Flags de comportamiento por tipo ────────────────────────────────────
  isAutoLoad = computed(() => AUTO_LOAD_TYPES.includes(this.tipoNotaCodigo));
  isLocked = computed(() => LOCKED_TYPES.includes(this.tipoNotaCodigo));

  // ─── Buscador ventas ─────────────────────────────────────────────────────
  searchVenta = signal('');
  todasVentas = signal<SaleResponse[]>([]);
  ventasFiltradas = computed(() => {
    const q = this.searchVenta().toLowerCase().trim();
    if (!q) return this.todasVentas();
    return this.todasVentas().filter((v) => {
      const doc = v.documents?.[0];
      const comp = doc ? `${doc.series}-${String(doc.sequence).padStart(8, '0')}` : '';
      return (
        comp.toLowerCase().includes(q) ||
        v.clientName?.toLowerCase().includes(q) ||
        v.clientDocNumber?.toLowerCase().includes(q)
      );
    });
  });
  ventaPage = 1;
  readonly PAGE_SIZE = 5;
  ventasPagina = computed(() => {
    const s = (this.ventaPage - 1) * this.PAGE_SIZE;
    return this.ventasFiltradas().slice(s, s + this.PAGE_SIZE);
  });
  totalVentaPages = computed(() => Math.max(1, Math.ceil(this.ventasFiltradas().length / this.PAGE_SIZE)));

  // ─── Catálogos productos/servicios ───────────────────────────────────────
  listaProductos = signal<ProductoModel[]>([]);
  listaServicios = signal<ServicioModel[]>([]);
  searchProducto = '';
  searchServicio = '';
  productoPage = 1;
  servicioPag = 1;

  productosFiltrados = computed(() => {
    const q = this.searchProducto.toLowerCase();
    return this.listaProductos().filter(
      (p) => !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.categoryName?.toLowerCase().includes(q)
    );
  });
  serviciosFiltrados = computed(() => {
    const q = this.searchServicio.toLowerCase();
    return this.listaServicios().filter(
      (s) => !q || s.name?.toLowerCase().includes(q) || s.sku?.toLowerCase().includes(q) || s.serviceCategoryName?.toLowerCase().includes(q)
    );
  });
  productosPagina = computed(() => {
    const s = (this.productoPage - 1) * this.PAGE_SIZE;
    return this.productosFiltrados().slice(s, s + this.PAGE_SIZE);
  });
  serviciosPagina = computed(() => {
    const s = (this.servicioPag - 1) * this.PAGE_SIZE;
    return this.serviciosFiltrados().slice(s, s + this.PAGE_SIZE);
  });
  totalProductoPages = computed(() => Math.max(1, Math.ceil(this.productosFiltrados().length / this.PAGE_SIZE)));
  totalServicioPages = computed(() => Math.max(1, Math.ceil(this.serviciosFiltrados().length / this.PAGE_SIZE)));

  // ─── Servicio rápido ────────────────────────────────────────────────────
  servicioRapidoNombre = '';
  servicioRapidoPrecio: number = 0;

  constructor(
    private notaService: NotaService,
    private tipoNotaService: TipoNotaService,
    private ventaService: VentaService,
    private productoService: ProductoService,
    private servicioService: ServicioCatalogoService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarNotas();
    this.cargarTiposNota();
  }

  cargarNotas() {
    this.spinner = true;
    this.notaService.listar().subscribe({
      next: (r) => {
        this.spinner = false;
        if (r?.mensaje == 'EXITO') this.listaNotas.set(r.data);
        else { this.listaNotas.set([]); this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje }); }
      },
      error: () => {
        this.spinner = false;
        this.listaNotas.set([]);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar notas' });
      },
    });
  }

  private cargarTiposNota() {
    this.tipoNotaService.listar().subscribe({
      next: (r) => { if (r?.mensaje == 'EXITO') this.tiposNota.set(r.data); },
      error: () => {},
    });
  }

  // ─── Abrir form nueva nota ───────────────────────────────────────────────
  abrirNuevaNota() {
    this.ventaSeleccionada.set(null);
    this.tipoNotaSeleccionado.set(null);
    this.tipoNotaCodigo = '';
    this.motivo = '';
    this.items.set([]);
    this.notaFormDialog = true;
  }

  // ─── Detalle ─────────────────────────────────────────────────────────────
  verDetalle(nota: NotaResponse) {
    this.notaDetalle.set(nota);
    this.detalleDialog = true;
  }

  abrirPdf(nota: NotaResponse) {
    if (nota.pdfUrl) window.open(nota.pdfUrl, '_blank');
    else this.messageService.add({ severity: 'warn', summary: 'PDF', detail: 'PDF no disponible aún' });
  }

  // ─── Tipo de nota ─────────────────────────────────────────────────────────
  onTipoNotaChange() {
    const tipo = this.tiposNota().find((t) => t.code === this.tipoNotaCodigo);
    this.tipoNotaSeleccionado.set(tipo ?? null);

    if (this.isAutoLoad()) {
      this.cargarItemsDesdVenta();
    } else {
      this.items.set([]);
    }
  }

  private cargarItemsDesdVenta() {
    const venta = this.ventaSeleccionada();
    if (!venta?.items?.length) return;
    const mapped: NotaItemForm[] = venta.items.map((i) => {
      const f = new NotaItemForm();
      f.itemType = i.itemType === 'PRODUCT' ? 'PRODUCTO' : i.itemType === 'SERVICE' ? 'SERVICIO' : 'PERSONALIZADO';
      f.productId = i.productId;
      f.serviceId = i.serviceId;
      f.description = i.description;
      f.quantity = Number(i.quantity);
      f.unitPrice = Number(i.unitPrice);
      f.discountPercentage = Number(i.discountPercentage);
      return f;
    });
    this.items.set(mapped);
  }

  // ─── Buscar venta ─────────────────────────────────────────────────────────
  abrirBuscarVenta() {
    this.searchVenta.set('');
    this.ventaPage = 1;
    this.buscarVentaDialog = true;
    if (this.todasVentas().length === 0) {
      this.ventaService.listar(undefined, undefined, undefined, undefined, 'EMITIDO').subscribe({
        next: (r) => { if (r?.mensaje == 'EXITO') this.todasVentas.set(r.data); else this.todasVentas.set([]); },
        error: () => this.todasVentas.set([]),
      });
    }
  }

  seleccionarVenta(v: SaleResponse) {
    this.ventaSeleccionada.set(v);
    this.buscarVentaDialog = false;
    // Reset tipo y items al cambiar venta
    this.tipoNotaCodigo = '';
    this.tipoNotaSeleccionado.set(null);
    this.items.set([]);
  }

  limpiarVenta() {
    this.ventaSeleccionada.set(null);
    this.tipoNotaCodigo = '';
    this.tipoNotaSeleccionado.set(null);
    this.items.set([]);
  }

  // ─── Agregar producto ────────────────────────────────────────────────────
  abrirAgregarProducto() {
    this.searchProducto = '';
    this.productoPage = 1;
    if (this.listaProductos().length === 0) {
      this.productoService.listar(undefined, undefined, undefined, 1).subscribe({
        next: (r) => { if (r?.mensaje == 'EXITO') this.listaProductos.set(r.data); },
        error: () => {},
      });
    }
    this.agregarProductoDialog = true;
  }

  agregarProducto(p: ProductoModel) {
    const f = new NotaItemForm();
    f.itemType = 'PRODUCTO';
    f.productId = p.id;
    f.description = p.name;
    f.unitPrice = p.salePricePen ?? 0;
    this.items.update((l) => [...l, f]);
    this.agregarProductoDialog = false;
  }

  // ─── Agregar servicio ────────────────────────────────────────────────────
  abrirAgregarServicio() {
    this.searchServicio = '';
    this.servicioPag = 1;
    if (this.listaServicios().length === 0) {
      this.servicioService.listar(undefined, undefined, undefined, 1).subscribe({
        next: (r) => { if (r?.mensaje == 'EXITO') this.listaServicios.set(r.data); },
        error: () => {},
      });
    }
    this.agregarServicioDialog = true;
  }

  agregarServicio(s: ServicioModel) {
    const f = new NotaItemForm();
    f.itemType = 'SERVICIO';
    f.serviceId = s.id;
    f.description = s.name;
    f.unitPrice = s.pricePen ?? 0;
    this.items.update((l) => [...l, f]);
    this.agregarServicioDialog = false;
  }

  // ─── Servicio rápido ────────────────────────────────────────────────────
  abrirServicioRapido() {
    this.servicioRapidoNombre = '';
    this.servicioRapidoPrecio = 0;
    this.servicioRapidoDialog = true;
  }

  agregarServicioRapido() {
    if (!this.servicioRapidoNombre.trim() || this.servicioRapidoPrecio <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Nombre y precio son requeridos' });
      return;
    }
    const f = new NotaItemForm();
    f.itemType = 'PERSONALIZADO';
    f.description = this.servicioRapidoNombre;
    f.unitPrice = this.servicioRapidoPrecio;
    this.items.update((l) => [...l, f]);
    this.servicioRapidoDialog = false;
  }

  eliminarItem(index: number) {
    this.items.update((l) => l.filter((_, i) => i !== index));
  }

  actualizarItem() {
    this.items.update((l) => [...l]);
  }

  // ─── Derivar documentTypeCode y documentSeriesId ─────────────────────────
  private getDocumentTypeCode(): string {
    const tipo = this.tipoNotaSeleccionado();
    return tipo?.noteCategory === 'CREDITO' ? '07' : '08';
  }

  private getDocumentSeriesId(): number {
    const venta = this.ventaSeleccionada();
    const tipo = this.tipoNotaSeleccionado();
    const docNumber = venta?.documents?.[0]?.series ?? '';
    const esFactura = docNumber.startsWith('F');
    const esCredito = tipo?.noteCategory === 'CREDITO';
    if (esFactura) return esCredito ? 4 : 6;
    return esCredito ? 3 : 5;
  }

  // ─── Guardar nota ────────────────────────────────────────────────────────
  crearNota() {
    const venta = this.ventaSeleccionada();
    if (!venta) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una venta' }); return; }
    const doc = venta.documents?.[0];
    if (!doc) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La venta no tiene comprobante emitido' }); return; }
    if (!this.tipoNotaCodigo) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar el tipo de nota' }); return; }
    if (!this.motivo.trim()) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El motivo es requerido' }); return; }
    if (this.items().length === 0) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe agregar al menos un ítem' }); return; }

    const body: NotaRequest = {
      saleId: venta.id,
      originalDocumentId: doc.id,
      documentTypeCode: this.getDocumentTypeCode(),
      documentSeriesId: this.getDocumentSeriesId(),
      creditDebitNoteTypeCode: this.tipoNotaCodigo,
      reason: this.motivo,
      issueDate: new Date().toISOString().split('T')[0],
      items: this.items().map((i) => ({
        itemType: i.itemType,
        productId: i.productId,
        serviceId: i.serviceId,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discountPercentage: i.discountPercentage,
      })),
    };

    this.spinner = true;
    this.notaService.crear(body).subscribe({
      next: (r) => {
        this.spinner = false;
        if (r?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota registrada correctamente' });
          this.notaFormDialog = false;
          this.cargarNotas();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje });
        }
      },
      error: () => {
        this.spinner = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la nota' });
      },
    });
  }

  // ─── Helpers display ─────────────────────────────────────────────────────
  getComprobante(nota: NotaResponse): string {
    if (!nota.series || !nota.sequence) return 'Sin emitir';
    return `${nota.series}-${String(nota.sequence).padStart(8, '0')}`;
  }

  getVentaComprobante(venta: SaleResponse): string {
    const doc = venta.documents?.[0];
    if (!doc) return '—';
    return `${doc.series}-${String(doc.sequence).padStart(8, '0')}`;
  }

  getNotaTypeSeverity(category: string): 'info' | 'warn' {
    return category === 'CREDITO' ? 'info' : 'warn';
  }

  getSunatSeverity(status: string): 'success' | 'danger' | 'warn' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'ACEPTADO': return 'success';
      case 'RECHAZADO': return 'danger';
      case 'PENDIENTE': return 'warn';
      default: return 'secondary';
    }
  }

  getItemTypeLabel(type: string): string {
    switch (type) {
      case 'PRODUCTO': return 'Producto';
      case 'SERVICIO': return 'Servicio';
      case 'PERSONALIZADO': return 'Rápido';
      default: return type;
    }
  }

  minVal(a: number, b: number): number { return Math.min(a, b); }
}
