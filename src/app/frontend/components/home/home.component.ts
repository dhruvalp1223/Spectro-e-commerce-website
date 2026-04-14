import { AfterViewInit, ElementRef, Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonService } from '../../../shared/common.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrontLayoutService } from '../../../layout/front-layout/front-layout.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import AOS from 'aos';
declare var PureCounter: any;


declare var $: any;

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('slickSlider', { static: false }) slickSlider!: ElementRef;

  allProductList: any[] = [];
  allManufactureList: any[] = [];
  manufacturerPagesList: any
  pagesList: any
  sanitizedBody: SafeHtml | null = null;
  allSliderList: any[] = [];
  sanitizedDescription: SafeHtml | null = null;
  allCategoriesList: any = [];
  productPagesList: any = [];
  sanitizedProductTitle: SafeHtml | null = null;
  loading: boolean = false;

  constructor(private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder, private router: Router,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
  ) { }

  // ngOnInit(): void {
  //   AOS.init({
  //     duration: 1000,
  //     easing: 'ease-in-out',
  //     delay: 0,
  //     once: true,
  //     mirror: true
  //   });

  //   this.loading = true;

  //   this.getAllSliderList();
  //   setTimeout(() => {
  //     $(this.slickSlider.nativeElement).slick({
  //       autoplay: true,
  //       autoplaySpeed: 4000,
  //       lazyLoad: 'progressive',
  //       arrows: true,
  //       dots: true,
  //       responsive: [
  //         {
  //           breakpoint: 768,
  //           settings: {
  //             arrows: false,
  //             dots: true
  //           }
  //         }
  //       ]
  //     });

  //     $(this.slickSlider.nativeElement).on('init', function () {
  //       $('.animated').each((_index: number, element: HTMLElement) => {
  //         const animation = $(element).attr('data-animation-in');
  //         $(element).removeClass(animation).css('opacity', '0');
  //       });

  //       const currentSlideElements = $('.slick-current').find('.animated');
  //       currentSlideElements.each((_index: number, element: HTMLElement) => {
  //         const animation = $(element).attr('data-animation-in');
  //         $(element).addClass(animation).css('opacity', '1');
  //       });

  //       $('.slick-current .animated-list li').css({ opacity: 0, transform: 'translateY(10px)' });

  //       $('.slick-current .animated-list li').each((index: any, element: any) => {
  //         $(element)
  //           .delay(index * 500)
  //           .queue((next: any) => {
  //             $(element).css({
  //               opacity: 1,
  //               transform: 'translateY(0)',
  //               transition: 'opacity 0.5s, transform 0.5s'
  //             });
  //             next();
  //           });
  //       });      });

  //     $(this.slickSlider.nativeElement).on('afterChange', function () {
  //       $('.animated').each((_index: number, element: HTMLElement) => {
  //         const animation = $(element).attr('data-animation-in');
  //         $(element).removeClass(animation).css('opacity', '0');
  //       });

  //       const currentSlideElements = $('.slick-current').find('.animated');
  //       currentSlideElements.each((_index: number, element: HTMLElement) => {
  //         const animation = $(element).attr('data-animation-in');
  //         $(element).addClass(animation).css('opacity', '1');
  //       });

  //       $('.slick-current .animated-list li').css({ opacity: 0, transform: 'translateY(10px)' });

  //       $('.slick-current .animated-list li').each((index: any, element: any) => {
  //         $(element)
  //           .delay(index * 500)
  //           .queue((next: any) => {
  //             $(element).css({
  //               opacity: 1,
  //               transform: 'translateY(0)',
  //               transition: 'opacity 0.5s, transform 0.5s'
  //             });
  //             next();
  //           });
  //       });      });


  //     setTimeout(() => {
  //       new PureCounter();
  //     }, 0);
  //     // Trigger AOS refresh after slider is set
  //     AOS.refresh();
  //     $(this.slickSlider.nativeElement).trigger('init');

  //   }, 1000);

  //   this.getAllProduct();
  //   this.getPagesData();
  //   this.getProductsData();
  //   this.getAllCategoriesList();
  //   this.getAllManufacturerList();
  //   this.getManufacturerData();

  //   // Delay AOS refresh to ensure all async content loads
  //   // setTimeout(() => AOS.refresh(), 1500);
  // }

  // ngAfterViewInit(): void {
  //   AOS.init({
  //     duration: 1000,
  //     easing: 'ease-in-out',
  //     delay: 0,
  //     once: true,
  //     mirror: true
  //   });

  //   // Wait a little to make sure DOM is fully ready
  //   setTimeout(() => {
  //     AOS.refresh();
  //   }, 200);




  // }




  ngOnInit(): void {
    // $('#exampleModal').modal('show');

    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      delay: 0,
      once: true,
      mirror: true
    });

    this.loading = true;
    this.getAllSliderList();
    this.getAllProduct();
    this.getPagesData();
    this.getProductsData();
    this.getAllCategoriesList();
    this.getAllManufacturerList();
    this.getManufacturerData();
    window.addEventListener('scroll', this.handleScroll, true);

  }

  handleScroll = (): void => {
    const tapTop = document.getElementById('tap-to-top');
    if (!tapTop) return;

    if (window.scrollY > 300) {
      tapTop.style.display = 'block';
    } else {
      tapTop.style.display = 'none';
    }
  };

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      delay: 0,
      once: true,
      mirror: true
    });

    setTimeout(() => {
      AOS.refresh();
    }, 200);

    // Wait until the slider is present and visible
    const checkSliderReady = setInterval(() => {
      if (this.slickSlider?.nativeElement && !this.loading) {
        clearInterval(checkSliderReady);
        this.initSlickSlider();
      }
    }, 200);
  }

  initSlickSlider(): void {
    $(this.slickSlider.nativeElement).slick({
      autoplay: true,
      autoplaySpeed: 4000,
      lazyLoad: 'progressive',
      arrows: true,
      dots: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            dots: true
          }
        }
      ]
    });

    $(this.slickSlider.nativeElement).on('init', function () {
      $('.animated').each((_index: number, element: HTMLElement) => {
        const animation = $(element).attr('data-animation-in');
        $(element).removeClass(animation).css('opacity', '0');
      });

      const currentSlideElements = $('.slick-current').find('.animated');
      currentSlideElements.each((_index: number, element: HTMLElement) => {
        const animation = $(element).attr('data-animation-in');
        $(element).addClass(animation).css('opacity', '1');
      });

      $('.slick-current .animated-list li').css({ opacity: 0, transform: 'translateY(10px)' });

      $('.slick-current .animated-list li').each((index: any, element: any) => {
        $(element)
          .delay(index * 500)
          .queue((next: any) => {
            $(element).css({
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.5s, transform 0.5s'
            });
            next();
          });
      });
    });

    $(this.slickSlider.nativeElement).on('afterChange', function () {
      $('.animated').each((_index: number, element: HTMLElement) => {
        const animation = $(element).attr('data-animation-in');
        $(element).removeClass(animation).css('opacity', '0');
      });

      const currentSlideElements = $('.slick-current').find('.animated');
      currentSlideElements.each((_index: number, element: HTMLElement) => {
        const animation = $(element).attr('data-animation-in');
        $(element).addClass(animation).css('opacity', '1');
      });

      $('.slick-current .animated-list li').css({ opacity: 0, transform: 'translateY(10px)' });

      $('.slick-current .animated-list li').each((index: any, element: any) => {
        $(element)
          .delay(index * 500)
          .queue((next: any) => {
            $(element).css({
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.5s, transform 0.5s'
            });
            next();
          });
      });
    });

    setTimeout(() => {
      new PureCounter();
    }, 0);

    AOS.refresh();
    $(this.slickSlider.nativeElement).trigger('init');
  }

  getAllProduct(): void {
    this.frontLayoutService.getAllProduct().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allProductList = Response.data;

        // Format prices in related products
        this.allProductList.forEach((product: any) => {
          product.price = parseFloat(product.price.toFixed(2));
          if (product.oldPrice) {
            product.oldPrice = parseFloat(product.oldPrice.toFixed(2));
          }
        });
      }
    });
  }

  getAllCategoriesList() {
    this.frontLayoutService.getAllHomePageCategories().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCategoriesList = Response.data;
      }
    })
  }

  getAllManufacturerList() {
    this.frontLayoutService.getAllHomePageManufacturer().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allManufactureList = Response.data;
      }
    })
  }

  getPagesData(): void {
    this.frontLayoutService.getPagesData({ systemName: 'homePage' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.pagesList = Response.data;
        this.decodeAndSanitizePagesData();
      }
    });
  }

  decodeAndSanitizePagesData(): void {
    if (this.pagesList?.body) {
      const decodedBody = this.decodeHtml(this.pagesList?.body);

      this.sanitizedBody = this.sanitizer.bypassSecurityTrustHtml(decodedBody);
    } else {
      console.log('No body found in pagesData.');
    }
  }

  getProductsData(): void {
    this.frontLayoutService.getPagesData({ systemName: 'homeProductTitle' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.productPagesList = Response.data;
        this.decodeAndSanitizeProductPagesData();
      }
    });
  }

  decodeAndSanitizeProductPagesData(): void {
    if (this.productPagesList?.body) {
      const sanitizedProductTitle = this.decodeHtml(this.productPagesList?.body);

      this.sanitizedProductTitle = this.sanitizer.bypassSecurityTrustHtml(sanitizedProductTitle);
    } else {
      console.log('No body found in pagesData.');
    }
  }

  getAllSliderList() {
    this.loading = true;
    this.frontLayoutService.getAllSlider().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allSliderList = Response.data;
        this.decodeAndSanitizeDescription();
        this.loading = false;

      }
    })
  }

  decodeAndSanitizeDescription(): void {
    this.allSliderList.forEach((slider: any, index: any) => {
      if (slider.description) {
        const decodedDescription = this.decodeHtml(slider.description);
        this.allSliderList[index].sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(decodedDescription);
      }
    });
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  getManufacturerData(): void {
    this.frontLayoutService.getPagesData({ systemName: 'homeManufacturerTitle' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.manufacturerPagesList = Response.data;
      }
    });
  }

}
