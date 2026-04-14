import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, RowComponent, TextColorDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
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
    FormCheckComponent, FormCheckInputDirective,
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
export class CountriesComponent implements OnInit {
  allCountryList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  countryForm!: FormGroup;
  isAddCountries: boolean = false;
  isEditCountry: boolean = false;
  collapses = [true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  languages: any = [];
  flagImages: any = [];
  currencies: any = [];
  countryId: any;
  countryData:any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  selectedCurrency: string | null = null;
  isShowButton: boolean = false
  country: any;
  selectAllChecked: boolean = false;
  isEditState: boolean = false;
  isShowStateSaveUpdateButton: boolean = false;
  stateForm!: FormGroup;
  stateList: any = [];
  state: any;
  stateId: any;
  isModalShow: boolean = false;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  stateCurrentPage: number = 1;
  statePageSize: number = 10;
  totalStateRecords: number = 0;
  totalStatePages: number = 1;
  public visible = false;
  loading: boolean = false; 

  countryName:string=''
  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/Country/Create') {
      this.isAddCountries = true;
      this.isEditCountry = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/Country/Edit/')) {
      const countryId = this.route.snapshot.paramMap.get('id');
      if (countryId) {
        this.editcountry(countryId);
      }
      this.isAddCountries = true;
      this.isEditCountry = true;
    } else {
      this.isAddCountries = false;
      this.isEditCountry = false;
      this.router.navigate(['/admin/Country/List']);

    }
    let pagePermission = { menuName: "Countries" }
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
    this.defaultcountryForm();
    this.defaultResourceForm();
    this.getAllCountryList();
    this.getPageResourcesList();
    this.defaultStateForm();

  }

  defaultcountryForm() {
    this.countryForm = this.fb.group({
      countryName: ['', Validators.required],
      twoLetterIsoCode: ['', Validators.required],
      threeLetterIsoCode: ['', Validators.required],
      numericIsoCode: [''],
      subjectToVat: [false],
      published: [false],
      order: []
    });
  }

  defaultResourceForm() {
    this.resourceForm = this.fb.group({
      resourceName: ['', Validators.required],  // Add validation for required fields
      value: ['', Validators.required]
    });
  }


  defaultStateForm() {
    this.stateForm = this.fb.group({
      stateName: ['', Validators.required],
      abbreviation: [''],
      published: [false],
      order: []

    });
  }


  getPageResourcesList() {
    this.allPageResourcesList = JSON.parse(localStorage.getItem('resources') || '{}');

  }

  getAllResourcesList() {
    this.defaultLayoutService.getAllResources({ countryId: this.countryId }).subscribe((Response: any) => {
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
    this.defaultLayoutService.getAllResources({ countryId: '6751515ce8be630bc927fda4' }).subscribe((Response: any) => {
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

  addCountry() {
    this.defaultcountryForm();
    this.defaultResourceForm();
    this.isAddCountries = true;
    this.isEditCountry = false;
  }

  backToCountryList() {
    this.isEditCountry = false;
    this.isAddCountries = false;
    this.getAllCountryList();
    this.router.navigate(['/admin/Country/List']);
  }

  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }




  setCountryId(id: string) {
    this.countryId = id;
  }

  setCountry(country: any) {
    this.country = country;
  }


  setState(state: any) {
    this.state = state;
  }


  setStateId(id: string) {
    this.stateId = id;
  }

  toggleSelectAll() {
    this.allCountryList.forEach((country: any) => {
      country.isChecked = this.selectAllChecked;
    });
  }

  handleLiveChange(event: any) {
    this.visible = event;
  }

  updateSelectAllState() {
    this.selectAllChecked = this.allCountryList.every((country: any) => country.isChecked);
  }

  isAnyRowSelected(): boolean {
    return this.allCountryList.some((country: any) => country.isChecked);
  }


  publishSelectedCountries() {
    const selectedIds = this.allCountryList
      .filter((country: any) => country.isChecked)
      .map((country: any) => country._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: 'false'
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.CountryMultiActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('Countries published successfully:', response);
          this.getAllCountryList();
          this.selectAllChecked = false;
          this.allCountryList.forEach((country: any) => {
            country.isChecked = false;
          });
          this.updateSelectAllState();
          this.toggleSelectAll();
          this.toastr.success('Countries published successfully');

        },
        (error) => {
          console.error('Error publishing countries:', error);
          this.toastr.error('Error publishing countries');

        }
      );
    } else {
      this.toastr.error('No countries selected');
    }
  }


  unpublishSelectedCountries() {
    const selectedIds = this.allCountryList
      .filter((country: any) => country.isChecked)
      .map((country: any) => country._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: 'true'
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.CountryMultiActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('Countries unpublished successfully:', response);
          this.toastr.success('Countries unpublished successfully');

          this.getAllCountryList();
          this.selectAllChecked = false;
          this.allCountryList.forEach((country: any) => {
            country.isChecked = false;
          });
          this.updateSelectAllState();
          this.toggleSelectAll();


        },
        (error) => {
          console.error('Error unpublishing countries:', error);
          this.toastr.error('Error unpublishing countries');

        }
      );
    } else {
      this.toastr.error('No countries selected.');
    }
  }



  getAllCountryList() {
    this.loading = true;
    this.defaultLayoutService.getAllCountry({
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((response: any) => {
      if (response.meta.code === 200) {
        this.allCountryList = response.data.countries;
        this.totalRecords = response.data.totalRecords;
        this.totalPages = response.data.totalPages;
        this.loading = false;

      }
    });
  }

  editcountry(selectedCountryId: any) {
    this.defaultcountryForm();
    this.countryId = selectedCountryId;
    this.isAddCountries = true;
    this.isEditCountry = true;
    this.defaultLayoutService.getCountryDetailsById(this.countryId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.countryData = response.data;
          this.countryForm.patchValue(this.countryData);
          this.countryName=this.countryData.countryName
          this.getStateByCountryId();
        } else {
          console.error('Failed to fetch country details:', response.meta.message);
          this.toastr.error('Failed to fetch country details');
        }
      },
      (error: any) => {
        console.error('Error fetching country details:', error);
        this.toastr.error('Failed to fetch country details');

      }
    );
  }


  createNewContryInfo(saveAndEdit: boolean) {
    if (this.countryForm.valid) {
      const countryData = this.countryForm.value;
      this.defaultLayoutService.createNewCountry(countryData).subscribe((Response: any) => {
        this.countryId = Response.data._id;
        console.log('country saved successfully:', Response);
        this.toastr.success('country saved successfully');
        if (saveAndEdit) {
          this.isAddCountries = false;
          this.backToCountryList();
          this.getAllCountryList();
        }
        else{
          this.router.navigate(['/admin/Country/Edit',this.countryId]);

          // this.editcountry(this.countryId)
        }
      },
        (error) => {
          console.error('Error saving country:', error);
          this.toastr.error('Error saving country');
        });
    } else {
      this.countryForm.markAllAsTouched();
    }
  }

  updateCountry(saveAndEdit: boolean): void {
    if (this.countryForm.valid) {
      const updatedData = {
        countryName: this.countryForm.get('countryName')?.value,
        twoLetterIsoCode: this.countryForm.get('twoLetterIsoCode')?.value,
        threeLetterIsoCode: this.countryForm.get('threeLetterIsoCode')?.value,
        numericIsoCode: this.countryForm.get('numericIsoCode')?.value,
        subjectToVat: this.countryForm.get('subjectToVat')?.value,
        published: this.countryForm.get('published')?.value,
        order: this.countryForm.get('order')?.value,
        id: this.countryId
      };

      this.defaultLayoutService.updateCountryById(updatedData).subscribe(
        (response: any) => {
          console.log('country updated successfully:', response);
          this.toastr.success('country updated successfully');

          if (saveAndEdit) {
            this.isAddCountries = false;
            this.isEditCountry=false;
            this.countryId = null;
            this.backToCountryList();
            this.getAllCountryList();
          }
          else{this.editcountry(this.countryId)}
        },
        (error: any) => {
          console.error('Error updating country:', error);
          this.toastr.error('Error updating country');
        }
      );
    } else {
      this.countryForm.markAllAsTouched();
    }
  }




  deleteCountry(country: any) {
    console.log("country", country)
    const countryDeActive = {
      ids: [country._id],
      isDeleted: true
    };
    this.defaultLayoutService.CountryMultiActiveDeActive(countryDeActive).subscribe(
      (response) => {
        console.log('country delete successfully:', response);
        this.toastr.success('country delete successfully');
        this.getAllCountryList();
      },
      (error) => {
        console.error('Error deleting country:', error);
        this.toastr.success('Error deleting country');

      }
    );
  }

  reActiveCountry(country: any) {
    const countryReActive = {
      ids: [country._id],
      isDeleted: false
    };
    this.defaultLayoutService.CountryMultiActiveDeActive(countryReActive).subscribe(
      (response) => {
        console.log('country active successfully:', response);
        this.toastr.success('country active successfully');

        this.getAllCountryList();
      },
      (error) => {
        console.error('Error active country:', error);
        this.toastr.error('Error active country');
      }
    );
  }

  deactiveCountry() {
    const countryDeActive = {
      ids: [this.countryId],
      isDeleted: true
    };
    this.defaultLayoutService.CountryMultiActiveDeActive(countryDeActive).subscribe(
      (response) => {
        console.log('country delete successfully:', response);
        this.toastr.success('country delete successfully');
        this.editcountry(this.countryId);
        this.getAllCountryList();
      },
      (error) => {
        console.error('Error deleting country:', error);
        this.toastr.success('Error deleting country');

      }
    );
  }

  activeCountry() {
    const countryReActive = {
      ids: [this.countryId],
      isDeleted: false
    };
    this.defaultLayoutService.CountryMultiActiveDeActive(countryReActive).subscribe(
      (response) => {
        console.log('country active successfully:', response);
        this.toastr.success('country active successfully');
        this.editcountry(this.countryId);
        this.getAllCountryList();
      },
      (error) => {
        console.error('Error active country:', error);
        this.toastr.error('Error active country');
      }
    );
  }


  createNewState() {
    if (this.stateForm.valid) {
      const stateData = this.stateForm.value;
      const countryId = this.countryId;
      const requestData = { ...stateData, countryId };
      this.defaultLayoutService.createNewState(requestData).subscribe(
        (response: any) => {
          console.log('State saved successfully:', response);
          this.toastr.success('State saved successfully');
          this.visible = !this.visible;
          this.getStateByCountryId();
        },
        (error) => {
          console.error('Error saving state:', error);
          this.toastr.error('Error saving state');

        }
      );
    } else {
      this.stateForm.markAllAsTouched();
    }
  }



  getStateByCountryId() {
    this.defaultLayoutService.getStateDetailsByCountryId({
      countryId: this.countryId,
      limit: this.statePageSize,
      page: this.stateCurrentPage
    }).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.stateList = response.data.states;
          this.totalStateRecords = response.data.totalRecords;  // Use API-provided totalRecords
          this.totalStatePages = response.data.totalPages;      // Use API-provided totalPages
        } else {
          console.error('Failed to fetch state details:', response.meta.message);
          this.toastr.error('Failed to fetch state details')

        }
      },
      (error: any) => {
        console.error('Error fetching state details:', error);
        this.toastr.error('Error fetching state details')

      }
    );
  }


  deleteState(state: any) {
    const stateReActive = {
      id: state._id,
      isDeleted: true
    };
    this.defaultLayoutService.stateActiveDeActive(stateReActive).subscribe(
      (response) => {
        console.log('state deleted successfully:', response);
        this.toastr.success('state deleted successfully');

        this.getStateByCountryId();
      },
      (error) => {
        console.error('Error deleting state:', error);
        this.toastr.error('Error deleting state');

      }
    );
  }

  reActiveState(state: any) {
    const stateReActive = {
      id: state._id,
      isDeleted: false
    };
    this.defaultLayoutService.stateActiveDeActive(stateReActive).subscribe(
      (response) => {
        console.log('state active successfully:', response);
        this.toastr.success('state active successfully')

        this.getStateByCountryId();
      },
      (error) => {
        console.error('Error deleting state:', error);
        this.toastr.error('Error deleting state')

      }
    );
  }

  openAddStateModal() {
    this.defaultStateForm();
    this.isEditState = false;
    this.isShowStateSaveUpdateButton = false;
  }

  editState(id: any) {
    this.defaultStateForm();
    this.stateId = id;
    this.isEditState = true;
    this.isShowStateSaveUpdateButton = true;

    this.defaultLayoutService.getStateDetailsById(this.stateId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.stateForm.patchValue(response.data);
        } else {
          console.error('Failed to fetch state details:', response.meta.message);
          this.toastr.error('Failed to fetch state details')

        }
      },
      (error: any) => {
        console.error('Error fetching state details:', error);
        this.toastr.error('Error fetching state details')

      }
    );
  }

  updateState(): void {
    if (this.stateForm.valid) {
      const updatedData = {
        countryId:this.countryId,
        stateName: this.stateForm.get('stateName')?.value,
        abbreviation: this.stateForm.get('abbreviation')?.value,
        published: this.stateForm.get('published')?.value,
        order: this.stateForm.get('order')?.value,
        id: this.stateId
      };

      this.defaultLayoutService.updateStateById(updatedData).subscribe(
        (response: any) => {
          console.log('state updated successfully:', response);
          this.toastr.success('state updated successfully')
          this.visible = !this.visible;
          this.getStateByCountryId();
          this.isEditState = false;
        },
        (error: any) => {
          console.error('Error updating state:', error);
          this.toastr.error('Error updating state')
        }
      );
    } else {
      this.stateForm.markAllAsTouched();
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
    this.getAllCountryList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllCountryList(); // Fetch data with the new page size
  }





  // To get the list of page numbers for pagination UI
  getStatePagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3; // Number of visible page numbers
    const halfRange = Math.floor(maxVisiblePages / 2);

    // Always include the first page
    pagination.push(1);

    // Add "..." if the range starts after the first page
    if (this.stateCurrentPage > halfRange + 2) {
      pagination.push("...");
    }

    // Pages around the current page
    const startPage = Math.max(2, this.stateCurrentPage - halfRange);
    const endPage = Math.min(this.totalStatePages - 1, this.stateCurrentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    // Add "..." if the range ends before the last page
    if (this.stateCurrentPage < this.totalStatePages - halfRange - 1) {
      pagination.push("...");
    }

    // Always include the last page
    if (this.totalStatePages > 1) {
      pagination.push(this.totalStatePages);
    }

    return pagination;
  }
  // To handle page change
  changeStatePage(page: number | string): void {
    if (page === "..." || page === this.stateCurrentPage) {
      return; // Do nothing for ellipses or the current page
    }
    this.stateCurrentPage = page as number;
    this.getStateByCountryId(); // Load data for the new page
  }

  // To handle page size change
  updateStatePageSize(): void {
    this.stateCurrentPage = 1; // Reset to the first page
    this.getStateByCountryId(); // Fetch data with the new page size
  }
}

