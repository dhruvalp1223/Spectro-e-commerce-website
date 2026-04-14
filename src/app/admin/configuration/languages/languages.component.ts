import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
import { DocsExampleComponent } from '@docs-components/public-api';
import {
  AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
  ModalBodyComponent,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-languages',
  standalone: true, // Mark the component as standalone
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
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
    ButtonDirective
  ]
})
export class LanguagesComponent implements OnInit {
  allLanguagesList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  languageForm!: FormGroup;
  isAddLanguage: boolean = false;
  isEditLanguage: boolean = false;
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
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  isShowButton: boolean = false
  language: any;
  languageName: string = ''
  languageCurrentPage: number = 1;
  languagePageSize: number = 10;
  totalLanguageRecords: number = 0;
  totalLanguagePages: number = 1;
  resource: any;
  resourceName: any;
  resourceValue: any;
  languageData: any;
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
    if (currentUrl === '/admin/Language/Create') {
      this.isAddLanguage = true;
      this.isEditLanguage = false;
    } else if (currentUrl.startsWith('/admin/Language/Edit/')) {
      const languageId = this.route.snapshot.paramMap.get('id');
      if (languageId) {
        this.editLanguage(languageId);
      }
      this.isAddLanguage = true;
      this.isEditLanguage = true;
    } else {
      this.isAddLanguage = false;
      this.isEditLanguage = false;
      this.router.navigate(['/admin/Language/List']);

    }

    let pagePermission = { menuName: "Languages" }
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
    this.defaultLanguageForm();
    this.defaultResourceForm();
    this.getAllLanguagesList();
    this.getPageResourcesList();

    this.languages = [
      { label: 'English', value: 'en' },
      { label: 'French', value: 'fr' },
      { label: 'German', value: 'de' },
      { label: 'Japanese', value: 'jp' },
      { label: 'English', value: 'en' },
      { label: 'French', value: 'fr' },
      { label: 'German', value: 'de' },
      { label: 'Japanese', value: 'jp' },
      { label: 'English', value: 'en' },
      { label: 'French', value: 'fr' },
    ];

    // Use a third-party CDN for flag images
    this.flagImages = [
      {
        label: 'United States',
        value: 'us',
        imagePath: 'https://flagcdn.com/w40/us.png',
      },
      {
        label: 'France',
        value: 'fr',
        imagePath: 'https://flagcdn.com/w40/fr.png',
      },
      {
        label: 'Germany',
        value: 'de',
        imagePath: 'https://flagcdn.com/w40/de.png',
      },
      {
        label: 'Japan',
        value: 'jp',
        imagePath: 'https://flagcdn.com/w40/jp.png',
      },
    ];

