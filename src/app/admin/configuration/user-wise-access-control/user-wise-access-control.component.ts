import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import { AlignDirective, BorderDirective, ButtonDirective, FormCheckComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';






export interface Submenu {
  _id: string;
  parentId: string;
  title: string;
  canCreate: boolean;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
  subMenus: Submenu[];  // Nested submenus
}

export interface Menu {
  _id: string;
  title: string;
  isExpanded: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
  subMenus: Submenu[];  // Submenus list
}
@Component({
  selector: 'app-user-wise-access-control',
  imports: [
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
    FormCheckComponent,
    CardHeaderComponent,
    CardBodyComponent,
    NgSelectModule
  ],
  templateUrl: './user-wise-access-control.component.html',
  styleUrl: './user-wise-access-control.component.scss'
})
export class UserWiseAccessControlComponent {
  allLanguagesList: any;
  selectedRoleId: string | null = null;

  isUserVisible: boolean = false;
  userlist: any;
  allMenuSubMenuList: any;
  userMenuList: any;
  userwiseMenuForm!: FormGroup;
  userId: any;
  rolelist: any;
  roleId: any;
  selectedUserId: string | null = null;





  // allLanguagesList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  languageForm!: FormGroup;
  isAddLanguage: boolean = false;
  isEditUser: boolean = false;
  collapses = [true, true];
  isView: boolean = true;
  isUpdate: boolean = true;
  isDelete: boolean = true;
  isCreate: boolean = true;
  languages: any = [];
  flagImages: any = [];
  currencies: any = [];
  languageId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  selectedCurrency: string | null = null;
  menuList: any;
  rolewiseMenuForm!: FormGroup;
  selectedRole: any;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  limit: number = 10;
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private changeDetector: ChangeDetectorRef,
    private defaultLayoutService: DefaultLayoutService,
    private toastr: ToastrService,
  ) { }




  ngOnInit(): void {
    this.userlist = [];
    this.rolelist = [];
    this.getRoleList();
    // this.getUserList(this.roleId);
    this.defaultResourceForm();
    this.getPageResourcesList();
    this.selectedRole = null;
    this.getRoleList();
  }


  defaultResourceForm() {
    this.resourceForm = this.fb.group({
      resourceName: ['', Validators.required],
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
      }
    })
  }

  getLabelValue(labelKey: any) {
    const resource = this.allPageResourcesList.find(
      (res: any) => res.resourceName === labelKey
    );

    return resource ? resource.resourceValue : labelKey;
  }


  onRoleChange(event: any) {
    if (this.selectedRoleId) {
      this.getUserList(this.selectedRoleId);
      this.selectedUserId=null;
    } else {
      this.userlist = [];
    }
  }

  onUserChange(event: any) {
    if (this.selectedUserId) {
      this.getAllUserMenuList(this.selectedUserId);
    }
  }

  getRoleList() {
    this.defaultLayoutService.getActiveRole(null).subscribe(
      response => {
        if (response.meta.code === 200) {
          this.rolelist = response.data;
        } else {
          console.error('Failed to load rolelist:', response.meta.message);
          this.toastr.error('Error fetching rolelist data')
        }
      },
      error => {
        console.error('Error fetching rolelist:', error);
        this.toastr.error('Error fetching rolelist')

      }
    );
  }


  getUserList(id: any) {
    this.userId = this.selectedUserId;
    this.defaultLayoutService.getUserData(id).subscribe(
      response => {
        if (response.meta.code === 200) {
          this.userlist = response.data;
        } else {
          console.error('Failed to load userlist:', response.meta.message);
          this.toastr.error('Error fetching userlist data');
        }
      },
      error => {
        console.error('Error fetching userlist:', error);
        this.toastr.error('Error fetching userlist')

      }
    );
  }


  getAllUserMenuList(id: string) {
    this.defaultLayoutService.fetchUserWiseMenu({ roleId: this.selectedRoleId, userId: this.selectedUserId }).subscribe(
      (response) => {
        this.userMenuList = response.data;
        this.userMenuList.forEach((menu: any) => menu.isExpanded = false);
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.toastr.error('Error fetching user data')
      }
    );
  }

  isAllChecked(permissionType: string): boolean {
    const checkSubmenus = (submenus: any[]): boolean => {
      return submenus.every(submenu =>
        submenu[permissionType] &&
        (!submenu.subMenus || checkSubmenus(submenu.subMenus))
      );
    };

    return this.userMenuList.every((menu: any) =>
      menu[permissionType] &&
      (!menu.subMenus || checkSubmenus(menu.subMenus))
    );
  }

  // Method to toggle submenu visibility
  toggleSubmenu(menu: any) {
    menu.isExpanded = !menu.isExpanded;
  }

  // Method to toggle submenu visibility
  toggleSubSubmenu(submenu: any) {
    submenu.isSubExpanded = !submenu.isSubExpanded;
  }



  toggleAllCreate(event: any) {
    const isChecked = event.target.checked;
    // Recursive function to handle nested submenus
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canCreate = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    // Update menu list
    this.userMenuList.forEach((menu: any) => {
      menu.canCreate = isChecked;
      if (menu.subMenus && menu.subMenus.length > 0) {
        updateSubmenus(menu.subMenus, isChecked);
      }
    });
  }

  // Method to toggle all "Edit" checkboxes
  toggleAllEdit(event: any) {
    const isChecked = event.target.checked;
    // Recursive function to handle nested submenus
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canEdit = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    // Update menu list
    this.userMenuList.forEach((menu: any) => {
      menu.canEdit = isChecked;
      if (menu.subMenus && menu.subMenus.length > 0) {
        updateSubmenus(menu.subMenus, isChecked);
      }
    });
  }

  // Method to toggle all "View" checkboxes
  toggleAllView(event: any) {
    const isChecked = event.target.checked;
    // Recursive function to handle nested submenus
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canView = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    // Update menu list
    this.userMenuList.forEach((menu: any) => {
      menu.canView = isChecked;
      if (menu.subMenus && menu.subMenus.length > 0) {
        updateSubmenus(menu.subMenus, isChecked);
      }
    });
  }

  // Method to toggle all "Delete" checkboxes
  toggleAllDelete(event: any) {
    const isChecked = event.target.checked;
    // Recursive function to handle nested submenus
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canDelete = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    // Update menu list
    this.userMenuList.forEach((menu: any) => {
      menu.canDelete = isChecked;
      if (menu.subMenus && menu.subMenus.length > 0) {
        updateSubmenus(menu.subMenus, isChecked);
      }
    });
  }



  toggleParentCreate(event: any, menu: any) {
    const isChecked = event.target.checked;
    const updateSubmenuCreate = (submenus: any[]) => {
      submenus.forEach((submenu: any) => {
        submenu.canCreate = isChecked; // Update current submenu
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenuCreate(submenu.subMenus);
        }
      });
    };

    if (menu.subMenus && menu.subMenus.length > 0) {
      updateSubmenuCreate(menu.subMenus);
    }
  }

  toggleParentEdit(event: any, menu: Menu) {
    const isChecked = event.target.checked;
    const updateSubmenuEdit = (submenus: any[]) => {
      submenus.forEach((submenu: any) => {
        submenu.canEdit = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenuEdit(submenu.subMenus);
        }
      });
    };

    if (menu.subMenus && menu.subMenus.length > 0) {
      updateSubmenuEdit(menu.subMenus);
    }
  }

  toggleParentView(event: any, menu: Menu) {
    const isChecked = event.target.checked;
    const updateSubmenuView = (submenus: any[]) => {
      submenus.forEach((submenu: any) => {
        submenu.canView = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenuView(submenu.subMenus);
        }
      });
    };

    if (menu.subMenus && menu.subMenus.length > 0) {
      updateSubmenuView(menu.subMenus);
    }
  }

  toggleParentDelete(event: any, menu: Menu) {
    const isChecked = event.target.checked;
    const updateSubmenuDelete = (submenus: any[]) => {
      submenus.forEach((submenu: any) => {
        submenu.canDelete = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenuDelete(submenu.subMenus);
        }
      });
    };

    if (menu.subMenus && menu.subMenus.length > 0) {
      updateSubmenuDelete(menu.subMenus);
    }
  }



  toggleSubParentCreate(event: any, submenu: Menu) {
    const isChecked = event.target.checked;
    submenu.subMenus.forEach(submenus => {
      submenus.canCreate = isChecked;
    });
  }
  toggleSubParentEdit(event: any, submenu: Menu) {
    const isChecked = event.target.checked;
    submenu.subMenus.forEach(submenus => {
      submenus.canEdit = isChecked;
    });
  }
  toggleSubParentView(event: any, submenu: Menu) {
    const isChecked = event.target.checked;
    submenu.subMenus.forEach(submenus => {
      submenus.canView = isChecked;
    });
  }
  toggleSubParentDelete(event: any, submenu: Menu) {
    const isChecked = event.target.checked;
    submenu.subMenus.forEach(submenus => {
      submenus.canDelete = isChecked;
    });
  }



  // Method to handle change in "Create" checkbox of a submenu
  handleSubmenuCreateChange(submenu: Submenu, parentMenu: Menu) {
    const anyChecked = parentMenu.subMenus.some(child => child.canCreate);
    parentMenu.canCreate = anyChecked;
  }
  // Method to handle change in "Edit" checkbox of a submenu
  handleSubmenuEditChange(submenu: Submenu, parentMenu: Menu) {
    const anyChecked = parentMenu.subMenus.some(child => child.canEdit);
    parentMenu.canEdit = anyChecked;
  }
  // Method to handle change in "View" checkbox of a submenu
  handleSubmenuViewChange(submenu: Submenu, parentMenu: Menu) {
    const anyChecked = parentMenu.subMenus.some(child => child.canView);
    parentMenu.canView = anyChecked;
  }
  // Method to handle change in "Delete" checkbox of a submenu
  handleSubmenuDeleteChange(submenu: Submenu, parentMenu: Menu) {
    const anyChecked = parentMenu.subMenus.some(child => child.canDelete);
    parentMenu.canDelete = anyChecked;
  }




  // Method to handle change in "Create" checkbox of a submenu
  handleSubSubmenuCreateChange(submenu: Submenu, submenus: Submenu) {
    const anyChecked = submenus.subMenus.some(child => child.canCreate);
    submenus.canCreate = anyChecked;
  }
  // Method to handle change in "Edit" checkbox of a submenu
  handleSubSubmenuEditChange(submenu: Submenu, submenus: Submenu) {
    const anyChecked = submenus.subMenus.some(child => child.canEdit);
    submenus.canEdit = anyChecked;
  }
  // Method to handle change in "View" checkbox of a submenu
  handleSubSubmenuViewChange(submenu: Submenu, submenus: Submenu) {
    const anyChecked = submenus.subMenus.some(child => child.canView);
    submenus.canView = anyChecked;
  }
  // Method to handle change in "Delete" checkbox of a submenu
  handleSubSubmenuDeleteChange(submenu: Submenu, submenus: Submenu) {
    const anyChecked = submenus.subMenus.some(child => child.canDelete);
    submenus.canDelete = anyChecked;
  }

  saveData(saveAndEdit: boolean) {
    if (!this.selectedRoleId) {
      this.toastr.error('Role is required');
      return;
    }
    if (!this.selectedUserId) {
      this.toastr.error('User is required');
      return;
    }
  
    const userData = {
      userId: this.selectedUserId,
      roleId: this.selectedRoleId,
      userrolewisemenu: this.userMenuList.flatMap((menu: any) =>
        menu.subMenus.flatMap((submenu: any) =>
          submenu.subMenus && submenu.subMenus.length > 0
            ? submenu.subMenus.map((subSubmenu: any) => ({
                menuId: subSubmenu.menuId,
                canCreate: subSubmenu.canCreate,
                canView: subSubmenu.canView,
                canEdit: subSubmenu.canEdit,
                canDelete: subSubmenu.canDelete,
              }))
              .concat({
                menuId: submenu.menuId,
                canCreate: submenu.canCreate,
                canView: submenu.canView,
                canEdit: submenu.canEdit,
                canDelete: submenu.canDelete,
              })
            : [{
                menuId: submenu.menuId,
                canCreate: submenu.canCreate,
                canView: submenu.canView,
                canEdit: submenu.canEdit,
                canDelete: submenu.canDelete,
              }]
        ).concat({
          menuId: menu.menuId,
          canCreate: menu.canCreate,
          canView: menu.canView,
          canEdit: menu.canEdit,
          canDelete: menu.canDelete,
        })
      ),
    };
  
    this.defaultLayoutService.saveUserMenu(userData).subscribe(
      response => {
        this.toastr.success('User-wise access saved successfully');
  
        // Only call getAllUserMenuList if selectedUserId is not null
        
        if (saveAndEdit) {
          this.selectedRoleId = null;
          this.selectedUserId = null;
          this.userlist = [];
          this.userMenuList = [];
          this.getRoleList();
        } else {
          if (this.selectedUserId) {
            this.getAllUserMenuList(this.selectedUserId);
          }
          this.getRoleList();
        }
      },
      error => {
        console.error('Error saving user-wise access:', error);
        this.toastr.error('Error saving user-wise access');
      }
    );
  }
  
  

}
