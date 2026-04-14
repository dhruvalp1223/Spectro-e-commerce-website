import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, RowComponent, TextColorDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
  ThemeDirective,
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import { CommonService } from '../../../shared/common.service';

@Component({
  standalone: true,
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
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
    RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormCheckInputDirective, ButtonDirective, ThemeDirective
  ]
})

export class OrdersComponent {
  isAddRoles: boolean = false;
  isAddOrder: boolean = false;
  isEditOrder: boolean = false;
  isEditRoles: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  loading: boolean = false; 

  allOrderList: any = [];
  allOrderNotesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  orderForm!: FormGroup;
  addressForm!: FormGroup;
  orderNotesForm!: FormGroup;
  isAddCustomer: boolean = false;
  isEditCustomer: boolean = false;
  isAddAdress: boolean = false;
  isEditAddress: boolean = false;
  isAddOrderDetail: boolean = false;
  allCountryList: any = [];
  allShipmentList: any = [];
  allStateList: any = [];
  collapses = [true, true, true, true];

  orderId: any;
  addressId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  Math = Math;
  orderData: any;
  //order pagination
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  //ordernotes pagination
  totalOrderRecords: number = 0;
  orderCurrentPage: number = 1;
  orderPageSize: number = 10;
  totalOrderPages: number = 1;

  // limit: number = ;
  isShowButton: boolean = false
  customer: any;
  publishes: any = [];
  addressData: any;
  resource: any;
  selectedCategoryImage: any;
  categoryImageFile: File | null = null;
  selectAllChecked: boolean = false;
  allCustomerRoleList: any = [];
  startDate: any = '';
  endDate: any = '';
  billingPhoneNumber: any = '';
  billingEmailAddress: any = '';
  productName: any = '';
  billingLastName: string = '';
  orderStatusesList: any;
  paymentStatusesList: any;
  isBillingAddress: boolean = false
  isShippingAddress: boolean = false


  lastActivityForm: string = '';
  firstName: string = '';
  lastActivityTo: string = '';
  lastName: string = '';
  companyNames: string = '';
  dateOfBirth: string = '';
  ipAddress: string = '';
  registrationDateForm: string = '';
  customerRoles: string[] = [];
  registrationDateTo: string = '';
  orderNotes: any;
  customerName: string = '';
  orderIdParam: any;
  addressIdParam: any;
  warehousesList: any;
  warehouseId: string = '';
  selectedOrderImage: any;
  orderNotesImageFile: File | null = null;
  selectedOrderFile: File | null = null;
  selectedOrderFileName: string | null = null;
  showStatusDropdown: boolean = false;
  isEditingShippedMethod: boolean = false;

