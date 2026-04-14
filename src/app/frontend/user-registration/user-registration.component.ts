import { Component, OnInit } from '@angular/core';
import { FrontLayoutService } from '../../layout/front-layout/front-layout.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../shared/common.service';
import { environment } from '../../../environments/environment';
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



@Component({
  selector: 'app-user-registration',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    FormsModule,NgbModule,
    ReactiveFormsModule],
      templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
    
  registrationForm!: FormGroup;
  todayDate: any;

  constructor(private fb: FormBuilder,
   private frontLayoutService:FrontLayoutService,
   private router: Router,
  private toastr: ToastrService,
  

  ) {}

  defaultRegisterForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]],
      confirmpwd: ['', [Validators.required]],
      companyName: [''],
      contact: ['', [Validators.required,Validators.maxLength(10)]],
      gender: [''],
      newsletter: [true]
    });
  }
  ngOnInit(): void {
    this.defaultRegisterForm();
    this.todayDate = new Date().toISOString().split('T')[0];

  }

  createNewUser(): void {
    const password = this.registrationForm.get('pwd')?.value;
    const confirmNewPassword = this.registrationForm.get('confirmpwd')?.value;

    if (password !== confirmNewPassword) {
        this.registrationForm.get('confirmpwd')?.setErrors({ mismatch: true });
        return;
    }
    if (this.registrationForm.valid) {


      const userData = this.registrationForm.value; // Get form data
  
      this.frontLayoutService.createNewUser(userData).subscribe(
        (response: any) => {
          this.toastr.success("Customer registration successfully");

          // Assuming the response structure includes 'data' and within it 'user' and 'token'
          const user = response.data.user;
          const token = response.data.token;
          if (user && token) {
            localStorage.setItem('usertoken', token); // Save token under 'usertoken'
            localStorage.setItem('customerLoginData',JSON.stringify(user)); 
              this.router.navigate(['home']);
          }
        },
        (error) => {
          this.toastr.error(error.error.meta.message);
        }

      );
    } else {
      this.registrationForm.markAllAsTouched();  
    }
  }

  limitContactLength(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }
  
}