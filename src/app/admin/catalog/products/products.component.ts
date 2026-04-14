import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import {
  AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
  ModalBodyComponent,
  FormCheckComponent, FormCheckInputDirective,
  RoundedDirective,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,

} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: true,
  animations: [
    trigger('collapse', [
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('open <=> closed', [animate('300ms ease-in-out')])
    ])
  ],
  imports: [
    RouterModule,
    AngularEditorModule,
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
    RoundedDirective,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    EditorModule // Import TinyMCE editor module

  ]
})
export class ProductsComponent implements OnInit {
  selectedValues: string[] = []; // Array to store selected IDs
  selectedControlType: string = ''; // Add this property
  loading: boolean = false; 

  allProductList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  editVideoMode: boolean[] = [];
  editWarehouseMode: boolean[] = [];
  resourceForm!: FormGroup;
  isAddProductList: boolean = false;
  productForm!: FormGroup;
  specificationAttributesForm!: FormGroup;
  valueForm!: FormGroup;
  productAttributesForm!: FormGroup;
  pictureForm!: FormGroup;
  videoForm!: FormGroup;
  isAddProduct: boolean = false;
  isEditProduct: boolean = false;
  isEditSpecificationAttributes: boolean = false;
  isEditproductAttributes: boolean = false;
  isAddNewSpecificationAttributes: boolean = false;
  isAddNewProductAttributes: boolean = false;
  collapses = [true, true, true, true, true, true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  productId: any;
  productIds: any;
  productData: any; // Store the product data here
  productAttributeList: any;
  productAttributeId: any;
  productValueId: any;
  specificationAttributeId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  Math = Math;

  currentProductAttributePage: number = 1;
  pageProductAttributeSize: number = 10;
  totalSpecificationAttributeRecords: number = 0;
  totalSpecificationAttributePages: number = 1;

  currentSpecificationAttributesPage: number = 1;
  pageSpecificationAttributesSize: number = 10;
  totalProductAttributeRecords: number = 0;
  totalProductAttributePages: number = 1;

  currentRelatedProductsPage: number = 1;
  pageRelatedProductsSize: number = 10;
  totalRelatedProductsRecords: number = 0;
  totalRelatedProductsPages: number = 1;

  currentMultimediaImagePage: number = 1;
  pageMultimediaImageSize: number = 10;
  totalMultimediaImageRecords: number = 0;
  totalMultimediaImagePages: number = 1;

  currentValuesPage: number = 1;
  pageValuesSize: number = 10;
  totalValuesRecords: number = 0;
  totalValuesPages: number = 1;

  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  currentMultimediaVideoPage: number = 1;
  pageMultimediaVideoSize: number = 10;
  totalMultimediaVideoRecords: number = 0;
  totalMultimediaVideoPages: number = 1;

  isShowButton: boolean = false
  categories: any;
  publishes: any = [];

  resource: any;
  selectedmultimediaImage: any;
  multimediaImageFile: File | null = null;
  selectAllChecked: boolean = false;
  ParentCategoryList: any = [];
  productName: string = '';
  published: string = '';
  categoriesId: any = '';
  productType: string = '';
  manufacturerId: any = '';
  warehouseId: any = '';
  categoriesList: any = [];
  manufacturersList: any = [];
  productTagsList: any = [];
  productTypeList: any = [];
  specificationAttributesList: any = [];
  relatedProductList: any = [];
  allSpecificationGroupList: any = [];
  productValueList: any = [];
  productValueByValueList: any = [];
  multimediaList: any = [];
  productAttributeMappingsList: any = [];
  productTemplateList: any = [];
  unitofProducts: any = [];
  discounts: any = [];
  deliveryDates: any = [];
  inventoryMethods: any = [];
  warehouses: any = [];
  warehousesList: any = [];
  lowStockActivities: any = [];
  backOrders: any = [];
  productAvailabilityRanges: any = [];
  attributeTypesList: any = [];
  allProductAttribute: any = [];
  attributesList: any = [];
  allSpecificationAttributesList: any = [];
  specificationOptionList: any = [];
  controlTypeList: any = [];
  showDisplayOrder = false;
  showMarkAsNewFields = false;
  showPreOrderFields = false;
  showCustomerEnterPriceFields = false;
  showBasePriceEnabledFields = false;
  showTaxExemptFields = false;
  showShippingEnabledFields = false;
  showEnabledConditionFields = false;
  showMultipleWarehousesFields = false;
  showDisplayAvailabilityFields = false;
  products: any;
  productsId: any;
  specificationAttributes: any;
  public visible = false;
  public relatedProductvisible = false;
  isEditvalue: boolean = false;
  values: any;
  multimedia: any;
  multimediaVideo: any;
  relatedProduct: any;
  productAttribute: any;
  attributeValueList: any = [];
  panes: any = [];
  productMultimediaVideoList: any = [];
  activeTabIndex = 0;
  customerRoleList: any = [];
  selectedImageIds: string[] = [];
  selectedRadioValue: string = ''; // Store the selected radio button value
  productValueByAttributeId: any = '';
  selectedRelatedProductIds: string[] = [];
  productIdParams: any;
  productAttributeIdParam: any;
  specificationtAttributeIdParam: any;
  productNameHeader: string = '';
  specificationAttributesProductData: any;
  productAttributesProductData: any;
  ActiveProductValueList:any;
  ActiveAttributesListByProductId:any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    sanitize: false,
    toolbarHiddenButtons: [
      [
        // 'fontName',
        // 'bold',
        // 'italic',
        'strikeThrough',
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
      ],
      [
        // 'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        // 'insertImage',
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
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/Product/Create') {
      this.addProduct();
      
    }
    else if (currentUrl.startsWith('/admin/Product/Edit')) {
      this.route.paramMap.subscribe(params => {
        this.productIdParams = params.get('id'); // Get updated ID

        if (this.productIdParams) {
          this.editProduct(this.productIdParams);

        }
        this.getAttributesByProductId();

      });

    }
    else if (currentUrl.startsWith('/admin/Product/ProductAttributeMappingCreate')) {
      this.route.queryParams.subscribe(params => {
        this.productIdParams = params['productId'];
      });
      if (this.productIdParams) {
        // this.defaultProductAttributesForm();
        this.isAddProductList = true;
        this.isAddProduct = false;
        this.isEditProduct = false;
        this.isAddNewSpecificationAttributes = false;
        this.isAddNewProductAttributes = true;
        this.isEditproductAttributes = false;
        this.getAllAttributesList();
        this.getAllProductAttribute();
      }
    }
    else if (currentUrl.startsWith('/admin/Product/ProductAttributeMappingEdit')) {
      this.route.queryParams.subscribe(params => {
        this.productIdParams = params['productId'];
        this.productAttributeIdParam = params['productAttributeid'];
      });
      if (this.productAttributeIdParam) {
        this.getAllAttributesList();
        // this.defaultProductForm();
        this.editProductAttributes(this.productAttributeIdParam)
        this.isAddProductList = true;
        this.isAddProduct = false;
        this.isEditProduct = false;
        this.isAddNewSpecificationAttributes = false;
        this.isAddNewProductAttributes = true;
        this.isEditproductAttributes = true;
        this.getAllProductAttribute();

      }
    }
    else if (currentUrl.startsWith('/admin/Product/ProductSpecAttributeAdd')) {
      this.route.queryParams.subscribe(params => {
        this.productIdParams = params['productId'];
      });
      if (this.productIdParams) {
        this.getallSpecificationGroupList();
        this.getAttributesByProductId();

        // this.getAllSpecificationAttributes();
        // this.defaultProductForm();
        // this.addAttributes();
        this.isEditSpecificationAttributes = false;
        // this.specificationAttributesForm.reset();
        this.isAddProductList = true;
        this.isAddProduct = false;
        this.isEditProduct = false;
        this.isAddNewProductAttributes = false;
        this.isAddNewProductAttributes = false;
        this.isAddNewSpecificationAttributes = true;
      }
    }
    else if (currentUrl.startsWith('/admin/Product/ProductSpecAttributeEdit')) {
      this.route.queryParams.subscribe(params => {
        this.productIdParams = params['productId'];
        this.specificationtAttributeIdParam = params['SpecificationAttributeId'];
      });
      if (this.specificationtAttributeIdParam) {
        // this.getAllSpecificationAttributes();
        this.getAttributesByProductId();
        this.getallSpecificationGroupList();
        // this.defaultProductForm();
        this.editSpecificationAttributes(this.specificationtAttributeIdParam)
      }
    }
    else {
      this.isAddProductList = false;
      this.router.navigate(['/admin/Product/List']);
    }
    this.productId = this.route.snapshot.paramMap.get('id');
    let pagePermission = { menuName: "Products" }
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
    this.getAllCategoryList();
    this.getAllmanufacturersList();
    this.getAllProductTagList();
    this.getAllActiveWarehouseList();
    this.defaultProductForm();
    this.getAllProductList();
    this.getAllCustomerRoleList();
    this.getPageResourcesList();
    this.defaultSpecificationAttributesForm();
    this.defaultProductAttributesForm();
    this.defaultProductValueForm();
    this.defaultPictureForm();
    this.defaultVideoForm();
    this.getAllWarehouseList();
    this.productTypeList = [
      { label: 'Simple', value: '' },
    ];
    this.productTemplateList = [
      { label: 'Simple product', value: '' },
    ];
    this.unitofProducts = [
      { label: 'ounce(s)', value: '' },
      { label: 'lb(s)', value: '' },
      { label: 'kg(s)', value: '' },
      { label: 'gram(s)', value: '' },
    ];
    this.discounts = [
      { label: 'Sample discount with coupon code ', _id: '123' },
    ];
    this.deliveryDates = [
      { label: 'None', value: '' },
      { label: '1-2 days', value: '' },
      { label: '3-5 days', value: '' },
      { label: '1 week', value: '' },
    ];
    this.inventoryMethods = [
      { label: 'Do not track inventory', value: 'Do not track inventory' },
      { label: 'Track inventory', value: 'Track inventory' },
      { label: 'Track inventory by product attributes', value: 'Track inventory by product attributes' },
    ];
    this.attributeTypesList = [
      { label: 'Option', value: 'Option' },
      { label: 'Custom text', value: 'Custom text' },
      { label: 'Custom HTML text', value: 'Custom HTML text' },
      { label: 'Hyperlink', value: 'Hyperlink' },
    ]
    this.controlTypeList = [
      { label: 'Drop-down list', value: 'Drop-down list' },
      { label: 'Radio button list', value: 'Radio button list' },
      { label: 'Checkboxes', value: 'Checkboxes' },
      { label: 'Textbox', value: 'Textbox' },
      { label: 'Multiline textbox', value: 'Multiline textbox' },
      { label: 'Date picker', value: 'Date picker' },
      { label: 'File upload', value: 'File upload' },
      { label: 'Color squares', value: 'Color squares' },
      { label: 'Image squares', value: 'Image squares' },
      { label: 'Read-only checkboxes', value: 'Read-only checkboxes' },
    ]
    this.attributeValueList = [
      { label: 'Simple', value: 'Simple' },
    ]
    this.lowStockActivities = [
      { label: 'Nothing', value: 'Nothing' },
      { label: 'Disable buy button', value: 'Disable buy button' },
      { label: 'Unpublish', value: 'Unpublish' },
    ]
    this.backOrders = [
      { label: 'No backorders', value: 'No backorders' },
      { label: 'Allow qty below 0', value: 'Allow qty below 0' },
      { label: 'Allow qty below 0 and notify customer', value: 'Allow qty below 0 and notify customer' },
    ]
    this.productAvailabilityRanges = [
      { label: 'None', value: '' },
      { label: '2-4 days', value: '2-4 days' },
      { label: '7-10 days', value: '7-10 days' },
      { label: '2 weeks', value: '2 weeks' },
    ]
    this.panes = [
      { name: 'Pictures', id: 'tab-01' },
      { name: 'Videos', id: 'tab-02', },
    ];
    this.publishes = [
      { label: 'All', value: '' },
      { label: 'Published only', value: 'true' },
      { label: 'Unpublished only', value: 'false' },
    ];


    this.productAttributesForm.get('conditionAttributeId')?.valueChanges.subscribe((selectedId) => {
      if (selectedId) {
        const selectedAttribute = this.productAttributeMappingsList.find((item: any) => item._id === selectedId);
        if (selectedAttribute) {
          this.selectedControlType = selectedAttribute.controlType;
          this.productValueByAttributeId = selectedId;
          this.getAllProductValuesByAttributeId();
        }
      } else {
        this.productValueByValueList = [];
        this.selectedControlType = '';
      }
    });

    this.specificationAttributesForm.get('specificationAttributeGroupId')?.valueChanges.subscribe((selectedId) => {
      if (selectedId) {
        this.specificationAttributesForm.get('specificationAttributeId')?.setValue(null);
        this.getAllSpecificationAttributes(selectedId);
      }
    });

    this.specificationAttributesForm.get('productAttributeMappingId')?.valueChanges.subscribe((selectedId) => {
      if (selectedId) {
        this.specificationAttributesForm.get('productAttributeValueMappingId')?.setValue(null);
        this.getAllActiveProductValues(selectedId);
      }
    });


    this.specificationAttributesForm.get('specificationAttributeId')?.valueChanges.subscribe((selectedId) => {
      if (selectedId) {
        this.specificationAttributesForm.get('specificationAttributeOptionId')?.setValue(null);
        this.getAllSpecificationOptionList(selectedId);
      }
    });

  }

  get multipleWareHouses(): FormArray {
    return this.productForm.get('multipleWareHouses') as FormArray;
  }

  toggleEditWarehouseMode(warehouseIndex: number, use: boolean): void {
    this.editWarehouseMode[warehouseIndex] = use; // Enable only when `use` is true
}




  defaultProductForm() {
    this.productForm = this.fb.group({
      //info
      productName: ['', Validators.required],
      shortDescription: [''],
      fullDescription: [''],
      sku: [''],
      categoryId: [],
      manufacturerId: [],
      published: [false],
      productTags: [''],
      gtIn: [''],
      manufacturerPartNumber: [''],
      showOnHomePage: [false],
      order: [0],
      productType: [''],
      productTemplate: [''],
      visibleIndividually: [false],
      customerRoleId: [],
      requireOtherProducts: [false],
      allowCustomerReview: [false],
      displayOnlyUploadedImageAttributeCombination: [false],
      availableStartDate: [''],
      availableEndDate: [''],
      markAsNew: [false],
      markAsNewStartDate: [''],
      markAsNewEndDate: [''],
      adminComment: [''],
      //Prices
      price: [0],
      oldPrice: [0],
      productCost: [0],
      disableBuyButton: [false],
      disableWishListButton: [false],
      availablePreOrder: [false],
      preOrderAvailabilityStartDate: [''],
      callForPrice: [false],
      customerEnterPrice: [false],
      customerMinimumAmount: [0],
      customerMaximumAmount: [0],
      basePriceEnabled: [false],
      basePriceAmountInProduct: [0],
      basePriceUnitOfProduct: [''],
      basePriceReferenceAmount: [0],
      basePriceReferenceUnit: [''],
      // discounts: [123], 
      taxExempt: [false],
      taxCategoryId: [],
      //shipping 
      shippingEnabled: [false],
      shippingWeight: [0],
      shippingLength: [0],
      shippingWidth: [0],
      shippingHeight: [0],
      freeShipping: [false],
      shipSeparately: [false],
      additionalShippingCharge: [0],
      deliveryDate: [''],
      //seo
      searchEngineFriendlyPageName: [''],
      metaTitle: [''],
      metaKeywords: [''],
      metaDescription: [''],
      //inventory
      inventoryMethod: ['Do not track inventory'],
      stockQuantity: [0],
      wareHouse: [],
      multiWareHouse: [false],
      // multipleWareHouses: this.fb.array([]) ,// Initialize the FormArray
      displayAvailability: [false],
      displayStockQuantity: [false],
      minimumStockQuantity: [0],
      lowStockActivity: [''],
      notifyForQtyBelow: [0],
      backOrders: [''],
      allowBackInStockSubscription: [false],
      productAvailabilityRange: [''],
      minimumCartQty: [0],
      maximumCartQty: [0],
      allowedQuantities: [''],
      notReturnable: [true],
      allowedOnlyExistingAttributeCombinations: [false],
    });
  }

  defaultSpecificationAttributesForm() {
    this.specificationAttributesForm = this.fb.group({
      specificationAttributeType: ['Custom text'],
      productAttributeMappingId:[],
      productAttributeValueMappingId:[],
      specificationAttributeGroupId: [],
      specificationAttributeId: [],
      specificationAttributeOptionId: [],
      specificationAttributeValue: [''],
      allowFiltering: [false],
      showOnProductPage: [true],
      order: ['']
    });
  }

  defaultProductAttributesForm() {
    this.productAttributesForm = this.fb.group({
      productAttributeId: [],
      textPrompt: [''],
      isRequired: [false],
      controlType: [''],
      defaultValue: [''],
      minimumLength: [''],
      maximumLength: [''],
      allowedFileExtension: [''],
      maximumFileSize: [''],
      enableCondition: [false],
      conditionAttributeId: [],
      conditionAttributeValue: [],
      order: ['']
    });
  }

  defaultProductValueForm() {
    this.valueForm = this.fb.group({
      attributeValueTypeName: [''],
      rgbColor: [''],
      name: ['', Validators.required],
      priceAdjustmentUsePercentage: [false],
      priceAdjustment: [''],
      weightAdjustment: [''],
      cost: [''],
      isPreSelected: [false],
      order: [''],
      pictureIds: [[]],
    });
  }

    defaultPictureForm() {
      this.pictureForm = this.fb.group({
        multimediaImage: [null, Validators.required], 
      });
    }
    

  defaultVideoForm() {
    this.videoForm = this.fb.group({
      multimediaVideoUrl: [''],
      order: [0],
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


  addProduct() {
    // this.productForm.reset();
    // this.defaultProductForm();
    this.isAddProductList = true;
    this.isAddProduct = true;
    this.isAddNewSpecificationAttributes = false;
    this.isAddNewProductAttributes = false;
    this.isEditProduct = false;
  }

  addAttributes() {
    this.isEditSpecificationAttributes = false;
    // this.specificationAttributesForm.reset();
    this.isAddProductList = true;
    this.isAddProduct = false;
    this.isEditProduct = false;
    this.isAddNewProductAttributes = false;
    this.isAddNewProductAttributes = false;
    this.isAddNewSpecificationAttributes = true;
    // this.getAllSpecificationAttributes();
  }

  addNewProductAttributes() {
    this.defaultProductAttributesForm();
    this.isAddProductList = true;
    this.isAddProduct = false;
    this.isEditProduct = false;
    this.isAddNewSpecificationAttributes = false;
    this.isAddNewProductAttributes = true;
    this.isEditproductAttributes = false;

    this.getAllAttributesList();
    this.getAllProductAttribute();
  }
  backToProductList() {
    this.isAddProductList = false;
    this.isEditProduct = false;
    this.isAddProduct = false;
    this.router.navigate(['/admin/Product/List']);

  }

  backToProductSpecificationList() {
    this.router.navigate(['/admin/Product/Edit', this.productIdParams]);
    // this.isAddProductList = true;
    // this.isAddProduct = true;
    // this.isEditProduct = true;
    // this.isAddNewSpecificationAttributes = false;
    // this.isAddNewProductAttributes = false;
  }


  addNewValue() {
    this.defaultProductValueForm();  // This will clear the form on button click
    this.getAllProductMultiMedia();
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

  toggleEditVideoMode(index: number): void {
    this.editVideoMode[index] = !this.editVideoMode[index];
  }

  // toggleEditWarehouseMode(index: number): void {
  //   this.editWarehouseMode[index] = !this.editWarehouseMode[index];
  // }

  setproductId(id: string) {
    this.productId = id;
  }

  setProduct(products: any) {
    this.products = products;
  }

  setSpecificationAttribute(specificationAttributes: any) {
    this.specificationAttributes = specificationAttributes;
  }

  setProductAttribute(productAttribute: any) {
    this.productAttribute = productAttribute;
  }

  setValue(values: any) {
    this.values = values;
  }

  setMultimedia(multimedia: any) {
    this.multimedia = multimedia;
  }

  setMultimediaVideo(multimediaVideo: any) {
    this.multimediaVideo = multimediaVideo;
  }

  setRelatedProduct(relatedProduct: any) {
    this.relatedProduct = relatedProduct;
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
    this.getAllProductList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllProductList();
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
        if (inputId === 'multimediaImage') {
          this.selectedmultimediaImage = e.target?.result as string;
          this.multimediaImageFile = file;
          this.pictureForm.patchValue({ multimediaImage: file }); // Update form control
          this.pictureForm.get('multimediaImage')?.updateValueAndValidity(); // Validate field
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  removeImage(event: Event, inputId: string): void {
    event.stopPropagation();
    if (inputId === 'multimediaImage') {
      this.selectedmultimediaImage = null;
      this.multimediaImageFile = null;
      this.pictureForm.patchValue({ multimediaImage: null }); // Reset form control
      this.pictureForm.get('multimediaImage')?.updateValueAndValidity(); // Validate field
    }
  }
  

  toggleSelectAll() {
    this.allProductList.forEach((products: any) => {
      products.isChecked = this.selectAllChecked;
    });
  }

  updateSelectAllProduct() {
    this.selectAllChecked = this.allProductList.every((products: any) => products.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.allProductList.some((products: any) => products.isChecked);
  }


  handleLiveChange(event: any) {
    this.visible = event;
  }

  handleRelatedProductCloseModal(event: any) {
    this.relatedProductvisible = event;
  }

  // Function to add new tags
  addTag = (name: string) => {
    const newTag = { _id: String(Date.now()), tagName: name }; // Create a new tag with unique ID
    this.productTagsList.push(newTag); // Add to the list
    return newTag; // Return the newly created tag
  };

  onCheckboxChange(controlName: string): void {
    if (controlName === 'showOnHomePage') {
      this.showDisplayOrder = this.productForm.get('showOnHomePage')?.value;
    } else if (controlName === 'markAsNew') {
      this.showMarkAsNewFields = this.productForm.get('markAsNew')?.value;
    } else if (controlName === 'availablePreOrder') {
      this.showPreOrderFields = this.productForm.get('availablePreOrder')?.value;
    }
    else if (controlName === 'customerEnterPrice') {
      this.showCustomerEnterPriceFields = this.productForm.get('customerEnterPrice')?.value;
    }
    else if (controlName === 'basePriceEnabled') {
      this.showBasePriceEnabledFields = this.productForm.get('basePriceEnabled')?.value;
    }
    else if (controlName === 'taxExempt') {
      this.showTaxExemptFields = this.productForm.get('taxExempt')?.value;
    }
    else if (controlName === 'shippingEnabled') {
      this.showShippingEnabledFields = this.productForm.get('shippingEnabled')?.value;
    }
    else if (controlName === 'enableCondition') {
      this.getProductAttribute();
      this.showEnabledConditionFields = this.productAttributesForm.get('enableCondition')?.value;
    }
    else if (controlName === 'multiWareHouse') {
      this.showMultipleWarehousesFields = this.productForm.get('multiWareHouse')?.value;
    }
    else if (controlName === 'displayAvailability') {
      this.showDisplayAvailabilityFields = this.productForm.get('displayAvailability')?.value;
    }
  }

  onAttributeChange(productAttributeMappingId: string, multimedia: any) {
  
    if (productAttributeMappingId) {
      // Call API to get the product values for selected attribute
      this.defaultLayoutService.getActiveProductValueMappingsList({ 
        productAttributeMappingId: productAttributeMappingId 
      }).subscribe((Response: any) => {
        console.log("API Response:", Response); // Log API response
  
        if (Response.meta.code === 200) {
          multimedia.filteredProductValues = Response.data;
        } else {
          multimedia.filteredProductValues = [];
          console.log("No Values Found, Reset List");
        }
      }, error => {
        console.error("API Error:", error); // Log errors
      });
    } else {
      multimedia.filteredProductValues = [];
      console.log("Attribute Cleared, Reset Values");
    }
  }
  
  

  getAllProductList(): void {
    this.loading = true;
    const payload: any = {
      productName: this.productName,
      categoryId: this.categoriesId,
      published: this.published,
      warehouseId: this.warehouseId,
      productType: this.productType,
      manufacturerId: this.manufacturerId,
      limit: this.pageSize,
      page: this.currentPage
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
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
      }
      this.loading = false;

    });
  }


  getAllCategoryList(): void {
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
    this.defaultLayoutService.getAllActiveProductTag(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.productTagsList = Response.data;
      }
    });
  }

  getAllWarehouseList(): void {
    this.defaultLayoutService.getAllActiveWarehouse(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.warehouses = Response.data;
      }
    });
  }
  getAllActiveWarehouseList(): void {
    this.defaultLayoutService.getAllActiveWarehouse(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.warehousesList = Response.data;
      }
    });
  }

