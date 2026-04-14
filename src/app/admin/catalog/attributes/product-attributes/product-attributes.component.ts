import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import {
  AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
  ModalBodyComponent,
  FormCheckComponent, FormCheckInputDirective,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../../shared/common.service';
import { environment } from '../../../../../environments/environment';
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';

declare const $: any;

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrl: './product-attributes.component.scss',
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
    ButtonDirective,
    AngularEditorModule,

  ]
})
export class ProductAttributesComponent implements OnInit {

  allProductAttributesList: any = [];
  allPredefinedProductAttributesList: any = [];
  loading: boolean = false; 

  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  productAttributesForm!: FormGroup;
  isAddProductAttributes: boolean = false;
  isEditProductAttributes: boolean = false;
  collapses = [true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  productAttributeId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  Math = Math;
  // Regular product attributes state
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize: number = 10;
  // Predefined product attributes state
  predefinedCurrentPage: number = 1;
  predefinedPageSize: number = 10;
  totalPredefinedProductRecords: number = 0;
  totalPredefinedProductPages: number = 0;
  isShowButton: boolean = false;
  productAttributes: any;
  publishes: any = [];
  isEditPredefinedProductAttribute: boolean = false;
  isShowSaveUpdateButton: boolean = false;
  resource: any;
  selectedCategoryImage: any;
  categoryImageFile: File | null = null;
  selectAllChecked: boolean = false;
  ParentCategoryList: any = [];
  categoryName: string = '';
  published: string = '';
  predefinedProductForm!: FormGroup;
  predefinedProductId: any;
  predefinedProductAttributes: any;
  productAttrPreDefineValueModal: boolean = false;
  public visible = false;
  attributeName: string = '';
  productAttributeData:any;
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
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/ProductAttribute/Create') {
      this.isAddProductAttributes = true;
      this.isEditProductAttributes = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/ProductAttribute/Edit/')) {
      const productAttributeId = this.route.snapshot.paramMap.get('id');
      if (productAttributeId) {
        this.editProductAttributes(productAttributeId);
      }
      this.isAddProductAttributes = true;
      this.isEditProductAttributes = true;
    } else {
      this.isAddProductAttributes = false;
      this.isEditProductAttributes = false;
      this.router.navigate(['/admin/ProductAttribute/List']);
    }

