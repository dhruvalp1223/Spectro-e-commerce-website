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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
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
export class CategoriesComponent implements OnInit {

  allCategoryList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  categoriesForm!: FormGroup;
  isAddCategories: boolean = false;
  isEditCategories: boolean = false;
  collapses = [true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  categoryId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  totalProductListRecords: number = 0;
  currentProductListPage: number = 1;
  totalProductListPages: number = 1;
  pageProductListSize: number = 10;

  totalProductListByCategoryRecords: number = 0;
  currentProductListByCategoryPage: number = 1;
  totalProductListByCategoryPages: number = 1;
  pageProductListByCategorySize: number = 10;

  // limit: number = ;
  isShowButton: boolean = false
  categories: any;
  categoryProduct: any
  categoryProducts: any
  publishes: any = [];
  productName: string = '';
  categoriesId: any = '';
  productType: string = '';
  manufacturerId: any = '';
  resource: any;
  selectedCategoryImage: any;
  categoryImageFile: File | null = null;
  selectAllChecked: boolean = false;
  ParentCategoryList: any = [];
  categoryName: string = '';
  published: string = '';
  allProductList: any = [];
  selectedProductIds: string[] = [];
  categoryProductList: any = [];
  multimedia: any;
  categoryNameHeading: string = '';
  categoriesList: any;
  warehouses: any;
  productTagsList: any;
  manufacturersList: any;
  attributeValueList: any;
  public visible = false;
  catagoryData: any;
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
    if (currentUrl === '/admin/Category/Create') {
      this.isAddCategories = true;
      this.isEditCategories = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/Category/Edit/')) {
      const categoryId = this.route.snapshot.paramMap.get('id');
      if (categoryId) {
        this.editCategory(categoryId);
      }
      this.isAddCategories = true;
      this.isEditCategories = true;
    } else {
      this.isAddCategories = false;
      this.isEditCategories = false;
      this.router.navigate(['/admin/Category/List']);
    }
    let pagePermission = { menuName: "Categories" }
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
    this.defaultCategoryForm();
    this.getAllCategoryList();
    this.getPageResourcesList();
    this.getAllParentCategoryList();

    this.publishes = [
      { label: 'All', value: '' },
      { label: 'Published only', value: 'true' },
      { label: 'Unpublished only', value: 'false' },
    ];

    this.attributeValueList = [
      { label: 'Simple', value: 'Simple' },
    ]
  }

