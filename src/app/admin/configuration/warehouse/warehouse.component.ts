import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss',
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
    NgSelectModule,
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

export class WarehouseComponent implements OnInit {

  allWarehouseList: any = [];
  allCountryList: any = [];
  allStateList: any = [];
  allPageResourcesList: any = [];
  warehouseForm!: FormGroup;
  isAddWarehouse: boolean = false;
  isEditWarehouse: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  bloodGroups: any = [];
  warehouseId: any;
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
  warehouse: any;
  countryId: any;
  warehouseName: string = '';
  collapses = [true, true];
  name: string = '';
  warehouseData: any;
  loading: boolean = false; 

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/Shipping/CreateWarehouse') {
      this.isAddWarehouse = true;
      this.isEditWarehouse = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/Shipping/EditWarehouse/')) {
      const warehouseId = this.route.snapshot.paramMap.get('id');
      if (warehouseId) {
        this.editWarehouse(warehouseId);
      }
      this.isAddWarehouse = true;
      this.isEditWarehouse = true;
    } else {
      this.isAddWarehouse = false;
      this.isEditWarehouse = false;
    }
    let pagePermission = { menuName: "Warehouses" }
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
    this.defaultWarehouseForm();
    this.getPageResourcesList();
    this.getAllWarehouseList();
    this.getAllCountryList();
  }



  defaultWarehouseForm() {
    this.warehouseForm = this.fb.group({
      warehouseName: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      email: [''],
      companyName: [''],
      countryId: ['', Validators.required],
      stateId: [''],
      region: [''],
      cityName: [''],
      address1: [''],
      address2: [''],
      zipCode: ['', Validators.required],
      phoneNumber: [''],
      faxNumber: [''],
      adminComment: [''],
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
  setwarehouseId(id: string) {
    this.warehouseId = id;
  }

  setWarehouse(warehouse: any) {
    this.warehouse = warehouse;
  }
  limitContactLength(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
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
    this.warehouseForm.get('countryId')?.setValue(countryId);
    this.warehouseForm.get('stateId')?.reset();
    this.allStateList = [];
    if (countryId) {
      this.getStateByCountryId(countryId);
    } else {
      this.allStateList = [];
    }
  }

  getStateByCountryId(countryId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.defaultLayoutService.getActiveStateDetailsByCountryId({ countryId }).subscribe(
        (response: any) => {
          if (response.meta?.code === 200) {
            this.allStateList = response.data || [];
            resolve();
          } else {
            this.allStateList = [];
            console.warn('No states found for the selected country.');
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching states:', error);
          this.toastr.error('Error fetching states')
          this.allStateList = [];
          reject(error);
        }
      );
    });
  }


  getAllWarehouseList() {
    this.loading = true;
    this.defaultLayoutService.getAllWarehouse({
      warehouseName: this.warehouseName,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allWarehouseList = Response.data.Warehouses;
        this.totalRecords = Response.data.totalRecords;  
        this.totalPages = Response.data.totalPages;    
        this.loading = false;
      }
    })
  }


  updateLocalStorageResources() {
    this.defaultLayoutService.getAllResources({ warehouseId: '6751515ce8be630bc927fda4' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let allResourcesList = Response.data.resources;
        if (localStorage.getItem('resources')) {
          localStorage.removeItem('resources');
        }
        localStorage.setItem('resources', JSON.stringify(allResourcesList));
      }
    })
  }

  addWarehouse() {
    this.defaultWarehouseForm();
    this.isAddWarehouse = true;
    this.isEditWarehouse = false;
    this.getAllCountryList();
  }

  backToWarehouseList() {
    this.isEditWarehouse = false;
    this.isAddWarehouse = false;
    this.router.navigate(['/admin/Shipping/Warehouses']);
  }



  editWarehouse(selectedWarehouseId: any) {
    this.defaultWarehouseForm();
    this.warehouseId = selectedWarehouseId;
    this.isAddWarehouse = true;
    this.isEditWarehouse = true;


    this.defaultLayoutService.getWarehouseDetailsById(this.warehouseId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.warehouseData = response.data;
          this.name = this.warehouseData.warehouseName;
          // Set the countryId
          this.warehouseForm.patchValue(this.warehouseData);

          // Now, fetch the states based on the selected countryId
          this.getStateByCountryId(this.warehouseData.countryId).then(() => {
            // After fetching the states, find the stateId based on the stateName
            const selectedState = this.allStateList.find(
              (state: any) => state.stateName === this.warehouseData.stateId
            );
            if (selectedState) {
              // Patch the form with the correct stateId
              this.warehouseForm.get('stateId')?.setValue(selectedState._id);
            }
          }).catch((error) => {
            console.error('Error fetching states:', error);
          });
        } else {
          console.error('Failed to fetch warehouse details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching warehouse details:', error);
      }
    );
  }


  createWarehouse(saveAndEdit: boolean) {
    if (this.warehouseForm.valid) {
      const warehouseData = this.warehouseForm.value;

      this.defaultLayoutService.createWarehouse(warehouseData).subscribe(
        (response:any) => {
          console.log('warehouse saved successfully:', response);
          this.warehouseId=response.data._id;
          this.toastr.success('Warehouse saved successfully')
          if (saveAndEdit) {
            this.isAddWarehouse = false;
            this.router.navigate(['/admin/Shipping/Warehouses']);
          }
          else {
            this.router.navigate(['/admin/Shipping/EditWarehouse',this.warehouseId]);
            // this.editWarehouse(this.warehouseId);
          }
          this.getAllWarehouseList();

        },
        (error) => {
          console.error('Error saving warehouse:', error);
          this.toastr.error('Error saving warehouse')
        }
      );
    } else {
      this.warehouseForm.markAllAsTouched();
    }
  }


  updateWarehouse(saveAndEdit: boolean): void {
    if (this.warehouseForm.valid) {
      const updatedData = {
        warehouseName: this.warehouseForm.value.warehouseName,
        firstName: this.warehouseForm.value.firstName,
        lastName: this.warehouseForm.value.lastName,
        email: this.warehouseForm.value.email,
        companyName: this.warehouseForm.value.companyName,
        countryId: this.warehouseForm.value.countryId,
        stateId: this.warehouseForm.value.stateId,
        region: this.warehouseForm.value.region,
        cityName: this.warehouseForm.value.cityName,
        address1: this.warehouseForm.value.address1,
        address2: this.warehouseForm.value.address2,
        zipCode: this.warehouseForm.value.zipCode,
        phoneNumber: this.warehouseForm.value.phoneNumber,
        faxNumber: this.warehouseForm.value.faxNumber,
        adminComment: this.warehouseForm.value.adminComment,
        id: this.warehouseId
      };

      this.defaultLayoutService.updateWarehouse(updatedData).subscribe(
        (response: any) => {
          console.log('warehouse updated successfully:', response);
          this.toastr.success('Warehouse updated successfully')
          if (saveAndEdit) {
            this.isAddWarehouse = false;
            this.isEditWarehouse = false;
            this.warehouseId = null;
            this.backToWarehouseList();
          }
          else {
            this.editWarehouse(this.warehouseId);
          }
          this.getAllWarehouseList();
        },
        (error: any) => {
          console.error('Error updating warehouse:', error);
          this.toastr.error('Error updating warehouse')
        }
      );
    } else {
      this.warehouseForm.markAllAsTouched();
    }
  }





  deleteWarehouse(warehouse: any) {
    const warehouseDeActive = {
      id: warehouse._id,
      isDeleted: true
    };
    this.defaultLayoutService.warehouseActiveDeActive(warehouseDeActive).subscribe(
      (response) => {
        console.log('warehouse deleted successfully:', response);
        this.toastr.success('Warehouse deleted successfully')
        this.getAllWarehouseList();
      },
      (error) => {
        console.error('Error deleting warehouse:', error);
        this.toastr.error('Error deleting warehouse')

      }
    );
  }

  reActiveWarehouse(warehouse: any) {
    const warehouseReActive = {
      id: warehouse._id,
      isDeleted: false
    };
    this.defaultLayoutService.warehouseActiveDeActive(warehouseReActive).subscribe(
      (response) => {
        console.log('warehouse active successfully:', response);
        this.toastr.success('Warehouse active successfully')
        this.getAllWarehouseList();
      },
      (error) => {
        console.error('Error active warehouse:', error);
        this.toastr.error('Error active warehouse')
      }
    );
  }


  deactiveWarehouse() {
    const warehouseDeActive = {
      id: this.warehouseId,
      isDeleted: true
    };
    this.defaultLayoutService.warehouseActiveDeActive(warehouseDeActive).subscribe(
      (response) => {
        console.log('warehouse deleted successfully:', response);
        this.toastr.success('Warehouse deleted successfully');
        this.editWarehouse(this.warehouseId);
        this.getAllWarehouseList();
      },
      (error) => {
        console.error('Error deleting warehouse:', error);
        this.toastr.error('Error deleting warehouse')

      }
    );
  }

  activeWarehouse() {
    const warehouseReActive = {
      id: this.warehouseId,
      isDeleted: false
    };
    this.defaultLayoutService.warehouseActiveDeActive(warehouseReActive).subscribe(
      (response) => {
        console.log('warehouse active successfully:', response);
        this.toastr.success('Warehouse active successfully');
        this.editWarehouse(this.warehouseId);
        this.getAllWarehouseList();
      },
      (error) => {
        console.error('Error active warehouse:', error);
        this.toastr.error('Error active warehouse')
      }
    );
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
    this.getAllWarehouseList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllWarehouseList(); // Fetch data with the new page size
  }
}

