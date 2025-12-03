import {API, gql, Post as PostType, Token} from "@/services/API";
import getSession from "@/components/actions/getSession";
import {logger} from "@logger";

export type Post = PostType;

export default class Posts {
    posts?: [Post];
    post?: Post;
    total: number;
    session: Token | undefined;

    constructor({total, post, posts, session}: {
        total: number, post?: Post, posts?: [Post], session: Token | undefined,
    }) {
        this.post = post;
        this.posts = posts;
        this.total = total;
        this.session = session;
    };

    static async initialize({take, skip, id, path, posterId, posterPath, tagId, tagPath, orderBy}: {
        skip?: number,
        take?: number,
        orderBy?: {
            postedAt?: 'asc' | 'desc', updatedAt?: 'asc' | 'desc'
        },
        id?: string,
        path?: string,
        posterId?: string,
        posterPath?: string,
        tagId?: string,
        tagPath?: string,
    } = {skip: 0, take: 12}): Promise<Posts> {
        const query = gql`query Posts($skip: Int, $take: Int, $orderBy: [PostOrderByInput!]!, $where: PostWhereInput!) {
          posts(
            skip: $skip, 
            take: $take, 
            orderBy: $orderBy, 
            where: $where 
          ) {
            id
            title
            subtitle
            description
            slug
            path
            type
            privacy
            isLiked
            tags {
              id
              title
              subtitle
              path
            }
            content {
              document
            }
            poster {
              id
              name
              path
              oneLiner
              avatar { 
                id 
                url 
                width 
                height 
              }
            }
            allowComments
            comments {
                id
                content
                hidden
                postedAt
                editedAt
                replyTo {
                    id
                }
                user {
                    id
                    name
                }
                flaggedBy {
                    id
                    name
                }
                isLiked
                likedByCount
            }
            postedAt
            updatedAt
            likesCount
          }
        }
        `;
        const some = Boolean(tagId || tagPath) ? {
            id: {
                equals: tagId
            }, path: {
                equals: tagPath
            }
        } : undefined
        const variables = {
            skip, take, orderBy: orderBy ?? {postedAt: 'desc'} , where: {
                id: {
                    equals: id
                }, path: {
                    equals: path
                }, poster: {
                    id: {
                        equals: posterId
                    }, path: {
                        equals: posterPath
                    }
                }, tags: {
                    some
                }
            }
        };
        const session = await getSession();
        const result = await API({query, variables});
        if (id || path) {
            const post = result?.data?.posts.at(0);
            return new Posts({total: post ? 1 : 0, post, session});
        } else return new Posts({total: result?.data?.posts.length ?? 0, posts: result?.data?.posts, session});
    };
};