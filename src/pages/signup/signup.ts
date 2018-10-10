import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';

import { UserProvider } from '../../providers/user/user';
import { GlobalProvider } from '../../providers/global/global';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [UserProvider, GlobalProvider]
})
export class SignupPage {
  loading: Loading;
  data = {
    login: '',
    email: '',
    api_call: true,
    device_token: ''
  };
  emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public global: GlobalProvider,
    private nativePageTransitions: NativePageTransitions
  ) {
    this.data = {
      login: '',
      email: '',
      api_call: true,
      device_token: this.global.deviceToken
    }
  }

  ionViewDidLoad() {
    
  }

  register() {
    if (!this.data.login || !this.data.email) {
      this.showError('Error', 'All fields are required.');
    } else if (!this.data.email.match(this.emailCheck)) {
      this.showError('Response Failed', 'Please indicate correct email.');
    } else {
      this.showLoading();
      let formData = new FormData();
      for (let key in this.data) {
        formData.append(key, this.data[key]);
      }
      this.userProvider.register(formData)
        .subscribe(
          data => {
            this.loading.dismiss();
            this.showSuccess('Success', 'Your registration request has been sent. The response will be sent to your mail.');
          },
          err => {
            let errText = '';
            if (err && err.error && err.error.error && err.error.error.errors) {
              errText = Object.keys(err.error.error.errors).map((elem, i) => {
                return err.error.error.errors[elem];
              })[0];
            } else {
              errText = 'Request has not been sent.';
            }
            this.loading.dismiss();
            this.showError('Error', errText);
          }
        )
    }
  }

  goLogin() {
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 400,
      slowdownfactor: -1,
      iosdelay: 50
    };
    this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(LoginPage);
  }

  goHome() {
    this.navCtrl.setRoot(TabsPage, {tabId: 0, blogID: '', recent: ''});
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
