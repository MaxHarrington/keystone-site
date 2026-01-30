import slugify from 'slugify';
import type {Context} from '.keystone/types';
import {User} from '@prisma/client';
import {keycloak, keystone} from "./constants";
import {logger} from './logger';
import {parse, serialize} from "cookie";

// TODO: REPLACE WITH OAUTH2 PROXY


export const keycloakSessionStrategy = {
    get: async function ({context}: { context: Context }): Promise<User | null> {
        if (!context.req || !context.res) return null;
        if (context.req.headers.authorization === 'anonymous') return null;
        console.log(context.req.headers);
    },

    start: async function ({context}: { context: Context }): Promise<User | null> {
        if (!context.req || !context.res) return null;

    },

    end: async function ({context}: { context: Context }): Promise<void> {
        if (!context.req || !context.res) return;
        if (context.req.headers.authorization === 'anonymous') return;

    },
};