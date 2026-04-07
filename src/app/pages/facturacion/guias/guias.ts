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
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { CargaComponent } from '../../../components/carga/carga.component';
import { GuiaService } from '../../../services/facturacion/guia.service';
import { UbigeoService } from '../../../services/facturacion/ubigeo.service';
import { ProductoService } from '../../../services/facturacion/producto.service';
import { ClientesService } from '../../../services/gestionClientes/clientes.service';
import {
  GuiaResponse, GuiaRequest, GuiaItemRequest, GuiaDriverRequest, UbigeoModel
} from '../../../model/facturacion/guiaModels';
import { ProductoModel } from '../../../model/facturacion/productoModel';
import { BuscarClientes } from '../../../model/gestionClientes/buscarClientes';

@Component({
  selector: 'app-guias',
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
    FieldsetModule, DialogModule, InputTextModule, InputNumberModule,
    SelectModule, TextareaModule, CheckboxModule, ToastModule, TooltipModule,
    IconFieldModule, InputIconModule, DividerModule, CargaComponent,
  ],
  templateUrl: './guias.html',
  styleUrl: './guias.scss',
  providers: [MessageService],
})
export class Guias {
  spinner = false;
  loading = false;
  searchValue: any;

  // ─── Dialogs ──────────────────────────────────────────────────────────────
  guiaFormDialog = false;
  detalleDialog = false;
  isViewMode = false;
  buscarClienteDialog = false;
  agregarProductoDialog = false;
  itemPersonalizadoDialog = false;

  // ─── Listado ─────────────────────────────────────────────────────────────
  listaGuias = signal<GuiaResponse[]>([]);
  guiaDetalle = signal<GuiaResponse | null>(null);

  // ─── Form: datos generales ────────────────────────────────────────────────
  issueDate = new Date().toISOString().split('T')[0];
  transferDate = '';
  transferReason = '';
  transferReasonDescription = '';
  transportMode = 'TRANSPORTE_PUBLICO';
  grossWeight: number = 0;
  weightUnit = 'KGM';
  packageCount: number = 1;
  minorVehicleTransfer = false;
  observations = '';

  readonly transferReasonOptions = [
    { label: 'Venta', value: 'VENTA' },
    { label: 'Compra', value: 'COMPRA' },
    { label: 'Traslado entre establecimientos', value: 'TRASLADO_ENTRE_ESTABLECIMIENTOS' },
    { label: 'Devolución', value: 'DEVOLUCION' },
    { label: 'Otros', value: 'OTROS' },
  ];

  readonly transportModeOptions = [
    { label: 'Transporte Público', value: 'TRANSPORTE_PUBLICO' },
    { label: 'Transporte Privado', value: 'TRANSPORTE_PRIVADO' },
  ];

  readonly docTypeOptions = [
    { label: 'RUC', value: 'RUC' },
    { label: 'DNI', value: 'DNI' },
  ];

  // ─── Transportista público ────────────────────────────────────────────────
  carrierRuc = '';
  carrierName = '';
  carrierAuthorizationCode = '';

  // ─── Conductores (privado) ───────────────────────────────────────────────
  conductores = signal<GuiaDriverRequest[]>([]);

  // ─── Destinatario (cliente) ───────────────────────────────────────────────
  clienteSeleccionado = signal<BuscarClientes | null>(null);
  todosClientes = signal<BuscarClientes[]>([]);
  searchCliente = signal('');
  listaClientesFiltrada = computed(() => {
    const q = this.searchCliente().toLowerCase().trim();
    if (!q) return this.todosClientes();
    return this.todosClientes().filter((c) =>
      c.nombre_completo?.toLowerCase().includes(q) ||
      c.nrodocident?.toLowerCase().includes(q) ||
      c.tipodocidenabr?.toLowerCase().includes(q)
    );
  });
  readonly CLIENTE_PAGE_SIZE = 5;
  clientePage = 1;
  clientesPagina = computed(() => {
    const s = (this.clientePage - 1) * this.CLIENTE_PAGE_SIZE;
    return this.listaClientesFiltrada().slice(s, s + this.CLIENTE_PAGE_SIZE);
  });
  totalClientePages = computed(() =>
    Math.max(1, Math.ceil(this.listaClientesFiltrada().length / this.CLIENTE_PAGE_SIZE))
  );

