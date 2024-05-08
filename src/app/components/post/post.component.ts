import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TruncatePipe } from '../../pipes/truncate';
import { AppState } from '../../state-management';
import { SelectPost } from '../../state-management/actions';
import { NamedItem } from '../../types/named-item';
import { Post, postKeys } from '../../types/post';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, MatButtonModule, TruncatePipe],
    selector: 'sq-post',
    standalone: true,
    templateUrl: './post.component.html',
})
export class PostComponent implements OnChanges {
    @Input({ required: true }) post!: Post;

    protected isSelected$?: Observable<boolean> | null;

    protected activeKey: NamedItem<keyof Post> = postKeys[0];

    private readonly destroyRef = inject(DestroyRef);

    constructor(private readonly store: Store) {}

    ngOnChanges(simpleChanges: SimpleChanges): void {
        const postChange = simpleChanges['post'];

        if (
            postChange &&
            postChange.currentValue !== postChange.previousValue
        ) {
            const post = postChange.currentValue as Post;

            this.isSelected$ = this.store.select(AppState.isSelected(post.id));
            this.activeKey = postKeys[0];
            this.isSelected$
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((isSelected) => {
                    if (!isSelected) {
                        this.activeKey = postKeys[0];
                    }
                });
        }
    }

    selectPost(): void {
        this.activeKey = this.getNextActiveKey();

        if (!this.store.selectSnapshot(AppState.isSelected(this.post.id))) {
            this.store.dispatch(new SelectPost(this.post.id));
        }
    }

    private getNextActiveKey(): NamedItem<keyof Post> {
        const currentKeyIndex = postKeys.findIndex(
            (pk) => pk === this.activeKey
        );

        return currentKeyIndex === postKeys.length - 1
            ? postKeys[0]
            : postKeys[currentKeyIndex + 1];
    }
}
