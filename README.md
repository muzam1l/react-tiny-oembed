# React Tiny Oembed [![version](https://img.shields.io/npm/v/react-tiny-oembed.svg)](https://www.npmjs.com/package/react-tiny-oembed) [![minzipped bundle](https://img.shields.io/bundlephobia/minzip/react-tiny-oembed?label=minzipped%20bundle)](https://www.npmjs.com/package/react-tiny-oembed) 

React component for embedding content from sites going [oEembed](https://oembed.com/) way and only\* oembed way. Just give it a url and it will do the rest, no more paying for widgets!

The motivation behind this component is admiration of oembed, an opensource standard with unified way of embedding content from all supported sites, instead of having different method for every site, no exceptions\*,

> _However sites not supporting oembed for now can also be embedded using oembed-wrapper proxies and interceptors, see `Plugins` below_

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

> A note on proxy: most of the the sites do not have cors enabled, so cors proxy is necessary in most cases.
> Above used proxy is just for demonstration and is slow and highly rate limited, so provide your own proxy, you can host [Cors anywhere](https://github.com/Rob--W/cors-anywhere) on your own node server and use that.

By default only _YouTube_, _Reddit_, _Flickr_, _Vimeo_, _SoundCloud_, _Twitter_, _GIPHY_ are enabled, to add more or reduce even default ones, see `providers` prop below.

## Props

You can pass multiple props to Embed component, typings can be too imported  as named exports.

-   `options`: _EmbedRequestOptions_

    Object containing oembed options, these fields are used as query params to oembed provider, these include general options like `maxwidth` and `maxheight` and also some site specific options. Below are some of the default ones used.

    | value       | type   | default  | description                                                                                           |
    | ----------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
    | `maxwidth`  | number | 700      | maximum width of iframe or image, not the container, which can be changed with `style` prop                 |
    | `maxheight` | number | 400      | similar to maxwidth                                                                                   |
    | `align`     | string | 'center' | for [twitter](https://developer.twitter.com/en/docs/twitter-for-websites/timelines/guides/oembed-api) |

-   `style`: _CSSProperties_

    Styles applied to outer container, container also has `__embed` class so you can use that too, by default it takes has `100%` width and `700px` max width

-   `FallbackElement` and `LoadingFallbackElement`: _ReactElement_

    By default the given url is shown as anchor tag (external) for states like loading or error, However you can pass your own ones like

    ```jsx
    <Embed
        options={{ theme: 'dark' }}
        url="https://twitter.com/iamdevloper/status/1324864523363356673"
        proxy="https://cors-anywhere.herokuapp.com/"
        LoadingFallbackElement="Yeah loading..., use your own proxy"
    />
    ```

-   `ImgComponent`: _ComponentType<{ responce?: PhotoEmbedResponce }>_

    While most sites would have their good looking widgets, some sites like _Giphy_ would just give you images. Images are displayed plain, without any styling, you might want to have your own custom component for images. That component will receive `reponce` prop as oembed responce object, you can access `src` via `responce.url`

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

    _similar is for `LinkComponent` but i did not see any site returning just link_

-   `providers` ⭐

    Default providers are just a handful, you have
    hundreds to choose from. This prop can be used to enable (or reduce) support for individual sites. It expects an array of [`Provider`](https://oembed.com/providers.json) objects which defines matching pattern for links, embedding url or interceptors to add to.

    Say you want to extend suppport to more sites, go to [https://oembed.com/providers.json](https://oembed.com/providers.json), choose a provider object and pass it. Say we pick the first one, TwoThreeHQ, we will use it like this.

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

    > Note: passing `providers` list overrides default one, so you need to pass `defaultProviders` to have them too.

    Support for all the sites can be extended in this way, just passing list of provider objects. Also remember sites like _Instagram_ and _Facebook_ require developer keys too, so pass them in `options` prop above (please test them, i did not wanted to create developer account there)

    If you want to filter even default ones, you can

    ```js
    const providers = defaultProviders.filter(
        p => p.provider_name === 'Vimeo' || p.provider_name === 'SoundCloud'
    )
    ```

    For sites not supporting oembed but see `Plugins` section below.

## Plugins

-   [github-gist](https://github.com/muzam1l/oembed-github-gist) - Github gist sample plugin for react-tiny-oembed without a proxy server.
-   ...others

For authoring plugins see [PLUGINS](./PLUGINS.md)

## Contributing

You can help me write tests 😊.
