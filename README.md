# Pusher

**[Demo](http://kirkstrobeck.github.io/pusher/)**

TLDR; Easily implement native vertical responsive scaling by creating on-the-fly GIFs via base64

#### Problem: Dynamic native vertical scaling is difficult. Poor solutions include JavaScript and CSS. By using images it can be easily accomplished with images, the building blocks of the web.

Images from day one have been the only element that respects aspect ratios. Taking advantage of this fact, you can use an image to reposition content in the vertical space, which makes responsive a breeze.

### Usage

    <img data-pusher data-width="200" data-height="100" />

- Use `data-pusher` as the selector
- `data-width` and `data-height` are the metrics that represent the intended aspect ratio. This would be the same (and will generate) `<img data-pusher data-width="2" data-height="1" />`

### Features

- Automaticly reduces the aspect ratio fraction of the desired size to its smallest implementation to optimize render time

### Libraries

- Uses [glif](https://emergent.unpythonic.net/software/01126462511-glif) by Jeff Epler. Was not available on npm or bower

- V1 of this project was developed with [NathanWalker](https://github.com/NathanWalker) on [pusher-gif](https://github.com/infowrap/pusher-gif)
