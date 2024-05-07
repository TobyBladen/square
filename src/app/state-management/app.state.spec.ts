import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { environment } from '../../environments/environment';
import { Post, PostBuilder } from '../types/post';
import { GetPosts } from './actions';
import { AppState } from './app.state';
import { AppStateModel } from './app.state.model';

const anyPosts: readonly Post[] = [
    new PostBuilder().with('id', 1).build(),
    new PostBuilder().with('id', 2).build(),
    new PostBuilder().with('id', 3).build(),
];

const reset = (store: Store, state: AppStateModel): void =>
    store.reset({ app: state });

describe('AppState', () => {
    let httpTestingController: HttpTestingController;
    let state: AppState;
    let store: Store;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([AppState]), HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        httpTestingController = TestBed.inject(HttpTestingController);
        state = TestBed.inject(AppState);
        spyOn(state.logger, 'error');
        store = TestBed.inject(Store);
    });

    describe('getPosts', () => {
        describe('does not get the posts', () => {
            it('if they were already loaded', () => {
                reset(store, {
                    isGettingPosts: false,
                    posts: anyPosts,
                });
            });

            it('if request is underway already', () => {
                reset(store, {
                    isGettingPosts: true,
                });
            });

            afterEach(fakeAsync(() => {
                store.dispatch(new GetPosts());

                tick();

                httpTestingController.expectNone(`${environment.api}/posts`);
                httpTestingController.verify();
            }));
        });

        describe('if posts were not loaded yet', () => {
            beforeEach(fakeAsync(() => {
                reset(store, {
                    isGettingPosts: false,
                });

                store.dispatch(new GetPosts());

                tick();
            }));

            it('records in the state that request is underway and gets the posts from API', () => {
                expect(
                    store.selectSnapshot(AppState.isGettingPosts)
                ).toBeTrue();
                const request = httpTestingController.expectOne(
                    `${environment.api}/posts`
                );
                request.flush(anyPosts);
            });

            describe('if there is an error getting the posts', () => {
                beforeEach(() => {
                    const request = httpTestingController.expectOne(
                        `${environment.api}/posts`
                    );

                    request.flush('404 Not found', {
                        status: 404,
                        statusText: 'Not Found',
                    });
                });

                it('records in the state that request is no longer underway', () => {
                    expect(
                        store.selectSnapshot(AppState.isGettingPosts)
                    ).toBeFalse();
                });

                it('logs the error', () => {
                    expect(state.logger.error).toHaveBeenCalledTimes(1);
                });
            });

            describe('if getting the posts was successful', () => {
                beforeEach(() => {
                    const request = httpTestingController.expectOne(
                        `${environment.api}/posts`
                    );

                    request.flush(anyPosts);
                });

                it('records in the state that request is no longer underway', () => {
                    expect(
                        store.selectSnapshot(AppState.isGettingPosts)
                    ).toBeFalse();
                });

                it('records the posts in the state', () => {
                    expect(store.selectSnapshot(AppState.posts)).toEqual(
                        anyPosts
                    );
                });
            });

            afterEach(() => {
                httpTestingController.verify();
            });
        });
    });

    describe('isGettingPosts', () => {
        it('returns the value of isGettingPosts', () => {
            reset(store, {
                isGettingPosts: true,
            });

            expect(store.selectSnapshot(AppState.isGettingPosts)).toBeTrue();

            reset(store, {
                isGettingPosts: false,
            });

            expect(store.selectSnapshot(AppState.isGettingPosts)).toBeFalse();
        });
    });

    describe('posts', () => {
        it('returns the value of posts', () => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
            });

            expect(store.selectSnapshot(AppState.posts)).toEqual(anyPosts);
        });
    });
});
