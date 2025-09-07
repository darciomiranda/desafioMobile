import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { IonicModule } from '@ionic/angular';   // se for Angular

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// 🔴 força sempre modo claro
document.body.classList.remove('dark');