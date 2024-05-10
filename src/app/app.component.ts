import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { HeadingComponent } from './components/heading';
import { PostComponent } from './components/post';
import { AppState } from './state-management';
import { GetPosts } from './state-management/actions';
import { Post } from './types/post';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        HeadingComponent,
        MatProgressSpinnerModule,
        PostComponent,
    ],
    selector: 'sq-app',
    standalone: true,
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    protected readonly isGettingPosts$?: Observable<boolean>;
    protected readonly posts$: Observable<readonly Post[] | undefined>;

    constructor(private readonly store: Store) {
        this.isGettingPosts$ = store.select(AppState.isGettingPosts);
        this.posts$ = store.select(AppState.posts);
    }

    ngOnInit(): void {
        this.store.dispatch(new GetPosts());
    }
}
