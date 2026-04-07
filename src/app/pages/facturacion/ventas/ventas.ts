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
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { CargaComponent } from '../../../components/carga/carga.component';
import { VentaService } from '../../../services/facturacion/venta.service';
import { ClientesService } from '../../../services/gestionClientes/clientes.service';
import { ProductoService } from '../../../services/facturacion/producto.service';
import { ServicioCatalogoService } from '../../../services/facturacion/servicio-catalogo.service';
import { BuscarClientes } from '../../../model/gestionClientes/buscarClientes';
import { ProductoModel } from '../../../model/facturacion/productoModel';
import { ServicioModel } from '../../../model/facturacion/servicioModel';
import {
  SaleResponse,
  SaleRequest,
  VentaItemForm,
  VentaPagoForm,
  VentaCuotaForm,
} from '../../../model/facturacion/ventaModels';

@Component({
  selector: 'app-ventas',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    FieldsetModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ToastModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    ToggleButtonModule,
    DividerModule,
    CargaComponent,
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss',
  providers: [MessageService],
})
export class Ventas {
  spinner = false;
  loading = false;
  searchValue: any;

  // ─── Dialogs ──────────────────────────────────────────────────────────────
  ventaFormDialog = false;
  detalleDialog = false;
  buscarClienteDialog = false;
  agregarProductoDialog = false;
  agregarServicioDialog = false;
  servicioRapidoDialog = false;

  // ─── Listado principal ───────────────────────────────────────────────────
  listaVentas = signal<SaleResponse[]>([]);
  ventaDetalle = signal<SaleResponse | null>(null);

  // ─── Form venta ──────────────────────────────────────────────────────────
  clienteSeleccionado = signal<BuscarClientes | null>(null);
  observaciones = '';
  purchaseOrder = '';
  paymentType: 'CONTADO' | 'CREDITO' = 'CONTADO';
  items = signal<VentaItemForm[]>([]);
  pagos = signal<VentaPagoForm[]>([]);
  cuotas = signal<VentaCuotaForm[]>([]);

  // ─── Cálculos reactivos ──────────────────────────────────────────────────
  totalVenta = computed(() =>
    this.items().reduce((acc, i) => acc + i.subtotal, 0)
  );
  igvVenta = computed(() => this.totalVenta() * (18 / 118));
  subtotalVenta = computed(() => this.totalVenta() - this.igvVenta());
  totalPagado = computed(() => this.pagos().reduce((acc, p) => acc + p.amount, 0));
  vuelto = computed(() => Math.max(0, this.totalPagado() - this.totalVenta()));
  totalCuotas = computed(() => this.cuotas().reduce((acc, c) => acc + c.amount, 0));

  // ─── Buscador clientes ───────────────────────────────────────────────────
  searchCliente = signal('');
  todosClientes = signal<BuscarClientes[]>([]);
  listaClientesFiltrada = computed(() => {
    const q = this.searchCliente().toLowerCase().trim();
    if (!q) return this.todosClientes();
    return this.todosClientes().filter(
      (c) =>
        c.nombre_completo?.toLowerCase().includes(q) ||
        c.nrodocident?.toLowerCase().includes(q) ||
        c.tipodocidenabr?.toLowerCase().includes(q)
    );
  });

  // ─── Catálogos productos/servicios ──────────────────────────────────────
  listaProductos = signal<ProductoModel[]>([]);
  listaServicios = signal<ServicioModel[]>([]);
  searchProducto = '';
  searchServicio = '';
  productoPage = 1;
  servicioPag = 1;
  readonly PAGE_SIZE = 5;

