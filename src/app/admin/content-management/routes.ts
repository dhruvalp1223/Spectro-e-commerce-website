// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     data: {
//       title: 'Content Management',
//     },
//     children: [
//       {
//         path: '',
//         redirectTo: 'Topic/List',
//         pathMatch: 'full',
//       },
//       {
//         path: 'Topic',
//         loadComponent: () =>
//           import('./topics/topics.component').then((m) => m.TopicsComponent),
//         data: {
//           title: 'Topics',
//         },
//       },
//       {
//         path: 'Topic/List',
//         loadComponent: () =>
//           import('./topics/topics.component').then((m) => m.TopicsComponent),
//         data: {
//           title: 'Topics',
//         },
//       },
//       {
//         path: 'Topic/Create',
//         loadComponent: () =>
//           import('./topics/topics.component').then((m) => m.TopicsComponent),
//         data: {
//           title: 'Topics',
//         },
//       },
//       {
//         path: 'Topic/Edit/:id',
//         loadComponent: () =>
//           import('./topics/topics.component').then((m) => m.TopicsComponent),
//         data: {
//           title: 'Topics',
//         },
//       },
//       {
//         path: 'Blog',
//         loadComponent: () =>
//           import('./blog-posts/blog-posts.component').then((m) => m.BlogPostsComponent),
//         data: {
//           title: 'Blog Posts',
//         },
//       },
//       {
//         path: 'Blog/BlogPosts',
//         loadComponent: () =>
//           import('./blog-posts/blog-posts.component').then((m) => m.BlogPostsComponent),
//         data: {
//           title: 'Blog Posts',
//         },
//       },
//       {
//         path: 'Blog/BlogPostCreate',
//         loadComponent: () =>
//           import('./blog-posts/blog-posts.component').then((m) => m.BlogPostsComponent),
//         data: {
//           title: 'Blog Posts',
//         },
//       },
//       {
//         path: 'Blog/BlogPostEdit/:id',
//         loadComponent: () =>
//           import('./blog-posts/blog-posts.component').then((m) => m.BlogPostsComponent),
//         data: {
//           title: 'Blog Posts',
//         },
//       },
//       {
//         path: 'News',
//         loadComponent: () =>
//           import('./news-items/news-items.component').then((m) => m.NewsItemsComponent),
//         data: {
//           title: 'News items',
//         },
//       },
//       {
//         path: 'News/NewsItems',
//         loadComponent: () =>
//           import('./news-items/news-items.component').then((m) => m.NewsItemsComponent),
//         data: {
//           title: 'News items',
//         },
//       },
//       {
//         path: 'News/NewsItemCreate',
//         loadComponent: () =>
//           import('./news-items/news-items.component').then((m) => m.NewsItemsComponent),
//         data: {
//           title: 'News items',
//         },
//       },
//       {
//         path: 'News/NewsItemEdit/:id',
//         loadComponent: () =>
//           import('./news-items/news-items.component').then((m) => m.NewsItemsComponent),
//         data: {
//           title: 'News items',
//         },
//       },
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
      title: 'Content Management',
    },
    children: [
      {
        path: '',
        redirectTo: 'Topic/List',
        pathMatch: 'full',
      },
      {
        path: 'Topic',
        data: {
          title: 'Topics',
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
              import('./topics/topics.component').then((m) => m.TopicsComponent),
            data: {
              title: 'Topics List',
            },
          },
          {
            path: 'Create',
            loadComponent: () =>
              import('./topics/topics.component').then((m) => m.TopicsComponent),
            data: {
              title: 'Create Topic',
            },
          },
          {
            path: 'Edit/:id',
            loadComponent: () =>
              import('./topics/topics.component').then((m) => m.TopicsComponent),
            data: {
              title: 'Edit Topic',
            },
          },
        ],
      },
      {
        path: 'Blog',
        data: {
          title: 'Blog Posts',
        },
        children: [
          {
            path: '',
            redirectTo: 'BlogPosts',
            pathMatch: 'full',
          },
          {
            path: 'BlogPosts',
            loadComponent: () =>
              import('./blog-posts/blog-posts.component').then((m) => m.BlogPostsComponent),
            data: {
              title: 'Blog Posts List',
            },
          },
          {
            path: 'BlogPostCreate',
            loadComponent: () =>
              import('./blog-posts/blog-posts.component').then((m) => m.BlogPostsComponent),
            data: {
              title: 'Create Blog Post',
            },
          },
          {
            path: 'BlogPostEdit/:id',
            loadComponent: () =>
              import('./blog-posts/blog-posts.component').then((m) => m.BlogPostsComponent),
            data: {
              title: 'Edit Blog Post',
            },
          },
        ],
      },
      {
        path: 'News',
        data: {
          title: 'News Items',
        },
        children: [
          {
            path: '',
            redirectTo: 'NewsItems',
            pathMatch: 'full',
          },
          {
            path: 'NewsItems',
            loadComponent: () =>
              import('./news-items/news-items.component').then((m) => m.NewsItemsComponent),
            data: {
              title: 'News Items List',
            },
          },
          {
            path: 'NewsItemCreate',
            loadComponent: () =>
              import('./news-items/news-items.component').then((m) => m.NewsItemsComponent),
            data: {
              title: 'Create News Item',
            },
          },
          {
            path: 'NewsItemEdit/:id',
            loadComponent: () =>
              import('./news-items/news-items.component').then((m) => m.NewsItemsComponent),
            data: {
              title: 'Edit News Item',
            },
          },
        ],
      },
      // Uncomment and add more routes as needed:
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
