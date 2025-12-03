import Image from "next/image"
import Link from 'next/link'

export default async function Tag({tag}: { tag: any }) {
    const topImage = tag.content?.document.map(({relationship, type, data}: {
        relationship: string, type: string, data: any
    }) => {
        if (type === 'relationship') {
            if (relationship === 'image') {
                return data;
            }
        }
    });
    return <>
        <Link href={`/content/tags/${tag.slug}`} className={`grid first-line:m-auto`}>
            <div className='grid w-[320px] h-[180px] m-auto'>
                {topImage?.url ? <div
                    className='absolute text-3xl ml-[15px] mt-[14px] bg-white py-1 px-2 rounded-md dark:text-black'>
                    {tag.title}
                </div> : <></>}
                {topImage?.url ? <Image
                    className={`w-[320px] h-[180px] object-cover m-auto rounded border shadow-lg border-gray-200 dark:border-gray-500`}
                    alt={topImage.altText}
                    src={`${topImage.url}`}
                    width={topImage.height}
                    height={topImage.width}
                /> : <div
                    className="w-[320px] h-[180px] m-auto rounded shadow-lg bg-gradient-to-l from-red-500 from-20% via-red-600 via-40% to-red-700 to-90%">
                    <div className={"font-serif text-2xl text-white absolute mt-[65px] ml-[80px]"}>
                        {tag.title}
                    </div>
                </div>}
            </div>
        </Link>
    </>
}