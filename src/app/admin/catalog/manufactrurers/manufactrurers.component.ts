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
  FormCheckComponent, FormCheckInputDirective,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manufactrurers',
  templateUrl: './manufactrurers.component.html',
  styleUrl: './manufactrurers.component.scss',
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
export class ManufactrurersComponent implements OnInit {
  allManufacturerList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  manufacturerForm!: FormGroup;
  isAddManufacturer: boolean = false;
  isEditManufacturer: boolean = false;
  collapses = [true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  publishes: any = [];
  manufacturerId: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  limit: number = 10;
  isShowButton: boolean = false
  manufacturers: any;
  manufacturerProduct: any;
  resource: any;
  selectedManufacturerImage: any;
  manufacturerImageFile: File | null = null;
  selectAllChecked: boolean = false;
  manufacturerName: string = '';
  manufacturerNameHeading: string = '';
  published: string = '';
  multimedia: any;
  productName: string = '';
  categoriesId: any = '';
  productType: string = '';
  // manufacturerId: any = '';
  selectedRelatedProductIds: string[] = [];
  public visible = false;
  totalProductListRecords: number = 0;
  currentProductListPage: number = 1;
  totalProductListPages: number = 1;
  pageProductListSize: number = 10;

  totalProductListByManufacturerRecords: number = 0;
  currentProductListByManufacturer: number = 1;
  totalProductListByManufacturer: number = 1;
  pageProductListByManufacturer: number = 10;
  selectedProductIds: string[] = [];
  manufacturerProductList: any = [];
  categoriesList: any;
  warehouses: any;
  productTagsList: any;
  manufacturersList: any;
  attributeValueList: any;
  manufacturerdata: any;
  manufacturerid: string = '';
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
  allProductList: any;
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
    if (currentUrl === '/admin/Manufacturer/Create') {
      this.isAddManufacturer = true;
      this.isEditManufacturer = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/Manufacturer/Edit/')) {
      const manufacturerId = this.route.snapshot.paramMap.get('id');
      if (manufacturerId) {
        this.editManufacturer(manufacturerId);
      }
      this.isAddManufacturer = true;
      this.isEditManufacturer = true;
    } else {
      this.isAddManufacturer = false;
      this.isEditManufacturer = false;
      this.router.navigate(['/admin/Manufacturer/List']);
    }
    let pagePermission = { menuName: "Manufacturers" }
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
    this.defaultManufacturerForm();
    this.getAllManufacturerList();
    this.getPageResourcesList();


    this.publishes = [
      { label: 'All', value: '' },
      { label: 'Published only', value: 'true' },
      { label: 'Unpublished only', value: 'false' },
    ];

    this.attributeValueList = [
      { label: 'Simple', value: 'Simple' },
    ]
  }

