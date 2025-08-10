import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import MarkdownIt from "markdown-it";
import aozoraRubyPlugin from "./mod.ts";

describe("Markdown Aozora Plugin", () => {
  const md = new MarkdownIt().use(aozoraRubyPlugin);

  it("should render basic ruby for kanji", () => {
    const text = "この漢字《かんじ》にルビを振る。";
    const expected =
      "<p>この<ruby>漢字<rp>（</rp><rt>かんじ</rt><rp>）</rp></ruby>にルビを振る。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should render ruby for special characters treated as kanji", () => {
    const text = "注意として々仝〆〇ヶ《これら》は漢字と見なす。";
    const expected =
      "<p>注意として<ruby>々仝〆〇ヶ<rp>（</rp><rt>これら</rt><rp>）</rp></ruby>は漢字と見なす。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should render ruby for parts of the sentence separated by '｜'", () => {
    const text = "この場合は｜区切り文字《セパレータ》を使う。";
    const expected =
      "<p>この場合は<ruby>区切り文字<rp>（</rp><rt>セパレータ</rt><rp>）</rp></ruby>を使う。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should render ruby by separating parts of consecutive kanji characters with '｜'", () => {
    const text = "開いたままの本は一｜頁《ページ》も進んでいない。";
    const expected =
      "<p>開いたままの本は一<ruby>頁<rp>（</rp><rt>ページ</rt><rp>）</rp></ruby>も進んでいない。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should not render ruby when the preceding text is separated by space", () => {
    const text = "この漢字 《かんじ》にルビを振る。"; // Space before '《'
    const expected = "<p>この漢字 《かんじ》にルビを振る。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should not render ruby for non-kanji text without '｜'", () => {
    const text = "Markdown《マークダウン》形式は便利だ。";
    const expected = "<p>Markdown《マークダウン》形式は便利だ。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should render ruby for non-kanji text with '｜'", () => {
    const text = "｜Markdown《マークダウン》形式は便利だ。";
    const expected =
      "<p><ruby>Markdown<rp>（</rp><rt>マークダウン</rt><rp>）</rp></ruby>形式は便利だ。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should handle multiple ruby in one line", () => {
    const text = "｜今日《きょう》は｜天気《てんき》がいい。";
    const expected =
      "<p><ruby>今日<rp>（</rp><rt>きょう</rt><rp>）</rp></ruby>は<ruby>天気<rp>（</rp><rt>てんき</rt><rp>）</rp></ruby>がいい。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should handle mixed ruby", () => {
    const text = "｜今日《きょう》は天気《てんき》がいい。";
    const expected =
      "<p><ruby>今日<rp>（</rp><rt>きょう</rt><rp>）</rp></ruby>は<ruby>天気<rp>（</rp><rt>てんき</rt><rp>）</rp></ruby>がいい。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should handle plain text without ruby", () => {
    const text = "今日は天気がいい。";
    const expected = "<p>今日は天気がいい。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  it("should work with other markdown syntax", () => {
    const text = "これは**強調**と｜ルビ《るび》のテスト。";
    const expected =
      "<p>これは<strong>強調</strong>と<ruby>ルビ<rp>（</rp><rt>るび</rt><rp>）</rp></ruby>のテスト。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });
});
