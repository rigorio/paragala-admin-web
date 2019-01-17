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

  private host = "http://localhost:8080";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private http: HttpClient) {

    this.categories = [];
    this.schools = [];

    this.getToken().then(token => {
      let url = this.host + "/api/data/categories?token=" + token;
      this.http.get<Response>(url).pipe().toPromise()
        .then(response => {
          this.categories = response.message;
        });
    });

    this.getToken().then(token => {
      let url = this.host + "/api/data/schools?token=" + token;
      this.http.get<Response>(url).pipe().toPromise()
        .then(response => {
          this.categories = response.message;
        });
    });


  }

  private getToken() {
    return this.storage.get("paragala-token");
  }

  /**
   * TODO add prompt upon success
   */
  createAdmin() {
    this.newAdmin().subscribe((response: Response) => {
      console.log(response);
    })
  }

  private newAdmin() {
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

    let url = this.host + "/api/users?token=" + this.map.get("token");
    return this.http.post<Response>(url, message, httpOptions);
  }

  // TODO delete categories and schools


  addCategory(keyCode: number) {
    if (keyCode == 13) {
      this.getToken().then(token => {
        let tsMap = new TSMap();
        let message = tsMap.toJSON();
        tsMap.set("category", this.category);

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

        let url = this.host + "/api/data/category?token=" + token;
        this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then();

        this.getToken().then(token => {
          let url = this.host + "/api/data/categories?token=" + token;
          this.http.get<Response>(url).pipe().toPromise()
            .then(response => {
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
        let message = tsMap.toJSON();
        tsMap.set("school", this.school);

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

        let url = this.host + "/api/data/schools?token=" + token;
        this.http.post<Response>(url, message, httpOptions).pipe().toPromise().then(response => {
          console.log(response);
        });
        this.getToken().then(token => {
          let url = this.host + "/api/data/schools?token=" + token;
          this.http.get<Response>(url).pipe().toPromise()
            .then(response => {
              this.categories = response.message;
            });
        });
      });
    }
  }


  deleteCategory(c: string) {

    this.getToken().then(token => {
      let url = this.host + "api/data/categories/" + c + "?token=" + token;
      this.http.delete<Response>(url).pipe().toPromise().then(response => {
        console.log(response);
      });
      this.getToken().then(token => {
        let url = this.host + "/api/data/categories?token=" + token;
        this.http.get<Response>(url).pipe().toPromise()
          .then(response => {
            this.categories = response.message;
          });
      });
    });
  }

  deleteSchool(s: string) {
    this.getToken().then(token => {
      let url = this.host + "api/data/schools/" + s + "?token=" + token;
      this.http.delete<Response>(url).pipe().toPromise().then(response => console.log(response.message));
    });

    this.getToken().then(token => {
      let url = this.host + "/api/data/schools?token=" + token;
      this.http.get<Response>(url).pipe().toPromise()
        .then(response => {
          this.categories = response.message;
        });
    });
  }

  logout() {
    this.storage.remove("paragala-token");
    this.navCtrl.setRoot(LoginPage)
  }
}
