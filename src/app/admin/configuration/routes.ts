// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     data: {
//       title: 'Configuration'
//     },
//     children: [
//       {
//         path: '',
//         redirectTo: 'admin/dashboard',
//         pathMatch: 'full'
//       },
//       {
//         path: 'GeneralCommon',
//         loadComponent: () => import('./general-settings/general-settings.component').then(m => m.GeneralSettingsComponent),
//         data: {
//           title: 'General Settings'
//         }
//       },
//       {
//         path: 'EmailAccount',
//         loadComponent: () => import('./email-accounts/email-accounts.component').then(m => m.EmailAccountsComponent),
//         data: {
//           title: 'Email Accounts'
//         }
//       },
//       {
//         path: 'EmailAccount/List',
//         loadComponent: () => import('./email-accounts/email-accounts.component').then(m => m.EmailAccountsComponent),
//         data: {
//           title: 'Email Accounts'
//         }
//       },
//       {
//         path: 'EmailAccount/Create',
//         loadComponent: () => import('./email-accounts/email-accounts.component').then(m => m.EmailAccountsComponent),
//         data: {
//           title: 'Email Accounts'
//         }
//       },
//       {
//         path: 'EmailAccount/Edit/:id',
//         loadComponent: () => import('./email-accounts/email-accounts.component').then(m => m.EmailAccountsComponent),
//         data: {
//           title: 'Email Accounts'
//         }
//       },
//       {
//         path: 'Country',
//         loadComponent: () => import('./countries/countries.component').then(m => m.CountriesComponent),
//         data: {
//           title: 'Countries'
//         }
//       },
//       {
//         path: 'Country/List',
//         loadComponent: () => import('./countries/countries.component').then(m => m.CountriesComponent),
//         data: {
//           title: 'Countries'
//         }
//       },
//       {
//         path: 'Country/Create',
//         loadComponent: () => import('./countries/countries.component').then(m => m.CountriesComponent),
//         data: {
//           title: 'Countries'
//         }
//       },
//       {
//         path: 'Country/Edit/:id',
//         loadComponent: () => import('./countries/countries.component').then(m => m.CountriesComponent),
//         data: {
//           title: 'Countries'
//         }
//       },
//       {
//         path: 'Language',
//         loadComponent: () => import('./languages/languages.component').then(m => m.LanguagesComponent),
//         data: {
//           title: 'Languages'
//         }
//       },
//       {
//         path: 'Language/List',
//         loadComponent: () => import('./languages/languages.component').then(m => m.LanguagesComponent),
//         data: {
//           title: 'Languages'
//         }
//       },
//       {
//         path: 'Language/Create',
//         loadComponent: () => import('./languages/languages.component').then(m => m.LanguagesComponent),
//         data: {
//           title: 'Languages'
//         }
//       },
//       {
//         path: 'Language/Edit/:id',
//         loadComponent: () => import('./languages/languages.component').then(m => m.LanguagesComponent),
//         data: {
//           title: 'Languages'
//         }
//       },
//       {
//         path: 'Currency/List',
//         loadComponent: () => import('./currencies/currencies.component').then(m => m.CurrenciesComponent),
//         data: {
//           title: 'Currencies'
//         }
//       },
//       {
//         path: 'Currency/Create',
//         loadComponent: () => import('./currencies/currencies.component').then(m => m.CurrenciesComponent),
//         data: {
//           title: 'Currencies'
//         }
//       },
//       {
//         path: 'Currency/Edit/:id',
//         loadComponent: () => import('./currencies/currencies.component').then(m => m.CurrenciesComponent),
//         data: {
//           title: 'Currencies'
//         }
//       },
//       {
//         path: 'Currency',
//         loadComponent: () => import('./currencies/currencies.component').then(m => m.CurrenciesComponent),
//         data: {
//           title: 'Currencies'
//         }
//       },
//       {
//         path: 'tax-categories',
//         loadComponent: () => import('./tax-categories/tax-categories.component').then(m => m.TaxCategoriesComponent),
//         data: {
//           title: 'Tax Categories'
//         }
//       },
//       {
//         path: 'RoleMaster/List',
//         loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
//         data: {
//           title: 'RoleMaster'
//         }
//       },
//       {
//         path: 'RoleMaster/Create',
//         loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
//         data: {
//           title: 'RoleMaster'
//         }
//       },
//       {
//         path: 'RoleMaster/Edit/:id',
//         loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
//         data: {
//           title: 'RoleMaster'
//         }
//       },
//       {
//         path: 'RoleMaster',
//         loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
//         data: {
//           title: 'RoleMaster'
//         }
//       },
//       // {
//       //   path: 'user-master',
//       //   loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
//       //   data: {
//       //     title: 'Users'
//       //   }
//       // },
//       {
//         path: 'RoleWiseAccess',
//         loadComponent: () => import('./role-wise-access-control/role-wise-access-control.component').then(m => m.RoleWiseAccessControlComponent),
//         data: {
//           title: 'Role Wise Access Control'
//         }
//       },
//       {
//         path: 'UserWiseAccess',
//         loadComponent: () => import('./user-wise-access-control/user-wise-access-control.component').then(m => m.UserWiseAccessControlComponent),
//         data: {
//           title: 'User Wise Access Control'
//         }
//       },
//       {
//         path: 'MenuMaster/List',
//         loadComponent: () => import('./menu-master/menu-master.component').then(m => m.MenuMasterComponent),
//         data: {
//           title: 'MenuMaster'
//         }
//       },
//       {
//         path: 'MenuMaster/Create',
//         loadComponent: () => import('./menu-master/menu-master.component').then(m => m.MenuMasterComponent),
//         data: {
//           title: 'MenuMaster'
//         }
//       },
//       {
//         path: 'MenuMaster/Edit/:id',
//         loadComponent: () => import('./menu-master/menu-master.component').then(m => m.MenuMasterComponent),
//         data: {
//           title: 'MenuMaster'
//         }
//       },
//       {
//         path: 'MenuMaster',
//         loadComponent: () => import('./menu-master/menu-master.component').then(m => m.MenuMasterComponent),
//         data: {
//           title: 'MenuMaster'
//         }
//       },
//       { 
//         path: 'UserMaster/Create',
//         loadComponent: () => import('./user-master/user-master.component').then(m => m.UserMasterComponent),
//         data: {
//           title: 'UserMaster'
//         }
//       },
//       { 
//         path: 'UserMaster',
//         loadComponent: () => import('./user-master/user-master.component').then(m => m.UserMasterComponent),
//         data: {
//           title: 'UserMaster'
//         }
//       },
//       { 
//         path: 'UserMaster/List',
//         loadComponent: () => import('./user-master/user-master.component').then(m => m.UserMasterComponent),
//         data: {
//           title: 'UserMaster'
//         }
//       },
//       { 
//         path: 'UserMaster/Edit/:id',
//         loadComponent: () => import('./user-master/user-master.component').then(m => m.UserMasterComponent),
//         data: {
//           title: 'UserMaster'
//         }
//       },
//       { 
//         path: 'SliderMaster',
//         loadComponent: () => import('./slider-master/slider-master.component').then(m => m.SliderMasterComponent),
//         data: {
//           title: 'Slider Master'
//         }
//       },
//       { 
//         path: 'SliderMaster/List',
//         loadComponent: () => import('./slider-master/slider-master.component').then(m => m.SliderMasterComponent),
//         data: {
//           title: 'Slider Master'
//         }
//       },
//       { 
//         path: 'SliderMaster/Create',
//         loadComponent: () => import('./slider-master/slider-master.component').then(m => m.SliderMasterComponent),
//         data: {
//           title: 'Slider Master'
//         }
//       },
//       { 
//         path: 'SliderMaster/Edit/:id',
//         loadComponent: () => import('./slider-master/slider-master.component').then(m => m.SliderMasterComponent),
//         data: {
//           title: 'Slider Master'
//         }
//       },
//       {
//         path: 'Shipping',
//         data: {
//           title: 'Shipping'
//         },
//         children: [
//           {
//             path: '',
//             redirectTo: 'Warehouses',
//             pathMatch: 'full'
//           },
//           { 
//             path: 'Warehouses',
//             loadComponent: () => import('./warehouse/warehouse.component').then(m => m.WarehouseComponent),
//             data: {
//               title: 'Warehouses'
//             }
//           },
//           { 
//             path: 'CreateWarehouse',
//             loadComponent: () => import('./warehouse/warehouse.component').then(m => m.WarehouseComponent),
//             data: {
//               title: 'Warehouses'
//             }
//           },
//           { 
//             path: 'EditWarehouse/:id',
//             loadComponent: () => import('./warehouse/warehouse.component').then(m => m.WarehouseComponent),
//             data: {
//               title: 'Warehouses'
//             }
//           },
//         ]
//       },
//       // {
//       //   path: '**',
//       //   loadComponent: () => import('./user-wise-access-control/user-wise-access-control.component').then(m => m.UserWiseAccessControlComponent),
//       //   data: {
//       //     title: 'User Wise Access Control'
//       //   }
//       // },
//     ]
//   }
// ];


