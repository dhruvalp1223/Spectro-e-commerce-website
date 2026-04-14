// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     data: {
//       title: 'Catalog'
//     },
//     children: [
//       {
//         path: '',
//         redirectTo: 'Product/List',
//         pathMatch: 'full'
//       },
//       {
//         path: 'Product',
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       },
//       {
//         path: 'Product/List',
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       },
//       {
//         path: 'Product/Create',
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       },
//       {
//         path: 'Product/Edit/:id',  
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       },  
//       {
//         path: 'Product/ProductAttributeMappingCreate',  
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       }, 
//       {
//         path: 'Product/ProductAttributeMappingEdit',  
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       }, 
//       {
//         path: 'Product/ProductSpecAttributeAdd',  
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       },   
//       {
//         path: 'Product/ProductSpecAttributeEdit',  
//         loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
//         data: {
//           title: 'Products'
//         }
//       },   
//       {
//         path: 'Category',
//         loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
//         data: {
//           title: 'Categories'
//         }
//       },
//       {
//         path: 'Category/List',
//         loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
//         data: {
//           title: 'Categories'
//         }
//       },
//       {
//         path: 'Category/Create',
//         loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
//         data: {
//           title: 'Categories'
//         }
//       },
//       {
//         path: 'Category/Edit/:id',
//         loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
//         data: {
//           title: 'Categories'
//         }
//       },
//       {
//         path: 'Manufacturer',
//         loadComponent: () => import('./manufactrurers/manufactrurers.component').then(m => m.ManufactrurersComponent),
//         data: {
//           title: 'Manufacturers'
//         }
//       },
//       {
//         path: 'Manufacturer/List',
//         loadComponent: () => import('./manufactrurers/manufactrurers.component').then(m => m.ManufactrurersComponent),
//         data: {
//           title: 'Manufacturers'
//         }
//       },
//       {
//         path: 'Manufacturer/Create',
//         loadComponent: () => import('./manufactrurers/manufactrurers.component').then(m => m.ManufactrurersComponent),
//         data: {
//           title: 'Manufacturers'
//         }
//       },
//       {
//         path: 'Manufacturer/Edit/:id',
//         loadComponent: () => import('./manufactrurers/manufactrurers.component').then(m => m.ManufactrurersComponent),
//         data: {
//           title: 'Manufacturers'
//         }
//       },
//       // {
//       //   path: 'product-reviews',
//       //   loadComponent: () => import('./carousels/carousels.component').then(m => m.CarouselsComponent),
//       //   data: {
//       //     title: 'Carousel'
//       //   }
//       // },

