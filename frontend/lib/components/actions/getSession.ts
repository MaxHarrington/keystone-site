"use server"

import {gql, User} from "@/services/API";
import {headers} from "next/headers";
import {logger} from "@logger";
import {keystone} from "@constants";

export default async function getSession(): Promise<User | undefined> {
    const headersList = await headers();
    const authorization = headersList.get('X-Auth-Request-Access-Token');
    const URL = `${keystone}/api/graphql`;
    if (!authorization) return;
    const result = await fetch(URL, {
        method: 'POST', body: JSON.stringify({
            query: gql`query GetSession {
              getSession {
                id
                name
                updates
                admin
                community
                poster
              }
            }`
        }), headers: {
            'Authorization': `Bearer ${authorization}`, 'Content-Type': 'application/json'
        }
    })
        .then(payload => {
            if (payload.status >= 200 && payload.status < 300) {
                return payload.json();
            } else {
                logger.child({authorization, URL}).error(payload.statusText);
                return payload.statusText;
            }
        })
        .catch((err) => {
            logger.error(err.code)
            return err.code;
        });
    return result?.data.getSession ?? result;
}