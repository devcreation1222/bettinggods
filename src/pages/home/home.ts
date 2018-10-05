import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';

import { CategoriesProvider } from '../../providers/categories/categories';
import { BlogsProvider } from '../../providers/blogs/blogs';
import { GlobalProvider } from '../../providers/global/global';
import { BlogPage } from '../blog/blog';
import { Blog } from './blog';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BlogsProvider, GlobalProvider, CategoriesProvider]
})
export class HomePage {
  @ViewChild(Content) content: Content;

  loading: Loading;
  blogPage : any;
  page = 1;
  lastPage = 2;
  categories : any;
  currentCategory = "All";
  currentCatId = "";
  notShown = true;
  blogs : Blog[] = [];
  catId = "";
  offlineMode = false;
  isRefresher = false;
  isInfiniteScroll = false;

  constructor(
    public navCtrl: NavController,
    private categoriesProvider: CategoriesProvider,
    private blogsProvider: BlogsProvider,
    public global: GlobalProvider,
    public sanitizer: DomSanitizer,
    public storage: Storage,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.blogPage = BlogPage;
    this.loadBlogs(0, this.page, this.blogs, this.catId);
  }

  public showCategories() {
    this.notShown = !this.notShown;
  }

  loadBlogs(refresher:any, page, blogs, catId) {
    if (!refresher) this.showLoading();
    this.categoriesProvider.getCategories()
      .subscribe(
        (res:any) => {
          this.categories = res.categories;
        }
      );
    
    this.blogs = blogs || [];
    this.global.blogsGlobal = this.global.blogsGlobal || [];
    if (catId || catId === "") {
      this.currentCatId = catId;
    }
    if (refresher) {
      if (refresher.pullMax) {
        this.isRefresher = true;
      } else {
        this.isInfiniteScroll = true;
      }
    }
      this.blogsProvider.getBlogs(page, catId)
      .subscribe(
        (res:any) => {
          this.offlineMode = false;
          this.platform.ready().then(() => {
            this.storage.remove('blogsGlobal').then(() => {
              res.posts.forEach((blog, i) => {
                let imgUrl = blog.thumbnail ?
                  blog.thumbnail :
                  blog.attachments.length && blog.attachments[0].images && blog.attachments[0].images.medium ?
                  blog.attachments[0].images.medium.url :
                  "";
                this.global.blogsGlobal[blog.id] = {
                  id: blog.id,
                  thumbnail: imgUrl,
                  title: blog.title,
                  content: blog.content,
                  url: blog.url
                };
                this.blogs[this.page * 8 - i - 1] = {
                  id: blog.id,
                  thumbnail: imgUrl,
                  title: this.sanitizer.bypassSecurityTrustHtml(blog.title),
                  content: blog.content
                };
              });
              if (this.blogs) this.loading.dismiss();
              this.storage.set('blogsGlobal', this.global.blogsGlobal);
              if (refresher) {
                refresher.complete();
                if (refresher.pullMax) {
                  this.isRefresher = false;
                } else {
                  this.isInfiniteScroll = false;
                }
              }
              this.lastPage = res.pages;
              this.global.checkBlogsHeight();
            })
          })
        },
        (err) => {
          this.offlineMode = true;
          this.platform.ready().then(() => {
            this.global.checkBlogsHeight();
            this.storage.get('blogsGlobal')
              .then((blogsGlobal) => {
                this.showSuccess('Offline mode', 'Blogs that were saved during previous session are available.');
                this.global.blogsGlobal = blogsGlobal;
                Object.keys(this.global.blogsGlobal).reverse().forEach((key, i) => {
                  let blog = this.global.blogsGlobal[key];
                  this.blogs[this.page * 8 - i - 1] = {
                    id: blog.id,
                    thumbnail: '../../assets/imgs/offline_mode.jpg',
                    title: this.sanitizer.bypassSecurityTrustHtml(blog.title),
                    content: blog.content
                  };
                  this.global.blogsGlobal[key].thumbnail = '../../assets/imgs/offline_mode.jpg';
                })
              })
              .catch((error) => {
                this.showError('Error', 'Please check your internet connection.')
              });
              if (refresher) {
                refresher.complete();
                if (refresher.pullMax) {
                  this.isRefresher = false;
                } else {
                  this.isInfiniteScroll = false;
                }
              }
          })
        }
      )
    
  }

  loadMoreBlogs(infinitescroll) {
    this.loadBlogs(infinitescroll, ++this.page, this.blogs, this.catId);
  }

  chooseCategory(name, id) {
    this.currentCategory = name;
    this.blogs = [];
    this.page = 1;
    this.notShown = !this.notShown;
    this.loadBlogs(0, this.page, this.blogs, id);
  }

  // onScroll()

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
