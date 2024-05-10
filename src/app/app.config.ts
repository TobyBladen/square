import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../environments/environment';
import { AppState } from './state-management';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            NgxsModule.forRoot([AppState], {
                developmentMode: !environment.production,
            }),
            NgxsReduxDevtoolsPluginModule.forRoot()
        ),
        provideHttpClient(),
        provideAnimationsAsync(),
    ],
};
