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
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
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
    AngularEditorModule,

  ]
})

export class TopicsComponent implements OnInit {
  allTopicList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  allCustomerRoleList: any = [];
  editMode: boolean[] = [];
  topicForm!: FormGroup;
  isAddTopics: boolean = false;
  isEditTopics: boolean = false;
  collapses = [true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  publishes: any = [];
  topicId: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  // limit: number = 10;
  isShowButton: boolean = false
  topics: any;
  resource: any;
  selectedManufacturerImage: any;
  manufacturerImageFile: File | null = null;
  selectAllChecked: boolean = false;
  name: string = '';
  loading: boolean = false; 

  topicData: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    sanitize: false,
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
    if (currentUrl === '/admin/Topic/Create') {
      this.isAddTopics = true;
      this.isEditTopics = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/Topic/Edit/')) {
      const topicId = this.route.snapshot.paramMap.get('id');
      if (topicId) {
        this.editTopic(topicId);
      }
      this.isAddTopics = true;
      this.isEditTopics = true;
    } else {
      this.isAddTopics = false;
      this.isEditTopics = false;
      this.router.navigate(['/admin/Topic/List']);

    }
    let pagePermission = { menuName: "Topics" }
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
    this.defaultTopicForm();
    this.getAllTopicList();
    this.getPageResourcesList();
    this.getAllCustomerRoleList();
  }

  defaultTopicForm() {
    this.topicForm = this.fb.group({
      title: [''],
      body: [''],
      published: [false],
      includeInTopMenu: [false],
      includeInFooterColumn1: [false],
      includeInFooterColumn2: [false],
      includeInFooterColumn3: [false],
      includeInSiteMap: [false],
      accessibleWhenStoreClosed: [false],
      customerRoleId: [],
      systemName: ['', Validators.required],
      order: [''],
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


  addTopics() {
    this.defaultTopicForm();
    this.isAddTopics = true;
    this.isEditTopics = false;
  }

  backToTopicList() {
    this.isEditTopics = false;
    this.isAddTopics = false;
    this.getAllTopicList();
    this.router.navigate(['/admin/Topic/List']);

  }


  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setManufacturerId(id: string) {
    this.topicId = id;
  }

  setTopic(topics: any) {
    this.topics = topics;
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
    this.getAllTopicList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllTopicList();
  }




  getAllTopicList(): void {
    this.loading = true;

    this.defaultLayoutService.getAllTopic({
      systemName: this.name,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allTopicList = Response.data.pages;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
        this.loading = false;

      }
    });
  }


  editTopic(selectedTopicId: any) {
    this.defaultTopicForm();
    this.topicId = selectedTopicId;
    this.isAddTopics = true;
    this.isEditTopics = true;
    this.defaultLayoutService.getTopicDetailsById(this.topicId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.topicForm.patchValue(response.data);
          this.topicData = response.data;
        } else {
          console.error('Failed to fetch topic details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching topic details:', error);
      }
    );
  }


  createNewTopic(saveAndEdit: boolean) {
    if (this.topicForm.valid) {
      const topicData = this.topicForm.value;
      this.defaultLayoutService.createTopic(topicData).subscribe(
        (response :any) => {
          this.topicId = response.data._id;
          this.toastr.success('topic saved successfully')
          if (saveAndEdit) {
            this.backToTopicList();
            this.getAllTopicList();
          }
          else{
            this.router.navigate(['/admin/Topic/Edit',this.topicId]);

            this.editTopic(this.topicId)
          }
        },
        (error) => {
          console.error('Error saving topic:', error);
          this.toastr.error('Error saving topic')

        }
      );
    } else {
      this.topicForm.markAllAsTouched();
    }
  }

  updateTopic(saveAndEdit: boolean) {
    if (this.topicForm.valid) {

      const updatedData = {
        title: this.topicForm.value.title,
        body: this.topicForm.value.body,
        published: this.topicForm.value.published,
        includeInTopMenu: this.topicForm.value.includeInTopMenu,
        includeInFooterColumn1: this.topicForm.value.includeInFooterColumn1,
        includeInFooterColumn2: this.topicForm.value.includeInFooterColumn2,
        includeInFooterColumn3: this.topicForm.value.includeInFooterColumn3,
        includeInSiteMap: this.topicForm.value.includeInSiteMap,
        accessibleWhenStoreClosed: this.topicForm.value.accessibleWhenStoreClosed,
        customerRoleId: this.topicForm.value.customerRoleId,
        systemName: this.topicForm.value.systemName,
        order: this.topicForm.value.order,
        searchEngineFriendlyPageName: this.topicForm.value.searchEngineFriendlyPageName,
        metaTitle: this.topicForm.value.metaTitle,
        metaKeywords: this.topicForm.value.metaKeywords,
        metaDescription: this.topicForm.value.metaDescription,
        id: this.topicId
      };
      this.defaultLayoutService.updateTopic(updatedData).subscribe(
        (response: any) => {
          this.toastr.success('topic updated successfully')
          if (saveAndEdit) {
            this.isAddTopics = false;
            this.backToTopicList();
            this.getAllTopicList();
          }
          else{this.editTopic(this.topicId)}
        },
        (error: any) => {
          console.error('Error updating topic:', error);
          this.toastr.error('Error updating topic')

        }
      );
    } else {
      this.topicForm.markAllAsTouched();
    }
  }


  deleteTopic(topics: any) {
    const topicsDeActive = {
      id: topics._id,
      isDeleted: true
    };
    this.defaultLayoutService.topicActiveDeActive(topicsDeActive).subscribe(
      (response) => {
        this.toastr.success('topic deleted successfully')
        this.getAllTopicList();
      },
      (error) => {
        console.error('Error deleting topic:', error);
        this.toastr.error('Error deleting topic')

      }
    );
  }

  reActiveTopic(topics: any) {
    const topicsReActive = {
      id: topics._id,
      isDeleted: false
    };
    this.defaultLayoutService.topicActiveDeActive(topicsReActive).subscribe(
      (response) => {
        this.toastr.success('topic active successfully')
        this.getAllTopicList();
      },
      (error) => {
        console.error('Error deleting topic:', error);
        this.toastr.error('Error deleting topic')

      }
    );
  }

  deactiveTopic() {
    const topicsDeActive = {
      id: this.topicId,
      isDeleted: true
    };
    this.defaultLayoutService.topicActiveDeActive(topicsDeActive).subscribe(
      (response) => {
        this.toastr.success('topic deleted successfully')
        this.editTopic(this.topicId);
        this.getAllTopicList();
      },
      (error) => {
        console.error('Error deleting topic:', error);
        this.toastr.error('Error deleting topic')

      }
    );
  }

  activeTopic() {
    const topicsReActive = {
      id: this.topicId,
      isDeleted: false
    };
    this.defaultLayoutService.topicActiveDeActive(topicsReActive).subscribe(
      (response) => {
        this.toastr.success('topic active successfully')
        this.editTopic(this.topicId);

        this.getAllTopicList();
      },
      (error) => {
        console.error('Error deleting topic:', error);
        this.toastr.error('Error deleting topic')

      }
    );
  }


  getAllCustomerRoleList(): void {
    this.defaultLayoutService.getAllActiveCustomerRole(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCustomerRoleList = Response.data;
      }
    });
  }

}
