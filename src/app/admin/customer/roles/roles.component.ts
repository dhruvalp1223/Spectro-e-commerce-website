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
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
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

export class RolesComponent {

  alllRoleList: any = [];
  allPageResourcesList: any = [];
  roleForm!: FormGroup;
  isAddRoles: boolean = false;
  isEditRoles: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  displayTypes: any = [];
  roleId: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  selectedUserImage: any;
  userimageFile: File | null = null;
  rolelist: any;
  isShowButton: boolean = false
  user: any;
  role: any;
  name:string='';
  roleData:any;
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
    if (currentUrl === '/admin/CustomerRole/Create') {
      this.isAddRoles = true;
      this.isEditRoles = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/CustomerRole/Edit/')) {
      const roleId = this.route.snapshot.paramMap.get('id');
      if (roleId) {
        this.editRole(roleId);
      }
      this.isAddRoles = true;
      this.isEditRoles = true;
    } else {
      this.isAddRoles = false;
      this.isEditRoles = false;
      this.router.navigate(['/admin/CustomerRole/List']);

    }
    let pagePermission = { menuName: "Customer Roles" }
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
    this.defaultemailForm();
    this.getPageResourcesList();
    this.getAllRoleList();
    this.displayTypes = [
      { label: 'Including tax', value: 'Including tax' },
      { label: 'Excluding tax', value: 'Excluding tax' },
    ];
  }

  defaultemailForm() {
    this.roleForm = this.fb.group({
      customerRoleName: ['', Validators.required],
      active: [false],
      freeShipping: [false],
      taxExempt: [false],
      overRideDefaultTaxDisplayType: [false],
      defaultTaxDisplayType: [''],
      enablePasswordLifeline: [false],
      purchasedWithProductId: [],
      systemName: [''],
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




  setEmailId(id: string) {
    this.roleId = id;
  }

  setRole(role: any) {
    this.role = role;
  }


  getAllRoleList() {
    this.loading = true;

    this.defaultLayoutService.getAllCustomerRole({
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.alllRoleList = Response.data.customerRoles;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
        this.loading = false;

      }
    })
  }


  addRole() {
    this.defaultemailForm();
    this.isAddRoles = true;
    this.isEditRoles = false;
  }

  backToRolesList() {
    this.isEditRoles = false;
    this.isAddRoles = false;
    this.router.navigate(['/admin/CustomerRole/List']);

  }



  editRole(selectedRoleId: any) {
    this.defaultemailForm();
    this.roleId = selectedRoleId;
    this.isAddRoles = true;
    this.isEditRoles = true;
    this.defaultLayoutService.getCustomerRoleDetailsById(this.roleId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.roleForm.patchValue(response.data);
          this.name=response.data.customerRoleName;
          this.roleData=response.data;
        } else {
          console.error('Failed to fetch role details:', response.meta.message);
          this.toastr.error('Failed to fetch customerRole details')
        }
      },
      (error: any) => {
        console.error('Error fetching role details:', error);
        this.toastr.error('Error fetching customerRole details')
      }
    );
  }


  createRole(saveAndEdit: boolean) {
    if (this.roleForm.valid) {
      const roledata = this.roleForm.value;
      this.defaultLayoutService.createCustomerRole(roledata).subscribe(
        (response : any) => {
          this.roleId = response.data._id;
          this.toastr.success('customerRole saved successfully')
          if (saveAndEdit) {
            this.isAddRoles = false;
            this.isEditRoles = false;
            this.backToRolesList();
            this.getAllRoleList();
          }
          else{
            this.router.navigate(['/admin/CustomerRole/Edit',this.roleId]);
            // this.editRole(this.roleId)
          }
        },
        (error) => {
          console.error('Error saving customerRole:', error);
          this.toastr.error('Error saving customerRole')
        }
      );
    } else {
      this.roleForm.markAllAsTouched();
    }
  }


  updateRole(saveAndEdit: boolean): void {
    if (this.roleForm.valid) {
      const updatedData = {
        customerRoleName: this.roleForm.value.customerRoleName,
        active: this.roleForm.value.active,
        freeShipping: this.roleForm.value.freeShipping,
        taxExempt: this.roleForm.value.taxExempt,
        overRideDefaultTaxDisplayType: this.roleForm.value.overRideDefaultTaxDisplayType,
        defaultTaxDisplayType: this.roleForm.value.defaultTaxDisplayType,
        enablePasswordLifeline: this.roleForm.value.enablePasswordLifeline,
        purchasedWithProductId: this.roleForm.value.purchasedWithProductId,
        systemName: this.roleForm.value.systemName,
        id: this.roleId
      };

      this.defaultLayoutService.updateRole(updatedData).subscribe(
        (response: any) => {
          this.toastr.success('customerRole updated successfully');
          if (saveAndEdit) {
            this.isAddRoles = false;
            this.roleId = null;
            this.isEditRoles = false;
            this.backToRolesList();
            this.getAllRoleList();
          }
          else{this.editRole(this.roleId)}
          // this.isAddMenu = false;
        },
        (error: any) => {
          console.error('Error updating customerRole:', error);
          this.toastr.error('Error updating customerRole')
        }
      );
    } else {
      this.roleForm.markAllAsTouched();
    }
  }





  deleteRole(role: any) {
    const roleDeActive = {
      id: role._id,
      isDeleted: true
    };
    this.defaultLayoutService.customerRoleActiveDeActive(roleDeActive).subscribe(
      (response) => {
        console.log('customerRole deleted successfully:', response);
        this.toastr.success('customerRole deleted successfully')
        this.getAllRoleList();
      },
      (error) => {
        console.error('Error deleting customerRole:', error);
        this.toastr.error('Error deleting customerRole')
      }
    );
  }

  reActiveRole(role: any) {
    const roleReActive = {
      id: role._id,
      isDeleted: false
    };
    this.defaultLayoutService.customerRoleActiveDeActive(roleReActive).subscribe(
      (response) => {
        console.log('customerRole active successfully:', response);
        this.toastr.success('customerRole active successfully')
        this.getAllRoleList();
      },
      (error) => {
        console.error('Error active customerRole:', error);
        this.toastr.error('Error active customerRole')
      }
    );
  }

  deactiveRole() {
    const roleDeActive = {
      id: this.roleId,
      isDeleted: true
    };
    this.defaultLayoutService.customerRoleActiveDeActive(roleDeActive).subscribe(
      (response) => {
        console.log('customerRole deleted successfully:', response);
        this.toastr.success('customerRole deleted successfully');
        this.editRole(this.roleId);
        this.getAllRoleList();
      },
      (error) => {
        console.error('Error deleting customerRole:', error);
        this.toastr.error('Error deleting customerRole')
      }
    );
  }

  activeRole() {
    const roleReActive = {
      id: this.roleId,
      isDeleted: false
    };
    this.defaultLayoutService.customerRoleActiveDeActive(roleReActive).subscribe(
      (response) => {
        console.log('customerRole active successfully:', response);
        this.toastr.success('customerRole active successfully');
        this.editRole(this.roleId);

        this.getAllRoleList();
      },
      (error) => {
        console.error('Error active customerRole:', error);
        this.toastr.error('Error active customerRole')
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
    this.getAllRoleList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllRoleList(); // Fetch data with the new page size
  }
}
