import {list} from '@keystone-6/core';
import {allowAll} from '@keystone-6/core/access';
import {image, relationship, text} from '@keystone-6/core/fields';
import {
    canUpdatePoster,
    sessionIsAdmin,
    sessionIsPoster
} from '../permissions';
import slugify from 'slugify';
import {slugifyOptions} from "../schema";
import { Lists } from ".keystone/types";

export const Poster = list({
    access: {
        operation: {
            query: allowAll, create: sessionIsPoster, update: sessionIsPoster, delete: sessionIsAdmin
        }, item: {
            update: canUpdatePoster
        }
    }, fields: {
        name: text({
            isIndexed: "unique", validation: {
                isRequired: true
            }, hooks: {
                beforeOperation(input) {
                    if (input.operation == 'create') {
                        input.resolvedData.slug = slugify(String(input.inputData.name), slugifyOptions);
                        input.resolvedData.path = `/content/posters/${input.resolvedData.slug}`;
                    }
                },
            }
        }), slug: text({
            isIndexed: true, ui: {
                description: 'Unique identifier set by authentication provider', itemView: {
                    fieldMode: 'read'
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
        }), oneLiner: text({
            ui: {
                description: 'One liner for posters to appear in their page listing', itemView: {
                    fieldMode: 'edit'
                }, createView: {
                    fieldMode: 'hidden'
                }
            }
        }), avatar: image({
            storage: 'local_images',
        }), posts: relationship({
            ref: 'Post.poster', many: true, ui: {
                itemView: {
                    fieldMode: 'hidden'
                }
            }
        }), images: relationship({
            ref: 'Image.uploader', many: true, ui: {
                itemView: {
                    fieldMode: 'hidden'
                }
            }
        }), website: text({
            ui: {
                itemView: {
                    fieldPosition: 'sidebar'
                }
            }
        }), patreon: text({
            ui: {
                itemView: {
                    fieldPosition: 'sidebar'
                }
            }
        }), xTwitter: text({
            label: 'X (The Everything App)', ui: {
                itemView: {
                    fieldPosition: 'sidebar'
                }
            }
        }), instagram: text({
            ui: {
                itemView: {
                    fieldPosition: 'sidebar'
                }
            }
        })
    }, db: {
        idField: {
            kind: 'string'
        }
    }
}) satisfies Lists.Poster;