  selectedStatus: any; 
  orderStatus: string = '';
  rootUrl: string = '';
  selectedOrderIds: string[] = [];

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,

  ) {
    this.rootUrl = this.commonService.rootData.rootUrl; 
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/order/Create') {
      this.isAddOrder = true;
      this.isAddOrderDetail = false;
      this.isEditOrder = false; 
    } else if (currentUrl.startsWith('/admin/order/Edit/')) {
      this.orderIdParam = this.route.snapshot.paramMap.get('id');
      if (this.orderIdParam) {
        this.editOrder(this.orderIdParam);
      }
      this.isAddOrder = false;
      this.isEditOrder = true;
      this.isAddOrderDetail = true;

    }
  
    else if (currentUrl.startsWith('/admin/order/AddressEdit')) {
      this.route.queryParams.subscribe(params => {
        this.addressIdParam = params['shippingAddressId'] || params['billingAddressId'];
        this.orderIdParam = params['orderId'];

        this.isAddOrder = false;
        this.isAddOrderDetail = false;
        this.isEditOrder = false;
        this.isAddAdress = true;
        this.isEditAddress = true;

        this.isBillingAddress = !!params['billingAddressId'];
        this.isShippingAddress = !!params['shippingAddressId'];

        if (this.isShippingAddress) {
          this.editShippingAddress(this.addressIdParam);
        } else if (this.isBillingAddress) {
          this.editBillingAddressId(this.addressIdParam);
        }
      });
    }
    else {
      this.isAddOrder = true;
      this.isEditOrder = false;
      this.router.navigate(['/admin/order/List']);

    }
    let pagePermission = { menuName: "Orders" }
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



    this.defaultOrderNotesForm();
    this.getAllOrderList();
    this.getPageResourcesList();
    this.getAllCustomerRoleList();
    this.defaultAddressForm();
    this.getAllCountryList();
    this.getAllActiveWarehouseList();

    this.orderStatusesList = [
      { label: 'All', value: '' },
      { label: 'Pending', value: '1' },
      { label: 'Shipped', value: '2' },
      { label: 'Delivered', value: '3' },
      { label: 'Cancelled', value: '4' },
    ];

    this.paymentStatusesList = [
      { label: 'All', value: 'All' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Authorized', value: 'Authorized' },
      { label: 'Paid', value: 'Paid' },
      { label: 'Partially refunded', value: 'Partially refunded' },
      { label: 'Refunded', value: 'Refunded' },
      { label: 'Voided', value: 'Voided' },
    ];
  }



 

  defaultAddressForm() {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // companyName: [''],
      countryId: [],
      stateId: [''],
      // region: [''],
      city: ['', Validators.required],
      address1: ['', Validators.required],
      // address2: [''],
      zipCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      // faxNumber: [''],
    });
  }


  defaultOrderNotesForm() {
    this.orderNotesForm = this.fb.group({
      note: ['', Validators.required],
      displayToCustomer: [false],
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


  addAddress() {
    this.router.navigate(['/admin/Customer/AddressCreate'], { queryParams: { orderId: this.orderIdParam } });
  }

  backToOrderList() {
    this.isEditCustomer = false;
    this.isAddCustomer = false;
    this.isAddOrderDetail = false;
    this.getAllOrderList();
    this.router.navigate(['/admin/order/List']);

  }

  backToAddressList() {
    this.router.navigate(['/admin/order/Edit', this.orderIdParam]);
  }

  toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
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

  editShippedDate() {
    this.isEditingShippedMethod = true;
  }

  cancelEditShippedDate() {
    this.isEditingShippedMethod = false;
  }
  cancelStatusChange() {
    this.showStatusDropdown = false;
  }
  setCustomer(customer: any) {
    this.customer = customer;
  }

  setOrderNotes(orderNotes: any) {
    this.orderNotes = orderNotes;
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
    this.getAllOrderList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllOrderList();
  }


  toggleSelectAll() {
    this.selectedOrderIds = [];
    this.allOrderList.forEach((order: any) => {
      order.isChecked = this.selectAllChecked;
      if (order.isChecked) {
        this.selectedOrderIds.push(order._id);
      }
    });
  }
  
  downloadSelectOrders() {
    this.selectedOrderIds = this.allOrderList
      .filter((order: any) => order.isChecked)
      .map((order: any) => order._id);
  
    this.selectAllChecked = this.allOrderList.every((order: any) => order.isChecked);
  }
  
  isAnyRowSelected(): boolean {
    return this.selectedOrderIds.length > 0;
  }

  getAllCustomerRoleList(): void {
    this.defaultLayoutService.getAllActiveCustomerRole(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCustomerRoleList = Response.data;
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




  getAllOrderList(): void {
    this.loading = true;

    if (!Array.isArray(this.customerRoles)) {
      this.customerRoles = [];
    }

    const payload: any = {
      billingPhoneNumber: this.billingPhoneNumber,
      billingLastName: this.billingLastName,
      productName: this.productName,
      billingEmailAddress: this.billingEmailAddress,
      orderStatus: this.orderStatus,
      warehouseId: this.warehouseId,
      limit: this.pageSize,
      page: this.currentPage
    };
    Object.keys(payload).forEach(key => {
      if (
        payload[key] === '' ||
        payload[key] === null ||
        payload[key] === undefined ||
        (Array.isArray(payload[key]) && payload[key].length === 0)
      ) {
        delete payload[key];
      }
    }
    );

    this.defaultLayoutService.getAllOrders(payload).subscribe(
      (Response: any) => {
        if (Response.meta.code === 200) {
          this.allOrderList = Response.data.orders;
          this.totalRecords = Response.data.totalRecords;
          this.totalPages = Response.data.totalPages;
          this.loading = false;

        } else {
          this.toastr.error('Failed to load Orders')
          this.loading = false;

        }
      },
      (error) => {
        this.toastr.error('Error fetching orders')
      }
    );

  }





  editOrder(selectedOrderId: any) {
    this.getAllOrderNotesList();
    this.getAllShipmentList();
    this.orderId = selectedOrderId;
    this.defaultLayoutService.getOrderDetailsById(this.orderId).subscribe(
      (response: any) => {
        this.orderData = response.data;
        this.orderForm.patchValue(this.orderData);
      },
      (error: any) => {
        console.error('Error fetching order details:', error);
      }
    );
  }

  getAllOrderNotesList(): void {

    const payload: any = {
      limit: this.orderPageSize,
      page: this.orderCurrentPage,
      orderId: this.orderIdParam
    };
    this.defaultLayoutService.getAllOrdersNotesList(payload).subscribe(
      (Response: any) => {
        if (Response.meta.code === 200) {
          this.allOrderNotesList = Response.data.orderNotes;
          this.totalOrderRecords = Response.data.totalRecords;
          this.totalOrderPages = Response.data.totalPages;
        } else {
          this.toastr.error('Failed to load Orders')
        }
      },
      (error) => {
        this.toastr.error('Error fetching orders')
      }
    );

  }

  createNewOrderNotes() {
    if (this.orderNotesForm.valid) {
      const formData = new FormData();

      Object.entries(this.orderNotesForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      if (this.orderNotesImageFile) {
        formData.append('orderNotesImage', this.orderNotesImageFile, this.orderNotesImageFile.name);
      }

      if (this.selectedOrderFile) {
        formData.append('orderNotesImage', this.selectedOrderFile, this.selectedOrderFile.name);
      }

      formData.append('orderId', this.orderId);


      this.defaultLayoutService.CreateOrderNotes(formData).subscribe(
        (response: any) => {
          console.log('Order Notes saved successfully:', response);
          this.toastr.success('Order Notes saved successfully');
          this.orderNotesForm.reset(); 
          this.selectedOrderImage = null; 
          this.orderNotesImageFile = null;
          this.selectedOrderFile = null;
          this.selectedOrderFileName = null;
          this.getAllOrderNotesList();
        },
        (error) => {
          console.error('Error saving order notes:', error);
          this.toastr.error('Error saving order notes');
        }
      );
    } else {
      this.orderNotesForm.markAllAsTouched();
    }
  }


  downloadSelectedOrders() {
    const selectedIds = this.allOrderList
      .filter((order: any) => order.isChecked)
      .map((order: any) => order._id);


    if (selectedIds.length > 0) {
      this.defaultLayoutService.downloadOrders({ selectedOrderIds: selectedIds }).subscribe(
        (response: any) => {
          console.log('order download successfully:', response);

          this.getAllOrderList();
          this.selectAllChecked = false;
          this.allOrderList.forEach((order: any) => {
            order.isChecked = this.selectAllChecked;
          });
          this.downloadSelectOrders();
          this.toggleSelectAll();
        },
        (error) => {
          console.error('Error downloading order:', error);
          this.toastr.error('Error downloading order')
        }
      );
    } else {
      console.log('No customer selected.');
    }
  }


  deactiveOrder() {
    const orderDeActive = {
      id: this.orderIdParam,
      isDeleted: true
    };
    this.defaultLayoutService.customerActiveDeActive(orderDeActive).subscribe(
      (response) => {
        console.log('customer deleted successfully:', response);
        this.toastr.success('Customer deleted successfully');
        this.editOrder(this.orderId);
        this.getAllOrderList();
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.toastr.error('Error deleting customer')

      }
    );
  }

  activeOrder() {
    const orderReActive = {
      id: this.orderIdParam,
      isDeleted: false
    };
    this.defaultLayoutService.customerActiveDeActive(orderReActive).subscribe(
      (response) => {
        console.log('customer active successfully:', response);
        this.toastr.success('customer active successfully')
        this.editOrder(this.orderId);
        this.getAllOrderList();
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.toastr.error('Error deleting customer')

      }
    );
  }


 

  getAllCountryList() {
    this.defaultLayoutService.getAllActiveCountry(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCountryList = Response.data;
      }
    })
  }

  onCountryChange(event: any): void {
    const countryId = event?._id || null;
    this.addressForm.get('countryId')?.setValue(countryId);  
    this.addressForm.get('stateId')?.reset();
    this.allStateList = [];
    if (countryId) {
      this.getStateByCountryId(countryId);
    } else {
      this.allStateList = [];  
    }
  }

  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event, inputId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (inputId === 'orderNotesImage') {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedOrderImage = e.target?.result as string;
          this.orderNotesImageFile = file;
        };
        reader.readAsDataURL(file);
      } else if (inputId === 'orderNotesFile') {
        this.selectedOrderFile = file;
        this.selectedOrderFileName = file.name;
      }
    } else {
      console.log('No file selected');
    }
  }

  removeFile(event: Event, inputId: string): void {
    event.stopPropagation();
    if (inputId === 'orderNotesFile') {
      this.selectedOrderFile = null;
      this.selectedOrderFileName = null;
    }
  }


  removeImage(event: Event, inputId: string): void {
    event.stopPropagation();
    if (inputId === 'orderNotesImage') {
      this.selectedOrderImage = null;
      this.orderNotesImageFile = null;
      // this.sliderForm.get('orderNotesImage')?.setValue(null); // Reset form control
      // this.sliderForm.get('orderNotesImage')?.markAsTouched();
    }
  }


  getStateByCountryId(countryId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.defaultLayoutService.getActiveStateDetailsByCountryId({ countryId }).subscribe(
        (response: any) => {
          if (response.meta?.code === 200) {
            this.allStateList = response.data || [];
            console.log('State List:', this.allStateList);
            resolve(); 
          } else {
            this.allStateList = []; 
            console.warn('No states found for the selected country.');
            resolve(); 
          }
        },
        (error) => {
          console.error('Error fetching states:', error);
          this.allStateList = []; 
          reject(error); 
        }
      );
    });
  }

  updateAddress(): void {
    if (this.addressForm.valid) {
      const updatedData = {
        firstName: this.addressForm.value.firstName,
        lastName: this.addressForm.value.lastName,
        email: this.addressForm.value.email,
        // companyName: this.addressForm.value.companyName,
        countryId: this.addressForm.value.countryId,
        stateId: this.addressForm.value.stateId,
        // region: this.addressForm.value.region,
        city: this.addressForm.value.city,
        address1: this.addressForm.value.address1,
        // address2: this.addressForm.value.address2,
        zipCode: this.addressForm.value.zipCode,
        phoneNumber: this.addressForm.value.phoneNumber,
        // faxNumber: this.addressForm.value.faxNumber,
        orderId: this.orderIdParam,
        id: this.addressIdParam
      };

      if (this.isBillingAddress) {
        this.defaultLayoutService.updateBillingAddress(updatedData).subscribe(
          (response: any) => {
            this.toastr.success('Address updated successfully');
            this.backToAddressList();
          },
          (error: any) => {
            console.error('Error updating Address:', error);
            this.toastr.error('Error updating Address');
          }
        );
      }
      else if (this.isShippingAddress) {
        this.defaultLayoutService.updateShippingAddress(updatedData).subscribe(
          (response: any) => {
            this.toastr.success('Address updated successfully');
            this.backToAddressList();
          },
          (error: any) => {
            console.error('Error updating Address:', error);
            this.toastr.error('Error updating Address')

          }
        );
      }

    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  editBillingAddressParams(AddressId: any) {
    this.router.navigate(['/admin/order/AddressEdit'], { queryParams: { orderId: this.orderIdParam, billingAddressId: AddressId } });
  }


  editShippingAddressParams(AddressId: any) {
    this.router.navigate(['/admin/order/AddressEdit'], { queryParams: { orderId: this.orderIdParam, shippingAddressId: AddressId } });
  }

  editBillingAddressId(selectedAddressId: any) {
    this.addressId = selectedAddressId;
    this.defaultLayoutService.getBillingAddressDetailsByOrderId(this.addressId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.addressData = response.data;
          this.addressForm.patchValue(this.addressData);
          this.getStateByCountryId(this.addressData.countryId).then(() => {
            const selectedState = this.allStateList.find(
              (state: any) => state.stateName === this.addressData.stateId
            );
            if (selectedState) {
              this.addressForm.get('stateId')?.setValue(selectedState._id);
            }
          }).catch((error) => {
            console.error('Error fetching states:', error);
          });
        } else {
          console.error('Failed to fetch address details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching address details:', error);
      }
    );
  }


  editShippingAddress(selectedAddressId: any) {
    this.addressId = selectedAddressId;
    this.defaultLayoutService.getShippingAddressDetailsByOrderId(this.addressId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.addressData = response.data;
          this.addressForm.patchValue(this.addressData);
          this.getStateByCountryId(this.addressData.countryId).then(() => {
            const selectedState = this.allStateList.find(
              (state: any) => state.stateName === this.addressData.stateId
            );
            if (selectedState) {
              this.addressForm.get('stateId')?.setValue(selectedState._id);
            }
          }).catch((error) => {
            console.error('Error fetching states:', error);
          });
        } else {
          console.error('Failed to fetch address details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching address details:', error);
      }
    );
  }

  deleteOrderNotes(orderNotes: any) {
    const orderNotesDeActive = {
      id: orderNotes._id,
      isDeleted: true
    };
    this.defaultLayoutService.orderNotesActiveDeActive(orderNotesDeActive).subscribe(
      (response) => {
        console.log('orderNotes deleted successfully:', response);
        this.toastr.success('orderNotes deleted successfully')
        this.getAllOrderNotesList();
      },
      (error) => {
        console.error('Error deleting orderNotes:', error);
        this.toastr.error('Error deleting orderNotes')

      }
    );
  }

  reActiveOrderNotes(orderNotes: any) {
    const orderNotesReActive = {
      id: orderNotes._id,
      isDeleted: false
    };
    this.defaultLayoutService.orderNotesActiveDeActive(orderNotesReActive).subscribe(
      (response) => {
        console.log('orderNotes active successfully:', response);
        this.toastr.success('orderNotes active successfully')
        this.getAllOrderNotesList();
      },
      (error) => {
        console.error('Error deleting orderNotes:', error);
        this.toastr.success('Error deleting orderNotes')

      }
    );
  }

  statusChange() {
    const updatedData = {
      orderStatus: this.selectedStatus,
      orderId: this.orderId
    };
    this.defaultLayoutService.updateOrderStatus(updatedData).subscribe(
      (response: any) => {
        console.log('Status change successfully:', response);
        this.toastr.success('Status change successfully');
        this.editOrder(this.orderId);
        this.showStatusDropdown = false; 

      });
  }



  getOrderPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.orderCurrentPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.orderCurrentPage - halfRange);
    const endPage = Math.min(this.totalOrderPages - 1, this.orderCurrentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.orderCurrentPage < this.totalOrderPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalOrderPages > 1) {
      pagination.push(this.totalOrderPages);
    }

    return pagination;
  }

  changeOrderPage(page: number | string): void {
    if (page === "..." || page === this.orderCurrentPage) {
      return;
    }
    this.orderCurrentPage = page as number;
    this.getAllOrderNotesList();
  }

  updateOrderPageSize(): void {
    this.orderCurrentPage = 1;
    this.getAllOrderNotesList();
  }


  getAllShipmentList(): void {
    const payload: any = {
      // limit: this.orderPageSize,
      // page: this.orderCurrentPage,
      orderId: this.orderIdParam
    };
    this.defaultLayoutService.getAllShipments(payload).subscribe(
      (Response: any) => {
        if (Response.meta.code === 200) {
          this.allShipmentList = Response.data.shipments;
          // this.totalOrderRecords = Response.data.totalRecords;
          // this.totalOrderPages = Response.data.totalPages;
        } else {
          this.toastr.error('Failed to load Shipment')
        }
      },
      (error) => {
        this.toastr.error('Error fetching Shipment')
      }
    );

  }


}



