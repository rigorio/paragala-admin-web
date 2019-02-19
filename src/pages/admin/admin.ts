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
  category: string;
  categories: string[];
  map = new Map();
  tokenContainer: string[] = [];
  superAdmin: any;


  startDate: any;
  endDate: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private alertCtrl: AlertController,
              private http: HttpClient,
              private loadingController: LoadingController,
              private alertController: AlertController) {

    this.categories = [];

    let categoryUrl = Host.host + "/api/data/categories";
    this.http.get<Response>(categoryUrl).pipe().toPromise()
      .then(response => {
        console.log(response);
        this.categories = response.message;
      });

    let dateUrl = Host.host + "/api/date";
    this.http.get<Response>(dateUrl + "/start").pipe().toPromise()
      .then(response => {
        console.log(response);
        this.startDate = (response.message);
      });
    this.http.get<Response>(dateUrl + "/end").pipe().toPromise()
      .then(response => {
        console.log(response);
        this.endDate = (response.message);
      });

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

  addCategory(keyCode: number) {
    if (keyCode == 13) {
      this.getToken().then(token => {
        let tsMap = new TSMap();
        tsMap.set("category", this.category);
        let message = tsMap.toJSON();

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

        let url = Host.host + "/api/data/categories?token=" + token;
        this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
          console.log(response);
          if (response.status == "Failed") {
            let alert = this.alertCtrl.create({
              title: response['status'],
              subTitle: response['message'],
              buttons: ['Ok']
            });
            // add loading
            alert.present();
          }
        }).then(_ => {
          let url = Host.host + "/api/data/categories";
          this.http.get<Response>(url).pipe().toPromise()
            .then(response => {
              console.log("refresh " + response);
              this.categories = response.message;
            });
        });

      })

    }
  }


  deleteCategory(c: string) {

    this.getToken().then(token => {
      let url = Host.host + "/api/data/categories/" + c + "?token=" + token;
      console.log(url);
      this.http.delete<Response>(url).pipe().toPromise().then(response => {
        console.log(response);
        if (response.status == "Failed") {
          let alert = this.alertCtrl.create({
            title: response['status'],
            subTitle: response['message'],
            buttons: ['Ok']
          });
          // add loading
          alert.present();
        }
      }).then(_ => {
        let url = Host.host + "/api/data/categories";
        this.http.get<Response>(url).pipe().toPromise()
          .then(response => {
            this.categories = response.message;
          });
      });
    });
  }


  logout() {
    this.storage.remove("paragala-token");
    this.navCtrl.setRoot(LoginPage)
  }

  setDefaults() {
    console.log("Setting default values for categories and schools...");
    this.getToken().then(token => {
      console.log("what");
      this.http.get<Response>(Host.host + "/api/data/defaults/categories?token=" + token)
        .pipe().toPromise().then(response => {
        console.log(response);
        if (response.status == "Failed") {
          let alert = this.alertCtrl.create({
            title: response['status'],
            subTitle: response['message'],
            buttons: ['Ok']
          });
          // add loading
          alert.present();
        } else
          this.categories = response['message'];
      })
    });
  }

  setStartEnd() {
    console.log("baby");
    console.log(this.startDate);
    console.log(this.endDate);
    let loading = this.loadingController.create({content: "Setting voting period..."});

    this.getToken().then(token => {

      let map = new TSMap();
      map.set('start', this.startDate.toString());
      map.set('end', this.endDate.toString());
      loading.present();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      let message = map.toJSON();
      this.http.post<Response>(Host.host + "/api/date?token=" + token, message, httpOptions).pipe().toPromise().then(response => {
        console.log(response);
        loading.dismissAll();
      }).then(_ => {
        let dateUrl = Host.host + "/api/date";
        this.http.get<Response>(dateUrl + "/start").pipe().toPromise()
          .then(response => {
            console.log(response);
            this.startDate = response.message;
          });
        this.http.get<Response>(dateUrl + "/end").pipe().toPromise()
          .then(response => {
            console.log(response);
            this.endDate = response.message;
          });
      })
    })

  }
}
