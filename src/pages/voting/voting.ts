import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TSMap} from "typescript-map";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Host} from "../Host";
import {Response} from "../Response";
import {Storage} from "@ionic/storage";
import {Angular5Csv} from "angular5-csv/dist/Angular5-csv";
import {DatePipe} from "@angular/common";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-voting',
  templateUrl: 'voting.html',
})
export class VotingPage {

  startDate: any;
  endDate: any;
  min: any;

  category: string;
  categories: string[];
  count: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private alertCtrl: AlertController,
              private http: HttpClient,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private datePipe: DatePipe) {


    // console.log(message);
    // let dd = today.getDate();
    // let mm = today.getMonth() + 1; //January is 0!
    // let yyyy = today.getFullYear();
    // let d: any;
    // let m: any;
    //
    // if (dd < 10) {
    //   d = '0' + dd;
    // }
    //
    // if (mm < 10) {
    //   m = '0' + mm;
    // }

    // this.mi

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
        let today = new Date();
        let message = this.datePipe.transform(today, 'yyyy-MM-dd');

        this.min = message;
        console.log(this.min);
        let b = message < this.startDate;
        console.log(b);
        this.min = b ? message : this.startDate;
        // console.log(this.min);
        console.log(this.min);
      });
    this.http.get<Response>(dateUrl + "/end").pipe().toPromise()
      .then(response => {
        console.log(response);
        this.endDate = (response.message);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VotingPage');
  }

  addCategory() {
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


  deleteCategory(c: string) {

    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete this category?',
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
        }
      ]
    });

    alert.present();
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
        if (response.status == "Failed") {
          let alert = this.alertCtrl.create({
            title: response['status'],
            subTitle: response['message'],
            buttons: ['Ok']
          });
          // add loading
          alert.present();
          return;
        }
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


  private getToken() {
    return this.storage.get("paragala-token");
  }

  codes: string[] = [];

  generate() {
    if (this.count == null) {
      let alert = this.alertCtrl.create({
        title: 'Please specify the number of voter codes you want to generate',
        buttons: ['Ok']
      });
      // add loading
      alert.present();
      return;
    }

    let url = Host.host + "/api/voters/voter-code/" + this.count;
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      console.log(response);
      if (response.status == "Success") {
        console.log(response.message);
        this.codes = response.message;
        new Angular5Csv(this.codes, 'voter-codes');
      } else {
        let alert = this.alertCtrl.create({
          title: 'A problem was encountered while generating the codes',
          subTitle: response.message,
          buttons: ['Ok']
        });
        // add loading
        alert.present();
        return;
      }
    })


  }

  getExisting() {
    let url = Host.host + "/api/voters/voter-code/all";
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      console.log(response);
      if (response.status == "Success") {
        console.log(response.message);
        let codes = response.message;
        new Angular5Csv(codes, 'voter-codes');
      } else {
        let alert = this.alertCtrl.create({
          title: 'A problem was encountered while generating the codes',
          subTitle: response.message,
          buttons: ['Ok']
        });
        // add loading
        alert.present();
        return;
      }
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

}
