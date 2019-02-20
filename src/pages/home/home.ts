import {Component, ViewChild} from '@angular/core';
import {Nav, NavController} from 'ionic-angular';
import {ResultsPage} from "../results/results";
import {NomineesPage} from "../nominees/nominees";
import {VotersPage} from "../voters/voters";
import {AdminPage} from "../admin/admin";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController) {
    this.pages = [
      { title: 'Admin', component: AdminPage },
      { title: 'Results', component: ResultsPage },
      { title: 'Nominees', component: NomineesPage }
    ];
  }


  openPage(page) {
    // navigate to the new page if it is not the current page
    this.navCtrl.push(page.component);
  }

}
