import slugify from 'slugify';
import type {Context} from '.keystone/types';
import {Token} from '@prisma/client';
import {clientID, clientSecret, keycloak, keystone, redirectURI} from "./constants";
import {createRemoteJWKSet, JWTPayload as JWTBasePayload, jwtVerify} from 'jose';
import {logger} from './logger';
import {parse, serialize} from "cookie";
import {slugifyOptions} from "./schema";

interface tokenSet {
    'access_token': string,
    'expires_in': number,
    'refresh_token': string,
    'refresh_expires_in': number,
    'token_type': string,
    'id_token': string,
    'session_state': string,
    'scope': string
}

export interface JWTPayload extends JWTBasePayload {
    realm_access?: {
        roles: string[]
    },
    preferred_username?: string
}

const JWKS =
    createRemoteJWKSet(new URL(`${keycloak}/protocol/openid-connect/certs`));

async function verifyToken({context, id}: {
    context: Context, id: string
}): Promise<JWTPayload | string | null> {
    let token = await context.sudo().db.Token.findOne({where: {id}});
    if (!token?.access || !token?.userId) return null;
    return jwtVerify(token.access, JWKS, {
        issuer: keycloak,
        subject: token.userId,
        audience: `account`,
        requiredClaims: [`realm_access`, `sub`, `preferred_username`, `email`]
    })
        .then(async ({payload}: {payload: JWTPayload}) => {
            const isManager = payload.realm_access?.roles.includes('manager');
            const isPoster = payload.realm_access?.roles.includes('poster');
            const isCommunity = payload.realm_access?.roles.includes('community');
            // Syncs roles with Keycloak token every time it's checked.
            // Checks for changes first to minimize unnecessary DB calls.
            if (isManager !== token.manager || isPoster !== token.poster || isCommunity !== token.community) {
                await context.sudo().db.Token.updateOne({
                    where: {id}, data: {
                        manager: isManager, poster: isPoster, community: isCommunity
                    }
                });
            }
            return payload;
        })
        .catch(async (error) => {
            if (error.name === 'JWTExpired') {
                if (process.env.NODE_ENV === 'development') {
                    logger.warn(error);
                }
                return error.name;
            } else {
                logger.error(error);
                return null;
            }
        });
}

async function refreshToken({context, id}: { context: Context, id: string }): Promise<Token | null> {
    const token = await context.sudo().db.Token.findOne({where: {id}});
    if (!token || !context.req || token.expiry < new Date()) return null;
    return await fetch(`${keycloak}/protocol/openid-connect/token`, {
        method: 'post', headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }, body: new URLSearchParams({
            'client_id': clientID,
            'client_secret': clientSecret,
            'grant_type': 'refresh_token',
            'refresh_token': token.refresh,
            'redirect_uri': typeof context.req.headers.redirect === 'string'
                ? context.req.headers.redirect
                : `${redirectURI}${context.req.url?.split('?')[0]}`,
        })
    })
        .then(async (response) => {
            const tokenSet = await response.json();
            if (response.status !== 200 || !context.req || !context.res) {
                logger.child({
                    status: response.status, tokenSet
                }).error(response.statusText);
                await context.sudo().db.Token.deleteOne({where: {id}});
                return null;
            }
            context.res.setHeader('Set-Cookie', serialize("Identity", tokenSet.session_state, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: tokenSet.refresh_expires_in
            }));
            const token = await context.sudo().db.Token.updateOne({
                where: {
                    id: tokenSet.session_state,
                }, data: {
                    access: tokenSet.access_token,
                    refresh: tokenSet.refresh_token,
                    expiry: new Date(tokenSet.refresh_expires_in * 1000 + new Date().getTime()),
                    accessExpiry: new Date(tokenSet.expires_in * 1000 + new Date().getTime())
                }
            });
            if (!token) return null;
            await verifyUserPosterModels({context, tokenSet});
            return token;
        }).catch(error => {
            const {type, stack} = error;
            logger.child({type, stack}).error(error.message);
            return null;
        });
}

async function createTokenFromCode({context, code, sessionState}: {
    context: Context, code: string, sessionState: string
}) {
    let token = await context.sudo().db.Token.findOne({where: {id: sessionState}});
    if (!context.req) return null;
    if (!token) {
        return await fetch(`${keycloak}/protocol/openid-connect/token`, {
            method: 'post', headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }, body: new URLSearchParams({
                'client_id': clientID,
                'client_secret': clientSecret,
                'grant_type': 'authorization_code',
                'redirect_uri': typeof context.req.headers.redirect === 'string'
                    ? context.req.headers.redirect
                    : `${redirectURI}${context.req.url?.split('?')[0]}`,
                code
            })
        }).then(async (response) => {
            const tokenSet = await response.json();
            if (response.status !== 200 || !context.res) {
                logger.child({code, status: response.status, tokenSet}).error(response.statusText);
                return null;
            }
            context.res.setHeader('Set-Cookie', serialize("Identity", tokenSet.session_state, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: tokenSet.refresh_expires_in
            }));
            if (!token) {
                token = await context.sudo().prisma.token.create({
                    data: {
                        id: tokenSet.session_state,
                        access: tokenSet.access_token,
                        refresh: tokenSet.refresh_token,
                        expiry: new Date(new Date((tokenSet.refresh_expires_in * 1000) + new Date().getTime())),
                        accessExpiry: new Date(new Date((tokenSet.expires_in * 1000) + new Date().getTime()))
                    }
                });
            } else {
                token = await context.sudo().db.Token.updateOne({
                    where: {
                        id: tokenSet.session_state
                    }, data: {
                        access: tokenSet.access_token,
                        refresh: tokenSet.refresh_token,
                        expiry: new Date(new Date((tokenSet.refresh_expires_in * 1000) + new Date().getTime())),
                        accessExpiry: new Date(new Date((tokenSet.expires_in * 1000) + new Date().getTime()))
                    }
                });
            }
            if (!token) return null;
            await verifyUserPosterModels({context, tokenSet});
            return token;
        }).catch(error => {
            const {type, stack} = error;
            logger.child({type, stack}).error(error.message);
            return null;
        });
    } else {
        return token;
    }
}

