import {API, gql, Poster as PosterType} from "@/services/API";

export type Poster = PosterType;

export default class Posters {
    posters?: Record<string, any>;
    poster?: Record<string, any>;
    total: number;

    constructor({total, poster, posters}: {
        total: number,
        poster?: Record<string, any>,
        posters?: Record<string, any>,
    }) {
        this.poster = poster;
        this.posters = posters;
        this.total = total;
    };

    static async initialize({take, skip, id, path, slug}: {
        skip?: number, take?: number, id?: string, slug?: string, path?: string
    } = {skip: 0, take: 12}) : Promise<Posters> {
        const query = gql`
          query Posters($id: ID, $slug: String, $path: String, $take: Int, $skip: Int) {
            posters (take: $take, skip: $skip, where: {
                id: { equals: $id },
                path: { equals: $path },
                slug: { equals: $slug }
              }) {
                id name slug path oneLiner website patreon xTwitter instagram
                avatar { id url width height } posts { 
                  id title slug path type privacy subtitle description isLiked
                  poster { id name slug path avatar { id url width height } }
                }
              }
            }
        `;
        const variables = {skip, take, id, slug, path};
        const {data}: { data: { posters: [Poster] } } = await API({query, variables});
        console.log(await API({query, variables}))
        if (id || slug || path) {
            const poster = data.posters.at(0);
            return new Posters({total: poster ? 1 : 0, poster});
        } else return new Posters({total: data.posters.length, posters: data.posters});
    };
};