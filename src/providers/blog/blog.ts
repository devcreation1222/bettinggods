import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BlogProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BlogProvider {

  constructor(public http: HttpClient) {
    
  }

  getData(blogId) {
    return this.http.get("https://bettinggods.com/api/get_post/?id=" + blogId);
  }

}
