import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SupportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SupportProvider {

  constructor(public http: HttpClient) {
    
  }

  sendSupport(name, email, subject, message) {
    return this.http.get('http://freeracing.tips/api/support/?name=' + name + '&email=' + email + '&subject=' + subject + '&message=' + message);
  }

}
