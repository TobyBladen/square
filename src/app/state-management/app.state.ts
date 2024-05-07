import { Injectable } from '@angular/core';

import { Action, State, StateContext } from '@ngxs/store';

import { GetPosts } from './actions';
import { AppStateModel } from './app.state.model';

@State<AppStateModel>({
    name: 'app',
})
@Injectable()
export class AppState {
    @Action(GetPosts)
    getPosts(context: StateContext<AppStateModel>): void {
        context.patchState({
            posts: [],
        });
    }
}