import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Configuration'
    },
    children: [
      {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'GeneralCommon',
        loadComponent: () => import('./general-settings/general-settings.component').then(m => m.GeneralSettingsComponent),
        data: {
          title: 'General Settings'
        }
      },
      {
        path: 'EmailAccount',
        data: {
          title: 'Email Accounts'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./email-accounts/email-accounts.component').then(m => m.EmailAccountsComponent),
            data: {
              title: 'Email Accounts'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./email-accounts/email-accounts.component').then(m => m.EmailAccountsComponent),
            data: {
              title: 'Create Email Account'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./email-accounts/email-accounts.component').then(m => m.EmailAccountsComponent),
            data: {
              title: 'Edit Email Account'
            }
          }
        ]
      },
      {
        path: 'Country',
        data: {
          title: 'Countries'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./countries/countries.component').then(m => m.CountriesComponent),
            data: {
              title: 'Countries'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./countries/countries.component').then(m => m.CountriesComponent),
            data: {
              title: 'Create Country'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./countries/countries.component').then(m => m.CountriesComponent),
            data: {
              title: 'Edit Country'
            }
          }
        ]
      },
      {
        path: 'Language',
        data: {
          title: 'Languages'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./languages/languages.component').then(m => m.LanguagesComponent),
            data: {
              title: 'Languages'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./languages/languages.component').then(m => m.LanguagesComponent),
            data: {
              title: 'Create Language'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./languages/languages.component').then(m => m.LanguagesComponent),
            data: {
              title: 'Edit Language'
            }
          }
        ]
      },
      {
        path: 'Currency',
        data: {
          title: 'Currencies'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./currencies/currencies.component').then(m => m.CurrenciesComponent),
            data: {
              title: 'Currencies'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./currencies/currencies.component').then(m => m.CurrenciesComponent),
            data: {
              title: 'Create Currency'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./currencies/currencies.component').then(m => m.CurrenciesComponent),
            data: {
              title: 'Edit Currency'
            }
          }
        ]
      },
      {
        path: 'tax-categories',
        loadComponent: () => import('./tax-categories/tax-categories.component').then(m => m.TaxCategoriesComponent),
        data: {
          title: 'Tax Categories'
        }
      },
      {
        path: 'RoleMaster',
        data: {
          title: 'RoleMaster'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
            data: {
              title: 'RoleMaster List'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
            data: {
              title: 'Create RoleMaster'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./role/role.component').then(m => m.RoleComponent),
            data: {
              title: 'Edit RoleMaster'
            }
          }
        ]
      },
      {
        path: 'RoleWiseAccess',
        loadComponent: () => import('./role-wise-access-control/role-wise-access-control.component').then(m => m.RoleWiseAccessControlComponent),
        data: {
          title: 'Role Wise Access Control'
        }
      },
      {
        path: 'UserWiseAccess',
        loadComponent: () => import('./user-wise-access-control/user-wise-access-control.component').then(m => m.UserWiseAccessControlComponent),
        data: {
          title: 'User Wise Access Control'
        }
      },
      {
        path: 'MenuMaster',
        data: {
          title: 'MenuMaster'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./menu-master/menu-master.component').then(m => m.MenuMasterComponent),
            data: {
              title: 'MenuMaster List'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./menu-master/menu-master.component').then(m => m.MenuMasterComponent),
            data: {
              title: 'Create MenuMaster'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./menu-master/menu-master.component').then(m => m.MenuMasterComponent),
            data: {
              title: 'Edit MenuMaster'
            }
          }
        ]
      },
      {
        path: 'UserMaster',
        data: {
          title: 'UserMaster'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./user-master/user-master.component').then(m => m.UserMasterComponent),
            data: {
              title: 'UserMaster List'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./user-master/user-master.component').then(m => m.UserMasterComponent),
            data: {
              title: 'Create UserMaster'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./user-master/user-master.component').then(m => m.UserMasterComponent),
            data: {
              title: 'Edit UserMaster'
            }
          }
        ]
      },
      {
        path: 'SliderMaster',
        data: {
          title: 'Slider Master'
        },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./slider-master/slider-master.component').then(m => m.SliderMasterComponent),
            data: {
              title: 'Slider Master List'
            }
          },
          {
            path: 'Create',
            loadComponent: () => import('./slider-master/slider-master.component').then(m => m.SliderMasterComponent),
            data: {
              title: 'Create Slider Master'
            }
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./slider-master/slider-master.component').then(m => m.SliderMasterComponent),
            data: {
              title: 'Edit Slider Master'
            }
          }
        ]
      },
      {
        path: 'Shipping',
        data: {
          title: 'Shipping'
        },
        children: [
          {
            path: '',
            redirectTo: 'Warehouses',
            pathMatch: 'full'
          },
          {
            path: 'Warehouses',
            loadComponent: () => import('./warehouse/warehouse.component').then(m => m.WarehouseComponent),
            data: {
              title: 'Warehouses'
            }
          },
          {
            path: 'CreateWarehouse',
            loadComponent: () => import('./warehouse/warehouse.component').then(m => m.WarehouseComponent),
            data: {
              title: 'Create Warehouse'
            }
          },
          {
            path: 'EditWarehouse/:id',
            loadComponent: () => import('./warehouse/warehouse.component').then(m => m.WarehouseComponent),
            data: {
              title: 'Edit Warehouse'
            }
          }
        ]
      },
    ]
  }
];
