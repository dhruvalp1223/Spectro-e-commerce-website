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
  ThemeDirective, InputGroupComponent,
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import { CommonService } from '../../../shared/common.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.scss',
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
    CardHeaderComponent, InputGroupComponent,
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

export class ShipmentsComponent {
  isAddRoles: boolean = false;
  isAddShipment: boolean = false;
  isEditShipment: boolean = false;
  isEditRoles: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  loading: boolean = false; 

  allShipmentList: any = [];
  allOrderNotesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  shipmentForm!: FormGroup;
  addressForm!: FormGroup;
  orderNotesForm!: FormGroup;
  isAddCustomer: boolean = false;
  isEditCustomer: boolean = false;
  isAddAdress: boolean = false;
  isEditAddress: boolean = false;
  isAddOrderDetail: boolean = false;
  allCountryList: any = [];
  allStateList: any = [];
  collapses = [true, true, true, true];

  shipmentId: any;
  addressId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  Math = Math;
  shipmentData: any;
  //order pagination
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  //address pagination
  orderCurrentPage: number = 1;
  orderPageSize: number = 10;
  totalOrderRecords: number = 0;
  totalOrderPages: number = 1;

  // limit: number = ;
  isShowButton: boolean = false
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
  shipmentIdParams: any;
  addressIdParam: any;
  warehousesList: any;
  warehouseId: string = '';
  selectedOrderImage: any;
  orderNotesImageFile: File | null = null;
  selectedOrderFile: File | null = null;
  selectedOrderFileName: string | null = null;
  showStatusDropdown: boolean = false;
  selectedStatus: any;
  orderStatus: string = '';
  rootUrl: string = '';
  selectedShipmentIds: string[] = [];
  isShipped = false;
  orderIdParams: any;
  isEditingShippedDate: boolean = false;
  isEditingDeliveredDate: boolean = false;
  productList: any = [];
  shipment:any;
  hasShippedBeenSet = false;

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
    if (currentUrl.startsWith('/admin/shipments/Create')) {
      this.route.queryParams.subscribe(params => {
        this.orderIdParams = params['orderId'];
      });
      this.getProductListByOrderId(this.orderIdParams);
      this.isAddShipment = true;
      this.isEditShipment = false;
    } else if (currentUrl.startsWith('/admin/shipments/Edit')) {
      this.route.queryParams.subscribe(params => {
        this.orderIdParams = params['orderId'];
        this.shipmentIdParams = params['shipmentId'];

      });
      this.editShipment(this.shipmentIdParams);
      this.getProductListByOrderId(this.orderIdParams);
      this.isAddShipment = true;
      this.isEditShipment = true;
    }
    else {
      this.isAddShipment = false;
      this.isEditShipment = false;
      this.router.navigate(['/admin/shipments/List']);

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



    this.defaultCustomerForm();
    this.defaultOrderNotesForm();
    this.getAllShipmentList();
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

    this.shipmentForm.get('shipped')?.valueChanges.subscribe(value => {
      this.isShipped = value;
    });
  }



