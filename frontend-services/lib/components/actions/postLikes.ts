"use server"

import Posts from '@/services/Posts';

export async function setLike({id}: { id: string }) {
    const service = await Posts.initialize({id})
    return await service.setLike();
}