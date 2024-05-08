const prefix = '[App]';

export class GetPosts {
    static readonly type = `${prefix} GetPosts`;
}

export class SelectPost {
    static readonly type = `${prefix} SelectPost`;

    constructor(readonly postId: number) {}
}
