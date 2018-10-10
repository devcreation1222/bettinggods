import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyTipstersPage } from '../my-tipsters/my-tipsters';
import { GlobalProvider } from '../../providers/global/global';
import { MyTipsterPage } from '../my-tipster/my-tipster';
import { BlogPage } from '../blog/blog';

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
    let recent = this.navParams.get('recent');
    let blogID = this.navParams.get('blogID');
    if (this.navParams.get('tabId') == 1) {
      this.selectedTab = 1;
      if (recent) {
        this.navCtrl.push(MyTipsterPage, recent);
      } else {
        this.myTipstersPage = MyTipstersPage;
      }
    } else {
      this.selectedTab = 0;
      if (blogID) {
        this.navCtrl.push(BlogPage, blogID);
      } else {
        this.blogsPage = HomePage;
      }
    }
  }

  ionViewDidLoad() {
    
  }

}
