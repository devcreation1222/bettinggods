import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { ResponsibleProvider } from '../../providers/responsible/responsible';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the ResponsiblePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-responsible',
  templateUrl: 'responsible.html',
})
export class ResponsiblePage {
  loading: Loading;
  loaded = false;
  title: any;
  content: any;
  imgUrl = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public responsibleProvider: ResponsibleProvider,
    public sanitizer: DomSanitizer,
    public global: GlobalProvider
  ) {
    this.showLoading();
    this.responsibleProvider.getResponsible()
      .subscribe(
        (res:any) => {
          this.title = this.sanitizer.bypassSecurityTrustHtml(res.post.title);
          this.content = this.sanitizer.bypassSecurityTrustHtml(res.post.content);
          this.imgUrl = res.post.attachments[0].images.medium.url;
          this.loaded = true;
          this.loading.dismiss();
        },
        err => {
          this.loading.dismiss();
          this.showError('Error', 'Something went wrong... Please check your internet connection.');
        }
      )
  }

  ionViewDidLoad() {
    
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
