import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import { AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
  animations: [
    trigger('collapse', [
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('open <=> closed', [animate('300ms ease-in-out')])
    ])
  ],
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
    CardBodyComponent,
    NgSelectModule
  ]
})

export class GeneralSettingsComponent implements OnInit {
  allLanguagesList: any = [];
  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  generalSettingsForm!: FormGroup;
  isAddLanguage: boolean = false;
  isEditLanguage: boolean = false;
  collapses = [true, true, true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  pageTitle: any = [];
  flagImages: any = [];
  prefixes: any = [];
  languageId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  selectedCurrency: string | null = null;
  selectedImageForLogo: any;
  selectedImageForPdfLogo: any;
  selectedImageForfavIcon: any;
  selectedImageForfooterLogo:any;
  commonLogoFile: File | null = null;
  pdfLogoFile: File | null = null;
  favIconLogoFile: File | null = null;
footerLogoFile:File | null =null;
  generalSettingList: any;
  router: any;
  
  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {

    let pagePermission = { menuName: "General Settings" }
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
    this.defaultgeneralSettingsForm();
    this.defaultResourceForm();
    this.getPageResourcesList();
    this.getGeneralSetting();

    this.pageTitle = [
      { label: 'Page name comes after store name', value: '' },
      { label: 'Store name comes after page name', value: '' },

    ];

    this.prefixes = [
      { label: 'Does not matter', value: '' },
      { label: 'Pages should have WWW prefix', value: '' },
      { label: 'Pages should not have WWW prefix', value: '' },
    ];
  }

  defaultgeneralSettingsForm() {
    this.generalSettingsForm = this.fb.group({
      storeName: [''],
      // storeLogo: [''],
      displayEuCookieLawWarning: [false],
      storeClosed: [false],
      contactUsSubjectField: [false],
      contactUsUseSystemEmail: [true],
      popupWindowForTermsService: [true],
      description: [''],
      contact: [''],
      address: [''],
      email: [''],
      facebookUrl: [''],
      twitterUrl: [''],
      youtubeUrl: [''],
      instagramUrl: [''],
      pageTitleSeoAdjusment: [''],
      pageTitleSeparator: [''],
      generateProductMetaDescription: [true],
      wwwPrefixRequirement: [''],
      convertNonWesternChars: [false],
      enableCanonicalUrls: [false],
      twitterMetaTags: [true],
      opemGraphMetaTags: [true],
      microdataTags: [true],
      customHeadTag: [''],
      // pdfLogo: [''],
      invoiceFooterTextLeftColumn: [''],
      invoiceFooterTextRightColumn: [''],
      useLetterPageSize: [false],
      disablePdfInvoicesForPendingOrders: [false],
    });
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

  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  limitContactLength(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }
  
  saveGeneralSettingsData(): void {
    if (this.generalSettingsForm.valid) {
      const formData = new FormData();
  
      Object.entries(this.generalSettingsForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        } else {
          formData.append(key, ''); // Send empty string to represent null values
        }
      });
  
      if (this.commonLogoFile) {
        formData.append('storeLogo', this.commonLogoFile, this.commonLogoFile.name);
      } else if (this.selectedImageForLogo) {
        formData.append('storeLogo', this.selectedImageForLogo);
      } else {
        formData.append('storeLogo', '');
      }
  
      if (this.pdfLogoFile) {
        formData.append('pdfLogo', this.pdfLogoFile, this.pdfLogoFile.name);
      } else if (this.selectedImageForPdfLogo) {
        formData.append('pdfLogo', this.selectedImageForPdfLogo);
      } else {
        formData.append('pdfLogo', '');
      }
  
      if (this.favIconLogoFile) {
        formData.append('faviconIcon', this.favIconLogoFile, this.favIconLogoFile.name);
      } else if (this.selectedImageForfavIcon) {
        formData.append('faviconIcon', this.selectedImageForfavIcon);
      } else {
        formData.append('faviconIcon', '');
      }
  

      if (this.footerLogoFile) {
        formData.append('footerLogo', this.footerLogoFile, this.footerLogoFile.name);
      } else if (this.selectedImageForfooterLogo) {
        formData.append('footerLogo', this.selectedImageForfooterLogo);
      } else {
        formData.append('footerLogo', '');
      }
      this.defaultLayoutService.saveGeneralSettingData(formData).subscribe(
        (response) => {
          console.log('Settings saved successfully:', response);
          this.toastr.success('Settings saved successfully');
          this.getGeneralSetting();
        },
        (error) => {
          console.error('Error saving settings:', error);
          this.toastr.error('Error saving settings');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  
  

  getGeneralSetting() {
    this.defaultLayoutService.getGeneralSetting().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.generalSettingList = Response.data;
  
        // Store previous image URLs
        this.selectedImageForLogo = Response.data.storeLogo;
        this.selectedImageForPdfLogo = Response.data.pdfLogo;
        this.selectedImageForfavIcon = Response.data.faviconIcon;
        this.selectedImageForfooterLogo = Response.data.footerLogo;  

        this.generalSettingsForm.patchValue(Response.data);
      }
    });
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
      reader.onload = (e) => {
        if (inputId === 'pdfLogo') {
          this.selectedImageForPdfLogo = e.target?.result;
          this.pdfLogoFile = file;
        } else if (inputId === 'commonLogo') {
          this.selectedImageForLogo = e.target?.result;
          this.commonLogoFile = file;
        }
        else if (inputId === 'favIcon') {
          this.selectedImageForfavIcon = e.target?.result;
          this.favIconLogoFile = file;
        }
        else if (inputId === 'footerLogo') {
          this.selectedImageForfooterLogo = e.target?.result;
          this.footerLogoFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

// Remove image
// Remove image
removeImage(event: Event, inputId: string): void {
  event.stopPropagation();
  
  if (inputId === 'pdfLogo') {
    this.selectedImageForPdfLogo = null;
    this.pdfLogoFile = null;

    this.generalSettingsForm.patchValue({ pdfLogo: null });

  } else if (inputId === 'commonLogo') {
    this.selectedImageForLogo = null;
    this.commonLogoFile = null;
    this.generalSettingsForm.patchValue({ storeLogo: null });

  } else if (inputId === 'favIcon') {
    this.selectedImageForfavIcon = null;
    this.favIconLogoFile = null;
    this.generalSettingsForm.patchValue({ faviconIcon: null });
  }
  else if (inputId === 'footerLogo') {
    this.selectedImageForfooterLogo = null;
    this.footerLogoFile = null;
    this.generalSettingsForm.patchValue({ footerLogo: null });
  }
}

  

}