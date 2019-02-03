import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Response} from "../Response";
import {TSMap} from "typescript-map";
import {Host} from "../Host";

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
  host = "https://murmuring-earth-96219.herokuapp.com";
  file: any;

  constructor(public navCtrl: NavController,
              private storage: Storage,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private http: HttpClient,
              private loadingController: LoadingController) {

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

  selectFile(event) {
    console.log(event);
    this.file = event.target.files[0];
  }

  uploadFile() {
    let loading = this.loadingController.create({content: "Please wait..."});
    loading.present();

    this.getToken().then(token => {
      let url = "http://localhost:8080" + "/api/voters/upload?school=" + this.school + "&token=" + token;
      let formData = new FormData();
      formData.append('file', this.file);
      this.http.post(url, formData).pipe().toPromise().then(response => {
        loading.dismissAll();
        console.log(response);
        this.students = response['message'];
      });
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
