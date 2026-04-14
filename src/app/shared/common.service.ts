import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  rootData: any = {};
  constructor(private http: HttpClient) { 
    this.rootData.rootUrl = environment.WebAPIUrl;
    this.rootData.uploadsUrl = environment.uploadsUrl;
    // this.rootData.socketUrl = environment.socketUrl;
   }
}