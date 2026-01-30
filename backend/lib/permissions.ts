import type {Image, Post, Poster, User, Comment} from "@prisma/client";

export function hasSession({session}: { session?: User }) {
    return Boolean(session?.id);
}

export function sessionIsCommunity({session}: { session?: User }) {
    return Boolean(session?.community);
}

export function sessionIsPoster({session}: { session?: User }) {
    console.log(session);
    return Boolean(session?.poster);
}

export function sessionIsAdmin({session}: { session?: User }) {
    return Boolean(session?.admin);
}

export function canViewToken({session}: { session?: User }) {
    if (sessionIsAdmin({session})) {
        return true;
    } else if (session?.id) {
        return {
            id: { equals: session.id }
        };
    } else return false;
}

export function canViewUser({session}: { session?: User }) {
    if (sessionIsAdmin({session})) {
        return true;
    } else if (session?.id) {
        return {
            id: { equals: session.id }
        };
    } else return false;
}

export function canViewPost({session}: { session?: User }) {
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

export function canViewComment({session}: { session?: User }) {
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

export function canUpdatePost({session, item}: { session?: User, item: Post }) {
    if (!session) return false;
    return (item.posterId === session.id || sessionIsAdmin({session}));
}

export function canUpdateComment({session, item}: { session?: User, item: Comment }) {
    if (!session) return false;
    return (item.userId === session.id || sessionIsAdmin({session}));
}

export function canUpdatePoster({session, item}: { session?: User, item: Poster }) {
    if (!session) return false;
    return (item.id === session.id || sessionIsAdmin({session}));
}

export function canUpdateImage({session, item}: { session?: User, item: Image }) {
    if (!session) return false;
    return (item.uploaderId === session.id || sessionIsAdmin({session}));
}