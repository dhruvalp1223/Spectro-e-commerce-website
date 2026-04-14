import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { Collapse } from 'bootstrap';

declare var $: any;


@Component({
  selector: 'app-product-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    RowComponent,
    ColComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  Math = Math;
  updatedPrice!: number;
  selectedColor: any;
  productData: any;
  productReviewData: any = null;
  productImages: string[] = [];
  productVideos: any[] = [];
  activeSlideIndex: number = 0;
  productId: any;
  relatedProductList: any[] = [];
  quantity: number = 1;
  sanitizedDescription: SafeHtml | null = null;
  selectedAttributes: any = {};
  isOpen: boolean[] = [];
  specificationAttributeList: any[] = [];
  productImagesList: any;
  @ViewChildren('collapseRef') collapses!: QueryList<ElementRef>;
  loading: boolean = false; 

  constructor(
    private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder, private router: Router,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productId = params['id'];
      if (this.productId) {
        this.editProduct(this.productId);
        this.getProductReview(this.productId);
        this.decodeAndSanitizeDescription();
      }
    });
  }

  initializeSlickSlider() {
    $('.slider-nav').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      infinite: true,
      autoplay: false,
      focusOnSelect: true,
    });
  }

  setActiveSlide(index: number) {
    this.activeSlideIndex = index;
    const carouselItems = document.querySelectorAll('.carousel-inner .carousel-item');
    carouselItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  toggleAccordion(index: number) {
    this.isOpen.forEach((_, i) => {
      if (i !== index) this.isOpen[i] = false;
    });
    this.isOpen[index] = !this.isOpen[index];
    this.collapses.forEach((collapse, i) => {
      const collapseElement = collapse.nativeElement;
      const bsCollapse = new Collapse(collapseElement, { toggle: false });
      if (i === index && this.isOpen[index]) {
        bsCollapse.show();
      } else {
        bsCollapse.hide();
      }
    });
  }

  onRadioSelect(selectedValue: any, attribute: any): void {
    attribute.predefinedValues.forEach((value: any) => {
      value.isPreSelected = value === selectedValue;
    });
    this.selectedAttributes[attribute.productAttributeName] = selectedValue.name;
    this.getSpecificationAttributeByProductId(selectedValue._id);
    this.getProductImagesByProductId(selectedValue._id);
    this.calculatePriceAdjustment();
  }


  onDropdownChange(event: any, attribute: any): void {
    const selectedValue = event.target.value;
    attribute.predefinedValues.forEach((value: any) => {
      value.isPreSelected = false;
    });
    const selectedOption = attribute.predefinedValues.find((value: any) => value.name === selectedValue);
    if (selectedOption) {
      selectedOption.isPreSelected = true;
      this.getSpecificationAttributeByProductId(selectedOption._id);
      this.getProductImagesByProductId(selectedOption._id);
    }
    this.selectedAttributes[attribute.productAttributeName] = selectedValue._id;
    this.calculatePriceAdjustment();
  }


  onCheckboxChange(value: any, event: Event) {
    value.isPreSelected = (event.target as HTMLInputElement).checked;
    if (!this.selectedAttributes[value.productAttributeMappingId]) {
      this.selectedAttributes[value.productAttributeMappingId] = [];
    }
    if (value.isPreSelected) {
      this.selectedAttributes[value.productAttributeMappingId].push(value.name);
      this.getSpecificationAttributeByProductId(value._id);
      this.getProductImagesByProductId(value._id);
    } else {
      this.selectedAttributes[value.productAttributeMappingId] = this.selectedAttributes[
        value.productAttributeMappingId
      ].filter((item: any) => item !== value.name);
    }
    this.calculatePriceAdjustment();
  }



  goToCheckout() {
    const selectedAttributes: any = {};
    const selectedAttributesArray: any[] = [];
    this.productData?.productAttributeMappings.forEach((attribute: any) => {
      if (attribute.controlType === 'Radio button list') {
        const selectedValue = attribute.predefinedValues.find((v: any) => v.isPreSelected);
        if (selectedValue) {
          selectedAttributes[attribute.productAttributeName] = selectedValue.name;
          selectedAttributesArray.push({
            productAttributeMappingId: attribute._id,
            productAttributeValueMappingId: selectedValue._id,
            productAttributeId: attribute.productAttributeId
          });
        }
      }
      else if (attribute.controlType === 'Drop-down list') {
        const selectedValue = attribute.predefinedValues.find((v: any) => v.isPreSelected);
        if (selectedValue) {
          selectedAttributes[attribute.productAttributeName] = selectedValue.name;
          selectedAttributesArray.push({
            productAttributeMappingId: attribute._id,
            productAttributeValueMappingId: selectedValue._id,
            productAttributeId: attribute.productAttributeId
          });
        }
      }
      else if (attribute.controlType === 'Checkboxes') {
        const selectedValues = attribute.predefinedValues
          .filter((v: any) => v.isPreSelected);
        if (selectedValues.length > 0) {
          selectedAttributes[attribute.productAttributeName] = selectedValues.map((v: any) => v.name);
          selectedValues.forEach((selectedValue: any) => {
            selectedAttributesArray.push({
              productAttributeMappingId: attribute._id,
              productAttributeValueMappingId: selectedValue._id,
              productAttributeId: attribute.productAttributeId
            });
          });
        }
      }
    });

    const checkoutData = {
      productName: this.productData?.productName,
      productId: this.productData?._id,
      productImage: this.productImages.length > 0 ? this.productImages[0] : '',
      productPrice: this.updatedPrice,
      selectedAttributes: selectedAttributes,
      selectedAttributesArray: selectedAttributesArray
    };

    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    const userToken = localStorage.getItem('usertoken');
    if (userToken) {
      this.router.navigate(['/checkout']);
    } else {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      this.router.navigate(['/login']);
      this.toastr.info("Please log in to proceed with checkout.");
    }
  }


  calculatePriceAdjustment(): void {
    let totalAdjustment = 0;
    this.productData.productAttributeMappings.forEach((attribute: any) => {
      attribute.predefinedValues.forEach((value: any) => {
        if (value.isPreSelected && value.priceAdjustment) {
          totalAdjustment += value.priceAdjustment;
        }
      });
    });
    this.updatedPrice = parseFloat((this.productData.price + totalAdjustment).toFixed(2));
  }

  selectColor(value: any): void {
    this.selectedColor = value;
    this.productData.productAttributeMappings.forEach((attribute: any) => {
      if (attribute.controlType === 'Color squares') {
        attribute.predefinedValues.forEach((colorValue: any) => {
          colorValue.isPreSelected = colorValue === value;
        });
      }
    });
    this.calculatePriceAdjustment();
  }




  getVideoThumbnail(video: any): string {
    if (video.multimediaVideoUrl) {
      // Example for YouTube
      if (video.multimediaVideoUrl.includes('youtube.com')) {
        const videoId = video.multimediaVideoUrl.split('v=')[1]?.split('&')[0];
        return `https://img.youtube.com/vi/${videoId}/0.jpg`;
      }
      // Add more conditions for other video services or defaults
    }
    return 'path/to/default-thumbnail.jpg'; // Fallback image
  }

  onProductClick(id: string): void {
    this.productId = id; // Update the current product ID
    this.editProduct(id); // Fetch product details
    this.getProductReview(id); // Optionally, fetch product reviews
  }

  editProduct(id: any) {
    this.loading = true;
    this.frontLayoutService.fetchProductDetailById(id).subscribe(
      (response) => {
        this.productData = response.data;
        this.updatedPrice = this.productData.price; // Initialize the updated price with the base price

        // Get product images but start from index 1 (skip the first image)
        // this.productImages = this.productData.multimedia?.multimediaImages
        //   ?.map((image: any) => image.multimediaImage)
        //   ?.slice(1) || [];  // Slice to exclude index 0

        // console.log("productImages (excluding first one)", this.productImages);

        // Populate videos if available
        this.productVideos = this.productData.multimedia?.multimediaVideos || [];
        this.loading=false;

        this.getAllRelatedProductListByProductId();
        this.calculatePriceAdjustment();
        this.decodeAndSanitizeDescription();
        setTimeout(() => {
          this.initializeSlickSlider();
        }, 0);

        this.checkPreSelectedAttributes();
      },
      (error) => {
        console.error('Error fetching product data:', error);
      this.loading=false;

      }
    );
  }

  checkPreSelectedAttributes() {
    if (!this.productData || !this.productData.productAttributeMappings) {
      return;
    }
    for (const attribute of this.productData.productAttributeMappings) {
      const selectedValue = attribute.predefinedValues.find((v: any) => v.isPreSelected);
      if (selectedValue) {
        this.getSpecificationAttributeByProductId(selectedValue._id);
        this.getProductImagesByProductId(selectedValue._id);
        break;
      }
    }
  }

  getProductImagesByProductId(id: any) {
    this.loading = true;

    this.frontLayoutService.fetchProductImagesByProductId({
      productId: this.productId,
      productAttributeValueMappingId: id
    }).subscribe(
      (response: any) => {
        this.productImagesList = response.data;
        this.productImages = this.productImagesList
          .filter((image: any) => image.order !== 0)
          .map((image: any) => image.multimediaImage) || [];
          this.loading=false;
      },

      (error: any) => {
        console.error('Error fetching specification data:', error);
      this.loading=false;

      }
    );
  }


  getSpecificationAttributeByProductId(id: any) {
    this.frontLayoutService.fetchSpecificationAttributeByProductId({
      productId: this.productId,
      productAttributeValueMappingId: id
    }).subscribe(
      (response) => {
        this.specificationAttributeList = response.data;
      },
      (error) => {
        console.error('Error fetching specification data:', error);
      }
    );
  }


  calculateDiscount(price: number, oldPrice: number): number {
    if (oldPrice && oldPrice > price) {
      const discount = ((oldPrice - price) / oldPrice) * 100;
      return Math.round(discount); // Round to the nearest integer
    }
    return 0; // No discount if oldPrice is less than or equal to price
  }


  // Function to update quantity on button click
  updateQuantity(type: string): void {
    if (type === 'plus') {
      this.productData.minimumCartQty++;
    } else if (type === 'minus' && this.productData.minimumCartQty > 1) {
      this.productData.minimumCartQty--;
    }
  }

  // Optional: Handle manual input changes, ensuring a positive integer value
  onQuantityChange(): void {
    if (this.productData.minimumCartQty < 1) {
      this.productData.minimumCartQty = 1; // Ensure quantity doesn't go below 1
    }
  }

  getAllRelatedProductListByProductId(): void {
    this.frontLayoutService.fetchRelatedProductDetailByProductId({ productId: this.productId }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.relatedProductList = Response.data;

        // Format prices in related products
        this.relatedProductList.forEach((product: any) => {
          product.price = parseFloat(product.price.toFixed(2));
          if (product.oldPrice) {
            product.oldPrice = parseFloat(product.oldPrice.toFixed(2));
          }
        });

      }
    });
  }


  getProductReview(id: any) {
    this.frontLayoutService.fetchProductReviewDetailById(id).subscribe(
      (response) => {
        this.productReviewData = response.data;
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }

  decodeAndSanitizeDescription(): void {
    if (this.productData?.fullDescription) {
      const decodedDescription = this.decodeHtml(this.productData.fullDescription);
      this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(decodedDescription);
    } else {
      // console.log('No fullDescription found in productData.');
    }
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}  
