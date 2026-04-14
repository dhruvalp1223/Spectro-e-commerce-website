import { Component, OnInit } from '@angular/core';
import { DefaultLayoutService } from '../../../../layout/default-layout/default-layout.service';
// import { DocsExampleComponent } from '@docs-components/public-api';
import {
  AlignDirective, BorderDirective, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, CollapseDirective, PageItemComponent, PaginationComponent, RowComponent, TableActiveDirective, TableColorDirective, TableDirective, TextColorDirective, ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective,
  ModalBodyComponent,
  FormCheckComponent, FormCheckInputDirective, FormControlDirective, FormLabelDirective, FormDirective
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../../shared/common.service';
import { environment } from '../../../../../environments/environment';
import { NgStyle } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-specification-attributes',
  templateUrl: './specification-attributes.component.html',
  styleUrl: './specification-attributes.component.scss',
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
    NgSelectModule, FormCheckComponent, FormCheckInputDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective,
    ButtonDirective,
    NgStyle,
    FormControlDirective
  ]
})
export class SpecificationAttributesComponent implements OnInit {
  selectedSpecificationGroupId: any;
  specificationAttributes: any;
  options: any;
  paginationState: { [key: number]: { currentPage: number, pageSize: number, totalRecords: number, totalPages: number } } = {};
  optionForm!: FormGroup;
  specificationAttributesForm!: FormGroup;
  // allSpecificationAttributesList: any = [];
  allSpeceficationOptionList: any = [];
  allSpecificationGroupList: any = [];
  allSpecificationActiveGroupList: any = [];
  loading: boolean = false; 

  allResourcesList: any = [];
  allPageResourcesList: any = [];
  editMode: boolean[] = [];
  resourceForm!: FormGroup;
  specificationGroupForm!: FormGroup;
  isEditGroup: boolean = false;
  collapses = [true, true];
  canView: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCreate: boolean = true;
  selectedProductAttributesId: any;
  selectedLanguage: string | null = null;
  selectedFlag: string | null = null;
  Math = Math;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  optionCurrentPage: number = 1;
  optionPageSize: number = 10;
  totalOptionRecords: number = 0;
  totalOptionPages: number = 1;

  attributesCurrentPage: number = 1;
  attributesPageSize: number = 10;
  totalAttributesRecords: number = 0;
  totalAttributesPages: number = 1;

  isShowButton: boolean = false;
  productAttributes: any;
  publishes: any = [];
  isEditOption: boolean = false;
  isShowSaveUpdateButton: boolean = false;
  resource: any;
  selectedCategoryImage: any;
  categoryImageFile: File | null = null;
  selectAllChecked: boolean = false;
  ParentCategoryList: any = [];
  categoryName: string = '';
  published: string = '';
  predefinedProductForm!: FormGroup;
  optionId: any;
  specificationGroup: any;
  specificationAttributeData: any;
  // allSpeciselectAllCheckedArray: boolean[] = [];  // Track the 'selectAll' state per index
  selectAllCheckedArray: boolean[] = [];  // Track the 'selectAll' state per index
  allSpecificationAttributesList: any[][] = [];
  specificationGroupData:any;
  expandedRows: { [key: number]: boolean } = {}; // Track expanded rows  isCardExpanded = false; // For static card toggle
  isAddSpecificationGroup: boolean = false;
  isShowSpecificationAttributesList: boolean = false;
  isAddSpecificationAttributes: boolean = false;
  isEditProductAttributes: boolean = false;
  allProductAttributesList: any;
  public visibleActiveModal = false;
  public visibleDeactiveModal = false;

  // public favoriteColor = '#26ab3c';
  isRgbColorVisible: boolean = false; // Control visibility of the second row
  public visible = false;
  public deAcOptionModal = false;
  public acOptionModal = false;
  public visibleDeactiveGroupModal = false;
  public visibleActiveGroupModal = false;

