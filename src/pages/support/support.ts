import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { SupportProvider } from '../../providers/support/support';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the SupportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  providers: [SupportProvider]
})
export class SupportPage {
  loading: Loading;
  data = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  EMAIL_CHECK = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private supportProvider: SupportProvider,
    public global: GlobalProvider
  ) {

  }

  ionViewDidLoad() {
    
  }

  sendToSupport() {
    if (!this.data.message || !this.data.email || !this.data.name || !this.data.subject) {
      this.showError('Response Failed', 'All fields are required.');
    } else if (!this.data.email.match(this.EMAIL_CHECK)) {
      this.showError('Response Failed', 'Please indicate correct email.');
    } else {
      this.showLoading();
      console.log(this.data);
      this.supportProvider.sendSupport(this.data.name, this.data.email, this.data.subject, this.data.message)
        .subscribe(
          res => {
            this.loading.dismiss();
            this.showSuccess('Success', 'Your request has been sent. The response will be sent to your mail.');
          },
          err => {
            this.loading.dismiss();
            this.showError('Error', 'Request has not been sent.');
          }
        )
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
