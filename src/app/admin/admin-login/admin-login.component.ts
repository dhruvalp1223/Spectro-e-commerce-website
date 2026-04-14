import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DefaultLayoutService } from '../../layout/default-layout/default-layout.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective
],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit {
  allPageResourcesList: any = [];
  loginForm!: FormGroup;
  errorMessage: string = '';  // Define a variable to store the error message

  constructor(
    private router: Router,
    private defaultLayoutService: DefaultLayoutService,
    private fb: FormBuilder,
    private toastr: ToastrService,

  ) {
    this.getAllResourcesList();
  }

  ngOnInit(): void {
    this.verifyTokenExpiry();
    this.defaultLoginForm();
  }

  verifyTokenExpiry(): void {
    const token = localStorage.getItem('myToken');
    if (token) {
      const payload = this.decodeJwt(token);
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (payload.exp > currentTime) {
          // Token is valid, navigate to the dashboard
          this.router.navigate(['admin/dashboard']);
        } else {
          // Token is expired, remove it from localStorage
          localStorage.removeItem('myToken');
          localStorage.removeItem('LoginUserData');
        }
      } else {
        console.log('Invalid token payload.');
      }
    }
  }

  decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.log('Error decoding token:', error);
      return null;
    }
  }

  defaultLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: [
        '',
        [
          Validators.required,          // Password is required
          // Validators.minLength(6),       // Minimum length of 8 characters
          // Validators.pattern('.*[A-Z].*'),  // At least one uppercase letter
          // Validators.pattern('.*[a-z].*'),  // At least one lowercase letter
          // Validators.pattern('.*\\d.*'),    // At least one numeric digit
          // Validators.pattern('.*[!@#$%^&*(),.?":{}|<>].*')  // At least one special character
        ]
      ]
    });
  }


  getAllResourcesList() {
    this.defaultLayoutService.getAllResources({ languageId: '6751515ce8be630bc927fda4' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allPageResourcesList = Response.data.resources;
        if (localStorage.getItem('resources')) {
          localStorage.removeItem('resources');
        }
        localStorage.setItem('resources', JSON.stringify(this.allPageResourcesList));
      }
    })
  }

  getLabelValue(labelKey: any) {
    const resource = this.allPageResourcesList.find(
      (res: any) => res.resourceName === labelKey
    );

    return resource ? resource.resourceValue : labelKey;
  }

  adminUserLogin() {
    if (this.loginForm.valid) {
      this.defaultLayoutService.adminLogin(this.loginForm.value).subscribe(
        (response: any) => {
          if (response.meta.code === 200) {
            localStorage.setItem('LoginUserData', JSON.stringify(response.data));
            localStorage.setItem('myToken', response.data.token);
            this.router.navigate(['admin/dashboard']);
            this.toastr.success('Login successful');
            this.errorMessage = '';  // Clear error message on success
          }
        },
        (error: any) => {
          console.log("error", error);
          this.toastr.error(error.error.meta.message);
        }
      );
    } else {
      this.loginForm.markAllAsTouched();  
      }
  }

}