  constructor(
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/admin/SpecificationAttribute/CreateSpecificationAttributeGroup') {
      this.isAddSpecificationGroup = true;
      this.isAddSpecificationAttributes = false;
      this.isShowSpecificationAttributesList = true;
    }
    else if (currentUrl === '/admin/SpecificationAttribute/CreateSpecificationAttribute') {
      // this.defaultSpecificationAttributesForm()
      this.isEditProductAttributes = false;
      this.isAddSpecificationGroup = false;
      this.isAddSpecificationAttributes = true;
      this.isShowSpecificationAttributesList = true;
      this.getallActiveSpecificationGroupList();
    }
    else if (currentUrl.startsWith('/admin/SpecificationAttribute/EditSpecificationAttribute/')) {
      const selectedProductAttributesId = this.route.snapshot.paramMap.get('id');
      if (selectedProductAttributesId) {
        this.editSpecificationAttributes(selectedProductAttributesId);

      }
      this.getallActiveSpecificationGroupList();
      this.isEditGroup = true;
      this.isShowButton = true;
      this.isAddSpecificationGroup = false;
      this.isAddSpecificationAttributes = true;
      this.isShowSpecificationAttributesList = true;
      this.isEditProductAttributes = true;
    }
    else if (currentUrl.startsWith('/admin/SpecificationAttribute/EditSpecificationAttributeGroup/')) {
      const SpecificationGroupId = this.route.snapshot.paramMap.get('id');
      if (SpecificationGroupId) {
        this.editSpecificationGroup(SpecificationGroupId);

      }
      this.isEditGroup = true;
      this.isShowButton = true;
      this.isAddSpecificationGroup = true;
      this.isAddSpecificationAttributes = false;
      this.isShowSpecificationAttributesList = true;
    }
    else {
      this.isAddSpecificationAttributes = false;
      this.isAddSpecificationGroup = false;
      this.isShowSpecificationAttributesList = false;
      this.router.navigate(['/admin/SpecificationAttribute/List']);

    }
    let pagePermission = { menuName: "Specification Attributes" }
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
    this.defaultSpecificationGroupForm();
    // this.getallSpecificationAttributesList();
    this.getallSpecificationGroupList();
    this.defaultSpecificationoptionForm();
    this.getPageResourcesList();
    this.defaultSpecificationAttributesForm();
    this.publishes = [
      { label: 'All', value: '' },
      { label: 'Published only', value: 'true' },
      { label: 'Unpublished only', value: 'false' },
    ];
  }

  defaultSpecificationGroupForm() {
    this.specificationGroupForm = this.fb.group({
      specificationAttributeGroupName: ['', Validators.required],
      order: [''],
    });
  }

  defaultSpecificationAttributesForm() {
    this.specificationAttributesForm = this.fb.group({
      specificationAttributeName: ['', Validators.required],
      specificationAttributeGroupId: [],
      order: [''],
    });
  }


  defaultSpecificationoptionForm() {
    this.optionForm = this.fb.group({
      specificationAttributeOptionName: ['', Validators.required],
      SpecifyColor: [false],
      rgbColor: [''],
      order: [''],

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


  addProductAttributes() {
    this.defaultSpecificationAttributesForm()
    this.isEditProductAttributes = false;
    this.isAddSpecificationGroup = false;
    this.isAddSpecificationAttributes = true;
    this.isShowSpecificationAttributesList = true;
    this.getallActiveSpecificationGroupList();
  }

  addNewGroup() {
    this.isAddSpecificationGroup = true;
    this.isAddSpecificationAttributes = false;
    this.isShowSpecificationAttributesList = true;
  }


  backToSpecificationAttributesList() {
    this.router.navigate(['/admin/SpecificationAttribute/List']);
    this.isAddSpecificationAttributes = false;
    this.isAddSpecificationGroup = false;
    this.isShowSpecificationAttributesList = false;
    this.getallSpecificationGroupList();
  }

  backToAttributesList() {
    this.isEditGroup = false;
    this.isAddSpecificationAttributes = false;
    this.getallSpecificationGroupList();
  }



  toggleCollapse(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }

  toggleCollapse1(index: number): void {
    this.collapses[index] = !this.collapses[index];
  }
  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }

  setproductAttributesId(id: string) {
    this.selectedProductAttributesId = id;
  }


  setGroup(specificationGroup: any) {
    this.specificationGroup = specificationGroup;
  }

  setAttribute(specificationAttributes: any) {
    this.specificationAttributes = specificationAttributes;
  }

  setOption(options: any) {
    this.options = options;
  }



  getallActiveSpecificationGroupList(): void {
    this.loading = true;

    this.defaultLayoutService.getAllActiveSpecificationGroup().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allSpecificationActiveGroupList = Response.data;
      }
      this.loading = false;

    });
  }


  getPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);

    if (this.currentPage > halfRange + 2) {
      pagination.push("...");
    }

    const startPage = Math.max(2, this.currentPage - halfRange);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (this.currentPage < this.totalPages - halfRange - 1) {
      pagination.push("...");
    }

    if (this.totalPages > 1) {
      pagination.push(this.totalPages);
    }

    return pagination;
  }

  changePage(page: number | string): void {
    if (page === "..." || page === this.currentPage) {
      return;
    }
    this.currentPage = page as number;
    this.getallSpecificationGroupList();
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.getallSpecificationGroupList();
  }

  openAddPredefinedProductModal() {
    if (!this.isEditOption) {
      this.defaultSpecificationoptionForm(); // Only reset for new entries
      this.isEditOption = false;
    }
  }




  // To get the list of page numbers for pagination UI
  getOptionPagination(): (number | string)[] {
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3; // Number of visible page numbers
    const halfRange = Math.floor(maxVisiblePages / 2);

    // Always include the first page
    pagination.push(1);

    // Add "..." if the range starts after the first page
    if (this.optionCurrentPage > halfRange + 2) {
      pagination.push("...");
    }

    // Pages around the current page
    const startPage = Math.max(2, this.optionCurrentPage - halfRange);
    const endPage = Math.min(this.totalOptionPages - 1, this.optionCurrentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    // Add "..." if the range ends before the last page
    if (this.optionCurrentPage < this.totalOptionPages - halfRange - 1) {
      pagination.push("...");
    }

    // Always include the last page
    if (this.totalOptionPages > 1) {
      pagination.push(this.totalOptionPages);
    }

    return pagination;
  }
  // To handle page change
  changeOptionPage(page: number | string): void {
    if (page === "..." || page === this.optionCurrentPage) {
      return; // Do nothing for ellipses or the current page
    }
    this.optionCurrentPage = page as number;
    this.getAllSpecificationList(); // Load data for the new page
  }

  // To handle page size change
  updateOptionPageSize(): void {
    this.optionCurrentPage = 1; // Reset to the first page
    this.getAllSpecificationList(); // Fetch data with the new page size
  }



  handleDeactiveGroupModal(event: any) {
    this.visibleDeactiveGroupModal = event;
  }

  handleActiveGroupModal(event: any) {
    this.visibleActiveGroupModal = event;
  }


  handleDeactiveModal(event: any) {
    this.visibleDeactiveModal = event;
  }

  handleActiveModal(event: any) {
    this.visibleActiveModal = event;
  }



  toggleSelectAll(index: number): void {
    if (this.selectAllCheckedArray[index] === undefined) {
      this.selectAllCheckedArray[index] = false;  // Default to unchecked if not initialized
    }

    if (this.allSpecificationAttributesList[index]) {
      // Set 'isChecked' for each item in the list for this specific index
      this.allSpecificationAttributesList[index].forEach((attribute: any) => {
        attribute.isChecked = this.selectAllCheckedArray[index];  // Set based on selectAllChecked for current index
      });
    }
  }


  updateSelectAllproductAttributes(index: number): void {
    if (this.allSpecificationAttributesList[index]) {
      // Check if every row is selected
      const allSelected = this.allSpecificationAttributesList[index].every(
        (attribute: any) => attribute.isChecked
      );

      // Update the "Select All" checkbox for this row based on whether all items are selected
      this.selectAllCheckedArray[index] = allSelected;
    }
  }


  isAnyRowSelected(): boolean {
    // Check the Default Group for selected attributes
    const isDefaultGroupSelected = this.allSpecificationAttributesList[0]?.some(
      (attribute: any) => attribute.isChecked
    );

    // Check all Specification Groups for selected attributes
    const isGroupSelected = this.allSpecificationGroupList.some(
      (group: { _id: string; isDeleted: boolean }, index: number) =>
        this.allSpecificationAttributesList[index + 1]?.some(
          (attribute: any) => attribute.isChecked
        )
    );

    return isDefaultGroupSelected || isGroupSelected;
  }


  toggleCard(index: number, specificationAttributeGroupId: string | null): void {
    console.log(`Toggling card at index: ${index}, Group ID: ${specificationAttributeGroupId}`);

    // Check if the clicked row is already expanded
    if (this.expandedRows[index]) {
      // If already open, close it (toggle off)
      delete this.expandedRows[index];
    } else {
      // Close all other rows
      this.expandedRows = {};

      // Expand the clicked row
      this.expandedRows[index] = true;

      if (!this.paginationState[index]) {
        this.paginationState[index] = {
          currentPage: 1,
          pageSize: 10,  // Default page size
          totalRecords: 0,
          totalPages: 0
        };
      }
      this.getallSpecificationAttributesList(index, specificationAttributeGroupId);
    }
  }


  onColorChange(event: any): void {
    // The color picker value will be automatically updated in the formControl 'rgbColor'
    const selectedColor = event.target.value;
    console.log("Selected Color Code:", selectedColor);  // Log the selected color code
  }

  // Toggle the visibility of the RGB color input based on the checkbox value
  toggleRgbColorVisibility(): void {
    const specifyColor = this.optionForm.get('SpecifyColor')?.value;
    this.isRgbColorVisible = !!specifyColor;

    if (!specifyColor) {
      // Reset RGB color if checkbox is unchecked
      this.optionForm.patchValue({ rgbColor: '' });
    }
  }

  getallSpecificationGroupList(): void {
    this.defaultLayoutService.getAllSpecificationGroup({
      limit: this.pageSize,
      page: this.currentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allSpecificationGroupList = Response.data.specificationAttributeGroups;
        this.totalRecords = Response.data.totalRecords;  // Use API-provided totalRecords
        this.totalPages = Response.data.totalPages;      // Use API-provided totalPages
      }
    });
  }


  // getallSpecificationAttributesList(index: number, specificationAttributeGroupId: string | null): void {
  //   this.defaultLayoutService.getAllSpecificationAttributes({
  //     specificationAttributeGroupId: specificationAttributeGroupId ? specificationAttributeGroupId : null, // Check if this is correctly sent
  //     limit: this.attributesPageSize,
  //     page: this.attributesCurrentPage
  //   }).subscribe((Response: any) => {
  //     if (Response.meta.code === 200) {
  //       this.allSpecificationAttributesList[index] = Response.data.specificationAttributes;
  //       this.totalAttributesRecords = Response.data.totalRecords;  
  //       this.totalAttributesPages = Response.data.totalPages;     

  //     }
  //   });
  // }

  getallSpecificationAttributesList(index: number, specificationAttributeGroupId: string | null): void {
    const { currentPage, pageSize } = this.paginationState[index];

    this.defaultLayoutService.getAllSpecificationAttributes({
      specificationAttributeGroupId: specificationAttributeGroupId ? specificationAttributeGroupId : null,
      limit: pageSize,
      page: currentPage
    }).subscribe((response: any) => {
      if (response.meta.code === 200) {
        this.allSpecificationAttributesList[index] = response.data.specificationAttributes;
        this.paginationState[index].totalRecords = response.data.totalRecords;
        this.paginationState[index].totalPages = response.data.totalPages;
      }
    });
  }




  createNewSpecificationGroup(saveAndEdit: boolean) {
    if (this.specificationGroupForm.valid) {

      const specificationGroupObj = this.specificationGroupForm.value;

      this.defaultLayoutService.createNewSpecificationGroup(specificationGroupObj).subscribe(
        (response: any) => {

          console.log('specificationGroup saved successfully:', response);
          this.toastr.success('specificationGroup saved successfully');
          this.selectedSpecificationGroupId=response.data._id
          // this.backToAttributesList();
          if (saveAndEdit) {
            this.backToSpecificationAttributesList();
          }
          else{
            this.router.navigate(['/admin/SpecificationAttribute/EditSpecificationAttributeGroup',this.selectedSpecificationGroupId]);
          }
        },
        (error) => {
          console.error('Error saving specificationGroup:', error);
          this.toastr.error('Error saving specificationGroup')
        }
      );
    } else {
      this.specificationGroupForm.markAllAsTouched();
    }
  }


  createNewSpecificationAttribute(saveAndEdit: boolean) {
    if (this.specificationAttributesForm.valid) {

      const specificationAttributeObj = this.specificationAttributesForm.value;

      this.defaultLayoutService.createNewSpecificationAttributes(specificationAttributeObj).subscribe(
        (response:any) => {
          console.log('specificationAttribute saved successfully:', response);
          this.toastr.success('specificationAttribute saved successfully');
          this.selectedProductAttributesId=response.data._id
          if (saveAndEdit) {
            this.backToSpecificationAttributesList();
            this.expandedRows = {};
          }
          else{
            this.router.navigate(['/admin/SpecificationAttribute/EditSpecificationAttribute',this.selectedProductAttributesId]);

            // this.editSpecificationAttributes(this.selectedProductAttributesId);
          }
          this.getallSpecificationGroupList();
        },
        (error) => {
          console.error('Error saving specificationAttribute:', error);
          this.toastr.error(error.error.meta.message)
        }

      );
    } else {
      this.specificationAttributesForm.markAllAsTouched();
    }
  }


  editSpecificationGroup(selectedSpecificationGroupId: any) {
    this.defaultSpecificationGroupForm();
    this.selectedSpecificationGroupId = selectedSpecificationGroupId;
    this.isEditGroup = true;
    this.isShowButton = true;
    this.isAddSpecificationGroup = true;
    this.isAddSpecificationAttributes = false;
    this.isShowSpecificationAttributesList = true;

    this.defaultLayoutService.getSpecificationGroupDetailsById(this.selectedSpecificationGroupId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.specificationGroupForm.patchValue(response.data);
          this.specificationGroupData=response.data;
          this.getallSpecificationGroupList();
        } else {
        }
      },
      (error: any) => {
        console.error('Error fetching specificationGroup details:', error);
      }
    );
  }



  editSpecificationAttributes(selectedSpecificationAttributesId: any) {
    this.defaultSpecificationAttributesForm();
    this.defaultSpecificationoptionForm();
    this.selectedProductAttributesId = selectedSpecificationAttributesId;
    this.isEditGroup = true;
    this.isShowButton = true;
    this.isAddSpecificationGroup = false;
    this.isAddSpecificationAttributes = true;
    this.isShowSpecificationAttributesList = true;
    this.isEditProductAttributes = true;
    this.defaultLayoutService.getSpecificationAttributesDetailsById(this.selectedProductAttributesId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.specificationAttributesForm.patchValue(response.data);
          this.specificationAttributeData = response.data;
          this.getallSpecificationGroupList();
          this.getAllSpecificationList();
        } else {
        }
      },
      (error: any) => {
        console.error('Error fetching specificationAttributes details:', error);
      }
    );
  }


  updateSpecificationGroup(saveAndEdit: boolean) {
    if (this.specificationGroupForm.valid) {

      const updatedspecificationGroupForm = {
        specificationAttributeGroupName: this.specificationGroupForm.get('specificationAttributeGroupName')?.value,
        order: this.specificationGroupForm.get('order')?.value,
        id: this.selectedSpecificationGroupId
      };

      this.defaultLayoutService.updateSpecificationGroupById(updatedspecificationGroupForm).subscribe(
        (response: any) => {
          console.log('specificationGroup updated successfully:', response);

          this.toastr.success('specificationGroup updated successfully')
          if (saveAndEdit) {
            this.backToSpecificationAttributesList();
            this.isShowButton = false;
            this.isAddSpecificationAttributes = true;
            this.isAddSpecificationGroup = true;
            this.isShowSpecificationAttributesList = false;
          }
          else{
            this.editSpecificationGroup(this.selectedSpecificationGroupId);
          }
          this.getallSpecificationGroupList();

        },
        (error: any) => {
          console.error('Error updating specificationAttribute:', error);
          this.toastr.error('Error updating specificationAttribute')
        }
      );
    } else {
      this.specificationAttributesForm.markAllAsTouched();
    }
  }



  updateSpecificationAttributes(saveAndEdit: boolean) {
    if (this.specificationAttributesForm.valid) {

      const updatedspecificationAttributesForm = {
        specificationAttributeName: this.specificationAttributesForm.get('specificationAttributeName')?.value,
        specificationAttributeGroupId: this.specificationAttributesForm.get('specificationAttributeGroupId')?.value,
        order: this.specificationAttributesForm.get('order')?.value,
        id: this.selectedProductAttributesId
      };

      this.defaultLayoutService.updateSpecificationAttributesById(updatedspecificationAttributesForm).subscribe(
        (response: any) => {
          console.log('specificationAttribute updated successfully:', response);
          this.toastr.success('specificationAttribute updated successfully')

          if (saveAndEdit) {
            this.backToSpecificationAttributesList();
            this.isShowButton = false;
            this.isAddSpecificationAttributes = true;
            this.isAddSpecificationGroup = true;
            this.isShowSpecificationAttributesList = false;
            this.isEditProductAttributes = false;
          }
          else{
            this.editSpecificationAttributes(this.selectedProductAttributesId)
          }

        },
        (error: any) => {
          console.error('Error updating specificationAttribute:', error);
          this.toastr.error('Error updating specificationAttribute')

        }
      );
    } else {
      this.specificationAttributesForm.markAllAsTouched();
    }
  }


  deleteSpecificationGroup(specificationGroup: any) {
    const specificationGroupDeActive = {
      id: specificationGroup._id,
      isDeleted: true
    };
    this.defaultLayoutService.groupMultiActiveDeActive(specificationGroupDeActive).subscribe(
      (response) => {
        console.log('SpecificationGroup deleted successfully:', response);
        this.toastr.success('SpecificationGroup deleted successfully')


        this.visibleDeactiveGroupModal = !this.visibleDeactiveGroupModal;
        this.getallSpecificationGroupList();

        // this.getallSpecificationAttributesList();
      },
      (error) => {
        console.error('Error deleting SpecificationGroup:', error);
        this.toastr.error('Error deleting SpecificationGroup')

      }
    );
  }

  reActiveSpecificationGroup(specificationGroup: any) {
    const productAttributesReActive = {
      id: specificationGroup._id,
      isDeleted: false
    };
    this.defaultLayoutService.groupMultiActiveDeActive(productAttributesReActive).subscribe(
      (response) => {
        console.log('SpecificationGroup active successfully:', response);
        this.toastr.success('SpecificationGroup active successfully')
        this.visibleActiveGroupModal = !this.visibleActiveGroupModal;
        this.getallSpecificationGroupList();
        // this.getallSpecificationAttributesList();
      },
      (error) => {
        console.error('Error deleting SpecificationGroup:', error);
        this.toastr.error('Error deleting SpecificationGroup')
      }
    );
  }

  deactiveSpecificationGroup() {
    const specificationGroupDeActive = {
      id: this.selectedSpecificationGroupId,
      isDeleted: true
    };
    this.defaultLayoutService.groupMultiActiveDeActive(specificationGroupDeActive).subscribe(
      (response) => {
        console.log('SpecificationGroup deleted successfully:', response);
        this.toastr.success('SpecificationGroup deleted successfully')


        this.visibleDeactiveGroupModal = !this.visibleDeactiveGroupModal;
        this.getallSpecificationGroupList();
        this.editSpecificationGroup(this.selectedSpecificationGroupId)

        // this.getallSpecificationAttributesList();
      },
      (error) => {
        console.error('Error deleting SpecificationGroup:', error);
        this.toastr.error('Error deleting SpecificationGroup')

      }
    );
  }

  activeSpecificationGroup() {
    const productAttributesReActive = {
      id: this.selectedSpecificationGroupId,
      isDeleted: false
    };
    this.defaultLayoutService.groupMultiActiveDeActive(productAttributesReActive).subscribe(
      (response) => {
        console.log('SpecificationGroup active successfully:', response);
        this.toastr.success('SpecificationGroup active successfully')
        this.visibleActiveGroupModal = !this.visibleActiveGroupModal;
        this.getallSpecificationGroupList();
        this.editSpecificationGroup(this.selectedSpecificationGroupId)
      },
      (error) => {
        console.error('Error deleting SpecificationGroup:', error);
        this.toastr.error('Error deleting SpecificationGroup')
      }
    );
  }


  deleteAttributes(specificationAttributes: any) {
    const AttributesDeActive = {
      ids: [specificationAttributes._id],
      isDeleted: true
    };
    this.defaultLayoutService.attributeMultiActiveDeActive(AttributesDeActive).subscribe(
      (response: any) => {
        console.log('Attributes deleted successfully:', response);
        this.toastr.success('Attributes deleted successfully')

        this.visibleDeactiveModal = !this.visibleDeactiveModal;
        this.expandedRows = {};

        this.getallSpecificationGroupList();
        const newSpecificationAttributeGroupId = response.data.specificationAttributeGroupId || null; // Adjust based on actual response structure
        this.getallSpecificationAttributesList(0, newSpecificationAttributeGroupId); // Adjust index as needed

      },
      (error) => {
        console.error('Error deleting Attributes:', error);
        this.toastr.error('Error deleting Attributes')
      }
    );
  }

  reActiveAttributes(specificationAttributes: any) {
    const AttributesReActive = {
      ids: [specificationAttributes._id],
      isDeleted: false
    };
    this.defaultLayoutService.attributeMultiActiveDeActive(AttributesReActive).subscribe(
      (response: any) => {
        console.log('Attributes active successfully:', response);
        this.toastr.success('Attributes active successfully')
        this.expandedRows = {};

        this.visibleActiveModal = !this.visibleActiveModal;
        this.getallSpecificationGroupList();
        const newSpecificationAttributeGroupId = response.data.specificationAttributeGroupId || null; // Adjust based on actual response structure
        this.getallSpecificationAttributesList(0, newSpecificationAttributeGroupId); // Adjust index as needed

      },
      (error) => {
        console.error('Error active Attributes:', error);
        this.toastr.error('Error active Attributes')
      }
    );
  }


  deleteSelectedSpecificationAttributes(): void {
    const selectedIds: string[] = this.allSpecificationAttributesList
      .flatMap((group: any[]) => group || [])
      .filter((productAttributes: any) => productAttributes.isChecked)
      .map((productAttributes: any) => productAttributes._id);

    const requestData = {
      ids: selectedIds,
      isDeleted: true,
    };

    if (selectedIds.length > 0) {
      this.defaultLayoutService.attributeMultiActiveDeActive(requestData).subscribe(
        (response: any) => {
          console.log('specification attributes unpublished successfully:', response);

          this.toastr.success('specification attributes deleted successfully')
          // Refresh the list
          this.allSpecificationAttributesList.forEach((group: any[], index: number) => {
            const groupId = this.allSpecificationGroupList[index]?._id || null;
            this.getallSpecificationAttributesList(index, groupId);
          });

          this.selectAllChecked = false;
        this.expandedRows = {};

        },
        (error: any) => {
          console.error('Error unpublishing specification attributes:', error);
          this.toastr.error('Error deleting specification attributesr')

        }
      );
    } else {
      console.warn('No specification attributes selected for deletion.');
    }
  }

  deactiveAttributes() {
    const AttributesDeActive = {
      ids: [this.selectedProductAttributesId],
      isDeleted: true
    };
    this.defaultLayoutService.attributeMultiActiveDeActive(AttributesDeActive).subscribe(
      (response: any) => {
        console.log('Attributes deleted successfully:', response);
        this.toastr.success('Attributes deleted successfully')

        this.visibleDeactiveModal = !this.visibleDeactiveModal;
        this.expandedRows = {};
        this.editSpecificationAttributes(this.selectedProductAttributesId);
        this.getallSpecificationGroupList();
        const newSpecificationAttributeGroupId = response.data.specificationAttributeGroupId || null; // Adjust based on actual response structure
        this.getallSpecificationAttributesList(0, newSpecificationAttributeGroupId); // Adjust index as needed

      },
      (error) => {
        console.error('Error deleting Attributes:', error);
        this.toastr.error('Error deleting Attributes')
      }
    );
  }

  activeAttributes() {
    const AttributesReActive = {
      ids: [this.selectedProductAttributesId],
      isDeleted: false
    };
    this.defaultLayoutService.attributeMultiActiveDeActive(AttributesReActive).subscribe(
      (response: any) => {
        console.log('Attributes active successfully:', response);
        this.toastr.success('Attributes active successfully')
        this.expandedRows = {};
        this.editSpecificationAttributes(this.selectedProductAttributesId);
        this.visibleActiveModal = !this.visibleActiveModal;
        this.getallSpecificationGroupList();
        const newSpecificationAttributeGroupId = response.data.specificationAttributeGroupId || null; // Adjust based on actual response structure
        this.getallSpecificationAttributesList(0, newSpecificationAttributeGroupId); // Adjust index as needed

      },
      (error) => {
        console.error('Error active Attributes:', error);
        this.toastr.error('Error active Attributes')
      }
    );
  }



  getAllSpecificationList(): void {
    this.defaultLayoutService.getoptionDetailsByAttributeId({
      specificationAttributeId: this.selectedProductAttributesId,
      limit: this.optionPageSize,
      page: this.optionCurrentPage
    }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allSpeceficationOptionList = Response.data.specificationAttributeOptions;
        this.totalOptionRecords = Response.data.totalRecords;  // Use API-provided totalRecords
        this.totalOptionPages = Response.data.totalPages;      // Use API-provided totalPages
      }
    });
  }

  createNewOption() {
    if (this.optionForm.valid) {
      const specificationoptionObj = this.optionForm.value;
      const specificationAttributeId = this.selectedProductAttributesId;
      const requestData = { ...specificationoptionObj, specificationAttributeId };

      this.defaultLayoutService.createNewOption(requestData).subscribe(
        (response: any) => {
          this.visible = !this.visible;
          console.log('Option saved successfully:', response);
          this.toastr.success('Option saved successfully')
          this.getAllSpecificationList();
        },
        (error) => {
          console.error('Error saving option:', error);
          this.toastr.error('Error saving Option')

        }
      );
    } else {
      this.optionForm.markAllAsTouched();
    }
  }



  deleteOption(options: any) {
    const optionsDeActive = {
      id: options._id,
      isDeleted: true
    };
    this.defaultLayoutService.deleteSpecificationOptionById(optionsDeActive).subscribe(
      (response) => {
        console.log('options deleted successfully:', response);
        this.toastr.success('Option deleted successfully')
        this.deAcOptionModal = !this.deAcOptionModal;
        this.getAllSpecificationList();
      },
      (error) => {
        console.error('Error deleting options:', error);
        this.toastr.error('Error deleting options')
      }
    );
  }

  reActiveOption(options: any) {
    const optionsReActive = {
      id: options._id,
      isDeleted: false
    };
    this.defaultLayoutService.deleteSpecificationOptionById(optionsReActive).subscribe(
      (response) => {
        console.log('options active successfully:', response);
        this.toastr.success('options active successfully')
        this.acOptionModal = !this.acOptionModal;

        this.getAllSpecificationList();
      },
      (error) => {
        console.error('Error active options:', error);
        this.toastr.error('Error active options')
      }
    );
  }


  editOption(id: any) {
    this.defaultSpecificationoptionForm();
    this.optionId = id;
    this.isEditOption = true;

    this.defaultLayoutService.getOptionDetailsById(this.optionId).subscribe(
      (response: any) => {
        if (response.meta.code === 200) {
          this.optionForm.patchValue(response.data);
          console.log("optionsssss", response.data)
          if (response.data.SpecifyColor) {
            this.isRgbColorVisible = true;
          } else {
            this.isRgbColorVisible = false;
          }
        } else {
          console.error('Failed to fetch option details:', response.meta.message);
        }
      },
      (error: any) => {
        console.error('Error fetching option details:', error);
      }
    );
  }

  handleLiveChange(event: any) {
    this.visible = event;
  }

  handleDeActiveOptionModalChange(event: any) {
    this.deAcOptionModal = event;
  }

  handleActiveOptionModalChange(event: any) {
    this.acOptionModal = event;
  }

  updateOption(): void {
    if (this.optionForm.valid) {
      const updatedData = {
        specificationAttributeOptionName: this.optionForm.get('specificationAttributeOptionName')?.value,
        SpecifyColor: this.optionForm.get('SpecifyColor')?.value,
        rgbColor: this.optionForm.get('rgbColor')?.value,
        order: this.optionForm.get('order')?.value,
        id: this.optionId,
        specificationAttributeId: this.selectedProductAttributesId
      };

      this.defaultLayoutService.updateSpecificationOptionById(updatedData).subscribe(
        (response: any) => {
          this.visible = !this.visible;
          console.log('Option updated successfully:', response);
          this.toastr.success('Option updated successfully')
          // this.isAddCountries = false;
          // this.selectedProductAttributesId = null;
          // this.getallPredefinedProductAttributesList();
          this.isEditOption = false;
          this.getAllSpecificationList();
          // this.isShowButton = false;
          // this.isAddMenu = false;
        },
        (error: any) => {
          console.error('Error updating Option:', error);
          this.toastr.error('Error updating Option')
        }
      );
    } else {
      this.optionForm.markAllAsTouched();

    }
  }



  getAttributePagination(index: number): (number | string)[] {
    const { currentPage, totalPages } = this.paginationState[index] || { currentPage: 1, totalPages: 0 };
    const pagination: (number | string)[] = [];
    const maxVisiblePages = 3;
    const halfRange = Math.floor(maxVisiblePages / 2);

    pagination.push(1);
    if (currentPage > halfRange + 2) pagination.push("...");

    const startPage = Math.max(2, currentPage - halfRange);
    const endPage = Math.min(totalPages - 1, currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (currentPage < totalPages - halfRange - 1) pagination.push("...");

    if (totalPages > 1) pagination.push(totalPages);

    return pagination;
  }

  changeAttributePage(index: number, page: number | string): void {
    if (page === "..." || page === this.paginationState[index].currentPage) return;
    this.paginationState[index].currentPage = page as number;
    this.getallSpecificationAttributesList(index, null);
  }

  updateAttributePageSize(index: number): void {
    this.paginationState[index].currentPage = 1;
    this.getallSpecificationAttributesList(index, null);
  }
}
