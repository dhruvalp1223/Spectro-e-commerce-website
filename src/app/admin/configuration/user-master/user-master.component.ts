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
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service'
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-master',
  standalone: true,
  templateUrl: './user-master.component.html',
  styleUrl: './user-master.component.scss',
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
    NgSelectModule,
    FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
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
export class UserMasterComponent implements OnInit {
  Math = Math;
  allUsersList: any = [];
  allPageResourcesList: any = [];
  userInfoForm!: FormGroup;
  isAddUser: boolean = false;
  isEditUser: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  bloodGroups: any = [];
  userId: any;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  limit: number = 10;
  selectedUserImage: any;
  userimageFile: File | null = null;
  rolelist: any;
  isShowButton: boolean = false
  user: any;
  userName: string = '';
  userData: any;
  loading: boolean = false; 
  todayDate: any;

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/UserMaster/Create') {
      this.isAddUser = true;
      this.isEditUser = false;
    } else if (currentUrl.startsWith('/admin/UserMaster/Edit/')) {
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        this.editUser(userId);
      }
      this.isAddUser = true;
      this.isEditUser = true;
    } else {
      this.isAddUser = false;
      this.isEditUser = false;
      this.router.navigate(['/admin/UserMaster/List']);
    }

    this.todayDate = new Date().toISOString().split('T')[0];

    let pagePermission = { menuName: "User Master" }
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
    this.defaultUserInfoForm();
    this.getPageResourcesList();
    this.getAllUsersList();
    this.getRoleList();
    this.bloodGroups = [
      { label: 'A+', value: 'A+' },
      { label: 'A-', value: 'A-' },
      { label: 'B+', value: 'B+' },
      { label: 'B-', value: 'B-' },
      { label: 'O+', value: 'O+' },
      { label: 'O-', value: 'O-' },
      { label: 'AB+', value: 'AB+' },
      { label: 'AB-', value: 'AB-' },
    ];
  }

  private checkCurrentRoute(): void {

  }

  defaultUserInfoForm() {
    this.userInfoForm = this.fb.group({
      employeeNumber: [''],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pwd: [''],
      gender: ['', Validators.required],
      contact: ['', Validators.required],
      dob: ['', Validators.required],
      bloodGroup: [''],
      permanentAddress: [''],
      currentAddress: [''],
      roleId: ['', Validators.required]
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


  setUserId(id: string) {
    this.userId = id;
  }

  setUser(user: any) {
    this.user = user;
  }


  getAllUsersList() {
    this.loading = true;
    this.defaultLayoutService.getAllUsers({
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allUsersList = Response.data.users;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
        this.loading = false;
      }
    })
  }

  updateLocalStorageResources() {
    this.defaultLayoutService.getAllResources({ userId: '6751515ce8be630bc927fda4' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let allResourcesList = Response.data.resources;

        if (localStorage.getItem('resources')) {
          localStorage.removeItem('resources');
        }

        localStorage.setItem('resources', JSON.stringify(allResourcesList));
      }
    })
  }

  addUser() {
    this.selectedUserImage = null
    this.defaultUserInfoForm();
    this.isAddUser = true;
    this.isEditUser = false;
  }

  backToUserList() {
    this.router.navigate(['/admin/UserMaster/List']);
    this.getAllUsersList();
  }



  editUser(selecteduserId: any) {
    this.defaultUserInfoForm();
    this.userId = selecteduserId;
    this.defaultLayoutService.getUserDetailsById(this.userId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.selectedUserImage = response.data.profileImage;

          this.userData = { ...response.data };
          if (this.userData.dob) {
            this.userData.dob = this.userData.dob.split('T')[0];
          }

          this.userInfoForm.patchValue(this.userData);
          this.userName = `${response.data.firstName} ${response.data.lastName}`;

        } else {
          console.error('Failed to fetch user details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
      }
    );
  }


  createNewUser(saveAndEdit: boolean) {

    if (this.userInfoForm.valid) {
      const formData = new FormData();
      Object.entries(this.userInfoForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      if (this.userimageFile) {
        formData.append('profileImage', this.userimageFile, this.userimageFile.name);
      }
      this.defaultLayoutService.createNewUser(formData).subscribe(
        (response: any) => {
          this.userId = response.data._id;
          if (saveAndEdit) {
            this.isAddUser = false;
            this.backToUserList();
          }
          else {
            this.router.navigate(['/admin/UserMaster/Edit', this.userId]);
            // this.editUser(this.userId);
          }
          this.getAllUsersList();
          this.toastr.success('User saved successfully')
        },
        (error) => {
          this.toastr.error(error.error.meta.message)
        }
      );
    } else {
      this.userInfoForm.markAllAsTouched();
    }
  }



  updateUser(saveAndEdit: boolean): void {
    if (this.userInfoForm.valid) {
      const formData = new FormData();

      Object.entries(this.userInfoForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      if (this.userimageFile) {
        formData.append('profileImage', this.userimageFile, this.userimageFile.name);
      } else if (this.selectedUserImage) {
        formData.append('profileImage', this.selectedUserImage);
      } else {
        formData.append('profileImage', 'null');
      }
      formData.append('id', this.userId);

      this.defaultLayoutService.updateUser(formData).subscribe(
        (response: any) => {
          if (saveAndEdit) {
            this.isAddUser = false;
            this.backToUserList();
          }
          else {
            this.editUser(this.userId);
          }
          this.getAllUsersList();

          this.toastr.success('User update successfully')
        },
        (error: any) => {
          console.error('Error updating User:', error);
          this.toastr.error(error.error.meta.message)
        }
      );
    } else {
      this.userInfoForm.markAllAsTouched();
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
      }
    );
  }

  deleteUser(user: any) {
    const userDeActive = {
      id: user._id,
      isDeleted: true
    };
    this.defaultLayoutService.userActiveDeActive(userDeActive).subscribe(
      (response) => {
        this.toastr.success('User delete successfully')

        this.getAllUsersList();
      },
      (error) => {
        console.error('Error deleting User:', error);
        this.toastr.error('Error saving USer')

      }
    );
  }

  reActiveUser(user: any) {
    const userReActive = {
      id: user._id,
      isDeleted: false
    };
    this.defaultLayoutService.userActiveDeActive(userReActive).subscribe(
      (response) => {
        this.toastr.success('User active successfully')

        this.getAllUsersList();
      },
      (error) => {
        console.error('Error active User:', error);
        this.toastr.error('Error active User')

      }
    );
  }

  deactiveUser() {
    const userDeActive = {
      id: this.userId,
      isDeleted: true
    };
    this.defaultLayoutService.userActiveDeActive(userDeActive).subscribe(
      (response) => {
        this.toastr.success('User delete successfully')
        this.editUser(this.userId);
        this.getAllUsersList();
      },
      (error) => {
        console.error('Error deleting User:', error);
        this.toastr.error('Error saving USer')

      }
    );
  }

  activeUser() {
    const userReActive = {
      id: this.userId,
      isDeleted: false
    };
    this.defaultLayoutService.userActiveDeActive(userReActive).subscribe(
      (response) => {
        this.toastr.success('User active successfully')
        this.editUser(this.userId);
        this.getAllUsersList();
      },
      (error) => {
        console.error('Error active User:', error);
        this.toastr.error('Error active User')

      }
    );
  }

  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput.click();
  }

  // Handle file selection
  onFileSelected(event: Event, inputId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      // Read the image file and set the result as the image source
      reader.onload = (e) => {
        if (inputId === 'userImage') {
          this.selectedUserImage = e.target?.result as string; // Save image as Base64 string
          this.userimageFile = file; // You can use this for uploading later if needed
        }
      };

      reader.readAsDataURL(file); // Reads the file as a data URL (Base64 encoded)
    }
  }

  // Remove image
  removeImage(event: Event, inputId: string): void {
    event.stopPropagation();
    if (inputId === 'userImage') {
      this.selectedUserImage = null;
      this.userimageFile = null;
    }
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
    this.getAllUsersList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllUsersList(); // Fetch data with the new page size
  }


  changePassword() {
      const updateUserObj = {
        newPassword: this.userInfoForm.value.pwd,
        id: this.userId
      };
      this.defaultLayoutService.updateUserPassword(updateUserObj).subscribe(
        (response: any) => {
          console.log('password updated successfully:', response);
          this.toastr.success('password updated successfully');
          this.editUser(this.userId);
        },
        (error: any) => {
          console.error('Error updating password:', error);
          this.toastr.error('Error updating password')

        }
      );
   
  }

}