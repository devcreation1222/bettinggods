import {
  Component,
  ViewChild
} from '@angular/core';
import {
  Nav,
  Platform,
  Events,
  AlertController,
  Loading,
  LoadingController
} from 'ionic-angular';
import {
  StatusBar
} from '@ionic-native/status-bar';
import {
  SplashScreen
} from '@ionic-native/splash-screen';
import {
  Push,
  PushObject,
  PushOptions
} from '@ionic-native/push';

import {
  ResponsiblePage
} from '../pages/responsible/responsible';
import {
  SupportPage
} from '../pages/support/support';
import {
  SettingsPage
} from '../pages/settings/settings';
import {
  LoginPage
} from '../pages/login/login';
import {
  SignupPage
} from '../pages/signup/signup';
import {
  TabsPage
} from '../pages/tabs/tabs';
import {
  MyTipsterPage
} from '../pages/my-tipster/my-tipster';
import {
  GlobalProvider
} from '../providers/global/global';
import {
  UserProvider
} from '../providers/user/user';
import {
  BlogPage
} from '../pages/blog/blog';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  loading: Loading;
  rootPage = TabsPage;
  userToken: any;
  token = false;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public global: GlobalProvider,
    private push: Push,
    public userProvider: UserProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.initializeApp();
    
    this.userToken = localStorage.getItem('token');
    if (this.userToken) {
      this.token = true;
    }

    events.subscribe('menu:created', () => {
      this.checkMenu();
    });

    events.subscribe('menu:opened', () => {
      this.checkMenu();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.hide();
      this.splashScreen.hide();

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
                console.log(e);
                this.routeOnPush(payload);
              }
            }
          ]
        });
      });

      pushObject.on('error').subscribe(error => {
        console.log('error: ', error);
      });
    });
  }

  checkMenu(){
    this.userToken = localStorage.getItem('token');
    if (this.userToken) {
      this.token = true;
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
      this.nav.push(TabsPage, {
        tabId: 1,
        blogID: '',
        recent: payload.id
      });
    } else {
      this.nav.push(TabsPage, {
        tabId: 0,
        blogID: payload.id,
        recent: ''
      });
    }
  }

  pushUnregister(showErrAlert) {
    const options: PushOptions = {
      android: {
        senderID: '716852556262',
        sound: true,
        vibrate: true
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'true'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.unregister().then((res) => {
      console.log(res);
    }).catch((err) => {
      if (showErrAlert) {
        this.showError('Error', 'Failed to switch off push notifications');
      }
    })
  }

  openHomePage() {
    this.nav.setRoot(TabsPage, {tabId: 0, blogID: '', recent: ''});
  }
  openResponsiblePage() {
    this.nav.setRoot(ResponsiblePage);
  }
  openSupportPage() {
    this.nav.setRoot(SupportPage);
  }
  openSettingsPage() {
    this.nav.setRoot(SettingsPage);
  }
  openLoginPage() {
    this.nav.setRoot(LoginPage);
  }
  openSignupPage() {
    this.nav.setRoot(SignupPage);
  }

  logout() {
    let data = {
      data: localStorage.getItem('token'),
      device_token: this.global.deviceToken,
      api_call: true
    };
    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    this.showLoading();
    this.userProvider.logout(formData).subscribe((res) => {
      localStorage.removeItem('token');
      this.pushUnregister(true);
      this.nav.setRoot(TabsPage, {tabId: 0, blogID: '', recent: ''});
      this.loading.dismiss();
      location.reload();
    }, (err) => {
      localStorage.removeItem('token');
      this.pushUnregister(true);
      this.nav.setRoot(TabsPage, {tabId: 0, blogID: '', recent: ''});
      this.loading.dismiss();
      location.reload();
    })
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
      buttons: [{
        text: 'Ok',
        cssClass: 'alert-danger'
      }]
    });
    alert.present();
  }

}
