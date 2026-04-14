import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import { DocsExampleComponent } from '@docs-components/public-api';
import { AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ButtonCloseDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalToggleDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss',
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
    ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective,
    ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, ButtonDirective,
  ]
})



export class CurrenciesComponent implements OnInit {
  allCurrencyList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  currencyForm!: FormGroup;
  isAddCurrency: boolean = false;
  isEditLanguage: boolean = false;
  collapses = [true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  exchagies: any = [];
  flagImages: any = [];
  currencies: any = [];
  languageId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  selectedCurrency: string | null = null;
  rounding: any = [];
  isShowButton: boolean = false
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  // limit: number = 10;
  currencyName:string =''
  isShowTable: boolean = false;
  public visible = false;
  isEditCurrency: boolean = false;
  currencyId: any;
  selectedCurrencyId: string | null = null; // Variable to store selected currency ID
  displayLocale: any = [];
  currencyData:any;
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
    if (currentUrl === '/admin/Currency/Create') {
      this.isAddCurrency = true;
      this.isEditCurrency = false; // Reset edit flag
    } else if (currentUrl.startsWith('/admin/Currency/Edit/')) {
      const currencyId = this.route.snapshot.paramMap.get('id');
      if (currencyId) {
        this.editCurrency(currencyId);
      }
      this.isAddCurrency = true;
      this.isEditCurrency = true;
    } else {
      this.isAddCurrency = false;
      this.isEditCurrency = false;
      this.router.navigate(['/admin/Currency/List']);

    }

    let pagePermission = { menuName: "Currencies" }
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
    this.defaultcurrencyForm();
    this.defaultResourceForm();
    // this.getAllLanguagesList();
    this.getPageResourcesList();
    this.getAllCurrencyList();

    this.exchagies = [
      { label: 'ECB exchange rate provider', value: '' },

    ];

    this.displayLocale = [
      { label: 'English (Belize). en-BZ', value: '1' },
      { label: 'English (Belgium). en-BE', value: '2' },
      { label: 'English (Botswana). en-BW', value: '3' },
      { label: 'English (U.S. Outlying Islands). en-UM', value: '4' },
    ];

    this.rounding = [
      { label: 'Rounding up with 0.05 intervals (0.06 round to 0.10)', value: '1' },
      { label: 'Rounding down with 0.05 intervals (0.06 round to 0.05)', value: '2' },
      { label: 'Rounding up with 0.10 intervals (1.05 round to 1.10)', value: '3' },
      { label: 'Rounding down with 0.10 intervals (1.05 round to 1.00)', value: '4' },
      { label: 'Rounding with 0.50 intervals', value: 'EUR' },
      { label: 'Rounding with 1.00 intervals (1.01-1.49 round to 1.00, 1.50-1.99 round to 2.00)', value: '5' },
      { label: 'Rounding up with 1.00 intervals (1.01–1.99 round to 2.00)', value: '6' },
    ];
  }

