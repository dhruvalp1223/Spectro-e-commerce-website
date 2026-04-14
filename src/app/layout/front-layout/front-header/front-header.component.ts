import { Component, OnInit } from '@angular/core';
import { FrontLayoutService } from '../../../layout/front-layout/front-layout.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-front-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.scss']
})
export class FrontHeaderComponent implements OnInit {
  allCategoriesList: any;
  generalSettingData: any;
  selectedImageForLogo: any;
  activeCategory: string | null = null;
  allManufacturerList: any[] = [];
  categoryId: any;

  constructor(
    private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder, private router: Router,
    public commonService: CommonService,
    private modalService: NgbModal,
        private activatedRoute: ActivatedRoute 
    


  ) { }

  ngOnInit(): void {

      this.activatedRoute.queryParams.subscribe(queryParams => {
        if (this.router.url.includes('/product-category')) {
          this.categoryId = queryParams['categoryId'] || '';
        } 
      });
    
    this.getAllCategoriesList();
    this.getGeneralSetting();
    this.getAllManufacturerList();
  }


  getAllCategoriesList() {
    this.frontLayoutService.getAllCategories().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allCategoriesList = Response.data;
      }
    })
  }

  getAllManufacturerList() {
    this.frontLayoutService.getAllHomePageManufacturer().subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.allManufacturerList = response.data;
      }
    });
  }


  getGeneralSetting() {
    this.frontLayoutService.getGeneralSetting().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.generalSettingData = Response.data;
        this.selectedImageForLogo = Response.data.storeLogo; // Image URL for storeLogo
      }
    })
  }


  isLoggedIn(): boolean {
    const customerLoginData = localStorage.getItem('customerLoginData');
    const userToken = localStorage.getItem('usertoken');
    return customerLoginData !== null || userToken !== null;
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = Modal.getInstance(modalElement); // Get modal instance
      if (bootstrapModal) {
        bootstrapModal.hide(); // Properly close the modal
      }
    }

    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    }, 300);
  }

  // Logout function to remove token and redirect
  logout(): void {
    this.closeModal('logoutConfirmationModal');
    localStorage.removeItem('usertoken');  // Remove the token
    localStorage.removeItem('customerLoginData');  // Remove the token
    this.router.navigate(['/home']);  // Redirect to login page
  }
}