import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxsModule, Store } from '@ngxs/store';

import { environment } from '../../environments/environment';
import { anyPosts } from '../types/post';
import { GetPosts, SelectPost } from './actions';
import { AppState } from './app.state';
import { reset } from './functions';

describe('AppState', () => {
    let httpTestingController: HttpTestingController;
    let state: AppState;
    let store: Store;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([AppState]), HttpClientTestingModule],
            providers: [
                {
                    provide: MatSnackBar,
                    useFactory: (): MatSnackBar =>
                        jasmine.createSpyObj<MatSnackBar>('MatSnackBar', [
                            'open',
                        ]),
                },
            ],
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

                expect(() =>
                    httpTestingController.expectNone(`${environment.api}/posts`)
                ).not.toThrow();
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

                it('shows a snackbar message that something went wrong', () => {
                    expect(
                        TestBed.inject(MatSnackBar).open
                    ).toHaveBeenCalledOnceWith(
                        'Something went wrong. Please try again',
                        'OK',
                        {
                            duration: 5000,
                        }
                    );
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

    describe('selectPost', () => {
        describe('if posts were not loaded yet', () => {
            beforeEach(() => {
                reset(store, {
                    isGettingPosts: false,
                });

                store.dispatch(new SelectPost(1));
            });

            it('logs an error', () => {
                expect(state.logger.error).toHaveBeenCalledOnceWith(
                    'Cannot select - posts not loaded'
                );
            });

            it('does not change the selected post in the state', () => {
                expect(
                    store.selectSnapshot(AppState.isSelected(1))
                ).toBeFalse();
            });
        });

        describe('if the post ID is invalid', () => {
            beforeEach(() => {
                reset(store, {
                    isGettingPosts: false,
                    posts: anyPosts,
                });

                store.dispatch(new SelectPost(0));
            });

            it('logs an error', () => {
                expect(state.logger.error).toHaveBeenCalledOnceWith(
                    `Cannot select post with invalid ID "0"`
                );
            });

            it('does not change the selected post in the state', () => {
                expect(
                    store.selectSnapshot(AppState.isSelected(1))
                ).toBeFalse();
            });
        });

        describe('if the post does not exist', () => {
            beforeEach(() => {
                reset(store, {
                    isGettingPosts: false,
                    posts: anyPosts,
                });

                store.dispatch(new SelectPost(9999));
            });

            it('logs an error', () => {
                expect(state.logger.error).toHaveBeenCalledOnceWith(
                    `Cannot select post with invalid ID "9999"`
                );
            });

            it('does not change the selected post in the state', () => {
                expect(
                    store.selectSnapshot(AppState.isSelected(1))
                ).toBeFalse();
            });
        });

        it('records the selected post in the state', () => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
            });

            store.dispatch(new SelectPost(1));

            expect(store.selectSnapshot(AppState.isSelected(1))).toBeTrue();
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

    describe('isSelected', () => {
        describe('returns false', () => {
            it('if there is no selected post', () => {
                reset(store, {
                    isGettingPosts: false,
                });
            });

            it('if a different post is selected', () => {
                reset(store, {
                    isGettingPosts: false,
                    posts: anyPosts,
                    selectedPostId: 2,
                });
            });

            afterEach(() => {
                expect(
                    store.selectSnapshot(AppState.isSelected(1))
                ).toBeFalse();
            });
        });

        it('returns true if the post is selected', () => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
                selectedPostId: 1,
            });

            expect(store.selectSnapshot(AppState.isSelected(1))).toBeTrue();
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

    describe('selectedPostId', () => {
        it('returns the value of selectedPostId', () => {
            expect(
                store.selectSnapshot(AppState.selectedPostId)
            ).toBeUndefined();

            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
                selectedPostId: 1,
            });

            expect(store.selectSnapshot(AppState.selectedPostId)).toBe(1);
        });
    });
});
