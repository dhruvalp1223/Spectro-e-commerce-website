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
  selector: 'app-role-wise-access-control',
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
  templateUrl: './role-wise-access-control.component.html',
  styleUrl: './role-wise-access-control.component.scss'
})
export class RoleWiseAccessControlComponent {

  allLanguagesList: any;



  // allLanguagesList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  languageForm!: FormGroup;
  isAddLanguage: boolean = false;
  isEditRole: boolean = false;
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
  rolelist: any;
  allMenuSubMenuList: any;
  menuList: any[] = [];  // Your menu data
  rolewiseMenuForm!: FormGroup;
  roleId!: any;
  selectedRole: any;
  selectedRoleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private changeDetector: ChangeDetectorRef,
    private toastr: ToastrService,
    private defaultLayoutService: DefaultLayoutService
  ) { }

  ngOnInit(): void {
    this.defaultResourceForm();
    this.getPageResourcesList();
    this.selectedRole = null;
    this.getRoleList();
  }


  defaultResourceForm() {
    this.resourceForm = this.fb.group({
      role: ['', Validators.required],  // Add validation for required fields
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


  updateLocalStorageResources() {
    this.defaultLayoutService.getAllResources({ languageId: '6751515ce8be630bc927fda4' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let allResourcesList = Response.data.resources;

        if (localStorage.getItem('resources')) {
          localStorage.removeItem('resources');
        }

        // Save the new booking to localStorage
        localStorage.setItem('resources', JSON.stringify(allResourcesList));
      }
    })
  }

  addLanguage() {
    this.defaultResourceForm();
    this.isAddLanguage = true;
    this.isEditRole = false;
  }

  backToLanguageList() {
    this.isEditRole = false;
    this.isAddLanguage = false;
  }

  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  onRoleChange(event: any) {
    console.log(this.selectedRoleId)
    if (this.selectedRoleId) {
      this.getAllMenuList(this.selectedRoleId);
    } else {
      this.menuList = [];  // Clear menu list when role is cleared
    }
  }


  getRoleList() {
    this.defaultLayoutService.getActiveRole(null).subscribe(
      response => {
        if (response.meta.code === 200) {
          this.rolelist = response.data;

        } else {
          console.error('Failed to load rolelist:', response.meta.message);
        }
      },
      error => {
        console.error('Error fetching rolelist:', error);
        this.toastr.error('Error fetching rolelist')

      }
    );
  }


  getAllMenuList(id: any) {
    this.roleId = this.selectedRoleId;

    this.defaultLayoutService.fetchRoleWiseMenu(this.roleId).subscribe(
      (response) => {
        this.menuList = response.data;
        this.menuList.forEach((menu: any) => (menu.isExpanded = false));
      },
      (error) => {
        console.error("Error fetching role data:", error);
        this.toastr.error('Error fetching role data')

      }
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

  isAllChecked(permissionType: string): boolean {
    const checkSubmenus = (submenus: any[]): boolean => {
      return submenus.every(submenu =>
        submenu[permissionType] &&
        (!submenu.subMenus || checkSubmenus(submenu.subMenus))
      );
    };

    return this.menuList.every(menu =>
      menu[permissionType] &&
      (!menu.subMenus || checkSubmenus(menu.subMenus))
    );
  }


  toggleAllCreate(event: any) {
    const isChecked = event.target.checked;
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canCreate = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    this.menuList.forEach((menu: any) => {
      menu.canCreate = isChecked;
      if (menu.subMenus && menu.subMenus.length > 0) {
        updateSubmenus(menu.subMenus, isChecked);
      }
    });
  }

  toggleAllEdit(event: any) {
    const isChecked = event.target.checked;
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canEdit = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    this.menuList.forEach((menu: any) => {
      menu.canEdit = isChecked;
      if (menu.subMenus && menu.subMenus.length > 0) {
        updateSubmenus(menu.subMenus, isChecked);
      }
    });
  }

  toggleAllView(event: any) {
    const isChecked = event.target.checked;
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canView = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    this.menuList.forEach((menu: any) => {
      menu.canView = isChecked;
      if (menu.subMenus && menu.subMenus.length > 0) {
        updateSubmenus(menu.subMenus, isChecked);
      }
    });
  }

  toggleAllDelete(event: any) {
    const isChecked = event.target.checked;
    const updateSubmenus = (submenus: any[], isChecked: boolean) => {
      submenus.forEach(submenu => {
        submenu.canDelete = isChecked;
        if (submenu.subMenus && submenu.subMenus.length > 0) {
          updateSubmenus(submenu.subMenus, isChecked);
        }
      });
    };
    this.menuList.forEach((menu: any) => {
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
    const roleData = {
      roleId: this.roleId,
      rolewisemenu: this.menuList.flatMap((menu: any) =>
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


    this.defaultLayoutService.saveRoleMenu(roleData).subscribe(
      response => {
        if (saveAndEdit) {
          this.selectedRoleId = null;
          this.roleId = null;
          this.menuList = [];
        }
        else {
          this.getAllMenuList(this.roleId);
        }
        this.getRoleList();

        this.toastr.success('Role wise access saved successfully')

      },
      error => {
        console.error('Error saving data:', error);

        this.toastr.error('Error saving role wise access')

      }
    );
  }


}
