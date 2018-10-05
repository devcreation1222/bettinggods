import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { MyTipsterPage } from '../my-tipster/my-tipster';
import { LoginPage } from '../login/login';
import { TipsterProvider } from '../../providers/tipster/tipster';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the MyTipstersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-tipsters',
  templateUrl: 'my-tipsters.html',
  providers: [TipsterProvider]
})
export class MyTipstersPage {
  loading: Loading;
  page = 1;
  lastPage = 2;
  tips : any[] = [];
  myTipsterPage : any;
  isRefresher = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public tipsProvider: TipsterProvider,
    public global: GlobalProvider
  ) {
    this.myTipsterPage = MyTipsterPage;
    this.getTips(0, this.page, this.tips);
  }

  ionViewDidLoad() {
    
  }

  getTips(refresher:any, page, tips) {
    if (!refresher) this.showLoading();
    let header = {
      cookie: localStorage.getItem('token'),
      api_call: true
    };
    let formData = new FormData();
    for (let key in header) {
      formData.append(key, header[key]);
    }
    if (refresher) {
      this.isRefresher = true;
    }
    this.tips = tips || {};
    this.tipsProvider.getTipstersCategories(formData)
      .subscribe(
        (res: any) => {
          res.categories.forEach((tip, i) => {
            this.tips[i] = {
              id: tip.id,
              thumbnail: tip.image,
              title: tip.title,
              description: tip.description
            }
          });
          this.lastPage = res.pages;
          if (refresher) {
            refresher.complete();
            this.isRefresher = false;
          }
          this.loading.dismiss();
        },
        (err: any) => {
          this.loading.dismiss();
          let message = err.error && err.error.error && err.error.error || 'Please check your internet connection or login again';
          this.showError('Error', message);
          if (refresher) {
            refresher.complete();
            this.isRefresher = false;
          }
          if (err.status === 401) {
            localStorage.removeItem('token');
            this.navCtrl.setRoot(LoginPage);
          }
        }
      )
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
