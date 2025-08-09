import type MarkdownIt from "markdown-it";
import type { StateCore, Token } from "markdown-it";

/**
 * A markdown-it plugin for Aozora Bunko style ruby syntax.
 *
 * This plugin uses a core ruler to scan for ruby syntax after inline parsing.
 * It supports:
 * - 漢字《かんじ》
 * - ｜言葉《ことば》
 */
export default function aozoraRubyPlugin(md: MarkdownIt) {
  md.core.ruler.after("inline", "aozora_ruby_core", aozoraRubyCore);

  md.renderer.rules.ruby_open = () => "<ruby>";
  md.renderer.rules.ruby_close = () => "</ruby>";
  md.renderer.rules.rt_open = () => "<rt>";
  md.renderer.rules.rt_close = () => "</rt>";
  md.renderer.rules.rp_open = () => "<rp>";
  md.renderer.rules.rp_close = () => "</rp>";
}

function aozoraRubyCore(state: StateCore) {
  for (const inlineToken of state.tokens) {
    if (inlineToken.type !== "inline" || !inlineToken.children) {
      continue;
    }

    const children = inlineToken.children;
    const newChildren: Token[] = [];
    let modified = false;

    for (const child of children) {
      if (child.type !== "text" || !child.content.includes("《")) {
        newChildren.push(child);
        continue;
      }

      const text = child.content;
      // This regex handles two cases:
      // 1. Pipe syntax: ｜Base《Ruby》
      // 2. Kanji-only base: 漢字《かんじ》
      const rubyRegex =
        /(｜(.+?)《(.+?)》)|([\p{Script=Han}々仝〆〇ヶ]+)《(.+?)》/gu;
      let lastIndex = 0;
      let match;

      while ((match = rubyRegex.exec(text)) !== null) {
        modified = true;
        const [
          ,
          ,
          pipeBase,
          pipeRuby,
          kanjiBase,
          kanjiRuby,
        ] = match;

        const baseText = pipeBase || kanjiBase;
        const rubyText = pipeRuby || kanjiRuby;

        if (!baseText || !rubyText) continue;

        const matchIndex = match.index;

        // Add text before the match
        if (matchIndex > lastIndex) {
          const t = new state.Token("text", "", 0);
          t.content = text.slice(lastIndex, matchIndex);
          newChildren.push(t);
        }

        // Add ruby tokens
        newChildren.push(new state.Token("ruby_open", "ruby", 1));
        const base = new state.Token("text", "", 0);
        base.content = baseText;
        newChildren.push(base);
        newChildren.push(new state.Token("rp_open", "rp", 1));
        const rp1 = new state.Token("text", "", 0);
        rp1.content = "（";
        newChildren.push(rp1);
        newChildren.push(new state.Token("rp_close", "rp", -1));
        newChildren.push(new state.Token("rt_open", "rt", 1));
        const rt = new state.Token("text", "", 0);
        rt.content = rubyText;
        newChildren.push(rt);
        newChildren.push(new state.Token("rt_close", "rt", -1));
        newChildren.push(new state.Token("rp_open", "rp", 1));
        const rp2 = new state.Token("text", "", 0);
        rp2.content = "）";
        newChildren.push(rp2);
        newChildren.push(new state.Token("rp_close", "rp", -1));
        newChildren.push(new state.Token("ruby_close", "ruby", -1));

        lastIndex = rubyRegex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        const t = new state.Token("text", "", 0);
        t.content = text.slice(lastIndex);
        newChildren.push(t);
      }
    }

    if (modified) {
      inlineToken.children = newChildren;
    }
  }
}

