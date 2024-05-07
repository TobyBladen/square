import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';

import { environment } from '../../environments/environment';
import { Logger } from '../classes/logger';
import { Post } from '../types/post';
import { GetPosts } from './actions';
import { AppStateModel } from './app.state.model';

@State<AppStateModel>({
    name: 'app',
    defaults: {
        isGettingPosts: false,
    },
})
@Injectable()
export class AppState {
    readonly logger = new Logger('AppState');

    constructor(private readonly httpClient: HttpClient) {}

    @Action(GetPosts)
    getPosts(context: StateContext<AppStateModel>): void {
        if (this.shouldSkipGettingPosts(context)) {
            return;
        }

        context.patchState({
            isGettingPosts: true,
        });

        const next = (posts: readonly Post[]): void => {
            context.patchState({
                isGettingPosts: false,
                posts,
            });
        };

        const error = (error: any): void => {
            context.patchState({
                isGettingPosts: false,
            });
            this.logger.error(error);
        };

        this.httpClient
            .get<readonly Post[]>(`${environment.api}/posts`)
            .subscribe({
                next,
                error,
            });
    }

    @Selector()
    static isGettingPosts(state: AppStateModel): boolean {
        return state.isGettingPosts;
    }

    @Selector()
    static posts(state: AppStateModel): readonly Post[] | undefined {
        return state.posts;
    }

    private shouldSkipGettingPosts(
        context: StateContext<AppStateModel>
    ): boolean {
        const state = context.getState();

        if (state.posts?.length) {
            this.logger.debug('Skipping getting posts - already loaded');
            return true;
        }

        if (state.isGettingPosts) {
            this.logger.debug(
                'Skipping getting posts - already request already underway'
            );
            return true;
        }

        return false;
    }
}
