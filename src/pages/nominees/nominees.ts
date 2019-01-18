import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Response} from "../Response"
import {Storage} from "@ionic/storage";
import {TSMap} from "typescript-map";

/**
 * Generated class for the NomineesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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
  host = "https://murmuring-earth-96219.herokuapp.com";

  map = new Map();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private storage: Storage,
              private http: HttpClient) {
    this.nominees = [];
    this.categories = [];


      // let host = "https://murmuring-earth-96219.herokuapp.com/api/data/categories";
      let cateUrl = this.host + "/api/data/categories";
      this.http.get<Response>(cateUrl).pipe().toPromise().then(response => {
        this.categories = response.message;
      });

      let nomineeUrl = this.host + "/api/data/nominees";
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

      let url = this.host + "/api/data/nominees?token=" + token;
      this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
        this.nominees = response.message;
      });
    });


  }

  delete(id: any) {
    this.getToken().then(token => {
      let url = this.host + "/api/data/nominees/" + id + "?token=" + token;
      this.http.delete<Response>(url).pipe().toPromise().then(response => {
        console.log(response.status + ":::" + response.message);
      }).then(_ => {
        let url = this.host + "/api/data/nominees";
        this.http.get<Response>(url).pipe().toPromise().then(response => {
          console.log(response.status);
          this.nominees = response.message;
        });
      });
    });
  }

  private getToken() {
    return this.storage.get("paragala-token");
  }

  setDefaultNominees() {
    this.getToken().then(token => {
      this.http.get<Response>(this.host + "/api/data/defaults/nominees?token=" + token)
        .pipe().toPromise().then(response => {
        this.nominees = response.message;
      })
    });

  }
}
