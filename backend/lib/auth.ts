import slugify from 'slugify';
import type {Context} from '.keystone/types';
import {User} from '@prisma/client';
import {keycloak, keystone} from "./constants";
import {logger} from './logger';
import {parse, serialize} from "cookie";

export const keycloakSessionStrategy = {
    get: async function ({context}: { context: Context }): Promise<User | null> {
        if (!context.req || !context.res) return null;
        if (context.req.headers.authorization === 'anonymous') return null;
        const userId = context.req?.headers['x-auth-request-user'];
        if (typeof userId != 'string') return null;
        console.log(userId)
        const user = await context.sudo().db.User.findOne({
            where: {
                id: userId,
            }
        });
        if (!user) return null;
        return user;
    },

    start: async function ({context}: { context: Context }): Promise<User | null> {
        if (!context.req || !context.res) return null;
        const id = context.req?.headers['x-auth-request-user'];
        const name = context.req?.headers['x-auth-request-preferred-username'];
        if (typeof id != 'string' || typeof name != 'string') return null;
        const user = await context.db.User.findOne({
            where: {
                id,
            }
        });
        if (!user) {
            await context.sudo().prisma.user.create({
                data: {
                    id,
                    name
                }
            })
        }
        return user;
    },

    end: async function ({context}: { context: Context }): Promise<void> {
        if (!context.req || !context.res) return;
        if (context.req.headers.authorization === 'anonymous') return;

    },
};