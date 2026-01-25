import {getContext} from "@keystone-6/core/context";
import {resetDatabase} from "@keystone-6/core/testing";
import {expect, jest, test} from "@jest/globals";
import {ModuleMocker} from "jest-mock";
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
const mockJWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI3MzI4MjQ3NDAsImlhdCI6MTczMjgyNDQ0MCwiYXV0aF90aW1lIjoxNzMyODI0MzQ2LCJqdGkiOiI1ODA2ZGJkYS1jNDk3LTQ3ZTktYWJiZi00NzhiZGVmYWM5NGEiLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDozMzAwL3JlYWxtcy9sam4tZGV2ZWxvcG1lbnQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYWY5MjM0MmMtNDAxYi00MmE1LTk3OWItZWM4MjgyNzcyODIyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWFuYWdlci1jbGllbnQiLCJzaWQiOiIyNWMzNTEzMC1iZGFkLTRkZDYtODIyMS03MDQ2YmI2MmY5NDAiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjMxMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm1hbmFnZXIiLCJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtbGpuLWRldmVsb3BtZW50IiwidW1hX2F1dGhvcml6YXRpb24iLCJjb21tdW5pdHkiLCJwb3N0ZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBsamV1bmVzc2Uub3JnIn0.D8RkRpE-7ZNozeuFWSEt_gXV4nj-n2b7rpFuPKZcgck`;
const key = `secret`

test("Authenticate existing user and poster", async () => {
    const admin = await context.sudo().prisma.user.create({
        data: {
            id: "some-user-id-here"
        }
    });
    const adminPoster = await context.sudo().prisma.poster.create({
        data: {
            id: "another-fake-id",
            name: "Poster"
        }
    });
    logger.child({admin, adminPoster}).info("User and poster created...");
});

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