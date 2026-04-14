import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import {
  AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
} from '@coreui/angular';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-role',
  standalone: true, // Mark the component as standalone
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
  providers: [],

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
    NgSelectModule,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective,
    ButtonDirective,
  ]
})
export class RoleComponent implements OnInit {
  @ViewChild('verticallyCenteredModal') modal: any;
  rolelist: any = [];
  isShowButton: boolean = false
  allLanguagesList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  roleForm!: FormGroup;
  isAddRole: boolean = false;
  isEditRole: boolean = false;
  collapses = [true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  languages: any = [];
  flagImages: any = [];
  currencies: any = [];
  languageId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  selectedCurrency: string | null = null;
  roleId: string | null = null;
  isModalHide: boolean = true;
  role: any;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  Math = Math;
  roleName: string = ''
  roleData: any;
  loading: boolean = false; 

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
  }




  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/RoleMaster/Create') {
      this.isAddRole = true;
      this.isEditRole = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/RoleMaster/Edit/')) {
      const roleId = this.route.snapshot.paramMap.get('id');
      if (roleId) {
        this.editRole(roleId);
      }
      this.isAddRole = true;
      this.isEditRole = true;
    } else {
      this.isAddRole = false;
      this.isEditRole = false;
      this.router.navigate(['/admin/RoleMaster/List']);
    }
    let pagePermission = { menuName: "Role Master" }
    this.defaultLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        console.log("response", Response.data)
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
    this.getRoleList();
    this.defaultRoleForm();
    this.defaultResourceForm();
    this.getPageResourcesList();
  }

  defaultRoleForm() {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  defaultResourceForm() {
    this.resourceForm = this.fb.group({
      resourceName: ['', Validators.required],  // Add validation for required fields
      value: ['', Validators.required]
    });
  }



  getPageResourcesList() {
    this.allPageResourcesList = JSON.parse(localStorage.getItem('resources') || '{}');

  }

  getAllResourcesList() {
    this.defaultLayoutService.getAllResources({ languageId: this.languageId }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allResourcesList = Response.data;
        console.log(this.allResourcesList);
      }
    })
  }

  getLabelValue(labelKey: any) {
    const resource = this.allPageResourcesList.find(
      (res: any) => res.resourceName === labelKey
    );

    return resource ? resource.resourceValue : labelKey;
  }


  updateLocalStorageResources() {
    this.defaultLayoutService.getAllResources({ languageId: '6751515ce8be630bc927fda4' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let allResourcesList = Response.data.resources;
        console.log(allResourcesList);

        if (localStorage.getItem('resources')) {
          localStorage.removeItem('resources');
        }

        // Save the new booking to localStorage
        localStorage.setItem('resources', JSON.stringify(allResourcesList));
      }
    })
  }

  AddRole() {
    this.defaultRoleForm();
    this.defaultResourceForm();
    this.isAddRole = true;
    this.isEditRole = false;
    this.isShowButton = false;
  }

  backToRoleList() {
    this.isEditRole = false;
    this.isAddRole = false;
    this.router.navigate(['/admin/RoleMaster/List']);
  }

  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setRoleId(id: string) {
    this.roleId = id;
  }

  setRole(role: any) {
    this.role = role;
  }

  createNewRole(saveAndEdit: boolean) {
    if (this.roleForm.valid) {
      let rolemasterData = this.roleForm.value;
      this.defaultLayoutService.SaveroleMaster(rolemasterData).subscribe(
        (response: any) => {
          if (response.meta.code === 200) {
            this.toastr.success('Role saved successfully');
            this.roleId = response.data._id;
            if (saveAndEdit) {
              this.isAddRole = false;
              this.backToRoleList();
            }
            else {
            this.router.navigate(['/admin/RoleMaster/Edit',this.roleId]);
              // this.editRole(this.roleId);
            }
            this.getRoleList();
          }
        },
        (error: any) => {
          this.toastr.error('Error saving role');
        }
      );
    } else {
      this.roleForm.markAllAsTouched();
    }
  }

  getRoleList() {
    this.loading = true;
    this.defaultLayoutService.getAllRole({
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe(
      (response) => {
        if (response.meta.code === 200) {
          this.rolelist = response.data.roles;
          this.totalRecords = response.data.totalRecords;  
          this.totalPages = response.data.totalPages;    
          this.loading = false;
 
        } else {
          console.error('Failed to load rolelist:', response.meta.message);
          this.toastr.error('Failed to load rolelist');
          this.loading = false;

        }
      },
      error => {
        console.error('Error fetching rolelist:', error);
        this.toastr.error('Error fetching rolelist')

      }
    );
  }


  editRole(id: any) {
    this.isAddRole = true;
    this.isShowButton = true;
    this.roleId = id;
    console.log(this.roleId);
    this.isEditRole = true;
    this.defaultLayoutService.fetchRoleById(this.roleId).subscribe(
      (response) => {
        this.roleForm.patchValue(response.data);
        this.roleName = response.data.roleName;
        this.roleData = response.data;
      },
      (error) => {
        console.error('Error fetching role data:', error);
        this.toastr.error('Error fetching role data');
      }
    );
  }


  updateRole(saveAndEdit: boolean) {
    if (this.roleForm.valid) {
      const updatedRoleData = {
        id: this.roleId,
        roleName: this.roleForm.value.roleName,
        description: this.roleForm.value.description,
      };

      this.defaultLayoutService.updateRoleById(updatedRoleData).subscribe(
        (response: any) => {
          if (response.meta?.code === 200) {
            this.toastr.success('Role updated successfully');
            if (saveAndEdit) {
              this.isAddRole = false;
              this.backToRoleList();
            }
            else {
              this.editRole(this.roleId);
            }
            this.getRoleList();
          }
        },
        (error) => {
          console.error('Error updating role:', error);
          this.toastr.error('Error updating role');
        }
      );
    } else {
      this.roleForm.markAllAsTouched();
    }
  }



  deleteRole(role: any) {
    const roleReActive = {
      id: role._id,
      isDeleted: true
    };

    this.defaultLayoutService.RoleActiveDeActive(roleReActive).subscribe(
      (response) => {
        console.log('Role deleted successfully:', response);
        this.getRoleList(); // Refresh the role list after deletion
        this.isModalHide = false;
        this.toastr.success('Role deleted successfully')

      },
      (error) => {
        console.error('Error deleting role:', error);
        this.toastr.error('Error deleting role')

      }
    );
  }

  reActiveRole(role: any) {
    const roleReActive = {
      id: role._id,
      isDeleted: false
    };
    this.defaultLayoutService.RoleActiveDeActive(roleReActive).subscribe(
      (response) => {
        console.log('Role active successfully:', response);
        this.getRoleList();
        this.toastr.success('Role active successfully')

      },
      (error) => {
        console.error('Error deleting role:', error);
        this.toastr.error('Error deleting role')

      }
    );
  }

  deactiveRole() {
    const roleReActive = {
      id: this.roleId,
      isDeleted: true
    };

    this.defaultLayoutService.RoleActiveDeActive(roleReActive).subscribe(
      (response) => {
        console.log('Role deleted successfully:', response);
        this.getRoleList(); // Refresh the role list after deletion
        this.isModalHide = false;
        this.editRole(this.roleId);
        this.toastr.success('Role deleted successfully');

      },
      (error) => {
        console.error('Error deleting role:', error);
        this.toastr.error('Error deleting role')

      }
    );
  }

  activeRole() {
    const roleReActive = {
      id: this.roleId,
      isDeleted: false
    };
    this.defaultLayoutService.RoleActiveDeActive(roleReActive).subscribe(
      (response) => {
        console.log('Role active successfully:', response);
        this.getRoleList();
        this.toastr.success('Role active successfully');
        this.editRole(this.roleId);

      },
      (error) => {
        console.error('Error deleting role:', error);
        this.toastr.error('Error deleting role')

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
    this.getRoleList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getRoleList(); // Fetch data with the new page size
  }



}