    let pagePermission = { menuName: "Product Attributes" }
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
    this.defaultProductAttributesForm();
    this.getallProductAttributesList();
    this.getPageResourcesList();
    this.defaultpredefinedProductForm();
    this.publishes = [
      { label: 'All', value: '' },
      { label: 'Published only', value: 'true' },
      { label: 'Unpublished only', value: 'false' },
    ];
  }

  defaultProductAttributesForm() {
    this.productAttributesForm = this.fb.group({
      productAttributeName: ['', Validators.required],
      description: [''],
    });
  }

  defaultpredefinedProductForm() {
    this.predefinedProductForm = this.fb.group({
      predefinedProductAttributeName: ['', Validators.required],
      priceAdjustment: [''],
      priceAdjustmentUsePercentage: [false],
      weightAdjustment: [''],
      cost: [''],
      isPreSelected: [false],
      order: []
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


  addProductAttributes() {
    this.isShowButton = false;
    this.productAttributesForm.reset();
    this.defaultProductAttributesForm();
    this.isAddProductAttributes = true;
    this.isEditProductAttributes = false;
  }

  backToProductAttributesList() {
    this.isEditProductAttributes = false;
    this.isAddProductAttributes = false;
    this.getallProductAttributesList();
    this.router.navigate(['/admin/ProductAttribute/List']);

  }


  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleCollapse1(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }
  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setproductAttributesId(id: string) {
    this.productAttributeId = id;
  }

  setProductAttributes(productAttributes: any) {
    this.productAttributes = productAttributes;
  }

  setPredefinedProductAttributes(predefinedProductAttributes: any) {
    this.predefinedProductAttributes = predefinedProductAttributes;
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
    this.getallProductAttributesList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getallProductAttributesList();
  }

  openAddPredefinedProductModal() {
    this.productAttrPreDefineValueModal = false;
    this.defaultpredefinedProductForm();
    this.isEditPredefinedProductAttribute = false;
    this.isShowSaveUpdateButton = false;
  }



  // To get the list of page numbers for pagination UI
  getPredefinedProductPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3; // Number of visible page numbers
    const halfRange = Math.floor(maxVisiblePages / 2);

    // Always include the first page
    pagination.push(1);

    // Add "..." if the range starts after the first page
    if (this.predefinedCurrentPage > halfRange + 2) {
      pagination.push("...");
    }

    // Pages around the current page
    const startPage = Math.max(2, this.predefinedCurrentPage - halfRange);
    const endPage = Math.min(this.totalPredefinedProductPages - 1, this.predefinedCurrentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    // Add "..." if the range ends before the last page
    if (this.predefinedCurrentPage < this.totalPredefinedProductPages - halfRange - 1) {
      pagination.push("...");
    }

    // Always include the last page
    if (this.totalPredefinedProductPages > 1) {
      pagination.push(this.totalPredefinedProductPages);
    }

    return pagination;
  }


  // Change page for predefined product attributes
  changePredefinedProductPage(page: number | string): void {
    if (page === "..." || page === this.predefinedCurrentPage) {
      return;
    }
    this.predefinedCurrentPage = page as number;
    this.getallPredefinedProductAttributesList();
  }

  // Update page size for predefined product attributes
  updatePredefinedProductPageSize(): void {
    this.predefinedCurrentPage = 1;
    this.getallPredefinedProductAttributesList();
  }



  toggleSelectAll() {
    this.allProductAttributesList.forEach((productAttributes: any) => {
      productAttributes.isChecked = this.selectAllChecked;
    });
  }

  updateSelectAllproductAttributes() {
    this.selectAllChecked = this.allProductAttributesList.every((productAttributes: any) => productAttributes.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.allProductAttributesList.some((productAttributes: any) => productAttributes.isChecked);
  }


  getallProductAttributesList(): void {
    this.loading = true;

    this.defaultLayoutService.getAllProductAttributes({
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allProductAttributesList = Response.data.productAttributes;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
      }
      this.loading = false;
    });
  }

  editProductAttributes(selectedProductAttributesId: any) {
    this.defaultProductAttributesForm();
    this.productAttributeId = selectedProductAttributesId;
    this.isAddProductAttributes = true;
    this.isEditProductAttributes = true;
    this.isShowButton = true;

    this.defaultLayoutService.getProductAttributesDetailsById(this.productAttributeId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.productAttributesForm.patchValue(response.data);
          this.attributeName = response.data.productAttributeName;
          this.productAttributeData=response.data;
          this.getallPredefinedProductAttributesList();

        } else {
          console.error('Failed to fetch productAttribute details:', response.meta.message);
          this.toastr.error('Failed to fetch productAttribute details')
        }
      },
      (error: any) => {
        console.error('Error fetching productAttribute details:', error);
        this.toastr.error('Error fetching productAttribute details')
      }
    );
  }


  createNewProductAttribute(saveAndEdit: boolean) {
    if (this.productAttributesForm.valid) {

      const productAttributesObj = this.productAttributesForm.value;

      this.defaultLayoutService.CreateNewProductAttribute(productAttributesObj).subscribe(
        (response:any) => {
          this.productAttributeId = response.data._id;
          console.log('productAttributes saved successfully:', response);
          this.toastr.success('ProductAttributes saved successfully')
          if (saveAndEdit) {
            this.isAddProductAttributes = false;
            this.backToProductAttributesList();
            this.getallProductAttributesList();
          }
          else{
            this.router.navigate(['/admin/ProductAttribute/Edit',this.productAttributeId]);
            // this.editProductAttributes(this.productAttributeId);
          }
        },
        (error) => {
          console.error('Error saving productAttributes:', error);
          this.toastr.error('Error saving productAttributes')
        }
      );
    } else {
      this.productAttributesForm.markAllAsTouched();
    }
  }

  updateproductAttributes(saveAndEdit: boolean) {
    if (this.productAttributesForm.valid) {

      const updatedProductAttributesForm = {
        productAttributeName: this.productAttributesForm.get('productAttributeName')?.value,
        description: this.productAttributesForm.get('description')?.value,
        id: this.productAttributeId
      };

      this.defaultLayoutService.updateProductAttributesById(updatedProductAttributesForm).subscribe(
        (response: any) => {
          console.log('productAttribute updated successfully:', response);
          this.toastr.success('ProductAttribute updated successfully')
          if (saveAndEdit) {
            this.isAddProductAttributes = false;
            this.backToProductAttributesList();
            this.getallProductAttributesList();
          }
          else{
            this.editProductAttributes(this.productAttributeId);
          }
        },
        (error: any) => {
          console.error('Error updating productAttribute:', error);
        }
      );
    } else {
      this.productAttributesForm.markAllAsTouched();
    }
  }


  deleteProductAttributes(productAttributes: any) {
    const productAttributesReActive = {
      ids: [productAttributes._id],
      isDeleted: true
    };
    this.defaultLayoutService.productAttributesMultiActiveDeActive(productAttributesReActive).subscribe(
      (response) => {
        console.log('productAttributes deleted successfully:', response);
        this.toastr.success('ProductAttributes deleted successfully')
        this.getallProductAttributesList();
      },
      (error) => {
        console.error('Error deleting productAttributes:', error);
        this.toastr.error('Error deleting productAttributes')
      }
    );
  }

  reActiveProductAttributes(productAttributes: any) {
    const productAttributesReActive = {
      ids: [productAttributes._id],
      isDeleted: false
    };
    this.defaultLayoutService.productAttributesMultiActiveDeActive(productAttributesReActive).subscribe(
      (response) => {
        console.log('productAttributes active successfully:', response);
        this.toastr.success('ProductAttributes active successfully')
        this.getallProductAttributesList();
      },
      (error) => {
        console.error('Error active productAttributes:', error);
        this.toastr.error('Error active productAttributes')
      }
    );
  }

  deleteSelectedProductAttributes() {
    const selectedIds = this.allProductAttributesList
      .filter((productAttributes: any) => productAttributes.isChecked)
      .map((productAttributes: any) => productAttributes._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: 'true'
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.productAttributesMultiActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('productAttributes unpublished successfully:', response);
          this.toastr.success('ProductAttributes deleted successfully')
          this.getallProductAttributesList();
          this.selectAllChecked = false;
          this.allProductAttributesList.forEach((productAttributes: any) => {
            productAttributes.isChecked = false;
          });
          this.updateSelectAllproductAttributes();
          this.toggleSelectAll();
        },
        (error) => {
          console.error('Error unpublishing productAttributes:', error);
          this.toastr.error('Error deleting productAttributes')
        }
      );
    }
  }

  deactiveProductAttributes() {
    const productAttributesReActive = {
      ids: [this.productAttributeId],
      isDeleted: true
    };
    this.defaultLayoutService.productAttributesMultiActiveDeActive(productAttributesReActive).subscribe(
      (response) => {
        console.log('productAttributes deleted successfully:', response);
        this.toastr.success('ProductAttributes deleted successfully');
        this.editProductAttributes(this.productAttributeId);
        this.getallProductAttributesList();
      },
      (error) => {
        console.error('Error deleting productAttributes:', error);
        this.toastr.error('Error deleting productAttributes')
      }
    );
  }

  activeProductAttributes() {
    const productAttributesReActive = {
      ids: [this.productAttributeId],
      isDeleted: false
    };
    this.defaultLayoutService.productAttributesMultiActiveDeActive(productAttributesReActive).subscribe(
      (response) => {
        console.log('productAttributes active successfully:', response);
        this.toastr.success('ProductAttributes active successfully');
        this.editProductAttributes(this.productAttributeId);
        this.getallProductAttributesList();
      },
      (error) => {
        console.error('Error active productAttributes:', error);
        this.toastr.error('Error active productAttributes')
      }
    );
  }

  getallPredefinedProductAttributesList(): void {
    this.defaultLayoutService.getAllPredefinedProductAttributes({
      productAttributeId: this.productAttributeId,
      limit: this.predefinedPageSize,
      page: this.predefinedCurrentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allPredefinedProductAttributesList = Response.data.predefinedProductAttributes;
        this.totalPredefinedProductRecords = Response.data.totalRecords;  // Use API-provided totalRecords
        this.totalPredefinedProductPages = Response.data.totalPages;      // Use API-provided totalPages
        console.log(this.allPredefinedProductAttributesList);
      }
    });
  }

  createNewPredefinedProduct() {
    if (this.predefinedProductForm.valid) {
      const predefinedProductData = this.predefinedProductForm.value;
      const productAttributeId = this.productAttributeId;
      const requestData = { ...predefinedProductData, productAttributeId };
      console.log(requestData);
      this.defaultLayoutService.createNewPredefinedValues(requestData).subscribe(
        (response: any) => {
          this.visible = !this.visible;

          console.log('predefinedvalues saved successfully:', response);
          this.toastr.success('Predefinedvalues saved successfully')
          this.getallPredefinedProductAttributesList();
        },
        (error) => {
          console.error('Error saving predefinedvalues:', error);
          this.toastr.error(error?.error?.meta?.message)
        }
      );
    } else {
      this.predefinedProductForm.markAllAsTouched();
    }
  }

  deletepredefinedProductAttributes(predefinedProductAttributes: any) {
    const predefinedProductAttributesDeActive = {
      id: predefinedProductAttributes._id,
      isDeleted: true
    };
    this.defaultLayoutService.predefinedProductAttributeActiveDeActive(predefinedProductAttributesDeActive).subscribe(
      (response) => {
        console.log('predefined ProductAttributes deleted successfully:', response);
        this.toastr.success('predefined ProductAttributes deleted successfully')
        this.getallPredefinedProductAttributesList();
      },
      (error) => {
        console.error('Error deleting predefined ProductAttributes:', error);
        this.toastr.error('Error deleting predefined ProductAttributes')
      }
    );
  }

  reActivepredefinedProductAttributes(predefinedProductAttributes: any) {
    const predefinedProductAttributesReActive = {
      id: predefinedProductAttributes._id,
      isDeleted: false
    };
    this.defaultLayoutService.predefinedProductAttributeActiveDeActive(predefinedProductAttributesReActive).subscribe(
      (response) => {
        console.log('predefined ProductAttributes active successfully:', response);
        this.toastr.success('predefined ProductAttributes active successfully')
        this.getallPredefinedProductAttributesList();
      },
      (error) => {
        console.error('Error deleting predefined ProductAttributes:', error);
        this.toastr.error('Error active predefined ProductAttributes')
      }
    );
  }


  editPredefinedProductAttributes(id: any) {
    this.productAttrPreDefineValueModal = false;
    this.defaultpredefinedProductForm();
    this.predefinedProductId = id;
    this.isEditPredefinedProductAttribute = true;
    this.isShowSaveUpdateButton = true;

    this.defaultLayoutService.getPredefinedProductDetailsById(this.predefinedProductId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.predefinedProductForm.patchValue(response.data);
        } else {
          console.error('Failed to fetch predefined ProductAttributes details:', response.meta.message);
          this.toastr.error('Error to fetch details')
        }
      },
      (error: any) => {
        console.error('Error fetching predefined ProductAttributes details:', error);
        this.toastr.error('Error fetching details')
      }
    );
  }

  handleLiveChange(event: any) {
    this.visible = event;
  }

  updatePredefinedProduct(): void {
    if (this.predefinedProductForm.valid) {
      const updatedData = {
        predefinedProductAttributeName: this.predefinedProductForm.get('predefinedProductAttributeName')?.value,
        priceAdjustment: this.predefinedProductForm.get('priceAdjustment')?.value,
        priceAdjustmentUsePercentage: this.predefinedProductForm.get('priceAdjustmentUsePercentage')?.value,
        weightAdjustment: this.predefinedProductForm.get('weightAdjustment')?.value,
        cost: this.predefinedProductForm.get('cost')?.value,
        isPreSelected: this.predefinedProductForm.get('isPreSelected')?.value,
        order: this.predefinedProductForm.get('order')?.value,
        id: this.predefinedProductId,
        productAttributeId: this.productAttributeId
      };

      this.defaultLayoutService.updatePredefinedProductAttributesById(updatedData).subscribe(
        (response: any) => {
          console.log('predefinedProduct updated successfully:', response);
          this.toastr.success('PredefinedProduct updated successfully')
          this.visible = !this.visible;
          this.getallPredefinedProductAttributesList();
          this.isEditPredefinedProductAttribute = false;
          this.productAttrPreDefineValueModal = true;
        },
        (error: any) => {
          console.error('Error updating predefinedProduct:', error);
          this.toastr.error('Error updating predefinedProduct')

        }
      );
    } else {
      this.predefinedProductForm.markAllAsTouched();
    }
  }

}

