import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotersPage } from './voters';

@NgModule({
  declarations: [
    VotersPage,
  ],
  imports: [
    IonicPageModule.forChild(VotersPage),
  ],
})
export class VotersPageModule {}
