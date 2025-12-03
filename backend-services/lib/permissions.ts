import type {Image, Post, Poster, Token, Comment} from "@prisma/client";

export function hasSession({session}: { session?: Token }) {
    return Boolean(session?.id);
}

export function sessionIsCommunity({session}: { session?: Token }) {
    return Boolean(session?.community);
}

export function sessionIsPoster({session}: { session?: Token }) {
    return Boolean(session?.poster);
}

export function sessionIsAdmin({session}: { session?: Token }) {
    return Boolean(session?.manager);
}

export function canViewToken({session}: { session?: Token }) {
    if (sessionIsAdmin({session})) {
        return true;
    } else if (session?.id) {
        return {
            id: { equals: session.id }
        };
    } else return false;
}

export function canViewUser({session}: { session?: Token }) {
    if (sessionIsAdmin({session})) {
        return true;
    } else if (session?.id) {
        return {
            id: { equals: session.userId }
        };
    } else return false;
}

export function canViewPost({session}: { session?: Token }) {
    if (sessionIsPoster({session})) {
        return true;
    } else if (sessionIsCommunity({session})) {
        return {
            OR: [
                { privacy: { equals: 'Community' }},
                { privacy: { equals: 'Users' }},
                { privacy: { equals: 'Public' }}
            ]
        };
    } else if (hasSession({session})) {
        return {
            OR: [
                { privacy: { equals: 'Users' }},
                { privacy: { equals: 'Public' }}
            ]
        };
    } else {
        return { privacy: { equals: 'Public' } };
    }
}

export function canViewComment({session}: { session?: Token }) {
    if (sessionIsPoster({session})) {
        return true;
    } else if (sessionIsCommunity({session})) {
        return {
            OR: [
                { post: { privacy: { equals: 'Community' }}},
                { post: { privacy: { equals: 'Users' }}},
                { post: { privacy: { equals: 'Public' }}}
            ]
        };
    } else if (hasSession({session})) {
        return {
            OR: [
                { post: { privacy: { equals: 'Users' }}},
                { post: { privacy: { equals: 'Public' }}}
            ]
        };
    } else {
        return {
            post: { privacy: { equals: 'Public' } }
        };
    }
}

export function canUpdatePost({session, item}: { session?: Token, item: Post }) {
    if (!session) return false;
    return (item.posterId === session.id || sessionIsAdmin({session}));
}

export function canUpdateComment({session, item}: { session?: Token, item: Comment }) {
    if (!session) return false;
    return (item.userId === session.id || sessionIsAdmin({session}));
}

export function canUpdatePoster({session, item}: { session?: Token, item: Poster }) {
    if (!session) return false;
    return (item.id === session.id || sessionIsAdmin({session}));
}

export function canUpdateImage({session, item}: { session?: Token, item: Image }) {
    if (!session) return false;
    return (item.uploaderId === session.id || sessionIsAdmin({session}));
}