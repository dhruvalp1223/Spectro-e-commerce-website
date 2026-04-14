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
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
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
@Component({
  selector: 'app-news-items',
  templateUrl: './news-items.component.html',
  styleUrl: './news-items.component.scss',
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


export class NewsItemsComponent implements OnInit {
  allNewsItemsList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  allCustomerRoleList: any = [];
  editMode: boolean[] = [];
  newsForm!: FormGroup;
  isAddNewsItems: boolean = false;
  isEditNewsItems: boolean = false;
  collapses = [true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  publishes: any = [];
  newsItemId: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  // limit: number = 10;
  isShowButton: boolean = false
  news: any;
  resource: any;
  selectedManufacturerImage: any;
  manufacturerImageFile: File | null = null;
  selectAllChecked: boolean = false;
  title: string = '';
  newsItemData: any;
  loading: boolean = false; 

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
    if (currentUrl === '/admin/News/NewsItemCreate') {
      this.isAddNewsItems = true;
      this.isEditNewsItems = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/News/NewsItemEdit/')) {
      const newsItemId = this.route.snapshot.paramMap.get('id');
      if (newsItemId) {
        this.editNewsItems(newsItemId);
      }
      this.isAddNewsItems = true;
      this.isEditNewsItems = true;
    } else {
      this.isAddNewsItems = false;
      this.isEditNewsItems = false;
      this.router.navigate(['/admin/News/NewsItems']);
    }
    let pagePermission = { menuName: "News Items" }
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
    this.getAllNewsItemsList();
    this.getPageResourcesList();
  }

  defaultBlogForm() {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      shortDescription: ['', Validators.required],
      fullDescription: ['', Validators.required],
      allowComments: [false],
      startDate: [''],
      endDate: [''],
      published: [false],
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


  addNewsItems() {
    this.defaultBlogForm();
    this.isAddNewsItems = true;
    this.isEditNewsItems = false;
  }

  backToBlogList() {
    this.isEditNewsItems = false;
    this.isAddNewsItems = false;
    this.getAllNewsItemsList();
    this.router.navigate(['/admin/News/NewsItems']);
  }


  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setManufacturerId(id: string) {
    this.newsItemId = id;
    console.log("newsItemId", this.newsItemId)
  }

  setNews(news: any) {
    this.news = news;
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
    this.getAllNewsItemsList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllNewsItemsList();
  }

  onAdding(tag: any): Observable<any> {
    console.log("onAdding function triggered");
    console.log(tag);
    const newTag = tag.display;
    return of(tag);
  }


  getAllNewsItemsList(): void {
    this.loading = true;
    this.defaultLayoutService.getAllNewsItems({
      title: this.title,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allNewsItemsList = Response.data.newsItems;
        this.totalRecords = Response.data.totalRecords;  
        this.totalPages = Response.data.totalPages;  
        this.loading = false;
      }
    });
  }


  editNewsItems(selectedNewsItemId: any) {
    this.defaultBlogForm();
    this.newsItemId = selectedNewsItemId;
    this.isAddNewsItems = true;
    this.isEditNewsItems = true;
    this.defaultLayoutService.getNewsItemsDetailsById(this.newsItemId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          // this.newsForm.patchValue(response.data);
          this.newsItemData = { ...response.data };
          if (this.newsItemData.startDate) {
            this.newsItemData.startDate = this.newsItemData.startDate?.split('T')[0];
          }

          if (this.newsItemData.endDate) {
            this.newsItemData.endDate = this.newsItemData.endDate?.split('T')[0];
          }

          this.newsForm.patchValue(this.newsItemData);
        } else {
          console.error('Failed to fetch blog details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching blog details:', error);
      }
    );
  }


  createNewNewsItems(saveAndEdit: boolean) {
    if (this.newsForm.valid) {
      const newsData = this.newsForm.value;
      console.log(newsData)
      this.defaultLayoutService.createNewsItems(newsData).subscribe(
        (response : any) => {
          this.newsItemId = response.data._id
          console.log('newsItems saved successfully:', response);
          this.toastr.success('newsItems saved successfully')
          if (saveAndEdit) {
            this.backToBlogList();
            this.getAllNewsItemsList();
          }
          else{
            this.router.navigate(['/admin/News/NewsItemEdit',this.newsItemId]);
            // this.editNewsItems(this.newsItemId)
          }
        },
        (error) => {
          console.error('Error saving newsItems:', error);
          this.toastr.error('Error saving newsItems')

        }
      );
    } else {
      this.newsForm.markAllAsTouched();
    }
  }

  updateNewsItems(saveAndEdit: boolean) {
    if (this.newsForm.valid) {
      const updatedData = {
        title: this.newsForm.value.title,
        shortDescription: this.newsForm.value.shortDescription,
        fullDescription: this.newsForm.value.fullDescription,
        allowComments: this.newsForm.value.allowComments,
        startDate: this.newsForm.value.startDate,
        endDate: this.newsForm.value.endDate,
        published: this.newsForm.value.published,
        searchEngineFriendlyPageName: this.newsForm.value.searchEngineFriendlyPageName,
        metaTitle: this.newsForm.value.metaTitle,
        metaKeywords: this.newsForm.value.metaKeywords,
        metaDescription: this.newsForm.value.metaDescription,
        id: this.newsItemId
      };
      this.defaultLayoutService.updateNewsItems(updatedData).subscribe(
        (response: any) => {
          console.log('newsItems updated successfully:', response);
          this.toastr.success('newsItems updated successfully')
          if (saveAndEdit) {
            this.isAddNewsItems = false;
            this.backToBlogList();
            this.getAllNewsItemsList();
          }
          else{this.editNewsItems(this.newsItemId)}
        },
        (error: any) => {
          console.error('Error updating newsItems:', error);
          this.toastr.error('Error updating newsItems')

        }
      );
    } else {
      this.newsForm.markAllAsTouched();
    }
  }


  deleteNewsItems(newsItems: any) {
    const newsItemsDeActive = {
      id: newsItems._id,
      isDeleted: true
    };
    this.defaultLayoutService.newsItemsActiveDeActive(newsItemsDeActive).subscribe(
      (response) => {
        console.log('newsItems deleted successfully:', response);
        this.toastr.success('newsItems deleted successfully')

        this.getAllNewsItemsList();
      },
      (error) => {
        console.error('Error deleting newsItems:', error);
        this.toastr.error('Error deleting newsItems')

      }
    );
  }

  reActiveNewsItems(newsItems: any) {
    const newsItemsReActive = {
      id: newsItems._id,
      isDeleted: false
    };
    this.defaultLayoutService.newsItemsActiveDeActive(newsItemsReActive).subscribe(
      (response) => {
        console.log('newsItems active successfully:', response);
        this.toastr.success('newsItems active successfully')

        this.getAllNewsItemsList();
      },
      (error) => {
        console.error('Error active newsItems:', error);
        this.toastr.error('Error active newsItems')

      }
    );
  }

  deactiveNewsItems() {
    const newsItemsDeActive = {
      id: this.newsItemId,
      isDeleted: true
    };
    this.defaultLayoutService.newsItemsActiveDeActive(newsItemsDeActive).subscribe(
      (response) => {
        console.log('newsItems deleted successfully:', response);
        this.toastr.success('newsItems deleted successfully')
        this.editNewsItems(this.newsItemId);
        this.getAllNewsItemsList();
      },
      (error) => {
        console.error('Error deleting newsItems:', error);
        this.toastr.error('Error deleting newsItems')

      }
    );
  }

  activeNewsItems() {
    const newsItemsReActive = {
      id: this.newsItemId,
      isDeleted: false
    };
    this.defaultLayoutService.newsItemsActiveDeActive(newsItemsReActive).subscribe(
      (response) => {
        console.log('newsItems active successfully:', response);
        this.toastr.success('newsItems active successfully')
        this.editNewsItems(this.newsItemId);
        this.getAllNewsItemsList();
      },
      (error) => {
        console.error('Error active newsItems:', error);
        this.toastr.error('Error active newsItems')

      }
    );
  }

}
