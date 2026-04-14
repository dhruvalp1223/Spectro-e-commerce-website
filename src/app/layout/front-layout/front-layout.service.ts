import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class FrontLayoutService {

  constructor(private http: HttpClient, private commonService: CommonService) { }



  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| login Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  userLogin(loginCred: any) {
    return this.http.post(this.commonService.rootData.rootUrl + 'login', loginCred);
  }

  generateOtp(email: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'forgotPassword', { email }, { headers });
  }

  verifyotp(email: string, otp: number) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'verifyPasswordResetOTP',  { email, otp }, { headers });
  }

  resetPassword(email: string, newPassword: string, confirmPassword: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`  
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'resetPassword',  { email, newPassword,confirmPassword }, { headers });
  }

  resendOtp(email: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'forgotresendOTP', { email }, { headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| register Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  createNewUser(userData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'register', userData, { headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| home Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  getAllSlider() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'home/getSliderCurrentAllData', { headers });
  }

  getAllHomePageCategories() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'home/getHomePageCategories', { headers });
  }

  getAllHomePageManufacturer() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'manufacturer/getAllManufacturerData', { headers });
  }


  getAllProduct() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'home/getFeaturedProductData', { headers });
  }

  getPagesData(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'home/getPagesData', { params: productObj, headers: headers });
  }



  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| product detail Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  fetchProductDetailById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `product/getProductDetails/${id}`, { headers });
  }

  fetchRelatedProductDetailByProductId(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'product/getRelatedProducts', { params: productObj, headers: headers });
  }


  
  fetchSpecificationAttributeByProductId(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'product/getSpecificationByAttributeValue', { params: productObj, headers: headers });
  }


  fetchProductImagesByProductId(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'product/getProductMultiMediaImage', { params: productObj, headers: headers });
  }


  fetchProductValueDetailByProductId(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'product/getRelatedProducts', { params: productObj, headers: headers });
  }

  fetchProductReviewDetailById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `product/getAllReviewsByProduct/${id}`, { headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| footer / header Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getGeneralSetting() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'home/getGeneralSettingsData', { headers: headers });
  }

  getAllCategories() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'home/getCategoriesData', { headers });
  }


  addNewsLetter(newsObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'home/addNewsLetter', newsObj, { headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| product category Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getProductCategoryData(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'category/getProductsByCategory', { params: productObj, headers: headers });
  }

  getProductCategoryByParentCategoryId(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'category/getSubCategoriesByParentCategoryId', { params: productObj, headers: headers });
  }

  getProductsByManufacturer(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'manufacturer/getAllProductsByManufacturerId', { params: productObj, headers: headers });
  }

  
  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| my account Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getCustomerInfoById(id: string) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `customer/getCustomerInfoById/${id}`, { headers });
  }

  cancleOrder(orderData: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'order/cancelOrder', orderData, { headers });
  }


  updateUser(userData: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'customer/updateCustomerInfo', userData, { headers });
  }

  updateUserPassword(userData: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'customer/updatePassword', userData, { headers });
  }

  getCountries() {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'customer/getCountries', { headers });
  }

  getStateByCountryId(productObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'customer/getStatesByCountry', { params: productObj, headers: headers });
  }

  getAllAddress(addressObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'customer/getAllAddress', { params: addressObj, headers: headers });
  }

  getAddressById(id: string) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `customer/getAddressById/${id}`, { headers });
  }

  createNewAddress(addressObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'customer/addAddress', addressObj, { headers });
  }

  updateAddress(addressObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'customer/updateAddress', addressObj, { headers });
  }

  deleteAddress(id: string) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + `customer/deleteAddress/${id}`, {}, { headers });
  }


  getOrdersByCustomerId(orderObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'order/getOrdersByCustomerId', { params: orderObj, headers: headers });
  }
  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| contact Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  createContactUs(contactObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'contactus/addContactUs', contactObj, { headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| checkout Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  createNewOrder(orderObj: any) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'order/addOrder', orderObj, { headers });
  }

  generateInvoicePDF(id: string) {
    let myToken = localStorage.getItem("usertoken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + `order/generateInvoicePDF/${id}`,  { headers: headers });
  }

} 