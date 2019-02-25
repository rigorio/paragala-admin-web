import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import {Host} from "../Host";
import {Response} from "../Response";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {
  code: any;
  password2: string;
  password1: string;
  email: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private alertCtrl: AlertController,
              private http: HttpClient,
              private loadingController: LoadingController,
              private alertController: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }

  reset() {
    if (this.code == null) {
      let alert = this.alertCtrl.create({
        title: 'Please enter the Reset Code sent to your email',
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    if (this.password1 == null || this.password2 == null) {
      let alert = this.alertCtrl.create({
        title: 'Enter and confirm new password!',
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    if (this.password2 != this.password1) {
      let alert = this.alertCtrl.create({
        title: 'Password mismatch',
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }


    let url = Host.host + "/api/password/reset?password=" + this.password1 + "&code=" + this.code;
    let loading = this.loadingController.create({content: "Please wait..."});
    loading.present();
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      loading.dismissAll();
      let alert = this.alertCtrl.create({
        title: response.status,
        subTitle: response.message,
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      if (response.status === 'Success') {
        this.navCtrl.setRoot(LoginPage);
      }
      return;
    });
    loading.dismissAll();

  }

  sendMail() {
    let url = Host.host + "/api/password?email=" + this.email;
    let loading = this.loadingController.create({content: "Please wait..."});
    loading.present();
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      loading.dismissAll();
      let alert = this.alertCtrl.create({
        title: response.status,
        subTitle: response.message,
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    })
    loading.dismissAll();
  }
}
