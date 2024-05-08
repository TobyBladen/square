import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AppState } from '../../state-management';
import { SelectPost } from '../../state-management/actions';
import { Post } from '../../types/post';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, MatButtonModule],
    selector: 'sq-post',
    standalone: true,
    templateUrl: './post.component.html',
})
export class PostComponent implements OnChanges {
    @Input({ required: true }) post!: Post;
    protected isSelected$?: Observable<boolean> | null;

    constructor(private readonly store: Store) {}

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (
            simpleChanges['post'] &&
            simpleChanges['post'].currentValue !==
                simpleChanges['post'].previousValue
        ) {
            const post = simpleChanges['post'].currentValue as Post;

            this.isSelected$ = this.store.select(AppState.isSelected(post.id));
        }
    }

    selectPost(): void {
        if (this.store.selectSnapshot(AppState.isSelected(this.post.id))) {
            // TODO: Implement cycling through post properties
        } else {
            this.store.dispatch(new SelectPost(this.post.id));
        }
    }
}
