import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from '@angular/common/http';
import {Response} from "../Response";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
  }

  category: any;
  school: any;
  categories: string[];
  schools: string[];
  host = "http://localhost:8080";
  tokenContainer: string[] = [];
  results: Array<{ title: string, company: string, tally: any, category: string }> = [];

  map = new Map();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private http: HttpClient) {

    this.categories = [];
    this.schools = [];

    this.storage.get("paragala-token").then(token => {
      console.log(token);
      this.tokenContainer.push(token);
    }).catch(yabai => {
    });
    this.map.set("token", this.tokenContainer[0]);

    this.getToken().then(token=>{
      let url = this.host + "/api/data/schools?token=" + token;
      this.http.get<Response>(url).pipe().toPromise().then(response=>{
        this.schools = response.message
      });
    });
    this.getToken().then(token=>{
      let url = this.host + "/api/data/categories?token=" + token;
       this.http.get<Response>(url).pipe().toPromise().then(response=>{
        this.categories = response.message
      });
    });

    this.categories.push("All");
    console.log("categories " + this.categories);

  }

  getToken() {
    return this.storage.get("paragala-token")
  }

  changeCategory(category: string) {
    if (category === "All") {
      this.getToken().then(token=>{
        let url = this.host + "/api/data/categories?token=" + token;
        this.http.get<Response>(url).pipe().toPromise().then(response=>{
          this.categories = response.message
        });
      });
      return;
    }
    console.log(category);
    this.results = this.results.filter(result => result.category === category);
  }
}
