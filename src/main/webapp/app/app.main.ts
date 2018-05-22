import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProdConfig } from './blocks/config/prod.config';
import { Test3ElasticsocialAppModule } from './app.module';

ProdConfig();

if (module['hot']) {
    module['hot'].accept();
}

platformBrowserDynamic().bootstrapModule(Test3ElasticsocialAppModule)
.then((success) => console.log(`Application started`))
.catch((err) => console.error(err));
