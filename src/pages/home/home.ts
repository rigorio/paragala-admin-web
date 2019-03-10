import {Component, ViewChild} from '@angular/core';
import {AlertController, Nav, NavController} from 'ionic-angular';
import {ResultsPage} from "../results/results";
import {NomineesPage} from "../nominees/nominees";
import {VotersPage} from "../voters/voters";
import {AdminPage} from "../admin/admin";
import {VotingPage} from "../voting/voting";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pages: Array<{ title: string, component: any }>;

  constructor(public navCtrl: NavController,
              private storage: Storage,
              private alertCtrl: AlertController) {
    this.pages = [
      {title: 'Admin', component: AdminPage},
      {title: 'Voting', component: VotingPage},
      {title: 'Nominees', component: NomineesPage},
      {title: 'Results', component: ResultsPage}
    ];
  }


  openPage(page) {
    // navigate to the new page if it is not the current page
    this.navCtrl.push(page.component);
  }

  hey() {
    console.log("heyyy");
  }

  admin() {
    this.navCtrl.push(AdminPage);
  }

  voting() {
    this.navCtrl.push(VotingPage);
  }

  nominees() {
    this.navCtrl.push(NomineesPage);
  }

  results() {
    this.navCtrl.push(ResultsPage);
  }

  logout() {
    console.log("what");
    let alert = this.alertCtrl.create({
      title: 'Confirm Logout',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.storage.remove("paragala-token");
            this.navCtrl.setRoot(LoginPage)
          }
        }
      ]
    });

    alert.present();

  }

}
