import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
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
  FormControlDirective, FormLabelDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective, FormSelectDirective
} from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-accounts',
  templateUrl: './email-accounts.component.html',
  styleUrl: './email-accounts.component.scss',
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
    RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, ButtonDirective, ThemeDirective
]
})
export class EmailAccountsComponent {

  allEmailList: any = [];
  allPageResourcesList: any = [];
  emailForm!: FormGroup;
  isAddEmail: boolean = false;
  isEditEmail: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  bloodGroups: any = [];
  emailId: any;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  selectedUserImage: any;
  userimageFile: File | null = null;
  rolelist: any;
  user: any;
  email: any;
  emailData:any;
  loading: boolean = false; 

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private toastr: ToastrService,
            private router: Router,
            private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/EmailAccount/Create') {
      this.isAddEmail = true;
      this.isEditEmail = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/EmailAccount/Edit/')) {
      const emailId = this.route.snapshot.paramMap.get('id');
      if (emailId) {
        this.editEmail(emailId);
      }
      this.isAddEmail = true;
      this.isEditEmail = true;
    } else {
      this.isAddEmail = false;
      this.isEditEmail = false;
      this.router.navigate(['/admin/EmailAccount/List']);
    }
    let pagePermission = { menuName: "Email Accounts" }
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
    this.getAllEmailList();
  }

  defaultemailForm() {
    this.emailForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      host: ['', Validators.required],
      password: [''],
      port: ['', Validators.required],
      ssl: [false],
      userName:[''],
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
    this.emailId = id;
  }

  setEmail(email: any) {
    this.email = email;
  }


  getAllEmailList() {
    this.loading = true;
    this.defaultLayoutService.getAllEmailAccount({limit: this.pageSize,
      page: this.currentPage}).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allEmailList = Response.data.emailAccounts;
        this.totalRecords = Response.data.totalRecords;  
        this.totalPages = Response.data.totalPages; 
        this.loading = false;
 
      }
    })
  }

  updateLocalStorageResources() {
    this.defaultLayoutService.getAllResources({ emailId: '6751515ce8be630bc927fda4' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let allResourcesList = Response.data.resources;
        if (localStorage.getItem('resources')) {
          localStorage.removeItem('resources');
        }
        localStorage.setItem('resources', JSON.stringify(allResourcesList));
      }
    })
  }

  addEmail() {
    this.defaultemailForm();
    this.isAddEmail = true;
    this.isEditEmail = false;
  }

  backToEmailList() {
    this.isEditEmail = false;
    this.isAddEmail = false;
    this.router.navigate(['/admin/EmailAccount/List']);

  }

  editEmail(selectedEmailId: any) {
    this.defaultemailForm();
    this.emailId = selectedEmailId;
    this.isAddEmail = true;
    this.isEditEmail = true;

    this.defaultLayoutService.getEmailDetailsById(this.emailId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.emailForm.patchValue(response.data);
          this.emailData=response.data;
        } else {
          console.error('Failed to fetch email details:', response.meta.message);
          this.toastr.error('Failed to fetch email details')

        }
      },
      (error: any) => {
        console.error('Error fetching email details:', error);
        this.toastr.error('Error fetching email details')

      }
    );
  }


  createEmail(saveAndEdit:boolean) {
    if (this.emailForm.valid) {
      const emailData = this.emailForm.value;
      this.defaultLayoutService.createNewEmailAccount(emailData).subscribe(
        (response:any) => {
          this.toastr.success('email saved successfully');
          this.emailId=response.data._id;
          if(saveAndEdit){
            this.isAddEmail = false;
            this.backToEmailList();
          }
          else{
            this.router.navigate(['/admin/EmailAccount/Edit',this.emailId]);
        // this.editEmail(this.emailId);
          }
          this.getAllEmailList();
        },
        (error) => {
          console.error('Error saving email:', error);
          this.toastr.error('Error saving email')

        }
      );
    } else {
      this.emailForm.markAllAsTouched();
    }
  }


  updateEmail(saveAndEdit:boolean): void {
    if (this.emailForm.valid) {
      const updatedData = {
        emailAddress: this.emailForm.get('emailAddress')?.value,
        displayName: this.emailForm.get('displayName')?.value,
        host: this.emailForm.get('host')?.value,
        // password: this.emailForm.get('password')?.value,
        port: this.emailForm.get('port')?.value,
        ssl: this.emailForm.get('ssl')?.value,
        userName:this.emailForm.value.userName,
        id: this.emailId
      };

      this.defaultLayoutService.updateEmailById(updatedData).subscribe(
        (response: any) => {
          this.toastr.success('email updated successfully')
        if(saveAndEdit)
        {
          this.isAddEmail = false;
          this.emailId = null;
          this.isEditEmail = false;
          this.backToEmailList();
        }
        else{
        this.editEmail(this.emailId);
        }
        this.getAllEmailList();
        },
        (error: any) => {
          console.error('Error updating Email:', error);
          this.toastr.error('Error updating email')
        }
      );
    } else {
      this.emailForm.markAllAsTouched();
    }
  }





  deleteEmail(email: any) {
    const emailReActive = {
      id: email._id,
      isDeleted: true
    };
    this.defaultLayoutService.emailAccountActiveDeActive(emailReActive).subscribe(
      (response) => {
        this.toastr.success('email deleted successfully')
        this.getAllEmailList();
      },
      (error) => {
        console.error('Error deleting email:', error);
        this.toastr.error('Error deleting email')

      }
    );
  }

  reActiveEmail(email: any) {
    const emailReActive = {
      id: email._id,
      isDeleted: false
    };
    this.defaultLayoutService.emailAccountActiveDeActive(emailReActive).subscribe(
      (response) => {
        this.toastr.success('email active successfully')
        this.getAllEmailList();
      },
      (error) => {
        console.error('Error deleting email:', error);
        this.toastr.error('Error deleting email')

      }
    );
  }

  deactiveEmail() {
    const emailReActive = {
      id: this.emailId,
      isDeleted: true
    };
    this.defaultLayoutService.emailAccountActiveDeActive(emailReActive).subscribe(
      (response) => {
        this.toastr.success('email deleted successfully');
        this.editEmail(this.emailId);
        this.getAllEmailList();
      },
      (error) => {
        console.error('Error deleting email:', error);
        this.toastr.error('Error deleting email')

      }
    );
  }

  activeEmail() {
    const emailReActive = {
      id: this.emailId,
      isDeleted: false
    };
    this.defaultLayoutService.emailAccountActiveDeActive(emailReActive).subscribe(
      (response) => {
        this.toastr.success('email active successfully');
        this.editEmail(this.emailId);
        this.getAllEmailList();
      },
      (error) => {
        console.error('Error deleting email:', error);
        this.toastr.error('Error deleting email')

      }
    );
  }

  emailAccountDefault(id: string) {
    const emailData = {
      id: id,
      isDefault: true
    };
    this.defaultLayoutService.emailSetDefault(emailData).subscribe((response: any) => {
      if (response.meta.code === 200) {
        this.toastr.success('email account default successfully')
        this.getAllEmailList();
      }
    }, (error: any) => {
      console.error('Error email account default', error);
      this.toastr.error('Error email account default')

    });

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
    this.getAllEmailList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllEmailList(); // Fetch data with the new page size
  }


  changePassword() {
    if (this.emailForm.valid) {
      const updatedData = {
        newPassword: this.emailForm.value.password,
        id: this.emailId
      };

      this.defaultLayoutService.updateEmailAccountPassword(updatedData).subscribe(
        (response: any) => {
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
      this.toastr.error('Error updating password')
    }
  }

}