  // ─── Ubigeo ───────────────────────────────────────────────────────────────
  listaUbigeos = signal<UbigeoModel[]>([]);
  ubigeoOpciones = computed(() =>
    this.listaUbigeos().map((u) => ({
      value: u.ubigeo,
      label: `${u.ubigeo} — ${u.department} / ${u.province} / ${u.distrit}`,
    }))
  );

  // ─── Puntos de traslado ───────────────────────────────────────────────────
  originAddress = '';
  originUbigeo = '';
  destinationAddress = '';
  destinationUbigeo = '';

  // ─── Ítems ────────────────────────────────────────────────────────────────
  items = signal<GuiaItemRequest[]>([]);

  // ─── Productos ────────────────────────────────────────────────────────────
  listaProductos = signal<ProductoModel[]>([]);
  searchProducto = '';
  productoPage = 1;
  readonly PAGE_SIZE = 5;
  productosFiltrados = computed(() => {
    const q = this.searchProducto.toLowerCase();
    return this.listaProductos().filter(
      (p) => !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.categoryName?.toLowerCase().includes(q)
    );
  });
  productosPagina = computed(() => {
    const s = (this.productoPage - 1) * this.PAGE_SIZE;
    return this.productosFiltrados().slice(s, s + this.PAGE_SIZE);
  });
  totalProductoPages = computed(() =>
    Math.max(1, Math.ceil(this.productosFiltrados().length / this.PAGE_SIZE))
  );

  // ─── Ítem personalizado ───────────────────────────────────────────────────
  itemDesc = '';
  itemQuantity: number = 1;
  itemUnit = 'NIU';
  itemPrice: number = 0;

  constructor(
    private guiaService: GuiaService,
    private ubigeoService: UbigeoService,
    private productoService: ProductoService,
    private clientesService: ClientesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarGuias();
    this.cargarUbigeos();
  }

