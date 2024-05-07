import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { range } from 'ramda';
import { Observable } from 'rxjs';

import { AppComponent } from './app.component';
import { Template } from './classes/template/template.class';
import { AppState } from './state-management';
import { GetPosts } from './state-management/actions';
import { reset } from './state-management/functions';
import { Post, PostBuilder } from './types/post';

const anyPosts: readonly Post[] = range(1, 101).map((n) =>
    new PostBuilder().with('id', n).build()
);

describe('AppComponent', () => {
    let actions$: Observable<any>;
    let component: AppComponent;
    let store: Store;
    let template: Template<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppComponent,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState]),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        const fixture = TestBed.createComponent(AppComponent);
        actions$ = TestBed.inject(Actions);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        template = new Template(fixture);
        fixture.detectChanges();
    });

    it('creates', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('dispatches GetPosts', (done) => {
            actions$
                .pipe(ofActionDispatched(GetPosts))
                .subscribe((getPosts) => {
                    expect(getPosts).toBeTruthy();
                    done();
                });

            component.ngOnInit();
        });
    });

    describe('template', () => {
        it('shows all the posts', () => {
            reset(store, { isGettingPosts: false, posts: anyPosts });

            template.detectChanges();

            expect(template.getCount(By.css('sq-post'))).toBe(anyPosts.length);
        });
    });
});
