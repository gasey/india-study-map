// ============================================
// Kana reference chart + romaji→kana converter — ported verbatim from the
// nihongo-app prototype (src/NihongoLab.jsx). Fixed reference data, not
// user content, so it's a static module here too, same as every other
// data/*.ts file in this app.
// ============================================

export type KanaGroup = 'base' | 'dakuten' | 'yoon';
export type KanaScript = 'hiragana' | 'katakana';

/** [hiragana, katakana, romaji, group] */
export const KANA: [string, string, string, KanaGroup][] = [
  ["あ","ア","a","base"],["い","イ","i","base"],["う","ウ","u","base"],["え","エ","e","base"],["お","オ","o","base"],
  ["か","カ","ka","base"],["き","キ","ki","base"],["く","ク","ku","base"],["け","ケ","ke","base"],["こ","コ","ko","base"],
  ["さ","サ","sa","base"],["し","シ","shi","base"],["す","ス","su","base"],["せ","セ","se","base"],["そ","ソ","so","base"],
  ["た","タ","ta","base"],["ち","チ","chi","base"],["つ","ツ","tsu","base"],["て","テ","te","base"],["と","ト","to","base"],
  ["な","ナ","na","base"],["に","ニ","ni","base"],["ぬ","ヌ","nu","base"],["ね","ネ","ne","base"],["の","ノ","no","base"],
  ["は","ハ","ha","base"],["ひ","ヒ","hi","base"],["ふ","フ","fu","base"],["へ","ヘ","he","base"],["ほ","ホ","ho","base"],
  ["ま","マ","ma","base"],["み","ミ","mi","base"],["む","ム","mu","base"],["め","メ","me","base"],["も","モ","mo","base"],
  ["や","ヤ","ya","base"],["ゆ","ユ","yu","base"],["よ","ヨ","yo","base"],
  ["ら","ラ","ra","base"],["り","リ","ri","base"],["る","ル","ru","base"],["れ","レ","re","base"],["ろ","ロ","ro","base"],
  ["わ","ワ","wa","base"],["を","ヲ","wo","base"],["ん","ン","n","base"],
  ["が","ガ","ga","dakuten"],["ぎ","ギ","gi","dakuten"],["ぐ","グ","gu","dakuten"],["げ","ゲ","ge","dakuten"],["ご","ゴ","go","dakuten"],
  ["ざ","ザ","za","dakuten"],["じ","ジ","ji","dakuten"],["ず","ズ","zu","dakuten"],["ぜ","ゼ","ze","dakuten"],["ぞ","ゾ","zo","dakuten"],
  ["だ","ダ","da","dakuten"],["ぢ","ヂ","ji","dakuten"],["づ","ヅ","zu","dakuten"],["で","デ","de","dakuten"],["ど","ド","do","dakuten"],
  ["ば","バ","ba","dakuten"],["び","ビ","bi","dakuten"],["ぶ","ブ","bu","dakuten"],["べ","ベ","be","dakuten"],["ぼ","ボ","bo","dakuten"],
  ["ぱ","パ","pa","dakuten"],["ぴ","ピ","pi","dakuten"],["ぷ","プ","pu","dakuten"],["ぺ","ペ","pe","dakuten"],["ぽ","ポ","po","dakuten"],
  ["きゃ","キャ","kya","yoon"],["きゅ","キュ","kyu","yoon"],["きょ","キョ","kyo","yoon"],
  ["しゃ","シャ","sha","yoon"],["しゅ","シュ","shu","yoon"],["しょ","ショ","sho","yoon"],
  ["ちゃ","チャ","cha","yoon"],["ちゅ","チュ","chu","yoon"],["ちょ","チョ","cho","yoon"],
  ["にゃ","ニャ","nya","yoon"],["にゅ","ニュ","nyu","yoon"],["にょ","ニョ","nyo","yoon"],
  ["ひゃ","ヒャ","hya","yoon"],["ひゅ","ヒュ","hyu","yoon"],["ひょ","ヒョ","hyo","yoon"],
  ["みゃ","ミャ","mya","yoon"],["みゅ","ミュ","myu","yoon"],["みょ","ミョ","myo","yoon"],
  ["りゃ","リャ","rya","yoon"],["りゅ","リュ","ryu","yoon"],["りょ","リョ","ryo","yoon"],
  ["ぎゃ","ギャ","gya","yoon"],["ぎゅ","ギュ","gyu","yoon"],["ぎょ","ギョ","gyo","yoon"],
  ["じゃ","ジャ","ja","yoon"],["じゅ","ジュ","ju","yoon"],["じょ","ジョ","jo","yoon"],
  ["びゃ","ビャ","bya","yoon"],["びゅ","ビュ","byu","yoon"],["びょ","ビョ","byo","yoon"],
  ["ぴゃ","ピャ","pya","yoon"],["ぴゅ","ピュ","pyu","yoon"],["ぴょ","ピョ","pyo","yoon"],
];

const ROMA: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const [h, , r] of KANA) if (!(r in m)) m[r] = h; // first spelling wins (じ over ぢ)
  Object.assign(m, {
    si: "し", ti: "ち", tu: "つ", hu: "ふ", zi: "じ",
    sya: "しゃ", syu: "しゅ", syo: "しょ", tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ",
    cya: "ちゃ", cyu: "ちゅ", cyo: "ちょ", jya: "じゃ", jyu: "じゅ", jyo: "じょ",
    "-": "ー",
  });
  return m;
})();

/** Self-contained romaji → kana converter (no external library). */
export function romajiToKana(input: string): string {
  const s = (input || "").toLowerCase();
  let out = "", i = 0;
  while (i < s.length) {
    const ch = s[i], next = s[i + 1];
    if (ch === next && ch !== "n" && /[a-z]/.test(ch) && !"aeiou".includes(ch)) {
      out += "っ"; i++; continue;
    }
    if (ch === "n" && next && !"aeiouy".includes(next)) {
      out += "ん"; i++; continue;
    }
    let matched = false;
    for (let len = Math.min(3, s.length - i); len >= 1; len--) {
      const sub = s.slice(i, i + len);
      if (ROMA[sub]) { out += ROMA[sub]; i += len; matched = true; break; }
    }
    if (!matched) { out += s[i]; i++; }
  }
  return out;
}
