import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { MyTipsterTipPage } from '../my-tipster-tip/my-tipster-tip';
import { TipsterProvider } from '../../providers/tipster/tipster';
import { GlobalProvider } from '../../providers/global/global';
import { LoginPage } from '../login/login';

/**
 * Generated class for the MyTipsterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-tipster',
  templateUrl: 'my-tipster.html',
  providers: [TipsterProvider]
})
export class MyTipsterPage {
  loading: Loading;
  page = 1;
  lastPage = 2;
  tips: any[] = [];
  myTipsterTipPage: any;
  isRefresher = false;
  isInfiniteScroll = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private tipsterProvider: TipsterProvider,
    public global: GlobalProvider,
    public sanitizer: DomSanitizer
  ) {
    this.myTipsterTipPage = MyTipsterTipPage;
    this.getTip(0, this.page, this.tips);
  }

  ionViewDidLoad() {
    
  }

  getTip(refresher:any, page, tips) {
    if (!refresher) this.showLoading();
    if (refresher) {
      if (refresher.pullMax) {
        this.isRefresher = true;
      } else {
        this.isInfiniteScroll = true;
      }
    }
    let tipId = this.navParams.data;
    let header = {
      cookie: localStorage.getItem('token'),
      api_call: true
    };
    let formData = new FormData();
    for (let key in header) {
      formData.append(key, header[key]);
    }
    this.tips = tips || {};
    this.tipsterProvider.getTipster(tipId, page, formData)
      .subscribe(
        (res: any) => {
          this.global.tipsList = this.global.tipsList || {};
          res.posts.forEach((tip, i) => {
            this.global.tipsList[i] = {
              id: tip.id,
              content: tip.content
            };
            this.tips[this.page * 8 - i - 1] = {
              id: tip.id,
              title: this.sanitizer.bypassSecurityTrustHtml(tip.title)
            };
          });
          this.lastPage = res.pages;
          if (refresher) {
            refresher.complete();
            if (refresher.pullMax) {
              this.isRefresher = false;
            } else {
              this.isInfiniteScroll = false;
            }
          }
          this.loading.dismiss();
        },
        (err: any) => {
          this.loading.dismiss();
          let message = err.error && err.error.error && err.error.error || 'Please check your internet connection or login again';
          this.showError('Error', message);
          if (refresher) {
            refresher.complete();
            if (refresher.pullMax) {
              this.isRefresher = false;
            } else {
              this.isInfiniteScroll = false;
            }
          }
          if (err.status === 401) {
            localStorage.removeItem('token');
            this.navCtrl.setRoot(LoginPage);
          }
        }
      )
  }

  loadMoreTip(infinitescroll) {
    this.getTip(infinitescroll, ++this.page, this.tips);
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
