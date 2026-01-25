import {list} from "@keystone-6/core";
import {allowAll} from "@keystone-6/core/access";
import {canUpdateImage, sessionIsAdmin, sessionIsPoster} from "../permissions";
import {image, relationship, text, timestamp} from "@keystone-6/core/fields";
import { Lists } from ".keystone/types"

export const Image = list({
    access: {
        operation: {
            query: allowAll, create: sessionIsPoster, update: sessionIsPoster, delete: sessionIsAdmin,
        }, item: {
            update: canUpdateImage
        }
    }, fields: {
        image: image({
            storage: 'local_images'
        }), altText: text({
            validation: {
                isRequired: true
            }, ui: {
                description: 'Required description for screen readers/text-to-speech'
            }
        }), caption: text({
            ui: {
                description: 'Optional description displayed below image'
            }
        }), uploader: relationship({
            access: {
                read: sessionIsAdmin
            }, ref: 'Poster.images', ui: {
                itemView: {
                    fieldPosition: 'sidebar', fieldMode: 'read'
                }, createView: {
                    fieldMode: 'hidden'
                }
            }, hooks: {
                afterOperation: async (input) => {
                    if (input.operation == 'create' && input.context.session?.id) {
                        await input.context.sudo().db.Post.updateOne({
                            where: {
                                id: input.item.id
                            }, data: {poster: {connect: {id: input.context.session.userId}}}
                        });
                    }
                }
            }
        }), uploadedAt: timestamp({
            defaultValue: {kind: 'now'}, ui: {
                itemView: {
                    fieldMode: 'hidden'
                }, createView: {
                    fieldMode: 'hidden'
                }
            },
        })
    }
}) satisfies Lists.Image;