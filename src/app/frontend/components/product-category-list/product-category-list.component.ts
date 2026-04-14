import { Component, EnvironmentInjector, OnInit, ViewEncapsulation } from '@angular/core';
import { FrontLayoutService } from '../../../layout/front-layout/front-layout.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

declare var $: any;


@Component({
  selector: 'app-product-category-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss',
})
export class ProductCategoryListComponent implements OnInit {
searchEngineFriendlyPageName:any;
  categoryId: any;
  manufacturerId: any;
  productData: any[] = [];
  productImages: string[] = [];
  productVideos: any[] = [];
  currentPage: number = 1; 
  totalPages: number = 1; 
  limit: number = 6; 
  allCategoriesList: any[] = [];
  allManufacturerList: any[] = [];
  allSubCategoriesList: any[] = [];
  manufacturerName: string = '';
  categoryName: string = '';
  loading: boolean = false; 
  constructor(
    private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder, private router: Router,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute 
  ) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (this.router.url.includes('/product-category')) {
        this.categoryId = queryParams['categoryId'] || ''
        this.searchEngineFriendlyPageName = queryParams['searchEngineFriendlyPageName'] || '';
        this.categoryName = queryParams['categoryName'] || '';
        this.getCategoryData();
      } 
      else if (this.router.url.includes('/product-manufacturer')) {
        this.manufacturerId = queryParams['manufacturerId'] || '';
        this.searchEngineFriendlyPageName = queryParams['searchEngineFriendlyPageName'] || '';
        this.manufacturerName = queryParams['manufacturerName'] || '';
        this.getManufacturerData();
      }
    });
    this.getAllCategoriesList();
    this.getAllManufacturerList();
  }
  
  getCategoryData(): void {

    this.loading=true;
    this.frontLayoutService.getProductCategoryData({ searchEngineFriendlyPageName: this.searchEngineFriendlyPageName }).subscribe(
      (response) => {
        this.productData = response.data;
    this.loading=false;

      },
      (error) => {
        console.error('Error fetching product data:', error);
    this.loading=false;

      }
    );
  }


  getManufacturerData(): void {
    this.loading=true;

    this.frontLayoutService.getProductsByManufacturer({ searchEngineFriendlyPageName: this.searchEngineFriendlyPageName }).subscribe(
      (response) => {
        this.productData = response.data;
    this.loading=false;

      },
      (error) => {
        console.error('Error fetching product data:', error);
    this.loading=false;

      }
    );
  }

  getAllCategoriesList() {
    this.frontLayoutService.getAllCategories().subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.allCategoriesList = response.data;
        this.allCategoriesList.forEach(category => {
          category.showSubcategories = true; 
        });
      }
    });
  }

  toggleSubcategory(index: number): void {
    const category = this.allCategoriesList[index];
    category.showSubcategories = !category.showSubcategories; 
  }

  getAllManufacturerList() {
    this.frontLayoutService.getAllHomePageManufacturer().subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.allManufacturerList = response.data;
      }
    });
  }

  getAllSubCategoriesList() {
    this.frontLayoutService.getProductCategoryByParentCategoryId({ parentCategoryId: this.categoryId }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allSubCategoriesList = Response.data;
      }
    })
  }

  onCategoryFilter(categoryId: string): void {
    this.categoryId = categoryId; 
    this.getAllSubCategoriesList();
    this.getCategoryData(); 
  }
}
