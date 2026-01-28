import {NextRequest, NextResponse} from 'next/server';
import {frontend, keystone, login} from "@constants";
import {cookies} from "next/headers";

// TODO: REPLACE WITH OAUTH2 PROXY

// All imports must be from only the supported 'edge' libraries, so we rewrite several things here.
// Beginning an auth session will always start here, as it will grab and pass along the URL to our backend.

export async function middleware(request: NextRequest) {
    const cookieJar = await cookies();
    const identity = cookieJar.get('Identity')?.value;
    if (identity) await refreshSession();
    const url = new URL(request.url);
    const protectedPaths = ['/account'];
    let response: NextResponse;
    const hasCode = (url.searchParams.has('code')
        && url.searchParams.has('iss')
        && url.searchParams.has('session_state'));
    if (hasCode) {
        const token = await startSession(request,
            `${frontend}${url.pathname === '/' ? '' : url.pathname}`);
        response = NextResponse.redirect(`${frontend}${url.pathname}`);
        if (token?.id && token?.expiry) response.cookies.set({
            name: 'Identity',
            value: token.id,
            path: '/',
            expires: new Date(token.expiry),
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: 'strict'
        });
    } else if (protectedPaths.includes(url.pathname)) {
        const session = await getSession();
        response = !session
            ? NextResponse.redirect(`${login}${frontend}${url.pathname}`)
            : response = NextResponse.next();
    } else response = NextResponse.next();
    return response;
}

export default async function getSession(): Promise<Token | undefined> {
    const cookieJar = await cookies();
    const identity = cookieJar.get('Identity')?.value;
    const URL = `${keystone}/api/graphql`;
    const result = await fetch(URL, {
        method: 'POST', body: JSON.stringify({
            query: gql`query GetSession {
                getSession {
                    id
                    user {
                        id
                        name
                        email
                        updates
                        tokensCount
                    }
                    expiry
                    community
                    manager
                    poster
                }
            }`
        }), headers: {
            'Authorization': identity ?? 'anonymous', 'Content-Type': 'application/json'
        }
    })
    .then(payload => {
        if (payload.status >= 200 && payload.status < 300) {
            return payload.json();
        } else {
            console.error(payload.statusText);
            return payload.statusText;
        }
    })
    .catch((err) => {
        console.error(err.code)
        return err.code;
    });
    return result?.data.getSession;
}

export async function refreshSession(): Promise<Token | null>  {
    const cookieJar = await cookies();
    const identity = cookieJar.get('Identity')?.value;
    const API_URL = `${keystone}/api/graphql`;
    const result = await fetch(API_URL, {
        method: 'POST', body: JSON.stringify({
            query: gql`mutation StartSession {
                startSession {
                    id
                    user {
                        id
                        name
                        email
                        updates
                        tokensCount
                    }
                    expiry
                    community
                    manager
                    poster
                }
            }`,
        }), headers: {
            'Authorization': identity ?? 'anonymous', 'Content-Type': 'application/json'
        }
    })
    .then(payload => {
        if (payload.status >= 200 && payload.status < 300) {
            return payload.json();
        } else {
            console.error(payload.statusText);
            return null;
        }
    })
    .catch((err) => {
        console.error(err);
        return null;
    });
    return result?.data?.startSession;
}

export async function startSession(request: NextRequest, redirect: string): Promise<Token | null> {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('session_state');
    const iss = request.nextUrl.searchParams.get('iss');
    if (!code || !state || !iss) return null;
    const API_URL = `${keystone}/api/graphql?code=${code}&session_state=${state}&iss=${iss}`;
    const result = await fetch(API_URL, {
        method: 'POST', body: JSON.stringify({
            query: gql`mutation StartSession {
              startSession {
                id
                user {
                  id
                  name
                  email
                  updates
                  tokensCount
                }
                expiry
                community
                manager
                poster  
              }
            }`,
        }), headers: {
            'Redirect': redirect, 'Session-State': state, 'Content-Type': 'application/json'
        }
    })
        .then(payload => {
            if (payload.status >= 200 && payload.status < 300) {
                return payload.json();
            } else {
                console.error(payload.statusText);
                return null;
            }
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
    return result?.data?.startSession;
}

const gql = ([content]: TemplateStringsArray) => content;

type User = {
    id: string, name: string, email: string, updates: string, tokensCount: number,
};

type Token = {
    id: string,
    accessExpiry: string,
    expiry: string,
    manager: boolean,
    poster: boolean,
    community: boolean,
    access: string,
    refresh: string,
    user: User,
};

export const config = {
    matcher: [/*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
            missing: [{type: 'header', key: 'next-router-prefetch'}, {
                type: 'header', key: 'purpose', value: 'prefetch'
            },],
        },

        {
            source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
            has: [{type: 'header', key: 'next-router-prefetch'}, {type: 'header', key: 'purpose', value: 'prefetch'},],
        },

        {
            source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
            has: [{type: 'header', key: 'x-present'}],
            missing: [{type: 'header', key: 'x-missing', value: 'prefetch'}],
        },],
}