import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
    Action,
    createSelector,
    Selector,
    State,
    StateContext,
} from '@ngxs/store';

import { environment } from '../../environments/environment';
import { Logger } from '../classes/logger';
import { Post } from '../types/post';
import { GetPosts, SelectPost } from './actions';
import { AppStateModel } from './app.state.model';

export const appStateDefaults: AppStateModel = {
    isGettingPosts: false,
};

@State<AppStateModel>({
    name: 'app',
    defaults: appStateDefaults,
})
@Injectable()
export class AppState {
    readonly logger = new Logger('AppState');
    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly httpClient: HttpClient,
        private ngZone: NgZone,
        private readonly snackBar: MatSnackBar
    ) {}

    static isSelected(postId: number): (state: AppStateModel) => boolean {
        return createSelector([AppState], (state: AppStateModel) => {
            return state.selectedPostId === postId;
        });
    }

    @Action(GetPosts)
    getPosts(context: StateContext<AppStateModel>): void {
        if (this.shouldSkipGettingPosts(context)) {
            return;
        }

        context.patchState({
            isGettingPosts: true,
        });

        const next = this.onPostsGot.bind(this, context);
        const error = this.onErrorGettingPosts.bind(this, context);

        this.httpClient
            .get<readonly Post[]>(`${environment.api}/posts`)
            .subscribe({
                next,
                error,
            });
    }

    @Action(SelectPost)
    selectPost(context: StateContext<AppStateModel>, action: SelectPost): void {
        const state = context.getState();

        if (!state.posts?.length) {
            this.logger.error('Cannot select - posts not loaded');
            return;
        }

        if (
            action.postId < 1 ||
            !state.posts.find((p) => p.id === action.postId)
        ) {
            this.logger.error(
                `Cannot select post with invalid ID "${action.postId}"`
            );
            return;
        }

        context.patchState({
            selectedPostId: action.postId,
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

    @Selector()
    static selectedPostId(state: AppStateModel): number | undefined {
        return state.selectedPostId;
    }

    private onErrorGettingPosts(
        context: StateContext<AppStateModel>,
        error: any
    ): void {
        context.patchState({
            isGettingPosts: false,
        });
        this.logger.error(error);

        this.ngZone.run(() => {
            const ref = this.snackBar.open(
                'Oops - something went wrong',
                'RETRY'
            );

            ref.onAction()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    context.dispatch(new GetPosts());
                });
        });
    }

    private onPostsGot(
        context: StateContext<AppStateModel>,
        posts: readonly Post[]
    ): void {
        context.patchState({
            isGettingPosts: false,
            posts,
        });
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
