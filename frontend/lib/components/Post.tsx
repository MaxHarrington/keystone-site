import {ClipboardButton, CommentButton, LikeButton} from "@/components/interface/Buttons";
import getSession from "@/components/actions/getSession";
import {UserIcon} from '@heroicons/react/24/solid';
import {PostMetadata} from "./interface/PageMetadata";
import Link from 'next/link';
import Image from "next/image";
import {serif} from "@fonts";
import {Post as PostType} from "@/services/API";
import {frontend} from "@constants";
import {Tag} from "@/services/Tags";

export default async function Post({post}: { post: PostType }) {
    const session = await getSession();
    return <>
        <div key={post.slug} className={`min-w-[350px] max-w-[960px] px-2 py-3 border lg:rounded-xl 
        hover:border-red-700 hover:delay-100 hover:duration-100 hover:transition-all hover:ease-in-out 
        border-transparent hover:cursor-pointer hover:bg-red-600 hover:shadow-inner`}>
            <div key={post.slug} className='flex flex-row w-[98%]'>
                <div className='my-auto ml-1 lg:mr-auto lg:ml-3 lg:mx-auto flex flex-col gap-2'>
                    { post.poster?.id
                        ? <Link
                            className={`order-first hover:cursor rounded-full mx-auto shadow-inner 
                            border-2 border-gray-200 bg-red-50 w-fit h-fit`}
                            href={post.poster.path ?? '/'}>
                            { post.poster?.avatar?.url
                                ? <Image
                                    src={post.poster.avatar?.url}
                                    alt={`${post.poster.name}'s profile image`}
                                    height={post.poster.avatar?.height}
                                    width={post.poster.avatar?.width}
                                    className='w-[40px] h-[40px] md:w-[50px] md:h-[50px]'/>
                                : <div
                                    aria-label={`${post.poster.name}'s profile image`}
                                    className="grid place-content-center w-[40px] h-[40px] md:w-[50px] md:h-[50px]">
                                        <UserIcon width={`40px`} height={`40px`}
                                                  className='w-[30] h-[30px] md:w-[38px] md:h-[38px] text-red-400'/>
                            </div> }
                        </Link>
                        : <></> }
                    <div className='grid ml-2 md:ml-3 mr-auto gap-2 mt-2'>
                        <LikeButton key={post.slug} id={post.id} hasSession={!!session} liked={post.isLiked}/>
                        <CommentButton slug={post.slug} discourse={'placeholder'}/>
                        <ClipboardButton text={`${frontend}/content/posts/${post.slug}`}/>
                    </div>
                </div>
                <Link className={'w-[88%] ml-6 md:ml-8 mb-auto text-red-50'} href={`/content/posts/${post.slug}`}>
                    <div className={`${serif.className} font-[600] text-lg lg:text-xl`}>
                        {post.title}
                    </div>
                    <div
                        className={`italic lg:text-[1.12rem] text-red-100 my-[0.4rem] line-clamp-2 
                        md:line-clamp-3 ml-2 min-h-3 md:min-h-6`}>
                        {post.subtitle}
                    </div>
                    <div className={`text-red-100 text-[0.9rem] lg:text-[1.02rem] line-clamp-4 overflow-hidden
                        dark:text-gray-50 max-h-[8rem] md:max-h-[5.8rem]`}>
                        {post.description}
                    </div>
                </Link>
            </div>
            <div
                className={`mx-auto flex mt-3 justify-end w-11/12 gap-x-6 md:gap-x-8 lg:gap-x-10 overflow-hidden`}>
                {post.tags?.map((tag: Tag) => {
                    return (<Link key={tag.slug}
                                  className={`my-auto rounded-xl hover:cursor-pointer 
                                  font-semibold text-gray-700 dark:text-gray-100`}
                                  href={`/content/tags/${tag.slug}`}>
                        {tag.title}
                    </Link>)
                })}
                <div className='italic text-sm my-auto font-semibold'>
                    {new Date(post.postedAt).toLocaleDateString()}
                </div>
                <div className="flex flex-row gap-x-[0.4rem] my-auto">
                    <PostMetadata privacy={post.privacy} type={post.type}/>
                </div>
            </div>
        </div>
    </>;
};