import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Response} from "../Response";
import {TSMap} from "typescript-map";

/**
 * Generated class for the VotersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-voters',
  templateUrl: 'voters.html',
})
export class VotersPage {
  school: any;
  schools: string[];
  students: Array<{ id: number, school: string, uniqueId: string, voterCode: string, eligible: boolean }> = [];
  uniqueId: any;
  host = "http://localhost:8080"

  constructor(public navCtrl: NavController,
              private storage: Storage,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private http: HttpClient) {

    this.getToken().then(token => {
      let url = this.host + "/api/voters?token=" + token;
      this.http.get<Response>(url).pipe().toPromise().then(response => {
        console.log(response.status);
        this.students = response.message;
      });
      let schoolUrl = this.host + "/api/data/schools";
      this.http.get<Response>(schoolUrl).pipe().toPromise().then(response => {
        console.log(response.status);
        this.schools = response.message;
      })
    });





  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VotersPage');
  }

  addStudent() {
    this.getToken().then(token => {

      let tsMap = new TSMap();
      tsMap.set("school", this.school);
      tsMap.set("uniqueId", this.uniqueId);
      tsMap.set("voterCode", "");
      tsMap.set("eligible", true);
      let message = tsMap.toJSON();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      let url = this.host + "/api/voters?token=" + token;
      this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
        console.log(response.status);
      }).then(_ => {
        let url = this.host + "/api/voters?token=" + token;
        this.http.get<Response>(url).pipe().toPromise().then(response => {
          console.log(response.status);
          this.students = response.message;
        })
      })
    });
  }

  delete(id: number) {
    this.getToken().then(token => {
      let url = this.host + "/api/voters/" + id + "?token=" + token;
      this.http.delete<Response>(url).pipe().toPromise().then(response => {
        console.log(response.status);
      }).then(_ => {
        let url = this.host + "/api/voters?token=" + token;
        this.http.get<Response>(url).pipe().toPromise().then(response => {
          console.log(response.status);
          this.students = response.message;
        })
      })
    });
  }


  private getToken() {
    return this.storage.get("paragala-token");
  }
}
