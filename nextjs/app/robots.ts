export default function robots() {
    return {
        rules: {
            userAgent: '*', allow: ['/'], disallow: ['/account'],
        }, sitemap: `/sitemap.xml`,
    };
};