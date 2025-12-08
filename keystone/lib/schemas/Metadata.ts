import {list} from "@keystone-6/core";
import {allowAll} from "@keystone-6/core/access";
import {sessionIsAdmin} from "../permissions";
import {text} from "@keystone-6/core/fields";
import { Lists } from ".keystone/types"


export const Metadata = list({
    access: {
        operation: {
            query: allowAll, create: sessionIsAdmin, update: sessionIsAdmin, delete: sessionIsAdmin,
        }
    },
    graphql: {
        plural: 'Metadatums'
    },
    isSingleton: true,
    fields: {
        title: text({
            validation: {
                isRequired: true
            }
        }), tagline: text({
            validation: {
                isRequired: true
            }
        }), description: text({
            validation: {
                isRequired: true
            }
        }), keywords: text({
            validation: {
                isRequired: true,
                match: {
                    regex: RegExp('[^a-zA-Z\\d\\s:]')
                }
            }
        })
    }
}) satisfies Lists.Metadata;