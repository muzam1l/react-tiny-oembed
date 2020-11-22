/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import minimatch from 'minimatch';
import axios from 'axios';
import defaultProviders from './default-providers';

import type { EmbedRequestOptions, EmbedResponce } from './interfaces';
/**
 *
 * @param endpoint Like `https:\/\/www.youtube.com\/`
 * @param proxy  Like `https:\/\/cors-anywhere.heroku.app/{raw_url}`, {raw_url | url} is placeholder for url, {raw_url} isn't encoded whhere as {url} is
 * @param options params to the embed request
 */
export async function requestEmbed(
    proxy: string | undefined,
    providers: any[] | undefined,
    options: EmbedRequestOptions,
): Promise<EmbedResponce | undefined> {
    // guess oembed url from resource url
    const { base_url, requestInterceptor, responceInterceptor } = getEndpoint(options.url, providers);
    if (!base_url) throw Error('Invalid url: cannot guess oembed endpoint');
    const proxied_url = makeUrl(base_url, proxy);

    // axios instance to apply interceptors on
    const instance = axios.create();

    // apply interceptors
    if (requestInterceptor) instance.interceptors.request.use(requestInterceptor as any);
    if (responceInterceptor) instance.interceptors.response.use(responceInterceptor as any);

    // send a request
    const responce = await instance.get(proxied_url, {
        params: options,
    });

    return responce.data;
}

/**
 * gets the oembed endpoint url from providers list
 * @param url // resource url for identifications
 * @param providers // if undefined uses default ones, but [] would mean not to use default ones
 */
export function getEndpoint(
    url: string,
    providers: any[] | undefined,
): {
    base_url?: string;
    requestInterceptor?: Function;
    responceInterceptor?: Function;
} {
    let base_url: string | undefined;
    let requestInterceptor: Function | undefined;
    let responceInterceptor: Function | undefined;
    providers = providers || defaultProviders;

    providers.forEach((provider: any) => {
        let selected: any;
        /* for providers with endpoints.length > 1, vl pick last match, (see instagram oembed provider) */
        provider.endpoints.forEach((endpoint: any) => {
            if (isMatch(url, endpoint.schemes)) selected = endpoint;
        });

        if (selected) {
            base_url = selected.url;
            ({ requestInterceptor, responceInterceptor } = provider);
        }
    });

    return {
        base_url,
        requestInterceptor,
        responceInterceptor,
    };
}

/**
 * Constructs url from oembed endpoint and proxy
 * @param base_url
 * @param proxy
 */
function makeUrl(base_url: string, proxy: string | undefined): string {
    // remove trailing slash
    if (base_url.endsWith('/')) base_url = base_url.slice(0, -1);
    // replace {format} placeholder
    const format = /\{format\}/gi;
    if (base_url.match(format)) {
        base_url = base_url.replace(format, 'json');
    }

    // return if no proxy is present
    if (!proxy) return base_url;

    const url = /\{url\}/gi;
    const raw_url = /\{raw_url\}/gi;

    // replace {url} with base_url in proxy and return
    if (proxy.match(raw_url)) return proxy.replace(raw_url, base_url);

    // replace {raw_url} with url encoded base_url and return
    if (proxy.match(url)) {
        base_url = encodeURIComponent(base_url);
        return proxy.replace(url, base_url);
    }

    // else just append the url
    if (proxy.endsWith('/')) proxy = proxy.slice(0, -1);
    return `${proxy}/${base_url}`;
}

function isMatch(url: string, schemes: string[]): boolean {
    const lvl1 = Boolean(schemes.find(scheme => minimatch(url, scheme, { nocase: true })));
    if (lvl1) return lvl1;

    // search again with * replaced with ** (see soundclound provider)
    return Boolean(schemes.find(scheme => minimatch(url, scheme.replace(/\*/g, '**'), { nocase: true })));
}
