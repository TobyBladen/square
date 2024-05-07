import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PostComponent } from './components/post';
import { AppState } from './state-management';
import { GetPosts } from './state-management/actions';
import { Post } from './types/post';

@Component({
    selector: 'sq-app',
    standalone: true,
    imports: [AsyncPipe, PostComponent, RouterOutlet],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    readonly posts$: Observable<readonly Post[] | undefined>;

    constructor(private readonly store: Store) {
        this.posts$ = store.select(AppState.posts);
    }

    ngOnInit(): void {
        this.store.dispatch(new GetPosts());
    }
}
