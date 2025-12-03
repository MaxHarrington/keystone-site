import type { MetadataRoute } from 'next'
import Sites, {Site} from "@/services/Sites";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const site: Site = await Sites.initialize();
    return {
        name: site.title ?? 'No Title',
        short_name: site.title ?? 'No Title',
        description: site.description ?? 'No Description',
        start_url: '/',
        display: 'standalone',
        background_color: '#a82f21',
        theme_color: '#a82f21',
        icons: [
            {
                src: '/opengraph-preview.png',
                sizes: '120x120',
                type: 'image/png',
            }
        ],
    }
}