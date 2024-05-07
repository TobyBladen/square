import { Component, Input } from '@angular/core';

import { Post } from '../../types/post';

@Component({
    selector: 'sq-post',
    standalone: true,
    templateUrl: './post.component.html',
})
export class PostComponent {
    @Input({ required: true }) post!: Post;
}
