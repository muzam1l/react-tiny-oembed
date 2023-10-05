# React Tiny Oembed [![version](https://img.shields.io/npm/v/react-tiny-oembed.svg)](https://www.npmjs.com/package/react-tiny-oembed) [![npm bundle](https://img.shields.io/bundlephobia/minzip/react-tiny-oembed?label=npm%20bundle)](https://www.npmjs.com/package/react-tiny-oembed) [![gzip size](https://img.badgesize.io/https://github.com/muzam1l/react-tiny-oembed/releases/download/1.1.0/index.js?compression=gzip&label=gzip)](https://github.com/muzam1l/react-tiny-oembed/releases)

React component for embedding content from sites going [oEembed](https://oembed.com/) way and only[1] _oembed_ way. Just give it a URL and it will do the rest, no more paying for widgets!

The motivation behind this component is the admiration of _oembed_, an opensource standard with a unified way of embedding content from all supported sites, instead of having different methods for every site.

> [1] _However sites not supporting _oembed_ for now can also be embedded using _oembed_ wrapper proxies and interceptors, see `Plugins` below_

## Installation

```bash
npm install react-tiny-oembed
```

_requires React 16.8 or higher_

## Basic usage

```jsx
import Embed from 'react-tiny-oembed'

function App() {
    ...

        <Embed
            url="https://youtu.be/nlD9JYP8u5E"
            proxy="https://cors-anywhere.herokuapp.com/"
        />
}
```

> A note on the proxy: most of the sites do not have cors enabled, so cors proxy is necessary in most cases.
> The above-used proxy is just for demonstration and is slow and highly rate-limited, so provide your own proxy. You can host [Cors anywhere](https://github.com/Rob--W/cors-anywhere) on your own node server and use that.

By default only _YouTube_, _Reddit_, _Flickr_, _Vimeo_, _SoundCloud_, _Twitter_, _GIPHY_ are enabled, to add more or reduce even default ones, see `providers` prop below.

## Props

You can pass multiple props to the `Embed` component, typings can be imported as named exports.

-   `options`: `EmbedRequestOptions`

    An object containing _oembed_ options, these fields are used as query params to oembed provider, these include general options like `maxwidth` and `maxheight` and also some site-specific options. Below are some of the default ones used.

    | value       | type   | default  | description                                                                                                        |
    | ----------- | ------ | -------- | -----------------------------------------------------------------------------------------------------              |
    | `maxwidth`  | number | 700      | maximum width of the iframe or image rendered by the provider. Note that this is separate from the outer container |
    | `maxheight` | number | 400      | similar to the `maxwidth`                                                                                          |
    | `align`     | string | 'center' | for [twitter](https://developer.twitter.com/en/docs/twitter-for-websites/timelines/guides/oembed-api)              |

-   `style`: `CSSProperties`

    Styles applied to outer container, container also has `__embed` class so you can use that too, by default it has `100%` width and `700px` max width.

-   `FallbackElement` and `LoadingFallbackElement`: `ReactElement`

    By default the given URL is shown as an anchor tag (external) for states like _loading_, _error_, etc. However, you can pass your own elements like

    ```jsx
    <Embed
        options={{ theme: 'dark' }}
        url="https://twitter.com/iamdevloper/status/1324864523363356673"
        proxy="https://cors-anywhere.herokuapp.com/"
        LoadingFallbackElement="Yeah loading..., use your own proxy"
    />
    ```

-   `ImgComponent`: `ComponentType<{ responce?: PhotoEmbedResponce }>`

    While most sites will render some good-looking widgets, some sites like _Giphy_ will just render a plain image. Images are displayed plain, without any styling, you might want to have your own custom component for images. That component will receive the `responce` prop as _oembed_ `responce` object. For example, you can access `src` via `responce.url`.

    ```jsx
        function CustomImg({ responce }) {
            return <div className="img-widget">
                <h1>Image from {responce.provider_name}</h1>
                <img src={responce.url} alt={responce.author_name} />
            </div>
        }

        ...
            <Embed
                ...
                ImgComponent={CustomImg}
            />
    ```

    _similar is for `LinkComponent` but I did not see any site returning just link!_

-   `providers` ⭐

    Default providers are just a handful, you have hundreds to choose from. This prop can be used to enable (or reduce) support for individual sites. It expects an array of [`Provider`](https://oembed.com/providers.json) objects which define matching patterns for links, embedding URLs or interceptors to add to.

    Say you want to extend support for more sites, go to [https://oembed.com/providers.json](https://oembed.com/providers.json), choose a provider object and pass that to this prop. Say we pick the first one, _TwoThreeHQ_, we will use it like this.

    ```jsx
        import Embed, { defaultProviders } from 'react-oembed'

        const TwoThreeHQ = {
            "provider_name": "23HQ",
            "provider_url": "http:\/\/www.23hq.com",
            "endpoints": [
                {
                    "schemes": [
                        "http:\/\/www.23hq.com\/*\/photo\/*"
                    ],
                    "url": "http:\/\/www.23hq.com\/23\/oembed"
                }
            ]
        }

        ...

            <Embed
                url= ...

                providers={[...defaultProviders, TwoThreeHQ]}
            />
    ```

    > Note: Passing the `providers` list overrides the default one, so you need to pass `defaultProviders` to have them too.

    > Note:  Providers like _Instagram_ and _Facebook_ require developer keys too, so pass them in the `options` prop above (testing TBD).

    If you want to filter out even the default ones, you can

    ```js
    const providers = defaultProviders.filter(
        p => p.provider_name === 'Vimeo' || p.provider_name === 'SoundCloud'
    )
    ```

    For sites not supporting _oembed_ but see `Plugins` section below.

## Plugins

-   [github-gist](https://github.com/muzam1l/oembed-github-gist) - Github gist sample plugin for react-tiny-oembed without a proxy server.
-   ...others

For authoring plugins see [PLUGINS](./PLUGINS.md)

## Contributing

Contributions welcome!