//       {
//         path: 'Product/ProductTags',
//         loadComponent: () => import('./product-tag/product-tag.component').then(m => m.ProductTagComponent),
//         data: {
//           title: 'Product-Tags'
//         }
//       },
//       {
//         path: 'Product/EditProductTag/:id',
//         loadComponent: () => import('./product-tag/product-tag.component').then(m => m.ProductTagComponent),
//         data: {
//           title: 'Product-Tags'
//         }
//       },
//       {
//         path: '',
//         data: {
//           title: 'Attributes'
//         },
//         children: [
//           {
//             path: '',
//             redirectTo: 'ProductAttribute/List',
//             pathMatch: 'full'
//           },
//           {
//             path: 'ProductAttribute',
//             loadComponent: () => import('./attributes/product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
//             data: {
//               title: 'product-attributes'
//             }
//           },
//           {
//             path: 'ProductAttribute/List',
//             loadComponent: () => import('./attributes/product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
//             data: {
//               title: 'product-attributes'
//             }
//           },
//           {
//             path: 'ProductAttribute/Create',
//             loadComponent: () => import('./attributes/product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
//             data: {
//               title: 'product-attributes'
//             }
//           },
//           {
//             path: 'ProductAttribute/Edit/:id',
//             loadComponent: () => import('./attributes/product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
//             data: {
//               title: 'product-attributes'
//             }
//           },
//           {
//             path: 'SpecificationAttribute',
//             loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
//             data: {
//               title: 'specification-attributes'
//             }
//           },
//           {
//             path: 'SpecificationAttribute/List',
//             loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
//             data: {
//               title: 'specification-attributes'
//             }
//           },
//           {
//             path: 'SpecificationAttribute/EditSpecificationAttribute/:id',
//             loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
//             data: {
//               title: 'specification-attributes'
//             }
//           },
//           {
//             path: 'SpecificationAttribute/CreateSpecificationAttributeGroup',
//             loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
//             data: {
//               title: 'specification-attributes'
//             }
//           },
//           {
//             path: 'SpecificationAttribute/CreateSpecificationAttribute',
//             loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
//             data: {
//               title: 'specification-attributes'
//             }
//           },
//           {
//             path: 'SpecificationAttribute/EditSpecificationAttributeGroup/:id',
//             loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
//             data: {
//               title: 'specification-attributes'
//             }
//           },
//           // {
//           //   path: 'checkout-attributes',
//           //   loadComponent: () => import('./accordion/accordions.component').then(m => m.AccordionsComponent),
//           //   data: {
//           //     title: 'checkout-attributes'
//           //   }
//           // },
//         ]
//       },
//     ]
//   }
// ];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Catalog' },
    children: [
      {
        path: '',
        redirectTo: 'Product/List',
        pathMatch: 'full',
      },
      {
        path: 'Product',
        data: { title: 'Products' },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
            data: { title: 'Products' },
          },
          {
            path: 'Create',
            loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
            data: { title: 'Products' },
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
            data: { title: 'Products' },
          },
          {
            path: 'ProductAttributeMappingCreate',
            loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
            data: { title: 'Products' },
          },
          {
            path: 'ProductAttributeMappingEdit',
            loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
            data: { title: 'Products' },
          },
          {
            path: 'ProductSpecAttributeAdd',
            loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
            data: { title: 'Products' },
          },
          {
            path: 'ProductSpecAttributeEdit',
            loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
            data: { title: 'Products' },
          },
        ],
      },
      {
        path: 'Products',
        data: { title: 'Products' },
        children: [
          {
            path: '',
            redirectTo: 'ProductTags',
            pathMatch: 'full',
          },
          {
            path: 'ProductTags',
            loadComponent: () => import('./product-tag/product-tag.component').then(m => m.ProductTagComponent),
            data: { title: 'Product-Tags' },
          },
          {
            path: 'EditProductTag/:id',
            loadComponent: () => import('./product-tag/product-tag.component').then(m => m.ProductTagComponent),
            data: { title: 'Product-Tags' },
          },
        ],
      },
      {
        path: 'Category',
        data: { title: 'Categories' },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
            data: { title: 'Categories' },
          },
          {
            path: 'Create',
            loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
            data: { title: 'Categories' },
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
            data: { title: 'Categories' },
          },
        ],
      },
      {
        path: 'Manufacturer',
        data: { title: 'Manufacturers' },
        children: [
          {
            path: '',
            redirectTo: 'List',
            pathMatch: 'full',
          },
          {
            path: 'List',
            loadComponent: () => import('./manufactrurers/manufactrurers.component').then(m => m.ManufactrurersComponent),
            data: { title: 'Manufacturers' },
          },
          {
            path: 'Create',
            loadComponent: () => import('./manufactrurers/manufactrurers.component').then(m => m.ManufactrurersComponent),
            data: { title: 'Manufacturers' },
          },
          {
            path: 'Edit/:id',
            loadComponent: () => import('./manufactrurers/manufactrurers.component').then(m => m.ManufactrurersComponent),
            data: { title: 'Manufacturers' },
          },
        ],
      },
      //  {
      //   path: 'product-reviews',
      //   loadComponent: () => import('./carousels/carousels.component').then(m => m.CarouselsComponent),
      //   data: {
      //     title: 'Carousel'
      //   }
      // },
      {
        path: '',
        data: { title: 'Attributes' },
        children: [
          {
            path: '',
            redirectTo: 'ProductAttribute/List',
            pathMatch: 'full',
          },
          {
            path: 'ProductAttribute',
            data: { title: 'Product Attributes' },
            children: [
              {
                path: '',
                redirectTo: 'List',
                pathMatch: 'full',
              },
              {
                path: 'List',
                loadComponent: () => import('./attributes/product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
                data: { title: 'Product Attributes List' },
              },
              {
                path: 'Create',
                loadComponent: () => import('./attributes/product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
                data: { title: 'Create Product Attribute' },
              },
              {
                path: 'Edit/:id',
                loadComponent: () => import('./attributes/product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
                data: { title: 'Edit Product Attribute' },
              },
            ],
          },
          {
            path: 'SpecificationAttribute',
            data: { title: 'Specification Attributes' },
            children: [
              {
                path: '',
                redirectTo: 'List',
                pathMatch: 'full',
              },
              {
                path: 'List',
                loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
                data: { title: 'Specification Attributes List' },
              },
              {
                path: 'CreateSpecificationAttributeGroup',
                loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
                data: { title: 'Create Specification Attribute Group' },
              },
              {
                path: 'CreateSpecificationAttribute',
                loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
                data: { title: 'Create Specification Attribute' },
              },
              {
                path: 'EditSpecificationAttributeGroup/:id',
                loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
                data: { title: 'Edit Specification Attribute Group' },
              },
              {
                path: 'EditSpecificationAttribute/:id',
                loadComponent: () => import('./attributes/specification-attributes/specification-attributes.component').then(m => m.SpecificationAttributesComponent),
                data: { title: 'Edit Specification Attribute' },
              },
            ],
          },
        ],
      },
      
    ],
  },
];
