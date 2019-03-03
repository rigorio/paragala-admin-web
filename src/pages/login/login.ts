import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TSMap} from "typescript-map"
import {Storage} from "@ionic/storage";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Response} from "../Response"
import {HomePage} from "../home/home";
import {Host} from "../Host";
import {PasswordPage} from "../password/password";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: any;
  password: any;
  mapRequest = new TSMap();
  map = new Map();
  // private host = "https://murmuring-earth-96219.herokuapp.com";
  // private host = "https://murmuring-earth-96219.herokuapp.com";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private alertCtrl: AlertController,
              private http: HttpClient,
              private loadingController: LoadingController) {



  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    let loading = this.loadingController.create({content: "Logging in..."});
    loading.present();
    this.fetchLogin().subscribe(response => {
      console.log(response);
      if (response['status'] === "Logged In") {
        this.storage.set("paragala-token", response['message']);
        loading.dismissAll();
        this.navCtrl.setRoot(HomePage);
      } else {
        console.log("dapat keni ku");
        loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: response['status'],
          subTitle: response['message'],
          buttons: ['Ok']
        });
        // add loading
        alert.present();
      }
    })
  }


  private fetchLogin() {
    this.mapRequest.set("username", this.username);
    this.mapRequest.set("password", this.password);
    let message = this.mapRequest.toJSON();
    console.log(message);
    let url = Host.host + "/api/users/login";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Response>(url, message, httpOptions);
  }

  reset() {
    this.navCtrl.push(PasswordPage);
  }
}
