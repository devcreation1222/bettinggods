import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the MyTipsterTipPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-tipster-tip',
  templateUrl: 'my-tipster-tip.html',
})
export class MyTipsterTipPage {
  loading: Loading;
  content: any;
  comments: any[] = [];
  comment = {
    post_id: 0,
    content: '',
    parent: 0
  };
  EMAIL_CHECK = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isLoggedIn = false;
  user: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public global: GlobalProvider,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
    let tipId = this.navParams.data;
    this.loadData(tipId);
  }

  ionViewDidLoad() {

  }

  loadData(tipId) {
    if (this.global.tipsList) {
      Object.keys(this.global.tipsList).forEach((key, i) => {
        let tip = this.global.tipsList[key];
        if (tip.id == tipId) {
          console.log(tip);
          this.content = this.sanitizer.bypassSecurityTrustHtml(tip.content);
        }
      })
    }
  }

  postComment(parentId) {
    let cookie = localStorage.getItem('token');
    if (!this.comment.content) {
      this.showError('Response Failed', 'Comment could not be empty.');
    } else {
      this.showLoading();
      
      this.global.addComment(cookie, this.navParams.data, this.comment.content, parentId).subscribe((res) => {
        console.log(res);
        this.loading.dismiss();
        this.showSuccess('Success', 'Your comment has been added successfully.');

        this.comment.content = "";
      }, (err) => {
        this.loading.dismiss();
        if (err.error) {
          this.showError('Error', err.error.error);
        } else {
          this.showError('Error', 'Unfortunately, Your comment has not been added.');
        }
        this.comment.content = "";

      })
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/spinner.svg" />`,
      cssClass: 'custom-spinner',
      duration: 60000,
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(header, text) {
    let alert = this.alertCtrl.create({
      title: header,
      message: text,
      buttons: [
        {
          text: 'Ok',
          cssClass: 'alert-danger'
        }
      ]
    });
    alert.present();
  }

  showSuccess(header, text) {
    let alert = this.alertCtrl.create({
      title: header,
      message: text,
      buttons: [
        {
          text: 'Ok',
          cssClass: 'alert-success'
        }
      ]
    });
    alert.present();
  }
}
