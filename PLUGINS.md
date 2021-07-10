# Why Plugins

Now we break our top rule, no exceptions, or at least twist it a bit. While i do believe every site should support oembed instead of having custom method, but there are some who don't support it and some important ones like _Github_.

# Proxy servers

But this component still understands _only_ oembed, so the recommended way for those sites is to create a oembed-proxy server, and referencing that in custom provider. Provider objects are self explanatory, important parts of it are `endpoints.schemes` which defines patterns of urls to match and uses _globs_ matched by [minimatch](https://github.com/isaacs/minimatch) and `endpoints.url` which defines oembed compatible url, see [https://oembed.com](https://oembed.com/)

Example of custom provider would look like this

```json
 {
        "provider_name": "My Provider",
        "provider_url": "https://myurl.com/",
        "endpoints": [{
            "schemes": [
                "https://github.com/**"
            ],
            "url": "https://proxyurl.com/{raw_url}",
            "discovery": true
        }]
},
```

> Note: `{raw_url}` and `{url}` are placeholders that can be present in `endpoints.url` to specify where the url will be substituted, `{url}` will be replaced by url-encoded url and must be decoded on server accordingly, if both are omitted, url will simply be appended.

# Override

Some sites would just give you an embed code, contaning anchor and script tags etc, so to use that you can use this override api to execute that code.

For that, your provider object must have `url` value set to `OVERRIDE` and `getResponce` function, which is expected to return the `oembed` reponce, given the options.

Below is the example of plugin object for *Tenor* gifs.

```javascript
{
    provider_name: 'Tenor Gifs by muzam1l',
    provider_url: 'https://github.com/muzam1l',
    endpoints: [
      {
        schemes: ['https://tenor.com/view/**'],
        url: 'OVERRIDE',
      },
    ],
    getResponce: (options: EmbedRequestOptions) => {
      const { url, width = '100%', aspectRatio = '1.0', caption = '' } = options
      const match = url.match(/-(?<id>\d+)$/)
      const postId = match?.groups?.id
      return {
        type: 'rich',
        version: '1.0.0',
        html: `<div class="tenor-gif-embed" data-postid="${postId}" data-share-method="host" data-width="${width}" data-aspect-ratio="${aspectRatio}">
                 <a href="${url}">${caption}</a>
               </div>
               <script type="text/javascript" async src="https://tenor.com/embed.js"></script>`,
      }
    },
  }
```

`getResponce` has following signature

```typescript
type GetReponceType = (options: EmbedRequestOptions) => EmbedResponce
```

Check out interfaces [here](./src/interfaces.ts)


# Axios Interceptors

You can also use `requestInterceptor` and `responceInterceptor` fields in Provider object, which should be [axios](https://github.com/axios/axios) interceptor functions whose goal is to convert request into oembed compatible request and responce into oembed compatible responce, [github-gist](https://github.com/muzam1l/oembed-github-gist) is one such example.