  defaultCustomerForm() {
    this.shipmentForm = this.fb.group({
      trackingNumber: [''],
      adminComment: [''],
      shipped: [false],
      delivered: [false],
      deliveredDate: [''],
      shippedDate: [''],
    });
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


  addCustomer() {
    this.shipmentForm.reset();
    this.defaultCustomerForm();
    this.isAddOrderDetail = true;
    this.isAddCustomer = true;
    this.isEditCustomer = false;
  }

  addAddress() {
    this.router.navigate(['/admin/Customer/AddressCreate'], { queryParams: { shipmentId: this.shipmentIdParams } });
  }

  backToOrderList() {
    this.isEditCustomer = false;
    this.isAddCustomer = false;
    this.isAddOrderDetail = false;
    this.getAllShipmentList();
    this.router.navigate(['/admin/order/List']);

  }

  backToOrderDetail() {
    this.router.navigate(['/admin/order/Edit', this.orderIdParams]);
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

  cancelStatusChange() {
    this.showStatusDropdown = false;
  }

  showEditDeliveredDate(){
    this.hasShippedBeenSet = true;

  }

  setShipment(shipment: any) {
    this.shipment = shipment;
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
    this.getAllShipmentList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllShipmentList();
  }


  toggleSelectAll() {
    this.selectedShipmentIds = [];
    this.allShipmentList.forEach((order: any) => {
      order.isChecked = this.selectAllChecked;
      if (order.isChecked) {
        this.selectedShipmentIds.push(order._id);
      }
    });
  }

  downloadSelectOrders() {
    this.selectedShipmentIds = this.allShipmentList
      .filter((order: any) => order.isChecked)
      .map((order: any) => order._id);

    this.selectAllChecked = this.allShipmentList.every((order: any) => order.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.selectedShipmentIds.length > 0;
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

  editShipment(selectedShipmentId: any) {
    this.defaultCustomerForm();
    this.shipmentId = selectedShipmentId;
    this.defaultLayoutService.getShipmentDetailsById(this.shipmentId).subscribe(
      (response: any) => {
        this.shipmentData = response.data;
        if (this.shipmentData.shippedDate) {
          this.shipmentData.shippedDate = this.shipmentData.shippedDate.split('T')[0];
        }
        if (this.shipmentData.deliveredDate) {
          this.shipmentData.deliveredDate = this.shipmentData.deliveredDate.split('T')[0];
        }
        this.shipmentForm.patchValue(this.shipmentData);
      },
      (error: any) => {
        console.error('Error fetching shipment details:', error);
      }
    );
  }

  createNewShipment(saveAndEdit: boolean) {
    // if (this.shipmentForm.valid) {
    const shipmentData = {
      trackingNumber: this.shipmentForm.value.trackingNumber,
      adminComment: this.shipmentForm.value.adminComment,
      shipped: this.shipmentForm.value.shipped,
      delivered: this.shipmentForm.value.delivered,
      orderId: this.orderIdParams
    };
    this.defaultLayoutService.createShipment(shipmentData).subscribe(
      (response: any) => {
        this.shipmentId = response.data._id
        if (saveAndEdit) {
          this.getAllShipmentList();
          this.backToOrderDetail();
        }
        else {
          // this.editShipment(this.shipmentId);
          this.router.navigate(['/admin/shipments/Edit'], {
            queryParams: {
              orderId: this.orderIdParams,
              shipmentId: this.shipmentId
            }
          });
        }
        this.toastr.success('Shipment saved successfully')
      },
      (error) => {
        console.error('Error saving shipment:', error);
        this.toastr.error('Error saving shipment')

      }
    );
    // } else {
    //   this.shipmentForm.markAllAsTouched();
    // }
  }

  updateShipment() {
    if (this.shipmentForm.valid) {
      const updatedData = {
        trackingNumber: this.shipmentForm.value.trackingNumber,
        adminComment: this.shipmentForm.value.adminComment,
        shippedDate: this.shipmentForm.value.shippedDate,
        deliveredDate: this.shipmentForm.value.deliveredDate,
        orderId: this.orderIdParams,
        id: this.shipmentIdParams
      };
      this.defaultLayoutService.updateShipment(updatedData).subscribe(
        (response: any) => {
          console.log('Shipment updated successfully:', response);
          this.toastr.success('Shipment updated successfully');
          this.editShipment(this.shipmentId);
          this.isEditingDeliveredDate = false;
          this.isEditingShippedDate = false;

          // this.router.navigate(['/admin/shipments/Edit'], {
          //   queryParams: {
          //     orderId: this.orderIdParams,
          //     shipmentId: this.shipmentId
          //   }
          // });
        },
        (error: any) => {
          console.error('Error updating customer:', error);
          this.toastr.error('Error updating customer')
        }
      );
    } else {
      this.shipmentForm.markAllAsTouched();
    }
  }
  editShippedDate() {
    this.isEditingShippedDate = true;
  }

  editDeliveredDate() {
    this.isEditingDeliveredDate = true;
  }

  cancelEditShippedDate() {
    this.isEditingShippedDate = false;
  }

  cancelEditDeliveredDate() {
    this.isEditingDeliveredDate = false;
  }


  getProductListByOrderId(orderIdParams: string) {
    this.defaultLayoutService.getOrderDetailsById(orderIdParams).subscribe(
      (response: any) => {
        this.productList = response.data;
      },
      (error: any) => {
        console.error('Error fetching product details:', error);
      }
    );
  }


  deleteShipment(shipment: any) {
    const shipmentDeActive = {
      id: shipment._id,
      isDeleted: true
    };
    this.defaultLayoutService.shipmentActiveDeActive(shipmentDeActive).subscribe(
      (response) => {
        console.log('shipment deleted successfully:', response);
        this.toastr.success('shipment deleted successfully')
        this.getAllShipmentList();
      },
      (error) => {
        console.error('Error deleting shipment:', error);
        this.toastr.error('Error deleting shipment')

      }
    );
  }

  reActiveShipment(shipment: any) {
    const shipmentReActive = {
      id: shipment._id,
      isDeleted: false
    };
    this.defaultLayoutService.shipmentActiveDeActive(shipmentReActive).subscribe(
      (response) => {
        console.log('shipment active successfully:', response);
        this.toastr.success('shipment active successfully')
        this.getAllShipmentList();
      },
      (error) => {
        console.error('Error active shipment:', error);
        this.toastr.error('Error active shipment')

      }
    );
  }

  deactiveShipment() {
    const shipmentDeActive = {
      id: this.shipmentIdParams,
      isDeleted: true
    };
    this.defaultLayoutService.shipmentActiveDeActive(shipmentDeActive).subscribe(
      (response) => {
        console.log('shipment deleted successfully:', response);
        this.toastr.success('shipment deleted successfully');
        this.editShipment(this.shipmentId);
        this.getAllShipmentList();
      },
      (error) => {
        console.error('Error deleting shipment:', error);
        this.toastr.error('Error deleting shipment')

      }
    );
  }

  activeShipment() {
    const shipmentReActive = {
      id: this.shipmentIdParams,
      isDeleted: false
    };
    this.defaultLayoutService.shipmentActiveDeActive(shipmentReActive).subscribe(
      (response) => {
        console.log('shipment active successfully:', response);
        this.toastr.success('shipment active successfully')
        this.editShipment(this.shipmentId);
        this.getAllShipmentList();
      },
      (error) => {
        console.error('Error active shipment:', error);
        this.toastr.error('Error active shipment')

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


  getAllShipmentList(): void {
    this.loading = true;

    const payload: any = {
      limit: this.pageSize,
      page: this.currentPage,
    };
    this.defaultLayoutService.getAllShipments(payload).subscribe(
      (Response: any) => {
        if (Response.meta.code === 200) {
          this.allShipmentList = Response.data.shipments;
          this.totalRecords = Response.data.totalRecords;
          this.totalPages = Response.data.totalPages;
          this.loading = false;

        } else {
          this.toastr.error('Failed to load Shipment');
          this.loading = false;

        }
      },
      (error) => {
        this.toastr.error('Error fetching Shipment')
      }
    );
  }


}




