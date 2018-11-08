import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BlogProvider } from '../../providers/blog/blog';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the BlogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blog',
  templateUrl: 'blog.html',
})
export class BlogPage {
  loading: Loading;
  blog = {
    id: 0,
    thumbnail: '',
    title: '',
    content: '',
    url: ''
  };
  title : any;
  content : any;
  canSharViaEm = false;
  comments: any[] = [];
  comment = {
    post_id: 0,
    name: '',
    email: '',
    content: ''
  };
  EMAIL_CHECK = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private blogProvider: BlogProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public sanitizer: DomSanitizer,
    public global: GlobalProvider,
    public socialSharing: SocialSharing
  ) {
    let blogId = this.navParams.data;
    this.loadData(blogId);
    
    // check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(() => {
      this.canSharViaEm = true;
    }).catch(() => {
      this.canSharViaEm = false;
    })
  }

  ionViewDidLoad() {

  }

  loadData(blogId) {
    if (!this.global.blogsGlobal || !this.global.blogsGlobal[blogId]) {
      this.showLoading();
      this.blogProvider.getData(blogId)
        .subscribe(
          (res:any) => {
            this.blog = res.post;
            this.title = this.sanitizer.bypassSecurityTrustHtml(res.post.title);
            this.content = this.sanitizer.bypassSecurityTrustHtml(res.post.content);
            res.post.comments.forEach((comment, i) => {
              this.comments[i] = {
                name: comment.name,
                date: comment.date,
                content: this.sanitizer.bypassSecurityTrustHtml(comment.content)
              };
            });
            
            this.global.setEventOnA();
            this.global.checkBlogsHeight();
            this.global.checkOneBlogHeight();

            this.loading.dismiss();
          },
          (err) => {
            this.loading.dismiss();
          }
        );
    } else {
      this.blog = this.global.blogsGlobal[blogId];
      this.title = this.sanitizer.bypassSecurityTrustHtml(this.blog.title);
      this.content = this.sanitizer.bypassSecurityTrustHtml(this.blog.content);
      this.global.setEventOnA();
      this.global.checkBlogsHeight();
      this.global.checkOneBlogHeight();
    }
  }

  onError(err) {
    this.showError('Share Failed', 'Please check if social network app is installed on your phone.');
  }

  shareViaF() {
    this.socialSharing.shareViaFacebook(this.blog.content, null, this.blog.url).then((res) => {
      console.log(res);
    }).catch((err) => {
      this.onError(err);
    });
  }

  shareViaTw() {
    this.socialSharing.shareViaTwitter(this.blog.title, this.blog.url, null).then((res) => {
      console.log(res);
    }).catch((err) => {
      this.onError(err);
    });
  }

  shareViaEm() {
    this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then((res) => {
      // Success!
      console.log(res);
    }).catch((err) => {
      this.onError(err);
    });
  }

  shareViaAll() {
    this.socialSharing.share(this.blog.title, this.blog.thumbnail, this.blog.url, null).then((res) => {
      console.log(res);
    }).catch((err) => {
      this.onError(err);
    });
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
