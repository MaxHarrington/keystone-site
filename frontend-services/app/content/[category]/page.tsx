import {notFound} from "next/navigation";
import type {Post as PostType, Tag as TagType, Poster as PosterType} from "@/services/API";
import Post from "@/components/Post";
import Poster from "@/components/Poster";
import Posters from "@/services/Posters";
import Posts from "@/services/Posts";
import Tags from "@/services/Tags";
import Tag from "@/components/Tag";
import {LoadMoreButton} from "@/components/interface/Buttons";
import Sites from "@/services/Sites";

export async function generateMetadata({params}:{params: {category: string}}): Promise<{title: string} | undefined> {
    const {category}: {category: string} = await params;
    const {title} = await Sites.initialize();
    if (category === 'posts') {
        return {
            title: `${title} - All posts`
        };
    } else if (category === 'posters') {
        return {
            title: `${title} - All posters`
        };
    } else if (category === 'tags') {
        return {
            title: `${title} - All tags`
        };
    }
}

export default async function ContentList({params, searchParams}:
    {params: {category: string}, searchParams: {t: string}}) {
    const {category}: {category: string} = await params;
    const {t}: {t: string} = await searchParams;
    let take: number = Number(t);
    if (typeof take === 'undefined' || isNaN(take)) take = 12;
    if (category === 'posts') {
        const {posts} = await Posts.initialize({take});
        const {total} = await Posts.initialize({take: 20000});
        return <main>
            <div className="flex flex-col gap-y-8 md:gap-y-9 lg:gap-y-10 mt-10 mb-8">
                {posts?.map((post: PostType) => {
                    return <Post
                        key={post.slug}
                        post={post}/>
                })}
                <LoadMoreButton
                    take={take >= total ? total : take}
                    total={total}
                    category={'posts'}/>
            </div>
        </main>;
    } else if (category === 'posters') {
        const {posters, total} = await Posters.initialize({take});
        return <main>
            <div className="flex flex-row mt-10 mb-8">
                {posters?.map((poster: PosterType) => {
                    return <Poster
                        key={poster.slug}
                        poster={poster}/>
                })}
            </div>
            <LoadMoreButton
                take={take >= total ? total : take}
                total={total}
                category={'posters'}/>
        </main>;
    } else if (category === 'tags') {
        const {tags, total} = await Tags.initialize({take});
        return <main>
            <div className="flex flex-row mt-10 mb-8">
                {tags?.map((tag: TagType) => {
                    return <Tag
                        key={tag.slug}
                        tag={tag}/>
                })}
            </div>
            <LoadMoreButton
                take={take >= total ? total : take}
                total={total}
                category={'tags'}/>
        </main>;
    } else notFound();
};