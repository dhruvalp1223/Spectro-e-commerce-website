import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Components'
    },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        data: {
          title: 'Home'
        }
      },
      {
        path: 'product-details/:id',
        loadComponent: () => import('./product-details/product-details.component').then(m => m.ProductDetailsComponent),
        data: {
          title: 'Product Details'
        }
      },
      // {
      //   path: 'product-category/:id',
      //   loadComponent: () => import('./product-category-list/product-category-list.component').then(m => m.ProductCategoryListComponent),
      //   data: {
      //     title: 'Product Category'
      //   }
      // },
      {
        path: 'product-category',
        loadComponent: () =>
          import('./product-category-list/product-category-list.component').then(
            (m) => m.ProductCategoryListComponent
          ),
        data: { type: 'category', title: 'Product Category' },
      },
      {
        path: 'product-manufacturer',
        loadComponent: () =>
          import('./product-category-list/product-category-list.component').then(
            (m) => m.ProductCategoryListComponent
          ),
        data: { type: 'manufacturer', title: 'Manufacturer Products' },
      },
      {
        path: 'my-account',
        loadComponent: () => import('./user-account/user-account.component').then(m => m.UserAccountComponent),
        data: {
          title: 'User Account'
        }
      },
      {
        path: 'about-us',
        loadComponent: () => import('./about-us/about-us.component').then(m => m.AboutUsComponent),
        data: {
          title: 'About Us'
        }
      },
      {
        path: 'contact-us',
        loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent),
        data: {
          title: 'Contact Us'
        }
      },
      {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
        data: {
          title: 'Checkout'
        }
      },
    ]
  },
  // {
  //   path: 'user/login',
  //   loadComponent: () => import('../user-login/user-login.component').then(m => m.UserLoginComponent),
  //   data: {
  //     title: 'Login Page'
  //   }
  // },
];


