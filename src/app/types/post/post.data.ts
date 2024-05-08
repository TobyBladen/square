import { range } from 'ramda';

import { NamedItem } from '../named-item';
import { PostBuilder } from './post.builder';
import { Post } from './post.type';

export const anyPosts: readonly Post[] = range(1, 101).map((n) =>
    new PostBuilder().with('id', n).build()
);

export const postKeys: readonly NamedItem<keyof Post>[] = [
    { name: 'Title', item: 'title' },
    { name: 'User Id', item: 'userId' },
    { name: 'Post Id', item: 'id' },
    { name: 'Body', item: 'body' },
];
