import {notFound} from "next/navigation";
import {DocumentRenderer, DocumentRendererProps} from '@keystone-6/document-renderer';
import Posts from "@/services/Posts";
import Posters from "@/services/Posters";
import Tags from "@/services/Tags";
import {serif} from "@fonts";
import DropdownMenu from "@/components/interface/DropdownMenu";
import getSession from "@/components/actions/getSession";
import CommentEditor from "@/components/interface/CommentEditor";

const renderers: DocumentRendererProps['renderers'] = {
    block: {
        paragraph: ({children, textAlign}) => {
            return <p className={`my-6 text-[1.15rem] text-${textAlign ?? `start`}`}>{children}</p>;
        }, heading: ({level, children, textAlign}) => {
            if (level === 1) {
                return <h1 className={`my-6 text-[1.12rem] text-${textAlign ?? `start`} ${serif.className}`}>
                    {children}
                </h1>;
            } else if (level === 2) {
                return <h2 className={`my-6 text-[1.12rem] text-${textAlign ?? `start`} ${serif.className}`}>
                    {children}
                </h2>;
            } else if (level === 3) {
                return <h3 className={`my-6 text-[1.12rem] text-${textAlign ?? `start`} ${serif.className}`}>
                    {children}
                </h3>;
            } else if (level === 4) {
                return <h4 className={`my-6 text-[1.12rem] text-${textAlign ?? `start`} ${serif.className}`}>
                    {children}
                </h4>;
            } else if (level === 5) {
                return <h5 className={`my-6 text-[1.12rem] text-${textAlign ?? `start`} ${serif.className}`}>
                    {children}
                </h5>;
            } else return <h6 className={`my-6 text-[1.12rem] text-${textAlign ?? `start`} ${serif.className}`}>
                {children}
            </h6>;
        }
    }
};

export default async function ContentDisplay({params}: {params: {category: string, slug: string}}) {
    const {category, slug} = await params;
    const session = await getSession();
    if (!slug) notFound();
    if (category === 'posts') {
        const {post} = await Posts.initialize({path: `/content/posts/${slug}`});
        console.log(post?.comments);
        if (!post) notFound();
        return <main>
            <DropdownMenu session={session} />
            <div className={`lg:w-[70vw] lg:mr-0 lg:ml-auto`}>
                <div className={`flex flex-col lg:h-[24vh] mt-8 lg:mt-1 mb-5 place-content-center w-[90%] max-w-[1080px] mx-auto`}>
                    <div className={`${serif.className} text-4xl`}>{post.title}</div>
                    <div className={`${serif.className} text-2xl font-light mt-2`}>{post.subtitle}</div>
                    <div className={`text-xl font-light mt-4 md:mt-12`}>{post.description}</div>
                </div>
                <div className={`mx-auto mb-10 w-[82%] max-w-[1080px]`}>
                    <DocumentRenderer document={post.content.document} renderers={renderers}/>
                </div>
                <CommentEditor />
                {
                    post.comments.map(({id, content, user}) => {
                        return <div key={id}>
                            {content}
                            {user?.name}
                        </div>
                    })
                }
            </div>
        </main>;
    } else if (category === 'posters') {
        const {poster} = await Posters.initialize({path: `/content/posters/${slug}`});
        if (!poster) notFound();
        return <main>
            <DropdownMenu session={session} />
            <div className={`grid`}>
                <div className={`${serif.className}`}>{poster.name}</div>
                <div className={`${serif.className}`}>{poster.oneLiner}</div>
            </div>
        </main>;
    } else if (category === 'tags') {
        const {tag} = await Tags.initialize({path: `/content/tags/${slug}`});
        if (!tag) notFound();
        return <main>
            <DropdownMenu session={session} />
            ghi
        </main>;
    } else notFound();
};

export async function generateMetadata({params}: {params: {category: string, slug: string}}) {
    const {category, slug} = await params;
    if (category === 'posts') {
        const {post} = await Posts.initialize({path: `/content/posts/${slug}`});
        if (!post) notFound();
        return {
            title: `${post.title}`, description: post.description, openGraph: {
                title: `${post.title}`, description: post.description
            }
        };
    } else if (category === 'posters') {
        const {poster} = await Posters.initialize({path: `/content/posters/${slug}`});
        if (!poster) notFound();
        return {
            title: `${poster.title}`, description: poster.description, openGraph: {
                title: `${poster.title}`, description: poster.description
            }
        };
    } else if (category === 'tags') {
        const {tag} = await Tags.initialize({path: `/content/tags/${slug}`});
        if (!tag) notFound();
        return {
            title: `${tag.title}`, description: tag.description, openGraph: {
                title: `${tag.title}`, description: tag.description
            }
        };
    } else return {};
}