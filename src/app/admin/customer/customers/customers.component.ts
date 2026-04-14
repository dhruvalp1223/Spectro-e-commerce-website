import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective, FormLabelDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective, FormSelectDirective,
  ToasterComponent,
  ToasterPlacement
} from '@coreui/angular';

import { ToastrService } from 'ngx-toastr'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { AppToastComponent } from '../../../views/notifications/toasters/toast-simple/toast.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
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
    RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, FormCheckInputDirective, ButtonDirective, ThemeDirective
  ]
})

export class CustomersComponent implements OnInit {

  allCustomerList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  customerForm!: FormGroup;
  addressForm!: FormGroup;
  isAddCustomer: boolean = false;
  isEditCustomer: boolean = false;
  isAddAdress: boolean = false;
  isEditAddress: boolean = false;
  isAddCustomerDetail: boolean = false;
  allCountryList: any = [];
  allAddressList: any = [];
  allStateList: any = [];
  collapses = [true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  customerId: any;
  addressId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  Math = Math;
  customerData:any;
  //customer pagination
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  //address pagination
  predefinedCurrentPage: number = 1;
  predefinedPageSize: number = 10;
  totalAddressRecords: number = 0;
  totalAddressPages: number = 1;

  // limit: number = ;
  isShowButton: boolean = false
  customer: any;
  publishes: any = [];
  addressData:any;
  resource: any;
  selectedCategoryImage: any;
  categoryImageFile: File | null = null;
  selectAllChecked: boolean = false;
  allCustomerRoleList: any = [];
  email: string = '';
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
  address: any;
  customerName: string = '';
  customerIdParam: any;
  addressIdParam: any;
  loading: boolean = false; 
  todayDate: any;

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/Customer/Create') {
      this.isAddCustomerDetail = true;
      this.isEditAddress = false;
      this.isAddCustomer = true;
    } else if (currentUrl.startsWith('/admin/Customer/Edit/')) {
      this.customerIdParam = this.route.snapshot.paramMap.get('id');
      if (this.customerIdParam) {
        this.editCustomer(this.customerIdParam);
      }
    }
    else if (currentUrl.startsWith('/admin/Customer/AddressCreate')) {
      this.route.queryParams.subscribe(params => {
        this.customerIdParam = params['customerId'];
      });
      this.isAddCustomer = true;
      this.isAddCustomerDetail = false;
      this.isEditCustomer = false;
      this.isAddAdress = true;
      this.getAllCountryList();
    }
    else if (currentUrl.startsWith('/admin/Customer/AddressEdit')) {
      this.route.queryParams.subscribe(params => {
        this.addressIdParam = params['addressid'];
        this.customerIdParam = params['customerId'];
      });
      this.isAddCustomer = true;
      this.isAddCustomerDetail = false;
      this.isEditCustomer = false;
      this.isAddAdress = true;
      this.isEditAddress = true;
      this.editAddress(this.addressIdParam);
    }
    else {
      this.isAddCustomer = false;
      this.isEditAddress = false;
      this.router.navigate(['/admin/Customer/List']);
    }
    let pagePermission = { menuName: "Customers" }
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
    this.todayDate = new Date().toISOString().split('T')[0];

