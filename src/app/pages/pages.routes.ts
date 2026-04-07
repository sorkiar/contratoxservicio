import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';

export const pagesRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./gestionClientes/clientes/clientes.module').then(
        (m) => m.ClientesModule
      ),
  },
  {
    path: 'contrato-servicio',
    loadChildren: () =>
      import(
        './gestionClientes/contrato-servicio/contrato-servicio.module'
      ).then((m) => m.ContratoServicioModule),
  },
  {
    path: 'cobranzas',
    loadComponent: () =>
      import('./gestionCobranza/cobranzas/cobranzas').then((m) => m.Cobranzas),
  },
  // demás rutas mantenimientos también protegidas

  {
    path: 'calles',
    loadChildren: () =>
      import('./mantenimiento/calles/calles-routing.module').then(
        (m) => m.CallesRoutingModule
      ),
  },
  {
    path: 'plan-servicio',
    loadChildren: () =>
      import('./mantenimiento/plan-servicio/plan-servicio-routing.module').then(
        (m) => m.PlanServicioRoutingModule
      ),
  },
  {
    path: 'tipo-servicio',
    loadChildren: () =>
      import('./mantenimiento/tipo-servicio/tipo-servicio-routing.module').then(
        (m) => m.TipoServicioRoutingModule
      ),
  },
  {
    path: 'velocidad-servicio',
    loadChildren: () =>
      import(
        './mantenimiento/velocidad-servicio/velocidad-servicio.module'
      ).then((m) => m.VelocidadServicioModule),
  },
  {
    path: 'gestion-cortes',
    loadComponent: () =>
      import('./gestionCobranza/gestioncortes/gestioncortes').then(
        (m) => m.Gestioncortes
      ),
  },
  {
    path: 'gestion-reaperturas',
    loadComponent: () =>
      import('./gestionCobranza/gestionreaperturas/gestionreaperturas').then(
        (m) => m.Gestionreaperturas
      ),
  },
  {
    path: 'orden-trabajo',
    loadComponent: () =>
      import('./control/orden-trabajo-component/orden-trabajo-component').then(
        (m) => m.OrdenTrabajoComponent
      ),
  },
  {
    path: 'agencia-tecnica',
    loadComponent: () =>
      import(
        './control/agencia-tecnica-component/agencia-tecnica-component'
      ).then((m) => m.AgenciaTecnicaComponent),
  },
  {
    path: 'ejecucion-orden',
    loadComponent: () =>
      import('./control/ejecucion-orden-trabajo/ejecucion-orden-trabajo').then(
        (m) => m.EjecucionOrdenTrabajo
      ),
  },
  {
    path: 'bajas-morosidad',
    loadComponent: () =>
      import('./gestionCobranza/bajas-morosidad/bajas-morosidad').then(
        (m) => m.BajasMorosidad
      ),
  },
  {
    path: 'seguimiento-morosidad',
    loadComponent: () =>
      import(
        './gestionCobranza/seguimiento-morocidad/seguimiento-morocidad'
      ).then((m) => m.SeguimientoMorocidad),
  },
  {
    path: 'retencion-negociacion-cliente',
    loadComponent: () =>
      import(
        './gestionCobranza/retencion-negociacion-cliente/retencion-negociacion-cliente'
      ).then((m) => m.RetencionNegociacionCliente),
  },
  //validacion-vauchers
  {
    path: 'validacion-vauchers',
    loadComponent: () =>
      import(
        './gestionRecaudaciones/validacion-vauchers/validacion-vauchers'
      ).then((m) => m.ValidacionVauchers),
  },
  {
    path: 'facturacion-productos',
    loadComponent: () =>
      import('./facturacion/productos/productos').then((m) => m.Productos),
  },
  {
    path: 'facturacion-servicios',
    loadComponent: () =>
      import('./facturacion/servicios/servicios').then((m) => m.Servicios),
  },
  {
    path: 'facturacion-destinatarios',
    loadComponent: () =>
      import('./facturacion/destinatarios/destinatarios').then((m) => m.Destinatarios),
  },
  {
    path: 'facturacion-ventas',
    loadComponent: () =>
      import('./facturacion/ventas/ventas').then((m) => m.Ventas),
  },
  {
    path: 'facturacion-notas',
    loadComponent: () =>
      import('./facturacion/notas/notas').then((m) => m.Notas),
  },
  {
    path: 'facturacion-guias',
    loadComponent: () =>
      import('./facturacion/guias/guias').then((m) => m.Guias),
  },
  {
    path: 'facturacion-comprobantes',
    loadComponent: () =>
      import('./facturacion/comprobantes/comprobantes').then((m) => m.Comprobantes),
  },
  { path: '**', redirectTo: 'login' },
];
