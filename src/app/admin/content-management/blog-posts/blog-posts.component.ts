import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import {
  AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
  ModalBodyComponent,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { TagInputModule } from 'ngx-chips';
import { Observable, of } from 'rxjs';
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-posts',
  standalone: true,
  templateUrl: './blog-posts.component.html',
  styleUrl: './blog-posts.component.scss',
  animations: [
    trigger('collapse', [
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('open <=> closed', [animate('300ms ease-in-out')])
    ])
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    NgSelectModule,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective,
    ButtonDirective,
    TagInputModule,
    AngularEditorModule,

  ]
})


export class BlogPostsComponent implements OnInit {
  allBlogPostList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  allCustomerRoleList: any = [];
  editMode: boolean[] = [];
  blogForm!: FormGroup;
  isAddBlog: boolean = false;
  loading: boolean = false; 

  isEditBlog: boolean = false;
  collapses = [true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  publishes: any = [];
  blogId: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  // limit: number = 10;
  isShowButton: boolean = false
  blogs: any;
  resource: any;
  selectedManufacturerImage: any;
  manufacturerImageFile: File | null = null;
  selectAllChecked: boolean = false;
  title: string = '';
  blogPostData:any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    toolbarHiddenButtons: [
      [
        'fontName',
        'bold',
        'italic',
        'strikeThrough',
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat'
      ]
    ]
  };
  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,


  ) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/Blog/BlogPostCreate') {
      this.isAddBlog = true;
      this.isEditBlog = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/Blog/BlogPostEdit/')) {
      const blogId = this.route.snapshot.paramMap.get('id');
      if (blogId) {
        this.editBlogPost(blogId);
      }
      this.isAddBlog = true;
      this.isEditBlog = true;
    } else {
      this.isAddBlog = false;
      this.isEditBlog = false;
      this.router.navigate(['/admin/Blog/BlogPosts']);
    }
    let pagePermission = { menuName: "Blog Posts" }
    this.defaultLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.canView = Response.data.canView;
        this.canCreate = Response.data.canCreate;
        this.canEdit = Response.data.canEdit;
        this.canDelete = Response.data.canDelete;
        if (this.canView === false) {
          this.router.navigate(['admin/dashboard']);
        }

      }
    }, (error) => {
      console.log(error.error.Message);
    });
    this.defaultBlogForm();
    this.getAllBlogPostList();
    this.getPageResourcesList();
  }

  defaultBlogForm() {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      bodyOverview: [''],
      tags: new FormControl([]),
      allowComments: [false],
      includeInSitemap: [false],
      startDate: [''],
      endDate: [''],
      searchEngineFriendlyPageName: [''],
      metaTitle: [''],
      metaKeywords: [''],
      metaDescription: [''],
    });
  }


  getPageResourcesList() {
    this.allPageResourcesList = JSON.parse(localStorage.getItem('resources') || '{}');

  }


  getLabelValue(labelKey: any) {
    const resource = this.allPageResourcesList.find(
      (res: any) => res.resourceName === labelKey
    );

    return resource ? resource.resourceValue : labelKey;
  }


  addBlogPosts() {
    this.defaultBlogForm();
    this.isAddBlog = true;
    this.isEditBlog = false;
  }

  backToBlogList() {
    this.isEditBlog = false;
    this.isAddBlog = false;
    this.getAllBlogPostList();
    this.router.navigate(['/admin/Blog/BlogPosts']);

  }


  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setManufacturerId(id: string) {
    this.blogId = id;
  }

  setBlog(blogs: any) {
    this.blogs = blogs;
  }

  getPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentPage - halfRange);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentPage < this.totalPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalPages > 1) {
      pagination.push(this.totalPages);
    }

    return pagination;
  }

  changePage(page: number | string): void {
    if (page === "..." || page === this.currentPage) {
      return;
    }
    this.currentPage = page as number;
    this.getAllBlogPostList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllBlogPostList();
  }

  onAdding(tag: any): Observable<any> {
    const newTag = tag.display;
    return of(tag);
  }


  getAllBlogPostList(): void {
    this.loading = true;
    this.defaultLayoutService.getAllBlogPost({
      title: this.title,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allBlogPostList = Response.data.blogPosts;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
        this.loading = false;

      }
    });
  }


  editBlogPost(selectedBlogId: any) {
    this.defaultBlogForm();
    this.blogId = selectedBlogId;
    this.isAddBlog = true;
    this.isEditBlog = true;
    this.defaultLayoutService.getBlogPostDetailsById(this.blogId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          // this.blogForm.patchValue(response.data);
          this.blogPostData = { ...response.data };
          if (this.blogPostData.startDate) {
            this.blogPostData.startDate = this.blogPostData.startDate?.split('T')[0];
          }

          if (this.blogPostData.endDate) {
            this.blogPostData.endDate = this.blogPostData.endDate?.split('T')[0];
          }


          this.blogForm.patchValue(this.blogPostData);
        } else {
          console.error('Failed to fetch blog details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching blog details:', error);
      }
    );
  }


  createNewBlogPosts(saveAndEdit: boolean) {
    const tagsArray = this.blogForm.get('tags')?.value;
    const tagValues = tagsArray.map((tag: { value: string }) => tag.value);
    if (this.blogForm.valid) {
      const blogData = {
        title: this.blogForm.value.title,
        body: this.blogForm.value.body,
        bodyOverview: this.blogForm.value.bodyOverview,
        tags: tagValues,
        allowComments: this.blogForm.value.allowComments,
        includeInSitemap: this.blogForm.value.includeInSitemap,
        startDate: this.blogForm.value.startDate,
        endDate: this.blogForm.value.endDate,
        searchEngineFriendlyPageName: this.blogForm.value.searchEngineFriendlyPageName,
        metaTitle: this.blogForm.value.metaTitle,
        metaKeywords: this.blogForm.value.metaKeywords,
        metaDescription: this.blogForm.value.metaDescription,
      };
      this.defaultLayoutService.createNewBlogPost(blogData).subscribe(
        (response : any) => {
          this.blogId = response.data._id;
          this.toastr.success('blogPost saved successfully')
          if (saveAndEdit) {
            this.backToBlogList();
            this.getAllBlogPostList();
          }
          else{
            this.router.navigate(['/admin/Blog/BlogPostEdit',this.blogId]);
            // this.editBlogPost(this.blogId)
          }
        },
        (error) => {
          console.error('Error saving blog:', error);
          this.toastr.error('Error saving blog')

        }
      );
    } else {
      this.blogForm.markAllAsTouched();
    }
  }

  updateBlogPost(saveAndEdit: boolean) {
    const tagsArray = this.blogForm.get('tags')?.value || [];
    // Filter out null values and handle both string and object tags
    const tagValues = tagsArray
      .filter((tag: any) => tag !== null) // Remove nulls
      .map((tag: any) => (typeof tag === 'string' ? tag : tag.value)); // Handle both strings and objects

    if (this.blogForm.valid) {
      const updatedData = {
        title: this.blogForm.value.title,
        body: this.blogForm.value.body,
        bodyOverview: this.blogForm.value.bodyOverview,
        tags: tagValues,
        allowComments: this.blogForm.value.allowComments,
        includeInSitemap: this.blogForm.value.includeInSitemap,
        startDate: this.blogForm.value.startDate,
        endDate: this.blogForm.value.endDate,
        searchEngineFriendlyPageName: this.blogForm.value.searchEngineFriendlyPageName,
        metaTitle: this.blogForm.value.metaTitle,
        metaKeywords: this.blogForm.value.metaKeywords,
        metaDescription: this.blogForm.value.metaDescription,
        id: this.blogId
      };
      this.defaultLayoutService.updateBlogPost(updatedData).subscribe(
        (response: any) => {
          this.toastr.success('blogpost updated successfully')
          if (saveAndEdit) {
            this.isAddBlog = false;
            this.backToBlogList();
            this.getAllBlogPostList();
          }
          else{this.editBlogPost(this.blogId)}
        },
        (error: any) => {
          console.error('Error updating blogpost:', error);
          this.toastr.error('Error updating blogpost')

        }
      );
    } else {
      this.blogForm.markAllAsTouched();
    }
  }


  deleteBlogPost(blogs: any) {
    const blogsDeActive = {
      id: blogs._id,
      isDeleted: true
    };
    this.defaultLayoutService.blogPostActiveDeActive(blogsDeActive).subscribe(
      (response) => {
        this.toastr.success('blogs deleted successfully')

        this.getAllBlogPostList();
      },
      (error) => {
        console.error('Error deleting blogs:', error);
        this.toastr.error('Error deleting blogs')

      }
    );
  }

  reActiveBlogPost(blogs: any) {
    const blogsReActive = {
      id: blogs._id,
      isDeleted: false
    };
    this.defaultLayoutService.blogPostActiveDeActive(blogsReActive).subscribe(
      (response) => {
        this.toastr.success('blogs active successfully')
        this.getAllBlogPostList();
      },
      (error) => {
        console.error('Error deleting blogs:', error);
        this.toastr.error('Error deleting blogs')

      }
    );
  }

  deactiveBlogPost() {
    const blogsDeActive = {
      id: this.blogId,
      isDeleted: true
    };
    this.defaultLayoutService.blogPostActiveDeActive(blogsDeActive).subscribe(
      (response) => {
        this.toastr.success('blogs deleted successfully')
        this.editBlogPost(this.blogId);
        this.getAllBlogPostList();
      },
      (error) => {
        console.error('Error deleting blogs:', error);
        this.toastr.error('Error deleting blogs')

      }
    );
  }

  activeBlogPost() {
    const blogsReActive = {
      id: this.blogId,
      isDeleted: false
    };
    this.defaultLayoutService.blogPostActiveDeActive(blogsReActive).subscribe(
      (response) => {
        this.toastr.success('blogs active successfully');
        this.editBlogPost(this.blogId);
        this.getAllBlogPostList();
      },
      (error) => {
        console.error('Error deleting blogs:', error);
        this.toastr.error('Error deleting blogs')

      }
    );
  }
}

