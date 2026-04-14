

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sales',
    },
    children: [
      {
        path: '',
        redirectTo: 'order/List',
        pathMatch: 'full',
      },
      {
        path: 'order',
        data: {
          title: 'Orders',
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () =>
              import('./orders/orders.component').then((m) => m.OrdersComponent),
            data: {
              title: 'Order List',
            },
          },
          {
            path: 'Create',
            loadComponent: () =>
              import('./orders/orders.component').then((m) => m.OrdersComponent),
            data: {
              title: 'Order List',
            },
          },
          {
            path: 'Edit/:id',
            loadComponent: () =>
              import('./orders/orders.component').then((m) => m.OrdersComponent),
            data: {
              title: 'Edit Order',
            },
          },
          {
            path: 'AddressEdit',
            loadComponent: () =>
              import('./orders/orders.component').then((m) => m.OrdersComponent),
            data: {
              title: 'Edit Order Address',
            },
          },
          
        ],
      },
      {
        path: 'shipments',
        data: {
          title: 'Shipments',
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () =>
              import('./shipments/shipments.component').then((m) => m.ShipmentsComponent),
            data: {
              title: 'Shipment List',
            },
          },
          {
            path: 'Create',
            loadComponent: () =>
              import('./shipments/shipments.component').then((m) => m.ShipmentsComponent),
            data: {
              title: 'Shipment Create',
            },
          },
          {
            path: 'Edit',
            loadComponent: () =>
              import('./shipments/shipments.component').then((m) => m.ShipmentsComponent),
            data: {
              title: 'Edit Shipment',
            },
          },
        ],
      },
    
    ],
  },
];
