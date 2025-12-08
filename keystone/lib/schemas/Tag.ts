import {list} from '@keystone-6/core';
import {allowAll} from '@keystone-6/core/access';
import {image, relationship, text} from '@keystone-6/core/fields';
import {
    sessionIsAdmin,
    sessionIsPoster
} from '../permissions';
import slugify from 'slugify';
import {slugifyOptions} from "../schema";
import { Lists } from ".keystone/types"

export const Tag = list({
    access: {
        operation: {
            query: allowAll, create: sessionIsAdmin, update: sessionIsPoster, delete: sessionIsAdmin,
        }
    }, fields: {
        title: text({
            isIndexed: true, validation: {
                isRequired: true
            }, hooks: {
                beforeOperation(input) {
                    if (input.operation == 'create') {
                        input.resolvedData.slug = slugify(String(input.inputData.title), slugifyOptions);
                        input.resolvedData.path = `/content/tags/${input.resolvedData.slug}`;
                    }
                },
            }
        }), subtitle: text({
            validation: {isRequired: true}
        }), keywords: text({
            validation: {
                isRequired: true,
                match: {
                    regex: RegExp('[^a-zA-Z\\d\\s:]')
                }
            }
        }), slug: text({
            isIndexed: true, ui: {
                itemView: {
                    fieldPosition: 'sidebar', fieldMode: 'read'
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
        }), image: image({
            storage: 'local_images'
        }), description: text({
            validation: {isRequired: true}
        }), posts: relationship({
            ref: 'Post.tags', many: true, ui: {
                itemView: {
                    fieldPosition: 'sidebar'
                }, createView: {
                    fieldMode: 'hidden'
                }
            }
        }),
    }
}) satisfies Lists.Tag;