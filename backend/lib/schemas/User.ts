import {list} from '@keystone-6/core';
import {relationship, select, text} from '@keystone-6/core/fields';
import {
    canViewUser,
    hasSession,
    sessionIsAdmin
} from '../permissions';
import { Lists } from ".keystone/types"

export const User = list({
    access: {
        operation: {
            create: sessionIsAdmin, delete: sessionIsAdmin, update: hasSession, query: hasSession,
        },
        filter: {
            query: canViewUser,
            update: canViewUser
        }
    }, fields: {
        name: text({
            isIndexed: true, ui: {
                itemView: {
                    fieldMode: 'read',
                    fieldPosition: 'sidebar'
                }
            }, validation: {
                isRequired: true
            }
        }), updates: select({
            options: [{
                label: 'Unsubscribed; only system emails.', value: 'unsubscribed'
            }, {
                label: 'Periodically; emails on a semi-occasional basis.', value: 'periodically'
            }, {
                label: 'Everything; send me all new content.', value: 'all'
            }], defaultValue: 'periodically', validation: {
                isRequired: true
            }, ui: {
                displayMode: 'radio'
            }, isFilterable: true
        }), liked: relationship({
            ref: 'Post.likes', many: true, ui: {
                hideCreate: true, itemView: {
                    fieldMode: 'read'
                }
            }
        }), comments: relationship({
            ref: 'Comment.user',
            many: true, ui: {
                hideCreate: true, itemView: {
                    fieldMode: 'read'
                }
            }
        }), likedComments: relationship({
            ref: 'Comment.likedBy',
            many: true
        }), flags: relationship({
            ref: 'Comment.flaggedBy',
            many: true, ui: {
                hideCreate: true, itemView: {
                    fieldMode: 'read'
                }
            }
        })
    }, ui: {
        hideCreate: true
    }, db: {
        idField: {
            kind: 'string'
        }
    },
}) satisfies Lists.User;