    this.defaultCustomerForm();
    this.getAllCustomerList();
    this.getPageResourcesList();
    this.getAllCustomerRoleList();
    this.defaultAddressForm();
    this.getAllCountryList();
    this.publishes = [
      { label: 'All', value: '' },
      { label: 'Published only', value: 'true' },
      { label: 'Unpublished only', value: 'false' },
    ];
    // this.toastr.success('welcome')
  }

  defaultCustomerForm() {
    this.customerForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      pwd: [''],
      firstName: [''],
      lastName: [''],
      gender: [''],
      dob: [''],
      companyName: [''],
      isTaxExempt: [false],
      customerRoleId: ['',Validators.required],
      active: [false],
      adminComment: [''],
    });
  }

  defaultAddressForm() {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      companyName: [''],
      countryId: ['', Validators.required],
      stateId: [''],
      region: [''],
      city: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      zipCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      faxNumber: [''],
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

  limitContactLength(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }
  
  addCustomer() {
    this.customerForm.reset();
    this.defaultCustomerForm();
    this.isAddCustomerDetail = true;
    this.isAddCustomer = true;
    this.isEditCustomer = false;
  }

  addAddress() {
    this.router.navigate(['/admin/Customer/AddressCreate'], { queryParams: { customerId: this.customerIdParam } });
  }

  backToCustomerList() {
    this.isEditCustomer = false;
    this.isAddCustomer = false;
    this.isAddCustomerDetail = false;
    this.getAllCustomerList();
    this.router.navigate(['/admin/Customer/List']);

  }

  backToAddressList() {
    this.router.navigate(['/admin/Customer/Edit', this.customerIdParam]);
    // this.isAddCustomerDetail = true;
    // this.isAddCustomer = true;
    // this.isEditCustomer = true;
    // this.isAddAdress = false;
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


  setCustomer(customer: any) {
    this.customer = customer;
  }

  setAddress(address: any) {
    this.address = address;
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
    this.getAllCustomerList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getAllCustomerList();
  }


  toggleSelectAll() {
    this.allCustomerList.forEach((customer: any) => {
      customer.isChecked = this.selectAllChecked;
    });
  }

  updateSelectAllCustomer() {
    this.selectAllChecked = this.allCustomerList.every((customer: any) => customer.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.allCustomerList.some((customer: any) => customer.isChecked);
  }

  getAllCustomerRoleList(): void {
    this.defaultLayoutService.getAllActiveCustomerRole(null).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCustomerRoleList = Response.data;
      }
    });
  }



  getAllCustomerList(): void {
    this.loading = true;
    if (!Array.isArray(this.customerRoles)) {
      this.customerRoles = [];
    }

    const payload: any = {
      email: this.email,
      lastActivityForm: this.lastActivityForm,
      firstName: this.firstName,
      lastActivityTo: this.lastActivityTo,
      lastName: this.lastName,
      companyName: this.companyNames,
      dob: this.dateOfBirth,
      ipAddress: this.ipAddress,
      registrationDateForm: this.registrationDateForm,
      customerRoles: this.customerRoles, // Send as an array
      registrationDateTo: this.registrationDateTo,
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
    });

    this.defaultLayoutService.getAllCustomer(payload).subscribe(
      (Response: any) => {
        if (Response.meta.code === 200) {
          this.allCustomerList = Response.data.customers;
          this.totalRecords = Response.data.totalRecords;
          this.totalPages = Response.data.totalPages;
          this.loading = false;

        } else {
          this.toastr.error('Failed to load customer');
          this.loading = false;


        }
      },
      (error) => {
        this.toastr.error('Error fetching customer')
      }
    );

  }





  editCustomer(selectedCustomerId: any) {
    this.defaultCustomerForm();
    this.customerId = selectedCustomerId;
    this.isAddCustomerDetail = true;
    this.isAddCustomer = true;
    this.isEditCustomer = true;
    this.defaultLayoutService.getCustomerDetailsById(this.customerId).subscribe(
      (response: any) => {
        this.customerData = { ...response.data };
        if ( this.customerData.dob) {
          this.customerData.dob =  this.customerData.dob.split('T')[0];
        }
        this.customerName = `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim();
        this.customerForm.patchValue( this.customerData);
        this.getAllAddressList();
      },
      (error: any) => {
        console.error('Error fetching customer details:', error);
      }
    );
  }


  createNewCustomer(saveAndEdit: boolean) {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      this.defaultLayoutService.createCustomer(customerData).subscribe(
        (response : any) => {
          this.customerId = response.data._id
          console.log('Customer saved successfully:', response);
          if (saveAndEdit) {
            this.backToCustomerList();
            this.getAllCustomerList();
          }
          else{
            // this.editCustomer(this.customerId)
    this.router.navigate(['/admin/Customer/Edit', this.customerId]);
          }
          this.toastr.success('Customer saved successfully')
        },
        (error) => {
          console.error('Error saving customer:', error);
          this.toastr.error('Error saving customer')

        }
      );
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  updateCustomer(saveAndEdit: boolean) {
    if (this.customerForm.valid) {
      const updatedData = {
        email: this.customerForm.value.email,
        pwd: this.customerForm.value.pwd,
        firstName: this.customerForm.value.firstName,
        lastName: this.customerForm.value.lastName,
        gender: this.customerForm.value.gender,
        dob: this.customerForm.value.dob,
        companyName: this.customerForm.value.companyName,
        isTaxExempt: this.customerForm.value.isTaxExempt,
        customerRoleId: this.customerForm.value.customerRoleId,
        active: this.customerForm.value.active,
        adminComment: this.customerForm.value.adminComment,
        id: this.customerId
      };
      this.defaultLayoutService.updateCustomer(updatedData).subscribe(
        (response: any) => {
          console.log('customer updated successfully:', response);
          this.toastr.success('Customer updated successfully')
          if (saveAndEdit) {
            this.backToCustomerList();
            this.isAddCustomer = false;
            this.getAllCustomerList();
          }
          else{this.editCustomer(this.customerId)}
        },
        (error: any) => {
          console.error('Error updating customer:', error);
          this.toastr.error('Error updating customer')
        }
      );
    } else {
      this.customerForm.markAllAsTouched();
    }
  }


  deleteCustomer(customer: any) {
    const customerDeActive = {
      ids: [customer._id],
      isDeleted: true
    };
    this.defaultLayoutService.customerActiveDeActive(customerDeActive).subscribe(
      (response) => {
        console.log('customer deleted successfully:', response);
        this.toastr.success('Customer deleted successfully')
        this.getAllCustomerList();
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.toastr.error('Error deleting customer')

      }
    );
  }

  reActiveCustomer(customer: any) {
    const customerReActive = {
      ids: [customer._id],
      isDeleted: false
    };
    this.defaultLayoutService.customerActiveDeActive(customerReActive).subscribe(
      (response) => {
        console.log('customer active successfully:', response);
        this.toastr.success('customer active successfully')

        this.getAllCustomerList();
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.toastr.error('Error deleting customer')

      }
    );
  }


  deleteSelectedCustomer() {
    // Step 1: Get the selected countries' IDs
    const selectedIds = this.allCustomerList
      .filter((customer: any) => customer.isChecked)  // Only selected countries
      .map((customer: any) => customer._id);  // Extract the customer IDs

    // Step 2: Prepare the request data
    const requestData = {
      ids: selectedIds,  // Array of selected customer IDs
      isDeleted: 'true'  // Set isDeleted to true to unpublish them
    };

    // Step 3: Check if there are selected countries
    if (selectedIds.length > 0) {
      // Call the API to unpublish selected countries
      this.defaultLayoutService.customerActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('customer unpublished successfully:', response);
          this.toastr.success('customer unpublished successfully')

          // You can refresh the country list or update the UI after successful API call
          this.getAllCustomerList();
          this.selectAllChecked = false;
          this.allCustomerList.forEach((customer: any) => {
            customer.isChecked = this.selectAllChecked;
          });
          this.updateSelectAllCustomer();
          this.toggleSelectAll();


        },
        (error) => {
          console.error('Error unpublishing customer:', error);
          this.toastr.error('Error unpublishing customer')

        }
      );
    } else {
      // If no countries are selected, show a message or handle the case
      console.log('No customer selected.');
    }
  }


  deactiveCustomer() {
    const customerDeActive = {
      ids: [this.customerId],
      isDeleted: true
    };
    this.defaultLayoutService.customerActiveDeActive(customerDeActive).subscribe(
      (response) => {
        console.log('customer deleted successfully:', response);
        this.toastr.success('Customer deleted successfully');
        this.editCustomer(this.customerId);
        this.getAllCustomerList();
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.toastr.error('Error deleting customer')

      }
    );
  }

  activeCustomer() {
    const customerReActive = {
      ids: [this.customerId],
      isDeleted: false
    };
    this.defaultLayoutService.customerActiveDeActive(customerReActive).subscribe(
      (response) => {
        console.log('customer active successfully:', response);
        this.toastr.success('customer active successfully')
        this.editCustomer(this.customerId);
        this.getAllCustomerList();
      },
      (error) => {
        console.error('Error deleting customer:', error);
        this.toastr.error('Error deleting customer')

      }
    );
  }


  changePassword() {
    if (this.customerForm.valid) {
      const updatedData = {
        newPassword: this.customerForm.value.pwd,
        id: this.customerId
      };

      this.defaultLayoutService.updatePassword(updatedData).subscribe(
        (response: any) => {
          console.log('password updated successfully:', response);
          this.toastr.success('password updated successfully')

          // this.isAddCustomer = false;
          // this.backToCustomerList();
          // this.getAllCustomerList();
        },
        (error: any) => {
          console.error('Error updating password:', error);
          this.toastr.error('Error updating password')

        }
      );
    } else {
      // this.customerForm.markAllAsTouched();
    }
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
    this.addressForm.get('countryId')?.setValue(countryId);  // Set the new country

    // Reset the selected state (stateId) when country is changed
    this.addressForm.get('stateId')?.reset();

    // Clear the state list before fetching new states
    this.allStateList = [];

    // Fetch new states based on the selected country
    if (countryId) {
      this.getStateByCountryId(countryId);
    } else {
      this.allStateList = [];  // Reset the state list if no country is selected
    }
  }




  getStateByCountryId(countryId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.defaultLayoutService.getActiveStateDetailsByCountryId({ countryId }).subscribe(
        (response: any) => {
          if (response.meta?.code === 200) {
            this.allStateList = response.data || [];
            resolve(); // Resolve the promise after state list is fetched
          } else {
            this.allStateList = []; // Reset state list if no states are found
            console.warn('No states found for the selected country.');
            resolve(); // Resolve even when no states are found
          }
        },
        (error) => {
          console.error('Error fetching states:', error);
          this.allStateList = []; // Handle error with a fallback
          reject(error); // Reject the promise on error
        }
      );
    });
  }


  getAllAddressList() {
    this.defaultLayoutService.getAllCustomerAddress({
      limit: this.pageSize,
      page: this.currentPage,
      customerId: this.customerId
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allAddressList = Response.data.customerAddresses;
        this.totalAddressRecords = Response.data.totalRecords;  
        this.totalAddressPages = Response.data.totalPages;   
      }
    })
  }


  createAddress(saveAndEdit: boolean) {
    if (this.addressForm.valid) {
      const addressData = {
        firstName: this.addressForm.value.firstName,
        lastName: this.addressForm.value.lastName,
        email: this.addressForm.value.email,
        companyName: this.addressForm.value.companyName,
        countryId: this.addressForm.value.countryId,
        stateId: this.addressForm.value.stateId,
        region: this.addressForm.value.region,
        city: this.addressForm.value.city,
        address1: this.addressForm.value.address1,
        address2: this.addressForm.value.address2,
        zipCode: this.addressForm.value.zipCode,
        phoneNumber: this.addressForm.value.phoneNumber,
        faxNumber: this.addressForm.value.faxNumber,
        customerId: this.customerIdParam
      };
      this.defaultLayoutService.createCustomerAddress(addressData).subscribe(
        (response:any) => {
          console.log('address saved successfully:', response);
          this.addressId=response.data._id;
          this.toastr.success('Address saved successfully');
          if (saveAndEdit) {
            this.isAddCustomerDetail = true;
            this.isAddCustomer = true;
            this.isEditCustomer = true;
            this.isEditAddress = false;
            this.isAddAdress = false;
            this.backToAddressList();
            this.getAllAddressList();
          }
          else{
           this.editAddressParams(this.addressId);
            // this.editAddress(this.addressId);
          }
          // this.getAllAddressList();
        },
        (error) => {
          console.error('Error saving address:', error);
          this.toastr.error('Error saving address')

        }
      );
    } else {
      this.addressForm.markAllAsTouched();
    }
  }


  updateAddress(saveAndEdit: boolean): void {
    if (this.addressForm.valid) {
      const updatedData = {
        firstName: this.addressForm.value.firstName,
        lastName: this.addressForm.value.lastName,
        email: this.addressForm.value.email,
        companyName: this.addressForm.value.companyName,
        countryId: this.addressForm.value.countryId,
        stateId: this.addressForm.value.stateId,
        region: this.addressForm.value.region,
        city: this.addressForm.value.city,
        address1: this.addressForm.value.address1,
        address2: this.addressForm.value.address2,
        zipCode: this.addressForm.value.zipCode,
        phoneNumber: this.addressForm.value.phoneNumber,
        faxNumber: this.addressForm.value.faxNumber,
        customerId: this.customerIdParam,
        id: this.addressId
      };

      this.defaultLayoutService.updateCustomerAddress(updatedData).subscribe(
        (response: any) => {
          this.toastr.success('Address updated successfully')
          if (saveAndEdit) {
            this.isAddCustomerDetail = true;
            this.isAddCustomer = true;
            this.isEditCustomer = true;
            this.isEditAddress = false;
            this.isAddAdress = false;
            this.backToAddressList();
            this.getAllAddressList();
          }
          else{
            this.editAddress(this.addressId);
          }
        },
        (error: any) => {
          console.error('Error updating Address:', error);
          this.toastr.error('Error updating Address')

        }
      );
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  editAddressParams(AddressId: any) {
    this.router.navigate(['/admin/Customer/AddressEdit'], { queryParams: { customerId: this.customerIdParam, addressid: AddressId } });
  }

  editAddress(selectedAddressId: any) {
    this.addressId = selectedAddressId;
    this.isAddCustomer = true;
    this.isAddCustomerDetail = false;
    this.isEditCustomer = false;
    this.isAddAdress = true;
    this.isEditAddress = true;
    this.defaultLayoutService.getAddressDetailsById(this.addressId).subscribe(
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

  deleteAddress(address: any) {
    const addressDeActive = {
      id: address._id,
      isDeleted: true
    };
    this.defaultLayoutService.addressActiveDeActive(addressDeActive).subscribe(
      (response) => {
        console.log('address deleted successfully:', response);
        this.toastr.success('Address deleted successfully')
        this.getAllAddressList();
      },
      (error) => {
        console.error('Error deleting address:', error);
        this.toastr.error('Error deleting address')

      }
    );
  }

  reActiveAddress(address: any) {
    const addressReActive = {
      id: address._id,
      isDeleted: false
    };
    this.defaultLayoutService.addressActiveDeActive(addressReActive).subscribe(
      (response) => {
        console.log('address active successfully:', response);
        this.toastr.success('Address active successfully')
        this.getAllAddressList();
      },
      (error) => {
        console.error('Error deleting address:', error);
        this.toastr.success('Error deleting address')

      }
    );
  }



  deactiveAddress() {
    const addressDeActive = {
      id: this.addressId,
      isDeleted: true
    };
    this.defaultLayoutService.addressActiveDeActive(addressDeActive).subscribe(
      (response) => {
        console.log('address deleted successfully:', response);
        this.toastr.success('Address deleted successfully')
        this.editAddress(this.addressId);
        this.getAllAddressList();
      },
      (error) => {
        console.error('Error deleting address:', error);
        this.toastr.error('Error deleting address')

      }
    );
  }

  activeAddress() {
    const addressReActive = {
      id: this.addressId,
      isDeleted: false
    };
    this.defaultLayoutService.addressActiveDeActive(addressReActive).subscribe(
      (response) => {
        console.log('address active successfully:', response);
        this.toastr.success('Address active successfully')
        this.editAddress(this.addressId);
        this.getAllAddressList();
      },
      (error) => {
        console.error('Error deleting address:', error);
        this.toastr.success('Error deleting address')

      }
    );
  }

  getAddressPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.predefinedCurrentPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.predefinedCurrentPage - halfRange);
    const endPage = Math.min(this.totalAddressPages - 1, this.predefinedCurrentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.predefinedCurrentPage < this.totalAddressPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalAddressPages > 1) {
      pagination.push(this.totalAddressPages);
    }

    return pagination;
  }

  changeAddressPage(page: number | string): void {
    if (page === "..." || page === this.predefinedCurrentPage) {
      return;
    }
    this.predefinedCurrentPage = page as number;
    this.getAllAddressList();
  }

  updateAddressPageSize(): void {
    this.predefinedCurrentPage = 1;
    this.getAllAddressList();
  }
}
