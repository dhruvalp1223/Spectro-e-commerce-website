import { Component, OnInit } from '@angular/core';
import{FrontLayoutService} from'../../../layout/front-layout/front-layout.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-about-us',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {


  allSliderList: any = [];
allCategoriesList:any=[];
allProductList: any[] = [];
pagesList:any;
sanitizedBody: SafeHtml | null = null;

  constructor(
    private frontLayoutService: FrontLayoutService,
    private fb: FormBuilder,private router: Router,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,


  ) { }

  ngOnInit(): void {
    this.getPagesData(); 
  }

getPagesData(): void {
  this.frontLayoutService.getPagesData({ systemName: 'aboutUs'}).subscribe((Response: any) => {
    if (Response.meta.code == 200) {
      this.pagesList = Response.data;
      console.log("pagesList", this.pagesList);
      this.decodeAndSanitizeDescription();

    }
  });
}


decodeAndSanitizeDescription(): void {
  if (this.pagesList?.body) {
    const decodedBody = this.decodeHtml(this.pagesList?.body);

    this.sanitizedBody = this.sanitizer.bypassSecurityTrustHtml(decodedBody);
    console.log("sanitizedBody", this.sanitizedBody)
  } else {
    console.log('No body found in pagesData.');
  }
}

decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

}