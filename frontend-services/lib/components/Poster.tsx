import Image from "next/image"
import Link from 'next/link'
import {UserIcon} from '@heroicons/react/24/solid'

export default function Poster({poster}: { poster: any }) {
    return <div className='grid mx-auto w-[280px] md:w-[400px] lg:w-[480px]'>
            <Link className='m-auto flex flex-row' href={`/content/posters/${poster.slug}`}>
                <div className='m-auto'>
                    {
                        poster.avatar_id
                        ? <Image
                            src={`${poster.profile_image}`}
                            height={60}
                            width={60}
                            alt={`${poster.name}'s profile image`}
                            className="w-[60px] m-auto hover:cursor rounded-full shadow-inner border-2 border-gray-200 bg-white"
                        />
                        : <div aria-label={`${poster.name}'s profile image`}
                              className="w-[60px] h-[60px] text-gray-600 grid place-content-center
                              hover:cursor rounded-full shadow-inner border-2 border-gray-200 bg-white">
                            <UserIcon className='m-auto w-[40px] h-[40px]'/>
                        </div>
                    }
                </div>
                <div className="flex flex-col m-auto md:ml-auto pl-8 gap-y-1">
                    <div className="text-2xl font-serif">
                        {poster.name}
                    </div>
                    <div className="text-lg font-serif">
                        {poster.oneLiner}
                    </div>
                    <div className="hidden lg:line-clamp-2 text-lg italic pl-4">
                        {poster.description}
                    </div>
                </div>
            </Link>
        </div>
}