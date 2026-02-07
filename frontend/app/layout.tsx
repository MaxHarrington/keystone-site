import {ReactNode} from "react";
import type {Viewport} from 'next';
import Link from 'next/link';
import getSession from "@/components/actions/getSession";
import Sites from "@/services/Sites";
import {frontend, navigation} from "@constants";
import {sans, serif} from '@fonts';
import type { Metadata } from 'next'
import '@/app/globals.css';


export async function generateMetadata(): Promise<Metadata> {
    const {title, description, keywords} = await Sites.initialize();
    return {
        title, description, keywords, metadataBase: new URL(frontend), openGraph: {
            type: 'website',
            locale: 'en_US',
            title,
            description,
            images: `${frontend}/opengraph-preview.png`
        }
    };
}

export const viewport: Viewport = {
    themeColor: '#a82f21'
};

export default async function Layout({children}: { children: ReactNode }) {
    const session = await getSession();
    const {title, tagline, description} = await Sites.initialize();
    let name: string = 'Invalid username';
    if (typeof session?.name === 'string') name = session.name.toUpperCase();
    return <>
        <html lang="en">
        <body className={'bg-[#a82f21]'}>
        <div className={`grid h-screen w-[99.999%] overscroll-contain text-red-50`}>
            <div className={`flex flex-row place-content-between w-[97%] mx-auto mt-3 lg:mt-8`}>
                <Link className={`${serif.className} grid lg:fixed`} href="/">
                    <>
                        <div className={`text-5xl lg:text-[3.4rem] lg:mb-1.5`}>
                            <i className={`text-amber-400 mr-1`}>con</i>
                            <i className={`font-medium text-red-50 mr-1`}>jonc</i>
                            <i className={`text-amber-400`}>tures</i>
                        </div>
                        <div className={`${sans.className} place-content-start text-[1rem] font-medium ml-24 lg:ml-28 text-red-100`}>
                            /kɔ̃.ʒɔ̃k.tyʁ/
                        </div>
                    </>
                    <div className={`${sans.className} hidden md:inline text-[1.125rem] ml-1 text-red-50`}>
                        {tagline}
                    </div>
                </Link>
                <div className={`mt-1 mr-2 lg:mt-3 lg:fixed lg:right-4`}>
                    { name !== 'Invalid username'
                        ? <Link href={`/account`} className={`${sans.className} grid place-content-center 
                        text-red-600 shadow-inner w-[55px] h-[55px] rounded-full bg-white text-3xl font-medium`}>
                            {name.at(0)}
                        </Link>
                        : <Link href={"/oauth2/start"} className={`px-5 py-4 rounded-lg bg-red-500 
                            border-2 shadow-lg border-red-300 hover:bg-red-600 ${sans.className} font-medium 
                            hidden lg:flex flex-row text-xl`}>
                            Sign In
                        </Link>}
                </div>
            </div>
            <div className={`${sans.className} xl:max-w-[90%] h-min-[76%] grid`}>
                {children}
            </div>
            {/* <ConsentBanner /> */}
            <div className={`${sans.className} grid place-content-center text-center mb-0`}>
                <div className={``}>
                    {description}
                </div>
                <div className={`text-sm flex flex-row place-content-center gap-x-6 mt-2 mb-[6.8rem] lg:mb-8`}>
                    <Link href={navigation.about}>
                        about
                    </Link>
                    <Link href={navigation.privacy}>
                        privacy policy
                    </Link>
                    <Link href={navigation.terms}>
                        terms of use
                    </Link>
                </div>
            </div>
        </div>
        </body>
        </html>
    </>;
};