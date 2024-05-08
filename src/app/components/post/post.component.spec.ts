import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Template } from '../../classes/template';
import { AppState } from '../../state-management';
import { SelectPost } from '../../state-management/actions';
import { reset } from '../../state-management/functions';
import { anyPosts } from '../../types/post';
import { PostComponent } from './post.component';

@Component({
    imports: [PostComponent],
    selector: 'sq-test',
    standalone: true,
    template: '<sq-post [post]="post"/>',
})
export class TestComponent {
    post = anyPosts[0];
}

describe('PostComponent', () => {
    let actions$: Observable<any>;
    let postComponent: PostComponent;
    let store: Store;
    let testComponent: TestComponent;
    let testComponentTemplate: Template<TestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                PostComponent,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState]),
            ],
        }).compileComponents();
    });
    beforeEach(() => {
        const fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        testComponentTemplate = new Template(fixture);
        postComponent = testComponentTemplate.getChildComponent(
            PostComponent
        ) as PostComponent;
        actions$ = TestBed.inject(Actions);
        store = TestBed.inject(Store);
        fixture.detectChanges();
    });

    it('creates', () => {
        expect(postComponent).toBeTruthy();
    });

    describe('template', () => {
        const postSquareSelector = '[data-testid="post-square"]';

        it('shows the post square', () => {
            expect(
                testComponentTemplate.get(By.css(postSquareSelector))
            ).toBeTruthy();
        });

        it('selects the post when the square is clicked', (done) => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
            });

            actions$
                .pipe(ofActionDispatched(SelectPost))
                .subscribe((selectPost) => {
                    expect(selectPost.postId).toBe(anyPosts[0].id);
                    done();
                });

            testComponentTemplate.click(By.css(postSquareSelector));
        });

        it('has primary color if the post is not selected', () => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
                selectedPostId: anyPosts[4].id,
            });

            testComponentTemplate.detectChanges();

            expect(
                testComponentTemplate.get(By.css(postSquareSelector))
                    ?.attributes['ng-reflect-color']
            ).toEqual('primary');
        });

        it('has accent color if the post is selected', () => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
                selectedPostId: anyPosts[0].id,
            });

            testComponentTemplate.detectChanges();

            expect(
                testComponentTemplate.get(By.css(postSquareSelector))
                    ?.attributes['ng-reflect-color']
            ).toEqual('accent');
        });

        it('re-evaluates the color when the post changes', () => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
                selectedPostId: anyPosts[0].id,
            });

            testComponentTemplate.detectChanges();

            expect(
                testComponentTemplate.get(By.css(postSquareSelector))
                    ?.attributes['ng-reflect-color']
            ).toEqual('accent');

            testComponent.post = anyPosts[4];

            testComponentTemplate.detectChanges();

            expect(
                testComponentTemplate.get(By.css(postSquareSelector))
                    ?.attributes['ng-reflect-color']
            ).toEqual('primary');
        });
    });
});
