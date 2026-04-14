import { Component, OnInit } from '@angular/core';
import { FrontLayoutService } from '../../../layout/front-layout/front-layout.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  pagesList: any;
  sanitizedBody: SafeHtml | null = null;
  generalSettingData: any;

  constructor(
    private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder, private router: Router,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,


  ) {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required,]],
      subject: ['', Validators.required],
      description: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.getGeneralSetting();
    this.getPagesData();
  }

  getGeneralSetting() {
    this.frontLayoutService.getGeneralSetting().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.generalSettingData = Response.data;
      }
    })
  }

  getPagesData(): void {
    this.frontLayoutService.getPagesData({ systemName: 'contactUs' }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.pagesList = Response.data;
        this.decodeAndSanitizeDescription();

      }
    });
  }

  decodeAndSanitizeDescription(): void {
    if (this.pagesList?.body) {
      const decodedBody = this.decodeHtml(this.pagesList?.body);

      this.sanitizedBody = this.sanitizer.bypassSecurityTrustHtml(decodedBody);
    } else {
      console.log('No body found in pagesData.');
    }
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.frontLayoutService.createContactUs(formData).subscribe(
        (response: any) => {
          console.log('API Response:', response);
        }
      );
    } else {
      this.contactForm.markAllAsTouched();
    }
  }


  limitContactLength(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }
}
