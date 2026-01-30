import 'dotenv/config';

import {config, graphql} from '@keystone-6/core';
import type {Context, TypeInfo} from '.keystone/types';
import {keycloakSessionStrategy as session} from "./lib/auth";
import {frontend, keystone, login} from "./lib/constants";
import {sessionIsPoster} from "./lib/permissions";
import {logger} from "./lib/logger";
import {lists} from './lib/schema';

export default config<TypeInfo>({
    db: {
        provider: 'postgresql', url: String(process.env.DATABASE_URL), prismaClientPath: './node_modules/.prisma/client'
    }, lists, ui: {
        isAccessAllowed: async (context) => {
            return sessionIsPoster({
                session: await session.get({context})
                    ?? await session.start({context})
                    ?? undefined
            });
        }, pageMiddleware: async ({wasAccessAllowed, context}) => {
            // const url = new URL(`${keystone}${context.req?.url}`);
            // const hadCode = url.searchParams.has('code')
            //     || url.searchParams.has('session_state')
            //     || url.searchParams.has('iss');
            // if (hadCode) {
            //     url.searchParams.delete('code');
            //     url.searchParams.delete('session_state');
            //     url.searchParams.delete('iss');
            // }
            // if (!wasAccessAllowed) {
            //     logger.child({
            //         wasAccessAllowed, hadCode, session: context.session
            //     }).warn('Access denied');
            //     if (context.session) {
            //         return {
            //             kind: 'redirect', to: frontend
            //         };
            //     } else return {
            //         kind: 'redirect', to: `${login}${keystone}${url.pathname}`
            //     };
            // } else if (hadCode) return {
            //     kind: 'redirect', to: `${url.pathname}${url.search}`
            // }
        },
    }, session, storage: {
        local_images: {
            kind: 'local', type: 'image', generateUrl: path => `${keystone}/images${path}`, serverRoute: {
                path: '/images',
            }, storagePath: 'public/images',
        }
    }
})