  defaultCategoryForm() {
    this.categoriesForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: [''],
      parentCategory: [],
      published: [true],
      showOnHomePage: [false],
      includeInTopMenu: [true],
      order: [0, Validators.required],
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


  addCategory() {
    this.isAddCategories = true;
    this.defaultCategoryForm();
    this.selectedCategoryImage = null;
    this.isEditCategories = false;
  }

  backToCategoryList() {
    this.isEditCategories = false;
    this.isAddCategories = false;
    this.getAllCategoryList();
    this.router.navigate(['/admin/Category/List']);

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

  setcategoryId(id: string) {
    this.categoryId = id;
  }

  setCategory(categories: any) {
    this.categories = categories;
  }

  setProduct(categoryProduct: any) {
    this.categoryProduct = categoryProduct;
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
    this.getAllCategoryList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllCategoryList();
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
        if (inputId === 'categoryImage') {
          this.selectedCategoryImage = e.target?.result as string;
          this.categoryImageFile = file;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event, inputId: string): void {
    event.stopPropagation();
    if (inputId === 'categoryImage') {
      this.selectedCategoryImage = null;
      this.categoryImageFile = null;
      this.categoriesForm.patchValue({ categoryImage: null });

    }
  }

  toggleSelectAll() {
    this.allCategoryList.forEach((categories: any) => {
      categories.isChecked = this.selectAllChecked;
    });
  }

  updateSelectAllCategory() {
    this.selectAllChecked = this.allCategoryList.every((categories: any) => categories.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.allCategoryList.some((categories: any) => categories.isChecked);
  }

  getAllParentCategoryList(): void {
    this.defaultLayoutService.getAllActiveCategory(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.ParentCategoryList = Response.data;
      }
    });
  }


  getAllCategoryList(): void {
    this.loading = true;

    this.defaultLayoutService.getAllCategory({
      categoryName: this.categoryName,
      published: this.published,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCategoryList = Response.data.categories;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
      }
      this.loading = false;

    });
  }

  editCategory(selectedCategoryId: any) {
    this.defaultCategoryForm();
    this.categoryId = selectedCategoryId;
    this.isAddCategories = true;
    this.isEditCategories = true;
    this.defaultLayoutService.getCategoryDetailsById(this.categoryId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.selectedCategoryImage = response.data.categoryImage;

          this.selectedCategoryImage = response.data.categoryImage;

          this.catagoryData = response.data;
          this.categoriesForm.patchValue(response.data);
          this.categoryNameHeading = response.data.categoryName;

          this.getAllProductListByCategory();
          this.getAllProductList();
          this.getAllActiveCategoryList();
          this.getAllmanufacturersList();
          this.getAllProductTagList();
        } else {
          console.error('Failed to fetch category details:', response.meta.message);
          this.toastr.error('Failed to fetch category details')
        }
      },
      (error: any) => {
        console.error('Error fetching category details:', error);
        this.toastr.error('Error fetching category details')
      }
    );
  }


  createNewCategory(saveAndEdit: boolean) {
    if (this.categoriesForm.valid) {
      const formData = new FormData();

      Object.entries(this.categoriesForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      if (this.categoryImageFile) {
        formData.append('categoryImage', this.categoryImageFile, this.categoryImageFile.name);
      }

      this.defaultLayoutService.CreateNewCategory(formData).subscribe(
        (response: any) => {
          this.categoryId = response.data._id;
          console.log('category saved successfully:', response);
          this.toastr.success('Category saved successfully');
          if (saveAndEdit) {
            this.backToCategoryList();
            this.getAllCategoryList();
          }
          else {
            this.router.navigate(['/admin/Category/Edit',this.categoryId]);
            //  this.editCategory(this.categoryId)
             }
        },
        (error) => {
          console.error('Error saving category:', error);
          this.toastr.error('Error saving category')
        }
      );
    } else {
      this.categoriesForm.markAllAsTouched();
    }
  }

  updatecategory(saveAndEdit: boolean) {
    if (this.categoriesForm.valid) {
      const formData = new FormData();

      Object.entries(this.categoriesForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        } else {
          formData.append(key, ''); // Send empty string to represent null values
        }
      });

      if (this.categoryImageFile) {
        formData.append('categoryImage', this.categoryImageFile, this.categoryImageFile.name);
      } else if (this.selectedCategoryImage) {
        formData.append('categoryImage', this.selectedCategoryImage);
      } else {
        formData.append('categoryImage', 'null');
      }

      formData.append('id', this.categoryId);

      this.defaultLayoutService.updateCategoryById(formData).subscribe(
        (response: any) => {
          console.log('category updated successfully:', response);
          this.toastr.success('Category updated successfully');
          if (saveAndEdit) {
            this.isAddCategories = false;
            this.backToCategoryList();
            this.getAllCategoryList();
          }
          else { this.editCategory(this.categoryId) }
        },
        (error: any) => {
          console.error('Error updating Category:', error);
          this.toastr.error('Error updating category')
        }
      );
    } else {
      this.categoriesForm.markAllAsTouched();
    }
  }

  deactiveCategory() {
    const categoriesReActive = {
      ids: [this.categoryId],
      isDeleted: true
    };
    this.defaultLayoutService.categoryMultiActiveDeActive(categoriesReActive).subscribe(
      (response) => {
        console.log('category deleted successfully:', response);
        this.toastr.success('Category deleted successfully');
        this.editCategory(this.categoryId);

        this.selectAllChecked = false;
        this.getAllCategoryList();

      },
      (error) => {
        console.error('Error deleting category:', error);
        this.toastr.error('Error deleting category')

      }
    );
  }

  activeCategory() {
    const categoriesReActive = {
      ids: [this.categoryId],
      isDeleted: false
    };
    this.defaultLayoutService.categoryMultiActiveDeActive(categoriesReActive).subscribe(
      (response) => {
        console.log('categories active successfully:', response);
        this.toastr.success('category active successfully');
        this.editCategory(this.categoryId);
        this.getAllCategoryList();
      },
      (error) => {
        console.error('Error active categories:', error);
        this.toastr.error('Error active category')
      }
    );
  }

  deleteCategory(categories: any) {
    const categoriesReActive = {
      ids: [categories._id],
      isDeleted: true
    };
    this.defaultLayoutService.categoryMultiActiveDeActive(categoriesReActive).subscribe(
      (response) => {
        console.log('category deleted successfully:', response);
        this.toastr.success('Category deleted successfully')
        this.selectAllChecked = false;
        this.getAllCategoryList();

      },
      (error) => {
        console.error('Error deleting category:', error);
        this.toastr.error('Error deleting category')

      }
    );
  }

  reActiveCategory(categories: any) {
    const categoriesReActive = {
      ids: [categories._id],
      isDeleted: false
    };
    this.defaultLayoutService.categoryMultiActiveDeActive(categoriesReActive).subscribe(
      (response) => {
        console.log('categories active successfully:', response);
        this.toastr.success('category active successfully')
        this.getAllCategoryList();
      },
      (error) => {
        console.error('Error active categories:', error);
        this.toastr.error(error?.error?.meta?.errorDetails)
      }
    );
  }


  deleteSelectedCategory() {
    const selectedIds = this.allCategoryList
      .filter((categories: any) => categories.isChecked)
      .map((categories: any) => categories._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: 'true'
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.categoryMultiActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('categories unpublished successfully:', response);
          this.toastr.success('Category deleted successfully');

          // Update the category list
          this.getAllCategoryList();

          // Reset the "Select All" checkbox to unchecked
          this.selectAllChecked = false;

          // Reset individual checkbox states
          this.allCategoryList.forEach((category: any) => {
            category.isChecked = false;
          });

          this.updateSelectAllCategory();
          this.toggleSelectAll();
        },
        (error) => {
          console.error('Error unpublishing categories:', error);
          this.toastr.error('Error deleting category');
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

  
    updateSelectedProducts(product: any): void {
      if (product.isChecked) {
        this.selectedProductIds.push(product._id); // Add product ID to the array
      } else {
        this.selectedProductIds = this.selectedProductIds.filter(id => id !== product._id); // Remove product ID from the array
      }

    this.selectAllChecked = this.allProductList.every((prod: any) => prod.isChecked);

    }

  addProduct(): void {
    const productObj = {
      categoryId: this.categoryId,
      productIds: this.selectedProductIds // Pass the selected product IDs
    };
    this.defaultLayoutService.assignProductByCategory(productObj).subscribe(
      (response) => {
        console.log('Product saved successfully:', response);
        this.toastr.success('Product saved successfully')
        this.visible = !this.visible;
        this.getAllProductListByCategory();
        this.getAllProductList();
      },
      (error) => {
        console.error('Error saving product:', error);
        this.toastr.error('Error saving product')

      }
    );
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
      manufacturerId: this.manufacturerId,
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


  getAllProductListByCategory(): void {
    this.defaultLayoutService.productListByCategory({
      categoryId: this.categoryId,
      limit: this.pageProductListByCategorySize,
      page: this.currentProductListByCategoryPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.categoryProductList = Response.data.products;
        this.totalProductListByCategoryRecords = Response.data.totalRecords;
        this.totalProductListByCategoryPages = Response.data.totalPages;
      }
    });
  }

  setCategoryProduct(categoryProduct: any) {
    this.categoryProduct = categoryProduct;
  }


  updateCategoryProduct(categoryIndex: number): void {
    const categoryProduct = this.categoryProductList[categoryIndex];

    if (!categoryProduct || !categoryProduct.order) {
        this.toastr.error('Invalid category product data');
        return;
    }

    const categoryProductObj = {
        id: categoryProduct._id,
        order: categoryProduct.order,
    };

    this.defaultLayoutService.updateassignProductByCategory(categoryProductObj).subscribe(
        (response: any) => {
            if (response.meta.code === 200) {
                this.editMode[categoryIndex] = false;
                this.getAllProductListByCategory();
                this.toastr.success('Category product updated successfully');
            } else {
                console.error('Error updating category product:', response);
                this.toastr.error('Error updating category product');
            }
        },
        (error) => {
            console.error('Error calling category product API:', error);
            this.toastr.error('Error updating category product');
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
    this.manufacturerId='';
    this.updateProductListPageSize();
  }

  //product list by category pagination
  getProductListCategoryPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentProductListByCategoryPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentProductListByCategoryPage - halfRange);
    const endPage = Math.min(this.totalProductListByCategoryPages - 1, this.currentProductListByCategoryPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentProductListByCategoryPage < this.totalProductListByCategoryPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalProductListByCategoryPages > 1) {
      pagination.push(this.totalProductListByCategoryPages);
    }

    return pagination;
  }

  changeProductListCategoryPage(page: number | string): void {
    if (page === "..." || page === this.currentProductListByCategoryPage) {
      return;
    }
    this.currentProductListByCategoryPage = page as number;
    this.getAllProductListByCategory();
  }

  updateProductListCategoryPageSize(): void {
    this.currentProductListByCategoryPage = 1;
    this.getAllProductListByCategory();
  }

  // deleteProduct(categoryProduct: any) {
  //   const categoryProductRemove = {
  //     productId: categoryProduct._id,
  //     categoryId: this.categoryId
  //   };
  //   this.defaultLayoutService.removeAssignCategoryToProduct(categoryProductRemove).subscribe(
  //     (response) => {
  //       this.toastr.success('product remove successfully')
  //       this.getAllProductListByCategory();

  //     },
  //     (error) => {
  //       console.error('Error deleting category:', error);
  //       this.toastr.error('Error deleting product')

  //     }
  //   );
  // }

  deleteProduct(categoryProduct: any) {
    console.log(categoryProduct)
    const categoryProductDeActive = {
      id: categoryProduct._id,
      isDeleted: true
    };
    this.defaultLayoutService.categoryProductActiveDeActive(categoryProductDeActive).subscribe(
      (response: any) => {
        console.log('category product deleted successfully:', response);
        this.toastr.success('category product deleted successfully')
        this.getAllProductListByCategory();
      },
      (error: any) => {
        console.error('Error deleting category product:', error);
        this.toastr.error('Error deleting category product')
      }
    );
  }

  reActiveProductCategory(categoryProduct: any) {
    const categoryProductReActive = {
      id: categoryProduct._id,
      isDeleted: false
    };
    this.defaultLayoutService.categoryProductActiveDeActive(categoryProductReActive).subscribe(
      (response: any) => {
        console.log('category product active successfully:', response);
        this.toastr.success('category product active successfully')
        this.getAllProductListByCategory();
      },
      (error: any) => {
        console.error('Error active category product:', error);
        this.toastr.error('Error active category product')
      }
    );
  }
}
