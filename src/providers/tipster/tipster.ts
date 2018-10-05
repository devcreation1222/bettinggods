import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the TipsterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TipsterProvider {

  constructor(public http: HttpClient) {

  }

  getTipstersCategories(formData) {
    return this.http.post('https://members.bettinggods.com/api/get_categories', formData);
  }

  getTipster(tipId, page, formData) {
    return this.http.post('https://members.bettinggods.com/api/get_recent_posts?count=15&cat=' + tipId + '&page=' + page, formData);
  }

}
