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
  school: any;
  categories: string[];
  schools: string[];
  results: Array<{ title: string, company: string, tally: any, category: string }> = [];

  map = new Map();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private http: HttpClient) {

    this.categories = [];
    this.schools = [];


    let schoolUrl = Host.host + "/api/data/schools";
    this.http.get<Response>(schoolUrl).pipe().toPromise().then(response => {
      console.log(response.status);
      this.schools = response.message
      this.schools.push("All");
    });

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

    let url = Host.host + "/api/data/nominees";
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
        let url = Host.host + "/api/results/tally?token=" + token;
        this.http.get<Response>(url).pipe().toPromise().then(response => {
          console.log(response.status);
          this.results = response.message;
        })
      });
      return;
    }
    console.log(category);

    this.getToken().then(token => {
      let url = Host.host + "/api/results/tally?token=" + token;
      this.http.get<Response>(url).pipe().toPromise().then(response => {
        console.log(response.status);
        this.results = response.message;
        this.results = this.results.filter(result => result.category === category);
      });
    });
  }

  changeSchool(school) {
    if (school === "All") {
      this.getToken().then(token => {
        let url = Host.host + "/api/results/tally?token=" + token;
        this.http.get<Response>(url).pipe().toPromise().then(response => {
          console.log(response.status);
          this.results = response.message;
        })
      });
      return;
    }

    console.log(school);

    this.getToken().then(token => {
      let url = Host.host + "/api/results/school/" + school + "?token=" + token;
      this.http.get<Response>(url).pipe().toPromise().then(response => {
        console.log(response.message);
        this.results = response.message;
      })
    });

    if (this.category != "All") {
      this.results = this.results.filter(result => result.category === this.category);
    }


  }
}
