"use client"

import {useState} from 'react';
import Image from "next/image"
import Link from 'next/link';
import {
    ChatBubbleLeftEllipsisIcon, ClipboardDocumentCheckIcon, GlobeAltIcon, HeartIcon
} from '@heroicons/react/24/solid';
import {navigation} from '@constants';
import {setLike} from '@/components/actions/postLikes';
import xLogo from "@/public/x-logo.png"
import patreonLogo from "@/public/patreon-logo.png"
import instagramLogo from "@/public/instagram-logo.png"
import type {Poster} from "@/services/API";

function copyText(entryText: string) {
    return navigator.clipboard.writeText(entryText);
}

export function SocialMediaButtons({poster}: { poster: Poster }) {
    return (<div className="flex flex-row place-content-center gap-x-4 my-4">
        {poster.xTwitter ? <Link
            className="bg-black rounded-full h-[32px] w-[32px] shadow-lg border border-gray-600 dark:border-gray-800"
            href={poster.xTwitter}>
            <Image alt='X/Twitter' src={xLogo} className="mx-auto my-[0.4rem] h-[18px] w-[18px]" width={18}
                   height={18}/>
        </Link> : <></>}
        {poster.instagram ? <Link
            className="bg-black rounded-full h-[32px] w-[32px] shadow-lg border border-gray-600 dark:border-gray-800"
            href={poster.instagram}>
            <Image alt='Instagram' src={instagramLogo} className="mx-auto my-[0.4rem] h-[18px] w-[18px]"
                   width={18} height={18}/>
        </Link> : <></>}
        {poster.patreon ? <Link
            className="bg-black rounded-full h-[32px] w-[32px] shadow-lg border border-gray-600 dark:border-gray-800"
            href={poster.patreon}>
            <Image alt='Patreon' src={patreonLogo} className="mx-auto my-[0.4rem] h-[18px] w-[18px]" width={18}
                   height={18}/>
        </Link> : <></>}
        {poster.website ? <Link
            className="bg-black rounded-full h-[32px] w-[32px] shadow-lg border border-gray-600 dark:border-gray-800"
            href={poster.website}>
            <GlobeAltIcon className="mx-auto my-[0.21rem] text-white" width={24} height={24}/>
        </Link> : <></>}
    </div>)
}

export function ClipboardButton({text}: { text: string }) {
    return <>
        <button title='Copy Post URL' aria-label='Copy link to clipboard' onClick={() => copyText(text)}>
            <ClipboardDocumentCheckIcon width={'28px'} height={'28px'}
                                        className='hover:cursor-pointer hover:text-black dark:hover:text-gray-300 m-auto'/>
        </button>
    </>;
}

export function CommentButton({slug, discourse}: { slug?: string, discourse?: string }) {
    return <>
        <Link aria-label='Go to Post Replies' href={`${slug ? `/content/posts/${slug}#replies` : discourse}`}>
            <ChatBubbleLeftEllipsisIcon width={'28px'} height={'28px'} title='Comments'
                                        className='hover:cursor-pointer hover:text-black dark:hover:text-gray-300 m-auto'/>
        </Link>
    </>;
}

export function LikeButton({id, hasSession, liked}: { id: string, hasSession: boolean, liked: boolean }) {
    const [like, setLiked] = useState(liked);
    return hasSession
        ? <button aria-label='Like Post' onClick={async () => {
            const updated = await setLike({id});
            setLiked(Boolean(updated));
        }}>
            <HeartIcon width={'28px'} height={'28px'} title='Like'
               className={`${like 
                   ? `text-amber-400 hover:cursor-pointer active:text-red-100 
                        transition duration-[250ms] ease-in-out` 
                   : `text-red-50 hover:cursor-pointer active:text-amber-600 
                        transition duration-[250ms] ease-in-out`}`}/>
        </button>
        : <Link aria-label='Join Now to Like Post' href={navigation.join}>
            <HeartIcon width={'28px'} height={'28px'} title='Like'
                       className={`${'text-red-50  hover:cursor-pointer hover:text-amber-400'}`}/>
        </Link>;
}

export function LoadMoreButton({take, total, category}: { take: number, total: number, category: string }) {
    let newTake: number;
    let link: string = '';
    if (category === 'posts') {
        newTake = total > take + 9 ? take + 9 : total;
        link = `/content/${category}?t=${newTake}`;
    } else if (category === 'posters') {
        newTake = total > take + 16 ? take + 16 : total;
        link = `/content/${category}?t=${newTake}`;
    } else if (category === 'tags') {
        newTake = total > 9 ? take + 9 : total;
        link = `/content/${category}?t=${newTake}`;
    }
    return total <= take ? <>
        <div className={`mx-auto p-3 bg-gray-100 dark:bg-gray-500 rounded-md max-w-32
            font-bold text-lg border-2 border-gray-50 dark:border-gray-400 hover:cursor-not-allowed text-center`}>
            Load More
        </div>
    </> : <>
        <Link href={link} scroll={false} className={`mx-auto p-3 bg-red-500 rounded-md max-w-32
            font-bold text-lg border-2 border-red-400 hover:cursor-pointer text-center`}>
            Load More
        </Link>
    </>
}