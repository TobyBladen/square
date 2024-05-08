import { Post } from '../types/post';

export type AppStateModel = Readonly<{
    isGettingPosts: boolean;
    selectedPostId?: number;
    posts?: readonly Post[];
}>;
