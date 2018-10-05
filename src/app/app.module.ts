import {
  BrowserModule
} from '@angular/platform-browser';
import {
  ErrorHandler,
  NgModule
} from '@angular/core';
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule
} from 'ionic-angular';
import {
  HttpModule
} from '@angular/http';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  HTTP
} from '@ionic-native/http';
import {
  IonicStorageModule
} from '@ionic/storage';
import {
  StatusBar
} from '@ionic-native/status-bar';
import {
  SplashScreen
} from '@ionic-native/splash-screen';
import {
  SocialSharing
} from '@ionic-native/social-sharing';
import {
  NativePageTransitions
} from '@ionic-native/native-page-transitions';
import {
  Push
} from '@ionic-native/push';

import {
  MyApp
} from './app.component';
import {
  HomePage
} from '../pages/home/home';
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
  BlogPage
} from '../pages/blog/blog';
import {
  MyTipstersPage
} from '../pages/my-tipsters/my-tipsters';
import {
  ChangePasswordPage
} from '../pages/change-password/change-password';
import {
  TabsPage
} from '../pages/tabs/tabs';
import {
  MyTipsterPage
} from '../pages/my-tipster/my-tipster';
import {
  MyTipsterTipPage
} from '../pages/my-tipster-tip/my-tipster-tip';
import {
  BuyTipstersPage
} from '../pages/buy-tipsters/buy-tipsters';

import {
  UserProvider
} from '../providers/user/user';
import {
  CategoriesProvider
} from '../providers/categories/categories';
import {
  BlogsProvider
} from '../providers/blogs/blogs';
import {
  GlobalProvider
} from '../providers/global/global';
import {
  BlogProvider
} from '../providers/blog/blog';
import {
  ResponsibleProvider
} from '../providers/responsible/responsible';
import {
  SupportProvider
} from '../providers/support/support';
import {
  SettingsProvider
} from '../providers/settings/settings';
import {
  ChangePassProvider
} from '../providers/change-pass/change-pass';
import {
  TipsterProvider
} from '../providers/tipster/tipster';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ResponsiblePage,
    SupportPage,
    SettingsPage,
    LoginPage,
    SignupPage,
    BlogPage,
    MyTipstersPage,
    ChangePasswordPage,
    TabsPage,
    MyTipsterPage,
    MyTipsterTipPage,
    BuyTipstersPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ResponsiblePage,
    SupportPage,
    SettingsPage,
    LoginPage,
    SignupPage,
    BlogPage,
    MyTipstersPage,
    ChangePasswordPage,
    TabsPage,
    MyTipsterPage,
    MyTipsterTipPage,
    BuyTipstersPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    NativePageTransitions,
    HTTP,
    Push,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    UserProvider,
    CategoriesProvider,
    BlogsProvider,
    GlobalProvider,
    BlogProvider,
    ResponsibleProvider,
    SupportProvider,
    SettingsProvider,
    ChangePassProvider,
    TipsterProvider
  ]
})
export class AppModule {}
