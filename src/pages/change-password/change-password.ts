import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { ChangePassProvider } from '../../providers/change-pass/change-pass';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  providers: [ChangePassProvider]
})
export class ChangePasswordPage {
  loading: Loading;
  data = {
    showPass: false,
    type: 'password',
    password: '',
    confirm: '',
    api_call: true,
    token: localStorage.getItem('token')
  }
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public changePassProvider: ChangePassProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public global: GlobalProvider
  ) {
    
  }

  ionViewDidLoad() {
    
  }

  changeType() {
    this.data.type = this.data.showPass ? 'text' : 'password';
  }

  changePassword() {
    this.data.token = localStorage.getItem('token');
    if (this.data.password === '') {
      this.showError('Error', 'Password is required.');
      return;
    }

    if (this.data.password !== this.data.confirm) {
      this.showError('Error', 'Passwords are not matching!');
      return;
    }

    if (!this.data.token) {
      this.showError('Error', 'Please login before changin password.');
      return;
    }

    this.showLoading();
    let formData = new FormData();
    for (let key in this.data) {
      formData.append(key, this.data[key]);
    }
    this.changePassProvider.changePassword(formData)
      .subscribe(
        (res: any) => {
          localStorage.setItem('token', res.cookie);
          this.loading.dismiss();
          this.showSuccess('Success', 'Your password has been changed.');
        },
        (err: any) => {
          let errText = '';
          if (err && err.error && err.error.error && err.error.error.errors) {
            errText = Object.keys(err.error.error.errors).map((elem, i) => {
              return err.error.error.errors[elem];
            })[0];
          } else {
            errText = 'Changing password failed';
          }
          this.loading.dismiss();
          this.showError('Error', errText);
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
