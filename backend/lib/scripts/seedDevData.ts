import { getContext } from '@keystone-6/core/context'
import * as PrismaModule from '@prisma/client'
import config from '../../keystone'
import { LoremIpsum } from "lorem-ipsum";
import {slugifyOptions} from "@/lib/schema";
import slugify from "slugify";

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

async function main () {
    const context = getContext(config, PrismaModule);
    const countPosters = process.env.npm_config_posters ?? 3;
    const countPosts = process.env.npm_config_posts ?? 5;
    if (process.env.NODE_ENV === 'production') {
        console.log("Cannot be run on production servers.")
        return;
    }
    console.log(`🌱 Inserting seed data`);
    console.log(`Now generating ${countPosters} posters!`);
    for (const _ of [...Array(Number(countPosters))]) {
        const name = lorem.generateWords(4);
        const poster = {
            id: crypto.randomUUID(),
            name,
            slug: slugify(name, slugifyOptions),
            path: `/content/posters/${slugify(name, slugifyOptions)}`,
            oneLiner: lorem.generateWords(12),
        };
        console.log(`👩 Adding poster: ${poster.name}`);
        const item = await context.sudo().db.Poster.findOne({
            where: { name: poster.name },
        });
        if (!item) {
            await context.sudo().prisma.poster.create({
                data: poster,
            });
        }
    }

    const posters = await context.sudo().db.Poster.findMany();

    for (const poster of posters) {
        for (const _ of [...Array(Number(countPosts))]) {
            console.log(poster)
            console.log(`📝 Adding post`)
            const title = lorem.generateWords(8);
            const paragraph = {'type': 'paragraph', 'children': [{text: lorem.generateParagraphs(1)}]};
            const post = {
                id: crypto.randomUUID(),
                title,
                subtitle: lorem.generateWords(10),
                description: lorem.generateSentences(4),
                slug: slugify(title, slugifyOptions),
                path: `/content/posts/${slugify(title, slugifyOptions)}`,
                content: [
                    paragraph,
                    paragraph,
                    paragraph,
                    paragraph,
                    paragraph,
                    paragraph
                ],
                privacy: "Public",
                type: "Article"
            }
            await context.sudo().prisma.post.create({
                data: { ...post, poster: { connect: { id: poster.id } } },
            })
        }
    }
    console.log(`✅ Seed data inserted`)
    console.log(`👋 Please start the process with \`npm run dev\``)
}

main();