  // ─── Carga inicial ────────────────────────────────────────────────────────
  cargarGuias() {
    this.spinner = true;
    this.guiaService.listar().subscribe({
      next: (r) => {
        this.spinner = false;
        if (r?.mensaje == 'EXITO') this.listaGuias.set(r.data);
        else { this.listaGuias.set([]); this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje }); }
      },
      error: () => {
        this.spinner = false;
        this.listaGuias.set([]);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar guías de remisión' });
      },
    });
  }

  private cargarUbigeos() {
    this.ubigeoService.listar(1).subscribe({
      next: (r) => { if (r?.mensaje == 'EXITO') this.listaUbigeos.set(r.data); },
      error: () => {},
    });
  }

  // ─── Abrir formulario nueva guía ──────────────────────────────────────────
  abrirNuevaGuia() {
    this.resetForm();
    this.isViewMode = false;
    this.guiaFormDialog = true;
  }

  verDetalle(guia: GuiaResponse) {
    this.guiaDetalle.set(guia);
    this.detalleDialog = true;
  }

  abrirPdf(guia: GuiaResponse) {
    if (guia.pdfUrl) window.open(guia.pdfUrl, '_blank');
    else this.messageService.add({ severity: 'warn', summary: 'PDF', detail: 'PDF no disponible aún' });
  }

  // ─── Destinatario ─────────────────────────────────────────────────────────
  abrirBuscarCliente() {
    this.searchCliente.set('');
    this.clientePage = 1;
    this.buscarClienteDialog = true;
    if (this.todosClientes().length === 0) {
      this.clientesService.buscarClientes('', 1).subscribe({
        next: (r) => { if (r?.mensaje == 'EXITO') this.todosClientes.set(r.data); else this.todosClientes.set([]); },
        error: () => this.todosClientes.set([]),
      });
    }
  }

  seleccionarCliente(c: BuscarClientes) {
    this.clienteSeleccionado.set(c);
    this.buscarClienteDialog = false;
  }

  limpiarCliente() {
    this.clienteSeleccionado.set(null);
  }

  // ─── Transporte ───────────────────────────────────────────────────────────
  onTransportModeChange() {
    if (this.transportMode === 'TRANSPORTE_PUBLICO') {
      this.conductores.set([]);
    } else {
      this.carrierRuc = '';
      this.carrierName = '';
      this.carrierAuthorizationCode = '';
    }
  }

  // ─── Conductores ─────────────────────────────────────────────────────────
  agregarConductor() {
    this.conductores.update((l) => [...l, { docType: 'DNI', docNumber: '', firstName: '', lastName: '', licenseNumber: '', vehiclePlate: '' }]);
  }

  eliminarConductor(index: number) {
    this.conductores.update((l) => l.filter((_, i) => i !== index));
  }

  // ─── Productos ────────────────────────────────────────────────────────────
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
    this.items.update((l) => [...l, {
      productId: p.id ?? undefined,
      description: p.name,
      quantity: 1,
      unitMeasureSunat: 'NIU',
      unitPrice: p.salePricePen ?? 0,
    }]);
    this.agregarProductoDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Producto agregado', detail: p.name, life: 2000 });
  }

  // ─── Ítem personalizado ───────────────────────────────────────────────────
  abrirItemPersonalizado() {
    this.itemDesc = '';
    this.itemQuantity = 1;
    this.itemUnit = 'NIU';
    this.itemPrice = 0;
    this.itemPersonalizadoDialog = true;
  }

  confirmarItemPersonalizado() {
    if (!this.itemDesc.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La descripción es requerida' });
      return;
    }
    if (!this.itemQuantity || this.itemQuantity <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La cantidad debe ser mayor a 0' });
      return;
    }
    this.items.update((l) => [...l, {
      description: this.itemDesc.trim(),
      quantity: this.itemQuantity,
      unitMeasureSunat: this.itemUnit || 'NIU',
      unitPrice: this.itemPrice || 0,
    }]);
    this.itemPersonalizadoDialog = false;
  }

  eliminarItem(index: number) {
    this.items.update((l) => l.filter((_, i) => i !== index));
  }

  // ─── Guardar guía ─────────────────────────────────────────────────────────
  registrarGuia() {
    if (!this.transferDate) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe ingresar la fecha de traslado' }); return; }
    if (!this.transferReason) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe seleccionar un motivo de traslado' }); return; }
    if (this.transferReason === 'OTROS' && !this.transferReasonDescription.trim()) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe ingresar la descripción del motivo' }); return; }
    if (!this.grossWeight || this.grossWeight <= 0) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'El peso bruto debe ser mayor a 0' }); return; }
    if (!this.originAddress.trim()) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe ingresar la dirección de partida' }); return; }
    if (!this.originUbigeo) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe seleccionar el ubigeo de partida' }); return; }
    if (!this.destinationAddress.trim()) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe ingresar la dirección de llegada' }); return; }
    if (!this.destinationUbigeo) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe seleccionar el ubigeo de llegada' }); return; }
    if (!this.clienteSeleccionado()) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe seleccionar un destinatario' }); return; }
    if (this.transportMode === 'TRANSPORTE_PUBLICO' && !this.carrierRuc.trim()) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe ingresar el RUC del transportista' }); return; }
    if (this.transportMode === 'TRANSPORTE_PUBLICO' && this.carrierRuc.trim().length !== 11) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'El RUC del transportista debe tener exactamente 11 dígitos' }); return; }
    if (this.transportMode === 'TRANSPORTE_PUBLICO' && !this.carrierName.trim()) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe ingresar la razón social del transportista' }); return; }
    if (this.transportMode === 'TRANSPORTE_PRIVADO' && this.conductores().length === 0) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe agregar al menos un conductor' }); return; }
    if (this.items().length === 0) { this.messageService.add({ severity: 'error', summary: 'Validación', detail: 'Debe agregar al menos un ítem' }); return; }

    const body: GuiaRequest = {
      clientId: this.clienteSeleccionado()!.id,
      issueDate: this.issueDate,
      transferDate: this.transferDate,
      transferReason: this.transferReason,
      transferReasonDescription: this.transferReasonDescription.trim() || undefined,
      transportMode: this.transportMode,
      grossWeight: this.grossWeight,
      weightUnit: this.weightUnit,
      packageCount: this.packageCount,
      minorVehicleTransfer: this.minorVehicleTransfer,
      observations: this.observations.trim() || undefined,
      originAddress: this.originAddress.trim(),
      originUbigeo: this.originUbigeo,
      destinationAddress: this.destinationAddress.trim(),
      destinationUbigeo: this.destinationUbigeo,
      carrierRuc: this.transportMode === 'TRANSPORTE_PUBLICO' ? this.carrierRuc.trim() : undefined,
      carrierName: this.transportMode === 'TRANSPORTE_PUBLICO' ? this.carrierName.trim() : undefined,
      carrierAuthorizationCode: this.transportMode === 'TRANSPORTE_PUBLICO' && this.carrierAuthorizationCode.trim() ? this.carrierAuthorizationCode.trim() : undefined,
      items: this.items(),
      drivers: this.transportMode === 'TRANSPORTE_PRIVADO' ? this.conductores() : undefined,
    };

    this.spinner = true;
    this.guiaService.crear(body).subscribe({
      next: (r) => {
        this.spinner = false;
        if (r?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Guía de remisión registrada correctamente' });
          this.guiaFormDialog = false;
          this.cargarGuias();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje });
        }
      },
      error: () => {
        this.spinner = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la guía de remisión' });
      },
    });
  }

  // ─── Reset form ──────────────────────────────────────────────────────────
  private resetForm() {
    this.transferDate = '';
    this.transferReason = '';
    this.transferReasonDescription = '';
    this.transportMode = 'TRANSPORTE_PUBLICO';
    this.grossWeight = 0;
    this.weightUnit = 'KGM';
    this.packageCount = 1;
    this.minorVehicleTransfer = false;
    this.observations = '';
    this.carrierRuc = '';
    this.carrierName = '';
    this.carrierAuthorizationCode = '';
    this.issueDate = new Date().toISOString().split('T')[0];
    this.conductores.set([]);
    this.clienteSeleccionado.set(null);
    this.originAddress = 'PRO.LA MERCED NRO. 445 BAR. LA MERCED';
    this.originUbigeo = '150122';
    this.destinationAddress = '';
    this.destinationUbigeo = '';
    this.items.set([]);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────
  getGuiaDoc(guia: GuiaResponse): string {
    if (!guia.series || !guia.sequence) return 'Sin emitir';
    return `${guia.series}-${guia.sequence}`;
  }

  getTransferReasonLabel(reason: string): string {
    return this.transferReasonOptions.find((o) => o.value === reason)?.label ?? reason;
  }

  getTransportModeLabel(mode: string): string {
    return mode === 'TRANSPORTE_PUBLICO' ? 'Público' : 'Privado';
  }

  getSunatSeverity(status?: string): 'success' | 'danger' | 'warn' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'ACEPTADO': return 'success';
      case 'RECHAZADO': return 'danger';
      case 'PENDIENTE': return 'warn';
      default: return 'secondary';
    }
  }

  getUbigeoLabel(code: string): string {
    if (!code) return '';
    const u = this.listaUbigeos().find((u) => u.ubigeo === code);
    return u ? `${u.ubigeo} — ${u.department} / ${u.province} / ${u.distrit}` : code;
  }

  minVal(a: number, b: number): number { return Math.min(a, b); }

  licenciaInvalida(licencia: string): boolean {
    return licencia.length > 0 && (!/[a-zA-Z]/.test(licencia) || !/[0-9]/.test(licencia));
  }

  licenciaExcedeLongitud(licencia: string): boolean {
    return licencia.trim().length > 10;
  }
}
