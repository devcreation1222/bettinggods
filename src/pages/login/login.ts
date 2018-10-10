import { Component } from '@angular/core';
import { NavController, Platform, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { UserProvider } from '../../providers/user/user';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { GlobalProvider } from '../../providers/global/global';
import { MyTipsterPage } from '../my-tipster/my-tipster';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserProvider]
})
export class LoginPage {
  loading: Loading;
  data = {
    username: '',
    password: '',
    remember: false,
    api_call: true,
    showPass: false,
    type: 'password',
    device_token: ''
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private userProvider: UserProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public global: GlobalProvider,
    private nativePageTransitions: NativePageTransitions,
    private push: Push,
    public platform: Platform
  ) {
    if (global.deviceToken) {
      this.data.device_token = global.deviceToken;
    }
  }

  ionViewDidLoad() {

  }

  changeType() {
    this.data.type = this.data.showPass ? 'text' : 'password';
  }

  submit() {
    if (this.data.username === '' || this.data.password === '') {
      this.showError('Error', 'Name and password are required!');
    } else {
      this.showLoading();
      var formData = new FormData();
      for (let key in this.data) {
        formData.append(key, this.data[key]);
      }
      this.userProvider.login(formData)
        .subscribe((res:any) => {
          localStorage.setItem('token', res.cookie);
          this.global.token = localStorage.getItem('token');
          this.loading.dismiss();
          
          const options: PushOptions = {
            android: {
              senderID: '716852556262',
              sound: true,
              vibrate: true
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'true',
                clearBadge: 'true'
            }
          };
        
          const pushObject: PushObject = this.push.init(options);

          pushObject.on('registration').subscribe((registration: any) => {
            console.log(registration);
            this.global.deviceToken = registration.registrationId;
            let settingsData = JSON.parse(localStorage.getItem('settingsData'));
            // update device token for blogs
            let data = {
              api_call: true,
              device_token: this.global.deviceToken,
              device_platform: this.platform.is('android') ? 'FCM' : 'APNS',
              status: settingsData ? settingsData.blogNotif ? 1 : 0 : 1
            }
            let formData = new FormData();
            for (let key in data) {
              formData.append(key, data[key]);
            }
            this.global.updateDeviceTokenForBlogs(formData)
              .subscribe((res: any) => {
                console.log(JSON.stringify(res));
              }, (err) => {
                console.log(JSON.stringify(err));
              });
            // update device token for tips
            if (localStorage.getItem('token')) {
              this.userProvider.login(formData)
                .subscribe((res: any) => {
                  console.log(JSON.stringify(res));
                }, (err) => {
                  console.log(JSON.stringify(err));
                });
            }
          });
          
          pushObject.on('notification').subscribe((notification: any) => {
            console.log(notification);
            const msg = notification.message;
            const title = notification.title;
            const payload = notification.additionalData;
            let alert = this.alertCtrl.create({
              title: title,
              message: msg,
              buttons: [{
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'button-confirm',
                  handler: (e) => {
                    return false;
                  }
                },
                {
                  text: 'CHECK',
                  cssClass: 'button-confirm-dark',
                  handler: (e) => {
                    this.routeOnPush(payload);
                  }
                }
              ]
            });
          });
          
          pushObject.on('error').subscribe(error => {
            console.log('error: ', error);
          }); 
          this.navCtrl.setRoot(TabsPage, {tabId: 0, blogID: '', recent: ''});
          location.reload();
          this.global.checkBlogsHeight();
          this.global.checkOneBlogHeight();
        }, err => {
          let text = err.error && err.error.error && err.error.error || "Please check your credentials and network connection.";
          this.loading.dismiss();
          this.global.checkBlogsHeight();
          this.global.checkOneBlogHeight();
          this.showError('Login Failed', text);
        })
    }
  }
  routeOnPush(payload) {
    if (payload.type === 'tip') {
      let timerId = setTimeout(function tick() {
        if (!this.global.tipsList) {
          timerId = setTimeout(tick, 1000);
        }
        if (this.loading.dismiss()) {
          this.showLoading();
        }
        if (this.global.tipsList) {
          this.loading.dismiss()
        }
      }, 1000);
      this.navCtrl.push(TabsPage, {tabId: 1, blogID: '', recent: payload.id});
    } else {
      this.navCtrl.push(TabsPage, {tabId: 0, blogID: payload.id, recent: ''});
    }
  }

  goSignup() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 400,
      slowdownfactor: -1,
      iosdelay: 50
    };
    this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(SignupPage);
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
          cssClass: 'btn-fail'
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
          cssClass: 'btn-success'
        }
      ]
    });
    alert.present();
  }
}
