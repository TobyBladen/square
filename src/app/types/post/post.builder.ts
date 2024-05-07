import { Builder } from '../../classes/builder';
import { Post } from './post.type';

export class PostBuilder extends Builder<Post> {
    constructor() {
        super();
        this.target = {
            body: 'any body',
            id: 1,
            title: 'any title',
            userId: 1,
        };
    }
}
