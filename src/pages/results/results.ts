import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from '@angular/common/http';
import {Response} from "../Response";
import {Storage} from "@ionic/storage";
import {Host} from "../Host";
import {Angular5Csv} from "angular5-csv/dist/Angular5-csv";


@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
  }

  category: any;
  categories: string[];
  results: Array<{ title: string, company: string, tally: any, category: string }> = [];

  map = new Map();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private http: HttpClient) {

    this.categories = [];


    let cateUrl = Host.host + "/api/data/categories";
    this.http.get<Response>(cateUrl).pipe().toPromise().then(response => {
      console.log(response.status);
      this.categories = response.message
      this.categories.push("All");
    });

    // this.getToken().then(token => {
    //   let url = Host.host + "/api/results/tally?token=" + token;
    //   this.http.get<Response>(url).pipe().toPromise().then(response => {
    //     console.log(response.status);
    //     this.results = response.message;
    //   })
    // });

    let url = Host.host + "/api/results/v2/tally";
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      console.log(response.status);
      this.results = response.message;
    });

    console.log("categories " + this.categories);

  }

  download() {
    new Angular5Csv(this.results, "kwan");
  }

  getToken() {
    return this.storage.get("paragala-token")
  }

  changeCategory(category: string) {
    this.category = category;
    if (category === "All") {
      this.getToken().then(token => {
        let url = Host.host + "/api/results/v2/tally?token=" + token;
        this.http.get<Response>(url).pipe().toPromise().then(response => {
          console.log(response.status);
          this.results = response.message;
        })
      });
      return;
    }
    console.log(category);

    this.getToken().then(token => {
      let url = Host.host + "/api/results/v2/tally?token=" + token;
      this.http.get<Response>(url).pipe().toPromise().then(response => {
        console.log(response.status);
        this.results = response.message;
        console.log("kore");
        console.log(this.results);
        this.results = this.results.filter(result => result.category === category);
      });
    });
  }

  viewWinners() {
    let url = Host.host + "/api/results/winners";
    this.http.get<Response>(url).pipe().toPromise().then(response => {
      console.log(response);
      this.results = response.message;
    })
  }
}
