import { Component } from '@angular/core';
import { Nav, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { MyTipstersPage } from '../my-tipsters/my-tipsters';
import { ChangePasswordPage } from '../change-password/change-password';
import { GlobalProvider } from '../../providers/global/global';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [SettingsProvider]
})
export class SettingsPage {
  loading: Loading;
  URL = {
    tipNotif : 'https://members.bettinggods.com/api/toggle_notification_status',
    blogNotif: 'https://bettinggods.com/api/register_device_token'
  };
  settingsData = {
    blogNotif: false,
    tipNotif: false
  }
  changePasswordPage:any = ChangePasswordPage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public global: GlobalProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public settingsProvider: SettingsProvider
  ) {
    let settingsData = JSON.parse(localStorage.getItem('settingsData'));
    this.settingsData = {
      blogNotif: settingsData ? Boolean(settingsData.blogNotif) : true,
      tipNotif: settingsData ? Boolean(settingsData.tipNotif) : true
    };
    localStorage.setItem('settingsData', JSON.stringify(this.settingsData));
  }

  ionViewDidLoad() {
    
  }

  notificationSettings(name) {
    let data = {
      status: this.settingsData[name] ? 1 : 0,
      api_call: true,
      device_token: this.global.deviceToken,
      token: ''
    };

    if (name === 'tipNotif' && !localStorage.getItem('token')) {
      this.showError('Warning', 'To manage tips notifications please login');
      this.settingsData[name] = !this.settingsData[name];
      return;
    }

    if (name === 'tipNotif' && localStorage.getItem('token')) {
      data.token = localStorage.getItem('token');
    }

    this.showLoading();

    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    let blogOrTip = name === 'blogNotif' ? 'bogs' : 'tipsters';

    this.settingsProvider.saveSettings(this.URL[name], formData)
      .subscribe(
        res => {
          this.loading.dismiss();
          this.showSuccess('Success', 'Your push notifications settings for ' + blogOrTip + ' have been changed.');
          localStorage.setItem('settingsData', JSON.stringify(this.settingsData));
        },
        err => {
          this.settingsData[name] = !this.settingsData[name];
          this.loading.dismiss();
          this.showError('Error', 'Request has not been sent.' + JSON.stringify(err));
        }
      );
  }

  goTipsters() {
    this.navCtrl.setRoot(TabsPage, {tabId: 1, blogID: '', recent: ''});
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
