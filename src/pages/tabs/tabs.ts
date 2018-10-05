import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyTipstersPage } from '../my-tipsters/my-tipsters';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  blogsPage : any = HomePage;
  myTipstersPage : any = MyTipstersPage;
  userToken : any;
  token = false;
  selectedTab = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalProvider) {
    this.userToken = localStorage.getItem('token');
    if (this.userToken) {
      this.token = true;
    }
    if (this.navParams.data == 1) {
      this.selectedTab = 1;
      this.navCtrl.setRoot(MyTipstersPage);
    } else {
      this.selectedTab = 0;
    }
  }

  ionViewDidLoad() {
    
  }

}
