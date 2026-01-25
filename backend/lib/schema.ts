import type {Lists} from '.keystone/types';
import type {Token as TokenType} from '@prisma/client';
import {User} from "./schemas/User";
import {Poster} from "./schemas/Poster";
import {Image} from "./schemas/Image";
import {Metadata} from "./schemas/Metadata";
import {Post} from "./schemas/Post";
import {Token} from "./schemas/Token";
import {Tag} from "./schemas/Tag";
import {Comment} from "./schemas/Comment";

export const slugifyOptions = {lower: true, remove: new RegExp("[^a-zA-Z0-9 -]"), length: 50}

export const lists =
    {Comment, Metadata, Post, Image, Tag, Poster, User, Token} satisfies Lists<TokenType>;