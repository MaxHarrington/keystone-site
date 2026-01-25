import {graphql, list} from "@keystone-6/core";
import {
    canUpdateComment,
    canViewComment,
    sessionIsAdmin,
    sessionIsCommunity,
} from "../permissions";
import {checkbox, relationship, select, text, timestamp, virtual} from "@keystone-6/core/fields";
import { Lists } from ".keystone/types";
import {allowAll} from "@keystone-6/core/access";
import sanitizeHtml from 'sanitize-html';

export const Comment = list({
    access: {
        operation: {
            query: allowAll, create: sessionIsCommunity, update: sessionIsCommunity, delete: sessionIsAdmin,
        }, filter: {
            query: canViewComment
        }, item: {
            update: canUpdateComment
        }
    }, hooks: {
        beforeOperation: ({item, inputData}) => {
            if (inputData?.content && item) {
                item.content = sanitizeHtml(inputData.content, {
                    allowedTags: [
                        'img',
                        'div',
                        'p',
                        'br',
                        'b',
                        'i',
                        'u'
                    ]
                });
            }
        },
        afterOperation: ({operation, item}) => {
            if (operation === 'update') {
                item.editedAt = new Date();
            }
        },
        validate: async ({inputData, context, addValidationError}) => {
            if (inputData?.replyTo?.connect?.id) {
                const parentComment = await context.sudo().db.Comment.findOne({
                    where: {
                        id: inputData.replyTo.connect?.id
                    }
                });
                if (parentComment?.replyToId)
                    addValidationError('Replies can only be one reply level deep.');
                if (parentComment?.hidden)
                    addValidationError('You cannot reply to a hidden comment.')
            }
            if (inputData?.post?.connect?.id) {
                const parentPost = await context.sudo().db.Post.findOne({
                    where: {
                        id: inputData?.post?.connect?.id
                    }
                });
                if (!parentPost?.allowComments)
                    addValidationError('This post does not have comments enabled.');
            }
        },
    }, fields: {
        post: relationship({
            ref: 'Post.comments'
        }), replyTo: relationship({
            ref: 'Comment'
        }), content: text({
            validation: {
                isRequired: true
            }
        }), user: relationship({
            ref: 'User.comments'
        }), flaggedBy: relationship({
            many: true,
            ref: 'User.flags'
        }), likedBy: relationship({
            many: true,
            ref: 'User.likedComments'
        }), isLiked: virtual({
            field: graphql.field({
                type: graphql.Boolean,
                async resolve(
                    source,
                    {},
                    context) {
                        if (!context.session?.userId) return false;
                        const postList = await context.db.Comment.findMany({
                            where: {
                                id: {equals: source.id}, likedBy: {
                                    some: {
                                        id: {
                                            equals: context.session?.userId
                                        }
                                    }
                                }
                            }
                        });
                        return Boolean(postList.at(0)?.id);
                }
            })
        }), postedAt: timestamp({
            defaultValue: {
                kind: 'now'
            }
        }), editedAt: timestamp({
            ui: {
                createView: {
                    fieldMode: 'hidden'
                }
            }
        }), hidden: checkbox({
            defaultValue: false
        })
    }
}) satisfies Lists.Comment;