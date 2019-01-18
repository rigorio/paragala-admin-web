import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {Response} from "../Response";
import {TSMap} from "typescript-map";
import {LoginPage} from "../login/login";

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  static ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  email: any;
  password: any;
  currentAdminPassword: any;
  confirmPassword: any;
  category: string;
  categories: string[];
  schools: string[];
  school: string;
  map = new Map();
  tokenContainer: string[] = [];

  private host = "https://murmuring-earth-96219.herokuapp.com";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private http: HttpClient) {

    this.categories = [];
    this.schools = [];

    let categoryUrl = this.host + "/api/data/categories";
    this.http.get<Response>(categoryUrl).pipe().toPromise()
      .then(response => {
        this.categories = response.message;
      });

    let schoolUrl = this.host + "/api/data/schools";
    this.http.get<Response>(schoolUrl).pipe().toPromise()
      .then(response => {
        this.schools = response.message;
      });

  }

  private getToken() {
    return this.storage.get("paragala-token");
  }

  /**
   * TODO add prompt upon success
   */
  createAdmin() {
    let tsMap = new TSMap();

    tsMap.set("email", this.email);
    tsMap.set("password", this.password);
    tsMap.set("currentPassword", this.currentAdminPassword);

    let message = tsMap.toJSON();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.getToken().then(token => {
      let url = this.host + "/api/users?token=" + token;
      this.http.post<Response>(url, message, httpOptions);
    })
  }

  addCategory(keyCode: number) {
    if (keyCode == 13) {
      this.getToken().then(token => {
        let tsMap = new TSMap();
        tsMap.set("category", this.category);
        let message = tsMap.toJSON();

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

        let url = this.host + "/api/data/categories?token=" + token;
        this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
          console.log(response);
        }).then(_ => {
          let url = this.host + "/api/data/categories";
          this.http.get<Response>(url).pipe().toPromise()
            .then(response => {
              console.log("refresh " + response);
              this.categories = response.message;
            });
        });

      })

    }
  }


  addSchool(keyCode: number) {
    if (keyCode == 13) {

      this.getToken().then(token => {
        let tsMap = new TSMap();
        tsMap.set("school", this.school);
        let message = tsMap.toJSON();

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

        let url = this.host + "/api/data/schools?token=" + token;
        this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
          console.log(response);
        }).then(_ => {
          let url = this.host + "/api/data/schools";
          this.http.get<Response>(url).pipe().toPromise()
            .then(response => {
              this.schools = response.message;
            });
        })
      });
    }
  }


  deleteCategory(c: string) {

    this.getToken().then(token => {
      let url = this.host + "/api/data/categories/" + c + "?token=" + token;
      console.log(url);
      this.http.delete<Response>(url).pipe().toPromise().then(response => {
        console.log(response);
      }).then(_ => {
        let url = this.host + "/api/data/categories";
        this.http.get<Response>(url).pipe().toPromise()
          .then(response => {
            this.categories = response.message;
          });
      });
    });
  }

  deleteSchool(s: string) {
    this.getToken().then(token => {
      let url = this.host + "/api/data/schools/" + s + "?token=" + token;
      console.log(url);
      this.http.delete<Response>(url).pipe().toPromise().then(response => {
        console.log(response.message)
      }).then(_ => {
        let url = this.host + "/api/data/schools";
        this.http.get<Response>(url).pipe().toPromise()
          .then(response => {
            this.schools = response.message;
          });
      });
    });
  }

  logout() {
    this.storage.remove("paragala-token");
    this.navCtrl.setRoot(LoginPage)
  }

  setDefaults() {
    console.log("Setting default values for categories and schools...");
    this.getToken().then(token => {
      this.http.get<Response>(this.host + "/api/data/defaults/categories?token=" + token)
        .pipe().toPromise().then(response => {
        this.categories = response.message;
      }).then(_ => {
        this.http.get<Response>(this.host + "/api/data/defaults/schools?token=" + token)
          .pipe().toPromise().then(response => {
          this.schools = response.message;
        })
      })
    });
  }
}
