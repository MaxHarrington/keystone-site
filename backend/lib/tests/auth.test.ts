import {getContext} from "@keystone-6/core/context";
import {resetDatabase} from "@keystone-6/core/testing";
import {expect, jest, test} from "@jest/globals";
import * as PrismaModule from "prisma/prisma-client";
import baseConfig from "../../keystone";
import {logger} from "../logger"
import path from "path";

const prismaSchemaPath = path.join(__dirname, "schema.prisma");
const config = {...baseConfig, db: {...baseConfig.db, url: `${process.env.DATABASE_URL}/jstest`}};

beforeEach(async () => {
    await resetDatabase(`${process.env.DATABASE_URL}/jstest`, prismaSchemaPath);
});

const context = getContext(config, PrismaModule);

test("Authenticate existing user and poster", async () => {
    const admin = await context.sudo().prisma.user.create({
        data: {
            id: "some-user-id-here",
            email: "admin@test.com",
            name: "admin",
        }
    });
    const poster = await context.sudo().prisma.user.create({
        data: {
            id: "another-fake-id",
            email: "poster@test.com",
            name: "poster"
        }
    });
    const subscriber = await context.sudo().prisma.user.create({
        data: {
            id: "third-fake-id",
            email: "subscriber@test.com",
            name: "subscriber"
        }
    })
    logger.child({admin, poster, subscriber}).info("Users created...");
    test("Create user and poster from mock token", async () => {
        const adminToken = await context.sudo().prisma.token.create({
            data: {
                id: "some-token-id-here",
                access: "access-mock",
                refresh: "refresh-mock",
                expiry: new Date("2030-01-01T00:00:01.00Z"),
                accessExpiry: new Date("2030-01-01T00:00:01.00Z"),
            }
        });
        logger.child({adminToken}).info("Token created...");
    });
});