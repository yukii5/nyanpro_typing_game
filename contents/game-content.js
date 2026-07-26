(function(window){
  // Data-like values that should eventually be owned by a DB/backend live here for now.
  var WORDS = [
    {kanji:"星ノ猫日和", avatar:"img/avatars/hoshino-neko-biyori.png", kana:"ほしのねこびより", pitch:1.35, rate:1.05, color:"#ff6fae",
      tokens:[["ho"],["shi","si"],["no"],["ne"],["ko"],["bi"],["yo"],["ri"]],
      boo:["もう、そこ違うよ!","ちゃんと見て打って~!"], praise:"えらい!完璧だったね!"},
    {kanji:"兎羽ましろ", avatar:"img/avatars/toba-mashiro.png", kana:"とばましろ", pitch:1.2, rate:0.95, color:"#6fd1ff",
      tokens:[["to"],["ba"],["ma"],["shi","si"],["ro"]],
      boo:["んー、惜しい。","焦りすぎだよ。"], praise:"うん、上出来。"},
    {kanji:"藍瀬ここな", avatar:"img/avatars/aise-kokona.png", kana:"あいせここな", pitch:1.1, rate:1.0, color:"#9b8bff",
      tokens:[["a"],["i"],["se"],["ko"],["ko"],["na"]],
      boo:["それは違うですぅ。","もう一回いこ?"], praise:"やったですぅ!すごい!"},
    {kanji:"桃井にゃんこ", avatar:"img/avatars/momoi-nyanko.png", kana:"ももいにゃんこ", pitch:1.5, rate:1.1, color:"#ffd166",
      tokens:[["mo"],["mo"],["i"],["nya"],["n","nn"],["ko"]],
      boo:["にゃにゃ!間違えたにゃ!","そこはちがうにゃん!"], praise:"にゃんぱねぇ!天才にゃ!"},
    {kanji:"雪代ふわり", avatar:"img/avatars/yukishiro-fuwari.png", kana:"ゆきしろふわり", pitch:1.3, rate:0.85, color:"#c9f2ff",
      tokens:[["yu"],["ki"],["shi","si"],["ro"],["fu"],["wa"],["ri"]],
      boo:["ふわ…間違えちゃった…。","ゆっくりでいいからね…?"], praise:"すごい…ちゃんとできてたよ…!"},
    {kanji:"黒猫るな", avatar:"img/avatars/kuroneko-runa.png", kana:"くろねこるな", pitch:0.85, rate:0.95, color:"#b6ff6f",
      tokens:[["ku"],["ro"],["ne"],["ko"],["ru"],["na"]],
      boo:["は?今のミスでしょ。","集中しなよ。"], praise:"…悪くないじゃん。"},
    {kanji:"花海とわ", avatar:"img/avatars/hanami-towa.png", kana:"はなみとわ", pitch:1.15, rate:1.0, color:"#4ff0c4",
      tokens:[["ha"],["na"],["mi"],["to"],["wa"]],
      boo:["あ、間違えちゃったね。","次いこっか。"], praise:"完璧だったよ、おめでとう!"},
    {kanji:"蜜柑ぽむ", avatar:"img/avatars/mikan-pomu.png", kana:"みかんぽむ", pitch:1.4, rate:1.15, color:"#ff9f6f",
      tokens:[["mi"],["ka"],["n","nn"],["po"],["mu"]],
      boo:["ぽむ!ちがうぽむ!","早とちりぽむ!"], praise:"ぽむぽむー!やったねぽむ!"},
    {kanji:"銀河ねむ", avatar:"img/avatars/ginga-nemu.png", kana:"ぎんがねむ", pitch:0.9, rate:0.8, color:"#c3b8ff",
      tokens:[["gi"],["n","nn"],["ga"],["ne"],["mu"]],
      boo:["ふぁ…間違えてる…。","おちついて…?"], praise:"すごいね…おつかれさま…。"},
    {kanji:"桜庭ゆず", avatar:"img/avatars/sakuraba-yuzu.png", kana:"さくらばゆず", pitch:1.05, rate:1.0, color:"#ffe58a",
      tokens:[["sa"],["ku"],["ra"],["ba"],["yu"],["zu"]],
      boo:["んっ、そこ違います。","落ち着いてどうぞ。"], praise:"素晴らしいです、お見事。"},
    {kanji:"深海しずく", avatar:"img/avatars/shinkai-shizuku.png", kana:"しんかいしずく", pitch:0.95, rate:0.9, color:"#7fc8ff",
      tokens:[["shi","si"],["n","nn"],["ka"],["i"],["shi","si"],["zu"],["ku"]],
      boo:["違う。よく見て。","もう一度。"], praise:"よくやった。合格。"},
    {kanji:"月見だんご", avatar:"img/avatars/tsukimi-dango.png", kana:"つきみだんご", pitch:1.25, rate:1.0, color:"#ff6f6f",
      tokens:[["tsu","tu"],["ki"],["mi"],["da"],["n","nn"],["go"]],
      boo:["だんご三兄弟、違います!","そこじゃないよ~。"], praise:"パーフェクト!お団子あげる!"}
  ];
  WORDS.forEach(function(w, i){ w.idx = i; });

  var GAME_SECONDS = 60;

  var RANK_TIERS = [
    {min:4000, label:"伝説の寿司打神"},
    {min:2500, label:"皆伝"},
    {min:1500, label:"一人前"},
    {min:800, label:"見習い卒業"},
    {min:300, label:"配信デビュー"},
    {min:0, label:"新人にゃんこ"}
  ];

  window.NYANPRO_CONTENT = {
    gameSeconds: GAME_SECONDS,
    words: WORDS,
    rankTiers: RANK_TIERS
  };
})(window);
