import {Component, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';

import {Platform, MenuController, Nav} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from "../pages/home/home";
import {ResultsPage} from "../pages/results/results";
import {NomineesPage} from "../pages/nominees/nominees";
import {LoginPage} from "../pages/login/login";
import {Host} from "../pages/Host";
import {Response} from "../pages/Response";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any;

  // rootPage = HomePage;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    private storage: Storage,
    private http: HttpClient,
    public splashScreen: SplashScreen
  ) {
    // storage.clear();
    // storage.set('paragala-token', '28403533-b18c-4475-b297-a115916bdfda');
    storage.get("paragala-token").then(value => {
      console.log(value);
      if (value !== null) {
        let url = Host.host + "/api/users/isLoggedIn?token=" + value;
        this.http.get<Response>(url).pipe().toPromise().then(response => {
          console.log(response);
          let durur = response.message['valid'];
          console.log(durur);
          let b = durur == "true";
          console.log(b);
          if (b) {
            // console.log("ah");
            this.rootPage = HomePage;
            // console.log("hahha");
          } else {
            this.rootPage = LoginPage;
          }
        })


      } else {
        this.rootPage = LoginPage;
      }
    });

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

