import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab0Page } from './tab0.page';

import { Tab0PageRoutingModule } from './tab0-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab0PageRoutingModule,
  ],
  declarations: [Tab0Page]
})
export class Tab0PageModule {
  
}
