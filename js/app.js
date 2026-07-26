(function(){
  var CONTENT = window.NYANPRO_CONTENT || {};
  var WORDS = CONTENT.words || [];
  var GAME_SECONDS = CONTENT.gameSeconds || 60;
  var RANK_TIERS = CONTENT.rankTiers || [];
  var area = document.getElementById("game-area");
  var voiceEnabled = true;
  var bubbleTimer = null;

  var state = null;

  // 画面状態をbodyへ反映し、開始・プレイ・結果ごとのレイアウトを切り替える。
  function setScreenMode(mode){
    document.body.setAttribute("data-game-screen", mode);
  }

  function pickWord(excludeKanji){
    var pool = WORDS.filter(function(w){return w.kanji !== excludeKanji;});
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function escapeHtml(value){
    var replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return String(value).replace(/[&<>"']/g, function(ch){
      return replacements[ch];
    });
  }

  function avatarImg(word){
    var src = word && word.avatar ? word.avatar : "img/avatar-placeholder.png";
    var alt = word && word.kanji ? word.kanji : "";
    return '<img class="avatar-img" src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '">';
  }

  // NOTE: real voice-actor audio files are not included in this test build.
  // speak() uses the browser's built-in speech synthesis as a stand-in so the
  // trigger logic (boo on mistake / praise on perfect word) can be tested.
  // Swap this for `new Audio(word.booFile).play()` etc. once real clips exist.
  function speak(text, pitch, rate){
    showBubble(text);
    if(!voiceEnabled) return;
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.pitch = pitch;
    u.rate = rate;
    var voices = window.speechSynthesis.getVoices();
    var jaVoice = voices.filter(function(v){return v.lang === "ja-JP";})[0];
    if(jaVoice) u.voice = jaVoice;
    window.speechSynthesis.speak(u);
  }

  function showBubble(text){
    var el = document.getElementById("voice-bubble");
    if(!el) return;
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function(){ el.classList.remove("show"); }, 1800);
  }

  function computeRank(score){
    for(var i=0;i<RANK_TIERS.length;i++){
      if(score >= RANK_TIERS[i].min) return RANK_TIERS[i].label;
    }
    return RANK_TIERS[RANK_TIERS.length-1].label;
  }

  function renderStart(){
    setScreenMode("start");
    area.innerHTML =
      '<div class="stage start-screen">' +
        '<div class="kanji">ROMAJI RUSH</div>' +
        '<p>表示された名前のローマ字を' + GAME_SECONDS + '秒間、できるだけ多く打ち込もう。<br>' +
        '間違えるとその子に怒られて、ノーミスで打ち切ると褒めてもらえるよ。</p>' +
        '<button class="primary" id="start-btn">スタート</button>' +
      '</div>';
    document.getElementById("start-btn").onclick = startGame;
  }

  var voiceBtn = document.getElementById("voice-toggle-btn");
  voiceBtn.onclick = function(){
    voiceEnabled = !voiceEnabled;
    voiceBtn.textContent = voiceEnabled ? "ボイス ON" : "ボイス OFF";
    voiceBtn.className = "voice-toggle " + (voiceEnabled ? "on" : "off");
    if(!voiceEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  function startGame(){
    state = {
      timeLeft: GAME_SECONDS,
      score: 0,
      combo: 0,
      bestCombo: 0,
      completed: 0,
      totalChars: 0,
      tokenIndex: 0,
      buffer: "",
      confirmed: "",
      current: pickWord(null),
      mistakesThisWord: 0,
      collected: [],
      startedAt: Date.now(),
      timer: null
    };
    renderGame();
    state.timer = setInterval(tick, 1000);
    window.addEventListener("keydown", handleKey);
  }

  function tick(){
    state.timeLeft -= 1;
    if(state.timeLeft <= 0){
      state.timeLeft = 0;
      endGame();
      return;
    }
    updateHud();
  }

  function endGame(){
    clearInterval(state.timer);
    window.removeEventListener("keydown", handleKey);
    setScreenMode("result");
    var cps = (state.totalChars / GAME_SECONDS).toFixed(2);
    var rank = computeRank(state.score);
    var galleryHtml = state.collected.map(function(c){
      return '<div class="gicon">' + avatarImg(c) + '</div>';
    }).join("");

    area.innerHTML =
      '<div class="stage result-screen">' +
        '<div class="kanji">RESULT</div>' +
        '<div class="rank-badge">今回のランク<span class="rank-title">' + rank + '</span></div>' +
        '<div class="result-grid">' +
          '<div class="hud-card score"><div class="label">スコア</div><div class="value">' + state.score + '</div></div>' +
          '<div class="hud-card"><div class="label">お皿(正解数)</div><div class="value">' + state.completed + '</div></div>' +
          '<div class="hud-card combo"><div class="label">最大コンボ</div><div class="value">' + state.bestCombo + '</div></div>' +
          '<div class="hud-card"><div class="label">打鍵速度</div><div class="value">' + cps + '</div></div>' +
        '</div>' +
        '<div class="gallery">' +
          '<div class="label">集まったVTuberアイコン</div>' +
          '<div class="gallery-grid">' + (galleryHtml || '<span class="empty-gallery">まだいません</span>') + '</div>' +
        '</div>' +
        '<button class="primary" id="retry-btn">もう一度あそぶ</button>' +
      '</div>';
    document.getElementById("retry-btn").onclick = renderStart;
  }

  function renderGame(){
    setScreenMode("playing");
    area.innerHTML =
      '<div class="hud">' +
        '<div class="hud-card time"><div class="label">残り時間</div><div class="value" id="hud-time">' + state.timeLeft + '</div></div>' +
        '<div class="hud-card score"><div class="label">スコア</div><div class="value" id="hud-score">' + state.score + '</div></div>' +
        '<div class="hud-card combo"><div class="label">コンボ</div><div class="value" id="hud-combo">' + state.combo + '</div></div>' +
      '</div>' +
      '<div class="timebar-outer"><div class="timebar-inner" id="timebar"></div></div>' +
      '<div class="stage">' +
        '<div class="plate"><img class="plate-img" src="img/sushi.png" alt=""></div>' +
        '<div class="kanji" id="cur-kanji">' + state.current.kanji + '</div>' +
        '<div class="kana" id="cur-kana">' + state.current.kana + '</div>' +
        '<div class="romaji" id="cur-romaji"></div>' +
        '<div class="hint">キーボードでそのままローマ字入力してね</div>' +
        '<div class="voice-bubble" id="voice-bubble"></div>' +
        '<div class="get-effect" id="get-effect"></div>' +
      '</div>' +
      '<div class="gallery">' +
        '<div class="label">獲得アイコン</div>' +
        '<div class="gallery-grid" id="gallery-grid"></div>' +
      '</div>';
    renderRomaji();
  }

  function currentDisplaySuffix(){
    var tokens = state.current.tokens;
    var token = tokens[state.tokenIndex];
    var restCurrent = "";
    if(token){
      var candidates = token.filter(function(v){ return v.indexOf(state.buffer) === 0; });
      var chosen = candidates.length ? candidates[0] : token[0];
      restCurrent = chosen.slice(state.buffer.length);
    }
    var restFuture = tokens.slice(state.tokenIndex + 1).map(function(t){ return t[0]; }).join("");
    return restCurrent + restFuture;
  }

  function renderRomaji(){
    var doneHtml = '<span class="done">' + state.confirmed + state.buffer + '</span>';
    var restHtml = '<span class="rest">' + currentDisplaySuffix() + '</span>';
    document.getElementById("cur-romaji").innerHTML = doneHtml + restHtml;
  }

  function updateHud(){
    document.getElementById("hud-time").textContent = state.timeLeft;
    document.getElementById("hud-score").textContent = state.score;
    document.getElementById("hud-combo").textContent = state.combo;
    document.getElementById("timebar").style.width = (state.timeLeft / GAME_SECONDS * 100) + "%";
  }

  function flashWrong(){
    var el = document.getElementById("cur-romaji");
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }

  function spawnIcon(word){
    state.collected.push({kanji: word.kanji, kana: word.kana, avatar: word.avatar});
    var grid = document.getElementById("gallery-grid");
    var el = document.createElement("div");
    el.className = "gicon";
    el.innerHTML = avatarImg(word);
    grid.appendChild(el);
  }

  function playGetEffect(word){
    var el = document.getElementById("get-effect");
    if(!el) return;
    el.innerHTML =
      '<div class="get-icon">' + avatarImg(word) + '</div>' +
      '<div class="get-label">GET!</div>';
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
  }

  function finishWord(){
    state.score += 30;
    state.completed += 1;
    playGetEffect(state.current);
    spawnIcon(state.current);
    if(state.mistakesThisWord === 0){
      speak(state.current.praise, state.current.pitch, state.current.rate);
    }
    var finishedKanji = state.current.kanji;
    state.current = pickWord(finishedKanji);
    state.mistakesThisWord = 0;
    state.tokenIndex = 0;
    state.buffer = "";
    state.confirmed = "";
    document.getElementById("cur-kanji").textContent = state.current.kanji;
    document.getElementById("cur-kana").textContent = state.current.kana;
    renderRomaji();
    updateHud();
  }

  function acceptKey(){
    state.combo += 1;
    state.score += 10;
    if(state.combo > state.bestCombo) state.bestCombo = state.combo;
    state.totalChars += 1;
    renderRomaji();
    updateHud();
  }

  function wrongKey(){
    state.combo = 0;
    state.mistakesThisWord += 1;
    updateHud();
    flashWrong();
    var booLines = state.current.boo;
    var line = booLines[Math.floor(Math.random() * booLines.length)];
    speak(line, state.current.pitch, state.current.rate);
  }

  function handleKey(e){
    if(!state || state.timeLeft <= 0) return;
    var key = e.key;
    if(key.length !== 1 || !/[a-zA-Z]/.test(key)) return;
    key = key.toLowerCase();

    var tokens = state.current.tokens;

    for(var guard = 0; guard < tokens.length + 1; guard++){
      var token = tokens[state.tokenIndex];
      if(!token) return;

      var tentative = state.buffer + key;
      var candidates = token.filter(function(v){ return v.indexOf(tentative) === 0; });

      if(candidates.length > 0){
        state.buffer = tentative;
        acceptKey();
        if(candidates.length === 1 && candidates[0] === state.buffer){
          state.confirmed += state.buffer;
          state.tokenIndex += 1;
          state.buffer = "";
          if(state.tokenIndex === tokens.length){
            finishWord();
          }
        }
        return;
      }

      // Can't extend the current token with this key. If the buffer already
      // equals one of the token's accepted spellings (e.g. "n" when "nn" was
      // also possible), finalize it and try this same key on the next token.
      if(state.buffer !== "" && token.indexOf(state.buffer) !== -1){
        state.confirmed += state.buffer;
        state.tokenIndex += 1;
        state.buffer = "";
        if(state.tokenIndex === tokens.length){
          finishWord();
          return;
        }
        continue;
      }

      wrongKey();
      return;
    }
  }

  renderStart();
})();
