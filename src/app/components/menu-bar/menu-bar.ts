import { Component } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AuthServices} from '../../auth/auth-services';
@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.html',
  standalone: true,
  styleUrl: './menu-bar.scss',
  imports: [Menubar, ToastModule, AvatarModule, InputTextModule, CommonModule],
  providers: [MessageService],
})
export class MenuBar {
  items: MenuItem[] | undefined;
  constructor(private messageService: MessageService, private router: Router,
              private authService: AuthServices) {}

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
            label: 'Gestión de Cobranzas',
            icon: 'pi pi-users', // gestión de clientes/cobranzas
            routerLink: './cobranzas',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Buscar por Cliente',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
          {
            label: 'Gestiòn Corte de Servicio',
            icon: 'pi pi-times',
            routerLink: './gestion-cortes',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Corte de Servicio',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
          {
            label: 'Gestion Reapertura de Servicio',
            icon: 'pi pi-refresh', // Icono de refresco
            routerLink: './gestion-reaperturas',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Reapertura de Servicio',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
          {
            label: 'Bajas por Morosidad',
            icon: 'pi pi-user-minus', // Icono de usuario con un signo menos
            routerLink: './bajas-morosidad',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Bajas por Morosidad',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,   
              });
            },
          },
          {
            label: 'Seguimiento Morosidad',
            icon: 'pi pi-eye', // Icono de ojo
            routerLink: './seguimiento-morosidad',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Seguimiento de Morosidad',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
          {
            label: 'Retencion Negociacion Cliente',
            icon: 'pi pi-briefcase', // Icono de maletín
            routerLink: './retencion-negociacion-cliente',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Retención y Negociación',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
          //revision de vauchers
          {
            label: 'Validación de Vauchers',
            icon: 'pi pi-eye', // validación/aprobación
            routerLink: './validacion-vauchers',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Validación de Vauchers',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });

            },
          },


          // {
          //   label: 'Registro Manual de Pagos',
          //   icon: 'pi pi-money-bill', // registro de pagos
          //   command: () => {
          //     this.messageService.add({
          //       severity: 'info',
          //       summary: 'Registro Manual de Pagos',
          //       detail: 'Funcionalidad en desarrollo',
          //       life: 3000,
          //     });
          //   },
          // },
          // {
          //   label: 'Visualización de Pagos',
          //   icon: 'pi pi-eye', // ver pagos
          //   command: () => {
          //     this.messageService.add({
          //       severity: 'info',
          //       summary: 'Visualización de Pagos',
          //       detail: 'Funcionalidad en desarrollo',
          //       life: 3000,
          //     });
          //   },
          // },
          // {
          //   label: 'Configuración de Reglas de Corte y Reconexión',
          //   icon: 'pi pi-cog', // configuración
          //   command: () => {
          //     this.messageService.add({
          //       severity: 'info',
          //       summary: 'Configuración de Reglas de Corte y Reconexión',
          //       detail: 'Funcionalidad en desarrollo',
          //       life: 3000,
          //     });
          //   },
          // },

          // {
          //   label: 'Pantalla de Clientes Morosos',
          //   icon: 'pi pi-exclamation-triangle', // alerta/morosos
          //   command: () => {
          //     this.messageService.add({
          //       severity: 'info',
          //       summary: 'Pantalla de Clientes Morosos',
          //       detail: 'Funcionalidad en desarrollo',
          //       life: 3000,
          //     });
          //   },
          // },
          // {
          //   label: 'Reportes de Cobranza',
          //   icon: 'pi pi-chart-line', // gráfico de línea como reporte
          //   command: () => {
          //     this.messageService.add({
          //       severity: 'info',
          //       summary: 'Reportes de Cobranza',
          //       detail: 'Funcionalidad en desarrollo',
          //       life: 3000,
          //     });
          //   },
          // },
        ],
      },
      // {
      //   label: 'Recaudación y Métodos de Pago',
      //   icon: 'pi pi-wallet', // ícono general de pagos/recaudación
      //   items: [
      //     {
      //       label: 'Métodos de Pago Disponibles',
      //       icon: 'pi pi-credit-card', // representa métodos de pago
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Configuración',
      //           detail: 'Parámetros Generales configurados',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Registro de Pagos Manuales',
      //       icon: 'pi pi-money-bill', // registro de dinero/pagos
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Registro de Pagos Manuales',
      //           detail: 'Registro de pagos manuales realizado',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Validación de Vouchers',
      //       icon: 'pi pi-check-square', // validación/aprobación
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Validación de Vouchers',
      //           detail: 'Integraciones configuradas correctamente',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Historial de Recaudación',
      //       icon: 'pi pi-calendar', // historial/registro por fecha
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Historial de Recaudación',
      //           detail: 'Integraciones configuradas correctamente',
      //           life: 3000,
      //         });
      //       },
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
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Clasificación',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Seguimiento de Morosidad',
      //       icon: 'pi pi-eye', // seguimiento/visualización
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Seguimiento',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Retención y Negociación',
      //       icon: 'pi pi-briefcase', // negociación y retención
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Retención',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },

      //     {
      //       label: 'Baja Definitiva',
      //       icon: 'pi pi-trash', // baja/eliminación
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Baja',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Reportes de Morosidad y Retención',
      //       icon: 'pi pi-file', // reporte/documento
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Reportes',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
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
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Clasificación',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Agenda Técnica',
      //       icon: 'pi pi-calendar', // seguimiento/agenda
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Seguimiento',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Ejecución de Instalación',
      //       icon: 'pi pi-check-circle', // instalación completada
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Retención',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Inventario Técnico y Asignación',
      //       icon: 'pi pi-box', // inventario
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Inventario',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Reporte de Instalaciones',
      //       icon: 'pi pi-file', // documento/reporte
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Reportes',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },
      //     {
      //       label: 'Módulo de Facturación Electrónica',
      //       icon: 'pi pi-wallet', // representa facturación/pagos
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Facturación',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
      //     },

      //     {
      //       label: 'Módulo de Reportes de Gestión y Operación',
      //       icon: 'pi pi-chart-line', // reportes gráficos
      //       command: () => {
      //         this.messageService.add({
      //           severity: 'info',
      //           summary: 'Reportes',
      //           detail: 'Funcionalidad en desarrollo',
      //           life: 3000,
      //         });
      //       },
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
            label: 'Agenda Técnica',
            icon: 'pi pi-calendar', // planes/servicios empresariales o residenciales
            routerLink: './agencia-tecnica',
          },
          {
            label: 'Ejecución Orden Trabajo',
            icon: 'pi pi-verified', // planes/servicios empresariales o residenciales
            routerLink: './ejecucion-orden',
          },
        ],
      },
      {
        label: 'Mantenimientos',
        icon: 'pi pi-cog', // configuración general
        items: [
          // {
          //   label: 'Calles',
          //   icon: 'pi pi-map',
          //   routerLink: './calles',
          //   command: () => {
          //     this.messageService.add({
          //       severity: 'info',
          //       summary: 'Mantenimiento de Calles',
          //       detail: 'Funcionalidad en desarrollo',
          //       life: 3000,
          //     });
          //   },
          // },
          {
            label: 'Plan por Servicio',
            icon: 'pi pi-briefcase', // planes/servicios empresariales o residenciales
            routerLink: './plan-servicio',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Planes de Servicio',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
          {
            label: 'Tipo de Servicio',
            icon: 'pi pi-sitemap', // FTTH, Wireless, etc.
            routerLink: './tipo-servicio',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Tipos de Servicio',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
          {
            label: 'Velocidad de Servicio',
            icon: 'pi pi-bolt', // velocidad, rapidez (⚡)
            routerLink: './velocidad-servicio',
            command: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Velocidades de Servicio',
                detail: 'Funcionalidad en desarrollo',
                life: 3000,
              });
            },
          },
        ],
      },
      {
        label: 'Facturación',
        icon: 'pi pi-receipt',
        items: [
          {
            label: 'Productos',
            icon: 'pi pi-box',
            routerLink: './facturacion-productos',
          },
          {
            label: 'Servicios',
            icon: 'pi pi-briefcase',
            routerLink: './facturacion-servicios',
          },
          {
            label: 'Clientes',
            icon: 'pi pi-users',
            routerLink: './clientes',
          },
          {
            label: 'Ventas',
            icon: 'pi pi-shopping-cart',
            routerLink: './facturacion-ventas',
          },
        ],
      },
    ];
  }

  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Tu sesión se cerrará.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout(); // 🔹 Limpia el token de sessionStorage
        this.router.navigate(['/login']); // 🔹 Redirige al login
        Swal.fire(
          '¡Sesión cerrada!',
          'Has cerrado sesión correctamente.',
          'success'
        );
      }
    });
  }
}
