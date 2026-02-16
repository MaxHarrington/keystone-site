import Post from "@/lib/components/Post"
import Posts, {type Post as PostType} from "@/services/Posts"

export default async function Homepage() {
    const {posts} = await Posts.initialize();
    return <>
        <main>
            <div className="flex flex-col mt-4 lg:mt-12 gap-y-6 mb-6">
                <div className={`grid lg:w-[73vw] xl:w-[64vw] lg:ml-[34%]`}>
                    {posts?.map((post: PostType) => {
                        return <Post
                            key={post.slug}
                            post={post}/>
                    })}
                </div>
            </div>
        </main>
    </>;
};