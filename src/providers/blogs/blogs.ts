import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BlogsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BlogsProvider {

  constructor(public http: HttpClient) {
    
  }

  getBlogs(page, currentCatId) {
    return this.http.get("https://bettinggods.com/api/get_recent_posts?page=" + page + "&cat=" + currentCatId);
  }

}
