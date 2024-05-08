import { range } from 'ramda';

import { PostBuilder } from './post.builder';
import { Post } from './post.type';

export const anyPosts: readonly Post[] = range(1, 101).map((n) =>
    new PostBuilder().with('id', n).build()
);
