// ===== 요괴록 — 조선 요괴 토벌기 · 화면·계정·가챠 =====
"use strict";
const GAME_VERSION = "3.4.2";
// 자동 업데이트: 게임이 올라가 있는 주소 (빌드 때 채움). 더 새 판이 있으면 알려 줌
const UPDATE_URL = "https://wjdaudrn091600-ai.github.io/yogoerok/";
const verNum = (v) => String(v).split(".").reduce((a, x) => a * 1000 + (+x || 0), 0);
// PC 앱 설치 (11-12): 웹에서 들어오면 '앱으로 설치' — 브라우저 설치 창, 안 되면 바로가기 만드는 파일 내려받기
let installEvt = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; });
if (window.isSecureContext && /^https?:/.test(location.protocol) && "serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").then(() => { if (navigator.serviceWorker.controller || !window.caches) return; const cu = [...document.scripts].map((s) => (s.textContent.match(/core\.json\?h=[0-9a-f]+/) || [])[0]).find(Boolean); if (cu) setTimeout(() => caches.open("yogoerok-1").then((c) => c.add(cu)).catch(() => { }), 8000); }).catch(() => { }); // 첫 방문 때 받은 core 도 보관 (HTTP 캐시에서 바로 옴)
const isWebPlay = () => location.protocol.startsWith("http") && !matchMedia("(display-mode: standalone)").matches && !/; wv\)|Android.*Version\/[\d.]+ Chrome/.test(navigator.userAgent) && !/Android|iPhone|iPad/i.test(navigator.userAgent);
function installPc() {
  if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(() => { installEvt = null; }); return; }
  UI.modal(`<h2>💻 PC에서 앱처럼 실행하기</h2><p style="line-height:1.9;text-align:center">① 아래 파일을 받아 실행하면 바탕화면에 <b>요괴록</b> 바로가기가 생겨요.<br>(브라우저 주소창 없이 게임 창으로 열리고, 항상 최신판이에요)</p>
    <div class="center"><a class="btn gold" href="yogoerok_pc_shortcut.cmd" download="요괴록_바로가기_만들기.cmd">📥 바로가기 만들기 파일 받기</a></div>
    <p class="muted" style="text-align:center;font-size:.85rem">② 또는 엣지·크롬 주소창 오른쪽의 '앱 설치' 아이콘(⊕)을 눌러도 돼요.<br>Windows가 '알 수 없는 파일' 경고를 띄우면 '추가 정보 → 실행'을 눌러 주세요.</p>
    <div class="center"><button class="btn" id="ipok">닫기</button></div>`);
  $("#ipok").onclick = () => UI.closeModal();
}
// 자동 업데이트 (11-14 사용자: 모바일에서 자동 업데이트가 안 되는 것 같음) — 켤 때 한 번만 확인하던 것을,
// 화면이 다시 보일 때마다·10분마다 확인한다. 판 도중이면 알림만 띄우고 판이 끝나 처음 화면에 오면 새로 읽는다.
let _updPending = null;
function applyUpdate(ver, note) {
  if (typeof OPS !== "undefined" && OPS.update === "batch" && !applyUpdate.go) { opsUpdateGate(ver, note); return; }
  if (G) { if (_updPending !== ver) { _updPending = ver; UI.toast(`🆕 새 버전 v${ver} — 이번 판이 끝나면 자동으로 바뀌어요`, 5000); } return; }
  const k = "dbm_reload_" + ver; let n = 0; try { n = +(sessionStorage.getItem(k) || 0); if (n >= 2) return; sessionStorage.setItem(k, n + 1); } catch (e) { }
  if (typeof saveGame === "function") saveGame(); if (typeof CLOUD !== "undefined" && CLOUD.on) CLOUD.push(true);
  setTimeout(() => location.replace(UPDATE_URL + "?v=" + encodeURIComponent(ver) + "&t=" + Date.now()), 400);
}
setInterval(() => { if (_updPending && !G) applyUpdate(_updPending); }, 3000);
setInterval(() => checkUpdate(), 10 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) checkUpdate(); });
function checkUpdate() {
  // 온라인판(앱 포함)이 예전 캐시면 새 버전으로 다시 읽기 (11-12: 업데이트 즉시 반영)
  if (UPDATE_URL && location.href.startsWith(UPDATE_URL)) {
    fetch(UPDATE_URL + "version.json?t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()).then((j) => {
      if (verNum(j.version) <= verNum(GAME_VERSION)) return;
      applyUpdate(j.version, j.note);
    }).catch(() => { });
    return;
  }
  if (!UPDATE_URL) return;
  fetch(UPDATE_URL + "version.json?t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()).then((j) => {
    if (verNum(j.version) <= verNum(GAME_VERSION)) return;
    const d = document.createElement("div"); d.className = "toast"; d.style.pointerEvents = "auto";
    d.innerHTML = `🆕 새 버전 v${esc(j.version)}이 나왔어요 — <a href="${UPDATE_URL}" target="_blank" style="color:var(--gem)">온라인 최신판 열기</a> · <a href="${UPDATE_URL}${encodeURI("요괴록.html")}" download style="color:var(--gem)">파일 받기</a>${j.note ? "<br><small>" + esc(j.note) + "</small>" : ""}`;
    $("#toasts").appendChild(d); setTimeout(() => d.remove(), 15000);
  }).catch(() => { });
}
let SAVE = null, ACCOUNT = null;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } } };
const imgSrc = (k) => (ASSETS.img[k] || "");
// 평면 이모지 → 3D 아이콘 (사용자 요청 11-11: 🐉⚔️ 같은 1차원 그림이 게임 컨셉과 안 맞음). 화면에 글자로 나오는 이모지를 자동으로 그림으로 바꿈
const EMO = {"✔️": "emo_check", "✔": "emo_check", "⚡": "emo_burst", "✨": "emo_stars", "⏳": "sign_trial", "🕯️": "emo_lantern", "🕯": "emo_lantern", "🎴": "emo_dice", "👣": "bn_spd", "🧵": "bn_cdr", "⛵": "bn_phoenixPerk", "⭐": "emo_stars", "🌪️": "emo_gust", "🌪": "emo_gust", "☯️": "emo_orb", "☯": "emo_orb", "🎯": "emo_target", "⚔️": "emo_duel", "⚔": "emo_duel", "🐉": "emo_dragon", "🐲": "emo_dragon", "🛠": "emo_tools", "🛠️": "emo_tools", "🏷️": "emo_tag", "🏷": "emo_tag", "📖": "emo_book", "♾️": "emo_infinity", "♾": "emo_infinity", "📜": "emo_scroll", "🐾": "emo_paw", "🧑‍🤝‍🧑": "ui_ic_chars", "🧑": "ui_ic_chars", "👥": "ui_ic_multi", "🔊": "ui_ic_sound", "💰": "cur_yeop", "🪙": "cur_coin", "🟡": "cur_gold", "🔓": "emo_unlock", "🔒": "emo_lock", "🔮": "emo_orb", "🏮": "emo_lantern", "🎰": "ui_ic_gacha", "🎁": "emo_gift", "⌨️": "emo_keyboard", "⌨": "emo_keyboard", "🎮": "emo_gamepad", "👤": "ui_ic_user", "🎒": "ui_ic_bag", "⬆️": "emo_up", "📅": "emo_calendar", "🗓️": "emo_calendar", "📆": "emo_calendar", "🏆": "emo_trophy", "⚠️": "emo_warn", "🌿": "emo_herb", "🤝": "emo_coop", "❓": "ui_ic_howto", "⚙️": "ui_ic_settings", "🎲": "emo_dice", "🖱️": "emo_mouse", "💥": "emo_burst", "✅": "emo_check", "📱": "emo_phone", "🚪": "emo_door", "⏸": "ui_ic_pause", "⏸️": "ui_ic_pause", "🗡️": "emo_dagger", "🛡️": "emo_shield", "🌅": "emo_sunrise", "🌙": "emo_moon", "🪞": "emo_mirror", "💀": "emo_skull", "☠": "emo_skull", "☠️": "emo_skull", "👻": "emo_ghost", "💫": "emo_stars", "🔥": "emo_fire", "📕": "emo_redbook", "🪓": "emo_axe", "💗": "emo_heart", "🌑": "emo_eclipse", "🩸": "emo_blood", "🥀": "emo_wither", "💨": "emo_gust", "🗺️": "emo_map", "✉️": "emo_mail", "👊": "emo_fist", "👑": "emo_crown"};
const EMO_KEYS = Object.keys(EMO).filter((k) => ASSETS.img[EMO[k]]).sort((a, b) => b.length - a.length);
const EMO_RE = EMO_KEYS.length ? new RegExp(EMO_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g") : null;
const EMO_LEFT = /\p{Extended_Pictographic}/u, EMO_LEFT_G = /\p{Extended_Pictographic}️?/gu;
const noEmo = (s) => (typeof s === "string" ? s.replace(EMO_LEFT_G, (x) => (EMO[x] && ASSETS.img[EMO[x]] ? x : "")).replace(/\s{2,}/g, " ").trim() : s);
function emojify(root) {
  if (!EMO_RE || !root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentNode && /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|TITLE)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
  const hits = []; let n; while ((n = w.nextNode())) { if (EMO_LEFT.test(n.nodeValue)) { n.nodeValue = n.nodeValue.replace(EMO_LEFT_G, (x) => (EMO[x] && ASSETS.img[EMO[x]] ? x : "")).replace(/^\s+(?=\S)/, (sp) => (n.previousSibling ? sp : "")); } EMO_RE.lastIndex = 0; if (EMO_RE.test(n.nodeValue)) hits.push(n); } // 11-20 그린 아이콘이 없는 이모지는 지움
  for (const t of hits) {
    const frag = document.createDocumentFragment(), s = t.nodeValue; let last = 0; EMO_RE.lastIndex = 0; let m;
    while ((m = EMO_RE.exec(s))) { if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index))); const im = document.createElement("img"); im.src = ASSETS.img[EMO[m[0]]]; im.alt = ""; im.className = "emo3d"; frag.appendChild(im); last = m.index + m[0].length; }
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    t.parentNode.replaceChild(frag, t);
  }
}
if (EMO_RE) { let pend = false; new MutationObserver(() => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; emojify(document.body); }); }).observe(document.body, { childList: true, subtree: true, characterData: true }); }
// 캔버스 글자의 앞 이모지도 그림으로 (배너·방 이름)
function emoSplit(text) { if (!EMO_RE || !text) return [null, text]; EMO_RE.lastIndex = 0; const m = EMO_RE.exec(text); if (!m || m.index !== 0) return [null, text]; return [ASSETS.img[EMO[m[0]]], text.slice(m[0].length).trimStart()]; }
// UI 그림 (버튼·창 테두리·메뉴 아이콘) — 사용자 요청 11-11
const uiIc = (k, fb) => (ASSETS.img["ui_ic_" + k] ? `<img class="uiic" src="${ASSETS.img["ui_ic_" + k]}" alt="">` : fb);
(function uiSkin() {
  const st = document.documentElement.style; let n = 0;
  for (const k of ["ui_btn_gold", "ui_btn_dark", "ui_btn_blue", "ui_panel"]) if (ASSETS.img[k]) { st.setProperty("--" + k.replace(/_/g, "-"), `url(${ASSETS.img[k]})`); n++; }
  if (n === 4) document.body.classList.add("skin");
})();
// 능력 아이콘: 그림이 있으면 그림, 없으면 이모지
// 테두리 색: 가챠 스킬은 등급, 액티브는 단계, 패시브는 희귀도, 캐릭터 스킬은 금색
const abCol = (key) => key.startsWith("gs_") && SKILLS[key.slice(3)] ? SK_GRADE[SKILLS[key.slice(3)].grade].col : key.startsWith("ic_") && ACTIVES[key.slice(3)] ? ACT_TIER[ACTIVES[key.slice(3)].rar].col : key.startsWith("bn_") && BOONS[key.slice(3)] ? RARITY[BOONS[key.slice(3)].rar].col : "#c9a25a";
const abIc = (key, emoji, px) => (ASSETS.img[key] ? `<img src="${ASSETS.img[key]}" alt="" style="width:${px || 40}px;height:${px || 40}px;border-radius:9px;object-fit:cover;vertical-align:middle;border:2px solid ${abCol(key)};box-shadow:0 0 8px ${abCol(key)}66">` : emoji);
const curIc = (k) => (ASSETS.img["cur_" + k] ? `<img src="${ASSETS.img["cur_" + k]}" alt="" style="width:1.35em;height:1.35em;object-fit:contain;vertical-align:-0.35em">` : { coin: "🪙", yeop: "💰", gold: "🟡" }[k]);

// ---------- 계정 ----------
const DEV_ID = "1234", DEV_PW = "1234", DEV_OK = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname); // 11-21 개발자 계정은 이 PC 안(개발자 시험 파일·로컬 서버)에서만 — 실제 주소에선 막음
const nick = () => (SAVE && SAVE.nick) || ACCOUNT || "";
const cleanNick = (s) => String(s || "").replace(/[<>"'&]/g, "").trim().slice(0, 12);
function hashPw(id, pw) { let h = 2166136261; const s = "dbm2|" + id + "|" + pw; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + s.length; }
function accounts() { try { return JSON.parse(ls.get("dbm2_accounts") || "{}"); } catch (e) { return {}; } }

// ---------- PC·폰 자동 연동 (사용자 요청 11-12): 계정 저장을 Firebase 서버에 둠 ----------
// 같은 아이디·비밀번호로 로그인하면 어느 기기든 더 최근 저장으로 맞춰지고, 하는 동안 자동으로 서버에 올라감. 인터넷이 안 되면 이 기기 저장으로 진행.
const CLOUD = {
  key: "AIzaSyB_3fTrUPROs70D1B4Df8hD7PwFSZgCtDc", proj: "yogoerok",
  uid: null, tok: null, rt: null, exp: 0, dirty: false, timer: null, busy: false, on: false,
  email(id) { return "u" + Array.from(new TextEncoder().encode(id)).map((b) => b.toString(16).padStart(2, "0")).join("") + "@yogoerok.game"; },
  async api(path, body) {
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 8000);
    try { const r = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:" + path + "?key=" + this.key, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl.signal }); return await r.json(); }
    finally { clearTimeout(tm); }
  },
  setTok(j) { this.uid = j.localId; this.tok = j.idToken; this.rt = j.refreshToken; this.exp = Date.now() + (+j.expiresIn || 3600) * 1000 - 60000; this.on = true; },
  async token() {
    if (this.tok && Date.now() < this.exp) return this.tok;
    const r = await fetch("https://securetoken.googleapis.com/v1/token?key=" + this.key, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(this.rt) });
    const j = await r.json(); if (!j.id_token) throw new Error("token"); this.tok = j.id_token; this.rt = j.refresh_token; this.exp = Date.now() + (+j.expires_in || 3600) * 1000 - 60000; return this.tok;
  },
  doc() { return `https://firestore.googleapis.com/v1/projects/${this.proj}/databases/(default)/documents/saves/${this.uid}`; },
  // 로그인: 결과 { ok, cloud(서버 저장 or null), err, offline }
  async signIn(id, pw, create, localOk) {
    const em = this.email(id), cp = "ygr:" + pw;
    try {
      if (create) { const j = await this.api("signUp", { email: em, password: cp, returnSecureToken: true }); if (j.idToken) { this.setTok(j); return { ok: true, cloud: null }; } return { err: /EMAIL_EXISTS/.test(j.error && j.error.message) ? "이미 있는 아이디예요" : "계정을 만들지 못했어요 (" + ((j.error && j.error.message) || "?") + ")" }; }
      let j = await this.api("signInWithPassword", { email: em, password: cp, returnSecureToken: true });
      if (!j.idToken) {
        const m = (j.error && j.error.message) || "";
        if (/TOO_MANY/.test(m)) return { err: "잠시 뒤에 다시 해 주세요 (로그인 시도가 너무 많아요)" };
        if (!localOk) return { err: "아이디 또는 비밀번호가 달라요" };
        // 이 기기에만 있던 계정 → 서버에 처음 올리기
        j = await this.api("signUp", { email: em, password: cp, returnSecureToken: true });
        if (!j.idToken) return { err: /EMAIL_EXISTS/.test(j.error && j.error.message) ? "비밀번호가 달라요" : "로그인하지 못했어요" };
        this.setTok(j); return { ok: true, cloud: null };
      }
      this.setTok(j); return { ok: true, cloud: await this.pull() };
    } catch (e) { return { offline: true }; }
  },
  async pull() {
    const r = await fetch(this.doc(), { headers: { Authorization: "Bearer " + (await this.token()) } });
    if (r.status === 404) return null; if (!r.ok) throw new Error("pull " + r.status);
    const j = await r.json(), f = j.fields || {}; try { return { t: +((f.t && f.t.integerValue) || 0), save: JSON.parse(f.data.stringValue) }; } catch (e) { return null; }
  },
  async push(keep) {
    if (!this.on || !ACCOUNT || !SAVE || ACCOUNT === DEV_ID) return;
    if (this.inflight && !keep) { this.again = true; return this.inflight; }
    this.inflight = this._push(keep); try { await this.inflight; } finally { this.inflight = null; }
    if (this.again) { this.again = false; return this.push(); }
  },
  async _push(keep) {
    this.dirty = false;
    try {
      const body = JSON.stringify({ fields: { data: { stringValue: JSON.stringify(SAVE) }, t: { integerValue: String(SAVE.t || Date.now()) }, ver: { stringValue: GAME_VERSION } } });
      const r = await fetch(this.doc(), { method: "PATCH", keepalive: !!keep && body.length < 60000, headers: { "Content-Type": "application/json", Authorization: "Bearer " + (await this.token()) }, body });
      if (!r.ok) this.dirty = true;
    } catch (e) { this.dirty = true; }
    return true;
  },
  later() { if (!this.on) return; this.dirty = true; if (!this.timer) this.timer = setTimeout(() => { this.timer = null; this.push(); }, G ? 180000 : 20000); }, // 11-22 서버비: 판 도중 3분·메뉴 20초에 한 번(예전 6초). 판 끝·앱 내릴 때·로그아웃·결제는 바로 올림
  off() { clearTimeout(this.timer); this.timer = null; Object.assign(this, { uid: null, tok: null, rt: null, on: false, dirty: false }); },
  // 다른 기기에서 더 최근에 했으면 (판 밖에 있을 때) 받아 오기
  async refresh() {
    if (!this.on || G || this.busy || !ACCOUNT) return; if (Date.now() - (this._rt || 0) < 300000) return; this._rt = Date.now(); this.busy = true; // 11-22 다른 기기 확인은 5분에 한 번(읽기 줄임)
    try { const c = await this.pull(); if (c && c.save && c.t > (SAVE.t || 0) + 1000 && !G) { ls.set("dbm2_save_" + ACCOUNT, JSON.stringify(c.save)); SAVE = loadAccount(ACCOUNT); sfxVol = SAVE.settings.sfx; UI.toast("☁️ 다른 기기에서 한 진행을 받아 왔어요", 3500); UI.menu(); } } catch (e) { }
    this.busy = false;
  },
};
document.addEventListener("visibilitychange", () => { if (document.hidden) { if (CLOUD.dirty || CLOUD.timer) CLOUD.push(true); } else CLOUD.refresh(); });
window.addEventListener("pagehide", () => { if (CLOUD.on) CLOUD.push(true); });
function freshSave() {
  return { v: 1, coins: 5, gold: 0, chars: { musa: 1 }, stars: {}, shards: {}, enh: {}, pity: 0, skills: {}, skillEquip: {}, arts: {}, pets: {}, titles: {},
    equip: { arts: [null, null], pet: null, title: null, story: null }, stats: { kills: 0, bosses: 0, rooms: 0, maxLevel: 0, endlessBest: 0, duelWins: 0, pulls: 0 },
    epoch: SAVE_EPOCH, missions: {}, story: { maxFloor: 1, seen: {} }, eggs: {}, daily: { day: "", streak: 0 }, tutorial: false, shop: { day: "", bought: 0 }, sel: "musa", endlessRewarded: 0, settings: { vol: 0.55, sfx: 0.35, music: true } };
}
function devSave(s) {
  s.coins = Math.max(s.coins, 9999); s.gold = Math.max(s.gold, 99999);
  for (const c of CHARS) { s.chars[c.id] = 1; s.shards[c.id] = Math.max(s.shards[c.id] || 0, 200); }
  for (const k of SKILL_KEYS) s.skills[k] = Math.max(s.skills[k] || 0, 1);
  for (const k of ART_KEYS) s.arts[k] = Math.max(s.arts[k] || 0, 1);
  for (const k of PET_KEYS) s.pets[k] = Math.max(s.pets[k] || 0, 1);
  for (const k of TITLE_KEYS) s.titles[k] = 1;
  s.story.maxFloor = FLOORS.length; return s;
}
// 정식판 초기화 (사용자 요청 11-12): 그동안의 진행은 테스트로 보고 모든 계정을 처음 상태로 한 번 되돌림 — 닉네임·소리·키 설정은 유지, 개발자 계정 제외
const SAVE_EPOCH = 2;
function loadAccount(id) {
  let s; try { s = JSON.parse(ls.get("dbm2_save_" + id) || "null"); } catch (e) { s = null; }
  if (s && id !== DEV_ID && (s.epoch || 1) < SAVE_EPOCH) { const keep = { nick: s.nick, settings: s.settings, keys: s.keys }; s = Object.assign(freshSave(), JSON.parse(JSON.stringify(keep))); s.epoch = SAVE_EPOCH; s.resetNotice = 1; }
  const base = freshSave();
  if (!s) s = base; else { for (const k in base) if (s[k] === undefined) s[k] = base[k]; for (const k in base.stats) if (s.stats[k] === undefined) s.stats[k] = 0; s.settings = Object.assign(base.settings, s.settings || {}); }
  for (const [store, T] of [["arts", ARTIFACTS], ["pets", PETS], ["titles", TITLES]]) for (const k in s[store]) if (!T[k]) delete s[store][k];
  s.equip.arts = (s.equip.arts || [null, null]).map((k) => (k && ARTIFACTS[k] ? k : null)); if (s.equip.pet && !PETS[s.equip.pet]) s.equip.pet = null; if (s.equip.title && !TITLES[s.equip.title]) s.equip.title = null; if (s.equip.story && !ARTIFACTS[s.equip.story]) s.equip.story = null; if (s.equip.story === undefined) s.equip.story = null;
  s.shards = s.shards || {}; s.enh = s.enh || {}; for (const k in s.stars || {}) { s.enh[k] = Math.max(s.enh[k] || 0, Math.min(SHARD.maxEnh, s.stars[k] * 2)); } s.stars = {};
  if (id === DEV_ID) devSave(s);
  return s;
}
// 내용이 바뀌었을 때만 저장 시각을 새로 찍음 (그래야 PC·폰 중 실제로 더 최근에 한 쪽이 이김)
let _saveJs = "";
function saveGame() { if (!(ACCOUNT && SAVE)) return; const t0 = SAVE.t; SAVE.t = 0; const js = ACCOUNT + JSON.stringify(SAVE); SAVE.t = t0; if (js === _saveJs) return; _saveJs = js; SAVE.t = Date.now(); ls.set("dbm2_save_" + ACCOUNT, JSON.stringify(SAVE)); CLOUD.later(); }
function login(id, pw, create, nk) {
  id = id.trim(); if (!id || !pw) return "아이디와 비밀번호를 넣어 주세요";
  if (id.length > 20) return "아이디는 20자까지";
  const acc = accounts();
  if (id === DEV_ID) { if (!DEV_OK) return "사용할 수 없는 아이디예요"; if (pw !== DEV_PW) return "비밀번호가 달라요"; }
  else if (create) { if (acc[id]) return "이미 있는 아이디예요"; if (pw.length < 4) return "비밀번호는 4자 이상"; acc[id] = hashPw(id, pw); ls.set("dbm2_accounts", JSON.stringify(acc)); }
  else { if (!acc[id]) return "없는 아이디예요. '새 계정 만들기'를 눌러 주세요"; if (acc[id] !== hashPw(id, pw)) return "비밀번호가 달라요"; }
  ACCOUNT = id; SAVE = loadAccount(id); if (create && cleanNick(nk)) SAVE.nick = cleanNick(nk); if (id === DEV_ID && !SAVE.nick) SAVE.nick = "개발자"; if (id === DEV_ID) { SAVE.endlessHard = 1; SAVE.endlessHell = 1; } ls.set("dbm2_last", id); saveGame();
  sfxVol = SAVE.settings.sfx;
  return null;
}

// 로그인 뒤 처음 화면으로 (손으로 로그인·자동 로그인 같이 씀)
function afterLogin() {
  try { startAudio(); } catch (e) { } checkUnlocks(); if (window._logoEgg && !SAVE.eggs.logo) { SAVE.eggs.logo = 1; SAVE.coins += 3; saveGame(); setTimeout(() => UI.toast("🏮 비밀 쪽지 보상 · 코인 +3", 3500), 400); } UI.menu(); if (!SAVE.nick) UI.askNick(); else UI.daily(); if (ACCOUNT === DEV_ID) UI.toast("개발자 계정 · 모든 것이 해금되어 있어요", 3500); if (SAVE.resetNotice) { delete SAVE.resetNotice; saveGame(); setTimeout(() => UI.modal(`<h2>📖 요괴록 정식판 시작</h2><p style="text-align:center">그동안의 진행은 시험판 기록이라 모든 계정이 처음 상태로 돌아갔어요.<br>닉네임과 소리·키 설정은 그대로예요. 새로 시작하는 토벌, 잘 부탁해요!</p><div class="center"><button class="btn gold" id="rsok">확인</button></div>`) || ($("#rsok").onclick = () => UI.closeModal()), 300); }
}
// 자동 로그인 (사용자 요청 11-13): 이 기기에 '로그인 상태'를 남겨 다음에 켜면 바로 시작. 비밀번호는 저장하지 않고 서버 로그인 토큰(새로 고침용)과 확인 값만 남긴다.
function rememberLogin(on, id, pw) {
  if (!on) { ls.set("ygr_auto", ""); ls.set("ygr_auto_off", "1"); return; }
  ls.set("ygr_auto_off", "");
  ls.set("ygr_auto", JSON.stringify({ id: String(id).trim(), h: hashPw(String(id).trim(), pw), rt: CLOUD.on ? CLOUD.rt : null, uid: CLOUD.on ? CLOUD.uid : null, dev: String(id).trim() === DEV_ID ? pw : null }));
}
async function autoLogin() {
  let a = null; try { a = JSON.parse(ls.get("ygr_auto") || "null"); } catch (e) { }
  if (!a || !a.id) return false;
  if (a.id === DEV_ID) { if (!DEV_OK) { ls.set("ygr_auto", ""); return false; } if (login(a.id, a.dev || "", false)) return false; return true; }
  const acc = accounts(); if (!acc[a.id] || acc[a.id] !== a.h) { ls.set("ygr_auto", ""); return false; }
  if (a.rt) {
    try {
      CLOUD.rt = a.rt; CLOUD.uid = a.uid; CLOUD.tok = null; CLOUD.exp = 0; await CLOUD.token(); CLOUD.on = true;
      const c = await CLOUD.pull(); let local = null; try { local = JSON.parse(ls.get("dbm2_save_" + a.id) || "null"); } catch (e) { }
      if (c && c.save && (!local || (c.t || 0) >= (local.t || 0))) ls.set("dbm2_save_" + a.id, JSON.stringify(c.save));
      a.rt = CLOUD.rt; ls.set("ygr_auto", JSON.stringify(a));
    } catch (e) { CLOUD.off(); }
  }
  ACCOUNT = a.id; SAVE = loadAccount(a.id); ls.set("dbm2_last", a.id); saveGame(); if (CLOUD.on) CLOUD.push(); sfxVol = SAVE.settings.sfx;
  return true;
}

// 서버 연동 로그인 (로그인 화면에서 씀). 인터넷이 안 되면 이 기기 계정으로 진행
async function loginCloud(id, pw, create, nk) {
  id = String(id || "").trim(); if (!id || !pw) return "아이디와 비밀번호를 넣어 주세요";
  if (id.length > 20) return "아이디는 20자까지";
  if (id === DEV_ID) return DEV_OK ? login(id, pw, create, nk) : "사용할 수 없는 아이디예요";
  if (pw.length < 4) return create ? "비밀번호는 4자 이상" : "비밀번호가 달라요";
  const acc = accounts(), localOk = !!acc[id] && acc[id] === hashPw(id, pw);
  const r = await CLOUD.signIn(id, pw, create, localOk);
  if (r.offline) { const e = login(id, pw, create, nk); if (!e) UI.toast("📴 인터넷이 안 돼서 이 기기 저장으로 시작해요 (연결되면 다음 로그인 때 맞춰져요)", 4500); return e; }
  if (r.err) return r.err;
  acc[id] = hashPw(id, pw); ls.set("dbm2_accounts", JSON.stringify(acc));
  let local = null; try { local = JSON.parse(ls.get("dbm2_save_" + id) || "null"); } catch (e) { }
  const fromCloud = r.cloud && r.cloud.save && (!local || (r.cloud.t || 0) >= (local.t || 0));
  if (fromCloud) ls.set("dbm2_save_" + id, JSON.stringify(r.cloud.save));
  ACCOUNT = id; SAVE = loadAccount(id); if (create && cleanNick(nk)) SAVE.nick = cleanNick(nk); ls.set("dbm2_last", id);
  saveGame(); CLOUD.push(); sfxVol = SAVE.settings.sfx;
  if (r.cloud && !fromCloud) UI.toast("☁️ 이 기기 진행이 더 최근이라 서버에 올렸어요", 3500);
  return null;
}

// ---------- 해금·미션 ----------
// 오늘의 토벌령 (11-12): 날마다 지정 요괴 3마리 (스토리로 간 층까지의 중간보스·층보스 중에서)
function ensureBounty() {
  if (!SAVE) return null; const day = new Date().toISOString().slice(0, 10);
  if (!SAVE.bounty || SAVE.bounty.day !== day) {
    const maxF = Math.max(2, Math.min(5, SAVE.story.maxFloor || 1)), pool = [];
    for (let f = 1; f <= maxF; f++) pool.push(FLOORS[f - 1].boss, ...MID_BY_FLOOR[f - 1]);
    let seed = [...day].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 2147483647; const rr = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
    const list = []; while (list.length < 3 && pool.length) list.push(pool.splice(Math.floor(rr() * pool.length), 1)[0]);
    SAVE.bounty = { day, list, done: {}, bonus: false }; saveGame();
  }
  return SAVE.bounty;
}
function bountyKill(k) {
  const B = ensureBounty(); if (!B || !B.list.includes(k) || B.done[k]) return;
  B.done[k] = 1; SAVE.coins += 3; UI.toast(`📜 토벌령 달성: ${BOSSES[k].name} · 코인 +3`, 3500);
  if (!B.bonus && B.list.every((x) => B.done[x])) { B.bonus = true; SAVE.coins += 5; const own = Object.keys(SAVE.chars), id = own[Math.floor(Math.random() * own.length)]; SAVE.shards[id] = (SAVE.shards[id] || 0) + 5; setTimeout(() => UI.toast(`📜 오늘의 토벌령 완수! 코인 +5 · ${CHAR[id].name} 강화 조각 +5`, 4500), 1200); }
  saveGame();
}
function statVal(k) {
  if (k === "charsOwned") return Object.keys(SAVE.chars).length;
  if (k === "allModes") return Object.keys(SAVE.stats.modes || {}).length;
  if (k === "petsOwned") return Object.keys(SAVE.pets || {}).length;
  if (/^dex_f\d$/.test(k)) { const f = +k.slice(5); return [FLOORS[f - 1].boss, ...MID_BY_FLOOR[f - 1]].filter((x) => (SAVE.kb || {})[x]).length; }
  if (k === "soulTotal") return SAVE.soulTotal || 0;
  if (k === "mastMax") return typeof mastLv === "function" ? Math.max(1, ...Object.keys(SAVE.mast || {}).map(mastLv)) : 1;
  if (k === "dexAll") return Object.keys(BOSSES).filter((x) => (SAVE.kb || {})[x]).length;
  return SAVE.stats[k] || 0;
}
function unlockProgress(c) {
  const u = c.unlock;
  if (u.type === "start") return { ok: true, cur: 1, n: 1 };
  if (u.type === "gacha") return { ok: !!SAVE.chars[c.id], cur: Math.min((SAVE.shards || {})[c.id] || 0, shardNeed(c.id)), n: shardNeed(c.id) };
  const reqs = (u.reqs || []).slice(); if (u.type === "floor") reqs.unshift({ floor: u.n });
  let frac = 1, ok = true; const parts = [];
  for (const r of reqs) { const v = r.floor ? SAVE.story.maxFloor || 1 : statVal(r.stat), n = r.floor || r.n; frac = Math.min(frac, Math.min(v, n) / n); if (v < n) ok = false; parts.push(`${r.floor ? "스토리 " + n + "장" : r.text} ${Math.min(v, n)}/${n}`); }
  return { ok, cur: Math.round(frac * 100), n: 100, parts };
}
function checkUnlocks() {
  if (!SAVE) return;
  for (const c of CHARS) { if (SAVE.chars[c.id] || c.unlock.type === "gacha" || !isReleased(c.id)) continue; if (unlockProgress(c).ok) { SAVE.chars[c.id] = 1; UI.toast(`🔓 새 영웅 해금: ${c.name} (${c.job})`, 4000); } }
  for (const [T, store, label] of [[TITLES, "titles", "🏷️ 칭호"], [ARTIFACTS, "arts", "🔮 보물"], [PETS, "pets", "🐾 펫"]]) for (const k in T) { const it = T[k]; if (!it.c || SAVE[store][k]) continue; if (statVal(it.c.stat) >= it.c.n) { SAVE[store][k] = 1; UI.toast(`${label} 획득: ${it.name} (${HOW_NAME[it.how]} · ${it.c.text})`, 4200); } }
}
const missionDone = (m) => statVal(m.stat) >= m.n;
// 기간 미션: 날짜·주·달이 바뀌면 그때의 기록을 기준으로 다시 셈
function periodKey(t) { const d = new Date(); if (t === "d") return d.toDateString(); if (t === "m") return d.getFullYear() + "-" + (d.getMonth() + 1); const j = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + "w" + Math.ceil(((d - j) / 864e5 + j.getDay() + 1) / 7); }
function periodState(t) { SAVE.period = SAVE.period || {}; const k = periodKey(t); let P = SAVE.period[t]; if (!P || P.key !== k) { P = SAVE.period[t] = { key: k, base: Object.assign({}, SAVE.stats), claimed: {} }; saveGame(); } return P; }
const periodVal = (t, stat) => Math.max(0, (SAVE.stats[stat] || 0) - ((periodState(t).base || {})[stat] || 0));
const periodUnclaimed = () => ["d", "w", "m"].reduce((a, t) => a + PERIOD_MISSIONS[t].filter((m) => periodVal(t, m.stat) >= m.n && !periodState(t).claimed[m.id]).length, 0);
const unclaimed = () => MISSIONS.filter((m) => missionDone(m) && !SAVE.missions[m.id]).length + (SAVE ? periodUnclaimed() : 0);

// ---------- 가챠 ----------
function rollRar(rates) { let r = Math.random(), acc = 0; for (const k of [4, 3, 2, 1]) { acc += rates[k]; if (r < acc) return k; } return 1; }
function pullOne(kind, slot, atLeastRare) {
  SAVE.stats.pulls = (SAVE.stats.pulls || 0) + 1;
  if (kind === "char") {
    // 조각 시스템 (사용자 요청 11-11): 전설 3% → 가챠 영웅 조각 20개 (40개면 해금), 30회 천장. 나머지는 가진 캐릭터 조각 2~5개
    SAVE.pity = (SAVE.pity || 0) + 1; SAVE.shards = SAVE.shards || {};
    const heroes = CHARS.filter((c) => c.unlock.type === "gacha");
    const r0 = Math.random(); let gr = null, acc = 0; for (const g of ["SS", "S", "A", "B", "C"]) { acc += GACHA_GRADE_RATE[g] || 0; if (r0 < acc) { gr = g; break; } }
    if (!gr && SAVE.pity >= SHARD.pity) { const q = Math.random(); gr = q < PITY_GRADE.SS ? "SS" : q < PITY_GRADE.SS + PITY_GRADE.S ? "S" : "A"; }
    if (gr) {
      SAVE.pity = 0; const pu = typeof pickupHero === "function" ? pickupHero() : null, gp = heroes.filter((c) => CHAR_GRADE[c.id] === gr && (typeof isReleased !== "function" || isReleased(c.id)));
      const id = pu && CHAR_GRADE[pu] === gr && Math.random() < PICKUP_SHARE ? pu : pick(gp.length ? gp : heroes.filter((c) => CHAR_GRADE[c.id] === gr)).id; // 11-19 주간 픽업
      // 아주 낮은 확률: 조각 없이 영웅 바로 획득 (아직 없는 영웅만) → 결과엔 고화질 일러 + 이름만
      if (!SAVE.chars[id] && Math.random() < SHARD.direct[gr]) { SAVE.chars[id] = 1; return { kind: "char", id, rar: 4, grade: gr, isNew: true, direct: true, label: CHAR[id].name }; }
      const [lo, hi] = SHARD.per[gr], got = rint(lo, hi); SAVE.shards[id] = (SAVE.shards[id] || 0) + got;
      let isNew = false; if (!SAVE.chars[id] && SAVE.shards[id] >= shardNeed(id)) { SAVE.shards[id] -= shardNeed(id); SAVE.chars[id] = 1; isNew = true; }
      return { kind: "char", id, rar: 4, grade: gr, isNew, label: isNew ? `${CHAR[id].name} 해금!` : `${CHAR[id].name} 조각 +${got} (${SAVE.chars[id] ? "강화용" : SAVE.shards[id] + "/" + shardNeed(id)})` };
    }
    const pool = Object.keys(SAVE.chars), id = pick(pool), n = rint(2, 5); SAVE.shards[id] = (SAVE.shards[id] || 0) + n;
    return { kind: "shard", id, rar: 1, label: `${CHAR[id].name} 조각 +${n}` };
  }
  if (kind === "char_old") {
    if (Math.random() < GACHA.char.rate || SAVE.pity >= GACHA.char.pity) {
      SAVE.pity = 0; const id = pick(CHARS.filter((c) => c.unlock.type === "gacha")).id;
      if (SAVE.chars[id]) { SAVE.stars[id] = Math.min(5, (SAVE.stars[id] || 0) + 1); return { kind: "char", id, rar: 4, dup: true, label: `${CHAR[id].name} ★${SAVE.stars[id]}` }; }
      SAVE.chars[id] = 1; return { kind: "char", id, rar: 4, isNew: true, label: CHAR[id].name };
    }
    let tot = 0; for (const c of CHAR_CONSOLE) tot += c.w; let r = Math.random() * tot, pr = CHAR_CONSOLE[0]; for (const c of CHAR_CONSOLE) { r -= c.w; if (r <= 0) { pr = c; break; } }
    if (pr.coin) { SAVE.coins += pr.coin; return { kind: "misc", ico: "🪙", rar: 2, label: `코인 ${pr.coin}` }; }
    SAVE.gold += pr.gold; return { kind: "misc", ico: "💰", rar: 1, label: `엽전 ${pr.gold}` };
  }
  if (kind === "skill") {
    let r = Math.random(), acc = 0, gr = "D"; for (const g of ["S", "A", "B", "C", "D"]) { acc += SK_GRADE[g].p; if (r < acc) { gr = g; break; } }
    let pool = SKILL_KEYS.filter((k) => SKILLS[k].slot === slot && SKILLS[k].grade === gr);
    if (!pool.length) pool = SKILL_KEYS.filter((k) => SKILLS[k].slot === slot && SKILLS[k].grade === "D");
    const id = pick(pool), had = SAVE.skills[id];
    SAVE.skills[id] = Math.min(SKILL_GACHA.maxLv, (had || 0) + 1);
    return { kind: "skill", id, grade: gr, isNew: !had, label: SKILLS[id].name + (had ? ` Lv.${SAVE.skills[id]}` : "") };
  }
  const table = { art: [ARTIFACTS, ART_KEYS, "arts"], pet: [PETS, PET_KEYS, "pets"], title: [TITLES, TITLE_KEYS, "titles"] }[kind];
  let rar = rollRar(GACHA[kind].rates); if (atLeastRare && rar < 2) rar = 2;
  const gp = gachaPool(table[0]); let pool = gp.filter((k) => table[0][k].rar === rar); if (!pool.length) pool = gp;
  const id = pick(pool), store = SAVE[table[2]], had = store[id];
  if (kind === "title") { if (had) { SAVE.gold += 80; return { kind, id, rar, label: TITLES[id].name + " → 엽전 80" }; } store[id] = 1; return { kind, id, rar, isNew: true, label: TITLES[id].name }; }
  if (had) { const n = ITEM_SHARD.dup[rar] || 4, sk = kind + ":" + id; SAVE.ishards = SAVE.ishards || {}; SAVE.ishards[sk] = (SAVE.ishards[sk] || 0) + n; return { kind, id, rar, label: `${table[0][id].name} 조각 +${n}` }; }
  store[id] = 1;
  return { kind, id, rar, isNew: true, label: table[0][id].name };
}
function pullCost(kind, n, slot) { const g = kind === "skill" ? null : GACHA[kind]; return kind === "skill" ? (n === 10 ? SKILL_GACHA.cost10[slot] : SKILL_GACHA.cost[slot]) : n === 10 ? g.cost10 : g.cost; }
// 11-20 하루 한 번 무료 뽑기 (Archero·원신 등 모바일 히트작의 '매일 무료 1회' — 매일 들를 이유)
const freeToday = () => !!SAVE && SAVE.freePull !== new Date().toDateString();
function doPull(kind, n, slot, useYeop, free) {
  const cost = pullCost(kind, n, slot);
  if (free) { if (!freeToday() || n !== 1) return; SAVE.freePull = new Date().toDateString(); }
  else if (useYeop) { if (SAVE.gold < cost * COIN_YEOP) { UI.toast("엽전이 모자라요"); return; } SAVE.gold -= cost * COIN_YEOP; }
  else { if (SAVE.coins < cost) { UI.toast("코인이 모자라요 — 엽전으로도 뽑을 수 있어요"); return; } SAVE.coins -= cost; }
  const res = []; for (let i = 0; i < n; i++) res.push(pullOne(kind, slot, n === 10 && i === 9 && ["art", "pet", "title"].includes(kind) && !res.some((r) => r.rar >= 2)));
  track("gacha_pull", { kind, n, yeop: !!useYeop }); checkUnlocks(); saveGame(); UI.showPulls(res, () => UI.open("gacha", { tab: kind === "skill" ? "skill" : kind, slot }));
}

// ---------- 익명 오류·통계 (11-16) ----------
// Sentry: 실제 플레이어 폰에서 난 오류 / PostHog: 어떤 캐릭터로 어디까지 갔는지 같은 플레이 통계.
// 아이디·닉네임·이메일은 보내지 않음(기기마다 무작위 번호). 설정에서 끌 수 있음. 아래 키가 비어 있으면 아무것도 보내지 않음.
const ANALYTICS = { sentryDsn: "https://558a3e0c2fcf39007b1380b88b7d0c8a@o4512453670600704.ingest.us.sentry.io/4512453693669376", posthogKey: "phc_xxoAUBrr4VDZxAVBsF45Bj9D7RmHBm3xsN2A5ZQJMgEe", posthogHost: "https://us.i.posthog.com" }; // 11-19 PostHog 연결 (공개용 쓰기 전용 키)
let _anaOn = false;
function analyticsOk() { return !/autotest/.test(location.hash) && navigator.onLine !== false && !(SAVE && SAVE.settings && SAVE.settings.analytics === false); }
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.async = true; s.crossOrigin = "anonymous"; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
function analyticsInit() {
  if (_anaOn || !analyticsOk()) return; _anaOn = true;
  const rel = "yogoerok@" + (typeof GAME_VERSION !== "undefined" ? GAME_VERSION : "?");
  if (ANALYTICS.sentryDsn) loadScript("https://browser.sentry-cdn.com/11.14.0/bundle.tracing.min.js").then(() => { // 11-19 Sentry 11.14 (오류 + 성능 추적)
    if (!window.Sentry) return;
    const env = /github\.io$/.test(location.hostname) ? "production" : "development";
    Sentry.init({ dsn: ANALYTICS.sentryDsn, release: rel, environment: env, sampleRate: 1, sendDefaultPii: false,
      integrations: [Sentry.browserTracingIntegration()], tracesSampleRate: env === "production" ? 0.1 : 1.0,
      beforeSend(ev) { delete ev.user; if (ev.request) delete ev.request.cookies; ev.tags = Object.assign({}, ev.tags, { mode: G && G.mode, char: G && G.p && G.p.id, floor: G && G.floor }); return ev; } });
  }).catch(() => {});
  if (ANALYTICS.posthogKey) loadScript(ANALYTICS.posthogHost.replace("//us.i.", "//us-assets.i.").replace("//eu.i.", "//eu-assets.i.") + "/static/array.js").then(() => {
    if (!window.posthog) return;
    posthog.init(ANALYTICS.posthogKey, { api_host: ANALYTICS.posthogHost, autocapture: false, capture_pageview: true, disable_session_recording: true, persistence: "localStorage", ip: false });
    posthog.register({ version: rel }); setTimeout(() => { try { while (_anaQ.length) { const [e, p] = _anaQ.shift(); posthog.capture(e, p); } } catch (e) { } }, 500);
  }).catch(() => {});
}
// ---------- 앱(Capacitor) 전용: 진동·화면 켜 두기·상태바 (11-16) ----------
const NATIVE = (() => { const C = window.Capacitor, P = C && C.Plugins; return C && C.isNativePlatform && C.isNativePlatform() && P ? P : null; })();
function haptic(kind) { try { if (SAVE && SAVE.settings && SAVE.settings.haptic === false) return;
  try { const gp = typeof pad !== "undefined" && pad.on && navigator.getGamepads && [...navigator.getGamepads()].find((g) => g && g.connected); if (gp && gp.vibrationActuator) gp.vibrationActuator.playEffect("dual-rumble", { duration: kind === "heavy" ? 260 : 90, strongMagnitude: kind === "heavy" ? 0.9 : 0.25, weakMagnitude: kind === "heavy" ? 0.6 : 0.5 }).catch(() => {}); } catch (e) { }
  if (!NATIVE || !NATIVE.Haptics) { if (IS_TOUCH && navigator.vibrate) navigator.vibrate(kind === "heavy" ? [40, 30, 60] : 18); return; } // 11-19 스토어 앱(웹뷰)·휴대폰 브라우저 진동
  if (kind === "heavy") NATIVE.Haptics.impact({ style: "HEAVY" }); else NATIVE.Haptics.impact({ style: "LIGHT" }); } catch (e) { } }
function keepAwake(on) { try { if (NATIVE && NATIVE.KeepAwake) (on ? NATIVE.KeepAwake.keepAwake() : NATIVE.KeepAwake.allowSleep()).catch(() => {}); } catch (e) { } }
try { if (NATIVE && NATIVE.StatusBar) NATIVE.StatusBar.hide().catch(() => {}); } catch (e) { }
const _anaQ = []; // 11-19 PostHog 가 불러와지기 전 기록은 모아 뒀다가 보냄
function anaPick() { try { const s = typeof OPS !== "undefined" && OPS.anaSample != null ? OPS.anaSample : 1; if (s >= 1) return true; let b = ls.get("ygr_anab"); if (!b) { b = String(Math.random()); ls.set("ygr_anab", b); } return +b < s; } catch (e) { return true; } } // 11-22 서버비: 정식 출시 뒤 통계는 일부 사람만(OPS.anaSample)
function track(ev, props) { try { if (!_anaOn || !analyticsOk() || !anaPick()) return; if (window.posthog && posthog.__loaded) posthog.capture(ev, props || {}); else if (_anaQ.length < 50) _anaQ.push([ev, props || {}]); } catch (e) { } }
function reportError(err) { try { if (_anaOn && window.Sentry && Sentry.captureException && analyticsOk()) Sentry.captureException(err); } catch (e) { } }

// ---------- 음악 ----------
// 11-21 배경음악을 Web Audio 로 (사용자: 게임을 켜면 듣던 노래·영상이 멈추고, 다시 틀면 게임이 멈춤)
// <audio> 는 안드로이드에서 '오디오 포커스'를 가져가 다른 앱 소리를 끊고, 포커스를 뺏기면 멈춘 채로 남아 화면을 누를 때마다 곡을 처음부터 다시 불러 끊겼다.
// Web Audio(효과음과 같은 길)는 포커스를 잡지 않아 다른 앱 소리와 함께 나온다. #bgm 의 play·pause·src·volume·paused 를 흉내 내 다른 코드(앱 껍데기 포함)는 그대로 둔다.
(function bgmShim() {
  const el = document.getElementById("bgm"); if (!el || el._shim) return; el._shim = true;
  let src = "", vol = 1, paused = true, node = null, gain = null, token = 0; const cache = new Map();
  const ctx = () => { startAudio(); return AC; };
  const stop = () => { if (node) { try { node.stop(); } catch (e) { } try { node.disconnect(); } catch (e) { } node = null; } };
  const load = (u) => { if (cache.has(u)) { const p = cache.get(u); cache.delete(u); cache.set(u, p); return p; }
    const p = fetch(u).then((r) => r.arrayBuffer()).then((b) => new Promise((ok, no) => ctx().decodeAudioData(b, ok, no)));
    p.catch(() => cache.delete(u)); cache.set(u, p); while (cache.size > 2) cache.delete(cache.keys().next().value); return p; }; // 풀어 둔 곡은 2곡까지만(폰 메모리)
  Object.defineProperty(el, "src", { configurable: true, get: () => src, set: (u) => { if (u === src) return; stop(); src = u || ""; token++; } });
  Object.defineProperty(el, "volume", { configurable: true, get: () => vol, set: (v) => { vol = Math.max(0, Math.min(1, +v || 0)); if (gain) gain.gain.value = vol; } });
  Object.defineProperty(el, "paused", { configurable: true, get: () => paused });
  el.play = () => { const c = ctx(); if (!c || !src) return Promise.resolve(); if (!paused && node) return Promise.resolve();
    paused = false; const my = ++token, u = src;
    return load(u).then((buf) => { if (my !== token || paused || u !== src) return; stop();
      if (!gain) { gain = c.createGain(); gain.connect(c.destination); } gain.gain.value = vol;
      node = c.createBufferSource(); node.buffer = buf; node.loop = true; node.connect(gain); node.start(); }).catch(() => { }); };
  el.pause = () => { paused = true; token++; stop(); };
})();
let curTrack = null;
function music(name) {
  const a = $("#bgm"); if (!a) return;
  if (!SAVE || !SAVE.settings.music) { a.pause(); curTrack = name; return; }
  if (curTrack === name && !a.paused) return;
  curTrack = name; const src = ASSETS.bgm[name]; if (!src) return;
  a.src = src; a.volume = Math.min(1, SAVE.settings.vol * (/^boss/.test(name) ? (SAVE.settings.bossVol != null ? SAVE.settings.bossVol : 1) : 1)); a.play().catch(() => { });
}

// ---------- UI ----------
function titleParts() { // 11-17 타이틀: 밤하늘로 떠오르는 풍등·불씨 (화면이 바뀌면 멈춤)
  const c = document.getElementById("tparts"); if (!c) return; const g = c.getContext("2d"); let W = 0, H = 0, last = performance.now();
  const P = [], N = matchMedia("(max-width: 700px)").matches ? 26 : 46;
  const spawn = (init) => { const lan = Math.random() < 0.38; P.push({ x: Math.random() * W, y: init ? Math.random() * H : H + 30, z: 0.35 + Math.random() * 0.65, lan, vx: (Math.random() - 0.5) * 8, ph: Math.random() * 6.28, life: 0 }); };
  const fit = () => { const d = Math.min(2, devicePixelRatio || 1); W = c.clientWidth * d; H = c.clientHeight * d; c.width = W; c.height = H; };
  fit(); for (let i = 0; i < N; i++) spawn(true);
  const step = (t) => { if (!document.body.contains(c)) return; if (c.width !== Math.round(c.clientWidth * Math.min(2, devicePixelRatio || 1))) fit();
    const dt = Math.min(0.05, (t - last) / 1000); last = t; g.clearRect(0, 0, W, H); g.globalCompositeOperation = "lighter";
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.life += dt; p.y -= (p.lan ? 22 : 40) * p.z * dt * (H / 700); p.x += (p.vx + Math.sin(p.life * 0.8 + p.ph) * 10) * dt; if (p.y < -40) { P.splice(i, 1); spawn(false); continue; }
      const fl = 0.75 + Math.sin(p.life * 7 + p.ph) * 0.15 + Math.sin(p.life * 13 + p.ph) * 0.08, k = H / 900;
      if (p.lan) { const s = 9 * p.z * k; const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 5); gr.addColorStop(0, `rgba(255,190,110,${0.5 * fl * p.z})`); gr.addColorStop(1, "rgba(255,120,40,0)"); g.fillStyle = gr; g.fillRect(p.x - s * 5, p.y - s * 5, s * 10, s * 10);
        g.fillStyle = `rgba(255,${200 + 30 * fl | 0},140,${0.85 * p.z})`; g.beginPath(); g.ellipse(p.x, p.y, s * 0.75, s, 0, 0, 7); g.fill(); }
      else { const s = 2.2 * p.z * k; g.fillStyle = `rgba(255,${150 + 60 * fl | 0},70,${0.8 * fl * p.z})`; g.beginPath(); g.arc(p.x, p.y, s, 0, 7); g.fill(); } }
    g.globalCompositeOperation = "source-over"; requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const _hpl = {}; // 체력 막대 뒤 하얀 '깎인 몫': 0.45초 기다렸다 부드럽게 따라감 (회복은 바로)
function hpLag(k, f, el) { if (!el) return; const now = performance.now(), o = _hpl[k] || (_hpl[k] = { v: f, t: now, last: now });
  if (f >= o.v) { o.v = f; o.t = now; } else if (f < o.prev - 0.0005) o.t = now; o.prev = f;
  const dt = Math.min(0.1, (now - o.last) / 1000); o.last = now; if (now - o.t > 450) o.v = Math.max(f, o.v - dt * 0.6);
  el.style.width = o.v * 100 + "%"; }
const UI = {
  _modal: false, _tipSlot: null,
  modalOpen() { return !$("#modal").hidden; },
  typing() { const a = document.activeElement; return a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA"); },
  music,
  toast(msg, ms = 2600) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; $("#toasts").appendChild(t); setTimeout(() => t.remove(), ms); },
  error(err) { reportError(err); const b = $("#errbox"); b.hidden = false; const at = err && err.stack ? String(err.stack).split(String.fromCharCode(10)).slice(1, 3).map((l) => l.trim().replace(/^at /, "").replace(/\(?(https?|file):\/\/[^)]*\/([^/)]+)\)?/, "$2")).join(" ← ") : ""; b.textContent = "오류: " + (err && err.message) + (at ? "  [" + at + "]" : "") + "  · v" + GAME_VERSION; },
  modal(html) { // 11-20: 특별 모양(레벨업·상점·멈춤·괴이한 방·받기 방식)은 그 창 내용일 때만 남김 — 다른 창이 그 모양으로 열리던 것 방지
    const M = { lvmode: "lvhead", shopmode: "shopw", pzmode: "pzw", evmode: "evbox", dlmode: "dlw" }, el = $("#modal");
    for (const c in M) if (el.classList.contains(c) && !html.includes('class="' + M[c])) el.classList.remove(c);
    $("#mbox").innerHTML = html; el.hidden = false; },
  closeModal() { $("#modal").hidden = true; $("#modal").classList.remove("lvmode", "shopmode", "pzmode", "evmode", "dlmode", "noticem", "gachafx"); $("#mbox").innerHTML = ""; },

  // ----- 로그인 -----
  login() {
    G = null; $("#hud").hidden = true;
    const last = ls.get("dbm2_last") || "";
    const hasLogo = !!(ASSETS.img && ASSETS.img.ui_logo); // 11-17 하이엔드 타이틀: 붓글씨 금박 로고·천천히 다가오는 배경·떠오르는 등불·흐르는 안개
    $("#screens").innerHTML = `<div class="screen" id="login"><div class="bgimg kb" style="background-image:url(${imgSrc("cg_open")})"></div>
      <div class="tfog" style="background-image:url(${imgSrc("fog_tile")})"></div><div class="tfog f2" style="background-image:url(${imgSrc("fog_tile")})"></div>
      <canvas id="tparts"></canvas><div class="tvig"></div>
      ${hasLogo ? `<img class="tlogo" src="${imgSrc("ui_logo")}" alt="요괴록 · 조선 요괴 토벌기">` : ""}
      <form class="box" id="lf" autocomplete="off">
        ${hasLogo ? "" : `<div class="logo">요괴록<small>조선 요괴 토벌기</small></div>`}
        ${last ? "" : `<button class="btn gold lgo" type="button" id="lguest2">바로 시작</button><p class="muted lgsub">가입 없이 바로 시작해요 · 나중에 설정에서 계정으로 바꿀 수 있어요</p><details class="lacc"><summary>계정으로 로그인 · 새 계정</summary>`}
        <div class="field"><label for="lid">아이디</label><input id="lid" maxlength="20" value="${esc(last)}" autocomplete="username"></div>
        <div class="field"><label for="lpw">비밀번호</label><input id="lpw" type="password" maxlength="30" autocomplete="current-password"></div>
        <div class="field"><label for="lnick">닉네임 <span class="muted">(새 계정 만들 때 · 12자까지, 나중에 설정에서 바꿀 수 있어요)</span></label><input id="lnick" maxlength="12" placeholder="게임에서 보일 이름"></div>
        <label class="autochk"><input type="checkbox" id="lauto" ${ls.get("ygr_auto_off") ? "" : "checked"}> 자동 로그인 (다음부터 바로 시작)</label>
        <div class="err" id="lerr"></div>
        <div class="center"><button class="btn gold" type="submit">로그인</button><button class="btn" type="button" id="lnew">새 계정 만들기</button></div>
        ${last ? `<div class="center" style="margin-top:6px"><button class="btn gold" type="button" id="lguest" style="min-width:220px">▶ 바로 시작 (게스트)</button></div>` : `<button type="button" id="lguest" hidden></button></details>`}
        <p class="muted" style="text-align:center;margin:12px 0 0">☁️ 같은 아이디로 로그인하면 PC·폰 어디서든 이어서 해요 · v${GAME_VERSION}</p>
      </form></div>`;
    titleParts();
    let logoN = 0; const lg = $(".tlogo") || $(".logo"); lg.style.cursor = "default";
    lg.onclick = () => { if (++logoN === 7) { logoN = 0; startAudio(); const a = $("#bgm"); a.src = ASSETS.bgm.gacha; a.volume = 0.5; a.play().catch(() => { }); curTrack = "gacha";
      UI.modal(`<h2>🏮 비밀 쪽지</h2><p style="text-align:center;line-height:1.9">이 미궁은 <b>한입 미스터리</b> 채널의 국악과<br>Claude가 함께 지었어요.<br>찢어진 요괴록을 다시 묶어 줘서 고마워요.<br><span class="muted">로그인하면 첫 한 번, 코인 3개를 드려요.</span></p><div class="center"><button class="btn gold" id="eggok">고마워요</button></div>`);
      window._logoEgg = true; $("#eggok").onclick = () => UI.closeModal(); } };
    let busy = false;
    const go = async (create) => { if (busy) return; busy = true; $("#lerr").textContent = "☁️ 접속 중…"; const id = $("#lid").value, pw = $("#lpw").value; const e = await loginCloud(id, pw, create, $("#lnick").value); busy = false; $("#lerr").textContent = ""; if (e) { $("#lerr").textContent = e; return; } rememberLogin($("#lauto").checked, id, pw); afterLogin(); };
    $("#lf").onsubmit = (e) => { e.preventDefault(); go(false); };
    $("#lnew").onclick = () => go(true);
    if ($("#lguest2")) $("#lguest2").onclick = () => $("#lguest").click(); // 11-20 처음 온 사람은 '바로 시작'이 맨 위 큰 버튼, 계정 로그인은 접어 둠
    $("#lguest").onclick = async () => { // 11-18 가입 없이 바로 시작 — 아이디·비밀번호는 자동으로 만들고 설정 화면에서 볼 수 있음
      if (busy) return; busy = true; $("#lerr").textContent = "☁️ 준비 중…";
      let G0 = null; try { G0 = JSON.parse(ls.get("ygr_guest") || "null"); } catch (e) { }
      const id = G0 ? G0.id : "손님" + Math.floor(100000 + Math.random() * 900000), pw = G0 ? G0.pw : Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8);
      let e = await loginCloud(id, pw, !G0, "토벌꾼" + id.slice(-4)); if (e && G0) e = await loginCloud(id, pw, true, "토벌꾼" + id.slice(-4));
      busy = false; $("#lerr").textContent = ""; if (e) { $("#lerr").textContent = e; return; }
      ls.set("ygr_guest", JSON.stringify({ id, pw })); rememberLogin(true, id, pw); afterLogin();
    };
    setTimeout(() => { const el = last ? $("#lpw") : $("#lid"); if (el) el.focus(); }, 50);
  },

  // ----- 공통 화면 틀 -----
  frame(title, body, onBack) {
    const old = $("#screens .screen .body"), keep = old && UI._frameTitle === title ? old.scrollTop : 0; UI._frameTitle = title;
    $("#screens").innerHTML = `<div class="screen"><div class="top"><button class="back" id="bk">← 뒤로</button><h2>${title}</h2>
      <div class="money">${SAVE ? `<span class="pill coin">${curIc("coin")} 코인 <b>${SAVE.coins}</b></span>` : ""}</div></div><div class="body">${(() => { const bk = /제단/.test(title) ? "altar" : /시즌/.test(title) ? "season" : /기록/.test(title) ? "history" : /임무/.test(title) ? "bounty" : ""; return bk && ASSETS.img["ui_c_" + bk] ? `<div class="frbanner" style="background-image:url(${ASSETS.img["ui_c_" + bk]})"></div>` : ""; })()}${body}</div></div>`;
    $("#bk").onclick = onBack || (() => UI.menu());
    if (keep) $("#screens .screen .body").scrollTop = keep;
  },
  open(name, opt) { UI[name](opt || {}); },
  // ① 새 시스템 첫 안내 (11-12): 계정마다 한 번씩, 짧게
  tip(key) {
    const T = {
      elem: ["⚔️ 요괴 속성 상성", "장마다 요괴의 속성이 달라요. 약점 속성(스테이지 시작 때 표시)으로 때리면 피해 <b>+10%</b>, 같은 계열이면 <b>-5%</b>예요.<br>영웅 상세 화면에서 내 영웅의 속성을 볼 수 있어요."],
      portal: ["⛩️ 홍살문", "보스를 잡으면 홍살문이 열려요. 다른 방을 더 둘러봐도 되고, 준비가 되면 <b>문 안에 1초</b> 서 있으면 다음 스테이지로 가요."],
      dex: ["📖 요괴록 도감", "토벌한 요괴는 도감에 기록돼요. 같은 요괴를 <b>10번</b> 토벌하면 그 요괴에게 피해 <b>+5%</b>, 장 도감을 다 채우면 칭호와 코인을 받아요."],
      place: ["📍 위치 지정 스킬", IS_TOUCH ? "설치·낙하·순간이동 스킬은 자리를 고를 수 있어요.<br><b>스킬 버튼을 끌어서</b> 자리를 고르고 떼면 시전 (그냥 누르면 가까운 적에게)" : "설치·낙하·순간이동 스킬은 자리를 고를 수 있어요.<br><b>키를 누른 채</b> 마우스로 자리를 고르고 떼면 시전 (Esc·오른쪽 클릭 취소)"],
      bounty: ["📜 오늘의 토벌령", "날마다 지정 요괴 3마리가 바뀌어요. 하나 토벌할 때마다 코인 3개, 셋 다 하면 코인 5개와 강화 조각 5개를 더 받아요."],
      altar: ["🔥 혼불 제단", "판에서 쓰러져도 <b>혼불</b>은 남아요. 처음 화면 <b>혼불 제단</b>에 바치면 모든 영웅이 영구히 강해져요.<br>판이 끝날 때 '다음 목표'에서 얼마나 남았는지 볼 수 있어요."],
      event: ["👻 괴이한 방", "떠다니는 혼불에 다가가면 설화 속 일이 벌어져요. 선택에 따라 보상도, 위험도 달라요."],
      trial: ["⏳ 시련의 방", "위쪽 시계가 0이 되기 전에 요괴를 모두 정리하면 <b>보물 상자 + 강화 하나</b>. 늦어도 벌은 없어요."],
      pdodge: ["💨 완벽 회피", "공격이 닿기 직전에 구르면(<b>" + (IS_TOUCH ? "구르기 버튼" : "Space") + "</b>) <b>완벽 회피</b>! 잠깐 시간이 느려지고 3초 동안 공격력이 30% 올라요."],
      combo: ["⚔️ 연격", "공격을 끊기지 않게 이어 가면 연격이 쌓여요. <b>15 이상</b>에서 끊기면 엽전을 받고, 연격이 높을수록 많이 받아요."],
      map: ["🗺️ 큰 지도", (IS_TOUCH ? "오른쪽 위 <b>작은 지도</b>를 누르면" : "<b>M 키</b>로") + " 이번 스테이지 지도를 크게 볼 수 있어요. 안 가 본 방과 홍살문 위치가 보여요."],
    }[key];
    if (!T || !SAVE || /autotest/.test(location.hash)) return;
    SAVE.tips = SAVE.tips || {}; if (SAVE.tips[key]) return; SAVE.tips[key] = 1; saveGame();
    if (G && !G.over) { // 11-18 판 안에서는 게임을 멈추지 않는 옆 카드로 (전투 중 안내창이 흐름을 끊어 첫 판 이탈 원인)
      if (UI.modalOpen()) { SAVE.tips[key] = 0; setTimeout(() => { if (SAVE && G && !G.over) UI.tip(key); }, 1500); return; } // 11-19 다른 창 위에 겹치지 않게
      if (G.banner && G.banner.t > 0.2) { SAVE.tips[key] = 0; setTimeout(() => { if (SAVE && G && !G.over) UI.tip(key); }, G.banner.t * 1000 + 400); return; } // 11-21 가운데 큰 글(보스 토벌! 등)과 겹치지 않게 끝난 뒤에
      let c = document.getElementById("tipcard"); if (!c) { c = document.createElement("div"); c.id = "tipcard"; document.body.appendChild(c); }
      c.innerHTML = `<button class="tx" aria-label="닫기">×</button><b>${T[0]}</b><p>${T[1]}</p><i></i>`; c.className = "on"; clearTimeout(UI._tipT);
      c.querySelector(".tx").onclick = () => { c.className = ""; }; UI._tipT = setTimeout(() => { c.className = ""; }, 9000); return;
    }
    if (UI.modalOpen()) { setTimeout(() => { if (!SAVE) return; SAVE.tips[key] = 0; UI.tip(key); }, 1500); return; }
    const wasG = G && !G.paused; if (wasG) G.paused = true;
    UI.modal(`<h2>${T[0]}</h2><p style="text-align:center;line-height:1.8">${T[1]}</p><div class="center"><button class="btn gold" id="tipok">알겠어요</button></div>`);
    $("#tipok").onclick = () => { UI.closeModal(); if (wasG && G) G.paused = false; };
  },
  // ② 큰 지도
  bigMap() {
    if (!G || !G.cur || G.mode === "duel" || UI.modalOpen()) return;
    const wasG = !G.paused; G.paused = true;
    UI.modal(`<h2>🗺️ 지도</h2><canvas id="bigmap" width="900" height="560" style="width:100%;max-width:900px;display:block;margin:0 auto;background:#0b0910;border-radius:10px"></canvas>
      <p class="muted" style="text-align:center;font-size:.8rem">얼굴 = 지금 있는 방 · 나무패 = 방 종류(보스·중간보스·상점·우물·보물·정예·괴이한 방·시련) · 붉은 문 = 홍살문 · 흐린 방은 안 가 본 방</p><div class="center"><button class="btn gold" id="mapok">닫기 (M)</button></div>`);
    const drawMap = () => { if (!$("#bigmap") || !G) return;
    const c = $("#bigmap"), g = c.getContext("2d"), rs = [...G.rooms.values()].filter((r) => r.visited || Object.values(r.links || {}).some((k) => (G.rooms.get(k) || {}).visited)); g.clearRect(0, 0, c.width, c.height); // 11-21 지도는 가 본 방과 바로 옆 방만 — 보스·출구는 가까이 가야 드러남(탐험하는 느낌)
    const xs = rs.map((r) => r.x), ys = rs.map((r) => r.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const S = Math.min(120, 820 / (x1 - x0 + 1), 500 / (y1 - y0 + 1)), ox = (900 - (x1 - x0 + 1) * S) / 2, oy = (560 - (y1 - y0 + 1) * S) / 2;
    const P = (r) => [ox + (r.x - x0) * S + S / 2, oy + (r.y - y0) * S + S / 2];
    g.strokeStyle = "#5a4a3a"; g.lineWidth = 4;
    for (const r of rs) for (const d in r.links) { const t = G.rooms.get(r.links[d]); if (!t || !rs.includes(t)) continue; const [a, b] = P(r), [c2, d2] = P(t); g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d2); g.stroke(); }
    const COL = { boss: "#ff5a5a", shop: "#5fc8ff", rest: "#7fe08a", treasure: "#ffc84a", elite: "#c38bff", exit: "#fff2b0" };
    for (const r of rs) {
      const [x, y] = P(r), w = S * 0.62; g.globalAlpha = r.visited ? 1 : 0.4;
      g.fillStyle = r === G.cur ? "#3a2c18" : "#1d1826"; g.fillRect(x - w / 2, y - w / 2, w, w);
      g.strokeStyle = COL[r.type] || "#8a7a6a"; g.lineWidth = r === G.cur ? 5 : 3; g.strokeRect(x - w / 2, y - w / 2, w, w);
      g.globalAlpha = 1; g.font = `${Math.round(w * 0.42)}px sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
      // 11-20 글리프 대신 그린 방 표식(문 위 나무패와 같은 그림), 지금 방은 영웅 얼굴
      const sk = r === G.cur ? null : r.type === "boss" ? (r.mid || (G.mode === "story" && G.stage < STAGES_PER_FLOOR) ? "mid" : "boss") : r.trial ? "trial" : { shop: "shop", rest: "rest", treasure: "treasure", elite: "elite", exit: "exit", event: "event" }[r.type];
      const im = r === G.cur ? IMG["card_" + (typeof charArt === "function" ? charArt(G.p.id, G.p.form || null) : G.p.id)] : sk && IMG["sign_" + sk];
      if (im && im.naturalWidth) { const s2 = w * 0.78, sc = s2 / Math.max(im.naturalWidth, im.naturalHeight); g.save(); if (r === G.cur) { g.beginPath(); g.arc(x, y, s2 / 2, 0, 7); g.clip(); const s3 = s2 / Math.min(im.naturalWidth, im.naturalHeight); g.drawImage(im, x - im.naturalWidth * s3 / 2, y - s2 / 2, im.naturalWidth * s3, im.naturalHeight * s3); } else { if (r.type === "boss" && r.cleared) g.globalAlpha = 0.45; g.drawImage(im, x - im.naturalWidth * sc / 2, y - im.naturalHeight * sc / 2, im.naturalWidth * sc, im.naturalHeight * sc); } g.restore(); }
      else if (r.cleared) { g.fillStyle = "#ffe2a0"; g.fillText("·", x, y); }
      if (r.type === "boss" && r.cleared && !r.stairsTaken) { g.fillStyle = "#c8432a"; g.fillRect(x + w * 0.26, y - w * 0.5, w * 0.06, w * 0.24); g.fillRect(x + w * 0.44, y - w * 0.5, w * 0.06, w * 0.24); g.fillRect(x + w * 0.2, y - w * 0.5, w * 0.36, w * 0.05); }
    }
    }; drawMap(); setTimeout(drawMap, 350); setTimeout(drawMap, 1200); // 그림이 처음 받아지는 중이면 다시 그림
    const close = () => { UI.closeModal(); if (wasG && G) G.paused = false; };
    $("#mapok").onclick = close; UI._mapClose = close;
  },
  cutin(b) {
    if (!b || (G && G.opt && G.opt.multi && NET.client)) return;
    const d = BOSSES[b.type] || {}, Y = typeof yokaiEl === "function" ? yokaiEl(b) : null, im = ASSETS.img[b.img] || ASSETS.img[d.art] || "";
    const lk = LORE[b.type] ? b.type : LORE[b.img] ? b.img : LORE[d.art] ? d.art : null, lore = lk && typeof LORE[lk] === "string" ? (LORE[lk].match(/^[^.!?…]+[.!?…]/) || [LORE[lk]])[0].trim() : "";
    const el = document.createElement("div"); el.className = "cutin" + (b.mini ? "" : " big");
    el.innerHTML = `<div class="cbar"></div><img src="${im}" alt=""><div class="ctx"><small>${b.mini ? "중간보스" : (G && G.mode === "endless" ? "층 보스" : "장 보스")} · ${d.style === "ranged" ? "원거리" : "근거리"}${Y ? " · " + Y.n + " 속성" : ""}</small><b>${d.name || b.name}</b>${lore ? `<i class="clore">${esc(lore)}</i>` : ""}</div>`;
    if (lore) { el.style.animationDuration = "3s"; el.classList.add("haslore"); } // 11-21 B3 보스 등장: 이름 아래 세계관 한 줄(LORE 첫 문장) — 읽을 시간만큼 조금 길게
    document.body.appendChild(el); setTimeout(() => el.remove(), lore ? 3100 : 2300);
    { for (const c of ["t", "b"]) { const x = document.createElement("div"); x.className = "lbox " + c + (b.mini ? " mini" : ""); document.body.appendChild(x); setTimeout(() => x.remove(), lore ? 3400 : 2700); } if (G) G.camFocus = { u: b, t: (b.mini ? 1.1 : 1.7) + (lore ? 0.6 : 0) }; } // 11-17 하이엔드 보스 등장: 띠 + 카메라가 보스를 비춤
  },
  bountyCard() {
    const B = ensureBounty(); if (!B) return "";
    const cell = (k) => { const d = BOSSES[k], ok = B.done[k], im = ASSETS.img[k] ? k : d.art; return `<div style="text-align:center;flex:1;min-width:84px;opacity:${ok ? 0.55 : 1}"><img src="${imgSrc(im)}" style="height:62px;object-fit:contain;${(SAVE.kb || {})[k] || ok ? "" : "filter:brightness(0) drop-shadow(0 0 1px rgba(240,228,204,.9)) drop-shadow(0 0 6px rgba(243,194,122,.45))"}" alt=""><div style="font-size:.8rem">${ok ? "✅ " : ""}${d.name}<span class="muted" style="display:block;white-space:nowrap">${d.fl || (FLOORS.findIndex((f) => f.boss === k) + 1) || "?"}장 ${d.mid ? "중간보스" : "보스"}</span></div></div>`; }; // 11-20 처음 보는 요괴도 이름은 보이게 (무엇을 잡을지 알 수 있게)
    return `<div class="card bntc" style="margin:8px 0"><b>오늘의 토벌령</b> <span class="muted" style="font-size:.8rem">지정 요괴를 토벌하면 코인 3 · 셋 다 토벌하면 코인 +5, 강화 조각 +5 (매일 새로)</span><div style="display:flex;gap:8px;margin-top:6px">${B.list.map(cell).join("")}</div></div>`;
  },
  // 요괴록 도감 (11-12): 처치한 보스·중간보스 모음 — 층별, 처치 전엔 그림자
  bestiary() {
    // 중간보스 전용 그림은 층별 그림 묶음에 있다 → 도감을 열면 다섯 층 묶음을 받고 다시 그린다 (11-15 사용자: 도감 이미지가 다 똑같아)
    if (ASSETS.packs) { const miss = [1, 2, 3, 4, 5].filter((f) => ASSETS.packs["f" + f] && !PACK.done["f" + f]); if (miss.length && !UI._bestPk) UI._bestPk = Promise.all(miss.map((f) => needPack("f" + f, (k) => !/_a_|_anim/.test(k)))).then(() => { if (UI._frameTitle && /도감/.test(UI._frameTitle)) UI.bestiary(); }); }
    const kb = SAVE.kb || {}, all = Object.keys(BOSSES).length, got = Object.keys(kb).length;
    const card = (k) => { const d = BOSSES[k], n = kb[k] || 0, im = ASSETS.img[k] ? k : d.art; return `<div class="item ${n ? "" : "off"}" data-lore="${k}" style="min-height:0;padding:8px;text-align:center">
      <div style="height:110px;display:flex;align-items:flex-end;justify-content:center"><img src="${imgSrc(im)}" alt="" style="max-height:108px;max-width:100%;object-fit:contain;${n ? "" : "filter:brightness(0) opacity(.55)"}"></div>
      <b style="color:${d.mid ? "#c9a0ff" : "#ff8a6a"}">${n ? d.name : "???"}</b><span class="muted" style="font-size:.75rem">${d.mid ? "중간보스" : "장 보스"} · ${d.style === "ranged" ? "원거리" : "근거리"} · <b style="color:${YOKAI_EL[((d.fl || FLOORS.findIndex((f) => f.boss === k) + 1) - 1) % 5].col}">${YOKAI_EL[((d.fl || FLOORS.findIndex((f) => f.boss === k) + 1) - 1) % 5].n}</b>${n >= 10 ? ' · <b style="color:#7fe08a">피해 +5%</b>' : n ? ` · ${n}/10` : ""}${n ? " · " + n + "번 토벌" : ""}</span></div>`; };
    const floors = [1, 2, 3, 4, 5].map((f) => { const th = FLOORS[f - 1], boss = th.boss, mids = MID_BY_FLOOR[f - 1];
      return `<h3 style="margin-top:14px">${f}장 · ${th.name} <span class="muted">${[boss, ...mids].filter((k) => kb[k]).length}/${mids.length + 1}</span></h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr))">${card(boss)}${mids.map(card).join("")}</div>`; }).join("");
    // 11-16: 일반 요괴(한 번 잡으면 공개)·엘리트 특성·조합 패시브(한 번 얻으면 공개)
    const mk = SAVE.mk || {}, AI_T = { chase: "쫓아옴", weave: "지그재그로 날아옴", ranged: "멀리서 쏨", charger: "돌진", caster: "발밑에 주술", blinker: "순간이동" };
    const mobs = Object.keys(ENEMIES).map((k) => { const e = ENEMIES[k], n = mk[k] || 0; return `<div class="item ${n ? "" : "off"}" data-lmob="${k}" style="min-height:0;padding:8px;text-align:center"><div style="height:90px;display:flex;align-items:flex-end;justify-content:center"><img src="${imgSrc(e.img)}" alt="" style="max-height:88px;max-width:100%;object-fit:contain;${n ? "" : "filter:brightness(0) opacity(.55)"}"></div><b>${n ? e.name : "???"}</b><span class="muted" style="font-size:.75rem">${n ? AI_T[e.ai] || "" : "아직 못 만남"}${n ? " · " + n + "번 처치" : ""}</span></div>`; }).join("");
    const AFX_T = { swift: "빠르게 움직임", iron: "받는 피해 30% 줄임", split: "쓰러지면 작은 요괴 둘로 갈라짐", burst: "쓰러지면 잠시 뒤 폭발 — 피하세요", regen: "체력이 계속 차오름", vamp: "때릴 때마다 체력을 빨아들임 — 맞지 않는 게 최선", shield: "몇 초마다 파란 보호막 — 깨지면 그때 몰아치기", blink: "가까이 순간이동 — 나타난 자리를 바로 치기" };
    const affs = Object.keys(AFFIX).map((a) => `<div class="item" style="min-height:0;padding:8px"><b style="color:${AFFIX[a].col}">${AFFIX[a].name}</b><span class="muted" style="font-size:.8rem">${AFX_T[a]}</span></div>`).join("");
    const duo = SAVE.duo || {}, duos = Object.keys(BOONS).filter((k) => BOONS[k].duo).map((k) => { const b = BOONS[k]; return `<div class="item ${duo[k] ? "" : "off"}" style="min-height:0;padding:8px"><b>${b.ic || ""} ${duo[k] ? b.name : "???"}</b><span class="muted" style="font-size:.8rem">${(b.req || []).map((q) => BOONS[q].name).join(" + ")}${duo[k] ? " → " + b.desc.replace(/^\[조합\][^→]*→\s*/, "") : ""}</span></div>`; }).join("");
    const extra = `<h3 style="margin-top:18px">일반 요괴 <span class="muted">${Object.keys(ENEMIES).filter((k) => mk[k]).length}/${Object.keys(ENEMIES).length}</span></h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">${mobs}</div>
      <h3 style="margin-top:18px">엘리트 특성 <span class="muted">엘리트 요괴 머리 위에 이름이 보여요</span></h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${affs}</div>
      <h3 style="margin-top:18px">조합 강화 <span class="muted">두 강화를 모두 가지면 레벨업 때 나와요</span></h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${duos}</div>`;
    UI.frame("📖 요괴록 도감", `<div class="center" style="margin:4px 0 8px"><button class="btn gold" id="sbook">📜 이야기 다시 보기</button></div><p class="muted">${got}/${all} · 잡은 요괴를 누르면 설화와 토벌 요령이 열려요 (3번: 요령 · 10번: 토벌 완료 도장)</p>${floors}${extra}`);
    if ($("#sbook")) $("#sbook").onclick = () => UI.storyBook();
    document.querySelectorAll("[data-lore]").forEach((c) => { const n = (SAVE.kb || {})[c.dataset.lore] || 0; if (n) { c.style.cursor = "pointer"; if (n >= 10) c.classList.add("ldone"); c.onclick = () => UI.loreOpen(c.dataset.lore, false); } });
    document.querySelectorAll("[data-lmob]").forEach((c) => { const n = (SAVE.mk || {})[c.dataset.lmob] || 0; if (n) { c.style.cursor = "pointer"; if (n >= 10) c.classList.add("ldone"); c.onclick = () => UI.loreOpen(c.dataset.lmob, true); } });
  },

  // ----- 메인 메뉴 -----
  menu() { if (!G && typeof unBitmap === "function" && WARMED.size) { for (const k of [...WARMED]) unBitmap(k); WARM_P = null; } // 11-21 메인으로 오면 지난 판에 풀어 둔 그림을 내려놓음(폰 메모리)
    if (window._rndOrig) { Math.random = window._rndOrig; window._rndOrig = null; }
    G = null; $("#hud").hidden = true; UI.closeModal(); music("menu"); if (typeof analyticsInit === "function") analyticsInit(); // 11-19 메인 화면부터 통계
    const cur = CHAR[SAVE.sel] && SAVE.chars[SAVE.sel] ? SAVE.sel : "musa"; SAVE.sel = cur;
    const mc = unclaimed();
    // 11-18 처음 하는 사람에게 시스템이 한꺼번에 쏟아지지 않게: 진행하면 하나씩 열림 (예전부터 하던 계정은 이미 다 열려 있음)
    const st = SAVE.stats || {}, dev = ACCOUNT === DEV_ID, f1 = dev || (SAVE.story.maxFloor || 1) >= 2 || (st.bosses || 0) >= 1, r1 = dev || (st.rooms || 0) >= 5, f2 = dev || (SAVE.story.maxFloor || 1) >= 3;
    const GATE = { endless: f1 ? "" : "스토리 1장 보스를 쓰러뜨리면 열려요", raid: f2 ? "" : "스토리 2장 보스를 쓰러뜨리면 열려요", duel: f1 ? "" : "스토리 1장 보스를 쓰러뜨리면 열려요",
      multi: f1 ? "" : "스토리 1장 보스를 쓰러뜨리면 열려요", gacha: r1 ? "" : "스토리에서 방 5개를 정리하면 열려요", bag: r1 ? "" : "스토리에서 방 5개를 정리하면 열려요", skills: r1 ? "" : "스토리에서 방 5개를 정리하면 열려요" };
    const opened = Object.keys(GATE).filter((k) => !GATE[k]); SAVE.gateSeen = SAVE.gateSeen || {}; const fresh = opened.filter((k) => !SAVE.gateSeen[k]);
    if (fresh.length && Object.keys(SAVE.gateSeen).length) setTimeout(() => UI.toast("🔓 새로 열렸어요: " + fresh.map((k) => ({ endless: "무한의 방", raid: "보스 레이드", duel: "1대1 대전", multi: "함께하기", gacha: "뽑기", bag: "보물·펫", skills: "스킬 장착" })[k]).join(", "), 4000), 600);
    for (const k of opened) SAVE.gateSeen[k] = 1; if (!Object.keys(SAVE.gateSeen).length) SAVE.gateSeen._ = 1;
    const modeRow = (m, t, d, extra) => `<button class="mode" data-m="${m}"${extra || ""}><div class="img" style="background-image:url(${imgSrc(ASSETS.img["ui_mode_" + m + "_" + heroSex(SAVE.sel)] ? "ui_mode_" + m + "_" + heroSex(SAVE.sel) : "ui_mode_" + m)})"></div><b>${t}</b><span>${d}</span></button>`;
    const dock = (k, ic, t, badge) => `<button class="sub" data-s="${k}"><span class="ic">${uiIc(ic, "")}</span><span class="dl">${t}</span>${badge || ""}</button>`;
    const altarDot = (() => { const n = altarNext(); return n && (SAVE.soul || 0) >= n.c ? '<i class="dot"></i>' : ""; })();
    $("#screens").innerHTML = `<div class="screen hub" id="menu"><div class="hero-bg kb" style="background-image:url(${imgSrc("ui_menu_bg")})"></div><div class="hubshade"></div><canvas id="tparts" class="mparts"></canvas>
      <div class="top"><div class="hublogo"><b>요괴록</b><small>조선 요괴 토벌기</small></div><div class="money"><span class="pill" title="아이디: ${esc(ACCOUNT)}"><b>${esc(nick())}</b></span><span class="pill coin">${curIc("coin")} <b>${SAVE.coins}</b></span><span class="pill soul">${uiIc("soul", "")} <b>${SAVE.soul || 0}</b></span><button class="pill dlp" id="dlp" hidden></button></div>${location.protocol.startsWith("http") && /Android/i.test(navigator.userAgent) && !/; wv\)/.test(navigator.userAgent) ? (PLAY_URL ? `<a class="back" href="${PLAY_URL}" target="_blank" rel="noopener">앱 받기</a>` : '<a class="back" href="요괴록.apk" download>앱 받기</a>') : ""}${isWebPlay() && !IS_TOUCH && !window.YogoApp ? '<button class="back" id="pcinst">PC 앱 설치</button>' : ""}<button class="back" id="noticeb">공지${noticeNew() ? '<i class="ndot"></i>' : ""}</button><button class="back" id="logout">로그아웃</button></div>
      <div class="body hubbody">
        <div class="hubcol hubl">
          <div class="hubhero"><img src="${imgSrc("card_" + charArt(cur))}" alt=""><div><small>지금 영웅</small><b>${CHAR[cur].name}</b><span>${CHAR[cur].job}</span></div></div>
          ${SAVE.resume && CHAR[SAVE.resume.char] ? `<button class="btn gold hubgo" id="resume"><small>이어서 내려가기</small>${CHAR[SAVE.resume.char].name} · ${SAVE.resume.floor}장 ${SAVE.resume.stage}스테이지 · Lv.${SAVE.resume.lvl}${SAVE.resume.diff !== "normal" ? " · " + DIFF[SAVE.resume.diff].name : ""}</button>` : ""}
          ${typeof todayCard === "function" ? todayCard() : ""}${typeof festivalBanner === "function" ? festivalBanner() : ""}${typeof dailyCard === "function" ? dailyCard() : ""}${typeof storeCard === "function" ? storeCard() : ""}
        </div>
        <div class="hubcol hubr">
          <h3 class="hubh">출정</h3>
          <div class="modes">
            ${modeRow("story", "스토리", `다섯 장의 이야기 · 도달 ${SAVE.story.maxFloor}장`)}
            ${modeRow("endless", "무한의 방", (SAVE.stats.endlessBest ? `끝없는 방 · 최고 ${SAVE.stats.endlessBest}번째` : "끝없이 내려가는 방"))}
            ${modeRow("raid", "보스 레이드", "장 보스 다섯 연속")}
            ${modeRow("duel", "1대1 대전", `3판 2선승 · ${SAVE.stats.duelWins || 0}승`)}
            ${modeRow("practice", "연습장", "모든 영웅 체험 · 허수아비")}
            ${ACCOUNT === DEV_ID ? modeRow("dev", "개발자 맵", "보스·상점·스킬 확인") : ""}
          </div>
          ${UI.bountyCard()}
        </div>
      </div>
      <nav class="dock">
        ${dock("chars", "chars", "영웅", `<em>${Object.keys(SAVE.chars).length}</em>`)}${dock("skills", "skills", "스킬")}${dock("gacha", "gacha", "뽑기", freeToday() ? "<em class=\"free\">무료</em>" : "")}${dock("bag", "bag", "소지품")}
        ${dock("altar", "altar", "혼불 제단", altarDot)}${dock("season", "season", "토벌 시즌", typeof seasonUnclaimed === "function" && seasonUnclaimed() ? '<i class="dot"></i>' : "")}${dock("missions", "missions", "임무", mc ? '<i class="dot"></i>' : "")}${dock("bestiary", "book", "도감")}
        ${dock("history", "history", "기록")}${dock("multi", "multi", "함께하기")}${dock("howto", "howto", "도움말")}${dock("settings", "settings", "설정")}
      </nav>
      <p class="hubver">v${GAME_VERSION}</p></div>`;
    if (!(st.rooms || 0) && !dev) { const sm = document.querySelector('.mode[data-m="story"]'); if (sm) { sm.classList.add("starthere"); const e = document.createElement("em"); e.className = "shere"; e.textContent = "▶ 여기서 시작!"; sm.appendChild(e); } } // 11-18 처음 온 사람 길잡이
    document.querySelectorAll(".mode,.sub").forEach((b) => { const k = b.dataset.m || b.dataset.s; if (GATE[k]) { b.classList.add("lock"); const e = document.createElement("em"); e.className = "lkb"; e.textContent = "🔒 " + GATE[k].replace(/^스토리 (\d)장 보스를 쓰러뜨리면 열려요$/, "$1장 보스 토벌 뒤 열림"); b.appendChild(e); } });
    document.querySelectorAll(".mode").forEach((b) => (b.onclick = () => GATE[b.dataset.m] ? UI.toast("🔒 " + GATE[b.dataset.m], 2500) : b.dataset.m === "story" ? ((SAVE.stats.rooms || 0) < 3 && !SAVE.resume && SAVE.chars[SAVE.sel] ? UI.startRun({ mode: "story", char: SAVE.sel, floor: 1, diff: "normal" }) : UI.saga()) : UI.chars({ mode: b.dataset.m })));
    setArtVars(); titleParts(); // 11-17 하이엔드 메뉴: 떠오르는 풍등 + 카드가 마우스를 따라 기울고 금빛이 훑음
    if (matchMedia("(hover: hover)").matches) document.querySelectorAll(".mode").forEach((b) => {
      b.onpointermove = (e) => { const r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; b.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-3px)`; b.style.setProperty("--mx", (x + 0.5) * 100 + "%"); b.style.setProperty("--my", (y + 0.5) * 100 + "%"); };
      b.onpointerleave = () => { b.style.transform = ""; }; });
    if ($("#dailyb")) $("#dailyb").onclick = () => dailyStart();
    if ($("#storeb")) $("#storeb").onclick = () => storeClaim();
    if ($("#resume")) $("#resume").onclick = () => { const R = SAVE.resume; UI.startRun({ mode: "story", char: R.char, floor: R.floor, diff: R.diff, resume: R }); };
    document.documentElement.classList.toggle("bigtxt", !!(SAVE.settings && SAVE.settings.bigText)); // 11-19 글자 크게
    const isNew = (SAVE.stats.rooms || 0) < 3 && ACCOUNT !== DEV_ID;
    dayOpen();
    if (window.YogoApp && YogoApp.review && !SAVE.reviewAsked && (SAVE.stats.storyClear || 0) >= 1) setTimeout(() => { if (!G && !UI.modalOpen() && !SAVE.reviewAsked) { SAVE.reviewAsked = Date.now(); saveGame(); track("review_ask"); try { YogoApp.review(); } catch (e) { } } }, 1800); // 11-19 사용자: 별점은 처음 게임(스토리)을 완전히 끝낸 뒤 메뉴로 돌아왔을 때 한 번만 — 판 중간에 뜨면 방해 // 11-19 첫 판 전에는 안내창을 미루고 바로 놀게 (첫 세션 길이가 다음 날 잔존율을 좌우)
    if (!isNew && SAVE.daily && SAVE.daily.day !== new Date().toDateString()) setTimeout(() => { if (!G && !UI.modalOpen()) UI.daily(); }, 500);
    if (SAVE.bounty && !isNew) setTimeout(() => { if (!G) UI.tip("bounty"); }, 1200);
    if ((SAVE.soul || 0) >= 20) setTimeout(() => { if (!G) UI.tip("altar"); }, 2600); // 11-18 첫 혼불
    if (ASSETS.packs) setTimeout(() => { if (!SAVE) return; needPack(charPack(SAVE.sel), LATER); needPack("mob3d", LATER); needPack("f1", LATER); needPack("g", LATER); if (!/autotest/.test(location.hash)) { if (!ls.get("ygr_dl")) { if (!G && !UI.modalOpen() && (SAVE.stats.rooms || 0) >= 10) UI.dlAsk(); } else if (ls.get("ygr_dl") === "all") dlAll(); } }, 1500);
    dlPill(); // 11-15: 1.5초 안에 로그아웃하면 SAVE가 비어 'reading sel' 오류
    document.querySelectorAll(".tdi[data-go]").forEach((b) => (b.onclick = () => { const g = b.dataset.go; if (g === "daily") { if (typeof dailyStart === "function") dailyStart(); } else if (g === "store") { if (typeof storeClaim === "function") storeClaim(); } else if (g === "bounty") UI.chars({ mode: "endless" }); else UI.open(g); }));
    document.querySelectorAll(".sub").forEach((b) => (b.onclick = () => GATE[b.dataset.s] ? UI.toast("🔒 " + GATE[b.dataset.s], 2500) : UI.open(b.dataset.s)));
    if ($("#pcinst")) $("#pcinst").onclick = installPc;
    $("#noticeb").onclick = () => UI.notice();
    if (typeof ADS !== "undefined" && (ADS.on || ADS.active())) { const hb = document.querySelector(".hub .hubl, .hub .hubcol") || document.querySelector("#menu"); const el = document.createElement("button"); el.className = "adbless"; el.innerHTML = ADS.active() ? `<b>등불 축복</b> 혼불 ×${ADS.soulMul} · ${ADS.leftMin()}분 남음` : `<b>등불 축복 받기</b> 짧은 광고를 보면 ${ADS.buffMin}분 동안 혼불 ×${ADS.soulMul}`; el.disabled = ADS.active(); el.onclick = () => (SAVE.noAds ? (f) => f(true) : ADS.show.bind(ADS))((ok) => { if (ok) { ADS.grant(); UI.toast(`등불 축복 — ${ADS.buffMin}분 동안 혼불 ×${ADS.soulMul}`, 2600); UI.menu(); } }); if (hb) hb.prepend(el); }
    if (iapOn()) { const hb2 = document.querySelector(".hub .hubl, .hub .hubcol") || document.querySelector("#menu"); const sb = document.createElement("button"); sb.className = "adbless iapb"; sb.innerHTML = "<b>등불 상점</b> 코인·꾸밈·편의 상품"; sb.onclick = () => UI.cashShop(); if (hb2) hb2.prepend(sb); } // 11-22 유료 상품(정식 출시 때만)
    if (!UI._noticeAuto && noticeAutoOk()) { UI._noticeAuto = 1; let n = 0; const tryN = () => { if (G) return; if (UI.modalOpen() || document.querySelector("#tutor, #langpick")) { if (++n < 60) setTimeout(tryN, 700); return; } UI.notice(true); }; setTimeout(tryN, 700); } // 출석 등 다른 창을 닫으면 이어서
    $("#logout").onclick = () => { saveGame(); CLOUD.push(true); CLOUD.off(); ls.set("ygr_auto", ""); ACCOUNT = null; SAVE = null; music(null); $("#bgm").pause(); UI.login(); };
  },

  // ----- 캐릭터 -----
  chars(opt) { opt = opt || {};
    const mode = opt.mode, sel = opt.sel || SAVE.sel; UI._ctab = UI._ctab || "sk";
    const title = mode ? { story: "📖 스토리 모드 · 영웅 선택", endless: "♾️ 무한의 방 · 영웅 선택", duel: "⚔️ 1대1 대전 · 영웅 선택", raid: "🐉 보스 레이드 · 영웅 선택", dev: "🛠 개발자 맵 · 영웅 선택", practice: "🎯 연습장 · 모든 영웅 체험" }[mode] : "영웅";
    // 등급별로 묶어서 (사용자 요청 11-12): SS → S → A → B → C, 등급 안에서는 가진 캐릭터 먼저
    const GR = ["SS", "S", "A", "B", "C"], vis = CHARS.filter((c) => (!c.unlock.secret || SAVE.chars[c.id]) && (SAVE.chars[c.id] || typeof isReleased !== "function" || isReleased(c.id)));
    const card1 = (c) => {
      const own = !!SAVE.chars[c.id], art = charArt(c.id, c.forms ? "wolf" : null);
      return `<button class="ch ${own ? "" : "lock"} ${c.id === sel ? "on" : ""}" data-c="${c.id}" style="background-image:url(${imgSrc("card_" + art)})">
        <span class="tag"><b style="color:${GRADE_INFO[CHAR_GRADE[c.id]].col}">${CHAR_GRADE[c.id]}</b> ${UNLOCK_TYPE[c.unlock.type]}</span>${own ? "" : '<span class="lk">🔒</span>'}${mode === "story" && (() => { const y = YOKAI_EL[((SAVE.resume && SAVE.resume.floor) || SAVE.story.maxFloor || 1) - 1]; return y && y.strong.includes(nearEl(c.col)); })() ? '<span class="rec">추천</span>' : ""}<span class="nm">${c.name}<small>${c.job}${(SAVE.enh || {})[c.id] ? " +" + SAVE.enh[c.id] : ""}</small></span>${own && typeof mastBadge === "function" ? mastBadge(c.id) : ""}</button>`;
    };
    const grid = GR.map((g) => { const cs = vis.filter((c) => (CHAR_GRADE[c.id] || "C") === g).sort((a, b) => (SAVE.chars[b.id] ? 1 : 0) - (SAVE.chars[a.id] ? 1 : 0)); if (!cs.length) return "";
      return `<div class="grhead" style="grid-column:1/-1;border-color:${GRADE_INFO[g].col}"><b style="color:${GRADE_INFO[g].col}">${g}급</b> <span class="muted">${cs.filter((c) => SAVE.chars[c.id]).length}/${cs.length}</span></div>` + cs.map(card1).join(""); }).join("");
    UI.frame(title, `<div class="charwrap"><div class="chars">${grid}</div><div class="detail card" id="cdet"></div></div>`, () => UI.menu());
    const show = (id) => {
      const c = CHAR[id], own = !!SAVE.chars[id], up = unlockProgress(c);
      document.querySelectorAll(".ch").forEach((b) => b.classList.toggle("on", b.dataset.c === id));
      const forms = c.forms ? Object.keys(c.forms) : [null];
      const f0 = forms[Math.floor(Date.now() / 3000) % forms.length];
      const def = charDef(id, f0), art = charArt(id, f0), eq = SAVE.skillEquip[id] || {};
      const skills = ["Q", "W", "E", "R"].map((s, i) => { const k = eq[s], sd = k && SKILLS[k] ? SKILLS[k] : c.sk[i];
        return `<div class="skl"><span class="k">${abIc(k ? "gs_" + k : "sk_" + id + "_" + i, sd.ic, 30)}<small>${{ Q: "1", W: "2", E: "3", R: "4" }[s]}</small></span><div><b>${sd.name}</b> ${k ? `<span class="grade" style="background:${SK_GRADE[sd.grade].col}">${sd.grade}</span>` : '<span class="muted">기본</span>'} <span class="muted">· ${sd.cd}초</span>${sd.lore ? `<div class="lore">${esc(sd.lore)}</div>` : ""}<div class="muted">${sd.desc}</div></div></div>`; }).join("");
      const lockInfo = own ? "" : c.unlock.type === "gacha" ? `<p>🎰 <b>뽑기 전용 ${CHAR_GRADE[id]}급 영웅</b> — 영웅 뽑기로 조각 ${shardNeed(id)}개를 모으면 해금 (지금 ${(SAVE.shards || {})[id] || 0}개) · 아주 낮은 확률로 바로 획득</p><div class="prog"><i style="width:${Math.min(100, ((SAVE.shards || {})[id] || 0) / shardNeed(id) * 100)}%"></i></div>`
        : `<p>🔒 <b>${UNLOCK_TYPE[c.unlock.type]}</b>: ${c.unlock.text}</p><div class="prog"><i style="width:${(up.cur / up.n) * 100}%"></i></div><p class="muted">${(up.parts || [up.cur + " / " + up.n]).join(" · ")}</p>`;
      let start = "";
      const tryable = own || mode === "practice";
      if (mode && tryable) {
        if (mode === "story") start = `<p>시작 장: <span id="fsel">${FLOORS.map((f, i) => `<button class="btn sm ${i + 1 === (opt.floor || 1) ? "gold" : ""}" data-f="${i + 1}" ${i + 1 > SAVE.story.maxFloor ? "disabled" : ""}>${i + 1}장</button>`).join(" ")}</span></p>`;
        const dbtn = (keys) => `<p>난이도: <span id="dsel">${keys.map((k) => `<button class="btn sm ${k === "normal" ? "gold" : ""}" data-d="${k}" style="color:${DIFF[k].col}">${DIFF[k].name}</button>`).join(" ")}</span> <span class="muted" style="font-size:.78rem">보상(엽전·경험·혼불) ${keys.map((k) => DIFF[k].name + " ×" + DIFF[k].rw).join(" · ")}</span>${typeof recDiff === "function" ? recDiff(id, keys) : ""}</p>`;
        if (mode === "story") start += dbtn(["easy", "normal", "hard", "hell"]);
        if (mode === "endless") start += dbtn(["easy", "normal", ...(SAVE.endlessHard ? ["hard"] : []), ...(SAVE.endlessHell ? ["hell"] : [])]) + (!SAVE.endlessHard ? `<p class="muted" style="font-size:.78rem">🔒 어려움: 보통 이상으로 무한의 방 5층 보스(1회차)를 토벌하면 열려요 (보상 ×1.5)</p>` : !SAVE.endlessHell ? `<p class="muted" style="font-size:.78rem">🔒 매우 어려움: 어려움으로 5층 보스까지 토벌하면 열려요 (보상 ×2)</p>` : "");
        if (mode === "duel") start = `<p>상대 강함: <span id="dsel">${[["easy", "쉬움"], ["normal", "보통"], ["hard", "어려움"]].map(([k, n], i) => `<button class="btn sm ${i === 1 ? "gold" : ""}" data-d="${k}">${n}</button>`).join(" ")}</span></p>`;
        if ((mode === "story" || mode === "endless") && ((SAVE.stats.storyClear || 0) > 0 || ACCOUNT === DEV_ID)) start += `<div class="taboo"><b>금기 계약</b> <span class="muted">저주를 걸고 내려가면 하나마다 혼불 +20%</span><div class="tbl">${Object.entries(CURSES).map(([k, c]) => `<button class="tbc ${(SAVE.taboo || []).includes(k) ? "on" : ""}" data-tb="${k}" title="${esc(c.desc)}">${esc(c.name.replace("의 저주", ""))}<small>${esc(c.desc)}</small></button>`).join("")}</div><p class="muted" id="tbsum"></p></div>`;
        start += `<button class="btn gold" id="go" style="width:100%;font-size:1.3rem">${!own ? "🎯 체험해 보기 ▶" : "이 영웅으로 출발 ▶"}</button>`;
      }
      $("#cdet").innerHTML = `<div class="big anim-card">${animCard(art, true)}</div>
        <h3 style="margin-top:10px">${c.name} · ${c.job} ${(SAVE.enh || {})[id] ? `<span class="stars">+${SAVE.enh[id]}</span>` : ""}</h3>
        ${HERO_LINES[id] ? `<p class="hline">“${esc(HERO_LINES[id][0])}”</p>` : ""}
        ${c.forms ? `<p class="muted">🎲 출발할 때마다 <b>늑대인간(남)</b> 또는 <b>구미호(여)</b> 모습이 랜덤으로 정해져요. 늑대인간은 근접 발톱, 구미호는 여우 구슬(원거리)</p>` : ""}
        <p><span class="grade" style="background:${GRADE_INFO[CHAR_GRADE[id]].col}">${CHAR_GRADE[id]}급</span> <span class="muted">체력 ${Math.round(def.hp * GRADE_INFO[CHAR_GRADE[id]].mul * (1 + 0.04 * ((SAVE.enh || {})[id] || 0)))} · 공격 ${Math.round(def.atk * GRADE_INFO[CHAR_GRADE[id]].mul * (1 + 0.04 * ((SAVE.enh || {})[id] || 0)))} · 이동 ${def.spd} · ${def.range} · 사거리 ${CHAR_RANGE[art] || CHAR_RANGE[id] || "-"} · 속성 <b style="color:${(ACT_EL.find((e) => e.k === nearEl(def.col)) || {}).col}">${EL_NAME[nearEl(def.col)] || "-"}</b></span></p>
        ${own && typeof mastLv === "function" ? (() => { const l = mastLv(id), x = (SAVE.mast || {})[id] || 0, nx = MAST_XP[l]; return `<div class="card mastc"><b>숙련 Lv.${l}</b> ${mastBadge(id)}<div class="prog"><i style="width:${nx ? Math.min(100, ((x - MAST_XP[l - 1]) / (nx - MAST_XP[l - 1])) * 100) : 100}%"></i></div><span class="muted">${nx ? `${x}/${nx} · ` : "최고 단계 · "}이 영웅 공격력·체력 +${l - 1}% (판을 할수록 올라요)</span></div>`; })() : ""}
        ${own ? `<div class="card" style="padding:8px;margin:6px 0;display:flex;gap:10px;align-items:center"><b style="font-family:var(--display);font-size:1.2rem;color:var(--gold2)">강화 +${(SAVE.enh || {})[id] || 0}</b><span class="muted" style="flex:1">조각 ${(SAVE.shards || {})[id] || 0}${((SAVE.enh || {})[id] || 0) < SHARD.maxEnh ? " / 다음 강화 " + SHARD.enhCost((SAVE.enh || {})[id] || 0) + " · 성공 " + Math.round(SHARD.enhRate((SAVE.enh || {})[id] || 0) * 100) + "%" : " · 최대"} · 단계마다 공격·체력 +4%</span><button class="btn sm gold" id="enhbtn" ${((SAVE.shards || {})[id] || 0) >= SHARD.enhCost((SAVE.enh || {})[id] || 0) && ((SAVE.enh || {})[id] || 0) < SHARD.maxEnh ? "" : "disabled"}>강화</button></div>` : ""}
        <div class="ctabs">${[["sk", "스킬", "📜"], ["job", "전직", "⚔️"], ["info", "정보", "📖"]].map(([k, n, ic]) => `<button class="ctab ${k === UI._ctab ? "on" : ""}" data-ct="${k}"><span class="cti">${ic}</span><span>${n}</span></button>`).join("")}</div>
        <div id="ctsk" ${UI._ctab === "sk" ? "" : "hidden"}><div class="skl"><span class="k">${abIc("sk_" + id + "_b", "🖱️", 30)}<small>${IS_TOUCH ? "공격" : "좌클릭"}</small></span><div><b>${def.basic.name}</b> <span class="muted">기본 공격 · ${def.basic.cd}초</span></div></div>${skills}</div>
        <div id="ctjob" ${UI._ctab === "job" ? "" : "hidden"}><p class="muted" style="font-size:.8rem;margin:4px 0">원정 중 레벨이 되면 둘 중 하나를 골라요 (그 원정 동안)</p><div class="jobtree">${JOB_LEVELS.map((lv, t) => { const o = jobOptions(id, t); return `<div class="jobrow"><div class="lv"><b>Lv.${lv}</b>${t + 1}차${t >= 3 ? (t === 3 ? " 각성" : " 초월") : ""}</div>${o.map((x) => `<div class="jb ${x.kind}"><b>${x.name}</b>${x.desc}<i>✨ ${x.skill}</i></div>`).join("")}</div>`; }).join("")}</div></div>
        <div id="ctinfo" ${UI._ctab === "info" ? "" : "hidden"}><div class="card" style="padding:8px;line-height:1.8;font-size:.88rem">
          <div>등급 <b style="color:${GRADE_INFO[CHAR_GRADE[id]].col}">${CHAR_GRADE[id]}급</b> <span class="muted">(기본 능력 ×${GRADE_INFO[CHAR_GRADE[id]].mul})</span></div>
          <div>얻는 법 <b>${UNLOCK_TYPE[c.unlock.type]}</b> <span class="muted">${c.unlock.type === "gacha" ? "영웅 뽑기 · 조각 " + shardNeed(id) + "개" : esc(c.unlock.text || "")}</span></div>
          <div>속성 <b>${EL_NAME[nearEl(def.col)] || "-"}</b> · 공격 방식 <b>${def.range}</b> · 사거리 <b>${CHAR_RANGE[art] || CHAR_RANGE[id] || "-"}</b></div>
          <div>${(() => { const R = ROLE_MODS[ROLE_OF(def.range)]; return R ? `${R.m.atk < 0 ? "🏹" : "🛡️"} <b>${R.name}</b> <span class="muted">${R.desc}</span>` : ""; })()}</div>
          <div>조각 <b>${(SAVE.shards || {})[id] || 0}</b> · 강화 <b>+${(SAVE.enh || {})[id] || 0}</b> / ${SHARD.maxEnh}</div>
          ${own ? `<div>장착 스킬 <b>${["Q", "W", "E", "R"].filter((s) => eq[s]).length}</b>/4 칸 바꿈</div>` : ""}</div></div>
        ${lockInfo}<div style="margin-top:12px">${start}</div>
        ${own ? `<button class="btn sm" id="toSk" style="margin-top:8px">📜 이 영웅 스킬 바꾸기</button>` : ""}`;
      let floor = Math.min(opt.floor || 1, SAVE.story.maxFloor || 1), diff = "normal";
      document.querySelectorAll("#fsel button").forEach((b) => (b.onclick = () => { floor = +b.dataset.f; document.querySelectorAll("#fsel button").forEach((x) => x.classList.toggle("gold", x === b)); }));
      document.querySelectorAll("#dsel button").forEach((b) => (b.onclick = () => { diff = b.dataset.d; document.querySelectorAll("#dsel button").forEach((x) => x.classList.toggle("gold", x === b)); }));
      const tbSum = () => { const n = (SAVE.taboo || []).length; if ($("#tbsum")) $("#tbsum").textContent = n ? `금기 ${n}개 · 혼불 +${n * 20}%` : "고르지 않으면 평소처럼"; };
      document.querySelectorAll(".tbc").forEach((b) => (b.onclick = () => { const k = b.dataset.tb, T = (SAVE.taboo = SAVE.taboo || []); const i = T.indexOf(k); if (i >= 0) T.splice(i, 1); else T.push(k); b.classList.toggle("on", i < 0); saveGame(); tbSum(); })); tbSum();
      if ($("#go")) $("#go").onclick = () => { if (own) { SAVE.sel = id; saveGame(); } UI.startRun({ mode, char: id, floor, diff, taboo: (mode === "story" || mode === "endless") && $(".tbc") ? (SAVE.taboo || []).slice() : [] }); };
      if ($("#toSk")) $("#toSk").onclick = () => UI.skills({ char: id });
      document.querySelectorAll("[data-ct]").forEach((b) => (b.onclick = () => { UI._ctab = b.dataset.ct; for (const k of ["sk", "job", "info"]) $("#ct" + k).hidden = k !== UI._ctab; document.querySelectorAll("[data-ct]").forEach((x) => x.classList.toggle("on", x === b)); }));
      if ($("#enhbtn")) $("#enhbtn").onclick = () => { SAVE.enh = SAVE.enh || {}; const lv = SAVE.enh[id] || 0, cost = SHARD.enhCost(lv); if ((SAVE.shards[id] || 0) < cost || lv >= SHARD.maxEnh) return; SAVE.shards[id] -= cost; if (Math.random() < SHARD.enhRate(lv)) { SAVE.enh[id] = lv + 1; UI.toast(`⬆️ ${CHAR[id].name} 강화 성공! +${lv + 1}`); } else { UI.toast(`💥 강화 실패 (+${lv} 유지)`); } saveGame(); show(id); };
      if (own) { SAVE.sel = id; saveGame(); }
    };
    document.querySelectorAll(".ch").forEach((b) => (b.onclick = () => show(b.dataset.c)));
    show(sel);
  },
  startRun(opt) {
    if (typeof opsGate === "function" && opsGate()) return; // 11-22 점검·일괄 업데이트 중에는 새 판을 막음
    UI._runChar = opt.char;
    if (opt.mode === "story" && !opt.resume && !opt.multi && !opt._newOk && !opt.daily && SAVE.resume && CHAR[SAVE.resume.char]) {
      const R = SAVE.resume;
      UI.modal(`<h2>💾 저장된 스토리가 있어요</h2><p style="text-align:center">${CHAR[R.char].name} · ${R.floor}장 ${R.stage}스테이지 · Lv.${R.lvl}</p>
        <div class="center"><button class="btn gold" id="svcont">▶ 이어하기</button><button class="btn" id="svnew">새로 시작 (저장 지움)</button></div>`);
      $("#svcont").onclick = () => { UI.closeModal(); UI.startRun({ mode: "story", char: R.char, floor: R.floor, diff: R.diff, resume: R }); };
      $("#svnew").onclick = () => { UI.closeModal(); delete SAVE.resume; saveGame(); UI.startRun(Object.assign({}, opt, { _newOk: true })); };
      return;
    }
    if (ASSETS.packs && !opt._ready) { UI.loading(opt); return; }
    $("#screens").innerHTML = ""; $("#hud").hidden = false;
    if (opt.mode === "story" && !opt.daily && !opt.multi && !SAVE.story.seen.open) { SAVE.story.seen.open = 1; saveGame(); UI.story("open", () => { UI.story(opt.floor, () => newRun(opt)); }); return; }
    if (opt.mode === "story" && !opt.multi && !(opt.resume && opt.resume.stage > 1)) { UI.story(opt.floor, () => newRun(opt)); return; }
    newRun(opt);
  },

  // ----- 스킬 장착 -----
  skills(opt) { opt = opt || {};
    const owned = Object.keys(SAVE.chars);
    const cid = opt.char && SAVE.chars[opt.char] ? opt.char : SAVE.sel;
    const c = CHAR[cid], eq = SAVE.skillEquip[cid] || (SAVE.skillEquip[cid] = {});
    const tabs = owned.map((id) => `<button class="tab ${id === cid ? "on" : ""}" data-c="${id}">${CHAR[id].name}</button>`).join("");
    const cols = ["Q", "W", "E", "R"].map((s, i) => {
      const list = SKILL_KEYS.filter((k) => SKILLS[k].slot === s && SAVE.skills[k] && (!SKILLS[k].owner || SKILLS[k].owner === cid));
      list.sort((a, b) => SK_GRADES.indexOf(SKILLS[b].grade) - SK_GRADES.indexOf(SKILLS[a].grade));
      const base = c.sk[i];
      const row = (k, sd, on, lv) => `<button class="item ${on ? "eq" : ""}" data-s="${s}" data-k="${k}" style="min-height:0;align-items:flex-start;text-align:left;width:100%"><div>${abIc(k ? "gs_" + k : "sk_" + cid + "_" + i, `<span style="font-size:1.4rem">${sd.ic}</span>`, 36)} <b>${sd.name}</b> ${k ? `<span class="grade" style="background:${SK_GRADE[sd.grade].col}">${sd.grade}</span>${sd.owner ? ' <span class="muted">고유</span>' : ""} <span class="muted">Lv.${lv}</span>` : '<span class="muted">기본</span>'}</div><div class="muted">${sd.desc} · ${sd.cd}초</div></button>`;
      return `<div class="card"><h3>${{ Q: "1번", W: "2번", E: "3번", R: "4번" }[s]} 칸 ${s === "R" ? "· 궁극기" : ""}</h3><div style="display:flex;flex-direction:column;gap:6px">${row("", base, !eq[s])}${list.map((k) => row(k, SKILLS[k], eq[s] === k, SAVE.skills[k])).join("")}</div>
        ${list.length ? "" : '<p class="muted">뽑기에서 이 칸 스킬을 뽑으면 여기에 나와요</p>'}</div>`;
    }).join("");
    UI.frame("스킬 장착", `<div class="tabs">${tabs}</div><p class="muted">같은 스킬을 또 뽑으면 Lv.업 (피해 +10%, 최대 Lv.5)</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${cols}</div>`);
    document.querySelectorAll(".tab").forEach((b) => (b.onclick = () => UI.skills({ char: b.dataset.c })));
    document.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => { if (b.dataset.k) eq[b.dataset.s] = b.dataset.k; else delete eq[b.dataset.s]; saveGame(); UI.skills({ char: cid }); }));
  },

  // ----- 가챠 -----
  gacha(opt) { opt = opt || {};
    if (ASSETS.packs && !PACK.done.g) needPack("g").then(() => { if (UI._frameTitle === "뽑기") UI.gacha(opt); });
    const tab = opt.tab || "char", slot = opt.slot || "Q";
    music("gacha");
    // 보유 개수 (사용자 요청 11-13: 0/30처럼 남은 개수 보기 쉽게)
    const gcnt = (k) => { if (k === "char") { const hs = CHARS.filter((c) => c.unlock.type === "gacha"); return [hs.filter((c) => SAVE.chars[c.id]).length, hs.length]; } if (k === "skill") return [SKILL_KEYS.filter((x) => SAVE.skills[x]).length, SKILL_KEYS.length];
      const T = { art: [ARTIFACTS, "arts"], pet: [PETS, "pets"], title: [TITLES, "titles"] }[k], pool = gachaPool(T[0]); return [pool.filter((x) => SAVE[T[1]][x]).length, pool.length]; };
    const cntPill = (k) => { const [a, b] = gcnt(k); return `<div class="gcount"><b>${a}</b><span>/ ${b}</span><small>${a >= b ? "모두 모았어요!" : "남은 " + (b - a) + "개"}</small></div>`; };
    const tabs = [["char", "🧑 영웅"], ["skill", "📜 스킬"], ["art", "🔮 보물"], ["pet", "🐾 펫"], ["title", "🏷️ 칭호"]].map(([k, n]) => { const [a, b] = gcnt(k); return `<button class="tab ${k === tab ? "on" : ""}" data-t="${k}">${n} <small>${a}/${b}</small></button>`; }).join("");
    let body = "";
    const pctRow = (rates) => Object.entries(rates).sort((a, b) => b[0] - a[0]).map(([r, p]) => `<span class="pill" style="border-color:${RARITY[r].col}"><b style="color:${RARITY[r].col}">${RARITY[r].name}</b> ${(p * 100).toFixed(1)}%</span>`).join("");
    if (tab === "char") {
      const heroes = CHARS.filter((c) => c.unlock.type === "gacha");
      body = `${typeof pickupHtml === "function" ? pickupHtml() : ""}<div class="banner"><h3>🧑 영웅 뽑기</h3>${cntPill("char")}<div class="grcount">${["SS", "S", "A", "B", "C"].map((g) => { const hs = heroes.filter((c) => CHAR_GRADE[c.id] === g); return `<span style="border-color:${GRADE_INFO[g].col}"><b style="color:${GRADE_INFO[g].col}">${g}</b> ${hs.filter((c) => SAVE.chars[c.id]).length}/${hs.length}</span>`; }).join("")}</div>
        <div class="chars" style="grid-template-columns:repeat(auto-fill,minmax(110px,140px))">${heroes.sort((a, b) => ["SS", "S", "A", "B", "C"].indexOf(CHAR_GRADE[a.id]) - ["SS", "S", "A", "B", "C"].indexOf(CHAR_GRADE[b.id])).map((c) => `<div class="ch anim-card ${SAVE.chars[c.id] ? "" : "lock"}">${animCard(c.id)}<span class="tag" style="z-index:2"><b style="color:${GRADE_INFO[CHAR_GRADE[c.id]].col}">${CHAR_GRADE[c.id]}급</b></span><span class="nm" style="z-index:2">${c.name}<small>${c.job} · ${SAVE.chars[c.id] ? "보유" : "조각 " + ((SAVE.shards || {})[c.id] || 0) + "/" + shardNeed(c.id)}</small></span></div>`).join("")}</div>
        <div class="rates">${["SS", "S", "A", "B", "C"].map((g) => `<span class="pill" style="border-color:${GRADE_INFO[g].col}"><b style="color:${GRADE_INFO[g].col}">${g}급</b> ${(GACHA_GRADE_RATE[g] * 100).toFixed(2)}% · 조각 ${SHARD.per[g][0]}~${SHARD.per[g][1]}개 (해금 ${SHARD.need[g]}개) · 바로 획득 ${(GACHA_GRADE_RATE[g] * SHARD.direct[g] * 100).toFixed(3)}%</span>`).join("")}<span class="pill">나머지: 가진 영웅 조각 2~5개 (강화용)</span><span class="pill">보장까지 ${SHARD.pity}회 · 지금 <b>${SAVE.pity || 0}</b>회째</span></div>
        <div class="row"><button class="btn gold" data-p="1">1회 · ${curIc("coin")}${GACHA.char.cost}</button><button class="btn gold" data-p="10">10회 · ${curIc("coin")}${GACHA.char.cost10}</button></div></div>`;
    } else if (tab === "skill") {
      const st = ["Q", "W", "E", "R"].map((s) => `<button class="tab ${s === slot ? "on" : ""}" data-sl="${s}">${{ Q: "1", W: "2", E: "3", R: "4" }[s]}번 칸${s === "R" ? " (궁극기)" : ""}</button>`).join("");
      const list = SKILL_KEYS.filter((k) => SKILLS[k].slot === slot).sort((a, b) => SK_GRADES.indexOf(SKILLS[b].grade) - SK_GRADES.indexOf(SKILLS[a].grade));
      body = `<div class="banner"><h3>📜 스킬 뽑기 — ${{ Q: "1", W: "2", E: "3", R: "4" }[slot]}번 칸</h3>${cntPill("skill")}
        <div class="tabs">${st}</div>
        <div class="chars" style="grid-template-columns:repeat(auto-fill,minmax(110px,140px))">${list.map((k) => { const s = SKILLS[k]; return gCard(`<div class="kb" style="background-image:url(${imgSrc("gs_" + k)})"></div><i class="shine"></i>`, `<b style="color:${SK_GRADE[s.grade].col}">${s.grade}급</b>`, s.name, (s.owner ? CHAR[s.owner].name + " 고유" : "공용") + (SAVE.skills[k] ? " · Lv." + SAVE.skills[k] : ""), !!SAVE.skills[k], s.desc); }).join("")}</div>
        <div class="rates">${SK_GRADES.slice().reverse().map((g) => `<span class="pill" style="border-color:${SK_GRADE[g].col}"><b style="color:${SK_GRADE[g].col}">${g}급</b> ${(SK_GRADE[g].p * 100).toFixed(1)}%</span>`).join("")}</div>
        <div class="row"><button class="btn gold" data-p="1">1회 · ${curIc("coin")}${SKILL_GACHA.cost[slot]}</button><button class="btn gold" data-p="10">10회 · ${curIc("coin")}${SKILL_GACHA.cost10[slot]}</button></div></div>`;
    } else {
      const g = GACHA[tab], T = { art: [ARTIFACTS, ART_KEYS, "arts"], pet: [PETS, PET_KEYS, "pets"], title: [TITLES, TITLE_KEYS, "titles"] }[tab];
      const pool = gachaPool(T[0]).sort((a, b) => T[0][b].rar - T[0][a].rar);
      body = `<div class="banner"><h3>${g.name}</h3>${cntPill(tab)}<p class="muted">10회 뽑기는 희귀 이상 1개 보장</p>
        <div class="chars" style="grid-template-columns:repeat(auto-fill,minmax(110px,140px))">${pool.map((k) => { const d = T[0][k], col = RARITY[d.rar].col; return gCard(gBg(tab, d), `<b style="color:${col}">${RARITY[d.rar].name}</b>`, d.name, SAVE[T[2]][k] ? "보유" + (SAVE[T[2]][k] > 1 ? " +" + (SAVE[T[2]][k] - 1) : "") : "미보유", !!SAVE[T[2]][k], d.desc); }).join("")}</div>
        <div class="rates">${pctRow(g.rates)}</div>
        <div class="row"><button class="btn gold" data-p="1">1회 · ${curIc("coin")}${g.cost}</button><button class="btn gold" data-p="10">10회 · ${curIc("coin")}${g.cost10}</button></div></div>
`;
    }
    UI.frame("뽑기", `<div class="tabs">${tabs}</div>${body}<p class="muted" style="margin-top:14px">🪙 코인: 원정 성적 · 요괴·상자·보스 · 임무 · 출석 · <a href="#" id="probl" style="color:var(--gold2)">🎲 확률 보기</a></p>`);
    if ($("#probl")) $("#probl").onclick = (e) => { e.preventDefault(); UI.info("prob", () => UI.open("gacha", opt)); };
    document.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => UI.gacha({ tab: b.dataset.t, slot })));
    document.querySelectorAll("[data-sl]").forEach((b) => (b.onclick = () => UI.gacha({ tab: "skill", slot: b.dataset.sl })));
    document.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => doPull(tab === "skill" ? "skill" : tab, +b.dataset.p, slot)));
    document.querySelectorAll(".row").forEach((rw) => { if (freeToday() && rw.querySelector('[data-p="1"]') && !rw.querySelector(".freeb")) { const fb = document.createElement("button"); fb.className = "btn freeb"; fb.innerHTML = "오늘 무료 1회"; fb.onclick = () => doPull(tab === "skill" ? "skill" : tab, 1, slot, false, true); rw.prepend(fb); } });
    document.querySelectorAll("[data-py]").forEach((b) => (b.onclick = () => doPull(tab === "skill" ? "skill" : tab, +b.dataset.py, slot, true)));
  },
  showPulls(res, after, revealed) {
    // 11-21 새 영웅은 결과 목록 전에 한 명씩 전체 화면으로 (수집형 게임의 '새 캐릭터 획득' 연출을 수묵식으로)
    const fresh = res.filter((r) => r.kind === "char" && r.isNew && CHAR[r.id]);
    if (fresh.length && !revealed) { UI.heroReveal(fresh, () => UI.showPulls(res, after, true)); return; }
    const cards = res.map((r, i) => {
      let col, inner, bg = "";
      if (r.kind === "char") { col = r.grade ? GRADE_INFO[r.grade].col : RARITY[4].col; inner = animCard(charArt(r.id, CHAR[r.id].forms ? "wolf" : null)) + `<span class="t" style="margin-top:auto">${r.direct ? `<b style="font-size:1.15em">${CHAR[r.id].name}</b>` : r.label}</span>`; return `<div class="rv anim-card legend" style="border-color:${col};animation-delay:${i * 0.12}s">${r.isNew ? '<span class="new">NEW</span>' : ""}${inner}</div>`; }
      else if (r.kind === "skill") { const s = SKILLS[r.id]; col = SK_GRADE[r.grade].col; inner = `<span class="ico">${abIc("gs_" + r.id, s.ic, 64)}</span><span class="grade" style="background:${col}">${r.grade}</span><span class="t">${r.label}</span><span class="muted" style="font-size:0.7rem">${{ Q: "1", W: "2", E: "3", R: "4" }[s.slot]}번 칸${s.owner ? " · " + CHAR[s.owner].name : ""}</span>`; }
      else if (r.kind === "shard") { col = "#ffd27a"; inner = animCard(charArt(r.id, CHAR[r.id].forms ? "wolf" : null)) + `<span class="t" style="margin-top:auto">${r.label}</span>`; return `<div class="rv anim-card shardfx" style="border-color:${col};box-shadow:0 0 22px ${col}88;animation-delay:${i * 0.12}s;--d:${(i * 0.12 + 0.35).toFixed(2)}s"><i class="sfx-ink"></i><i class="sfx-sp"></i><span class="sfx-tag">조각</span>${inner}</div>`; }
      else if (r.kind === "pet" && ASSETS.img["pcard_" + PETS[r.id].img.slice(3)]) { col = RARITY[r.rar].col; const pk = PETS[r.id].img.slice(3); inner = `<div class="kb" style="background-image:url(${imgSrc("pcard_" + pk)})"></div><i class="shine"></i><span class="t" style="margin-top:auto;color:${col};position:relative;z-index:2">${r.label}</span>`; return `<div class="rv anim-card" style="border-color:${col};box-shadow:0 0 18px ${col}66;animation-delay:${i * 0.12}s">${r.isNew ? '<span class="new">NEW</span>' : ""}${inner}</div>`; }
      else if (r.kind === "art" && ASSETS.img["acard_" + ARTIFACTS[r.id].img.slice(3)]) { col = RARITY[r.rar].col; inner = `<div class="kb" style="background-image:url(${imgSrc("acard_" + ARTIFACTS[r.id].img.slice(3))})"></div><i class="shine"></i><span class="t" style="margin-top:auto;color:${col};position:relative;z-index:2">${r.label}</span>`; return `<div class="rv anim-card" style="border-color:${col};box-shadow:0 0 18px ${col}66;animation-delay:${i * 0.12}s">${r.isNew ? '<span class="new">NEW</span>' : ""}${inner}</div>`; }
      else if (r.kind === "title" && ASSETS.img["tcard_" + r.id]) { col = RARITY[r.rar].col; inner = `<div class="kb" style="background-image:url(${imgSrc("tcard_" + r.id)})"></div><i class="shine"></i><span class="t" style="margin-top:auto;color:${col};position:relative;z-index:2">${r.label}</span>`; return `<div class="rv anim-card" style="border-color:${col};box-shadow:0 0 18px ${col}66;animation-delay:${i * 0.12}s">${r.isNew ? '<span class="new">NEW</span>' : ""}${inner}</div>`; }
      else if (r.kind === "misc") { col = RARITY[r.rar].col; inner = `<span class="ico">${r.ico}</span><span class="t">${r.label}</span>`; }
      else { col = RARITY[r.rar].col; const def = { art: ARTIFACTS, pet: PETS, title: TITLES }[r.kind][r.id]; inner = (def.img ? `<img src="${imgSrc(def.img)}" alt="">` : `<span class="ico">🏷️</span>`) + `<span class="t" style="color:${col}">${r.label}</span>`; }
      return `<div class="rv" style="border-color:${col};box-shadow:0 0 18px ${col}66;animation-delay:${i * 0.12}s;${bg}">${r.isNew ? '<span class="new">NEW</span>' : ""}${inner}</div>`;
    }).join("");
    UI.modal(`<h2>뽑기 결과</h2><div style="display:flex;justify-content:center"><div class="reveal">${cards}</div></div><div class="center">${res.length > 1 ? '<button class="btn" id="revall">⏩ 모두 공개</button>' : ""}<button class="btn gold" id="ok">확인</button></div>`);
    if ($("#revall")) $("#revall").onclick = () => { document.querySelectorAll(".reveal .rv").forEach((x) => { x.style.animationDelay = "0s"; x.style.animationDuration = "0.15s"; }); $("#revall").remove(); };
    $("#ok").onclick = () => { UI.closeModal(); after(); };
  },

  // ----- 보관함 -----
  bag(opt) { opt = opt || {};
    const tab = opt.tab || "art", T = { art: [ARTIFACTS, ART_KEYS, "arts"], pet: [PETS, PET_KEYS, "pets"], title: [TITLES, TITLE_KEYS, "titles"] }[tab];
    if (ASSETS.packs && !PACK.done.g) needPack("g").then(() => { if (UI._frameTitle === "보물 · 펫 · 칭호") UI.bag(opt); });
    const cnt = (k) => { const t = { art: [ARTIFACTS, "arts"], pet: [PETS, "pets"], title: [TITLES, "titles"] }[k]; return `${Object.keys(SAVE[t[1]]).filter((x) => t[0][x]).length}/${Object.keys(t[0]).filter((x) => t[0][x].how !== "secret" || SAVE[t[1]][x]).length}`; };
    const tabs = [["art", "🔮 보물"], ["pet", "🐾 펫"], ["title", "🏷️ 칭호"]].map(([k, n]) => `<button class="tab ${k === tab ? "on" : ""}" data-t="${k}">${n} ${cnt(k)}</button>`).join("");
    const E = SAVE.equip;
    const slotHtml = (k, def, lab) => `<div class="slot" style="${k ? "border-style:solid;border-color:var(--gold)" : ""}">${k ? (def.img ? `<img src="${imgSrc(def.img)}" alt="">` : "🏷️") + `<span>${def.name}</span>` : lab}</div>`;
    const slots = `<div class="slots">${slotHtml(E.arts[0], ARTIFACTS[E.arts[0]], "보물 1")}${slotHtml(E.arts[1], ARTIFACTS[E.arts[1]], "보물 2")}${slotHtml(E.pet, PETS[E.pet], "펫")}${slotHtml(E.title, TITLES[E.title], "칭호")}</div>`;
    const groups = ["gacha", "mission", "special", "drop", "story", "secret"].map((h) => { const ks = T[1].filter((k) => T[0][k].how === h && (h !== "secret" || SAVE[T[2]][k])); if (!ks.length) return "";
      return `<h3 style="margin-top:14px">${HOW_NAME[h]}${h === "story" ? " (스토리를 진행해야만 얻어요)" : ""} <span class="muted">${ks.filter((k) => SAVE[T[2]][k]).length}/${ks.length}</span></h3><div class="grid">${ks.map((k) => itemCard(tab, k, T[0][k], SAVE[T[2]][k], true)).join("")}</div>`; }).join("");
    UI.frame("보물 · 펫 · 칭호", `${slots}<p class="muted">눌러서 끼우고 빼요 · 대전에서는 적용 안 돼요</p><div class="tabs">${tabs}</div>${groups}`);
    document.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => UI.bag({ tab: b.dataset.t })));
    document.querySelectorAll("[data-enh]").forEach((b) => (b.onclick = (e) => {
      e.stopPropagation(); const [kind, k] = b.dataset.enh.split(":"), store = SAVE[kind === "art" ? "arts" : "pets"], lv = store[k] || 1, el = lv - 1, c = ITEM_SHARD.cost(el), sk = kind + ":" + k;
      SAVE.ishards = SAVE.ishards || {}; if (!store[k] || el >= ITEM_SHARD.max || (SAVE.ishards[sk] || 0) < c) return;
      SAVE.ishards[sk] -= c; const T = kind === "art" ? ARTIFACTS : PETS;
      if (Math.random() < SHARD.enhRate(el)) { store[k] = lv + 1; UI.toast(`⬆️ ${T[k].name} 강화 성공! +${lv}`); } else UI.toast(`💥 ${T[k].name} 강화 실패 (+${el} 유지)`);
      saveGame(); UI.bag({ tab });
    }));
    document.querySelectorAll("[data-eq]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.eq;
      if (tab === "art") { const i = E.arts.indexOf(k); if (i >= 0) E.arts[i] = null; else { const j = E.arts.indexOf(null); if (j >= 0) E.arts[j] = k; else { E.arts[0] = E.arts[1]; E.arts[1] = k; } } }
      else if (tab === "pet") E.pet = E.pet === k ? null : k; else E.title = E.title === k ? null : k;
      saveGame(); UI.bag({ tab });
    }));
  },

  // ----- 미션 -----
  missions(opt = {}) {
    const tab = opt.tab || "d";
    const tabs = [["d", "📅 일일"], ["w", "🗓️ 주간"], ["m", "📆 월간"], ["a", "🏆 업적"], ["c", "🔓 영웅 해금"]].map(([k, n]) => {
      const dot = k === "a" ? MISSIONS.some((m) => missionDone(m) && !SAVE.missions[m.id]) : PERIOD_MISSIONS[k] ? PERIOD_MISSIONS[k].some((m) => periodVal(k, m.stat) >= m.n && !periodState(k).claimed[m.id]) : false;
      return `<button class="tab ${k === tab ? "on" : ""}" data-t="${k}">${n}${dot ? ' <i class="rdot"></i>' : ""}</button>`; }).join("");
    const row = (name, v, n, coin, got, data) => `<div class="card" style="display:flex;gap:12px;align-items:center;${got ? "opacity:.5" : ""}"><div style="flex:1"><b>${name}</b><div class="prog"><i style="width:${(Math.min(v, n) / n) * 100}%"></i></div><span class="muted">${Math.min(v, n)} / ${n}</span></div>
      <button class="btn ${v >= n && !got ? "gold" : ""} sm" ${data} ${v >= n && !got ? "" : "disabled"}>${got ? "받음" : `${curIc("coin")} ${coin}`}</button></div>`;
    let body = "";
    if (PERIOD_MISSIONS[tab]) { const P = periodState(tab); body = `<p class="muted">${PERIOD_NAME[tab]} 임무는 ${tab === "d" ? "매일" : tab === "w" ? "매주" : "매달"} 새로 시작해요.</p>` + PERIOD_MISSIONS[tab].map((m) => row(m.name, periodVal(tab, m.stat), m.n, m.coin, P.claimed[m.id], `data-pm="${tab}:${m.id}"`)).join(""); }
    else if (tab === "a") body = MISSIONS.filter((m) => !m.secret || missionDone(m)).map((m) => row(m.name, statVal(m.stat), m.n, m.coin, SAVE.missions[m.id], `data-m="${m.id}"`)).join("");
    else body = CHARS.filter((c) => c.unlock.type !== "start" && c.unlock.type !== "gacha" && (!c.unlock.secret || SAVE.chars[c.id])).map((c) => { const u = unlockProgress(c);
      return `<div class="card" style="display:flex;gap:10px;align-items:center"><img src="${imgSrc("spr_" + charArt(c.id, "wolf"))}" style="width:48px;height:48px;object-fit:contain;${SAVE.chars[c.id] ? "" : "filter:brightness(.35)"}" alt=""><div style="flex:1"><b>${c.name} · ${c.job}</b> <span class="muted">${CHAR_GRADE[c.id]}급 · ${UNLOCK_TYPE[c.unlock.type]}</span><div class="muted">${c.unlock.text}</div><div class="prog"><i style="width:${(u.cur / u.n) * 100}%"></i></div><div class="muted" style="font-size:.75rem">${(u.parts || []).join(" · ")}</div></div>${SAVE.chars[c.id] ? "✅" : "🔒"}</div>`; }).join("");
    const total = unclaimed();
    UI.frame("임무", `<div class="tabs">${tabs}<button class="btn gold sm" id="claimAll" style="margin-left:auto" ${total ? "" : "disabled"}>🎁 모두 받기 (${total})</button></div>${tab === "d" ? UI.bountyCard() : ""}<div style="display:flex;flex-direction:column;gap:8px">${body}</div>`);
    document.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => UI.missions({ tab: b.dataset.t })));
    const give = (n) => { SAVE.coins += n; };
    document.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => { const m = MISSIONS.find((x) => x.id === b.dataset.m); SAVE.missions[m.id] = 1; give(m.coin); saveGame(); UI.toast(`🪙 코인 +${m.coin}`); UI.missions({ tab }); }));
    document.querySelectorAll("[data-pm]").forEach((b) => (b.onclick = () => { const [t, id] = b.dataset.pm.split(":"), m = PERIOD_MISSIONS[t].find((x) => x.id === id); periodState(t).claimed[id] = 1; give(m.coin); saveGame(); UI.toast(`🪙 코인 +${m.coin}`); UI.missions({ tab }); }));
    $("#claimAll").onclick = () => { let sum = 0, n = 0;
      for (const m of MISSIONS) if (missionDone(m) && !SAVE.missions[m.id]) { SAVE.missions[m.id] = 1; sum += m.coin; n++; }
      for (const t of ["d", "w", "m"]) { const P = periodState(t); for (const m of PERIOD_MISSIONS[t]) if (periodVal(t, m.stat) >= m.n && !P.claimed[m.id]) { P.claimed[m.id] = 1; sum += m.coin; n++; } }
      give(sum); saveGame(); UI.toast(`🎁 임무 ${n}개 보상 · 코인 +${sum}`, 3500); UI.missions({ tab }); };
  },

  // ----- 상점 -----
  shop() {
    const day = new Date().toDateString(); if (SAVE.shop.day !== day) { SAVE.shop = { day, bought: 0 }; }
    const left = SHOP_COIN.daily - SAVE.shop.bought;
    UI.frame("상점", `${iapHtml()}<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
      <div class="card"><h3>🪙 코인 1개</h3><p>엽전 ${SHOP_COIN.price}</p><p class="muted">오늘 남은 구매: ${left}개</p><button class="btn gold" data-b="1" ${left < 1 || SAVE.gold < SHOP_COIN.price ? "disabled" : ""}>사기</button></div>
      <div class="card"><h3>🪙 코인 3개 묶음</h3><p>엽전 ${SHOP_COIN.price * 3 - 100} <span class="muted">(100 할인)</span></p><p class="muted">오늘 남은 구매: ${left}개</p><button class="btn gold" data-b="3" ${left < 3 || SAVE.gold < SHOP_COIN.price * 3 - 100 ? "disabled" : ""}>사기</button></div>
      </div><p class="muted" style="margin-top:14px">🟡 금화는 원정 안 상점에서만 써요</p>`);
    document.querySelectorAll("[data-b]").forEach((b) => (b.onclick = () => { const n = +b.dataset.b, price = n === 3 ? SHOP_COIN.price * 3 - 100 : SHOP_COIN.price; if (SAVE.gold < price || SAVE.shop.bought + n > SHOP_COIN.daily) return; SAVE.gold -= price; SAVE.coins += n; SAVE.shop.bought += n; saveGame(); UI.toast(`🪙 코인 +${n}`); UI.shop(); }));
    iapBind();
  },

  // ----- 설정 -----
  settings() {
    const s = SAVE.settings;
    UI.frame("설정", `<div class="card setc"><h3>닉네임</h3><div style="display:flex;gap:8px"><input id="snick" maxlength="12" value="${esc(nick())}" style="flex:1;background:#0b0a10;border:1px solid var(--line);border-radius:10px;padding:8px 10px;color:var(--ink)"><button class="btn gold" id="snickok">바꾸기</button></div><p class="muted">아이디: ${esc(ACCOUNT)} (로그인할 때만 써요)</p>
      <div class="setg"><h4>언어 · Language</h4><p class="rg"><button class="btn sm ${I18N.lang === "ko" ? "gold" : ""}" data-lang="ko">한국어</button> <button class="btn sm ${I18N.lang === "en" ? "gold" : ""}" data-lang="en">English (beta)</button></p></div>
      <div class="setg"><h4>소리·음악</h4>
      <p class="tg"><label><input type="checkbox" id="mus" ${s.music ? "checked" : ""}> 배경 음악</label></p>
      <p class="rg"><span class="rl">음악 크기</span><input type="range" id="vol" min="0" max="1" step="0.05" value="${s.vol}"></p>
      <p class="rg"><span class="rl">효과음 크기</span><input type="range" id="sfv" min="0" max="1" step="0.05" value="${s.sfx}"></p>
      <p class="rg"><span class="rl">보스 음악 크기</span><input type="range" id="bsv" min="0" max="1.5" step="0.05" value="${s.bossVol != null ? s.bossVol : 1}"> <span class="muted" style="font-size:.8rem">(보통 음악 대비)</span></p>
      <p class="tg"><label><input type="checkbox" id="vce" ${s.voice === false ? "" : "checked"}> <span class="sl">음성<small>보스·이야기</small></span></label></p>
      </div>
      <div class="setg"><h4>화면</h4>
      <p class="rg"><span class="rl">화면 확대</span><input type="range" id="zoomr" min="1" max="2" step="0.1" value="${s.zoom != null ? s.zoom : 1.5}"> <small>(1 = 방 전체)</small></p>
      <p class="tg"><label><input type="checkbox" id="shk" ${s.shake === false ? "" : "checked"}> 화면 흔들림</label></p>
      <p class="rg"><span class="rl">흔들림 세기</span><input type="range" id="shka" min="0" max="1.5" step="0.1" value="${s.shakeAmt != null ? s.shakeAmt : 1}"></p>
      <p class="tg"><label><input type="checkbox" id="dmgn" ${s.dmgNum === false ? "" : "checked"}> 피해 숫자 보이기</label></p>
      <p class="tg"><label><input type="checkbox" id="hstp" ${s.hitstop === false ? "" : "checked"}> <span class="sl">타격 멈칫<small>치명타·처치 순간</small></span></label></p>
      <p class="rg"><span class="rl">효과 밝기</span><input type="range" id="fxa" min="0.4" max="1" step="0.05" value="${s.fxAmt != null ? s.fxAmt : 1}"> <span class="muted" style="font-size:.8rem">(번쩍임이 부담되면 낮추세요)</span></p>
      <p class="tg"><label><input type="checkbox" id="bigtxt" ${s.bigText ? "checked" : ""}> <span class="sl">글자 크게<small>작은 휴대폰에서 읽기 편하게</small></span></label></p>
      <p class="tg"><label><input type="checkbox" id="telebold" ${s.teleBold ? "checked" : ""}> <span class="sl">공격 예고 진하게<small>붉은 공격 영역에 굵은 노란 테두리 — 작은 화면·색이 잘 안 보일 때</small></span></label></p>
      </div>
      ${notifSetHtml(s)}
      <div class="setg"><h4>조작 · 도움</h4>
      <p class="tg"><label><input type="checkbox" id="guide" ${s.guide ? "checked" : ""}> <span class="sl">안내 화살표<small>보스·출구가 바로 옆 방일 때와 홍살문이 열렸을 때만 길을 가리켜요</small></span></label></p>
      <p class="tg"><label><input type="checkbox" id="autoatk" ${s.autoAtk === true ? "checked" : ""}> <span class="sl">자동 공격<small>켜면 근처 요괴를 기본 공격으로 알아서 공격 — 스킬·구르기는 직접</small></span></label></p>
      <p class="tg"><label><input type="checkbox" id="assist" ${s.assist ? "checked" : ""}> <span class="sl">도움 모드<small>쓰러질 때마다 받는 피해 -2%, 최대 -40% · 스토리·무한의 방, 지금 -${Math.round(Math.min(0.4, 0.02 * ((SAVE.assistN || 0) + 1)) * 100)}%</small></span></label></p>
      <p class="rg"><span class="rl">엽전·코인 줍기 범위</span><input type="range" id="pkr" min="0.6" max="2" step="0.1" value="${s.pickR || 1}"> <span class="muted" id="pkrv">×${s.pickR || 1}</span></p>
      <p class="tg"><label><input type="checkbox" id="hapt" ${s.haptic === false ? "" : "checked"}> <span class="sl">진동<small>앱·게임패드: 크게 맞거나 보스를 쓰러뜨릴 때</small></span></label></p>
      </div>
      <div class="setg"><h4>그래픽 · 성능</h4>
      <p class="tg"><label><input type="checkbox" id="hqfx" ${s.hq !== false ? "checked" : ""}> <span class="sl">고급 그래픽<small>실시간 조명·빛 번짐·색 보정 — 끊기면 끄세요</small></span></label></p>
      <p class="tg"><label><input type="checkbox" id="lowfx" ${s.low ? "checked" : ""}> <span class="sl">저사양 모드<small>화면 선명도·불빛·파편 줄이기 — 폰이 끊길 때</small></span></label></p>
      <p class="tg"><label><input type="checkbox" id="fps30" ${s.fps30 ? "checked" : ""}> <span class="sl">절전 모드<small>초당 30번 그리기 — 휴대폰이 뜨겁거나 배터리를 아낄 때</small></span></label></p>
      </div>
      <div class="setg"><h4>정보 보내기</h4>
      <p class="tg"><label><input type="checkbox" id="anly" ${s.analytics === false ? "" : "checked"}> <span class="sl">익명 통계·오류 보내기<small>게임 개선용 · 아이디·닉네임은 보내지 않아요</small></span></label></p>
      </div>
      ${ASSETS.packs ? `<div class="card dlset"><h3>그림 내려받기</h3><p id="dlst" class="muted"></p><p><button class="btn sm gold" id="dlmore">남은 그림 모두 받기 (약 ${DL_MB()}MB)</button> <button class="btn sm" id="dlless">필요한 것만 받기</button></p></div>` : ""}
      <p><button class="btn" id="keysbtn">${IS_TOUCH ? "화면 버튼 설정" : "키 설정"}</button> <button class="btn" id="infobtn">📜 정보 · 확률 · 약관 · 계정</button> <button class="btn gold" id="fbbtn">의견 보내기</button></p>
      <p class="muted">음악: 한입 미스터리 채널 국악 · 장별 음악·효과음·보스 음성</p>
      ${(() => { let g = null; try { g = JSON.parse(ls.get("ygr_guest") || "null"); } catch (e) { } return g && g.id === ACCOUNT ? `<div class="card" style="margin-top:8px;border-color:#b8864b"><b>게스트 계정</b><p class="muted" style="margin:4px 0">아이디 <b>${esc(g.id)}</b> · 비밀번호 <b class="gpw" data-pw="${esc(g.pw)}">••••••</b> <button class="btn sm" id="gpwshow" type="button">보기</button><br>적어 두면 다른 기기에서도 이 아이디로 로그인해 이어서 할 수 있어요.</p></div>` : ""; })()}
      <p class="muted">게임 판: v${GAME_VERSION}</p></div>`);
    $("#keysbtn").onclick = () => UI.keys(() => UI.settings());
    if ($("#dlmore")) { $("#dlmore").onclick = () => { ls.set("ygr_dl", "all"); dlAll(); UI.toast("뒤에서 남은 그림을 모두 받아요", 2500); dlPill(); }; $("#dlless").onclick = () => { ls.set("ygr_dl", "need"); dlStop(); UI.toast("필요한 그림만 받아요", 2200); dlPill(); }; dlPill(); }
    if ($("#guide")) $("#guide").onchange = (e) => { s.guide = e.target.checked; saveGame(); };
    notifSetBind(s);
    if ($("#telebold")) $("#telebold").onchange = (e) => { s.teleBold = e.target.checked; saveGame(); };
    if ($("#assist")) $("#assist").onchange = (e) => { s.assist = e.target.checked; saveGame(); UI.toast(s.assist ? "도움 모드 켬 — 쓰러질수록 조금씩 단단해져요" : "도움 모드 끔", 2500); };
    if ($("#autoatk")) $("#autoatk").onchange = (e) => { s.autoAtk = e.target.checked; saveGame(); };
    $("#infobtn").onclick = () => UI.info("prob");
    $("#fbbtn").onclick = () => UI.feedback();
    if ($("#gpwshow")) $("#gpwshow").onclick = () => { const e = document.querySelector(".gpw"); const hid = e.textContent.startsWith("•"); e.textContent = hid ? e.dataset.pw : "••••••"; $("#gpwshow").textContent = hid ? "가리기" : "보기"; }; // 11-21 손님 비밀번호는 기본으로 가림
    document.querySelectorAll("[data-lang]").forEach((b) => (b.onclick = () => { if (b.dataset.lang !== I18N.lang) I18N.set(b.dataset.lang); }));
    $("#snickok").onclick = () => { const v = cleanNick($("#snick").value); if (!v) { UI.toast("닉네임을 넣어 주세요"); return; } SAVE.nick = v; saveGame(); UI.toast("닉네임: " + v); };
    $("#mus").onchange = (e) => { s.music = e.target.checked; saveGame(); if (!s.music) $("#bgm").pause(); else { curTrack = null; music("menu"); } };
    $("#vol").oninput = (e) => { s.vol = +e.target.value; $("#bgm").volume = s.vol; saveGame(); };
    $("#shk").onchange = (e) => { s.shake = e.target.checked; saveGame(); };
    $("#shka").oninput = (e) => { s.shakeAmt = +e.target.value; saveGame(); };
    $("#zoomr").oninput = (e) => { s.zoom = +e.target.value; saveGame(); resize(); };
    $("#dmgn").onchange = (e) => { s.dmgNum = e.target.checked; saveGame(); };
    $("#hstp").onchange = (e) => { s.hitstop = e.target.checked; saveGame(); };
    $("#hapt").onchange = (e) => { s.haptic = e.target.checked; saveGame(); };
    $("#anly").onchange = (e) => { s.analytics = e.target.checked; saveGame(); if (s.analytics) analyticsInit(); };
    $("#vce").onchange = (e) => { s.voice = e.target.checked; saveGame(); };
    $("#fxa").oninput = (e) => { s.fxAmt = +e.target.value; saveGame(); };
    $("#pkr").oninput = (e) => { s.pickR = +e.target.value; $("#pkrv").textContent = "×" + s.pickR; saveGame(); };
    $("#hqfx").onchange = (e) => { s.hq = e.target.checked; saveGame(); UI.toast(s.hq ? "고급 그래픽 켬" : "고급 그래픽 끔"); };
    $("#bigtxt").onchange = (e) => { s.bigText = e.target.checked; saveGame(); document.documentElement.classList.toggle("bigtxt", s.bigText); };
    $("#fps30").onchange = (e) => { s.fps30 = e.target.checked; saveGame(); UI.toast(s.fps30 ? "절전 모드 켬 (30프레임)" : "절전 모드 끔"); };
    $("#lowfx").onchange = (e) => { s.low = e.target.checked; saveGame(); resize(); UI.toast(s.low ? "저사양 모드 켬" : "저사양 모드 끔"); };
    $("#sfv").oninput = (e) => { s.sfx = +e.target.value; sfxVol = s.sfx; saveGame(); sfx("coin"); };
    $("#bsv").oninput = (e) => { s.bossVol = +e.target.value; saveGame(); };
  },

  // ----- 플레이 방법 -----
  howto() {
    // 11-20 사용자: "모바일인데 설정이 PC로 되어 있어 키 변경·전체 설명이 어울리지 않음" → 폰은 터치 조작만, PC는 키보드(지금 키), 게임패드는 접어 둠. 예전 판(v1.5 등) 설명은 정리.
    const K = keyMap(), kb = (a) => `<span class="kbd">${keyLabel(K[a])}</span>`;
    const ctl = IS_TOUCH ? `<section class="ht"><h3>조작</h3><ul>
        <li><b>왼쪽 아래 원</b>을 끌어서 이동해요.</li>
        <li><b>오른쪽 큰 칼 버튼</b>을 누르고 있으면 기본 공격 — 가장 가까운 요괴를 알아서 노려요.</li>
        <li>작은 버튼 <b>1·2·3</b>은 스킬, <b>4</b>는 궁극기, <b>구르기</b>는 잠깐 무적, <b>액티브</b>는 주운 물건이에요.</li>
        <li>요괴를 손가락으로 누르면 그 요괴를 노려요(표적 고정).</li>
        <li>오른쪽 위 멈춤 버튼으로 멈추고, 설정의 <b>자동 공격</b>을 켜면 공격 버튼을 누르지 않아도 돼요.</li>
        <li>버튼이 작거나 가리면 설정 → <b>화면 버튼 설정</b>에서 크기·투명도를 바꿔요.</li></ul></section>`
      : `<section class="ht"><h3>조작</h3><ul>
        <li>이동 ${["up", "left", "down", "right"].map((x) => kb(x)).join("")} (방향키도 돼요)</li>
        <li>기본 공격 ${kb("atk")} 또는 ${kb("atk2")} — 마우스 쪽으로, 누르고 있으면 계속</li>
        <li>스킬 ${kb("s1")}${kb("s2")}${kb("s3")} · 궁극기 ${kb("s4")} — 마우스 쪽으로 나가요</li>
        <li>구르기 ${kb("dodge")} (잠깐 무적) · 액티브 ${kb("act")} · 멈춤 ${kb("pause")} · 레벨업 강화는 <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span></li>
        <li>키는 설정 → 키 설정에서 바꿀 수 있어요.</li></ul>
        <details><summary>게임패드</summary><p>왼스틱 이동 · 오른스틱 조준 · A 공격 · B 구르기 · X/Y/RB/RT 스킬 · LB 액티브 · LT 표적 바꾸기 · Start 멈춤</p></details></section>`;
    UI.frame("플레이 방법", `<div class="howto card htv2" style="max-width:860px">${ctl}
      <section class="ht"><h3>방과 문</h3><ul>
        <li>요괴가 있는 방에 들어가면 다 쓰러뜨릴 때까지 문이 잠겨요. 정리하면 문 안으로 걸어가 다음 방으로.</li>
        <li><b style="color:#ff6a5a">붉은 영역</b>은 곧 공격이 떨어지는 자리 — 밖으로 피하거나 구르세요.</li>
        <li>방마다 보물 상자·약수 우물(체력 가득)·보부상(상점)·괴이한 방(설화 속 선택)·시련의 방이 섞여 나와요.</li></ul></section>
      <section class="ht"><h3>이야기(스토리)</h3><ul>
        <li>다섯 장, 장마다 10스테이지 — 5번째에 중간보스, 10번째에 장 보스. 보스를 쓰러뜨리면 홍살문 안에 1초 서서 다음으로.</li>
        <li>장 사이사이 이야기 장면이 나오고, 앞 장 보스를 쓰러뜨리면 이야기 지도에서 다음 장이 열려요.</li>
        <li>스테이지를 넘어갈 때 체력 25% 회복 (매우 어려움은 회복 없음).</li></ul></section>
      <section class="ht"><h3>무한의 방 · 보스 레이드</h3><ul>
        <li>무한의 방: 문을 골라 끝없이 내려가요. 10번째 방마다 보스.</li>
        <li>보스 레이드: 장 보스 ${RAID_ORDER.length}마리를 차례로. 보스를 쓰러뜨릴 때마다 강화 하나, 보부상에게 엽전으로 정비하고 홍살문에 서면 다음 보스가 나와요.</li></ul></section>
      <section class="ht"><h3>성장</h3><ul>
        <li>레벨이 오르면 강화 셋 중 하나를 골라요. 같은 강화를 겹치면 레벨이 올라요. 짝이 맞는 두 강화를 모으면 조합 강화가 나와요.</li>
        <li>액티브는 하나만 들 수 있어요. 같은 것을 또 주우면 레벨 업.</li>
        <li>판이 끝나도 혼불이 남아요 — 혼불 제단에서 모든 영웅을 강하게.</li>
        <li>근접 영웅은 기본 특성 '근접 투지'로 피해의 일부를 체력으로 흡수해요(흡혈). '피의 맹세' 같은 강화·전직으로 더 늘어요.</li></ul></section>
      <section class="ht"><h3>엽전과 코인</h3><ul>
        <li>엽전: 판 안에서만 쓰는 돈 — 보부상에게 물건을 사요.</li>
        <li>코인: 판이 끝나도 남아요 — 뽑기(영웅·스킬·보물·펫·칭호)에 써요.</li></ul></section>
    </div>`);
  },

  // ----- 멀티 (친구와 온라인) -----
  multi() {
    const back = () => { NET.leave(); UI.menu(); };
    if (!NET.available()) { UI.frame("함께하기", `<div class="card"><h3>인터넷 연결이 필요해요</h3><p class="muted">온라인 연결 도구(PeerJS)를 불러오지 못했어요. 인터넷에 연결한 뒤 게임을 다시 열어 주세요.</p></div>`, back); return; }
    const owned = Object.keys(SAVE.chars);
    // 싱글 모드처럼 카드로 보여 주기: 큰 움직이는 카드 + 능력치 + 스킬
    const panel = (title, cid, who, col) => {
      if (!cid || !CHAR[cid]) return `<div class="card" style="flex:1;min-width:260px;display:flex;align-items:center;justify-content:center;min-height:300px"><p class="muted" style="font-size:1.2rem">${title}<br>기다리는 중…</p></div>`;
      const c = CHAR[cid], def = charDef(cid, c.forms ? "wolf" : null), art = charArt(cid, c.forms ? "wolf" : null);
      return `<div class="card" style="flex:1;min-width:260px;border-color:${col}"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 style="margin:0">${title}</h3><span class="muted">${esc(who || "")}</span></div>
        <div class="big anim-card" style="max-height:300px;aspect-ratio:4/3;margin:8px 0;border-radius:12px">${animCard(art, true)}</div>
        <b style="font-family:var(--display);font-size:1.4rem;color:var(--gold2)">${c.name} · ${c.job}</b>${c.forms ? ' <span class="muted">(늑대인간/구미호 랜덤)</span>' : ""}
        <p class="muted" style="margin:4px 0">체력 ${def.hp} · 공격 ${def.atk} · 이동 ${def.spd} · ${def.range}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${c.sk.map((k, i) => `<span class="pill" title="${k.desc}">${i + 1} ${abIc("sk_" + c.id + "_" + i, k.ic, 22)} ${k.name}</span>`).join("")}</div></div>`;
    };
    const myPick = `<h3 style="margin-top:16px">내 영웅 고르기 <span class="muted">(눌러서 바꾸기 · 보물·펫·칭호·스킬 장착도 그대로 가져가요)</span></h3>
      <div class="chars">${["SS", "S", "A", "B", "C"].map((g) => { const ids = owned.filter((id) => CHAR[id] && (CHAR_GRADE[id] || "C") === g); if (!ids.length) return "";
        // 등급별로 묶어 보기 (11-14 사용자: 멀티 캐릭터 선택도 등급별로) — 캐릭터 화면과 같은 머리줄
        return `<div class="grhead" style="grid-column:1/-1;border-color:${GRADE_INFO[g].col}"><b style="color:${GRADE_INFO[g].col}">${g}급</b> <span class="muted">${ids.length}명</span></div>` + ids.map((id) => `<button class="ch ${id === SAVE.sel ? "on" : ""}" data-mc="${id}" style="background-image:url(${imgSrc("card_" + charArt(id, CHAR[id].forms ? "wolf" : null))})"><span class="tag"><b style="color:${GRADE_INFO[g].col}">${g}</b></span><span class="nm">${CHAR[id].name}<small>${CHAR[id].job}${(SAVE.enh || {})[id] ? " +" + SAVE.enh[id] : ""}</small></span></button>`).join(""); }).join("")}</div>`;
    const MODE = { story: "📖 스토리 협동", endless: "♾️ 무한의 방 협동", raid: "🐉 보스 레이드 협동", duel: "⚔️ 1대1 대전" };
    let body = "";
    if (NET.role === "host") {
      const L = NET.lobby, g = L.guest, duel = L.mode === "duel";
      body = `<div class="card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div><h3 style="margin:0">방장 · ${MODE[L.mode]}</h3><p class="muted" style="margin:4px 0">친구에게 이 코드를 알려 주세요</p></div>
          <div style="font-family:var(--display);font-size:3rem;letter-spacing:.3em;color:var(--gold)">${NET.peer && NET.peer.open ? NET.code : "…"}</div>
          ${L.mode === "story" ? `<div>시작 장: ${FLOORS.map((f, i) => `<button class="btn sm ${L.floor === i + 1 ? "gold" : ""}" data-f="${i + 1}" ${i + 1 > SAVE.story.maxFloor ? "disabled" : ""}>${i + 1}장</button>`).join(" ")}</div>` : ""}
          ${L.mode === "story" || L.mode === "endless" ? `<div>난이도: ${(L.mode === "story" ? ["easy", "normal", "hard", "hell"] : ["easy", "normal", ...(SAVE.endlessHard ? ["hard"] : []), ...(SAVE.endlessHell ? ["hell"] : [])]).map((k) => `<button class="btn sm ${(L.diff || "normal") === k ? "gold" : ""}" data-md="${k}" style="color:${DIFF[k].col}">${DIFF[k].name}</button>`).join(" ")} <span class="muted" style="font-size:.78rem">보상 ×${DIFF[L.diff || "normal"].rw}</span></div>` : ""}
          <button class="btn gold" id="mgo" ${g ? "" : "disabled"} style="font-size:1.3rem;margin-left:auto">함께 출발 ▶</button></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;align-items:stretch">${panel("나 (방장)", SAVE.sel, nick(), "var(--gold)")}<div style="align-self:center;font-family:var(--display);font-size:2.4rem;color:${duel ? "#ff6a5a" : "#7fe08a"}">${duel ? "VS" : "＋"}</div>${panel("친구", g && g.load.char, g && g.name, duel ? "#ff6a5a" : "#7fe08a")}</div>
        ${g && g.ver !== GAME_VERSION ? '<p style="color:#ff8a8a">⚠️ 친구와 게임 판이 달라요</p>' : ""}${myPick}`;
    } else if (NET.role === "guest") {
      const h = NET.lobby.host, duel = h && h.mode === "duel";
      body = `<div class="card"><h3 style="margin:0">참가 · 코드 ${esc(NET.code)} ${h ? "· " + MODE[h.mode] : ""}</h3><p class="muted" style="margin:4px 0">${h ? `방장이 '함께 출발'을 누르면 시작돼요${h.diff && h.mode !== "duel" && h.mode !== "raid" ? ` · 난이도 <b style="color:${DIFF[h.diff].col}">${DIFF[h.diff].name}</b> (보상 ×${DIFF[h.diff].rw})` : ""}` : "연결하는 중…"}</p></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">${panel("방장", h && h.char, h && h.name, duel ? "#ff6a5a" : "#7fe08a")}<div style="align-self:center;font-family:var(--display);font-size:2.4rem;color:${duel ? "#ff6a5a" : "#7fe08a"}">${duel ? "VS" : "＋"}</div>${panel("나", SAVE.sel, nick(), "var(--gold)")}</div>${myPick}`;
    } else {
      body = `<div class="grid mpgrid">
        <div class="card"><h3>방 만들기 (방장)</h3><p class="muted">모드를 고르면 방 코드가 나와요 · 친구에게 코드를 알려 주세요</p>
          <div class="mphost">${[["story", "스토리 협동", "둘이서 다섯 장의 이야기를"], ["endless", "무한의 방 협동", "끝없이 내려가는 방"], ["raid", "보스 레이드 협동", "장 보스 다섯 연속"], ["duel", "1대1 대전", "레벨 10 · 3판 2선승"]].map(([k, n, d]) => `<button class="mpc" data-host="${k}"><span class="img" style="background-image:url(${imgSrc("ui_mode_" + k)})"></span><b>${n}</b><small>${d}</small></button>`).join("")}</div></div>
        <div class="card mpjoin"><h3>코드로 참가</h3><p class="muted">친구가 알려 준 방 코드 5자리를 넣어요</p><div class="field"><input id="mcode" maxlength="5" placeholder="ABCDE" aria-label="방 코드 5자리" autocomplete="off"></div>
          <button class="btn gold" id="mjoin" style="margin-top:10px;width:100%">참가</button></div></div>
        <div class="card" style="margin-top:12px"><h3>안내</h3><ul class="muted">
          <li>인터넷이 필요해요. 둘 다 같은 버전(오른쪽 아래 숫자)이어야 해요.</li>
          <li>협동: 두 사람이 같은 방에서 함께 싸워요. 둘이면 요괴가 조금 더 많고 튼튼해져요. 한 명이 쓰러지면 다음 스테이지에서 체력 30%로 일어나요.</li>
          <li>경험치는 둘 다 받고, 엽전·코인은 주운 사람이 가져요. 상인은 방장만 이용해요.</li>
          <li>1대1 대전: 친구와 레벨 10으로 맞춰 3판 2선승 (보물·펫·칭호 빠짐).</li></ul></div>`;
    }
    UI.frame("함께하기 · 친구와 함께", body, back);
    const refresh = (st) => { if (st === "fail") { NET.leave(); } if ($("#screens .screen") && !G) UI.multi(); };
    document.querySelectorAll("[data-host]").forEach((b) => (b.onclick = () => { NET.host(b.dataset.host, refresh); UI.multi(); }));
    if ($("#mjoin")) $("#mjoin").onclick = () => { const c = $("#mcode").value.trim(); if (c.length < 5) { UI.toast("코드 5자리를 넣어 주세요"); return; } NET.join(c, refresh); UI.multi(); };
    document.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { NET.lobby.floor = +b.dataset.f; UI.multi(); }));
    document.querySelectorAll("[data-mc]").forEach((el) => (el.onclick = () => { SAVE.sel = el.dataset.mc; saveGame(); if (NET.role === "guest") NET.send({ t: "load", load: NET.myLoad() }); if (NET.role === "host") NET.send({ t: "lobby", mode: NET.lobby.mode, host: nick(), ver: GAME_VERSION, char: SAVE.sel }); UI.multi(); }));
    if ($("#mgo")) $("#mgo").onclick = () => NET.hostStart({ mode: NET.lobby.mode, char: SAVE.sel, floor: NET.lobby.floor, diff: NET.lobby.diff || "normal" });
    document.querySelectorAll("[data-md]").forEach((b) => (b.onclick = () => { NET.lobby.diff = b.dataset.md; NET.send({ t: "lobby", mode: NET.lobby.mode, host: nick(), ver: GAME_VERSION, char: SAVE.sel, diff: NET.lobby.diff }); UI.multi(); }));
  },
  guestLevelUp(opts, lvl) {
    if (!opts || !opts.length) return;
    if (UI.modalOpen()) { setTimeout(() => UI.guestLevelUp(opts, lvl), 600); return; }
    UI.modal(`<h2>레벨 업! Lv.${lvl}</h2><p class="muted" style="text-align:center">강화를 하나 골라요 (1~${opts.length} 키) — 게임은 계속 진행돼요</p><div class="picks">${opts.map((k, i) => { const b = BOONS[k]; return `<button class="pk" data-k="${k}" style="border-color:${RARITY[b.rar].col}"><div class="ico">${abIc("bn_" + k, b.ic, 72)}</div><b style="color:${RARITY[b.rar].col}">${b.name}</b>${(() => { const n = ((G.p && G.p.boons) || []).filter((x) => x === k).length; return n ? `<div class="muted"><b style="color:#7fe08a">Lv.${n} → Lv.${n + 1}</b></div>` + boonChange(k, n) : `<p>${b.desc}</p>`; })()}<span class="kbd">${i + 1}</span></button>`; }).join("")}</div>`);
    const armT = UI.arm();
    const choose = (k) => { if (performance.now() < armT) return; window.removeEventListener("keydown", kh); NET.send({ t: "boon", k }); if (G && G.p) (G.p.boons = G.p.boons || []).push(k); UI.closeModal(); };
    const kh = (e) => { const i = ["Digit1", "Digit2", "Digit3"].indexOf(e.code); if (i >= 0 && opts[i]) choose(opts[i]); };
    window.addEventListener("keydown", kh);
    document.querySelectorAll(".pk").forEach((b) => (b.onclick = () => choose(b.dataset.k)));
  },

  // ----- 원정 중 -----
  onRunStart() { $("#screens").innerHTML = ""; $("#hud").hidden = false; UI.buildHud(); { const hl = G && G.p && HERO_LINES[G.p.id]; if (hl && !(G.opt && G.opt.multi)) setTimeout(() => { if (G && G.p && !G.over) addText(G.p.x, G.p.y - 110, hl[1], "#f3e3c0", 20); }, 1600); } if (!SAVE.tutorial && !G.opt.multi) { if (G.mode === "story" || G.mode === "endless") coachStart(); else setTimeout(() => UI.tutorial(), 600); } else if (wishOk()) setTimeout(() => { if (G && !G.over && !UI.modalOpen()) UI.wish(); }, 900); },
  tutorial() {
    if (!G || UI.modalOpen()) return; G.paused = true; const K = keyMap();
    if (IS_TOUCH) { UI.modal(`<h2>🏮 첫 원정 안내</h2><div style="max-width:600px;margin:0 auto;line-height:1.9"><p>🕹️ <b>왼쪽 아래 원</b>을 끌어 이동 · <b>오른쪽 큰 버튼</b>을 누르고 있으면 기본 공격 (가까운 요괴를 알아서 조준)</p><p>작은 버튼 <b>1~4</b> 스킬 · <b>💨</b> 구르기(잠깐 무적) · 오른쪽 위 <b>⏸</b> 멈춤 · 설정에서 <b>자동 공격</b>을 켜면 공격 버튼을 안 눌러도 돼요</p><p>요괴를 모두 잡으면 문이 열려요. 문 안으로 걸어가면 다음 방. <b style="color:#ff4d4d">붉은 영역</b>은 곧 공격이 떨어지는 자리예요.</p><p>레벨이 오르면 강화 하나를 골라요.</p></div><div class="center"><button class="btn gold" id="tutok">시작하기</button></div>`); $("#tutok").onclick = () => { SAVE.tutorial = true; track("tutorial_done"); saveGame(); UI.closeModal(); if (G) G.paused = false; }; return; } // 11-19 휴대폰은 터치 조작 안내
    UI.modal(`<h2>🏮 첫 원정 안내</h2><div style="max-width:560px;margin:0 auto;line-height:1.9">
      <p>이동 <span class="kbd">${["up", "left", "down", "right"].map((x) => keyLabel(K[x])).join("")}</span> · 기본 공격 <span class="kbd">${keyLabel(K.atk)}</span> 또는 <span class="kbd">${keyLabel(K.atk2)}</span> (마우스 쪽으로)</p>
      <p>스킬 <span class="kbd">${keyLabel(K.s1)}</span><span class="kbd">${keyLabel(K.s2)}</span><span class="kbd">${keyLabel(K.s3)}</span> · 궁극기 <span class="kbd">${keyLabel(K.s4)}</span> · 액티브 <span class="kbd">${keyLabel(K.act)}</span> · 멈춤 <span class="kbd">${keyLabel(K.pause)}</span></p>
      <p>요괴를 모두 잡으면 문이 열려요. 문 안으로 걸어가면 다음 방. <b style="color:#ff4d4d">붉은 영역</b>은 곧 공격이 떨어지는 자리예요.</p>
      <p>레벨업 때 강화 3개 중 하나를 골라요. 키는 설정에서 바꿀 수 있어요.</p></div>
      <div class="center"><button class="btn gold" id="tutok">시작하기</button></div>`);
    $("#tutok").onclick = () => { SAVE.tutorial = true; track("tutorial_done"); saveGame(); UI.closeModal(); if (G) G.paused = false; };
  },
  // 매일 출석: 코인 1 + 엽전 200, 7일째마다 코인 5 + 엽전 500
  daily() {
    if ((SAVE.stats.rooms || 0) < 3 && ACCOUNT !== DEV_ID) { SAVE.daily = SAVE.daily || { day: "", streak: 0 }; return; } // 첫 판 뒤 메뉴에서 받음
    if (typeof comebackGift === "function") comebackGift();
    const today = new Date().toDateString(), yest = new Date(Date.now() - 864e5).toDateString(), D = SAVE.daily || (SAVE.daily = { day: "", streak: 0 });
    if (D.day === today) return;
    if (typeof CBT !== "undefined" && CBT.on) { UI.cbtDaily(D, today); return; } // 11-22 시험판 14일 출석
    D.streak = D.day === yest ? D.streak + 1 : 1; D.day = today;
    const big = D.streak % 7 === 0, coin = big ? 6 : 2;
    SAVE.coins += coin; saveGame();
    UI.modal(`<h2>📅 출석 ${D.streak}일째</h2><div class="center" style="gap:8px;flex-wrap:wrap">${Array.from({ length: 7 }, (_, i) => { const n = Math.floor((D.streak - 1) / 7) * 7 + i + 1, done = n <= D.streak; return `<div class="pill" style="${done ? "border-color:var(--gold);color:var(--gold2)" : ""}">${n}일 ${done ? "✓" : n % 7 === 0 ? "🎁" : ""}</div>`; }).join("")}</div>
      <p style="text-align:center;font-size:1.2rem">${curIc("coin")} 코인 +${coin}${big ? " — 7일 연속 보너스!" : ""}</p><p class="muted" style="text-align:center">매일 들어오면 받아요. 7일 연속이면 큰 보상</p><div class="center"><button class="btn gold" id="dok">받기</button></div>`);
    $("#dok").onclick = () => { UI.closeModal(); UI.menu(); };
  },
  buildHud() {
    const p = G.p, touch = matchMedia("(pointer: coarse)").matches;
    input.touch = touch;
    const slot = (s, key) => `<div class="sk ${s === "R" ? "ult" : ""}" data-s="${s}"><span class="key${String(key).length > 2 ? " long" : ""}">${key}</span><span class="ic"></span><div class="cdv"></div><span class="cdt"></span><span class="lv"></span>${s === "A" ? `<button class="alock" id="alock" title="액티브 잠금 (${keyLabel(keyMap().lock)})">🔓</button>` : ""}<span class="jtag"></span></div>`;
    $("#hud").innerHTML = `<div class="hp-box"><div class="face" style="background-image:url(${imgSrc("card_" + p.art)})"></div><div class="meta">
        <div class="nm" id="hnm"></div><div class="bar hp"><b class="lag" id="hhpl"></b><s id="hsh"></s><i id="hhp"></i><span id="hhpt"></span></div><div class="bar xp"><i id="hxp"></i></div></div></div>
      <div class="hp-box" id="fbox" hidden style="top:86px;min-width:260px;border-color:#7fe08a"><div class="face" id="fface" style="width:44px;height:44px"></div><div class="meta"><div class="nm" id="fnm"></div><div class="bar" style="height:10px"><s id="fsh"></s><i id="fhp" style="background:linear-gradient(#9fffb0,#3a9a4a)"></i></div></div></div>
      <div class="boonlist" id="boons"></div>
      <div class="stage" id="hstage"></div><div class="bossbar" id="hboss" hidden><div id="hbn"></div><div class="bar"><b class="lag" id="hbhpl"></b><i id="hbhp"></i><span class="rage50" title="50% 아래로 내려가면 분노">분노</span></div></div>
      <div class="tr"><canvas id="mini" width="340" height="240"></canvas><div class="hudbtns"><span class="pill coin">${curIc("coin")} <b id="hc"></b></span><span class="pill" title="엽전 — 원정 중 상점에서 써요">${curIc("yeop")} 엽전 <b id="hg"></b></span><button class="btn sm" id="hp" title="${IS_TOUCH ? "멈춤 · 소리" : "멈춤 · 소리 · 키 설정 (Esc)"}">${uiIc("pause", "⏸")}</button></div></div>
      ${touch ? `<div class="joy" id="joy"><i></i></div><div class="touch">${slot("A", "액티브")}${slot("D", "구르기")}${slot("Q", "1")}${slot("W", "2")}<div class="sk atk" data-s="B">⚔️</div>${slot("E", "3")}${slot("R", "4")}</div>`
        : (() => { const K = keyMap(); return `<div class="skills"><div class="sk basic" data-s="B"><span class="key${String(keyLabel(K.atk)).length > 2 ? " long" : ""}">${keyLabel(K.atk)}</span>${abIc("sk_" + G.p.id + "_b", "⚔️", 46)}</div>${slot("D", keyLabel(K.dodge))}${slot("A", keyLabel(K.act))}${slot("Q", keyLabel(K.s1))}${slot("W", keyLabel(K.s2))}${slot("E", keyLabel(K.s3))}${slot("R", keyLabel(K.s4))}</div>`; })()}
      <div class="tip" id="tip" hidden></div>`;
    $("#hp").onclick = () => UI.togglePause();
    const al = $("#alock"); if (al) { al.onpointerdown = (e) => { e.stopPropagation(); e.preventDefault(); if (!G || !G.p) return; if (NET.client) NET.send({ t: "lock", on: !G.p.actLock }); toggleActLock(G.p); }; }
    // 가상 패드: 엄지로 끌면 그 방향으로 이동
    const joy = $("#joy");
    if (joy) {
      const knob = joy.querySelector("i"); let id = null;
      const setV = (e) => { const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = e.clientX - cx, dy = e.clientY - cy; const L = Math.hypot(dx, dy), M = r.width / 2 - 20; if (L > M) { dx *= M / L; dy *= M / L; }
        const sc = r.width / (joy.offsetWidth || r.width); knob.style.transform = `translate(${dx / sc}px,${dy / sc}px)`; const dead = 12; input.kx = Math.abs(dx) > dead ? dx / M : 0; input.ky = Math.abs(dy) > dead ? dy / M : 0; };
      joy.onpointerdown = (e) => { id = e.pointerId; joy.setPointerCapture(id); input.touch = true; setV(e); e.preventDefault(); };
      joy.onpointermove = (e) => { if (e.pointerId === id) setV(e); };
      joy.onpointerup = joy.onpointercancel = (e) => { if (e.pointerId !== id) return; id = null; knob.style.transform = ""; input.kx = input.ky = 0; };
    }

    document.querySelectorAll("#hud .sk").forEach((el) => {
      const s = el.dataset.s;
      el.onmouseenter = () => { UI._tipSlot = s; };
      el.onmouseleave = () => { UI._tipSlot = null; $("#tip").hidden = true; };
      let drag = null;
      el.onpointerdown = (e) => {
        e.preventDefault(); e.stopPropagation(); if (!G || G.paused) return;
        if (s === "B") { input.atkHeld = true; if (!NET.client && G.p.cd.B <= 0) basicAttack(G.p); return; }
        const me = NET.client ? G.p : G.p;
        if (me && s !== "D" && isPlaceFx(slotFx(me, s))) { try { el.setPointerCapture(e.pointerId); } catch (er) { } drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, moved: false }; return; }
        if (NET.client) NET.sendKey(s); else if (!useSkill(G.p, s)) UI.flashSlot(s);
      };
      el.onpointermove = (e) => {
        if (!drag || e.pointerId !== drag.id || !G || !G.p) return;
        const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
        if (!drag.moved && Math.hypot(dx, dy) > 14) { drag.moved = true; if (!startAim(s) || !input.aim) { drag = null; return; } input.aim.drag = true; } // 대기 중이면 startAim이 깜빡이기만 하고 조준을 만들지 않음 → 11-14 "Cannot set properties of null (setting drag)"
        if (drag.moved && input.aim) { const pi = input.aim, k = 3.2; const p = aimClamp(G.p, G.p.x + dx * k, G.p.y + dy * k, pi.range); pi.x = p.x; pi.y = p.y; }
      };
      el.onpointerup = el.onpointercancel = (e) => {
        if (s === "B") { input.atkHeld = false; return; }
        if (!drag) return; const d = drag; drag = null;
        if (d.moved) { finishAim(e.type === "pointercancel"); return; }
        if (NET.client) NET.sendKey(s); else if (G && !useSkill(G.p, s)) UI.flashSlot(s);
      };
      el.onpointerleave = () => { if (s === "B") input.atkHeld = false; };
    });
    UI._hudT = 0; applyBtnStyle();
  },
  flashSlot(s) { const el = document.querySelector(`#hud .sk[data-s="${s}"]`); if (!el) return; el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); },
  hud() {
    comboHud(); trialHud();
    if (!G || $("#hud").hidden) return;
    const p = G.p; if (!p || !p.sk || !p.maxHp) return; UI._hudT = (UI._hudT || 0) + 1; if (UI._hudT % 4) return;
    const tt = SAVE.equip.title && G.mode !== "duel" ? TITLES[SAVE.equip.title].name : "";
    $("#hnm").innerHTML = `${p.def.name}${p.formName ? "(" + p.formName + ")" : ""} <small>${p.jobName ? "<b style='color:#ffb547'>" + p.jobName + "</b> " : ""}${tt ? "「" + tt + "」 " : ""}Lv.${p.lvl}</small>`;
    { const f = Math.max(0, p.hp) / p.maxHp; $("#hhp").style.width = f * 100 + "%"; hpLag("p", f, $("#hhpl")); $(".bar.hp").classList.toggle("low", f < 0.3); } // 11-17 깎인 체력이 하얗게 남았다 천천히 줄어듦 $("#hsh").style.width = Math.min(100, (p.shield / p.maxHp) * 100) + "%";
    $("#hhpt").textContent = `${Math.ceil(Math.max(0, p.hp))} / ${p.maxHp}${p.shield > 1 ? ` (+${Math.round(p.shield)})` : ""}`;
    $("#hxp").style.width = G.mode === "duel" ? "0" : (p.exp / expNeed(p.lvl)) * 100 + "%";
    $("#hc").textContent = SAVE.coins; $("#hg").textContent = p.gold || 0;
    const cu = G.curse ? ` · ${CURSES[G.curse].ic} ${CURSES[G.curse].name}` : "";
    const dTag = (G.mode === "story" || G.mode === "endless") && G.opt && G.opt.diff && G.opt.diff !== "normal" ? ` · ${DIFF[G.opt.diff].name}` : "";
    const Yc = G.mode === "story" ? YOKAI_EL[(G.floor - 1) % 5] : G.mode === "endless" ? YOKAI_EL[((G.eFloor || 1) - 1) % 5] : null; const yTag = Yc ? ` · ${Yc.n} 속성` : "";
    const st = (G.mode === "practice" ? "🎯 연습장" : G.mode === "dev" ? "🛠 개발자 맵" : G.mode === "raid" ? `🐉 보스 레이드 · ${Math.min((G.raidN || 0) + 1, RAID_ORDER.length)} / ${RAID_ORDER.length}` : G.mode === "story" ? `${G.floor}장 · ${theme().name} · ${G.stage}/${STAGES_PER_FLOOR} 스테이지` : G.mode === "endless" ? `♾️ 무한의 방 · ${((G.eFloor || 1) - 1) % 5 + 1}층${(G.eFloor || 1) > 5 ? ` (${Math.floor(((G.eFloor || 1) - 1) / 5) + 1}회차)` : ""} ${G.eStage || 1}/${STAGES_PER_FLOOR} 스테이지 · ${(G.endlessN || 0) + 1}번째 방` : `⚔️ ${G.duel.round}라운드 · ${G.duel.wins[0]} : ${G.duel.wins[1]}`) + dTag + yTag + cu;
    { const hs = $("#hstage"); if (hs.dataset.k !== st) { hs.dataset.k = st; hs.textContent = st; } } // 바뀔 때만 (깜빡임 방지, 11-12)
    const b = G.mode === "duel" ? G.bot : G.bossUnit && G.bossUnit.alive ? G.bossUnit : null;
    $("#hboss").hidden = !b; if (b) $("#hboss").classList.toggle("rage", !!b.ph2); if (b) { $("#hbn").textContent = b.kind === "hero" ? `${b.guestName ? b.guestName + " — " : ""}${(b.def.name || b.name || "").replace(/\(.*\)/, "")}${b.def.job ? " · " + b.def.job : ""}${b.formName ? "(" + b.formName + ")" : ""}` : b.name; $("#hbhp").style.width = (Math.max(0, b.hp) / b.maxHp) * 100 + "%"; hpLag("b" + (b.id || b.name), Math.max(0, b.hp) / b.maxHp, $("#hbhpl")); }
    const fr = G.units.find((u) => u.kind === "hero" && u !== p && u.team === p.team);
    $("#fbox").hidden = !fr; $("#boons").style.top = fr ? "150px" : "92px";
    if (fr) { $("#fface").style.backgroundImage = `url(${imgSrc("card_" + fr.art)})`; const nm = (fr.def && fr.def.name) || fr.name || ""; const job = fr.def && fr.def.job ? fr.def.job : (CHARS.find((c) => fr.art && fr.art.startsWith(c.id)) || {}).job || "";
      $("#fnm").innerHTML = `${esc(fr.guestName || (G.client ? "방장" : "친구"))} <small>${esc(nm)}${fr.jobName ? " · <b style='color:#ffb547'>" + esc(fr.jobName) + "</b>" : job ? " · " + job : ""}${fr.lvl ? " Lv." + fr.lvl : ""}${fr.alive === false ? " · 쓰러짐" : ""}</small>`;
      $("#fhp").style.width = (Math.max(0, fr.hp) / (fr.maxHp || 1)) * 100 + "%"; $("#fsh").style.width = Math.min(100, ((fr.shield || 0) / (fr.maxHp || 1)) * 100) + "%"; }
    const bk = p.boons.join(","); if ($("#boons").dataset.k !== bk) { $("#boons").dataset.k = bk; const cnt = {}; for (const k of p.boons) cnt[k] = (cnt[k] || 0) + 1; $("#boons").innerHTML = Object.keys(cnt).map((k) => `<span title="${BOONS[k].name} Lv.${cnt[k]}: ${BOONS[k].desc} ×${cnt[k]}" style="position:relative">${abIc("bn_" + k, BOONS[k].ic, 26)}${cnt[k] > 1 ? `<b style="position:absolute;right:-2px;bottom:-4px;font-size:.7rem;color:#7fe08a;text-shadow:0 1px 2px #000">${cnt[k]}</b>` : ""}</span>`).join(""); }
    document.querySelectorAll("#hud .sk").forEach((el) => {
      const s = el.dataset.s; if (s === "B") return;
      let ic = "", cd = p.cd[s], max = 1, lv = "";
      let key = null;
      if (s === "D") { ic = "💨"; max = DODGE_CD; }
      else if (s === "A") { if (p.active) { const A = ACTIVES[p.active.k]; ic = A.ic; key = A.img || "ic_" + p.active.k; max = (p.cdMax && p.cdMax.A) || A.cd; lv = ACT_TIER[A.rar].name + " " + p.active.lv; el.style.borderColor = ACT_TIER[A.rar].col; } else { ic = ""; el.style.borderColor = ""; } el.classList.toggle("empty", !p.active);
        el.classList.toggle("locked", !!p.actLock); const lb = el.querySelector(".alock"); if (lb) { const st = p.actLock ? "on" : "off"; if (lb.dataset.st !== st) { lb.dataset.st = st; const k = p.actLock ? "emo_lock" : "emo_unlock"; lb.innerHTML = ASSETS.img[k] ? `<img src="${imgSrc(k)}" alt="" style="width:18px;height:18px;vertical-align:middle">` : (p.actLock ? "🔒" : "🔓"); } } } // 상태가 바뀔 때만 (11-14 자물쇠 깜빡임: 이모지→그림 바꾸기와 매번 다시 쓰기가 반복됐음)
      else { const sk = p.sk[s]; ic = sk.ic; key = sk.icon; max = (p.cdMax && p.cdMax[s]) || sk.cd; if (sk.id) lv = sk.grade;
        const jt = el.querySelector(".jtag"), tag = sk.jobTag || ""; if (jt && jt.textContent !== tag) jt.textContent = tag; el.classList.toggle("jobsk", !!tag); }
      const icEl = el.querySelector(".ic"), want = key && ASSETS.img[key] ? key : "e:" + ic;
      if (icEl.dataset.k !== want) { icEl.dataset.k = want; icEl.innerHTML = key && ASSETS.img[key] ? abIc(key, ic, 58) : ic; } el.querySelector(".lv").textContent = lv;
      el.querySelector(".cdv").style.setProperty("--p", cd > 0 ? (cd / max) * 100 + "%" : "0%");
      if (cd > 0) el.dataset.cd = 1; else if (el.dataset.cd === "1") { el.dataset.cd = ""; el.classList.remove("ready"); void el.offsetWidth; el.classList.add("ready"); }
      el.querySelector(".cdt").textContent = cd > 0.05 ? (cd < 10 ? cd.toFixed(1) : Math.ceil(cd)) : "";
    });
    if (UI._tipSlot) {
      const s = UI._tipSlot, tip = $("#tip"); let h = "";
      if (s === "B") h = `<b>${p.def.basic.name}</b><br>기본 공격 · ${IS_TOUCH ? "오른쪽 큰 칼 버튼 (누르고 있으면 연속, 가까운 요괴 쪽으로)" : "마우스 왼쪽 클릭 (누르고 있으면 연속, 커서 쪽으로)"}`;
      else if (s === "D") h = `<b>구르기</b><br>움직이는 방향으로 짧게 굴러 잠깐 무적 (${keyLabel(keyMap().dodge)}) · 대기 ${DODGE_CD}초`;
      else if (s === "A") h = p.active ? `<b style="color:${ACT_TIER[ACTIVES[p.active.k].rar].col}">[${ACT_TIER[ACTIVES[p.active.k].rar].name}] ${ACTIVES[p.active.k].name}</b> Lv.${p.active.lv}${ACTIVES[p.active.k].lore ? `<br><i class="lore">${esc(ACTIVES[p.active.k].lore)}</i>` : ""}<br>${ACTIVES[p.active.k].desc}<br><span class="muted">대기 ${ACTIVES[p.active.k].cd}초 · ${keyLabel(keyMap().act)} 키</span><br>${p.actLock ? `<span style="color:#ffd27a">🔒 잠금 중 — 다른 액티브를 밟아도 바뀌지 않아요 (${keyLabel(keyMap().lock)} 키 또는 칸의 자물쇠로 풀기)</span>` : `<span class="muted">🔓 ${keyLabel(keyMap().lock)} 키 또는 칸의 자물쇠로 잠그면 다른 액티브를 밟아도 바뀌지 않아요</span>`}` : "<b>액티브 없음</b><br>보물 방·보스·상인에게서 얻어요";
      else { const sk = p.sk[s], real = (p.cdMax && p.cdMax[s]) || sk.cd * (1 - (p.cdr || 0)), base = sk.cd0 || sk.cd;
        const jobLine = sk.jobTag ? `<br><span style="color:#ffd98a">✨ 전직 변화 '${sk.jobTag}' · 위력 ×${(sk.pow || 1).toFixed(2)}${sk.cd0 && sk.cd0 !== sk.cd ? ` · 기본 대기 ${base}초 → ${+sk.cd.toFixed(1)}초` : ""}</span>` : "";
        h = `<b>${sk.name}</b>${sk.grade ? ` <span class="grade" style="background:${SK_GRADE[sk.grade].col}">${sk.grade}</span>` : ""}${sk.lore ? `<br><i class="lore">${esc(sk.lore)}</i>` : ""}<br>${sk.desc}${jobLine}<br><span class="muted">대기 ${+real.toFixed(1)}초${real < sk.cd - 0.05 ? ` (기본 ${+sk.cd.toFixed(1)}초)` : ""} · ${keyLabel(keyMap()["s" + ({ Q: 1, W: 2, E: 3, R: 4 }[s])])} 키</span>`; }
      if (s !== "B" && isPlaceFx(slotFx(p, s))) h += `<br><span style="color:#ffd27a">📍 위치 지정 — ${IS_TOUCH ? "스킬 버튼을 끌어 자리를 고르고 떼면 시전" : "키를 누른 채 마우스로 자리를 고르고 떼면 시전 (Esc·오른쪽 클릭 취소)"}</span>`;
      tip.innerHTML = h; tip.hidden = false;
    }
    drawMini();
  },
  togglePause() {
    if (!G || G.over) return;
    if (UI.modalOpen() && !UI._paused) { if (NET.client) UI.closeModal(); return; }
    if (UI._paused) { UI._paused = false; G.paused = false; UI.closeModal(); return; }
    if (NET.client) { UI.modal(`<h2>메뉴</h2><div class="center"><button class="btn gold" id="pr">계속하기</button><button class="btn" id="pq">방에서 나가기</button></div><div class="card" style="margin-top:12px"><h3>🔊 소리</h3><p><label><input type="checkbox" id="smus" ${SAVE.settings.music ? "checked" : ""}> 배경 음악</label></p><p>음악 크기 <input type="range" id="svol" min="0" max="1" step="0.05" value="${SAVE.settings.vol}"></p><p>효과음 크기 <input type="range" id="ssfx" min="0" max="1" step="0.05" value="${SAVE.settings.sfx}"></p></div>`); UI.bindSound(); $("#pr").onclick = () => UI.closeModal(); $("#pq").onclick = () => { UI.closeModal(); NET.leave(); NET.client = false; G = null; UI.menu(); }; return; }
    UI._paused = true; G.paused = true; input.atkHeld = false; input.moveHeld = false;
    const canSave = G.mode === "story" && !G.opt.multi && !G.opt.daily;
    $("#modal").classList.add("pzmode"); UI.modal(pauseHtml(canSave));
    UI.bindSound();
    document.querySelectorAll(".pzb[data-k]").forEach((t) => (t.onclick = () => { const on = t.classList.contains("on"); document.querySelectorAll(".pzb").forEach((x) => x.classList.remove("on")); const d = $("#pzdet"); if (on) { d.innerHTML = '<span class="muted">강화를 누르면 설명이 나와요</span>'; return; } t.classList.add("on"); const k = t.dataset.k, B = BOONS[k], n = +t.dataset.n; d.innerHTML = `<b style="color:${RARITY[B.rar].col}">${esc(B.name)}</b> <small>${RARITY[B.rar].name} · Lv.${n}</small>${B.lore ? `<p class="lore">${esc(B.lore)}</p>` : ""}<p>${esc(B.desc)}${n > 1 ? ` <span class="muted">(×${n})</span>` : ""}</p>`; }));
    $("#pkeys").onclick = () => UI.keys(() => { UI._paused = false; UI.closeModal(); UI.buildHud(); UI.togglePause(); });
    $("#pr").onclick = () => UI.togglePause();
    $("#pq").onclick = () => { UI._paused = false; UI.closeModal(); endRun(false); };
    if ($("#psave")) $("#psave").onclick = () => { SAVE.resume = storySnap(); saveGame(); CLOUD.push(); UI._paused = false; UI.toast(`저장했어요 · ${G.floor}장 ${G.stage}스테이지`, 3000); UI.menu(); };
  },
  capturing: false,
  keys(after) {
    $("#modal").classList.remove("pzmode", "shopmode", "evmode", "dlmode", "lvmode"); // 11-20 멈춤 화면에서 열면 멈춤 모양이 남던 것
    const K = keyMap(), wasPaused = G && G.paused;
    const rows = KEY_ACTIONS.map(([a, n]) => `<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px dashed var(--line)"><span style="flex:1">${n}</span><span class="kbd" style="min-width:90px;text-align:center" id="kv_${a}">${keyLabel(K[a])}</span><button class="btn sm" data-ka="${a}">바꾸기</button></div>`).join("");
    UI.modal(`<h2>${IS_TOUCH ? "화면 버튼 설정" : "키 설정"}</h2>${IS_TOUCH ? "" : `<p class="muted" style="text-align:center">'바꾸기'를 누른 뒤 원하는 키나 마우스 버튼을 누르세요. 다른 동작과 겹치면 서로 바뀌어요. (방향키는 언제나 이동으로도 쓸 수 있어요)</p>`}
      <div class="card btnset" style="max-width:520px;margin:0 auto 12px"><h3>화면 버튼</h3>
        <p>스킬 버튼 크기 <input type="range" id="bsz" min="0.7" max="1.5" step="0.05" value="${SAVE.settings.btnScale || 1}"> <b id="bszv">${Math.round((SAVE.settings.btnScale || 1) * 100)}%</b></p>
        <p>조이스틱 크기 <input type="range" id="jsz" min="0.7" max="1.5" step="0.05" value="${SAVE.settings.joyScale || 1}"> <b id="jszv">${Math.round((SAVE.settings.joyScale || 1) * 100)}%</b> <span class="muted">(폰)</span></p>
        <p>버튼 투명도 <input type="range" id="bal" min="0.3" max="1" step="0.05" value="${SAVE.settings.btnAlpha != null ? SAVE.settings.btnAlpha : 1}"> <b id="balv">${Math.round((SAVE.settings.btnAlpha != null ? SAVE.settings.btnAlpha : 1) * 100)}%</b> <span class="muted">(낮을수록 투명)</span></p>
        <div class="center"><button class="btn sm" id="bsreset">버튼 기본값</button></div></div>
      ${IS_TOUCH ? `<details class="kbdet" style="max-width:520px;margin:0 auto"><summary>키보드를 연결했다면: 키 설정</summary>` : ""}<div style="max-width:520px;margin:0 auto">${rows}</div>${IS_TOUCH ? "</details>" : ""}<div class="center">${IS_TOUCH ? "" : `<button class="btn" id="kreset">기본값으로</button>`}<button class="btn gold" id="kdone">완료</button></div>`);
    const bset = (id, key, out) => { $("#" + id).oninput = (e) => { SAVE.settings[key] = +e.target.value; $("#" + out).textContent = Math.round(+e.target.value * 100) + "%"; applyBtnStyle(); saveGame(); }; };
    bset("bsz", "btnScale", "bszv"); bset("jsz", "joyScale", "jszv"); bset("bal", "btnAlpha", "balv");
    $("#bsreset").onclick = () => { delete SAVE.settings.btnScale; delete SAVE.settings.joyScale; delete SAVE.settings.btnAlpha; applyBtnStyle(); saveGame(); UI.keys(after); };
    const save = (k) => { SAVE.settings.keys = k; saveGame(); };
    document.querySelectorAll("[data-ka]").forEach((b) => (b.onclick = (ev) => {
      ev.stopPropagation(); const a = b.dataset.ka; $("#kv_" + a).textContent = "키를 누르세요…"; UI.capturing = true;
      const done = (code) => {
        window.removeEventListener("keydown", kd, true); window.removeEventListener("mousedown", md, true); setTimeout(() => (UI.capturing = false), 50);
        const cur = keyMap(); const other = Object.keys(cur).find((x) => x !== a && cur[x] === code); if (other) cur[other] = cur[a]; cur[a] = code; save(cur); UI.keys(after);
      };
      const kd = (e) => { e.preventDefault(); e.stopPropagation(); done(e.code); };
      const md = (e) => { if (e.target.closest && e.target.closest("[data-ka]")) return; e.preventDefault(); e.stopPropagation(); done("Mouse" + e.button); };
      setTimeout(() => { window.addEventListener("keydown", kd, true); window.addEventListener("mousedown", md, true); }, 30);
    }));
    if ($("#kreset")) $("#kreset").onclick = () => { save(Object.assign({}, DEFAULT_KEYS)); UI.keys(after); };
    $("#kdone").onclick = () => { UI.closeModal(); if (G) G.paused = wasPaused; after && after(); };
  },
  askNick() {
    UI.modal(`<h2>닉네임 정하기</h2><p class="muted" style="text-align:center">아이디와 따로, 게임에서 보일 이름이에요 (12자까지)</p><div class="field" style="max-width:360px;margin:0 auto"><input id="anick" maxlength="12" value="${esc(ACCOUNT)}"></div><div class="center"><button class="btn gold" id="anickok">정하기</button></div>`);
    setTimeout(() => $("#anick") && $("#anick").select(), 50);
    $("#anickok").onclick = () => { const v = cleanNick($("#anick").value) || ACCOUNT; SAVE.nick = v; saveGame(); UI.closeModal(); UI.menu(); UI.daily(); };
  },
  bindSound() {
    const st = SAVE.settings;
    $("#smus").onchange = (e) => { st.music = e.target.checked; saveGame(); if (!st.music) $("#bgm").pause(); else { const t = curTrack; curTrack = null; music(t || "menu"); } };
    $("#svol").oninput = (e) => { st.vol = +e.target.value; $("#bgm").volume = st.vol; saveGame(); };
    $("#ssfx").oninput = (e) => { st.sfx = +e.target.value; sfxVol = st.sfx; saveGame(); sfx("coin"); };
  },
  // 선택 창이 뜬 직후 0.8초는 눌러도 안 고름 (공격 클릭·숫자키가 이어져 잘못 고르는 것 방지, 11-10)
  arm() {
    const until = performance.now() + 800;
    document.querySelectorAll("#mbox .pk").forEach((b) => { b.style.opacity = "0.45"; b.style.pointerEvents = "none"; });
    const tip = document.createElement("p"); tip.className = "muted"; tip.style.textAlign = "center"; tip.textContent = "잠시 후 고를 수 있어요…"; $("#mbox").appendChild(tip);
    setTimeout(() => { document.querySelectorAll("#mbox .pk").forEach((b) => { b.style.opacity = ""; b.style.pointerEvents = ""; }); tip.remove(); }, 800);
    return until;
  },
  // 전직: 두 갈래 중 하나 (레벨 10·20·30)
  // 전직 연출: 화면을 가르는 띠 + 전직 그림 + 이름 (보스 컷인과 같은 자리, 금빛)
  jobCut(u, o) {
    const el = document.createElement("div"); el.className = "cutin jobcut " + o.kind;
    el.innerHTML = `<div class="cbar"></div><div class="jbg">${jobArtHtml(u.id, o.kind, o.tier, true)}</div><div class="ctx"><small>${JOB_TIER_NAME[o.tier] || "전직"} · ${CHAR[u.id].name}</small><b>${o.name}</b><em>${o.skill}</em></div>`;
    document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
  },
  jobPick(tier, cid, send) {
    const local = !send, p = G && G.p; cid = cid || (p && p.id);
    const opts = jobOptions(cid, tier), multi = G && G.opt && G.opt.multi;
    if (local && !multi) G.paused = true;
    UI.modal(`<h2>⚔️ ${JOB_TIER_NAME[tier] || ""} · Lv.${JOB_LEVELS[tier]}</h2><p class="muted" style="text-align:center">${CHAR[cid].name} · ${(p && p.jobName) || CHAR[cid].job} — 한 갈래를 골라요 (이번 원정 동안)</p>
      <div class="jpicks">${opts.map((o, i) => `<button class="jpk ${o.kind}" data-j="${i}"><div class="jart">${jobArtHtml(cid, o.kind, tier)}</div><div class="jtx"><small>${o.kind === "atk" ? "🗡️ 공격의 길" : "🛡️ 수호·기술의 길"}</small><b>${o.name}</b><p>${o.desc}</p><p class="jsk">✨ ${o.skill}</p></div></button>`).join("")}</div>`);
    const armT = UI.arm();
    document.querySelectorAll("[data-j]").forEach((b) => (b.onclick = () => {
      if (performance.now() < armT) return;
      const i = +b.dataset.j; UI.closeModal();
      if (send) { send(i); if (G && G.p) { G.p.jobName = opts[i].name; if (G.p.sk) jobSkills(G.p, tier, opts[i].kind); } return; }
      applyJob(p, opts[i]); if (!multi) G.paused = false;
    }));
  },
  levelUp(opts) {
    // 고를 패시브가 남지 않으면(모두 Lv.3이거나 상한) 엽전으로 대신 (11-13)
    if (!opts.length) { G.p.gold = (G.p.gold || 0) + 60; addText(G.p.x, G.p.y - 120, "강화 모두 최대! 엽전 +60", "#ffe08a", 22); return; }
    const multi = G.opt && G.opt.multi; if (!multi) { G.paused = true; input.atkHeld = false; input.moveHeld = false; }
    $("#modal").classList.add("lvmode");
    const pips = (n) => `<div class="lvpips">${[0, 1, 2].map((i) => `<i class="${i < n ? "on" : i === n ? "nx" : ""}"></i>`).join("")}</div>`;
    UI.modal(`<div class="lvhead">${UI._lvHead || `<small>기운이 차오른다</small><h2>레벨 ${G.p.lvl}</h2>`}<p>강화를 하나 고르세요 <span>1~${opts.length}</span></p></div><div class="lvcards">${opts.map((k, i) => { const b = BOONS[k], R = RARITY[b.rar], n = G.p.boons.filter((x) => x === k).length; return `<button class="pk lvc r${b.rar}${b.duo ? " duo" : ""}" data-k="${k}" style="--rc:${R.col};--d:${i * 0.07}s"><span class="lvtag">${b.duo ? "조합 · " : ""}${R.name}</span><div class="lvico"><span class="lvray"></span>${abIc("bn_" + k, b.ic, 96)}</div><b class="lvname">${b.name}</b><div class="lvsub">${n ? `Lv.${n} → <em>Lv.${n + 1}</em>` : "<em>새 강화</em>"}</div><div class="lvline"></div><div class="lvdesc">${b.lore ? `<p class="lore">${esc(b.lore)}</p>` : ""}${n ? boonChange(k, n) : `<p>${b.desc}</p>`}${typeof duoHint === "function" ? duoHint(k) : ""}</div>${pips(n)}<span class="kbd lvkey">${i + 1}</span></button>`; }).join("")}</div><div class="center lvre">${G.rerolls > 0 && !multi ? `<button class="btn" id="rrl">🧵 운명의 실 · 다시 뽑기 (${G.rerolls})</button>` : ""}<button class="btn sm lvskip" id="lvskip">넘기기 · 엽전 +${30 + G.p.lvl * 2}</button></div>`);
    const armT = UI.arm();
    const choose = (k) => { if (performance.now() < armT) return; window.removeEventListener("keydown", kh); takeBoon(G.p, k); UI.closeModal(); if (!multi) G.paused = false; };
    const kh = (e) => { const i = ["Digit1", "Digit2", "Digit3", "Digit4"].indexOf(e.code); if (i >= 0 && opts[i]) choose(opts[i]); };
    if ($("#lvskip")) $("#lvskip").onclick = () => { if (performance.now() < armT) return; window.removeEventListener("keydown", kh); const g = 30 + G.p.lvl * 2; G.p.gold = (G.p.gold || 0) + g; addText(G.p.x, G.p.y - 120, "넘김 · 엽전 +" + g, "#ffe08a", 20); UI.closeModal(); if (!multi) G.paused = false; };
    if ($("#rrl")) $("#rrl").onclick = () => { if (performance.now() < armT) return; window.removeEventListener("keydown", kh); G.rerolls--; UI.closeModal(); UI.levelUp(rollBoons(G.boonN || 3, G.p.lvl)); };
    window.addEventListener("keydown", kh);
    document.querySelectorAll(".pk").forEach((b) => (b.onclick = () => choose(b.dataset.k)));
  },
  // 11-21 떠돌이 대장간: 가진 강화 하나를 녹이고(엽전) 새 강화 셋 중 하나 — 강화 개수는 그대로
  forge(d) {
    const multi = G.opt && G.opt.multi; if (!multi) { G.paused = true; input.atkHeld = false; input.moveHeld = false; }
    const ks = [...new Set(G.p.boons)].filter((k) => BOONS[k]);
    UI.modal(`<h2>떠돌이 대장간</h2><p class="muted" style="text-align:center">녹일 강화를 고르면 엽전 <b>${d.price}</b>을 내고, 새 강화 셋 중 하나로 다시 벼려요. (한 단계만 녹아요)</p>
      <div class="fgrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;max-height:52vh;overflow:auto">${ks.map((k) => { const b = BOONS[k], n = G.p.boons.filter((x) => x === k).length; return `<button class="btn fgk" data-k="${k}" style="display:flex;align-items:center;gap:8px;text-align:left;border-color:${RARITY[b.rar].col}">${abIc("bn_" + k, b.ic, 40)}<span style="word-break:keep-all"><b>${esc(b.name)} <small class="muted">Lv.${n}</small></b><br><small class="muted">${esc(b.desc || "")}</small></span></button>`; }).join("")}</div>
      <div class="center"><button class="btn" id="fgno">그만두기</button></div>`);
    const armT = UI.arm();
    $("#fgno").onclick = () => { UI.closeModal(); if (!multi) G.paused = false; d.away = false; };
    document.querySelectorAll(".fgk").forEach((b) => (b.onclick = () => {
      if (performance.now() < armT || d.used || (G.p.gold || 0) < d.price) return; const k = b.dataset.k, i = G.p.boons.lastIndexOf(k); if (i < 0) return;
      G.p.gold -= d.price; d.used = 1; G.p.boons.splice(i, 1); if (k === "phoenixPerk" && G.p.revive > 0) G.p.revive--; recalc(G.p); sfx("coin");
      const opts = rollBoons(G.boonN || 3, G.p.lvl).filter((x) => x !== k); UI.closeModal(); UI._lvHead = `<small>「${esc(BOONS[k].name)}」 녹여</small><h2>다시 벼리기</h2>`;
      UI.levelUp(opts.length ? opts : [k]); UI._lvHead = "";
      for (let j = 0; j < 12; j++) spark(d.x + rnd(-50, 50), d.y + rnd(-90, 10), "#ffb060", 4);
    }));
  },
  story(key, then) {
    const s = STORY[key]; if (!s) { then(); return; }
    if (G) G.paused = true; if (input) { input.atkHeld = false; input.moveHeld = false; }
    if (!s.lines) { UI.modal(`<div class="story"><div class="pic" style="background-image:url(${imgSrc(s.img)})"></div><div><h2 style="text-align:left">${s.title}</h2><p>${esc(s.text)}</p><button class="btn gold" id="sgo">계속 ▶</button></div></div>`); $("#sgo").onclick = () => { UI.closeModal(); then(); }; return; }
    UI.vn(key, then);
  },
  result(r, isClient) {
    if (r.mode === "story" && r.storyDone) music("ending"); /* 11-16 스토리를 깨면 엔딩곡 */
    track("run_end", { mode: r.mode, win: !!r.win, done: !!r.storyDone, floor: r.floor, stage: r.stage, kills: r.kills, lvl: r.lvl, char: G && G.p && G.p.id, duos: G && G.p ? G.p.boons.filter((k) => BOONS[k] && BOONS[k].duo) : [] });
    const title = r.mode === "practice" ? "🎯 연습 끝" : r.mode === "dev" ? "🛠 개발자 맵 끝" : r.mode === "raid" ? (r.win ? "🐉 보스 레이드 완료!" : "레이드 실패") : r.mode === "duel" ? (r.win ? "🏆 대전 승리!" : "대전 패배") : r.storyDone ? "🌅 스토리 완료!" : r.win ? "원정 성공" : "쓰러졌습니다";
    const newChars = Object.keys(SAVE.chars).length - (G.unlocksAtStart || 0);
    const talk = typeof talkPick === "function" && !isClient && !(G.opt && G.opt.multi) ? talkPick(r) : null;
    UI.modal(`<h2>${title}</h2>${typeof talkHtml === "function" ? talkHtml(talk) : ""}${typeof dailyHtml === "function" ? dailyHtml(r.daily) : ""}${typeof mastHtml === "function" ? mastHtml(r.mast) : ""}${typeof seasonHtml === "function" ? seasonHtml(r.season) : ""}${typeof meterHtml === "function" ? meterHtml(!r.win && !r.storyDone) : ""}<div class="res">
      ${r.mode === "raid" ? `<div><b>${G.raidN || 0} / ${RAID_ORDER.length}</b>보스 처치</div>` : r.mode === "story" ? `<div><b>${r.floor}장 ${r.stage}스테이지</b>도달</div>` : r.mode === "endless" ? `<div><b>${r.endless}</b>번째 방</div>` : r.duel ? `<div><b>${r.duel.wins[0]} : ${r.duel.wins[1]}</b>점수</div>` : `<div><b>${r.mode === "dev" ? "🛠" : "🎯"}</b>${r.mode === "dev" ? "개발자 맵" : "연습장"} 종료</div>`}
      <div><b>${r.kills}</b>처치</div>${r.comboMax >= 10 ? `<div><b>${r.comboMax}</b>최대 연격</div>` : ""}<div><b>Lv.${r.lvl}</b>레벨</div><div><b>${curIc("coin")} +${r.coinRw || 0}</b>코인 보상</div>${r.coin > 0 ? `<div><b>${r.coin}</b>판에서 주운 코인</div>` : ""}${newChars > 0 ? `<div><b>${newChars}</b>새 영웅</div>` : ""}</div>
      ${(G.newMobs && G.newMobs.length) || (G.p && G.p.boons && G.p.boons.some((k) => BOONS[k] && BOONS[k].duo)) ? `<p style="text-align:center" class="muted">이번 판: ${G.newMobs && G.newMobs.length ? "📖 새 요괴: " + G.newMobs.map((k) => ENEMIES[k].name).join("·") : ""}${G.p && G.p.boons.some((k) => BOONS[k] && BOONS[k].duo) ? " ⚔️ 조합 " + [...new Set(G.p.boons.filter((k) => BOONS[k] && BOONS[k].duo))].map((k) => BOONS[k].name).join("·") : ""}</p>` : ""}
      ${typeof goalsHtml === "function" ? goalsHtml(r) : ""}
      ${unclaimed() ? '<p style="text-align:center;color:var(--gold2)">🎯 받을 수 있는 임무 보상이 있어요!</p>' : ""}
      <div class="center"><button class="btn gold" id="again">다시 도전</button><button class="btn" id="fbres">의견 보내기</button><button class="btn" id="home">처음 화면</button>${["story", "endless", "raid"].includes(r.mode) ? '<button class="btn" id="sharec">📸 기록 카드</button>' : ""}</div>`);
    const opt = G.opt, multi = opt.multi || NET.client;
    if (multi) $("#again").textContent = "대기실로 (다시 함께)";
    $("#again").onclick = () => { UI.closeModal(); if (multi) { NET.client = false; G = null; NET.roomSent = null; UI.multi(); return; } if (opt.mode === "story") { opt.floor = Math.min(opt.floor, SAVE.story.maxFloor); delete opt.resume; delete opt._newOk; } UI.startRun(opt); };
    if ($("#fbres")) $("#fbres").onclick = () => UI.feedback({ from: "result" }); $("#home").onclick = () => { UI.closeModal(); if (multi) { NET.client = false; NET.leave(); } UI.menu(); };
    if (typeof talkType === "function") talkType();
    if ($("#sharec")) $("#sharec").onclick = () => shareCard(r);
    if (!isClient) cbtSurvey(r);
    try { if (CLOUD.on && CLOUD.dirty) { clearTimeout(CLOUD.timer); CLOUD.timer = null; CLOUD.push(); } } catch (e) { } // 판이 끝나면 바로 올림
    document.querySelectorAll(".goal[data-go]").forEach((g) => (g.onclick = () => { if (multi) return; UI.closeModal(); UI.menu(); UI.open(g.dataset.go); }));
  },
};

// 움직이는 카드: 배경 천천히 확대·이동 + 빛 쓸림 + 떠오르는 불씨 + 캐릭터 동작 그림 순환
function animCard(art, big) {
  const motes = Array.from({ length: big ? 10 : 6 }, (_, i) => `<i class="mote" style="left:${(i * 37) % 95}%;bottom:${(i * 13) % 30}%;animation-delay:${(i * 0.43) % 3}s"></i>`).join("");
  return `<div class="kb" style="background-image:url(${imgSrc("card_" + art)})"></div>${motes}<img class="aspr" data-anim="spr_${art}" src="${imgSrc("spr_" + art)}" alt=""><i class="shine"></i>`;
}
const ANIM_SEQ = ["", "", "_walk1", "", "_walk2", "", "_attack", "_attack", "", "", "_skill", "_skill", "_skill", ""];
setInterval(() => {
  const k = Math.floor(Date.now() / 220) % ANIM_SEQ.length;
  document.querySelectorAll("img[data-anim]").forEach((im) => { const base = im.dataset.anim, src = imgSrc(base + ANIM_SEQ[k]) || imgSrc(base); if (im.getAttribute("src") !== src) im.setAttribute("src", src); });
}, 110);

// 칭호마다 전용 엠블럼 그림 (11-11)
for (const k in TITLES) { TITLES[k]._k = k; if (!TITLES[k].img && ASSETS.img["ic_" + k]) TITLES[k].img = "ic_" + k; }
function jobArtHtml(cid, kind, tier, big) {
  const k = `job_${cid}_${kind}`, art = charArt(cid, CHAR[cid] && CHAR[cid].forms ? "wolf" : null);
  if (ASSETS.img[k]) return `<img class="jimg" src="${imgSrc(k)}" alt="">`;
  return `<div class="jfall ${kind}" style="background-image:url(${imgSrc("card_" + art)})"></div><img class="jspr" src="${imgSrc("spr_" + art + "_skill") || imgSrc("spr_" + art)}" alt="">`;
}
// 화면 버튼 크기·투명도 (키 설정에서 조절, 11-14)
function applyBtnStyle() {
  const h = document.getElementById("hud"); if (!h || !SAVE) return; const s = SAVE.settings;
  h.style.setProperty("--btnS", s.btnScale || 1); h.style.setProperty("--joyS", s.joyScale || 1); h.style.setProperty("--btnA", s.btnAlpha != null ? s.btnAlpha : 1);
}
function gCard(bg, tag, name, sub, own, tip) { return `<div class="ch anim-card ${own ? "" : "lock"}" title="${esc(tip || "")}">${bg}<span class="tag" style="z-index:2">${tag}</span><span class="nm" style="z-index:2">${name}<small>${sub}</small></span></div>`; }
function gBg(kind, d) {
  const col = RARITY[d.rar].col, glow = `<div class="kb" style="background:radial-gradient(circle at 50% 42%, ${col}55, #120e18 68%)"></div>`;
  if (kind === "pet" && d.img && ASSETS.img["pcard_" + d.img.slice(3)]) return `<div class="kb" style="background-image:url(${imgSrc("pcard_" + d.img.slice(3))})"></div><i class="shine"></i>`;
  if (kind === "art" && d.img && ASSETS.img["acard_" + d.img.slice(3)]) return `<div class="kb" style="background-image:url(${imgSrc("acard_" + d.img.slice(3))})"></div><i class="shine"></i>`;
  if (kind === "title" && d._k && ASSETS.img["tcard_" + d._k]) return `<div class="kb" style="background-image:url(${imgSrc("tcard_" + d._k)})"></div><i class="shine"></i>`;
  if (d.img && ASSETS.img[d.img]) return glow + `<img class="aspr" src="${imgSrc(d.img)}" alt="" style="bottom:22%;width:58%"><i class="shine"></i>`;
  return glow + (ASSETS.img.emo_tag ? `<img class="aspr" src="${imgSrc("emo_tag")}" alt="" style="bottom:24%;width:52%">` : "") + `<i class="shine"></i>`;
}
// 고화질 카드 일러 (사용자 요청 11-12: 아티팩트·펫·칭호 선택창도 고화질)
function hdCardKey(kind, k, def) { const key = kind === "pet" && def.img ? "pcard_" + def.img.slice(3) : kind === "art" && def.img ? "acard_" + def.img.slice(3) : kind === "title" ? "tcard_" + k : null; return key && ASSETS.img[key] ? key : null; }
function itemCard(kind, k, def, lv, equipable) {
  const E = SAVE.equip, on = kind === "art" ? E.arts.includes(k) : kind === "pet" ? E.pet === k : E.title === k;
  const col = RARITY[def.rar].col, tag = equipable && lv ? "button" : "div";
  let how = HOW_NAME[def.how] + (def.how === "drop" ? " (요괴 0.2%·정예 2%·보스 5%)" : "");
  let prog = "";
  if (def.c) { const v = Math.min(statVal(def.c.stat), def.c.n); how += " · " + def.c.text; if (!lv) prog = `<div class="prog" style="width:100%"><i style="width:${(v / def.c.n) * 100}%"></i></div><span class="muted" style="font-size:.72rem">${v}/${def.c.n}</span>`; }
  return `<${tag} class="item ${lv ? "" : "off"} ${on ? "eq" : ""}" ${equipable && lv ? `data-eq="${k}"` : ""} style="border-color:${on ? "" : col + "66"}">
    ${(() => { const hd = hdCardKey(kind, k, def); return hd ? `<div class="hdc" style="background-image:url(${imgSrc(hd)});border-color:${col}"><i class="shine"></i></div>` : def.img ? `<img src="${imgSrc(def.img)}" alt="">` : `<span class="ico">🏷️</span>`; })()}<b style="color:${col}">${def.name}</b>
    <span class="muted">${RARITY[def.rar].name}${lv && kind !== "title" ? " · +" + (lv - 1) : ""}</span>${def.lore ? `<span class="lore" style="font-size:.76rem">${esc(def.lore)}</span>` : ""}<span class="muted" style="font-size:.8rem">${def.desc}</span>
    ${lv && kind !== "title" ? (() => { const sh = ((SAVE.ishards || {})[kind + ":" + k]) || 0, el = lv - 1; if (el >= ITEM_SHARD.max) return `<span class="muted" style="font-size:.75rem">조각 ${sh} · 최대 강화</span>`; const c = ITEM_SHARD.cost(el); return `<span class="muted" style="font-size:.75rem">조각 ${sh}/${c} · 성공 ${Math.round(SHARD.enhRate(el) * 100)}%</span><span class="btn sm gold" role="button" data-enh="${kind}:${k}" style="${sh >= c ? "" : "opacity:.45;pointer-events:none"}">강화</span>`; })() : ""}
    <span class="muted" style="font-size:.72rem">얻는 법: ${how}</span>${prog}${on ? '<span style="color:var(--gold)">착용 중</span>' : ""}</${tag}>`;
}

document.addEventListener("pointerup", (e) => { if (e.target && e.target.id === "mini" && G && !UI.modalOpen()) { e.preventDefault(); e.stopPropagation(); UI.bigMap(); } }, true); // 11-21 폰에서도 작은 지도를 누르면 큰 지도
function drawMini() {
  const c = $("#mini"); if (!c || !G) return; const g = c.getContext("2d"); g.clearRect(0, 0, c.width, c.height);
  if (G.mode === "duel") { g.fillStyle = "#c9a0ff"; g.font = "28px Do Hyeon"; g.textAlign = "center"; g.fillText("대전장", c.width / 2, c.height / 2 + 10); return; }
  const cur = G.cur, S = 34, cx = c.width / 2, cy = c.height / 2;
  const col = { boss: "#ff4d4d", treasure: "#ffc84a", shop: "#5fc8ff", rest: "#7fe08a", elite: "#c38bff", start: "#ffffff", fight: "#a0784a" };
  for (const [k, r] of G.rooms) {
    if (!r.visited) continue;
    const x = cx + (r.x - cur.x) * S * 1.5, y = cy + (r.y - cur.y) * S;
    for (const d in r.links) { const t = G.rooms.get(r.links[d]); const [dx, dy] = DIRS[d]; g.strokeStyle = t && t.visited ? "#6a5a80" : "#3a3048"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx * S * 0.75 * (t && t.visited ? 1 : 0.6), y + dy * S * 0.5 * (t && t.visited ? 1 : 0.6)); g.stroke(); }
  }
  for (const [k, r] of G.rooms) {
    if (!r.visited) continue;
    const x = cx + (r.x - cur.x) * S * 1.5, y = cy + (r.y - cur.y) * S;
    g.fillStyle = r === cur ? "#ffe08a" : r.cleared ? "#4a4058" : "#6a3a3a"; g.fillRect(x - 16, y - 11, 32, 22);
    g.strokeStyle = col[r.type] || "#888"; g.lineWidth = 2; g.strokeRect(x - 16, y - 11, 32, 22);
  }
}

// ---------- 시작 ----------
function startAudio() {
  try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) { }
}
window.addEventListener("pointerdown", () => { startAudio(); const a = $("#bgm"); if (SAVE && SAVE.settings.music && a.paused && curTrack) { const t = curTrack; curTrack = null; music(t); } }, { capture: true });
window.addEventListener("beforeunload", () => saveGame());
// 이스터 에그: 처음 화면에서 ↑↑↓↓←→←→BA
(() => { const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"]; let i = 0;
  window.addEventListener("keydown", (e) => { if (G || !SAVE || UI.typing()) return; i = e.code === seq[i] ? i + 1 : e.code === seq[0] ? 1 : 0;
    if (i === seq.length) { i = 0; if (SAVE.eggs.konami) { UI.toast("🎮 이미 받은 비밀 명령어예요", 2500); return; } SAVE.eggs.konami = 1; SAVE.coins += 10; saveGame(); UI.toast("🎮 비밀 명령어! 토벌꾼의 축복 · 코인 +10", 4500); if ($("#menu")) UI.menu(); } }); })();
window.addEventListener("error", (e) => UI.error(e.error || { message: e.message }));
loadImages(); initEngine(); if (/autotest/.test(location.hash) || ls.get("ygr_lang_set")) UI.login(); else setTimeout(() => UI.langFirst(() => UI.login()), 0); setTimeout(checkUpdate, 1500); // 11-21 처음 실행만 언어 선택(이 파일 아래쪽에서 정의되므로 다 읽은 뒤), 그 밖엔 예전처럼 바로
if (!/autotest/.test(location.hash) && ls.get("ygr_auto")) { if ($("#lerr")) $("#lerr").textContent = "☁️ 자동 로그인 중…"; autoLogin().then((ok) => { if (ok && !G) afterLogin(); else if ($("#lerr")) $("#lerr").textContent = ""; }).catch(() => { if ($("#lerr")) $("#lerr").textContent = ""; }); }
// ===================== 11-18 출시 준비: 정보 화면 (확률 공개 · 이용약관 · 개인정보 · 크레딧 · 버그 신고 · 계정 삭제) =====================
// 사용자: "게임 출시를 위해 필요한 요소들 정리해서 적용". 확률표는 손으로 적지 않고 실제 뽑기 코드가 쓰는 값(GACHA·SK_GRADE·SHARD…)에서 바로 만든다 → 숫자가 어긋날 일이 없음.
const SUPPORT = { mail: "jmg98916@gmail.com", company: "요괴록 개발팀" }; // 출시 전에 문의 메일·사업자 이름을 넣기 (요괴록_출시준비 체크리스트)
const pct = (v) => { const p = v * 100; return (p >= 1 ? p.toFixed(2) : p >= 0.01 ? p.toFixed(3) : p.toFixed(4)).replace(/\.?0+$/, "") + "%"; };
function probTables() {
  const T = (rows, head) => `<table class="ptab"><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;
  let h = `<p class="muted">아래 확률은 게임이 실제로 뽑을 때 쓰는 값에서 자동으로 만든 표예요. 뽑기는 게임 안 재화(코인·엽전)로만 하며, 현재 현금 결제는 없어요.</p>`;
  // 캐릭터 뽑기
  const heroes = CHARS.filter((c) => c.unlock.type === "gacha"), GR = ["SS", "S", "A", "B", "C"];
  let sum = 0; const rows = [];
  for (const g of GR) {
    const r = GACHA_GRADE_RATE[g] || 0, hs = heroes.filter((c) => CHAR_GRADE[c.id] === g); if (!hs.length) continue; sum += r;
    const [lo, hi] = SHARD.per[g];
    rows.push([`${g}급 영웅 (${hs.length}명)`, pct(r), pct(r / hs.length), `조각 ${lo}~${hi}개 (해금 ${SHARD.need[g]}개) · 아직 없는 영웅이면 ${pct(SHARD.direct[g])} 확률로 바로 해금`]);
  }
  rows.push(["가진 영웅 조각 2~5개", pct(1 - sum), "-", "강화 재료"]);
  h += `<h3>🎰 영웅 뽑기 (1회 코인 ${pullCost("char", 1)} · 10회 ${pullCost("char", 10)})</h3>` + T(rows, ["결과", "1회 확률", "영웅 1명당", "내용"]);
  h += `<p class="muted">보장: 영웅이 ${SHARD.pity}번 연속 안 나오면 ${SHARD.pity}번째에 반드시 영웅 (A급 ${pct(PITY_GRADE.A)} · S급 ${pct(PITY_GRADE.S)} · SS급 ${pct(PITY_GRADE.SS)}). 영웅이 나오면 보장 횟수는 0으로 돌아가요.</p>`;
  { const pu = pickupHero(); if (pu) h += `<p class="muted">⭐ 이번 주 길한 영웅: ${CHAR[pu].name}(${CHAR_GRADE[pu]}급) — ${CHAR_GRADE[pu]}급이 나오면 ${Math.round(PICKUP_SHARE * 100)}%는 ${CHAR[pu].name}, 나머지는 같은 등급 다른 영웅이 고르게. 1회 ${CHAR[pu].name} 확률 ${pct((GACHA_GRADE_RATE[CHAR_GRADE[pu]] || 0) * (PICKUP_SHARE + (1 - PICKUP_SHARE) / CHARS.filter((c) => c.unlock.type === "gacha" && CHAR_GRADE[c.id] === CHAR_GRADE[pu]).length))}</p>`; }
  h += `<details><summary>영웅 목록</summary><p class="muted">${GR.map((g) => `${g}: ` + heroes.filter((c) => CHAR_GRADE[c.id] === g).map((c) => c.name).join(", ")).join("<br>")}</p></details>`;
  // 스킬 뽑기
  const sg = ["S", "A", "B", "C", "D"];
  h += `<h3>📜 스킬 뽑기 (칸마다 따로)</h3>` + T(["Q", "W", "E", "R"].map((s) => [s === "R" ? "R (궁극기)" : s, ...sg.map((g) => { const n = SKILL_KEYS.filter((k) => SKILLS[k].slot === s && SKILLS[k].grade === g).length; return n ? `${pct(SK_GRADE[g].p)}<br><span class="muted">${n}종 · 1종당 ${pct(SK_GRADE[g].p / n)}</span>` : `${pct(SK_GRADE[g].p)}<br><span class="muted">없음 → D급으로</span>`; })]), ["칸", ...sg.map((g) => g + "급")]);
  // 아티팩트·펫·칭호
  for (const [k, T0, nm] of [["art", ARTIFACTS, "🏺 보물 뽑기"], ["pet", PETS, "🐾 펫 뽑기"], ["title", TITLES, "🏷 칭호 뽑기"]]) {
    const pool = gachaPool(T0), R = GACHA[k].rates;
    h += `<h3>${nm} (1회 코인 ${GACHA[k].cost} · 10회 ${GACHA[k].cost10})</h3>` + T([4, 3, 2, 1].map((r) => { const n = pool.filter((x) => T0[x].rar === r).length; return [RARITY[r].name, pct(R[r] || 0), n ? `${n}종 · 1종당 ${pct((R[r] || 0) / n)}` : "없음"]; }), ["등급", "1회 확률", "종류"]);
  }
  h += `<p class="muted">10회 뽑기: 보물·펫·칭호는 10번째까지 희귀 이상이 없으면 10번째가 희귀 이상으로 바뀌어요.</p>`;
  // 강화
  h += `<h3>⬆️ 강화 성공 확률</h3>` + T([Array.from({ length: SHARD.maxEnh }, (_, i) => pct(SHARD.enhRate(i)))], Array.from({ length: SHARD.maxEnh }, (_, i) => "+" + (i + 1)));
  h += `<p class="muted">영웅 강화(최대 +${SHARD.maxEnh})·보물·펫 강화(최대 +${ITEM_SHARD.max}) 모두 이 표를 따라요. 실패하면 단계는 그대로이고 쓴 조각은 사라져요.</p>`;
  return h;
}
const TERMS = `<h3>이용약관 (요약)</h3><ol class="muted" style="line-height:1.8">
<li>요괴록(이하 '게임')은 ${"${co}"}가 제공하며, 게임을 이용하면 이 약관에 동의한 것으로 봐요.</li>
<li>계정은 본인만 써야 하며 남에게 팔거나 빌려주면 안 돼요. 비밀번호 관리 책임은 이용자에게 있어요.</li>
<li>코인·엽전·조각·물건 등 게임 안 재화는 게임 안에서만 쓰는 것으로, 현금으로 바꾸거나 다른 사람에게 팔 수 없어요.</li>
<li>버그·해킹 도구·자동 프로그램으로 얻은 재화나 기록은 회수하거나 계정 이용을 제한할 수 있어요.</li>
<li>멀티플레이에서 욕설·괴롭힘·부적절한 닉네임은 금지이며, 닉네임은 바꾸도록 요청하거나 제한할 수 있어요.</li>
<li>게임은 업데이트로 내용·밸런스·확률이 바뀔 수 있고, 확률이 바뀌면 이 화면의 확률표가 함께 바뀌어요.</li>
<li>서비스를 끝낼 때는 최소 30일 전에 게임 안에서 알려요.</li>
<li>문의: ${"${mail}"}</li></ol>`;
const PRIVACY = `<h3>개인정보 처리방침</h3><ol class="muted" style="line-height:1.8">
<li><b>모으는 정보</b>: 아이디(로그인용 — 이메일 모양 번호로 바꿔 저장), 비밀번호(암호화되어 저장, 개발자도 볼 수 없음), 닉네임, 게임 진행 저장 데이터. 실명·전화번호·실제 이메일은 받지 않아요.</li>
<li><b>쓰는 곳</b>: 로그인, 여러 기기에서 이어 하기(클라우드 저장), 멀티플레이 상대에게 닉네임 표시.</li>
<li><b>맡기는 곳</b>: Google Firebase(로그인·저장, 미국 등 Google 서버). 멀티플레이는 PeerJS 연결 서버를 거쳐 기기끼리 직접 연결돼 상대에게 IP 주소가 보일 수 있어요. 글꼴은 Google Fonts 에서 받아요.</li>
<li><b>통계·오류 보고</b>: 켜져 있어요. 오류 보고(Sentry)는 오류가 난 때의 오류 내용·게임 버전·기기와 브라우저 종류·지금 모드를, 사용 통계(PostHog)는 판 시작·끝 같은 게임 안 행동을 <b>무작위 기기 번호로만</b> 모아요. 아이디·닉네임·IP 주소는 저장하지 않아요. 설정 → 「익명 통계·오류 보내기」에서 끌 수 있어요. 보관: 오류 보고 약 30일, 사용 통계 약 1년.</li>
<li><b>나라 밖으로 옮겨지는 정보</b>: 게임을 하는 동안 인터넷으로 수시로 보내져요. Google LLC(미국, Firebase — 로그인·저장, 계정 삭제 때까지) · Functional Software, Inc.(미국, Sentry — 오류 보고, 약 30일) · PostHog, Inc.(미국, 사용 통계, 약 1년). 원하지 않으면 통계·오류 보고를 끄거나 계정을 지우면 돼요.</li>
<li><b>의견 보내기</b>: 직접 적어 보낸 글과 게임 버전·기기 종류·모드만 오류 보고와 같은 곳(Sentry, 미국)으로 가요. 아이디·닉네임은 보내지 않아요. 약 30일 보관.</li>
<li><b>순위표</b>: 순위표가 열리면 무한의 방 기록과 닉네임·영웅이 다른 이용자에게 보여요.</li>
<li><b>보관 기간</b>: 계정을 지울 때까지. 설정 → 정보 → 계정 삭제에서 언제든 바로 지울 수 있고, 지우면 서버의 저장 데이터와 로그인 정보가 함께 지워져요.</li>
<li><b>만 14세 미만</b>: 보호자 동의 없이 가입하지 않도록 해 주세요.</li>
<li><b>문의·열람·정정·삭제 요청</b>: ${"${mail}"}</li></ol>`;
const CREDITS = `<h3>만든 것들 · 라이선스</h3><ul class="muted" style="line-height:1.8">
<li><b>AI 사용 고지</b>: 영웅·요괴·배경 그림 일부와 동작 프레임은 생성형 AI(Google Gemini)로 만든 뒤 사람이 고르고 다듬었어요. 음악은 Google Lyria, 음성·효과음은 ElevenLabs 로 만들었어요.</li>
<li>3D 동작: Adobe Mixamo (게임 사용 허용) · 3D 렌더: Blender</li>
<li>그림 확대: Real-ESRGAN (BSD-3-Clause) · 바닥 입체 지도: Depth Anything V2 Small (Apache-2.0)</li>
<li>글꼴: East Sea Dokdo · Song Myung · Nanum Brush Script · Yeon Sung · Do Hyeon · Gowun Dodum (SIL Open Font License 1.1)</li>
<li>멀티플레이 연결: PeerJS (MIT) · 로그인·저장: Google Firebase</li>
<li>게임 기획·프로그래밍·검수: 요괴록 개발팀</li></ul>`;
const ERRLOG = { list: [], add(m) { try { this.list.push(new Date().toISOString().slice(0, 19) + " " + String(m).slice(0, 300)); this.list = this.list.slice(-20); ls.set("ygr_errlog", JSON.stringify(this.list)); } catch (e) { } } };
try { ERRLOG.list = JSON.parse(ls.get("ygr_errlog") || "[]"); } catch (e) { }
{ const old = UI.error; UI.error = function (err) { ERRLOG.add((err && err.message) + " @" + ((err && err.stack) || "").split("\n")[1]); try { if (SAVE && G) saveGame(); } catch (e) { } return old.call(UI, err); }; } // 오류가 나면 기록하고 진행을 먼저 저장
window.addEventListener("unhandledrejection", (e) => ERRLOG.add("promise: " + (e.reason && (e.reason.message || e.reason))));
UI.info = function (tab, back) {
  tab = tab || "prob"; const mail = SUPPORT.mail || "출시 전 문의 메일이 이곳에 적혀요", co = SUPPORT.company;
  const tabs = [["prob", "🎲 확률 공개"], ["terms", "📄 이용약관"], ["privacy", "🔒 개인정보"], ["credits", "🎨 크레딧·라이선스"], ["bug", "🐞 버그 신고"], ["account", "👤 계정"]];
  let body = "";
  if (tab === "prob") body = probTables();
  else if (tab === "terms") body = TERMS.split("${co}").join(esc(co)).split("${mail}").join(esc(mail));
  else if (tab === "privacy") body = PRIVACY.split("${mail}").join(esc(mail));
  else if (tab === "credits") body = CREDITS;
  else if (tab === "bug") body = `<h3>버그 신고</h3><p class="muted">아래 내용을 복사해서 문의처로 보내 주세요. 아이디·비밀번호는 들어가지 않아요.</p><textarea id="buglog" readonly style="width:100%;height:220px;background:#0b0a10;color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:8px;font-size:.78rem">${esc(["요괴록 v" + GAME_VERSION, navigator.userAgent, "화면 " + innerWidth + "x" + innerHeight + " · 고급 그래픽 " + (typeof GLR !== "undefined" && GLR.ok ? "켜짐" : "꺼짐"), "--- 최근 오류 ---", ...(ERRLOG.list.length ? ERRLOG.list : ["(없음)"])].join("\n"))}</textarea><div class="center"><button class="btn gold" id="bugcp">📋 복사</button></div><p class="muted">문의: ${esc(mail)}</p>`;
  else if (tab === "account") body = `<h3>계정</h3><p>아이디: <b>${esc(ACCOUNT || "")}</b> · 닉네임: <b>${esc(nick())}</b></p><div class="card" style="border-color:#c0392b"><h3 style="color:#ff8a7a">계정 삭제</h3><p class="muted">이 계정의 서버 저장 데이터와 로그인 정보, 이 기기의 저장을 모두 지워요. <b>되돌릴 수 없어요.</b></p><p>확인을 위해 아이디를 그대로 적어 주세요</p><div style="display:flex;gap:8px"><input id="delid" style="flex:1;background:#0b0a10;border:1px solid var(--line);border-radius:10px;padding:8px 10px;color:var(--ink)"><button class="btn" id="delgo" style="border-color:#c0392b;color:#ff8a7a">계정 삭제</button></div></div>`;
  UI.frame("정보", `<div class="tabs">${tabs.map(([k, n]) => `<button class="tab ${k === tab ? "on" : ""}" data-t="${k}">${n}</button>`).join("")}</div><div class="card infobody" style="max-width:900px;margin:0 auto">${body}</div>`, back || (() => UI.settings()));
  document.querySelectorAll(".tab[data-t]").forEach((b) => (b.onclick = () => UI.info(b.dataset.t, back)));
  if ($("#bugcp")) $("#bugcp").onclick = () => { const t = $("#buglog"); t.select(); (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(() => UI.toast("복사했어요"), () => { document.execCommand("copy"); UI.toast("복사했어요"); }); };
  if ($("#delgo")) $("#delgo").onclick = async () => {
    if ($("#delid").value.trim() !== ACCOUNT) { UI.toast("아이디가 달라요"); return; }
    if (ACCOUNT === DEV_ID) { UI.toast("개발자 계정은 지울 수 없어요"); return; }
    $("#delgo").disabled = true; UI.toast("지우는 중…");
    try {
      if (CLOUD.on) { const tk = await CLOUD.token(); await fetch(CLOUD.doc(), { method: "DELETE", headers: { Authorization: "Bearer " + tk } }); await CLOUD.api("delete", { idToken: tk }); }
      try { localStorage.removeItem("dbm2_save_" + ACCOUNT); } catch (e) { } ls.set("ygr_auto", ""); CLOUD.off(); ACCOUNT = null; SAVE = null; music(null); $("#bgm").pause();
      UI.login(); UI.toast("계정을 지웠어요. 그동안 고마웠어요!", 4000);
    } catch (e) { $("#delgo").disabled = false; UI.toast("인터넷 연결을 확인하고 다시 해 주세요"); }
  };
};

// ===================== 11-18 1.7.0 혼불 제단 (판 사이 영구 성장) =====================
// 참고: Hades '밤의 거울'(죽어도 쌓이는 재화로 영구 강화) · Vampire Survivors(판 끝에 바로 다음 목표) → 조선식 재해석:
// 쓰러진 요괴의 넋이 '혼불'이 되어 남고, 등불 사당의 제단에 바쳐 토벌대 전체의 힘을 키운다. 죽어도 혼불은 남으니 매 판이 앞으로 나아감.
const ALTAR = [ // 11-19 사용자 "혼불 컨텐츠가 너무 빨리 소모되진 않는지" → 계산상 하루 1시간이면 약 1주(총 4,180)에 끝 → 단계별 ×1~3배(총 약 8,900), 다 올린 뒤엔 혼불 공양
  { k: "wick", ic: "🕯️", name: "등불 심지", desc: (l) => `최대 체력 +${l * 4}%`, max: 5, cost: [20, 60, 140, 275, 480], m: (l) => ({ hp: 0.04 * l }) },
  { k: "edge", ic: "🗡️", name: "벼린 날", desc: (l) => `공격력 +${l * 3}%`, max: 5, cost: [25, 75, 170, 325, 570], m: (l) => ({ atk: 0.03 * l }) },
  { k: "luck", ic: "🎴", name: "길한 점괘", desc: (l) => `치명타 확률 +${l}%`, max: 5, cost: [20, 60, 130, 250, 450], m: (l) => ({ crit: 0.01 * l }) },
  { k: "step", ic: "👣", name: "날랜 걸음", desc: (l) => `이동 속도 +${l * 2}%`, max: 3, cost: [30, 105, 260], m: (l) => ({ spd: 0.02 * l }) },
  { k: "armor", ic: "🛡️", name: "혼불 갑주", desc: (l) => `받는 피해 -${l * 2}%`, max: 3, cost: [40, 135, 320], m: (l) => ({ dr: 0.02 * l }) },
  { k: "purse", ic: "💰", name: "엽전 주머니", desc: (l) => `판 시작 엽전 +${l * 40}`, max: 5, cost: [15, 45, 100, 200, 360] },
  { k: "thread", ic: "🧵", name: "운명의 실", desc: (l) => `레벨 업 강화 다시 뽑기 ${l}번 (판마다)`, max: 3, cost: [60, 210, 520] },
  { k: "fourth", ic: "📜", name: "넷째 부적", desc: () => `레벨 업 때 강화를 4개 중에서 골라요`, max: 1, cost: [600] },
  { k: "ferry", ic: "⛵", name: "저승 뱃사공의 덤", desc: () => `판마다 한 번, 쓰러져도 다시 일어나요`, max: 1, cost: [900] },
  { k: "spirit", ic: "🔥", name: "넋 거두기", desc: (l) => `판에서 얻는 혼불 +${l * 10}%`, max: 5, cost: [40, 120, 280, 550, 960] },
];
const OFFER_SOUL = 300; // 혼불 공양: 제단을 다 올린 뒤에도 혼불이 쓸모 있게 (뽑기 1회 = 코인 5 = 혼불 1,500)
const altarLv = (k) => ((SAVE && SAVE.altar) || {})[k] || 0;
function altarMods() { if (!SAVE) return []; const out = []; for (const a of ALTAR) { const l = altarLv(a.k); if (l && a.m) out.push(a.m(l)); } if (altarLv("ferry")) out.push({ revive: 1 }); return out; }
function altarStart(p, opt) { // newRun 에서 부름
  if (!SAVE || !G) return; G.bossAtStart = SAVE.stats.bosses || 0; G.maxAtStart = SAVE.story.maxFloor || 1;
  if (opt.mode === "duel" || opt.multi) return;
  p.gold = (p.gold || 0) + 40 * altarLv("purse"); G.rerolls = altarLv("thread"); G.boonN = altarLv("fourth") ? 4 : 3;
  const nb = typeof dailyRule === "function" && dailyRule("boons"); if (nb) for (let i = 0; i < nb; i++) { const k = rollBoons(1, 12)[0]; if (k) takeBoon(p, k); }
}
function altarEarn(r) { // endRun 에서 부름 → 혼불 계산·저장
  if (!SAVE || !["story", "endless", "raid"].includes(r.mode) || (G && G.opt && G.opt.multi && NET.client)) return null;
  const boss = Math.max(0, (SAVE.stats.bosses || 0) - ((G && G.bossAtStart) || 0));
  const parts = [[`방 ${r.rooms || 0}개`, r.rooms || 0, 1], [`요괴 ${r.kills || 0}마리`, Math.floor((r.kills || 0) / 12), 1], [`보스 ${boss}`, boss, 15]];
  if (r.mode === "story") parts.push([`${r.floor || 1}장 도달`, r.floor || 1, 6]);
  if (r.mode === "endless") parts.push([`무한의 방 ${r.endless || 0}`, Math.floor((r.endless || 0) / 3), 2]);
  if (r.win || r.storyDone) parts.push(["완주", 1, 40]);
  const dRw = ((r.mode === "story" || r.mode === "endless") && G && G.opt && G.opt.diff && DIFF[G.opt.diff] ? DIFF[G.opt.diff].rw : 1) * (typeof isFestival === "function" && isFestival() ? 1.5 : 1); // 주말 축제 ×1.5 // 11-19 높은 난이도 = 혼불 더
  const tb = G && G.opt && Array.isArray(G.opt.taboo) ? G.opt.taboo.length : 0; if (tb) parts.push([`금기 ${tb}개`, 0, 0]);
  const adB = typeof ADS !== "undefined" && ADS.active() ? ADS.soulMul : 1; if (adB > 1) parts.push([`등불 축복 ×${ADS.soulMul}`, 0, 0]); // 11-21 보상형 광고 버프(정식 출시 때)
  let base = Math.round(parts.reduce((a, [, n, w]) => a + n * w, 0) * (dailyRule("soul2") ? 2 : 1) * dRw * (1 + 0.2 * tb) * adB); const bonus = Math.round(base * 0.1 * altarLv("spirit")); const total = base + bonus;
  SAVE.soul = (SAVE.soul || 0) + total; SAVE.soulTotal = (SAVE.soulTotal || 0) + total;
  return { total, bonus, parts: parts.filter(([, n]) => n > 0) };
}
function altarNext() { // 가장 싸게 살 수 있는 다음 강화
  let best = null; for (const a of ALTAR) { const l = altarLv(a.k); if (l >= a.max) continue; const c = a.cost[l]; if (!best || c < best.c) best = { a, c, l }; } return best;
}
// 판 끝 화면: 혼불 + 다음 목표 (Vampire Survivors 처럼 '한 판만 더'가 보이게)
function goalsHtml(r) {
  if (!SAVE) return ""; const e = r.soulInfo; let h = "";
  if (e) h += `<div class="soulbox"><div class="soulgain">🔥 혼불 <b>+${e.total}</b></div><div class="muted soulparts">${e.parts.map(([n, v, w]) => `${n} <b>+${v * w}</b>`).join(" · ")}${e.bonus ? ` · 넋 거두기 +${e.bonus}` : ""}</div></div>`;
  const goals = [];
  const nx = altarNext(); if (nx) goals.push({ ic: nx.a.ic, t: `혼불 제단 · ${nx.a.name} ${nx.l + 1}단계`, cur: SAVE.soul || 0, n: nx.c, go: "altar" });
  const cs = CHARS.filter((c) => !SAVE.chars[c.id] && c.unlock.type !== "gacha" && !c.unlock.secret).map((c) => ({ c, p: unlockProgress(c) })).sort((a, b) => b.p.cur / b.p.n - a.p.cur / a.p.n)[0];
  if (cs) goals.push({ ic: "🔓", t: `새 영웅 ${cs.c.name} (${cs.c.job}) — ${(cs.p.parts || []).join(", ")}`, cur: cs.p.cur, n: cs.p.n, go: "chars" });
  const ms = MISSIONS.filter((m) => !SAVE.missions[m.id] && !m.secret).map((m) => ({ m, f: Math.min(1, statVal(m.stat) / m.n) })).filter((x) => x.f < 1).sort((a, b) => b.f - a.f)[0];
  if (ms) goals.push({ ic: "🎯", t: `임무 · ${ms.m.name}`, cur: Math.min(statVal(ms.m.stat), ms.m.n), n: ms.m.n, go: "missions" });
  if (goals.length) h += `<div class="goals"><h3>다음 목표</h3>${goals.map((g) => `<div class="goal" data-go="${g.go}"><span class="gi">${g.ic}</span><div class="gt">${esc(g.t)}<div class="prog"><i style="width:${Math.min(100, (g.cur / g.n) * 100)}%"></i></div></div><span class="gn">${Math.min(g.cur, g.n)}/${g.n}</span></div>`).join("")}</div>`;
  return h;
}
const soulIc = (px) => `<img src="${imgSrc("ui_soul")}" alt="" style="width:${px}px;height:${px}px;object-fit:contain;vertical-align:-4px">`; // 11-21 혼불 수묵 그림
UI.altar = function () {
  const S = SAVE; S.altar = S.altar || {};
  const card = (a) => { const l = altarLv(a.k), full = l >= a.max, c = full ? 0 : a.cost[l], can = !full && (S.soul || 0) >= c;
    return `<div class="acard ${full ? "full" : ""} ${can ? "can" : ""}"><div class="aic"><img src="${imgSrc("altar_" + a.k)}" alt=""></div><div class="atx"><b>${a.name}</b><div class="pips">${Array.from({ length: a.max }, (_, i) => `<i class="${i < l ? "on" : ""}"></i>`).join("")}</div>
      <p class="muted">${l ? "지금: " + a.desc(l) : "아직 없음"}${full ? "" : `<br>다음: <span style="color:var(--gold2)">${a.desc(l + 1)}</span>`}</p></div>
      <button class="btn ${can ? "gold" : ""}" data-a="${a.k}" ${can ? "" : "disabled"}>${full ? "완성" : `${soulIc(18)} ${c}`}</button></div>`; };
  UI.frame("혼불 제단", `<div class="altarhead"><div class="soulbig"><img src="${imgSrc("ui_soul")}" alt=""></div><div><h2>등불 사당의 제단</h2><p class="muted">쓰러뜨린 요괴의 넋은 혼불이 되어 남아요. 판에서 쓰러져도 혼불은 그대로 — 바쳐서 토벌대 모두를 강하게.</p><p class="soulnow">가진 혼불 <b>${soulIc(22)} ${S.soul || 0}</b> <span class="muted">· 지금까지 모은 혼불 ${S.soulTotal || 0}</span></p></div></div>
    <div class="agrid">${ALTAR.map(card).join("")}</div>${ALTAR.every((x) => altarLv(x.k) >= x.max) ? `<div class="card" style="text-align:center;margin-top:10px"><b>🏮 혼불 공양</b> <span class="muted">제단을 모두 밝혔어요. 남는 혼불 ${OFFER_SOUL}을 바치면 코인 1개</span><br><button class="btn gold" id="offer" ${(S.soul || 0) < OFFER_SOUL ? "disabled" : ""}>공양하기 (🔥 ${OFFER_SOUL} → 코인 1)</button></div>` : ""}<p class="muted" style="text-align:center">제단 강화는 모든 영웅에게 적용돼요 (1대1 대전·함께하기 제외)</p>`, () => UI.menu());
  if ($("#offer")) $("#offer").onclick = () => { if ((S.soul || 0) < OFFER_SOUL) return; S.soul -= OFFER_SOUL; S.coins += 1; track("soul_offer"); saveGame(); sfx("coin"); UI.toast("🏮 혼불 공양 · 코인 +1"); UI.altar(); };
  document.querySelectorAll(".acard button[data-a]").forEach((b) => (b.onclick = () => { const a = ALTAR.find((x) => x.k === b.dataset.a), l = altarLv(a.k); if (l >= a.max || (S.soul || 0) < a.cost[l]) return;
    S.soul -= a.cost[l]; S.altar[a.k] = l + 1; track("altar_buy", { k: a.k, lv: l + 1 }); saveGame(); sfx("level"); UI.toast(`${a.name} ${l + 1}단계 — ${a.desc(l + 1)}`, 2600); UI.altar(); }));
};

// ===================== 11-18 1.7.1 괴이한 방 (선택 이벤트) =====================
// 참고: Slay the Spire '? 방'(위험·보상을 직접 고르는 이야기) → 조선 설화로 재해석. 판마다 다른 선택이 생겨 같은 캐릭터도 매번 다른 판이 됨.
const evGold = (n) => { G.p.gold = Math.max(0, (G.p.gold || 0) + n); };
const evHeal = (f) => healUnit(G.p, G.p.maxHp * f, false);
const evHurt = (f) => { G.p.hp = Math.max(1, G.p.hp - G.p.maxHp * f); G.p.hitT = 0.12; G.shake = Math.max(G.shake, 8); };
const evMod = (m) => { G.p.baseMods.push(m); recalc(G.p); };
const evBoon = () => { const k = rollBoons(1, G.p.lvl)[0]; if (!k) { evGold(80); return "엽전 80"; } takeBoon(G.p, k); return `강화 「${BOONS[k].name}」`; };
const QUIZ = [
  ["정월 대보름에 부스럼을 막으려고 깨무는 것은?", ["부럼", "송편", "떡국"]],
  ["추석에 빚어 먹는 떡은?", ["송편", "시루떡", "인절미"]],
  ["두드리면 원하는 것이 나온다는 도깨비의 물건은?", ["도깨비방망이", "요술 거울", "비단 부채"]],
  ["구미호의 꼬리는 몇 개일까?", ["아홉 개", "일곱 개", "다섯 개"]],
  ["'해와 달이 된 오누이'에서 오누이를 쫓은 짐승은?", ["호랑이", "여우", "곰"]],
  ["견우와 직녀가 오작교에서 만나는 날은?", ["칠월 칠석", "단오", "동지"]],
  ["동짓날 귀신을 쫓으려고 먹는 음식은?", ["팥죽", "미역국", "수정과"]],
  ["마을 어귀에 서서 마을을 지킨다는 나무·돌 기둥은?", ["장승", "석등", "굴뚝"]],
  ["아기가 태어나고 자라는 것을 돌본다는 신은?", ["삼신할미", "조왕신", "용왕"]],
  ["설날 아침에 먹는 음식은?", ["떡국", "냉면", "삼계탕"]],
];
const EVENTS = {
  ssireum: { ic: "👹", name: "도깨비 씨름판", text: "모닥불 가에서 외뿔 도깨비가 씨름 상대를 찾고 있다. \"이기면 내 금은보화를 주지! 지면… 네 기운을 좀 얻어 가겠다!\"",
    ch: [{ t: "씨름 한판!", s: "60% 엽전 +150·강화 하나 / 40% 체력 -25%", run: () => Math.random() < 0.6 ? (evGold(150), "이겼다! 엽전 +150 · " + evBoon()) : (evHurt(0.25), "업어치기를 당했다… 체력 -25%") },
      { t: "메밀묵을 바친다", s: "엽전 -60 → 강화 하나", ok: () => (G.p.gold || 0) >= 60, run: () => (evGold(-60), "도깨비가 껄껄 웃으며 선물을 준다 · " + evBoon()) },
      { t: "조용히 지나간다", s: "아무 일도 없음", run: () => "도깨비가 심심한 듯 하품을 했다." }] },
  foxbead: { ic: "🦊", name: "구미호의 여우 구슬", text: "어둠 속에서 고운 여인이 푸른 구슬을 내민다. \"이 구슬을 머금으면 힘이 솟을 거예요… 대신 조금, 아주 조금만 생기를 주세요.\"",
    ch: [{ t: "구슬을 받는다", s: "이번 판 공격력 +12%, 최대 체력 -10%", run: () => (evMod({ atk: 0.12, hp: -0.1 }), "몸 안에 서늘한 힘이 돈다 · 공격력 +12%") },
      { t: "부적을 꺼내 쫓는다", s: "체력 20% 회복", run: () => (evHeal(0.2), "여인이 꼬리를 감추며 사라졌다 · 체력 20% 회복") }] },
  jangseung: { ic: "🗿", name: "장승의 물음", quiz: true, text: "천하대장군과 지하여장군이 길을 막고 묻는다. \"우리 땅의 이야기를 아는 자만 지나가라.\"" },
  samsin: { ic: "🧶", name: "삼신할미의 실타래", text: "희미한 등불 아래 할머니가 실을 감고 있다. \"먼 길 가는구나. 무엇이 필요하냐?\"",
    ch: [{ t: "기운을 북돋아 주세요", s: "강화 하나 고르기", run: () => (G.levelQueue++, "할머니가 실 한 가닥을 손목에 묶어 준다 · 강화 고르기") },
      { t: "상처를 돌봐 주세요", s: "체력 전부 회복 + 보호막 20%", run: () => (evHeal(1), (G.p.shield = Math.max(G.p.shield, G.p.maxHp * 0.2)), "따뜻한 손길에 상처가 아물었다") }] },
  ledger: { ic: "📕", name: "저승사자의 장부", text: "검은 갓을 쓴 저승사자가 장부를 넘긴다. \"네 이름이 아직 여기 없구나. 원한다면 한 줄 지워 주지… 값은 받겠다.\"",
    ch: [{ t: "이름을 지워 달라", s: "이번 판 쓰러져도 한 번 다시 일어남, 최대 체력 -15%", run: () => (G.p.revive = (G.p.revive || 0) + 1, evMod({ hp: -0.15 }), "장부에서 이름 한 줄이 사라졌다 · 부활 +1") },
      { t: "필요 없다", s: "엽전 +60 (저승사자가 길 값을 놓고 감)", run: () => (evGold(60), "\"배짱이 좋구나.\" 엽전 +60") }] },
  peddler: { ic: "🎒", name: "떠도는 보부상", text: "등짐을 진 보부상이 쉬어 가는 중이다. \"요괴 잡는 데 쓸 만한 물건이 있소. 싸게 드리리다.\"",
    ch: [{ t: "물건을 산다", s: "엽전 -90 → 액티브 기술 하나", ok: () => (G.p.gold || 0) >= 90, run: () => (evGold(-90), G.drops.push({ type: "act", k: rollActive([], 2), x: G.p.x + 80, y: G.p.y }), "희귀 이상의 액티브를 받았다 (바닥에서 줍기)") },
      { t: "약초를 산다", s: "엽전 -40 → 약초 2개", ok: () => (G.p.gold || 0) >= 40, run: () => (evGold(-40), G.drops.push({ type: "herb", x: G.p.x - 60, y: G.p.y + 30 }, { type: "herb", x: G.p.x + 60, y: G.p.y + 30 }), "약초 2개") },
      { t: "길만 묻는다", s: "혼불 +5", run: () => ((SAVE.soul = (SAVE.soul || 0) + 5), "\"이 아래엔 두꺼비가 왕 노릇을 한다오.\" 혼불 +5") }] },
  bowl: { ic: "🥣", name: "정화수 한 그릇", text: "장독대 위에 정화수가 놓여 있다. 누군가 소원을 빌다 떠난 자리다.",
    ch: [{ t: "몸 성히 해 주소서", s: "체력 50% 회복", run: () => (evHeal(0.5), "맑은 물이 피로를 씻어 간다") },
      { t: "재물을 주소서", s: "엽전 +120", run: () => (evGold(120), "물그릇 아래 엽전 꾸러미가 있었다") },
      { t: "요괴를 물리칠 힘을 주소서", s: "이번 판 치명타 +4%", run: () => (evMod({ crit: 0.04 }), "눈빛이 날카로워졌다 · 치명타 +4%") }] },
  mimic: { ic: "📦", name: "들썩이는 궤짝", text: "자물쇠 달린 궤짝이 저 혼자 들썩인다. 안에서 무언가 긁는 소리가 난다…",
    ch: [{ t: "열어 본다", s: "보물 또는 요괴! (요괴면 쓰러뜨린 뒤 큰 보상)", run: () => { if (Math.random() < 0.5) { G.drops.push({ type: "chest", x: G.p.x + 90, y: G.p.y, open: false }, { type: "coin", x: G.p.x - 70, y: G.p.y + 40 }); return "보물이 가득하다! 상자 + 코인"; }
        const mul = diffMul(), pool = theme().enemies; spawnMob(pick(pool), mul, true); spawnMob(pick(pool), mul, true); G.cur.cleared = false; G.cur.evReward = true; return "궤짝에서 정예 요괴가 튀어나왔다! 쓰러뜨리면 보상"; } },
      { t: "부적을 붙여 봉인한다", s: "엽전 +40", run: () => (evGold(40), "궤짝이 조용해졌다 · 엽전 +40") }] },
};
Object.assign(EVENTS, { // 11-18 1.8.1 괴이한 방 6종 추가 (총 14)
  well: { ic: "🪣", name: "달빛 우물", text: "우물 속에 달이 두 개 떠 있다. 하나는 하늘의 달, 하나는… 우물 바닥에서 손짓하는 무언가.",
    ch: [{ t: "두레박을 내린다", s: "50% 체력 전부 회복 / 50% 물귀신이 잡아당겨 체력 -20%", run: () => Math.random() < 0.5 ? (evHeal(1), "맑은 물이 가득 올라왔다 · 체력 전부 회복") : (evHurt(0.2), "차가운 손이 손목을 잡아챘다! 체력 -20%") },
      { t: "동전을 던져 소원을 빈다", s: "엽전 -30 → 이번 판 행운(치명타 +3%)", ok: () => (G.p.gold || 0) >= 30, run: () => (evGold(-30), evMod({ crit: 0.03 }), "퐁당, 소원이 닿았다 · 치명타 +3%") },
      { t: "뚜껑을 덮는다", s: "아무 일도 없음", run: () => "우물 아래 손짓이 멈췄다." }] },
  haetae: { ic: "🦁", name: "해태의 시험", text: "불을 먹는다는 해태가 앞을 막는다. \"정직한 자에게는 복을, 거짓된 자에게는 벌을.\"",
    ch: [{ t: "가진 엽전을 모두 내보인다", s: "엽전이 100 이상이면 두 배로(최대 +200), 아니면 강화 하나", run: () => { const g = G.p.gold || 0; if (g >= 100) { const add = Math.min(200, g); evGold(add); return `해태가 고개를 끄덕인다 · 엽전 +${add}`; } return "가진 것이 적어도 정직하구나 · " + evBoon(); } },
      { t: "조금 숨긴다", s: "30% 엽전 +80 / 70% 엽전 절반 잃음", run: () => Math.random() < 0.3 ? (evGold(80), "해태가 눈치채지 못했다 · 엽전 +80") : (evGold(-Math.floor((G.p.gold || 0) / 2)), "해태의 눈이 번쩍인다! 엽전 절반을 빼앗겼다") }] },
  hwaro: { ic: "🔥", name: "꺼지지 않는 화로", text: "대장간 귀신이 버리고 간 화로에 아직 불씨가 살아 있다. 무기를 달구면 더 날카로워질 것 같다.",
    ch: [{ t: "무기를 달군다", s: "체력 -15% → 이번 판 공격력 +10%", run: () => (evHurt(0.15), evMod({ atk: 0.1 }), "손이 데었지만 칼날이 시뻘겋게 빛난다 · 공격력 +10%") },
      { t: "손을 녹인다", s: "체력 25% 회복", run: () => (evHeal(0.25), "따뜻한 불기운에 몸이 풀렸다") }] },
  kkachi: { ic: "🐦", name: "까치의 보은", text: "날개를 다친 까치가 퍼덕이고 있다. 옛이야기 속 까치는 은혜를 꼭 갚는다고 했다.",
    ch: [{ t: "약초로 날개를 감싸 준다", s: "강화 하나 고르기", run: () => (G.levelQueue++, "까치가 짹짹 울며 날아간다… 머리 위로 반짝이는 깃털이 떨어졌다 · 강화 하나 고르기") },
      { t: "갈 길이 바쁘다", s: "아무 일도 없음", run: () => "까치가 원망스러운 눈으로 쳐다본다." }] },
  gamble: { ic: "🎲", name: "도깨비 윷판", text: "도깨비들이 윷을 던지며 내기를 하고 있다. \"한 판 끼어 볼 텐가? 걸고 싶은 만큼 걸어!\"",
    ch: [{ t: "엽전 50을 건다", s: "윷(4칸)·모(5칸)면 엽전 +150, 도·개·걸이면 잃음", ok: () => (G.p.gold || 0) >= 50, run: () => { const r = Math.random(); evGold(-50); if (r < 0.35) { evGold(200); return r < 0.12 ? "모!! 도깨비들이 비명을 지른다 · 엽전 +150" : "윷! 엽전 +150"; } return ["도… 잃었다", "개… 잃었다", "걸… 아깝게 잃었다"][Math.floor(Math.random() * 3)]; } },
      { t: "구경만 한다", s: "혼불 +3", run: () => ((SAVE.soul = (SAVE.soul || 0) + 3), "도깨비들의 신명에 덩달아 기운이 난다 · 혼불 +3") }] },
  shaman: { ic: "🥁", name: "굿판의 무당", text: "어둠 속에서 굿판이 벌어지고 있다. 무당이 북을 치며 묻는다. \"무슨 액을 막아 줄꼬?\"",
    ch: [{ t: "몸의 액을 막아 주오", s: "이번 판 받는 피해 -6%", run: () => (evMod({ dr: 0.06 }), "부채 바람이 몸을 감싼다 · 받는 피해 -6%") },
      { t: "재물의 액을 막아 주오", s: "이번 판 엽전 획득 +30%", run: () => (evMod({ gold: 0.3 }), "방울 소리가 주머니를 맴돈다 · 엽전 +30%") },
      { t: "앞길의 액을 막아 주오", s: "이번 판 이동 속도 +8%", run: () => (evMod({ spd: 0.08 }), "발걸음이 가벼워졌다 · 이동 속도 +8%") }] },
});
function pickEvent() { const seen = (G.evSeen = G.evSeen || []), ks = Object.keys(EVENTS).filter((k) => !seen.includes(k)); const k = pick(ks.length ? ks : Object.keys(EVENTS)); seen.push(k); return k; }
// 11-20 사용자: "이벤트방 이미지가 기본 이미지라 몰입도가 떨어짐" → 방마다 수묵 장면 그림(ev_<키>), 창도 넓게
const evArt = (k, E) => ASSETS.img["ev_" + k] ? `<div class="evart" style="background-image:url(${imgSrc("ev_" + k)})"></div>` : `<div class="evic">${E.ic}</div>`;
UI.event = function (k) {
  const E = EVENTS[k]; if (!E || !G) return; $("#modal").classList.add("evmode"); track("event_room", { k }); G.paused = true; input.atkHeld = false; input.moveHeld = false; SAVE.stats.events = (SAVE.stats.events || 0) + 1;
  let ch = E.ch;
  if (E.quiz) { const [q, a] = pick(QUIZ), opts = a.map((t, i) => ({ t, i })).sort(() => Math.random() - 0.5);
    E._q = q; ch = opts.map((o) => ({ t: o.t, s: "", run: () => o.i === 0 ? ((SAVE.soul = (SAVE.soul || 0) + 15), evGold(100), "\"옳거니!\" 장승이 길을 비킨다 · 엽전 +100 · 혼불 +15") : (evHurt(0.15), `"틀렸다!" 장승의 호통에 몸이 휘청인다 · 체력 -15% (정답: ${a[0]})`) })); }
  const done = (msg) => { UI.modal(`<div class="evbox">${evArt(k, E)}<h2>${E.name}</h2><p class="evtext">${esc(msg)}</p><div class="center"><button class="btn gold" id="evok">계속</button></div></div>`);
    const arm = UI.arm(); $("#evok").onclick = () => { if (performance.now() < arm) return; UI.closeModal(); if (G) G.paused = false; }; saveGame(); };
  UI.modal(`<div class="evbox">${evArt(k, E)}<h2>${E.name}</h2><p class="evtext">${esc(E.text)}</p>${E.quiz ? `<p class="evq">${esc(E._q)}</p>` : ""}<div class="evch">${ch.map((c, i) => { const ok = !c.ok || c.ok(); return `<button class="btn evc" data-i="${i}" ${ok ? "" : "disabled"}><b>${esc(c.t)}</b>${c.s ? `<span>${esc(c.s)}</span>` : ""}</button>`; }).join("")}</div></div>`);
  const arm = UI.arm();
  document.querySelectorAll(".evc").forEach((b) => (b.onclick = () => { if (performance.now() < arm) return; const c = ch[+b.dataset.i]; if (c.ok && !c.ok()) return; sfx("pick"); done(c.run()); }));
};

// ===================== 11-18 1.7.2 주막 주모 홍매 — 판이 끝날 때마다 반응하는 이야기 =====================
// 참고: Hades(죽을 때마다 집에서 새 대사·이야기가 조금씩 진행) → 미궁 입구 주막의 주모가 내 판을 보고 한마디.
// 순서: ① 한 번뿐인 특별 대사(처음·첫 층 돌파·같은 층에서 자꾸 쓰러짐·캐릭터별…) ② 이어지는 이야기(주모의 사연, 판마다 한 토막) ③ 그때그때 한마디
const TALK_ONCE = [
  { id: "first", p: 100, if: (c) => c.runs === 0, t: "어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고 다시 내려가 봐요." },
  { id: "story_done", p: 99, if: (c) => c.r.storyDone, t: "다섯 장을 다 찾아 묶었다고요…? 세상에. 오늘 주막 술은 전부 내가 낼게요. 반디가 우는 건 처음 봤네." },
  { id: "floor2", p: 95, if: (c) => c.newMax >= 2 && c.prevMax < 2, t: "첫째 장을 되찾았다면서요! 반디가 신나서 주막을 세 바퀴나 돌더라니까. 다음 장은 얼음 동굴이에요. 따뜻하게 입고 가요." },
  { id: "floor3", p: 95, if: (c) => c.newMax >= 3 && c.prevMax < 3, t: "얼음 장군까지 넘었어요? 그 장군, 원래는 이 마을을 지키던 분이었대요. 원한을 풀어 줬으니 이제 편히 쉬시겠지." },
  { id: "floor4", p: 95, if: (c) => c.newMax >= 4 && c.prevMax < 4, t: "불 도깨비 왕을 이겼다고! 대장간 쇠 냄새가 옷에 배었네. 넷째 장 늪은 독 안개가 짙으니 해독 약초를 꼭 챙겨요." },
  { id: "floor5", p: 95, if: (c) => c.newMax >= 5 && c.prevMax < 5, t: "…저승 궁궐까지 갔군요. 거기선 누가 불러도 대답하지 마요. 산 사람이 대답하면 이름이 명부에 적힌대요." },
  { id: "boss_death", p: 80, if: (c) => c.died && c.bossDeath, t: (c) => `${c.killer}한테 당했어요? 큰 놈들은 때리기 전에 바닥이 붉게 물들어요. 그 순간 ${IS_TOUCH ? "구르기 버튼으로" : "Space 로"} 굴러요. 몸이 기억할 때까지.` },
  { id: "stuck3", p: 85, if: (c) => c.died && c.stuck >= 3, t: (c) => `${c.r.floor}층에서만 벌써 ${c.stuck}번째네요. 혼불 제단에 '등불 심지'를 올려 보고, 요괴 속성의 약점(층 이름 아래 적힌 것)에 맞는 영웅으로 가 봐요.` },
  { id: "first_event", p: 70, if: (c) => (SAVE.stats.events || 0) > 0, t: "도깨비 씨름판 봤어요? 그 외뿔 도깨비, 지면 삐져서 사흘은 안 나와요. 장승 물음은… 우리 마을 아이들도 다 아는 거니 틀리면 창피해요." },
  { id: "first_altar", p: 65, if: () => Object.keys(SAVE.altar || {}).length > 0, t: "제단에 혼불 바친 거 봤어요. 등불이 한결 밝아졌네. 그 불빛이 미궁 아래까지 닿는대요." },
  { id: "endless", p: 60, if: (c) => c.r.mode === "endless", t: "무한의 방이라… 끝이 없다던데, 정말 끝까지 가 볼 셈이에요? 갔다 와서 끝이 어땠는지 꼭 얘기해 줘요." },
  { id: "raid", p: 60, if: (c) => c.r.mode === "raid", t: "장 보스들을 줄줄이 상대하다니 배짱 한번 좋네. 다음엔 펫이랑 보물도 잘 맞춰 가요." },
  { id: "many_kills", p: 55, if: (c) => c.r.kills >= 300, t: (c) => `한 판에 요괴 ${c.r.kills}마리라니! 주막 앞 혼불이 반딧불 떼처럼 날아다녀요.` },
];
const TALK_CHAR = {
  musa: "강휘 무사님, 칼날이 또 이가 빠졌네. 대장간 할아범한테 맡겨 둘게요. 내일 아침까지 벼려 놓으래요.",
  archer: "설아 아가씨, 화살 깃이 다 젖었어요. 화롯가에 말려 둘 테니 따뜻한 국 한 그릇 해요.",
  mudang: "만신님 방울 소리가 들리면 주막 개가 꼬리를 흔들어요. 요괴는 도망가고.",
  hwarang: "사다함 화랑님, 옷이 금빛이라 미궁에서 너무 눈에 띄지 않아요? …아, 그게 일부러라고요?",
  eosa: "어사 나리, 마패는 잘 챙기셨죠? 지난번엔 주막에 두고 가서 내가 뛰어갔잖아요.",
  fox: "여우비… 꼬리는 좀 감춰요. 손님들이 놀라서 술값도 안 내고 도망가요.",
  reaper: "저승차사 나리가 우리 편이라니, 세상 참 오래 살고 볼 일이에요. 장부에 내 이름은 없죠? 없는 거죠?",
  haemosu: "해모수님이 오시면 주막이 대낮처럼 밝아져요. 기름값이 굳어서 좋네.",
  eulji: "을지문덕 장군님! 살수에서 이긴 얘기 또 해 주세요. 손님들이 그 얘기만 들으면 술을 더 시켜요.",
  jipsin: "짚신 장군… 허수아비가 걸어 다니는 건 아무리 봐도 안 익숙하네. 비 오는 날엔 처마 밑에 있어요, 젖으면 큰일 나요.",
  monk: "무진 스님은 고기 안 드시죠? 산나물 비빔밥 해 놨어요.",
  gunner: "철매 포수, 화약 냄새 나는 옷은 밖에서 털고 들어와요. 부엌 아궁이에 불붙으면 어쩌려고.",
  geommu: "설화 아씨 칼춤은 언제 봐도 곱네요. 다음 잔칫날엔 주막 마당에서 한 번만 춰 줘요.",
  sorikun: "소리꾼 양반, 한 가락 뽑아 줘요. 요괴 잡은 이야기로요!",
  dolsoe: "돌쇠야, 쇠스랑으로 요괴를 잡았다고? 우리 밭 김도 좀 매 줘라.",
  spear: "도윤 창병님, 창끝이 또 길어진 것 같은데요? 문지방에 걸리니까 비스듬히 들고 들어와요.",
  priest: "연화 아가씨 방울 소리 들으면 마음이 편해져요. 오늘 밤엔 주막 처마에도 한 번 흔들어 줘요.",
  necro: "흑운 양반… 그 원혼 구슬, 주막 안에서는 좀 넣어 두면 안 될까요? 손님들이 자꾸 오싹하대요.",
  assassin: "야명은 언제 들어왔는지도 모르게 앉아 있네. 술값은… 이미 놓고 갔군. 대단하다.",
  dosa: "청운 도사님, 부적 몇 장만 주막 기둥에 붙여 줘요. 요즘 쥐 요괴가 곳간을 넘봐요.",
  yinyang: "백야님은 늘 별을 보며 계산하던데, 오늘 점괘는 어때요? 좋다고만 해 줘요.",
  summoner: "소담 아가씨 소환수들이 부엌에서 누룽지를 다 먹었어요. 다음엔 몫을 따로 떼어 둘게요.",
  berserker: "거칠 양반, 문은 손으로 여는 거예요. 도끼로 말고요. 문짝이 벌써 세 번째예요.",
  moon: "월영 아씨, 달빛 아래 칼춤은 언제 봐도 서늘하게 고와요. 오늘은 보름이라 더 세겠네.",
  thunder: "천뢰 장군님 오시면 하늘이 우르릉해서 장독 뚜껑부터 덮어요. 이제 버릇이 됐어요.",
  haerang: "해랑 수군장님, 바닷바람 냄새가 나네요. 미궁에도 바다가 있나요?",
  danbi: "단비야, 매가 또 주막 닭을 노리더라. 줄 좀 짧게 잡아 줘.",
  cheonrang: "백호신장님… 털이 주막 바닥에 한가득이에요. 그래도 그 덩치에 안기면 겨울이 안 춥겠어요.",
  hwaryeon: "화련 아가씨, 날개 접고 들어와요. 지난번에 처마 끝이 그을렸어요.",
  pojol: "삼식이 포졸 나리, 육모방망이 들고 주막 순찰 도는 건 고맙지만… 손님들이 자꾸 숨어요.",
  yakcho: "초롱아, 네가 준 약초로 끓인 차가 제일 잘 팔려. 이번엔 값을 쳐 줄게.",
  namu: "곰배 아저씨 장작 덕에 겨울 걱정이 없네요. 도끼는… 던지지 말고 패는 데만 써요.",
  bong: "봉냥이, 꼬리 흔들지 말고 앉아. 생선 한 토막 남겨 놨으니까.",
};
const TALK_ARC = [ // 주모 홍매의 사연 — 판마다 한 토막씩 (순서대로)
  "이 주막요? 원래는 미궁 입구를 지키던 등불 사당 자리예요. 등불이 꺼진 날 사당은 무너지고, 나는 그 터에 솥을 걸었죠.",
  "달래 할멈이랑은 오래된 사이예요. 할멈이 요괴록을 지킬 때, 나는 할멈 밥을 지켰거든요.",
  "그믐밤마다 미궁에서 바람 소리가 올라와요. 반디 말로는 찢긴 장들이 서로를 부르는 소리래요.",
  "우리 바깥양반도 토벌꾼이었어요. 등불 하나 들고 미궁에 내려가서… 다섯째 장 어딘가에서 소식이 끊겼죠.",
  "그 양반이 남긴 게 이 등롱이에요. 신기하죠, 기름을 안 넣어도 꺼지질 않아요.",
  "가끔 생각해요. 저승 궁궐 명부에 그 양반 이름이 적혀 있을까, 아직 비어 있을까.",
  "토벌꾼들이 쓰러져 돌아올 때마다 혼불이 조금씩 남아요. 그게 다 그 사람들 용기예요. 그래서 제단에 바치는 거고요.",
  "반디가 그러는데, 요괴록이 다시 묶이면 미궁에 갇힌 넋들도 길을 찾는대요. …그 양반도요.",
  "무영 그 사람, 무뚝뚝해 보여도 토벌꾼들 다 돌아올 때까지 주막 앞에서 안 자요. 모르는 척해 줘요.",
  "요즘 미궁 바람이 달라졌어요. 당신들이 장을 하나씩 되찾을 때마다 조금씩 따뜻해져요.",
  "그거 알아요? 저승사자도 원래는 사람이었대요. 너무 많은 이름을 적다가 자기 이름을 잊었다나.",
  "언젠가 다섯 장이 다 모이면, 나도 등롱 들고 한 번 내려가 볼 거예요. 그 양반 마중하러.",
];
const TALK_ANY = [
  (c) => `${c.r.floor}층 공기는 어땠어요? 다음엔 국밥 든든히 먹고 가요.`,
  () => "요괴 잡는 것도 좋지만 몸이 먼저예요. 약수 우물 보이면 꼭 들러요.",
  () => "괴이한 기운이 떠다니는 방이 있으면 다가가 봐요. 좋은 일인지 나쁜 일인지는… 골라 봐야 알죠.",
  () => "레벨이 오를 때 고르는 강화끼리 짝이 맞으면 '조합'이 열려요. 반디가 그걸 제일 좋아해요.",
  (c) => `오늘은 요괴 ${c.r.kills}마리. 혼불 냄새가 아직 옷에 남아 있네요.`,
  () => "보스가 숨을 고를 때가 기회예요. 붉은 바닥이 사라지는 순간 몰아쳐요.",
  () => "주막 단골들이 그러는데, 미궁은 들어갈 때마다 길이 바뀐대요. 그래서 질리지가 않는다나.",
  () => "오늘의 토벌령 확인했어요? 지정 요괴를 잡으면 코인을 꽤 주던데.",
  () => "공격이 닿기 직전에 구르면 시간이 멈춘 것처럼 느려진대요. 무영이 그걸 '완벽 회피'라고 부르더라고요.",
  () => "시련의 방 시계는 생각보다 빨리 가요. 문 열자마자 가장 센 기술부터!",
  () => "상점 앞에 놓인 종을 울리면 보부상이 다른 물건을 꺼낸대요. 엽전이 넉넉할 때 해 봐요.",
  (c) => `${c.r.kills}마리라… 그 정도면 내일 아침 장터에서 이야기꽃이 피겠어요.`,
  () => "오늘의 괴담은 날마다 영웅이 바뀌어요. 아직 못 만난 영웅도 써 볼 수 있으니 꼭 해 봐요.",
  () => "혼불 제단 '넷째 부적'은 비싸도 값을 해요. 강화를 넷 중에 고르면 판이 확 달라지거든요.",
];
function talkPick(r) {
  if (!SAVE || !G || !["story", "endless", "raid"].includes(r.mode)) return null;
  const T = (SAVE.talk = SAVE.talk || { seen: {}, arc: 0, runs: 0, fd: {} });
  const died = !r.win && !r.storyDone; if (died && r.mode === "story") T.fd[r.floor] = (T.fd[r.floor] || 0) + 1;
  const c = { r, died, runs: T.runs, prevMax: G.maxAtStart || 1, newMax: SAVE.story.maxFloor || 1, bossDeath: died && G.cur && G.cur.type === "boss", killer: G.lastHit || "보스", stuck: (T.fd[r.floor] || 0) };
  T.runs++;
  let line = null, reward = 0;
  const once = TALK_ONCE.filter((x) => !T.seen[x.id] && x.if(c)).sort((a, b) => b.p - a.p)[0];
  if (once) { T.seen[once.id] = 1; line = typeof once.t === "function" ? once.t(c) : once.t; reward = 3; if (once.id === "stuck3") delete T.seen.stuck3; } // 막힌 층 도움말은 막힐 때마다 다시
  else if (TALK_CHAR[G.p.id] && !T.seen["c_" + G.p.id]) { T.seen["c_" + G.p.id] = 1; line = TALK_CHAR[G.p.id]; reward = 3; }
  else if (T.arc < TALK_ARC.length && T.runs % 2 === 0) { line = TALK_ARC[T.arc++]; reward = 5; }
  else line = pick(TALK_ANY)(c);
  if (reward) SAVE.soul = (SAVE.soul || 0) + reward;
  return { line, reward, arc: T.arc, arcN: TALK_ARC.length };
}
function talkHtml(t) {
  if (!t) return "";
  return `<div class="talk"><img src="${imgSrc("npc_jumo")}" alt=""><div class="tb"><b>주모 홍매</b>${t.reward ? `<span class="tr">이야기 값 · 혼불 +${t.reward}</span>` : ""}<p class="tw" data-full="${esc(t.line)}"></p></div></div>`;
}
function talkType() { const p = document.querySelector(".talk .tw"); if (!p) return; const s = p.dataset.full; let i = 0; const tm = setInterval(() => { i += 2; p.textContent = s.slice(0, i); if (i >= s.length) clearInterval(tm); }, 28); p.onclick = () => { clearInterval(tm); p.textContent = s; }; }

// ===================== 11-18 1.7.1 오늘의 괴담 (매일 바뀌는 도전) =====================
// 참고: Slay the Spire 'Daily Climb'·Dead Cells 'Daily Run'(모두 같은 조건, 하루 한 번 보상) + Archero 체험 → 조선식:
// 날마다 다른 '괴담' 규칙 2개 + 오늘의 영웅(아직 없는 영웅도 체험) 으로 1층을 돌파. 같은 날엔 모두 같은 미궁(같은 씨앗).
const DAILY_GOOD = [
  { k: "market", n: "도깨비 장날", d: "상점 값 절반 · 엽전 +50%", shop: 0.5, m: { gold: 0.5 } },
  { k: "bless", n: "삼신의 축복", d: "강화 3개를 들고 시작", boons: 3 },
  { k: "glass", n: "유리 칼날", d: "공격력 +50% · 최대 체력 -35%", m: { atk: 0.5, hp: -0.35 } },
  { k: "wind", n: "바람 걸음", d: "이동 속도 +25% · 재사용 -15%", m: { spd: 0.25, cdr: 0.15 } },
  { k: "harvest", n: "혼불 풍년", d: "얻는 혼불 2배", soul2: 1 },
  { k: "luck", n: "길일", d: "치명타 +15%", m: { crit: 0.15 } },
];
const DAILY_BAD = [
  { k: "bloodmoon", n: "핏빛 보름달", d: "요괴 체력 -25% · 공격력 +45%", hp: 0.75, dmg: 1.45 },
  { k: "giants", n: "거인의 밤", d: "정예 요괴 3배", elite: 3 },
  { k: "fog", n: "짙은 안개", d: "요괴 체력 +40%", hp: 1.4, dmg: 1 },
  { k: "frail", n: "약해진 몸", d: "받는 피해 +20%", m: { dr: -0.2 } },
  { k: "swarm", n: "요괴 떼", d: "요괴 공격력 +25%", hp: 1, dmg: 1.25 },
];
const dayKey = (d = new Date()) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
function mulberry(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function dailyInfo() {
  const key = dayKey(), R = mulberry(key * 2654435761), pool = CHARS.filter((c) => !c.unlock.secret && !c.forms && (typeof isReleased !== "function" || isReleased(c.id)));
  const ch = pool[Math.floor(R() * pool.length)], g = DAILY_GOOD[Math.floor(R() * DAILY_GOOD.length)], b = DAILY_BAD[Math.floor(R() * DAILY_BAD.length)];
  return { key, seed: Math.floor(R() * 1e9), char: ch.id, rules: [g, b] };
}
function dailyRule(f) { const D = G && G.opt && G.opt.daily; if (!D) return null; for (const r of D.rules) if (r[f] != null) return r[f]; return null; }
function dailyCard() {
  if (!SAVE || !((SAVE.stats.rooms || 0) >= 5 || ACCOUNT === DEV_ID)) return "";
  const D = dailyInfo(), c = CHAR[D.char], rec = (SAVE.daily2 || {})[D.key];
  return `<div class="dailyc" id="dailyb" role="button" tabindex="0"><div class="dimg" style="background-image:url(${imgSrc("card_" + charArt(c.id))})"></div><div class="dtx"><b>오늘의 괴담</b><span>오늘의 영웅 <em>${c.name} · ${c.job}</em>${SAVE.chars[c.id] ? "" : " (체험)"}</span>
    <span class="drules">${D.rules.map((r, i) => `<i class="${i ? "bad" : "good"}">${r.n} — ${r.d}</i>`).join("")}</span></div><div class="dsc">${rec ? `오늘 최고<br><b>${rec.best}</b>점` : "오늘 첫 도전<br><b>보상 ×2</b>"}</div></div>`;
}
function dailyStart() { const D = dailyInfo(); track("daily_start", { char: D.char }); UI.startRun({ mode: "story", char: D.char, floor: 1, diff: "normal", daily: D }); }
function dailyEnd(r) { // endRun 에서: 점수·보상
  const D = G && G.opt && G.opt.daily; if (!D) return null;
  const score = (r.stage - 1) * 100 + (r.win ? 600 : 0) + r.kills * 2 + (r.lvl || 1) * 10;
  SAVE.daily2 = SAVE.daily2 || {}; const rec = SAVE.daily2[D.key] || { best: 0, tries: 0 }, first = rec.tries === 0, best = score > rec.best;
  rec.tries++; if (best) rec.best = score; SAVE.daily2[D.key] = rec;
  for (const k in SAVE.daily2) if (+k < D.key - 100) delete SAVE.daily2[k];
  let coin = 0; if (first) { coin = 2 + Math.min(6, Math.floor(score / 250)); SAVE.coins += coin; SAVE.soul = (SAVE.soul || 0) + 20; }
  SAVE.stats.dailyRuns = (SAVE.stats.dailyRuns || 0) + 1;
  return { score, best: rec.best, newBest: best && !first, first, coin };
}
function dailyHtml(d) { if (!d) return ""; return `<div class="dres">🌙 오늘의 괴담 점수 <b>${d.score}</b>${d.newBest ? " · 🎉 오늘 최고 기록!" : ` · 오늘 최고 ${d.best}`}${d.first ? `<br><span class="muted">오늘 첫 도전 보상: 코인 +${d.coin} · 혼불 +20 (내일 새 괴담이 열려요)</span>` : ""}</div>`; }

// ===================== 11-18 1.7.2 요괴록 도감 이야기 (Hades 도감처럼 잡을수록 열림) =====================
// 1번: 설화 한 줄 · 3번: 공략(패턴 대처) · 10번: 토벌 완료 도장 + 혼불 10 (한 번)
const LORE = {
  b_boss: "그믐밤 요괴록을 찢은 장본인. 깨진 갓 아래 얼굴은 아무도 본 적이 없고, 방망이로 땅을 치면 그림자가 사람 수만큼 갈라진다.",
  b_boss3: "북방을 지키다 눈보라 속에 얼어 죽은 장군. 아무도 기억해 주지 않은 원한이 갑옷째 얼어붙어 다시 일어섰다.",
  b_boss2: "대장간 화로에 버려진 불씨들이 모여 귀신이 되었다. 쇠가 녹는 냄새를 좋아하고, 화가 나면 하늘에서 불덩이를 부른다.",
  b_boss4: "늪을 통째로 삼키고 왕이 된 두꺼비. 넷째 장을 배 속에 넣고 독 안개로 늪을 덮었다. 혀가 몸길이의 세 배라는 소문이 있다.",
  b_boss5: "저승 명부를 들고 다니는 염라의 사자. 산 사람의 이름을 부르면 넋이 대답하고 끌려간다고 한다. 마지막 장을 명부 사이에 끼워 두었다.",
  b_boss6: "석굴 입구를 천 년 동안 지킨 돌 수문장. 누가 지키라고 했는지는 잊었지만 지키는 일만은 잊지 않았다.",
  f_gumiho: "천 년을 살아 꼬리 아홉을 얻은 여우. 사람의 간 백 개를 먹으면 사람이 된다는 말을 아직도 믿고 있다.",
  f_imugi: "용이 되지 못한 큰 구렁이. 여의주를 얻지 못한 원망으로 얼음 골짜기에 똬리를 틀었다.",
  f_bulgasari: "쇠붙이를 먹고 자라는 짐승. 바늘 하나로 시작해 성문 쇠빗장까지 삼켰다는 옛이야기가 있다. 불로도 죽지 않는다 하여 '불가살이'.",
  m_jangsan: "흰 털이 긴 산짐승. 사람 목소리를 흉내 내어 '이리 와' 하고 부른다. 대답하면 안 된다.",
  m_eodum: "어둠이 뭉쳐 생긴 요괴. 쳐다볼수록 커지고, 고개를 숙이면 작아진다는 어둑시니.",
  m_gangcheol: "지나가는 곳마다 가뭄이 든다는 쇠 기운의 용. 강철이가 지나간 들판엔 풀 한 포기 남지 않는다.",
  m_mulgwi: "물에 빠져 죽은 넋. 혼자 가기 외로워 물가 사람의 발목을 잡아끈다.",
  m_geuseun: "밤길 사람 뒤를 소리 없이 따라오는 그슨대. 돌아보면 사라지고, 다시 걸으면 한 걸음 더 가까이 있다.",
  m_dueok: "사람 머리를 짓누르는 커다란 귀신. 밤에 가위눌리는 건 두억시니가 앉아서라고 한다.",
  m_oedari: "다리가 하나뿐인 도깨비. 씨름을 좋아해서, 왼쪽으로 넘기면 쉽게 이긴다는 비법이 전해진다.",
  m_bakjwi: "석굴 박쥐들이 우두머리를 따라 요괴가 되었다. 피 냄새를 맡으면 떼로 몰려든다.",
  m_duduji: "땅속 길을 다 안다는 두더지 장군. 석굴이 무너지지 않는 건 이 장군이 굴을 받쳐서라고도 한다.",
  m_gaeksa: "객지에서 죽어 고향에 돌아가지 못한 넋. 길 가는 사람에게 붙어 함께 가려 한다.",
  m_dokbul: "비 오는 밤 들판에 떠다니는 푸른 불. 따라가면 길을 잃는다.",
  m_seokjang: "마을을 지키던 돌장승이 요괴의 기운을 먹고 움직이기 시작했다. 본래는 착한 수호신이었다.",
  m_dongjang: "겨울을 몰고 오는 동장군. 입김 한 번에 강물이 얼고, 성질이 나면 우박을 뿌린다.",
  m_seolgwi: "눈보라 속에서 길을 잃은 사람이 된 귀신. 하얀 옷 때문에 눈 속에서 보이지 않는다.",
  m_baekgom: "북쪽 산신을 모시던 흰 곰. 얼음 동굴에 갇혀 신장(神將)이 되었다.",
  m_bingho: "얼음 구슬을 품은 여우. 구미호의 먼 친척이라 자랑하지만 꼬리는 하나다.",
  m_seorirang: "서리 늑대 무리의 우두머리. 달이 뜨면 무리를 불러 사냥한다.",
  m_goderum: "고드름을 화살 삼아 쏘는 궁수 귀신. 살아서 명궁이었으나 얼음 골짜기에서 길을 잃었다.",
  m_nunjangi: "눈사람에 깃든 장난꾸러기 도깨비. 뚝딱 소리와 함께 눈덩이를 굴려 온다.",
  m_seorihak: "학 천 마리가 얼어붙어 하나가 된 요괴. 날갯짓마다 눈보라가 인다.",
  m_jowang: "부엌을 지키는 조왕신이 대장간 불에 노해 성난 신이 되었다. 화로를 함부로 다루는 자를 용서하지 않는다.",
  m_bulgae: "해와 달을 삼키려다 뜨거워 뱉었다는 불개. 일식·월식이 불개 짓이라는 옛말이 있다.",
  m_soedok: "대장간 쇠붙이에 깃든 도깨비. 망치질 소리에 맞춰 춤추듯 싸운다.",
  m_hwacha: "불타는 수레를 끄는 귀신. 죄 많은 넋을 실어 나른다는 화차.",
  m_bulyeowoo: "불을 머금은 여우. 꼬리를 흔들면 도깨비불이 튄다.",
  m_yongamdu: "용암 속에서 사는 두꺼비. 늪 두꺼비 왕의 사촌이라는데, 서로 사이가 나쁘다.",
  m_daejang: "칼을 다 벼리지 못하고 죽은 대장장이의 원귀. 아직도 모루 앞을 떠나지 못한다.",
  m_hwajo: "불꽃 깃털의 새. 지나간 하늘에 붉은 줄이 남는다.",
  m_jine: "사람 키보다 긴 왕지네. 닭이 천적이라 닭 울음소리를 싫어한다.",
  m_geomi: "늪가 오두막에 사는 거미 여인. 길 잃은 나그네를 묵어 가라 붙잡는다.",
  m_guryeong: "곳간을 지키던 업구렁이가 늪으로 쫓겨나 사나워졌다.",
  m_dalgyal: "얼굴에 눈·코·입이 없는 달걀귀신. 원한이 너무 깊어 얼굴마저 지워졌다.",
  m_beoseot: "독 안개를 먹고 자란 버섯 요괴. 포자를 뿜어 늪을 넓힌다.",
  m_geomeori: "늪의 피를 빨아 몸집이 커진 거머리 요괴.",
  m_dokdu: "두꺼비 왕의 오른팔 장군. 등의 혹마다 독이 가득하다.",
  m_mangryang: "물과 숲의 정령 망량. 사람 흉내를 내어 길을 묻고는 엉뚱한 길을 알려 준다.",
  m_gangrim: "저승차사 가운데 으뜸이라는 강림도령. 염라대왕도 함부로 못 한다는 담력의 차사.",
  m_umama: "소 머리와 말 얼굴의 저승 옥졸. 둘이 늘 함께 다닌다.",
  m_pangwan: "망자의 죄를 저울질하는 저승 판관. 붓 한 획에 지옥과 극락이 갈린다.",
  m_haechi: "옳고 그름을 가린다는 상상의 짐승 해치. 저승 문을 지키며 거짓말쟁이를 들이받는다.",
  m_wongwi: "억울하게 죽은 장수의 원귀. 아직 끝나지 않은 싸움을 계속하고 있다.",
  m_songaksi: "혼례를 못 치르고 죽은 손각시. 신부 옷차림 그대로 저승을 떠돈다.",
  m_mongdal: "장가를 못 가고 죽은 총각 귀신 몽달귀신. 짝을 찾아 헤맨다.",
  m_cheonyeo: "긴 머리를 풀어 헤친 처녀귀신. 한을 풀어 줄 사람을 기다린다.",
  m_jeoseungsae: "저승 소식을 이승에 전한다는 까마귀. 지붕 위에서 울면 누군가 떠난다고 했다.",
  m_munjigi: "저승 맨 바깥 문을 지키는 거인. 산 사람의 발소리는 천 리 밖에서도 듣는다.",
  slime: "벼루에 엎질러진 먹물이 요괴록의 기운을 먹고 굴러다닌다.", bat: "피 냄새를 따라 날아드는 박쥐 떼.", skel: "석굴에 묻힌 옛 병사의 뼈가 활을 들었다.",
  brute: "돌무더기에 깃든 도깨비. 몸통 박치기를 좋아한다.", wisp: "들판의 도깨비불이 주술을 배웠다.", clone: "그림자 도깨비 왕의 그림자에서 떨어져 나온 자객.",
  kkoma: "키는 작아도 심술은 큰 꼬마 도깨비.", kkokdu: "상여를 장식하던 꼭두 인형이 혼자 걸어 다닌다.", jongi: "찢긴 요괴록 종이가 바람을 타고 귀신이 되었다.",
  jangseung: "마을 어귀 장승이 요괴 기운에 홀려 돌진한다.", dukkeobi: "늪의 독을 품은 두꺼비.", gaksi: "각시탈을 쓴 원귀. 탈 속 얼굴은 아무도 모른다.",
  sotdae: "솟대 위에 앉아 있던 나무 새가 까마귀 요괴가 되었다.", neoguri: "사람으로 둔갑하는 너구리. 순식간에 자리를 바꾼다.",
};
const PAT_TIP = {
  combo: "연속 베기 — 세 번째 휘두름이 가장 셉니다. 두 번 맞은 뒤 뒤로 구르세요.", club: "방망이 내려찍기 — 붉은 원이 사라지기 직전에 옆으로 피하세요.",
  clones: "분신 — 진짜는 그림자가 진한 쪽. 범위 공격으로 한꺼번에 지우세요.", ddukddak: "뚝딱 — 방망이를 들면 주변에 충격파. 멀리 떨어지세요.",
  snipe: "저격 — 붉은 선이 그어진 뒤 쏩니다. 선 방향과 수직으로 움직이세요.", icespear: "얼음창 — 일직선으로 날아옵니다. 대각선으로 다가가세요.",
  icecage: "얼음 감옥 — 발밑 원에 갇히면 움직일 수 없어요. 원이 생기면 바로 벗어나세요.", glacier: "빙하 — 바닥을 따라 얼음이 뻗어 나옵니다. 벽 쪽으로 피하세요.",
  blizzard: "눈보라 — 방 전체가 느려집니다. 보스 가까이 붙어 짧게 몰아치세요.", flamewave: "불길 파도 — 부채꼴로 퍼집니다. 보스 뒤쪽이 안전해요.",
  meteor: "불덩이 비 — 떨어질 자리에 그림자. 그림자가 진해지면 이미 늦어요, 미리 움직이세요.", firewall: "불벽 — 길을 막습니다. 벽이 사라질 때까지 원거리 공격.",
  eruption: "분출 — 발밑이 붉어지면 곧 터집니다. 제자리에 서 있지 마세요.", hops: "뛰어오르기 — 착지 지점에 그림자. 착지 직후가 반격 기회.",
  tongue: "혀 낚아채기 — 일직선으로 끌어당겨요. 정면에 서지 마세요.", spit: "독 뱉기 — 바닥에 독 웅덩이가 남아요. 웅덩이 밖에서 싸우세요.",
  leap: "큰 도약 — 화면이 흔들리며 착지. 착지 지점 둘레가 위험합니다.", summon: "졸개 부르기 — 졸개부터 정리해야 보스에게 집중할 수 있어요.",
  soulhunt: "넋 사냥 — 따라오는 혼령. 구르기로 떼어 내세요.", chains: "사슬 — 묶이면 끌려갑니다. 사슬이 날아올 때 옆으로.",
  soulspiral: "혼령 소용돌이 — 돌며 퍼지는 탄막. 빈틈을 따라 바깥으로 도세요.", judgment: "심판 — 넓은 범위를 표시한 뒤 내리칩니다. 표시 밖으로.",
  slam: "내려치기 — 큰 충격. 보스 정면 근접은 피하세요.", fissure: "땅 가르기 — 일직선 균열. 균열 방향과 비껴서세요.",
  guard: "방어 자세 — 이때 공격하면 피해가 크게 줄어요. 기술을 아껴 두세요.", quake: "지진 — 방 전체 흔들림 뒤 바위가 떨어져요. 계속 움직이세요.",
  rockfall: "낙석 — 그림자를 보고 피하세요.", foxfire: "여우불 — 휘어 날아옵니다. 마지막 순간에 구르세요.",
  magma: "용암 — 바닥에 오래 남습니다. 싸울 자리를 미리 넓게 잡으세요.", frostnova: "서리 폭발 — 보스 둘레가 얼어붙어요. 터지기 전에 거리를 두세요.",
  scythe: "낫 휘두르기 — 넓은 원을 그립니다. 원 안쪽 깊숙이 붙으면 오히려 안전.",
};
const AI_TIP = { chase: "쫓아와 붙습니다. 뒤로 물러나며 치세요.", weave: "지그재그로 날아와요. 범위 공격이 잘 맞아요.", ranged: "멀리서 쏩니다. 먼저 잡으세요.", charger: "돌진 전에 멈칫해요. 옆으로 피한 뒤 반격.", caster: "발밑에 주술을 겁니다. 계속 움직이세요.", blinker: "순간이동합니다. 나타난 자리를 바로 치세요." };
UI.loreOpen = function (k, isMob) {
  const d = isMob ? ENEMIES[k] : BOSSES[k], n = isMob ? ((SAVE.mk || {})[k] || 0) : ((SAVE.kb || {})[k] || 0); if (!d || !n) return;
  const im = isMob ? d.img : (ASSETS.img[k] ? k : d.art), tips = isMob ? [AI_TIP[d.ai]].filter(Boolean) : (d.pats || []).map((p) => PAT_TIP[p]).filter(Boolean);
  SAVE.loreRw = SAVE.loreRw || {};
  let rw = ""; if (n >= 10 && !SAVE.loreRw[k]) { SAVE.loreRw[k] = 1; SAVE.soul = (SAVE.soul || 0) + 10; saveGame(); rw = `<p class="lrw">🏮 토벌 완료 도장! 혼불 +10</p>`; }
  UI.modal(`<div class="lorebox"><img src="${imgSrc(im)}" alt=""><div><h2>${d.name}</h2><p class="muted">토벌 ${n}번 ${n >= 10 ? '<span class="lst">토벌 완료</span>' : `· 10번이면 토벌 완료 도장`}${!isMob && SAVE.bt && SAVE.bt[k] ? ` · 최고 기록 <b style="color:#ffd84a">${SAVE.bt[k]}초</b>` : ""}</p>
    <h3>📜 설화</h3><p>${esc(LORE[k] || "아직 알려진 이야기가 없다.")}</p>
    <h3>⚔️ 토벌 요령 ${n >= 3 ? "" : `<span class="muted">(${n}/3 — 세 번 잡으면 열려요)</span>`}</h3>${n >= 3 ? `<ul>${tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : `<p class="muted">???</p>`}${rw}
    <div class="center"><button class="btn gold" id="lok">닫기</button></div></div></div>`);
  $("#lok").onclick = () => UI.closeModal();
};

// ===================== 11-18 1.7.2 연격 표시 (Devil May Cry·Hades 식 손맛 피드백) =====================
const COMBO_RANK = [[100, "천하무쌍", "#ff4d6d"], [60, "신들린 칼", "#ff7a3d"], [35, "일당백", "#ffb547"], [20, "거침없이", "#ffd84a"], [10, "좋아!", "#e8dcc4"]];
function comboHud() {
  let el = document.getElementById("combo"); if (!el) { el = document.createElement("div"); el.id = "combo"; el.innerHTML = '<b></b><span></span><i></i>'; (document.getElementById("hud") || document.body).appendChild(el); }
  const n = G && G.comboT > 0 ? G.combo || 0 : 0;
  if (n < 5) { if (el.className !== "") el.className = ""; return; }
  if (n >= 10 && !(SAVE.tips || {}).combo) UI.tip("combo");
  const rk = COMBO_RANK.find(([k]) => n >= k), b = el.firstChild, s = b.nextSibling, bar = s.nextSibling;
  if (b.textContent !== String(n)) b.textContent = n; const lab = rk ? rk[1] : "연격"; if (s.textContent !== lab) s.textContent = lab;
  el.style.setProperty("--cc", rk ? rk[2] : "#e8dcc4"); bar.style.width = Math.max(0, (G.comboT / 2.4) * 100) + "%";
  el.className = "on" + ((G.comboPop || 0) > 0 ? " pop" : "");
}

// ===================== 11-18 1.7.3 시련의 방 시계 · 캐릭터 숙련도 =====================
// 시련: Hades '혼돈의 문'·Dead Cells '시간 문' → 제한 시간 정리. 숙련도: Hades 무기 숙련·Apex 캐릭터 레벨 → 한 영웅을 오래 쓸수록 그 영웅만 조금씩 강해지고 표식이 바뀜.
function trialHud() {
  let el = document.getElementById("trialt"); const T = G && G.trial;
  if (!T || !G.cur || G.cur !== T.room || T.room.cleared) { if (el) el.className = ""; return; }
  if (!el) { el = document.createElement("div"); el.id = "trialt"; (document.getElementById("hud") || document.body).appendChild(el); }
  const s = Math.max(0, Math.ceil(T.t)); el.textContent = T.fail ? "시련 실패" : `⏳ 시련 ${s}초`; el.className = "on" + (T.fail ? " fail" : s <= 5 ? " hurry" : "");
}
const MAST_XP = [0, 40, 100, 190, 310, 470, 680, 950, 1300, 1750];
const MAST_TIER = [[10, "옥", "#7fe0c8"], [7, "금", "#ffd84a"], [4, "은", "#cfd6e6"], [1, "동", "#d08a5a"]];
const mastLv = (cid) => { const x = ((SAVE && SAVE.mast) || {})[cid] || 0; let l = 1; for (let i = 0; i < MAST_XP.length; i++) if (x >= MAST_XP[i]) l = i + 1; return l; };
function mastMods(cid) { const l = mastLv(cid) - 1; return l ? [{ atk: 0.01 * l, hp: 0.01 * l }] : []; } // 11-19 파워 인플레 완화 1.2→1%
function mastGain(r) {
  if (!SAVE || !G || !G.p || !["story", "endless", "raid"].includes(r.mode) || (G.opt && G.opt.multi)) return null;
  const cid = G.p.id, before = mastLv(cid), boss = Math.max(0, (SAVE.stats.bosses || 0) - ((G && G.bossAtStart) || 0));
  const xp = (r.rooms || 0) + Math.floor((r.kills || 0) / 10) + boss * 10 + (r.win || r.storyDone ? 30 : 0);
  SAVE.mast = SAVE.mast || {}; SAVE.mast[cid] = (SAVE.mast[cid] || 0) + xp; const after = mastLv(cid);
  return { cid, xp, before, after, cur: SAVE.mast[cid], next: MAST_XP[after] || null };
}
function mastBadge(cid) { const l = mastLv(cid); if (l < 2) return ""; const t = MAST_TIER.find(([k]) => l >= k); return `<span class="mb" style="--mc:${t[2]}">${t[1]} ${l}</span>`; }
function mastHtml(m) { if (!m) return ""; const c = CHAR[m.cid]; return `<div class="mres">${c.name} 숙련 <b>Lv.${m.after}</b> ${m.after > m.before ? `<span class="up">↑ 올랐어요! 공격력·체력 +${m.after - 1}%</span>` : ""} <span class="muted">+${m.xp} 경험${m.next ? ` · 다음까지 ${m.next - m.cur}` : " · 최고 단계"}</span></div>`; }

// ===================== 11-18 1.7.5 이번 판 빌드 보기 · 토벌 기록 =====================
function buildHtml() {
  if (!G || !G.p) return ""; const p = G.p, cnt = {};
  for (const k of p.boons) cnt[k] = (cnt[k] || 0) + 1;
  const bs = Object.keys(cnt).map((k) => { const b = BOONS[k]; return b ? `<span class="bchip" style="border-color:${RARITY[b.rar].col}" title="${esc(b.desc || "")}">${b.ic || ""} ${b.name}${cnt[k] > 1 ? " Lv." + cnt[k] : ""}</span>` : ""; }).join("");
  const st = `공격력 ${Math.round(atkOf(p))} · 치명타 ${Math.round(p.crit * 100)}% · 받는 피해 ${(p.drBase || 0) >= 0 ? "-" : "+"}${Math.abs(Math.round((p.drBase || 0) * 100))}% · 이동 ${Math.round(spdOf(p))}${p.revive ? ` · 부활 ${p.revive}` : ""}`;
  return `<div class="card buildc"><h3>📜 이번 판 강화 <span class="muted">${p.boons.length}개 · Lv.${p.lvl}</span></h3><p class="muted">${st}</p><div class="bchips">${bs || '<span class="muted">아직 없음</span>'}</div></div>`;
}
// ===================== 11-20 주간 순위표 (무한의 방 이번 주 최고 방) =====================
// 참고: Slay the Spire·Dead Cells 일일/주간 순위, 모바일 히트작 주간 랭킹. Firestore weekly/<주>/rows/<uid>. 규칙이 아직 없으면 '준비 중'.
const weekKey = (d = new Date()) => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7); return y + "w" + String(w).padStart(2, "0"); };
const BOARD = {
  url(wk) { return `https://firestore.googleapis.com/v1/projects/${CLOUD.proj}/databases/(default)/documents/weekly/${wk}`; },
  async put(score, ch) {
    if (!CLOUD.on || !CLOUD.uid || !ACCOUNT || ACCOUNT === DEV_ID) return;
    const wk = weekKey(); SAVE.wkBest = SAVE.wkBest || {}; if ((SAVE.wkBest[wk] || 0) >= score) return; SAVE.wkBest[wk] = score; for (const k in SAVE.wkBest) if (k !== wk) delete SAVE.wkBest[k];
    try { await fetch(this.url(wk) + "/rows/" + CLOUD.uid, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: "Bearer " + (await CLOUD.token()) }, body: JSON.stringify({ fields: { nick: { stringValue: nick().slice(0, 12) }, score: { integerValue: String(score) }, ch: { stringValue: ch || "" }, t: { integerValue: String(Date.now()) } } }) }); } catch (e) { }
  },
  async top(n = 50) {
    const wk = weekKey(), r = await fetch(this.url(wk) + ":runQuery", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + (await CLOUD.token()) }, body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "rows" }], orderBy: [{ field: { fieldPath: "score" }, direction: "DESCENDING" }], limit: n } }) });
    if (!r.ok) throw new Error(r.status); const j = await r.json();
    return j.filter((x) => x.document).map((x) => { const f = x.document.fields; return { me: x.document.name.endsWith("/" + CLOUD.uid), nick: f.nick.stringValue, score: +f.score.integerValue, ch: f.ch && f.ch.stringValue }; });
  },
};
UI.board = async function () {
  const wk = weekKey(), mine = (SAVE.wkBest || {})[wk] || 0;
  const show = (inner) => UI.frame("주간 순위표", `<div class="card board" style="max-width:640px;margin:0 auto"><p class="muted">무한의 방 · 이번 주 가장 깊이 내려간 방 · 월요일마다 새로 · ${mine ? `내 기록 <b>${mine}</b>번째 방` : "내 기록 아직 없음"}</p>${inner}</div>`, () => UI.history());
  show('<p class="muted">불러오는 중…</p>');
  if (!CLOUD.on) { show('<p>순위표는 로그인(계정 연동)해야 볼 수 있어요.</p>'); return; }
  try { const L = await BOARD.top(50); if (UI._frameTitle !== "주간 순위표") return;
    show(L.length ? `<ol class="brd">${L.map((x, i) => `<li class="${x.me ? "me" : ""}"><span class="rk">${i + 1}</span><span class="nm">${esc(x.nick)}</span><span class="cc">${CHAR[x.ch] ? esc(CHAR[x.ch].name) : ""}</span><b>${x.score}</b></li>`).join("")}</ol>` : '<p>이번 주 첫 기록을 남겨 보세요!</p>');
  } catch (e) { if (UI._frameTitle === "주간 순위표") show('<p>순위표를 준비하고 있어요. 곧 열려요.</p>'); }
};
function histAdd(r) {
  if (r && r.mode === "endless" && typeof BOARD !== "undefined" && !(G && G.opt && (G.opt.multi || G.opt.daily)) && (r.endless || 0) > 0) BOARD.put(r.endless, G && G.p && G.p.id);
  if (!SAVE || !G || !G.p || !["story", "endless", "raid", "duel"].includes(r.mode)) return;
  SAVE.hist = SAVE.hist || []; const d = new Date();
  SAVE.hist.unshift({ t: `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`, c: G.p.id, m: r.mode, dy: !!(G.opt && G.opt.daily), w: !!(r.win || r.storyDone), f: r.floor, s: r.stage, e: r.endless, k: r.kills, l: r.lvl, so: r.soulInfo ? r.soulInfo.total : 0, cb: r.comboMax || 0, sec: Math.round(G.time || 0) });
  SAVE.hist = SAVE.hist.slice(0, 30);
}
UI.history = function () {
  const H = SAVE.hist || [], MN = { story: "스토리", endless: "무한의 방", raid: "보스 레이드", duel: "1대1 대전" };
  const best = (f) => H.reduce((a, x) => Math.max(a, f(x) || 0), 0);
  const rows = H.map((x) => `<tr><td>${x.t}</td><td>${CHAR[x.c] ? CHAR[x.c].name : x.c}</td><td>${x.dy ? "🌙 괴담" : MN[x.m] || x.m}</td><td>${x.m === "endless" ? x.e + "번째 방" : x.m === "story" ? `${x.f}장 ${x.s}` : "-"}</td><td>${x.w ? "✅" : "💀"}</td><td>${x.k}</td><td>Lv.${x.l}</td><td>${x.cb || "-"}</td><td>${x.so ? "🔥" + x.so : "-"}</td><td>${Math.floor(x.sec / 60)}분</td></tr>`).join("");
  UI.frame("📜 토벌 기록", `<div class="card" style="max-width:980px;margin:0 auto"><p><button class="btn sm gold" id="toBoard">주간 순위표 (무한의 방)</button></p><p class="muted">최근 ${H.length}판 · 가장 많이 잡은 판 ${best((x) => x.k)}마리 · 최고 연격 ${Math.max(best((x) => x.cb), SAVE.stats.maxCombo || 0)} · 최고 무한의 방 ${SAVE.stats.endlessBest || 0}</p>
    ${H.length ? `<div style="overflow-x:auto"><table class="ptab"><tr><th>때</th><th>영웅</th><th>모드</th><th>도달</th><th>결과</th><th>처치</th><th>레벨</th><th>연격</th><th>혼불</th><th>시간</th></tr>${rows}</table></div>` : '<p class="muted">아직 기록이 없어요. 첫 토벌을 떠나 보세요!</p>'}</div>`, () => UI.menu());
};

// 순위표 버튼은 기록 화면에서
document.addEventListener("click", (e) => { if (e.target && e.target.id === "toBoard") UI.board(); });
// ===================== 11-18 1.7.7 이야기 다시 보기 · 조합 힌트 =====================
function storyOrder() { const o = ["open"]; for (let f = 1; f <= 5; f++) o.push(String(f), `f${f}_s3`, `f${f}_mid`, `f${f}_s7`, `f${f}_boss`, `f${f}_clear`); o.push("end"); return o.filter((k) => STORY[k]); }
function storyOpen(k) { const S = SAVE.story || {}, mf = S.maxFloor || 1, seen = S.seen || {};
  if (k === "open") return !!seen.open; if (/^\d$/.test(k)) return mf >= +k; if (k === "end") return (SAVE.stats.storyClear || 0) > 0;
  const m = k.match(/^f(\d)_(s3|mid|s7|boss|clear)$/); if (!m) return false; if (m[2] === "clear") return mf > +m[1] || (SAVE.stats.storyClear || 0) > 0; return !!seen[k] || mf > +m[1]; }
UI.storyBook = function () {
  const ks = storyOrder(), open = ks.filter(storyOpen).length;
  UI.frame("📜 이야기 다시 보기", `<p class="muted" style="text-align:center">찢긴 요괴록 이야기 ${open}/${ks.length} · 장면을 누르면 음성과 함께 다시 봐요</p><div class="sbook">${ks.map((k) => { const s = STORY[k], ok = storyOpen(k);
    return `<div class="sbi ${ok ? "" : "off"}" ${ok ? `data-sk="${k}"` : ""}><div class="sbp" style="background-image:url(${ok ? imgSrc(s.img) : ""})"></div><b>${ok ? s.title : "??? — 아직 가 보지 못한 이야기"}</b></div>`; }).join("")}</div>`, () => UI.bestiary());
  document.querySelectorAll(".sbi[data-sk]").forEach((b) => (b.onclick = () => UI.story(b.dataset.sk, () => {})));
};
function duoHint(k) {
  if (!G || !G.p) return ""; const have = (x) => G.p.boons.includes(x);
  const d = Object.keys(BOONS).find((dk) => { const D = BOONS[dk]; return D.duo && D.req && D.req.includes(k) && !have(dk) && D.req.every((q) => q === k || have(q)); });
  return d ? `<p class="duoh">🔗 고르면 조합 「${BOONS[d].name}」이 열려요</p>` : "";
}

// ===================== 11-18 1.7.9 기록 카드 (공유용 이미지) =====================
function shareCard(r) {
  const W = 1200, H = 630, c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
  const art = IMG["card_" + charArt(G.p.id)] || IMG["spr_" + G.p.art], bg = IMG.ui_menu_bg || IMG.cg_open, logo = IMG.ui_logo;
  g.fillStyle = "#120c10"; g.fillRect(0, 0, W, H);
  if (bg && bg.naturalWidth) { g.globalAlpha = 0.35; g.drawImage(bg, 0, 0, W, H); g.globalAlpha = 1; }
  const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "rgba(10,6,10,0.2)"); gr.addColorStop(0.45, "rgba(10,6,10,0.85)"); gr.addColorStop(1, "rgba(10,6,10,0.95)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (art && art.naturalWidth) { const s = Math.min(560 / art.naturalHeight, 460 / art.naturalWidth); g.drawImage(art, 40, H - art.naturalHeight * s - 20, art.naturalWidth * s, art.naturalHeight * s); }
  if (logo && logo.naturalWidth) { const s = 260 / logo.naturalWidth; g.drawImage(logo, W - 300, 24, 260, logo.naturalHeight * s); }
  g.strokeStyle = "#b8864b"; g.lineWidth = 3; g.strokeRect(12, 12, W - 24, H - 24);
  g.textAlign = "left"; g.fillStyle = "#ffd27a"; g.font = '700 46px "Do Hyeon"'; const c0 = CHAR[G.p.id];
  g.fillText(`${c0.name} · ${c0.job}`, 520, 210);
  const res = r.mode === "story" ? `스토리 ${r.floor}장 ${r.stage}스테이지 ${r.storyDone ? "완주!" : r.win ? "돌파" : "도달"}` : r.mode === "endless" ? `무한의 방 ${r.endless}번째 방` : `보스 레이드 ${G.raidN || 0}마리`;
  g.fillStyle = "#fff"; g.font = '700 34px "Do Hyeon"'; g.fillText(res, 520, 262);
  const rows = [["처치", r.kills], ["레벨", "Lv." + r.lvl], ["최대 연격", r.comboMax || 0], ["혼불", "+" + ((r.soulInfo && r.soulInfo.total) || 0)]];
  rows.forEach(([k, v], i) => { const x = 520 + (i % 2) * 300, y = 330 + Math.floor(i / 2) * 90; g.fillStyle = "rgba(255,200,120,0.08)"; g.fillRect(x, y - 44, 280, 70); g.fillStyle = "#c9b9a0"; g.font = '24px "Gowun Dodum"'; g.fillText(k, x + 16, y - 12); g.fillStyle = "#ffe08a"; g.font = '700 34px "Do Hyeon"'; g.fillText(String(v), x + 16, y + 20); });
  g.fillStyle = "#a89a88"; g.font = '22px "Gowun Dodum"'; g.fillText(`${new Date().toLocaleDateString("ko-KR")} · 요괴록: 조선 요괴 토벌기 · ${nick()}`, 520, 560);
  c.toBlob((blob) => { if (!blob) return; const f = new File([blob], "요괴록_기록.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: "요괴록 토벌 기록" }).catch(() => {});
    else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "요괴록_기록.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); UI.toast("📸 기록 카드를 저장했어요"); } }, "image/png");
}

// ===================== 11-18 1.8.4 토벌 시즌 (무료 시즌 패스) · 복귀 선물 · 미션 달성 알림 =====================
// 참고: Fortnite·원신 등 시즌 패스(달마다 새 목표) + 모바일 복귀 보상 → 조선식 '토벌 시즌'. 지금은 무료 길만, 출시 때 유료 길을 붙일 자리.
const SEASON_TIER = 20, SEASON_XP = 60;
const seasonKey = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); };
function seasonRw(i) { // i = 1..20
  if (i === 20) { const sh = typeof seasonHero === "function" ? seasonHero() : null; return sh ? { coin: 30, soul: 100, hero: sh, t: `시즌 영웅 ${CHAR[sh].name} · 코인 30 · 혼불 100` } : { coin: 30, soul: 100, t: "코인 30 · 혼불 100 · 시즌 완주!" }; } // 11-19 시즌 영웅 (출시 후 유료 줄로 옮길 자리)
  if (i % 5 === 0) return { coin: 8, soul: 40, t: "코인 8 · 혼불 40" };
  if (i % 2 === 0) return { soul: 25, t: "혼불 25" };
  if (i % 3 === 0) return { shard: 6, t: "가진 영웅 조각 6" };
  return { coin: 3, t: "코인 3" };
}
function seasonState() { const k = seasonKey(); if (!SAVE.season || SAVE.season.key !== k) SAVE.season = { key: k, xp: 0, claimed: {} }; return SAVE.season; }
function seasonGain(r) {
  if (!SAVE || !["story", "endless", "raid"].includes(r.mode) || (G && G.opt && G.opt.multi && NET.client)) return null;
  const S = seasonState(), before = Math.min(SEASON_TIER, Math.floor(S.xp / SEASON_XP));
  const xp = Math.min(120, (r.rooms || 0) * 2 + Math.floor((r.kills || 0) / 8) + (r.win || r.storyDone ? 20 : 0) + (G && G.opt && G.opt.daily ? 15 : 0));
  S.xp += xp; const after = Math.min(SEASON_TIER, Math.floor(S.xp / SEASON_XP));
  return { xp, before, after };
}
const seasonUnclaimed = () => { if (!SAVE) return 0; const S = seasonState(), lv = Math.min(SEASON_TIER, Math.floor(S.xp / SEASON_XP)); let n = 0; for (let i = 1; i <= lv; i++) if (!S.claimed[i]) n++; return n; };
function seasonHtml(s) { if (!s || !s.xp) return ""; return `<div class="sres">🏮 토벌 시즌 경험 +${s.xp}${s.after > s.before ? ` · <b>${s.after}단계 달성!</b> 보상을 받으세요` : ""}</div>`; }
UI.season = function () {
  const S = seasonState(), lv = Math.min(SEASON_TIER, Math.floor(S.xp / SEASON_XP)), cur = S.xp % SEASON_XP, d = new Date(), end = new Date(d.getFullYear(), d.getMonth() + 1, 1), left = Math.ceil((end - d) / 864e5);
  const cells = Array.from({ length: SEASON_TIER }, (_, i) => { const n = i + 1, R = seasonRw(n), got = S.claimed[n], can = n <= lv && !got;
    return `<div class="stier ${got ? "got" : can ? "can" : n <= lv ? "" : "lock"} ${n % 5 === 0 ? "big" : ""}" ${can ? `data-n="${n}"` : ""}><b>${n}</b><div class="sic">${[R.hero ? "card_" + charArt(R.hero) : "", R.coin ? "cur_coin" : "", R.soul ? "ui_soul" : "", R.shard ? "ic_s_shard" : ""].filter((k) => k && imgSrc(k)).map((k) => `<img src="${imgSrc(k)}" alt="">`).join("")}</div><span>${R.t}</span>${got ? "<i>✔ 받음</i>" : can ? "<i>받기</i>" : ""}</div>`; }).join("");
  UI.frame("🏮 토벌 시즌", `<div class="shead"><div><h2>${d.getMonth() + 1}월 토벌 시즌</h2><p class="muted">판을 할 때마다 경험이 쌓여요 (방·처치·완주·오늘의 괴담). 시즌은 ${left}일 뒤 새로 시작해요.</p></div>
    <div class="slv"><b>${lv}</b>/${SEASON_TIER}단계<div class="prog"><i style="width:${lv >= SEASON_TIER ? 100 : (cur / SEASON_XP) * 100}%"></i></div><span class="muted">${lv >= SEASON_TIER ? "완주!" : `다음 단계까지 ${SEASON_XP - cur}`}</span></div></div>
    <div class="strack">${cells}</div><p class="muted" style="text-align:center">${seasonUnclaimed() ? `<button class="btn gold" id="sall">모두 받기 (${seasonUnclaimed()})</button>` : ""}</p>`, () => UI.menu());
  const claim = (n) => { const R = seasonRw(n); S.claimed[n] = 1; if (R.coin) SAVE.coins += R.coin; if (R.soul) { SAVE.soul = (SAVE.soul || 0) + R.soul; SAVE.soulTotal = (SAVE.soulTotal || 0) + R.soul; }
    if (R.hero && CHAR[R.hero]) { if (SAVE.chars[R.hero]) { SAVE.shards = SAVE.shards || {}; SAVE.shards[R.hero] = (SAVE.shards[R.hero] || 0) + 20; } else SAVE.chars[R.hero] = 1; }
    if (R.shard) { const own = Object.keys(SAVE.chars), id = pick(own); SAVE.shards = SAVE.shards || {}; SAVE.shards[id] = (SAVE.shards[id] || 0) + R.shard; } };
  document.querySelectorAll(".stier[data-n]").forEach((c) => (c.onclick = () => { claim(+c.dataset.n); saveGame(); sfx("coin"); UI.toast(`🏮 ${c.dataset.n}단계 보상 · ${seasonRw(+c.dataset.n).t}`); UI.season(); }));
  if ($("#sall")) $("#sall").onclick = () => { for (let i = 1; i <= lv; i++) if (!S.claimed[i]) claim(i); saveGame(); sfx("level"); UI.toast("🏮 시즌 보상을 모두 받았어요"); UI.season(); };
};
function comebackGift() { // 3일 넘게 쉬다 오면 선물 (daily() 앞에서)
  const now = Date.now(), last = SAVE.lastSeen || 0; SAVE.lastSeen = now;
  if (last && now - last > 3 * 864e5) { const days = Math.floor((now - last) / 864e5); SAVE.coins += 10; SAVE.soul = (SAVE.soul || 0) + 50; saveGame();
    setTimeout(() => UI.toast(`🏮 ${days}일 만이네요, 토벌꾼 양반! 주막 선물 — 코인 10 · 혼불 50`, 6000), 1200); }
}
function missionPing() { // 판 도중 임무 달성 알림 (한 번씩)
  if (!SAVE) return; if (!SAVE.mping) { SAVE.mping = {}; for (const m of MISSIONS) if (missionDone(m)) SAVE.mping[m.id] = 1; return; } // 처음엔 이미 된 것은 조용히
  for (const m of MISSIONS) if (!SAVE.mping[m.id] && !SAVE.missions[m.id] && missionDone(m)) { SAVE.mping[m.id] = 1; UI.toast(`🎯 임무 달성! ${m.secret ? "숨은 업적" : m.name} — 처음 화면 임무에서 받기`, 3500); }
}

// 11-19 파워 인플레 대응: 영웅이 충분히 강해지면 높은 난이도를 추천 (Hades '열기' 재해석 — 강해질수록 스스로 어렵게, 보상은 더)
function powerScore(cid) {
  const enh = (SAVE.enh || {})[cid] || 0, ml = typeof mastLv === "function" ? mastLv(cid) - 1 : 0, al = (k) => (typeof altarLv === "function" ? altarLv(k) : 0);
  return (1 + 0.04 * enh) * (1 + 0.01 * ml) * (1 + 0.03 * al("edge")) * Math.sqrt((1 + 0.04 * al("wick")) / (1 - 0.02 * al("armor")));
}
function recDiff(cid, keys) { const p = powerScore(cid), k = p >= 1.75 && keys.includes("hell") ? "hell" : p >= 1.35 && keys.includes("hard") ? "hard" : null;
  return k ? `<br><span style="font-size:.8rem;color:${DIFF[k].col}">⚔️ 이 영웅은 충분히 강해요 — 추천 난이도 <b>${DIFF[k].name}</b> (혼불·엽전 ×${DIFF[k].rw})</span>` : ""; }

// ===================== 11-19 출시 준비: 순차 공개 · 주간 픽업 =====================
function seasonNo() { if (!LAUNCH) return 0; const a = new Date(LAUNCH + "T00:00:00"), b = new Date(); return (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1; }
function seasonHero() { const n = seasonNo(); return n >= 1 && n <= SEASON_CHARS.length ? SEASON_CHARS[n - 1] : null; } // 이번 달 시즌 패스 영웅
function isReleased(id) { // LAUNCH 가 없으면 모두 공개
  if (!LAUNCH) return true; const si = SEASON_CHARS.indexOf(id); if (si >= 0) return seasonNo() > si + 1; // 시즌 영웅: 자기 시즌 다음 달부터 뽑기에
  if (LAUNCH_FIRST.includes(id)) return true; const i = LAUNCH_LATER.indexOf(id); if (i < 0) return true; // 11-21 첫날 10명, 나머지는 LAUNCH_LATER 순서로
  const days = (Date.now() - new Date(LAUNCH + "T00:00:00").getTime()) / 864e5; return days >= 0 && Math.floor(days / RELEASE_STEP_DAYS) * RELEASE_PER_STEP >= i + 1;
}
function releaseDay(id) { const i = LAUNCH_LATER.indexOf(id); if (!LAUNCH || i < 0) return null; const step = Math.ceil((i + 1) / RELEASE_PER_STEP); const d = new Date(new Date(LAUNCH + "T00:00:00").getTime() + step * RELEASE_STEP_DAYS * 864e5); return `${d.getMonth() + 1}월 ${d.getDate()}일`; }
function pickupHero() { // 주마다 바뀌는 픽업 (공개된 뽑기 영웅 중, 주 번호로 돌림)
  const hs = CHARS.filter((c) => c.unlock.type === "gacha" && isReleased(c.id)); if (!hs.length) return null;
  const wk = Math.floor((Date.now() / 864e5 + 3) / 7); return hs[wk % hs.length].id;
}
function pickupHtml() {
  const id = pickupHero(); if (!id) return ""; const c = CHAR[id], g = CHAR_GRADE[id], d = new Date(), left = 7 - ((Math.floor(Date.now() / 864e5) + 3) % 7);
  return `<div class="pickup"><div class="pimg" style="background-image:url(${imgSrc("card_" + charArt(id))})"></div><div><b>⭐ 이번 주 길한 영웅 · ${c.name} (${c.job})</b><span>${g}급 영웅이 나오면 <b>${Math.round(PICKUP_SHARE * 100)}%</b> 확률로 ${c.name} · ${left}일 뒤 바뀜</span></div></div>`;
}

// ===================== 11-19 2.0 주막 창고(쉬는 동안 쌓이는 혼불) · 주말 혼불 축제 =====================
// 참고: 탕탕특공대 '순찰 보상'·방치형 게임 오프라인 보상 — 매일 들어올 이유. 최대 12시간이라 하루 두 번 들르면 손해 없음.
const STORE_CAP_H = 12;
function storeRate() { return 2 + 0.6 * Math.min(5, SAVE.story.maxFloor || 1) + 0.4 * (typeof altarLv === "function" ? altarLv("spirit") : 0); } // 11-19 쉬는 동안 받는 몫이 한 판 수입을 넘지 않게 (최대 15.5 → 7) // 시간당 혼불
function storeState() { const now = Date.now(); if (!SAVE.storeT) SAVE.storeT = now; const h = Math.min(STORE_CAP_H, (now - SAVE.storeT) / 36e5); return { h, soul: Math.floor(h * storeRate()), full: h >= STORE_CAP_H }; }
function storeCard() {
  if (!SAVE || !((SAVE.stats.rooms || 0) >= 5 || ACCOUNT === DEV_ID)) return "";
  const s = storeState(), pct = Math.round((s.h / STORE_CAP_H) * 100);
  return `<div class="storec" id="storeb" role="button" tabindex="0"><img src="${imgSrc("ui_store_jar")}" alt=""><div class="stx"><b>주막 창고</b><span>쉬는 동안에도 혼불이 쌓여요 · 시간당 ${storeRate().toFixed(1)}</span><div class="prog"><i style="width:${pct}%"></i></div></div><div class="sgo">${s.soul > 0 ? `🔥 ${s.soul}<br><small>${s.full ? "가득 참!" : "받기"}</small>` : "<small>쌓이는 중</small>"}</div></div>`;
}
function storeClaim() { const s = storeState(); if (s.soul <= 0) { UI.toast("아직 쌓인 혼불이 없어요 — 조금 뒤에 다시 와요"); return; } SAVE.soul = (SAVE.soul || 0) + s.soul; SAVE.soulTotal = (SAVE.soulTotal || 0) + s.soul; SAVE.storeT = Date.now(); saveGame(); sfx("coin"); track("store_claim", { soul: s.soul, h: Math.round(s.h) }); UI.toast(`🏮 주막 창고에서 혼불 ${s.soul}을 받았어요`); UI.menu(); }
const isFestival = () => { const d = new Date().getDay(); return d === 0 || d === 6; }; // 토·일
function festivalBanner() { return isFestival() ? `<div class="fest"><b>주말 혼불 축제</b> · 오늘은 판에서 얻는 혼불 <b>1.5배</b>!</div>` : ""; }

try { const m = location.hash.match(/autotest[^#]*&ff=(\d)/); if (m) window._ff = Math.min(6, +m[1]); } catch (e) { } // 시험 봇 빨리 감기
const PLAY_URL = ""; // 11-19 플레이스토어에 올라가면 여기에 주소(https://play.google.com/store/apps/details?id=com.yogoerok.game) → 휴대폰 브라우저의 '앱 받기'가 스토어로
// ===================== 11-19 보부상 상점 창 (보부상에게 다가가면 열림) =====================
const SHOP_LINES = ["어서 오시오, 토벌꾼 양반! 등짐 풀어 놓을 테니 천천히 보시구려.", "미궁 장사는 목숨 걸고 하는 거라, 값은 좀 쳐 주시오.", "이 약초는 저 아랫마을 심마니한테서 떼 온 거요.", "엽전만 있으면 요괴 잡을 물건은 다 있소이다.", "다 별로요? 등짐 깊숙한 데서 다른 걸 꺼내 드리리다."];
UI.shop = function (r) {
  if (!G || !G.p || !r || !r.stock) return;
  const p = G.p; G.paused = true; input.atkHeld = false; input.moveHeld = false;
  const info = (d) => {
    if (d.what === "act") { const A = ACTIVES[d.k], T = ACT_TIER[A.rar]; const tl = /^ac_([a-z]+)_/.exec(d.k); return { lore: A.lore, ic: tl && ASSETS.img["obj_tal_" + tl[1]] ? "obj_tal_" + tl[1] : "obj_" + d.k, em: A.ic || "✨", n: A.name, t: `액티브 · ${T.name}`, c: T.col, ds: A.desc }; }
    if (d.what === "boon") { const B = BOONS[d.k], R = RARITY[B.rar]; return { lore: B.lore, ic: "bn_" + d.k, em: B.ic, n: B.name, t: `강화 · ${R.name}`, c: R.col, ds: B.desc }; }
    if (d.what === "herb") return { ic: "obj_herb", em: "🌿", n: "회복 약초", t: "소모품", c: "#7fe08a", ds: "체력 40% 회복" };
    const I = SHOP_ITEMS[d.k]; return { lore: I.lore, ic: "obj_shop_" + d.k, em: I.ic || "📦", n: I.name, t: d.k === "coin" ? "코인" : "장비 · 이번 원정 동안", c: d.k === "coin" ? "#ffd27a" : "#9fd0ff", ds: I.desc };
  };
  const rePrice = () => Math.round((40 + (r.reN || 0) * 35) * (1 + (G.mode === "endless" ? (G.endlessN || 0) / 12 : (G.floor || 1) - 1) * 0.45)); // 11-20 장이 깊을수록 다시 진열도 비싸게(엽전이 수천 개 남던 것)
  let sel = -1;
  const more = (d) => {
    if (d.what === "act") { const A = ACTIVES[d.k]; return [`재사용 대기 ${A.cd}초`, "사면 발밑에 놓여요 · 주우면 지금 액티브(F)와 바뀌어요"]; }
    if (d.what === "boon") { const n = (p.boons || []).filter((x) => x === d.k).length; return [n ? `지금 Lv.${n} → Lv.${n + 1}` : "새로 얻는 강화", "이번 원정 동안 계속 적용"]; }
    if (d.what === "herb") return ["사면 바로 먹어요"];
    if (d.k === "coin") return ["뽑기·영웅에 쓰는 코인 1개 (판이 끝나도 남아요)"];
    return ["이번 원정 동안 계속 적용"];
  };
  const det = (gold) => { if (sel < 0 || !r.stock[sel]) return ""; const d = r.stock[sel], f = info(d), ok = !d.sold && gold >= d.price;
    return `<div class="shopdet" style="--sc:${f.c}"><button class="shopdx" id="shdx" aria-label="닫기">✕</button><div class="sdic">${imgSrc(f.ic) ? `<img src="${imgSrc(f.ic)}" alt="">` : `<span>${f.em}</span>`}</div>
      <div class="sdtx"><small>${f.t}</small><h3>${esc(f.n)}</h3>${f.lore ? `<p class="lore">${esc(f.lore)}</p>` : ""}<p>${esc(f.ds)}</p>${more(d).map((x) => `<p class="muted">${esc(x)}</p>`).join("")}</div>
      <button class="btn ${ok ? "gold" : ""}" id="shdb" ${ok ? "" : "disabled"}>${d.sold ? "팔림" : gold >= d.price ? `엽전 ${d.price} · 사기` : `엽전 ${d.price} · 모자라요`}</button></div>`; };
  const close = () => { window.removeEventListener("keydown", kh); UI.closeModal(); G.paused = false; };
  const kh = (e) => { if (e.code === "Escape") { e.preventDefault(); if (sel >= 0) { sel = -1; draw(curLine); } else close(); } };
  let curLine = "";
  const draw = (line) => {
    const gold = p.gold || 0; curLine = line;
    $("#modal").classList.add("shopmode");
    UI.modal(`<div class="shopw"><div class="shophd"><img class="shopnpc" src="${imgSrc("npc_bobusang")}" alt=""><div class="shopsay"><b>보부상</b><p>${esc(line)}</p></div><div class="shopgold"><small>내 엽전</small><b>${gold}</b></div></div>
      <div class="shopgrid">${r.stock.map((d, i) => { const f = info(d), ok = !d.sold && gold >= d.price; return `<div class="shopit${d.sold ? " sold" : ""}${i === sel ? " on" : ""}" data-i="${i}" style="--sc:${f.c}"><div class="sic">${imgSrc(f.ic) ? `<img src="${imgSrc(f.ic)}" alt="">` : `<span>${f.em}</span>`}</div><div class="stx"><small>${f.t}</small><b>${esc(f.n)}</b><p>${esc(f.ds)}</p></div>${d.sold ? "" : `<button class="shlk${d.lock ? " on" : ""}" data-lk="${i}" title="찜하면 다시 진열해도 남아요">${d.lock ? "찜함" : "찜"}</button>`}<button class="btn ${ok ? "gold" : ""}" data-b="${i}" ${ok ? "" : "disabled"}>${d.sold ? "팔림" : `엽전 ${d.price}`}</button></div>`; }).join("")}</div>${det(gold)}
      <div class="center shopft"><button class="btn" id="shre" ${gold >= rePrice() ? "" : "disabled"}>🔔 다시 진열 · 엽전 ${rePrice()}</button><button class="btn gold" id="shx">${IS_TOUCH ? "나가기" : "나가기 (Esc)"}</button></div></div>`);
    const arm = UI.arm ? UI.arm() : 0;
    const buy = (i) => { if (performance.now() < arm) return; const d = r.stock[i]; if (!d || d.sold || (p.gold || 0) < d.price) return; shopBuy(p, d); draw(d.what === "act" ? "발밑에 내려놨소. 주워 가시오!" : pick(["좋은 물건 고르셨소!", "눈썰미가 있구려.", "그거 하나면 저 아래서도 버틸 거요."])); };
    document.querySelectorAll("[data-b]").forEach((b) => (b.onclick = (ev) => { ev.stopPropagation(); buy(+b.dataset.b); }));
    document.querySelectorAll("[data-lk]").forEach((b) => (b.onclick = (ev) => { ev.stopPropagation(); const d = r.stock[+b.dataset.lk]; d.lock = !d.lock; draw(line); }));
    document.querySelectorAll(".shopit[data-i]").forEach((c) => (c.onclick = () => { const i = +c.dataset.i; sel = sel === i ? -1 : i; draw(line); }));
    if ($("#shdx")) $("#shdx").onclick = () => { sel = -1; draw(line); };
    { const sd = document.querySelector(".shopdet"); if (sd) requestAnimationFrame(() => sd.scrollIntoView({ block: "nearest" })); } // 11-20 2.7.15: 낮은 폰 화면에서 설명 칸이 아래 버튼줄 밑에 깔림 → 보이게 굴림
    if ($("#shdb")) $("#shdb").onclick = () => buy(sel);
    $("#shre").onclick = () => { if (performance.now() < arm) return; const c = rePrice(); if ((p.gold || 0) < c) return; p.gold -= c; r.reN = (r.reN || 0) + 1; { const keep = r.stock.filter((d) => d.lock && !d.sold), fresh = makeStock(); r.stock = keep.concat(fresh.slice(0, Math.max(0, fresh.length - keep.length))); } sfx("coin"); draw(SHOP_LINES[4]); };
    $("#shx").onclick = close;
  };
  window.addEventListener("keydown", kh);
  track("shop_open", { floor: G.floor });
  draw(pick(SHOP_LINES.slice(0, 4)));
};

// 11-19 2.1 새 콘텐츠 그림(수묵·민화풍)을 CSS 변수로: 메인 카드·제단·시즌·기록 화면 배경
function setArtVars() { for (const k of ["daily", "store", "festival", "bounty", "season", "altar", "history"]) if (ASSETS.img["ui_c_" + k]) document.documentElement.style.setProperty("--art-" + k, `url(${ASSETS.img["ui_c_" + k]})`); }
// ===================== 11-19 2.2 이야기 장면 전체 화면 (비주얼 노벨식) =====================
// 사용자: "스토리칸이 전체 화면으로", "더빙 퀄". 화면 가득 그림 + 아래 대사창(이름·얼굴) + 한 글자씩 + 줄마다 음성(인물별 한국어 목소리, voice/s2_<장면>_<줄>.mp3).
// 누르기·Space·Enter = 다음(글자 나오는 중이면 한 번에), 자동 넘김, 지난 대사, 건너뛰기(Esc).
UI.vn = function (key, then) {
  const s = STORY[key], L = s.lines, old = $("#vn"); if (old) old.remove();
  const heroId = (G && G.p && G.p.id) || SAVE.sel || "musa", heroName = CHAR[heroId] ? CHAR[heroId].name : "토벌꾼";
  const sxImg = (k) => { const v = k && k + "_" + heroSex(); return v && ASSETS.img[v] ? v : k; }; // 11-20 주인공이 나오는 장면은 고른 영웅 성별 그림
  const bg = imgSrc(sxImg(s.img)) || imgSrc(s.imgOld) || imgSrc("st2_open") || imgSrc("sc_open");
  { const fm = /^st2_f(\d)_/.exec(s.img || ""); if (fm && !imgSrc(sxImg(s.img)) && typeof needPack === "function" && ASSETS.packs && ASSETS.packs["f" + fm[1]]) needPack("f" + fm[1], (k) => k.startsWith("st2_")).then(() => { const b = document.querySelector("#vn .vnbg"); if (b && imgSrc(sxImg(s.img))) b.style.backgroundImage = `url(${imgSrc(sxImg(s.img))})`; }); } // 11-19 지도에서 다시 볼 때 그 층 그림 묶음을 받아 바꿔 끼움
  const chap = /^\d$/.test(key) ? "이야기 시작" : key === "open" ? "서장" : key === "end" ? "종장" : /^f(\d)/.test(key) ? `${key[1]}장` : "";
  const el = document.createElement("div"); el.id = "vn"; el.innerHTML = `<div class="vnbg" style="background-image:url(${bg})"></div><div class="vnvig"></div>
    <div class="vntitle"><small>${chap}</small><b>${esc(s.title)}</b></div>
    <div class="vnctl"><button id="vnauto">자동</button><button id="vnlogb">지난 대사</button><button id="vnskip">건너뛰기</button></div>
    <div class="vnbox"><div class="vnface"></div><div class="vnmain"><div class="vnname"></div><p class="vntext"></p></div><span class="vnnext"></span></div><div class="vnlog" hidden></div>`;
  document.body.appendChild(el); requestAnimationFrame(() => el.classList.add("on"));
  let i = -1, typing = null, vh = null, auto = !!(SAVE.settings && SAVE.settings.vnAuto), shown = 0, full = "", t0 = 0, closed = false, autoT = null;
  const faceOf = (w) => w === "나" ? imgSrc("card_" + charArt(heroId)) : STORY_FACE[w] ? imgSrc(STORY_FACE[w]) : "";
  const stopV = () => { if (vh) { vh.stop(); vh = null; } clearTimeout(autoT); };
  const finish = () => { if (closed) return; closed = true; stopV(); cancelAnimationFrame(typing); window.removeEventListener("keydown", kh); el.classList.remove("on"); setTimeout(() => el.remove(), 380); if (SAVE.settings) SAVE.settings.vnAuto = auto; then(); };
  const scheduleAuto = () => { clearTimeout(autoT); if (!auto) return; const go = () => { autoT = setTimeout(next, 700 + Math.min(1800, full.length * 25)); }; if (vh && !vh.done) vh.onend = go; else go(); };
  const tick = () => { const n = Math.min(full.length, Math.floor((performance.now() - t0) / 1000 * (I18N.lang === "en" ? 55 : 30))); if (n !== shown) { shown = n; el.querySelector(".vntext").textContent = full.slice(0, n); } if (n < full.length) typing = requestAnimationFrame(tick); else { typing = null; el.classList.add("done"); scheduleAuto(); } };
  const next = () => {
    if (closed) return; if (typing) { cancelAnimationFrame(typing); typing = null; shown = full.length; el.querySelector(".vntext").textContent = full; el.classList.add("done"); scheduleAuto(); return; }
    stopV(); i++; if (i >= L.length) { finish(); return; }
    const [w, t] = L[i], f = faceOf(w), nm = w === "나" ? heroName : w;
    el.classList.toggle("narr", w === "해설"); el.classList.toggle("me", w === "나"); el.classList.remove("done");
    el.querySelector(".vnface").innerHTML = f ? `<img src="${f}" alt="">` : ""; el.querySelector(".vnface").hidden = !f;
    el.querySelector(".vnname").textContent = w === "해설" ? "" : nm;
    full = I18N.lang === "en" ? I18N.tr(t) : t; shown = 0; t0 = performance.now(); el.querySelector(".vntext").textContent = ""; // 11-21 영어: 한 자씩 찍기 전에 통째로 번역
    const lg = el.querySelector(".vnlog"); lg.insertAdjacentHTML("beforeend", `<p>${w === "해설" ? "" : `<b>${esc(nm)}</b>`}${esc(t)}</p>`);
    if (w !== "나" && typeof voice === "function" && !/autotest/.test(location.hash)) vh = voice(`s2_${key}_${i}`);
    typing = requestAnimationFrame(tick);
  };
  const kh = (e) => { if (e.code === "Escape") { e.preventDefault(); finish(); } else if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); next(); } };
  window.addEventListener("keydown", kh);
  el.onclick = (e) => { if (e.target.closest(".vnctl,.vnlog")) return; next(); };
  $("#vnskip").onclick = finish;
  $("#vnauto").classList.toggle("on", auto); $("#vnauto").onclick = () => { auto = !auto; $("#vnauto").classList.toggle("on", auto); if (auto && !typing) scheduleAuto(); else clearTimeout(autoT); };
  $("#vnlogb").onclick = () => { const lg = el.querySelector(".vnlog"); lg.hidden = !lg.hidden; lg.scrollTop = 1e9; };
  el.querySelector(".vnlog").onclick = () => { el.querySelector(".vnlog").hidden = true; };
  setTimeout(() => { if (!closed) next(); }, 1100); // 제목이 먼저 떠오른 뒤 첫 줄
};
// ===================== 11-19 2.2 이야기 지도 — 장(지역)이 차례로 열림 =====================
// 사용자: "맵을 여러개로 만들어서 점점 언락되는식". 앞 장의 보스를 쓰러뜨리면 다음 장에 불이 켜짐. 장마다 본 장면·다시 보기.
const SAGA_POS = [[12, 46], [33, 40], [52, 48], [69, 62], [88, 44]];
UI.saga = function (pickF) {
  const mf = SAVE.story.maxFloor || 1, clr = (SAVE.stats.storyClear || 0) > 0, seen = SAVE.story.seen || {};
  let cur = Math.min(pickF || UI._sagaF || mf, 5); UI._sagaF = cur;
  const scenes = (f) => [String(f), `f${f}_s3`, `f${f}_mid`, `f${f}_s7`, `f${f}_boss`, `f${f}_clear`].filter((k) => STORY[k]);
  const done = (f) => mf > f || clr;
  const node = (f) => { const [x, y] = SAGA_POS[f - 1], st = f > mf ? "lock" : done(f) ? "done" : "now"; return `<button class="sgn ${st}${f === cur ? " sel" : ""}" data-f="${f}" style="left:${x}%;top:${y}%"><i>${f}</i><span>${FLOORS[f - 1].name}</span></button>`; };
  const path = SAGA_POS.slice(0, -1).map(([x, y], j) => { const [x2, y2] = SAGA_POS[j + 1]; return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" class="${mf > j + 1 ? "lit" : ""}"/>`; }).join("");
  const F = FLOORS[cur - 1], lock = cur > mf, sc = scenes(cur);
  const open = (k) => storyOpen(k);
  const body = `<div class="saga"><div class="sgmap" style="background-image:url(${imgSrc("ui_saga_map")})"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${path}</svg>${[1, 2, 3, 4, 5].map(node).join("")}</div>
    <div class="sgside"><div class="sgart" style="background-image:url(${imgSrc(STORY[String(cur)] && STORY[String(cur)].img) || imgSrc("ui_mode_story")})"></div>
      <small>${cur}장</small><h3>${esc((STORY[String(cur)] && STORY[String(cur)].title) || F.name)}</h3>
      <p class="muted">${lock ? `앞 장의 보스를 쓰러뜨리면 열려요.` : `요괴 속성: ${YOKAI_EL[cur - 1].n} · 약점 ${YOKAI_EL[cur - 1].strong.map((e) => EL_NAME[e]).join("·")} · 보스 ${esc(F.bossName)}`}</p>
      <ol class="sgsc">${sc.map((k) => `<li class="${open(k) ? "ok" : ""}" ${open(k) ? `data-sk="${k}"` : ""}>${open(k) ? esc(STORY[k].title) : "아직 보지 못한 이야기"}</li>`).join("")}</ol>
      <button class="btn gold sggo" id="sggo" ${lock ? "disabled" : ""}>${lock ? "잠긴 장" : done(cur) ? "다시 걷기" : "이 장으로 출정"}</button>
      ${seen.open ? '<button class="btn sm" id="sgopen">서장 다시 보기</button>' : ""}</div></div>`;
  UI.frame("📖 이야기 지도", body, () => UI.menu());
  document.querySelectorAll(".sgn").forEach((b) => (b.onclick = () => { const f = +b.dataset.f; if (f > mf) { UI.toast(`${f - 1}장 보스를 쓰러뜨리면 열려요`, 2200); } UI.saga(f); }));
  document.querySelectorAll(".sgsc li[data-sk]").forEach((b) => (b.onclick = () => UI.story(b.dataset.sk, () => {})));
  if ($("#sgopen")) $("#sgopen").onclick = () => UI.story("open", () => {});
  $("#sggo").onclick = () => { if (!lock) UI.chars({ mode: "story", floor: cur }); };
};
// ===================== 11-21 B4 의견 보내기 (CBT 피드백 채널) =====================
// Sentry 사용자 의견(captureFeedback)으로 보냄 — 서버 설정 없이 개발자가 오류와 함께 읽음. 아이디·닉네임은 넣지 않음(적은 글만).
UI.feedback = function (o) {
  o = o || {}; const wasG = G && !G.over && !G.paused; if (wasG) G.paused = true;
  const cats = ["버그", "밸런스(어려움·쉬움)", "그림·소리", "재미·제안", "기타"];
  UI.modal(`<h2>의견 보내기</h2><p class="muted" style="text-align:center">불편했던 곳, 좋았던 곳, 바라는 것 무엇이든 적어 주세요. 아이디·닉네임은 함께 보내지 않아요.</p>
    <div class="fbcats">${cats.map((c, i) => `<button class="btn sm${i ? "" : " gold"}" data-fc="${c}">${c}</button>`).join("")}</div>
    <textarea id="fbtx" maxlength="1000" placeholder="예) 2장 보스 방에서 화면이 멈췄어요 / 궁수가 너무 약해요" style="width:100%;box-sizing:border-box;height:140px;margin-top:8px;background:#0b0907;color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:10px;font:inherit"></textarea>
    <p class="muted" style="font-size:.78rem">함께 가는 정보: 게임 버전 ${GAME_VERSION} · 기기 종류 · 지금 모드${G && G.floor ? " · " + G.floor + "장" : ""}</p>
    <div class="center"><button class="btn gold" id="fbsend">보내기</button><button class="btn" id="fbno">닫기</button></div>`);
  let cat = cats[0];
  document.querySelectorAll("[data-fc]").forEach((b) => (b.onclick = () => { cat = b.dataset.fc; document.querySelectorAll("[data-fc]").forEach((x) => x.classList.toggle("gold", x === b)); }));
  const close = () => { UI.closeModal(); if (wasG && G) G.paused = false; };
  $("#fbno").onclick = close;
  $("#fbsend").onclick = () => {
    const t = ($("#fbtx").value || "").trim(); if (t.length < 4) { UI.toast("조금만 더 적어 주세요"); return; }
    const send = () => { try { Sentry.captureFeedback({ message: `[${cat}] ${t}`, source: o.from || "settings" }, { captureContext: { tags: { kind: "feedback", cat, ver: GAME_VERSION, mode: G ? G.mode : "menu", floor: G ? G.floor : 0 } } }); return true; } catch (e) { return false; } };
    if (window.Sentry && Sentry.captureFeedback && send()) { track && track("feedback", { cat }); close(); UI.toast("고마워요! 의견이 잘 전해졌어요", 2600); return; }
    UI.toast(`지금은 보낼 수 없어요 — ${SUPPORT.mail} 로 보내 주세요`, 4000);
  };
};
// ===================== 11-21 보물상자 획득 목록 (무엇을 얻었는지 바로 보이게) =====================
UI.loot = function (title, items) {
  let box = document.getElementById("lootbox"); if (!box) { box = document.createElement("div"); box.id = "lootbox"; document.body.appendChild(box); }
  const card = document.createElement("div"); card.className = "lootc";
  card.innerHTML = `<b>${esc(title)}</b><div class="lrow">${items.map(([k, n, v], i) => `<span class="li" style="animation-delay:${0.15 + i * 0.12}s">${imgSrc(k) ? `<img src="${imgSrc(k)}" alt="">` : ""}<em>${esc(n)}</em>${v > 1 ? `<i>×${v}</i>` : ""}</span>`).join("")}</div>`;
  box.appendChild(card); setTimeout(() => card.classList.add("out"), 2800); setTimeout(() => card.remove(), 3300);
};
// ===================== 11-21 뽑기: 새 영웅 획득 연출 =====================
UI.heroReveal = function (list, done) {
  let i = 0;
  const show = () => {
    if (i >= list.length) { done(); return; }
    const r = list[i++], c = CHAR[r.id], gi = GRADE_INFO[r.grade || CHAR_GRADE[r.id]] || GRADE_INFO.C, col = gi.col || "#ffd27a", gname = r.grade || CHAR_GRADE[r.id] || "";
    const d = document.createElement("div"); d.id = "hreveal"; d.style.setProperty("--gc", col);
    d.innerHTML = `<div class="hr-bg"></div><div class="hr-rays"></div><div class="hr-ink"></div><div class="hr-card"><img src="${imgSrc("card_" + charArt(r.id, c.forms ? "wolf" : null))}" alt=""><i class="hr-shine"></i></div>
      <div class="hr-tx"><small>새 영웅 합류</small><b>${esc(c.name)}</b><span><em style="background:${col}">${gname}급</em> ${esc(c.job)}</span>${typeof HERO_LINES !== "undefined" && HERO_LINES[r.id] ? `<q>${esc(HERO_LINES[r.id][0])}</q>` : ""}</div><div class="hr-tap">눌러서 계속${list.length > 1 ? ` · ${i}/${list.length}` : ""}</div>`;
    document.body.appendChild(d); try { sfx("level"); } catch (e) { }
    if (navigator.vibrate && SAVE && SAVE.settings && SAVE.settings.haptic !== false) try { navigator.vibrate([30, 60, 60]); } catch (e) { }
    const t0 = performance.now();
    d.onclick = () => { if (performance.now() - t0 < 900) return; d.classList.add("out"); setTimeout(() => { d.remove(); show(); }, 320); };
  };
  show();
};
// ===================== 11-21 처음 실행 언어 선택 · 공지창 =====================
// 상업용 게임처럼: 첫 실행에 언어 고르기(한 번), 접속하면 새 공지·하루 한 번 공지창(오늘 하루 보지 않기), 메인 위 '공지' 버튼(새 공지면 빨간 점)
const todayKey = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
const noticeMax = () => (typeof NOTICES !== "undefined" && NOTICES.length ? Math.max(...NOTICES.map((n) => n.id)) : 0);
function noticeNew() { return noticeMax() > (+ls.get("ygr_notice_seen") || 0); }
function noticeAutoOk() {
  if (/autotest/.test(location.hash) || !noticeMax() || !SAVE || (SAVE.stats.rooms || 0) < 3) return false; // 처음 온 사람의 첫 흐름은 막지 않음
  if (noticeNew()) return true;
  const t = todayKey(); return ls.get("ygr_notice_hide") !== t && ls.get("ygr_notice_day") !== t;
}
UI.notice = function () {
  if (typeof NOTICES === "undefined" || !NOTICES.length) return;
  const en = I18N.lang === "en", T = (n) => (en && n.en ? n.en : n), seen = +ls.get("ygr_notice_seen") || 0;
  const TYPE_EN = { "공지": "Notice", "업데이트": "Update", "안내": "Guide", "이벤트": "Event" };
  const ty = (x) => (en ? TYPE_EN[x] || x : x);
  let cur = 0;
  const draw = () => {
    const n = NOTICES[cur], t = T(n);
    const list = NOTICES.map((x, i) => `<button class="nli ${i === cur ? "on" : ""}" data-i="${i}"><span class="nty t-${x.type}">${ty(x.type)}</span><b>${esc(T(x).title)}</b>${x.id > seen ? '<i class="ndot"></i>' : ""}<small>${x.date}</small></button>`).join("");
    $("#mbox").innerHTML = `<div class="ntc"><div class="nhead"><h2>${en ? "Notices" : "공지"}</h2></div><div class="nbody"><div class="nlist">${list}</div><div class="nview">${n.img && imgSrc(n.img) ? `<div class="nban" style="background-image:url(${imgSrc(n.img)})"><span class="nty t-${n.type}">${ty(n.type)}</span></div>` : ""}<h3>${esc(t.title)}</h3><small class="muted">${n.date}</small><ul>${t.body.map((b) => `<li>${b}</li>`).join("")}</ul></div></div>
      <div class="nfoot"><label><input type="checkbox" id="nhide"> ${en ? "Don't show again today" : "오늘 하루 보지 않기"}</label><button class="btn gold" id="nclose">${en ? "Close" : "닫기"}</button></div></div>`;
    document.querySelectorAll(".nli").forEach((b) => (b.onclick = () => { cur = +b.dataset.i; draw(); }));
    $("#nclose").onclick = () => { if ($("#nhide").checked) ls.set("ygr_notice_hide", todayKey()); ls.set("ygr_notice_seen", String(noticeMax())); ls.set("ygr_notice_day", todayKey()); UI.closeModal(); $("#modal").classList.remove("noticem"); const d = $("#noticeb .ndot"); if (d) d.remove(); };
  };
  UI.modal('<div class="ntc"></div>'); $("#modal").classList.add("noticem"); draw();
};
UI.langFirst = function (done) {
  if (/autotest/.test(location.hash) || ls.get("ygr_lang_set")) { done(); return; }
  const sug = /^ko/i.test(navigator.language || "ko") ? "ko" : "en";
  const d = document.createElement("div"); d.id = "langpick";
  d.innerHTML = `<div class="lpbg" style="background-image:url(${imgSrc("ui_menu_bg")})"></div><div class="lpin">${imgSrc("ui_logo") ? `<img class="lplogo" src="${imgSrc("ui_logo")}" alt="요괴록">` : "<h1>요괴록</h1>"}<p>언어를 선택해 주세요 · Choose your language</p><div class="lpbtns"><button class="btn ${sug === "ko" ? "gold" : ""}" data-l="ko">한국어</button><button class="btn ${sug === "en" ? "gold" : ""}" data-l="en">English <small>(beta)</small></button></div><small class="muted">설정에서 언제든 바꿀 수 있어요 · You can change this anytime in Settings</small></div>`;
  document.body.appendChild(d);
  d.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => { ls.set("ygr_lang_set", "1"); const l = b.dataset.l; if (l !== I18N.lang) { I18N.set(l); return; } d.classList.add("out"); setTimeout(() => d.remove(), 350); done(); }));
};
// ===================== 11-20 판 들어가기 로딩 화면 =====================
// 사용자: "그림받는중 이후 바로 게임으로 입장이 안되고 다시 눌러야함, 이미지가 별로". 전체 화면 그림 + 받는 양 막대 + 한마디, 다 받으면 바로 들어감(다시 누를 필요 없음).
const LOAD_TIPS = [(IS_TOUCH ? "구르기 버튼으로 구르는 동안에는 공격을 맞지 않아요" : "구르기(Space) 중에는 공격을 맞지 않아요"), "붉은 영역은 곧 공격이 떨어지는 자리예요", "보부상에게 다가가면 상점이 열려요", "혼불은 혼불 제단에서 모든 영웅을 강하게 해요", "같은 강화를 겹치면 레벨이 올라요", "약수 우물은 체력을 가득 채워 줘요", "요괴마다 약한 속성이 있어요 — 장 이름 아래를 보세요"];
UI.loading = function (opt) {
  if (UI._ld) return; UI._ld = true;
  const L = runPackList(opt), names = L.need.map((x) => x[0]).filter((n) => ASSETS.packs[n] && !PACK.done[n]);
  let fired = false; const go = () => { if (fired) return; fired = true; clearInterval(tm); UI._ld = false; const el = $("#ldscr"); if (el) { el.classList.add("out"); setTimeout(() => el.remove(), 400); } UI.startRun(Object.assign({}, opt, { _ready: true })); };
  if (!names.length) { UI._ld = false; L.later.forEach((n) => needPack(n, LATER)); UI.startRun(Object.assign({}, opt, { _ready: true })); return; }
  const d = document.createElement("div"); d.id = "ldscr";
  const bg = imgSrc("ui_load_bg") || imgSrc("ui_menu_bg");
  d.innerHTML = `<div class="ldbg" style="background-image:url(${bg})"></div><div class="ldin"><div class="ldtitle">미궁으로 내려가는 중</div><div class="ldbar"><i id="ldfill"></i></div><div class="ldnum" id="ldnum">0%</div><p class="ldtip" id="ldtip">${esc(pick(LOAD_TIPS))}</p><button class="btn sm ldskip" id="ldskip" hidden>그림 없이 먼저 들어가기</button></div>`;
  document.body.appendChild(d);
  const t0 = performance.now(); let tipT = t0;
  const tm = setInterval(() => {
    let got = 0, tot = 0; for (const n of names) { const p = PACK.prog[n]; if (PACK.done[n]) { const q = p || [1, 1]; got += q[1]; tot += q[1]; } else if (p && p[1]) { got += p[0]; tot += p[1]; } else tot += 8e6; }
    const pct = tot ? Math.min(100, Math.round((got / tot) * 100)) : 0; const f = $("#ldfill"); if (f) f.style.width = pct + "%";
    const nm = $("#ldnum"); if (nm) nm.textContent = `${pct}% · ${(got / 1048576).toFixed(0)} / ${(tot / 1048576).toFixed(0)}MB`;
    const now = performance.now(); if (now - tipT > 4500) { tipT = now; const tp = $("#ldtip"); if (tp) tp.textContent = pick(LOAD_TIPS); }
    if (now - t0 > 25000) { const s = $("#ldskip"); if (s) s.hidden = false; }
  }, 120);
  d.querySelector("#ldskip").onclick = go;
  needRunPacks(opt).then(go, go);
};
// ===================== 11-20 멈춤 화면 다시 (사용자: "멈춤 UI 변경 필요, 획득 패시브 이미지가 별로") =====================
// 왼쪽: 영웅 그림·레벨·위치·능력치(흡혈 포함) / 오른쪽: 얻은 강화를 그림 칸으로(누르면 설명), 액티브 / 아래: 버튼·소리(접힘)
function pauseHtml(canSave) {
  const p = G.p, cnt = {}; for (const k of p.boons) cnt[k] = (cnt[k] || 0) + 1;
  const art = typeof charArt === "function" ? charArt(p.id, p.form || null) : p.id, C = CHAR[p.id] || { name: "", job: "" };
  const where = G.mode === "story" ? `${G.floor}장 ${G.stage}스테이지` : G.mode === "endless" ? `무한의 방 ${G.eFloor || 1}층` : G.mode === "raid" ? `보스 레이드 ${Math.min((G.raidN || 0) + 1, RAID_ORDER.length)} / ${RAID_ORDER.length}` : "";
  const pct = (v) => Math.round((v || 0) * 100) + "%";
  const ls = (p.ls || 0) + (typeof buffSum === "function" ? buffSum(p, "ls") : 0);
  const stats = [["공격력", Math.round(atkOf(p))], ["체력", `${Math.round(p.hp)} / ${Math.round(p.maxHp)}`], ["치명타", pct(p.crit)], ["흡혈", pct(ls)], ["받는 피해", (!p.drBase ? "" : p.drBase > 0 ? "-" : "+") + pct(Math.abs(p.drBase || 0))], ["스킬 대기", (p.cdr ? "-" : "") + pct(p.cdr || 0)], ["이동", Math.round(spdOf(p))], ...(p.revive ? [["부활", p.revive]] : [])];
  const tiles = Object.keys(cnt).filter((k) => BOONS[k]).map((k) => { const B = BOONS[k], col = RARITY[B.rar].col;
    return `<button class="pzb" data-k="${k}" data-n="${cnt[k]}" style="--rc:${col}">${abIc("bn_" + k, B.ic, 60)}<span class="pzn">${esc(B.name)}</span>${cnt[k] > 1 ? `<b class="pzlv">${cnt[k]}</b>` : ""}</button>`; }).join("");
  const A = p.active && ACTIVES[p.active.k];
  const act = A ? `<div class="pzact" style="--rc:${ACT_TIER[A.rar].col}">${abIc("ic_" + p.active.k, A.ic, 54)}<div><small>액티브 · ${ACT_TIER[A.rar].name} · Lv.${p.active.lv}</small><b>${esc(A.name)}</b>${A.lore ? `<p class="lore">${esc(A.lore)}</p>` : ""}<p>${esc(A.desc)}</p></div></div>` : `<div class="pzact none"><span class="muted">액티브 없음 — 요괴·상자·보부상에게서 얻어요</span></div>`;
  return `<div class="pzw"><div class="pzl"><div class="pzhero" style="background-image:url(${imgSrc("card_" + art)})"></div><div class="pzid"><small>${esc(where)}</small><h2>${esc(C.name)}</h2><span>${esc(C.job || "")} · Lv.${p.lvl}</span></div>
      <dl class="pzst">${stats.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl></div>
    <div class="pzr"><h3>이번 판 강화 <small>${p.boons.length}개</small></h3><div class="pzgrid">${tiles || '<p class="muted" style="grid-column:1/-1;white-space:nowrap">아직 고른 강화가 없어요</p>'}</div><div class="pzdet" id="pzdet"><span class="muted">강화를 누르면 설명이 나와요</span></div>
      <h3>액티브</h3>${act}
      <div class="pzbtns"><button class="btn gold" id="pr">계속하기</button>${canSave ? '<button class="btn blue" id="psave">저장 후 나가기</button>' : ""}<button class="btn" id="pq">원정 그만두기</button></div>
      <p class="muted pzhint">${canSave ? `저장하면 <b>${G.floor}장 ${G.stage}스테이지</b>부터 레벨·물건 그대로 이어서 해요` : "그만두면 성적만큼 코인을 받아요"}</p>
      <details class="pzsnd"><summary>소리 · ${IS_TOUCH ? "화면 버튼" : "키"} 설정</summary><p><label><input type="checkbox" id="smus" ${SAVE.settings.music ? "checked" : ""}> 배경 음악</label></p><p>음악 크기 <input type="range" id="svol" min="0" max="1" step="0.05" value="${SAVE.settings.vol}"></p><p>효과음 크기 <input type="range" id="ssfx" min="0" max="1" step="0.05" value="${SAVE.settings.sfx}"></p><button class="btn sm" id="pkeys">${IS_TOUCH ? "화면 버튼 설정" : "키 설정"}</button></details></div></div>`;
}
// ===================== 11-20 그림 내려받기 방식 고르기 =====================
// 사용자: "전체 다운, 필요 파일 우선 다운을 선택할 수 있게, 차후에 추가 다운". 처음 한 번 묻고(ygr_dl), 설정에서 언제든 바꿈.
const DL_MB = () => (ASSETS.dlMB || 700);
UI.dlAsk = function (fromSet) {
  $("#modal").classList.add("dlmode");
  UI.modal(`<div class="dlw"><h2>그림 받는 방식</h2><p class="muted">한 번 받은 그림은 기기에 보관돼 다음부터 바로 열려요. 언제든 설정에서 바꿀 수 있어요.</p>
    <button class="dlc" id="dlall"><b>전체 받기</b><span>약 ${DL_MB()}MB · 와이파이 권장</span><small>지금 뒤에서 모두 받아 두고, 받는 동안에도 바로 플레이할 수 있어요. 다 받으면 어떤 모드든 기다림 없이 시작해요.</small></button>
    <button class="dlc" id="dlneed"><b>필요한 것만 먼저</b><span>판마다 약 15~25MB · 데이터 절약</span><small>판에 들어갈 때 그 판에 필요한 그림만 받아요. 나머지는 플레이하면서 조금씩 받고, 설정에서 '남은 그림 모두 받기'로 언제든 더 받을 수 있어요.</small></button></div>`);
  const pickM = (m) => { ls.set("ygr_dl", m); $("#modal").classList.remove("dlmode"); UI.closeModal(); if (m === "all") { dlAll(); UI.toast("뒤에서 그림을 모두 받는 중이에요 — 그동안 플레이해도 돼요", 3500); } else { dlStop(); UI.toast("필요한 그림만 먼저 받아요", 2500); } dlPill(); if (fromSet) UI.settings(); };
  $("#dlall").onclick = () => pickM("all"); $("#dlneed").onclick = () => pickM("need");
};
function dlPill() {
  clearInterval(UI._dlT); const tick = () => { const el = $("#dlp"), st = $("#dlst"); const busy = DL.on && DL.total && DL.done < DL.total, pct = DL.total ? Math.floor((DL.done / DL.total) * 100) : 0;
    if (el) { el.hidden = !busy; if (busy) el.textContent = `그림 받는 중 ${pct}%`; el.onclick = () => UI.settings(); }
    if (st) st.textContent = !ASSETS.packs ? "한 파일판: 모든 그림이 이미 들어 있어요" : DL.on ? (DL.total && DL.done >= DL.total ? "모든 그림을 받았어요 — 기다림 없이 시작해요" : `받는 중 ${pct}% (전체 약 ${DL_MB()}MB) · 받는 동안에도 플레이할 수 있어요`) : ls.get("ygr_dl") === "all" ? "전체 받기" : "필요한 것만 먼저 받는 중 (판마다 필요한 그림만)";
    if (!busy && !st) clearInterval(UI._dlT); };
  tick(); UI._dlT = setInterval(tick, 1000);
}
// ===================== 11-20 판 결과: 피해 기록판 + 쓰러진 까닭 =====================
// 참고: Brotato·Vampire Survivors 의 판 끝 '무기별 피해' 표, Hades·Dead Cells 의 '무엇에 쓰러졌나' → 다음 판 빌드·회피를 스스로 고치게
function meterHtml(died) {
  if (!G || !G.dmgBy) return ""; const ent = Object.entries(G.dmgBy).sort((a, b) => b[1] - a[1]); if (!ent.length) return "";
  const tot = ent.reduce((a, x) => a + x[1], 0), top = ent.slice(0, 6), sec = Math.max(1, G.time || 1);
  const rows = top.map(([k, v]) => { const pc = (v / tot) * 100; return `<div class="mtr"><span class="mtn">${esc(k)}</span><span class="mtb"><i style="width:${pc.toFixed(1)}%"></i></span><span class="mtv">${pc.toFixed(0)}%</span></div>`; }).join("");
  const hurt = G.hurtBy ? Object.entries(G.hurtBy).sort((a, b) => b[1] - a[1]).slice(0, 3) : [];
  const why = died && G.lastHurt ? `<p class="mtwhy">쓰러뜨린 것 <b>${esc(G.lastHurt)}</b>${hurt.length ? ` · 가장 아팠던 것 <b>${esc(hurt[0][0])}</b> (받은 피해의 ${Math.round((hurt[0][1] / Math.max(1, hurt.reduce((a, x) => a + x[1], 0))) * 100)}%)` : ""}</p>` : "";
  // 11-20 다음엔 이렇게 (Hades·Dead Cells 처럼 쓰러진 원인에 맞춘 한 줄 공략)
  let tip = ""; const s = G.lastHurtSrc;
  if (died && s) { if (s.kind === "boss" && s.def && s.def.pats && typeof PAT_TIP !== "undefined") { const pt = s.def.pats.map((k) => PAT_TIP[k]).filter(Boolean); if (pt.length) tip = pt[Math.floor(Math.random() * pt.length)]; }
    else if (s.def && s.def.ai && typeof AI_TIP !== "undefined" && AI_TIP[s.def.ai]) tip = AI_TIP[s.def.ai]; }
  if (died && !tip && (!G.p.dodgeN || G.p.dodgeN < 3)) tip = `구르기(${IS_TOUCH ? "구르기 버튼" : keyLabel(keyMap().dodge)})는 잠깐 무적이에요. 붉은 영역이 사라지기 직전에 굴러 보세요.`;
  return `<div class="card meter"><h3>피해 기록 <small>초당 ${Math.round(tot / sec)}</small></h3>${rows}${why}${tip ? `<p class="mttip"><b>다음엔</b> ${esc(tip)}</p>` : ""}</div>`;
}
// ===================== 11-20 첫 판 길잡이 (글 상자 대신, 할 때가 되면 한 줄씩) =====================
// 참고: Dead Cells·Hades 첫 판 — 멈추고 설명을 읽히지 않고, 화면 위 한 줄 안내 → 해내면 다음. 처음 10분 이탈을 줄이려고.
const COACH = () => IS_TOUCH ? [
  { t: "왼쪽 아래 원을 끌어서 움직여 보세요", ok: (c) => c.moved > 260 },
  { t: "오른쪽 큰 칼 버튼을 누르고 있으면 가까운 요괴를 공격해요", ok: () => G.dmgBy && Object.values(G.dmgBy).reduce((a, b) => a + b, 0) > 0 },
  { t: "1·2·3 버튼은 스킬이에요 — 하나 써 보세요", ok: () => G.dmgBy && Object.keys(G.dmgBy).some((k) => k !== "기본 공격") },
  { t: "붉은 영역은 곧 공격이 떨어지는 자리 — '구르기' 버튼으로 피해요", ok: () => G.p.dodgeAt != null, wait: () => G.tele.some((x) => x.team === 1) },
  { t: "요괴를 모두 잡으면 문이 열려요 — 문 안으로 걸어가면 다음 방", ok: (c) => c.rooms > 1 },
] : [
  { t: () => `${["up", "left", "down", "right"].map((x) => keyLabel(keyMap()[x])).join("")} 로 움직여 보세요`, ok: (c) => c.moved > 260 },
  { t: () => `마우스 왼쪽(또는 ${keyLabel(keyMap().atk2)})으로 마우스 쪽을 공격해요`, ok: () => G.dmgBy && Object.values(G.dmgBy).reduce((a, b) => a + b, 0) > 0 },
  { t: () => `스킬: 마우스 오른쪽 · ${keyLabel(keyMap().s2)} · ${keyLabel(keyMap().s3)} — 하나 써 보세요`, ok: () => G.dmgBy && Object.keys(G.dmgBy).some((k) => k !== "기본 공격") },
  { t: () => `붉은 영역은 곧 공격이 떨어지는 자리 — ${keyLabel(keyMap().dodge)}로 굴러 피해요`, ok: () => G.p.dodgeAt != null, wait: () => G.tele.some((x) => x.team === 1) },
  { t: "요괴를 모두 잡으면 문이 열려요 — 문 안으로 걸어가면 다음 방", ok: (c) => c.rooms > 1 },
];
function coachStart() {
  const steps = COACH(), c = { i: 0, moved: 0, rooms: 0, lx: G.p.x, ly: G.p.y, lastRoom: G.cur, shownT: 0 };
  let el = $("#coach"); if (!el) { el = document.createElement("div"); el.id = "coach"; $("#hud").appendChild(el); }
  clearInterval(UI._coachT);
  UI._coachT = setInterval(() => {
    if (!G || G.over || !G.p) { clearInterval(UI._coachT); el.remove(); return; }
    if (!el.isConnected && $("#hud")) $("#hud").appendChild(el);
    if (G.paused) return;
    c.moved += Math.hypot(G.p.x - c.lx, G.p.y - c.ly); c.lx = G.p.x; c.ly = G.p.y; if (G.cur !== c.lastRoom) { c.lastRoom = G.cur; c.rooms++; }
    const s = steps[c.i]; if (!s) { el.classList.add("done"); el.innerHTML = "<b>좋아요!</b> 이제 혼자서도 충분해요"; setTimeout(() => el.remove(), 2600); clearInterval(UI._coachT); SAVE.tutorial = true; if (typeof track === "function") track("tutorial_done"); saveGame(); return; }
    if (G.banner && !c.shownT) return; // 스테이지 제목이 사라진 뒤에 (겹침 방지)
    if (G.bossUnit && G.bossUnit.alive) { el.classList.remove("on"); if (c.shownT) c.shownT = performance.now(); return; } // 보스 이름·체력 막대와 겹치지 않게 보스 중엔 숨김
    if (s.wait && !s.wait() && !c.shownT) { el.classList.remove("on"); return; }
    if (c.shownT && !el.classList.contains("on")) el.classList.add("on");
    if (!c.shownT) { c.shownT = performance.now(); el.innerHTML = `<small>${c.i + 1} / ${steps.length}</small> ${typeof s.t === "function" ? s.t() : s.t}`; el.classList.add("on"); }
    if ((s.ok(c) && performance.now() - c.shownT > 900) || performance.now() - c.shownT > 15000) { c.i++; c.shownT = 0; el.classList.remove("on"); if (s.ok(c)) sfx("pick"); } // 11-20 15초가 지나도 못 하면 다음으로(구르기를 안 써서 판 내내 남던 것)
  }, 250);
}
// ===================== 11-20 서낭당 소원 (원정 시작 선택) =====================
// 참고: Slay the Spire 'Neow 의 축복'(출발 때 셋 중 하나, 하나는 대가 있는 큰 보상) → 미궁 입구 서낭당에 정화수를 올리고 소원 하나.
const wishOk = () => G && G.p && (G.mode === "story" || G.mode === "endless") && !(G.opt && (G.opt.multi || G.opt.daily || G.opt.resume)) && SAVE.tutorial && (SAVE.stats.rooms || 0) >= 8 && !(G.mode === "story" && G.stage > 1);
UI.wish = function () {
  const p = G.p; G.paused = true; input.atkHeld = false; input.moveHeld = false;
  const b1 = rollBoons(1, Math.max(p.lvl, 8))[0], big = rollBoons(2, 30), ck = pick(Object.keys(CURSES).filter((k) => k !== "dark"));
  const opts = [
    b1 && { t: "기운을 주소서", s: `강화 '${BOONS[b1].name}' — ${BOONS[b1].desc}`, run: () => { takeBoon(p, b1); return BOONS[b1].name; } },
    { t: "재물을 주소서", s: "엽전 150", run: () => { p.gold = (p.gold || 0) + 150; return "엽전 150"; } },
    { t: "몸 성히 해 주소서", s: "이번 원정 최대 체력 +15%", run: () => { evMod({ hp: 0.15 }); p.hp = p.maxHp; return "최대 체력 +15%"; } },
    big.length === 2 && { t: "큰 것을 주소서", s: `강화 '${BOONS[big[0]].name}'·'${BOONS[big[1]].name}' — 대신 판 내내 ${CURSES[ck].name} (${CURSES[ck].desc})`, bad: true, run: () => { big.forEach((k) => takeBoon(p, k)); G.opt.taboo = (G.opt.taboo || []).concat([ck]); return `강화 둘 · ${CURSES[ck].name}`; } },
  ].filter(Boolean);
  $("#modal").classList.add("evmode");
  UI.modal(`<div class="evbox">${ASSETS.img.ev_bowl ? `<div class="evart" style="background-image:url(${imgSrc("ev_bowl")})"></div>` : ""}<h2>서낭당 소원</h2><p class="evtext">미궁 들머리 서낭당에 정화수 한 그릇을 올린다. 소원은 하나만 빌 수 있다.</p>
    <div class="evch">${opts.map((o, i) => `<button class="btn evc${o.bad ? " bad" : ""}" data-w="${i}"><b>${esc(o.t)}</b><span>${esc(o.s)}</span></button>`).join("")}</div><p class="muted" style="text-align:center;font-size:.78rem;margin-top:8px">${IS_TOUCH ? "" : "1~" + opts.length + " 키로도 고를 수 있어요"}</p></div>`);
  const arm = UI.arm();
  const done = (i) => { if (performance.now() < arm) return; window.removeEventListener("keydown", kh); const got = opts[i].run(); sfx("pick"); UI.closeModal(); G.paused = false; addText(p.x, p.y - 120, "소원: " + got, "#ffe08a", 22); if (typeof track === "function") track("wish", { i }); };
  const kh = (e) => { const n = +e.key; if (n >= 1 && n <= opts.length) { e.preventDefault(); done(n - 1); } };
  window.addEventListener("keydown", kh);
  document.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => done(+b.dataset.w)));
};
// ===================== 11-20 오늘 할 일 (메인 왼쪽 한눈에) =====================
// 참고: 모바일 히트작의 '일일 할 일' 판 — 매일 와서 무엇을 하면 되는지 한 줄씩, 끝낸 건 붓 체크.
function todayCard() {
  if (!SAVE || (SAVE.stats.rooms || 0) < 3) return "";
  const today = new Date().toDateString(), items = [];
  items.push({ t: "출석", ok: SAVE.daily && SAVE.daily.day === today, go: "" });
  items.push({ t: "무료 뽑기", ok: typeof freeToday === "function" && !freeToday(), go: "gacha" });
  if (typeof dailyInfo === "function" && ((SAVE.stats.rooms || 0) >= 5)) { const D = dailyInfo(); items.push({ t: "오늘의 괴담", ok: !!((SAVE.daily2 || {})[D.key]), go: "daily" }); }
  if (SAVE.bounty && SAVE.bounty.list) { const n = SAVE.bounty.list.filter((x) => SAVE.bounty.done[x]).length; items.push({ t: `토벌령 ${n}/${SAVE.bounty.list.length}`, ok: n >= SAVE.bounty.list.length, go: "bounty" }); }
  if (typeof storeState === "function") { const s = storeState(); items.push({ t: "주막 창고", ok: s.soul <= 0, go: s.soul > 0 ? "store" : "" }); }
  const left = items.filter((x) => !x.ok).length;
  return `<div class="today"><div class="tdh"><b>오늘 할 일</b><span>${left ? `${left}개 남음` : "모두 끝!"}</span></div><div class="tdl">${items.map((x) => `<button class="tdi${x.ok ? " ok" : ""}" ${x.go && !x.ok ? `data-go="${x.go}"` : "disabled"}><i></i>${esc(x.t)}</button>`).join("")}</div></div>`;
}
const HERO_LINES = {musa: ["칼은 무겁게, 마음은 가볍게. 그게 내 아버지의 가르침이었다.", "앞장서겠소. 뒤는 맡기지."], archer: ["바람 소리를 읽으면 화살은 저절로 간다.", "숨 한 번, 시위 한 번."], spear: ["창끝이 닿는 데까지가 내 땅이다.", "길이에서 이기면 반은 이긴 거요."], monk: ["주먹은 미움이 아니라 고요에서 나온다.", "나무아미타불… 그럼 시작해 볼까."], gunner: ["화약 냄새가 나야 잠이 온다니까.", "심지 붙였어. 다들 귀 막아!"], priest: ["방울이 울리면, 길 잃은 넋도 돌아온다.", "신령님, 오늘도 길을 밝혀 주소서."], necro: ["죽은 자는 거짓말을 하지 않지. 산 자보다 낫다.", "일어나라. 아직 할 일이 남았다."], assassin: ["달이 없는 밤이 내 편이다.", "…소리 내지 마."], dosa: ["부적 한 장에 하늘과 땅의 이치가 다 들었다.", "급급여율령!"], yinyang: ["음이 다하면 양이 오고, 양이 다하면 음이 온다.", "오늘의 점괘는… 대길."], summoner: ["난 혼자 싸운 적이 없어. 늘 친구들이 있었지.", "얘들아, 나와!"], berserker: ["생각은 끝나고 하는 거다.", "으아아아! 덤벼라!"], moon: ["달빛 아래 한 번의 칼춤이면 충분해요.", "달이 밝네요. 베기 좋은 밤이에요."], thunder: ["하늘이 노하면, 내가 그 노여움이다.", "천둥 소리가 들리면 이미 늦은 거다."], fox: ["천 년을 기다렸어. 사람의 마음 하나 알려고.", "여우비 오는 날엔 조심하는 게 좋아."], reaper: ["명부에 적힌 이름은 지워지지 않는다. 대개는.", "때가 되었다."], haerang: ["바다에서 살아남은 놈은 어디서든 살아남지.", "닻 올려라!"], danbi: ["매가 먼저 본다. 나는 따라갈 뿐.", "가자, 해동청."], cheonrang: ["백두의 눈보라가 나를 길렀다.", "산의 주인이 내려간다."], hwaryeon: ["재가 되어도 다시 피어나는 게 주작이에요.", "불꽃이여, 춤을 춰라."], dolsoe: ["논밭 지키던 낫으로 나라도 지킨다.", "이까짓 거, 모내기보다 쉽지!"], pojol: ["순라 돌다 보면 별의별 놈을 다 만나지.", "게 섰거라!"], yakcho: ["독도 약도 한 뿌리에서 나와요.", "다치면 말해요. 약은 넉넉해요."], namu: ["나무는 결 따라 쪼개야 잘 쪼개지는 법.", "어디, 한 번 패 볼까."], geommu: ["춤이 칼이 되고, 칼이 춤이 되는 거예요.", "장단 맞춰 주세요."], mudang: ["굿판엔 산 사람과 죽은 사람이 함께 서지.", "어허, 신이 내리신다!"], hwarang: ["세속오계, 그중 임전무퇴.", "물러서지 않는다."], eosa: ["마패 하나면 탐관오리도 요괴도 다 무릎 꿇지.", "암행어사 출두야!"], sorikun: ["한 소리에 울고, 한 소리에 웃게 하는 게 소리꾼이오.", "얼씨구, 한번 놀아 보세!"], eulji: ["싸움에서 이기려면 먼저 마음에서 이겨야 한다.", "적의 계략은 이미 읽었다."], haemosu: ["하늘의 수레를 타고 내려온 지 오래구나.", "하늘이 보고 있다."], jipsin: ["새를 쫓던 허수아비가 이젠 요괴를 쫓는다네.", "바람아, 도와다오!"], bong: ["봉인 속에서 오래 잤더니 몸이 근질근질해.", "냥! 아니, 크르릉!"]}; // 11-20 영웅마다 한마디 (Hades 처럼 인물 개성) [0] 고르는 화면 [1] 출발할 때
// ===================== 11-20 휴대폰 세로 → 판 안에서 '가로로 돌려 주세요' =====================
// 모바일 액션 게임처럼: 판 중 세로가 되면 멈추고 안내, 가로로 돌리면 그대로 이어서. (앱·설치판은 manifest 가 가로 고정)
(function () {
  const mq = matchMedia("(orientation: portrait) and (max-width: 820px)"); let el = null, byRot = false;
  const chk = () => {
    const inRun = !!(G && G.p && !G.over && $("#hud") && !$("#hud").hidden), on = mq.matches && inRun && IS_TOUCH;
    if (on && !el) { el = document.createElement("div"); el.id = "rotate"; el.innerHTML = '<div class="rtph"></div><b>휴대폰을 가로로 돌려 주세요</b><span>돌리면 바로 이어서 해요</span>'; document.body.appendChild(el); if (!G.paused) { G.paused = true; byRot = true; } }
    else if (!on && el) { el.remove(); el = null; if (byRot && G) { G.paused = false; } byRot = false; }
  };
  mq.addEventListener ? mq.addEventListener("change", chk) : mq.addListener(chk); setInterval(chk, 700);
})();
// 11-20 영웅 성별 (이야기 주인공 그림을 고른 영웅에 맞추려고) — 카드 그림 기준. 봉냥이: 늑대인간 남 / 구미호 여
const HERO_F = new Set(["archer", "danbi", "fox", "geommu", "gunner", "hwaryeon", "moon", "priest", "summoner", "yakcho"]);
function heroSex(id, form) { id = id || (G && G.p && G.p.id) || UI._runChar || (SAVE && SAVE.sel) || "musa"; if (/^bong/.test(id)) { const f = form || (G && G.p && G.p.id === id && G.p.form) || ""; return /fox/.test(id + f) ? "f" : "m"; } return HERO_F.has(id) ? "f" : "m"; }
// ===================== 11-20 끊김 자동 감지 → 저사양 모드 한 번 제안 없이 켜기 =====================
// 모바일 히트작처럼: 판 안에서 20초 넘게 평균 40프레임 아래면 저사양 모드를 켜고 알려 줌(한 번만, 설정에서 끌 수 있음)
(function () {
  let last = performance.now(), acc = 0, n = 0, slow = 0;
  const f = (t) => { const d = t - last; last = t;
    if (G && G.p && !G.paused && !G.over && d < 500 && SAVE && !SAVE.settings.low && !SAVE.autoLowDone && !/autotest/.test(location.hash)) { acc += d; n++; if (acc > 4000) { if (n / (acc / 1000) < 40) slow++; else slow = Math.max(0, slow - 1); acc = 0; n = 0;
        if (slow >= 5) { SAVE.autoLowDone = 1; SAVE.settings.low = true; saveGame(); if (typeof resize === "function") resize(); UI.toast("화면이 자주 끊겨서 저사양 모드를 켰어요 — 설정에서 끌 수 있어요", 5000); } } }
    requestAnimationFrame(f); };
  requestAnimationFrame(f);
})();
// 11-20 2.7.11: 화면 글 안의 그림(<img>)도 받기 실패면 두 번까지 다시 받음 (자동 플레이 화면에서 엽전·혼불 아이콘이 깨진 채 남음)
document.addEventListener("error", (e) => { const im = e.target; if (!im || im.tagName !== "IMG") return; const src = im.getAttribute("src") || ""; if (!src || src.startsWith("data:")) return; const n = +(im.dataset.rt || 0); if (n >= 2) return; im.dataset.rt = n + 1; setTimeout(() => { im.src = src.replace(/[?&]r=\d+$/, "") + (src.includes("?") ? "&" : "?") + "r=" + (n + 1); }, 1500 * (n + 1)); }, true);
// 자동 시험 (주소 끝에 #autotest=모드 를 붙였을 때만): 개발자 계정으로 들어가 몇 초 싸워 본다
if (/autotest=net/.test(location.hash)) {
  const code = (location.hash.match(/code=(\w+)/) || [])[1], mm = (location.hash.match(/mode=(\w+)/) || [])[1] || "story";
  const waitPeer = (fn) => (NET.available() ? fn() : setTimeout(() => waitPeer(fn), 300));
  if (/nethost/.test(location.hash)) { login(DEV_ID, DEV_PW); SAVE.story.seen.open = 1; SAVE.sel = "musa";
    waitPeer(() => { NET.host(mm, () => { UI.multi(); if (NET.lobby && NET.lobby.guest && !G && !window._sched) { window._sched = 1; setTimeout(() => NET.hostStart({ mode: mm, char: "musa", floor: 1, diff: "normal" }), /wait/.test(location.hash) ? 6000 : 0); } }, code); UI.multi(); }); }
  else { login(DEV_ID, DEV_PW); SAVE.sel = "fox"; setTimeout(() => waitPeer(() => { NET.join(code, () => { if (!G) UI.multi(); }); UI.multi(); }), 2500); }
  setInterval(() => { const sg = $("#sgo"); if (sg) sg.click(); const pk = document.querySelector(".pk"); if (pk) pk.click(); document.title = `NET role:${NET.role} open:${!!(NET.conn && NET.conn.open)} G:${!!G} client:${NET.client} units:${G ? G.units.length : 0} room:${G && G.cur ? G.cur.type : "-"} p:${G && G.p ? Math.round(G.p.x) + "," + Math.round(G.p.y) : "-"} err:${$("#errbox").hidden ? 0 : $("#errbox").textContent}`;
    if (G && /netguest/.test(location.hash)) { input.kx = Math.sin(Date.now() / 700) > 0 ? 1 : -1; input.atkHeld = true; if (Math.random() < 0.1) NET.sendKey(pick(["Q", "W", "E", "R"])); } }, 400);
}
else if (/autotest/.test(location.hash)) {
  const mode = (location.hash.match(/autotest=(\w+)/) || [])[1] || "story";
  const ch = (location.hash.match(/char=(\w+)/) || [])[1] || "musa";
  if (/fresh/.test(location.hash)) { login("tester" + Date.now(), "test1234", true); } else login(DEV_ID, DEV_PW); SAVE.story.seen.open = 1;
  if (mode === "menu" || mode === "gacha" || mode === "chars" || mode === "bag" || mode === "missions" || mode === "skills" || mode === "howto") { mode === "menu" ? UI.menu() : UI.open(mode); }
  else {
    if (/maxp/.test(location.hash)) { SAVE.altar = {}; for (const A of ALTAR) SAVE.altar[A.k] = A.max; SAVE.enh = SAVE.enh || {}; SAVE.enh[ch] = 10; SAVE.mast = SAVE.mast || {}; SAVE.mast[ch] = 2000; } // 11-19 밸런스 시험: 제단·강화·숙련 최대
    newRun({ mode, char: ch, floor: +((location.hash.match(/floor=(\d)/) || [])[1] || 1), diff: "normal" }); $("#screens").innerHTML = ""; $("#hud").hidden = false;
    if (/boss/.test(location.hash)) { for (const [k, r] of G.rooms) if (r.type === "boss") { enterRoom(k, "N"); break; } }
    if (/fight/.test(location.hash)) { for (const [k, r] of G.rooms) if (r.type === "fight") { enterRoom(k, "N"); break; } }
    if (/pull/.test(location.hash)) { G = null; UI.menu(); doPull("char", 10); }
    if (/flow/.test(location.hash)) {
      // 흐름 시험: 적 처치 → 보스방 → 계단 → 다음 스테이지 … 5층 엔딩까지
      window._log = [];
      setInterval(() => {
        try {
          const sg = $("#sgo"); if (sg) { sg.click(); return; }
          const tk = $("#tutok"); if (tk) { tk.click(); return; }
          const pk = document.querySelector(".pk"); if (pk) { if (pk.style.pointerEvents !== "none") pk.click(); return; } const jp = document.querySelector("[data-j]"); if (jp) { jp.click(); return; }
          if ($("#again")) { document.title = "RESULT " + $("#mbox").innerText.replace(/\s+/g, " ").slice(0, 120) + " | " + window._log.join(","); return; }
          window._tick = (window._tick || 0) + 1;
          if (G && !G.paused) for (let i = 0; i < 4; i++) update(0.05);
          if (!G || G.paused) { document.title = "PAUSED " + window._tick + " modal:" + !$("#modal").hidden + " " + ($("#mbox").innerText || "").slice(0, 60); return; }
          for (const u of G.units) if (u.team === 1 && u.alive && !(u.spawnT > 0)) damage(u, u.hp + 1, G.p, false, {});
          G.cur.pending = 0;
          const st = G.drops.find((d) => d.type === "stairs");
          if (st) { G.p.x = st.x; G.p.y = st.y; return; }
          if (G.mode === "duel") { if (G.bot.alive) damage(G.bot, G.bot.hp + 1, G.p, false, {}); window._log.push("d" + G.duel.wins.join(":")); return; }
          if (G.mode === "endless") { if (G.endlessN >= 32) { damage(G.p, 99999, null, false, {}); return; } if (!roomLocked() && !G.trans) { const d = Object.keys(G.cur.links).find((k) => !G.rooms.get(G.cur.links[k]).visited); if (d) enterRoom(G.cur.links[d], d); } window._log[0] = "e" + G.endlessN; return; }
          if (G.mode === "raid") { window._log[0] = "raid" + (G.raidN || 0); return; }
          if (G.cur.type !== "boss" && G.cur.type !== "exit") { for (const [k, r] of G.rooms) if (r.type === "boss" || r.type === "exit") { enterRoom(k, "N"); window._log.push(G.floor + "-" + G.stage); break; } }
          document.title = `FLOW room:${G.cur.type} u:${G.units.map((u) => u.kind + (u.alive ? "" : "x")).join("/")} drops:${G.drops.map((d) => d.type).join("/")} trans:${G.trans ? G.trans.mode : "-"} log:${window._log.join(",")} ${G.floor}-${G.stage} lv${G.p.lvl} coins${SAVE.coins} max${SAVE.story.maxFloor} chars${Object.keys(SAVE.chars).length} err:${$("#errbox").hidden ? 0 : $("#errbox").textContent}`;
        } catch (e) { document.title = "EXC " + e.message; }
      }, 150);
    }
    if (/walk/.test(location.hash)) {
      // 걷기 시험: 적 처치 → 가 보지 않은 문(없으면 아무 문)으로 실제로 걸어감 → 계단 위로 걸어감
      window._log = []; const DP = { N: [RW / 2, 5], S: [RW / 2, RH - 5], W: [5, RH / 2 + 20], E: [RW - 5, RH / 2 + 20] }; let stuck = 0, lastKey = "";
      setInterval(() => { try {
        const sg = $("#sgo"); if (sg) { sg.click(); return; }
        const tk = $("#tutok"); if (tk) { tk.click(); return; }
        const pk = document.querySelector(".pk"); if (pk && pk.style.pointerEvents !== "none") { pk.click(); return; }
        if ($("#again")) { document.title = "RESULT " + window._log.join(","); return; }
        if (!G || G.paused) return;
        for (let i = 0; i < 3; i++) update(0.05);
        for (const u of G.units) if (u.team === 1 && u.alive && !(u.spawnT > 0)) damage(u, u.hp + 1, G.p, false, {});
        const st = G.drops.find((d) => d.type === "stairs"); const p = G.p;
        if (st) { p.tx = st.x; p.ty = st.y; }
        else if (!roomLocked()) { const ds = Object.keys(G.cur.links); const boss = ds.find((d) => G.rooms.get(G.cur.links[d]).type === "boss"); const d = boss || ds.find((d) => !G.rooms.get(G.cur.links[d]).visited) || ds[Math.floor(G.time) % ds.length]; if (d) { p.tx = DP[d][0]; p.ty = DP[d][1]; } }
        const key = G.floor + "-" + G.stage + "@" + G.curKey; if (key !== lastKey) { lastKey = key; stuck = 0; window._log.push(key); } else stuck++;
        document.title = `WALK ${G.floor}-${G.stage} room:${G.cur.type} key:${G.curKey} locked:${roomLocked()} p:${Math.round(p.x)},${Math.round(p.y)} tx:${Math.round(p.tx)},${Math.round(p.ty)} stuck:${stuck} drops:${G.drops.map((d) => d.type).join("/")} err:${$("#errbox").hidden ? 0 : $("#errbox").textContent}`;
      } catch (e) { document.title = "EXC " + e.message + " " + e.stack; } }, 120);
    }
    let n = /flow|walk/.test(location.hash) ? -1e9 : 0; const keys = ["Q", "W", "E", "R", "A"];
    const iv = setInterval(() => {
      if (G && /pose=(\w+)/.test(location.hash)) { const ps = location.hash.match(/pose=(\w+)/)[1]; G.p[ps] = 9; G.p.moving = ps === "moving"; }
      if (!G || /still|flow|walk/.test(location.hash)) return; n++; if (n < 3) return; UI.closeModal(); G.paused = false; G.levelQueue = 0;
      const foe = G.units.find((u) => u.team === 1 && u.alive);
      if (foe) { input.mx = foe.x; input.my = foe.y; } input.atkHeld = true;
      const _only = (location.hash.match(/only=(\w)/) || [])[1];
      if (n % 3 === 0) useSkill(G.p, _only || keys[(n / 3) % 5 | 0]);
      if (n === 999) { for (const u of G.units) if (u.team === 1) u.alive = false; }
      if (n === 2 && mode === "story") { const k = Object.values(G.cur.links)[0]; if (k) enterRoom(k, Object.keys(G.cur.links)[0]); }
      document.title = `T${n} hp${Math.round(G.p.hp)} units${G.units.length} room:${G.cur.type} err:${$("#errbox").hidden ? 0 : 1}`;
    }, 400);
  }
}

// ===================== 11-22 CBT: 14일 출석 · 이탈 지점 측정 · 판 끝 설문 =====================
UI.cbtDaily = function (D, today) {
  D.day = today; D.cbt = Math.min(CBT.days, (D.cbt || 0) + 1); SAVE.stats.cbtDays = Math.max(SAVE.stats.cbtDays || 0, D.cbt);
  const [k, n] = CBT.gifts[D.cbt - 1];
  if (k === "coin") SAVE.coins += n; else if (k === "yeop") SAVE.gold += n; else if (k === "soul") SAVE.soul = (SAVE.soul || 0) + n; else if (k === "title") { SAVE.coins += n; SAVE.titles.t_cbt = 1; }
  try { checkUnlocks(); } catch (e) { } saveGame(); track("cbt_attend", { d: D.cbt });
  const icKey = (g) => (g === "coin" ? "cur_coin" : g === "yeop" ? "cur_yeop" : g === "soul" ? "ui_soul" : "ic_t_cbt");
  const nm = { coin: "코인", yeop: "엽전", soul: "혼불" };
  UI.modal(`<h2>시험판 출석 ${D.cbt}일째</h2><p class="muted" style="text-align:center">시험판 기간에 열나흘을 들르면 '첫 등불 길잡이' 칭호를 드려요. 하루를 걸러도 이어서 세요.</p>
    <div class="cbtgrid">${CBT.gifts.map(([g, v], i) => `<div class="cbtc${i < D.cbt ? " got" : ""}${i === D.cbt - 1 ? " now" : ""}${g === "title" ? " big" : ""}"><span>${i + 1}일</span>${imgSrc(icKey(g)) ? `<img src="${imgSrc(icKey(g))}" alt="">` : ""}<em>${g === "title" ? "칭호" : nm[g] + " " + v}</em></div>`).join("")}</div>
    <div class="center"><button class="btn gold" id="dok">받기</button></div>`);
  $("#dok").onclick = () => { UI.closeModal(); UI.menu(); if (k === "title") UI.loot("첫 등불 길잡이", [["ic_t_cbt", "칭호", 1], ["cur_coin", "코인", n]]); else UI.loot("시험판 출석", [[icKey(k), nm[k], n]]); };
};
// 이탈 지점: 처음 연 날 · 며칠째 다시 왔는지 (PostHog 에서 '첫 판 → 1장 보스 → 2일차' 흐름으로 봄)
function dayOpen() {
  try { const t = new Date().toDateString(); if (!SAVE || SAVE.lastOpen === t) return;
    if (!SAVE.firstDay) { SAVE.firstDay = Date.now(); track("first_open"); }
    SAVE.lastOpen = t; const d = Math.floor((Date.now() - SAVE.firstDay) / 864e5);
    track("day_open", { d, rooms: SAVE.stats.rooms || 0, story: SAVE.story.maxFloor || 1, heroes: Object.keys(SAVE.chars).length, cbtDays: SAVE.stats.cbtDays || 0 }); saveGame(); } catch (e) { }
}
// 판 끝 설문: 정해 둔 판(3번째·12번째)이 끝났을 때 결과 화면 안에 별점 + 고르기 두 개 + 한 줄
function cbtSurvey(r) {
  try { if (typeof CBT === "undefined" || !CBT.on || ["practice", "dev"].includes(r.mode) || /autotest/.test(location.hash)) return;
    const S = (SAVE.cbtSv = SAVE.cbtSv || { runs: 0, done: {} }); S.runs++; saveGame();
    const at = CBT.survey.find((n) => S.runs >= n && !S.done[n]); if (!at) return;
    const btns = $("#again") && $("#again").parentNode; if (!btns) return;
    const FUN = ["싸움 손맛", "영웅 모으기", "이야기", "함께하기", "그림·음악"], HARD = ["너무 어려움", "지루함", "조작이 불편", "끊김·느림", "뭘 할지 모르겠음", "없었음"];
    const el = document.createElement("div"); el.className = "cbtsv";
    el.innerHTML = `<b>시험판 한마디</b> <span class="muted">— 고르기만 해도 돼요</span>
      <div class="svrow">재미 <span class="stars">${[1, 2, 3, 4, 5].map((i) => `<button data-st="${i}">★</button>`).join("")}</span></div>
      <div class="svrow">가장 좋았던 것 ${FUN.map((x) => `<button class="chip" data-f="${x}">${x}</button>`).join("")}</div>
      <div class="svrow">그만두고 싶던 순간 ${HARD.map((x) => `<button class="chip" data-h="${x}">${x}</button>`).join("")}</div>
      <div class="svrow"><input id="svtx" maxlength="200" placeholder="한 줄 더 남기기 (안 적어도 돼요)"><button class="btn sm gold" id="svok">보내기</button><button class="btn sm" id="svno">다음에</button></div>`;
    btns.parentNode.insertBefore(el, btns);
    const v = { st: 0, f: "", h: "" };
    el.querySelectorAll("[data-st]").forEach((b) => (b.onclick = () => { v.st = +b.dataset.st; el.querySelectorAll("[data-st]").forEach((x) => x.classList.toggle("on", +x.dataset.st <= v.st)); }));
    el.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { v.f = b.dataset.f; el.querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("on", x === b)); }));
    el.querySelectorAll("[data-h]").forEach((b) => (b.onclick = () => { v.h = b.dataset.h; el.querySelectorAll("[data-h]").forEach((x) => x.classList.toggle("on", x === b)); }));
    const fin = (sent) => { S.done[at] = sent ? 1 : -1; saveGame(); el.remove(); };
    $("#svno").onclick = () => { track("cbt_survey_skip", { at }); fin(false); };
    $("#svok").onclick = () => { if (!v.st && !v.f && !v.h) { UI.toast("별이나 하나라도 골라 주세요"); return; }
      const t = ($("#svtx").value || "").trim();
      track("cbt_survey", { at, star: v.st, fun: v.f, hard: v.h, mode: r.mode, floor: r.floor || 0, char: G && G.p && G.p.id });
      try { if (window.Sentry && Sentry.captureFeedback) Sentry.captureFeedback({ message: `[설문 ${at}판] 별 ${v.st} · 좋았던 것 ${v.f || "-"} · 그만두고 싶던 순간 ${v.h || "-"}${t ? " · " + t : ""}`, source: "cbt_survey" }, { captureContext: { tags: { kind: "survey", ver: GAME_VERSION } } }); } catch (e) { }
      fin(true); UI.toast("고마워요! 다음 판에 꼭 반영할게요", 2400); };
  } catch (e) { }
}

// ===================== 11-22 유료 상품 (Google Play 결제) — release.js IAP. CBT 동안 꺼짐 =====================
// 흐름: 사기 → 앱(YogoApp.buy) → Play 결제 창 → 앱이 iapGot(상품, 토큰, 주문번호) 호출 → 게임이 먼저 지급·저장 → 그다음 소모(pack)·확인(once)
// 같은 주문번호는 두 번 지급하지 않는다(저장 SAVE.iapOrders). 결제는 됐는데 지급 전에 꺼졌으면, 다음 실행 때 restore 가 다시 불러 지급.
function iapApp() { return !!(window.YogoApp && YogoApp.buy); }
function iapOn() { return typeof IAP !== "undefined" && IAP.on && IAP.items.length > 0; }
var IAP_PRICE = {};
window.iapPrices = (m) => { try { IAP_PRICE = typeof m === "string" ? JSON.parse(m) : m || {}; if (document.querySelector(".iapgrid")) UI.cashShop(); } catch (e) { } };
window.iapFail = (code) => { UI.toast(code === 1 ? "결제를 취소했어요" : "결제를 마치지 못했어요 — 잠시 뒤 다시 해 주세요", 2600); track("iap_fail", { code }); };
window.iapPending = (sku) => UI.toast("결제 확인을 기다리고 있어요 — 끝나면 바로 들어와요", 3000);
window.iapGot = (sku, token, order) => {
  const it = (IAP.items || []).find((x) => x.sku === sku); if (!it || !SAVE) return;
  const O = (SAVE.iapOrders = SAVE.iapOrders || {}), key = order || token;
  if (!O[key]) {
    const g = it.give || {}, got = [];
    if (g.coins) { SAVE.coins += g.coins; got.push(["cur_coin", "코인", g.coins]); }
    if (g.gold) { SAVE.gold += g.gold; got.push(["cur_yeop", "엽전", g.gold]); }
    if (g.soul) { SAVE.soul = (SAVE.soul || 0) + g.soul; got.push(["ui_soul", "혼불", g.soul]); }
    if (g.noAds) { SAVE.noAds = 1; got.push([it.img || "ui_soul", "광고 없이 축복", 1]); }
    if (g.title && TITLES[g.title]) { SAVE.titles[g.title] = 1; got.push(["ic_" + g.title, TITLES[g.title].name, 1]); }
    for (const c of g.chars || []) if (CHAR[c]) { SAVE.chars[c] = SAVE.chars[c] || 1; got.push(["card_" + c, CHAR[c].name, 1]); }
    O[key] = { sku, t: Date.now() }; saveGame(); try { CLOUD.push(true); } catch (e) { }
    track("iap_buy", { sku }); UI.loot(it.name, got); try { checkUnlocks(); } catch (e) { }
  }
  try { if (it.kind === "pack") YogoApp.consume(token); else YogoApp.ack(token); } catch (e) { }
  if (document.querySelector(".iapgrid")) UI.cashShop();
};
function iapHtml() {
  if (!iapOn()) return "";
  if (!iapApp()) return `<div class="card iapnote"><h3>등불 상점</h3><p class="muted">유료 상품은 Play 스토어에서 받은 앱에서 살 수 있어요.</p></div>`;
  return `<h3 class="iaph">등불 상점</h3><div class="grid iapgrid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${IAP.items.map((it) => { const owned = it.kind === "once" && Object.values(SAVE.iapOrders || {}).some((o) => o.sku === it.sku);
    return `<div class="card iapc">${it.img && imgSrc(it.img) ? `<img src="${imgSrc(it.img)}" alt="">` : ""}<h3>${esc(it.name)}</h3><p class="muted">${esc(it.desc || "")}</p><button class="btn gold" data-iap="${it.sku}" ${owned ? "disabled" : ""}>${owned ? "가지고 있어요" : IAP_PRICE[it.sku] || "값 불러오는 중"}</button></div>`; }).join("")}</div>
    <p class="muted iapfoot">결제는 Google Play 로 해요. 산 상품은 계정에 저장돼요. <a href="#" id="iaprest">구매 복원</a> · <a href="#" id="iapinfo">환불·청약철회 안내</a></p>`;
}
function iapBind() {
  if (!iapOn() || !iapApp()) return;
  if (!Object.keys(IAP_PRICE).length) try { YogoApp.prices(IAP.items.map((x) => x.sku).join(",")); } catch (e) { }
  document.querySelectorAll("[data-iap]").forEach((b) => (b.onclick = () => { if (!IAP_PRICE[b.dataset.iap]) { UI.toast("값을 불러오는 중이에요 — 잠시 뒤에 다시 눌러 주세요"); return; } track("iap_try", { sku: b.dataset.iap }); try { YogoApp.buy(b.dataset.iap); } catch (e) { window.iapFail(-1); } }));
  if ($("#iaprest")) $("#iaprest").onclick = (e) => { e.preventDefault(); try { YogoApp.restore(); UI.toast("산 상품을 다시 확인하고 있어요"); } catch (x) { } };
  if ($("#iapinfo")) $("#iapinfo").onclick = (e) => { e.preventDefault(); UI.modal(`<h2>환불·청약철회 안내</h2><div style="max-width:560px;margin:0 auto;line-height:1.8"><p>산 지 7일이 지나지 않았고 쓰지 않은 상품은 청약을 철회할 수 있어요(전자상거래법).</p><p>코인·엽전처럼 받자마자 쓸 수 있는 상품은 일부를 썼다면 철회가 어려울 수 있어요.</p><p>환불은 Google Play 주문 내역에서 신청하거나 ${SUPPORT.mail} 로 알려 주세요.</p></div><div class="center"><button class="btn" id="iapx">닫기</button></div>`); $("#iapx").onclick = () => UI.closeModal(); };
}
// 앱을 켤 때 한 번: 결제는 됐는데 지급을 못 받은 것 되찾기
setTimeout(() => { try { if (iapOn() && iapApp() && SAVE) YogoApp.restore(); } catch (e) { } }, 6000);
UI.cashShop = function () { UI.frame("등불 상점", iapHtml() || `<p class="muted">지금은 준비 중이에요</p>`); iapBind(); };

// ===================== 11-22 운영: 일괄 업데이트 · 점검 · 앱 버전 (release.js OPS, 사이트 ops.json) =====================
// 서버(Firestore)를 쓰지 않고 정적 파일 ops.json 만 읽는다 → 사람이 많아도 서버비 0.
const OPS_ST = { maint: null, upd: null, warned: false };
function opsLocal() { return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && !/maintest/.test(location.hash); }
function opsBlocked() { return !!(OPS_ST.maint && OPS_ST.maint.on && !opsLocal()) || !!OPS_ST.upd; }
// 판 시작을 막는 곳(다시 도전·모드 고르기)은 UI.startRun 앞에서 걸러진다
function opsGate() { if (OPS_ST.maint && OPS_ST.maint.on && !opsLocal()) { opsMaintScreen(); return true; } if (OPS_ST.upd) { opsUpdateGate(OPS_ST.upd.ver, OPS_ST.upd.note); return true; } return false; }
function opsUpdateGate(ver, note) {
  OPS_ST.upd = { ver, note };
  if (G) { if (!OPS_ST.warned) { OPS_ST.warned = true; UI.toast(`새 업데이트 v${ver}가 나왔어요 — 이번 판이 끝나면 업데이트해요`, 6000); } return; }
  if (document.getElementById("opsup")) return;
  const first = String(note || "").split("\n")[0].replace(/^업데이트 [\d.]+ — /, "");
  const d = document.createElement("div"); d.id = "opsup"; d.className = "opsscr";
  d.innerHTML = `<div class="opsbox"><h2>업데이트 안내</h2><p>새 판 <b>v${esc(ver)}</b>이 나왔어요. 업데이트를 받아야 계속할 수 있어요.</p>${first ? `<p class="muted">${esc(first).slice(0, 220)}</p>` : ""}<p class="muted">진행은 안전하게 저장돼요.</p><button class="btn gold" id="opsgo">지금 업데이트</button></div>`;
  document.body.appendChild(d); $("#opsgo").onclick = () => { applyUpdate.go = true; d.querySelector("button").disabled = true; applyUpdate(ver); };
}
function opsMaintScreen() {
  const m = OPS_ST.maint; if (!m || !m.on || opsLocal()) { const o = document.getElementById("opsmt"); if (o) o.remove(); return; }
  if (G) { if (!OPS_ST.mwarn) { OPS_ST.mwarn = true; UI.toast("곧 점검이 시작돼요 — 이번 판을 마치면 접속이 잠시 닫혀요", 7000); } return; }
  let d = document.getElementById("opsmt"); if (!d) { d = document.createElement("div"); d.id = "opsmt"; d.className = "opsscr"; document.body.appendChild(d); }
  d.innerHTML = `<div class="opsbox"><h2>점검 중이에요</h2><p>${esc(m.msg || "더 좋은 요괴록을 위해 잠시 손보고 있어요.")}</p>${m.until ? `<p class="muted">끝나는 때: ${esc(m.until)}</p>` : ""}<p class="muted">점검이 끝나면 이 화면이 저절로 닫혀요.</p><button class="btn" id="opsre">다시 확인</button></div>`;
  $("#opsre").onclick = () => opsPoll(true);
}
function opsAppCheck(minApp) {
  try { if (!minApp || !window.YogoApp) return; const v = YogoApp.appVer ? +YogoApp.appVer() : 0; if (v >= minApp || document.getElementById("opsapp")) return;
    const d = document.createElement("div"); d.id = "opsapp"; d.className = "opsscr";
    d.innerHTML = `<div class="opsbox"><h2>앱 업데이트가 필요해요</h2><p>Play 스토어에서 요괴록 앱을 업데이트해 주세요. 진행은 그대로 남아 있어요.</p><a class="btn gold" href="https://play.google.com/store/apps/details?id=com.yogoerok.game">Play 스토어 열기</a></div>`;
    document.body.appendChild(d); } catch (e) { }
}
function opsPoll(manual) {
  if (!UPDATE_URL || !/^https?:/.test(location.protocol)) return;
  fetch(UPDATE_URL + "ops.json?t=" + Date.now(), { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j) => {
    if (!j) return; const was = OPS_ST.maint && OPS_ST.maint.on;
    OPS_ST.maint = j.maint || null; opsMaintScreen();
    if (was && !(j.maint && j.maint.on)) { UI.toast("점검이 끝났어요 — 다시 즐겨 주세요", 4000); checkUpdate(); }
    if (manual && !(j.maint && j.maint.on)) UI.toast("지금은 점검 중이 아니에요");
    opsAppCheck(j.minApp);
    if (j.version && verNum(j.version) > verNum(GAME_VERSION)) checkUpdate();
  }).catch(() => { });
}
setTimeout(() => opsPoll(), 1500);
setInterval(() => opsPoll(), ((typeof OPS !== "undefined" && OPS.pollSec) || 120) * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) opsPoll(); });
// 판이 끝나 메뉴로 오면 미뤄 둔 업데이트·점검 창
setInterval(() => { if (!G && OPS_ST.upd && !document.getElementById("opsup")) opsUpdateGate(OPS_ST.upd.ver, OPS_ST.upd.note); if (!G && OPS_ST.maint && OPS_ST.maint.on) opsMaintScreen(); }, 3000);
// 업데이트를 받은 뒤 처음 접속하면 새 내용 안내 (한 번)
setTimeout(() => { try { const k = "ygr_seen_ver", was = ls.get(k); if (was && was !== GAME_VERSION && typeof OPS !== "undefined" && OPS.update === "batch") UI.toast(`v${GAME_VERSION} 업데이트 완료 — 새 내용은 처음 화면 '공지'에서 볼 수 있어요`, 5000); ls.set(k, GAME_VERSION); } catch (e) { } }, 4000);

// ===================== 11-22 알림 (앱에서만, 폰 안에서 예약 — 서버비 0) =====================
// 사용자: "알림기능 만들어주고 게임내에서 변경가능하게". 밤(21시~9시)에는 보내지 않고 다음 날 아침 9시로 미룬다.
const NOTIF = { store: [1, "주막 창고가 가득 찼어요", "쌓인 혼불을 받으러 오세요. 더는 쌓이지 않아요."], daily: [2, "오늘의 출석 보상이 기다려요", "들르기만 해도 코인·엽전·혼불을 받아요."], back: [3, "요괴들이 다시 꿈틀거려요", "토벌꾼님, 미궁의 등불이 꺼지기 전에 돌아와 주세요."] };
function notifCan() { return !!(window.YogoApp && YogoApp.notifyAt); }
function notifQuiet(t) { const d = new Date(t), h = d.getHours(); if (h >= 21) { d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); } else if (h < 9) d.setHours(9, 0, 0, 0); return d.getTime(); }
function notifPlan() {
  if (!notifCan() || !SAVE) return; const st = SAVE.settings, now = Date.now();
  for (const k in NOTIF) try { YogoApp.notifyCancel(NOTIF[k][0]); } catch (e) { }
  if (!st.notif) return;
  try {
    if (st.nStore !== false && SAVE.storeT && (SAVE.stats.rooms || 0) >= 5) { const t = SAVE.storeT + STORE_CAP_H * 36e5; if (t > now + 60000) YogoApp.notifyAt(NOTIF.store[0], NOTIF.store[1], NOTIF.store[2], notifQuiet(t)); }
    if (st.nDaily !== false) { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(19, 0, 0, 0); YogoApp.notifyAt(NOTIF.daily[0], NOTIF.daily[1], NOTIF.daily[2], d.getTime()); }
    if (st.nBack !== false) { const d = new Date(now + 3 * 864e5); d.setHours(19, 30, 0, 0); YogoApp.notifyAt(NOTIF.back[0], NOTIF.back[1], NOTIF.back[2], d.getTime()); }
  } catch (e) { }
}
document.addEventListener("visibilitychange", () => { if (document.hidden) notifPlan(); else if (notifCan()) for (const k in NOTIF) try { YogoApp.notifyCancel(NOTIF[k][0]); } catch (e) { } });
function notifSetHtml(s) {
  if (!notifCan()) return `<div class="setg"><h4>알림</h4><p class="muted">알림은 Play 스토어에서 받은 앱에서 쓸 수 있어요.</p></div>`;
  const row = (id, on, nm, sm) => `<p class="tg"><label><input type="checkbox" id="${id}" ${on ? "checked" : ""}> <span class="sl">${nm}<small>${sm}</small></span></label></p>`;
  return `<div class="setg"><h4>알림</h4>${row("ntall", !!s.notif, "알림 받기", "밤 9시부터 아침 9시까지는 보내지 않아요")}
    <div id="ntsub" ${s.notif ? "" : 'style="opacity:.45;pointer-events:none"'}>${row("ntstore", s.nStore !== false, "주막 창고가 가득 찼을 때", "쉬는 동안 쌓인 혼불을 받으러 올 때")}${row("ntdaily", s.nDaily !== false, "출석 보상", "다음 날 저녁 7시")}${row("ntback", s.nBack !== false, "오랜만에", "사흘 동안 들르지 않았을 때 한 번")}</div></div>`;
}
function notifSetBind(s) {
  if (!notifCan() || !$("#ntall")) return;
  $("#ntall").onchange = (e) => { s.notif = e.target.checked; saveGame(); track("notif_set", { on: s.notif });
    if (s.notif && YogoApp.notifyAllowed && !YogoApp.notifyAllowed()) { try { YogoApp.notifyAsk(); } catch (x) { } UI.toast("폰에서 '알림 허용'을 눌러 주세요", 3000); }
    const sub = $("#ntsub"); if (sub) { sub.style.opacity = s.notif ? "" : ".45"; sub.style.pointerEvents = s.notif ? "" : "none"; } };
  $("#ntstore").onchange = (e) => { s.nStore = e.target.checked; saveGame(); };
  $("#ntdaily").onchange = (e) => { s.nDaily = e.target.checked; saveGame(); };
  $("#ntback").onchange = (e) => { s.nBack = e.target.checked; saveGame(); };
}
// 처음 스토리 1장을 깬 뒤 한 번만 가볍게 물어봄(앱에서만, 싫으면 '괜찮아요')
setInterval(() => { try { if (!notifCan() || !SAVE || G || UI.modalOpen() || SAVE.notifAsked || !((SAVE.stats.bosses || 0) >= 1)) return; SAVE.notifAsked = Date.now(); saveGame();
  UI.modal(`<h2>알림을 받을까요?</h2><p style="text-align:center;line-height:1.8">주막 창고가 가득 차거나 출석 보상이 있을 때만 알려 드려요.<br>밤에는 보내지 않아요. 설정 → 알림에서 언제든 바꿀 수 있어요.</p><div class="center"><button class="btn gold" id="nty">받을래요</button><button class="btn" id="ntn">괜찮아요</button></div>`);
  $("#nty").onclick = () => { SAVE.settings.notif = true; saveGame(); try { YogoApp.notifyAsk(); } catch (e) { } track("notif_set", { on: true, ask: 1 }); UI.closeModal(); };
  $("#ntn").onclick = () => { track("notif_set", { on: false, ask: 1 }); UI.closeModal(); }; } catch (e) { } }, 5000);
