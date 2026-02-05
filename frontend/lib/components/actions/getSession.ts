"use server"

import {gql, Token} from "@/services/API";
import {cookies, headers} from "next/headers";
import {logger} from "@logger";
import {keystone} from "@constants";

export default async function getSession(): Promise<Token | undefined> {
    const headersList = await headers();
    const authorization = headersList.get('X-Auth-Request-Access-Token');
    const URL = `${keystone}/api/graphql`;
    if (!authorization) return;
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
    console.log(result);
    return;
    // return result?.data.getSession ?? result;
}