import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NomineesPage } from './nominees';

@NgModule({
  declarations: [
    NomineesPage,
  ],
  imports: [
    IonicPageModule.forChild(NomineesPage),
  ],
})
export class NomineesPageModule {}
