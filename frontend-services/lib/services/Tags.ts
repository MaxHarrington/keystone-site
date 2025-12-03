import {API, gql, Tag as TagType} from "@/services/API";
import {logger} from "@logger";

export type Tag = TagType;

export default class Tags {
    tags?: Record<string, any>;
    tag?: Record<string, any>;
    total: number;

    constructor({total, tag, tags}: {
        total: number, tag?: Record<string, any>, tags?: Record<string, any>,
    }) {
        this.tag = tag;
        this.tags = tags;
        this.total = total;
    };

    static async initialize({take, skip, id, slug, path}: {
        skip?: number, take?: number, id?: string, path?: string, slug?: string
    } = {skip: 0, take: 12}): Promise<Tags> {
        const query = gql`
          query Tags($id: ID, $slug: String, $path: String, $take: Int, $skip: Int) {
            tags (take: $take, skip: $skip, where: {
              id: { equals: $id },
              slug: { equals: $slug },
              path: { equals: $path }
            }) {
              id title slug path image { id extension filesize url height width } description
              posts { 
                id title slug path type privacy subtitle description 
                poster { id name slug path avatar { id url width height } }
                tags { id title slug path image { id extension filesize url height width } description }
              }
            }
          }
        `;
        const variables = {skip, take, id, slug, path};
        const {data}: { data: { tags: [Tags] } } = await API({query, variables});
        try {
            if (id || slug || path) {
                const tag = data.tags.at(0);
                return new Tags({total: tag ? 1 : 0, tag});
            } else return new Tags({total: data.tags.length, tags: data.tags});
        } catch (error) {
            logger.error(error);
            return new Tags({total: 0});
        }
    };
};