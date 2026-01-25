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
        const {data: {metadata: {title, tagline, description, keywords}}} = await API({query});
        if (!title || !tagline || !description || !keywords) return new Sites({active: false});
        return new Sites({active: true, title, tagline, description, keywords});
    };
};