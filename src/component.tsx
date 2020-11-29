import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { requestEmbed } from './utils'
import useScript from './use-script'
import type { EmbedProps, EmbedResponce } from './interfaces'

export default function Embed({
    url,
    proxy,
    style,
    options,
    providers,
    ImgComponent,
    LinkComponent,
    FallbackElement,
    LoadingFallbackElement,
}: EmbedProps) {
    const [data, setData] = useState<EmbedResponce | undefined>(undefined)
    const [status, setStatus] = useState<'done' | 'idle' | 'loading' | 'error'>('idle')
    const [html, setHtml] = useState('')

    useScript(html, { defer: '' })

    // make a request
    async function fetchEmbed() {
        try {
            setStatus('loading')
            const res = await requestEmbed(proxy, providers, {
                url,
                maxwidth: 700,
                maxheight: 500,
                align: 'center', // for twitter
                ...options,
                format: 'json', // only supported format
            })
            if (!res) throw Error('Nill embed responce')
            setStatus('done')
            setData(res)
            if (res.html) setHtml(res.html)
        } catch (err) {
            // eslint-disable-next-line
            console.error('Error', err)
            setStatus('error')
        }
    }

    useEffect(() => {
        if (status === 'idle') fetchEmbed()
    }, [status])

    const Link = (
        <a href={url} target="_blank" rel="nofollow noreferrer noopener">
            {url}
        </a>
    )

    let CustomNode: ReactNode
    if (data && !data.html) {
        if (data.type === 'photo') {
            if (ImgComponent) {
                CustomNode = <ImgComponent responce={data} />
            } else CustomNode = <img alt="" src={data.url} />
        } else if (data.type === 'link') {
            if (LinkComponent) {
                CustomNode = <LinkComponent responce={data} />
            } else
                CustomNode = (
                    <a href={url} target="_blank" rel="nofollow noreferrer noopener">
                        {url}
                    </a>
                )
        }
    }
    if (status === 'loading' || status === 'idle') return LoadingFallbackElement || Link
    if (status === 'error') return FallbackElement || Link
    return (
        <span style={style} className="__embed __embed_column">
            {CustomNode}
            {/* eslint-disable-next-line */}
            {html && <span className="__embed_column" dangerouslySetInnerHTML={{ __html: html }}></span>}
            <style>{`.__embed {
    margin: auto;
    width: 100%;
    max-width: 700px;
} 
.__embed iframe {
    width: 100%;
    margin: auto;
}
.__embed img, .__embed video {
    width: 100%;
    margin: 0;
}
.__embed blockquote {
    margin: 0;
}
.__embed span {
    border: 0;
} 
.__embed_column {
    width: 100%;
    display: flex;
    flex-direction: column;
}`}</style>
        </span>
    )
}
