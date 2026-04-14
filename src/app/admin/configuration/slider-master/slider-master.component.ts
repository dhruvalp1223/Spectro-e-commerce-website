import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-slider-master',
  templateUrl: './slider-master.component.html',
  styleUrl: './slider-master.component.scss',
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
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective,
    ButtonDirective,
    AngularEditorModule
  ]

})

export class SliderMasterComponent implements OnInit {
  @Output() notify: EventEmitter<string> = new EventEmitter();

  Math = Math;
  allSliderList: any = [];
  allPageResourcesList: any = [];
  sliderForm!: FormGroup;
  isAddSlider: boolean = false;
  isEditSlider: boolean = false;
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  bloodGroups: any = [];
  sliderId: any;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  limit: number = 10;
  selectedSliderImage: any;
  sliderImageFile: File | null = null;
  selectedBackgroundImage: any;
  backgroundImageFile: File | null = null;
  rolelist: any;
  isShowButton: boolean = false
  slider: any;
  sliderData: any;
  loading: boolean = false; 

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    sanitize: false,
    toolbarHiddenButtons: [
      [
        // 'fontName',
        // 'bold',
        // 'italic',
        'strikeThrough',
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
      ],
      [
        // 'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat'
      ]
    ]
  };
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
    if (currentUrl === '/admin/SliderMaster/Create') {
      this.isAddSlider = true;
      this.isEditSlider = false;
    } else if (currentUrl.startsWith('/admin/SliderMaster/Edit/')) {
      const sliderId = this.route.snapshot.paramMap.get('id');
      if (sliderId) {
        this.editSlider(sliderId);
      }
      this.isAddSlider = true;
      this.isEditSlider = true;
    } else {
      this.isAddSlider = false;
      this.isEditSlider = false;
      this.router.navigate(['/admin/SliderMaster/List']);

    }
    let pagePermission = { menuName: "Slider Master" }
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
    this.defaultSliderForm();
    this.getPageResourcesList();
    this.getAllSliderList();

  }

  defaultSliderForm() {
    this.sliderForm = this.fb.group({
      title: [''],
      description: [''],
      buttonTitle: [''],
      url: [''],
      startDate: [''],
      endDate: [''],
      order: [0, Validators.required],
      sliderImage: [null, Validators.required],  
      backgroundImage: [null, Validators.required]  
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


  setUserId(id: string) {
    this.sliderId = id;
  }

  setSlider(slider: any) {
    this.slider = slider;
  }


  getAllSliderList() {
    this.loading = true;

    this.defaultLayoutService.getAllSlider
      ({
        limit: this.pageSize,
        page: this.currentPage
      }).subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          this.allSliderList = Response.data.sliders;
          this.totalRecords = Response.data.totalRecords;
          this.totalPages = Response.data.totalPages;
          this.loading = false;

        }
      })
  }

  addSlider() {
    this.selectedSliderImage = null
    this.defaultSliderForm();
    this.isAddSlider = true;
    this.isEditSlider = false;
  }

  backToSliderList() {
    this.isEditSlider = false;
    this.isAddSlider = false;
    this.router.navigate(['/admin/SliderMaster/List']);

  }

  editSlider(selectedsliderId: any) {
    this.defaultSliderForm();
    this.sliderId = selectedsliderId;
    this.isAddSlider = true;
    this.isEditSlider = true;

    this.defaultLayoutService.getSliderDetailsById(this.sliderId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.selectedSliderImage = response.data.sliderImage;
          this.selectedBackgroundImage = response.data.backgroundImage;

          this.sliderData = { ...response.data };
          if (this.sliderData.startDate) {
            this.sliderData.startDate = this.sliderData.startDate.split('T')[0]; // Extract only the date
          }
          if (this.sliderData.endDate) {
            this.sliderData.endDate = this.sliderData.endDate.split('T')[0]; // Extract only the date
          }
          this.sliderForm.patchValue(this.sliderData);
        } else {
          console.error('Failed to fetch slider details:', response.meta.message);
          this.toastr.error('Failed to fetch slider details')
        }
      },
      (error: any) => {
        console.error('Error fetching slider details:', error);
        this.toastr.error('Error fetching slider details')

      }
    );
  }


  createNewSlider(saveAndEdit: boolean) {
    if (this.sliderForm.valid && (this.sliderImageFile || this.selectedSliderImage) && (this.backgroundImageFile || this.selectedBackgroundImage)) { // Ensure image is present
      const formData = new FormData();

      Object.entries(this.sliderForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      // if (this.sliderImageFile) {
      //   formData.append('sliderImage', this.sliderImageFile, this.sliderImageFile.name);
      // }

      this.defaultLayoutService.createNewSlider(formData).subscribe(
        (response: any) => {
          console.log('Slider saved successfully:', response);
          this.toastr.success('Slider saved successfully');
          this.sliderId = response.data._id;

          if (saveAndEdit) {
            this.isAddSlider = false;
            this.backToSliderList();
          } else {
            this.router.navigate(['/admin/SliderMaster/Edit', this.sliderId]);
          }

          this.getAllSliderList();
        },
        (error) => {
          console.error('Error saving slider:', error);
          this.toastr.error('Error saving slider');
        }
      );
    } else {
      this.sliderForm.markAllAsTouched();
    }
  }


  updateSlider(saveAndEdit: boolean): void {
    if (this.sliderForm.valid && (this.sliderImageFile || this.selectedSliderImage) && (this.backgroundImageFile || this.selectedBackgroundImage)) { // Ensure image is present
      const formData = new FormData();

      Object.entries(this.sliderForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      // if (this.sliderImageFile) {
      //   formData.append('sliderImage', this.sliderImageFile, this.sliderImageFile.name);
      // } else {
      //   formData.append('sliderImage', this.selectedSliderImage || 'null');
      // }

      formData.append('id', this.sliderId);

      this.defaultLayoutService.updateSlider(formData).subscribe(
        (response: any) => {
          console.log('slider updated successfully:', response);
          this.toastr.success('Slider updated successfully')
          if (saveAndEdit) {
            this.isAddSlider = false;
            this.backToSliderList();
          }
          else {
            this.editSlider(this.sliderId);
          }
          this.getAllSliderList();
        },
        (error: any) => {
          console.error('Error updating slider:', error);
          this.toastr.error('Error updating slider')
        }
      );
    } else {
      this.sliderForm.markAllAsTouched();
    }
  }


  deleteSlider(slider: any) {
    const sliderDeActive = {
      id: slider._id,
      isDeleted: true
    };
    this.defaultLayoutService.sliderActiveDeActive(sliderDeActive).subscribe(
      (response) => {
        console.log('slider deleted successfully:', response);
        this.toastr.success('Slider deleted successfully')
        this.getAllSliderList();
      },
      (error) => {
        console.error('Error deleting slider:', error);
        this.toastr.error('Error deleting slider')
      }
    );
  }

  reActiveSlider(slider: any) {
    const sliderReActive = {
      id: slider._id,
      isDeleted: false
    };
    this.defaultLayoutService.sliderActiveDeActive(sliderReActive).subscribe(
      (response) => {
        console.log('slider active successfully:', response);
        this.toastr.success('Slider active successfully')
        this.getAllSliderList();
      },
      (error) => {
        console.error('Error active slider:', error);
        this.toastr.error('Error active slider')
      }
    );
  }

  deactiveSlider() {
    const sliderDeActive = {
      id: this.sliderId,
      isDeleted: true
    };
    this.defaultLayoutService.sliderActiveDeActive(sliderDeActive).subscribe(
      (response) => {
        console.log('slider deleted successfully:', response);
        this.toastr.success('Slider deleted successfully');
        this.editSlider(this.sliderId);
        this.getAllSliderList();
      },
      (error) => {
        console.error('Error deleting slider:', error);
        this.toastr.error('Error deleting slider')
      }
    );
  }

  activeSlider() {
    const sliderReActive = {
      id: this.sliderId,
      isDeleted: false
    };
    this.defaultLayoutService.sliderActiveDeActive(sliderReActive).subscribe(
      (response) => {
        console.log('slider active successfully:', response);
        this.toastr.success('Slider active successfully');
        this.editSlider(this.sliderId);
        this.getAllSliderList();
      },
      (error) => {
        console.error('Error active slider:', error);
        this.toastr.error('Error active slider')
      }
    );
  }

  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event, inputId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (inputId === 'sliderImage') {
          this.selectedSliderImage = e.target?.result as string;
          this.sliderImageFile = file;
          this.sliderForm.get('sliderImage')?.setValue(file); 
          this.sliderForm.get('sliderImage')?.markAsTouched();
        }
        else if (inputId === 'backgroundImage') {
          this.selectedBackgroundImage = e.target?.result as string;
          this.backgroundImageFile = file;
          this.sliderForm.get('backgroundImage')?.setValue(file); 
          this.sliderForm.get('backgroundImage')?.markAsTouched();
        }
      };

      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
  }


  // Remove image
  removeImage(event: Event, inputId: string): void {
    event.stopPropagation();
    if (inputId === 'sliderImage') {
      this.selectedSliderImage = null;
      this.sliderImageFile = null;
      this.sliderForm.get('sliderImage')?.setValue(null); // Reset form control
      this.sliderForm.get('sliderImage')?.markAsTouched();

    }
    else if (inputId === 'backgroundImage') {
      this.selectedBackgroundImage = null;
      this.backgroundImageFile = null;
      this.sliderForm.get('backgroundImage')?.setValue(null); // Reset form control
      this.sliderForm.get('backgroundImage')?.markAsTouched();
      
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
    this.getAllSliderList(); // Load data for the new page
  }

  // To handle page size change
  updatePageSize(): void {
    this.currentPage = 1; // Reset to the first page
    this.getAllSliderList(); // Fetch data with the new page size
  }


}
