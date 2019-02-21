import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {NomineesPage} from "../pages/nominees/nominees";
import {ResultsPage} from "../pages/results/results";
import {VotersPage} from "../pages/voters/voters";
import {AdminPage} from "../pages/admin/admin";
import {LoginPage} from "../pages/login/login";
import {VotingPage} from "../pages/voting/voting";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    NomineesPage,
    ResultsPage,
    VotersPage,
    AdminPage,
    VotingPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    NomineesPage,
    ResultsPage,
    VotersPage,
    AdminPage,
    VotingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
