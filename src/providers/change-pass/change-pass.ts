import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ChangePassProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChangePassProvider {

  constructor(public http: HttpClient) {
    
  }

  changePassword(formData) {
    // return this.http.post('https://members.bettinggods.com/api/change_password', formData);
    return this.http.post('http://freeracing.tips/api/change_password', formData);
  }

}
