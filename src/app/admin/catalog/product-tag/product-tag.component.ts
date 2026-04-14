import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import {
  AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
  ModalBodyComponent,
  FormCheckComponent, FormCheckInputDirective,
  ToasterService,
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.component.html',
  styleUrl: './product-tag.component.scss',
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
    NgSelectModule, FormCheckComponent, FormCheckInputDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective,
    ButtonDirective
  ]
})

export class ProductTagComponent implements OnInit {

  allTagsList: any = [];
  allCountryList: any = [];
  allStateList: any = [];
  allPageResourcesList: any = [];
  tagsForm!: FormGroup;
  isAddProductTag: boolean = false;
  isEditTag: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  bloodGroups: any = [];
  tagId: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  limit: number = 1;
  selectedUserImage: any;
  userimageFile: File | null = null;
  rolelist: any;
  isShowButton: boolean = false
  user: any;
  tags: any;
  countryId: any;
  tagName: string = '';
  collapses = [true, true];
  selectAllChecked: boolean = false;
  productTagData:any;
  loading: boolean = false; 

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/Products/ProductTags') {
      this.isAddProductTag = false;
      this.isEditTag = false;
    } else if (currentUrl.startsWith('/admin/Products/EditProductTag/')) {
      const blogId = this.route.snapshot.paramMap.get('id');
      if (blogId) {
        this.editTag(blogId);
      }
      this.isAddProductTag = true;
      this.isEditTag = true;
    } else {
      this.isAddProductTag = false;
      this.isEditTag = false;
      this.router.navigate(['/admin/Products/ProductTags']);
    }
    let pagePermission = { menuName: "Product Tags" }
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
    this.defaultTagsForm();
    this.getPageResourcesList();
    this.getAllTagsList();
  }



  defaultTagsForm() {
    this.tagsForm = this.fb.group({
      tagName: ['', Validators.required],
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



  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  settagId(id: string) {
    this.tagId = id;
  }

  setTag(tags: any) {
    this.tags = tags;
  }

  getAllTagsList() {
    this.loading = true;

    this.defaultLayoutService.getAllproductTag({
      tagName: this.tagName,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allTagsList = Response.data.productTags;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
      }
      this.loading = false;
    })
  }


  backToTagList() {
    this.isEditTag = false;
    this.isAddProductTag = false;
    this.router.navigate(['/admin/Products/ProductTags']);
  }

  toggleSelectAll() {
    this.allTagsList.forEach((tags: any) => {
      tags.isChecked = this.selectAllChecked;
    });
  }

  updateSelectAllTag() {
    this.selectAllChecked = this.allTagsList.every((tags: any) => tags.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.allTagsList.some((tags: any) => tags.isChecked);
  }

  editTag(selectedtagId: any) {
    this.defaultTagsForm();
    this.tagId = selectedtagId;
    this.isAddProductTag = true;
    this.isEditTag = true;

    this.defaultLayoutService.getProductTagDetailsById(this.tagId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.tagsForm.patchValue(response.data);
          this.productTagData=response.data
        } else {
          console.error('Failed to fetch tags details:', response.meta.message);
          this.toastr.error('Failed to fetch tags details')
        }
      },
      (error: any) => {
        console.error('Error fetching tags details:', error);
        this.toastr.error('Error fetching tags details')
      }
    );
  }

  updateTags(saveAndEdit: boolean): void {
    if (this.tagsForm.valid) {
      const updatedData = {
        tagName: this.tagsForm.value.tagName,
        id: this.tagId
      };

      this.defaultLayoutService.updateProductTags(updatedData).subscribe(
        (response: any) => {
          console.log('tags updated successfully:', response);
          this.toastr.success('Tags updated  successfully');
          if (saveAndEdit) {
            this.isAddProductTag = false;
            this.tagId = null;
            this.isEditTag = false;
            this.backToTagList();
          }
          else{
          this.editTag(this.tagId);
          }
          this.getAllTagsList();
        },
        (error: any) => {
          console.error('Error updating tags:', error);
          this.toastr.error('Error updating tags')
        }
      );
    } else {
      this.tagsForm.markAllAsTouched();
    }
  }

  deleteTag(tags: any) {
    const tagDeActive = {
      ids: [tags._id],
      isDeleted: true
    };
    this.defaultLayoutService.producttagsActiveDeActive(tagDeActive).subscribe(
      (response) => {
        console.log('tag deleted successfully:', response);
        this.toastr.success('Tag deleted successfully')
        this.getAllTagsList();
      },
      (error) => {
        console.error('Error deleting tag:', error);
        this.toastr.error('Error deleting tag')
      }
    );
  }

  reActiveTag(tags: any) {
    const tagReActive = {
      ids: [tags._id],
      isDeleted: false
    };
    this.defaultLayoutService.producttagsActiveDeActive(tagReActive).subscribe(
      (response) => {
        console.log('tag active successfully:', response);
        this.toastr.success('tag active successfully')
        this.getAllTagsList();
      },
      (error) => {
        console.error('Error active tag:', error);
        this.toastr.error('Error active tag')
      }
    );
  }

  deleteSelectedTags() {
    const selectedIds = this.allTagsList
      .filter((tags: any) => tags.isChecked)
      .map((tags: any) => tags._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: 'true'
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.producttagsActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('tags unpublished successfully:', response);
          this.toastr.success('tags deleted successfully')
          this.getAllTagsList();
          this.selectAllChecked = false;
          this.allTagsList.forEach((tags: any) => {
            tags.isChecked = false;
          });
          this.updateSelectAllTag();
          this.toggleSelectAll();
        },
        (error) => {
          console.error('Error unpublishing tags:', error);
          this.toastr.error('Error deleting tags')
        }
      );
    }
  }

  // To get the list of page numbers for pagination UI
  getPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3; // Number of visible page numbers
    const halfRange = Math.floor(maxVisiblePages / 2);

    // Always include the first page
    pagination.push(1);

    // Add "..." if the range starts after the first page
    if (this.currentPage > halfRange + 2) {
      pagination.push("...");
    }

    // Pages around the current page
    const startPage = Math.max(2, this.currentPage - halfRange);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    // Add "..." if the range ends before the last page
    if (this.currentPage < this.totalPages - halfRange - 1) {
      pagination.push("...");
    }

    // Always include the last page
    if (this.totalPages > 1) {
      pagination.push(this.totalPages);
    }

    return pagination;
  }
  // To handle page change
  changePage(page: number | string): void {
    if (page === "..." || page === this.currentPage) {
      return; // Do nothing for ellipses or the current page
    }
    this.currentPage = page as number;
    this.getAllTagsList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllTagsList(); // Fetch data with the new page size
  }

  deactiveTag() {
    const tagDeActive = {
      ids: [this.tagId],
      isDeleted: true
    };
    this.defaultLayoutService.producttagsActiveDeActive(tagDeActive).subscribe(
      (response) => {
        console.log('tag deleted successfully:', response);
        this.toastr.success('Tag deleted successfully');
        this.editTag(this.tagId);
        this.getAllTagsList();
      },
      (error) => {
        console.error('Error deleting tag:', error);
        this.toastr.error('Error deleting tag')
      }
    );
  }

  activeTag() {
    const tagReActive = {
      ids: [this.tagId],
      isDeleted: false
    };
    this.defaultLayoutService.producttagsActiveDeActive(tagReActive).subscribe(
      (response) => {
        console.log('tag active successfully:', response);
        this.toastr.success('tag active successfully');
        this.editTag(this.tagId);
        this.getAllTagsList();
      },
      (error) => {
        console.error('Error active tag:', error);
        this.toastr.error('Error active tag')
      }
    );
  }
}