  productosFiltrados = computed(() => {
    const q = this.searchProducto.toLowerCase();
    return this.listaProductos().filter(
      (p) =>
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );
  });
  serviciosFiltrados = computed(() => {
    const q = this.searchServicio.toLowerCase();
    return this.listaServicios().filter(
      (s) =>
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.sku?.toLowerCase().includes(q)
    );
  });
  productosPagina = computed(() => {
    const start = (this.productoPage - 1) * this.PAGE_SIZE;
    return this.productosFiltrados().slice(start, start + this.PAGE_SIZE);
  });
  serviciosPagina = computed(() => {
    const start = (this.servicioPag - 1) * this.PAGE_SIZE;
    return this.serviciosFiltrados().slice(start, start + this.PAGE_SIZE);
  });
  totalProductoPages = computed(() =>
    Math.max(1, Math.ceil(this.productosFiltrados().length / this.PAGE_SIZE))
  );
  totalServicioPages = computed(() =>
    Math.max(1, Math.ceil(this.serviciosFiltrados().length / this.PAGE_SIZE))
  );

  // ─── Servicio rápido ────────────────────────────────────────────────────
  servicioRapidoNombre = '';
  servicioRapidoPrecio: number = 0;

  // ─── Métodos de pago (hardcoded) ────────────────────────────────────────
  metodoPago = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Transferencia bancaria' },
    { id: 3, nombre: 'Tarjeta débito' },
    { id: 4, nombre: 'Tarjeta crédito' },
    { id: 5, nombre: 'Yape / Plin' },
  ];

  // ─── Comprobante derivado del cliente ───────────────────────────────────
  tipoComprobante = computed(() => {
    const c = this.clienteSeleccionado();
    if (!c) return 'Boleta';
    return c.tipodocidenabr === 'RUC' ? 'Factura' : 'Boleta';
  });

  constructor(
    private ventaService: VentaService,
    private clientesService: ClientesService,
    private productoService: ProductoService,
    private servicioService: ServicioCatalogoService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.spinner = true;
    this.ventaService.listar().subscribe({
      next: (r) => {
        this.spinner = false;
        if (r?.mensaje == 'EXITO') {
          this.listaVentas.set(r.data);
        } else {
          this.listaVentas.set([]);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje });
        }
      },
      error: () => {
        this.spinner = false;
        this.listaVentas.set([]);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar ventas' });
      },
    });
  }

  // ─── Abrir form nueva venta ──────────────────────────────────────────────
  abrirNuevaVenta() {
    this.clienteSeleccionado.set(null);
    this.observaciones = '';
    this.purchaseOrder = '';
    this.paymentType = 'CONTADO';
    this.items.set([]);
    this.pagos.set([]);
    this.cuotas.set([]);
    this.ventaFormDialog = true;
  }

  // ─── Detalle ────────────────────────────────────────────────────────────
  verDetalle(venta: SaleResponse) {
    this.ventaDetalle.set(venta);
    this.detalleDialog = true;
  }

  abrirPdf(venta: SaleResponse) {
    const doc = venta.documents?.[0];
    if (doc?.pdfUrl) {
      window.open(doc.pdfUrl, '_blank');
    } else {
      this.messageService.add({ severity: 'warn', summary: 'PDF', detail: 'PDF no disponible aún' });
    }
  }

  // ─── Buscar cliente ─────────────────────────────────────────────────────
  abrirBuscarCliente() {
    this.searchCliente.set('');
    this.buscarClienteDialog = true;
    if (this.todosClientes().length === 0) {
      this.clientesService.buscarClientes('', 1).subscribe({
        next: (r) => {
          if (r?.mensaje == 'EXITO') this.todosClientes.set(r.data);
          else this.todosClientes.set([]);
        },
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
    const item = new VentaItemForm();
    item.itemType = 'PRODUCT';
    item.productId = p.id;
    item.description = p.name;
    item.unitPrice = p.salePricePen ?? 0;
    this.items.update((list) => [...list, item]);
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
    const item = new VentaItemForm();
    item.itemType = 'SERVICE';
    item.serviceId = s.id;
    item.description = s.name;
    item.unitPrice = s.pricePen ?? 0;
    this.items.update((list) => [...list, item]);
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
    const item = new VentaItemForm();
    item.itemType = 'QUICK_SERVICE';
    item.description = this.servicioRapidoNombre;
    item.unitPrice = this.servicioRapidoPrecio;
    this.items.update((list) => [...list, item]);
    this.servicioRapidoDialog = false;
  }

  // ─── Eliminar ítem ───────────────────────────────────────────────────────
  eliminarItem(index: number) {
    this.items.update((list) => list.filter((_, i) => i !== index));
  }

  // Fuerza nueva referencia del array para que computed() se recalcule
  actualizarItem() {
    this.items.update((list) => [...list]);
  }

  // ─── Pagos ───────────────────────────────────────────────────────────────
  agregarPago() {
    const pago = new VentaPagoForm();
    pago.amount = Math.max(0, this.totalVenta() - this.totalPagado());
    this.pagos.update((list) => [...list, pago]);
  }

  eliminarPago(index: number) {
    this.pagos.update((list) => list.filter((_, i) => i !== index));
  }

  onMetodoPagoChange(pago: VentaPagoForm) {
    const m = this.metodoPago.find((x) => x.id === pago.paymentMethodId);
    if (m) pago.paymentMethodName = m.nombre;
  }

  // ─── Cuotas ──────────────────────────────────────────────────────────────
  agregarCuota() {
    const cuota = new VentaCuotaForm();
    cuota.amount = this.totalVenta();
    this.cuotas.update((list) => [...list, cuota]);
  }

  eliminarCuota(index: number) {
    this.cuotas.update((list) => list.filter((_, i) => i !== index));
  }

  // ─── Guardar venta ───────────────────────────────────────────────────────
  finalizarVenta() {
    const cliente = this.clienteSeleccionado();
    if (!cliente) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un cliente' });
      return;
    }
    if (this.items().length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe agregar al menos un ítem' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const body: SaleRequest = {
      clientId: cliente.id!,
      saleDate: today,
      paymentType: this.paymentType,
      taxPercentage: 18,
      purchaseOrder: this.purchaseOrder || null,
      observations: this.observaciones || null,
      items: this.items().map((i) => ({
        itemType: i.itemType,
        productId: i.productId,
        serviceId: i.serviceId,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discountPercentage: i.discountPercentage,
        unitMeasureId: i.unitMeasureId,
      })),
      payments:
        this.paymentType === 'CONTADO'
          ? this.pagos().map((p) => ({
              paymentMethodId: p.paymentMethodId,
              amount: p.amount,
              changeAmount: Math.max(0, this.totalPagado() - this.totalVenta()),
              paymentDate: today,
              referenceNumber: p.referenceNumber,
              notes: null,
            }))
          : [],
      installments:
        this.paymentType === 'CREDITO'
          ? this.cuotas().map((c) => ({ amount: c.amount, dueDate: c.dueDate }))
          : [],
    };

    this.spinner = true;
    this.ventaService.crear(body).subscribe({
      next: (r) => {
        this.spinner = false;
        if (r?.mensaje == 'EXITO') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Venta registrada correctamente' });
          this.ventaFormDialog = false;
          this.cargarVentas();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: r?.mensaje });
        }
      },
      error: () => {
        this.spinner = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la venta' });
      },
    });
  }

  // ─── Helpers display ─────────────────────────────────────────────────────
  getComprobante(venta: SaleResponse): string {
    const doc = venta.documents?.[0];
    if (!doc) return '—';
    return `${doc.series}-${String(doc.sequence).padStart(8, '0')}`;
  }

  getSaleStatusSeverity(status: string): 'success' | 'danger' | 'warn' | 'info' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'EMITIDA': return 'success';
      case 'CANCELADO': return 'danger';
      case 'BORRADOR': return 'secondary';
      default: return 'info';
    }
  }

  getSunatStatusSeverity(status: string): 'success' | 'danger' | 'warn' | 'info' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'ACEPTADO': return 'success';
      case 'RECHAZADO': return 'danger';
      case 'PENDIENTE': return 'warn';
      default: return 'secondary';
    }
  }

  getItemTypeLabel(type: string): string {
    switch (type) {
      case 'PRODUCT': return 'Producto';
      case 'SERVICE': return 'Servicio';
      case 'QUICK_SERVICE': return 'S. Rápido';
      default: return type;
    }
  }

  minVal(a: number, b: number): number {
    return Math.min(a, b);
  }
}
