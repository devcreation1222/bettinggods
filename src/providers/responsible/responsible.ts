import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ResponsibleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ResponsibleProvider {

  constructor(public http: HttpClient) {
    
  }

  getResponsible() {
    return this.http.get('https://www.bettinggods.com/api/how_to_gamble_responsibly/');
  }

}
