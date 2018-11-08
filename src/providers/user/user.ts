
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public http: HttpClient) {
    
  }

  register(formData: any) {
    // return this.http.post("https://members.bettinggods.com/api/registration", formData);
    return this.http.post('http://freeracing.tips/api/registration', formData);
  }

  login(formData: any) {
    // return this.http.post("https://members.bettinggods.com/api/login/", formData);
    return this.http.post('http://freeracing.tips/api/login/', formData);
  }

  logout(formData: any) {
    // return this.http.post('https://members.bettinggods.com/api/logout/', formData);
    return this.http.post('http://freeracing.tips/api/logout/', formData);
  }
}
