import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Response} from "../Response"
import {Storage} from "@ionic/storage";
import {TSMap} from "typescript-map";
import {Host} from "../Host";
import {LoginPage} from "../login/login";


@Component({
  selector: 'page-nominees',
  templateUrl: 'nominees.html',
})
export class NomineesPage {

  ionViewDidLoad() {
    console.log('ionViewDidLoad NomineesPage');
  }

  category: any;
  categories: string[];
  title: any;
  company: any;
  nominees: Array<{ id: number, title: string, company: string, category: string }>;
  // host = "https://murmuring-earth-96219.herokuapp.com";
  file: any;

  map = new Map();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private storage: Storage,
              private http: HttpClient,
              private loadingController: LoadingController) {
    this.nominees = [];
    this.categories = [];


    // let host = "https://murmuring-earth-96219.herokuapp.com/api/data/categories";
    let cateUrl = Host.host + "/api/data/categories";
    this.http.get<Response>(cateUrl).pipe().toPromise().then(response => {
      this.categories = response.message;
    });

    let nomineeUrl = Host.host + "/api/data/nominees";
    this.http.get<Response>(nomineeUrl).pipe().toPromise().then(response => {
      this.nominees = response.message;
    });


  }

  createNominee() {
    this.getToken().then(token => {
      let nominee: Array<{ title: string, company: string, category: string }> = [];
      nominee.push({
        title: this.title,
        company: this.company,
        category: this.category
      });

      let message = JSON.stringify(nominee);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      let url = Host.host + "/api/data/nominees?token=" + token;
      this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
        console.log("create nominee");
        console.log(response);
        if (response.status == "Failed") {
          let alert = this.alertCtrl.create({
            title: response['status'],
            subTitle: response['message'],
            buttons: ['Ok']
          });
          // add loading
          alert.present();
        } else {
          console.log("eh?");
          this.nominees = response.message;
        }
      });
    });


  }


  selectFile(event) {
    console.log(event);
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (this.file == null) {
      let alert = this.alertCtrl.create({
        title: "Please select a csv",
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    let loading = this.loadingController.create({content: "Please wait..."});
    loading.present();

    this.getToken().then(token => {
      let url = Host.host + "/api/data/nominees/upload?token=" + token;
      let formData = new FormData();
      formData.append('file', this.file);
      this.http.post<Response>(url, formData).pipe().toPromise().then(response => {
        loading.dismissAll();
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
          this.nominees = response['message'];
      });
    });

  }

  delete(id: any) {
    console.log("what");
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete this nominee?',
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


            this.getToken().then(token => {
              let url = Host.host + "/api/data/nominees/" + id + "?token=" + token;
              this.http.delete<Response>(url).pipe().toPromise().then(response => {
                console.log(response.status + ":::" + response.message);
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
                let url = Host.host + "/api/data/nominees";
                this.http.get<Response>(url).pipe().toPromise().then(response => {
                  console.log(response.status);
                  this.nominees = response.message;
                });
              });
            });

          }
        }
      ]
    });

    alert.present();
  }

  private getToken() {
    return this.storage.get("paragala-token");
  }

  setDefaultNominees() {
    this.getToken().then(token => {
      this.http.get<Response>(Host.host + "/api/data/defaults/nominees?token=" + token)
        .pipe().toPromise().then(response => {
        if (response.status == "Failed") {
          let alert = this.alertCtrl.create({
            title: response['status'],
            subTitle: response['message'],
            buttons: ['Ok']
          });
          // add loading
          alert.present();
        } else
          this.nominees = response.message;
      })
    });

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

}
