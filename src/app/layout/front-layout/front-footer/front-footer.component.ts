import { Component, OnInit } from '@angular/core';
import{FrontLayoutService} from'.././front-layout.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-front-footer',
  standalone: true, 
  templateUrl: './front-footer.component.html',
  styleUrl: './front-footer.component.scss',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    FormsModule,
    ReactiveFormsModule],})
    
export class FrontFooterComponent implements OnInit {
  allCategoriesList:any=[];
  generalSettingData: any;
  selectedImageForfooterLogo:  any ;
  newsLatterForm!: FormGroup;

   constructor(
      private frontLayoutService: FrontLayoutService,
      private fb: FormBuilder,private router: Router,
      public commonService: CommonService,
      private toastr: ToastrService,
  
    ) { }
  
    ngOnInit(): void {
      this.getAllCategoriesList(); 
      this.getGeneralSetting();

      this.newsLatterForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }


    getAllCategoriesList() {
      this.frontLayoutService.getAllCategories().subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          this.allCategoriesList = Response.data;
        }
      })
    }
  
    getGeneralSetting() {
      this.frontLayoutService.getGeneralSetting().subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          this.generalSettingData = Response.data;
        this.selectedImageForfooterLogo = Response.data.footerLogo; 
        }
      })
    }
    
  isLoggedIn(): boolean {
    const customerLoginData = localStorage.getItem('customerLoginData');
    const userToken = localStorage.getItem('usertoken');
    return customerLoginData !== null || userToken !== null;
  }

  addNewsLatter(): void {
    if (this.newsLatterForm.valid) {
      const addNewsLatterData = {
        email: this.newsLatterForm.value.email,
      };
      this.frontLayoutService.addNewsLetter(addNewsLatterData).subscribe(
        (response) => {
          this.toastr.success("NewsLatter add successfully");
          this.newsLatterForm.reset();
        },
        (error) => {
          console.error('Error add NewsLatter:', error);
          if (error?.error?.meta?.code === 405) {
            this.newsLatterForm.get('email')?.setErrors({ emailExists: true });
          } else {
            this.toastr.error(error.error.meta.message || "Something went wrong");
          }        }
      );
    } else {
      this.newsLatterForm.markAllAsTouched();
    }
  }
}
