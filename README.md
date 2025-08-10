# markdown-it-aozora-ruby

[![JSR](https://jsr.io/badges/@aiwas/markdown-it-aozora)](https://jsr.io/badges/@aiwas/markdown-it-aozora)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to support
Aozora Bunko style ruby syntax.

## Features

- Parses Aozora Bunko style ruby like below:
  - `耳まで火照《ほて》って`
  - `武州｜青梅《おうめ》の宿`

## Installation

```sh
deno add jsr:@aiwas/markdown-it-aozora-ruby
```

## Usage

```ts
import MarkdownIt from "markdown-it";
import aozoraRubyPlugin from "markdown-it-aozora";

const md = new MarkdownIt().use(aozoraRubyPlugin);

const html = md.render(
  "これは青空文庫《あおぞらぶんこ》のルビ記法を使用するためのプラグインです。",
);

console.log(html);
```

**Output:**

<!-- deno-fmt-ignore-start -->

```html
<p>これは<ruby>青空文庫<rp>（</rp><rt>あおぞらぶんこ</rt><rp>）</rp></ruby>のルビ記法を使用するためのプラグインです。</p>
```

<!-- deno-fmt-ignore-end -->

## Disclaimer

Currently, this plugin does **NOT** strictly support Aozora Bunko notation.\
Aozora Bunko displays ruby characters for alphabets separated by spaces, but in
this plugin, characters other than kanji must always be separated by the "｜"
symbol.\
For example, no ruby will be rendered for
`この Markdown《マークダウン》 形式は便利だ。` (that has space before an
alphabet word and after the '》' symbol, Aozora Bunko's intended format).

## References

- [青空文庫作業マニュアル【入力編】](https://www.aozora.gr.jp/aozora-manual/index-input.html)
