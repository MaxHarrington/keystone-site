"use client"

import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import Link from 'next/link'
import {
    NewspaperIcon,
    UserGroupIcon,
    SquaresPlusIcon,
    TagIcon,
    EnvelopeIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    MagnifyingGlassIcon,
    WrenchIcon,
    HomeIcon,
} from '@heroicons/react/24/solid'
import {keystone, navigation} from '@constants';
import {sans, serif} from '@fonts'
import {User} from "@/services/API";

export default function DropdownMenu({session}: { session?: User }) {
    const className = `flex flex-row px-5 py-3 border rounded-xl 
        hover:border-red-700 hover:delay-100 hover:duration-100 hover:transition-all hover:ease-in-out 
        border-transparent hover:cursor-pointer hover:bg-red-600 hover:shadow-inner`;
    const hasSession = !!session;
    return <>
        <div className={`${serif.className} font-medium gap-y-3 top-[11.5rem] lg:left-12 xl:left-[4.5rem]
        text-2xl lg:text-3xl text-red-50 hidden lg:inline fixed`}>
            <div className={className}>
                <HomeIcon width={40} height={40} />
                <div className={`ml-4 my-auto`}>
                    Home
                </div>
            </div>
            <div className={className}>
                <NewspaperIcon width={40} height={40} />
                <div className={`ml-4 my-auto`}>
                    Posts
                </div>
            </div>
            <div className={className}>
                <UserGroupIcon width={40} height={40} />
                <div className={`ml-4 my-auto`}>
                    Posters
                </div>
            </div>
            <div className={className}>
                <MagnifyingGlassIcon width={40} height={40} />
                <div className={`ml-4 my-auto`}>
                    Search
                </div>
            </div>
            <div className={className}>
                <TagIcon width={40} height={40} />
                <div className={`ml-4 my-auto`}>
                    Tags
                </div>
            </div>
            {
                session?.poster && <Link href={keystone} className={className}>
                    <WrenchIcon width={40} height={40} />
                    <div className={`ml-4 my-auto`}>
                        Manager
                    </div>
                </Link>
            }
        </div>
        <Menu>
            <div
                className='lg:hidden z-10 grid bottom-[1.8rem] 2xl:top-14 2xl:bottom-auto 2xl:left-[17.2rem] fixed place-content-center w-36 text-white'>
                <MenuButton aria-label='Open Menu'
                            className={'hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 shadow-xl border-2 border-red-400 font-extrabold text-2xl p-3 bg-red-500 mx-auto rounded-full'}>
                    <SquaresPlusIcon width={32} height={32}/>
                </MenuButton>
                <MenuItems
                    className={'shadow-xl border-2 border-red-400 order-first font-semibold 2xl:order-last grid place-content-center p-4 rounded-xl gap-2 text-xl ml-32 2xl:mt-3 mb-4 2xl:mb-auto bg-red-500'}>
                    <MenuItem>
                        <Link
                            className="data-[focus]:bg-red-600 data-[focus]:rounded-xl p-2 flex flex-row gap-2 grid-cols-2"
                            href={navigation.posts}
                        >
                            <div>
                                <NewspaperIcon className='mt-[0.2rem]' width={24} height={24}/>
                            </div>
                            <div>
                                Posts
                            </div>
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link
                            className="data-[focus]:bg-red-600 data-[focus]:rounded-xl p-2 flex flex-row gap-2 grid-cols-2"
                            href={navigation.posters}
                        >
                            <div>
                                <UserGroupIcon className='mt-[0.2rem]' width={24} height={24}/>
                            </div>
                            <div>
                                Posters
                            </div>
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link
                            className="data-[focus]:bg-red-600 data-[focus]:rounded-xl p-2 flex flex-row gap-2 grid-cols-2"
                            href={navigation.tags}
                        >
                            <div>
                                <TagIcon className='mt-[0.2rem]' width={24} height={24}/>
                            </div>
                            <div>
                                Tags
                            </div>
                        </Link>
                    </MenuItem>
                    {hasSession
                        ? <MenuItem>
                            <Link
                                className="data-[focus]:bg-red-600 data-[focus]:rounded-xl p-2 flex flex-row gap-2 grid-cols-2"
                                href={navigation.account}
                            >
                                <div>
                                    <EnvelopeIcon className='mt-[0.2rem]' width={24} height={24}/>
                                </div>
                                <div>
                                    Account
                                </div>
                            </Link>
                        </MenuItem>
                        : <></>
                    }
                </MenuItems>
            </div>
        </Menu>
        {/* <Search /> */}
        {hasSession
            ? <Link href={'/'}
                    className='z-10 text-white gap-1 flex flex-row hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 shadow-xl border-2 border-red-400 bottom-[1.9rem] lg:bottom-[4.5rem] rounded-full left-[7.25rem] lg:left-[10.1rem] xl:left-[11rem] 2xl:left-[12rem] fixed bg-red-500 p-3 px-5 text-lg font-bold'>
                <div>
                    <ChatBubbleOvalLeftEllipsisIcon className='mt-[0.12rem]' width={28} height={28}/>
                </div>
                <div className={`${sans.className} ml-[0.495rem] my-auto`}>
                    Discussions
                </div>
            </Link>
            : <Link href={navigation.join}
                    className='z-10 text-white gap-1 flex flex-row hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 shadow-xl border-2 border-red-400 bottom-[1.9rem] lg:bottom-[4.5rem] rounded-full left-[11.8rem] lg:left-44 xl:left-[17.8rem] 2xl:left-[21rem] fixed bg-red-500 p-3 px-5 text-lg font-bold'>
                <div>
                    <EnvelopeIcon className='mt-[0.15rem]' width={24} height={24}/>
                </div>
                <div className={`${sans.className} ml-2 my-auto`}>
                    Join Now
                </div>
            </Link>}
    </>
}