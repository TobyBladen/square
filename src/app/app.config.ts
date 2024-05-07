import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AppState } from './state-management';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            NgxsModule.forRoot([AppState], {
                developmentMode: !environment.production,
            }),
            NgxsReduxDevtoolsPluginModule.forRoot()
        ),
        provideRouter(routes),
    ],
};
