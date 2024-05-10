import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgxsModule, Store } from '@ngxs/store';

import { Template } from '../../classes/template';
import { AppState } from '../../state-management';
import { reset } from '../../state-management/functions';
import { anyPosts } from '../../types/post';
import { HeadingComponent } from './heading.component';

describe('HeadingComponent', () => {
    let component: HeadingComponent;
    let store: Store;
    let template: Template<HeadingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HeadingComponent,
                HttpClientTestingModule,
                NgxsModule.forRoot([AppState]),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        const fixture = TestBed.createComponent(HeadingComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        template = new Template(fixture);
        fixture.detectChanges();
    });

    it('creates', () => {
        expect(component).toBeTruthy();
    });

    describe('template', () => {
        const headingSelector = '[data-testid="heading"]';

        it('shows text "Select a post" if posts were got but there is no selected post', () => {
            template.detectChanges();

            expect(template.getTextContent(By.css(headingSelector))).toEqual(
                'Select a post'
            );
        });

        it('shows the selected post id if posts were got and there is a selected post', () => {
            reset(store, {
                isGettingPosts: false,
                posts: anyPosts,
                selectedPostId: 1,
            });

            template.detectChanges();

            expect(template.getTextContent(By.css(headingSelector))).toEqual(
                'Selected post id: 1'
            );
        });
    });
});