  getAttributesByProductId(): void {
    this.defaultLayoutService.getActiveProductAttributesByProductId({productId:this.productIdParams}).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.ActiveAttributesListByProductId = Response.data;
      }
    }); 
  }


  getAllActiveProductValues(productAttributeMappingId:any): void {
    this.defaultLayoutService.getActiveProductValueMappingsList({
      productAttributeMappingId: productAttributeMappingId, 
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.ActiveProductValueList = Response.data;
      }
    });
  }


  getAllSpecificationAttributesList(): void {
    this.defaultLayoutService.getAllProductSpecificationAttributes({
      productId: this.productId,
      limit: this.pageSpecificationAttributesSize,
      page: this.currentSpecificationAttributesPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.specificationAttributesList = Response.data.productSpecificationAttributes;
        this.totalSpecificationAttributeRecords = Response.data.totalRecords;
        this.totalSpecificationAttributePages = Response.data.totalPages;
      }
    });
  }

  getallSpecificationGroupList(): void {
    this.defaultLayoutService.getAllActiveSpecificationGroup().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allSpecificationGroupList = Response.data;
      }
    });
  }

  getAllRelatedProductList(): void {
    this.defaultLayoutService.getAllRelatedProduct({
      productId: this.productId,
      limit: this.pageRelatedProductsSize,
      page: this.currentRelatedProductsPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.relatedProductList = Response.data.relatedProducts;
        this.totalRelatedProductsRecords = Response.data.totalRecords;
        this.totalRelatedProductsPages = Response.data.totalPages;
      }
    });
  }

  getAllAttributesList(): void {
    this.defaultLayoutService.getAllActiveProductAttributes(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.attributesList = Response.data;
      }
    }); 
  }

  getAllSpecificationAttributes(specificationAttributeGroupId: any): void {
    this.defaultLayoutService.getActiveSpecificationAttributes({ specificationAttributeGroupId: specificationAttributeGroupId }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allSpecificationAttributesList = Response.data;
      }
    });
  }

  getAllSpecificationOptionList(specificationAttributeId: any): void {
    // this.specificationAttributeId=specificationAttributeId
    this.defaultLayoutService.getoptionDetailsByAttributeId({ specificationAttributeId: specificationAttributeId }).subscribe((response: any) => {
      if (response.meta.code === 200) {
        this.specificationOptionList = response.data.specificationAttributeOptions;
      }
    });
  }

  getAllCustomerRoleList(): void {
    // API call to get options based on the selected attribute
    this.defaultLayoutService.getAllActiveCustomerRole(null).subscribe((response: any) => {
      if (response.meta.code === 200) {
        this.customerRoleList = response.data;
      }
    });
  }

  editProduct(selectedProductId: any) {
    this.defaultProductForm();
    this.productId = selectedProductId;
    this.isAddProductList = true;
    this.isAddProduct = true;
    this.isEditProduct = true;

    this.defaultLayoutService.getProductDetailsById(this.productId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.productForm.patchValue(response.data);
          this.productData = response.data; // Store the product data here
          this.productNameHeader = response.data.productName;
          this.warehouses = response.data.multipleWareHouses


          // Handling date fields - split to extract only the date part
          if (this.productForm.get('availableStartDate')?.value) {
            this.productForm.patchValue({
              availableStartDate: this.productForm.get('availableStartDate')?.value.split('T')[0]
            });



          }
          if (this.productForm.get('availableEndDate')?.value) {
            this.productForm.patchValue({
              availableEndDate: this.productForm.get('availableEndDate')?.value.split('T')[0]
            });
          }
          if (this.productForm.get('markAsNewStartDate')?.value) {
            this.productForm.patchValue({
              markAsNewStartDate: this.productForm.get('markAsNewStartDate')?.value.split('T')[0]
            });
          }
          if (this.productForm.get('markAsNewEndDate')?.value) {
            this.productForm.patchValue({
              markAsNewEndDate: this.productForm.get('markAsNewEndDate')?.value.split('T')[0]
            });
          }
          if (this.productForm.get('preOrderAvailabilityStartDate')?.value) {
            this.productForm.patchValue({
              preOrderAvailabilityStartDate: this.productForm.get('preOrderAvailabilityStartDate')?.value.split('T')[0]
            });
          }



          // Checkbox conditions
          if (this.productForm.get('showOnHomePage')?.value) {
            this.onCheckboxChange('showOnHomePage');
          }
          if (this.productForm.get('markAsNew')?.value) {
            this.onCheckboxChange('markAsNew');
          }
          if (this.productForm.get('availablePreOrder')?.value) {
            this.onCheckboxChange('availablePreOrder');
          }
          if (this.productForm.get('customerEnterPrice')?.value) {
            this.onCheckboxChange('customerEnterPrice');
          }
          if (this.productForm.get('basePriceEnabled')?.value) {
            this.onCheckboxChange('basePriceEnabled');
          }
          if (this.productForm.get('taxExempt')?.value) {
            this.onCheckboxChange('taxExempt');
          }
          if (this.productForm.get('shippingEnabled')?.value) {
            this.onCheckboxChange('shippingEnabled');
          }
          if (this.productForm.get('multiWareHouse')?.value) {
            this.onCheckboxChange('multiWareHouse');
          }
          if (this.productForm.get('displayAvailability')?.value) {
            this.onCheckboxChange('displayAvailability');
          }
          // if (this.productForm.get('enableCondition')?.value) {
          //   this.onCheckboxChange('enableCondition');
          // }

          this.getAllSpecificationAttributesList();
          this.getAllProductAttribute();
          this.getAllProductMultiMedia();
          this.getAllProductVideo();
          this.getAllRelatedProductList();
        } else {
          console.error('Failed to fetch product details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching product details:', error);
      }
    );
  }





  createNewProduct(saveAndEdit: boolean) {
    if (this.productForm.valid) {
      const productObj = {
        productName: this.productForm.value.productName,
        shortDescription: this.productForm.value.shortDescription,
        fullDescription: this.productForm.value.fullDescription,
        sku: this.productForm.value.sku,
        categoryId: this.productForm.value.categoryId,
        manufacturerId: this.productForm.value.manufacturerId,
        published: this.productForm.value.published,
        productTags: this.productForm.value.productTags,
        gtIn: this.productForm.value.gtIn,
        manufacturerPartNumber: this.productForm.value.manufacturerPartNumber,
        showOnHomePage: this.productForm.value.showOnHomePage,
        order: this.productForm.value.order,
        productType: this.productForm.value.productType,
        productTemplate: this.productForm.value.productTemplate,
        visibleIndividually: this.productForm.value.visibleIndividually,
        customerRoleId: this.productForm.value.customerRoleId,
        requireOtherProducts: this.productForm.value.requireOtherProducts,
        allowCustomerReview: this.productForm.value.allowCustomerReview,
        displayOnlyUploadedImageAttributeCombination: this.productForm.value.displayOnlyUploadedImageAttributeCombination,
        availableStartDate: this.productForm.value.availableStartDate,
        availableEndDate: this.productForm.value.availableEndDate,
        markAsNew: this.productForm.value.markAsNew,
        markAsNewStartDate: this.productForm.value.markAsNewStartDate,
        markAsNewEndDate: this.productForm.value.markAsNewEndDate,
        adminComment: this.productForm.value.adminComment,
        price: this.productForm.value.price,
        oldPrice: this.productForm.value.oldPrice,
        productCost: this.productForm.value.productCost,
        disableBuyButton: this.productForm.value.disableBuyButton,
        disableWishListButton: this.productForm.value.disableWishListButton,
        availablePreOrder: this.productForm.value.availablePreOrder,
        preOrderAvailabilityStartDate: this.productForm.value.preOrderAvailabilityStartDate,
        callForPrice: this.productForm.value.callForPrice,
        customerEnterPrice: this.productForm.value.customerEnterPrice,
        customerMinimumAmount: this.productForm.value.customerMinimumAmount,
        customerMaximumAmount: this.productForm.value.customerMaximumAmount,
        basePriceEnabled: this.productForm.value.basePriceEnabled,
        basePriceAmountInProduct: this.productForm.value.basePriceAmountInProduct,
        basePriceUnitOfProduct: this.productForm.value.basePriceUnitOfProduct,
        basePriceReferenceAmount: this.productForm.value.basePriceReferenceAmount,
        basePriceReferenceUnit: this.productForm.value.basePriceReferenceUnit,
        taxExempt: this.productForm.value.taxExempt,
        taxCategoryId: this.productForm.value.taxCategoryId,
        shippingEnabled: this.productForm.value.shippingEnabled,
        shippingWeight: this.productForm.value.shippingWeight,
        shippingLength: this.productForm.value.shippingLength,
        shippingWidth: this.productForm.value.shippingWidth,
        shippingHeight: this.productForm.value.shippingHeight,
        freeShipping: this.productForm.value.freeShipping,
        shipSeparately: this.productForm.value.shipSeparately,
        additionalShippingCharge: this.productForm.value.additionalShippingCharge,
        deliveryDate: this.productForm.value.deliveryDate,
        searchEngineFriendlyPageName: this.productForm.value.searchEngineFriendlyPageName,
        metaTitle: this.productForm.value.metaTitle,
        metaKeywords: this.productForm.value.metaKeywords,
        metaDescription: this.productForm.value.metaDescription,
        inventoryMethod: this.productForm.value.inventoryMethod,
        stockQuantity: this.productForm.value.stockQuantity,
        wareHouse: this.productForm.value.wareHouse,
        multiWareHouse: this.productForm.value.multiWareHouse,
        displayAvailability: this.productForm.value.displayAvailability,
        displayStockQuantity: this.productForm.value.displayStockQuantity,
        minimumStockQuantity: this.productForm.value.minimumStockQuantity,
        lowStockActivity: this.productForm.value.lowStockActivity,
        notifyForQtyBelow: this.productForm.value.notifyForQtyBelow,
        backOrders: this.productForm.value.backOrders,
        allowBackInStockSubscription: this.productForm.value.allowBackInStockSubscription,
        productAvailabilityRange: this.productForm.value.productAvailabilityRange,
        minimumCartQty: this.productForm.value.minimumCartQty,
        maximumCartQty: this.productForm.value.maximumCartQty,
        allowedQuantities: this.productForm.value.allowedQuantities,
        notReturnable: this.productForm.value.notReturnable,
        allowedOnlyExistingAttributeCombinations: this.productForm.value.allowedOnlyExistingAttributeCombinations,
        multipleWareHouses: this.warehouses
          .filter((warehouse: any) => warehouse.use)  // Only include warehouses where 'use' is true
          .map((warehouse: any) => ({
            wareHouse: warehouse._id,
            use: warehouse.use,
            stockQty: warehouse.stockQty,
            reservedQty: warehouse.reservedQty,
            plannedQty: warehouse.plannedQty
          }))
      };

      this.defaultLayoutService.createNewProduct(productObj).subscribe(
        (response: any) => {
          this.toastr.success('Product saved successfully');
          this.productId = response.data.savedProduct._id;
          if (saveAndEdit) {
            this.backToProductList();
            this.getAllProductList();
          }
          else {
            this.router.navigate(['/admin/Product/Edit', this.productId]);
            // this.editProduct(this.productId);
          }
        },
        (error) => {
          console.error('Error saving product:', error);
          this.toastr.error('Error saving product')
        }
      );
    } else {
      this.productForm.markAllAsTouched();
    }
  }


  updateProduct(saveAndEdit: boolean) {
    if (this.productForm.valid) {
      const updatedProductForm = {
        productName: this.productForm.value.productName,
        shortDescription: this.productForm.value.shortDescription,
        fullDescription: this.productForm.value.fullDescription,
        sku: this.productForm.value.sku,
        categoryId: this.productForm.value.categoryId,
        manufacturerId: this.productForm.value.manufacturerId,
        published: this.productForm.value.published,
        productTags: this.productForm.value.productTags,
        gtIn: this.productForm.value.gtIn,
        manufacturerPartNumber: this.productForm.value.manufacturerPartNumber,
        showOnHomePage: this.productForm.value.showOnHomePage,
        order: this.productForm.value.order,
        productType: this.productForm.value.productType,
        productTemplate: this.productForm.value.productTemplate,
        visibleIndividually: this.productForm.value.visibleIndividually,
        customerRoleId: this.productForm.value.customerRoleId,
        requireOtherProducts: this.productForm.value.requireOtherProducts,
        allowCustomerReview: this.productForm.value.allowCustomerReview,
        displayOnlyUploadedImageAttributeCombination: this.productForm.value.displayOnlyUploadedImageAttributeCombination,
        availableStartDate: this.productForm.value.availableStartDate,
        availableEndDate: this.productForm.value.availableEndDate,
        markAsNew: this.productForm.value.markAsNew,
        markAsNewStartDate: this.productForm.value.markAsNewStartDate,
        markAsNewEndDate: this.productForm.value.markAsNewEndDate,
        adminComment: this.productForm.value.adminComment,
        price: this.productForm.value.price,
        oldPrice: this.productForm.value.oldPrice,
        productCost: this.productForm.value.productCost,
        disableBuyButton: this.productForm.value.disableBuyButton,
        disableWishListButton: this.productForm.value.disableWishListButton,
        availablePreOrder: this.productForm.value.availablePreOrder,
        preOrderAvailabilityStartDate: this.productForm.value.preOrderAvailabilityStartDate,
        callForPrice: this.productForm.value.callForPrice,
        customerEnterPrice: this.productForm.value.customerEnterPrice,
        customerMinimumAmount: this.productForm.value.customerMinimumAmount,
        customerMaximumAmount: this.productForm.value.customerMaximumAmount,
        basePriceEnabled: this.productForm.value.basePriceEnabled,
        basePriceAmountInProduct: this.productForm.value.basePriceAmountInProduct,
        basePriceUnitOfProduct: this.productForm.value.basePriceUnitOfProduct,
        basePriceReferenceAmount: this.productForm.value.basePriceReferenceAmount,
        basePriceReferenceUnit: this.productForm.value.basePriceReferenceUnit,
        taxExempt: this.productForm.value.taxExempt,
        taxCategoryId: this.productForm.value.taxCategoryId,
        shippingEnabled: this.productForm.value.shippingEnabled,
        shippingWeight: this.productForm.value.shippingWeight,
        shippingLength: this.productForm.value.shippingLength,
        shippingWidth: this.productForm.value.shippingWidth,
        shippingHeight: this.productForm.value.shippingHeight,
        freeShipping: this.productForm.value.freeShipping,
        shipSeparately: this.productForm.value.shipSeparately,
        additionalShippingCharge: this.productForm.value.additionalShippingCharge,
        deliveryDate: this.productForm.value.deliveryDate,
        searchEngineFriendlyPageName: this.productForm.value.searchEngineFriendlyPageName,
        metaTitle: this.productForm.value.metaTitle,
        metaKeywords: this.productForm.value.metaKeywords,
        metaDescription: this.productForm.value.metaDescription,

        inventoryMethod: this.productForm.value.inventoryMethod,
        stockQuantity: this.productForm.value.stockQuantity,
        wareHouse: this.productForm.value.wareHouse,
        multiWareHouse: this.productForm.value.multiWareHouse,
        displayAvailability: this.productForm.value.displayAvailability,
        displayStockQuantity: this.productForm.value.displayStockQuantity,
        minimumStockQuantity: this.productForm.value.minimumStockQuantity,
        lowStockActivity: this.productForm.value.lowStockActivity,
        notifyForQtyBelow: this.productForm.value.notifyForQtyBelow,
        backOrders: this.productForm.value.backOrders,
        allowBackInStockSubscription: this.productForm.value.allowBackInStockSubscription,
        productAvailabilityRange: this.productForm.value.productAvailabilityRange,
        minimumCartQty: this.productForm.value.minimumCartQty,
        maximumCartQty: this.productForm.value.maximumCartQty,
        allowedQuantities: this.productForm.value.allowedQuantities,
        notReturnable: this.productForm.value.notReturnable,
        allowedOnlyExistingAttributeCombinations: this.productForm.value.allowedOnlyExistingAttributeCombinations,
        id: this.productId,
        multipleWareHouses: this.warehouses
          .filter((warehouse: any) => warehouse.use)
          .map((warehouse: any) => ({
            wareHouse: warehouse._id,
            use: warehouse.use,
            stockQty: warehouse.stockQty,
            reservedQty: warehouse.reservedQty,
            plannedQty: warehouse.plannedQty
          }))

      };

      this.defaultLayoutService.updateproductById(updatedProductForm).subscribe(
        (response: any) => {
          this.toastr.success('Product updated successfully')
          if (saveAndEdit) {
            this.isEditProduct = false;
            this.backToProductList();
            this.getAllProductList();
          }
          this.editProduct(this.productId);
        },
        (error: any) => {
          console.error('Error updating product:', error);
          this.toastr.error('Error updating product')

        }
      );
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  deactiveProduct() {
    const productsDeActive = {
      ids: [this.productId],
      isDeleted: true
    };
    this.defaultLayoutService.productMultiActiveDeActive(productsDeActive).subscribe(
      (response) => {
        this.toastr.success('Products deleted successfully')
        this.getAllProductList();
        this.editProduct(this.productId);
      },
      (error) => {
        console.error('Error deleting products:', error);
        this.toastr.error('Error deleting products')

      }
    );
  }

  activeProduct() {
    const productsReActive = {
      ids: [this.productId],
      isDeleted: false
    };
    this.defaultLayoutService.productMultiActiveDeActive(productsReActive).subscribe(
      (response) => {
        this.toastr.success('Products active successfully')
        this.getAllProductList();
        this.editProduct(this.productId);
      },
      (error) => {
        console.error('Error active products:', error);
        this.toastr.error('Error active products')
      }
    );
  }

  deleteProduct(products: any) {
    const productsDeActive = {
      ids: [products._id],
      isDeleted: true
    };
    this.defaultLayoutService.productMultiActiveDeActive(productsDeActive).subscribe(
      (response) => {
        this.toastr.success('Products deleted successfully')
        this.getAllProductList();
      },
      (error) => {
        console.error('Error deleting products:', error);
        this.toastr.error('Error deleting products')

      }
    );
  }

  reActiveProduct(products: any) {
    const productsReActive = {
      ids: [products._id],
      isDeleted: false
    };
    this.defaultLayoutService.productMultiActiveDeActive(productsReActive).subscribe(
      (response) => {
        this.toastr.success('Products active successfully')
        this.getAllProductList();
      },
      (error) => {
        console.error('Error active products:', error);
        this.toastr.error('Error active products')
      }
    );
  }


  deleteSelectedProduct() {
    const selectedIds = this.allProductList
      .filter((products: any) => products.isChecked)
      .map((products: any) => products._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: 'true'
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.productMultiActiveDeActive(requestData).subscribe(
        (response: any) => {
          this.toastr.success('Products delete successfully')
          this.selectAllChecked = false;
          this.allProductList.forEach((products: any) => {
            products.isChecked = false;
          });
          this.getAllProductList();
          this.toggleSelectAll();
        },
        (error) => {
          console.error('Error unpublishing products:', error);
          this.toastr.error('Error delete products')
        }
      );
    }
  }



  createNewSpecificationAttributes(saveAndEdit: boolean) {
    if (this.specificationAttributesForm.valid) {

      const specificationAttributesObj = {
        specificationAttributeType: this.specificationAttributesForm.value.specificationAttributeType,
        productAttributeMappingId: this.specificationAttributesForm.value.productAttributeMappingId,
        productAttributeValueMappingId: this.specificationAttributesForm.value.productAttributeValueMappingId,

        specificationAttributeGroupId: this.specificationAttributesForm.value.specificationAttributeGroupId,
        specificationAttributeId: this.specificationAttributesForm.value.specificationAttributeId,
        specificationAttributeOptionId: this.specificationAttributesForm.value.specificationAttributeOptionId,
        specificationAttributeValue: this.specificationAttributesForm.value.specificationAttributeValue,
        allowFiltering: this.specificationAttributesForm.value.allowFiltering,
        showOnProductPage: this.specificationAttributesForm.value.showOnProductPage,
        order: this.specificationAttributesForm.value.order,
        productId: this.productIdParams
      };

      this.defaultLayoutService.createNewProductSpecificationAttributes(specificationAttributesObj).subscribe(
        (response: any) => {
          this.toastr.success('SpecificationAttribute saved successfully')
          this.specificationAttributeId = response.data._id;
          if (saveAndEdit) {
            // this.getAllProductList();
            this.getAllSpecificationAttributesList();
            this.backToProductSpecificationList();
          }
          else {
            this.editSpecificationParams(this.specificationAttributeId);
            // this.getAllProductList();
            // this.getAllSpecificationAttributesList();
          }
        },
        (error) => {
          console.error('Error saving productSpecificationAttribute:', error);
          this.toastr.error('Error saving specificationAttribute')
        }

      );
    } else {
      this.specificationAttributesForm.markAllAsTouched();
    }
  }

  editSpecificationParams(SpecificationAttributeId: any) {
    this.router.navigate(['/admin/Product/ProductSpecAttributeEdit'], { queryParams: { productId: this.productIdParams, SpecificationAttributeId: SpecificationAttributeId } });
  }

 editSpecificationAttributes(selectedSpecificationAttributeId: any) {
  this.specificationAttributeId = selectedSpecificationAttributeId;
  this.isAddProductList = true;
  this.isAddProduct = false;
  this.isEditProduct = false;
  this.isAddNewSpecificationAttributes = true;
  this.isEditSpecificationAttributes = true;

  this.defaultLayoutService.getProductSpecificationAttributeDetailsById(this.specificationAttributeId).subscribe(
    (response: any) => {
      if (response.meta.code === 200) {
        const specificationData = response.data;

        // First, patch the group ID
        this.specificationAttributesForm.patchValue({
          specificationAttributeGroupId: specificationData.specificationAttributeGroupId,
          productAttributeMappingId: specificationData.productAttributeMappingId

        });

        // Fetch attributes for the selected group
        this.getAllSpecificationAttributes(specificationData.specificationAttributeGroupId);
        this.getAllActiveProductValues(specificationData.productAttributeMappingId);
        // Wait a short delay to ensure attributes are fetched before patching
        setTimeout(() => {
          this.specificationAttributesForm.patchValue({
            specificationAttributeId: specificationData.specificationAttributeId,
            productAttributeValueMappingId:specificationData.productAttributeValueMappingId
          });
        }, 500); // Adjust timeout if necessary

        this.specificationAttributesProductData = specificationData;

        this.specificationAttributesForm.patchValue(this.specificationAttributesProductData );
      } else {
        console.error('Failed to fetch specificationAttribute details:', response.meta.message);
        this.toastr.error('Failed to fetch specificationAttribute detail');
      }
    },
    (error: any) => {
      console.error('Error fetching specificationAttribute details:', error);
      this.toastr.error('Error fetching specificationAttribute details');
    }
  );
}



  updateSpecificationAttributes(saveAndEdit: boolean) {
    if (this.specificationAttributesForm.valid) {
      const updatedSpecificationAttributes = {
        specificationAttributeType: this.specificationAttributesForm.value.specificationAttributeType,
        productAttributeMappingId: this.specificationAttributesForm.value.productAttributeMappingId,
        productAttributeValueMappingId: this.specificationAttributesForm.value.productAttributeValueMappingId,
        specificationAttributeGroupId: this.specificationAttributesForm.value.specificationAttributeGroupId,
        specificationAttributeId: this.specificationAttributesForm.value.specificationAttributeId,
        specificationAttributeOptionId: this.specificationAttributesForm.value.specificationAttributeOptionId,
        specificationAttributeValue: this.specificationAttributesForm.value.specificationAttributeValue,
        allowFiltering: this.specificationAttributesForm.value.allowFiltering,
        showOnProductPage: this.specificationAttributesForm.value.showOnProductPage,
        order: this.specificationAttributesForm.value.order,
        id: this.specificationAttributeId,
        productId: this.productIdParams

      };
      this.defaultLayoutService.updateProductSpecificationAttributesById(updatedSpecificationAttributes).subscribe(
        (response: any) => {
          this.toastr.success('SpecificationAttribute updated successfully')
          if (saveAndEdit) {
            this.getAllProductList();
            this.getAllSpecificationAttributesList();
            this.backToProductSpecificationList();
          }
          this.editSpecificationAttributes(this.specificationAttributeId);
          // this.getAllProductList();
          // this.getAllSpecificationAttributesList();
        },
        (error: any) => {
          console.error('Error updating specificationAttribute:', error);
          this.toastr.error('Error updating specificationAttribute')

        }
      );
    } else {
      this.specificationAttributesForm.markAllAsTouched();
    }
  }

  deactiveSpecificationAttributes() {
    const specificationAttributeDeActive = {
      id: this.specificationAttributeId,
      isDeleted: true
    };
    this.defaultLayoutService.productSpecificationAttributeMultiActiveDeActive(specificationAttributeDeActive).subscribe(
      (response) => {
        this.toastr.success('Attribute deleted successfully')
        this.getAllSpecificationAttributesList();
        this.editSpecificationAttributes(this.specificationAttributeId);

      },
      (error) => {
        console.error('Error deleting attribute:', error);
        this.toastr.error('Error deleting attribute')
      }
    );
  }

  activeSpecificationAttributes() {
    const specificationAttributeReActive = {
      id: this.specificationAttributeId,
      isDeleted: false
    };
    this.defaultLayoutService.productSpecificationAttributeMultiActiveDeActive(specificationAttributeReActive).subscribe(
      (response) => {
        this.toastr.success('Attribute active successfully')
        this.getAllSpecificationAttributesList();
        this.editSpecificationAttributes(this.specificationAttributeId);
      },
      (error) => {
        console.error('Error active attribute:', error);
        this.toastr.error('Error active attribute')
      }
    );
  }

  deleteSpecificationAttributes(specificationAttribute: any) {
    const specificationAttributeDeActive = {
      id: specificationAttribute._id,
      isDeleted: true
    };
    this.defaultLayoutService.productSpecificationAttributeMultiActiveDeActive(specificationAttributeDeActive).subscribe(
      (response) => {
        this.toastr.success('Attribute deleted successfully')
        this.getAllSpecificationAttributesList();
      },
      (error) => {
        console.error('Error deleting attribute:', error);
        this.toastr.error('Error deleting attribute')
      }
    );
  }

  reActiveSpecificationAttributes(specificationAttribute: any) {
    const specificationAttributeReActive = {
      id: specificationAttribute._id,
      isDeleted: false
    };
    this.defaultLayoutService.productSpecificationAttributeMultiActiveDeActive(specificationAttributeReActive).subscribe(
      (response) => {
        this.toastr.success('Attribute active successfully')
        this.getAllSpecificationAttributesList();
      },
      (error) => {
        console.error('Error active attribute:', error);
        this.toastr.error('Error active attribute')
      }
    );
  }


  getAllProductAttribute(): void {
    this.defaultLayoutService.getAllProductAttributeMappingsList({
      productId: this.productIdParams,
      limit: this.pageProductAttributeSize,
      page: this.currentProductAttributePage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.productAttributeMappingsList = Response.data.productAttributeMappings;
        this.totalProductAttributeRecords = Response.data.totalRecords;
        this.totalProductAttributePages = Response.data.totalPages;
      }
    });
  }


  getProductAttribute(callback?: Function): void {
    this.defaultLayoutService.getAllProductAttributeMappingsList({
      productId: this.productIdParams,
    }).subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.productAttributeList = response.data.productAttributeMappings;
        if (callback) callback(); // Execute callback after fetching data
      }
    });
  }


  createNewProductAttributes(saveAndEdit: boolean) {
    if (this.productAttributesForm.valid) {
      let conditionAttributeValue;

      // Handle different control types for conditionAttributeValue
      if (this.selectedControlType === 'Drop-down list') {
        // ng-select: single value
        conditionAttributeValue = this.productAttributesForm.value.conditionAttributeValue;

      } else if (this.selectedControlType === 'Checkboxes') {
        // Checkboxes: multiple values (array of selected IDs)
        conditionAttributeValue = this.selectedValues;

      } else if (this.selectedControlType === 'Radio button list') {
        // Radio buttons: single value
        conditionAttributeValue = this.selectedRadioValue;
      }

      // Create the object to send in the request
      const productAttributesObj = {
        productAttributeId: this.productAttributesForm.value.productAttributeId,
        textPrompt: this.productAttributesForm.value.textPrompt,
        isRequired: this.productAttributesForm.value.isRequired,
        controlType: this.productAttributesForm.value.controlType,
        defaultValue: this.productAttributesForm.value.defaultValue,
        minimumLength: this.productAttributesForm.value.minimumLength,
        maximumLength: this.productAttributesForm.value.maximumLength,
        allowedFileExtension: this.productAttributesForm.value.allowedFileExtension,
        maximumFileSize: this.productAttributesForm.value.maximumFileSize,
        enableCondition: this.productAttributesForm.value.enableCondition,
        conditionAttributeId: this.productAttributesForm.value.conditionAttributeId,
        conditionAttributeValue: conditionAttributeValue, // Dynamically set
        order: this.productAttributesForm.value.order,
        productId: this.productIdParams
      };


      this.defaultLayoutService.createNewProductAttributeMapping(productAttributesObj).subscribe(
        (response: any) => {
          this.toastr.success('Product attribute saved successfully');
          this.productAttributeId = response.data._id;
          if (saveAndEdit) {
            this.getAllAttributesList();
            this.getAllProductAttribute();
            this.backToProductSpecificationList();
          }
          else {
            this.editProductAttribute(this.productAttributeId)
          }
          // this.editProductAttributes(this.productAttributeId);
          this.getAllAttributesList();
          this.getAllProductAttribute();
        },
        (error) => {
          console.error('Error saving product attribute:', error);
          this.toastr.error('Error saving product attribute')
        }
      );
    } else {
      this.productAttributesForm.markAllAsTouched();
    }
  }

  editProductAttribute(ProductAttributeId: any) {
    this.router.navigate(['/admin/Product/ProductAttributeMappingEdit'], { queryParams: { productId: this.productIdParams, productAttributeid: ProductAttributeId } });
  }


  editProductAttributes(selectedProductAttributeId: any) {    
    this.getAllAttributesList();
    this.productAttributeId = selectedProductAttributeId;
    this.isAddProductList = true;
    this.isAddProduct = false;
    this.isEditProduct = false;
    this.isAddNewSpecificationAttributes = false;
    this.isAddNewProductAttributes = true;
    this.isEditproductAttributes = true;
  
    this.defaultLayoutService.getProductAttributeDetailsById(this.productAttributeId).subscribe(
      (response: any) => {
  
        if (response.meta.code === 200) {
          const attributeData = response.data;
  
          // Patch form values
          this.productAttributesForm.patchValue(attributeData);
  
          this.productAttributesProductData = attributeData;
  
          // Handle enableCondition logic
          if (attributeData.enableCondition) {
            this.onCheckboxChange('enableCondition'); // Show dependent fields
          }
  
          // Fetch product attribute mappings to find controlType
          this.getProductAttribute(() => {
  
            if (attributeData.conditionAttributeId) {
              this.productValueByAttributeId = attributeData.conditionAttributeId;
              this.getAllProductValuesByAttributeId();
  
              // Find the corresponding controlType in productAttributeList
              const matchedAttribute = this.productAttributeList.find(
                (attr: any) => attr._id === attributeData.conditionAttributeId
              );
  
              if (matchedAttribute) {
                this.selectedControlType = matchedAttribute.controlType;
              }
  
              // Patch values based on control type
              if (this.selectedControlType === 'Drop-down list') {
                this.productAttributesForm.patchValue({
                  conditionAttributeValue: attributeData.conditionAttributeValue[0] || null,
                });
              } else if (this.selectedControlType === 'Checkboxes') {
                this.selectedValues = attributeData.conditionAttributeValue || [];
              } else if (this.selectedControlType === 'Radio button list') {
                this.selectedRadioValue = attributeData.conditionAttributeValue?.[0] || '';
              }
            } else {
              this.productValueByValueList = [];
            }
          });
  
          this.getAllProductValues();
        } else {
          console.error("Failed to fetch product details:", response.meta.message);
        }
      },
      (error: any) => {
        console.error("Error fetching product details:", error);
      }
    );
  }
  


  updateProductAttributes(saveAndEdit: boolean) {
    if (this.productAttributesForm.valid) {
      let conditionAttributeValue;

      // Handle different control types for conditionAttributeValue
      if (this.selectedControlType === 'Drop-down list') {
        // ng-select: single value
        conditionAttributeValue = this.productAttributesForm.value.conditionAttributeValue;

      } else if (this.selectedControlType === 'Checkboxes') {
        // Checkboxes: multiple values (array of selected IDs)
        conditionAttributeValue = this.selectedValues;

      } else if (this.selectedControlType === 'Radio button list') {
        // Radio buttons: single value
        conditionAttributeValue = this.selectedRadioValue;
      }

      // Create the object to send in the request
      const updatedProductAttributes = {
        productAttributeId: this.productAttributesForm.value.productAttributeId,
        textPrompt: this.productAttributesForm.value.textPrompt,
        isRequired: this.productAttributesForm.value.isRequired,
        controlType: this.productAttributesForm.value.controlType,
        defaultValue: this.productAttributesForm.value.defaultValue,
        minimumLength: this.productAttributesForm.value.minimumLength,
        maximumLength: this.productAttributesForm.value.maximumLength,
        allowedFileExtension: this.productAttributesForm.value.allowedFileExtension,
        maximumFileSize: this.productAttributesForm.value.maximumFileSize,
        order: this.productAttributesForm.value.order,
        enableCondition: this.productAttributesForm.value.enableCondition,
        conditionAttributeId: this.productAttributesForm.value.conditionAttributeId,
        conditionAttributeValue: conditionAttributeValue, // Dynamically set
        productId: this.productIdParams,
        id: this.productAttributeId,
      };

      // Send the complete form data to the backend service to update the product
      this.defaultLayoutService.updateProductAttributesMappingById(updatedProductAttributes).subscribe(
        (response: any) => {
          this.toastr.success('Product attribute updated successfully');
          if (saveAndEdit) {
            this.getAllAttributesList();
            this.getAllProductAttribute();
            this.backToProductSpecificationList();
          }
          this.editProductAttributes(this.productAttributeId);
          this.getAllAttributesList();
          this.getAllProductAttribute();
        },
        (error: any) => {
          console.error('Error updating product attribute:', error);
          this.toastr.error('Error updating product attribute')
        }
      );
    } else {
      this.productAttributesForm.markAllAsTouched();
    }
  }

  deactiveProductAttributes() {
    const productAttributeDeActive = {
      id: this.productAttributeId,
      isDeleted: true
    };
    this.defaultLayoutService.productAttributeActiveDeActive(productAttributeDeActive).subscribe(
      (response) => {
        this.toastr.success('Attribute deleted successfully');
        this.editProductAttributes(this.productAttributeId);
        this.getAllProductAttribute();
      },
      (error) => {
        console.error('Error deleting attribute:', error);
        this.toastr.error('Error deleting attribute')
      }
    );
  }

  activeProductAttributes() {
    const productAttributeReActive = {
      id: this.productAttributeId,
      isDeleted: false
    };
    this.defaultLayoutService.productAttributeActiveDeActive(productAttributeReActive).subscribe(
      (response) => {
        this.toastr.success('Attribute active successfully');
        this.editProductAttributes(this.productAttributeId);
        this.getAllProductAttribute();
      },
      (error) => {
        console.error('Error active attribute:', error);
        this.toastr.error('Error active attribute')

      }
    );
  }



  deleteProductAttributes(productAttribute: any) {
    const productAttributeDeActive = {
      id: productAttribute._id,
      isDeleted: true
    };
    this.defaultLayoutService.productAttributeActiveDeActive(productAttributeDeActive).subscribe(
      (response) => {
        this.toastr.success('Attribute deleted successfully')

        this.getAllProductAttribute();
      },
      (error) => {
        console.error('Error deleting attribute:', error);
        this.toastr.error('Error deleting attribute')
      }
    );
  }

  reActiveProductAttributes(productAttribute: any) {
    const productAttributeReActive = {
      id: productAttribute._id,
      isDeleted: false
    };
    this.defaultLayoutService.productAttributeActiveDeActive(productAttributeReActive).subscribe(
      (response) => {
        this.toastr.success('Attribute active successfully')
        this.getAllProductAttribute();
      },
      (error) => {
        console.error('Error active attribute:', error);
        this.toastr.error('Error active attribute')

      }
    );
  }


  getAllProductValues(): void {
    this.defaultLayoutService.getAllProductValueMappingsList({
      productAttributeMappingId: this.productAttributeId,
      limit: this.pageValuesSize,
      page: this.currentValuesPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.productValueList = Response.data.productAttributePredefinedValueMappings;
        this.totalValuesRecords = Response.data.totalRecords;
        this.totalValuesPages = Response.data.totalPages;
      }
    });
  }

  getAllProductValuesByAttributeId(): void {
    this.defaultLayoutService.getAllProductValueMappingsList({
      productAttributeMappingId: this.productValueByAttributeId, // Use the class-level variable
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code === 200) {
        this.productValueByValueList = Response.data.productAttributePredefinedValueMappings;
        // this.totalValuesRecords = Response.data.totalRecords;
        // this.totalValuesPages = Response.data.totalPages;
      }
    });
  }



  isChecked(pictureId: string): boolean {
    const pictureIdsControl = this.valueForm.get('pictureIds');
    const currentPictureIds = pictureIdsControl?.value || [];
    return currentPictureIds.includes(pictureId);
  }


  onPictureCheckboxChange(event: any, pictureId: string): void {
    const pictureIdsControl = this.valueForm.get('pictureIds');
    let currentPictureIds = pictureIdsControl?.value || [];

    if (event.target.checked) {
      // Add the pictureId to the array if checked
      currentPictureIds = [...currentPictureIds, pictureId];
    } else {
      // Remove the pictureId from the array if unchecked
      currentPictureIds = currentPictureIds.filter((id: string) => id !== pictureId);
    }

    // Remove duplicates from the pictureIds array
    currentPictureIds = [...new Set(currentPictureIds)];

    // Update the form control value with the unique pictureIds
    pictureIdsControl?.setValue(currentPictureIds);

   

    const selectedPictureIds = currentPictureIds;

  }






  createNewValue() {
    if (this.valueForm.valid) {

      const productValueObj = {
        attributeValueTypeName: this.valueForm.value.attributeValueTypeName,
        rgbColor: this.valueForm.value.rgbColor,
        name: this.valueForm.value.name,
        priceAdjustment: this.valueForm.value.priceAdjustment,
        priceAdjustmentUsePercentage: this.valueForm.value.priceAdjustmentUsePercentage,
        weightAdjustment: this.valueForm.value.weightAdjustment,
        cost: this.valueForm.value.cost,
        isPreSelected: this.valueForm.value.isPreSelected,
        pictureIds: this.valueForm.value.pictureIds,
        order: this.valueForm.value.order,
        productAttributeMappingId: this.productAttributeId
      };

      this.defaultLayoutService.createNewProductValueMapping(productValueObj).subscribe(
        (response) => {
          this.toastr.success('ProductValue saved successfully')
          this.visible = !this.visible;
          this.getAllProductValues();
          this.defaultProductValueForm();

        },
        (error) => {
          console.error('Error saving productValue:', error);
          this.toastr.error('Error saving productValue')
        }
      );
    } else {
      this.valueForm.markAllAsTouched();
    }
  }



  editProductValue(selectedProductValueId: any) {
    this.getAllProductMultiMedia();
    this.defaultProductForm();
    this.productValueId = selectedProductValueId;
    this.isEditvalue = true;
    this.visible = true;
    this.defaultLayoutService.getProductValueDetailsById(this.productValueId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.valueForm.patchValue(response.data);
        } else {
          console.error('Failed to fetch value details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching value details:', error);
      }
    );
  }

  updateValue() {
    if (this.valueForm.valid) {
      const updatedProductValue = {
        attributeValueTypeName: this.valueForm.value.attributeValueTypeName,
        rgbColor: this.valueForm.value.rgbColor,
        name: this.valueForm.value.name,
        priceAdjustment: this.valueForm.value.priceAdjustment,
        priceAdjustmentUsePercentage: this.valueForm.value.priceAdjustmentUsePercentage,
        weightAdjustment: this.valueForm.value.weightAdjustment,
        cost: this.valueForm.value.cost,
        isPreSelected: this.valueForm.value.isPreSelected,
        pictureIds: this.valueForm.value.pictureIds,
        order: this.valueForm.value.order,
        productAttributeMappingId: this.productAttributeId,
        id: this.productValueId,
      };
      this.defaultLayoutService.updateProductValueMappingById(updatedProductValue).subscribe(
        (response: any) => {
          this.toastr.success('ProductValue updated successfully')
          this.visible = !this.visible;
          this.isEditvalue = false;

          this.getAllProductValues();
        },
        (error: any) => {
          console.error('Error updating ProductValue:', error);
          this.toastr.error('Error updating ProductValue')
        }
      );
    } else {
      this.valueForm.markAllAsTouched();
    }
  }


  deleteValue(values: any) {
    const valuesDeActive = {
      id: values._id,
      isDeleted: true
    };
    this.defaultLayoutService.valueActiveDeActive(valuesDeActive).subscribe(
      (response) => {
        this.toastr.success('productValue delete successfully')
        this.getAllProductValues();
      },
      (error) => {
        console.error('Error deleting productValue:', error);
        this.toastr.error('Error deleting productValue')

      }
    );
  }

  reActiveValue(values: any) {
    const valuesReActive = {
      id: values._id,
      isDeleted: false
    };
    this.defaultLayoutService.valueActiveDeActive(valuesReActive).subscribe(
      (response) => {
        this.toastr.success('productValue active successfully')
        this.getAllProductValues();
      },
      (error) => {
        console.error('Error active productValue:', error);
        this.toastr.error('Error active productValue')

      }
    );
  }

  // getAllProductMultiMedia(): void {
  //   this.defaultLayoutService.getAllProductMultimediaList({
  //     productId: this.productIdParams,
  //     limit: this.pageMultimediaImageSize,
  //     page: this.currentMultimediaImagePage
  //   }).subscribe((response: any) => {
  //     if (response.meta.code === 200) {
  //       this.multimediaList = response.data.multimediaImages.map((item: any) => ({
  //         ...item,
  //         multimediaImage: item.multimediaImage
  //       }));
  //       this.totalMultimediaImageRecords = response.data.totalRecords;
  //       this.totalMultimediaImagePages = response.data.totalPages;
  //     }
  //   });
  // }

  getAllProductMultiMedia(): void {
    this.defaultLayoutService.getAllProductMultimediaList({
      productId: this.productIdParams,
      limit: this.pageMultimediaImageSize,
      page: this.currentMultimediaImagePage
    }).subscribe((response: any) => {
      if (response.meta.code === 200) {
        this.multimediaList = response.data.multimediaImages.map((item: any) => ({
          ...item,
          multimediaImage: item.multimediaImage,
          productAttributeMappingId: item.productAttributeMappingId || null,
          productAttributeValueMappingId: item.productAttributeValueMappingId || null,
          filteredProductValues: [] // Ensure an empty list is initialized
        }));
  
        // Loop through each multimedia item to fetch values for the selected attribute
        this.multimediaList.forEach((multimedia:any) => {
          if (multimedia.productAttributeMappingId) {
            this.defaultLayoutService.getActiveProductValueMappingsList({
              productAttributeMappingId: multimedia.productAttributeMappingId
            }).subscribe((Response: any) => {
              if (Response.meta.code === 200) {
                multimedia.filteredProductValues = Response.data;
              } else {
                multimedia.filteredProductValues = [];
              }
            });
          }
        });
  
        this.totalMultimediaImageRecords = response.data.totalRecords;
        this.totalMultimediaImagePages = response.data.totalPages;
      }
    });
  }
  
  CreateNewImage(): void {
    if (this.multimediaImageFile) {
      const formData = new FormData();
      formData.append('productId', this.productId);
      formData.append('multimediaImage', this.multimediaImageFile, this.multimediaImageFile.name);


      this.defaultLayoutService.createMultiMediaImage(formData).subscribe(
        (response) => {
          this.toastr.success('MultiMediaImage saved successfully')
          this.defaultPictureForm();
          this.getAllProductMultiMedia();
          this.selectedmultimediaImage = null;
          this.multimediaImageFile = null;
        },
        (error) => {
          console.error('Image upload failed:', error);
          this.toastr.error('Error saving multiMediaImage')

        }
      );
    } else {
      this.pictureForm.markAllAsTouched();
    }
  }


  updateMultimedia(index: number): void {
    const multimedia = this.multimediaList[index]; // Get the specific multimedia item

    if (multimedia.productAttributeMappingId && !multimedia.productAttributeValueMappingId) {
      this.toastr.error('Please select an attribute value.');
      return;
  }
    // Ensure at least one field has been changed before updating
    if (!multimedia.order && !multimedia.alter && !multimedia.title && 
        !multimedia.productAttributeMappingId && !multimedia.productAttributeValueMappingId) {
        return;
    }


    // Create the update object with additional fields
    const multimediaObj: any = {
        productId: this.productId,
        id: multimedia._id,
        order: multimedia.order ?? null, // Send null if the field is undefined
        alter: multimedia.alter ?? null,
        title: multimedia.title ?? null,
        productAttributeMappingId: multimedia.productAttributeMappingId ?? null,
        productAttributeValueMappingId: multimedia.productAttributeValueMappingId ?? null,
    };

    // Call the API to update the multimedia item
    this.defaultLayoutService.updateMultiMediaImage(multimediaObj).subscribe(
        (response: any) => {
            if (response.meta.code === 200) {
                this.editMode[index] = false; // Disable edit mode for this item
                this.toastr.success('Multimedia updated successfully');
                this.getAllProductMultiMedia(); // Refresh the list if required
            } else {
                console.error('Error updating multimedia:', response);
                this.toastr.error('Error updating multimedia');
            }
        },
        (error) => {
            console.error('Error calling updateMultiMediaImage API:', error);
            this.toastr.error('Error calling API');
        }
    );
}







  deleteProductMultimedia(multimedia: any) {
    const multimediaDeActive = {
      id: multimedia._id,
      isDeleted: true
    };
    this.defaultLayoutService.multimediaActiveDeActive(multimediaDeActive).subscribe(
      (response) => {
        this.toastr.success('multimedia deleted successfully')
        this.getAllProductMultiMedia();
      },
      (error) => {
        console.error('Error deleting multimedia :', error);
        this.toastr.error('Error deleting multimedia')
      }
    );
  }

  reActiveProductMultimedia(multimedia: any) {
    const multimediaReActive = {
      id: multimedia._id,
      isDeleted: false
    };
    this.defaultLayoutService.multimediaActiveDeActive(multimediaReActive).subscribe(
      (response) => {
        this.toastr.success('multimedia active successfully')
        this.getAllProductMultiMedia();
      },
      (error) => {
        console.error('Error active multimedia:', error);
        this.toastr.error('Error active multimedia')
      }
    );
  }


  getAllProductVideo(): void {
    this.defaultLayoutService.getAllProductVodeoList(
      {
        productId: this.productId,
        limit: this.pageMultimediaVideoSize,
        page: this.currentMultimediaVideoPage
      }).subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          this.productMultimediaVideoList = Response.data.multiMediaVideos;
          this.totalMultimediaVideoRecords = Response.data.totalRecords;
          this.totalMultimediaVideoPages = Response.data.totalPages;
        }
      });
  }


  CreateNewVideo() {
    if (this.videoForm.valid) {

      const videoObj = {
        multimediaVideoUrl: this.videoForm.value.multimediaVideoUrl,
        order: this.videoForm.value.order,
        productId: this.productId
      };

      this.defaultLayoutService.createNewProductVideo(videoObj).subscribe(
        (response) => {
          this.toastr.success('video saved successfully')
          this.defaultVideoForm();
          this.getAllProductVideo();
        },
        (error) => {
          console.error('Error saving video:', error);
          this.toastr.error('Error saving video')
        }
      );
    } else {
      this.valueForm.markAllAsTouched();
    }
  }


  updateMultimediaVideo(index: number): void {
    // Get the specific multimedia video object at the given index
    const multimediaVideo = this.productMultimediaVideoList[index];

    // Ensure the video data is valid
    if (multimediaVideo.order !== null && multimediaVideo.order !== undefined && multimediaVideo.multimediaVideoUrl) {
      const multimediaObj = {
        productId: this.productId,
        id: multimediaVideo._id,
        order: multimediaVideo.order || 0,
        multimediaVideoUrl: multimediaVideo.multimediaVideoUrl,
      };

      this.defaultLayoutService.updateProductVideo(multimediaObj).subscribe(
        (response: any) => {
          if (response.meta.code === 200) {
            this.toastr.success('Multimedia video updated successfully')
            this.editVideoMode[index] = false; // Disable the edit mode for the current item
            this.getAllProductVideo(); // Refresh the list after updating
          } else {
            console.error('Error updating multimedia:', response);
            this.toastr.error('Error updating multimedia')
          }
        },
        (error) => {
          console.error('Error calling updateProductVideo API:', error);
        }
      );

    } else {
      this.valueForm.markAllAsTouched();
    }
  }


  deleteProductMultimediaVideo(multimediaVideo: any) {
    const multimediaVideoDeActive = {
      id: multimediaVideo._id,
      isDeleted: true
    };
    this.defaultLayoutService.multimediaVideoActiveDeActive(multimediaVideoDeActive).subscribe(
      (response) => {
        this.toastr.success('multimedia video deleted successfully')
        this.getAllProductVideo();
      },
      (error) => {
        console.error('Error deleting multimedia video:', error);
      }
    );
  }

  reActiveProductMultimediaVideo(multimediaVideo: any) {
    const multimediaVideoReActive = {
      id: multimediaVideo._id,
      isDeleted: false
    };
    this.defaultLayoutService.multimediaVideoActiveDeActive(multimediaVideoReActive).subscribe(
      (response) => {
        this.toastr.success('multimedia video active successfully')
        this.getAllProductVideo();
      },
      (error) => {
        console.error('Error active products:', error);
        this.toastr.error('Error acitve multimedia video')

      }
    );
  }

  //product list pagination
  getProductListPagination(): (number | string)[] {
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

  changeProductListPage(page: number | string): void {
    if (page === "..." || page === this.currentPage) {
      return;
    }
    this.currentPage = page as number;
    this.getAllProductList();
  }

  updateProductListPageSize(): void {
    this.currentPage = 1;
    this.getAllProductList();
  }


  //product attribute pagination
  getRelatedProductsPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentRelatedProductsPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentRelatedProductsPage - halfRange);
    const endPage = Math.min(this.totalRelatedProductsPages - 1, this.currentRelatedProductsPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentRelatedProductsPage < this.totalRelatedProductsPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalRelatedProductsPages > 1) {
      pagination.push(this.totalRelatedProductsPages);
    }

    return pagination;
  }

  changeRelatedProductsPage(page: number | string): void {
    if (page === "..." || page === this.currentRelatedProductsPage) {
      return;
    }
    this.currentRelatedProductsPage = page as number;
    this.getAllRelatedProductList();
  }

  updateRelatedProductsPageSize(): void {
    this.currentRelatedProductsPage = 1;
    this.getAllRelatedProductList();
  }


  //specification attribtue pagination
  getSpecificationAttributePagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentSpecificationAttributesPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentSpecificationAttributesPage - halfRange);
    const endPage = Math.min(this.totalSpecificationAttributePages - 1, this.currentSpecificationAttributesPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentSpecificationAttributesPage < this.totalSpecificationAttributePages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalSpecificationAttributePages > 1) {
      pagination.push(this.totalSpecificationAttributePages);
    }

    return pagination;
  }

  changeSpecificationAttributePage(page: number | string): void {
    if (page === "..." || page === this.currentSpecificationAttributesPage) {
      return;
    }
    this.currentSpecificationAttributesPage = page as number;
    this.getAllSpecificationAttributesList();
  }

  updateSpecificationAttributePageSize(): void {
    this.currentSpecificationAttributesPage = 1;
    this.getAllSpecificationAttributesList();
  }

  //product attribute pagination
  getProductAttributePagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentProductAttributePage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentProductAttributePage - halfRange);
    const endPage = Math.min(this.totalProductAttributePages - 1, this.currentProductAttributePage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentProductAttributePage < this.totalProductAttributePages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalProductAttributePages > 1) {
      pagination.push(this.totalProductAttributePages);
    }

    return pagination;
  }

  changeProductAttributePage(page: number | string): void {
    if (page === "..." || page === this.currentProductAttributePage) {
      return;
    }
    this.currentProductAttributePage = page as number;
    this.getAllProductAttribute();
  }

  updateProductAttributePageSize(): void {
    this.currentProductAttributePage = 1;
    this.getAllProductAttribute();
  }


  //multimedia image pagination
  getMultimediaPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentMultimediaImagePage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentMultimediaImagePage - halfRange);
    const endPage = Math.min(this.totalMultimediaImagePages - 1, this.currentMultimediaImagePage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentMultimediaImagePage < this.totalMultimediaImagePages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalMultimediaImagePages > 1) {
      pagination.push(this.totalMultimediaImagePages);
    }

    return pagination;
  }

  changeMultimediaPage(page: number | string): void {
    if (page === "..." || page === this.currentMultimediaImagePage) {
      return;
    }
    this.currentMultimediaImagePage = page as number;
    this.getAllProductMultiMedia();
  }

  updateMultimediaPageSize(): void {
    this.currentMultimediaImagePage = 1;
    this.getAllProductMultiMedia();
  }


  //multimedia video pagination
  getMultimediaVideoPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentMultimediaVideoPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentMultimediaVideoPage - halfRange);
    const endPage = Math.min(this.totalMultimediaVideoPages - 1, this.currentMultimediaVideoPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentMultimediaVideoPage < this.totalMultimediaVideoPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalMultimediaVideoPages > 1) {
      pagination.push(this.totalMultimediaVideoPages);
    }

    return pagination;
  }

  changeMultimediaVideoPage(page: number | string): void {
    if (page === "..." || page === this.currentMultimediaVideoPage) {
      return;
    }
    this.currentMultimediaVideoPage = page as number;
    this.getAllProductVideo();
  }

  updateMultimediaVideoPageSize(): void {
    this.currentMultimediaVideoPage = 1;
    this.getAllProductVideo();
  }


  //values list pagination
  getValuesPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentValuesPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentValuesPage - halfRange);
    const endPage = Math.min(this.totalValuesPages - 1, this.currentValuesPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentValuesPage < this.totalValuesPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalValuesPages > 1) {
      pagination.push(this.totalValuesPages);
    }

    return pagination;
  }

  changeValuesPage(page: number | string): void {
    if (page === "..." || page === this.currentValuesPage) {
      return;
    }
    this.currentValuesPage = page as number;
    this.getAllProductValues();
  }

  updateValuesPageSize(): void {
    this.currentValuesPage = 1;
    this.getAllProductValues();
  }




  onValueCheckboxChange(event: Event, item: any): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedValues.push(item._id); // Add the selected ID
    } else {
      this.selectedValues = this.selectedValues.filter(id => id !== item._id); // Remove unselected ID
    }

  }


  onRadioChange(item: any): void {
    this.selectedRadioValue = item._id; 
  }

  addNewRelatedProduct(): void {
    const relatedProductObj = {
      productId: this.productId,
      relatedProductIds: this.selectedRelatedProductIds // Pass the selected product IDs
    };
    this.defaultLayoutService.createNewRelatedProduct(relatedProductObj).subscribe(
      (response) => {
        this.relatedProductvisible = !this.relatedProductvisible;

        this.toastr.success('Related product saved successfully')
        this.getAllRelatedProductList(); // Refresh the product list
        this.backToProductSpecificationList();
      },
      (error) => {
        console.error('Error saving product:', error);
        this.toastr.error('Error saving Related product')

      }
    );
  }

  updateSelectedProducts(product: any): void {
    if (product.isChecked) {
      this.selectedRelatedProductIds.push(product._id);
    } else {
      this.selectedRelatedProductIds = this.selectedRelatedProductIds.filter(id => id !== product._id);
    }

    // Check if all products are selected
    this.selectAllChecked = this.allProductList.every((prod: any) => prod.isChecked);
  }

  toggleSelectAllRelatedProduct(): void {
    this.selectedRelatedProductIds = []; // Clear the array
    this.allProductList.forEach((product: any) => {
      product.isChecked = this.selectAllChecked;
      if (this.selectAllChecked) {
        this.selectedRelatedProductIds.push(product._id);
      }
    });
  }


  onColorChange(event: any): void {
    const selectedColor = event.target.value;
  }


  updateRelatedProduct(index: number): void {
    const product = this.relatedProductList[index]; // Get the specific product

    if (product.order !== null && product.order !== undefined) {
      const productsaObj = {
        productId: this.productId,
        id: product._id,
        order: product.order,
      };

      this.defaultLayoutService.updateRelatedProduct(productsaObj).subscribe(
        (response: any) => {
          if (response.meta.code === 200) {
            this.editMode[index] = false;
            this.getAllRelatedProductList();
            this.toastr.success('Related product updated successfully');
          } else {
            console.error('Error updating related:', response);
            this.toastr.error('Error updating related');
          }
        },
        (error) => {
          console.error('Error calling related API:', error);
        }
      );
    }
  }



  deleteRelatedProducts(relatedProduct: any) {
    const relatedProductDeActive = {
      id: relatedProduct._id,
      isDeleted: true
    };
    this.defaultLayoutService.relatedProductActiveDeActive(relatedProductDeActive).subscribe(
      (response) => {
        this.toastr.success('related productdeleted successfully')
        this.getAllRelatedProductList();
      },
      (error) => {
        console.error('Error deleting related product:', error);
        this.toastr.error('Error deleting related product')
      }
    );
  }

  reActiveRelatedProducts(relatedProduct: any) {
    const relatedProductReActive = {
      id: relatedProduct._id,
      isDeleted: false
    };
    this.defaultLayoutService.relatedProductActiveDeActive(relatedProductReActive).subscribe(
      (response) => {
        this.toastr.success('related product active successfully')
        this.getAllRelatedProductList();
      },
      (error) => {
        console.error('Error deleting related product:', error);
        this.toastr.error('Error deleting related product')
      }
    );
  }

  ProductListPage() {
    this.productName = '';
    this.manufacturerId = '';
    this.categoriesId = '';
    this.productType = '';
    this.updateProductListPageSize();
  }

  //   getSafeUrl(url: string): SafeResourceUrl {
  //     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  getSafeUrl(url: string): SafeResourceUrl {
    let embedUrl = url.trim();

    if (embedUrl.includes('youtube.com/shorts/')) {
      embedUrl = embedUrl.replace('youtube.com/shorts/', 'youtube.com/embed/');
    } else if (embedUrl.includes('watch?v=')) {
      embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0]; // Remove extra params
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }


}
