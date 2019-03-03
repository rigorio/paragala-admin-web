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
  password: string;
  currentAdminPassword: any;
  confirmPassword: any;
  map = new Map();
  superAdmin: any;
  users: Array<{ id: number; username: string; superAdmin: boolean; }> = [];
  showGrid: boolean = false;
  ownerUsername: any;
  ownerSuperAdmin: any;
  password1: any;
  password2: any;
  password3: any;
  soperAd: boolean = true;
  user: { id: number; username: string; superAdmin: boolean; };


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private alertCtrl: AlertController,
              private http: HttpClient,
              private loadingController: LoadingController,
              private alertController: AlertController) {

    this.user = {
      id: 1,
      username: 'placeholder',
      superAdmin: true
    };

    this.getToken().then(token => {
      let url = Host.host + "/api/users?token=" + token;
      this.http.get<Response>(url).pipe().toPromise().then(response => {
        console.log(response);
        this.users = response.message;
        let length1 = this.users.length;
        if (length1 > 1) {
          this.showGrid = true;
        }
      });

      this.http.get<Response>(Host.host + "/api/users/user?token=" + token).pipe().toPromise().then(response => {
        console.log(response);
        this.user = response.message;
      })

    })
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

    if (this.password.length <6) {
      let alert = this.alertCtrl.create({
        title: "Password must be at least 6 characters",
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
    console.log("what");
    let alert = this.alertCtrl.create({
      title: 'Confirm Logout',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.storage.remove("paragala-token");
            this.navCtrl.setRoot(LoginPage)
          }
        }
      ]
    });

    alert.present();

  }

  saveDetails() {


  }

  deleteUser(id: number) {

    const alert = this.alertController.create({
      title: 'Enter password',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            this.getToken().then(token => {
              let url = Host.host + "/api/users/" + id + "?password=" + data.password + "&token=" + token;
              this.http.delete<Response>(url).pipe().toPromise().then(response => {
                let alert = this.alertCtrl.create({
                  title: response['status'],
                  subTitle: response['message'],
                  buttons: ['Ok']
                });
                // add loading
                alert.present();
                this.getToken().then(token => {
                  let url = Host.host + "/api/users?token=" + token;
                  this.http.get<Response>(url).pipe().toPromise().then(response => {
                    console.log(response);
                    this.users = response.message;
                  });

                })
              })
            });
            console.log('Confirm Ok');
          }
        }
      ]
    });

    alert.present();


  }

  changePassword() {
    if (this.password1 == null || this.password2 == null || this.password3 == null) {
      let alert = this.alertCtrl.create({
        title: "Please fill in all details",
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    console.log(this.password2);
    console.log(this.password3);
    console.log("what");
    let b = this.password2 != this.password3;
    console.log(b);
    if (b) {
      let alert = this.alertCtrl.create({
        title: "Passwords did not match",
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    this.getToken().then(token => {
      let url = Host.host + "/api/users/password?token=" + token;
      let map = new TSMap();
      map.set('oldPassword', this.password1);
      map.set('newPassword', this.password2);
      let message = map.toJSON();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
        console.log(response);
        let alert = this.alertCtrl.create({
          title: response.status,
          subTitle: response.message,
          buttons: ['Ok']
        });
        // add loading
        alert.present();


      })

    })


  }
}