    this.currencies = [
      { label: 'USD - US Dollar', value: 'USD' },
      { label: 'EUR - Euro', value: 'EUR' },
      { label: 'JPY - Japanese Yen', value: 'JPY' },
      { label: 'GBP - British Pound', value: 'GBP' },
    ];
  }

  defaultLanguageForm() {
    this.languageForm = this.fb.group({
      languageName: ['', Validators.required],
      languageCulture: [''],
      seoCode: ['', Validators.required],
      flagImageName: [''],
      rightToLeft: [false],
      defaultCurrency: [''],
      published: [true],
      markAsDefault: [false],
      order: []
    });
  }

  defaultResourceForm() {
    this.resourceForm = this.fb.group({
      resourceName: ['', Validators.required], 
      value: ['', Validators.required]
    });
  }

  getAllLanguagesList(): void {
    this.loading = true;

    this.defaultLayoutService.getAllLanguages({
      limit: this.languagePageSize,
      page: this.languageCurrentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allLanguagesList = Response.data.languages;
        this.totalLanguageRecords = Response.data.totalRecords;  
        this.totalLanguagePages = Response.data.totalPages;  
        this.loading = false;

      }
    });
  }


  getPageResourcesList() {
    this.allPageResourcesList = JSON.parse(localStorage.getItem('resources') || '{}');

  }

  getAllResourcesList(): void {
    const searchParams: any = {
      languageId: this.languageId,
      limit: this.pageSize,
      page: this.currentPage,
    };

    // Add search parameters only if they are not empty
    if (this.resourceName) {
      searchParams.resourceName = this.resourceName;
    }
    if (this.resourceValue) {
      searchParams.resourceValue = this.resourceValue;
    }

    this.defaultLayoutService.getAllResources(searchParams).subscribe((response: any) => {
      if (response.meta.code === 200) {
        this.allResourcesList = response.data.resources;
        this.totalRecords = response.data.totalRecords;  // Use API-provided totalRecords
        this.totalPages = response.data.totalPages;      // Use API-provided totalPages
      }
    });
  }






  getLabelValue(labelKey: any) {
    const resource = this.allPageResourcesList.find(
      (res: any) => res.resourceName === labelKey
    );

    return resource ? resource.resourceValue : labelKey;
  }


  // updateLocalStorageResources() {
  //   this.defaultLayoutService.getAllResources({languageId: '6751515ce8be630bc927fda4'}).subscribe((Response: any) => {
  //     if (Response.meta.code == 200) {
  //       let allResourcesList = Response.data.resources;
  //       console.log(allResourcesList);

  //       if (localStorage.getItem('resources')) {
  //         localStorage.removeItem('resources');
  //       }

  //       // Save the new booking to localStorage
  //       localStorage.setItem('resources', JSON.stringify(allResourcesList));
  //     }
  //   })
  // }

  updateLocalStorageResources() {
    const updatedResources = this.allResourcesList.filter((resource: any) => resource.resourceName && resource.resourceValue);

    updatedResources.forEach((resource: any, index: number) => {
      // Prepare the resource object to be sent in the API request
      const resourceObj = {
        id: resource._id,  // Assuming resource has an _id field
        resourceName: resource.resourceName,
        languageId: resource.languageId,  // Make sure you have the languageId here
        resourceValue: resource.resourceValue
      };

      // Call the updateResource service method to update each resource
      this.defaultLayoutService.updateResource(resourceObj).subscribe((response: any) => {
        if (response.meta.code === 200) {
          console.log(`Resource ${resourceObj.id} updated successfully.`);
          this.toastr.success('Resource updated successfully.')

          this.editMode[index] = false;  // Disable the edit mode for the current resource
          this.getAllResourcesList();
          // After a successful update, save the updated resources to localStorage
          if (localStorage.getItem('resources')) {
            localStorage.removeItem('resources');
          }

          localStorage.setItem('resources', JSON.stringify(this.allResourcesList));


        } else {
          console.error('Error updating resource:', response);
          this.resourceForm.markAllAsTouched();

        }
      }, error => {
        console.error('Error calling updateResource API:', error);
      });
    });
  }


  addLanguage() {
    this.defaultLanguageForm();
    this.defaultResourceForm();
    this.isAddLanguage = true;
    this.isEditLanguage = false;
  }

  backToLanguageList() {
    this.isEditLanguage = false;
    this.isAddLanguage = false;
    this.getAllLanguagesList();
    this.router.navigate(['/admin/Language/List']);

  }

  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setlanguageId(id: string) {
    this.languageId = id;
  }

  setlanguage(language: any) {
    this.language = language;
  }

  setResources(resource: any) {
    this.resource = resource;
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
      pagination.push("..");
    }

    // Pages around the current page
    const startPage = Math.max(2, this.currentPage - halfRange);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    // Add "..." if the range ends before the last page
    if (this.currentPage < this.totalPages - halfRange - 1) {
      pagination.push("..");
    }

    // Always include the last page
    if (this.totalPages > 1) {
      pagination.push(this.totalPages);
    }

    return pagination;
  }
  // To handle page change
  changePage(page: number | string): void {
    if (page === ".." || page === this.currentPage) {
      return; // Do nothing for ellipses or the current page
    }
    this.currentPage = page as number;
    this.getAllResourcesList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllResourcesList(); // Fetch data with the new page size
  }


  // To get the list of page numbers for pagination UI
  getLanguagePagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3; // Number of visible page numbers
    const halfRange = Math.floor(maxVisiblePages / 2);

    // Always include the first page
    pagination.push(1);

    // Add "..." if the range starts after the first page
    if (this.languageCurrentPage > halfRange + 2) {
      pagination.push("...");
    }

    // Pages around the current page
    const startPage = Math.max(2, this.languageCurrentPage - halfRange);
    const endPage = Math.min(this.totalLanguagePages - 1, this.languageCurrentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    // Add "..." if the range ends before the last page
    if (this.languageCurrentPage < this.totalLanguagePages - halfRange - 1) {
      pagination.push("...");
    }

    // Always include the last page
    if (this.totalLanguagePages > 1) {
      pagination.push(this.totalLanguagePages);
    }

    return pagination;
  }
  // To handle page change
  changeLanguagePage(page: number | string): void {
    if (page === "..." || page === this.languageCurrentPage) {
      return; // Do nothing for ellipses or the current page
    }
    this.languageCurrentPage = page as number;
    this.getAllLanguagesList(); // Load data for the new page
  }

  // To handle page size change
  updateLanguagePageSize(): void {
    this.languageCurrentPage = 1; // Reset to the first page
    this.getAllLanguagesList(); // Fetch data with the new page size
  }


  editLanguage(selectedLanguageId: any) {
    this.defaultLanguageForm();
    this.defaultResourceForm();
    this.languageId = selectedLanguageId;
    this.isAddLanguage = true;
    this.isEditLanguage = true;
    this.isShowButton = true;

    // Call the API to fetch the language details
    this.defaultLayoutService.getLanguageDetailsById(this.languageId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.languageData = response.data;

          // Set the fetched data to the language form
          this.languageForm.setValue({
            languageName: this.languageData.languageName || '',
            languageCulture: this.languageData.languageCulture || '',
            seoCode: this.languageData.seoCode || '',
            flagImageName: this.languageData.flagImageName || '',
            rightToLeft: this.languageData.rightToLeft || false,
            defaultCurrency: this.languageData.defaultCurrency || '',
            published: this.languageData.published || true,
            markAsDefault: this.languageData.markAsDefault || false,
            order: this.languageData.order || null
          });
          this.languageName = this.languageData.languageName
          this.getAllResourcesList();
        } else {
          console.error('Failed to fetch language details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching language details:', error);
      }
    );
  }


  createNewLanguage(saveAndEdit: boolean) {
    if (this.languageForm.valid) {
      if (!this.isEditLanguage) {
        let createLanguageObj = {
          languageName: this.languageForm.value.languageName,
          languageCulture: this.languageForm.value.languageCulture,
          seoCode: this.languageForm.value.seoCode,
          flagImageName: this.languageForm.value.flagImageName,
          rightToLeft: this.languageForm.value.rightToLeft,
          defaultCurrency: this.languageForm.value.defaultCurrency,
          published: this.languageForm.value.published,
          markAsDefault: this.languageForm.value.markAsDefault,
          order: this.languageForm.value.order
        }

        this.defaultLayoutService.createNewLanguage(createLanguageObj).subscribe((Response: any) => {
          this.languageId = Response.data._id;
          if (Response.meta.code == 200) {
            if (saveAndEdit) {
              this.backToLanguageList();
              this.getAllLanguagesList();

              this.getAllLanguagesList();
            }
            else{
              this.router.navigate(['/admin/Language/Edit',this.languageId]);

              // this.editLanguage(this.languageId)
            }

            this.toastr.success('language saved successfully')
          }
        },
          (error: any) => {
            console.log(error);
            this.toastr.error('Error saving language')

          }
        );
      }
    } else {
      this.languageForm.markAllAsTouched();
    }
  }

  updateLanguage(saveAndEdit: boolean) {
    if (this.languageForm.valid) {
      let updateLanguageObj = {
        id: this.languageId,
        languageName: this.languageForm.value.languageName,
        languageCulture: this.languageForm.value.languageCulture,
        seoCode: this.languageForm.value.seoCode,
        flagImageName: this.languageForm.value.flagImageName,
        rightToLeft: this.languageForm.value.rightToLeft,
        defaultCurrency: this.languageForm.value.defaultCurrency,
        published: this.languageForm.value.published,
        markAsDefault: this.languageForm.value.markAsDefault,
        order: this.languageForm.value.order
      }
      this.defaultLayoutService.updateLanguage(updateLanguageObj).subscribe((Response: any) => {
        if (saveAndEdit) {
          this.backToLanguageList();
          this.getAllLanguagesList();
          this.getAllLanguagesList();
        }
        else{this.editLanguage(this.languageId)}
        this.defaultResourceForm();

        this.toastr.success('language update successfully')
      });
    } else {
      this.languageForm.markAllAsTouched();
    }
  }


  createNewResource() {
    if (this.resourceForm.valid) {
      let resourceObj = {
        languageId: this.languageId,
        resourceName: this.resourceForm.get('resourceName')?.value,
        resourceValue: this.resourceForm.get('value')?.value,
      }

      this.defaultLayoutService.createNewResource(resourceObj).subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          this.getAllResourcesList();
          // this.updateLocalStorageResources();
          this.defaultResourceForm();
          this.toastr.success('resource saved successfully')

        }
      },
        (error: any) => {
          console.log(error);
          this.toastr.error('Error saving resource')

        }
      );

    } else {
      this.resourceForm.markAllAsTouched();
    }
  }



  deletelanguage(language: any) {
    const languageReActive = {
      id: language._id,
      isDeleted: true
    };
    this.defaultLayoutService.LanguageActiveDeActive(languageReActive).subscribe(
      (response) => {
        this.getAllLanguagesList();
        this.toastr.success('language deleted successfully')

      },
      (error) => {
        console.error('Error deleting language:', error);
        this.toastr.error('Error deleting language')

      }
    );
  }

  reActiveLanguage(language: any) {
    const languageReActive = {
      id: language._id,
      isDeleted: false
    };
    this.defaultLayoutService.LanguageActiveDeActive(languageReActive).subscribe(
      (response) => {
        this.getAllLanguagesList();
        this.toastr.success('language active successfully')

      },
      (error) => {
        console.error('Error active language:', error);
        this.toastr.error('Error active language')

      }
    );
  }

  deactivelanguage() {
    const languageReActive = {
      id: this.languageId,
      isDeleted: true
    };
    this.defaultLayoutService.LanguageActiveDeActive(languageReActive).subscribe(
      (response) => {
        this.getAllLanguagesList();
        this.toastr.success('language deleted successfully');
        this.editLanguage(this.languageId);

      },
      (error) => {
        console.error('Error deleting language:', error);
        this.toastr.error('Error deleting language')

      }
    );
  }

  activeLanguage() {
    const languageReActive = {
      id: this.languageId,
      isDeleted: false
    };
    this.defaultLayoutService.LanguageActiveDeActive(languageReActive).subscribe(
      (response) => {
        this.getAllLanguagesList();
        this.editLanguage(this.languageId);
        this.toastr.success('language active successfully');

      },
      (error) => {
        console.error('Error active language:', error);
        this.toastr.error('Error active language')

      }
    );
  }

  deleteResource(resource: any) {
    const resourceData = {
      id: resource._id,
      isDeleted: true
    };
    this.defaultLayoutService.resourceActiveDeActive(resourceData).subscribe(
      (response) => {
        this.toastr.success('resource deleted successfully')

        this.getAllResourcesList();
      },
      (error) => {
        console.error('Error deleting resource:', error);
        this.toastr.error('Error deleting resource')

      }
    );
  }

  reActiveResource(resource: any) {
    const resourceData = {
      id: resource._id,
      isDeleted: false
    };
    this.defaultLayoutService.resourceActiveDeActive(resourceData).subscribe(
      (response) => {
        this.toastr.success('resource active successfully')
        this.getAllResourcesList();
      },
      (error) => {
        console.error('Error active resource:', error);
        this.toastr.error('Error active resource')

      }
    );
  }
}
