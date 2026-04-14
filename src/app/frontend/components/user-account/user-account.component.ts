import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';


declare var $: any;
@Component({
  selector: 'app-user-account',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, NgSelectModule,
    FormsModule, NgbModule,
    ReactiveFormsModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  @ViewChild('editProfileModal') editProfileModal!: ElementRef;
  modalInstance!: Modal;

  userData: any;
  editProfileForm!: FormGroup;
  customerId: any;
  countriesList: any[] = [];
  stateList: any[] = [];
  editPasswordForm!: FormGroup;
  saveAddressForm!: FormGroup;
  addressList: any[] = [];
  addressData: any;
  isEditAddress: boolean = false;
  addressId: any;
  orderData: any[] = [];
  selectedOrderId: string | null = null;
  rootUrl: string = '';
  currentPage = 1;
  itemsPerPage = 5;

  todayDate: any;

  constructor(
    private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder, private router: Router,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.rootUrl = this.commonService.rootData.rootUrl;
  }


  ngOnInit(): void {
    this.todayDate = new Date().toISOString().split('T')[0];

    this.editProfileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
    });

    this.editPasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });

    this.saveAddressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address1: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      countryId: [],
      stateId: [],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
    });

    const customerLoginData = JSON.parse(localStorage.getItem('customerLoginData') || '{}');
    this.customerId = customerLoginData?._id;
    if (this.customerId) {
      this.getCustomerInfoById(this.customerId);
    } else {
      console.error('Customer ID not found in localStorage.');
    }
    this.getCountries();
    this.getAllAddress();
    this.getAllOrders();
  }

  ngAfterViewInit() {
    if (this.editProfileModal) {
      this.modalInstance = new Modal(this.editProfileModal.nativeElement);
    }
  }

  openModal() {
    const modalElement = document.getElementById('menuModal');
    if (modalElement) {
      const bootstrapModal = new Modal(modalElement);
      bootstrapModal.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }

    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    }, 300);
  }


  getCountries() {
    this.frontLayoutService.getCountries().subscribe(
      (response) => {
        if (response.meta.code == 200) {
          this.countriesList = response.data;
        }
      },
      (error) => {
        console.error('Error fetching countries data:', error);
      }
    );
  }

  onCountryChange(event: any): void {
    const countryId = event.target.value;
    this.saveAddressForm.get('countryId')?.setValue(countryId);
    this.saveAddressForm.get('stateId')?.reset();
    this.stateList = [];
    if (countryId) {
      this.getStateByCountryId(countryId);
    } else {
      this.stateList = [];
    }
  }

  // getStateByCountryId(countryId: string): void {
  //   this.frontLayoutService.getStateByCountryId({ countryId }).subscribe(
  //     (response: any) => {
  //       if (response.meta?.code === 200) {
  //         this.stateList = response.data;
  //       } else {
  //         this.stateList = [];
  //         console.warn('No states found for the selected country.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching states:', error);
  //       this.stateList = [];
  //     }
  //   );
  // }

  getStateByCountryId(countryId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.frontLayoutService.getStateByCountryId({ countryId }).subscribe(
        (response: any) => {
          if (response.meta?.code === 200) {
            this.stateList = response.data || [];
            resolve();
          } else {
            this.stateList = [];
            console.warn('No states found for the selected country.');
            resolve();
          }
        },
        (error) => {
          console.error('Error fetching states:', error);
          this.toastr.error('Error fetching states')
          this.stateList = [];
          reject(error);
        }
      );
    });
  }


  getCustomerInfoById(id: string): void {
    this.frontLayoutService.getCustomerInfoById(id).subscribe(
      (response) => {
        if (response.meta.code == 200) {
          this.userData = response.data;
        }
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }


  getAllOrders(): void {
    this.frontLayoutService.getOrdersByCustomerId({ customerId: this.customerId }).subscribe(
      (response) => {
        if (response.meta.code == 200) {
          this.orderData = response.data;
        }
      },
      (error) => {
        console.error('Error fetching orderData data:', error);
      }
    );
  }

  setSelectedOrder(orderId: string): void {
    this.selectedOrderId = orderId;
  }

  cancleOrder(): void {
    const orderData = {
      orderId: this.selectedOrderId,
      orderStatus: 4,
    };
    this.frontLayoutService.cancleOrder(orderData).subscribe(
      (response: any) => {
        this.toastr.success("Order cancelled successfully");
        this.getAllOrders();
      },
      (error: any) => {
        console.error('Error cancelling order:', error);
      }
    );
  }

  openEditModal(): void {
    this.editProfileForm.patchValue({
      fullName: `${this.userData.firstName || ''} ${this.userData.lastName || ''}`.trim(),
      email: this.userData.email || '',
      contact: this.userData.contact || '',
      gender: this.userData.gender || '',
      dob: this.userData.dob.split('T')[0] || ''
    });
  }

  openPasswordModal() {
    this.editPasswordForm.reset();
  }

  addNewAddress(): void {
    this.isEditAddress = false;
    this.saveAddressForm.reset();
    this.saveAddressForm.markAsPristine();
    this.saveAddressForm.markAsUntouched();
  }


  saveProfile(): void {
    if (this.editProfileForm.valid) {
      const updatedData = this.editProfileForm.value;
      const nameParts = updatedData.fullName.split(' ');
      updatedData.firstName = nameParts[0];
      updatedData.lastName = nameParts.slice(1).join(' ');
      updatedData.id = this.customerId;
      this.frontLayoutService.updateUser(updatedData).subscribe(
        (response) => {
          this.toastr.success("Profile updated successfully");
          this.closeModal('edit-profile');
          this.getCustomerInfoById(this.customerId);
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.toastr.error(error.error.meta.message);
        }
      );
    } else {
      this.editProfileForm.markAllAsTouched();
    }
  }

  updatePassword(): void {
    if (this.editPasswordForm.valid) {

      const newPassword = this.editPasswordForm.get('newPassword')?.value;
      const confirmNewPassword = this.editPasswordForm.get('confirmNewPassword')?.value;
  
      if (newPassword !== confirmNewPassword) {
          this.editPasswordForm.get('confirmNewPassword')?.setErrors({ mismatch: true });
          return;
      }


      const updatedData = this.editPasswordForm.value;
      updatedData.id = this.customerId;
      this.frontLayoutService.updateUserPassword(updatedData).subscribe(
        (response) => {
          this.closeModal('edit-password');
          this.toastr.success("Password updated successfully");
          this.getCustomerInfoById(this.customerId);
        },
        (error) => {
          this.toastr.error(error.error.meta?.message);
        }
      );
    } else {
      this.editPasswordForm.markAllAsTouched();
    }
  }


  getAllAddress(): void {
    this.frontLayoutService.getAllAddress({ customerId: this.customerId }).subscribe(
      (response) => {
        if (response.meta.code == 200) {
          this.addressList = response.data;
        }
      },
      (error) => {
        console.error('Error fetching addressList data:', error);
      }
    );
  }

  onEditAddress(id: string): void {
    this.getCountries();
    this.isEditAddress = true;
    this.addressId = id;
    this.frontLayoutService.getAddressById(id).subscribe(
      (response) => {
        if (response.meta.code === 200) {
          this.addressData = response.data;
          this.saveAddressForm.patchValue({
            firstName: this.addressData.firstName,
            lastName: this.addressData.lastName,
            email: this.addressData.email,
            address1: this.addressData.address1,
            phoneNumber: this.addressData.phoneNumber,
            countryId: this.addressData.countryId,
            city: this.addressData.city,
            zipCode: this.addressData.zipCode
          });

          this.stateList = [];
          if (this.addressData.countryId) {
            this.getStateByCountryId(this.addressData.countryId).then(() => {
              const selectedState = this.stateList.find(
                (state: any) => state._id === this.addressData.stateId
              );
              if (selectedState) {
                this.saveAddressForm.get('stateId')?.setValue(selectedState._id);
              }
            }).catch((error) => {
              console.error('Error fetching states:', error);
            });
          }
        }
      },
      (error) => {
        console.error('Error fetching address data:', error);
      }
    );
  }



  saveAddress(): void {
    if (this.saveAddressForm.valid) {
      const saveAddressData = this.saveAddressForm.value;
      saveAddressData.customerId = this.customerId;
      this.frontLayoutService.createNewAddress(saveAddressData).subscribe(
        (response) => {
          this.closeModal('add-address');
          this.toastr.success("Address save successfully");
          this.getCustomerInfoById(this.customerId);
          this.getAllAddress();

        },
        (error) => {
          console.error('Error save address:', error);
          this.toastr.error(error.error.meta.message);
        }
      );
    } else {
      this.saveAddressForm.markAllAsTouched();
    }
  }

  updateAddress(): void {
    if (this.saveAddressForm.valid) {
      const updateAddressData = {
        id: this.addressId,
        firstName: this.saveAddressForm.value.firstName,
        lastName: this.saveAddressForm.value.lastName,
        email: this.saveAddressForm.value.email,
        address1: this.saveAddressForm.value.address1,
        phoneNumber: this.saveAddressForm.value.phoneNumber,
        countryId: this.saveAddressForm.value.countryId,
        stateId: this.saveAddressForm.value.stateId,
        city: this.saveAddressForm.value.city,
        zipCode: this.saveAddressForm.value.zipCode,
      };

      this.frontLayoutService.updateAddress(updateAddressData).subscribe(
        (response) => {
          this.closeModal('add-address');
          this.toastr.success("Address updated successfully");
          this.getCustomerInfoById(this.customerId);
          this.isEditAddress = false;
          this.getAllAddress();
        },
        (error) => {
          console.error('Error updating address:', error);
          this.toastr.error(error.error.meta.message);
        }
      );
    } else {
      this.saveAddressForm.markAllAsTouched();
    }
  }

  onDeleteAddress(addressId: string): void {
    this.addressId = addressId;
  }

  removeAddress(): void {
    const id = this.addressId;
    if (this.addressId) {
      this.frontLayoutService.deleteAddress(this.addressId).subscribe(
        (response) => {
          this.getCustomerInfoById(this.customerId);
          this.getAllAddress();
        },
        (error) => {
          console.error('Error removing address:', error);
        }
      );
    } else {
      console.error('No address ID found');
    }
  }

  logout(): void {
    this.closeModal('logout');
    localStorage.removeItem('usertoken');
    localStorage.removeItem('customerLoginData');
    this.router.navigate(['/home']);
  }


  get paginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.orderData.slice(startIndex, endIndex);
  }

  totalPages() {
    return Math.ceil(this.orderData.length / this.itemsPerPage);
  }

  setPage(page: number) {
    if (this.orderData.length === 0 || page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  limitContactLength(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }
  
}
