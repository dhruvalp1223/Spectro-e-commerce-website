// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     data: {
//       title: 'Customers',
//     },
//     children: [
//       {
//         path: '',
//         redirectTo: 'CustomerRole/List',
//         pathMatch: 'full',
//       },
//       {
//         path: 'Customer',
//         loadComponent: () =>
//           import('./customers/customers.component').then((m) => m.CustomersComponent),
//         data: {
//           title: 'Customer List',
//         },
//       },
//       {
//         path: 'Customer/List',
//         loadComponent: () =>
//           import('./customers/customers.component').then((m) => m.CustomersComponent),
//         data: {
//           title: 'Customer List',
//         },
//       },
//       {
//         path: 'Customer/Create',
//         loadComponent: () =>
//           import('./customers/customers.component').then((m) => m.CustomersComponent),
//         data: {
//           title: 'Customer List',
//         },
//       },
//       {
//         path: 'Customer/Edit/:id',
//         loadComponent: () =>
//           import('./customers/customers.component').then((m) => m.CustomersComponent),
//         data: {
//           title: 'Customer List',
//         },
//       },
//       {
//         path: 'Customer/AddressCreate',
//         loadComponent: () =>
//           import('./customers/customers.component').then((m) => m.CustomersComponent),
//         data: {
//           title: 'Customer List',
//         },
//       },
//       {
//         path: 'Customer/AddressEdit',
//         loadComponent: () =>
//           import('./customers/customers.component').then((m) => m.CustomersComponent),
//         data: {
//           title: 'Customer List',
//         },
//       },
//       {
//         path: 'CustomerRole',
//         loadComponent: () =>
//           import('./roles/roles.component').then((m) => m.RolesComponent),
//         data: {
//           title: 'Customer Roles',
//         },
//       },
//       {
//         path: 'CustomerRole/List',
//         loadComponent: () =>
//           import('./roles/roles.component').then((m) => m.RolesComponent),
//         data: {
//           title: 'Customer Roles',
//         },
//       },
//       {
//         path: 'CustomerRole/Create',
//         loadComponent: () =>
//           import('./roles/roles.component').then((m) => m.RolesComponent),
//         data: {
//           title: 'Customer Roles',
//         },
//       },
//       {
//         path: 'CustomerRole/Edit/:id',
//         loadComponent: () =>
//           import('./roles/roles.component').then((m) => m.RolesComponent),
//         data: {
//           title: 'Customer Roles',
//         },
//       },
//       // {
//       //   path: 'online',
//       //   loadComponent: () =>
//       //     import('./online-customers/online-customers.component').then((m) => m.OnlineCustomersComponent),
//       //   data: {
//       //     title: 'Online Customers',
//       //   },
//       // },
//       // {
//       //   path: 'vendors',
//       //   loadComponent: () =>
//       //     import('./vendors/vendors.component').then((m) => m.VendorsComponent),
//       //   data: {
//       //     title: 'Vendors',
//       //   },
//       // },
//       // {
//       //   path: 'activity-log',
//       //   loadComponent: () =>
//       //     import('./activity-log/activity-log.component').then((m) => m.ActivityLogComponent),
//       //   data: {
//       //     title: 'Activity Log',
//       //   },
//       // },
//       // {
//       //   path: 'activity-types',
//       //   loadComponent: () =>
//       //     import('./activity-types/activity-types.component').then((m) => m.ActivityTypesComponent),
//       //   data: {
//       //     title: 'Activity Types',
//       //   },
//       // },
//       // {
//       //   path: 'gdpr-requests',
//       //   loadComponent: () =>
//       //     import('./gdpr-requests/gdpr-requests.component').then((m) => m.GdprRequestsComponent),
//       //   data: {
//       //     title: 'GDPR Requests',
//       //   },
//       // },
//     ],
//   },
// ];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Customers',
    },
    children: [
      {
        path: '',
        redirectTo: 'Customer/List',
        pathMatch: 'full',
      },
      {
        path: 'Customer',
        data: {
          title: 'Customer Management',
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
              import('./customers/customers.component').then((m) => m.CustomersComponent),
            data: {
              title: 'Customer List',
            },
          },
          {
            path: 'Create',
            loadComponent: () =>
              import('./customers/customers.component').then((m) => m.CustomersComponent),
            data: {
              title: 'Create Customer',
            },
          },
          {
            path: 'Edit/:id',
            loadComponent: () =>
              import('./customers/customers.component').then((m) => m.CustomersComponent),
            data: {
              title: 'Edit Customer',
            },
          },
          {
            path: 'AddressCreate',
            loadComponent: () =>
              import('./customers/customers.component').then((m) => m.CustomersComponent),
            data: {
              title: 'Create Customer Address',
            },
          },
          {
            path: 'AddressEdit',
            loadComponent: () =>
              import('./customers/customers.component').then((m) => m.CustomersComponent),
            data: {
              title: 'Edit Customer Address',
            },
          },
        ],
      },
      {
        path: 'CustomerRole',
        data: {
          title: 'Customer Roles',
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
              import('./roles/roles.component').then((m) => m.RolesComponent),
            data: {
              title: 'Customer Roles List',
            },
          },
          {
            path: 'Create',
            loadComponent: () =>
              import('./roles/roles.component').then((m) => m.RolesComponent),
            data: {
              title: 'Create Customer Role',
            },
          },
          {
            path: 'Edit/:id',
            loadComponent: () =>
              import('./roles/roles.component').then((m) => m.RolesComponent),
            data: {
              title: 'Edit Customer Role',
            },
          },
        ],
      },
      // Uncomment and add more routes as needed:
      // {
      //   path: 'OnlineCustomers',
      //   loadComponent: () =>
      //     import('./online-customers/online-customers.component').then((m) => m.OnlineCustomersComponent),
      //   data: {
      //     title: 'Online Customers',
      //   },
      // },
      // {
      //   path: 'Vendors',
      //   loadComponent: () =>
      //     import('./vendors/vendors.component').then((m) => m.VendorsComponent),
      //   data: {
      //     title: 'Vendors',
      //   },
      // },
      // {
      //   path: 'ActivityLog',
      //   loadComponent: () =>
      //     import('./activity-log/activity-log.component').then((m) => m.ActivityLogComponent),
      //   data: {
      //     title: 'Activity Log',
      //   },
      // },
      // {
      //   path: 'ActivityTypes',
      //   loadComponent: () =>
      //     import('./activity-types/activity-types.component').then((m) => m.ActivityTypesComponent),
      //   data: {
      //     title: 'Activity Types',
      //   },
      // },
      // {
      //   path: 'GdprRequests',
      //   loadComponent: () =>
      //     import('./gdpr-requests/gdpr-requests.component').then((m) => m.GdprRequestsComponent),
      //   data: {
      //     title: 'GDPR Requests',
      //   },
      // },
    ],
  },
];
