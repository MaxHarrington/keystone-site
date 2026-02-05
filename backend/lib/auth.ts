import slugify from 'slugify';
import type {Context} from '.keystone/types';
import {User} from '@prisma/client';

export const keycloakSessionStrategy = {
    get: async function ({context}: { context: Context }): Promise<User | null> {
        if (!context.req || !context.res) return null;
        if (context.req.headers.authorization === 'anonymous') return null;
        const id = context.req?.headers['x-auth-request-user'];
        if (typeof id != 'string') return null;
        const user = await context.sudo().db.User.findOne({
            where: {
                id
            }
        });
        if (!user) return null;
        return user;
    },

    start: async function ({context}: { context: Context }): Promise<User | null> {
        if (!context.req || !context.res) return null;
        const id = context.req?.headers['x-auth-request-user'];
        const name = context.req?.headers['x-auth-request-preferred-username'];
        const groups = context.req.headers['x-auth-request-groups'];
        if (typeof id != 'string' || typeof name != 'string' || typeof groups != 'string') return null;
        const split = groups.split(',')
        const admin = split.includes('role:admin');
        const poster = split.includes('role:poster');
        const community = split.includes('role:community');
        const user = await context.sudo().db.User.findOne({
            where: {
                id,
            }
        });
        if (!user) {
            await context.sudo().prisma.user.create({
                data: {
                    id,
                    name,
                    admin,
                    poster,
                    community,
                }
            });
        } else if (admin != user.admin || poster != user.poster || community != user.community) {
            context.sudo().db.User.updateOne({
                where: {
                    id
                },
                data: {
                    admin,
                    community,
                    poster
                }
            });
        }
        if (poster) {
            const posterObject = await context.sudo().db.Poster.findOne({
                where: {
                    id
                }
            });
            if (!posterObject) {
                await context.sudo().prisma.poster.create({
                    data: {
                        id
                    }
                });
            }
        }
        return user;
    },

    end: async function ({context}: { context: Context }): Promise<void> {
        if (!context.req || !context.res) return;
        context.res.setHeader('location', '/oauth2/sign-out');
        context.res.statusCode = 302;
    },
};