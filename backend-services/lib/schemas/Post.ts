import {graphql, list} from "@keystone-6/core";
import {allowAll} from "@keystone-6/core/access";
import {canUpdatePost, canViewPost, sessionIsAdmin, sessionIsPoster} from "../permissions";
import {checkbox, relationship, select, text, timestamp, virtual} from "@keystone-6/core/fields";
import slugify from "slugify";
import {document} from "@keystone-6/fields-document";
import {slugifyOptions} from "../schema";
import { Lists } from ".keystone/types";

export const Post = list({
    access: {
        operation: {
            query: allowAll, create: sessionIsPoster, update: sessionIsPoster, delete: sessionIsAdmin,
        }, filter: {
            query: canViewPost,
        }, item: {
            update: canUpdatePost
        }
    }, hooks: {
        afterOperation: async (input) => {
            if (input.operation === 'create' && input.context.session) {
                await input.context.sudo().db.Post.updateOne({
                    where: {
                        id: input.item.id
                    }, data: {poster: {connect: {id: input.context.session.userId}}}
                });
            } else if (input.operation === 'update') {
                input.resolvedData.updatedAt = new Date();
            }
        }
    }, fields: {
        title: text({
            isIndexed: true, validation: {
                isRequired: true
            }, hooks: {
                beforeOperation: async (input) => {
                    if (input.operation === 'create') {
                        input.resolvedData.slug = slugify(String(input.inputData.title), slugifyOptions);
                        input.resolvedData.path = `/content/posts/${input.resolvedData.slug}`
                    }
                },
            }
        }), slug: text({
            isIndexed: true, ui: {
                itemView: {
                    fieldMode: 'read', fieldPosition: 'sidebar'
                }, createView: {
                    fieldMode: 'hidden'
                }
            }
        }), path: text({
            isIndexed: true, ui: {
                itemView: {
                    fieldMode: 'read', fieldPosition: 'sidebar'
                }, createView: {
                    fieldMode: 'hidden'
                }
            }
        }), subtitle: text({
            validation: {isRequired: true}
        }), description: text({
            validation: {isRequired: true}
        }), content: document({
            relationships: {
                post: {
                    listKey: 'Post', label: 'Mention post', selection: 'id title subtitle type slug'
                }, posters: {
                    listKey: 'User', label: 'Mention poster', selection: 'id name slug'
                }, image: {
                    listKey: 'Image', label: 'Embed image', selection: 'id altText caption image'
                }
            }, formatting: {
                inlineMarks: {
                    bold: true,
                    italic: true,
                    underline: true,
                    strikethrough: true,
                    code: true,
                    superscript: true,
                    subscript: true,
                    keyboard: true,
                }, listTypes: {
                    ordered: true, unordered: true,
                }, alignment: {
                    center: true, end: true,
                }, headingLevels: [1, 2, 3, 4, 5, 6], blockTypes: {
                    blockquote: true, code: true
                }, softBreaks: true
            }, layouts: [[2, 1], [1, 2], [1, 1], [1, 1, 1]]
        }), poster: relationship({
            ref: 'Poster.posts', ui: {
                createView: {
                    fieldMode: 'hidden'
                }, itemView: {
                    fieldPosition: 'sidebar', // fieldMode: 'hidden'
                }
            }
        }), likes: relationship({
            ref: 'User.liked', many: true, ui: {
                itemView: {
                    fieldMode: 'hidden'
                }, createView: {
                    fieldMode: 'hidden'
                }
            }
        }), isLiked: virtual({
            field: graphql.field({
                type: graphql.Boolean,
                async resolve(source, {}, context) {
                    if (!context.session?.userId) return false;
                    const postList = await context.db.Post.findMany({
                        where: {
                            id: {equals: source.id}, likes: {
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
        }), comments: relationship({
            many: true,
            ref: 'Comment.post'
        }), allowComments: checkbox({
            defaultValue: false
        }), tags: relationship({
            ref: 'Tag.posts', many: true, ui: {
                itemView: {
                    fieldPosition: 'sidebar'
                }
            }
        }), privacy: select({
            options: [{label: 'Posters only', value: 'Posters'}, {
                label: 'Community users only', value: 'Community'
            }, {label: 'Logged in users only', value: 'Users'}, {label: 'Public to all', value: 'Public'}],
            defaultValue: 'Public',
            validation: {
                isRequired: true
            },
            ui: {
                description: 'Sets the privacy level. Cannot be changed after creating.',
                displayMode: 'radio',
                itemView: {
                    fieldMode: 'hidden'
                }
            },
            hooks: {
                validate: {
                    // This is because we use the type to send out emails and
                    // post forum threads, things we cannot undo from here easily.
                    update: (input) => {
                        const privacy = input.inputData?.privacy;
                        if (privacy) {
                            input.addValidationError('You cannot update this field after creation');
                        }
                    }
                }
            }
        }), type: select({
            options: [{
                label: 'Article; full-length writing', value: 'Article'
            }, {
                label: 'Update; informational and about the site', value: 'Update'
            }, {
                label: 'Note; very short, loose thought', value: 'Note'
            }, {
                label: 'System; site functionality/patches, comments disabled', value: 'System'
            },],
            defaultValue: 'users',
            validation: {
                isRequired: true
            },
            ui: {
                description: `Sets the level of visibility for promotion and suggested posts.
                    Cannot be changed after creating.`,
                displayMode: 'radio',
                itemView: {
                    fieldMode: 'hidden'
                }
            },
            hooks: {
                validate: {
                    // This is because we use the type to send out emails and
                    // post forum threads, things we cannot undo from here easily.
                    update: (input) => {
                        const type = input.inputData?.type;
                        if (type) input.addValidationError('You cannot update this field after creation');
                    }
                }
            }
        }), postedAt: timestamp({
            defaultValue: {kind: 'now'}, ui: {
                itemView: {
                    fieldMode: 'hidden'
                }, createView: {
                    fieldMode: 'edit'
                }
            },
        }), updatedAt: timestamp({
            ui: {
                itemView: {
                    fieldMode: 'hidden'
                }, createView: {
                    fieldMode: 'hidden'
                }
            },
        })
    },
}) satisfies Lists.Post