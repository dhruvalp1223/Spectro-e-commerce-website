import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import {
  AlignDirective, BorderDirective,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective,
  ModalBodyComponent
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-menu-master',
  standalone: true,
  templateUrl: './menu-master.component.html',
  styleUrl: './menu-master.component.scss',
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

export class MenuMasterComponent {

  rolelist: any = [];
  isAddMenu: boolean = false;
  loading: boolean = false; 
  isShowButton: boolean = false
  allLanguagesList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  menuForm!: FormGroup;
  isEditMenu: boolean = false;
  collapses = [true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  ParentList: any = [];
  allMenuList: any = [];
  flagImages: any = [];
  currencies: any = [];
  languageId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  selectedCurrency: string | null = null;
  menuName:string=''
  roleId: any;
  menuId: any;
  menu: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  // limit: number = 10;
  menuData: any;
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
    if (currentUrl === '/admin/MenuMaster/Create') {
      this.isAddMenu = true;
      this.isEditMenu = false;
    } else if (currentUrl.startsWith('/admin/MenuMaster/Edit/')) {
      const menuId = this.route.snapshot.paramMap.get('id');
      if (menuId) {
        this.editMenu(menuId);
      }
      this.isAddMenu = true;
      this.isEditMenu = true;
    } else {
      this.isAddMenu = false;
      this.isEditMenu = false;
      this.router.navigate(['/admin/MenuMaster/List']);
    }
    let pagePermission = { menuName: "Menu Master" }
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
    this.getPageResourcesList();
    this.getAllMenuList()
    this.defaultmenuForm();
    this.defaultResourceForm();
    this.getAllParentMenuList();
    this.ParentList = [];
  }

  defaultmenuForm() {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      url: [''],
      icon: ['', Validators.required],
      order: ['', Validators.required],
      parentMenu: [null]
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



  addMenu() {
    this.defaultmenuForm();
    this.defaultResourceForm();
    this.isAddMenu = true;
    this.isEditMenu = false;
  }

  backToRoleList() {
    this.isEditMenu = false;
    this.isAddMenu = false;
    this.router.navigate(['/admin/MenuMaster/List']);
  }

  toggleCollapse1(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }


  setMenuId(id: string) {
    this.menuId = id;
  }

  setMenu(menu: any) {
    this.menu = menu;
  }

  getAllMenuList() {
    this.loading = true;

    this.defaultLayoutService.fetchAllMenu({
      menuName:this.menuName,
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe(
      response => {
        if (response.meta.code === 200) {
          this.allMenuList = response.data.menus;
          this.totalRecords = response.data.totalRecords;  // Use API-provided totalRecords
          this.totalPages = response.data.totalPages;
          this.loading = false;

        } else {
          console.error('Failed to load MenuList:', response.meta.message);
          this.toastr.error('Error to load MenuList')
          this.loading = false;

        }
      },
      error => {
        console.error('Error fetching MenuList:', error);
        this.toastr.error(error?.error?.meta?.message)
      }
    );
  }

  getAllParentMenuList() {
    this.defaultLayoutService.getAllActiveMenu(null).subscribe(
      response => {
        if (response.meta.code === 200) {
          this.ParentList = response.data;
        } else {
          console.error('Failed to load parentMenuList:', response.meta.message);
        }
      },
      error => {
        console.error('Error fetching MenuList:', error);
      }
    );
  }


  saveMenu(saveAndEdit: boolean) {
    if (this.menuForm.valid) {
      const menuData = this.menuForm.value;

      if (menuData.parentMenu !== null && menuData.route === '') {
        this.toastr.info('Please fill out the route')
        return;
      }

      // Condition 2: Check if order is a floating-point value
      if (menuData.parentMenu == null && menuData.order % 1 !== 0) {
        alert('Parent name is required');
        return;
      }

      console.log("menudata", menuData)
      // Proceed with saving the menu if no errors
      this.defaultLayoutService.AddNewMenu(menuData).subscribe(
        (response: any) => {
          console.log('Menu added successfully:', response);
          this.toastr.success('Menu saved successfully');
          this.menuId=response.data._id;
          if (saveAndEdit) {
            this.isEditMenu = false;
            this.isAddMenu = false;
            this.menuForm.reset();
            this.backToRoleList();
          }
          else{
            this.router.navigate(['/admin/MenuMaster/Edit',this.menuId]);

            // this.editMenu(this.menuId);
          }
          this.getAllMenuList();
        },
        (error: any) => {
          console.error('Error adding menu:', error);
          this.toastr.error('Error adding menu')
        }
      );
    } else {
      this.menuForm.markAllAsTouched();
    }
  }


  editMenu(id: any) {
    this.isAddMenu = true;
    this.isShowButton = true;
    this.menuId = id;
    this.isEditMenu = true;
    this.defaultLayoutService.fetchMenuById(id).subscribe(
      (response) => {
        this.menuForm.patchValue(response.data);
        this.menuData = response.data;
      },
      (error) => {
        console.error('Error fetching menu data:', error);
        this.toastr.error('Error fetching menu data')

      }
    );
  }


  updateMenu(saveAndEdit: boolean): void {
    if (this.menuForm.valid) {
      const menuData = this.menuForm.value;
      if (menuData.parentMenu !== null && menuData.route === '') {
        alert('Please fill out the route.');
        return;
      }
      if (menuData.parentMenu == null && menuData.order % 1 !== 0) {
        alert('Parent name is required');
        return;
      }

      const updatedData = {
        name: this.menuForm.get('name')?.value,
        icon: this.menuForm.get('icon')?.value,
        order: this.menuForm.get('order')?.value,
        parentMenu: this.menuForm.get('parentMenu')?.value,
        url: this.menuForm.get('url')?.value,
        id: this.menuId
      };

      this.defaultLayoutService.updateMenuById(updatedData).subscribe(
        (response: any) => {
          this.toastr.success('Menu updated successfully');
          if (saveAndEdit) {
            this.isEditMenu = false;
            this.isAddMenu = false;
            this.menuForm.reset();
            this.menuId = null;
            this.backToRoleList();
          }
          else{
            this.editMenu(this.menuId);
          }
          this.getAllMenuList();
        },
        (error: any) => {
          console.error('Error updating Menu:', error);
          this.toastr.error('Error updating Menu')
        }
      );
    } else {
      this.menuForm.markAllAsTouched();
    }
  }


  deleteMenu(menu: any) {
    const menuDeActive = {
      id: menu._id,
      isDeleted: true
    };
    this.defaultLayoutService.menuActiveDeActive(menuDeActive).subscribe(
      (response) => {
        console.log('menu deleted successfully:', response);
        this.toastr.success('Menu deleted successfully')
        this.getAllMenuList();
      },
      (error) => {
        console.error('Error deleting menu:', error);
        this.toastr.error('Error deleting menu')
      }
    );
  }

  reActiveMenu(menu: any) {
    const menuReActive = {
      id: menu._id,
      isDeleted: false
    };
    this.defaultLayoutService.menuActiveDeActive(menuReActive).subscribe(
      (response) => {
        console.log('menu active successfully:', response);
        this.toastr.success('Menu active successfully');
        this.getAllMenuList();
      },
      (error) => {
        console.error('Error active menu:', error);
        this.toastr.error(error?.error?.meta?.errorDetails)
      }
    );
  }

  deactiveMenu() {
    const menuDeActive = {
      id: this.menuId,
      isDeleted: true
    };
    this.defaultLayoutService.menuActiveDeActive(menuDeActive).subscribe(
      (response) => {
        console.log('menu deleted successfully:', response);
        this.toastr.success('Menu deleted successfully')
        this.editMenu(this.menuId);
        this.getAllMenuList();
      },
      (error) => {
        console.error('Error deleting menu:', error);
        this.toastr.error('Error deleting menu')
      }
    );
  }

  activeMenu() {
    const menuReActive = {
      id: this.menuId,
      isDeleted: false
    };
    this.defaultLayoutService.menuActiveDeActive(menuReActive).subscribe(
      (response) => {
        console.log('menu active successfully:', response);
        this.toastr.success('Menu active successfully');
        this.editMenu(this.menuId);
        this.getAllMenuList();
      },
      (error) => {
        console.error('Error active menu:', error);
        this.toastr.error('Error active menu')
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
    this.getAllMenuList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllMenuList(); // Fetch data with the new page size
  }
}