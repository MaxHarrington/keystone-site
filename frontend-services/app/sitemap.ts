import type { MetadataRoute } from "next"
import Posts from "@/services/Posts";
import Posters from "@/services/Posters";
import Tags from "@/services/Tags";
import {navigation} from "@constants";
import {
    type Post as PostType,
    type Poster as PosterType,
    type Tag as TagType
} from "@/services/API";

export default async function sitemap(): Promise<MetadataRoute.Sitemap>  {
    const sitemap: MetadataRoute.Sitemap = [];
    const {base} = navigation;
    const {posts} = await Posts.initialize({take: 5000});
    const {posters} = await Posters.initialize({take: 100});
    const {tags} = await Tags.initialize({take: 100});
    sitemap.push({
        url: base,
        changeFrequency: "daily",
        lastModified: new Date()
    });
    sitemap.push({
        url: `${base}${navigation.posts}`,
        changeFrequency: "daily",
        lastModified: new Date()
    });
    sitemap.push({
        url: `${base}${navigation.posters}`,
        changeFrequency: "daily",
        lastModified: new Date()
    });
    sitemap.push({
        url: `${base}${navigation.tags}`,
        changeFrequency: "daily",
        lastModified: new Date()
    });
    posts?.forEach((post: PostType) => {
        sitemap.push({
            url: `${base}${post.path}`,
            changeFrequency: "monthly",
            lastModified: post.updatedAt ?? post.postedAt
        });
    });
    posters?.forEach((poster: PosterType) => {
        sitemap.push({
            url: `${base}${poster.path}`,
            changeFrequency: "daily",
            lastModified: new Date()
        });
    });
    tags?.forEach((tag: TagType) => {
        sitemap.push({
            url: `${base}${tag.path}`,
            changeFrequency: "daily",
            lastModified: new Date()
        });
    });
    return sitemap;
};