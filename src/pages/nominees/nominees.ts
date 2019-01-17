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
  host = "http://localhost:8080";
  tokenContainer: string[] = [];

  map = new Map();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private storage: Storage,
              private http: HttpClient) {
    this.nominees = [];
    this.categories = [];

    this.storage.get("paragala-token").then(token => {
      console.log(token);
      this.tokenContainer.push(token);
    }).catch(yabai => {
    });
    this.map.set("token", this.tokenContainer[0]);

    this.getCategories().subscribe((categories: Response) => {
      this.categories = categories['message'];
    });
    this.updateNominees();

  }

  createNominee() {
    this.addNominees().subscribe((response: Response) => {
      console.log(response);
    });
    this.updateNominees();
  }

  private addNominees() {
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

    let url = this.host + "/api/data/nominees?token=" + this.map.get("token");
    return this.http.post<Response>(url, message, httpOptions);
  }

  delete(id: any) {
    this.deleteNominees(id).subscribe((response: Response) => {
      console.log(response);
    });

    this.nominees = [];

    this.updateNominees();
    // this.nominees = this.nominees.filter(n => n.title !== title && n.category !== category);
  }

  private deleteNominees(id: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let url = this.host + "/api/data/nominees/" + id + "?token=" + this.map.get("token");
    return this.http.delete<Response>(url, httpOptions);
  }

  private getNominees() {
    let url = this.host + "/api/data/nominees?token=" + this.map.get("token");
    return this.http.get<Response>(url);
  }

  private getCategories() {
    // let host = "https://murmuring-earth-96219.herokuapp.com/api/data/categories";
    let url = this.host + "/api/data/categories?token=" + this.map.get("token");
    return this.http.get<Response>(url);
  }

  private updateNominees() {
    this.getNominees().subscribe((response: Response) => {
      this.nominees = response['message'];
    })
  }

}
