import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AppState } from '../../state-management';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe],
    selector: 'sq-heading',
    standalone: true,
    templateUrl: './heading.component.html',
})
export class HeadingComponent {
    protected readonly isGettingPosts$?: Observable<boolean>;

    protected readonly selectedPostId$?: Observable<number | undefined>;

    constructor(store: Store) {
        this.isGettingPosts$ = store.select(AppState.isGettingPosts);
        this.selectedPostId$ = store.select(AppState.selectedPostId);
    }
}
