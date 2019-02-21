import {Component, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';

import {Platform, MenuController, Nav} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from "../pages/home/home";
import {ResultsPage} from "../pages/results/results";
import {NomineesPage} from "../pages/nominees/nominees";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = LoginPage;
  // rootPage = HomePage;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    private storage: Storage,
    public splashScreen: SplashScreen
  ) {
    storage.clear();
    // storage.set('paragala-token', 'ba4b49c8-6bef-4e61-b961-8a391ffc2fd5');

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

