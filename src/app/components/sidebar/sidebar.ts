import { Component, ViewEncapsulation } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  standalone: true,
  styleUrl: './sidebar.scss',
  imports: [
    DrawerModule,
    ButtonModule,
    AvatarModule,
    PanelMenuModule,
    PanelModule,
    DialogModule,
  ],
})
export class Sidebar {
  // @ViewChild('drawerRef') drawerRef!: Drawer;visible: boolean = false;

  position:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'center'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright' = 'center';

  showDialog(
    position:
      | 'left'
      | 'right'
      | 'top'
      | 'bottom'
      | 'center'
      | 'topleft'
      | 'topright'
      | 'bottomleft'
      | 'bottomright'
  ) {
    this.position = position;
    this.visible = true;
  }
  constructor(private router: Router) {}
  items: MenuItem[] = [];
  // closeCallback(e:any): void {
  //   this.drawerRef.close(e);
  // }

  visible: boolean = false;
  ngOnInit() {
    this.items = [
      {
        label: 'Gestión de Contratos',
        icon: 'pi pi-file-edit',
        items: [
          {
            label: 'Contrato por Servicio',
            icon: 'pi pi-file',
            routerLink: './contrato-servicio',
          },
        ],
      },
      {
        label: 'Cobranzas y Suspensión',
        icon: 'pi pi-wallet', // ícono general para cobranzas/pagos
        items: [
          {
            label: 'Gestiòn Corte de Servicio',
            icon: 'pi pi-times',
            routerLink: './cobranzas',
          },
          {
            label: 'Gestiòn Corte de Servicio',
            icon: 'pi pi-sliders-h', // panel de control
            routerLink: './gestion-cortes',
          },
          {
            label: 'Gestion Reapertura de Servicio',
            icon: 'pi pi-refresh', // Icono de refresco
            routerLink: './gestion-reaperturas',
          },
          {
            label: 'Bajas por Morosidad',
            icon: 'pi pi-user-minus', // Icono de usuario con signo menos
            routerLink: './bajas-morosidad',
          },
          {
            label: 'Seguimiento Morosidad',
            icon: 'pi pi-eye', // Icono de ojo para seguimiento
            routerLink: './seguimiento-morosidad',
          },
          {
            label: 'Retencion Negociacion Cliente',
            icon: 'pi pi-handshake',
            routerLink: './retencion-negociacion-cliente',
          },
          {
            label: 'Validación de Vauchers',
            icon: 'pi pi-eye', // validación/aprobación
            routerLink: './validacion-vauchers',
          },
          // {
          //   label: 'Registro Manual de Pagos',
          //   icon: 'pi pi-money-bill', // registro de pagos
          // },
          // {
          //   label: 'Visualización de Pagos',
          //   icon: 'pi pi-eye', // ver pagos
          // },
          // {
          //   label: 'Configuración de Reglas de Corte y Reconexión',
          //   icon: 'pi pi-cog', // configuración
          // },

          // {
          //   label: 'Pantalla de Clientes Morosos',
          //   icon: 'pi pi-exclamation-triangle', // alerta/morosos
          // },
          // {
          //   label: 'Reportes de Cobranza',
          //   icon: 'pi pi-chart-line', // gráfico de línea como reporte
          // },
        ],
      },
      // },
      // {
      //   label: 'Recaudación y Métodos de Pago',
      //   icon: 'pi pi-wallet', // ícono general de pagos/recaudación
      //   items: [
      //     {
      //       label: 'Métodos de Pago Disponibles',
      //       icon: 'pi pi-credit-card', // representa métodos de pago
      //     },
      //     {
      //       label: 'Registro de Pagos Manuales',
      //       icon: 'pi pi-money-bill', // registro de dinero/pagos
      //     },
      //     {
      //       label: 'Validación de Vouchers',
      //       icon: 'pi pi-check-square', // validación/aprobación
      //     },
      //     {
      //       label: 'Historial de Recaudación',
      //       icon: 'pi pi-calendar', // historial/registro por fecha
      //     },
      //   ],
      // },

      // {
      //   separator: true,
      // },
      // {
      //   label: 'Morosidad y Retención',
      //   icon: 'pi pi-users', // representa clientes en general
      //   items: [
      //     {
      //       label: 'Clasificación de Clientes Morosos',
      //       icon: 'pi pi-filter', // filtrar clientes morosos
      //     },
      //     {
      //       label: 'Seguimiento de Morosidad',
      //       icon: 'pi pi-eye', // seguimiento/visualización
      //     },
      //     {
      //       label: 'Retención y Negociación',
      //       icon: 'pi pi-briefcase', // negociación y retención
      //     },

      //     {
      //       label: 'Baja Definitiva',
      //       icon: 'pi pi-trash', // baja/eliminación
      //     },
      //     {
      //       label: 'Reportes de Morosidad y Retención',
      //       icon: 'pi pi-file', // reporte/documento
      //     },
      //   ],
      // },
      // {
      //   label: 'Instalación y Configuración',
      //   icon: 'pi pi-cog', // configuración general
      //   items: [
      //     {
      //       label: 'Ordenes de Instalación (OT)',
      //       icon: 'pi pi-list', // lista de órdenes
      //     },
      //     {
      //       label: 'Agenda Técnica',
      //       icon: 'pi pi-calendar', // seguimiento/agenda
      //     },
      //     {
      //       label: 'Ejecución de Instalación',
      //       icon: 'pi pi-check-circle', // instalación completada
      //     },
      //     {
      //       label: 'Inventario Técnico y Asignación',
      //       icon: 'pi pi-box', // inventario
      //     },
      //     {
      //       label: 'Reporte de Instalaciones',
      //       icon: 'pi pi-file', // documento/reporte
      //     },
      //     {
      //       label: 'Módulo de Facturación Electrónica',
      //       icon: 'pi pi-wallet', // representa facturación/pagos
      //     },

      //     {
      //       label: 'Módulo de Reportes de Gestión y Operación',
      //       icon: 'pi pi-chart-line', // reportes gráficos
      //     },
      //   ],
      // },
      {
        label: 'Control y Cofiguración',
        icon: 'pi pi-share-alt', // configuración general
        items: [
          {
            label: 'Orden de Trabajo',
            icon: 'pi pi-hammer', // relacionado con direcciones/mapas
            routerLink: './orden-trabajo',
          },
          {
            label: 'Agencia Técnica',
            icon: 'pi pi-calendar', // planes/servicios empresariales o residenciales
            routerLink: './agencia-tecnica',
          },
        ],
      },
      {
        label: 'Mantenimientos',
        icon: 'pi pi-cog', // configuración general
        items: [
          {
            label: 'Calles',
            icon: 'pi pi-map', // relacionado con direcciones/mapas
            routerLink: './calles',
          },
          {
            label: 'Plan por Servicio',
            icon: 'pi pi-briefcase', // planes/servicios empresariales o residenciales
            routerLink: './plan-servicio',
          },
          {
            label: 'Tipo de Servicio',
            icon: 'pi pi-sitemap', // FTTH, Wireless, etc.
            routerLink: './tipo-servicio',
          },
          {
            label: 'Velocidad de Servicio',
            icon: 'pi pi-bolt', // velocidad, rapidez (⚡)
            routerLink: './velocidad-servicio',
          },
        ],
      },
    ];
  }
}
