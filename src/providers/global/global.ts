import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController, AlertController } from 'ionic-angular';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {
  public blogsGlobal = [];
  public slideHeader = false;
  public slideHeaderPrevious = 0;
  public deviceToken = "";
  public tipsList = {};
  public token = "";
  

  constructor(
    public http: HttpClient,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    
  }

  public spinner() {
    let svg = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                      width="50px" height="50px" viewBox="0 0 24 30" style="" xml:space="preserve">
                    <rect x="0" y="10" width="3.5" height="8" fill="#fa6800" opacity="1" rx="2" ry="2">
                      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="7" y="10" width="3.5" height="8" fill="#fa6800"  opacity="1" rx="2" ry="2">
                      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="14" y="10" width="3.5" height="8" fill="#fa6800"  opacity="1" rx="2" ry="2">
                      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="21" y="10" width="3.5" height="8" fill="#fa6800"  opacity="1" rx="2" ry="2">
                      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                  </svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  public updateDeviceTokenForBlogs(formData) {
    return this.http.post('https://bettinggods.com/api/register_device_token', formData);
  }

  public addComment(postId, name, email, content) {
    return this.http.get('https://www.bettinggods.com/api/add_comment?post_id=' + postId + '&name=' + name + '&email=' + email + '&content=' + content);
  }

  public checkIfAndroid(callback, appleCallback) {
    
  }

  public setEventOnA() {

  }

  public checkBlogsHeight() {
    
  }

  public checkOneBlogHeight() {
    
  }
}
