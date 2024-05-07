import { Post } from '../types/post';

export type AppStateModel = Partial<
    Readonly<{
        posts: readonly Post[];
    }>
>;
