import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import MarkdownIt from "markdown-it";
import aozoraRubyPlugin from "./mod.ts";

Deno.test("Aozora Ruby Plugin", async (t) => {
  const md = new MarkdownIt().use(aozoraRubyPlugin);

  await t.step("should render basic ruby for Kanji", () => {
    const text = "これは漢字《かんじ》です。";
    const expected =
      "<p>これは<ruby>漢字<rp>（</rp><rt>かんじ</rt><rp>）</rp></ruby>です。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should render ruby with '｜' for longer text", () => {
    const text = "これは｜長い言葉《ながいことば》です。";
    const expected =
      "<p>これは<ruby>長い言葉<rp>（</rp><rt>ながいことば</rt><rp>）</rp></ruby>です。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should not render ruby when base text is not valid", () => {
    const text = "これは 《かんじ》です。"; // Space before '《'
    const expected = "<p>これは 《かんじ》です。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should not render ruby for non-kanji base text without '｜'", () => {
    const text = "abc《alphabet》";
    const expected = "<p>abc《alphabet》</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should render ruby for non-kanji base text with '｜'", () => {
    const text = "｜abc《alphabet》";
    const expected = "<p><ruby>abc<rp>（</rp><rt>alphabet</rt><rp>）</rp></ruby></p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should handle multiple ruby tags in one line", () => {
    const text = "｜今日《きょう》は｜天気《てんき》がいい。";
    const expected =
      "<p><ruby>今日<rp>（</rp><rt>きょう</rt><rp>）</rp></ruby>は<ruby>天気<rp>（</rp><rt>てんき</rt><rp>）</rp></ruby>がいい。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should handle mixed ruby tags", () => {
    const text = "｜今日《きょう》は天気《てんき》がいい。";
    const expected =
      "<p><ruby>今日<rp>（</rp><rt>きょう</rt><rp>）</rp></ruby>は<ruby>天気<rp>（</rp><rt>てんき</rt><rp>）</rp></ruby>がいい。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should handle plain text without ruby", () => {
    const text = "This is a plain text without any ruby syntax.";
    const expected =
      "<p>This is a plain text without any ruby syntax.</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });

  await t.step("should work with other markdown syntax", () => {
    const text = "これは**強調**と｜ルビ《るび》のテスト。";
    const expected =
      "<p>これは<strong>強調</strong>と<ruby>ルビ<rp>（</rp><rt>るび</rt><rp>）</rp></ruby>のテスト。</p>\n";
    const result = md.render(text);
    assertEquals(result, expected);
  });
});
