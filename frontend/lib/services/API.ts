import {headers} from "next/headers";
import {logger} from "@logger";
import {keystone} from "@constants";

export const gql = ([content]: TemplateStringsArray) => content;

export async function API({query, variables}: {
    query: string, variables?: Record<string, any>
}) {
    const headersList = await headers();
    const authorization = headersList.get('X-Auth-Request-Access-Token');
    const URL = `${keystone}/api/graphql`;
    if (!authorization) return;
    return fetch(URL, {
        method: 'POST', body: JSON.stringify({query, variables}), headers: {
            'Authorization': `Bearer ${authorization}`, 'Content-Type': 'application/json'
        }
    })
        .then(async (payload) => {
            if (payload.status >= 200 && payload.status < 300) {
                return payload.json();
            } else {
                logger
                    .child({
                        'type': 'GraphQL Query error', 'status': payload.status, variables
                    })
                    .error(payload.statusText);
                return payload.statusText;
            }
        })
        .catch((err) => {
            logger.error(err);
            return err.code;
        });
}

export type Comment = {
    id: string,
    content: string,
    post: Post,
    flaggedBy?: User[],
    likedBy?: User[],
    replyTo?: Comment,
    isLiked?: boolean,
    user: User,
    postedAt?: Date,
    editedAt?: Date,
    hidden?: boolean
}

export type Post = {
    id: string,
    title: string,
    slug: string,
    path: string,
    subtitle: string,
    description: string,
    privacy: string,
    type: string,
    allowComments: boolean,
    comments: Comment[],
    postedAt: string,
    updatedAt?: string,
    content: {
        document: any
    },
    poster: Poster,
    isLiked: boolean,
    tags?: Tag[],
};

export type Tag = {
    id: string, title: string, slug: string, path: string, posts: Post[],
};

export type Image = {
    id: string,
    image: {
        id: string,
        filesize: number,
        width: number,
        height: number,
        extension: string,
        url: string
    },
    altText: string,
    caption?: string,
    uploader: User,
    uploadedAt: string
};

export type Poster = {
    id: string,
    name: string,
    slug?: string,
    path?: string,
    oneLiner?: string,
    website?: string,
    patreon?: string,
    xTwitter?: string,
    instagram?: string,
    avatar?: {
        id?: string,
        url?: string,
        width?: number,
        height?: number
    }
    posts?: Post[],
};

export type User = {
    id?: string,
    name?: string,
    email?: string,
    updates?: string,
    tokensCount?: number,
};

export type Token = {
    id?: string,
    accessExpiry?: string,
    expiry?: string,
    manager?: boolean,
    poster?: boolean,
    community?: boolean,
    access?: string,
    refresh?: string,
    user?: User,
};

export type Site = {
    active: boolean,
    title?: string,
    tagline?: string,
    description?: string,
    keywords?: string,
}