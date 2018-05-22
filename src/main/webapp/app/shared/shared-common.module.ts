import { NgModule, LOCALE_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/en';

import {
    Test3ElasticsocialSharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent
} from './';

@NgModule({
    imports: [
        Test3ElasticsocialSharedLibsModule
    ],
    declarations: [
        JhiAlertComponent,
        JhiAlertErrorComponent
    ],
    providers: [
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
    ],
    exports: [
        Test3ElasticsocialSharedLibsModule,
        JhiAlertComponent,
        JhiAlertErrorComponent
    ]
})
export class Test3ElasticsocialSharedCommonModule {
    constructor() {
        registerLocaleData(locale);
    }
}