  defaultManufacturerForm() {
    this.manufacturerForm = this.fb.group({
      manufacturerName: ['', Validators.required],
      description: [''],
      published: [false],
      order: [0,Validators.required],
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


  addManufacturer() {
    this.selectedManufacturerImage = null;
    this.defaultManufacturerForm();
    this.isAddManufacturer = true;
    this.isEditManufacturer = false;
  }

  backToManufacturerList() {
    this.isEditManufacturer = false;
    this.isAddManufacturer = false;
    this.getAllManufacturerList();
    this.router.navigate(['/admin/Manufacturer/List']);

  }


  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setManufacturerId(id: string) {
    this.manufacturerId = id;
  }

  setManufacturer(manufacturers: any) {
    this.manufacturers = manufacturers;
  }

  setProduct(manufacturerProduct: any) {
    this.manufacturerProduct = manufacturerProduct;
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
    this.getAllManufacturerList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllManufacturerList();
  }

  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput.click();
  }


  onFileSelected(event: Event, inputId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (inputId === 'manufacturerImage') {
          this.selectedManufacturerImage = e.target?.result as string;
          this.manufacturerImageFile = file;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event, inputId: string): void {
    event.stopPropagation();
    if (inputId === 'manufacturerImage') {
      this.selectedManufacturerImage = null;
      this.manufacturerImageFile = null;
    }
  }

  toggleSelectAll() {
    this.allManufacturerList.forEach((manufacturers: any) => {
      manufacturers.isChecked = this.selectAllChecked;
    });
  }

  updateSelectAllManufacturer() {
    this.selectAllChecked = this.allManufacturerList.every((manufacturers: any) => manufacturers.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.allManufacturerList.some((manufacturers: any) => manufacturers.isChecked);
  }

  searchManufacturers(): void {
    this.getAllManufacturerList();
  }


  getAllManufacturerList(): void {
    this.loading = true;

    this.defaultLayoutService.getAllManufacturer({
      manufacturerName: this.manufacturerName,
      published: this.published,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allManufacturerList = Response.data.manufacturers;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
      }
      this.loading = false;

    });
  }


  editManufacturer(selectedManufacturerId: any) {
    this.defaultManufacturerForm();
    this.manufacturerId = selectedManufacturerId;
    this.isAddManufacturer = true;
    this.isEditManufacturer = true;

    this.defaultLayoutService.getManufacturerDetailsById(this.manufacturerId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {

          this.selectedManufacturerImage = response.data.manufacturerImage;
          this.manufacturerForm.patchValue(response.data);
          this.manufacturerdata = response.data;
          this.manufacturerNameHeading = response.data.manufacturerName;
          this.getAllProductListByManufacturer();
          this.getAllProductList();
          this.getAllActiveCategoryList();
          // this.getAllmanufacturersList();
          this.getAllProductTagList();
        } else {
          console.error('Failed to fetch manufacture details:', response.meta.message);
          this.toastr.error('Failed to fetch manufacture details')
        }
      },
      (error: any) => {
        console.error('Error fetching manufacture details:', error);
        this.toastr.error('Error fetching manufacture details')
      }
    );
  }


  createNewManufacturer(saveAndEdit: boolean) {
    if (this.manufacturerForm.valid) {
      const formData = new FormData();

      Object.entries(this.manufacturerForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      if (this.manufacturerImageFile) {
        formData.append('manufacturerImage', this.manufacturerImageFile, this.manufacturerImageFile.name);
      }

      this.defaultLayoutService.CreateNewManufacturer(formData).subscribe(
        (response: any) => {
          this.manufacturerId = response.data._id;
          console.log('Manufacturer saved successfully:', response);
          this.toastr.success('Manufacturer saved successfully');
          if (saveAndEdit) {
            this.isAddManufacturer = false;
            this.backToManufacturerList();
            this.getAllManufacturerList();
          }
          else { 
            this.router.navigate(['/admin/Manufacturer/Edit',this.manufacturerId]);
            // this.editManufacturer(this.manufacturerId)
           }
        },
        (error) => {
          console.error('Error saving Manufacturer:', error);
          this.toastr.error('Error saving manufacturer')
        }
      );
    } else {
      this.manufacturerForm.markAllAsTouched();
    }
  }

  updateManufacturer(saveAndEdit: boolean) {
    if (this.manufacturerForm.valid) {
      const formData = new FormData();

      Object.entries(this.manufacturerForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      if (this.manufacturerImageFile) {
        formData.append('manufacturerImage', this.manufacturerImageFile, this.manufacturerImageFile.name);
      } else if (this.selectedManufacturerImage) {
        formData.append('manufacturerImage', this.selectedManufacturerImage);
      } else {
        formData.append('manufacturerImage', 'null');
      }

      formData.append('id', this.manufacturerId);

      this.defaultLayoutService.updateManufacturerById(formData).subscribe(
        (response: any) => {
          console.log('Manufacturer updated successfully:', response);
          this.toastr.success('Manufacturer updated successfully');
          if (saveAndEdit) {
            this.isAddManufacturer = false;
            this.backToManufacturerList();
            this.getAllManufacturerList();
          }
          else { this.editManufacturer(this.manufacturerId) }
        },
        (error: any) => {
          console.error('Error updating Manufacturer:', error);
          this.toastr.error('Error updating Manufacturer')
        }
      );
    } else {
      this.manufacturerForm.markAllAsTouched();
    }
  }


  deactiveManufacturer() {
    const manufacturersReActive = {
      ids: [this.manufacturerId],
      isDeleted: true
    };
    this.defaultLayoutService.manufacturerMultiActiveDeActive(manufacturersReActive).subscribe(
      (response) => {
        console.log('manufacturers deleted successfully:', response);
        this.toastr.success('Manufacturers deleted successfully');
        this.editManufacturer(this.manufacturerId);
        this.getAllManufacturerList();
      },
      (error) => {
        console.error('Error deleting manufacturers:', error);
        this.toastr.error('Error deleting manufacturers')
      }
    );
  }

  activeManufacturer() {
    const manufacturersReActive = {
      ids: [this.manufacturerId],
      isDeleted: false
    };
    this.defaultLayoutService.manufacturerMultiActiveDeActive(manufacturersReActive).subscribe(
      (response) => {
        console.log('manufacturers active successfully:', response);
        this.toastr.success('Manufacturers active successfully');
        this.editManufacturer(this.manufacturerId);
        this.getAllManufacturerList();
      },
      (error) => {
        console.error('Error active manufacturers:', error);
        this.toastr.error('Error active manufacturers')
      }
    );
  }


  deleteManufacturer(manufacturers: any) {
    const manufacturersReActive = {
      ids: [manufacturers._id],
      isDeleted: true
    };
    this.defaultLayoutService.manufacturerMultiActiveDeActive(manufacturersReActive).subscribe(
      (response) => {
        console.log('manufacturers deleted successfully:', response);
        this.toastr.success('Manufacturers deleted successfully')
        this.getAllManufacturerList();
      },
      (error) => {
        console.error('Error deleting manufacturers:', error);
        this.toastr.error('Error deleting manufacturers')
      }
    );
  }

  reActiveManufacturer(manufacturers: any) {
    const manufacturersReActive = {
      ids: [manufacturers._id],
      isDeleted: false
    };
    this.defaultLayoutService.manufacturerMultiActiveDeActive(manufacturersReActive).subscribe(
      (response) => {
        console.log('manufacturers active successfully:', response);
        this.toastr.success('Manufacturers active successfully')
        this.getAllManufacturerList();
      },
      (error) => {
        console.error('Error active manufacturers:', error);
        this.toastr.error('Error active manufacturers')
      }
    );
  }



  deleteSelectedManufacturer() {
    const selectedIds = this.allManufacturerList
      .filter((manufacturers: any) => manufacturers.isChecked)
      .map((manufacturers: any) => manufacturers._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: 'true'
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.manufacturerMultiActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('manufacturers unpublished successfully:', response);
          this.toastr.success('Manufacturers deleted successfully')
          this.getAllManufacturerList();

          this.selectAllChecked = false;
          this.allManufacturerList.forEach((manufacturers: any) => {
            manufacturers.isChecked = false;
          });
          this.updateSelectAllManufacturer();
          this.toggleSelectAll();
        },
        (error) => {
          console.error('Error unpublishing manufacturers:', error);
          this.toastr.error('Error deleting manufacturers')
        }
      );
    }
  }


  toggleSelectAllProduct(): void {
    this.selectedProductIds = [];
    this.allProductList.forEach((product: any) => {
      product.isChecked = this.selectAllChecked;
      if (this.selectAllChecked) {
        this.selectedProductIds.push(product._id);
      }
    });
  }


  addProduct(): void {
    const productObj = {
      manufacturerId: this.manufacturerId,
      productIds: this.selectedProductIds // Pass the selected product IDs
    };
    this.defaultLayoutService.assignProductByManufacturer(productObj).subscribe(
      (response) => {
        console.log('Product saved successfully:', response);
        this.toastr.success('Product saved successfully')
        this.visible = !this.visible;
        this.getAllProductListByManufacturer();
        this.getAllProductList();
      },
      (error) => {
        console.error('Error saving product:', error);
        this.toastr.error('Error saving product')

      }
    );
  }

  updateSelectedProducts(product: any): void {
    if (product.isChecked) {
      this.selectedProductIds.push(product._id); // Add product ID to the array
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== product._id); // Remove product ID from the array
    }

    this.selectAllChecked = this.allProductList.every((prod: any) => prod.isChecked);

  }


  //product list pagination
  getProductListPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentProductListPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentProductListPage - halfRange);
    const endPage = Math.min(this.totalProductListPages - 1, this.currentProductListPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentProductListPage < this.totalProductListPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalProductListPages > 1) {
      pagination.push(this.totalProductListPages);
    }

