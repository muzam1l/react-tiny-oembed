/* eslint-disable camelcase */
import minimatch from 'minimatch';
import providers from './default-providers';

import type { EmbedRequestOptions, EmbedResponce } from './interfaces';
/**
 *
 * @param endpoint Like `https:\/\/www.youtube.com\/`
 * @param proxy  Like `https:\/\/cors-anywhere.heroku.app/{raw_url}`, {raw_url | url} is placeholder for url, {raw_url} isn't encoded whhere as {url} is
 * @param options params to the embed request
 */
export async function requestEmbed(
  proxy: string | undefined,
  options: EmbedRequestOptions,
): Promise<EmbedResponce | undefined> {
  const endpoint = getEndpoint(options.url);
  if (!endpoint) throw Error('Invalid url: cannot guess oembed endpoint');

  const full_url = makeUrl(endpoint, proxy, options);
  try {
    const responce = await fetch(full_url);
    if (responce.ok) return responce.json();
    throw responce;
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return undefined;
  }
}

export function getEndpoint(url: string): string | undefined {
  let base_url: string | undefined;
  providers.forEach((provider: any) => {
    let selected: any;
    /* for providers with endpoints.length > 1, vl pick last match, (see instagram) */
    provider.endpoints.forEach((endpoint: any) => {
      if (isMatch(url, endpoint.schemes)) selected = endpoint;
    });

    if (selected) {
      base_url = selected.url;
    }
  });

  return base_url;
}
/**
 * Constructs url from oembed endpoint, proxy and oembed options
 * @param data const
 */
function makeUrl(endpoint: string, proxy: string | undefined, options: EmbedRequestOptions): string {
  /* eslint-disable no-param-reassign */
  // remove trailing slash
  if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
  // replace {format} placeholder
  const format = /\{format\}/gi;
  if (endpoint.match(format)) {
    endpoint = endpoint.replace(format, 'json');
  }

  options.format = 'json';
  const search = makeSearch(options);

  // construct url and return if no proxy is present
  let base_url = `${endpoint}?${search}`;
  if (!proxy) return base_url;

  // wrap in proxy and return that
  const url = /\{url\}/gi;
  const raw_url = /\{raw_url\}/gi;

  if (proxy.match(raw_url)) return proxy.replace(raw_url, base_url);

  if (proxy.match(url)) {
    base_url = encodeURIComponent(base_url);
    return proxy.replace(url, base_url);
  }

  throw Error('invalid proxy format, must contain {url | raw_url} to substitute url into');
}

/**
 * makes url search string from params object
 * @param params Object with key: value mapped to [?]key=value[&]
 */
function makeSearch(params: object): string {
  return Object.entries(params).reduce((cumm, val) => {
    let ND = '&';
    if (cumm === '') ND = '';
    const key = encodeURIComponent(val[0]);
    const value = encodeURIComponent(val[1]);
    return cumm.concat(`${ND}${key}=${value}`);
  }, '');
}

function isMatch(url: string, schemes: string[]): boolean {
  return Boolean(schemes.find((scheme) => minimatch(url, scheme, { nocase: true })));
}
