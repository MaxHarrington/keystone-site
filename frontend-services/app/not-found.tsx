import Link from 'next/link';
import {serif, sans} from "@fonts";

export default async function NotFound() {
    return <>
        <div className='min-h-[50vh] grid place-content-center text-center my-6'>
            <div className={`${serif.className} text-center text-3xl font-bold`}>
                Page Not Found
            </div>
            <div className='mb-8 mt-2'>
                <div className='m-auto lg:w-2/3 mt-5 mb-2 text-2xl'>
                    &ldquo;Once a mistake is made, we should correct it, and the more quickly and thoroughly the
                    better.&rdquo;
                </div>
                <div className='lg:w-3/5 italic text-sm text-red-100 m-auto'>
                    Mao Zedong, &ldquo;On the People&lsquo;s Democratic Dictatorship&rdquo; (June 30, 1949), Selected
                    Works, Vol. IV, p. 422.
                </div>
            </div>
            <Link
                className={`${sans.className} mx-auto mt-3 w-[200px] inline-flex justify-center rounded-md 
                hover:cursor-pointer border border-transparent bg-red-500 
                px-6 py-3 text-lg font-medium text-white hover:bg-red-400 
                focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2`}
                href="/">Return Home</Link>
        </div>
    </>
}