async function verifyUserPosterModels({tokenSet, context}: {
    tokenSet: tokenSet, context: Context
}) {
    const payload = await jwtVerify(tokenSet.access_token, JWKS, {
        issuer: keycloak,
        audience: `account`,
        requiredClaims: [`realm_access`, `sub`, `preferred_username`, `email`]
    }).then(({payload}) => {
        return payload;
    }).catch(async (error) => {
        logger.error(error);
        return null;
    });
    if (!payload?.sub) return false;
    const id = String(payload.sub);
    const user = await context.sudo().db.User.findOne({
        where: {id}
    });
    // @ts-ignore
    const name = String(payload.preferred_username);
    // @ts-ignore
    const email = String(payload.email);
    const slug = slugify(name, slugifyOptions);
    const token = context.sudo().db.Token.findOne({where: {id: tokenSet.session_state}});
    if (!token) {
        logger.child({tokenSet}).error('Missing stored Token model object in DB')
        return false
    }
    if (!user) {
        try {
            await context.sudo().prisma.user.create({
                data: {
                    id, name, email, tokens: {
                        connect: {
                            id: tokenSet.session_state
                        }
                    }, updates: 'unsubscribed'
                }
            });
        } catch (err) {
            logger.error(err);
            return false;
        }
    } else {
        try {
            await context.sudo().db.User.updateOne({
                where: {
                    id
                }, data: {
                    tokens: {
                        connect: {
                            id: tokenSet.session_state
                        }
                    }, email, name
                }
            });
        } catch (err) {
            logger.error(err);
            return false;
        }
    }
    // @ts-ignore
    const isPoster = payload.realm_access?.roles.includes('poster');
    if (isPoster) {
        try {
            const poster = await context.sudo().db.Poster.findOne({
                where: {
                    id
                }
            });
            if (!poster) await context.sudo().prisma.poster.create({
                data: {
                    id, name, slug, path: `/content/posters/${slug}`
                }
            });
        } catch (err) {
            logger.error(err);
            return false;
        }
    }
}

export const keycloakSessionStrategy = {
    get: async function ({context}: { context: Context }): Promise<Token | null> {
        if (!context.req || !context.res) return null;
        if (context.req.headers.authorization === 'anonymous') return null;
        const id = typeof context.req.headers?.cookie === 'string'
            ? parse(context.req.headers?.cookie)["Identity"]
            : context.req?.headers?.authorization;
        if (!id) return null;
        let token = await context.sudo().db.Token.findOne({where: {id}});
        if (!token) return null;
        const payload = await verifyToken({context, id: token.id});
        // @ts-ignore
        if (payload?.sub != token.userId) return null;
        // @ts-ignore
        return token;
    },

    start: async function ({context}: { context: Context }): Promise<Token | null> {
        if (!context.req || !context.res) return null;
        let token;
        const id = typeof context.req.headers?.cookie === 'string'
            ? parse(context.req.headers?.cookie)["Identity"]
            : context.req?.headers?.authorization;
        if (id) {
            let payload = await verifyToken({context, id});
            if (payload === 'JWTExpired') {
                token = await refreshToken({context, id});
                if (token) return token;
            }
        }
        const searchParams = new URL(`${keystone}${context.req?.url}`).searchParams;
        const code = searchParams.get('code');
        const sessionState = searchParams.get('session_state');
        const iss = searchParams.get('iss');
        if (!code || !sessionState || !iss) return null;
        if (iss !== keycloak) {
            logger.child({
                code, sessionState, iss
            }).error('Possible attack - rejected OAuth 2.0 Issuer type');
            return null;
        }
        token = await createTokenFromCode({context, code, sessionState});
        if (!token || token?.expiry < new Date()) {
            if (token?.id) await context.sudo().db.Token.deleteOne({where: {id: token.id}});
            return null;
        } else if (!token?.id) return null;
        const payload = await verifyToken({context, id: token.id});
        if (!payload?.sub) return null;
        return token;
    },

    end: async function ({context}: { context: Context }): Promise<void> {
        if (!context.req || !context.res) return;
        if (context.req.headers.authorization === 'anonymous') return;
        const id = typeof context.req.headers?.cookie === 'string'
            ? parse(context.req.headers?.cookie)["Identity"]
            : context.req?.headers?.authorization;
        const token = await context.sudo().db.Token.findOne({where: {id}});
        if (!token?.id) return;
        if (token) await context.sudo().db.Token.deleteOne({where: {id: token.id}});
        context.res.setHeader('Set-Cookie', serialize("Identity", 'anonymous', {
            httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: -1
        }));
    },
};