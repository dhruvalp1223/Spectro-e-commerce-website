import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FrontLayoutService } from '../../layout/front-layout/front-layout.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../shared/common.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoginView: boolean = true;
  isSignUpView: boolean = false;
  isForgotPasswordView: boolean = false;
  isResetPasswordView: boolean = false;
  isGenerateOtpView: boolean = false;
  isFromSignUp: boolean = false; // To track the context
  errorMessage: any;
  forgotPasswordEmail: any;
  resetPasswordForm!: FormGroup;

  otp1: any;
  otp2: any;
  otp3: any;
  otp4: any;

  @ViewChild('otp1Input') otp1Input!: ElementRef<HTMLInputElement>;
  @ViewChild('otp2Input') otp2Input!: ElementRef<HTMLInputElement>;
  @ViewChild('otp3Input') otp3Input!: ElementRef<HTMLInputElement>;
  @ViewChild('otp4Input') otp4Input!: ElementRef<HTMLInputElement>;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private frontLayoutService: FrontLayoutService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ElementRef: ElementRef,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    const currentUrl = this.router.url;
    if (currentUrl === '/forgot-password') {
      this.showForgotPassword();

    } else if (currentUrl === '/verify-otp') {
      this.isForgotPasswordView = false;
      this.isGenerateOtpView = true;
      this.showGenerateOtp(false);

    }
    else if (currentUrl === '/reset-password') {
      this.showResetPassword();
    } else {
      this.showLogin();
    }


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }



  loginUser(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.frontLayoutService.userLogin(loginData).subscribe(
        (response: any) => {
          this.toastr.success('Login successful');
          const token = response.data.token;
          const user = response.data.user;

          if (token && user) {
            // Save the token and user data
            localStorage.setItem('usertoken', token);
            localStorage.setItem('customerLoginData', JSON.stringify(user));

            // Check if there's a stored redirect path
            const redirectPath = localStorage.getItem('redirectAfterLogin') || '/home';

            // Clear the stored redirect path after use
            localStorage.removeItem('redirectAfterLogin');

            // Navigate to the stored path or default to home
            this.router.navigate([redirectPath]);
          }
        },
        (error) => {
          console.error('Error logging in', error);
          this.toastr.error(error.error.meta.message);

        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }





  ngOnDestroy() {
    // Cleanup tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
      const instance = bootstrap.Tooltip.getInstance(tooltip);
      if (instance) {
        instance.dispose();
      }
    });
  }



  showLogin() {
    this.isLoginView = true;
    this.isSignUpView = false;
    this.isForgotPasswordView = false;
    this.isResetPasswordView = false;
    this.isGenerateOtpView = false;
    this.isFromSignUp = false;
  }

  showSignUp() {
    this.isLoginView = false;
    this.isSignUpView = true;
    this.isForgotPasswordView = false;
    this.isResetPasswordView = false;
    this.isGenerateOtpView = false;
  }

  showForgotPassword() {
    this.isLoginView = false;
    this.isSignUpView = false;
    this.isForgotPasswordView = true;
    this.isResetPasswordView = false;
    this.isGenerateOtpView = false;
  }

  showResetPassword() {
    this.isLoginView = false;
    this.isSignUpView = false;
    this.isForgotPasswordView = false;
    this.isResetPasswordView = true;
    this.isGenerateOtpView = false;
  }

  showGenerateOtp(fromSignUp: boolean) {
    this.isGenerateOtpView = true;
    this.isLoginView = false;
    this.isSignUpView = false;
    this.isForgotPasswordView = false;
    this.isResetPasswordView = false;
    this.isFromSignUp = fromSignUp;
  }


  onInput(currentElement: HTMLInputElement, nextElement: HTMLInputElement | undefined) {
    if (currentElement.value.length === 1 && nextElement) {
      nextElement.focus();
    }
  }




  generateOtp(): void {
    // this.showGenerateOtp(false);
    if (this.forgotPasswordEmail) {
      localStorage.setItem('forgotPasswordEmail', this.forgotPasswordEmail);

      this.frontLayoutService.generateOtp(this.forgotPasswordEmail).subscribe(
        (response: any) => {
          console.log('OTP sent successfully:', response);
          if (response) {
            this.toastr.success("OTP sent successfully");
            this.router.navigate(['/verify-otp']);
          } else {
            this.toastr.error('Failed to send OTP. Please try again.');
          }
        },
        error => {
          console.error('Error sending OTP:', error);
          if (error?.error?.meta?.code === 404) {
            this.toastr.error("User not found.");
          }
          // this.toastr.error('Error sending OTP. Please try again.');
        }
      );
    } else {
      this.toastr.error('Please enter email address.');
    }
  }

  processOtp(): void {
    const otp = this.otp1 + this.otp2 + this.otp3 + this.otp4;
    const otpSend = parseInt(otp, 10);

    if (isNaN(otpSend) || otp.length !== 4) {
      this.toastr.error('Please enter a valid 4-digit OTP.');
      return;
    }

    const email = localStorage.getItem('forgotPasswordEmail');

    if (!email) {
      this.toastr.error('Email is missing. Please enter your email again.');
      return;
    }

    this.frontLayoutService.verifyotp(email, otpSend).subscribe(
      response => {
        console.log('OTP verified successfully', response);
        this.toastr.success("OTP verified successfully!");
        if (this.isFromSignUp) {
          this.showLogin();
          window.location.reload();
        } else {
          this.router.navigate(['/reset-password']);
        }
      },
      error => {
        console.error('Error verifying OTP', error);
        this.toastr.error(error.error.meta?.message);
      }
    );
  }




  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const { newPassword } = this.resetPasswordForm.value;
      const { confirmPassword } = this.resetPasswordForm.value;

      const email = localStorage.getItem('forgotPasswordEmail') ?? '';

      this.frontLayoutService.resetPassword(email, newPassword, confirmPassword).subscribe(
        response => {
          console.log('Password reset successful:', response);
          this.toastr.success("Password reset successfully!");
          localStorage.removeItem('forgotPasswordEmail');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error resetting password:', error);
          this.toastr.error(error.error.meta?.message);
        }
      );
    } else {
      this.toastr.error('Please fill out the form correctly');
    }
  }


  resendOtp(){
      const email = localStorage.getItem('forgotPasswordEmail') ?? '';
      this.frontLayoutService.resendOtp(email).subscribe(
        (response: any) => {
          console.log('OTP sent successfully:', response);
          this.toastr.success("OTP sent successfully");
        },
        error => {
          console.error('Error sending OTP:', error);
          this.toastr.error('Error sending OTP. Please try again.');
        }
      );
    
  }

  

  // isFieldInvalid(field: string) {
  //   const control = this.signupForm.get(field);
  //   return control && (control.dirty || control.touched || this.isFormSubmitted) && control.invalid;
  // }

}
