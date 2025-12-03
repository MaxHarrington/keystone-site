"use server"

import {gql, Token} from "@/services/API";
import {cookies} from "next/headers";
import {logger} from "@logger";
import {keystone} from "@constants";

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
                logger.child({identity, URL}).error(payload.statusText);
                return payload.statusText;
            }
        })
        .catch((err) => {
            logger.error(err.code)
            return err.code;
        });
    return result?.data.getSession ?? result;
}