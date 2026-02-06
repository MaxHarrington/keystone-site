import {API, gql, Site as SiteType} from "@/services/API";

export type Site = SiteType;

export default class Sites {
    active: boolean;
    title?: string;
    tagline?: string;
    description?: string;
    keywords?: string;

    constructor({active, title, tagline, description, keywords}: Site) {
        this.active = active;
        this.title = title;
        this.tagline = tagline;
        this.description = description;
        this.keywords = keywords;
    };

    static async initialize(): Promise<Site> {
        const query = gql`query Metadata {
          metadata {
            id
            title
            tagline
            description
            keywords
          }
        }
        `;
        const res = await API({query});
        console.log(res)
        if (res?.data?.metadata == null) return new Sites({active: false});
        const {data: {metadata: {title, tagline, description, keywords}}} = res;
        return new Sites({active: true, title, tagline, description, keywords});
    };
};