import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {Response} from "../Response";
import {TSMap} from "typescript-map";
import {LoginPage} from "../login/login";
import {Host} from "../Host";

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  static ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  email: any;
  password: any;
  currentAdminPassword: any;
  confirmPassword: any;
  map = new Map();
  superAdmin: any;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private alertCtrl: AlertController,
              private http: HttpClient,
              private loadingController: LoadingController,
              private alertController: AlertController) {


  }

  private getToken() {
    return this.storage.get("paragala-token");
  }

  /**
   * TODO add prompt upon success
   */
  createAdmin() {
    let loading = this.loadingController.create({content: "Creating admin..."});

    if (this.confirmPassword == null) {
      let alert = this.alertCtrl.create({
        title: "Enter admin password",
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    if (this.password != this.confirmPassword) {
      let alert = this.alertCtrl.create({
        title: "Passwords did not match!",
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    console.log(this.superAdmin);

    if (this.superAdmin == null) {
      let alert = this.alertCtrl.create({
        title: "Please specify if super admin or not",
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    let tsMap = new TSMap();

    tsMap.set("email", this.email);
    tsMap.set("password", this.password);
    tsMap.set("superAdmin", this.superAdmin);
    tsMap.set("currentPassword", this.currentAdminPassword);

    let message = tsMap.toJSON();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    loading.present();
    // TODO admin fix
    this.getToken().then(token => {
      let url = Host.host + "/api/users?token=" + token;
      this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
        console.log(response);
        loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: response['status'],
          subTitle: response['message'],
          buttons: ['Ok']
        });
        // add loading
        alert.present();
      });
    })
  }


  logout() {
    this.storage.remove("paragala-token");
    this.navCtrl.setRoot(LoginPage)
  }

}