    return pagination;
  }

  changeProductListPage(page: number | string): void {
    if (page === "..." || page === this.currentProductListPage) {
      return;
    }
    this.currentProductListPage = page as number;
    this.getAllProductList();
  }

  updateProductListPageSize(): void {
    this.currentProductListPage = 1;
    this.getAllProductList();
  }


  getAllProductList(): void {
    const payload: any = {
      productName: this.productName,
      categoryId: this.categoriesId,
      productType: this.productType,
      manufacturerId: this.manufacturerid,
      limit: this.pageProductListSize,
      page: this.currentProductListPage
    };

    // Clean the payload to remove empty or null fields
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    // Call the API
    this.defaultLayoutService.getAllproduct(payload).subscribe((Response: any) => {
      if (Response.meta.code === 200) {
        this.allProductList = Response.data.products;
        this.totalProductListRecords = Response.data.totalRecords;
        this.totalProductListPages = Response.data.totalPages;
      }
    });
  }


  getAllProductListByManufacturer(): void {
    this.defaultLayoutService.productListByManufacturerId({
      manufacturerId: this.manufacturerId,
      limit: this.pageProductListByManufacturer,
      page: this.currentProductListByManufacturer
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.manufacturerProductList = Response.data.products;
        this.totalProductListByManufacturerRecords = Response.data.totalRecords;
        this.totalProductListByManufacturer = Response.data.totalPages;
      }
    });
  }

  setmanufactureProduct(manufacturerProduct: any) {
    this.manufacturerProduct = manufacturerProduct;
  }


  updateProductManufacture(manufacturerIndex: number): void {
    const multimedia = this.manufacturerProductList[manufacturerIndex];

 
    const multimediaObj = {
      id: multimedia._id,
      order: multimedia.order,
    };

    this.defaultLayoutService.updateassignProductByManufacturer(multimediaObj).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.editMode[manufacturerIndex] = false; // Disable edit mode only for the selected item
          this.getAllProductListByManufacturer(); // Refresh the list
          this.toastr.success('Manufacturers product updated successfully');
        } else {
          console.error('Error updating Manufacturers product:', response);
          this.toastr.error('Error updating Manufacturers product');
        }
      },
      (error) => {
        console.error('Error calling update API:', error);
        this.toastr.error('Error updating Manufacturers product');
      }
    );
  }




  getAllActiveCategoryList(): void {
    this.defaultLayoutService.getAllActiveCategory(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.categoriesList = Response.data;
      }
    });
  }

  getAllmanufacturersList(): void {
    this.defaultLayoutService.getAllActiveManufacturer(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.manufacturersList = Response.data;
      }
    });
  }

  getAllProductTagList(): void {
    this.defaultLayoutService.getAllproductTag(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.productTagsList = Response.data.productTags;
      }
    });
  }

  getAllWarehouseList(): void {
    this.defaultLayoutService.getAllWarehouse(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.warehouses = Response.data.Warehouses;
      }
    });
  }

  handleLiveChange(event: any) {
    this.visible = event;
  }

  addProductmodal() {
    this.productName='';
    this.categoriesId='';
    this.productType='';
    this.manufacturerid='';
    this.updateProductListPageSize();
    this.getAllmanufacturersList();
  }

  //product list by category pagination
  getProductListManufacturePagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentProductListByManufacturer > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentProductListByManufacturer - halfRange);
    const endPage = Math.min(this.totalProductListByManufacturer - 1, this.currentProductListByManufacturer + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentProductListByManufacturer < this.totalProductListByManufacturer - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalProductListByManufacturer > 1) {
      pagination.push(this.totalProductListByManufacturer);
    }

    return pagination;
  }

  changeProductListManufacturePage(page: number | string): void {
    if (page === "..." || page === this.currentProductListByManufacturer) {
      return;
    }
    this.currentProductListByManufacturer = page as number;
    this.getAllProductListByManufacturer();
  }

  updateProductListManufacturePageSize(): void {
    this.currentProductListByManufacturer = 1;
    this.getAllProductListByManufacturer();
  }


  deleteProduct(manufacturerProduct: any) {
    const manufacturerProductDeActive = {
      id: manufacturerProduct._id,
      isDeleted: true
    };
    this.defaultLayoutService.manufacturerProductActiveDeActive(manufacturerProductDeActive).subscribe(
      (response: any) => {
        console.log('manufacturer product deleted successfully:', response);
        this.toastr.success('manufacturer product deleted successfully')
        this.getAllProductListByManufacturer();
      },
      (error: any) => {
        console.error('Error deleting manufacturer product :', error);
        this.toastr.error('Error deleting manufacturer product')
      }
    );
  }

  reActiveProductManufacture(manufacturerProduct: any) {
    const manufacturerProductReActive = {
      id: manufacturerProduct._id,
      isDeleted: false
    };
    this.defaultLayoutService.manufacturerProductActiveDeActive(manufacturerProductReActive).subscribe(
      (response: any) => {
        console.log('manufacturer product active successfully:', response);
        this.toastr.success('manufacturer product active successfully')
        this.getAllProductListByManufacturer();
      },
      (error: any) => {
        console.error('Error active manufacturer product:', error);
        this.toastr.error('Error active manufacturer product')
      }
    );
  }
}