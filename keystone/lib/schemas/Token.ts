import {list} from '@keystone-6/core';
import {checkbox, relationship, text, timestamp} from '@keystone-6/core/fields';
import {
    canViewToken,
    hasSession,
    sessionIsAdmin,
} from '../permissions';
import { Lists } from ".keystone/types"

export const Token = list({
    access: {
        operation: {
            create: sessionIsAdmin, delete: sessionIsAdmin, update: sessionIsAdmin, query: hasSession,
        }, filter: {
            query: canViewToken
        }
    }, fields: {
        manager: checkbox({
            defaultValue: false, ui: {
                description: 'Keycloak administrator member role.', itemView: {
                    fieldMode: 'read', fieldPosition: 'sidebar'
                }
            }
        }), community: checkbox({
            defaultValue: false, ui: {
                description: 'Keycloak community member role.', itemView: {
                    fieldMode: 'read', fieldPosition: 'sidebar'
                }
            }
        }), poster: checkbox({
            defaultValue: false, ui: {
                description: 'Keycloak editor member role.', itemView: {
                    fieldMode: 'read', fieldPosition: 'sidebar'
                }
            }
        }), access: text({
            validation: {isRequired: true}, ui: {
                itemView: {
                    fieldMode: 'hidden'
                }, listView: {
                    fieldMode: 'hidden'
                }
            }
        }), refresh: text({
            validation: {isRequired: true}, ui: {
                itemView: {
                    fieldMode: 'hidden'
                }, listView: {
                    fieldMode: 'hidden'
                }
            }
        }), accessExpiry: timestamp({
            validation: {isRequired: true}
        }), expiry: timestamp({
            validation: {isRequired: true}
        }), user: relationship({
            many: false, ref: 'User.tokens', ui: {
                hideCreate: true, itemView: {
                    fieldMode: 'read'
                }
            }
        })
    }, ui: {
        hideCreate: true,
    }, db: {
        idField: {
            kind: 'string'
        }
    },
}) satisfies Lists.Token;