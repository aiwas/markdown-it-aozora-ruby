# markdown-it-aozora

[![JSR](https://jsr.io/badges/@aiwas/markdown-it-aozora)](https://jsr.io/badges/@aiwas/markdown-it-aozora)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to support Aozora Bunko style ruby syntax.

This plugin is built for Deno and is intended to be published on JSR.

## Features

- Parses Aozora Bunko style ruby (furigana) like below:
  - `耳まで火照《ほて》って`
  - `武州｜青梅《おうめ》の宿`

## Installation

### Deno

```sh
deno add jsr:@aiwas/markdown-it-aozora
```

## Usage

```ts
import MarkdownIt from "markdown-it";
import aozoraRubyPlugin from "markdown-it-aozora";

const md = new MarkdownIt().use(aozoraRubyPlugin);

const markdownText = `
これは｜青空文庫《あおぞらぶんこ》のルビ記法を再現するプラグインです。
漢字《かんじ》にも対応しています。
`;

const html = md.render(markdownText);

console.log(html);
```

**Output:**

```html
<p>これは<ruby>青空文庫<rp>（</rp><rt>あおぞらぶんこ</rt><rp>）</rp></ruby>のルビ記法を再現するプラグインです。
<ruby>漢字<rp>（</rp><rt>かんじ</rt><rp>）</rp></ruby>にも対応しています。</p>
```

## References

- [青空文庫作業マニュアル【入力編】](https://www.aozora.gr.jp/aozora-manual/index-input.html)