  defaultcurrencyForm() {
    this.currencyForm = this.fb.group({
      currencyName: ['', Validators.required],
      currencyCode: ['', Validators.required],
      rate: [''],
      displayLocale: [''],
      roundingType: [''],
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

  addCurrencies() {
    this.defaultcurrencyForm();
    this.defaultResourceForm();
    this.isAddCurrency = true;
    this.isEditCurrency = false;
  }

  backToCurrenciesList() {
    this.isEditCurrency = false;
    this.isAddCurrency = false;
    this.router.navigate(['/admin/Currency/List']);

  }

  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }



  setCurrenciesId(id: string) {
    this.currencyId = id;
  }

  setcurrencies(currencies: any) {
    this.currencies = currencies;
  }

  editCurrency(id: any) {
    this.isAddCurrency = true;
    this.isEditCurrency = true;
    this.currencyId = id;
    this.defaultLayoutService.getCurrencyById(id).subscribe(
      (response) => {
        this.currencyForm.patchValue(response.data);
        this.currencyName = response.data.currencyName
this.currencyData=response.data;

      },
      (error) => {
        console.error('Error fetching currencies data:', error);
        this.toastr.error('Error saving currencies data')
      }
    );
  }



  saveCurrencies(saveAndEdit: boolean) {
    if (this.currencyForm.valid) {
      let saveCurrenciesData = this.currencyForm.value;
      this.defaultLayoutService.saveCurrenciesData(saveCurrenciesData).subscribe((response : any) => {

      this.currencyId = response.data._id;
        if (saveAndEdit) {
          this.isAddCurrency = false;
          this.backToCurrenciesList();
          this.getAllCurrencyList();
        }
        else{
          // this.editCurrency(this.currencyId);
          this.router.navigate(['/admin/Currency/Edit',this.currencyId]);

        }
        this.toastr.success('Currencies saved successfully')
      },
        (error) => {
          console.error('Error saving currencies:', error);
          this.toastr.error('Error saving currencies')
        });
    }
    else {
      this.currencyForm.markAllAsTouched();
    }
  }

  getAllCurrencyList() {
        this.loading = true;
    this.defaultLayoutService.getAllCurrency({
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCurrencyList = Response.data.currencies;
        this.totalRecords = Response.data.totalRecords;
        this.totalPages = Response.data.totalPages;
        this.loading = false;

      }
    })
  }

  updateCurreny(saveAndEdit: boolean): void {
    if (this.currencyForm.valid) {
      const updatedData = {
        currencyName: this.currencyForm.get('currencyName')?.value,
        currencyCode: this.currencyForm.get('currencyCode')?.value,
        rate: this.currencyForm.get('rate')?.value,
        displayLocale: this.currencyForm.get('displayLocale')?.value,
        roundingType: this.currencyForm.get('roundingType')?.value,
        published: this.currencyForm.get('published')?.value,
        order: this.currencyForm.get('order')?.value,
        id: this.currencyId
      };

      this.defaultLayoutService.updateCurrenyById(updatedData).subscribe(
        (response: any) => {
        
          if (saveAndEdit) {
            this.isAddCurrency = false;
            this.isEditCurrency = false;
            this.currencyId = null;
            this.backToCurrenciesList();
            this.getAllCurrencyList();
          }
          else{this.editCurrency(this.currencyId)}
          this.toastr.success('Currencies updated successfully')

        },
        (error: any) => {
          console.error('Error updating currencies:', error);
          this.toastr.error('Error saving currencies')
        }
      );
    } else {
      this.currencyForm.markAllAsTouched();
    }
  }

  deletecurrencies(currencies: any) {
    const currencyData = {
      id: currencies._id,
      isDeleted: true
    };
    this.defaultLayoutService.currencyActiveDeActive(currencyData).subscribe(
      (response) => {
        this.toastr.success('currencies deleted successfully')
        this.getAllCurrencyList();
      },
      (error) => {
        console.error('Error deleting currencies:', error);
        this.toastr.error('Error deleting currencies')
      });
  }

  reActivecurrencies(currencies: any) {
    const currencyData = {
      id: currencies._id,
      isDeleted: false
    };
    this.defaultLayoutService.currencyActiveDeActive(currencyData).subscribe(
      (response) => {
        this.getAllCurrencyList();
        this.toastr.success('currencies active successfully')

      },
      (error) => {
        console.error('Error deleting currencies:', error);
        this.toastr.error('Error deleting currencies')
      }
    );
  }

  deactivecurrencies() {
    const currencyData = {
      id: this.currencyId,
      isDeleted: true
    };
    this.defaultLayoutService.currencyActiveDeActive(currencyData).subscribe(
      (response) => {
        this.toastr.success('currencies deleted successfully');
        this.editCurrency(this.currencyId);
        this.getAllCurrencyList();
      },
      (error) => {
        console.error('Error deleting currencies:', error);
        this.toastr.error('Error deleting currencies')
      });
  }

  activecurrencies() {
    const currencyData = {
      id: this.currencyId,
      isDeleted: false
    };
    this.defaultLayoutService.currencyActiveDeActive(currencyData).subscribe(
      (response) => {
        this.getAllCurrencyList();
        this.toastr.success('currencies active successfully');
        this.editCurrency(this.currencyId);

      },
      (error) => {
        console.error('Error deleting currencies:', error);
        this.toastr.error('Error deleting currencies')
      }
    );
  }

  setCurrencyPrimaryId(currencyId: string) {
    this.selectedCurrencyId = currencyId;
  }

  setCurrencyStoreId(currencyId: string) {
    this.selectedCurrencyId = currencyId;
  }

  markAsPrimaryExchange() {
    if (this.selectedCurrencyId) {
      const currencyData = {
        id: this.selectedCurrencyId,
        primaryExchangeRateCurrency: true
      };
      this.defaultLayoutService.markAsPrimaryExchangeCurrency(currencyData).subscribe((response: any) => {
        if (response.meta.code === 200) {
          this.getAllCurrencyList();
          this.toastr.success('Currency marked as primary exchange')

        }
      }, (error: any) => {
        console.error('Error marking currency as primary exchange' , error);
        this.toastr.error('Error marking currency as primary exchange')

      });
    }
  }

  markAsPrimaryStore() {
    if (this.selectedCurrencyId) {
      const currencyData = {
        id: this.selectedCurrencyId,
        primaryStoreCurrency: true
      };
      this.defaultLayoutService.markAsPrimaryStoreCurrency(currencyData).subscribe((response: any) => {
        if (response.meta.code === 200) {
          this.getAllCurrencyList();
          this.toastr.success('Currency marked as primary store')

        }
      }, (error: any) => {
        console.error('Error marking currency as primary store', error);
        this.toastr.error('Error marking currency as primary store')
      });
    }
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  addNew() {
    this.isShowTable = true;
  }

  backToList() {
    this.isShowTable = false;
  }

  getPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3; 
    const halfRange = Math.floor(maxVisiblePages / 2);

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
    this.getAllCurrencyList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllCurrencyList(); // Fetch data with the new page size
  }

}
