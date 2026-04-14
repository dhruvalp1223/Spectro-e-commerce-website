// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute, RouterModule } from '@angular/router';
// import { CommonService } from '../../../shared/common.service';

// @Component({
//   selector: 'app-checkout',
//   imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
//   templateUrl: './checkout.component.html',
//   styleUrl: './checkout.component.scss'
// })
// export class CheckoutComponent {
//   checkoutData: any = {};
//   productId:any;
//   constructor(private route: ActivatedRoute,
//         public commonService: CommonService,

//   ) {}

//   ngOnInit() {
//     const storedData = localStorage.getItem('checkoutData');
//     if (storedData) {
//       this.checkoutData = JSON.parse(storedData); // Parse the JSON string
//       console.log('checkoutData:', this.checkoutData);
//     }
//   }

// }


//New Code


import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../shared/common.service';
import { Modal } from 'bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FrontLayoutService } from '../../../layout/front-layout/front-layout.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutData: any = {};
  productId: any;

  //change checkout
  @ViewChild('editProfileModal') editProfileModal!: ElementRef;
  modalInstance!: Modal;
  selectedShippingAddress: any = null;

  selectedBillingAddress: any = null;
  userData: any;
  editProfileForm!: FormGroup; // Form for modal
  customerId: any;
  countriesList: any[] = [];
  stateList: any[] = [];
  editPasswordForm!: FormGroup;
  saveAddressForm!: FormGroup;
  addressList: any[] = [];
  addressData: any;
  isEditAddress: boolean = false;
  addressId: any;
  constructor(private route: ActivatedRoute,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder, private router: Router,

  ) { }

  ngOnInit() {
    const storedData = localStorage.getItem('checkoutData');
    if (storedData) {
      this.checkoutData = JSON.parse(storedData);
      console.log('checkoutData:', this.checkoutData);
    }

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
    console.log("customerId", this.customerId);
    if (this.customerId) {
      this.getCustomerInfoById(this.customerId); // Fetch customer info by ID
    } else {
      console.error('Customer ID not found in localStorage.');
    }
    this.getCountries();
    this.getAllAddress();
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


  getCountries() {
    this.frontLayoutService.getCountries().subscribe(
      (response) => {
        if (response.meta.code == 200) {
          this.countriesList = response.data;
          console.log("countriesList", this.countriesList)
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
    console.log('Country Changed to:', countryId);
    this.saveAddressForm.get('stateId')?.reset();
    this.stateList = [];
    if (countryId) {
      this.getStateByCountryId(countryId);
    } else {
      this.stateList = [];
    }
  }

  getStateByCountryId(countryId: string): void {
    this.frontLayoutService.getStateByCountryId({ countryId }).subscribe(
      (response: any) => {
        if (response.meta?.code === 200) {
          this.stateList = response.data || [];
          console.log('State List:', this.stateList);
          
          // Set stateId only after the state list is populated
          if (this.addressData?.stateId) {
            const exists = this.stateList.some(state => state.id == this.addressData.stateId);
            if (exists) {
              this.saveAddressForm.get('stateId')?.setValue(String(this.addressData.stateId));
            }
          }
        } else {
          this.stateList = [];
          console.warn('No states found for the selected country.');
        }
      },
      (error) => {
        console.error('Error fetching states:', error);
        this.stateList = [];
      }
    );
  }
  
  getCustomerInfoById(id: string): void {
    this.frontLayoutService.getCustomerInfoById(id).subscribe(
      (response) => {
        if (response.meta.code == 200) {
          this.userData = response.data;
          console.log("customerdata", this.userData)
        }
      },
      (error) => {
        console.error('Error fetching product data:', error);
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

  addNewAddress(): void {
    this.isEditAddress = false; // Ensure it's in Add mode
    this.saveAddressForm.reset(); // Reset form values
    this.saveAddressForm.markAsPristine(); // Remove touched state
    this.saveAddressForm.markAsUntouched(); // Remove validation messages
  }

  saveProfile(): void {
    if (this.editProfileForm.valid) {
      const updatedData = this.editProfileForm.value;

      const nameParts = updatedData.fullName.split(' ');
      updatedData.firstName = nameParts[0];
      updatedData.lastName = nameParts.slice(1).join(' ');
      updatedData.id = this.customerId;
      console.log('Updated profile data with customer ID:', updatedData);

      this.frontLayoutService.updateUser(updatedData).subscribe(
        (response) => {
          this.toastr.success("Profile updated successfully");
          this.closeModal('edit-profile');
          this.getCustomerInfoById(this.customerId);

          // this.userData = { ...this.userData, ...updatedData };
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
      const updatedData = this.editPasswordForm.value;
      updatedData.id = this.customerId;
      this.frontLayoutService.updateUserPassword(updatedData).subscribe(
        (response) => {
          this.closeModal('edit-password');
          console.log('Password updated successfullyo:', response);
          this.toastr.success("Password updated successfully");
          this.getCustomerInfoById(this.customerId); // Fetch customer info by ID
          // this.userData = { ...this.userData, ...updatedData };
        },
        (error) => {
          console.error('Error updating Password:', error);
        }
      );
    } else {
      console.log('Edit password form is invalid');
    }
  }


  getAllAddress(): void {
    this.frontLayoutService.getAllAddress({ customerId: this.customerId }).subscribe(
      (response) => {
        if (response.meta.code == 200) {
          this.addressList = response.data;
          if (this.addressList.length > 0) {
            this.selectedShippingAddress = this.addressList[0]._id;  // Set default selection
            this.selectedBillingAddress = this.addressList[0]._id;  // Set default selection

          }
        }
      },
      (error) => {
        console.error('Error fetching addressList data:', error);
      }
    );
  }

  
  
  // Fetch address data by ID and patch it into the form
  onEditAddress(id: string): void {
    this.isEditAddress = true;
    this.addressId = id;
  
    this.frontLayoutService.getAddressById(id).subscribe(
      (response) => {
        if (response.meta.code === 200) {
          this.addressData = response.data;
          console.log(this.addressData);
  
          // Patch form with address details (excluding stateId for now)
          this.saveAddressForm.patchValue({
            firstName: this.addressData.firstName,
            lastName: this.addressData.lastName,
            email: this.addressData.email,
            address1: this.addressData.address1,
            phoneNumber: this.addressData.phoneNumber,
            countryId: this.addressData.countryId,
            stateId: this.addressData.stateId,
            city: this.addressData.city,
            zipCode: this.addressData.zipCode
          });
  
          // Fetch states and set the stateId after fetching
          this.getStateByCountryId(this.addressData.countryId);
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
          this.closeModal('addShippingAddress');
          console.log('address save successfully:', response);
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
      // Get the form data
      const updateAddressData = {
        id: this.addressId, // Add the address id
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

      // Call the service to update the address
      this.frontLayoutService.updateAddress(updateAddressData).subscribe(
        (response) => {
          console.log('Address updated successfully:', response);
          this.closeModal('addShippingAddress');
          this.toastr.success("Address updated successfully");
          // Fetch the customer information after updating the address
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
    console.log("Address ID to be deleted:", this.addressId);  // Ensure the ID is set properly
  }

  removeAddress(): void {
    const id = this.addressId;
    console.log("removeId", id)
    if (this.addressId) {
      this.frontLayoutService.deleteAddress(this.addressId).subscribe(
        (response) => {
          console.log('Address removed successfully:', response);
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

  saveOrder() {
    const saveOrderData = {
      productId: this.checkoutData.productId,
      totalPrice: this.checkoutData.productPrice,
      selectedProductAttributes: this.checkoutData.selectedAttributesArray,
      customerId: this.customerId,
      selectedBillingAddressId: this.selectedBillingAddress,
      selectedShippingAddressId: this.selectedShippingAddress
    }
    console.log(saveOrderData);

    this.frontLayoutService.createNewOrder(saveOrderData).subscribe(
      (response) => {
        console.log('order save successfully:', response);
        this.toastr.success(" Your order add successfully");
        this.router.navigate(['/home']);
        localStorage.removeItem('checkoutData');
      },
      (error) => {
        console.error('Error save address:', error);
        this.toastr.error(error.error.meta.message);
      }
    );

  }
}