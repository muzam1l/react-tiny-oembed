/* eslint-disable camelcase */
import type { ReactElement, CSSProperties, ComponentType } from 'react'

export interface EmbedProps {
    url: string
    proxy?: string
    style?: CSSProperties
    options?: Partial<EmbedRequestOptions>
    providers?: any[]
    FallbackElement?: ReactElement
    LoadingFallbackElement?: ReactElement
    ImgComponent?: ComponentType<{ responce?: PhotoEmbedResponce }>
    LinkComponent?: ComponentType<{ responce?: LinkEmbedResponce }>
}

export interface CommonEmbedResponce {
    type: 'rich' | 'video' | 'link' | 'photo' | string
    version: string
    thumbnail_url?: string
    thumbnail_width?: number
    thumbnail_height?: number
    title?: string
    author_name?: string
    author_url?: string
    provider_name?: string
    provider_url?: string
    referrer?: string
    cache_age?: number
    [extras: string]: any
}
export interface PhotoEmbedResponce extends CommonEmbedResponce {
    type: 'photo'
    url: string
    width: number
    height: number
}
export interface VideoEmbedResponce extends CommonEmbedResponce {
    type: 'video'
    html: string
    width: number
    height: number
}
export interface RichEmbedResponce extends CommonEmbedResponce {
    type: 'rich'
    html: string
    width: number
    height: number
}

export interface LinkEmbedResponce extends CommonEmbedResponce {
    type: 'link'
}

export type EmbedResponce = PhotoEmbedResponce | VideoEmbedResponce | RichEmbedResponce | LinkEmbedResponce

export interface EmbedRequestOptions {
    /** url of resource website */
    url: string
    maxwidth?: number
    maxheight?: number
    format?: 'json'
    [extras: string]: any
}

// eslint-disable-next-line no-unused-vars
export type GetReponceType = (options: EmbedRequestOptions) => EmbedResponce
