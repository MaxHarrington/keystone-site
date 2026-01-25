import {Merriweather, Montserrat} from "next/font/google";

export const sans = Montserrat({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], subsets: ['latin'], display: 'swap'
});

export const serif = Merriweather({
    weight: ['300', '400', '700', '900'], subsets: ['latin'], display: 'swap', adjustFontFallback: false
});