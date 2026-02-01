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
            return sessionIsPoster({ session: context.session });
        }, pageMiddleware: async ({wasAccessAllowed, context}) => {

        },
    }, session, storage: {
        local_images: {
            kind: 'local', type: 'image', generateUrl: path => `${keystone}/images${path}`, serverRoute: {
                path: '/images',
            }, storagePath: 'public/images',
        }
    }
})