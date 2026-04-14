import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultLayoutService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  // =====================================================================================================================================================================
  // -------------------------------------------------------------------------| Login Page APIs |-------------------------------------------------------------------------
  // =====================================================================================================================================================================


  adminLogin(loginCred: any) {
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/login', loginCred);
  }

  adminAPIStructre(loginCred: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/login', loginCred, { headers: headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Languages Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllLanguages(language: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/language/getAllLanguages', { params: language, headers: headers });
  }

  getAllResources(languageId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/resource/getResources', { params: languageId, headers: headers });
  }

  getLanguageDetailsById(languageId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/language/getLanguageById/' + languageId, { headers: headers });
  }

  createNewLanguage(resourceObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/language/addLanguage', resourceObj, { headers: headers });
  }

  createNewResource(resourceObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/resource/addResource', resourceObj, { headers: headers });
  }

  updateLanguage(resourceObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/language/updateLanguage', resourceObj, { headers: headers });
  }


  LanguageActiveDeActive(resourceObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/language/LanguageActiveDeActive', resourceObj, { headers: headers });
  }

  updateResource(resourceObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/resource/updateResource', resourceObj, { headers: headers });
  }


  resourceActiveDeActive(resourceData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/resource/ResourceActiveDeActive', resourceData, { headers });
  }
  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| User Master Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllUsers(users: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/adminusers/getAllUsers', { params: users, headers: headers });
  }

  getUserDetailsById(userId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/adminusers/getUserById/' + userId, { headers: headers });
  }

  createNewUser(userObj: any) {

    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/adminusers/addUser', userObj, { headers: headers });
  }

  updateUser(updateUserObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/adminusers/updateUser', updateUserObj, { headers: headers });
  }

  userActiveDeActive(updateUserObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/adminusers/UserActiveDeActive', updateUserObj, { headers });
  }

  updateUserPassword(updateUserObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/adminusers/changePasswordByAdmin', updateUserObj, { headers: headers });
  }
  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Role Master Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  SaveroleMaster(rolemasterModelObj: any) {
    // let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData") || '{}');
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/rolemaster/addRole', rolemasterModelObj, { headers: headers });
  }

  getActiveRole(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'admin/rolemaster/getActiveRoleMaster', { params: roleObj, headers: headers });
  }

  getAllRole(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'admin/rolemaster/getAllRole', { params: roleObj, headers: headers });
  }

  fetchRoleById(id: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/rolemaster/getRoleById/${id}`, { headers });
  }

  updateRoleById(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(this.commonService.rootData.rootUrl + 'admin/rolemaster/updateRole', roleObj, { headers });
  }

  RoleActiveDeActive(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(this.commonService.rootData.rootUrl + 'admin/rolemaster/RoleActiveDeActive', roleObj, { headers });
  }



  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Menu Master Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllActiveMenu(menuObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'admin/menu/getActiveMenus', { params: menuObj, headers: headers });
  }


  fetchAllMenu(data: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'admin/menu/getAllMenus', { params: data, headers: headers });
  }


  fetchMenuById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/menu/getMenuById/${id}`, { headers });
  }

  AddNewMenu(menuData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/menu/addMenu', menuData, { headers });
  }

  updateMenuById(menuData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/menu/updateMenu', menuData, { headers });
  }

  menuActiveDeActive(menuData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/menu/MenuActiveDeActive', menuData, { headers });
  }




  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Role Wise Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  fetchRoleWiseMenu(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/rolewisePermission/getRoleWisePermissions/${id}`, { headers });
  }


  saveRoleMenu(roleData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/rolewisePermission/addOrUpdateRoleWisePermission', roleData, { headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| User Wise Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getUserData(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/adminusers/getUserByroleId/${id}`, { headers });
  }

  fetchUserWiseMenu(params: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + 'admin/userrolewisePermission/getUserRoleWisePermissions', { headers, params: params });
  }


  saveUserMenu(userData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/userrolewisePermission/addOrUpdateUserRoleWisePermission', userData, { headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Currencies Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getAllCurrency(currency: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/currency/getAllCurrencies', { params: currency, headers: headers });
  }

  getCurrencyById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/currency/getCurrencyById/${id}`, { headers });
  }

  saveCurrenciesData(currenciesData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/currency/addCurrency', currenciesData, { headers });
  }


  updateCurrenyById(currencyData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/currency/updateCurrency', currencyData, { headers });
  }


  currencyActiveDeActive(currencyData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/currency/CurrencyActiveDeActive', currencyData, { headers });
  }

  markAsPrimaryExchangeCurrency(currencyData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/currency/updatePrimaryExchangeRateCurrency', currencyData, { headers });
  }


  markAsPrimaryStoreCurrency(currencyData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/currency/updatePrimaryStoreCurrency', currencyData, { headers });
  }



  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| General setting Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getGeneralSetting() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/generalsetting/getGeneralSetting', { headers: headers });
  }

  saveGeneralSettingData(generalSettingData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/generalsetting/createOrUpdateGeneralSetting', generalSettingData, { headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Email Account Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllEmailAccount(email: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/emailaccount/getAllEmailAccounts', { params: email, headers: headers });
  }

  getEmailDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/emailaccount/getEmailAccountById/${id}`, { headers });
  }

  createNewEmailAccount(emailObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/emailaccount/addEmailAccount', emailObj, { headers: headers });
  }

  updateEmailById(emailData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/emailaccount/updateEmailAccount', emailData, { headers });
  }


  emailAccountActiveDeActive(emailData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/emailaccount/emailAccountActiveDeActive', emailData, { headers });
  }

  emailSetDefault(emailData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/emailaccount/SetIsDefault', emailData, { headers });
  }
  
  updateEmailAccountPassword(emailData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/emailaccount/changeEmailAccountPassword', emailData, { headers: headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| countries Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  getAllActiveCountry(countryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/country/getActiveCountries', { params: countryObj, headers: headers });
  }
  
  getAllCountry(countryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/country/getAllCountries', { params: countryObj, headers: headers });
  }

  getCountryDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/country/getCountryById/${id}`, { headers });
  }

  createNewCountry(countryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/country/addCountry', countryObj, { headers: headers });
  }

  updateCountryById(countryData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/country/updateCountry', countryData, { headers });
  }


  CountryMultiActiveDeActive(countryIdsData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/country/CountryMultiActiveDeActive', countryIdsData, { headers });
  }

  getActiveStateDetailsByCountryId(countryId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/state/getActiveStates', { params: countryId, headers: headers });
  }

  getStateDetailsByCountryId(countryId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/state/getStates', { params: countryId, headers: headers });
  }

  getStateDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/state/getStateById/${id}`, { headers });
  }


  createNewState(stateObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/state/addState', stateObj, { headers: headers });
  }


  updateStateById(stateData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/state/updateState', stateData, { headers });
  }

  stateActiveDeActive(stateData: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/state/stateActiveDeActive', stateData, { headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| manufacturerer Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getAllActiveManufacturer(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/manufacturer/getActiveManufacturer', { params: manufacturerObj, headers: headers });
  }

  getAllManufacturer(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/manufacturer/getAllManufacturer', { params: manufacturerObj, headers: headers });
  }

  getManufacturerDetailsById(manufacturerId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/manufacturer/getManufacturerById/${manufacturerId}`, { headers });
  }

  CreateNewManufacturer(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/manufacturer/addManufacturer', manufacturerObj, { headers });
  }

  updateManufacturerById(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/manufacturer/updateManufacturer', manufacturerObj, { headers });
  }

  manufacturerMultiActiveDeActive(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/manufacturer/manufacturerMultiActiveDeActive', manufacturerObj, { headers: headers });
  }

  // productListByManufacturerId(manufacturerObj: any) {
  //   let myToken = localStorage.getItem("myToken")
  //   let headers = new HttpHeaders({
  //     'Authorization': `Bearer ${myToken}`
  //   })
  //   return this.http.get(this.commonService.rootData.rootUrl + 'admin/manufacturer/getProductsByManufacturerId', { params: manufacturerObj, headers: headers });
  // }

  productListByManufacturerId(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/manufacturerProducts/getAllManufacturerProducts', { params: manufacturerObj, headers: headers });
  }

  // assignProductByManufacturer(manufacturerObj: any) {
  //   let myToken = localStorage.getItem("myToken")
  //   let headers = new HttpHeaders({
  //     'Authorization': `Bearer ${myToken}`
  //   })
  //   return this.http.post(this.commonService.rootData.rootUrl + 'admin/manufacturer/assignManufacturerToProducts', manufacturerObj, { headers });
  // }

  assignProductByManufacturer(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/manufacturerProducts/addManufacturerProducts', manufacturerObj, { headers });
  }

  updateassignProductByManufacturer(multiMediaImageObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })

    return this.http.post(this.commonService.rootData.rootUrl + 'admin/manufacturerProducts/updateManufacturerProduct', multiMediaImageObj, { headers: headers });
  }

  manufacturerProductActiveDeActive(manufacturerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/manufacturerProducts/manufacturerProductActiveDeActive', manufacturerObj, { headers: headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Category Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllActiveCategory(categoryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/category/getActiveCategories', { params: categoryObj, headers: headers });
  }

  CreateNewCategory(categoryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/category/addCategory', categoryObj, { headers });
  }

  getAllCategory(categoryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/category/getAllCategories', { params: categoryObj, headers: headers });
  }

  getCategoryDetailsById(categoryId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/category/getCategoryById/${categoryId}`, { headers });
  }

  updateCategoryById(categoryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/category/updateCategory', categoryObj, { headers });
  }

  categoryMultiActiveDeActive(categoryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/category/CategoryMultiActiveDeActive', categoryObj, { headers: headers });
  }

  // productListByCategory(category: any) {
  //   let myToken = localStorage.getItem("myToken")
  //   let headers = new HttpHeaders({
  //     'Authorization': `Bearer ${myToken}`
  //   })
  //   return this.http.get(this.commonService.rootData.rootUrl + 'admin/category/getAllProductByCategory', { params: category, headers: headers });
  // }

  productListByCategory(category: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/categoryproducts/getAllCategoryProducts', { params: category, headers: headers });
  }

  // assignProductByCategory(categoryObj: any) {
  //   let myToken = localStorage.getItem("myToken")
  //   let headers = new HttpHeaders({
  //     'Authorization': `Bearer ${myToken}`
  //   })
  //   return this.http.post(this.commonService.rootData.rootUrl + 'admin/category/assignCategoryToProducts', categoryObj, { headers });
  // }

  assignProductByCategory(categoryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/categoryproducts/addCategoryProduct', categoryObj, { headers });
  }

  updateassignProductByCategory(multiMediaImageObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })

    return this.http.post(this.commonService.rootData.rootUrl + 'admin/categoryproducts/updateCategoryProduct', multiMediaImageObj, { headers: headers });
  }

  categoryProductActiveDeActive(categoryObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/categoryproducts/categoryProductActiveDeActive', categoryObj, { headers: headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| productAttribute Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  CreateNewProductAttribute(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/productAttribute/addProductAttribute', productAttributesObj, { headers });
  }

  getAllActiveProductAttributes(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/productAttribute/getActiveProductAttribute', { params: productAttributesObj, headers: headers });
  }



  getAllProductAttributes(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/productAttribute/getAllProductAttribute', { params: productAttributesObj, headers: headers });
  }

  getProductAttributesDetailsById(productAttributesId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/productAttribute/getProductAttributeById/${productAttributesId}`, { headers });
  }

  updateProductAttributesById(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/productAttribute/updateProductAttribute', productAttributesObj, { headers });
  }


  productAttributesMultiActiveDeActive(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/productAttribute/ProductAttributeMultiActiveDeActive', productAttributesObj, { headers: headers });
  }



  createNewPredefinedValues(predefinedValuesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/predefinedProductAttribute/addPredefinedProductAttribute', predefinedValuesObj, { headers: headers });
  }

  getAllPredefinedProductAttributes(predefinedProductAttribute: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/predefinedProductAttribute/getAllPredefinedProductAttribute', { params: predefinedProductAttribute, headers: headers });
  }

  getPredefinedProductDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/predefinedProductAttribute/getPredefinedProductAttributeById/${id}`, { headers });
  }

  updatePredefinedProductAttributesById(predefinedProductAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/predefinedProductAttribute/updatePredefinedProductAttribute', predefinedProductAttributesObj, { headers });
  }


  predefinedProductAttributeActiveDeActive(predefinedProductAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/predefinedProductAttribute/PredefinedProductAttributeActiveDeActive', predefinedProductAttributesObj, { headers });
  }




  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| specification Attribute Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllActiveSpecificationGroup() {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/specificationAttributeGroup/getActiveSpecificationAttributeGroup', { headers: headers });
  }

  createNewSpecificationGroup(specificationGroupObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/specificationAttributeGroup/addSpecificationAttributeGroup', specificationGroupObj, { headers });
  }

  createNewSpecificationAttributes(specificationAttributeObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/specificationAttribute/addSpecificationAttribute', specificationAttributeObj, { headers });
  }


  getAllSpecificationGroup(specificationGroupObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/specificationAttributeGroup/getAllSpecificationAttributeGroup', { params: specificationGroupObj, headers: headers });
  }

  getActiveSpecificationAttributes(specificationAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/specificationAttribute/getActiveSpecificationAttribute', { params: specificationAttributesObj, headers: headers });
  }

  getAllSpecificationAttributes(specificationAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/specificationAttribute/getAllSpecificationAttribute', { params: specificationAttributesObj, headers: headers });
  }


  getSpecificationAttributesDetailsById(specificationAttributesId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/specificationAttribute/getSpecificationAttributeById/${specificationAttributesId}`, { headers });
  }

  getSpecificationGroupDetailsById(specificationAttributesId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/specificationAttributeGroup/getSpecificationAttributeGroupById/${specificationAttributesId}`, { headers });
  }


  updateSpecificationAttributesById(specificationAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/specificationAttribute/updateSpecificationAttribute', specificationAttributesObj, { headers });
  }

  updateSpecificationGroupById(specificationGroupObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/specificationAttributeGroup/updateSpecificationAttributeGroup', specificationGroupObj, { headers });
  }


  groupMultiActiveDeActive(specificationGroupObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/specificationAttributeGroup/SpecificationAttributeGroupActiveDeActive', specificationGroupObj, { headers: headers });
  }

  attributeMultiActiveDeActive(specificationGroupObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/specificationAttribute/SpecificationAttributeMultiActiveDeActive', specificationGroupObj, { headers: headers });
  }


  getoptionDetailsByAttributeId(obj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/specificationAttributeOption/getAllSpecificationAttributeOption', { params: obj, headers: headers });
  }


  createNewOption(optionObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/specificationAttributeOption/addSpecificationAttributeOption', optionObj, { headers: headers });
  }


  getOptionDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/specificationAttributeOption/getSpecificationAttributeOptionById/${id}`, { headers });
  }

  updateSpecificationOptionById(specificationOptionObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/specificationAttributeOption/updateSpecificationAttributeOption', specificationOptionObj, { headers });
  }


  deleteSpecificationOptionById(specificationOptionObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/specificationAttributeOption/SpecificationAttributeOptionActiveDeActive', specificationOptionObj, { headers });
  }



  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Product Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getAllproduct(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/product/getAllProduct', { params: productObj, headers: headers });
  }

  getProductDetailsById(productId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/product/getProductById/${productId}`, { headers });
  }

  createNewProduct(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/addProduct', productObj, { headers: headers });
  }

  updateproductById(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(this.commonService.rootData.rootUrl + 'admin/product/updateProduct', productObj, { headers });
  }

  productMultiActiveDeActive(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/ProductMultiActiveDeactive', productObj, { headers: headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------|prpoduct specification  attributes  Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getAllProductSpecificationAttributes(specificationAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/product/productSpecificationAttribute/getAllProductSpecificationAttribute', { params: specificationAttributesObj, headers: headers });
  }

  getProductSpecificationAttributeDetailsById(specificationAttributeIdId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/product/productSpecificationAttribute/getProductSpecificationAttributeById/${specificationAttributeIdId}`, { headers });
  }

  createNewProductSpecificationAttributes(specificationAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/productSpecificationAttribute/addProductSpecificationAttribute', specificationAttributesObj, { headers: headers });
  }

  updateProductSpecificationAttributesById(specificationAttributeObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/product/productSpecificationAttribute/updateProductSpecificationAttribute', specificationAttributeObj, { headers });
  }

  productSpecificationAttributeMultiActiveDeActive(specificationAttributeObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/productSpecificationAttribute/ProductSpecificationAttributeActiveDeActive', specificationAttributeObj, { headers: headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------|  product// product attribute  Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getAllProductAttributeMappingsList(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/product/productAttributeMapping/getAllProductAttributeMapping', { params: productAttributesObj, headers: headers });
  }

  getActiveProductAttributesByProductId(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/product/productAttributeMapping/getActiveProductAttributeMapping', { params: productAttributesObj, headers: headers });
  }

  getProductAttributeDetailsById(productAttributeId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/product/productAttributeMapping/getProductAttributeMappingById/${productAttributeId}`, { headers });
  }

  createNewProductAttributeMapping(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/productAttributeMapping/addProductAttributeMapping', productAttributesObj, { headers: headers });
  }

  updateProductAttributesMappingById(productAttributesObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/product/productAttributeMapping/updateProductAttributeMapping', productAttributesObj, { headers });
  }

  productAttributeActiveDeActive(productAttributeObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/productAttributeMapping/ProductAttributeMappingActiveDeActive', productAttributeObj, { headers: headers });
  }



  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------|  product// product value  Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getAllProductValueMappingsList(productValueObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/product/productAttributePredefinedValueMapping/getAllProductAttributePredefinedValueMapping', { params: productValueObj, headers: headers });
  }

  getActiveProductValueMappingsList(productValueObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/product/productAttributePredefinedValueMapping/getActiveProductAttributePredefinedValueMapping', { params: productValueObj, headers: headers });
  }


  getProductValueDetailsById(productValueId: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/product/productAttributePredefinedValueMapping/getProductAttributePredefinedValueMappingById/${productValueId}`, { headers });
  }

  createNewProductValueMapping(productValueObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/productAttributePredefinedValueMapping/addProductAttributePredefinedValueMapping', productValueObj, { headers: headers });
  }


  updateProductValueMappingById(productValueObj: any) {
    let myToken = localStorage.getItem("myToken")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    });
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/product/productAttributePredefinedValueMapping/updateProductAttributePredefinedValueMapping', productValueObj, { headers });
  }


  valueActiveDeActive(valueObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/productAttributePredefinedValueMapping/ProductAttributePredefinedValueMappingActiveDeActive', valueObj, { headers: headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------|  product multimidea  image Tags Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllProductMultimediaList(productMultimediaObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/multimedia/getAllMultiMediaImage', { params: productMultimediaObj, headers: headers });
  }

  createMultiMediaImage(multiMediaImageObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/multimedia/addMultiMediaImage', multiMediaImageObj, { headers: headers });
  }

  updateMultiMediaImage(multiMediaImageObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })

    return this.http.post(this.commonService.rootData.rootUrl + 'admin/multimedia/updateMultiMediaImage', multiMediaImageObj, { headers: headers });
  }

  multimediaActiveDeActive(multimediaObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/multimedia/MultiMediaImageActiveDeActive', multimediaObj, { headers: headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------|  product multimidea  video Tags Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================


  getAllProductVodeoList(productMultimediaVideoObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/multimedia/getAllMultiMediaVideo', { params: productMultimediaVideoObj, headers: headers });
  }

  createNewProductVideo(multimediaVideoObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/multimedia/addMultiMediaVideo', multimediaVideoObj, { headers: headers });
  }


  updateProductVideo(multimediaVideoObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/multimedia/updateMultiMediaVideo', multimediaVideoObj, { headers: headers });
  }


  multimediaVideoActiveDeActive(multimediaVideoObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/multimedia/MultiMediaVideoActiveDeActive', multimediaVideoObj, { headers: headers });
  }


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Product Tags Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllActiveProductTag(productTagObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/producttag/getActiveProductTag', { params: productTagObj, headers: headers });
  }

  getAllproductTag(productTagObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/producttag/getAllProductTag', { params: productTagObj, headers: headers });
  }

  getProductTagDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/producttag/getProductTagById/${id}`, { headers });
  }

  updateProductTags(productTagObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/producttag/updateProductTag', productTagObj, { headers: headers });
  }


  producttagsActiveDeActive(productTagObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/producttag/ProductTagMultiActiveDeActive', productTagObj, { headers });
  }




  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| warehouse Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllActiveWarehouse(warehouseObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/settings/warehouses/getActiveWarehouse', { params: warehouseObj, headers: headers });
  }

  getAllWarehouse(warehouseObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/settings/warehouses/getAllWarehouse', { params: warehouseObj, headers: headers });
  }

  getWarehouseDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/settings/warehouses/getWarehouseById/${id}`, { headers });
  }

  createWarehouse(warehouseObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/settings/warehouses/addWarehouse', warehouseObj, { headers: headers });
  }

  updateWarehouse(warehouseObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/settings/warehouses/updateWarehouse', warehouseObj, { headers: headers });
  }

  warehouseActiveDeActive(warehouseObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/settings/warehouses/WarehouseActiveDeActive', warehouseObj, { headers });
  }




  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| cutomer role Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllActiveCustomerRole(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/customerrole/getActiveCustomerRole', { params: roleObj, headers: headers });
  }

  getAllCustomerRole(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/customerrole/getAllCustomerRole', { params: roleObj, headers: headers });
  }

  getCustomerRoleDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/customerrole/getCustomerRoleById/${id}`, { headers });
  }

  createCustomerRole(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/customerrole/addCustomerRole', roleObj, { headers: headers });
  }

  updateRole(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/customerrole/updateCustomerRole', roleObj, { headers: headers });
  }

  customerRoleActiveDeActive(roleObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/customerrole/CustomerRoleActiveDeActive', roleObj, { headers });
  }

  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| cutomers list Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  
  
  getAllCustomer(customerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/customer/getAllCustomer', { params: customerObj, headers: headers });
  }

  getCustomerDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/customer/getCustomerById/${id}`, { headers });
  }

  createCustomer(customerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/customer/addCustomer', customerObj, { headers: headers });
  }

  updateCustomer(customerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/customer/updateCustomer', customerObj, { headers: headers });
  }

  customerActiveDeActive(customerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/customer/CustomerMultiActiveDeActive', customerObj, { headers });
  }

  updatePassword(customerObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/customer/updatePasswordByAdmin', customerObj, { headers: headers });
  }
 
  getAllCustomerAddress(customerAddressObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/customer/customeraddress/getAllCustomerAddress', { params: customerAddressObj, headers: headers });
  }

  getAddressDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/customer/customeraddress/getCustomerAddressById/${id}`, { headers });
  }

  createCustomerAddress(customerAddressObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/customer/customeraddress/addCustomerAddress', customerAddressObj, { headers: headers });
  }

  updateCustomerAddress(customerAddressObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/customer/customeraddress/updateCustomerAddress', customerAddressObj, { headers: headers });
  }
  
  addressActiveDeActive(customerAddressObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/customer/customeraddress/CustomerAddressActiveDeActive', customerAddressObj, { headers });
  }


  
  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| topic Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  

  getAllTopic(topicObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/contentmanagement/pages/getAllPages', { params: topicObj, headers: headers });
  }

  getTopicDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/contentmanagement/pages/getPagesById/${id}`, { headers });
  }

  createTopic(topicObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/contentmanagement/pages/addPages', topicObj, { headers: headers });
  }

  updateTopic(topicObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/contentmanagement/pages/updatePages', topicObj, { headers: headers });
  }

  topicActiveDeActive(topicObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/contentmanagement/pages/PagesActiveDeActive', topicObj, { headers });
  } 


    // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| blog Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  
  getAllBlogPost(blogObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/contentmanagement/blogpost/getAllBlogPosts', { params: blogObj, headers: headers });
  }

  getBlogPostDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/contentmanagement/blogpost/getBlogPostsById/${id}`, { headers });
  }

  createNewBlogPost(blogObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/contentmanagement/blogpost/addBlogPosts', blogObj, { headers: headers });
  }

  updateBlogPost(blogObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/contentmanagement/blogpost/updateBlogPosts', blogObj, { headers: headers });
  }

  blogPostActiveDeActive(blogObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/contentmanagement/blogpost/BlogPostsActiveDeActive', blogObj, { headers });
  } 

   // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| news items Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  
  getAllNewsItems(newsObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/contentmanagement/newsitem/getAllNewsItem', { params: newsObj, headers: headers });
  }

  getNewsItemsDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/contentmanagement/newsitem/getNewsItemById/${id}`, { headers });
  }

  createNewsItems(newsObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/contentmanagement/newsitem/addNewsItem', newsObj, { headers: headers });
  }

  updateNewsItems(newsObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/contentmanagement/newsitem/updateNewsItem', newsObj, { headers: headers });
  }

  newsItemsActiveDeActive(newsObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/contentmanagement/newsitem/NewsItemActiveDeActive', newsObj, { headers });
  } 


     // =====================================================================================================================================================================
  // -----------------------------------------------------------------------|slider master Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
 
  getAllSlider(sliderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/slider/getAllSlider', { params: sliderObj, headers: headers });
  }

  getSliderDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/slider/getSliderById/${id}`, { headers });
  }

  createNewSlider(sliderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/slider/addSlider', sliderObj, { headers: headers });
  }

  updateSlider(sliderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/slider/updateSlider', sliderObj, { headers: headers });
  }

  sliderActiveDeActive(sliderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/slider/sliderActiveDeActive', sliderObj, { headers });
  } 


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| sidebar Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  
  getAllSidebarMenu(sidebarObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/userrolewisePermission/getUserSidebarMenu', { params: sidebarObj, headers: headers });
  }


    // =====================================================================================================================================================================
  // -----------------------------------------------------------------------|  product// realted product Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================

  getAllRelatedProduct(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/product/relatedproduct/getAllRelatedProducts', { params: productObj, headers: headers });
  }


  createNewRelatedProduct(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/relatedproduct/addRelatedProduct', productObj, { headers: headers });
  }

  updateRelatedProduct(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/product/relatedproduct/updateRelatedProduct', productObj, { headers: headers });
  }

  relatedProductActiveDeActive(productObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/product/relatedproduct/RelatedProductActiveDeActive', productObj, { headers });
  } 


  
  getpagePermission(params: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/userrolewisePermission/getUsermenupermissionById', { params: params, headers: headers });
}


  // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Orders Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  
  
  getAllOrders(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/order/getAllOrders', { params: orderObj, headers: headers });
  }

  
  getAllOrdersNotesList(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/orderNote/getAllOrderNotes', { params: orderObj, headers: headers });
  }
  
  getOrderDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/order/getOrderDetailsByOrderId/${id}`, { headers });
  }


  getBillingAddressDetailsByOrderId(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/order/getBillingAddressById/${id}`, { headers });
  }

  getShippingAddressDetailsByOrderId(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/order/getShippingAddressById/${id}`, { headers });
  }


  getAllShipments(shipmentObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({

      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/shipment/getAllShipment', { params: shipmentObj, headers: headers });
  }

  CreateOrderNotes(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/orderNote/addOrderNote', orderObj, { headers: headers });
  }


  orderNotesActiveDeActive(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post<any>(
      this.commonService.rootData.rootUrl + 'admin/orderNote/orderNoteActiveDeActive', orderObj, { headers });
  }


  updateBillingAddress(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/order/updateBillingAddress', orderObj, { headers: headers });
  }

  updateShippingAddress(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/order/updateShippingAddress', orderObj, { headers: headers });
  }

  updateOrderStatus(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/order/updateOrderStatus', orderObj, { headers: headers });
  }

  downloadOrders(orderObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'admin/order/generateInvoicesZip', { params: orderObj, headers: headers });
  }

    // =====================================================================================================================================================================
  // -----------------------------------------------------------------------| Shipments Page APIs |-----------------------------------------------------------------------
  // =====================================================================================================================================================================
  

  getShipmentDetailsById(id: string) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.get<any>(this.commonService.rootData.rootUrl + `admin/shipment/getShipmentById/${id}`, { headers });
  }


  createShipment(shipmentObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/shipment/addShipment', shipmentObj, { headers: headers });
  }

  updateShipment(shipmentObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/shipment/updateShipment', shipmentObj, { headers: headers });
  }

  shipmentActiveDeActive(shipmentObj: any) {
    let myToken = localStorage.getItem("myToken")
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'admin/shipment/shipmentActiveDeActive', shipmentObj, { headers: headers });
  }
}