// ===== 등불 미궁: 그림자 원정 — 전투·방·그리기 =====
"use strict";
const RW = 1600, RH = 900, BL = 64, BR = 1536, BT = 122, BB = 846, DOOR_W = 136;
const rnd = (a, b) => a + Math.random() * (b - a), rint = (a, b) => Math.floor(rnd(a, b + 1)), pick = (a) => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angTo = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const angDiff = (a, b) => { let d = (a - b) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return Math.abs(d); };
const IMG = new Proxy({}, { get(t, k) { if (typeof k === "string" && !(k in t) && ASSETS.img && ASSETS.img[k]) { const im = new Image(); im.decoding = "async"; im.src = ASSETS.img[k]; t[k] = im; } return t[k]; } }); // 11-20 2.3: 그림은 처음 쓰일 때 받음(첫 화면에 70MB 다 받던 문제)
const tintCache = {};
// 나눠 받기 (사용자 요청 11-12): 캐릭터 효과·층 중간보스·장면·가챠 카드는 필요할 때 받음 (한 파일판은 ASSETS.packs 가 없어 바로 끝)
// 11-20 2.3 그림을 한 장씩 받기: 묶음은 이제 목록(주소·크기)만 담은 작은 JSON → 그림 파일(img/키.webp?h=지문)을 따로 받음.
// 예전엔 그림을 글자(base64)로 바꿔 한 덩어리에 넣어 33% 더 컸고, 층 묶음(60~76MB)을 다 받아야 시작했다.
// needPack(이름, 고르기): 고른 그림(기본 전부)을 먼저(hi) 받고 끝나면 풀림, 나머지는 뒤에서(lo) 이어 받음. PACK.prog[이름] = [받은 바이트, 기다릴 바이트]
const PACK = { done: {}, wait: {}, prog: {}, man: {}, img: {}, base: {} }; // base: 층의 방·벽·장식(floorNow)까지 받음
const IMGQ = { hi: [], lo: [], act: 0 };
function imgPump() {
  while (IMGQ.act < 12 && (IMGQ.hi.length || IMGQ.lo.length)) {
    // 11-21: 꼭 필요한 그림(hi)을 받는 동안엔 뒤에서 받을 그림(lo)은 시작하지 않음 — 판 입장 전 34MB 중 보스 그림 등이 회선을 나눠 써서 대기가 길었다
    if (!IMGQ.hi.length && IMGQ.hiAct > 0) break;
    const j = IMGQ.hi.shift() || IMGQ.lo.shift(); if (j.started) continue; j.started = true; IMGQ.act++; if (j.hi) { j.hiOn = 1; IMGQ.hiAct = (IMGQ.hiAct || 0) + 1; }
    // 11-21: 다른 곳(IMG 바로 읽기)에서 이미 같은 그림을 받기 시작했으면 새로 받지 않고 그것을 기다림 (입장 때 20개·5.9MB 두 번 받던 것)
    const ex = !j.try && j.k in IMG ? IMG[j.k] : null;
    if (ex && !ex._bm && ex.src && ex.src.split("?")[0] === j.url.split("?")[0]) {
      const fin = () => { IMGQ.act--; if (j.hiOn) { j.hiOn = 0; IMGQ.hiAct--; } j.done = true; if (typeof warmLate === "function") warmLate(j.k); for (const f of j.cb) f(); j.cb = []; imgPump(); };
      if (ex.complete) { setTimeout(fin, 0); } else { ex.addEventListener("load", fin, { once: true }); ex.addEventListener("error", fin, { once: true }); }
      continue;
    }
    const im = new Image(); im.decoding = "async"; IMG[j.k] = im;
    im.onerror = () => { if ((j.try = (j.try || 0) + 1) <= 2) { IMGQ.act--; if (j.hiOn) { j.hiOn = 0; IMGQ.hiAct--; } j.started = false; setTimeout(() => { IMGQ.lo.unshift(j); imgPump(); }, 1500 * j.try); return; } im.onload(); }; // 11-20 2.7.11: 받기 실패(망 끊김·서버 바쁨)면 두 번까지 다시 받음 — 예전엔 깨진 그림이 판 끝까지 남음
    im.onload = () => { IMGQ.act--; if (j.hiOn) { j.hiOn = 0; IMGQ.hiAct--; } j.done = true; if (typeof warmLate === "function") warmLate(j.k); for (const f of j.cb) f(); j.cb = []; imgPump(); };
    im.src = j.try ? j.url + (j.url.includes("?") ? "&" : "?") + "r=" + j.try : j.url;
  }
}
function imgGet(k, url, hi) {
  let j = PACK.img[k];
  if (!j) { j = PACK.img[k] = { k, url, cb: [], done: false, started: false }; (hi ? IMGQ.hi : IMGQ.lo).push(j); }
  else if (hi && !j.started && !j.hi) { const i = IMGQ.lo.indexOf(j); if (i >= 0) IMGQ.lo.splice(i, 1); IMGQ.hi.push(j); }
  if (hi) j.hi = true;
  const p = j.done ? Promise.resolve() : new Promise((r) => j.cb.push(r)); imgPump(); return p;
}
function packMan(name) {
  if (PACK.man[name]) return PACK.man[name];
  const url = ASSETS.packs[name].includes("h=") ? ASSETS.packs[name] : ASSETS.packs[name] + (ASSETS.packs[name].includes("?") ? "&" : "?") + "v=" + (typeof GAME_VERSION !== "undefined" ? GAME_VERSION : "");
  return (PACK.man[name] = fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).then((j) => {
    for (const k in j.img) ASSETS.img[k] = j.img[k]; Object.assign(ASSETS.meta, j.meta || {}); return j;
  }).catch((er) => { delete PACK.man[name]; throw er; }));
}
// 11-20 사용자: "전체 다운 / 필요 파일 우선 다운을 고를 수 있게, 차후에 추가 다운". dlAll: 남은 그림·음악·음성을 뒤에서(낮은 순서) 모두 받음 → 서비스 워커가 보관해 다음부터 기다림 없음
const DL = { on: false, total: 0, done: 0, size: 0, got: 0 };
function dlAll() {
  if (!ASSETS.packs || DL.on) return Promise.resolve(); DL.on = true; DL.total = DL.done = DL.size = DL.got = 0;
  return Promise.all(Object.keys(ASSETS.packs).map((n) => packMan(n).catch(() => null))).then((ms) => {
    if (!DL.on) return; const sz = {}; for (const j of ms) if (j) Object.assign(sz, j.size || {});
    const ks = Object.keys(ASSETS.img).filter((k) => /^img\//.test(ASSETS.img[k]));
    const au = [...Object.values(ASSETS.bgm || {}), ...Object.values(ASSETS.voice || {})].filter((u) => typeof u === "string" && !u.startsWith("data:"));
    DL.total = ks.length + au.length; DL.size = ks.reduce((a, k) => a + (sz[k] || 40000), 0) + au.length * 600000;
    for (const k of ks) { const done = PACK.img[k] && PACK.img[k].done; imgGet(k, ASSETS.img[k], false).then(() => { DL.done++; DL.got += sz[k] || 40000; }); if (!done && PACK.img[k] && !PACK.img[k].started) PACK.img[k].byDl = true; }
    let i = 0; const next = () => { if (!DL.on || i >= au.length) return; const u = au[i++]; fetch(u).then((r) => r.blob()).catch(() => null).then(() => { DL.done++; DL.got += 600000; next(); }); };
    next(); next();
  });
}
function dlStop() { DL.on = false; IMGQ.lo = IMGQ.lo.filter((j) => !j.byDl); }
// 11-20 데이터 절약('필요한 것만 먼저'): 뒤에서 받을 묶음도 지금 장의 중간보스·보스 동작만, 나머지는 목록만 받아 두고 처음 쓰일 때 받음 (예전엔 판 시작 25초에 약 140MB)
const dlSaver = () => { try { return typeof ls !== "undefined" && ls.get("ygr_dl") !== "all"; } catch (e) { return true; } };
function saverPick(name) {
  const fl = (G && (G.mode === "endless" ? ((G.eFloor || 1) - 1) % 5 + 1 : G.floor)) || 1;
  const m = /^f(\d)$/.exec(name); if (m) { const f = +m[1], th = FLOORS[f - 1] || {}, mids = (typeof MID_BY_FLOOR !== "undefined" && MID_BY_FLOOR[(f - 1) % 5]) || []; return f === fl ? (k) => floorNow(k) || mids.some((x) => k.startsWith(x + "_")) || (th.boss && k.startsWith(th.boss + "_")) : LATER; }
  if (name === "bossa") { const th = FLOORS[fl - 1] || {}; return (k) => !!th.boss && k.startsWith(th.boss + "_"); }
  return LATER;
}
function needPack(name, pick) {
  if (!ASSETS.packs || !ASSETS.packs[name] || PACK.done[name]) return Promise.resolve();
  const wk = name + (pick ? "|" + pick.toString() : "");
  if (PACK.wait[wk]) return PACK.wait[wk];
  return (PACK.wait[wk] = packMan(name).then((j) => {
    const ks = Object.keys(j.img), need = pick ? ks.filter(pick) : ks, sz = j.size || {};
    const tot = need.reduce((a, k) => a + (sz[k] || 50000), 0); let got = 0; if (need.length) PACK.prog[name] = [0, tot];
    const ps = need.map((k) => imgGet(k, j.img[k], true).then(() => { got += sz[k] || 50000; PACK.prog[name] = [got, tot]; }));
    const sv = dlSaver() && !(DL && DL.on) ? saverPick(name) : null; for (const k of ks) if ((!pick || !pick(k)) && (!sv || sv(k))) imgGet(k, j.img[k], false); // 데이터 절약이면 뒤에서도 지금 장에 쓸 것만
    return Promise.all(ps).then(() => { if (!pick) PACK.done[name] = true; if (pick === floorNow) PACK.base[name] = true; if (G && G.p) setTimeout(warmRun, 30); });
  }).catch(() => { delete PACK.wait[wk]; }));
}
const charPack = (id) => "c_" + (/^bong/.test(id) ? "bong" : id);
// 11-20: 판 시작에 꼭 필요한 것(캐릭터·효과·몬스터·지금 층)만 기다리고, 보스 동작·다음 층은 판 안에서 이어 받음 (예전엔 약 240MB를 다 기다림 → 6초 뒤 멈춘 듯 보여 다시 누름)
// 판 시작에 기다리는 것: 캐릭터 묶음 전부, 몬스터 동작, 지금 층의 방·벽·장식·이야기 그림(중간보스 m_·보스 b_ 동작은 5스테이지쯤 필요 → 뒤에서). 효과(fx)·보스 동작·다음 층은 판 안에서 받음
const floorNow = (k) => !/^(m_|b_)/.test(k) && !/_n$/.test(k), LATER = () => false; // _n: 고급 조명용 바닥 노멀맵(없으면 조명만 평평)
// 11-20 화질 점검: 장착한 공용 스킬의 속성 효과(cvfx_el_*)·몬스터 맞는 효과·일반 효과는 첫 싸움부터 쓰이므로 판 시작 전에 받음 (늦게 받으면 첫 20~30초 단순한 효과로 보임)
function fxPick(opt) {
  const eq = (SAVE && SAVE.skillEquip && SAVE.skillEquip[opt.char]) || {}, need = ["cvfx_mob", "cvfx_hit", "vfx_"];
  for (const s in eq) { const S = SKILLS[eq[s]]; const v = S && S.fx && sigOf(S.fx); if (v && v.startsWith("cvfx_el_")) need.push(v); }
  return (k) => need.some((p) => k.startsWith(p));
}
const floorMobs = (f) => { const en = ((FLOORS[f - 1] || FLOORS[0]).enemies || []).map((t) => ((ENEMIES[t] && ENEMIES[t].img) || "e_" + t) + "_"); return (k) => en.some((p) => k.startsWith(p)); }; // LATER: 전부 뒤에서(낮은 순서)
function runPackList(opt) {
  const f = opt.mode === "story" ? opt.floor || 1 : opt.mode === "raid" ? 5 : 1, raid = opt.mode === "raid";
  return { need: [[charPack(opt.char)], ...(raid ? [["f5", floorNow], ["bossa"], ["f" + ((BOSSES[RAID_ORDER[0]] && BOSSES[RAID_ORDER[0]].fl) || 1), (k) => k.startsWith(RAID_ORDER[0])]] : [["mob3d", floorMobs(f)], ["f" + f, floorNow]]), ["fx", fxPick(opt)]], later: raid ? ["fx", "f1", "f2", "f3", "f4", "f5"] : ["fx", "f" + f, "mob3d", "bossa", "f" + Math.min(5, f + 1)] };
}
function needRunPacks(opt) { const L = runPackList(opt); L.later.forEach((n) => needPack(n, LATER)); return Promise.all(L.need.map(([n, p]) => needPack(n, p || undefined))); }
// 그림 미리 풀어 두기 (사용자 11-14: 모바일에서 렉이 살짝씩) — 그림을 처음 그리는 순간 그 자리에서 압축을 풀어서
// 싸움 첫 10여 초에 0.05~0.13초씩 멈칫했다(폰 성능 흉내 시험, 그 뒤로는 0번). 이번 판에 쓸 그림만 미리 백그라운드에서 푼다.
const WARMED = new Set();
// 11-20 2.7.10: 판 시작 뒤 뒤에서(lo) 받은 그림은 warmRun 때 아직 없어서 안 풀렸다 → 새 요괴 처음 나올 때 멈칫. 받는 대로 이번 판 목록에 맞으면 풀어 둠
let WARM_P = null, _warmT = 0;
function warmLate(k) { if (!WARM_P || WARMED.has(k) || !G || !G.p || !WARM_P.some((p) => k.startsWith(p))) return; if (!_warmT) _warmT = setTimeout(() => { _warmT = 0; if (WARM_P && G && G.p) warmKeys(WARM_P); }, 250); }
let _warmCv = null;
function warmCtx() { if (!_warmCv) { _warmCv = document.createElement("canvas"); _warmCv.width = _warmCv.height = 512; } return _warmCv.getContext("2d"); }
// 11-21 2.8.3: 판 초반 끊김(S24 Ultra 사용자 지적) — 크롬 기록상 그림을 '처음 그리는 순간' 그 자리에서 풀었다(GpuImageDecodeCache 80~160ms).
// decode()+작은 캔버스에 한 번 그리기는 그릴 크기가 달라지면 다시 풀어 효과가 없었음 → 이미 풀린 그림(ImageBitmap, 다른 스레드에서 풂)으로 바꿔 둔다.
// 이번 판에 쓰는 그림만 바꾸고(메모리), 다음 장에서 안 쓰면 원래 그림으로 되돌리고 닫는다.
function toBitmap(k) {
  const im = IMG[k]; if (!im || im._bm || k.endsWith("_n") || typeof createImageBitmap !== "function") return Promise.resolve();
  // 그림 파일(blob)에서 만들면 다른 스레드에서 풀림 (img 에서 만들면 화면 스레드에서 풀려 오히려 멈칫, 11-21 측정)
  const go = () => (im.src && !im.src.startsWith("data:") ? fetch(im.src).then((r) => r.blob()).then((b) => createImageBitmap(b)) : createImageBitmap(im)).then((bm) => { if (IMG[k] !== im) { bm.close(); return; } bm._img = im; bm._bm = 1; bm.complete = true; bm.naturalWidth = bm.width; bm.naturalHeight = bm.height; IMG[k] = bm; }).catch(() => { });
  return im.complete && im.naturalWidth ? go() : new Promise((r) => { im.addEventListener("load", () => go().then(r), { once: true }); im.addEventListener("error", r, { once: true }); });
}
function unBitmap(k) { const bm = IMG[k]; if (bm && bm._bm && bm._img) { IMG[k] = bm._img; try { bm.close(); } catch (e) { } } WARMED.delete(k); }
function warmKeys(prefixes) {
  const keys = Object.keys(IMG).filter((k) => !WARMED.has(k) && prefixes.some((p) => k.startsWith(p)));
  let i = 0;
  const step = () => {
    const batch = keys.slice(i, i + 4); i += 4;
    Promise.all(batch.map((k) => { WARMED.add(k); return toBitmap(k); })).then(() => { if (i < keys.length) setTimeout(step, 16); });
  };
  if (keys.length) step();
  return keys.length;
}
function warmRun() {
  if (!G || !G.p) return 0;
  const P = ["npc_", "fx_", "vfx_", "cvfx_hit", "cvfx_mob", "cvfx_pet", "cvfx_sum", "sign_", "cvfx_btel_", "obj_", "door", "trap", "sign", "lantern", "chest", "well", "prop", "ic_", "bn_", "emo_", "cur_", "ui_"];
  for (const u of G.units) if (u.kind === "hero") { const id = u.id, art = u.art || id; P.push("spr_" + art, "cvfx_" + id + "_", "cvfx_sk_" + id + "_", "sk_" + id + "_", "pet_", "sum_"); for (const s of Object.values(u.sk || {})) if (s.icon) P.push(s.icon); }
  const f = ((G.mode === "endless" ? G.eFloor || 1 : G.floor || 1) - 1) % 5 + 1, th = theme();
  for (const k of (th && th.enemies) || []) { const e = ENEMIES[k]; if (e && e.img) P.push(e.img); }
  const bosses = Object.keys(BOSSES).filter((k) => BOSSES[k].fl === f || (G.mode === "raid" && !BOSSES[k].mid));
  for (const k of bosses) { const d = BOSSES[k]; if (!d) continue; const im = d.img || k; P.push(im, "cvfx_bfx_" + im, "cvfx_bp_" + im, "cvfx_btel_" + im); }
  P.push("sc_f" + f + "_", "wall", "room", "f" + f); WARM_P = P;
  for (const k of [...WARMED]) if (!P.some((p) => k.startsWith(p))) unBitmap(k); // 지난 장 그림은 되돌려 메모리 비움
  return warmKeys(P);
}
function loadImages() { } // 11-20 2.3: IMG 가 필요할 때 만듦 (위 Proxy)

let G = null;           // 현재 원정 상태
let cv, ctx, lightCv, lctx, view = { s: 1, ox: 0, oy: 0 };
// 조작: WASD 이동, 왼쪽 클릭 공격(커서 조준), 1~4 스킬, 스페이스 액티브
const MOBILE_ONLY = !(location.protocol === "file:" || /^(localhost|127.0.0.1|[::1])$/.test(location.hostname)); // 11-27 모바일로만 출시: 실제 주소에서는 언제나 휴대폰 화면
const IS_TOUCH = MOBILE_ONLY || (() => { try { return matchMedia("(pointer: coarse)").matches || "ontouchstart" in window; } catch (e) { return false; } })(); // 11-19
const input = { mx: RW / 2, my: RH / 2, mouseT: -1e9, moveHeld: false, atkHeld: false, touch: false, kx: 0, ky: 0, keys: {} };
const ctrlOf = (u) => u.ctrl || (u === G.p ? input : null);

// ---------- 능력치 ----------
function sumMods(list) { const m = {}; for (const mm of list) if (mm) for (const k in mm) m[k] = (m[k] || 0) + mm[k]; return m; }
function buffSum(u, k) { let s = 0; for (const b of u.buffs) if (b[k]) s += b[k] === true ? 1 : b[k]; return s; }
function hasBuff(u, k) { return u.buffs.some((b) => b[k]); }
function recalc(u) {
  const m = sumMods([...u.baseMods, ...u.boons.map((k) => BOONS[k].m), ...(u.jobs || []).map((j) => j.m)]);
  for (const k in STAT_CAP) if (m[k] > STAT_CAP[k]) { (u.capped = u.capped || {})[k] = 1; m[k] = STAT_CAP[k]; }
  for (const k in SOFT_CAP) if (m[k] > SOFT_CAP[k]) m[k] = SOFT_CAP[k] + (m[k] - SOFT_CAP[k]) * 0.5;
  u.m = m;
  const lvG = u.lvl - 1, star = (1 + 0.04 * (u.enh || 0)) * ((GRADE_INFO[CHAR_GRADE[u.id]] || GRADE_INFO.C).mul);
  const ratio = u.maxHp ? u.hp / u.maxHp : 1;
  u.maxHp = Math.round(u.def.hp * (1 + 0.085 * lvG) * (1 + (m.hp || 0)) * star * (u.hpMul || 1));
  u.hp = Math.min(u.maxHp, Math.max(1, Math.round(u.maxHp * ratio)));
  u.atkBase = u.def.atk * (1 + 0.075 * lvG) * (1 + (m.atk || 0)) * star * (u.atkMul || 1);
  u.spdBase = u.def.spd * (1 + (m.spd || 0));
  u.crit = 0.05 + (m.crit || 0); u.critdmg = 1.6 + (m.critdmg || 0);
  u.drBase = clamp(m.dr || 0, -0.5, STAT_CAP.dr); u.cdr = clamp(m.cdr || 0, 0, STAT_CAP.cdr); u.as = m.as || 0; u.ls = m.ls || 0;
  u.light = m.light || 0;
}
const atkOf = (u) => (u.kind === "hero" ? u.atkBase * (1 + buffSum(u, "atk")) : u.owner ? atkOf(u.owner) : u.dmg);
const spdOf = (u) => (u.kind === "hero" ? u.spdBase * (1 + buffSum(u, "spd")) : u.spd * (curseOn("haste") && u.team === 1 ? 1.2 : 1)) * (u.slowT > 0 ? 1 - u.slow : 1);
function drMul(u) { let r = 1 - (u.drBase || 0); for (const b of u.buffs) if (b.dr) r *= 1 - b.dr; for (const z of G.zones) if (z.guard && z.team === u.team && Math.hypot(u.x - z.x, u.y - z.y) < z.r) r *= 1 - z.guard; return Math.max(0.15, r); } // 11-27 함께하기에서 "공격이 안 들어간다": 내 감소·버프·친구의 수호 장판이 곱해져 피해가 5% 아래로 떨어지던 것 → 모두 합쳐 최대 85%까지만

// ---------- 유닛 만들기 ----------
function makeHero(cid, o) {
  const form = o.form || null, def = charDef(cid, form);
  const u = { kind: "hero", team: o.team || 0, id: cid, form, def, el: nearEl(def.col), art: charArt(cid, form), x: o.x || RW / 2, y: o.y || RH / 2, r: 22, lvl: o.lvl || 1, exp: 0,
    hp: 1, maxHp: 0, shield: 0, buffs: [], boons: [], baseMods: [...(o.mods || []), (ROLE_MODS[ROLE_OF(def.range)] || {}).m].filter(Boolean), enh: o.enh || 0, hpMul: o.hpMul, atkMul: o.atkMul,
    cd: { B: 0, Q: 0, W: 0, E: 0, R: 0, A: 0 }, active: null, tx: null, ty: null, vx: 0, vy: 0, face: 0, flip: false, alive: true,
    stunT: 0, slowT: 0, slow: 0, invT: 0, hitT: 0, dash: null, moveT: 0, revive: 0, nextCrit: false, bot: !!o.bot };
  u.sk = {};
  ["Q", "W", "E", "R"].forEach((s, i) => {
    const eq = o.equip && o.equip[s];
    if (eq && SKILLS[eq]) { const sd = SKILLS[eq]; u.sk[s] = { ...sd, id: eq, icon: "gs_" + eq, pow: 1 + 0.1 * ((o.skillLv && o.skillLv[eq]) || 1) - 0.1 }; }
    else u.sk[s] = { ...def.sk[i], icon: "sk_" + cid + "_" + i, pow: 1 };
  });
  recalc(u); u.hp = u.maxHp;
  u.revive = (u.m.revive || 0);
  return u;
}
// 엘리트 특성 (11-16): 엘리트마다 하나 — 이름이 머리 위에 보임
const AFFIX = { swift: { name: "신속", col: "#7fd8ff" }, iron: { name: "강철", col: "#c9d1da" }, split: { name: "분열", col: "#b48cff" }, burst: { name: "폭발", col: "#ff8a3c" }, regen: { name: "재생", col: "#7fe08a" },
  vamp: { name: "흡혈", col: "#ff4d6d" }, shield: { name: "보호막", col: "#6fa8ff" }, blink: { name: "순간이동", col: "#d08cff" } }; // 11-18 특성 3종 추가
function makeMob(type, mul, elite) {
  const m_ = makeMob0(type, mul, elite); if (m_.affix === "swift") m_.spd *= 1.45; if (elite && G && G.p) sfx("elite"); return m_;
}
function makeMob0(type, mul, elite) {
  const d = ENEMIES[type], s = elite ? 1.35 : 1;
  return { kind: "mob", team: 1, type, def: d, img: d.img, x: 0, y: 0, r: d.r * s, hp: d.hp * mul.hp * (elite ? 3.2 : 1), maxHp: d.hp * mul.hp * (elite ? 3.2 : 1),
    dmg: d.dmg * mul.dmg * (elite ? 1.3 : 1), spd: d.spd * (elite ? 1.08 : 1) * (mul.spd || 1), elite: !!elite, alive: true, buffs: [], st: "idle", t: rnd(0.3, 1.2),
    stunT: 0, slowT: 0, slow: 0, kx: 0, ky: 0, hitT: 0, markT: 0, mark: 0, burn: null, flip: false, ph: Math.random() * 6, exp: d.exp * (elite ? 4 : 1), spawnT: 0.6,
    affix: elite ? pick(Object.keys(AFFIX)) : null };
}
const BOSS_HP_MUL = 2.6;
function makeBoss(key, mul, mini) {
  const lateB = G && G.mode === "story" && G.floor >= 3 ? 1 + 0.6 * (G.floor - 2) : 1; // 11-19 5배속 봇: 3~5층 보스 6~12초 → 3층 ×1.6, 4층 ×2.2, 5층 ×2.8
  const d = BOSSES[key], hp = d.hp * mul.hp * BOSS_HP_MUL * (mini ? 0.5 : 1) * lateB; // 11-17 플레이 로봇: 보스가 5~11초에 쓰러져 패턴을 못 봄 → 2.6배 (성공작 보스 1분 안팎)
  const own = ASSETS.meta && ASSETS.meta[key]; if (!own && ASSETS.packs && d.fl) needPack("f" + d.fl);
  return { kind: "boss", team: 1, type: key, def: d, img: own || !d.art ? key : d.art, fx: d.art || key, name: mini ? "중간보스 · " + d.name : d.name, x: RW / 2, y: BT + 200, r: d.r * (mini ? 0.85 : 1),
    hp, maxHp: hp, dmg: d.dmg * mul.dmg * (mini ? 0.8 : 1), spd: d.spd, alive: true, buffs: [], st: "move", t: 1.6, pi: 0, mini: !!mini, born: G ? G.time : 0,
    stunT: 0, slowT: 0, slow: 0, kx: 0, ky: 0, hitT: 0, markT: 0, mark: 0, burn: null, flip: false, ph: 0, exp: mini ? 40 : 90, spawnT: 1.0 };
}

// ---------- 원정 시작 ----------
function newRun(opt) {
  if (window._rndOrig) { Math.random = window._rndOrig; window._rndOrig = null; }
  if (opt.daily && typeof mulberry === "function") { window._rndOrig = Math.random; Math.random = mulberry(opt.daily.seed); } // 11-18 오늘의 괴담: 같은 날엔 같은 미궁
  if (!CHAR[opt.char]) opt.char = "musa"; /* 11-16 안전장치 */
  if (typeof keepAwake === "function") keepAwake(true);
  if (typeof analyticsInit === "function") { analyticsInit(); track("run_start", { mode: opt.mode, char: opt.char, floor: opt.floor || 1, diff: opt.diff, multi: !!opt.multi }); }
  const S = SAVE;
  const form = CHAR[opt.char].forms ? pick(Object.keys(CHAR[opt.char].forms)) : null;
  const mods = [], arts = S.equip.arts.filter(Boolean);
  if (opt.mode !== "duel") {
    for (const a of arts) { const A = ARTIFACTS[a], lv = S.arts[a] || 1; if (A) mods.push(scaleMods(A.m, 1 + 0.2 * (lv - 1))); }
    if (S.equip.pet && PETS[S.equip.pet] && PETS[S.equip.pet].m) mods.push(scaleMods(PETS[S.equip.pet].m, 1 + 0.2 * ((S.pets[S.equip.pet] || 1) - 1)));
    if (S.equip.title && TITLES[S.equip.title]) mods.push(TITLES[S.equip.title].m);
  }
  if (opt.mode !== "duel" && !opt.multi && typeof altarMods === "function") mods.push(...altarMods()); // 11-18 혼불 제단 영구 강화
  if (opt.daily) for (const r of opt.daily.rules) if (r.m) mods.push(r.m);
  if (opt.mode !== "duel" && !opt.multi && typeof mastMods === "function") mods.push(...mastMods(opt.char)); // 11-18 영웅 숙련도
  const startLv = opt.mode === "story" ? 1 + (opt.floor - 1) * 8 : opt.mode === "duel" ? 10 : opt.mode === "raid" ? 12 : opt.mode === "dev" || opt.mode === "practice" ? 20 : 1;
  const p = makeHero(opt.char, { form, lvl: startLv, mods, enh: (S.enh && S.enh[opt.char]) || 0, equip: S.skillEquip[opt.char], skillLv: S.skills, x: RW / 2, y: RH / 2 + 120 });
  G = { mode: opt.mode, floor: opt.floor || 1, stage: 1, p, units: [p], projs: [], zones: [], tele: [], fx: [], parts: [], texts: [], drops: [], orbs: [], timers: [],
    time: 0, shake: 0, paused: false, over: false, goldRun: 0, rooms: new Map(), cur: null, roomT: 0, stageHit: false, kills: 0, goldGot: 0, coinGot: 0, roomsCleared: 0,
    endlessN: 0, trans: null, banner: null, opt, unlocksAtStart: Object.keys(S.chars).length, levelQueue: 0, bossUnit: null, duel: null, lightT: 0 };
  if (typeof altarStart === "function") altarStart(p, opt); // 11-18 제단: 시작 엽전·다시 뽑기·넷째 부적
  S.stats.modes = S.stats.modes || {}; S.stats.modes[opt.mode] = 1; saveGame();
  if (opt.mode !== "duel" && S.equip.pet && PETS[S.equip.pet]) addPet(p, S.equip.pet, S.pets[S.equip.pet] || 1);
  if (opt.multi) { NET.makeGuestHero(opt, startLv); NET.roomSent = null; NET.send({ t: "start", mode: opt.mode, floor: opt.floor || 1 }); SAVE.stats.multiPlays = (SAVE.stats.multiPlays || 0) + 1; }
  G.midnight = new Date().getHours() === 0 && opt.mode !== "duel"; // 이스터 에그: 자정의 미궁
  if (opt.resume) { const R = opt.resume; G.stage = R.stage || 1; p.lvl = R.lvl || p.lvl; p.exp = R.exp || 0; p.boons = (R.boons || []).slice(); p.jobs = []; for (const j of R.jobs || []) applyJob(p, Object.assign({}, j, { tier: j.tier != null ? j.tier : p.jobs.length }), true); p.gold = R.gold || 0; if (R.active) p.active = R.active; p.actLock = !!R.actLock; p.shopItems = (R.shop || []).filter((k) => SHOP_ITEMS[k]); for (const k of p.shopItems) p.baseMods.push(SHOP_ITEMS[k].m); recalc(p); p.hp = p.maxHp;
    if (R.run) { G.kills = R.run.kills || 0; G.roomsCleared = R.run.rooms || 0; G.bossKills = R.run.bossKills || 0; G.coinGot = R.run.coinGot || 0; } G.resumed = true; }
  warmRun(); // 첫 화면에 그릴 그림부터 바로 풀기 시작 (11-14 렉)
  if (opt.mode !== "duel") { jobCatchUp(p); if (G.p2 && G.p2.remote) jobCatchUp(G.p2); }
  if (opt.mode === "story") { S.stats.story_start = 1; startStage(); }
  else if (opt.mode === "endless") { G.floor = 1; startEndless(); }
  else if (opt.mode === "raid") startRaid();
  else if (opt.mode === "dev") startDev();
  else if (opt.mode === "practice") startPractice();
  else startDuel();
  UI.onRunStart();
  setTimeout(warmRun, 50); if (typeof resize === "function") resize(); // 저사양 모드(dpr 1)가 판 시작에 바로 적용되게 (11-14)
  if (!opt.multi && ["Q", "W", "E", "R"].some((s) => isPlaceFx(slotFx(p, s)))) setTimeout(() => { if (G && !G.over) UI.tip("place"); }, 8000);
  if (!opt.multi && opt.mode !== "duel") setTimeout(() => { if (G && !G.over) UI.tip("map"); }, 20000);
  if (G.midnight) setTimeout(() => { if (G) G.banner = { text: "🌙 자정의 미궁", sub: "자정에만 열리는 푸른 등불 — 엽전 +30%", t: 3.5 }; }, 3200);
}
function scaleMods(m, k) { const o = {}; for (const x in m) o[x] = x === "revive" ? m[x] : m[x] * k; return o; }

// 난이도: 층·스테이지가 오를수록 강해짐 (이전판보다 가파르게)
function diffMul() {
  const m = diffBase(), D = (G.mode === "story" || G.mode === "endless") && DIFF[(G.opt && G.opt.diff) || "normal"];
  if (D && !(D === DIFF.normal && (G.mode === "story" ? G.floor <= 1 : (G.endlessN || 0) < 10))) { m.hp *= D.hp; m.dmg *= D.dmg; } // 11-21 보통 1.1/1.12 — 1장(무한은 처음 10방)은 예전 그대로: 초보 원거리 봇이 1장 첫 스테이지에서 3번 다 쓰러짐(예전 값이면 1-5까지)
  const dh = typeof dailyRule === "function" && dailyRule("hp"); if (dh) { m.hp *= dh; m.dmg *= dailyRule("dmg") || 1; }
  const n = partyN(); if (n > 1) { m.hp *= 1 + PARTY_HP * (n - 1); m.dmg *= 1 + PARTY_DMG * (n - 1); m.party = n; } // 사용자 요청 11-12: 인원수만큼 강해짐
  return m;
}
// 협동 인원수 (대전 제외): 같은 편 플레이어 영웅 중 나가지 않은 수
const PARTY_HP = 0.7, PARTY_DMG = 0.15, PARTY_CNT = 0.3;
function partyN() { if (!G || G.mode === "duel" || !G.opt || !G.opt.multi) return 1; return Math.max(1, G.units.filter((u) => u.kind === "hero" && u.team === 0 && !u.left && (u === G.p || u.remote)).length); }
const diffRw = () => (G && (G.mode === "story" || G.mode === "endless") && DIFF[(G.opt && G.opt.diff) || "normal"] ? DIFF[(G.opt && G.opt.diff) || "normal"].rw : 1);
function diffBase() { // 11-25 사용자: 무한의 방 처음 10방은 체력·공격 0.75배에서 시작해 10방째에 원래대로(원거리 영웅이 첫 방에서 쓰러지던 문제)
  if (G.mode === "endless") { const n = G.endlessN, ease = n < 10 ? 0.75 + n * 0.025 : 1; return { hp: Math.pow(1.5, n / 8) * (1 + n * 0.02) * ease, dmg: Math.pow(1.28, n / 8) * ease, spd: 1 + Math.min(0.25, n * 0.006), tier: Math.floor(n / 8) }; }
  const f = G.floor - 1, s = G.stage - 1;
  if (G.mode === "raid") { const n = G.raidN || 0; return { hp: 1.4 * Math.pow(1.45, n), dmg: 1.2 * Math.pow(1.22, n), spd: 1 + n * 0.04, tier: n }; } // 11-20 첫 보스에서 S급도 자주 쓰러져 1.6/1.3 → 1.4/1.2 (보스 사이 보부상이 생겨 뒤로 갈수록 정비 가능)
  const late = f >= 2 ? f - 1 : 0; // 11-19 5배속 봇: 3층부터 보스가 8~18초 만에 쓰러지고 체력 90% 유지 → 2차 측정도 2층부터 피해 0 → 층마다 체력·공격 +30% (3층부터, 초보 봇도 3~4층이 1~2층보다 쉬웠음)
  return { hp: Math.pow(1.6, f) * (1 + 0.07 * s) * (1 + 0.3 * late), dmg: Math.pow(1.45, f) * (1 + 0.045 * s) * (1 + 0.3 * late), spd: 1 + f * 0.05 + s * 0.008, tier: f }; // 11-17 dmg 1.33→1.45: 3층부터 체력이 거의 안 줄던 문제(플레이 로봇)
}
const theme = () => FLOORS[(G.mode === "endless" ? (G.eFloor || 1) - 1 : G.floor - 1) % FLOORS.length];

// ---------- 스테이지 지도 (스토리) ----------
const DIRS = { N: [0, -1], S: [0, 1], W: [-1, 0], E: [1, 0] }, OPP = { N: "S", S: "N", W: "E", E: "W" };
const keyOf = (x, y) => x + "," + y;
function newRoom(x, y, type) { return { x, y, type, links: {}, visited: false, cleared: false, spawned: false, obs: [], haz: [], decor: [], deco3: [], cache: null, bg: rint(1, 2), seed: Math.random() }; }
// 저주 굴리기 (스토리·무한의 방 공통, 스테이지마다)
function rollCurse(none) {
  const prev = G.curse; let c = null;
  if (!none && !prev) { const gp = G.curseGap || 0, p = gp >= CURSE_SURE_N ? 1 : gp >= CURSE_PITY_N ? CURSE_PITY_P : CURSE_P; if (Math.random() < p) c = pick(Object.keys(CURSES).filter((k) => k !== G.lastCurse)); }
  G.curse = c; G.curseGap = c ? 0 : (G.curseGap || 0) + 1;
  if (c) { G.lastCurse = c; SAVE.stats.curses = (SAVE.stats.curses || 0) + 1; }
  return c;
}
const curseSub = () => `${CURSES[G.curse].name} — ${CURSES[G.curse].desc} · 대신 경험치·엽전 1.5배`;
// 스토리 저장 (사용자 요청 11-13): 스테이지 시작마다 자동 저장 + 멈춤 메뉴 '저장하고 나가기'. 레벨·경험치·패시브·전직·엽전·액티브·상점 물건·성적까지
function storySnap() {
  const p = G.p;
  return { char: G.opt.char, floor: G.floor, stage: G.stage, diff: G.opt.diff || "normal", lvl: p.lvl, exp: p.exp, boons: p.boons.slice(), jobs: p.jobs || [], gold: p.gold || 0,
    active: p.active ? { k: p.active.k, lv: p.active.lv } : null, actLock: !!p.actLock, shop: (p.shopItems || []).slice(), hpR: p.maxHp ? Math.max(0.3, p.hp / p.maxHp) : 1,
    run: { kills: G.kills, rooms: G.roomsCleared, bossKills: G.bossKills || 0, coinGot: G.coinGot || 0 }, at: Date.now() };
}
function startStage() {
  if (G.mode === "story" && !G.opt.multi && !G.opt.daily) { SAVE.resume = storySnap(); saveGame(); }
  needPack("f" + G.floor, floorNow); if (G.floor < 5) needPack("f" + (G.floor + 1), LATER); if (G.p) needPack(charPack(G.p.id)); needPack("bossa", LATER); // 11-18 바로 시작하는 길(시험·이어하기)에서도 영웅 동작 묶음 if (G.stage === 1) setTimeout(warmRun, 50);
  G.rooms = new Map(); G.stageHit = false;
  const n = Math.min(12, 5 + G.floor + Math.ceil(G.stage / 2));
  const start = newRoom(0, 0, "start"); G.rooms.set("0,0", start);
  const list = [start];
  let guard = 0;
  while (list.length < n && guard++ < 999) {
    const from = pick(list), dk = pick(Object.keys(DIRS)), [dx, dy] = DIRS[dk];
    const nx = from.x + dx, ny = from.y + dy, k = keyOf(nx, ny);
    if (G.rooms.has(k) || Math.abs(nx) > 4 || Math.abs(ny) > 3) continue;
    const r = newRoom(nx, ny, "fight"); G.rooms.set(k, r); list.push(r);
    from.links[dk] = k; r.links[OPP[dk]] = keyOf(from.x, from.y);
  }
  // 거리 계산 → 가장 먼 방이 보스
  const dists = new Map([["0,0", 0]]), q = ["0,0"];
  while (q.length) { const k = q.shift(), r = G.rooms.get(k); for (const d in r.links) { const k2 = r.links[d]; if (!dists.has(k2)) { dists.set(k2, dists.get(k) + 1); q.push(k2); } } }
  const others = list.slice(1).sort((a, b) => dists.get(keyOf(b.x, b.y)) - dists.get(keyOf(a.x, a.y)));
  others[0].type = G.stage % 5 === 0 ? "boss" : "exit";
  const leaves = others.slice(1).filter((r) => Object.keys(r.links).length === 1);
  const rest = others.slice(1);
  const take = (arr) => { const r = arr.find((x) => x.type === "fight"); return r; };
  const tr = take(leaves) || take(rest); if (tr) tr.type = "treasure";
  if (Math.random() < 0.55) { const sh = take(rest.slice().sort(() => Math.random() - 0.5)); if (sh) sh.type = "shop"; }
  if (Math.random() < 0.5 + G.floor * 0.05) { const rr = take(rest.slice().sort(() => Math.random() - 0.5)); if (rr) rr.type = "rest"; }
  if ((G.stage >= 2 || G.floor >= 2) && Math.random() < 0.5) { const ev = take(rest.slice().sort(() => Math.random() - 0.5)); if (ev) ev.type = "event"; } // 11-18 괴이한 방
  for (const r of rest) if (r.type === "fight" && Math.random() < 0.06 + G.floor * 0.05) r.type = "elite";
  if (G.stage >= 2 && !G.opt.multi) for (const r of rest) if (r.type === "fight" && Math.random() < 0.16) r.trial = true; // 11-18 시련의 방
  if (G.stage >= 2 && Math.random() < 0.5) { const t2 = take(rest.slice().sort(() => Math.random() - 0.5)); if (t2) t2.type = "treasure"; }
  rollCurse((G.floor === 1 && G.stage === 1) || G.stage === STAGES_PER_FLOOR);
  enterRoom("0,0", null);
  UI.music(theme().bgm);
  G.banner = G.curse ? { text: `${CURSES[G.curse].ic} 저주 받은 스테이지`, sub: curseSub(), t: 3.5, boss: true } : { text: `${G.floor}장 · ${theme().name}`, sub: `${G.stage} 스테이지${G.stage === STAGES_PER_FLOOR ? " · 장 보스" : ""} · 요괴 속성: ${YOKAI_EL[(G.floor - 1) % 5].n} (약점 ${YOKAI_EL[(G.floor - 1) % 5].strong.map((e) => EL_NAME[e]).join("·")})`, t: 3.4 };
  if (!G.opt.multi && (G.floor > 1 || G.stage >= 3)) setTimeout(() => { if (G && !G.over) UI.tip("elem"); }, 3800);
  const sc = G.stage === 3 ? `f${G.floor}_s3` : G.stage === 5 ? `f${G.floor}_mid` : G.stage === 7 ? `f${G.floor}_s7` : G.stage === STAGES_PER_FLOOR ? `f${G.floor}_boss` : null; // 11-19 2.2 이야기가 주, 전투는 사이사이
  if (sc && STORY[sc] && !G.opt.multi && !(SAVE.story.seen || {})[sc]) { SAVE.story.seen = SAVE.story.seen || {}; SAVE.story.seen[sc] = 1; saveGame(); setTimeout(() => { if (G && !G.over) UI.story(sc, () => { if (G) G.paused = false; }); }, 600); }
}

// ---------- 무한의 방 ----------
const E_ROOMS = 3; // 스테이지마다 일반 방 수 (그다음 보스 방)
function startEndless() {
  G.rooms = new Map(); G.endlessN = 0; G.eFloor = 1; G.eStage = 1; G.eRoom = 0; G.eBossDone = false; G.eNext = null;
  G.eOrder = FLOOR_BOSSES.slice().sort(() => Math.random() - 0.5);
  const s = newRoom(0, 0, "start"); G.rooms.set("0,0", s);
  makeEndlessExits(s, null);
  enterRoom("0,0", null);
  UI.music("endless");
  G.banner = { text: "무한의 방 · 1층 1스테이지", sub: "층마다 10스테이지 · 스테이지 끝마다 중간보스 · 10스테이지에 층보스", t: 3.2 };
}
function endlessType(n) {
  const r = Math.random();
  return r < 0.12 ? "elite" : r < 0.2 ? "rest" : r < 0.28 ? "event" : r < 0.38 ? "treasure" : r < 0.47 ? "shop" : "fight";
}
function makeEndlessExits(room, entry) {
  if (G.eBossDone) return;
  const sides = Object.keys(DIRS).filter((d) => d !== entry && !room.links[d]);
  sides.sort(() => Math.random() - 0.5);
  const bossNext = G.eRoom >= E_ROOMS; // 보스 차례에는 문을 하나만 (사용자 요청 11-11)
  const want = bossNext ? 1 : Math.random() < 0.35 ? 3 : 2;
  const nextN = G.endlessN + 1;
  let made = 0;
  for (const d of sides) {
    if (made >= want) break;
    const [dx, dy] = DIRS[d], k = keyOf(room.x + dx, room.y + dy);
    if (G.rooms.has(k)) continue;
    const t = bossNext ? "boss" : made === 0 ? "fight" : endlessType(nextN);
    const r = newRoom(room.x + dx, room.y + dy, t); G.rooms.set(k, r); if (bossNext && G.eStage < STAGES_PER_FLOOR) r.mid = true;
    room.links[d] = k; r.links[OPP[d]] = keyOf(room.x, room.y); made++;
  }
}

// ---------- 개발자 맵 (개발자 계정 전용, 사용자 요청 11-11) ----------
// 가운데 허브 → 위: 보스 6칸 / 오른쪽: 상점·보물·우물 / 왼쪽: 스킬 확인(허수아비) / 아래: 액티브 진열(한 칸 12개)
function startDev() {
  G.rooms = new Map(); G.floor = 1;
  const add = (x, y, type, extra) => { const r = Object.assign(newRoom(x, y, type), extra || {}); G.rooms.set(keyOf(x, y), r); return r; };
  const link = (a, b, d) => { a.links[d] = keyOf(b.x, b.y); b.links[OPP[d]] = keyOf(a.x, a.y); };
  const hub = add(0, 0, "start", { devLabel: "개발자 허브" });
  let prev = hub; RAID_ORDER.forEach((k, i) => { const r = add(0, -1 - i, "boss", { devBoss: k, devLabel: "보스 · " + BOSSES[k].name }); link(prev, r, "N"); prev = r; });
  const shop = add(1, 0, "shop"), tre = add(2, 0, "treasure"), well = add(3, 0, "rest"); link(hub, shop, "E"); link(shop, tre, "E"); link(tre, well, "E");
  const sk = add(-1, 0, "devskill", { devLabel: "스킬 확인 (허수아비)" }); link(hub, sk, "W");
  const acts = Object.keys(ACTIVES).sort((a, b) => ACTIVES[a].rar - ACTIVES[b].rar);
  prev = hub; for (let i = 0; i * 12 < acts.length; i++) { const r = add(0, 1 + i, "devact", { devActs: acts.slice(i * 12, i * 12 + 12), devLabel: `액티브 진열 ${i + 1}` }); link(prev, r, "S"); prev = r; }
  G.p.gold = 99999;
  enterRoom("0,0", null);
  G.banner = { text: "🛠 개발자 맵", sub: "위: 보스 · 오른쪽: 상점·보물·우물 · 왼쪽: 스킬 확인 · 아래: 액티브 진열", t: 4 };
}
// 연습장 (모든 사용자, 사용자 요청 11-11): 허수아비 방 + 액티브 체험 방 2개, 모든 캐릭터 체험 가능, 기록·보상 없음
function startPractice() {
  G.rooms = new Map(); G.floor = 1;
  const add = (x, y, type, extra) => { const r = Object.assign(newRoom(x, y, type), extra || {}); G.rooms.set(keyOf(x, y), r); return r; };
  const link = (a, b, d) => { a.links[d] = keyOf(b.x, b.y); b.links[OPP[d]] = keyOf(a.x, a.y); };
  const hub = add(0, 0, "devskill", { devLabel: "연습장 · 허수아비" });
  const pool = ACT_KEYS.slice().sort(() => Math.random() - 0.5);
  const pickTier = (t, n) => pool.filter((k) => ACTIVES[k].rar === t).slice(0, n);
  const a1 = add(1, 0, "devact", { devActs: [...pickTier(1, 4), ...pickTier(2, 4), ...pickTier(3, 4)], devLabel: "액티브 체험 1" });
  const a2 = add(-1, 0, "devact", { devActs: [...pickTier(3, 3), ...pickTier(4, 5), ...pickTier(5, 3), Object.keys(BOSS_ACT).length ? BOSS_ACT[pick(Object.keys(BOSS_ACT))] : pickTier(4, 1)[0]], devLabel: "액티브 체험 2" });
  link(hub, a1, "E"); link(hub, a2, "W");
  enterRoom("0,0", null);
  G.banner = { text: "🎯 연습장", sub: "허수아비로 스킬을 시험해 보세요 · 양옆 방에 액티브 체험 · 기록·보상 없음", t: 4 };
}
function spawnDummy(x, y) { const m = makeMob("slime", { hp: 1, dmg: 0 }, false); m.hp = m.maxHp = 2500; m.x = x; m.y = y; m.dummy = true; m.spawnT = 0.3; G.units.push(m); return m; } // 11-12: 예전엔 슬라임 체력×4000이라 거의 무적 → 2500 (짚신 해금: 200번 + 스토리 완료)
// ---------- 보스 레이드 (사용자 요청 11-11): 보스 6마리 연달아, 사이에 회복·강화, 잡을 때마다 코인 ----------
function startRaid() {
  G.rooms = new Map(); G.raidN = 0; G.floor = 5;
  const r = newRoom(0, 0, "raid"); r.cleared = true; G.rooms.set("0,0", r);
  enterRoom("0,0", null); G.p.x = RW / 2; G.p.y = BB - 120;
  for (let i = 0; i < 3; i++) takeBoon(G.p, rollBoons(1, 12)[0]);
  G.banner = { text: "보스 레이드", sub: `보스 ${RAID_ORDER.length}마리를 차례로 · 사이마다 보부상과 다음 보스 홍살문`, t: 3, boss: true };
  schedule(3.2, raidNext);
}
function raidBreak() {
  const r = G.cur; r.reN = 0;
  if (shopNpc()) { r.stock = makeStock(); G.drops.push({ type: "merchant", x: RW / 2, y: RH / 2 - 40, away: true }); }
  else stockShop();
  const gt = portalDrop(); gt.raid = true; gt.x = RW / 2 + 380; gt.y = RH / 2 - 30; G.drops.push(gt);
}
function raidNext() {
  if (!G || G.mode !== "raid" || G.over) return;
  if (G.raidN >= RAID_ORDER.length) { G.raidDone = true; endRun(true); return; }
  if (G.units.some((u) => u.kind === "boss" && u.alive)) return;
  G.drops = G.drops.filter((d) => !(d.raid || d.type === "merchant" || d.type === "shop" || d.type === "shopre"));
  const key = RAID_ORDER[G.raidN], b = makeBoss(key, diffMul(), false); b.x = RW / 2; b.y = BT + 200; G.units.push(b); G.bossUnit = b; UI.cutin && UI.cutin(b); bossVoice(b, "intro");
  G.banner = { text: `${G.raidN + 1} / ${RAID_ORDER.length} · ${b.name}`, sub: "보스 레이드", t: 2.4, boss: true }; UI.music(G.raidN === RAID_ORDER.length - 1 ? "boss_underworld" : "raid");
}
// ---------- 1대1 대전 ----------
function startDuel() {
  if (G.opt.multi) {
    G.bot = NET.guestHero;
    G.duel = { round: 1, wins: [0, 0], state: "ready", t: 3, react: 0.3 };
    const r = newRoom(0, 0, "arena"); r.cleared = true; G.rooms.set("0,0", r); G.floor = rint(1, 5);
    enterRoom("0,0", null); G.p.x = RW / 2; G.p.y = BB - 140; G.bot.x = RW / 2; G.bot.y = BT + 170;
    UI.music("duel"); G.banner = { text: "온라인 1대1 대전", sub: `${G.p.def.name} VS ${G.bot.def.name} (${G.bot.guestName}) · 3판 2선승`, t: 3 };
    return;
  }
  const opp = G.opt.opp || pick(CHARS.map((c) => c.id));
  const form = CHAR[opp].forms ? pick(Object.keys(CHAR[opp].forms)) : null;
  const RK = G.opt.ranked && typeof rankOpp === "function" ? rankOpp() : null; // 11-27 등급전: 내 점수 가까이의 그림자 상대
  const lvMul = RK ? RK.mul : { easy: 0.75, normal: 1, hard: 1.25 }[G.opt.diff || "normal"];
  const eq = {}; ["Q", "W", "E", "R"].forEach((s) => { if (Math.random() < (RK ? RK.eq : 0.35)) { const pool = SKILL_KEYS.filter((k) => SKILLS[k].slot === s && (!SKILLS[k].owner || SKILLS[k].owner === opp)); eq[s] = pick(pool); } });
  needPack(charPack(opp));
  G.mirror = opp === G.p.id; // 이스터 에그: 같은 영웅끼리 만나면 거울 대결
  const b = makeHero(opp, { team: 1, form, lvl: 10, bot: true, atkMul: lvMul, hpMul: lvMul, equip: eq, x: RW / 2, y: BT + 170 });
  G.bot = b; G.units.push(b);
  G.duel = { round: 1, wins: [0, 0], state: "ready", t: 3, react: RK ? RK.react : { easy: 0.55, normal: 0.32, hard: 0.16 }[G.opt.diff || "normal"], rk: RK };
  if (RK) rankBegin(RK.rp);
  const r = newRoom(0, 0, "arena"); r.cleared = true; G.rooms.set("0,0", r);
  G.floor = rint(1, 5);
  enterRoom("0,0", null);
  G.p.x = RW / 2; G.p.y = BB - 140;
  UI.music("duel");
  G.banner = { text: RK ? "결투 등급전" : G.mirror ? "🪞 거울 대결!" : "1대1 대전", sub: `${RK ? RK.name + " · " + RK.rp + "점 · " : ""}${G.mirror ? "자기 자신과의 싸움 · 이기면 엽전 2배 · " : ""}${G.p.def.name} VS ${b.def.name}${b.formName ? "(" + b.formName + ")" : ""} · 3판 2선승`, t: 3 };
}
function duelRoundReset() {
  for (const u of [G.p, G.bot]) { u.hp = u.maxHp; u.shield = 0; u.buffs = []; u.alive = true; for (const k in u.cd) u.cd[k] = 0; u.stunT = 0; u.slowT = 0; u.dash = null; u.tx = null; }
  G.p.x = RW / 2; G.p.y = BB - 140; G.bot.x = RW / 2; G.bot.y = BT + 170; G.bot.tx = null; G.p.tx = null;
  G.projs = []; G.zones = []; G.tele = []; G.orbs = []; G.timers = [];
  G.units = G.units.filter((u) => u.kind === "hero" || u.kind === "pet");
}

// ---------- 방 들어가기 ----------
function enterRoom(k, fromDir) {
  const r = G.rooms.get(k);
  if (G.cur && G.cur !== r && G.cur.cacheQ > 1) G.cur.cache = null; // 11-17 고해상도 캐시는 지금 방만
  G.cur = r; G.curKey = k; G.roomT = 0; G.camSnap = true;
  G.projs = []; G.tele = []; G.zones = G.zones.filter((z) => z.follow); G.drops = G.drops.filter(() => false);
  G.units = G.units.filter((u) => u.kind === "hero" || u.kind === "pet" || (u.kind === "summon" && u.team === 0));
  if (!r.cache || (r.cacheQ || 1) < roomQ()) buildRoom(r);
  const p = G.p;
  if (fromDir) {
    const d = OPP[fromDir];
    const pos = { N: [RW / 2, BT + 50], S: [RW / 2, BB - 40], W: [BL + 50, RH / 2 + 20], E: [BR - 50, RH / 2 + 20] }[d];
    p.x = pos[0]; p.y = pos[1]; p.tx = null; p.dash = null;
    for (const u of G.units) if (u !== p && u.team === 0) { u.x = p.x + rnd(-40, 40); u.y = p.y + rnd(-30, 30); u.tx = null; u.dash = null; collide(u); }
  }
  if (!r.visited) {
    r.visited = true;
    if ((G.mode === "story" || G.mode === "endless") && !G.rooms._explored && G.rooms.size > 3 && [...G.rooms.values()].every((x) => x.visited)) { // 11-21 탐험 보상: 스테이지의 방을 모두 가 보면 (안내 화살표를 끈 만큼 구석구석 돌 이유)
      G.rooms._explored = true; const gv = Math.round(40 * shopPm() / 5) * 5; G.p.gold = (G.p.gold || 0) + gv; if (SAVE && !(G.opt && G.opt.multi && G.client)) { SAVE.soul = (SAVE.soul || 0) + 5; SAVE.stats.explored = (SAVE.stats.explored || 0) + 1; }
      setTimeout(() => { try { sfx("level"); if (UI.loot) UI.loot("구석구석 탐험 완료", [["cur_yeop", "엽전", gv], ["ui_soul", "혼불", 5]]); } catch (e) { } }, 600);
    }
    if (G.mode === "endless" && r.type !== "start") { G.endlessN++; if (r.type !== "boss") G.eRoom++; if (false) { G.curse = G.endlessN > 1 && Math.random() < 0.25 ? pick(Object.keys(CURSES)) : null; if (G.curse) setTimeout(() => { if (G) G.banner = { text: `${CURSES[G.curse].ic} 저주가 내렸어요`, sub: `${CURSES[G.curse].name} — ${CURSES[G.curse].desc} · 다음 10방 동안 · 보상 1.5배`, t: 3.5, boss: true }; }, 400); } if (G.endlessN > (SAVE.stats.endlessBest || 0)) { SAVE.stats.endlessBest = G.endlessN; if (G.endlessN % 10 === 0 && G.endlessN > (SAVE.endlessRewarded || 0)) { SAVE.endlessRewarded = G.endlessN; gainCoin(2, "무한의 방 " + G.endlessN + "번째 방 첫 도달"); } } }
  }
  if (p.m.shieldRoom && !r.cleared) p.shield = Math.max(p.shield, p.maxHp * p.m.shieldRoom);
  populate(r);
  if (G.mode === "endless" && r.type === "boss" && !r.cleared) UI.music("boss");
  else if (G.mode === "story" && r.type === "boss" && !r.cleared) UI.music(G.stage === STAGES_PER_FLOOR ? ({ 1: "boss_final", 2: "boss_final", 3: "boss_fire", 4: "boss_swamp", 5: "boss_underworld" }[G.floor] || "boss_final") : "boss"); // 11-16 층마다 보스곡
  else if ((r.type === "rest" || r.type === "shop") && G.mode !== "raid") UI.music("rest"); // 쉼터·상점은 잔잔한 곡
  else if (G.mode === "story") UI.music(theme().bgm); else if (G.mode === "endless") UI.music("endless");
  G.trans = { t: 0.35, max: 0.35, mode: "in" };
}
function populate(r) {
  const mul = diffMul(), th = theme();
  if (r.type === "devskill") { r.cleared = true; for (let i = 0; i < 5; i++) spawnDummy(RW / 2 - 400 + i * 200, RH / 2 - 40); return; }
  if (r.type === "devact") { r.cleared = true; r.devActs.forEach((k, i) => G.drops.push({ type: "act", k, x: RW / 2 - 500 + (i % 6) * 200, y: RH / 2 - 120 + Math.floor(i / 6) * 230 })); return; }
  if (r.type === "fight" || r.type === "elite" || r.type === "exit") {
    if (r.cleared) { if (r.type === "exit" && !r.stairsTaken) G.drops.push(portalDrop()); return; }
    // 방당 몬스터 5~10마리 랜덤 (사용자 요청 11-10). 정예 방은 정예 2마리 포함
    const n = Math.round((rint(5, 10) - (r.type === "elite" ? 2 : 0)) * (1 + PARTY_CNT * (partyN() - 1)) * (curseOn("swarm") ? 1.4 : 1));
    const pool = G.mode === "endless" ? Object.keys(ENEMIES).slice(0, Math.min(Object.keys(ENEMIES).length, 3 + Math.floor(G.endlessN / 4))) : th.enemies;
    const eliteP = G.mode === "endless" ? Math.min(0.3, 0.03 + G.endlessN * 0.006) : 0.02 + 0.04 * (G.floor - 1) + 0.01 * G.stage;
    r.wave2 = n >= 7 && (G.mode === "endless" ? G.endlessN > 6 : G.floor + G.stage >= 4);
    const first = r.wave2 ? Math.ceil(n * 0.6) : n;
    for (let i = 0; i < first; i++) spawnMob(pick(pool), mul, Math.random() < eliteP * ((typeof dailyRule === "function" && dailyRule("elite")) || 1));
    r.pending = r.wave2 ? n - first : 0; r.pool = pool; r.eliteP = eliteP;
    if (r.type === "elite") { spawnMob(pick(pool.filter((x) => x !== "bat")) || "brute", mul, true); spawnMob(pick(pool), mul, true); }
    r.mobStart = G.units.filter((u) => u.team === 1).length;
    if (r.trial) { G.trial = { room: r, t: Math.round(14 + n * 2.6), max: Math.round(14 + n * 2.6), fail: false }; G.banner = { text: "⏳ 시련의 방", sub: `${G.trial.t}초 안에 모두 정리하면 보물 상자 + 강화 하나`, t: 2.6, boss: true }; sfx("zone"); setTimeout(() => { if (G && !G.over) UI.tip("trial"); }, 2700); }
  } else if (r.type === "boss" && !r.cleared) {
    let key, mini;
    if (r.devBoss) { key = r.devBoss; mini = false; }
    else if (G.mode === "story") { mini = G.stage < STAGES_PER_FLOOR; key = mini ? pick(MID_BY_FLOOR[(G.floor - 1) % 5]) : th.boss; }
    else { const fi = ((G.eFloor || 1) - 1) % 5; mini = !!r.mid; key = mini ? pick(MID_BY_FLOOR[fi]) : FLOORS[fi].boss; }
    const b = makeBoss(key, mul, mini); G.units.push(b); G.bossUnit = b; UI.cutin && UI.cutin(b);
    G.banner = { text: b.name, sub: mini ? (G.mode === "story" ? "중간보스 · 쓰러뜨리면 다음 스테이지 계단" : "중간보스") : "층 보스 · 쓰러뜨리면 보스 전용 액티브", t: 2.4, boss: true };
  } else if (r.type === "treasure" && !r.cleared) {
    r.cleared = true;
    G.drops.push({ type: "chest", x: RW / 2, y: RH / 2 + 10, open: false });
    const a1 = rollActive(), a2 = rollActive([a1]);
    G.drops.push({ type: "act", k: a1, x: RW / 2 - 220, y: RH / 2 + 40, grp: 1 }, { type: "act", k: a2, x: RW / 2 + 220, y: RH / 2 + 40, grp: 1 });
  } else if (r.type === "shop" && !r.cleared) {
    r.cleared = true;
    if (shopNpc() && !(G.opt && G.opt.multi)) { r.reN = 0; r.stock = makeStock(); G.drops.push({ type: "merchant", x: RW / 2, y: RH / 2 - 40, away: true }); }
    else { stockShop(); G.drops.push({ type: "shopre", x: RW / 2 + 430, y: RH / 2 - 170, n: 0, price: 40 }); }
  } else if (r.type === "shop" && r.stock && shopNpc()) {
    G.drops.push({ type: "merchant", x: RW / 2, y: RH / 2 - 40, away: true });
  } else if (r.type === "event" && !r.cleared && !r.evDone) {
    setTimeout(() => { if (G && !G.over) UI.tip("event"); }, 600);
    r.cleared = true; r.evDone = true; G.drops.push({ type: "evt", k: typeof pickEvent === "function" ? pickEvent() : "bowl", x: RW / 2, y: RH / 2 - 10, used: false });
  } else if (r.type === "rest" && !r.cleared) {
    r.cleared = true; const wp = Math.random() < 0.4; G.drops.push({ type: "spring", x: RW / 2, y: RH / 2 + 20, used: false, wish: 0, price: wp ? Math.round(90 * shopPm() / 5) * 5 : 0 });
    if (!wp && Math.random() < 0.5) G.drops.push({ type: "forge", x: RW / 2 + 360, y: RH / 2 + 40, used: 0, price: Math.round(100 * shopPm() / 5) * 5 }); // 11-21 떠돌이 대장간: 엽전으로 강화 하나를 다시 벼림(개수는 그대로 — 강화 인플레 없이 엽전 쓸 곳)
  } else if (r.type === "start" || r.type === "arena" || r.type === "raid") {
    r.cleared = true;
  }
  if (r.type === "boss" && r.cleared && (G.mode === "story" || (G.mode === "endless" && G.eBossDone)) && !r.stairsTaken) G.drops.push(portalDrop());
}
function spawnMob(type, mul, elite) {
  const m = makeMob(type, mul, elite), p = G.p;
  for (let i = 0; i < 40; i++) {
    m.x = rnd(BL + 80, BR - 80); m.y = rnd(BT + 60, BB - 60);
    if (Math.hypot(m.x - p.x, m.y - p.y) > 380 && !G.cur.obs.some((o) => Math.hypot(o.x - m.x, o.y - m.y) < o.r + m.r + 10)) break;
  }
  G.units.push(m); return m;
}
function roomLocked() { if (G.client) return !!G.locked; if (G.cur && G.cur.type === "devskill") return false; return G.units.some((u) => u.team === 1 && u.alive && (u.kind === "mob" || u.kind === "boss")) || (G.cur.pending > 0); }

// ---------- 방 그림 (캐시) ----------
function buildRoom(r) {
  const th = FLOORS[(G.mode === "endless" ? (G.eFloor || 1) - 1 : G.floor - 1) % FLOORS.length];
  r.th = th;
  const Q = roomQ(), c = document.createElement("canvas"); c.width = Math.round(RW * Q); c.height = Math.round(RH * Q); const g = c.getContext("2d"); g.scale(Q, Q); r.cacheQ = Q;
  const bg = IMG["room_" + th.room + "_" + r.bg];
  const wf = IMG["wall_" + th.room + "_front"];
  r.needBg = !(bg && bg.complete && bg.naturalWidth) || (wf && !wf.naturalWidth) || !!(ASSETS.packs && ASSETS.packs[th.room] && !PACK.done[th.room] && !PACK.base[th.room]); // 11-19 벽·소품도 층 묶음 → 다 받으면 다시 그림
  if (!r.needBg) { g.filter = "saturate(0.78) brightness(0.9) contrast(1.06)"; g.drawImage(bg, 0, 0, RW, RH); g.filter = "none"; } else { g.fillStyle = th.wall[2]; g.fillRect(0, 0, RW, RH); } // 11-17 바닥은 살짝 차분하게 → 영웅가 또렷하게 (11-18 고침: 이 주석이 else 를 지워 바닥 그림을 받기 전엔 빈 바닥이었음)
  const first = !r.laid; r.laid = true;
  // 바닥 가장자리 어둡게
  const vg = g.createRadialGradient(RW / 2, RH / 2 + 40, 200, RW / 2, RH / 2 + 40, 900); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.3)");
  g.fillStyle = vg; g.fillRect(0, 0, RW, RH);
  // 방 종류 바닥 문양



  // 기둥·장애물
  const layouts = [[], [[0.3, 0.38], [0.7, 0.38], [0.3, 0.75], [0.7, 0.75]], [[0.5, 0.56]], [[0.22, 0.56], [0.78, 0.56]], [[0.35, 0.33], [0.65, 0.78]], [[0.18, 0.3], [0.82, 0.3], [0.18, 0.82], [0.82, 0.82]], [[0.4, 0.45], [0.6, 0.45], [0.4, 0.7], [0.6, 0.7]]];
  if (first) {
  const lay = r.type === "start" ? pick(layouts.filter((l) => !l.some(([fx]) => Math.abs(fx - 0.5) < 0.2))) : r.type === "fight" || r.type === "elite" ? pick(layouts) : r.type === "boss" || r.type === "arena" ? pick([layouts[0], layouts[5]]) : []; // 11-19 시작 방은 가운데 기둥 없음 (시작하자마자 앞이 막히던 배치)
  for (const [fx, fy] of lay) r.obs.push({ x: BL + (BR - BL) * fx, y: BT + (BB - BT) * fy, r: rint(30, 40), kind: th.hazard === "ice" ? "crystal" : "pillar", prop: "prop_" + th.room + (Math.random() < 0.6 ? "a" : "b") });
  // 위험 지형
  const hz = { f1: "spike", f2: "ice", f3: "lava", f4: "poison", f5: "soul" }[th.room];
  if ((r.type === "fight" || r.type === "elite") && hz && Math.random() < 0.75) {
    // 11-19 사용자: 함정이 한곳에 여러 개 깔리고 다른 그림과 겹쳐 떠 보임 → 함정끼리·기둥·문 앞과 충분히 떨어뜨려 놓음 (자리 못 찾으면 안 놓음)
    const want = rint(1, 3), doorsP = [[RW / 2, BT], [RW / 2, BB], [BL, RH / 2], [BR, RH / 2]];
    for (let tries = 0; tries < 60 && r.haz.length < want; tries++) {
      const rx = hz === "spike" ? rnd(55, 70) : rnd(70, 115), ry = hz === "spike" ? rnd(40, 50) : rnd(45, 72);
      const hx = rnd(BL + 200, BR - 200), hy = rnd(BT + 140, BB - 120);
      if (Math.hypot(hx - RW / 2, hy - RH / 2) < 160 + rx) continue;
      if (r.haz.some((h) => Math.hypot(h.x - hx, (h.y - hy) * 1.4) < (h.rx + rx) * 1.6 + 120)) continue;
      if (r.obs.some((o) => Math.hypot(o.x - hx, o.y - hy) < o.r + rx + 70)) continue;
      if (doorsP.some(([qx, qy]) => Math.hypot(qx - hx, qy - hy) < 230 + rx)) continue;
      r.haz.push({ x: hx, y: hy, rx, ry, kind: hz, ph: Math.random() * 3 });
    }
  }
  for (let i = 0; i < 10; i++) r.decor.push({ x: rnd(BL + 30, BR - 30), y: rnd(BT + 30, BB - 30), k: rint(0, 3), s: rnd(0.6, 1.2), a: rnd(0, 6) });
  // 11-16 full 3D: 바닥 잔해는 3D 소품(deco_<층>_0~5) — Hades 처럼 가장자리 쪽에 모이게, 가운데(싸우는 곳)는 비움
  // 11-17 같은 소품 반복 줄이기: 종류는 섞은 주머니에서(한 방에 같은 것 최대 2번), 같은 종류끼리 380 이상·소품끼리 120 이상 떨어뜨림
  const bag = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5).concat([0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5));
  for (let i = 0, n = 0; i < 80 && n < 5 && bag.length; i++) { const x = rnd(BL + 50, BR - 50), y = rnd(BT + 50, BB - 40), ex = Math.abs(x - RW / 2) / ((BR - BL) / 2), ey = Math.abs(y - RH / 2) / ((BB - BT) / 2); const k = bag[0]; if (Math.max(ex, ey) < 0.55 || [[RW / 2, BT], [RW / 2, BB], [BL, RH / 2], [BR, RH / 2]].some(([qx, qy]) => Math.hypot(qx - x, qy - y) < 190) || r.obs.some((o) => Math.hypot(o.x - x, o.y - y) < 90) || r.haz.some((h) => Math.hypot(h.x - x, (h.y - y) * 1.3) < h.rx + 110) || r.deco3.some((d) => Math.hypot(d.x - x, d.y - y) < (d.k === k ? 380 : 120))) continue; bag.shift(); r.deco3.push({ x, y, k, s: rnd(0.42, 0.62), f: Math.random() < 0.5 }); n++; }
  }
  const has3 = (r.deco3 || []).length && IMG["deco_" + th.room + "_0"] && IMG["deco_" + th.room + "_0"].naturalWidth;
  if (has3) for (const d of r.deco3) { const im = IMG["deco_" + th.room + "_" + d.k]; if (!im || !im.naturalWidth) continue; const hd = (ASSETS.meta && ASSETS.meta["deco_" + th.room + "_" + d.k] && ASSETS.meta["deco_" + th.room + "_" + d.k].hd) || 1, w = im.naturalWidth * d.s / hd, h = im.naturalHeight * d.s / hd;
    g.save(); g.fillStyle = "rgba(0,0,0,0.28)"; g.beginPath(); g.ellipse(d.x, d.y + h * 0.32, w * 0.42, h * 0.16, 0, 0, 7); g.fill(); g.translate(d.x, d.y); if (d.f) g.scale(-1, 1); g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); }
  for (const d of has3 ? [] : r.decor) {
    g.save(); g.translate(d.x, d.y); g.rotate(d.a); g.globalAlpha = 0.5;
    if (d.k === 0) { g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(-20 * d.s, 0); g.lineTo(0, 6); g.lineTo(18 * d.s, -4); g.lineTo(30 * d.s, 4); g.stroke(); }
    else if (d.k === 1) { g.fillStyle = "rgba(220,210,190,0.55)"; g.fillRect(-12 * d.s, -2, 24 * d.s, 4); g.beginPath(); g.arc(-12 * d.s, 0, 4, 0, 7); g.arc(12 * d.s, 0, 4, 0, 7); g.fill(); }
    else if (d.k === 2) { g.fillStyle = "rgba(0,0,0,0.35)"; for (let j = 0; j < 5; j++) { g.beginPath(); g.arc(rnd(-18, 18), rnd(-10, 10), rnd(3, 7), 0, 7); g.fill(); } }
    g.restore();
  }
  // 벽
  drawWalls(g, th, r);
  // 장애물 그리기
  for (const o of r.obs) if (!IMG[o.prop]) drawPillar(g, o, th);
  r.cache = c;
  // 벽 등불 위치
  r.lamps = [[300, 70], [600, 70], [1000, 70], [1300, 70], [36, 330], [36, 640], [RW - 36, 330], [RW - 36, 640]].map(([x, y]) => ({ x, y, ph: Math.random() * 6 }));
}
function rune(g, x, y, R, col) {
  g.save(); g.strokeStyle = col; g.lineWidth = 3;
  g.beginPath(); g.ellipse(x, y, R, R * 0.6, 0, 0, 7); g.stroke();
  g.beginPath(); g.ellipse(x, y, R * 0.82, R * 0.49, 0, 0, 7); g.stroke();
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; g.beginPath(); g.moveTo(x + Math.cos(a) * R * 0.82, y + Math.sin(a) * R * 0.49); g.lineTo(x + Math.cos(a + 2.4) * R * 0.82, y + Math.sin(a + 2.4) * R * 0.49); g.stroke(); }
  g.restore();
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function drawWalls(g, th, r) {
  const [c0, c1, c2] = th.wall;
  const fr = IMG["wall_" + th.room + "_front"], tp = IMG["wall_" + th.room + "_top"];
  if (fr && fr.naturalWidth && tp && tp.naturalWidth) return drawWalls3D(g, th, fr, tp);
  // 윗벽: 벽돌 면
  g.fillStyle = c2; g.fillRect(0, 0, RW, BT);
  for (let row = 0; row < 5; row++) {
    const y = 18 + row * 21, off = row % 2 ? 0 : 34;
    for (let x = -off; x < RW; x += 68) {
      const sh = rnd(-12, 12);
      g.fillStyle = shade(row < 1 ? c0 : c1, sh - row * 3); g.fillRect(x + 2, y + 2, 64, 18);
      g.fillStyle = "rgba(255,255,255,0.06)"; g.fillRect(x + 2, y + 2, 64, 3);
    }
  }
  g.fillStyle = shade(c0, -20); g.fillRect(0, 0, RW, 18);
  const sg = g.createLinearGradient(0, BT, 0, BT + 60); sg.addColorStop(0, "rgba(0,0,0,0.65)"); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.fillRect(BL, BT, BR - BL, 60);
  // 좌우·아래 벽 윗면
  for (const [x, y, w, h] of [[0, BT, BL, RH - BT], [BR, BT, RW - BR, RH - BT], [0, BB, RW, RH - BB]]) {
    g.fillStyle = c1; g.fillRect(x, y, w, h);
    for (let i = 0; i < (w > h ? w / 60 : h / 60); i++) { g.fillStyle = shade(c0, rnd(-10, 14)); if (w > h) g.fillRect(x + i * 60 + 2, y + 6, 56, h - 12); else g.fillRect(x + 6, y + i * 60 + 2, w - 12, 56); }
  }
  // 입체감: 벽 윗면 턱(밝게), 벽 아래 받침돌, 안쪽 모서리 하이라이트
  const capG = g.createLinearGradient(0, BT - 16, 0, BT); capG.addColorStop(0, shade(c0, 40)); capG.addColorStop(1, shade(c1, -10));
  g.fillStyle = capG; g.fillRect(BL - 4, BT - 16, BR - BL + 8, 16);
  g.fillStyle = "rgba(255,240,210,0.18)"; g.fillRect(BL - 4, BT - 16, BR - BL + 8, 3);
  g.fillStyle = shade(c2, -10); g.fillRect(BL, BT, BR - BL, 6);
  for (const [x0, x1] of [[BL - 6, BL], [BR, BR + 6]]) { g.fillStyle = "rgba(255,240,210,0.16)"; g.fillRect(x0, BT, x1 - x0, BB - BT); }
  g.fillStyle = "rgba(255,240,210,0.16)"; g.fillRect(BL, BB, BR - BL, 5);
  g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 3; g.strokeRect(BL, BT, BR - BL, BB - BT);
  const lg = (x0, y0, x1, y1) => { const gg = g.createLinearGradient(x0, y0, x1, y1); gg.addColorStop(0, "rgba(0,0,0,0.5)"); gg.addColorStop(1, "rgba(0,0,0,0)"); return gg; };
  g.fillStyle = lg(BL, 0, BL + 40, 0); g.fillRect(BL, BT, 40, BB - BT);
  g.fillStyle = lg(BR, 0, BR - 40, 0); g.fillRect(BR - 40, BT, 40, BB - BT);
  // 모서리 기둥
  for (const [x, y] of [[BL, BT], [BR, BT], [BL, BB], [BR, BB]]) { g.fillStyle = shade(c0, 10); g.beginPath(); g.arc(x, y, 30, 0, 7); g.fill(); g.fillStyle = shade(c0, 30); g.beginPath(); g.arc(x - 6, y - 6, 18, 0, 7); g.fill(); }
}
function drawProp(g, o) {
  const img = IMG[o.prop], M = ASSETS.meta && ASSETS.meta[o.prop]; if (!img || !img.naturalWidth) return;
  const H = o.r * 4.6, sc = M ? H * M.s : H / img.naturalHeight, ax = M ? M.fx * sc : (img.naturalWidth * sc) / 2, ay = M ? M.fy * sc : img.naturalHeight * sc;
  // 캐릭터가 뒤에 있으면 반투명
  const p = G.p, behind = p.y < o.y && Math.abs(p.x - o.x) < o.r * 1.6 && o.y - p.y < H * 0.9;
  g.save(); if (behind) g.globalAlpha = 0.55;
  g.drawImage(img, o.x - ax, o.y + o.r * 0.35 - ay, img.naturalWidth * sc, img.naturalHeight * sc); if (GLR.occOn && g === GLR.a) occDraw(g, img, [o.x - ax, o.y + o.r * 0.35 - ay, img.naturalWidth * sc, img.naturalHeight * sc]); g.restore();
}
// 3D 벽: 정면은 벽면 그림의 가운데 띠, 옆·아래는 윗면 질감 + 그림자·하이라이트
function drawWalls3D(g, th, fr, tp) {
  const sw = fr.naturalWidth, sh = Math.min(fr.naturalHeight, sw * (BT + 20) / RW);
  g.drawImage(fr, 0, (fr.naturalHeight - sh) * 0.55, sw, sh, 0, -20, RW, BT + 20);
  const top = g.createLinearGradient(0, 0, 0, 30); top.addColorStop(0, "rgba(0,0,0,0.6)"); top.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = top; g.fillRect(0, 0, RW, 30);
  const pc = document.createElement("canvas"); pc.width = pc.height = 200; pc.getContext("2d").drawImage(tp, 0, 0, 200, 200);
  const pat = g.createPattern(pc, "repeat");
  for (const [x, y, w, h] of [[0, BT, BL, RH - BT], [BR, BT, RW - BR, RH - BT], [0, BB, RW, RH - BB]]) { g.fillStyle = pat; g.fillRect(x, y, w, h); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(x, y, w, h); }
  // 벽 윗면 턱
  const capG = g.createLinearGradient(0, BT - 18, 0, BT); capG.addColorStop(0, "rgba(255,240,210,0.22)"); capG.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = capG; g.fillRect(BL - 6, BT - 18, BR - BL + 12, 18);
  // 안쪽 모서리 빛·그림자
  const sg = g.createLinearGradient(0, BT, 0, BT + 70); sg.addColorStop(0, "rgba(0,0,0,0.7)"); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.fillRect(BL, BT, BR - BL, 70);
  const lg = (x0, x1) => { const gg = g.createLinearGradient(x0, 0, x1, 0); gg.addColorStop(0, "rgba(0,0,0,0.55)"); gg.addColorStop(1, "rgba(0,0,0,0)"); return gg; };
  g.fillStyle = lg(BL, BL + 50); g.fillRect(BL, BT, 50, BB - BT); g.fillStyle = lg(BR, BR - 50); g.fillRect(BR - 50, BT, 50, BB - BT);
  g.fillStyle = "rgba(255,240,210,0.2)"; g.fillRect(BL - 5, BT, 5, BB - BT); g.fillRect(BR, BT, 5, BB - BT); g.fillRect(BL, BB, BR - BL, 4);
  g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 3; g.strokeRect(BL, BT, BR - BL, BB - BT);
  // 모서리 기둥 (층 소품 그림)
  const pr = IMG["prop_" + th.room + "a"], M = ASSETS.meta && ASSETS.meta["prop_" + th.room + "a"];
  for (const [x, y] of [[BL - 4, BT + 6], [BR + 4, BT + 6]]) {
    if (pr && pr.naturalWidth && M) { const H = 150, sc = H * M.s; g.drawImage(pr, x - M.fx * sc, y - M.fy * sc, pr.naturalWidth * sc, pr.naturalHeight * sc); }
  }
}
function drawPillar(g, o, th) {
  g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.ellipse(o.x + 10, o.y + 14, o.r * 1.05, o.r * 0.7, 0, 0, 7); g.fill();
  if (o.kind === "crystal") {
    for (let i = 0; i < 4; i++) { const a = -1.9 + i * 0.5; g.fillStyle = i % 2 ? "#9fe8ff" : "#5fb8e0"; g.beginPath(); g.moveTo(o.x + Math.cos(a) * o.r * 1.4, o.y + Math.sin(a) * o.r * 1.6); g.lineTo(o.x - 12 + i * 8, o.y + 8); g.lineTo(o.x + 4 + i * 8, o.y + 8); g.fill(); }
    g.fillStyle = "rgba(220,250,255,0.6)"; g.beginPath(); g.arc(o.x - 6, o.y - 10, 6, 0, 7); g.fill(); return;
  }
  const gr = g.createRadialGradient(o.x - o.r * 0.4, o.y - o.r * 0.4, 4, o.x, o.y, o.r);
  gr.addColorStop(0, shade(th.wall[0], 55)); gr.addColorStop(0.7, shade(th.wall[1], 10)); gr.addColorStop(1, shade(th.wall[2], 0));
  g.fillStyle = gr; g.beginPath(); g.arc(o.x, o.y, o.r, 0, 7); g.fill();
  g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 3; g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.15)"; g.lineWidth = 2; g.beginPath(); g.arc(o.x, o.y, o.r * 0.65, 0, 7); g.stroke();
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  return `rgb(${clamp(r | 0, 0, 255)},${clamp(g | 0, 0, 255)},${clamp(b | 0, 0, 255)})`;
}

// ---------- 충돌 ----------
function collide(u) {
  const inDoor = doorZone(u);
  const minX = BL + u.r, maxX = BR - u.r, minY = BT + u.r * 0.6, maxY = BB - u.r * 0.6;
  if (!inDoor) { u.x = clamp(u.x, minX, maxX); u.y = clamp(u.y, minY, maxY); }
  else { if (inDoor === "N" || inDoor === "S") u.x = clamp(u.x, RW / 2 - DOOR_W / 2 + u.r * 0.5, RW / 2 + DOOR_W / 2 - u.r * 0.5); else u.y = clamp(u.y, RH / 2 + 20 - DOOR_W / 2 + u.r * 0.5, RH / 2 + 20 + DOOR_W / 2 - u.r * 0.5); u.x = clamp(u.x, 8, RW - 8); u.y = clamp(u.y, 30, RH - 8); }
  for (const o of G.cur.obs) { const dx = u.x - o.x, dy = u.y - o.y, d = Math.hypot(dx, dy), m = o.r + u.r * 0.8; if (d < m && d > 0.01) { u.x = o.x + (dx / d) * m; u.y = o.y + (dy / d) * m; if (Math.abs(dx) < 6) u.x += (dx >= 0 ? 2 : -2); else if (Math.abs(dy) < 6) u.y += (dy >= 0 ? 2 : -2); } } // 11-19 문 정가운데에서 기둥에 똑바로 부딪히면(6px 이내) 살짝 비켜 줌
}
// 열린 문 앞 통로에 있으면 그 방향
function doorZone(u) {
  if (u.kind !== "hero" || u.team !== 0 || roomLocked() || G.mode === "duel") return null;
  const L = G.cur.links;
  if (L.N && Math.abs(u.x - RW / 2) < DOOR_W / 2 && u.y < BT + 40) return "N";
  if (L.S && Math.abs(u.x - RW / 2) < DOOR_W / 2 && u.y > BB - 40) return "S";
  if (L.W && Math.abs(u.y - (RH / 2 + 20)) < DOOR_W / 2 && u.x < BL + 40) return "W";
  if (L.E && Math.abs(u.y - (RH / 2 + 20)) < DOOR_W / 2 && u.x > BR - 40) return "E";
  return null;
}
const blocked = (x, y) => x < BL || x > BR || y < BT || y > BB || G.cur.obs.some((o) => Math.hypot(o.x - x, o.y - y) < o.r);

// ---------- 효과 발동 ----------
function foesOf(team) { return G.units.filter((u) => u.alive && u.team !== team && (u.kind === "mob" || u.kind === "boss" || u.kind === "hero") && !(u.spawnT > 0)); }
// ---- 위치 지정 스킬 (사용자 요청 11-12): 설치·낙하·순간이동 스킬은 끌어서 자리 고르기 ----
function isPlaceFx(fx) { return !!fx && fx.some((f) => (f.t === "zone" && f.at !== "self") || (f.t === "strike" && !(f.scatter >= 9999)) || f.t === "blink"); }
// 구르기 (11-16, 모든 캐릭터 공통 회피): 움직이는 방향(없으면 커서 쪽)으로 짧게 굴러 잠깐 무적
const DODGE_CD = 0.5; // 11-17 사용자: 대시(구르기)에 아주 짧은 대기 시간 (1.1→0.5초)
function dodge(u, at) {
  if (u.dash || (u.cd.D || 0) > 0) return false;
  let ax = at ? at.x - u.x : 0, ay = at ? at.y - u.y : 0;
  if (u === G.p && (input.kx || input.ky)) { ax = input.kx; ay = input.ky; } else if (!at) { const ap = aimPoint(u); ax = ap.x - u.x; ay = ap.y - u.y; }
  const L = Math.hypot(ax, ay) || 1, D = 190;
  castFx(u, [{ t: "dash", dist: D, d: 0, inv: 0.3, col: "#cfe8ff" }], 1, { x: u.x + (ax / L) * D, y: u.y + (ay / L) * D });
  u.cd.D = DODGE_CD; if (u.cdMax) u.cdMax.D = DODGE_CD; if (u === G.p) { u.dodgeAt = G.time; u.dodgeN = (u.dodgeN || 0) + 1; } return true;
}
function slotFx(u, slot) { if (slot === "A") return u.active ? ACTIVES[u.active.k].fx : null; const s = u.sk && u.sk[slot]; return s ? s.fx : null; }
function placeInfo(u, slot) {
  const fx = slotFx(u, slot) || [], area = 1 + ((u.m && u.m.area) || 0); let r = 90, range = 560;
  for (const f of fx) { if (f.t === "zone") r = Math.max(r, f.r * area); if (f.t === "strike") r = Math.max(r, (f.r + (f.scatter || 0) * 0.6) * area); if (f.t === "blink") { range = f.dist; r = Math.max(r, 60); } if (f.t === "nova" && fx.some((x) => x.t === "blink")) r = Math.max(r, f.r * area); }
  return { r, range };
}
function aimClamp(u, x, y, range) { const d = Math.hypot(x - u.x, y - u.y); if (d > range) { x = u.x + ((x - u.x) / d) * range; y = u.y + ((y - u.y) / d) * range; } return clampPt({ x, y }); }
function startAim(slot) {
  if (!G || G.paused || !G.p || !G.p.alive) return false;
  const u = G.p; if (!isPlaceFx(slotFx(u, slot))) return false;
  if ((slot === "A" && (!u.active || u.cd.A > 0)) || (slot !== "A" && u.cd[slot] > 0)) { UI.flashSlot(slot); return true; }
  const pi = placeInfo(u, slot); input.aim = { slot, r: pi.r, range: pi.range, x: input.mx || u.x, y: input.my || u.y, drag: false }; return true;
}
function finishAim(cancel) {
  const a = input.aim; input.aim = null; if (!a || cancel || !G || G.paused) return;
  const p = aimClamp(G.p, a.x, a.y, a.range);
  if (NET.client) { NET.sendKey(a.slot, p); return; }
  if (!useSkill(G.p, a.slot, p)) UI.flashSlot(a.slot);
}
function drawAim(g) {
  const a = input.aim; if (!a || !G || !G.p) return; const u = G.p;
  if (!a.drag && !input.touch) { a.x = input.mx; a.y = input.my; }
  const p = aimClamp(u, a.x, a.y, a.range), t = G.time;
  g.save();
  g.setLineDash([10, 8]); g.lineDashOffset = -t * 30; g.strokeStyle = "rgba(255,226,160,0.45)"; g.lineWidth = 2; g.beginPath(); g.ellipse(u.x, u.y, a.range, a.range * 0.7, 0, 0, 7); g.stroke();
  g.setLineDash([]); g.strokeStyle = "rgba(255,210,120,0.8)"; g.beginPath(); g.moveTo(u.x, u.y - 20); g.lineTo(p.x, p.y); g.stroke();
  const pul = 1 + Math.sin(t * 8) * 0.04; g.fillStyle = "rgba(255,200,90,0.18)"; g.strokeStyle = "#ffd27a"; g.lineWidth = 3; g.shadowColor = "#ffb547"; g.shadowBlur = 14;
  g.beginPath(); g.ellipse(p.x, p.y, a.r * pul, a.r * 0.7 * pul, 0, 0, 7); g.fill(); g.stroke();
  g.shadowBlur = 0; g.fillStyle = "#fff3c8"; g.beginPath(); g.arc(p.x, p.y, 5, 0, 7); g.fill();
  g.restore();
}
// 즉사기는 확률로만 (사용자 요청 11-12: 무조건 즉사 금지) — 한 번 맞을 때마다 25%
const EXEC_CHANCE = 0.25;
function aimPoint(u) {
  // 타겟팅: 대상을 고정하면 공격·스킬이 그 적에게 (사용자 요청 11-11)
  if (u === G.p && G.target && G.target.alive) return { x: G.target.x, y: G.target.y };
  const c = ctrlOf(u);
  if (c && !c.touch && (c.mouseT > 0 || c.mt)) return { x: c.mx, y: c.my };
  const foes = foesOf(u.team).filter((f) => !(f.kind === "hero" && hasBuff(f, "stealth")));
  let best = null, bd = 1e9; for (const f of foes) { const d = dist(u, f); if (d < bd) { bd = d; best = f; } }
  if (best) return { x: best.x, y: best.y };
  return { x: u.x + Math.cos(u.face) * 200, y: u.y + Math.sin(u.face) * 200 };
}
// 효과 그림 키: 캐릭터 스킬 = cvfx_sk_<캐릭터>_<번호>, 보스 액티브 = cvfx_bx_*, 그 밖 = 가장 가까운 속성(cvfx_el_<속성>_burst/field/strike)
function nearEl(col) {
  if (!col || col[0] !== "#") return null; const n = parseInt(col.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  let best = null, bd = 1e9; for (const e of ACT_EL) { const m = parseInt(e.col.slice(1), 16), d = (r - (m >> 16)) ** 2 + (gg - ((m >> 8) & 255)) ** 2 + (b - (m & 255)) ** 2; if (d < bd) { bd = d; best = e.k; } }
  return best;
}
function sigOf(list, base) {
  if (base) return base;
  const f = list.find((x) => x.col) || {}; const el = nearEl(f.col); return el ? "cvfx_el_" + el + "_" : null;
}
function sigImg(vk, t) {
  if (!vk) return null; const k = vk.endsWith("_") ? vk + (t === "zone" ? "field" : t === "strike" ? "strike" : "burst") : vk;
  return IMG[k] && IMG[k].naturalWidth ? k : null;
}
function yokaiEl(t) {
  if (t.kind === "boss") { const d = BOSSES[t.type]; const fl = d && d.fl ? d.fl : FLOORS.findIndex((f) => f.boss === t.type) + 1; return YOKAI_EL[((fl || 1) - 1) % 5]; }
  if (G.mode === "story") return YOKAI_EL[(G.floor - 1) % 5];
  if (G.mode === "endless") return YOKAI_EL[((G.eFloor || 1) - 1) % 5];
  return null;
}
function affinity(el, t) { const Y = el && yokaiEl(t); if (!Y) return 1; return Y.strong.includes(el) ? 1 + AFF_UP : Y.weak.includes(el) ? 1 - AFF_DOWN : 1; }
// 11-20 피해 기록(로그라이크 인기작의 판 결과 '피해 기록판'): 기술마다 이름표(DMG_TAG) — 시전 중에 만든 투사체·장판·예고·구슬·예약 효과에 붙여 나중에 맞혀도 그 기술로 셈
let DMG_TAG = null;
function castFx(u, list, pow, aim, opt = {}) {
  const el = opt.el || (u.kind === "hero" ? (opt.basic ? u.el : nearEl((list.find((x) => x.col) || {}).col) || u.el) : null), prevEl = G.castEl; G.castEl = el;
  const prevTag = DMG_TAG, tag = opt.tag || (opt.basic ? "기본 공격" : null) || prevTag, n0 = [G.projs.length, G.zones.length, G.tele.length, G.orbs.length, G.timers.length]; DMG_TAG = tag;
  try { castFx0(u, list, pow, aim, Object.assign(opt, { el })); } finally {
    G.castEl = prevEl; DMG_TAG = prevTag;
    if (tag) { [G.projs, G.zones, G.tele, G.orbs].forEach((arr, i) => { for (let j = n0[i]; j < arr.length; j++) if (arr[j] && !arr[j].tag) arr[j].tag = tag; });
      for (let j = n0[4]; j < G.timers.length; j++) { const tm = G.timers[j], f = tm.fn; if (!tm.tag) { tm.tag = tag; tm.fn = () => { const pv = DMG_TAG; DMG_TAG = tag; try { f(); } finally { DMG_TAG = pv; } }; } } }
  }
}
function castFx0(u, list, pow, aim, opt = {}) {
  if (opt.vk && !list.some((x) => x.t === "nova" || x.t === "zone" || x.t === "strike" || (x.fx && x.fx.t === "nova"))) {
    const k = sigImg(opt.vk, "burst"); if (k) G.fx.push({ k: "sig", key: k, x: u.x, y: u.y - 20, r: 120, t: 0, max: 0.6 });
  }
  for (const fx of list) {
    if (fx.delay) { schedule(fx.delay, () => { if (!u.alive) return; const pe = G.castEl; G.castEl = opt.el; try { runFx(u, fx, pow, aimPoint(u), opt); } finally { G.castEl = pe; } }); continue; }
    runFx(u, fx, pow, aim, opt);
  }
}
function schedule(t, fn) { G.timers.push({ t, fn }); }
function runFx(u, fx, pow, aim, opt) {
  const A = atkOf(u) * pow, ang = Math.atan2(aim.y - u.y, aim.x - u.x), area = 1 + ((u.m && u.m.area) || 0), team = u.team;
  u.face = ang; if (Math.abs(Math.cos(ang)) > 0.2) u.flip = Math.cos(ang) < 0;
  const basic = !!opt.basic;
  switch (fx.t) {
    case "proj": {
      let n = fx.n || 1; if (basic && u.m && u.m.multi) n += Math.min(3, u.m.multi);
      const spread = fx.spread != null ? fx.spread : n > 1 ? 0.25 * (n - 1) : 0;
      for (let i = 0; i < n; i++) {
        const a = ang + (n > 1 ? (spread >= 6 ? (i / n) * Math.PI * 2 : -spread / 2 + (spread * i) / (n - 1)) : 0);
        G.projs.push({ x: u.x + Math.cos(a) * 20, y: u.y - 16 + Math.sin(a) * 20, vx: Math.cos(a) * fx.spd, vy: Math.sin(a) * fx.spd, r: fx.r, team, src: u, d: A * fx.d, life: fx.life, pierce: fx.pierce || 0,
          hit: new Set(), home: fx.home || 0, explode: fx.explode ? fx.explode * area : 0, burn: fx.burn || (basic && u.m && u.m.burn ? 3 + 1.5 * (u.m.burn - 1) : 0), slow: fx.slow || (basic && u.m && u.m.chill ? Math.min(0.75, 0.35 + 0.1 * (u.m.chill - 1)) : 0),
          stun: fx.stun || 0, knock: fx.knock || 0, pull: fx.pull, drain: fx.drain || 0, col: fx.col, alt: fx.alt && i % 2 ? fx.alt : null, shape: fx.shape || "orb", basic, ang: a, cid: u.kind === "hero" ? u.id : null, el: G.castEl });
      }
      sfx(wSfx(u, "shot")); break;
    }
    case "arc": {
      const R = fx.r * area, a0 = fx.aim ? Math.atan2(aimPoint(u).y - u.y, aimPoint(u).x - u.x) : ang;
      for (const f of foesOf(team)) {
        const d = Math.hypot(f.x - u.x, f.y - u.y);
        if (d < R + f.r && angDiff(Math.atan2(f.y - u.y, f.x - u.x), a0) < fx.ang / 2 + Math.atan2(f.r, Math.max(d, 1))) hit(u, f, A * fx.d, { burn: basic && u.m.burn ? 3 + 1.5 * (u.m.burn - 1) : 0, slow: basic && u.m.chill ? Math.min(0.75, 0.35 + 0.1 * (u.m.chill - 1)) : 0, crit: fx.crit, basic, knock: basic ? 30 : 60, from: u }), G._ah = 1;
      }
      if (u === G.p && G._ah) { const kk = basic ? 4 : 7; G.hitStop = Math.max(G.hitStop || 0, basic ? 0.03 : 0.045); G.kx = (G.kx || 0) + Math.cos(a0) * kk; G.ky = (G.ky || 0) + Math.sin(a0) * kk; } G._ah = 0; // 11-18 근접 타격감
      G.fx.push({ k: "slash", x: u.x, y: u.y - 14, r: R, a: a0, w: fx.ang, t: 0, max: 0.22, col: fx.col, cid: u.kind === "hero" ? u.id : null });
      sfx(wSfx(u, "slash")); break;
    }
    case "dash": {
      const dd = Math.min(fx.dist, Math.hypot(aim.x - u.x, aim.y - u.y) || fx.dist, fx.dist);
      const T = 0.18; u.dash = { vx: Math.cos(ang) * (Math.max(dd, fx.dist * 0.6) / T), vy: Math.sin(ang) * (Math.max(dd, fx.dist * 0.6) / T), t: T, d: A * fx.d, hit: new Set(), col: fx.col };
      if (fx.inv) u.invT = Math.max(u.invT, fx.inv); u.tx = null;
      sfx("dash"); break;
    }
    case "blink": {
      let dx = aim.x - u.x, dy = aim.y - u.y, d = Math.hypot(dx, dy) || 1; const go = Math.min(d, fx.dist);
      let nx = u.x + (dx / d) * go, ny = u.y + (dy / d) * go;
      for (let k = 0; k < 10 && blocked(nx, ny); k++) { nx -= (dx / d) * 20; ny -= (dy / d) * 20; }
      G.fx.push({ k: "puff", x: u.x, y: u.y, t: 0, max: 0.4, col: "#cbbcff" });
      u.x = nx; u.y = ny; collide(u); u.tx = null; u.invT = Math.max(u.invT, 0.15);
      G.fx.push({ k: fx.leap ? "land" : "puff", x: u.x, y: u.y, t: 0, max: 0.45, col: "#cbbcff" });
      sfx("blink"); break;
    }
    case "nova": {
      const R = fx.r >= 9999 ? 9999 : fx.r * area;
      const cx = u.x, cy = u.y;
      for (const f of foesOf(team)) if (R >= 9999 || Math.hypot(f.x - cx, f.y - cy) < R + f.r) {
        hit(u, f, A * fx.d, { stun: fx.stun, slow: fx.slow, slowDur: fx.slowDur, knock: fx.knock || 0, from: u, burn: fx.burn, drain: fx.drain, mark: fx.mark });
      }
      { const sk = sigImg(opt.vk, "nova"); if (sk) G.fx.push({ k: "sig", key: sk, x: cx, y: cy, r: R >= 9999 ? 700 : R, t: 0, max: 0.6 });
        else G.fx.push({ k: "ring", x: cx, y: cy, r: R >= 9999 ? 1000 : R, t: 0, max: 0.4, col: fx.col, cid: u.kind === "hero" ? u.id : null }); }
      if (R > 300) G.shake = Math.max(G.shake, 10);
      sfx("boom"); break;
    }
    case "zone": {
      const at = fx.at === "self" ? { x: u.x, y: u.y } : clampPt(aim);
      G.zones.push({ x: at.x, y: at.y, r: fx.r * area, dur: fx.dur, t: 0, dps: A * fx.dps, slow: fx.slow || 0, guard: fx.guard || 0, execute: fx.execute || 0, team, src: u, follow: fx.follow ? u : null, col: fx.col, rune: fx.rune, tick: 0, vk: sigImg(opt.vk, "zone"), el: G.castEl });
      sfx("zone"); break;
    }
    case "strike": {
      const n = fx.n || 1, foes = foesOf(team);
      for (let i = 0; i < n; i++) {
        let x, y;
        if (fx.scatter >= 9999) { if (fx.targetEnemies && foes.length) { const f = foes[i % foes.length]; x = f.x + rnd(-30, 30); y = f.y + rnd(-30, 30); } else { x = rnd(BL + 60, BR - 60); y = rnd(BT + 60, BB - 60); } }
        else if (fx.scatter) { const a = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * fx.scatter; x = aim.x + Math.cos(a) * rr; y = aim.y + Math.sin(a) * rr; }
        else { x = aim.x; y = aim.y; }
        const p = clampPt({ x, y });
        G.tele.push({ shape: "circle", x: p.x, y: p.y, r: fx.r * area, t: -(fx.stagger || 0) * i, max: fx.delay || 0.5, team, src: u, dmg: A * fx.d, stun: fx.stun, col: fx.col, bolt: fx.bolt, taeguk: fx.taeguk, friendly: team === 0 || u.kind === "hero", vk: sigImg(opt.vk, "strike"), el: G.castEl });
      }
      break;
    }
    case "buff": {
      const b = { dur: fx.dur, t: fx.dur, col: fx.col };
      for (const k of ["atk", "as", "spd", "dr", "inv", "stealth", "ls", "aura", "regen", "thorns", "summonBoost"]) if (fx[k]) b[k] = fx[k];
      if (fx.crit) u.nextCrit = true;
      u.buffs.push(b); G.fx.push({ k: "aura", x: u.x, y: u.y, t: 0, max: 0.6, col: fx.col || "#fff", u });
      sfx("buff"); break;
    }
    case "heal": {
      if (fx.pct) healUnit(u, u.maxHp * fx.pct);
      if (fx.shield) u.shield = Math.max(u.shield, u.maxHp * fx.shield);
      G.fx.push({ k: "aura", x: u.x, y: u.y, t: 0, max: 0.6, col: fx.shield ? "#9fd8ff" : "#7fff9f", u });
      sfx("heal"); break;
    }
    case "summon": { for (let i = 0; i < fx.n; i++) addSummon(u, fx.kind, fx.dur, i); sfx("buff"); break; }
    case "chain": {
      if (fx.chance && Math.random() > fx.chance) break;
      let from = { x: u.x, y: u.y - 16 }; const done = new Set();
      for (let i = 0; i < fx.n; i++) {
        let best = null, bd = fx.range; for (const f of foesOf(team)) { if (done.has(f)) continue; const d = Math.hypot(f.x - from.x, f.y - from.y); if (d < bd) { bd = d; best = f; } }
        if (!best) break; done.add(best);
        G.fx.push({ k: "bolt", x: from.x, y: from.y, x2: best.x, y2: best.y - 16, t: 0, max: 0.25, col: fx.col });
        hit(u, best, A * fx.d, { stun: fx.stun });
        from = { x: best.x, y: best.y - 16 };
      }
      if (done.size) sfx("zap"); break;
    }
    case "beam": {
      const a0 = fx.aim ? Math.atan2(aimPoint(u).y - u.y, aimPoint(u).x - u.x) : ang;
      const go = () => {
        const x2 = u.x + Math.cos(a0) * fx.len, y2 = u.y + Math.sin(a0) * fx.len;
        for (const f of foesOf(team)) if (segDist(f.x, f.y, u.x, u.y, x2, y2) < fx.w / 2 + f.r) hit(u, f, A * fx.d, { stun: fx.stun, drain: fx.drain, knock: 40, from: u });
        G.fx.push({ k: "beam", x: u.x, y: u.y - 14, a: a0, len: fx.len, w: fx.w, t: 0, max: 0.3, col: fx.col });
        if (fx.w > 60) G.shake = Math.max(G.shake, 8); sfx("zap");
      };
      if (fx.delay) { G.fx.push({ k: "beamTele", u, a: a0, len: fx.len, w: fx.w, t: 0, max: fx.delay, col: fx.col }); schedule(fx.delay, () => u.alive && go()); } else go();
      break;
    }
    case "orbit": { for (let i = 0; i < fx.n; i++) G.orbs.push({ owner: u, i, n: fx.n, r: fx.r, d: A * fx.d, dur: fx.dur, t: 0, col: i % 2 && fx.alt ? fx.alt : fx.col, seek: fx.seek, cds: new Map(), a: 0, free: false, x: u.x + Math.cos((i / fx.n) * 6.283) * fx.r, y: u.y - 20 + Math.sin((i / fx.n) * 6.283) * fx.r * 0.8 }); /* 11-16 버그: 만들자마자 그리면 위치가 없어 화면 그리기가 멈춤 */ sfx("buff"); break; }
    case "repeat": { for (let i = 0; i < fx.n; i++) schedule(i * fx.gap, () => { if (!u.alive) return; const pe = G.castEl; G.castEl = opt.el; try { runFx(u, fx.fx, pow, aimPoint(u), opt); } finally { G.castEl = pe; } }); break; }
    case "flurry": {
      const targets = foesOf(team).sort((a, b) => dist(u, a) - dist(u, b)).slice(0, fx.n);
      if (!targets.length) break;
      u.invT = Math.max(u.invT, targets.length * fx.gap + 0.3);
      targets.forEach((f, i) => schedule(i * fx.gap, () => {
        if (!f.alive || !u.alive) return;
        G.fx.push({ k: "puff", x: u.x, y: u.y, t: 0, max: 0.3, col: "#ff8fa3" });
        const a = Math.random() * 6.28; u.x = f.x + Math.cos(a) * (f.r + 30); u.y = f.y + Math.sin(a) * (f.r + 30); collide(u);
        hit(u, f, A * fx.d, {}); G.fx.push({ k: "slash", x: f.x, y: f.y - 14, r: 70, a: a + Math.PI, w: 2.4, t: 0, max: 0.2, col: "#ffd1da" }); sfx("slash");
      }));
      break;
    }
  }
}
function clampPt(p) { return { x: clamp(p.x, BL + 20, BR - 20), y: clamp(p.y, BT + 20, BB - 20) }; }
function segDist(px, py, x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1, l = dx * dx + dy * dy; let t = l ? ((px - x1) * dx + (py - y1) * dy) / l : 0; t = clamp(t, 0, 1); return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)); }

// ---------- 피해 ----------
function hit(src, t, base, o = {}) {
  if (!t.alive || base <= 0 && !o.stun && !o.slow && !o.knock) { if (base <= 0) applyStatus(src, t, o); return; }
  const owner = src.owner || src;
  let crit = !!o.crit || Math.random() < (owner.crit || 0);
  if (owner.nextCrit && owner.kind === "hero" && !o.dot) { crit = true; owner.nextCrit = false; }
  let d = base * (crit ? owner.critdmg || 1.6 : 1) * rnd(0.92, 1.08);
  if (t.markT > 0) d *= 1 + t.mark;
  if (t.kind === "boss" && owner.m && owner.m.bossDmg) d *= 1 + owner.m.bossDmg;
  if (owner.team === 0 && t.team === 1) {
    const el = o.el || G.castEl || (owner.kind === "hero" ? owner.el : null), af = affinity(el, t); d *= af;
    if (af > 1 && !o.dot && (t.affT || 0) < G.time) { t.affT = G.time + 0.8; addText(t.x + 20, t.y - t.r - 52, "약점!", yokaiEl(t).col, 18); }
    if (t.kind === "boss" && SAVE && SAVE.kb && SAVE.kb[t.type] >= 10) d *= 1.05;
  }
  const dealt = damage(t, d, owner, crit, o);
  if (G.p && t.team === 1 && (owner === G.p || owner.owner === G.p || src.owner === G.p) && dealt > 0) { const k = o.tag || src.tag || DMG_TAG || (src.kind === "pet" || owner.kind === "pet" ? "펫" : src !== G.p && owner !== G.p ? "소환수" : o.dot ? "지속 피해" : o.thorns ? "반사" : "강화·특성"); (G.dmgBy = G.dmgBy || {})[k] = (G.dmgBy[k] || 0) + dealt; }
  if (dealt > 0 && owner.kind === "hero") {
    const ls = (owner.ls || 0) + buffSum(owner, "ls"); if (ls && !o.dot) healUnit(owner, dealt * ls, true);
    if (o.drain) healUnit(owner, owner.maxHp * o.drain, true);
    if (crit && owner.m && owner.m.critArc && !o.arc) runFx(owner, { t: "chain", n: 2 + owner.m.critArc, d: 0.8 + 0.3 * (owner.m.critArc - 1), range: 320, col: "#fff27a" }, 1, t, { });
    if (owner.m && owner.m.execute && t.kind === "mob" && t.alive && t.hp < t.maxHp * owner.m.execute && Math.random() < EXEC_CHANCE) { damage(t, t.hp + 1, owner, false, { quiet: true }); }
  }
  applyStatus(src, t, o);
}
function applyStatus(src, t, o) {
  if (!t.alive) return;
  const bossRes = t.kind === "boss" ? 0.35 : t.kind === "hero" ? 0.6 : 1;
  if (o.stun) t.stunT = Math.max(t.stunT, o.stun * bossRes);
  if (o.slow) { t.slow = Math.max(t.slowT > 0 ? t.slow : 0, o.slow * (t.kind === "boss" ? 0.6 : 1)); t.slowT = Math.max(t.slowT, o.slowDur || 1.2); }
  if (o.burn) t.burn = { dps: atkOf(src.owner || src) * 0.6 / 3 * (o.burn / 3) * 3 / o.burn, t: o.burn, src: src.owner || src };
  if (o.mark) { t.mark = o.mark; t.markT = 5; }
  if (o.knock && t.kind !== "boss") { t.kbSrc = src && (src.owner || src); const f = o.from || src, a = Math.atan2(t.y - f.y, t.x - f.x); const k = o.knock * (t.kind === "hero" ? 0.5 : 1) * (t.elite ? 0.5 : 1); t.kx += Math.cos(a) * k * 6; t.ky += Math.sin(a) * k * 6; }
  if (o.pull && t.kind !== "boss") { const f = src.owner || src, a = Math.atan2(f.y - t.y, f.x - t.x), dd = Math.max(0, dist(f, t) - 70); t.x += Math.cos(a) * dd * 0.85; t.y += Math.sin(a) * dd * 0.85; collide(t); }
}
function damage(t, d, src, crit, o = {}) {
  if (!t.alive) return 0;
  if (G.mode === "duel" && G.duel && G.duel.state !== "fight" && t.kind === "hero") return 0; /* 11-16 버그: 준비 시간에 쓰러지면 결투가 안 끝남 */
  if (t.guardT > 0) { d *= 0.2; if (Math.random() < 0.3) addText(t.x, t.y - t.r * 2, "막음", "#d9b27a", 16); }
  if (t.kind === "hero") {
    if (t.invT > 0 || hasBuff(t, "inv")) {
      if (t === G.p && src && src !== t && t.dodgeAt != null && G.time - t.dodgeAt < 0.24 && t.pdUsed !== t.dodgeAt) { // 11-18 완벽 회피: 맞기 직전 구르기 → 시간 느려짐 + 공격력 3초
        t.pdUsed = t.dodgeAt; G.slowT = Math.max(G.slowT || 0, 0.5); t.buffs = t.buffs.filter((b) => !b.pd); t.buffs.push({ pd: true, atk: 0.3, t: 3, dur: 3, col: "#9fe8ff" });
        addText(t.x, t.y - 90, "완벽 회피!", "#9fe8ff", 28); sfx("blink"); G.fx.push({ k: "ring", x: t.x, y: t.y, r: 170, t: 0, max: 0.5, col: "#9fe8ff" }); G.kx = (G.kx || 0) * 0.3;
        SAVE.stats.perfectDodge = (SAVE.stats.perfectDodge || 0) + 1; if (typeof UI !== "undefined" && UI.tip) UI.tip("pdodge"); return 0;
      }
      if (!o.quiet) addText(t.x, t.y - 60, "무적", "#ffe9a0", 16); return 0;
    }
    d *= drMul(t); if (curseOn("blood") && t.team === 0) d *= 1.25;
    if (t === G.p && d > 0 && assistOn()) d *= 1 - assistDr(); // 도움 모드
    if (t.shield > 0) { const s = Math.min(t.shield, d); t.shield -= s; d -= s; }
    t.hp -= d; t.hitT = 0.1; if (d > t.maxHp * 0.02) t.hurtT = 0.28;
    if (t === G.p && d > 0) { const hn = (src && (src.name || (src.def && src.def.name))) || "함정·지형"; (G.hurtBy = G.hurtBy || {})[hn] = (G.hurtBy[hn] || 0) + d; G.lastHurt = hn; G.lastHurtSrc = src || null; }
    if (t === G.p) { G.dmgIn = (G.dmgIn || 0) + d; G.hpMin = Math.min(G.hpMin == null ? 1 : G.hpMin, Math.max(0, t.hp) / t.maxHp); } // 11-19 밸런스 측정
    if (src && src.affix === "vamp" && src.alive && src.maxHp) { src.hp = Math.min(src.maxHp, src.hp + d * 0.6); if (Math.random() < 0.4) addText(src.x, src.y - src.r - 30, "+" + Math.round(d * 0.6), "#ff4d6d", 15); } // 엘리트 특성: 흡혈
    if (t === G.p && src && src !== t) G.lastHit = src.kind === "boss" ? src.name : (src.def && src.def.name) || G.lastHit; // 11-18 주모 대사: 누구한테 당했나
    if (t === G.p) { G.stageHit = true; G.shake = Math.max(G.shake, 6); sfx("hurt"); if (d > t.maxHp * 0.08) { G.hitStop = Math.max(G.hitStop || 0, 0.06); if (typeof haptic === "function") haptic("light"); } }
    if (!(SAVE && SAVE.settings.dmgNum === false)) addText(t.x + rnd(-14, 14), t.y - 70, Math.round(d) + "", t === G.p ? "#ff6a6a" : "#ffb0b0", 20);
    const th = (t.m.thorns || 0) + buffSum(t, "thorns");
    if (th && src && src.alive && src !== t && (src.kind === "mob" || src.kind === "boss" || src.kind === "hero") && !o.dot && !o.thorn) damage(src, atkOf(t) * th, t, false, { thorn: true });
    if (t.hp <= 0) {
      if (t.revive > 0) { t.revive--; t.hp = t.maxHp * 0.45; t.invT = 2; t.getupT = 0.8; sfx("revive"); addText(t.x, t.y - 90, "다시 일어남!", "#ffb547", 26); G.fx.push({ k: "ring", x: t.x, y: t.y, r: 220, t: 0, max: 0.6, col: "#ffb547" }); return d; }
      t.hp = 0; t.alive = false; heroDown(t);
    }
    return d;
  }
  if (curseOn("armor") && t.team === 1) d *= 0.8;
  if (t.mshield > 0) { const s = Math.min(t.mshield, d); t.mshield -= s; d -= s; if (t.mshield <= 0) addText(t.x, t.y - t.r - 30, "보호막 깨짐!", "#9fd0ff", 18); } // 엘리트 특성: 보호막
  if (t.affix === "iron") d *= 0.7; // 엘리트 특성: 강철 (11-16 밸런스 0.6→0.7)
  t.hp -= d; t.hitT = 0.12;
  if (src && src.team === 0 && !o.dot) sfx(crit ? "crit" : "hit");
  if (src === G.p && !o.dot) { G.combo = (G.comboT > 0 ? G.combo || 0 : 0) + 1; G.comboT = 2.4; G.comboPop = 0.18; if (G.combo > (G.comboMax || 0)) G.comboMax = G.combo; } // 11-18 연격
  if (src === G.p && !o.dot) { const a = Math.atan2(t.y - src.y, t.x - src.x), kk = crit ? 3 : 1.5; G.kx = (G.kx || 0) + Math.cos(a) * kk; G.ky = (G.ky || 0) + Math.sin(a) * kk; }
  if (src === G.p && (crit || t.hp <= 0)) G.hitStop = Math.max(G.hitStop || 0, t.kind === "boss" ? 0.07 : crit ? 0.035 : 0.05);
  if (t.kind === "mob") t.hurtT = 0.2; else if (t.kind === "boss" && (d > t.maxHp * 0.025 || !(t.hurtCd > G.time)) && t.st !== "charge") { t.hurtT = 0.22; t.hurtCd = G.time + 1.4; }
  if (!o.quiet && !(SAVE && SAVE.settings.dmgNum === false)) addText(t.x + rnd(-16, 16), t.y - t.r - 26, Math.round(d) + "", crit ? "#ffd84a" : o.dot ? "#ff9a5a" : "#ffffff", crit ? 26 : 19, crit);
  if (Math.random() < 0.7) spark(t.x, t.y - t.r * 0.6, crit ? "#ffd84a" : "#ffe6b0", crit ? 10 : 5);
  if (!o.dot && G.fx.length < 120) G.fx.push({ k: "hit", x: t.x + rnd(-10, 10), y: t.y - t.r * 0.8, r: crit ? 70 : 44, t: 0, max: 0.18, col: crit ? "#ffd84a" : "#ffe9c0", a: Math.random() * 6.28 });
  if (t.hp <= 0) killUnit(t, src);
  return d;
}
function healUnit(u, v, quiet) { if (!u.alive) return; if (curseOn("wither") && u.team === 0) v *= 0.5; const before = u.hp; u.hp = Math.min(u.maxHp, u.hp + v); if (!quiet && u.hp - before > 1) addText(u.x, u.y - 80, "+" + Math.round(u.hp - before), "#7fff9f", 20); }
function killUnit(t, src) {
  t.alive = false;
  { const DA = ASSETS.meta && ASSETS.meta[t.img] && ASSETS.meta[t.img].anim; G.fx.push({ k: "death", x: t.x, y: t.y, r: t.r, t: 0, max: DA && DA.m.death ? 0.9 : 0.5, img: t.img, flip: t.flip }); }
  if (t.dummy) { SAVE.stats.dummyKills = (SAVE.stats.dummyKills || 0) + 1; const x = t.x, y = t.y; schedule(1.2, () => G && G.cur && G.cur.type === "devskill" && spawnDummy(x, y)); return; }
  for (let i = 0; i < 12; i++) spark(t.x, t.y - t.r * 0.5, "#b9a8ff", 1);
  if (!(SAVE && SAVE.settings.low)) { const nW = t.kind === "boss" ? 26 : 9, wc = t.kind === "boss" ? "255,150,110" : "185,165,255"; for (let i = 0; i < nW; i++) G.parts.push({ ws: 1, wc, x: t.x + rnd(-t.r, t.r) * 0.8, y: t.y - rnd(0, t.r * 1.6), vx: rnd(-40, 40), vy: rnd(-90, -30), t: 0, max: rnd(0.7, 1.4), s: rnd(3, 6) * (t.kind === "boss" ? 1.6 : 1) }); } // 11-17 하이엔드: 쓰러지면 혼불 조각이 흩어져 오름
  if (t.kind === "mob") { sfx(t.affix === "burst" ? "burst" : "kill"); if (t.team === 1 && !t.dummy && SAVE) { SAVE.mk = SAVE.mk || {}; if (!SAVE.mk[t.type]) { G.newMobs = G.newMobs || []; G.newMobs.push(t.type); addText(t.x, t.y - t.r - 60, "📖 도감 등록!", "#9fe0ff", 18); } SAVE.mk[t.type] = (SAVE.mk[t.type] || 0) + 1; } }
  if (t.affix === "burst") G.tele.push({ t: 0, team: 1, src: t, shape: "circle", x: t.x, y: t.y, r: 110 + t.r, max: 0.9, dmg: t.dmg * 0.9, bcol: "#ff8a3c" }); // 엘리트 특성: 폭발 (11-16 밸런스 1.2→0.9)
  if (t.affix === "split" && t.kind === "mob" && !G.client) for (let i = 0; i < 2; i++) { // 엘리트 특성: 분열 — 작은 둘로
    const c = makeMob(t.type, { hp: 1, dmg: 1 }, false); c.hp = c.maxHp = t.maxHp * 0.22; c.dmg = t.dmg * 0.55; c.r = t.r * 0.75; c.exp = 1; c.x = t.x + (i ? 24 : -24); c.y = t.y; c.spawnT = 0.15; c.kx = (i ? 260 : -260); collide(c); G.units.push(c); }
  if (curseOn("grudge") && t.kind === "mob" && t.team === 1) G.tele.push({ t: 0, team: 1, src: t, shape: "circle", x: t.x, y: t.y, r: 95 + t.r, max: 0.9, dmg: t.dmg * 1.3, bcol: "#ff5a3c" }); // 원한의 저주: 0.9초 뒤 폭발
  const p = G.p;
  if (t.kind === "mob" || t.kind === "boss") {
    G.kills++; SAVE.stats.kills = (SAVE.stats.kills || 0) + 1;
    const killer = src && (src.owner || src), ex = (G.curse ? 1.5 : 1) * diffRw() * t.exp * (G.mode === "endless" ? 1 + G.endlessN * 0.03 : 1 + (G.floor - 1) * 0.25);
    for (const h of heroesOf(0)) if (h.alive) gainExp(h, ex * (heroesOf(0).length < 2 || h === killer ? 1 : killer && killer.kind === "hero" ? 0.4 : 0.7));
    const gm = 1 + ((p.m && p.m.gold) || 0);
    if (Math.random() < (t.kind === "boss" ? 1 : t.elite ? 1 : 0.5)) { // 11-19 엽전 줄임: 일반 0.7→0.5·3~6→1~4, 정예 16→8, 보스 70→35
      const amt = Math.round((t.kind === "boss" ? 35 : t.elite ? 8 : rint(1, 4)) * (1 + diffMul().tier * 0.25) * gm * (G.midnight ? 1.3 : 1) * (G.curse ? 1.5 : 1) * diffRw());
      for (let i = 0; i < (t.kind === "boss" ? 6 : 1); i++) G.drops.push({ type: "gold", v: Math.ceil(amt / (t.kind === "boss" ? 6 : 1)), x: t.x + rnd(-40, 40), y: t.y + rnd(-30, 30), vy: -rnd(100, 200), z: 0 });
    }
    const cl = 1 + ((p.m && p.m.coinLuck) || 0);
    if (Math.random() < (t.kind === "boss" ? COIN_DROP.boss : t.elite ? COIN_DROP.elite : COIN_DROP.mob) * cl) G.drops.push({ type: "coin", x: t.x, y: t.y, z: 0 });
    if (t.kind === "mob" && Math.random() < 0.045) G.drops.push({ type: "herb", x: t.x + 10, y: t.y });
    if (t.elite) SAVE.stats.elites = (SAVE.stats.elites || 0) + 1;
    if (t.kind === "mob" && Math.random() < (t.elite ? 0.2 : 0.012)) G.drops.push({ type: "act", k: rollActive(), x: t.x, y: t.y + 10 });
    if (G.mode !== "duel" && Math.random() < (t.kind === "boss" ? PET_DROP.boss : t.elite ? PET_DROP.elite : PET_DROP.mob)) {
      const pool = PET_KEYS.filter((k) => PETS[k].how === "drop"), k = pick(pool), had = SAVE.pets[k];
      if (had) { const n = ITEM_SHARD.dup[PETS[k].rar] || 4; SAVE.ishards = SAVE.ishards || {}; SAVE.ishards["pet:" + k] = (SAVE.ishards["pet:" + k] || 0) + n; UI.toast(`🐾 ${PETS[k].name} 조각 +${n}`, 3500); }
      else { SAVE.pets[k] = 1; UI.toast(`🐾 펫 획득! ${PETS[k].name}`, 4000); } saveGame();
    }
    if (p.m && p.m.corpse && t.kind === "mob") { const cx = t.x, cy = t.y; schedule(0.05, () => { const ck = p.m.corpse; for (const f of foesOf(0)) if (Math.hypot(f.x - cx, f.y - cy) < 120 + 20 * (ck - 1) + f.r) hit(p, f, atkOf(p) * (1 + 0.5 * (ck - 1)), {}); G.fx.push({ k: "ring", x: cx, y: cy, r: 120, t: 0, max: 0.3, col: "#ff8a3d" }); }); }
    if (t.kind === "boss") bossDown(t);
  }
  if (t.kind === "hero" && t.bot) heroDown(t);
}
function gainExp(u, v) {
  if (G.mode === "duel") return;
  u.exp += v;
  while (u.exp >= expNeed(u.lvl)) {
    u.exp -= expNeed(u.lvl); u.lvl++; recalc(u); healUnit(u, u.maxHp * 0.1, true);
    addText(u.x, u.y - 100, "레벨 업!  Lv." + u.lvl, "#c9a0ff", 28); G.fx.push({ k: "ring", x: u.x, y: u.y, r: 160, t: 0, max: 0.6, col: "#c9a0ff" });
    if (u === G.p) { SAVE.stats.maxLevel = Math.max(SAVE.stats.maxLevel || 0, u.lvl); G.levelQueue++; sfx("level"); u.celebT = 0.9; }
    if (!jobCatchUp(u) && u.remote) NET.guestLevelUp(u);
  }
}
// 전직 적용 (11-13): 능력 + 스킬 변화 + 연출. 방장·친구·이어하기 모두 여기로
// 액티브 잠금 (사용자 요청 11-14): 잠그면 바닥의 다른 액티브를 밟아도 바뀌지 않는다. 같은 액티브(레벨 업)는 주울 수 있음
function toggleActLock(u) {
  u = u || G.p; if (!u) return; u.actLock = !u.actLock;
  if (u === G.p) { addText(u.x, u.y - 110, u.actLock ? "🔒 액티브 잠금" : "🔓 액티브 잠금 풀림", u.actLock ? "#ffd27a" : "#9fe8ff", 22); sfx("pick"); }
}
function jobSkills(u, tier, kind) {
  const slots = JOB_SK_SLOT[tier] === "ALL" ? ["Q", "W", "E", "R"] : [JOB_SK_SLOT[tier]];
  for (const sl of slots) { const s0 = u.sk[sl]; if (!s0) continue; const s = { ...s0 }; s.base = s.base || s0.name; s.cd0 = s.cd0 || s0.cd;
    if (kind === "atk") s.pow = (s.pow || 1) * (JOB_SK_SLOT[tier] === "ALL" ? 1.15 : 1.3); else { s.cd = s.cd * (JOB_SK_SLOT[tier] === "ALL" ? 0.88 : 0.78); s.pow = (s.pow || 1) * 1.1; }
    s.jobTag = JOB_SK_TAG[tier]; s.name = `${JOB_SK_TAG[tier]} ${s.base}`; u.sk[sl] = s; }
}
function applyJob(u, opt, quiet) {
  (u.jobs = u.jobs || []).push(opt); u.jobName = opt.name; jobSkills(u, opt.tier != null ? opt.tier : u.jobs.length - 1, opt.kind); recalc(u);
  if (quiet || !G) return;
  G.fx.push({ k: "jobup", x: u.x, y: u.y, t: 0, max: 1.8, col: opt.kind === "atk" ? "#ff7a4a" : "#5fc8ff" });
  for (let i = 0; i < 26; i++) spark(u.x, u.y - 40, opt.kind === "atk" ? "#ffb070" : "#a0e4ff", 1);
  G.shake = Math.max(G.shake, 8); G.slowT = Math.max(G.slowT || 0, 0.5); sfx("level");
  for (const f of foesOf(0)) if (f.alive && Math.hypot(f.x - u.x, f.y - u.y) < 260 && f.kind !== "boss") { f.kx = (f.x - u.x) * 2; f.ky = (f.y - u.y) * 2; f.stunT = Math.max(f.stunT || 0, 0.6); }
  if (u === G.p && UI.jobCut) UI.jobCut(u, opt);
}
// 받아야 할 전직 차수를 빠짐없이 (높은 층에서 시작해 10레벨을 넘겨 시작해도 1차부터 차례로)
function jobCatchUp(u) {
  const owed = JOB_LEVELS.filter((l) => l <= u.lvl).length, have = (u.jobs || []).length;
  if (u === G.p) { G.jobQueue = G.jobQueue || []; const next = have + G.jobQueue.length; for (let t = next; t < owed; t++) G.jobQueue.push(t); return owed > next; }
  if (u.remote && owed > have && u._jobAsk !== have) { u._jobAsk = have; NET.send({ t: "job", tier: have, cid: u.id, lvl: JOB_LEVELS[have] }); return true; }
  return false;
}
function heroDown(u) {
  if (G.mode === "duel") { if (G.duel.state === "fight") { G.duel.state = "roundEnd"; G.duel.t = 2.2; G.duel.wins[u === G.p ? 1 : 0]++; G.banner = { text: u === G.p ? "패배" : "승리!", sub: `${G.duel.wins[0]} : ${G.duel.wins[1]}`, t: 2, boss: u === G.p }; } return; }
  if (u === G.p) SAVE.stats.deaths = (SAVE.stats.deaths || 0) + 1;
  if (u.team === 0) { addText(u.x, u.y - 90, u === G.p ? "쓰러졌다…" : "동료가 쓰러졌다", "#ff8a8a", 22);
    if (!heroesOf(0).some((h) => h.alive)) { if (u === G.p && typeof adReviveAsk === "function" && adReviveAsk(u)) return; G.over = true; G.overT = 1.6; sfx("dead"); if (G.mode === "story" && SAVE.resume) { delete SAVE.resume; saveGame(); } } }
}
function bossVoice(b, tag) { const k = b.type + "_" + tag; if (ASSETS.voice && ASSETS.voice[k] && !b.mini) setTimeout(() => voice(k), tag === "intro" ? 450 : 200); else if (tag === "intro") sfx("roar"); } // 11-16 보스 음성
function bossDown(b) {
  bossVoice(b, "down");
  // 11-20 보스 최고 처치 시간 (Dead Cells·Hades 처럼 속도 기록) — 같은 난이도 구분 없이 영웅 상관없이 가장 빠른 기록
  if (G.mode !== "dev" && G.mode !== "practice" && !(G.opt && G.opt.multi) && b.born != null) { const sec = Math.max(1, Math.round(G.time - b.born)), bt = (SAVE.bt = SAVE.bt || {}), prev = bt[b.type]; if (!prev || sec < prev) { bt[b.type] = sec; if (prev) setTimeout(() => { if (G && G.p) addText(G.p.x, G.p.y - 150, `최고 기록! ${sec}초 (전 ${prev}초)`, "#ffd84a", 26, true); }, 900); } }
  if (typeof haptic === "function") haptic("heavy");
  if (typeof track === "function") track("boss_kill", { boss: b.type, mini: !!b.mini, floor: G.floor, char: G.p && G.p.id, t: Math.round(G.roomT || 0) });
  G.slowT = 0.9; // 처치 순간 잠깐 느리게
  setTimeout(() => UI.tip("dex"), 6500);
  SAVE.stats.bosses = (SAVE.stats.bosses || 0) + 1; G.bossKills = (G.bossKills || 0) + 1; SAVE.kb = SAVE.kb || {}; SAVE.kb[b.type] = (SAVE.kb[b.type] || 0) + 1; if (G.mode !== "dev" && G.mode !== "practice") bountyKill(b.type);
  if (G.mode === "story") { if (b.mini) SAVE.stats.storyMini = (SAVE.stats.storyMini || 0) + 1; else SAVE.stats["story_boss" + G.floor] = 1; }
  const p = G.p, ratio = p.hp / p.maxHp;
  if (ratio >= 0.6) SAVE.stats.bossHighHp = (SAVE.stats.bossHighHp || 0) + 1;
  if (ratio <= 0.15 && p.alive) SAVE.stats.bossLowHp = (SAVE.stats.bossLowHp || 0) + 1;
  G.bossUnit = null; G.shake = 16;
  G.units.filter((u) => u.team === 1 && u.kind === "mob").forEach((m) => { m.alive = false; G.fx.push({ k: "death", x: m.x, y: m.y, r: m.r, t: 0, max: 0.5, img: m.img }); });
  // 층 보스: 보스 전용 액티브 보장 / 중간보스: 전용템 없음, 40% 확률로 일반 액티브 (사용자 요청 11-10)
  if (!b.mini) { SAVE.stats.floorBossKills = (SAVE.stats.floorBossKills || 0) + 1; G.drops.push({ type: "act", k: BOSS_ACT[b.type] || (BOSSES[b.type] && BOSSES[b.type].floor ? pick(Object.values(BOSS_ACT)) : rollActive([], 3)), x: RW / 2 + 160, y: RH / 2 + 60 }); }
  else if (b.type === "b_boss6" && BOSS_ACT.b_boss6 && Math.random() < 0.25) G.drops.push({ type: "act", k: BOSS_ACT.b_boss6, x: RW / 2 + 160, y: RH / 2 + 60 });
  else if (Math.random() < 0.4) G.drops.push({ type: "act", k: rollActive([], 2), x: RW / 2 + 160, y: RH / 2 + 60 });
  if (G.mode === "raid") { G.raidN++; gainCoin(1, "레이드 보스 처치"); for (const h of heroesOf(0)) { if (!h.alive) { h.alive = true; h.hp = h.maxHp * 0.3; } healUnit(h, h.maxHp * 0.3); }
    if (G.raidN >= RAID_ORDER.length) { G.banner = { text: "레이드 완료!", sub: "모든 보스를 쓰러뜨렸어요", t: 2.4 }; schedule(3, raidNext); }
    else { raidBreak(); G.levelQueue = (G.levelQueue || 0) + 1; G.banner = { text: "보스 처치! · 강화 하나", sub: "보부상에게 들러 정비하고 홍살문에 1초 서 있으면 다음 보스", t: 3.2 }; } // 11-20 보스마다 강화 하나 (레이드엔 잡몹이 없어 레벨이 거의 안 올라 S급도 3~4번째 보스에서 쓰러짐)
    checkUnlocks(); saveGame(); return; }
  if (G.mode === "dev" || G.mode === "practice") { G.banner = { text: "보스 처치!", sub: "개발자 맵 · 문이 열렸어요", t: 2 }; checkUnlocks(); saveGame(); return; }
  if (G.mode === "story") { G.drops.push(portalDrop()); setTimeout(() => UI.tip("portal"), 3200); G.banner = { text: "보스 토벌!", sub: "홍살문이 열렸어요 — 다른 방을 둘러본 뒤 문 안에 1초 서 있으면 다음으로", t: 3 }; }
  else if (G.mode === "endless") {
    G.eNext = b.mini ? "stage" : "floor"; G.eBossDone = true; G.drops.push(portalDrop()); setTimeout(() => UI.tip("portal"), 3200);
    G.banner = { text: "보스 토벌!", sub: "홍살문이 열렸어요 — 다른 방을 둘러본 뒤 문 안에 1초 서 있으면 다음으로", t: 3 };
  }
  else G.banner = { text: "보스 처치!", sub: "문이 열렸습니다", t: 2.2 };
  UI.music(G.mode === "story" ? theme().bgm : "endless");
  checkUnlocks(); saveGame();
}
function roomCleared() {
  const r = G.cur; if (r.cleared) return;
  r.cleared = true; G.roomsCleared++; SAVE.stats.rooms = (SAVE.stats.rooms || 0) + 1; if (typeof missionPing === "function") missionPing();
  if (r.trial && G.trial && G.trial.room === r) { if (!G.trial.fail) { G.drops.push({ type: "chest", x: RW / 2, y: RH / 2, open: false }); G.levelQueue++; addText(G.p.x, G.p.y - 130, "시련 통과! 상자 + 강화", "#ffd84a", 28); sfx("level"); SAVE.stats.trials = (SAVE.stats.trials || 0) + 1; } G.trial = null; }
  if (r.evReward) { r.evReward = false; G.drops.push({ type: "chest", x: RW / 2, y: RH / 2, open: false }, { type: "coin", x: RW / 2 - 60, y: RH / 2 + 50 }, { type: "coin", x: RW / 2 + 60, y: RH / 2 + 50 }); addText(G.p.x, G.p.y - 120, "궤짝 요괴 퇴치! 보상", "#ffd84a", 24); }
  for (const h of G.units) if (h.kind === "hero" && h.alive && h.team === 0) h.celebT = 0.9; /* 방 정복 — 환호 (11-16) */
  if (r.mobStart >= 5 && G.roomT < 10) { SAVE.stats.fastClear = (SAVE.stats.fastClear || 0) + 1; addText(G.p.x, G.p.y - 120, "번개 같은 정리!", "#ffd84a", 24); }
  if (G.mode === "endless") makeEndlessExits(r, null);
  sfx("clear"); checkUnlocks(); saveGame();
}
function gainCoin(n, why) { SAVE.coins += n; G && (G.coinGot += n); UI.toast(`🪙 코인 +${n}${why ? " · " + why : ""}`); saveGame(); }

// ---------- 소환수·펫 ----------
const SUMMON = {
  ghost: { e: "👻", hp: 1, d: 0.5, cd: 0.8, spd: 260, range: 50, r: 18 },
  skeleton: { e: "💀", d: 0.6, cd: 0.9, spd: 200, range: 55, r: 20 },
  shikigami: { e: "📜", d: 0.5, cd: 1.0, spd: 230, range: 330, r: 18, ranged: true },
  tiger: { e: "🐯", d: 1.3, cd: 0.8, spd: 290, range: 70, r: 30 },
  wolf: { e: "🐺", d: 0.75, cd: 0.7, spd: 300, range: 55, r: 24 },
  bird: { e: "🐦", d: 0.45, cd: 0.8, spd: 280, range: 360, r: 18, ranged: true },
  guardian: { e: ["🐉", "🐅", "🦅", "🐢"], d: 1.0, cd: 0.8, spd: 250, range: 300, r: 30, ranged: true },
  dragon: { e: "🐲", d: 2.2, cd: 0.9, spd: 230, range: 480, r: 40, ranged: true, beam: true },
  shade: { e: "👤", d: 1.3, cd: 0.8, spd: 290, range: 70, r: 28 },
  militia: { e: "🧑‍🌾", d: 0.65, cd: 0.9, spd: 220, range: 60, r: 22 },
  soldier: { e: "💂", d: 0.8, cd: 0.85, spd: 230, range: 75, r: 24 },
  scarecrow: { e: "🎎", d: 0.6, cd: 0.9, spd: 210, range: 60, r: 22 },
};
function addSummon(owner, kind, dur, i) {
  const s = SUMMON[kind], a = Math.random() * 6.28;
  G.units.push({ kind: "summon", team: owner.team, owner, sk: kind, s, e: Array.isArray(s.e) ? s.e[i % s.e.length] : s.e, img: kind === "guardian" ? "sum_" + ["g_dragon", "g_tiger", "g_bird", "g_turtle"][i % 4] : "sum_" + kind, x: owner.x + Math.cos(a) * 60, y: owner.y + Math.sin(a) * 60,
    r: s.r, life: dur, cd: rnd(0, 0.5), alive: true, buffs: [], stunT: 0, slowT: 0, slow: 0, kx: 0, ky: 0, flip: false, ph: Math.random() * 6 });
}
function addPet(owner, key, lv) {
  const P = PETS[key];
  { const pim = ASSETS.meta && ASSETS.meta["pet_" + P.img.slice(3)] ? "pet_" + P.img.slice(3) : P.img; needPack("pt_" + pim); } // 펫 3D 모션 띠 (11-15)
  G.units.push({ kind: "pet", team: 0, owner, key, P, lvMul: (1 + 0.2 * (lv - 1)) * (PET_RAR_MUL[P.rar] || 1), img: ASSETS.meta && ASSETS.meta["pet_" + P.img.slice(3)] ? "pet_" + P.img.slice(3) : P.img, x: owner.x - 50, y: owner.y, r: 18, cd: 1, alive: true, buffs: [], stunT: 0, slowT: 0, slow: 0, kx: 0, ky: 0, flip: false, ph: 0 });
}

// ---------- 뽑기 (원정 중) ----------
function rollActive(exclude = [], minRar = 1) {
  const recent = G.recentActs || (G.recentActs = []);
  let pool = ACT_KEYS.filter((k) => ACTIVES[k].rar >= minRar && !exclude.includes(k) && !(G.p.active && G.p.active.k === k));
  const fresh = pool.filter((k) => !recent.includes(k)); if (fresh.length >= 3) pool = fresh;
  let tot = 0; for (const k of pool) tot += ACT_WEIGHT[ACTIVES[k].rar];
  let r = Math.random() * tot, out = pool[0];
  for (const k of pool) { r -= ACT_WEIGHT[ACTIVES[k].rar]; if (r <= 0) { out = k; break; } }
  recent.push(out); if (recent.length > 8) recent.shift();
  return out;
}
// 레벨이 오를수록 희귀·영웅·전설 확률이 오른다 (낮은 레벨에도 낮은 확률로 나옴)
function boonWeights(lvl) { lvl = lvl || 1; return { 1: Math.max(3, 10 - lvl * 0.25), 2: 3.5 + lvl * 0.22, 3: 0.8 + lvl * 0.14, 4: 0.12 + lvl * 0.05 }; }
function rollBoons(n, lvl, who) {
  const u = who || (G && G.p), W = boonWeights(lvl != null ? lvl : u ? u.lvl : 1), out = [];
  const lvOf = (k) => (u ? u.boons.filter((x) => x === k).length : 0);
  const full = (k) => { const m = BOONS[k].m || {}, ks = Object.keys(m).filter((x) => STAT_CAP[x] != null && m[x] > 0); return ks.length > 0 && ks.every((x) => u && u.m && (u.m[x] || 0) >= STAT_CAP[x]); };
  // 같은 패시브는 Lv.3까지 (사용자 요청 11-13, 예전 Lv.5), 이미 상한에 닿은 능력치만 올리는 패시브는 나오지 않음
  const pool = BOON_KEYS.filter((k) => !(k === "phoenixPerk" && lvOf(k) >= 1) && lvOf(k) < BOON_MAX && !full(k) && (!BOONS[k].req || (u && BOONS[k].req.every((q) => lvOf(q) > 0))) && !(BOONS[k].duo && lvOf(k) >= 1));
  // 조합 패시브가 열렸으면 3장 중 하나로 꼭 보여 줌 (Hades 처럼 '조합 완성' 순간이 보이게, 11-16)
  const duo = pool.filter((k) => BOONS[k].duo); if (duo.length && Math.random() < 0.6) out.push(pick(duo));
  while (out.length < n && pool.some((k) => !out.includes(k))) {
    let tot = 0; const cand = pool.filter((k) => !out.includes(k)); for (const k of cand) tot += W[BOONS[k].rar];
    let r = Math.random() * tot; for (const k of cand) { r -= W[BOONS[k].rar]; if (r <= 0) { out.push(k); break; } }
  }
  return out;
}
function takeBoon(u, k) { if (!k || u.boons.filter((x) => x === k).length >= BOON_MAX) return; u.boons.push(k); if (BOONS[k] && BOONS[k].duo && u === G.p && SAVE) { SAVE.duo = SAVE.duo || {}; SAVE.duo[k] = 1; } if (u === G.p && typeof track === "function") track("boon_pick", { k, lvl: u.lvl, char: u.id }); if (k === "phoenixPerk") u.revive++; recalc(u); }

// ---------- 갱신 ----------
function update(dt) {
  if (G && G.client) { NET.clientUpdate(dt); return; }
  if (!G || G.paused) return;
  if (G.slowT > 0) { G.slowT -= dt; dt *= 0.3; }
  if (G.hitStop > 0) { G.hitStop -= dt; if (!(SAVE && SAVE.settings.hitstop === false)) dt *= 0.06; } // 11-16 타격감: 순간 멈칫
  if (G.kx || G.ky) { const dk = Math.exp(-dt * 16); G.kx = clamp((G.kx || 0) * dk, -12, 12); G.ky = clamp((G.ky || 0) * dk, -12, 12); if (Math.abs(G.kx) + Math.abs(G.ky) < 0.05) G.kx = G.ky = 0; } // 11-18 화면 밀림 되돌리기
  if (G.comboT > 0) { G.comboT -= dt; G.comboPop = Math.max(0, (G.comboPop || 0) - dt); if (G.comboT <= 0) { if (G.combo >= 15 && G.p) { const gg = Math.floor(G.combo / 10) * 2; G.p.gold = (G.p.gold || 0) + gg; addText(G.p.x, G.p.y - 130, `연격 ${G.combo}! 엽전 +${gg}`, "#ffd84a", 24); } G.combo = 0; } } // 11-18 연격이 끊기면 보상
  if (G.trial && !G.trial.fail && G.cur === G.trial.room && !G.trial.room.cleared) { G.trial.t -= dt; if (G.trial.t <= 0) { G.trial.fail = true; addText(G.p.x, G.p.y - 120, "시련 실패…", "#ff8a8a", 26); } }
  G.time += dt; G.roomT += dt;
  if (G.trans) { G.trans.t -= dt; if (G.trans.t <= 0) { const tr = G.trans; G.trans = null; if (tr.mode === "out") tr.then(); } else if (G.trans.mode === "out") return; }
  if (G.banner) { G.banner.t -= dt; if (G.banner.t <= 0) G.banner = null; }
  for (let i = G.timers.length - 1; i >= 0; i--) { const tm = G.timers[i]; tm.t -= dt; if (tm.t <= 0) { G.timers.splice(i, 1); tm.fn(); } }
  if (G.levelQueue > 0 && !UI.modalOpen()) { G.levelQueue--; const first = !G.firstLv; G.firstLv = 1; UI.levelUp(rollBoons(G.boonN || 3, first ? Math.max(G.p.lvl, 16) : G.p.lvl)); return; } // 11-20 첫 레벨업은 희귀 이상이 잘 나오게 (첫 선택부터 '내 빌드' 맛)
  if (G.jobQueue && G.jobQueue.length && !UI.modalOpen()) { UI.jobPick(G.jobQueue.shift()); return; }
  if (G.over) { G.overT -= dt; if (G.overT <= 0) { G.over = false; endRun(false); } } // 쓰러지면 원정 끝 + 스토리 저장 지움 (사용자 11-13: 쓰러지면 초기화)
  if (G.mode === "duel") updateDuel(dt);
  for (const u of G.units) if (u.alive) updateUnit(u, dt);
  G.units = G.units.filter((u) => u.alive || u.kind === "hero");
  updateProjs(dt); updateZones(dt); updateTele(dt); updateOrbs(dt); updateDrops(dt);
  // 다음 무리
  const r = G.cur;
  // 방 밖으로 밀려난 몬스터는 정리 (문이 계속 잠기는 일 방지)
  for (const u of G.units) if (u.team === 1 && u.alive && (u.kind === "mob" || u.kind === "boss") && (u.x < BL - 30 || u.x > BR + 30 || u.y < BT - 40 || u.y > BB + 30 || isNaN(u.x) || isNaN(u.y))) { u.outT = (u.outT || 0) + dt; if (u.outT > 3) { u.x = RW / 2; u.y = RH / 2; collide(u); u.outT = 0; } }
  if (r.pending > 0 && G.units.filter((u) => u.team === 1 && u.alive).length <= 2) { const m = diffMul(); for (let i = 0; i < r.pending; i++) spawnMob(pick(r.pool), m, Math.random() < r.eliteP); r.pending = 0; }
  if (!r.cleared && (r.type === "fight" || r.type === "elite" || r.type === "exit" || (r.type === "event" && r.evReward)) && G.roomT > 0.8 && !roomLocked()) { roomCleared(); if (r.type === "exit") { G.drops.push(portalDrop()); G.banner = { text: "출구를 찾았어요!", sub: "금빛 계단에 서면 다음 스테이지", t: 2.2 }; } }
  if (!r.cleared && r.type === "boss" && G.roomT > 1 && !roomLocked()) { r.cleared = true; G.roomsCleared++; SAVE.stats.rooms = (SAVE.stats.rooms || 0) + 1; }
  // 이스터 에그: 스토리 1-1 시작 방 왼쪽 위 모퉁이에 3초 서 있으면 숨은 상자
  const p = G.p;
  if (G.mode === "story" && G.floor === 1 && G.stage === 1 && r.type === "start" && !SAVE.eggs.corner && p.alive) {
    if (p.x < BL + 80 && p.y < BT + 80) { G.eggT = (G.eggT || 0) + dt; if (G.eggT > 3) { SAVE.eggs.corner = 1; G.drops.push({ type: "chest", x: BL + 140, y: BT + 110, open: false, secret: true }); G.banner = { text: "숨은 상자 발견!", sub: "옛 토벌꾼이 남긴 상자", t: 2.5 }; sfx("level"); saveGame(); } } else G.eggT = 0;
  }
  // 위험 지형 (발 위치 기준, 아군 영웅 모두) — 들어가자마자 피해, 그 뒤 0.5초마다
  for (const h of r.haz) {
    if (h.kind === "spike") h.up = (G.time + h.ph) % 2.4 < 0.7; // 가시는 2.4초마다 0.7초 동안 솟음
    for (const u of heroesOf(0)) {
      if (!u.alive) continue;
      const fx = u.x, fy = u.y + u.r * 0.5, inside = ((fx - h.x) / h.rx) ** 2 + ((fy - h.y) / h.ry) ** 2 < 1;
      h.ticks = h.ticks || new Map();
      if (!inside) { h.ticks.delete(u); continue; }
      if (h.kind === "ice") { u.slow = Math.max(u.slowT > 0 ? u.slow : 0, 0.35); u.slowT = Math.max(u.slowT, 0.3); }
      if (h.kind === "spike" && !h.up) continue;
      const tk = (h.ticks.get(u) || 0) - dt;
      if (tk <= 0) {
        h.ticks.set(u, 0.5);
        const pct = { lava: 0.05, poison: 0.03, spike: 0.06, soul: 0.04, ice: 0.015 }[h.kind] || 0.03;
        damage(u, u.maxHp * pct, null, false, { dot: true, trap: true });
        if (h.kind === "poison") { u.slow = 0.3; u.slowT = 0.6; }
        if (h.kind === "soul") { u.markT = 2; u.mark = 0.15; }
      } else h.ticks.set(u, tk);
    }
  }
  // 문 통과 — 멀티는 살아 있는 일행이 모두 같은 문 앞에 모여야 넘어간다 (11-15 사용자 요청)
  const party = heroesOf(0).filter((h) => h.alive && !h.left);
  for (const h of heroesOf(0)) {
  const dz = h.alive && doorZone(h);
  if (dz && !G.trans) {
    const L = r.links, k = L[dz];
    if ((dz === "N" && h.y < 40) || (dz === "S" && h.y > RH - 40) || (dz === "W" && h.x < 30) || (dz === "E" && h.x > RW - 30)) {
      const here = party.filter((o) => doorZone(o) === dz).length;
      if (party.length > 1 && here < party.length) {
        // 아직 다 모이지 않음: 문턱에서 멈춰 세우고 기다림 표시
        if (dz === "N") h.y = 41; else if (dz === "S") h.y = RH - 41; else if (dz === "W") h.x = 31; else h.x = RW - 31;
        if (!h._waitT || G.time - h._waitT > 1.6) { h._waitT = G.time; addText(h.x, h.y - 90, `일행을 기다려요 (${here}/${party.length})`, "#9fe8ff", 18); }
        continue;
      }
      G.trans = { t: 0.25, max: 0.25, mode: "out", then: () => enterRoom(k, dz) }; sfx("door");
    }
  }
  }
  for (const f of G.fx) f.t += dt; G.fx = G.fx.filter((f) => f.t < f.max);
  for (const pt of G.parts) { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += (pt.ws ? -50 : 300) * dt; if (pt.ws) pt.vx *= 1 - dt * 1.5; pt.t += dt; } G.parts = G.parts.filter((pt) => pt.t < pt.max);
  for (const t of G.texts) { if (t.vx == null) { t.num = /^\d+$/.test(t.s); t.vx = t.num ? rnd(-40, 40) : 0; } t.x += t.vx * dt * Math.max(0, 1 - t.t * 2); t.y -= (t.num ? 70 * Math.max(0.15, 1 - t.t * 2.2) : 50) * dt; t.t += dt; } G.texts = G.texts.filter((t) => t.t < 0.9);
  G.shake = Math.max(0, G.shake - dt * 40);
}
function updateUnit(u, dt) {
  if (u.spawnT > 0) { u.spawnT -= dt; return; }
  u.hitT = Math.max(0, (u.hitT || 0) - dt); u.invT = Math.max(0, (u.invT || 0) - dt);
  if (u.atkAnim > 0) u.atkAnim -= dt; if (u.skillAnim > 0) u.skillAnim -= dt; if (u.hurtT > 0) u.hurtT -= dt;
  if (u.celebT > 0) u.celebT -= dt; if (u.getupT > 0) u.getupT -= dt;
  if (u.slowT > 0) u.slowT -= dt;
  if (u.affix === "shield" && u.alive) { u.shT = (u.shT == null ? 1 : u.shT) - dt; if (u.shT <= 0) { u.shT = 6.5; u.mshield = u.maxHp * 0.25; } } // 엘리트 특성: 보호막 (6.5초마다 최대 체력 25%)
  if (u.affix === "blink" && u.alive && G.p && G.p.alive && !G.client) { u.bT = (u.bT == null ? rnd(2, 3.5) : u.bT) - dt; if (u.bT <= 0) { u.bT = rnd(3.8, 5.2); for (let i = 0; i < 8; i++) spark(u.x, u.y - u.r * 0.5, "#d08cff", 3); const a = Math.random() * 6.28; u.x = clamp(G.p.x + Math.cos(a) * 150, BL + 30, BR - 30); u.y = clamp(G.p.y + Math.sin(a) * 110, BT + 30, BB - 30); for (let i = 0; i < 8; i++) spark(u.x, u.y - u.r * 0.5, "#d08cff", 3); u.st = "idle"; u.t = 0.45; } } // 엘리트 특성: 순간이동
  if (u.affix === "regen" && u.alive && u.hp < u.maxHp) u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.018 * dt); // 엘리트 특성: 재생 (11-16 밸런스 2.5→1.8%)
  if (u.markT > 0) u.markT -= dt;
  if (u.burn) { u.burn.t -= dt; u.burn.acc = (u.burn.acc || 0) + dt; if (u.burn.acc >= 0.5) { u.burn.acc = 0; damage(u, u.burn.dps * 0.5 * 2, u.burn.src, false, { dot: true }); } if (u.burn && u.burn.t <= 0) u.burn = null; }
  if (!u.alive) return;
  for (const b of u.buffs) b.t -= dt; u.buffs = u.buffs.filter((b) => b.t > 0);
  if (u.kx || u.ky) { u.x += u.kx * dt; u.y += u.ky * dt; const px = u.x, py = u.y, sp = Math.hypot(u.kx, u.ky); u.kx *= Math.pow(0.0001, dt); u.ky *= Math.pow(0.0001, dt); if (Math.abs(u.kx) + Math.abs(u.ky) < 5) u.kx = u.ky = 0; collide(u);
    if (u.team === 1 && u.alive && sp > 380 && Math.hypot(u.x - px, u.y - py) > 1.5 && !(u.slamCd > G.time)) { // 11-16 벽꽝: 벽·장애물에 부딪힘
      u.slamCd = G.time + 0.6; u.kx = u.ky = 0; u.stunT = Math.max(u.stunT || 0, 0.45); const by = u.kbSrc && u.kbSrc.alive ? u.kbSrc : G.p;
      damage(u, atkOf(by) * 0.6, by, false, { quiet: false }); addText(u.x, u.y - u.r - 40, "벽꽝!", "#ffd27a", 22); sfx("slam"); G.shake = Math.max(G.shake, 7); G.hitStop = Math.max(G.hitStop || 0, 0.05);
      G.fx.push({ k: "hit", x: u.x, y: u.y - u.r * 0.5, r: 70, t: 0, max: 0.22, col: "#ffd27a", a: Math.random() * 6.28 }); spark(u.x, u.y - u.r * 0.5, "#ffd27a", 8);
    }
  }
  if (u.kind === "hero") return updateHero(u, dt);
  if (u.stunT > 0) { u.stunT -= dt; return; }
  if (u.kind === "mob") updateMob(u, dt);
  else if (u.kind === "boss") updateBoss(u, dt);
  else if (u.kind === "summon") updateSummon(u, dt);
  else if (u.kind === "pet") updatePet(u, dt);
}
function updateHero(u, dt) {
  if (G.mode === "duel" && G.duel && G.duel.state === "ready") { u.moving = false; return; }
  for (const k in u.cd) u.cd[k] = Math.max(0, u.cd[k] - dt);
  const regen = ((u.m.regen || 0) + buffSum(u, "regen")) * u.maxHp;
  if (regen) u.hp = Math.min(u.maxHp, u.hp + regen * dt);
  const aura = buffSum(u, "aura");
  if (aura) { u.auraT = (u.auraT || 0) - dt; if (u.auraT <= 0) { u.auraT = 0.5; for (const f of foesOf(u.team)) if (dist(f, u) < 170 + f.r) hit(u, f, atkOf(u) * aura * 0.5, { dot: true }); G.fx.push({ k: "ring", x: u.x, y: u.y, r: 170, t: 0, max: 0.3, col: "#fff27a" }); } }
  if (u.stunT > 0) { u.stunT -= dt; return; }
  if (u.dash) {
    const d = u.dash; d.t -= dt;
    u.x += d.vx * dt; u.y += d.vy * dt; collide(u);
    if (d.d > 0) for (const f of foesOf(u.team)) if (!d.hit.has(f) && dist(f, u) < f.r + u.r + 24) { d.hit.add(f); hit(u, f, d.d, { knock: 50, from: u }); }
    if (Math.random() < 0.8) G.parts.push({ x: u.x + rnd(-10, 10), y: u.y - rnd(0, 40), vx: -d.vx * 0.05, vy: -d.vy * 0.05 - 20, t: 0, max: 0.35, col: d.col || "#fff", s: rnd(3, 6) });
    d.age = (d.age || 0) + dt; if (!(d.t > 0) || d.age > 2.5) u.dash = null; // 11-20 안전장치: 대기 시간이 NaN 이거나 너무 길면 돌진을 끝냄(영웅이 멈춘 채 엽전도 못 줍던 의심 사례)
    return;
  }
  if (u.bot) return updateBot(u, dt);
  const c = ctrlOf(u) || {};
  // 방향키 이동
  if (c.kx || c.ky) {
    const l = Math.hypot(c.kx, c.ky), s = spdOf(u) * dt * Math.min(1, Math.max(0.35, l));
    u.tx = null; u.x += (c.kx / l) * s; u.y += (c.ky / l) * s; u.moving = true; u.face = Math.atan2(c.ky, c.kx); if (c.kx) u.flip = c.kx < 0; collide(u);
    u.moveT += dt; if (u.moveT > 0.12) { u.moveT = 0; G.parts.push({ x: u.x + rnd(-8, 8), y: u.y + 10, vx: 0, vy: -10, t: 0, max: 0.4, col: "rgba(200,190,170,0.5)", s: 4 }); }
  } else if (u.tx != null) {
    const dx = u.tx - u.x, dy = u.ty - u.y, d = Math.hypot(dx, dy);
    if (d < 6) { u.tx = null; u.moving = false; }
    else { const s = spdOf(u) * dt, m = Math.min(s, d); u.x += (dx / d) * m; u.y += (dy / d) * m; u.moving = true; if (Math.abs(dx) > 4) u.flip = dx < 0; collide(u);
      u.moveT += dt; if (u.moveT > 0.12) { u.moveT = 0; G.parts.push({ x: u.x + rnd(-8, 8), y: u.y + 10, vx: 0, vy: -10, t: 0, max: 0.4, col: "rgba(200,190,170,0.5)", s: 4 }); } }
  } else u.moving = false;
  // 11-19 자동 공격 옵션 (Archero·Soul Knight 식): 켜면 근처에 요괴가 있을 때 기본 공격을 알아서(가까운 적 조준), 스킬·구르기는 직접
  const autoA = u === G.p && SAVE && SAVE.settings.autoAtk === true && !u.dash && // 11-19 사용자: 기본은 직접 공격, 설정에서 켜면 자동
    foesOf(0).some((f) => f.alive && !f.dummy && Math.hypot(f.x - u.x, f.y - u.y) < 620);
  if ((c.atkHeld || autoA) && u.cd.B <= 0) { if (autoA) input.touch = true; basicAttack(u); }
  pickups(u, dt);
}
function basicAttack(u) {
  if (G.mode === "duel" && G.duel && G.duel.state === "ready") return;
  const b = u.def.basic; u.cd.B = b.cd / (1 + u.as + buffSum(u, "as"));
  const ap = aimPoint(u), a = Math.atan2(ap.y - u.y, ap.x - u.x), melee = b.fx[0].t === "arc";
  if (melee) { u.x += Math.cos(a) * 14; u.y += Math.sin(a) * 14; collide(u); } else { u.recoil = 0.12; } // 근거리는 한 걸음, 원거리는 반동
  castFx(u, b.fx, 1, ap, { basic: true }); u.atkAnim = 0.22; u.atkAlt = !u.atkAlt;
}
function useSkill(u, slot, at) {
  if (G.mode === "duel" && G.duel && G.duel.state === "ready") return false;
  if (!u.alive || u.stunT > 0 || !G || G.paused) return false;
  if (slot === "D") return dodge(u, at);
  if (slot === "A") {
    if (!u.active || u.cd.A > 0) return false;
    const A = ACTIVES[u.active.k]; castFx(u, A.fx, 1 + 0.25 * (u.active.lv - 1), at || aimPoint(u), { tag: A.name, vk: sigOf(A.fx, A.boss ? "cvfx_" + u.active.k : null) }); u.skillAnim = 0.4; u.cd.A = A.cd * (1 - u.cdr * 0.5) * (curseOn("seal") && u.team === 0 ? 1.3 : 1); (u.cdMax = u.cdMax || {}).A = u.cd.A; return true;
  }
  const s = u.sk[slot]; if (!s || u.cd[slot] > 0) return false;
  castFx(u, s.fx, (s.pow || 1) * (1 + (u.jobs || []).reduce((a, j) => a + (j.skPow || 0), 0)), at || aimPoint(u), { tag: s.name, vk: sigOf(s.fx, s.icon && s.icon.startsWith("sk_") ? "cvfx_" + s.icon : null) }); u.skillAnim = 0.4; u.atkAnim = 0; if (u === G.p) SAVE.stats.skillsUsed = (SAVE.stats.skillsUsed || 0) + 1;
  let cd = s.cd * (1 - u.cdr) * (curseOn("seal") && u.team === 0 ? 1.3 : 1); if (slot === "R") cd = Math.max((s.cd0 || s.cd) * ULT_MIN, cd * (1 - ((u.m && u.m.ultcd) || 0)));
  if (u.m && u.m.echo && Math.random() < u.m.echo && slot !== "R") { cd = 0.3; addText(u.x, u.y - 100, "메아리!", "#9fe8ff", 18); }
  u.cd[slot] = cd; (u.cdMax = u.cdMax || {})[slot] = cd;
  return true;
}
function pickups(u, dt = 1 / 60) {
  for (const d of G.drops) {
    if (d.gone) continue;
    const dd = Math.hypot(d.x - u.x, d.y - u.y);
    if (d.type === "gold" || d.type === "coin") {
      if (d.vy !== undefined && d.z !== undefined && d.vy) continue;
      if (dd < 160 * ((SAVE && SAVE.settings.pickR) || 1)) { d.x += (u.x - d.x) * 0.18; d.y += (u.y - d.y) * 0.18; d.mag = true; } // 11-20 끌려오는 엽전은 기둥에 밀려나지 않게 (기둥 옆에서 30~40px 떨어져 못 줍던 버그)
      else if (u === G.p && !roomLocked() && G.roomT > 0.6) { const k = Math.min(1, 900 * 0.016 / dd); d.x += (u.x - d.x) * k; d.y += (u.y - d.y) * k; } // 11-17 방을 비우면 남은 엽전이 저절로 날아옴 (줍기 귀찮음 없애기)
      if (dd < 42) { d.gone = true; if (d.type === "gold") { u.gold = (u.gold || 0) + d.v; if (u === G.p) { sfx("coin"); G.goldIn = (G.goldIn || 0) + d.v; } } else if (u.remote) NET.reward({ coin: 1 }); else gainCoin(1, "요괴 드롭"); }
    } else if (d.type === "herb" && dd < 40) { d.gone = true; healUnit(u, u.maxHp * 0.2); sfx("heal"); }
    else if (d.type === "act" && d.waitLeave) { if (dd > 75) d.waitLeave = false; }
    else if (d.type === "act" && dd < 58 && !d.cool && u.actLock && u.active && u.active.k !== d.k) {
      if (!d.lockMsg || G.time - d.lockMsg > 2.5) { d.lockMsg = G.time; if (u === G.p) addText(d.x, d.y - 70, `🔒 잠금 중 — ${IS_TOUCH ? "액티브 칸의 자물쇠를 눌러 풀어요" : keyLabel(keyMap().lock) + " 키로 풀어요"}`, "#ffd27a", 18); }
    } else if (d.type === "act" && dd < 58 && !d.cool) {
      d.gone = true;
      if (d.grp) for (const o of G.drops) if (o.grp === d.grp && o !== d) { o.gone = true; G.fx.push({ k: "puff", x: o.x, y: o.y, t: 0, max: 0.4, col: "#fff" }); }
      const had = u.active;
      if (had && had.k === d.k) { had.lv = Math.min(5, had.lv + 1); addText(u.x, u.y - 100, ACTIVES[d.k].name + " Lv." + had.lv, "#ffe08a", 22); }
      else { u.active = { k: d.k, lv: d.lv || 1 }; addText(u.x, u.y - 100, ACTIVES[d.k].name + " 획득! (" + keyLabel(keyMap().act) + ")", "#ffe08a", 22); if (had) G.drops.push({ type: "act", k: had.k, lv: had.lv, x: d.x, y: d.y, cool: 0.8, waitLeave: true }); } // 들고 있던 액티브는 그 자리에, 0.8초 + 비켜났다 와야 다시 주움 (사용자 요청 11-11)
      sfx("pick");
    } else if (d.type === "chest" && !d.open && dd < 60) {
      d.open = true; sfx("chest"); if (!u.remote) SAVE.stats.chests = (SAVE.stats.chests || 0) + 1;
      const gv = Math.round(rint(12, 22) * (1 + diffMul().tier * 0.3) * (1 + (u.m.gold || 0))); // 11-19 상자 엽전 절반
      for (let i = 0; i < 5; i++) G.drops.push({ type: "gold", v: Math.ceil(gv / 5), x: d.x + rnd(-60, 60), y: d.y + rnd(20, 60) });
      const loot = [["cur_yeop", "엽전", gv]];
      if (d.secret) { G.drops.push({ type: "coin", x: d.x - 30, y: d.y + 50 }, { type: "coin", x: d.x + 30, y: d.y + 50 }); u.gold = (u.gold || 0) + 60; addText(d.x, d.y - 60, "+엽전 60", "#ffe08a", 22); loot[0][2] += 60; loot.push(["cur_coin", "코인", 2]); }
      else if (Math.random() < COIN_DROP.chest * (1 + (u.m.coinLuck || 0))) { G.drops.push({ type: "coin", x: d.x, y: d.y + 50 }); loot.push(["cur_coin", "코인", 1]); }
      if (Math.random() < 0.5) { G.drops.push({ type: "herb", x: d.x - 60, y: d.y + 50 }); loot.push(["obj_shop_herb", "회복 약초", 1]); }
      if (u === G.p && UI.loot) UI.loot(d.secret ? "옛 토벌꾼이 남긴 상자" : "보물상자", loot);
    } else if (d.type === "evt" && !d.used && dd < 85 && u === G.p && !UI.modalOpen()) { d.used = true; UI.event(d.k); if (G.opt && G.opt.multi && NET.guestHero && NET.guestHero.alive && G.mode !== "duel") { NET.guestLevelUp(NET.guestHero); NET.send({ t: "toast", s: "방장이 괴이한 방을 살피는 동안 강화 하나를 골라요" }); } } // 11-27 함께하기에서는 아무도 못 쓰던 것
    else if (d.type === "spring" && !d.used && dd < 70) { d.used = true; d.away = false; healUnit(u, u.maxHp); sfx("heal"); }
    else if (d.type === "forge" && u.remote) { // 11-27 손님: 창 없이 가진 강화 하나를 벼림(한 번)
      if (dd > 140) d.awayR = true; else if (dd < 90 && d.awayR !== false && !d.usedR && !(d.coolR > G.time)) { d.coolR = G.time + 1.2; d.awayR = false;
        if ((u.gold || 0) < d.price) addText(d.x, d.y - 110, "엽전이 모자라요", "#ff8a8a", 18); else if (!u.boons.length) addText(d.x, d.y - 110, "벼릴 강화가 아직 없어요", "#ffd0a0", 18);
        else { const k = pick(u.boons.filter((x) => BOONS[x])); if (k) { u.gold -= d.price; d.usedR = true; takeBoon(u, k); sfx("level"); addText(d.x, d.y - 110, BOONS[k].name + " — 한 번 더 벼렸다", "#ffe08a", 20); for (let i = 0; i < 10; i++) spark(d.x + rnd(-50, 50), d.y + rnd(-60, 10), "#ffb060", 4); } } } }
    else if (d.type === "forge" && !d.used && u === G.p) {
      if (dd > 140) d.away = true; else if (dd < 90 && d.away !== false && !d.cool && !UI.modalOpen()) { d.cool = 1.2; d.away = false;
        if ((u.gold || 0) < d.price) { addText(d.x, d.y - 110, "엽전이 모자라요", "#ff8a8a", 18); continue; }
        if (!u.boons.length) { addText(d.x, d.y - 110, "벼릴 강화가 아직 없어요", "#ffd0a0", 18); continue; }
        UI.forge(d); } }
    else if (d.type === "spring" && d.used && !d.wish && (u === G.p || u.remote) && d.price) { // 11-21 소원 엽전: 마른 우물에 엽전을 던지면 강화 하나 (판 안 엽전 쓸 곳)
      if (dd > 110) d.away = true; else if (dd < 70 && d.away && !d.cool) { d.cool = 1.2; d.away = false;
        if ((u.gold || 0) < d.price) { addText(d.x, d.y - 90, "엽전이 모자라요", "#ff8a8a", 18); continue; }
        u.gold -= d.price; d.wish = 1; sfx("coin"); if (u.remote) NET.guestLevelUp(u); else G.levelQueue = (G.levelQueue || 0) + 1; addText(d.x, d.y - 100, "엽전이 바닥에 닿자 우물이 답했다", "#ffe08a", 22); for (let i = 0; i < 10; i++) spark(d.x + rnd(-60, 60), d.y + rnd(-60, 20), "#ffe6b0", 4); } }
    else if (d.type === "merchant" && u === G.p) { if (dd > 170) d.away = true; else if (dd < 95 && d.away && !UI.modalOpen() && !G.over) { d.away = false; UI.shop(G.cur); } }
    else if (d.type === "shopre" && dd < 50 && !d.cool && (u === G.p || u.remote) && d.away !== false) {
      d.cool = 1.2; d.away = false; if ((u.gold || 0) < d.price) { addText(d.x, d.y - 70, "엽전이 모자라요", "#ff8a8a", 18); continue; }
      u.gold -= d.price; d.n++; d.price = 40 + d.n * 35; sfx("coin"); for (let i = G.drops.length - 1; i >= 0; i--) if (G.drops[i].type === "shop" && !G.drops[i].sold) G.drops.splice(i, 1);
      stockShop(); addText(d.x, d.y - 80, "보부상이 새 물건을 꺼냈다!", "#ffe08a", 22); for (let i = 0; i < 10; i++) spark(RW / 2 + rnd(-300, 300), RH / 2 + rnd(-100, 150), "#ffe6b0", 4); continue;
    }
    else if (d.type === "shop" && !d.sold && dd < 50 && !d.cool) {
      if ((u.gold || 0) < d.price) { addText(d.x, d.y - 70, "엽전이 모자라요", "#ff8a8a", 18); d.cool = 1.5; continue; }
      shopBuy(u, d);
    } else if (d.type === "stairs" && !G.trans) {
      // 멀티는 살아 있는 일행이 모두 포탈 안에 들어와야 1초가 찬다 (11-15). 한 프레임에 한 번만 세려고 일행 첫 사람 차례에만
      const party = heroesOf(0).filter((o) => o.alive && !o.left), first = party[0] === u;
      const inside = party.filter((o) => Math.hypot(d.x - o.x, d.y - o.y) < 70).length;
      if (dd < 70 && party.length > 1 && inside < party.length && (!u._waitT || G.time - u._waitT > 1.6)) { u._waitT = G.time; addText(u.x, u.y - 90, `일행을 기다려요 (${inside}/${party.length})`, "#9fe8ff", 18); }
      if (!first) continue;
      if (inside >= party.length && inside > 0) { d.hold = (d.hold || 0) + dt; if (d.hold >= 1) { d.gone = true; if (d.raid) { raidNext(); continue; } G.cur.stairsTaken = true; if (G.mode === "endless") endlessNextStage(); else stageClear(); } }
      else d.hold = Math.max(0, (d.hold || 0) - dt * 2);
    }
  }
  G.drops = G.drops.filter((d) => !d.gone);
}
function updateDrops(dt) {
  for (const d of G.drops) {
    if (d.type !== "stairs" && d.type !== "spring" && !d.mag) { d.x = clamp(d.x, BL + 50, BR - 50); d.y = clamp(d.y, BT + 60, BB - 40); if (!d.mag) for (const o of G.cur.obs) { const dx = d.x - o.x, dy = d.y - o.y, dd = Math.hypot(dx, dy), m = o.r + 34; if (dd < m) { const a = dd > 0.1 ? Math.atan2(dy, dx) : Math.random() * 6.28; d.x = o.x + Math.cos(a) * m; d.y = o.y + Math.sin(a) * m; } } }
    if (d.cool) { d.cool -= dt; if (d.cool <= 0) d.cool = 0; }
    if (d.vy) { d.z = (d.z || 0) + d.vy * dt; d.vy += 600 * dt; if (d.z >= 0) { d.z = 0; d.vy = 0; } }
  }
}

// ---------- 몬스터 행동 ----------
const heroesOf = (team) => G.units.filter((u) => u.kind === "hero" && u.team === team);
function mobTarget(m) {
  let best = null, bd = 1e9;
  for (const h of heroesOf(0)) if (h.alive && !hasBuff(h, "stealth")) { const d = dist(m, h); if (d < bd) { bd = d; best = h; } }
  for (const u of G.units) if (u.kind === "summon" && u.team !== m.team && u.alive) { const d = dist(m, u) + 120; if (d < bd) { bd = d; best = u; } }
  return best;
}
function moveToward(u, tx, ty, spd, dt) {
  const dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy); if (d < 1) return d;
  u.x += (dx / d) * spd * dt; u.y += (dy / d) * spd * dt; if (Math.abs(dx) > 3) u.flip = dx < 0;
  // 서로 겹치지 않게
  for (const o of G.units) if (o !== u && o.alive && o.team === u.team && (o.kind === "mob" || o.kind === "boss")) { const ox = u.x - o.x, oy = u.y - o.y, od = Math.hypot(ox, oy), mm = (u.r + o.r) * 0.8; if (od < mm && od > 0.1) { u.x += (ox / od) * (mm - od) * 0.5; u.y += (oy / od) * (mm - od) * 0.5; } }
  collide(u); return d;
}
function updateMob(m, dt) {
  if (m.dummy) return;
  const tg = mobTarget(m); m.t -= dt; m.ph += dt;
  const spd = spdOf(m);
  if (!tg) { if (m.t <= 0) { m.wx = rnd(BL + 50, BR - 50); m.wy = rnd(BT + 50, BB - 50); m.t = 2; } if (m.wx) moveToward(m, m.wx, m.wy, spd * 0.4, dt); return; }
  const d = dist(m, tg), ai = m.def.ai;
  if (m.st === "wind") { if (m.t <= 0) m.st = "idle", m.t = rnd(0.5, 0.9); return; }
  if (m.st === "charge") { m.x += m.cvx * dt; m.y += m.cvy * dt; collide(m); for (const f of foesOf(1)) if (!m.chit && dist(f, m) < f.r + m.r) { m.chit = true; damage(f, m.dmg * 1.3, m); } if (m.t <= 0) { m.st = "idle"; m.t = 1.2; } return; }
  if (ai === "chase" || ai === "weave") {
    const reach = m.r + tg.r + 26;
    if (d > reach) { let tx = tg.x, ty = tg.y; if (ai === "weave") { const a = angTo(m, tg) + Math.sin(m.ph * 4) * 0.9; tx = m.x + Math.cos(a) * 100; ty = m.y + Math.sin(a) * 100; } moveToward(m, tx, ty, spd, dt); }
    else if (m.t <= 0) meleeWind(m, tg, ai === "weave" ? 0.32 : 0.45);
  } else if (ai === "ranged") {
    if (d > 460) moveToward(m, tg.x, tg.y, spd, dt); else if (d < 260) { const a = angTo(tg, m); moveToward(m, m.x + Math.cos(a) * 60, m.y + Math.sin(a) * 60, spd, dt); }
    if (m.t <= 0) { m.st = "wind"; m.t = 0.35; m.flash = 0.35; const a = angTo(m, tg); schedule(0.35, () => { if (!m.alive || m.stunT > 0) return; const n = m.elite ? 3 : 1; for (let i = 0; i < n; i++) eShot(m, a + (i - (n - 1) / 2) * 0.22, m.def.shot.spd, m.dmg); }); m.t = m.def.shot.cd * rnd(0.85, 1.2) + 0.35; }
  } else if (ai === "charger") {
    if (m.t <= 0 && d < 650) {
      const a = angTo(m, tg); m.st = "wind"; m.t = 0.75;
      G.tele.push({ shape: "line", x: m.x, y: m.y, a, len: 480, w: m.r * 2, t: 0, max: 0.75, team: 1, src: m, dmg: 0, follow: m });
      schedule(0.75, () => { if (!m.alive || m.stunT > 0) return; m.st = "charge"; m.t = 0.42; m.cvx = Math.cos(a) * 1150; m.cvy = Math.sin(a) * 1150; m.chit = false; });
      m.t = 0.75;
    } else moveToward(m, tg.x, tg.y, spd, dt);
  } else if (ai === "caster") {
    if (d > 520) moveToward(m, tg.x, tg.y, spd, dt); else if (d < 300) { const a = angTo(tg, m); moveToward(m, m.x + Math.cos(a) * 60, m.y + Math.sin(a) * 60, spd, dt); }
    if (m.t <= 0) { m.flash = 0.9; const n = m.elite ? 3 : 1; for (let i = 0; i < n; i++) { const p = clampPt({ x: tg.x + (i ? rnd(-120, 120) : 0), y: tg.y + (i ? rnd(-120, 120) : 0) }); G.tele.push({ shape: "circle", x: p.x, y: p.y, r: 95, t: 0, max: 1.0, team: 1, src: m, dmg: m.dmg * 1.2 }); } m.t = rnd(2.6, 3.4); }
  } else if (ai === "blinker") {
    if (m.t <= 0) {
      if (d > 140) { const a = Math.random() * 6.28; G.fx.push({ k: "puff", x: m.x, y: m.y, t: 0, max: 0.35, col: "#8a6bff" }); m.x = tg.x + Math.cos(a) * 110; m.y = tg.y + Math.sin(a) * 110; collide(m); G.fx.push({ k: "puff", x: m.x, y: m.y, t: 0, max: 0.35, col: "#8a6bff" }); m.st = "wind"; m.t = 0.2; schedule(0.2, () => m.alive && meleeWind(m, tg, 0.4)); }
      else meleeWind(m, tg, 0.4);
    } else if (d > m.r + tg.r + 20) moveToward(m, tg.x, tg.y, spd * 0.6, dt);
  }
}
function meleeWind(m, tg, wind) {
  const a = angTo(m, tg), R = m.r + 70;
  G.tele.push({ shape: "arc", x: m.x, y: m.y, a, r: R, w: 1.6, t: 0, max: wind, team: 1, src: m, dmg: m.dmg, follow: m });
  m.st = "wind"; m.t = wind;
  schedule(wind, () => { if (m.alive) m.t = rnd(0.7, 1.1); });
}
// 보스마다 컨셉 색·전용 그림 (사용자 요청 11-11)
const BCOL = { b_boss: "#9b6bff", b_boss2: "#ff7a3d", b_boss3: "#9fe8ff", b_boss4: "#8fdc5a", b_boss5: "#6fb8ff", b_boss6: "#d9b27a" };
const SPIN_SHOT = { b_boss4: 1, b_boss6: 1 };
function bfx(b, name) { const k = "cvfx_bfx_" + (b.fx || b.img) + "_" + name; return IMG[k] && IMG[k].naturalWidth ? k : null; }
function eShot(m, a, spd, dmg, o = {}) { const pr = { home: o.home || 0, bimg: m.kind === "boss" && IMG["cvfx_bp_" + (m.fx || m.img)] ? "cvfx_bp_" + (m.fx || m.img) : null, spin: m.kind === "boss" && SPIN_SHOT[m.fx || m.img] ? 1 : 0, fromBoss: m.kind === "boss", x: m.x, y: m.y - m.r * 0.4, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: o.r || 10, team: 1, src: m, d: dmg, life: o.life || 3, pierce: 0, hit: new Set(), col: o.col || "#ff4d5a", shape: "orb", slow: o.slow || 0, ang: a }; G.projs.push(pr); return pr; }

// ---------- 보스 패턴 ----------
function updateBoss(b, dt) {
  if (b.img !== b.type && ASSETS.meta && ASSETS.meta[b.type]) b.img = b.type; // 층 그림 묶음이 뒤늦게 와도 전용 그림으로 (11-15)
  const tg = mobTarget(b) || heroesOf(0).find((h) => h.alive); b.tg = tg; if (!tg) return;
  const ph2 = b.hp < b.maxHp * 0.5, sp = ph2 ? 1.35 : 1;
  if (ph2 && !b.ph2) { b.ph2 = true; G.banner = { text: "분노!", sub: b.name + "의 공격이 빨라집니다", t: 1.6, boss: true }; G.shake = 12;
    G.slowT = Math.max(G.slowT || 0, 0.7); b.flash = 0.6; sfx("boom"); G.fx.push({ k: "ring", x: b.x, y: b.y, r: 520, t: 0, max: 0.9, col: "#ff3b30" }, { k: "ring", x: b.x, y: b.y, r: 260, t: 0, max: 0.6, col: "#ffb547" }); // 11-18 분노 전환 연출: 순간 느려짐·충격파·굉음
    for (let i = 0; i < 24; i++) spark(b.x + rnd(-60, 60), b.y - b.r + rnd(-40, 40), i % 2 ? "#ff6a4d" : "#ffd27a", 8); }
  b.t -= dt * sp;
  if (b.castT > 0) b.castT -= dt; if (b.atkT > 0) b.atkT -= dt; if (b.guardT > 0) { b.guardT -= dt; if (b.guardT <= 0) { G.banner = { text: "반격!", sub: b.name + "의 돌 껍질이 깨집니다", t: 1.2, boss: true }; } }
  if (b.st === "charge" && b.trailOn) { b.trailT = (b.trailT || 0) - dt; if (b.trailT <= 0) { b.trailT = 0.07; G.zones.push({ x: b.x, y: b.y, r: 62, dur: 3.2, t: 0, dps: b.dmg * 0.9, slow: 0, guard: 0, execute: 0, team: 1, src: b, follow: null, col: BCOL.b_boss2, tick: 0.2, vk: bfx(b, "magma") }); } }  if (b.st === "move") {
    const d = dist(b, tg), S = b.def.style;
    if (S === "ranged") {
      if (d < 330) moveToward(b, b.x - (tg.x - b.x), b.y - (tg.y - b.y), spdOf(b) * 0.9, dt);
      else if (d > 580) moveToward(b, tg.x, tg.y, spdOf(b), dt);
      else { b.orb = (b.orb || 1); const a = angTo(tg, b) + 0.6 * b.orb; moveToward(b, tg.x + Math.cos(a) * d, tg.y + Math.sin(a) * d, spdOf(b) * 0.6, dt); if (Math.random() < dt * 0.3) b.orb *= -1; }
      b.flip = tg.x < b.x;
    } else if (d > b.r + 90) moveToward(b, tg.x, tg.y, spdOf(b) * (S === "melee" ? 1.2 : 1), dt);
    else { b.flip = tg.x < b.x; if (d < b.r + 30) moveToward(b, b.x - (tg.x - b.x), b.y - (tg.y - b.y), spdOf(b) * 0.5, dt); }
    if (b.t <= 0) {
      let p; const D = b.def;
      if (S === "melee" && d > 460 && D.far) p = pick(D.far); else if (S === "ranged" && d < 250 && D.near) p = pick(D.near); else p = D.pats[b.pi++ % D.pats.length];
      b.st = "busy"; b.t = bossPattern(b, p, ph2);
    }
  } else if (b.st === "busy") { if (b.t <= 0) { b.st = "move"; b.t = ph2 ? 0.9 : 1.5; b.trailOn = false; } }
  else if (b.st === "charge") { b.x += b.cvx * dt; b.y += b.cvy * dt; collide(b); if (!b.chit && dist(b, tg) < b.r + tg.r) { b.chit = true; damage(tg, b.dmg * 1.4, b); } b.ct -= dt; if (b.ct <= 0) b.st = "busy"; }
}
function bossPattern(b, p, ph2) {
  const tg = b.tg || G.p, D = b.dmg, mul = diffMul();
  const T = (o) => G.tele.push(Object.assign({ t: 0, team: 1, src: b, bcol: BCOL[b.fx || b.img], tk: "cvfx_btel_" + (b.fx || b.img) }, o));
  const rainOf = (name, n, r, base, step, mulD) => { b.castT = 0.9; const vk = bfx(b, name); for (let i = 0; i < n; i++) { const p0 = i === 0 ? { x: tg.x, y: tg.y } : { x: rnd(BL + 80, BR - 80), y: rnd(BT + 80, BB - 80) }; T({ shape: "circle", x: p0.x, y: p0.y, r, max: base + i * step, dmg: D * mulD, vk }); } return base + n * step + 0.4; };
  switch (p) {
    // ---- 그림자 도깨비 왕: 방망이 내려치기 · 도깨비불 · 그림자 분신 돌진 · 졸개 부르기
    case "club": { const a = angTo(b, tg); b.atkT = 1.0; T({ shape: "arc", x: b.x, y: b.y, a, r: 300, w: 1.9, max: 0.8, dmg: D * 1.5, vk: bfx(b, "club"), follow: b, followT: 0.3 }); schedule(0.85, () => { if (!b.alive) return; G.shake = Math.max(G.shake, 10); }); return 1.6; }
    case "foxfire": { b.castT = 0.9; const n = ph2 ? 8 : 6; for (let i = 0; i < n; i++) schedule(0.3 + i * 0.12, () => { if (!b.alive) return; eShot(b, (i / n) * 6.28, 190, D * 0.7, { r: 16, home: 2.2, life: 4.5 }); }); return 1.7; }
    case "clones": { b.castT = 0.7; const n = ph2 ? 4 : 3, vk = bfx(b, "clones"); for (let i = 0; i < n; i++) { const a0 = Math.random() * 6.28, s0 = clampPt({ x: tg.x + Math.cos(a0) * 420, y: tg.y + Math.sin(a0) * 420 }), a = Math.atan2(tg.y - s0.y, tg.x - s0.x); T({ shape: "line", x: s0.x, y: s0.y, a, len: 840, w: 90, max: 0.9 + i * 0.25, dmg: D * 1.2, vk }); } return 1.9; }
    // [근거리] 그림자 도깨비 왕 — 방망이 3연타(때마다 다시 겨누고 한 걸음), 뚝딱(제자리 내려치기 + 졸개 둘)
    case "combo": { const n = ph2 ? 4 : 3; for (let i = 0; i < n; i++) schedule(i * 0.55, () => { if (!b.alive) return; const a = angTo(b, tg); b.atkT = 0.5; b.x += Math.cos(a) * 60; b.y += Math.sin(a) * 60; collide(b); T({ shape: "arc", x: b.x, y: b.y, a, r: 240, w: 1.6, max: 0.42, dmg: D * 1.0, vk: bfx(b, "club") }); }); return n * 0.55 + 0.6; }
    case "ddukddak": { b.atkT = 1.0; T({ shape: "circle", x: b.x, y: b.y, r: 270, max: 0.9, dmg: D * 1.4, vk: bfx(b, "club"), follow: b, followT: 0.2 }); schedule(1.0, () => { if (!b.alive) return; G.shake = Math.max(G.shake, 12); const pool = theme().enemies; for (let i = 0; i < 2; i++) { const m = spawnMob(pick(pool), diffMul(), false); m.x = b.x + rnd(-120, 120); m.y = b.y + rnd(-60, 100); collide(m); m.exp = 1; } }); return 1.8; }
    // [근거리] 늪 두꺼비 왕 — 연속 뛰기(3번 따라 뜀), 독 토하기(바닥에 독 웅덩이)
    case "hops": { const n = ph2 ? 4 : 3; for (let i = 0; i < n; i++) schedule(i * 0.75, () => { if (!b.alive) return; const p0 = clampPt({ x: tg.x, y: tg.y }); b.atkT = 0.7; T({ shape: "circle", x: p0.x, y: p0.y, r: 140, max: 0.6, dmg: D * 1.2, vk: bfx(b, "leap") }); schedule(0.6, () => { if (!b.alive) return; b.x = p0.x; b.y = p0.y; collide(b); G.shake = Math.max(G.shake, 8); }); }); return n * 0.75 + 0.6; }
    case "spit": { b.castT = 0.8; const n = ph2 ? 6 : 4, vk = bfx(b, "pool"); for (let i = 0; i < n; i++) { const p0 = clampPt({ x: tg.x + (i ? rnd(-220, 220) : 0), y: tg.y + (i ? rnd(-160, 160) : 0) }); T({ shape: "circle", x: p0.x, y: p0.y, r: 95, max: 0.8 + i * 0.12, dmg: D * 0.8, vk }); schedule(0.85 + i * 0.12, () => { if (!G) return; G.zones.push({ x: p0.x, y: p0.y, r: 95, dur: 4.5, t: 0, dps: D * 0.7, slow: 0.35, guard: 0, execute: 0, team: 1, src: b, follow: null, col: BCOL.b_boss4, tick: 0.2, vk }); }); } return 1.6; }
    // [근거리] 돌 수문장 — 방어 자세(2.5초 동안 받는 피해 -80%) 뒤 큰 땅울림 반격
    case "guard": { b.guardT = 2.5; b.castT = 2.5; G.banner = { text: "돌 껍질", sub: "공격이 잘 안 들어갑니다 — 반격을 피하세요!", t: 1.4, boss: true }; schedule(2.5, () => { if (!b.alive) return; b.atkT = 1.0; for (let i = 0; i < 4; i++) T({ shape: "ring", x: b.x, y: b.y, r: 160 + i * 140, w: 80, max: 0.7 + i * 0.3, dmg: D * 1.4, vk: bfx(b, "quake") }); }); return 4.3; }
    // [원거리] 불꽃 도깨비 왕 — 불벽(방을 가로지르는 불줄기가 차례로)
    case "firewall": { b.castT = 1.0; const n = ph2 ? 4 : 3, vert = Math.random() < 0.5, vk = bfx(b, "eruption"); for (let i = 0; i < n; i++) { const f = (i + 0.5) / n; if (vert) T({ shape: "line", x: BL + (BR - BL) * f, y: BT, a: Math.PI / 2, len: BB - BT, w: 110, max: 0.9 + i * 0.35, dmg: D * 1.2, vk }); else T({ shape: "line", x: BL, y: BT + (BB - BT) * f, a: 0, len: BR - BL, w: 100, max: 0.9 + i * 0.35, dmg: D * 1.2, vk }); } return 1.2 + n * 0.35; }
    // [원거리] 서리 도깨비 왕 — 저격(조준선 뒤 빠른 얼음창 3발), 얼음 감옥(둘레가 먼저, 가운데가 나중에)
    case "snipe": { b.castT = 1.6; const n = ph2 ? 4 : 3; for (let i = 0; i < n; i++) schedule(i * 0.6, () => { if (!b.alive) return; const a = angTo(b, tg); T({ shape: "line", x: b.x, y: b.y, a, len: 1200, w: 26, max: 0.45, dmg: 0 }); schedule(0.45, () => { if (!b.alive) return; eShot(b, a, 950, D * 1.2, { r: 16, slow: 0.4 }); }); }); return n * 0.6 + 0.6; }
    case "icecage": { b.castT = 1.0; const c = { x: tg.x, y: tg.y }, vk = bfx(b, "frostnova"); T({ shape: "ring", x: c.x, y: c.y, r: 230, w: 70, max: 0.9, dmg: D * 1.2, vk }); T({ shape: "circle", x: c.x, y: c.y, r: 150, max: 1.5, dmg: D * 1.5, vk }); return 1.9; }
    // [원거리] 저승사자 — 혼 사냥(느리게 따라오는 혼불 여러 개)
    case "soulhunt": { b.castT = 1.0; const n = ph2 ? 7 : 5; for (let i = 0; i < n; i++) schedule(0.2 + i * 0.15, () => { if (!b.alive) return; eShot(b, angTo(b, tg) + (i - (n - 1) / 2) * 0.5, 170, D * 0.75, { r: 17, home: 2.6, life: 5 }); }); return 1.6; }
    // ---- 불꽃 도깨비 왕: 운석 · 불길 부채 · 용암 돌진 · 용암 분출
    case "meteor": return rainOf("meteor", ph2 ? 10 : 7, 115, 1.0, 0.15, 1.3);
    case "flamewave": { b.castT = 1.0; const w = ph2 ? 4 : 3; for (let k = 0; k < w; k++) schedule(0.3 + k * 0.4, () => { if (!b.alive) return; const a = angTo(b, tg); for (let i = -4; i <= 4; i++) eShot(b, a + i * 0.13 + (k % 2 ? 0.065 : 0), 360, D * 0.6, { r: 14 }); }); return 0.6 + w * 0.4; }
    case "magma": { b.trailOn = true; const n = ph2 ? 3 : 2; let tt = 0;
      for (let i = 0; i < n; i++) { schedule(tt, () => { if (!b.alive) return; const a = angTo(b, tg); b.atkT = 1.2; T({ shape: "line", x: b.x, y: b.y, a, len: 900, w: b.r * 1.8, max: 0.7, dmg: 0, follow: b }); schedule(0.7, () => { if (!b.alive || b.stunT > 0) return; b.st = "charge"; b.ct = 0.55; b.cvx = Math.cos(a) * 1500; b.cvy = Math.sin(a) * 1500; b.chit = false; }); }); tt += 1.45; }
      return tt + 0.3; }
    case "eruption": { b.castT = 1.0; const vk = bfx(b, "eruption"); for (let ring = 0; ring < 3; ring++) { const n = 6 + ring * 4, R = 150 + ring * 150; for (let i = 0; i < n; i++) { const a = (i / n) * 6.28 + ring * 0.3, p0 = clampPt({ x: b.x + Math.cos(a) * R, y: b.y + Math.sin(a) * R * 0.75 }); T({ shape: "circle", x: p0.x, y: p0.y, r: 70, max: 0.8 + ring * 0.35, dmg: D * 1.1, vk }); } } return 2.0; }
    // ---- 서리 도깨비 왕: 얼음창 십자 · 서리 폭발 · 빙하 가시 · 눈보라
    case "icespear": p = "cross"; break;
    case "frostnova": { b.castT = 1.0; T({ shape: "circle", x: b.x, y: b.y, r: 300, max: 1.0, dmg: D * 1.3, vk: bfx(b, "frostnova"), follow: b }); schedule(1.0, () => { if (!b.alive) return; for (let i = 0; i < 16; i++) eShot(b, (i / 16) * 6.28, 280, D * 0.5, { r: 12, slow: 0.4 }); }); return 1.8; }
    case "glacier": { b.atkT = 1.0; const n = ph2 ? 3 : 2, vk = bfx(b, "glacier"); for (let i = 0; i < n; i++) schedule(i * 0.5, () => { if (!b.alive) return; const a = angTo(b, tg) + (i ? rnd(-0.3, 0.3) : 0); T({ shape: "line", x: b.x, y: b.y, a, len: 1000, w: 80, max: 0.8, dmg: D * 1.4, vk }); }); return n * 0.5 + 1.0; }
    case "blizzard": return rainOf("blizzard", ph2 ? 20 : 14, 72, 0.9, 0.08, 0.9);
    // ---- 늪 두꺼비 왕: 내려찍기 · 혀 채찍(끌어당김) · 독 방울(독 웅덩이) · 졸개
    case "tongue": { b.atkT = 0.8; const a = angTo(b, tg); T({ shape: "line", x: b.x, y: b.y, a, len: 650, w: 60, max: 0.65, dmg: D * 1.3, vk: bfx(b, "tongue") }); schedule(0.7, () => { if (!b.alive) return; for (const h of heroesOf(0)) if (h.alive && segDist(h.x, h.y, b.x, b.y, b.x + Math.cos(a) * 650, b.y + Math.sin(a) * 650) < 60 + h.r) { h.x += (b.x - h.x) * 0.45; h.y += (b.y - h.y) * 0.45; collide(h); } }); return 1.3; }
    case "bubbles": { b.castT = 0.9; const n = ph2 ? 10 : 7, vk = bfx(b, "pool"); for (let i = 0; i < n; i++) schedule(0.2 + i * 0.1, () => { if (!b.alive) return; const pr = eShot(b, angTo(b, tg) + rnd(-0.9, 0.9), rnd(140, 220), D * 0.6, { r: 18, life: 2.6 }); schedule(2.5, () => { if (!G) return; G.zones.push({ x: pr.x, y: pr.y, r: 70, dur: 4, t: 0, dps: D * 0.7, slow: 0.3, guard: 0, execute: 0, team: 1, src: b, follow: null, col: BCOL.b_boss4, tick: 0.2, vk }); }); }); return 1.6; }
    // ---- 저승사자: 낫 휘두르기 · 혼 사슬 · 순간이동 · 혼불 소용돌이 · 심판 낙인
    case "scythe": { b.atkT = 1.0; const a = angTo(b, tg), vk = bfx(b, "scythe"); T({ shape: "arc", x: b.x, y: b.y, a, r: 340, w: 3.0, max: 0.85, dmg: D * 1.5, vk, follow: b }); if (ph2) schedule(1.0, () => { if (!b.alive) return; const a2 = angTo(b, tg); T({ shape: "arc", x: b.x, y: b.y, a: a2, r: 340, w: 3.0, max: 0.7, dmg: D * 1.5, vk, follow: b }); }); return ph2 ? 2.0 : 1.4; }
    case "chains": { b.castT = 1.0; const n = ph2 ? 4 : 3, vk = bfx(b, "chains"); for (let i = 0; i < n; i++) { const sd = i % 4, p0 = sd === 0 ? { x: BL, y: tg.y + rnd(-60, 60) } : sd === 1 ? { x: BR, y: tg.y + rnd(-60, 60) } : sd === 2 ? { x: tg.x + rnd(-60, 60), y: BT } : { x: tg.x + rnd(-60, 60), y: BB }; T({ shape: "line", x: p0.x, y: p0.y, a: Math.atan2(tg.y - p0.y, tg.x - p0.x), len: 1600, w: 56, max: 1.0 + i * 0.2, dmg: D * 1.2, vk }); } return 1.9; }
    case "soulspiral": p = "spiral"; b.castT = 1.2; break;
    case "judgment": { b.castT = 1.1; const vk = bfx(b, "judgment"); for (const h of heroesOf(0)) if (h.alive) T({ shape: "circle", x: h.x, y: h.y, r: 150, max: 1.5, dmg: D * 1.8, vk, follow: h, followT: 0.8 }); return 2.0; }
    // ---- 돌 수문장: 땅울림 · 바위 낙하 · 균열 · 망치 내려치기
    case "rockfall": return rainOf("rockfall", ph2 ? 12 : 8, 105, 1.0, 0.12, 1.2);
    case "fissure": { b.atkT = 1.0; T({ shape: "line", x: b.x, y: b.y, a: angTo(b, tg), len: 1100, w: 100, max: 0.9, dmg: D * 1.6, vk: bfx(b, "fissure") }); G.shake = Math.max(G.shake, 6); return 1.6; }
  }
  switch (p) {
    case "ring": { const waves = ph2 ? 3 : 2; for (let w = 0; w < waves; w++) schedule(0.5 + w * 0.5, () => { if (!b.alive) return; const n = ph2 ? 22 : 16, off = w * 0.15; for (let i = 0; i < n; i++) eShot(b, off + (i / n) * 6.28, 300, D * 0.7, { r: 12 }); }); b.flash = 0.5; return 0.6 + waves * 0.5; }
    case "spiral": { const n = ph2 ? 40 : 28; for (let i = 0; i < n; i++) schedule(i * 0.07, () => { if (!b.alive) return; const a = i * 0.45; eShot(b, a, 320, D * 0.6, { r: 11, col: "#c38bff" }); eShot(b, a + Math.PI, 320, D * 0.6, { r: 11, col: "#c38bff" }); }); return n * 0.07 + 0.4; }
    case "cross": { for (let w = 0; w < (ph2 ? 3 : 2); w++) schedule(0.4 + w * 0.6, () => { if (!b.alive) return; const off = w % 2 ? Math.PI / 4 : 0; for (let k = 0; k < 4; k++) for (let j = 0; j < 5; j++) eShot(b, off + k * Math.PI / 2, 260 + j * 60, D * 0.65, { r: 12, col: "#9fe8ff", slow: 0.3 }); }); return 1.8; }
    case "slam": { const n = ph2 ? 4 : 3; for (let i = 0; i < n; i++) schedule(i * 0.45, () => { if (!b.alive) return; const p0 = clampPt({ x: tg.x, y: tg.y }); T({ shape: "circle", x: p0.x, y: p0.y, r: 130, max: 0.85, dmg: D * 1.3, vk: bfx(b, "slam") }); }); b.atkT = n * 0.45; return n * 0.45 + 0.9; }
    case "rain": { const n = ph2 ? 12 : 8; for (let i = 0; i < n; i++) { const p0 = i === 0 ? { x: tg.x, y: tg.y } : { x: rnd(BL + 80, BR - 80), y: rnd(BT + 80, BB - 80) }; T({ shape: "circle", x: p0.x, y: p0.y, r: 100, max: 1.1 + i * 0.06, dmg: D * 1.1 }); } return 1.6; }
    case "charge": {
      const n = ph2 ? 3 : 2; let tt = 0;
      for (let i = 0; i < n; i++) { schedule(tt, () => { if (!b.alive) return; const a = angTo(b, tg); T({ shape: "line", x: b.x, y: b.y, a, len: 900, w: b.r * 1.8, max: 0.7, dmg: 0, follow: b }); schedule(0.7, () => { if (!b.alive || b.stunT > 0) return; b.st = "charge"; b.ct = 0.55; b.cvx = Math.cos(a) * 1500; b.cvy = Math.sin(a) * 1500; b.chit = false; }); }); tt += 1.45; }
      return tt + 0.3;
    }
    case "blink": { b.flash = 0.6; schedule(0.5, () => { if (!b.alive) return; G.fx.push({ k: "puff", x: b.x, y: b.y, t: 0, max: 0.4, col: "#8a6bff" }); const a = Math.random() * 6.28; const p0 = clampPt({ x: tg.x + Math.cos(a) * 160, y: tg.y + Math.sin(a) * 160 }); b.x = p0.x; b.y = p0.y; collide(b); T({ shape: "circle", x: b.x, y: b.y, r: 210, max: 0.8, dmg: D * 1.4 }); }); return 1.5; }
    case "summon": { b.castT = 0.8; const sk = bfx(b, "summon"); if (sk) G.fx.push({ k: "sig", key: sk, x: b.x, y: b.y + 20, r: 220, t: 0, max: 0.9 }); const pool = theme().enemies; for (let i = 0; i < (ph2 ? 4 : 3); i++) { const m = spawnMob(pick(pool), mul, false); m.x = b.x + rnd(-150, 150); m.y = b.y + rnd(-80, 120); collide(m); m.exp = 1; } G.fx.push({ k: "ring", x: b.x, y: b.y, r: 200, t: 0, max: 0.5, col: "#8a6bff" }); return 1.0; }
    case "leap": { const p0 = clampPt({ x: tg.x, y: tg.y }); b.atkT = 1.0; T({ shape: "circle", x: p0.x, y: p0.y, r: 190, max: 1.0, dmg: D * 1.6, vk: bfx(b, "leap") }); schedule(0.9, () => { if (!b.alive) return; b.x = p0.x; b.y = p0.y; collide(b); G.shake = 14; if (b.def.style === "melee") G.zones.push({ x: b.x, y: b.y, r: 120, dur: 3, t: 0, dps: D * 0.6, slow: 0.3, guard: 0, execute: 0, team: 1, src: b, follow: null, col: BCOL[b.img] || "#8fdc5a", tick: 0.2, vk: bfx(b, "pool") }); else for (let i = 0; i < 12; i++) eShot(b, (i / 12) * 6.28, 260, D * 0.5, { col: "#8fdc5a" }); }); return 1.6; }
    case "quake": { b.atkT = 0.9; for (let i = 0; i < 3; i++) T({ shape: "ring", x: b.x, y: b.y, r: 140 + i * 130, w: 70, max: 0.9 + i * 0.35, dmg: D * 1.2, vk: bfx(b, "quake") }); return 2.0; }
  }
  return 1;
}

// ---------- 소환수·펫 행동 ----------
function nearestFoe(u, range = 9999) { let best = null, bd = range; for (const f of foesOf(u.team)) { const d = dist(u, f); if (d < bd) { bd = d; best = f; } } return best; }
function updateSummon(s, dt) {
  s.life -= dt; if (s.life <= 0 || !s.owner.alive) { s.alive = false; G.fx.push({ k: "puff", x: s.x, y: s.y, t: 0, max: 0.4, col: "#9ff3f8" }); return; }
  s.cd -= dt; s.ph += dt;
  const tg = nearestFoe(s, 900), S = s.s, boost = 1 + buffSum(s.owner, "summonBoost");
  if (!tg) { if (dist(s, s.owner) > 90) moveToward(s, s.owner.x + Math.cos(s.ph) * 60, s.owner.y + Math.sin(s.ph) * 60, S.spd, dt); return; }
  const d = dist(s, tg);
  if (d > S.range + tg.r) moveToward(s, tg.x, tg.y, S.spd, dt);
  else if (s.cd <= 0) {
    s.cd = S.cd; const dm = atkOf(s.owner) * S.d * boost;
    if (S.beam) { G.fx.push({ k: "beam", x: s.x, y: s.y - 20, a: angTo(s, tg), len: d + 40, w: 40, t: 0, max: 0.3, col: "#ffd84a" }); hit(s, tg, dm, {}); for (const f of foesOf(s.team)) if (f !== tg && segDist(f.x, f.y, s.x, s.y, tg.x, tg.y) < 30 + f.r) hit(s, f, dm * 0.6, {}); }
    else if (S.ranged) G.projs.push({ x: s.x, y: s.y - 20, vx: Math.cos(angTo(s, tg)) * 700, vy: Math.sin(angTo(s, tg)) * 700, r: 9, team: s.team, src: s, d: dm, life: 0.8, pierce: 0, hit: new Set(), col: "#9ff3f8", shape: "orb", home: 3, ang: angTo(s, tg) });
    else { hit(s, tg, dm, {}); G.fx.push({ k: "slash", x: tg.x, y: tg.y - 10, r: 40, a: angTo(s, tg), w: 2, t: 0, max: 0.15, col: "#9ff3f8" }); }
  }
}
function updatePet(p, dt) {
  const o = p.owner; p.cd -= dt; p.ph += dt;
  // 너무 붙지도 멀지도 않게: 주인 뒤쪽 약 95px (사용자 요청 11-11)
  const side = o.flip ? 1 : -1, P = p.P.pet, home = { x: o.x + side * 95 + Math.cos(p.ph) * 12, y: o.y - 18 + Math.sin(p.ph * 1.3) * 10 };
  const tg = nearestFoe(p, 600);
  if (P.kind === "melee" && tg) { if (dist(p, tg) > tg.r + 30) moveToward(p, tg.x, tg.y, 330, dt); else if (p.cd <= 0) { p.cd = P.t; hit(o, tg, atkOf(o) * P.d * p.lvMul, {}); G.fx.push({ k: "slash", x: tg.x, y: tg.y, r: 34, a: 0, w: 6, t: 0, max: 0.15, col: "#fff" }); } return; }
  if (dist(p, home) > 10) moveToward(p, home.x, home.y, Math.max(160, dist(p, home) * 3), dt);
  if (p.cd > 0) return;
  if (P.kind === "shoot" && tg) { p.cd = P.t; const a = angTo(p, tg); G.projs.push({ x: p.x, y: p.y, vx: Math.cos(a) * 750, vy: Math.sin(a) * 750, r: 8, team: 0, src: o, d: atkOf(o) * P.d * p.lvMul, life: 0.9, pierce: P.pierce ? 5 : 0, hit: new Set(), col: P.burn ? "#ff8a3d" : "#ffe08a", shape: "orb", home: P.home ? 3 : 0, burn: P.burn ? 3 : 0, ang: a, petShot: true }); }
  else if (P.kind === "slam" && tg && dist(o, tg) < 260) { p.cd = P.t; for (const f of foesOf(0)) if (dist(f, p) < 150 + f.r) hit(o, f, atkOf(o) * P.d * p.lvMul, {}); G.fx.push({ k: "ring", x: p.x, y: p.y, r: 150, t: 0, max: 0.3, col: "#ffcf5a" }); }
  else if (P.kind === "shield") { p.cd = P.t; o.shield = Math.max(o.shield, o.maxHp * P.v * p.lvMul); G.fx.push({ k: "aura", x: o.x, y: o.y, t: 0, max: 0.5, col: "#9fd8ff", u: o }); }
  else if (P.kind === "gold") { p.cd = P.t; if (roomLocked()) G.drops.push({ type: "gold", v: rint(2, 6), x: p.x, y: p.y + 20 }); }
  else if (P.kind === "heal") { p.cd = P.t; if (o.hp < o.maxHp) { healUnit(o, o.maxHp * P.v * p.lvMul); G.fx.push({ k: "aura", x: o.x, y: o.y, t: 0, max: 0.5, col: "#7fff9f", u: o }); } }
  else if (P.kind === "freeze" && tg && dist(o, tg) < 300) { p.cd = P.t; for (const f of foesOf(0)) if (dist(f, p) < 200 + f.r) hit(o, f, atkOf(o) * P.d * p.lvMul, { stun: 1, slow: 0.4 }); G.fx.push({ k: "ring", x: p.x, y: p.y, r: 200, t: 0, max: 0.4, col: "#9fe8ff" }); }
  else if (P.kind === "chain" && tg) { p.cd = P.t; runFx(o, { t: "chain", n: P.n || 4, d: P.d * p.lvMul, range: 420, col: "#fff27a" }, 1, tg, {}); }
}

// ---------- 투사체·장판·예고 ----------
function updateProjs(dt) {
  for (const pr of G.projs) {
    pr.life -= dt;
    if (pr.home) { const tg = nearestFoe({ x: pr.x, y: pr.y, team: pr.team }, 500); if (tg) { const a = Math.atan2(tg.y - pr.y, tg.x - pr.x), sp = Math.hypot(pr.vx, pr.vy); let cur = Math.atan2(pr.vy, pr.vx); let df = a - cur; while (df > Math.PI) df -= 6.283; while (df < -Math.PI) df += 6.283; cur += clamp(df, -pr.home * dt, pr.home * dt); pr.vx = Math.cos(cur) * sp; pr.vy = Math.sin(cur) * sp; } }
    pr.x += pr.vx * dt; pr.y += pr.vy * dt; pr.ang = Math.atan2(pr.vy, pr.vx);
    if (pr.x < BL - 10 || pr.x > BR + 10 || pr.y < BT - 30 || pr.y > BB + 10 || G.cur.obs.some((o) => Math.hypot(o.x - pr.x, o.y - pr.y) < o.r)) { pr.life = 0; if (pr.explode) explode(pr); continue; }
    for (const f of foesOf(pr.team)) {
      if (pr.hit.has(f) || Math.hypot(f.x - pr.x, f.y - (pr.team === 1 ? pr.y + 10 : pr.y + 16)) > f.r + pr.r) continue;
      pr.hit.add(f);
      if (pr.team === 1 && f.kind === "hero") { damage(f, pr.d, pr.src); if (pr.slow) { f.slow = pr.slow; f.slowT = 1.2; } }
      else hit(pr.src, f, pr.d, { tag: pr.tag, burn: pr.burn, slow: pr.slow, stun: pr.stun, knock: pr.knock, pull: pr.pull, drain: pr.drain, from: pr, basic: pr.basic, el: pr.el });
      if (pr.explode) { explode(pr); pr.life = 0; break; }
      if (pr.pierce-- <= 0) { pr.life = 0; break; }
    }
  }
  G.projs = G.projs.filter((p) => p.life > 0);
}
function explode(pr) { for (const f of foesOf(pr.team)) if (Math.hypot(f.x - pr.x, f.y - pr.y) < pr.explode + f.r && !pr.hit.has(f)) hit(pr.src, f, pr.d * 0.7, { burn: pr.burn, tag: pr.tag }); G.fx.push({ k: "ring", x: pr.x, y: pr.y, r: pr.explode, t: 0, max: 0.35, col: pr.col }); sfx("boom"); }
function updateZones(dt) {
  for (const z of G.zones) {
    z.t += dt; if (z.follow) { z.x = z.follow.x; z.y = z.follow.y; }
    z.tick -= dt;
    if (z.tick <= 0) { z.tick = 0.25;
      for (const f of foesOf(z.team)) if (Math.hypot(f.x - z.x, f.y - z.y) < z.r + f.r * 0.5) {
        if (z.execute && f.kind === "mob" && f.hp < f.maxHp * z.execute && Math.random() < EXEC_CHANCE) { damage(f, f.hp + 1, z.src, true, {}); continue; }
        hit(z.src, f, z.dps * 0.25, { dot: true, slow: z.slow, slowDur: 0.4, el: z.el, tag: z.tag });
      }
    }
  }
  G.zones = G.zones.filter((z) => z.t < z.dur);
}
function updateTele(dt) {
  for (const t of G.tele) {
    t.t += dt; if (t.follow && t.t < (t.followT != null ? t.followT : t.max)) { t.x = t.follow.x; t.y = t.follow.y; }
    if (t.t >= t.max && !t.done) {
      t.done = true;
      const victims = foesOf(t.team).filter((f) => inShape(t, f));
      if (t.dmg > 0) for (const f of victims) { if (t.team === 1 && t.src.kind !== "hero") damage(f, t.dmg, t.src); else hit(t.src, f, t.dmg, { stun: t.stun, knock: 40, from: t, el: t.el }); }
      if (t.shape === "circle" && t.vk) { G.fx.push({ k: "sig", key: t.vk, x: t.x, y: t.y, r: t.r * 1.15, t: 0, max: 0.5 }); if (t.r > 140) G.shake = Math.max(G.shake, 8); }
      else if (t.shape === "circle") { G.fx.push({ k: t.bolt ? "boltDown" : "ring", x: t.x, y: t.y, r: t.r, t: 0, max: 0.35, col: t.friendly ? t.col || "#ffd27a" : "#ff5a4d", cid: t.friendly && t.src && t.src.kind === "hero" ? t.src.id : t.src && t.src.kind === "boss" ? "boss" : t.friendly ? null : "mob" }); if (t.r > 140) G.shake = Math.max(G.shake, 8); }
      if (t.vk && t.shape === "arc") G.fx.push({ k: "sig", key: t.vk, x: t.x + Math.cos(t.a) * t.r * 0.45, y: t.y + Math.sin(t.a) * t.r * 0.45, r: t.r * 0.8, rot: t.a, t: 0, max: 0.5 });
      else if (t.vk && t.shape === "line") G.fx.push({ k: "sigL", key: t.vk, x: t.x, y: t.y, a: t.a, len: t.len, w: t.w, t: 0, max: 0.55 });
      else if (t.vk && t.shape === "ring") G.fx.push({ k: "sig", key: t.vk, x: t.x, y: t.y, r: t.r + t.w / 2, t: 0, max: 0.5 });
      else if (t.shape === "arc" && t.src.alive) G.fx.push({ k: "slash", x: t.x, y: t.y - 10, r: t.r, a: t.a, w: t.w, t: 0, max: 0.2, col: "#ff8a8a", cid: t.src.kind === "boss" ? "boss" : "mob" });
      if (t.shape === "ring") G.fx.push({ k: "ring", x: t.x, y: t.y, r: t.r + t.w / 2, t: 0, max: 0.3, col: "#d9b27a" });
      if (t.friendly || t.dmg > 0) sfx(t.bolt ? "zap" : "boom");
    }
  }
  G.tele = G.tele.filter((t) => !t.done);
}
function inShape(t, f) {
  const dx = f.x - t.x, dy = f.y - t.y, d = Math.hypot(dx, dy);
  if (t.shape === "circle") return d < t.r + f.r * 0.6;
  if (t.shape === "ring") return d > t.r - t.w / 2 - f.r * 0.5 && d < t.r + t.w / 2 + f.r * 0.5;
  if (t.shape === "arc") return d < t.r + f.r * 0.5 && angDiff(Math.atan2(dy, dx), t.a) < t.w / 2;
  if (t.shape === "line") return segDist(f.x, f.y, t.x, t.y, t.x + Math.cos(t.a) * t.len, t.y + Math.sin(t.a) * t.len) < t.w / 2 + f.r * 0.5;
  return false;
}
function updateOrbs(dt) {
  for (const o of G.orbs) {
    o.t += dt;
    if (!o.free) { o.a = G.time * 3 + (o.i / o.n) * 6.283; o.x = o.owner.x + Math.cos(o.a) * o.r; o.y = o.owner.y - 20 + Math.sin(o.a) * o.r * 0.8;
      if (o.seek && o.t > 0.8 + o.i * 0.9) { const tg = nearestFoe({ x: o.x, y: o.y, team: o.owner.team }, 600); if (tg) { o.free = true; o.tg = tg; } } }
    else { const tg = o.tg; if (!tg || !tg.alive) { o.t = o.dur; continue; } const a = Math.atan2(tg.y - o.y, tg.x - o.x); o.x += Math.cos(a) * 900 * dt; o.y += Math.sin(a) * 900 * dt; if (Math.hypot(tg.x - o.x, tg.y - o.y) < tg.r) { hit(o.owner, tg, o.d * 2, {}); G.fx.push({ k: "ring", x: o.x, y: o.y, r: 60, t: 0, max: 0.25, col: o.col }); o.t = o.dur; } continue; }
    for (const f of foesOf(o.owner.team)) { if (Math.hypot(f.x - o.x, f.y - o.y) < f.r + 16 && (o.cds.get(f) || 0) <= G.time) { o.cds.set(f, G.time + 0.45); hit(o.owner, f, o.d, {}); } }
  }
  G.orbs = G.orbs.filter((o) => o.t < o.dur && o.owner.alive);
}

// ---------- 1대1 컴퓨터 ----------
function updateBot(b, dt) {
  const p = G.p; if (!p.alive || G.duel.state !== "fight") return;
  b.think = (b.think || 0) - dt;
  const d = dist(b, p), melee = /근접/.test(b.def.range), want = melee ? 70 : 340;
  // 위험 지역 피하기
  const danger = G.tele.find((t) => t.team !== b.team && inShape(t, b));
  let mx = 0, my = 0;
  if (danger) { const a = Math.atan2(b.y - danger.y, b.x - danger.x); mx = Math.cos(a); my = Math.sin(a); }
  else {
    const a = angTo(b, p); b.strafe = b.strafe || 1; if (Math.random() < dt * 0.5) b.strafe *= -1;
    if (d > want + 40) { mx = Math.cos(a); my = Math.sin(a); } else if (d < want - 40) { mx = -Math.cos(a); my = -Math.sin(a); }
    mx += Math.cos(a + Math.PI / 2) * 0.6 * b.strafe; my += Math.sin(a + Math.PI / 2) * 0.6 * b.strafe;
  }
  const ml = Math.hypot(mx, my) || 1, sp = spdOf(b);
  b.x += (mx / ml) * sp * dt; b.y += (my / ml) * sp * dt; b.moving = true; if (Math.abs(mx) > 0.2) b.flip = mx < 0; collide(b);
  if (b.think > 0) return; b.think = G.duel.react;
  const reach = melee ? (b.def.basic.fx[0].r || 100) + p.r : 620;
  if (d < reach && b.cd.B <= 0) basicAttack(b);
  const order = ["R", "Q", "W", "E"].sort(() => Math.random() - 0.5);
  for (const s of order) {
    const sk = b.sk[s]; if (!sk || b.cd[s] > 0) continue;
    const t0 = sk.fx[0].t;
    const ok = t0 === "heal" || t0 === "buff" ? b.hp < b.maxHp * 0.65 || sk.fx.some((f) => f.atk) && d < 400
      : t0 === "nova" || t0 === "arc" || t0 === "repeat" ? d < 200
      : t0 === "dash" ? d < 380 && d > 120 || b.hp < b.maxHp * 0.3
      : t0 === "blink" ? d > 300 || b.hp < b.maxHp * 0.3
      : d < 700;
    if (ok) { useSkill(b, s); break; }
  }
}
const DUEL_READY = 3;
function updateDuel(dt) {
  const D = G.duel;
  if (D.state === "ready") { // 3·2·1 뒤 시작, 그동안 둘 다 못 움직이고 못 때림
    const before = Math.ceil(D.t); D.t -= dt; const now = Math.ceil(D.t);
    if (D.t <= 0) { D.state = "fight"; G.banner = { text: "시작!", sub: `${D.round}라운드`, t: 0.9 }; sfx("level"); }
    else if (now !== before || !D.shown) { D.shown = true; G.banner = { text: String(now), sub: `${D.round}라운드 · 준비`, t: 1.05 }; sfx("pick"); }
    return;
  }
  if (D.state === "roundEnd") {
    D.t -= dt;
    if (D.t <= 0) {
      if (D.wins[0] >= 2 || D.wins[1] >= 2) { D.state = "done"; const win = D.wins[0] >= 2; if (win) SAVE.stats.duelWins = (SAVE.stats.duelWins || 0) + 1; checkUnlocks(); saveGame(); endRun(win); }
      else { D.round++; D.state = "ready"; D.t = DUEL_READY; D.shown = false; duelRoundReset(); }
    }
  }
}

// ---------- 스테이지 끝 ----------
// 홍살문 포탈 (사용자 요청 11-12): 보스를 잡아도 바로 넘어가지 않음 — 포탈 안에 1초 서 있어야 다음 스테이지. 그 전까지 다른 방도 다닐 수 있음
const hellNoHeal = () => !!(G && G.opt && G.opt.diff === "hell" && (G.mode === "story" || G.mode === "endless"));
function portalDrop() { const p = G.p || { x: RW / 2, y: RH / 2 }; return { type: "stairs", portal: true, x: p.x < RW / 2 ? RW / 2 + 330 : RW / 2 - 330, y: RH / 2 - 30, hold: 0 }; }
function endlessNextStage() {
  G.trans = { t: 0.4, max: 0.4, mode: "out", then: () => {
    for (const h of heroesOf(0)) { if (!h.alive) { h.alive = true; h.hp = h.maxHp * 0.3; } if (!hellNoHeal()) healUnit(h, h.maxHp * 0.25); }
    G.eRoom = 0; G.eBossDone = false;
    if (G.eNext === "floor") {
      if (G.eFloor === 5) { const d = (G.opt && G.opt.diff) || "normal"; const un = (d === "normal" || d === "hard" || d === "hell") && !SAVE.endlessHard ? "endlessHard" : d === "hard" && !SAVE.endlessHell ? "endlessHell" : null; if (un) { SAVE[un] = 1; saveGame(); UI.toast(`🔓 무한의 방 '${un === "endlessHard" ? "어려움" : "매우 어려움"}' 난이도가 열렸어요! (보상 ${un === "endlessHard" ? "1.5" : "2"}배)`, 6000); } }
      G.eFloor++; G.eStage = 1; gainCoin(2, "무한의 방 층 돌파");
      rollCurse(false);
      G.banner = { text: G.eFloor > 5 ? `${Math.floor((G.eFloor - 1) / 5) + 1}회차 ${(G.eFloor - 1) % 5 + 1}층 도착!` : `${G.eFloor}층 도착!`, sub: G.curse ? `${CURSES[G.curse].ic} ${curseSub()}` : `요괴 속성: ${YOKAI_EL[(G.eFloor - 1) % 5].n} (약점 ${YOKAI_EL[(G.eFloor - 1) % 5].strong.map((e) => EL_NAME[e]).join("·")}) · 체력 25% 회복`, t: 3.4 };
    } else { G.eStage++; rollCurse(G.eStage >= STAGES_PER_FLOOR); G.banner = G.curse ? { text: `${CURSES[G.curse].ic} 저주 받은 스테이지`, sub: `${G.eFloor}층 ${G.eStage}스테이지 · ${curseSub()}`, t: 3.5, boss: true } : { text: `${G.eFloor}층 ${G.eStage}스테이지`, sub: G.eStage >= STAGES_PER_FLOOR ? "이번 스테이지 끝에는 층보스!" : "체력 25% 회복", t: 2.4 }; }
    const nf = ((G.eFloor || 1) - 1) % 5 + 1; needPack("f" + nf, floorNow); needPack("f" + (nf % 5 + 1), LATER); setTimeout(warmRun, 50);
    G.rooms = new Map(); const s = newRoom(0, 0, "start"); G.rooms.set("0,0", s); makeEndlessExits(s, null); enterRoom("0,0", null); UI.music("endless");
  } };
}
function stageClear() {
  if (!G.stageHit) SAVE.stats.noHitFloor = (SAVE.stats.noHitFloor || 0) + 1;
  G.trans = { t: 0.4, max: 0.4, mode: "out", then: () => {
    const p = G.p;
    for (const h of heroesOf(0)) if (!h.alive) { h.alive = true; h.hp = h.maxHp * 0.3; }
    if (G.stage < STAGES_PER_FLOOR) { G.stage++; if (!hellNoHeal()) for (const h of heroesOf(0)) healUnit(h, h.maxHp * 0.25); startStage(); UI.toast(`${G.floor}장 ${G.stage}스테이지${hellNoHeal() ? "" : " · 체력 25% 회복"}`); return; }
    // 층 끝
    if (G.opt.daily) { G.paused = true; endRun(true); return; } // 오늘의 괴담은 1층 돌파로 끝
    const clr = `f${G.floor}_clear`, afterClr = (fn) => (STORY[clr] && !G.opt.multi ? UI.story(clr, fn) : fn());
    if (G.floor >= FLOORS.length) { SAVE.stats.storyClear = (SAVE.stats.storyClear || 0) + 1; checkUnlocks(); saveGame(); G.paused = true; afterClr(() => (G.opt.multi ? endRun(true, true) : UI.story("end", () => endRun(true, true)))); return; }
    G.floor++; G.stage = 1;
    SAVE.stats["story_floor" + G.floor] = 1;
    if (G.floor > (SAVE.story.maxFloor || 1)) { SAVE.story.maxFloor = G.floor; gainCoin(4, `스토리 ${G.floor}장 첫 도달`); }
    checkUnlocks(); saveGame(); healUnit(p, p.maxHp * 0.35);
    G.paused = true;
    afterClr(() => (G.opt.multi ? (G.paused = false, startStage()) : UI.story(G.floor, () => { G.paused = false; startStage(); }))); // 11-21 함께하기는 이야기 장면 건너뜀(친구가 기다리지 않게, 이야기책에서 다시 보기)
  } };
}
// 원정 보상 엽전: 처치·방·보스·진행도 + 남은 금화의 절반 (엽전 보너스 아티팩트·칭호 적용)
function runReward(r) {
  if (r.mode === "duel") return r.rank ? r.rank.coin : r.win ? (G.mirror ? 4 : 2) : 0;
  if (r.mode === "dev" || r.mode === "practice") return 0;
  if (r.mode === "raid") { if (G.raidDone) SAVE.stats.raidClear = (SAVE.stats.raidClear || 0) + 1; return (G.raidN || 0) + (G.raidDone ? 5 : 0); } // 보스마다 1개는 이미 받음 + 완주 보너스
  const prog = r.mode === "story" ? ((r.floor - 1) * STAGES_PER_FLOOR + r.stage) * 20 + (r.storyDone ? 600 : 0) : r.endless * 12;
  const base = r.kills * 2 + r.rooms * 10 + (G.bossKills || 0) * 45 + prog + Math.floor((r.goldRun || 0) / 2);
  return Math.max(r.kills > 0 ? 1 : 0, Math.round(base * diffRw() * (1 + ((G.p.m && G.p.m.gold) || 0) * 0.3) / 250));
}
// 11-20 도움 모드 (Hades 'God Mode' 재해석): 켜면 쓰러질 때마다 받는 피해 -2% (최대 -40%), 스토리·무한의 방만
const assistOn = () => !!(SAVE && SAVE.settings && SAVE.settings.assist && G && (G.mode === "story" || G.mode === "endless") && !(G.opt && G.opt.multi));
const assistDr = () => assistOn() ? Math.min(0.4, 0.02 * ((SAVE.assistN || 0) + 1)) : 0;
// 11-20 금기 계약 (Hades '처벌 계약' 재해석): 스토리를 한 번 끝낸 뒤, 출발 전에 저주를 골라 판 내내 걸면 하나마다 혼불 +20%
const curseOn = (k) => !!G && (G.curse === k || (!!G.opt && Array.isArray(G.opt.taboo) && G.opt.taboo.includes(k)));
function endRun(win, storyDone) {
  if (!win && assistOn()) { SAVE.assistN = Math.min(19, (SAVE.assistN || 0) + 1); }
  if (!G) return;
  if (typeof keepAwake === "function") keepAwake(false);
  if (window._rndOrig) { Math.random = window._rndOrig; window._rndOrig = null; }
  if (G.mode === "story" && !G.opt.daily) delete SAVE.resume;
  const r = { mode: G.mode, win, kills: G.kills, rooms: G.roomsCleared, gold: 0, coin: G.coinGot, lvl: G.p.lvl, floor: G.floor, stage: G.stage, endless: G.endlessN, storyDone, duel: G.duel, goldRun: G.p.gold || 0 };
  if (G.mode === "duel" && G.opt.ranked && G.duel && G.duel.rk && typeof rankApply === "function") r.rank = rankApply(win, G.duel.rk.rp); // 11-27 등급전 점수(도중에 그만두면 패배)
  r.coinRw = runReward(r); SAVE.coins += r.coinRw;
  r.soulInfo = typeof altarEarn === "function" ? altarEarn(r) : null; // 11-18 혼불
  r.daily = typeof dailyEnd === "function" ? dailyEnd(r) : null;
  r.mast = typeof mastGain === "function" ? mastGain(r) : null;
  r.season = typeof seasonGain === "function" ? seasonGain(r) : null;
  if (typeof histAdd === "function") histAdd(r);
  if ((G.comboMax || 0) > (SAVE.stats.maxCombo || 0)) SAVE.stats.maxCombo = G.comboMax; r.comboMax = G.comboMax || 0;
  NET.hostEnd(r);
  G.paused = true; checkUnlocks(); saveGame();
  UI.result(r);
}

// ---------- 효과 보조 ----------
function addText(x, y, s, col, size, big) { G.texts.push({ x, y, s, col, size: size || 18, t: 0, big }); if (G.texts.length > 80) G.texts.shift(); }
function spark(x, y, col, n) { if (SAVE && SAVE.settings.low) { if (G.parts.length > 50) return; n = Math.ceil(n / 3); } for (let i = 0; i < n; i++) G.parts.push({ sp: 1, x, y, vx: rnd(-220, 220), vy: rnd(-260, 40), t: 0, max: rnd(0.25, 0.5), col, s: rnd(2, 4) }); }

// ---------- 그리기 ----------
let autoDpr = 0; // 자동 화질로 낮춘 값 (0이면 그대로)
function resize() {
  let dpr = SAVE && SAVE.settings && SAVE.settings.low ? 1 : Math.min(2, window.devicePixelRatio || 1); // 저사양 모드 (11-12)
  if (autoDpr && autoDpr < dpr) dpr = autoDpr;
  cv.width = Math.round(cv.clientWidth * dpr); cv.height = Math.round(cv.clientHeight * dpr);
  const s = Math.min(cv.width / RW, cv.height / RH); base = { s, ox: (cv.width - RW * s) / 2, oy: (cv.height - RH * s) / 2, dpr }; view = Object.assign({}, base);
  if (G && G.cur && G.cur.cache && (G.cur.cacheQ || 1) < roomQ()) buildRoom(G.cur);
}
// ---------- 카메라 (11-17 사용자: 상업작에 비해 퀄리티가 떨어짐 → 캐릭터가 화면에서 너무 작았음) ----------
// 방 전체를 한 화면에 넣던 것을 CAM_ZOOM 배 가까이 보고 주인공을 부드럽게 따라감. 방 밖(검은 곳)은 보이지 않게 가장자리에서 멈춤.
// 설정 settings.zoom (1=예전처럼 방 전체). 대결·개발·관전 등 방 전체가 필요한 곳은 1.
let base = null;
const CAM_ZOOM = 1.5;
function camZoom() { if (!G || G.mode === "duel" || G.mode === "dev") return 1; const z = SAVE && SAVE.settings && SAVE.settings.zoom; return z != null ? z : CAM_ZOOM; }
function roomQ() { if (!base) return 1; const need = base.s * camZoom(); return need <= 1.05 ? 1 : Math.min(2, Math.ceil(need * 2) / 2); }
function updateCam() {
  const Z = camZoom(), s = base.s * Z, vw = cv.width / s, vh = cv.height / s, p = G.p;
  let tx = RW / 2, ty = RH / 2;
  const fc = G.camFocus && G.camFocus.t > 0 && G.camFocus.u && G.camFocus.u.alive ? G.camFocus.u : null;
  if (Z > 1 && fc) { tx = fc.x; ty = fc.y - 60; }
  else if (Z > 1 && p) { const mo = input.sx != null && !input.touch && performance.now() - (input.mouseT || 0) < 4000, ax = mo ? clamp(input.mx - p.x, -260, 260) * 0.15 : 0, ay = mo ? clamp(input.my - p.y, -200, 200) * 0.15 : 0; tx = p.x + ax; ty = p.y - 30 + ay; }
  const cx0 = vw >= RW ? RW / 2 : clamp(tx, vw / 2, RW - vw / 2), cy0 = vh >= RH ? RH / 2 : clamp(ty, vh / 2, RH - vh / 2);
  const now = performance.now(), dt = Math.min(0.1, ((now - (G.camT || now)) / 1000)); G.camT = now;
  if (G.camSnap || !G.cam) { G.cam = { x: cx0, y: cy0 }; G.camSnap = false; }
  else { const k = 1 - Math.exp(-dt * (fc ? 4 : 9)); G.cam.x += (cx0 - G.cam.x) * k; G.cam.y += (cy0 - G.cam.y) * k; }
  if (G.camFocus && G.camFocus.t > 0) G.camFocus.t -= dt;
  view.s = s; view.ox = cv.width / 2 - G.cam.x * s; view.oy = cv.height / 2 - G.cam.y * s; view.dpr = base.dpr;
  if (input.sx != null && !input.touch) { const w = toWorldRaw(input.sx, input.sy); input.mx = w.x; input.my = w.y; } // 카메라가 움직여도 마우스가 가리키는 곳 그대로
  view.x0 = (0 - view.ox) / s; view.y0 = (0 - view.oy) / s; view.x1 = view.x0 + vw; view.y1 = view.y0 + vh;
}
// 화면 밖 적 표시: 가장자리에 빨간 화살표 (확대하면 안 보이는 적이 생기므로)
function drawOffscreen(g) {
  if (camZoom() <= 1) return; const m = 34 / view.s, cx = (view.x0 + view.x1) / 2, cy = (view.y0 + view.y1) / 2;
  for (const u of G.units) {
    if (!u.alive || u.team !== 1 || (u.kind !== "mob" && u.kind !== "boss" && u.kind !== "hero")) continue;
    if (u.x > view.x0 && u.x < view.x1 && u.y - 40 > view.y0 && u.y < view.y1) continue;
    const a = Math.atan2(u.y - cy, u.x - cx), hw = (view.x1 - view.x0) / 2 - m, hh = (view.y1 - view.y0) / 2 - m, t = Math.min(hw / Math.abs(Math.cos(a) || 1e-6), hh / Math.abs(Math.sin(a) || 1e-6));
    const x = cx + Math.cos(a) * t, y = cy + Math.sin(a) * t, big = u.kind === "boss" ? 1.5 : 1, S = 13 / view.s * big * (1 + Math.sin(G.time * 6) * 0.08);
    g.save(); g.translate(x, y); g.rotate(a); g.globalAlpha = 0.85; g.fillStyle = u.kind === "boss" ? "#ff4a3a" : "#ff8a6a"; g.shadowColor = "#ff3b30"; g.shadowBlur = 10;
    g.beginPath(); g.moveTo(S, 0); g.lineTo(-S * 0.7, -S * 0.75); g.lineTo(-S * 0.35, 0); g.lineTo(-S * 0.7, S * 0.75); g.closePath(); g.fill(); g.restore();
  }
}
function toWorldRaw(cx, cy) { const r = cv.getBoundingClientRect(), d = view.dpr; return { x: ((cx - r.left) * d - view.ox) / view.s, y: ((cy - r.top) * d - view.oy) / view.s }; }
function toWorld(cx, cy) { if (G && G.cur && base) updateCamIfNeeded(); const r = cv.getBoundingClientRect(), d = view.dpr; return { x: ((cx - r.left) * d - view.ox) / view.s, y: ((cy - r.top) * d - view.oy) / view.s }; }
function updateCamIfNeeded() { if (!view || view.x0 == null) updateCam(); }
// 바닥 위를 천천히 흐르는 안개 (11-15 사용자: 배경에 블렌더 적용) — Blender 로 만든 이음새 없는 안개(art/fog_tile)를 두 겹으로 다른 속도·방향으로 흘림.
// 저사양 모드에서는 그리지 않음. 그림이 없으면(받기 전) 건너뜀.
let _fogPat = null, _fogSrc = null;
function drawFog(g) {
  const im = IMG.fog_tile; if (!im || !im.naturalWidth) return;
  if (_fogSrc !== im) { const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext("2d");
    x.drawImage(im, 0, 0); x.globalCompositeOperation = "source-in"; x.fillStyle = "#cfd6e6"; x.fillRect(0, 0, c.width, c.height); _fogPat = g.createPattern(c, "repeat"); _fogSrc = im; }
  const t = G.time || 0;
  g.save(); g.fillStyle = _fogPat;
  g.globalAlpha = 0.085; g.translate((t * 14) % 512, (t * 5) % 512); g.scale(2, 2); g.fillRect(-512, -512, RW / 2 + 1024, RH / 2 + 1024); g.restore();
  g.save(); g.fillStyle = _fogPat;
  g.globalAlpha = 0.06; g.translate(-((t * 9) % 512), (t * 7) % 512); g.scale(1.4, 1.4); g.fillRect(-512, -512, RW / 1.4 + 1024, RH / 1.4 + 1024); g.restore();
}
function render() {
  if (!G || !G.cur || !G.p || !G.cur.cache) return;
  if (!base) resize(); updateCam();
  const hq = glOn(); if (hq) glLayers(); // 11-17 하이엔드: 영웅 층(a)·효과 층(b)에 그리고 GPU 에서 조명·블룸
  let g = hq ? GLR.a : ctx; if (!hq) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#07060a"; g.fillRect(0, 0, cv.width, cv.height); } else ctx.clearRect(0, 0, cv.width, cv.height);
  const shk = SAVE && SAVE.settings.shake === false ? 0 : G.shake * ((SAVE && SAVE.settings.shakeAmt != null) ? SAVE.settings.shakeAmt : 1), tN = G.time * 38, kf = SAVE && SAVE.settings.shake === false ? 0 : 1, sx = (shk ? shk * (Math.sin(tN * 1.07) * 0.62 + Math.sin(tN * 2.31 + 1.3) * 0.38) : 0) + (G.kx || 0) * kf, sy = (shk ? shk * (Math.sin(tN * 1.21 + 2.1) * 0.62 + Math.sin(tN * 2.73 + 0.4) * 0.38) : 0) + (G.ky || 0) * kf; // 11-18 타격감: 매 프레임 무작위 떨림(지저분함) → 부드러운 흔들림 + 때린 방향으로 화면 밀림
  g.setTransform(view.s, 0, 0, view.s, view.ox + sx * view.s, view.oy + sy * view.s);
  g.save(); g.beginPath(); g.rect(0, 0, RW, RH); g.clip();
  const r = G.cur;
  if (r.needBg) { const bg = IMG["room_" + r.th.room + "_" + r.bg], wf = IMG["wall_" + r.th.room + "_front"]; if (bg && bg.complete && bg.naturalWidth && (!wf || wf.naturalWidth) && !(ASSETS.packs && ASSETS.packs[r.th.room] && !PACK.done[r.th.room] && !PACK.base[r.th.room])) buildRoom(r); }
  if (!hq) g.drawImage(r.cache, 0, 0, RW, RH);
  if (!(SAVE && SAVE.settings.low)) drawFog(g);
  drawHazards(g, r); drawDoors(g, r);
  for (const z of G.zones) drawZone(g, z);
  for (const t of G.tele) drawTele(g, t);
  for (const d of G.drops) drawDrop(g, d);
  // 그림자
  const list = G.units.filter((u) => u.alive || (u.kind === "hero" && G.mode === "duel"));
  for (const u of list) { const Ma = ASSETS.meta && ASSETS.meta[u.kind === "hero" ? "spr_" + u.art : u.img], baked = Ma && Ma.anim && Ma.anim.sh; g.fillStyle = baked ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.42)"; g.beginPath(); g.ellipse(u.x, u.y + u.r * 0.55, u.r * (baked ? 0.7 : 1.0), u.r * (baked ? 0.26 : 0.38), 0, 0, 7); g.fill(); } // 11-16 구운 3D 그림자
  // 소품(기둥 등)과 캐릭터를 아래쪽(y) 순서로 그려 앞뒤가 겹쳐 보이게 (2.5D)
  const props = r.obs.filter((o) => IMG[o.prop]).map((o) => ({ prop: o, y: o.y + o.r * 0.3 }));
  for (const pr of props) { const o = pr.prop; g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.ellipse(o.x + 12, o.y + o.r * 0.35, o.r * 1.5, o.r * 0.6, 0, 0, 7); g.fill(); }
  const order = list.concat(props).sort((a, b) => (a.prop ? a.y : a.y + a.r * 0.6) - (b.prop ? b.y : b.y + b.r * 0.6));
  if (hq) GLR.occOn = true;
  for (const u of order) { if (u.prop) drawProp(g, u.prop); else drawUnit(g, u); }
  GLR.occOn = false;
  if (hq) { drawLampBodies(g, r); g.restore(); g = GLR.b; g.setTransform(view.s, 0, 0, view.s, view.ox + sx * view.s, view.oy + sy * view.s); g.save(); g.beginPath(); g.rect(0, 0, RW, RH); g.clip(); } // 여기부터 스스로 빛나는 효과·글자 층
  for (const o of G.orbs) { if (Number.isFinite(o.x) && Number.isFinite(o.y)) glowDot(g, o.x, o.y, 13, o.col); }
  for (const pr of G.projs) drawProj(g, pr);
  for (const f of G.fx) drawFx(g, f);
  if (hq) drawAtmo(g, r);
  { g.save(); g.globalCompositeOperation = "lighter"; for (const pt of G.parts) { if (!pt.ws) continue; const k = 1 - pt.t / pt.max, R = pt.s * (1 + (1 - k) * 0.8), wob = Math.sin(pt.t * 9 + pt.x) * 2;
      const gr = g.createRadialGradient(pt.x + wob, pt.y, 0, pt.x + wob, pt.y, R * 3); gr.addColorStop(0, `rgba(255,255,255,${0.9 * k})`); gr.addColorStop(0.25, `rgba(${pt.wc},${0.7 * k})`); gr.addColorStop(1, `rgba(${pt.wc},0)`); g.fillStyle = gr; g.fillRect(pt.x + wob - R * 3, pt.y - R * 3, R * 6, R * 6); } g.restore(); }
  for (const pt of G.parts) { if (pt.sp || pt.ws) continue; g.globalAlpha = 1 - pt.t / pt.max; g.fillStyle = pt.col; g.fillRect(pt.x - pt.s / 2, pt.y - pt.s / 2, pt.s, pt.s); } g.globalAlpha = 1;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; // 11-17 타격 불꽃: 빛나는 줄
  for (const pt of G.parts) { if (!pt.sp) continue; const k = 1 - pt.t / pt.max; g.globalAlpha = k; g.strokeStyle = pt.col; g.lineWidth = pt.s * (0.6 + k * 0.6); g.beginPath(); g.moveTo(pt.x, pt.y); g.lineTo(pt.x - pt.vx * 0.045, pt.y - pt.vy * 0.045); g.stroke(); }
  g.restore();
  if (hq) {} else if (!(SAVE && SAVE.settings.low)) drawLight(g, r); else if (curseOn("dark")) drawDarkLow(g); // 저사양 모드에서도 어둠의 저주가 보이게
  for (const t of G.texts) { // 11-17 하이엔드 숫자: 튀어나왔다 자리 잡음, 치명타는 금빛 그라디언트·빛
    const pop = t.num ? 1 + (t.big ? 0.9 : 0.55) * Math.max(0, 1 - t.t / 0.11) - 0.12 * Math.max(0, Math.min(1, (t.t - 0.11) / 0.1)) * (1 - Math.min(1, t.t / 0.4)) : 1, sz = t.size * pop;
    g.globalAlpha = Math.min(1, 1.6 - t.t * 1.6); g.font = `${t.big ? 900 : 700} ${sz}px "Do Hyeon", sans-serif`; g.textAlign = "center"; g.lineJoin = "round"; g.lineWidth = t.big ? 6 : 4; g.strokeStyle = "rgba(0,0,0,0.85)";
    const jx = t.big && t.t < 0.15 ? rnd(-2, 2) : 0;
    if (t.em === undefined) { const sp = typeof emoSplit === "function" && !t.num ? emoSplit(t.s) : [null, t.s]; t.em = sp[0] ? emoImg(sp[0]) : null; if (sp[0]) t.s = sp[1]; if (typeof noEmo === "function" && !t.num) t.s = noEmo(t.s); }
    if (t.em && t.em.naturalWidth) { const S = sz * 1.25, w = g.measureText(t.s).width; g.drawImage(t.em, t.x + jx - w / 2 - S - 2, t.y - S * 0.82, S, S); }
    g.strokeText(t.s, t.x + jx, t.y);
    if (t.big && t.num) { const gr = g.createLinearGradient(0, t.y - sz * 0.8, 0, t.y); gr.addColorStop(0, "#fff6c8"); gr.addColorStop(0.5, t.col); gr.addColorStop(1, "#d8701a"); g.fillStyle = gr; g.shadowColor = "rgba(255,170,40,0.9)"; g.shadowBlur = 14; }
    else g.fillStyle = t.col;
    g.fillText(t.s, t.x + jx, t.y); g.shadowBlur = 0; } g.globalAlpha = 1;
  // 클릭 표시
  drawAim(g); drawItemInfo(g); if (G.mode !== "dev" && G.mode !== "practice") drawGuide(g);
  if (G.cur.devLabel) { g.save(); g.font = '24px "Do Hyeon"'; g.textAlign = "center"; g.fillStyle = "rgba(255,226,160,0.85)"; const dim = IMG.emo_tools; if (dim && dim.naturalWidth) { const tw = g.measureText(G.cur.devLabel).width; g.drawImage(dim, RW / 2 - tw / 2 - 40, BT + 12, 34, 34); g.fillText(G.cur.devLabel, RW / 2 + 4, BT + 40); } else g.fillText(G.cur.devLabel, RW / 2, BT + 40); g.restore(); }
  if (G.target && G.target.alive && !G.client) { const t = G.target, R = t.r + 22, a = G.time * 2; g.save(); g.strokeStyle = "#ff5a4d"; g.lineWidth = 3; g.shadowColor = "#ff5a4d"; g.shadowBlur = 10;
    for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(t.x, t.y + t.r * 0.4, R, R * 0.5, 0, a + i * Math.PI / 2, a + i * Math.PI / 2 + 0.9); g.stroke(); } g.restore(); }
  else if (G.target && !G.target.alive) G.target = null;
  drawOffscreen(g);
  g.restore();
  if (!hq && !(SAVE && SAVE.settings.low)) { // 11-17 화면 가장자리 어둡게(비네트) — 시선이 가운데 주인공에 모이게
    g.setTransform(1, 0, 0, 1, 0, 0); const W = cv.width, H = cv.height, R = Math.hypot(W, H) / 2;
    if (!G._vig || G._vig.W !== W || G._vig.H !== H) { const vg = g.createRadialGradient(W / 2, H / 2, R * 0.45, W / 2, H / 2, R); vg.addColorStop(0, "rgba(6,4,12,0)"); vg.addColorStop(0.7, "rgba(6,4,12,0.28)"); vg.addColorStop(1, "rgba(6,4,12,0.62)"); G._vig = { W, H, vg }; }
    g.fillStyle = G._vig.vg; g.fillRect(0, 0, W, H); }
  g.setTransform(base.s, 0, 0, base.s, base.ox, base.oy); // 글자 띠는 화면 기준 (확대와 상관없이 같은 자리·크기)
  if (G.banner) drawBanner(g, G.banner);
  if (G.trans) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(0,0,0,${clamp(G.trans.mode === "out" ? 1 - G.trans.t / G.trans.max : G.trans.t / G.trans.max, 0, 1)})`; g.fillRect(0, 0, cv.width, cv.height); }
  if (hq) glRender(r, sx, sy);
  if (false) { const k = G.trans.mode === "out" ? 1 - G.trans.t / G.trans.max : G.trans.t / G.trans.max; g.fillStyle = `rgba(0,0,0,${clamp(k, 0, 1)})`; g.fillRect(0, 0, RW, RH); }
}
function drawHazards(g, r) {
  for (const h of r.haz) {
    const im = IMG["trap_" + h.kind];
    if (im && im.naturalWidth) {
      g.save();
      if (h.kind === "spike") { g.globalAlpha = 1; g.filter = h.up ? "none" : "brightness(0.55)"; }
      if (h.kind === "lava" || h.kind === "soul") { const gl = g.createRadialGradient(h.x, h.y, 5, h.x, h.y, h.rx * 1.3); gl.addColorStop(0, h.kind === "lava" ? "rgba(255,120,40,0.35)" : "rgba(180,100,255,0.3)"); gl.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gl; g.fillRect(h.x - h.rx * 1.4, h.y - h.rx * 1.4, h.rx * 2.8, h.rx * 2.8); }
      const pul = h.kind === "lava" || h.kind === "soul" || h.kind === "poison" ? 1 + Math.sin(G.time * 3 + h.x) * 0.03 : 1;
      g.drawImage(im, h.x - h.rx * pul, h.y - h.ry * pul, h.rx * 2 * pul, h.ry * 2 * pul);
      g.restore(); continue;
    }
    const col = h.kind === "lava" ? ["rgba(255,120,30,0.95)", "rgba(120,20,0,0.9)"] : ["rgba(140,220,90,0.75)", "rgba(40,70,30,0.85)"];
    const gr = g.createRadialGradient(h.x, h.y, 5, h.x, h.y, h.rx); gr.addColorStop(0, col[0]); gr.addColorStop(1, col[1]);
    g.fillStyle = gr; g.beginPath(); g.ellipse(h.x, h.y, h.rx, h.ry, 0, 0, 7); g.fill();
  }
}
// 3D 문 그림 (닫힘/열림). 열림 정도를 부드럽게 바꿔 문이 열리고 닫히는 모습이 보이게 (사용자 요청 11-10)
function drawDoors(g, r) {
  const th = r.th || FLOORS[0], dc = IMG["door_" + th.room], dop = IMG["door_" + th.room + "_open"];
  if (dc && dc.naturalWidth && dop && dop.naturalWidth) return drawDoors3D(g, r, dc, dop);
  return drawDoorsFlat(g, r);
}
function drawDoors3D(g, r, dc, dop) {
  const locked = roomLocked() || G.mode === "duel";
  r.doorK = r.doorK || {};
  for (const dk in r.links) {
    const t = G.rooms.get(r.links[dk]);
    const prev = r.doorK[dk] == null ? (locked ? 0 : 1) : r.doorK[dk];
    const k = clamp(prev + (locked ? -1 / 60 * 4 : 1 / 60 * 1.4), 0, 1);
    if (prev === 0 && k > 0) sfx("door");
    if (prev > 0.6 && k === 0 && G.roomT > 0.2) { G.shake = Math.max(G.shake, 5); sfx("door"); }
    r.doorK[dk] = k;
    // 문 크기: 위쪽 문은 벽 높이만큼, 옆·아래 문은 벽 두께에 맞게 눌러서
    const W = dk === "N" ? 200 : 170, H = dk === "N" ? Math.min(W * dc.naturalHeight / dc.naturalWidth, BT + 14) : dk === "S" ? RH - BB + 14 : BL + 14;
    const pos = { N: [RW / 2, BT + 8, 0], S: [RW / 2, BB - 8, Math.PI], W: [BL - 8, RH / 2 + 20, -Math.PI / 2], E: [BR + 8, RH / 2 + 20, Math.PI / 2] }[dk];
    const sh = k > 0 && k < 1 ? Math.sin(G.time * 40) * 1.5 : 0;
    g.save(); g.translate(pos[0] + sh, pos[1]); g.rotate(pos[2]);
    // 문 그림의 아래쪽(문턱)이 방 쪽을 향하게: 기준점은 문턱 가운데
    g.globalAlpha = 1; g.drawImage(dc, -W / 2, -H, W, H);
    if (k > 0) { g.globalAlpha = k; g.drawImage(dop, -W / 2, -H, W, H); }
    g.globalAlpha = 1;
    // 다음 방 종류 색 (열렸을 때만 문턱에 은은하게), 잠기면 붉은 빛
    const col = !t ? "#a0784a" : t.visited ? "#8a8090" : t.type === "boss" && (t.mid || (G.mode === "story" && G.stage < STAGES_PER_FLOOR)) ? "#ff9a3d" : ({ exit: "#fff2b0", boss: "#ff4d4d", treasure: "#ffc84a", shop: "#5fc8ff", rest: "#7fe08a", elite: "#c38bff" }[t.type] || "#a0784a");
    // 방 종류 표식 (3D 엠블럼, 사용자 요청 11-11: 보스·중간보스·상점·우물·보물·정예·출구 구분)
    const sk = !t || t.visited ? null : t.type === "boss" ? (t.mid || (G.mode === "story" && G.stage < STAGES_PER_FLOOR) ? "mid" : "boss") : t.trial ? "trial" : { exit: "exit", treasure: "treasure", shop: "shop", rest: "rest", elite: "elite", event: "event" }[t.type];
    const si = sk && IMG["sign_" + sk]; // 11-20 괴이한 방·시련의 방도 그린 표식 (예전 이모지)
    if (si && si.naturalWidth) {
      g.save(); g.translate(0, 58); g.rotate(-pos[2]); g.globalAlpha = locked ? 0.6 : 0.6 + k * 0.4;
      const S = sk === "boss" ? 84 : 70, bob = Math.sin(G.time * 2.4 + pos[2]) * 3, sc = S / Math.max(si.naturalWidth, si.naturalHeight);
      g.shadowColor = col; g.shadowBlur = 12 + Math.sin(G.time * 4) * 5;
      g.drawImage(si, -si.naturalWidth * sc / 2, -si.naturalHeight * sc / 2 + bob, si.naturalWidth * sc, si.naturalHeight * sc); g.restore();
    }
    else if (t && !t.visited && (t.type === "event" || t.trial)) { // 11-18 괴이한 방·시련의 방도 문 너머 미리보기 (Hades 문 보상 표식 재해석)
      g.save(); g.translate(0, 58); g.rotate(-pos[2]); g.globalAlpha = locked ? 0.6 : 0.65 + k * 0.35; const bob = Math.sin(G.time * 2.4 + pos[2]) * 3, cc = t.trial ? "#ffd84a" : "#a99bff";
      const gr = g.createRadialGradient(0, bob, 2, 0, bob, 34); gr.addColorStop(0, cc + "cc"); gr.addColorStop(1, cc + "00"); g.fillStyle = gr; g.beginPath(); g.arc(0, bob, 34, 0, 7); g.fill();
      g.font = "34px serif"; g.textAlign = "center"; g.fillText(t.trial ? "⏳" : "👻", 0, bob + 12); g.restore();
    }
    if (k > 0.5) { g.globalAlpha = (k - 0.5) * 2 * 0.9;
      const ic = si && si.naturalWidth ? "" : !t || t.visited ? "" : t.type === "boss" ? "☠" : { exit: "⇣", treasure: "✦", shop: "⚖", rest: "♨", elite: "⚔" }[t.type] || "";
      if (ic) { g.rotate(-pos[2]); g.font = "26px sans-serif"; g.textAlign = "center"; g.fillStyle = col; g.fillText(ic, 0, 8); } }
    else if (locked && G.mode !== "duel") { g.globalAlpha = 0.35 + Math.sin(G.time * 5) * 0.15; g.fillStyle = "#ff3b30"; g.beginPath(); g.ellipse(0, -H * 0.45, W * 0.22, H * 0.3, 0, 0, 7); g.fill(); }
    g.restore();
  }
}
function drawDoorsFlat(g, r) {
  const locked = roomLocked() || G.mode === "duel";
  const typeCol = (k) => { const t = G.rooms.get(k); if (!t) return "#8a6a4a"; if (t.visited) return "#8a8090"; if (t.type === "boss" && (t.mid || (G.mode === "story" && G.stage < STAGES_PER_FLOOR))) return "#ff9a3d"; return { exit: "#fff2b0", boss: "#ff4d4d", treasure: "#ffc84a", shop: "#5fc8ff", rest: "#7fe08a", elite: "#c38bff" }[t.type] || "#a0784a"; };
  for (const dk in r.links) {
    const col = typeCol(r.links[dk]);
    g.save();
    let x, y, w, h;
    if (dk === "N") { x = RW / 2 - DOOR_W / 2; y = 14; w = DOOR_W; h = BT - 14; }
    else if (dk === "S") { x = RW / 2 - DOOR_W / 2; y = BB; w = DOOR_W; h = RH - BB; }
    else if (dk === "W") { x = 0; y = RH / 2 + 20 - DOOR_W / 2; w = BL; h = DOOR_W; }
    else { x = BR; y = RH / 2 + 20 - DOOR_W / 2; w = RW - BR; h = DOOR_W; }
    g.fillStyle = "#000"; g.fillRect(x, y, w, h);
    if (locked) {
      // 닫힌 나무 문 + 쇠창살
      g.fillStyle = "#3b2618"; g.fillRect(x + 4, y + 4, w - 8, h - 8);
      g.strokeStyle = "#5a3a22"; g.lineWidth = 3; for (let i = 1; i < 4; i++) { if (w > h) { g.beginPath(); g.moveTo(x + (w * i) / 4, y + 4); g.lineTo(x + (w * i) / 4, y + h - 4); g.stroke(); } else { g.beginPath(); g.moveTo(x + 4, y + (h * i) / 4); g.lineTo(x + w - 4, y + (h * i) / 4); g.stroke(); } }
      g.fillStyle = "rgba(255,80,60,0.75)"; for (let i = 0; i < 5; i++) { if (w > h) g.fillRect(x + 10 + i * ((w - 20) / 4) - 2, y, 4, h); else g.fillRect(x, y + 10 + i * ((h - 20) / 4) - 2, w, 4); }
    } else {
      // 열린 문: 너머는 어둠, 테두리만 빛남
      const gr = dk === "N" ? g.createLinearGradient(0, y + h, 0, y) : dk === "S" ? g.createLinearGradient(0, y, 0, y + h) : dk === "W" ? g.createLinearGradient(x + w, 0, x, 0) : g.createLinearGradient(x, 0, x + w, 0);
      gr.addColorStop(0, "rgba(40,30,20,0.9)"); gr.addColorStop(1, "#000"); g.fillStyle = gr; g.fillRect(x, y, w, h);
      const pul = 0.5 + Math.sin(G.time * 4) * 0.25;
      g.shadowColor = col; g.shadowBlur = 18; g.strokeStyle = col; g.globalAlpha = 0.6 + pul * 0.4; g.lineWidth = 5; g.strokeRect(x + 3, y + 3, w - 6, h - 6); g.globalAlpha = 1; g.shadowBlur = 0;
      const t = G.rooms.get(r.links[dk]);
      const ic = !t ? "" : t.visited ? "" : { boss: "☠", treasure: "✦", shop: "⚖", rest: "♨", elite: "⚔" }[t.type] || "";
      if (ic) { g.font = "28px sans-serif"; g.textAlign = "center"; g.fillStyle = col; g.fillText(ic, x + w / 2, y + h / 2 + 10); }
    }
    // 문틀
    g.strokeStyle = "#1a120c"; g.lineWidth = 8; g.strokeRect(x, y, w, h);
    g.restore();
  }
}
function drawZone(g, z) {
  const a = Math.min(1, (z.dur - z.t) * 2) * 0.9;
  g.save(); g.globalAlpha = a;
  const gr = g.createRadialGradient(z.x, z.y, 10, z.x, z.y, z.r); gr.addColorStop(0, hexA(z.col, 0.1)); gr.addColorStop(0.8, hexA(z.col, 0.28)); gr.addColorStop(1, hexA(z.col, 0.55));
  g.fillStyle = gr; g.beginPath(); g.ellipse(z.x, z.y, z.r, z.r * 0.7, 0, 0, 7);
  if (z.vk) { g.globalAlpha = a * 0.45; g.fill(); const pu = 1 + Math.sin(G.time * 3 + z.x) * 0.05, gr0 = Math.min(1, z.t * 4); vfx(g, z.vk, null, z.x, z.y - 8, z.r * 2.3 * pu * (0.6 + 0.4 * gr0), z.r * 1.8 * pu * (0.6 + 0.4 * gr0), Math.sin(G.time * 0.7) * 0.06, a); g.restore(); return; }
  g.fill();
  g.strokeStyle = hexA(z.col, 0.9); g.lineWidth = 3; g.setLineDash([14, 10]); g.lineDashOffset = -G.time * 40; g.stroke(); g.setLineDash([]);
  vfx(g, z.rune ? "rune" : "vortex", z.col, z.x, z.y, z.r * 2.1, z.r * 1.47, z.rune ? G.time * 0.6 : -G.time * 1.5, 0.75 * a);
  if (z.rune && !IMG.vfx_rune) { g.translate(z.x, z.y); g.scale(1, 0.7); g.rotate(G.time * 0.8); g.strokeStyle = hexA(z.col, 0.7); g.lineWidth = 2; for (let i = 0; i < 5; i++) { const a1 = (i / 5) * 6.283, a2 = ((i + 2) / 5) * 6.283; g.beginPath(); g.moveTo(Math.cos(a1) * z.r * 0.8, Math.sin(a1) * z.r * 0.8); g.lineTo(Math.cos(a2) * z.r * 0.8, Math.sin(a2) * z.r * 0.8); g.stroke(); } }
  g.restore();
}
function hexA(hex, a) { if (!hex || hex[0] !== "#") return `rgba(255,255,255,${a})`; const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
// 보스 예고: 원·반원·직사각형 대신 보스마다 그림 (사용자 요청 11-11) — 모양은 그대로 잘라 그 안을 보스 문양으로 채움
function drawTeleImg(g, t, k) {
  const ci = IMG[t.tk + "_circle"], li = IMG[t.tk + "_line"]; if (!ci || !ci.naturalWidth) return false;
  const col = t.bcol || "#ff3b30", a = 0.5 + 0.45 * k, spin = G.time * 0.6;
  g.save();
  if (t.shape === "circle" || t.shape === "ring") {
    g.beginPath(); g.ellipse(t.x, t.y, t.r * (t.shape === "ring" ? 1 : 1.04), t.r * 0.7, 0, 0, 7);
    if (t.shape === "ring") g.ellipse(t.x, t.y, Math.max(1, t.r - t.w), Math.max(1, (t.r - t.w) * 0.7), 0, 0, 7);
    g.save(); g.clip("evenodd"); g.translate(t.x, t.y); g.scale(1, 0.7); g.rotate(spin); g.globalAlpha = a; const R = t.r * 1.08; g.drawImage(ci, -R, -R, R * 2, R * 2); g.restore();
    g.globalAlpha = 0.85; g.strokeStyle = col; g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 12; g.beginPath(); g.ellipse(t.x, t.y, t.r, t.r * 0.7, 0, 0, 7); g.stroke();
    g.shadowBlur = 0; g.globalAlpha = 0.28; g.fillStyle = col; g.beginPath(); g.ellipse(t.x, t.y, t.r * k, t.r * 0.7 * k, 0, 0, 7); g.fill();
  } else if (t.shape === "arc") {
    g.beginPath(); g.moveTo(t.x, t.y); g.arc(t.x, t.y, t.r, t.a - t.w / 2, t.a + t.w / 2); g.closePath();
    g.save(); g.clip(); g.translate(t.x, t.y); g.rotate(spin * 0.5); g.globalAlpha = a; g.drawImage(ci, -t.r, -t.r, t.r * 2, t.r * 2); g.restore();
    g.globalAlpha = 0.9; g.strokeStyle = col; g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 12; g.stroke();
    g.shadowBlur = 0; g.globalAlpha = 0.3; g.fillStyle = col; g.beginPath(); g.moveTo(t.x, t.y); g.arc(t.x, t.y, t.r * k, t.a - t.w / 2, t.a + t.w / 2); g.closePath(); g.fill();
  } else if (t.shape === "line") {
    g.translate(t.x, t.y); g.rotate(t.a);
    g.save(); g.beginPath(); g.rect(0, -t.w / 2, t.len, t.w); g.clip(); g.globalAlpha = a;
    if (li && li.naturalWidth) { const seg = t.w * 2.6 * (li.naturalWidth / li.naturalHeight); for (let x = -((G.time * 120) % seg); x < t.len; x += seg) g.drawImage(li, x, -t.w * 1.3, seg, t.w * 2.6); }
    else { g.drawImage(ci, 0, -t.w, t.w * 2, t.w * 2); }
    g.restore();
    g.globalAlpha = 0.9; g.strokeStyle = col; g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 12; g.strokeRect(0, -t.w / 2, t.len, t.w);
    g.shadowBlur = 0; g.globalAlpha = 0.3; g.fillStyle = col; g.fillRect(0, -t.w / 2, t.len * k, t.w);
  } else { g.restore(); return false; }
  g.restore(); return true;
}
// 11-20 접근성: '공격 예고 진하게'(Dead Cells·Hades 접근성 옵션) — 적 공격 영역에 굵은 검정+노랑 테두리
function teleOutline(g, t) {
  if (t.friendly || !(SAVE && SAVE.settings && SAVE.settings.teleBold)) return;
  g.save(); const path = () => { g.beginPath(); if (t.shape === "circle" || t.shape === "ring") g.ellipse(t.x, t.y, t.r, t.r * 0.7, 0, 0, 7); else if (t.shape === "arc") { g.moveTo(t.x, t.y); g.arc(t.x, t.y, t.r, t.a - t.w / 2, t.a + t.w / 2); g.closePath(); } else if (t.shape === "line") { g.translate(t.x, t.y); g.rotate(t.a); g.rect(0, -t.w / 2, t.len, t.w); } };
  path(); g.lineWidth = 7; g.strokeStyle = "rgba(0,0,0,0.85)"; g.stroke(); g.setLineDash([14, 8]); g.lineWidth = 3.5; g.strokeStyle = "#ffe14a"; g.stroke(); g.restore();
}
function drawTele(g, t) {
  const k = clamp(t.t / t.max, 0, 1); if (t.t < 0) return;
  if (!t.friendly && t.tk && drawTeleImg(g, t, k)) { teleOutline(g, t); return; }
  const col = t.friendly ? t.col || "#ffd27a" : t.bcol || "#ff3b30";
  g.save();
  g.fillStyle = hexA(col, t.friendly ? 0.12 : 0.18); g.strokeStyle = hexA(col, 0.85); g.lineWidth = 2;
  if (t.shape === "circle") { g.beginPath(); g.ellipse(t.x, t.y, t.r, t.r * 0.7, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = hexA(col, t.friendly ? 0.25 : 0.35); g.beginPath(); g.ellipse(t.x, t.y, t.r * k, t.r * 0.7 * k, 0, 0, 7); g.fill();
    if (t.taeguk) { g.translate(t.x, t.y); g.scale(1, 0.7); g.rotate(G.time * 3); g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.arc(0, 0, t.r * 0.6, -Math.PI / 2, Math.PI / 2); g.fill(); g.fillStyle = "rgba(30,20,50,0.45)"; g.beginPath(); g.arc(0, 0, t.r * 0.6, Math.PI / 2, Math.PI * 1.5); g.fill(); } }
  else if (t.shape === "ring") { g.lineWidth = t.w * k; g.strokeStyle = hexA(col, 0.35); g.beginPath(); g.ellipse(t.x, t.y, t.r, t.r * 0.7, 0, 0, 7); g.stroke(); g.lineWidth = 2; g.strokeStyle = hexA(col, 0.9); g.beginPath(); g.ellipse(t.x, t.y, t.r - t.w / 2, (t.r - t.w / 2) * 0.7, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(t.x, t.y, t.r + t.w / 2, (t.r + t.w / 2) * 0.7, 0, 0, 7); g.stroke(); }
  else if (t.shape === "arc") { g.beginPath(); g.moveTo(t.x, t.y); g.arc(t.x, t.y, t.r, t.a - t.w / 2, t.a + t.w / 2); g.closePath(); g.fill(); g.stroke(); g.fillStyle = hexA(col, 0.35); g.beginPath(); g.moveTo(t.x, t.y); g.arc(t.x, t.y, t.r * k, t.a - t.w / 2, t.a + t.w / 2); g.closePath(); g.fill(); }
  else if (t.shape === "line") { g.translate(t.x, t.y); g.rotate(t.a); g.fillRect(0, -t.w / 2, t.len, t.w); g.strokeRect(0, -t.w / 2, t.len, t.w); g.fillStyle = hexA(col, 0.3); g.fillRect(0, -t.w / 2, t.len * k, t.w); }
  g.restore(); teleOutline(g, t);
}
const ACT_IC = (k) => ACTIVES[k].ic;
function drawDrop(g, d) {
  const bob = Math.sin(G.time * 3 + d.x) * 4;
  const cg = IMG.cur_yeop || IMG.cur_gold;
  if (d.type === "gold" && cg && cg.naturalWidth) { g.drawImage(cg, d.x - 13, d.y - 13 + (d.z || 0), 26, 26); }
  else if (d.type === "gold") { g.fillStyle = "#ffcf4a"; g.strokeStyle = "#8a5a10"; g.lineWidth = 2; g.beginPath(); g.ellipse(d.x, d.y + (d.z || 0), 8, 6, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#8a5a10"; g.fillRect(d.x - 2, d.y - 2 + (d.z || 0), 4, 4); }
  else if (d.type === "coin") { glowDot(g, d.x, d.y - 10 + bob, 18, "#8fe9ff"); const ci = IMG.cur_coin; if (ci && ci.naturalWidth) g.drawImage(ci, d.x - 16, d.y - 28 + bob, 32, 32);  }
  else if (d.type === "herb") { const hi = IMG.obj_herb; if (hi && hi.naturalWidth) g.drawImage(hi, d.x - 20, d.y - 34 + bob, 40, 40 * hi.naturalHeight / hi.naturalWidth);  }
  else if (d.type === "act" || (d.type === "shop" && !d.sold)) {
    const isShop = d.type === "shop";
    const isAct = !isShop || d.what === "act", A = isAct ? ACTIVES[d.k] : null;
    const col = isAct ? ACT_TIER[A.rar].col : d.what === "boon" ? RARITY[BOONS[d.k].rar].col : RARITY[1].col;
    const th = (G.cur.th || FLOORS[0]).light;
    const tal = isAct && /^ac_([a-z]+)_/.exec(d.k), ok = tal && IMG["obj_tal_" + tal[1]] ? "obj_tal_" + tal[1] : isAct ? "obj_" + d.k : d.what === "boon" ? "bn_" + d.k : d.what === "item" ? "obj_shop_" + d.k : "obj_herb";
    // 바닥: 그림자 + 층 색 빛 고리
    g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(d.x, d.y + 16, 30, 11, 0, 0, 7); g.fill();
    if (A && A.boss) { const pul = 0.6 + Math.sin(G.time * 5) * 0.3; g.save(); g.globalAlpha = pul * 0.45; const lg = g.createLinearGradient(0, d.y - 200, 0, d.y); lg.addColorStop(0, "rgba(255,90,77,0)"); lg.addColorStop(1, "rgba(255,180,80,0.8)"); g.translate(d.x, d.y - 70); g.scale(0.22, 1); const rg = g.createRadialGradient(0, 0, 0, 0, 0, 150); rg.addColorStop(0, "rgba(255,190,90,0.75)"); rg.addColorStop(0.5, "rgba(255,110,70,0.3)"); rg.addColorStop(1, "rgba(255,90,77,0)"); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 150, 0, 7); g.fill(); g.restore(); }
    glowDot(g, d.x, d.y - 30 + bob, A && A.boss ? 40 : 28, col);
    const oi = IMG[ok] || (A && A.boss ? IMG[A.img] : null), OM = ASSETS.meta && ASSETS.meta[ok];
    if (oi && oi.naturalWidth) { const H = A && A.boss ? 100 : 62, sc = OM ? H * OM.s : H / oi.naturalHeight, w = oi.naturalWidth * sc, h = oi.naturalHeight * sc; g.drawImage(oi, d.x - (OM ? OM.fx * sc : w / 2), d.y + 8 + bob - (OM ? OM.fy * sc : h), w, h); }
    else { const ic = isShop ? (d.what === "herb" ? "🌿" : d.what === "item" ? SHOP_ITEMS[d.k].ic : d.what === "act" ? ACT_IC(d.k) : BOONS[d.k].ic) : ACT_IC(d.k); g.font = "34px sans-serif"; g.textAlign = "center"; g.fillText(ic, d.x, d.y - 20 + bob); }
    const name = isShop ? (d.what === "herb" ? "회복 약초 (40%)" : d.what === "item" ? SHOP_ITEMS[d.k].name : d.what === "act" ? ACTIVES[d.k].name : BOONS[d.k].name) : ACTIVES[d.k].name + (d.lv > 1 ? " Lv." + d.lv : "");
    const label = (A ? `[${ACT_TIER[A.rar].name}] ` : "") + name; const rar = 0;
    g.font = '700 17px "Do Hyeon", sans-serif'; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#000"; g.strokeText(label, d.x, d.y + 44); g.fillStyle = col; g.fillText(label, d.x, d.y + 44);
    if (isShop) { g.strokeText("엽전 " + d.price, d.x, d.y + 66); g.fillStyle = (G.p.gold || 0) >= d.price ? "#ffe08a" : "#ff8a8a"; g.fillText("엽전 " + d.price, d.x, d.y + 66); }
  }
  else if (d.type === "chest") {
    const ci = IMG[d.open ? "chest_closed_open" : "chest_closed"], CM = ASSETS.meta && ASSETS.meta.chest_closed;
    if (ci && ci.naturalWidth) { const H = 96, sc = CM ? H * CM.s : H / ci.naturalHeight; g.fillStyle = "rgba(0,0,0,0.4)"; g.beginPath(); g.ellipse(d.x, d.y + 18, 46, 14, 0, 0, 7); g.fill(); if (!d.open) glowDot(g, d.x, d.y - 20, 50, "#ffc84a"); g.drawImage(ci, d.x - (CM ? CM.fx * sc : ci.naturalWidth * sc / 2), d.y + 22 - (CM ? CM.fy * sc : ci.naturalHeight * sc), ci.naturalWidth * sc, ci.naturalHeight * sc); }
    else { g.save(); g.translate(d.x, d.y); g.fillStyle = "#5a3418"; g.fillRect(-36, -20, 72, 40); g.fillStyle = "#e0b04a"; g.fillRect(-38, -22, 76, 5); g.restore(); }
  }
  else if (d.type === "evt") drawEvt(g, d);
  else if (d.type === "shopre") drawShopRe(g, d);
  else if (d.type === "forge") drawForge(g, d);
  else if (d.type === "merchant") drawMerchant(g, d);
  else if (d.type === "spring") {
    const wl = IMG.well, M = ASSETS.meta && ASSETS.meta.well;
    if (wl && wl.naturalWidth) { const H = 190, sc = M ? H * M.s : H / wl.naturalHeight; g.save(); if (d.used) g.filter = "grayscale(0.8) brightness(0.7)"; else { const gl = g.createRadialGradient(d.x, d.y - 40, 5, d.x, d.y - 40, 130); gl.addColorStop(0, "rgba(140,230,255,0.35)"); gl.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gl; g.fillRect(d.x - 140, d.y - 170, 280, 280); }
      g.drawImage(wl, d.x - (M ? M.fx * sc : wl.naturalWidth * sc / 2), d.y + 40 - (M ? M.fy * sc : wl.naturalHeight * sc), wl.naturalWidth * sc, wl.naturalHeight * sc); g.restore(); }
    else { g.fillStyle = d.used ? "rgba(80,90,100,0.6)" : "rgba(140,240,255,0.9)"; g.beginPath(); g.ellipse(d.x, d.y, 80, 50, 0, 0, 7); g.fill(); }
    g.font = '700 18px "Do Hyeon"'; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#000"; const wsh = d.used && !d.wish && d.price, tx = !d.used ? "약수 우물 · 다가가면 회복" : wsh ? `소원 엽전 · 엽전 ${d.price} → 강화 하나` : "말라붙은 우물"; g.strokeText(tx, d.x, d.y + 70); g.fillStyle = !d.used ? "#cff8ff" : wsh ? ((G.p && G.p.gold || 0) >= d.price ? "#ffe08a" : "#a99") : "#8a8a9a"; g.fillText(tx, d.x, d.y + 70);
  }
  else if (d.type === "stairs" && IMG.portal_gate && IMG.portal_gate.naturalWidth) {
    const im = IMG.portal_gate, M = ASSETS.meta && ASSETS.meta.portal_gate, H = 190, sc = M ? H * M.s : H / im.naturalHeight, w = im.naturalWidth * sc, h = im.naturalHeight * sc;
    g.save(); const gl = g.createRadialGradient(d.x, d.y - 60, 5, d.x, d.y - 60, 140); gl.addColorStop(0, "rgba(120,200,255,0.35)"); gl.addColorStop(1, "rgba(120,200,255,0)"); g.fillStyle = gl; g.beginPath(); g.arc(d.x, d.y - 60, 140, 0, 7); g.fill();
    if (G.p && Math.hypot(G.p.x - d.x, G.p.y - d.y) < 110) g.globalAlpha = 0.55;
    g.drawImage(im, d.x - (M ? M.fx * sc : w / 2), d.y + 20 - (M ? M.fy * sc : h), w, h); g.globalAlpha = 1;
    if (d.hold > 0) { g.strokeStyle = "#ffe08a"; g.lineWidth = 6; g.shadowColor = "#ffb547"; g.shadowBlur = 12; g.beginPath(); g.arc(d.x, d.y - 70, 46, -Math.PI / 2, -Math.PI / 2 + Math.min(1, d.hold) * Math.PI * 2); g.stroke(); g.shadowBlur = 0; }
    g.font = '700 20px "Do Hyeon"'; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#000"; g.strokeText("홍살문 · 1초 서 있기", d.x, d.y + 50); g.fillStyle = "#9fe0ff"; g.fillText("홍살문 · 1초 서 있기", d.x, d.y + 50); g.restore();
  }
  else if (d.type === "stairs") {
    g.save(); g.translate(d.x, d.y); g.shadowColor = "#ffcf4a"; g.shadowBlur = 30;
    for (let i = 0; i < 5; i++) { g.fillStyle = shade("#c8962a", -i * 18); g.fillRect(-60 + i * 6, -40 + i * 16, 120 - i * 12, 16); }
    g.shadowBlur = 0; g.font = '700 20px "Do Hyeon"'; g.textAlign = "center"; g.fillStyle = "#ffe08a"; g.fillText("다음으로 ▼", 0, 70); g.restore();
  }
}
// 길잡이: 방을 정리하면 갈 곳(보스 방 > 안 가 본 방 > 계단)을 화살표로
function drawGuide(g) {
  const p = G.p; if (!p || !p.alive || G.mode === "duel" || roomLocked() || G.client && !G.cur) return;
  if (!(SAVE && SAVE.settings && SAVE.settings.guide)) return; // 11-21 안내 화살표는 기본 끔(설정에서 켬) — 길은 스스로 찾는 맛
  let tx = null, ty = null, label = "";
  const st = G.drops.find((d) => d.type === "stairs");
  const DP = { N: [RW / 2, BT - 10], S: [RW / 2, BB + 10], W: [BL - 10, RH / 2 + 20], E: [BR + 10, RH / 2 + 20] };
  if (st) { tx = st.x; ty = st.y; label = "홍살문"; }
  else { const L = G.cur.links || {}; const ds = Object.keys(L); const boss = ds.find((d) => { const t = G.rooms.get(L[d]); return t && (t.type === "boss" || t.type === "exit") && !t.cleared; }); const nv = ds.find((d) => { const t = G.rooms.get(L[d]); return t && !t.visited; });
    const d = boss; if (!d) return; [tx, ty] = DP[d]; label = boss ? (G.rooms.get(L[boss]).type === "boss" ? "보스" : "출구") : "안 가 본 방"; }
  const dd = Math.hypot(tx - p.x, ty - p.y); if (dd < 140) return;
  const a = Math.atan2(ty - p.y, tx - p.x), rr = 70, pul = 0.6 + Math.sin(G.time * 5) * 0.3;
  g.save(); g.translate(p.x + Math.cos(a) * rr, p.y - 20 + Math.sin(a) * rr); g.rotate(a); g.globalAlpha = pul;
  g.fillStyle = label === "보스" ? "#ff6a5a" : "#ffd27a"; g.shadowColor = g.fillStyle; g.shadowBlur = 12;
  g.beginPath(); g.moveTo(16, 0); g.lineTo(-8, -10); g.lineTo(-3, 0); g.lineTo(-8, 10); g.closePath(); g.fill(); g.restore();
}
// 아이템 근처에 가면 효과 설명 (사용자 요청 11-10)
function drawItemInfo(g) {
  const p = G.p; if (!p || !p.alive) return;
  let best = null, bd = 170;
  for (const d of G.drops) { if (!["act", "shop", "chest", "spring", "stairs", "forge"].includes(d.type) || (d.type === "forge" && d.used) || d.sold || (d.type === "chest" && d.open) || (d.type === "spring" && d.used && (d.wish || !d.price))) continue; const dd = Math.hypot(d.x - p.x, d.y - p.y); if (dd < bd) { bd = dd; best = d; } }
  if (!best) return;
  const d = best; let title = "", col = "#ffe08a", lines = [];
  if (d.type === "act" || (d.type === "shop" && d.what === "act")) {
    const A = ACTIVES[d.k]; title = `[${ACT_TIER[A.rar].name}] ${A.name}${d.lv > 1 ? " Lv." + d.lv : ""}`; col = ACT_TIER[A.rar].col;
    lines = [A.desc, (IS_TOUCH ? `액티브 버튼으로 써요 · 대기 ${A.cd}초` : `액티브 · ${keyLabel(keyMap().act)} 키 · 대기 ${A.cd}초`), p.active ? (p.active.k === d.k ? "같은 것을 주우면 레벨 업" : p.actLock ? `🔒 잠금 중이라 줍지 않아요 (${IS_TOUCH ? "자물쇠를 눌러 풀기" : keyLabel(keyMap().lock) + " 키로 풀기"})` : `주우면 들고 있던 「${ACTIVES[p.active.k].name}」은 바닥에 놓여요`) : "밟으면 주워요"];
  } else if (d.type === "shop" && d.what === "boon") { const B = BOONS[d.k]; title = B.name; col = RARITY[B.rar].col; lines = [B.desc, `강화 (${RARITY[B.rar].name}) · 이번 원정 동안 계속 적용`]; }
  else if (d.type === "shop" && d.what === "herb") { title = "회복 약초"; col = "#7fe08a"; lines = ["체력 40% 회복"]; }
  else if (d.type === "shop" && d.what === "item") { const I = SHOP_ITEMS[d.k]; title = I.name; lines = [I.desc]; }
  else if (d.type === "chest") { title = d.secret ? "옛 토벌꾼이 남긴 상자" : "보물상자"; lines = ["다가가면 열려요 · 엽전, 가끔 코인·회복 약초"]; }
  else if (d.type === "forge") { title = "떠돌이 대장간"; lines = ["떠돌이 대장장이는 기운도 쇠처럼 다시 두드린다지", `엽전 ${d.price} — 가진 강화 하나를 녹여 새 강화로 (한 번)`]; }
  else if (d.type === "spring") { if (d.used) { title = "소원 엽전"; lines = ["마른 우물에 엽전을 던지면 소원 하나는 들어준다지", `엽전 ${d.price} — 떨어졌다 다시 다가가면 강화 하나 고르기 (한 번)`]; } else { title = "약수 우물"; col = "#9fe8ff"; lines = ["다가가면 체력을 최대치까지 회복 (보호막 없음, 한 번)"]; } }
  else if (d.type === "stairs" && d.raid) { title = "다음 보스 홍살문"; lines = [`문 안에 1초 서 있으면 ${G.raidN + 1}번째 보스가 나와요`, "그 전에 보부상에게 물건을 사 두세요"]; }
  else if (d.type === "stairs") { title = "홍살문"; lines = [hellNoHeal() ? "문 안에 1초 서 있으면 다음 스테이지로 (매우 어려움: 회복 없음)" : "문 안에 1초 서 있으면 다음 스테이지로 · 체력 25% 회복", "그 전에 다른 방을 둘러봐도 돼요"]; }
  if (d.type === "shop") lines.push(`가격 엽전 ${d.price} · 내 엽전 ${p.gold || 0}${(p.gold || 0) >= d.price ? " · 밟으면 사요" : " · 모자라요"}`);
  g.save(); g.font = '700 19px "Do Hyeon", sans-serif';
  const body = '15px "Gowun Dodum", sans-serif';
  let w = g.measureText(title).width; g.font = body; for (const l of lines) w = Math.max(w, g.measureText(l).width);
  w = Math.min(520, w + 28); const h = 34 + lines.length * 21;
  const vx0 = Math.max(BL + 4, view.x0 != null ? view.x0 + 8 : 0), vx1 = Math.min(BR - 4, view.x1 != null ? view.x1 - 8 : RW), vy0 = Math.max(BT + 4, view.y0 != null ? view.y0 + 90 : 0);
  let x = clamp(d.x - w / 2, vx0, vx1 - w), y = d.y - 110 - h; if (y < vy0) y = d.y + 80; // 11-17 확대 화면 안에 들어오게
  g.globalAlpha = Math.min(1, (170 - bd) / 40);
  g.fillStyle = "rgba(12,10,18,0.92)"; roundRect(g, x, y, w, h, 10); g.fill(); g.strokeStyle = col; g.lineWidth = 2; g.stroke();
  g.textAlign = "left"; g.fillStyle = col; g.font = '700 19px "Do Hyeon", sans-serif'; g.fillText(title, x + 14, y + 24);
  g.font = body; lines.forEach((l, i) => { g.fillStyle = i === 0 ? "#f1ebdf" : "#a39bb2"; g.fillText(l, x + 14, y + 46 + i * 21, w - 24); });
  g.restore();
}
// 효과 그림으로 그리기 (그림이 없으면 false → 예전 방식)
// Blender 로 만든 움직이는 효과 시트 (11-15 사용자: 스킬 효과에 블렌더 적용) — art/vfx_<종류>_anim.webp, 4열 x 3줄 12장.
// 한 번 터지는 효과를 그릴 때만 진행도(FXK 0~1)에 맞는 칸을 고른다. 시트가 아직 없으면(받는 중) 예전 한 장 그림.
const ANIM_N = 12, ANIM_COLS = 4, ANIM_KINDS = new Set(["slash", "burst", "shock", "smoke", "hit", "bolt", "beam"]);
let FXK = -1;
function animCell(key, col) {
  if (FXK >= 0 && key.startsWith("cvfx_")) { // 11-16 full 3D: 영웅·속성 효과도 Blender 12장 (<키>_anim, 4x3)
    const sh = IMG[key + "_anim"]; if (!sh || !sh.naturalWidth) return null;
    const i = Math.min(ANIM_N - 1, Math.floor(FXK * ANIM_N)), cw = sh.naturalWidth / ANIM_COLS, ch = sh.naturalHeight / 3;
    return { im: sh, sx: (i % ANIM_COLS) * cw, sy: Math.floor(i / ANIM_COLS) * ch, sw: cw, sh: ch };
  }
  if (FXK < 0 || !ANIM_KINDS.has(key)) return null;
  const sh = IMG["vfx_" + key + "_anim"]; if (!sh || !sh.naturalWidth) return null;
  const im = vfxImg(key + "_anim", col); if (!im) return null;
  const i = Math.min(ANIM_N - 1, Math.floor(FXK * ANIM_N)), cw = im.width / ANIM_COLS, ch = im.height / Math.ceil(ANIM_N / ANIM_COLS);
  return { im, sx: (i % ANIM_COLS) * cw, sy: Math.floor(i / ANIM_COLS) * ch, sw: cw, sh: ch };
}
function drawFxImg(g, f, k) {
  FXK = k; const r = drawFxImg0(g, f, k); FXK = -1; return r;
}
function drawFxImg0(g, f, k) {
  if (!IMG.vfx_slash || !IMG.vfx_slash.naturalWidth) return false;
  const fade = 1 - k, col = f.col || "#ffffff";
  switch (f.k) {
    case "slash": { const ck = f.cid ? "cvfx_" + f.cid + "_hit" : null; if (ck && IMG[ck] && IMG[ck].naturalWidth) return vfx(g, ck, null, f.x, f.y, f.r * 2.4 * (0.85 + k * 0.25), f.r * 2.4 * (0.85 + k * 0.25), f.a, fade * 1.15); return vfx(g, "slash", col, f.x, f.y, f.r * 2.3 * (0.85 + k * 0.25), f.r * 2.3 * (0.85 + k * 0.25), f.a, fade * 1.2); }
    case "ring": { const R = f.r * 2 * (0.55 + k * 0.6), ck = f.cid ? "cvfx_" + f.cid + "_hit" : null; if (ck && IMG[ck] && IMG[ck].naturalWidth) vfx(g, ck, null, f.x, f.y - 10, R, R * 0.8, 0, fade * 1.1); else vfx(g, "burst", col, f.x, f.y - 10, R, R * 0.8, 0, fade * 1.1); vfx(g, "shock", col, f.x, f.y, f.r * 2 * (0.4 + k * 0.8), f.r * 1.4 * (0.4 + k * 0.8), 0, fade); return true; }
    case "sig": { const e = 1 - Math.pow(1 - Math.min(1, k * 2.2), 3), S = f.r * 2.3 * (0.55 + e * 0.5); vfx(g, f.key, null, f.x, f.y - 10, S, S * 0.92, (f.rot || 0) + (k - 0.5) * 0.25, Math.min(1, (1 - k) * 2.2)); return true; }
    case "sigL": { const e = Math.min(1, k * 3); g.save(); g.translate(f.x, f.y); g.rotate(f.a); vfx(g, f.key, null, f.len / 2, 0, f.len * (0.6 + e * 0.4), Math.max(f.w * 2.4, 120), 0, Math.min(1, (1 - k) * 2.2)); g.restore(); return true; }
    case "hit": return vfx(g, "hit", col, f.x, f.y, f.r * (0.7 + k * 0.6), f.r * (0.7 + k * 0.6), f.a, fade * 1.2);
    case "puff": return vfx(g, "smoke", col, f.x, f.y - 30, 110 * (0.6 + k * 0.6), 110 * (0.6 + k * 0.6), 0, fade);
    case "land": { vfx(g, "shock", col, f.x, f.y + 10, 80 + k * 260, (80 + k * 260) * 0.45, 0, fade); return vfx(g, "smoke", col, f.x, f.y - 10, 160, 120, 0, fade * 0.8); }
    case "beam": { const im = vfxImg("beam", col); if (!im) return false; const ac = animCell("beam", col); g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = ac ? Math.min(1, 1.6 - k) : fade; g.translate(f.x, f.y); g.rotate(f.a); if (ac) g.drawImage(ac.im, ac.sx, ac.sy, ac.sw, ac.sh, -20, -f.w * 1.4 * (1 - k * 0.4), f.len + 40, f.w * 2.8 * (1 - k * 0.4)); else g.drawImage(im, -20, -f.w * 1.4 * (1 - k * 0.4), f.len + 40, f.w * 2.8 * (1 - k * 0.4)); g.restore(); return true; }
    case "boltDown": { vfx(g, "bolt", col, f.x, f.y - 250, 160, 520, 0, fade * 1.2); vfx(g, "burst", col, f.x, f.y, f.r * 2, f.r * 1.5, 0, fade); return true; }
    case "bolt": { const L = Math.hypot(f.x2 - f.x, f.y2 - f.y), a = Math.atan2(f.y2 - f.y, f.x2 - f.x) - Math.PI / 2; const im = vfxImg("bolt", col); if (!im) return false; const ac = animCell("bolt", col); g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = ac ? Math.min(1, 1.6 - k) : fade; g.translate(f.x, f.y); g.rotate(a); if (ac) g.drawImage(ac.im, ac.sx, ac.sy, ac.sw, ac.sh, -40, 0, 80, L); else g.drawImage(im, -40, 0, 80, L); g.restore(); return true; }
  }
  return false;
}
function glowDot(g, x, y, r, col) { if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(r) || r <= 0) return; const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, "#fff"); gr.addColorStop(0.35, col); gr.addColorStop(1, hexA(col, 0)); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function tinted(img, key, filter) {
  const k = key + filter; if (tintCache[k]) return tintCache[k];
  if (!img.complete || !img.naturalWidth) return img;
  const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight; const x = c.getContext("2d"); x.filter = filter; x.drawImage(img, 0, 0); tintCache[k] = c; return c;
}
// 동작 그림 고르기: 걷기(걷기1·기본·걷기2·기본), 공격, 스킬. 보스는 공격 자세
function spriteFor(u) {
  let base, H;
  if (u.kind === "hero") { base = "spr_" + u.art; H = 105; }
  else if (u.kind === "pet") { base = u.img; H = 52; } // 영웅(105)의 절반 (사용자 요청 11-11)
  else if (u.kind === "boss") { base = u.img; H = u.r * 3.2; }
  else { base = u.img; H = u.r * 2.9; }
  const M = ASSETS.meta && ASSETS.meta[base], fr = (M && M.frames) || [];
  let key = base;
  // 3D 모션 (11-15 사용자: full 3D 모션, Blender 뼈대 동작 렌더 → <base>_a_<동작> 가로 띠). 스킬은 그려진 효과가 있어 예전 그림.
  const A = M && M.anim;
  if (A && !(u.skillAnim > 0 && fr.includes("skill") && !A.m.skill)) {
    // 이동: 영웅은 입력, 나머지는 위치 변화로 판단 / 방향: 위아래로 많이 움직이면 앞(아래)·뒤(위) 모습 (11-16 방향별 3D 모션)
    const ddx = u.x - (u._ax ?? u.x), ddy = u.y - (u._ay ?? u.y); u._ax = u.x; u._ay = u.y;
    const mv = u.kind === "hero" ? !!(u.moving || u.dash) : Math.hypot(ddx, ddy) > 0.25;
    // 8방향 (11-16 full 3D): 옆 s · 앞 대각 fd · 앞 f · 뒤 대각 bd · 뒤 b (왼쪽은 좌우 뒤집기). 각도 = 움직이는 방향
    const d8 = (dx, dy) => { const a = Math.atan2(dy, Math.abs(dx)) * 57.3; return a > 67.5 ? "f" : a > 22.5 ? "fd" : a < -67.5 ? "b" : a < -22.5 ? "bd" : "s"; };
    if (Math.hypot(ddx, ddy) > 0.25) u._dir = d8(ddx, ddy);
    const ALT = { fd: "f", bd: "b" }, R = (mm) => (A.m[mm] || 8) / 8; // 장 수가 늘어도(8→12) 같은 빠르기
    const pick = (m, dir) => (dir !== "s" && A.m[m + "_" + dir] ? m + "_" + dir : ALT[dir] && A.m[m + "_" + ALT[dir]] ? m + "_" + ALT[dir] : m);
    const dir = u._dir || "s", vw = (m) => pick(m, dir);
    const HURT = u.kind === "hero" ? 0.28 : u.kind === "mob" ? 0.2 : 0.22;
    if (u.kind === "pet") { if (u.cd > (u._lcd ?? 0) + 0.15) u.atkUntil = G.time + 0.28; u._lcd = u.cd; } /* 펫 공격 순간 (3D 동작에서도) */
    const atkOn = u.atkAnim > 0 || u.st === "wind" || (u.kind === "boss" && (u.atkT > 0 || u.flash > 0) && u.st !== "charge") || (u.kind === "pet" && u.atkUntil > G.time);
    let m = vw("idle"), f = Math.floor((G.time * 7 + (u.ph || 0) * 3) * R(vw("idle")));
    if (u.skillAnim > 0 && A.m.skill) { m = "skill"; f = Math.floor((1 - u.skillAnim / 0.4) * A.m.skill); }
    else if (u.kind === "boss" && u.castT > 0 && A.m.skill) { m = "skill"; f = Math.min(A.m.skill - 1, Math.floor(G.time * 10) % (A.m.skill + 4)); }
    else if (u.getupT > 0 && A.m.getup) { m = "getup"; f = Math.floor((1 - u.getupT / 0.8) * A.m.getup); } // 부활 — 일어나기 (Mixamo, 11-16)
    else if (u.hurtT > 0 && A.m.hurt) { m = "hurt"; f = Math.floor((1 - u.hurtT / HURT) * A.m.hurt); }
    else if (u.stunT > 0 && A.m.dizzy) { m = "dizzy"; f = Math.floor((G.time * 9 + (u.ph || 0) * 3) * R("dizzy")); } // 기절 — 어지러움
    else if (atkOn && A.m.attack) { m = u.atkAlt && A.m.attack2 ? "attack2" : "attack"; if (u.face != null) m = pick(m, d8(Math.cos(u.face), Math.sin(u.face))); f = u.atkAnim > 0 ? Math.floor((1 - u.atkAnim / 0.22) * A.m[m]) : u.kind === "pet" ? Math.floor((1 - (u.atkUntil - G.time) / 0.28) * A.m[m]) : Math.floor(G.time * 14 * R(m)); } // 칼 공격 두 가지 번갈아
    else if (u.celebT > 0 && A.m.victory && !mv) { m = "victory"; f = Math.floor((1 - u.celebT / 0.9) * A.m.victory); } // 레벨업·방 정복 — 환호
    else if ((u.dash || u.st === "charge") && A.m.run) { m = vw("run"); f = Math.floor((G.time * 16 + (u.ph || 0) * 3) * R(m)); } // 대시·돌진 — 달리기
    else if ((mv || u.st === "charge") && A.m.walk) { m = vw("walk"); f = Math.floor((G.time * (u.dash || u.st === "charge" ? 18 : 11) + (u.ph || 0) * 3) * R(m)); }
    let im = IMG[base + "_a_" + m];
    if (!(im && im.naturalWidth)) { for (const alt of ["idle", "walk"]) { const i2 = IMG[base + "_a_" + alt]; if (A.m[alt] && i2 && i2.naturalWidth) { im = i2; m = alt; f = Math.floor((G.time * 7 + (u.ph || 0) * 3) * R(alt)); break; } } }
    if (im && im.naturalWidth) {
      const n = A.m[m]; f = ((f % n) + n) % n;
      return { key: base + "_a_" + m, base, H, M: { s: A.s * ((A.ms && A.ms[m]) || 1), fx: A.fx, fy: A.fy }, cell: { sx: f * A.cw, sw: A.cw, sh: A.ch }, anim: true, sh: !!A.sh };
    }
  }
  if (u.kind === "hero") {
    if (u.skillAnim > 0 && fr.includes("skill")) key = base + "_skill";
    else if (u.hurtT > 0 && fr.includes("hurt")) key = base + "_hurt";
    else if (u.atkAnim > 0 && fr.includes("attack")) key = base + "_attack";
    else if ((u.moving || u.dash) && fr.includes("walk1")) { const f = Math.floor(G.time * (u.dash ? 12 : 8)) % 4; key = f === 0 ? base + "_walk1" : f === 2 ? base + "_walk2" : base; }
  } else if (u.kind === "pet" && fr.length) {
    const mv = Math.hypot(u.x - (u._lx ?? u.x), u.y - (u._ly ?? u.y)) > 0.3; u._lx = u.x; u._ly = u.y;
    if (u.cd > (u._lcd ?? 0) + 0.15) u.atkUntil = G.time + 0.28; u._lcd = u.cd;
    if (u.atkUntil > G.time && fr.includes("attack")) key = base + "_attack";
    else if (mv && fr.includes("walk1")) { const f = Math.floor(G.time * 9) % 4; key = f === 0 ? base + "_walk1" : f === 2 ? base + "_walk2" : base; }
  } else if ((u.kind === "boss" || u.kind === "mob") && u.hurtT > 0 && fr.includes("hurt")) key = base + "_hurt";
  else if (u.kind === "boss" && u.castT > 0 && fr.includes("skill")) key = base + "_skill";
  else if (u.kind === "boss" && fr.includes("attack") && (u.st === "charge" || u.atkT > 0 || u.flash > 0)) key = base + "_attack";
  return { key, base, H, M: A && A.k0 && M ? { s: M.s * A.k0, fx: M.fx, fy: M.fy } : M };
}
const FLOOR_TINT = ["none", "hue-rotate(160deg) saturate(1.2)", "hue-rotate(-30deg) saturate(1.5)", "hue-rotate(80deg)", "hue-rotate(230deg) saturate(1.3)"];
function drawUnit(g, u) {
  if (u.kind === "summon" && IMG[u.img] && IMG[u.img].naturalWidth) {
    let M = ASSETS.meta && ASSETS.meta[u.img], im = IMG[u.img], cel = null; const fl = Math.sin(G.time * 6 + u.ph) * 4 - 6, H = u.r * 2.8;
    const A = M && M.anim, ai = A && IMG[u.img + "_a_idle"]; // 소환수 3D 모션 (11-15): 대기 띠를 돌림
    if (ai && ai.naturalWidth) { const f = Math.floor(G.time * 8 + (u.ph || 0) * 3) % A.m.idle; im = ai; cel = { sx: f * A.cw, sw: A.cw, sh: A.ch }; M = { s: A.s * ((A.ms && A.ms.idle) || 1), fx: A.fx, fy: A.fy }; }
    const iw = cel ? cel.sw : im.naturalWidth, ih = cel ? cel.sh : im.naturalHeight, sc = M ? H * M.s : H / ih, dw = iw * sc, dh = ih * sc, ax = M ? M.fx * sc : dw / 2, ay = M ? M.fy * sc : dh;
    g.save(); g.globalAlpha = Math.min(1, u.life * 2) * 0.95; g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(u.x, u.y + 2, u.r * 0.9, u.r * 0.3, 0, 0, 7); g.fill();
    g.translate(u.x, u.y + fl); if (u.flip) g.scale(-1, 1); g.shadowColor = "#9ff3f8"; g.shadowBlur = 14;
    if (cel) g.drawImage(im, cel.sx, 0, cel.sw, cel.sh, -ax, -ay, dw, dh); else g.drawImage(im, -ax, -ay, dw, dh);
    g.restore(); return;
  }
  if (u.kind === "summon") { g.save(); const fl = Math.sin(G.time * 6 + u.ph) * 4; g.shadowColor = "#9ff3f8"; g.shadowBlur = 16; g.globalAlpha = Math.min(1, u.life * 2); g.font = `${u.r * 2}px sans-serif`; g.textAlign = "center"; g.fillText(u.e, u.x, u.y + fl); g.restore(); return; }
  if (u.guardT > 0) { const ci = IMG.cvfx_btel_b_boss6_circle; if (ci && ci.naturalWidth) { g.save(); g.globalAlpha = 0.75; g.translate(u.x, u.y); g.scale(1, 0.7); g.rotate(G.time); g.drawImage(ci, -u.r * 1.9, -u.r * 1.9, u.r * 3.8, u.r * 3.8); g.restore(); } }
  const sp = spriteFor(u);
  let img = IMG[sp.key] || IMG[sp.base], h = sp.H;
  if (u.kind === "mob") { const ti = FLOOR_TINT[(G.mode === "endless" ? (G.eFloor || 1) - 1 : G.floor - 1) % 5]; if (ti !== "none") img = tinted(img, sp.key, ti); }
  if (!img) return;
  const cel = sp.cell, iw = cel ? cel.sw : img.naturalWidth || img.width, ih = cel ? cel.sh : img.naturalHeight || img.height; if (!iw) return;
  // 그림 크기·발 위치 (meta 가 있으면 동작 그림끼리 발 위치를 맞춘다)
  const M = sp.M, sc = M ? h * M.s : h / ih, dw = iw * sc, dh = ih * sc, ax = M ? M.fx * sc : dw / 2, ay = M ? M.fy * sc : dh;
  let bob = 0, sq = 1, lean = 0, lunge = 0;
  if (sp.anim) { if (u.dash) lean = 0.08; } // 3D 모션 그림에는 걷기 흔들림·숨쉬기가 이미 들어 있어 코드 흔들림은 끔
  else if (u.moving || u.dash) { bob = Math.abs(Math.sin(G.time * 15 + (u.ph || 0))) * -4; lean = u.dash ? 0.12 : 0.05; }
  else if (u.kind === "hero" || u.kind === "boss") { sq = 1 + Math.sin(G.time * 3 + (u.ph || 0)) * 0.015; }
  if (u.kind === "mob" && !sp.anim) { bob = Math.abs(Math.sin(G.time * 9 + (u.ph || 0))) * -5; sq = 1 + Math.sin(G.time * 9 + (u.ph || 0)) * 0.04; }
  if (u.kind === "pet") bob = Math.sin(G.time * 4) * 3 - 8;
  if (u.atkAnim > 0) { lunge = Math.sin((u.atkAnim / 0.22) * Math.PI) * (sp.anim ? 4 : 10); }
  if (u.recoil > 0) { lunge = -Math.sin((u.recoil / 0.12) * Math.PI) * 9; u.recoil -= 1 / 60; }
  if (u.skillAnim > 0) { sq = 1 + Math.sin((u.skillAnim / 0.4) * Math.PI) * 0.06; }
  if (u.hitT > 0 && u.kind !== "hero") sq *= 1 + 0.11 * Math.min(1, u.hitT / 0.12); // 11-18 맞은 순간 옆으로 찌그러짐
  if (u.hurtT > 0) { const k = Math.sin((u.hurtT / 0.28) * Math.PI); if (sp.anim) lunge = -4 * k; else { lean = -0.1 * k; lunge = -8 * k; sq = 1 - 0.04 * k; } }
  if (u.spawnT > 0) { g.save(); g.globalAlpha = 1 - u.spawnT / 0.6; glowDot(g, u.x, u.y, 60, "#a070ff"); }
  if (u.kind === "hero" && u.skillAnim > 0) { g.save(); g.globalAlpha = 0.45 * Math.sin((u.skillAnim / 0.4) * Math.PI); glowDot(g, u.x, u.y - h * 0.45, h * 0.75, u.def.col || "#ffd27a"); g.restore(); }
  if (u.shield > 1) drawWardRing(g, u);
  g.save();
  g.translate(u.x, u.y + u.r * 0.6 + bob);
  if (u.flip) g.scale(-1, 1);
  g.translate(lunge, 0); g.rotate(lean);
  g.scale(sq, 1 / sq);
  if (u.kind === "hero" && (u.invT > 0 || hasBuff(u, "inv"))) g.globalAlpha = 0.6 + Math.sin(G.time * 30) * 0.3;
  if (u.kind === "hero" && hasBuff(u, "stealth")) g.globalAlpha = u === G.p ? 0.4 : 0.12;
  if (u.elite) { g.shadowColor = u.mshield > 0 ? "#6fa8ff" : "#ff4dff"; g.shadowBlur = u.mshield > 0 ? 34 : 22; }
  if (u.kind === "boss") { g.shadowColor = u.ph2 ? "#ff3b30" : "#8a6bff"; g.shadowBlur = 30; }
  if (u.kind === "hero" && u.team === 1) { g.shadowColor = "#ff4d4d"; g.shadowBlur = 14; }
  else if (u === G.p && !(SAVE && SAVE.settings.low)) { g.shadowColor = "rgba(255,226,170,0.75)"; g.shadowBlur = 10; } // 11-17 내 영웅 테두리 빛
  const whiteHit = u.hitT > 0 && u.kind !== "hero" && !(SAVE && SAVE.settings.low);
  if (u.hitT > 0 && !whiteHit) g.filter = u.kind === "hero" ? "brightness(1.6) saturate(1.3)" : "brightness(2.4)";
  else if (u.hitT > 0) {}
  else if (u.stunT > 0) g.filter = "grayscale(0.6) brightness(1.2)";
  else if (u.flash > 0) { g.filter = "brightness(1.8) saturate(1.5)"; }
  if (cel) g.drawImage(img, cel.sx, 0, cel.sw, cel.sh, -ax, -ay, dw, dh); else g.drawImage(img, -ax, -ay, dw, dh);
  if (GLR.occOn && g === GLR.a && u.alive) occDraw(g, img, cel ? [cel.sx, 0, cel.sw, cel.sh, -ax, -ay, dw, dh] : [-ax, -ay, dw, dh]);
  if (whiteHit) { g.shadowBlur = 0; g.globalCompositeOperation = "lighter"; g.globalAlpha = Math.min(1, u.hitT / 0.12) * 0.85; for (let k = 0; k < 2; k++) { if (cel) g.drawImage(img, cel.sx, 0, cel.sw, cel.sh, -ax, -ay, dw, dh); else g.drawImage(img, -ax, -ay, dw, dh); } } // 11-17 타격감: 하얗게 번쩍
  g.restore();
  if (u.flash > 0) u.flash -= 1 / 60;
  if (u.spawnT > 0) g.restore();
  // 버프 고리
  if (u.shield > 1) drawWard(g, u);
  // 체력 막대
  if (u.kind === "mob" && u.hp < u.maxHp) bar(g, u.x - u.r, u.y - h + u.r * 0.4 - 4, u.r * 2, 5, u.hp / u.maxHp, u.elite ? "#ff6aff" : "#ff5a5a");
  if ((u.kind === "mob" || u.kind === "boss") && u.alive) { const st = (u.burn && u.burn.t > 0 ? "🔥" : "") + (u.slowT > 0 ? "❄️" : "") + (u.stunT > 0 ? "💫" : "") + (u.markT > 0 ? "🎯" : ""); if (st) { g.save(); g.font = "14px sans-serif"; g.textAlign = "center"; g.fillText(st, u.x, u.y - h + u.r * 0.4 - (u.affix ? 28 : 12)); g.restore(); } } // 11-16 상태 이상 표시
  if (u.affix && AFFIX[u.affix]) { const A_ = AFFIX[u.affix]; g.save(); g.font = "bold 15px sans-serif"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,0.75)"; g.strokeText(A_.name, u.x, u.y - h + u.r * 0.4 - 12); g.fillStyle = A_.col; g.fillText(A_.name, u.x, u.y - h + u.r * 0.4 - 12); g.restore(); }
  if (u.kind === "hero" && u !== G.p) {
    bar(g, u.x - 36, u.y - 92, 72, 6, u.hp / u.maxHp, u.team === G.p.team ? "#7fe08a" : "#ff5a5a");
    const nm = u.guestName || (G.client && u.team === G.p.team ? "방장" : "");
    if (nm) { g.font = '700 14px "Do Hyeon", sans-serif'; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#000"; g.strokeText(nm, u.x, u.y - 98); g.fillStyle = "#fff"; g.fillText(nm, u.x, u.y - 98); }
  }
  if (u.kind === "hero" && u === G.p && G.mode !== "duel") { /* HUD에 표시 */ }
  if (u.stunT > 0) { g.font = "20px sans-serif"; g.textAlign = "center"; cvEmo(g, "💫", u.x, u.y - h + u.r * 0.2, 26); }
  if (u.burn) { g.font = "14px sans-serif"; cvEmo(g, "🔥", u.x + u.r, u.y - u.r, 20); }
  if (u.markT > 0) { g.font = "16px sans-serif"; cvEmo(g, "📕", u.x - u.r, u.y - u.r, 22); }
}
function bar(g, x, y, w, h, k, col) { g.fillStyle = "rgba(0,0,0,0.7)"; g.fillRect(x - 1, y - 1, w + 2, h + 2); g.fillStyle = col; g.fillRect(x, y, w * clamp(k, 0, 1), h); }
function drawProj(g, pr) {
  if (pr.bimg && IMG[pr.bimg] && IMG[pr.bimg].naturalWidth) { const S = Math.max(54, pr.r * 7.5); vfx(g, pr.bimg, null, pr.x, pr.y, S, S, pr.spin ? G.time * 7 + pr.x * 0.01 : pr.ang || 0, 1); return; }
  // 캐릭터·몬스터·보스 전용 투사체 그림 (사용자 요청 11-11)
  const ck = pr.cid ? "cvfx_" + pr.cid + "_proj" : pr.team === 1 ? (pr.fromBoss ? "cvfx_boss_proj" : "cvfx_mob_proj") : null;
  if (ck && IMG[ck] && IMG[ck].naturalWidth && !pr.petShot) { const S = pr.team === 1 ? (pr.fromBoss ? pr.r * 7 : pr.r * 5.5) : Math.max(46, pr.r * 6); vfx(g, ck, null, pr.x, pr.y, S, S, pr.ang || 0, 1); return; }
  g.save(); g.translate(pr.x, pr.y); g.rotate(pr.ang || 0);
  const col = pr.alt || pr.col;
  if (pr.shape === "arrow" || pr.shape === "spear") { const L = pr.shape === "spear" ? 60 : 34; g.strokeStyle = col; g.lineWidth = pr.shape === "spear" ? 5 : 3; g.shadowColor = col; g.shadowBlur = 10; g.beginPath(); g.moveTo(-L, 0); g.lineTo(0, 0); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(6, 0); g.lineTo(-6, -5); g.lineTo(-6, 5); g.fill(); }
  else if (pr.shape === "crescent") { g.shadowColor = col; g.shadowBlur = 20; g.fillStyle = col; g.beginPath(); g.arc(0, 0, pr.r, -1.3, 1.3); g.arc(-pr.r * 0.45, 0, pr.r * 0.85, 1.1, -1.1, true); g.fill(); }
  else if (pr.shape === "talisman") { g.rotate(G.time * 8); g.fillStyle = "#f5e08a"; g.fillRect(-7, -11, 14, 22); g.fillStyle = "#d02020"; g.fillRect(-3, -7, 6, 2); g.fillRect(-1, -7, 2, 14); g.shadowColor = col; g.shadowBlur = 12; g.strokeStyle = col; g.strokeRect(-7, -11, 14, 22); }
  else if (pr.shape === "axe") { g.rotate(G.time * 18); g.font = "34px sans-serif"; g.textAlign = "center"; cvEmo(g, "🪓", 0, 12, 40); }
  else if (pr.shape === "star") { g.rotate(G.time * 20); g.fillStyle = col; g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 4 : 12, a = (i / 8) * 6.283; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill(); }
  else if (pr.shape === "heart") { g.font = "30px sans-serif"; g.textAlign = "center"; cvEmo(g, "💗", 0, 10, 34); }
  else if (pr.shape === "chain") { g.strokeStyle = col; g.lineWidth = 4; g.setLineDash([8, 5]); g.beginPath(); g.moveTo(-90, 0); g.lineTo(0, 0); g.stroke(); g.setLineDash([]); glowDot(g, 0, 0, 14, col); }
  else { if (!vfx(g, "orb", col, 0, 0, pr.r * 6, pr.r * 6, 0, 1)) glowDot(g, 0, 0, pr.r * 1.6, col); if (pr.team === 1) { g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, pr.r * 0.45, 0, 7); g.fill(); } }
  g.restore();
}
// ---------- 스킬 효과 그림 (흰 빛 그림에 색을 입혀 더하기로 그림) ----------
const vfxCache = {};
function vfxImg(key, col) {
  if (key.startsWith("cvfx_")) { const ci = IMG[key]; return ci && ci.naturalWidth ? ci : null; }
  const im = IMG["vfx_" + key]; if (!im || !im.naturalWidth) return null;
  const ck = key + (col || ""); if (vfxCache[ck]) return vfxCache[ck];
  const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext("2d");
  x.drawImage(im, 0, 0); x.globalCompositeOperation = "source-in"; x.fillStyle = col || "#ffffff"; x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = "lighter"; x.globalAlpha = 0.45; x.drawImage(im, 0, 0); // 가운데는 하얗게 빛나게
  return (vfxCache[ck] = c);
}
function vfx(g, key, col, x, y, w, h, rot, alpha, ox) {
  const im = vfxImg(key, col); if (!im || alpha <= 0) return false;
  const ac = animCell(key, col); if (ac) alpha = alpha / Math.max(0.4, 1 - FXK); // 시트가 스스로 타 들어가며 사라지므로 덜 흐리게
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = clamp(alpha * (SAVE && SAVE.settings.fxAmt != null ? SAVE.settings.fxAmt : 1), 0, 1); g.translate(x, y); if (rot) g.rotate(rot);
  if (ac) g.drawImage(ac.im, ac.sx, ac.sy, ac.sw, ac.sh, ox != null ? ox : -w / 2, -h / 2, w, h); else g.drawImage(im, ox != null ? ox : -w / 2, -h / 2, w, h);
  g.restore(); return true;
}
function drawFx(g, f) {
  const k = f.t / f.max;
  if (drawFxImg(g, f, k)) return;
  g.save();
  if (f.k === "slash") {
    g.globalAlpha = 1 - k; g.strokeStyle = f.col; g.shadowColor = f.col; g.shadowBlur = 16; g.lineCap = "round";
    for (let i = 0; i < 3; i++) { g.lineWidth = 10 - i * 3; g.beginPath(); g.arc(f.x, f.y, f.r * (0.7 + i * 0.12) * (0.8 + k * 0.3), f.a - f.w / 2 + k * 0.4, f.a + f.w / 2 - (1 - k) * 0.3); g.stroke(); }
  } else if (f.k === "jobup") {
    const a = 1 - k, w = 120 + 60 * Math.sin(k * Math.PI);
    const gr = g.createLinearGradient(f.x, f.y - 900, f.x, f.y + 40); gr.addColorStop(0, hexA(f.col, 0)); gr.addColorStop(0.6, hexA(f.col, 0.45 * a)); gr.addColorStop(1, hexA("#ffffff", 0.8 * a));
    g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(f.x - w / 2, f.y - 900, w, 940);
    g.fillStyle = hexA("#ffffff", 0.6 * a); g.fillRect(f.x - w / 7, f.y - 900, w / 3.5, 940);
    for (let i = 0; i < 3; i++) { const r = 60 + ((k * 1.6 + i / 3) % 1) * 300; g.strokeStyle = hexA(i % 2 ? "#ffe9a0" : f.col, a * (1 - r / 380)); g.lineWidth = 6; g.beginPath(); g.ellipse(f.x, f.y, r, r * 0.42, 0, 0, Math.PI * 2); g.stroke(); }
    g.globalCompositeOperation = "source-over";
  } else if (f.k === "ring") {
    g.globalAlpha = (1 - k) * 0.9; g.strokeStyle = f.col; g.shadowColor = f.col; g.shadowBlur = 20; g.lineWidth = 10 * (1 - k) + 2;
    g.beginPath(); g.ellipse(f.x, f.y, f.r * (0.5 + k * 0.5), f.r * 0.7 * (0.5 + k * 0.5), 0, 0, 7); g.stroke();
    g.fillStyle = hexA(f.col, 0.18 * (1 - k)); g.fill();
  } else if (f.k === "puff") { g.globalAlpha = 1 - k; for (let i = 0; i < 6; i++) { const a = i * 1.05; glowDot(g, f.x + Math.cos(a) * 30 * k, f.y - 30 + Math.sin(a) * 20 * k, 18 * (1 - k) + 4, f.col); } }
  else if (f.k === "land") { g.globalAlpha = 1 - k; g.strokeStyle = f.col; g.lineWidth = 6; g.beginPath(); g.ellipse(f.x, f.y + 10, 40 + k * 120, (40 + k * 120) * 0.4, 0, 0, 7); g.stroke(); }
  else if (f.k === "aura") { const u = f.u || f; g.globalAlpha = 1 - k; g.strokeStyle = f.col; g.lineWidth = 4; g.shadowColor = f.col; g.shadowBlur = 20; for (let i = 0; i < 3; i++) { const yy = u.y - k * 90 - i * 20; g.beginPath(); g.ellipse(u.x, yy, 40 - i * 6, 12, 0, 0, 7); g.stroke(); } }
  else if (f.k === "bolt" || f.k === "boltDown") {
    g.globalAlpha = 1 - k; g.strokeStyle = f.col; g.shadowColor = f.col; g.shadowBlur = 20; g.lineWidth = 4;
    const x1 = f.k === "boltDown" ? f.x + rnd(-20, 20) : f.x, y1 = f.k === "boltDown" ? f.y - 500 : f.y, x2 = f.k === "boltDown" ? f.x : f.x2, y2 = f.k === "boltDown" ? f.y : f.y2;
    g.beginPath(); g.moveTo(x1, y1); for (let i = 1; i < 8; i++) { const t = i / 8; g.lineTo(x1 + (x2 - x1) * t + rnd(-16, 16), y1 + (y2 - y1) * t + rnd(-16, 16)); } g.lineTo(x2, y2); g.stroke();
    if (f.k === "boltDown") { g.fillStyle = hexA(f.col, 0.3 * (1 - k)); g.beginPath(); g.ellipse(f.x, f.y, f.r, f.r * 0.7, 0, 0, 7); g.fill(); }
  } else if (f.k === "beam" || f.k === "beamTele") {
    g.translate(f.u ? f.u.x : f.x, f.u ? f.u.y - 14 : f.y); g.rotate(f.a);
    if (f.k === "beamTele") { g.fillStyle = hexA(f.col, 0.12 + k * 0.15); g.fillRect(0, -f.w / 2, f.len, f.w); g.strokeStyle = hexA(f.col, 0.6); g.lineWidth = 2; g.strokeRect(0, -f.w / 2, f.len, f.w); }
    else { g.globalAlpha = 1 - k; g.shadowColor = f.col; g.shadowBlur = 30; const gr = g.createLinearGradient(0, -f.w / 2, 0, f.w / 2); gr.addColorStop(0, hexA(f.col, 0)); gr.addColorStop(0.5, "#fff"); gr.addColorStop(1, hexA(f.col, 0)); g.fillStyle = gr; g.fillRect(0, -f.w / 2 * (1 - k * 0.5), f.len, f.w * (1 - k * 0.5)); }
  } else if (f.k === "death") {
    const DA = ASSETS.meta && ASSETS.meta[f.img] && ASSETS.meta[f.img].anim, dim = DA && DA.m.death && IMG[f.img + "_a_death"];
    if (dim && dim.naturalWidth) { // 11-16 3D 쓰러짐 동작 (마지막 30% 동안 사라짐)
      const n = DA.m.death, i = Math.min(n - 1, Math.floor(k * 1.25 * n)), H = f.r * 2.9, sc = H * DA.s * ((DA.ms && DA.ms.death) || 1);
      g.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3; g.translate(f.x, f.y + f.r * 0.6); if (f.flip) g.scale(-1, 1);
      g.drawImage(dim, i * DA.cw, 0, DA.cw, DA.ch, -DA.fx * sc, -DA.fy * sc, DA.cw * sc, DA.ch * sc);
    } else if (IMG[f.img] && IMG[f.img].naturalWidth) { const im = IMG[f.img]; g.globalAlpha = 1 - k; g.filter = "brightness(3) saturate(0)"; const h = f.r * 3 * (1 + k * 0.3), w = (h * im.naturalWidth) / im.naturalHeight; g.translate(f.x, f.y + f.r * 0.6 - k * 20); if (f.flip) g.scale(-1, 1); g.drawImage(im, -w / 2, -h, w, h); }
  }
  g.restore();
}
function drawDarkLow(g) {
  const p = G.p, R = 520 * (1 + (p.light || 0)) * 0.72, gr = g.createRadialGradient(p.x, p.y - 30, R * 0.35, p.x, p.y - 30, R);
  gr.addColorStop(0, "rgba(4,3,10,0)"); gr.addColorStop(1, "rgba(4,3,10,0.82)"); g.save(); g.fillStyle = gr; g.fillRect(0, 0, RW, RH); g.restore();
}
function drawLight(g, r) {
  const th0 = r.th || FLOORS[0], th = G.midnight ? Object.assign({}, th0, { light: "#7f9fff" }) : th0, p = G.p;
  const W2 = lightCv.width, H2 = lightCv.height, sc = W2 / RW;
  lctx.globalCompositeOperation = "source-over"; lctx.clearRect(0, 0, W2, H2);
  const dark = G.mode === "duel" ? 0.22 : curseOn("dark") ? 0.55 : roomLocked() ? 0.42 : 0.3;
  lctx.fillStyle = `rgba(4,3,10,${dark})`; lctx.fillRect(0, 0, W2, H2);
  lctx.globalCompositeOperation = "destination-out";
  const hole = (x, y, R, a = 1) => { const gr = lctx.createRadialGradient(x * sc, y * sc, 0, x * sc, y * sc, R * sc); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(0.55, `rgba(0,0,0,${a * 0.75})`); gr.addColorStop(1, "rgba(0,0,0,0)"); lctx.fillStyle = gr; lctx.beginPath(); lctx.arc(x * sc, y * sc, R * sc, 0, 7); lctx.fill(); };
  hole(p.x, p.y - 30, 520 * (1 + (p.light || 0)) * (curseOn("dark") ? 0.72 : 1) + Math.sin(G.time * 7) * 6, 1);
  for (const h of G.units) if (h.kind === "hero" && h !== p) hole(h.x, h.y - 30, h.team === 0 ? 420 : 330, 0.9);
  for (const l of r.lamps || []) hole(l.x, l.y + 40, 230 + Math.sin(G.time * 5 + l.ph) * 14, 0.85);
  for (const pr of G.projs) hole(pr.x, pr.y, 90, 0.6);
  for (const z of G.zones) hole(z.x, z.y, z.r * 1.1, 0.5);
  for (const t of G.tele) if (t.shape === "circle") hole(t.x, t.y, t.r, 0.45);
  for (const f of G.fx) if (f.k === "ring" || f.k === "boltDown" || f.k === "beam") hole(f.x, f.y, (f.r || 200) * 1.2, 0.6 * (1 - f.t / f.max));
  for (const h of r.haz) if (h.kind === "lava" || h.kind === "soul") hole(h.x, h.y, h.rx * 1.6, 0.7);
  for (const u of G.units) if (u.alive && (u.kind === "boss" || u.kind === "mob")) hole(u.x, u.y - 30, u.kind === "boss" ? 260 : 95, u.kind === "boss" ? 0.7 : 0.55);
  for (const d of G.drops) if (d.type !== "gold") hole(d.x, d.y, 110, 0.6);
  g.drawImage(lightCv, 0, 0, RW, RH);
  // 등불 빛 (더하기)
  g.save(); g.globalCompositeOperation = "lighter";
  for (const l of r.lamps || []) {
    const fl = 0.8 + Math.sin(G.time * 6 + l.ph) * 0.12 + Math.sin(G.time * 13 + l.ph * 2) * 0.06;
    const gr = g.createRadialGradient(l.x, l.y + 20, 2, l.x, l.y + 20, 160); gr.addColorStop(0, hexA(th.light, 0.35 * fl)); gr.addColorStop(1, hexA(th.light, 0)); g.fillStyle = gr; g.beginPath(); g.arc(l.x, l.y + 20, 160, 0, 7); g.fill();
  }
  const pg = g.createRadialGradient(p.x, p.y - 40, 2, p.x, p.y - 40, 220); pg.addColorStop(0, "rgba(255,190,110,0.16)"); pg.addColorStop(1, "rgba(255,190,110,0)"); g.fillStyle = pg; g.beginPath(); g.arc(p.x, p.y - 40, 220, 0, 7); g.fill();
  g.restore();
  drawLampBodies(g, r);
}
function drawLampBodies(g, r) {
  const th = r.th || FLOORS[0];
  // 등불 본체: Blender로 만든 3D 등롱 그림 (없으면 예전 방식)
  const ln = IMG["lantern_" + (r.th || FLOORS[0]).room];
  if (ln && ln.naturalWidth) { for (const l of r.lamps || []) { const sw = Math.sin(G.time * 1.6 + l.ph) * 0.05; g.save(); g.translate(l.x, l.y - 34); g.rotate(sw); const H = 72, W = H * ln.naturalWidth / ln.naturalHeight; g.drawImage(ln, -W / 2, 0, W, H); g.restore(); } }
  else for (const l of r.lamps || []) {
    const fl = 0.85 + Math.sin(G.time * 6 + l.ph) * 0.15;
    g.save(); g.translate(l.x, l.y); g.strokeStyle = "#2a1a10"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -30); g.lineTo(0, -14); g.stroke();
    g.shadowColor = th.light; g.shadowBlur = 25 * fl;
    const gr = g.createLinearGradient(0, -14, 0, 22); gr.addColorStop(0, shade("#c83a28", 0)); gr.addColorStop(0.5, hexA(th.light, 0.95)); gr.addColorStop(1, shade("#c83a28", -20));
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, 4, 13, 18, 0, 0, 7); g.fill();
    g.shadowBlur = 0; g.fillStyle = "#2a1a10"; g.fillRect(-8, -16, 16, 4); g.fillRect(-8, 20, 16, 4);
    g.restore();
  }
}
const emoCache = {};
// 11-20 캔버스 위 이모지도 그린 아이콘으로 (요괴 머리 위 상태·떠오르는 글자 앞 이모지·투사체)
function cvEmo(g, em, x, y, s) { const k = typeof EMO !== "undefined" && (EMO[em] || EMO[em + "\uFE0F"] || EMO[em.replace("\uFE0F", "")]), im = k && IMG[k]; if (im && im.naturalWidth) { const sc = s / Math.max(im.naturalWidth, im.naturalHeight); g.drawImage(im, x - im.naturalWidth * sc / 2, y - s * 0.78, im.naturalWidth * sc, im.naturalHeight * sc); return; } g.fillText(em, x, y); }
function emoImg(src) { if (!emoCache[src]) { const im = new Image(); im.src = src; emoCache[src] = im; } return emoCache[src]; }
function drawBanner(g, b) {
  const a = Math.min(1, b.t * 2, 1);
  g.save(); g.globalAlpha = a; g.textAlign = "center";
  const BY = camZoom() > 1 ? -150 : 0; g.translate(0, BY); // 11-17 확대 화면에선 주인공(가운데)을 가리지 않게 위로
  const gr = g.createLinearGradient(0, 300, 0, 440); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, "rgba(0,0,0,0.6)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 300, RW, 140);
  const [eic, btxt0] = typeof emoSplit === "function" ? emoSplit(b.text) : [null, b.text], btxt = typeof noEmo === "function" ? noEmo(btxt0) : btxt0;
  g.font = '64px "Do Hyeon", sans-serif'; const tw = g.measureText(btxt).width, ex = eic ? 40 : 0;
  if (eic) { const im = emoImg(eic); if (im && im.naturalWidth) { const S = 74, sc = S / Math.max(im.naturalWidth, im.naturalHeight); g.drawImage(im, RW / 2 - tw / 2 - ex - S * 0.55, 380 - 52, im.naturalWidth * sc, im.naturalHeight * sc); } }
  g.lineWidth = 6; g.strokeStyle = "#000"; g.strokeText(btxt, RW / 2 + ex * 0.5, 380); g.fillStyle = b.boss ? "#ff6a5a" : "#ffcf7a"; g.shadowColor = b.boss ? "#ff3b30" : "#ffb547"; g.shadowBlur = 24; g.fillText(btxt, RW / 2 + ex * 0.5, 380);
  g.shadowBlur = 0; g.font = '26px "Gowun Dodum", sans-serif'; g.fillStyle = "#e8e0f0"; const bsub = typeof noEmo === "function" ? noEmo(b.sub) : b.sub; g.strokeText(bsub, RW / 2, 420); g.fillText(bsub, RW / 2, 420);
  g.restore();
}

// ---------- 소리 (짧은 효과음) ----------
let AC = null, sfxVol = 0.35; const sfxLast = {};
// 진짜 효과음·보스 음성 (11-16): ASSETS.sfx / ASSETS.voice 를 처음 소리 낼 때 풀어 둠
const SFXBUF = {}; let sfxLoading = false;
function sfxLoad() { if (sfxLoading || !AC) return; sfxLoading = true; const all = Object.assign({}, ASSETS.sfx || {}); for (const k in all) fetch(all[k]).then((r) => r.arrayBuffer()).then((b) => AC.decodeAudioData(b)).then((buf) => { SFXBUF[k] = buf; }).catch(() => {}); }
function playBuf(k, vol, rate) { const b = SFXBUF[k]; if (!b || !AC) return false; const s = AC.createBufferSource(), g = AC.createGain(); s.buffer = b; if (rate) s.playbackRate.value = rate; g.gain.value = vol; s.connect(g).connect(AC.destination); s.start(); return s; }
function voice(k) { // 멈출 수 있는 손잡이를 돌려줌 (스토리 창을 넘기면 멈춤). 아직 안 풀렸으면 그 파일만 바로 풀어서 틈
  const h = { stop() { h.off = true; if (h.src) try { h.src.stop(); } catch (e) {} } };
  if (!AC || sfxVol <= 0 || (SAVE && SAVE.settings.voice === false)) return h; sfxLoad(); const vol = Math.min(1, sfxVol * 1.6);
  const hook = () => { if (h.src) h.src.onended = () => { h.done = true; if (h.onend) h.onend(); }; else { h.done = true; if (h.onend) h.onend(); } }; // 11-19 이야기 자동 넘김용: 끝나면 알림
  if (SFXBUF[k]) { h.src = playBuf(k, vol); hook(); }
  else if (ASSETS.voice && ASSETS.voice[k]) fetch(ASSETS.voice[k]).then((r) => r.arrayBuffer()).then((b) => AC.decodeAudioData(b)).then((buf) => { SFXBUF[k] = buf; if (!h.off) { h.src = playBuf(k, vol); hook(); } }).catch(() => { h.done = true; if (h.onend) h.onend(); });
  else h.done = true;
  return h;
}
// 무기마다 다른 소리: 활·총·던지기·주술 / 칼·큰 무기·주먹
const SFX_W = { archer: "shot_arrow", danbi: "shot_arrow", haemosu: "shot_arrow", gunner: "shot_gun", namu: "shot_throw", monk: "punch", berserker: "slash_heavy", dolsoe: "slash_heavy", spear: "slash_heavy", thunder: "slash_heavy", cheonrang: "slash_heavy", reaper: "slash_heavy", eulji: "slash_heavy", hwarang: "slash_heavy" };
function wSfx(u, base) { const k = u && u.kind === "hero" && SFX_W[u.id]; if (base === "shot") return k && k.startsWith("shot") ? k : "shot_magic"; return k && !k.startsWith("shot") ? k : "slash"; }
function sfx(kind) {
  if (!AC || sfxVol <= 0) return; sfxLoad(); const now = AC.currentTime; if (sfxLast[kind] && now - sfxLast[kind] < (kind === "hit" ? 0.06 : 0.05)) return; sfxLast[kind] = now;
  if (playBuf(kind, sfxVol * (kind === "hit" ? 0.55 : 0.9), 0.93 + Math.random() * 0.14)) return; // 11-18 같은 소리 반복감 줄이기
  if (kind.startsWith("shot")) kind = "shot"; else if (kind === "slash_heavy" || kind === "punch") kind = "slash";
  const P = { shot: [520, 260, 0.08, "triangle", 0.25], slash: [300, 120, 0.1, "sawtooth", 0.18], dash: [200, 500, 0.12, "sine", 0.2], blink: [800, 300, 0.15, "sine", 0.18], boom: [120, 40, 0.3, "sawtooth", 0.3], zone: [400, 600, 0.2, "sine", 0.15], buff: [500, 900, 0.25, "triangle", 0.2], heal: [600, 1000, 0.3, "sine", 0.2], zap: [1200, 200, 0.15, "square", 0.12], hurt: [180, 90, 0.15, "square", 0.22], coin: [900, 1400, 0.08, "triangle", 0.18], level: [500, 1200, 0.5, "triangle", 0.25], pick: [700, 1100, 0.15, "triangle", 0.2], chest: [300, 800, 0.3, "triangle", 0.25], door: [150, 90, 0.25, "sine", 0.25], clear: [600, 900, 0.4, "triangle", 0.2], dead: [300, 60, 0.8, "sawtooth", 0.3] }[kind];
  if (!P) return;
  const o = AC.createOscillator(), gn = AC.createGain(); o.type = P[3]; o.frequency.setValueAtTime(P[0], now); o.frequency.exponentialRampToValueAtTime(Math.max(30, P[1]), now + P[2]);
  gn.gain.setValueAtTime(P[4] * sfxVol, now); gn.gain.exponentialRampToValueAtTime(0.001, now + P[2]); o.connect(gn).connect(AC.destination); o.start(now); o.stop(now + P[2] + 0.02);
}

// ---------- 입력 ----------
// 조작: 기본 WASD 이동, 왼쪽 클릭 공격(커서 조준), 오른쪽·Q·E·R 스킬(1~4 보조), Space 구르기, F 액티브, Esc 멈춤. 설정에서 키를 바꿀 수 있음 (사용자 요청 11-10)
// 11-16: 상업 게임(Hades·Diablo IV·Lost Ark) 비교 → WASD 옆 키로 스킬, Space 는 구르기(장르 표준), 1~4 는 보조 키로 그대로
const DEFAULT_KEYS = { up: "KeyW", down: "KeyS", left: "KeyA", right: "KeyD", atk: "Mouse0", atk2: "ShiftLeft", target: "Tab", s1: "Mouse2", s2: "KeyQ", s3: "KeyE", s4: "KeyR", s1b: "Digit1", s2b: "Digit2", s3b: "Digit3", s4b: "Digit4", dodge: "Space", act: "KeyF", lock: "KeyL", pause: "Escape" };
const KEY_ACTIONS = [["up", "위로 이동"], ["down", "아래로 이동"], ["left", "왼쪽 이동"], ["right", "오른쪽 이동"], ["atk", "기본 공격"], ["atk2", "기본 공격 (보조키)"], ["s1", "스킬 1"], ["s2", "스킬 2"], ["s3", "스킬 3"], ["s4", "스킬 4 (궁극기)"], ["s1b", "스킬 1 (보조키)"], ["s2b", "스킬 2 (보조키)"], ["s3b", "스킬 3 (보조키)"], ["s4b", "스킬 4 (보조키)"], ["dodge", "구르기 (회피)"], ["act", "액티브"], ["lock", "액티브 잠금 / 풀기"], ["target", "대상 고정 (타겟팅)"], ["pause", "멈춤 메뉴"]];
const keyMap = () => { const sv = (typeof SAVE !== "undefined" && SAVE && SAVE.settings && SAVE.settings.keys) || {}, k = Object.assign({}, DEFAULT_KEYS, sv);
  if (sv.act && !sv.dodge && k.dodge === sv.act) k.dodge = "KeyV"; // 예전 저장 키와 겹치면 구르기는 V
  for (const s of ["s1", "s2", "s3", "s4"]) if (sv[s] && !sv[s + "b"] && k[s + "b"] === sv[s]) k[s + "b"] = null;
  for (const s of ["s1", "s2", "s3", "s4", "act", "dodge"]) for (const t of ["s1b", "s2b", "s3b", "s4b"]) if (s !== t && k[t] && k[s] === k[t] && sv[s]) k[t] = null;
  return k; };
function keyLabel(code) {
  if (!code) return "-";
  const M = { Mouse0: "좌클릭", Mouse1: "휠 클릭", Mouse2: "우클릭", Space: "Space", Escape: "Esc", ShiftLeft: "왼 Shift", ShiftRight: "오른 Shift", ControlLeft: "왼 Ctrl", ControlRight: "오른 Ctrl", AltLeft: "왼 Alt", AltRight: "오른 Alt", Tab: "Tab", Enter: "Enter", Backspace: "Backspace", ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→", CapsLock: "CapsLock" };
  if (M[code]) return M[code];
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) return "숫자판 " + code.slice(6);
  return code;
}
const SLOT_OF = { s1: "Q", s2: "W", s3: "E", s4: "R", s1b: "Q", s2b: "W", s3b: "E", s4b: "R", act: "A", dodge: "D" };
// 왼쪽·오른쪽 Shift·Ctrl·Alt 는 같은 키로 (Shift 안 눌리는 버그 수정, 11-10)
const normKey = (c) => (/^(Shift|Control|Alt|Meta)Right$/.test(c) ? c.replace("Right", "Left") : c);
function bindInput() {
  cv.addEventListener("contextmenu", (e) => e.preventDefault());
  const press = (code, down) => {
    code = normKey(code); const K = keyMap();
    for (const act of ["up", "down", "left", "right"]) if (K[act] === code) { input.keys[act] = down; syncMove(); }
    if (K.atk === code || K.atk2 === code) { input.atkHeld = down; if (down && G && !G.paused && !NET.client && G.p.cd.B <= 0 && G.p.alive && !G.p.dash) basicAttack(G.p); }
  };
  cv.addEventListener("pointerdown", (e) => {
    if (!G || G.paused) return;
    input.touch = e.pointerType === "touch";
    const w = toWorld(e.clientX, e.clientY); input.mx = w.x; input.my = w.y;
    if (input.touch) { if (!pickTargetAt(w) && !document.getElementById("joy")) { input.moveHeld = true; setMove(w); } e.preventDefault(); return; } // 폰: 적을 누르면 대상 고정, 이동은 가상 패드
    input.mouseT = performance.now();
    const code = "Mouse" + e.button, K = keyMap();
    press(code, true);
    const sl = Object.keys(SLOT_OF).find((x) => K[x] === code); if (sl) { if (!startAim(SLOT_OF[sl])) useSlot(SLOT_OF[sl]); }
    if (input.aim && code === "Mouse0" && !(sl && SLOT_OF[sl] === input.aim.slot)) { finishAim(); e.preventDefault(); return; }
    if (input.aim && code === "Mouse2" && K.target !== "Mouse2" && !sl) { finishAim(true); e.preventDefault(); return; }
    if (K.pause === code) UI.togglePause();
    if (code === "Mouse2" && K.target !== "Mouse2" && !sl) { if (!pickTargetAt(w)) G.target = null; }
    if (K.target === code) cycleTarget();
    e.preventDefault();
  });
  window.addEventListener("pointermove", (e) => { if (!G) return; const w = toWorld(e.clientX, e.clientY); input.mx = w.x; input.my = w.y; if (e.pointerType === "mouse") { input.sx = e.clientX; input.sy = e.clientY; } if (e.pointerType === "mouse") input.mouseT = performance.now(); if (input.moveHeld && input.touch && !G.paused) setMove(w); });
  window.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") { input.moveHeld = false; return; } press("Mouse" + e.button, false);
    const K = keyMap(), sl = Object.keys(SLOT_OF).find((x) => K[x] === "Mouse" + e.button); if (sl && input.aim && input.aim.slot === SLOT_OF[sl]) finishAim(); });
  window.addEventListener("blur", () => { input.aim = null; input.atkHeld = false; input.moveHeld = false; input.keys = {}; input.kx = input.ky = 0; });
  const ARROW = { ArrowUp: "aUp", ArrowDown: "aDown", ArrowLeft: "aLeft", ArrowRight: "aRight" };
  function syncMove() { const k = input.keys; input.kx = (k.right || k.aRight ? 1 : 0) - (k.left || k.aLeft ? 1 : 0); input.ky = (k.down || k.aDown ? 1 : 0) - (k.up || k.aUp ? 1 : 0); }
  const arrowSet = (code, down) => { if (!ARROW[code]) return; input.keys[ARROW[code]] = down; syncMove(); };
  window.addEventListener("keyup", (e) => { if (UI.capturing) return; press(e.code, false); arrowSet(e.code, false);
    const K = keyMap(), code = normKey(e.code), sl = Object.keys(SLOT_OF).find((x) => K[x] === code); if (sl && input.aim && input.aim.slot === SLOT_OF[sl]) finishAim(); });
  // 브라우저 밖으로 포커스가 나갔다 오면 눌린 키 정리 (Windows 고정 키 창 등)
  document.addEventListener("visibilitychange", () => { input.keys = {}; input.kx = input.ky = 0; input.atkHeld = false; });
  window.addEventListener("keydown", (e) => {
    if (UI.capturing || !G || UI.typing()) return;
    const K = keyMap(), code = normKey(e.code);
    if (input.aim && e.code === "Escape") { e.preventDefault(); finishAim(true); return; }
    if (e.code === "KeyM" && !Object.values(K).includes("KeyM")) { e.preventDefault(); if (UI._mapClose && UI.modalOpen() && $("#bigmap")) UI._mapClose(); else UI.bigMap(); return; }
    if (K.pause === code || (e.code === "Escape" && !Object.values(K).includes("Escape"))) { e.preventDefault(); UI.togglePause(); return; }
    if (Object.values(K).includes(code) || ARROW[e.code]) e.preventDefault();
    if (e.repeat) return;
    press(e.code, true); arrowSet(e.code, true); // 방향키는 언제나 이동으로도 쓸 수 있음
    if (G.paused || UI.modalOpen()) return;
    const sl = Object.keys(SLOT_OF).find((x) => K[x] === code); if (sl) { if (!startAim(SLOT_OF[sl])) useSlot(SLOT_OF[sl]); }
    if (K.target === code) { e.preventDefault(); cycleTarget(); }
    if (K.lock === code) { e.preventDefault(); if (NET.client) NET.send({ t: "lock", on: !G.p.actLock }); toggleActLock(G.p); }
  });
}
// 대상 고르기: 다음으로 가까운 적 / 지정한 자리 근처의 적
function cycleTarget() {
  if (!G || G.client) return; const p = G.p, foes = foesOf(p.team).sort((a, b) => dist(p, a) - dist(p, b)).slice(0, 6);
  if (!foes.length) { G.target = null; return; }
  const i = foes.indexOf(G.target); G.target = foes[(i + 1) % foes.length]; sfx("pick");
}
function pickTargetAt(w) { const foes = foesOf(G.p.team); let best = null, bd = 90; for (const f of foes) { const d = Math.hypot(f.x - w.x, f.y - 30 - w.y); if (d < bd + f.r) { bd = d; best = f; } } G.target = best; if (best) sfx("pick"); return !!best; }
function useSlot(s) { if (!G || G.paused) return; if (NET.client) { NET.sendKey(s, s === "D" && (input.kx || input.ky) ? { x: G.p.x + input.kx * 100, y: G.p.y + input.ky * 100 } : undefined); return; } if (!useSkill(G.p, s)) UI.flashSlot(s); }
function setMove(w) { if (NET.client) { input.tx = w.x; input.ty = w.y; input.tseq = (input.tseq || 0) + 1; return; } const p = G.p; if (!p.alive || p.stunT > 0) return; p.tx = clamp(w.x, 0, RW); p.ty = clamp(w.y, 0, RH); }

// ---------- 게임패드 (11-16) ----------
const PAD_MAP = { 0: "B", 1: "D", 2: "Q", 3: "W", 5: "E", 7: "R", 4: "A" };
const PAD_NAME = { B: "A", D: "B", Q: "X", W: "Y", E: "RB", R: "RT", A: "LB" };
const pad = { prev: [], on: false, aimT: 0, navT: 0, nav: null };
function padLabels(on) {
  document.querySelectorAll(".skills .sk[data-s] .key").forEach((el) => { const s = el.parentNode.dataset.s; if (on) { if (el.dataset.kb == null) el.dataset.kb = el.textContent; el.textContent = PAD_NAME[s] || el.textContent; } else if (el.dataset.kb != null) el.textContent = el.dataset.kb; });
}
function padUse(on) {
  if (pad.on === on) return; pad.on = on; padLabels(on);
  if (!on && pad.nav) { pad.nav.classList.remove("padfocus"); pad.nav = null; }
}
window.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" && pad.on && (Math.abs(e.movementX) + Math.abs(e.movementY) > 2)) padUse(false); });
window.addEventListener("keydown", () => { if (pad.on) padUse(false); });
function padNavList() {
  const root = UI.modalOpen() ? document.getElementById("modal") : document.body;
  return [...root.querySelectorAll("button, .btn, [data-j], [data-c], [data-k], input[type=checkbox], select")].filter((el) => {
    if (el.disabled) return false; const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return t && (t === el || el.contains(t) || t.contains(el));
  });
}
function padNavMove(dx, dy) {
  const list = padNavList(); if (!list.length) return;
  if (!pad.nav || !list.includes(pad.nav)) { pad.nav && pad.nav.classList.remove("padfocus"); pad.nav = list[0]; pad.nav.classList.add("padfocus"); pad.nav.scrollIntoView({ block: "nearest" }); return; }
  const a = pad.nav.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2; let best = null, bs = 1e9;
  for (const el of list) { if (el === pad.nav) continue; const r = el.getBoundingClientRect(), vx = r.left + r.width / 2 - ax, vy = r.top + r.height / 2 - ay, along = vx * dx + vy * dy; if (along <= 4) continue; const side = Math.abs(vx * dy - vy * dx), sc = along + side * 2.5; if (sc < bs) { bs = sc; best = el; } }
  if (best) { pad.nav.classList.remove("padfocus"); pad.nav = best; best.classList.add("padfocus"); best.scrollIntoView({ block: "nearest" }); sfx("pick"); }
}
function padBack() {
  if (UI.modalOpen()) { const b = [...document.querySelectorAll("#modal button")].find((x) => /닫기|돌아가|취소|뒤로|계속하기|확인/.test(x.textContent)); if (b) { b.click(); return; } }
  if (G && G.paused && !UI.modalOpen() && G.p && G.p.alive && !G.over) { UI.togglePause(); return; }
  const back = [...document.querySelectorAll("button, .btn")].find((x) => x.offsetParent && /^\s*(←|뒤로|돌아가기|메뉴로)/.test(x.textContent)); if (back) back.click();
}
function pollPad() {
  const gps = navigator.getGamepads ? navigator.getGamepads() : []; let gp = null;
  for (const g of gps) if (g && g.connected) { gp = g; break; }
  if (!gp) return;
  const bt = gp.buttons.map((b) => b.pressed || b.value > 0.5), ax = gp.axes, dz = (v) => (Math.abs(v) < 0.22 ? 0 : v);
  const down = (i) => bt[i] && !pad.prev[i], up = (i) => !bt[i] && pad.prev[i];
  let lx = dz(ax[0] || 0), ly = dz(ax[1] || 0); if (bt[14]) lx = -1; if (bt[15]) lx = 1; if (bt[12]) ly = -1; if (bt[13]) ly = 1;
  const rx = dz(ax[2] || 0), ry = dz(ax[3] || 0), any = bt.some((b) => b) || lx || ly || rx || ry;
  if (any) padUse(true);
  if (!pad.on) { pad.prev = bt; return; }
  const playing = G && G.p && !G.paused && !UI.modalOpen() && !UI.capturing;
  if (down(9)) UI.togglePause();
  if (playing) {
    if (pad.nav) { pad.nav.classList.remove("padfocus"); pad.nav = null; }
    if (document.querySelector(".skills .sk[data-s] .key:not([data-kb])")) padLabels(true); // 판마다 새로 그린 칸도 패드 글자로
    input.kx = lx; input.ky = ly; pad.moving = !!(lx || ly);
    const p = G.p, now = performance.now();
    if (rx || ry) { const L = Math.hypot(rx, ry); input.mx = p.x + (rx / L) * 320; input.my = p.y + (ry / L) * 320; input.mouseT = now; pad.aimT = now; }
    else if (now - pad.aimT > 400) { input.mouseT = -1e9; if (input.aim) { const ap = aimPoint(p); input.mx = ap.x; input.my = ap.y; } }
    if (bt[0] !== !!pad.prev[0]) { input.atkHeld = bt[0]; if (bt[0] && !NET.client && p.cd.B <= 0 && p.alive && !p.dash) basicAttack(p); }
    for (const i in PAD_MAP) { const s = PAD_MAP[i]; if (s === "B") continue; if (down(+i)) { if (s === "D" || !startAim(s)) useSlot(s); } else if (up(+i) && input.aim && input.aim.slot === s) finishAim(); }
    if (down(6)) cycleTarget();
    if (down(10)) { if (NET.client) NET.send({ t: "lock", on: !p.actLock }); toggleActLock(p); }
    if (down(8)) UI.bigMap();
  } else {
    if (pad.moving) { input.kx = input.ky = 0; pad.moving = false; input.atkHeld = false; }
    const now = performance.now(), nx = Math.abs(lx) > 0.5 ? Math.sign(lx) : 0, ny = Math.abs(ly) > 0.5 ? Math.sign(ly) : 0;
    if ((nx || ny) && now > pad.navT) { padNavMove(nx, ny); pad.navT = now + (pad.held ? 140 : 320); pad.held = true; } else if (!nx && !ny) pad.held = false;
    if (down(0)) { const list = padNavList(); if (pad.nav && list.includes(pad.nav)) { if (pad.nav.matches("input[type=checkbox]")) { pad.nav.checked = !pad.nav.checked; pad.nav.dispatchEvent(new Event("change")); } else pad.nav.click(); } else padNavMove(0, 1); }
    if (down(1)) padBack();
    if (down(8) && UI._mapClose && $("#bigmap")) UI._mapClose();
  }
  pad.prev = bt;
}
window.addEventListener("gamepadconnected", () => { try { UI.toast("🎮 게임패드 연결됨 · A 공격 · B 구르기 · X/Y/RB/RT 스킬 · LB 액티브", 3500); } catch (e) { } });
(() => { const st = document.createElement("style"); st.textContent = ".padfocus{outline:3px solid #ffd27a!important;outline-offset:2px;box-shadow:0 0 14px #ffb547!important}"; document.head.appendChild(st); })();

let lastT = 0;
// 자동 화질 (11-14 사용자: 모바일에서 렉이 살짝씩) — 판 도중 4초 동안 한 장 평균이 22ms(약 45fps 아래)를 넘으면 해상도를 한 단계 낮춘다
const perfWin = { n: 0, sum: 0, t0: 0 };
function perfWatch(ms) {
  if (!G || G.paused || document.hidden || ms > 250 || (SAVE && SAVE.settings && SAVE.settings.fps30)) return; // 절전 모드는 일부러 느리게 그리므로 자동 낮춤 안 함
  perfWin.n++; perfWin.sum += ms; if (!perfWin.t0) perfWin.t0 = performance.now();
  if (performance.now() - perfWin.t0 < 4000) return;
  const avg = perfWin.sum / perfWin.n; perfWin.n = perfWin.sum = perfWin.t0 = 0;
  const cur = view && view.dpr ? view.dpr : 1;
  if (avg > 24 && cur <= 1 && GLR.ok && !GLR.auto) { GLR.auto = true; GLR.ok = false; GLR.cv.style.display = "none"; cv.style.opacity = ""; if (G.p) addText(G.p.x, G.p.y - 130, "⚙️ 부드럽게 하려고 고급 그래픽을 껐어요", "#9fe8ff", 18); return; } // 11-17 하이엔드가 버거운 기기
  if (avg > 22 && cur > 1) { autoDpr = cur > 1.5 ? 1.5 : 1; resize(); if (G.p) addText(G.p.x, G.p.y - 130, "⚙️ 부드럽게 하려고 화질을 조금 낮췄어요", "#9fe8ff", 18); }
}
document.addEventListener("visibilitychange", () => {
  const a = document.getElementById("bgm");
  try {
    if (document.hidden) { if (a && !a.paused) { a.pause(); a._bgPaused = true; } if (typeof AC !== "undefined" && AC && AC.state === "running") AC.suspend(); }
    else { if (a && a._bgPaused) { a._bgPaused = false; if (SAVE && SAVE.settings && SAVE.settings.music) a.play().catch(() => { }); } if (typeof AC !== "undefined" && AC && AC.state === "suspended") AC.resume(); }
  } catch (e) { }
});
window.addEventListener("pagehide", () => { const a = document.getElementById("bgm"); if (a) { a.pause(); a._bgPaused = true; } });
document.addEventListener("visibilitychange", () => { try { if (document.hidden && G && !G.over && !(G.opt && G.opt.multi) && !G.client && !UI.modalOpen() && !/autotest/.test(location.hash)) UI.togglePause(); } catch (e) { } }); // 11-19 앱을 내리면 멈춤 창 (돌아왔을 때 바로 맞지 않게)
function loop(t) {
  if (SAVE && SAVE.settings && SAVE.settings.fps30 && t - lastT < 30) { requestAnimationFrame(loop); return; } // 11-19 절전 모드
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016); perfWatch(t - lastT); lastT = t;
  try { pollPad(); } catch (e) { }
  const ff = window._ff || 1; // 11-19 시험 봇 빨리 감기 (주소 #autotest...&ff=3 일 때만)
  try { for (let i = 0; i < ff; i++) { update(dt); NET.hostTick(dt); } render(); UI.hud(); } catch (err) { console.error(err); UI.error && UI.error(err); }
  requestAnimationFrame(loop);
}
// 다른 창으로 가면 브라우저가 화면 그리기를 멈추므로, 멀티일 때는 워커 시계로 게임을 계속 돌림
let bgWorker = null, bgLast = 0;
function bgTick() {
  if (!document.hidden || !G || !(G.opt && G.opt.multi) && !G.client) return;
  const now = performance.now(), dt = Math.min(0.1, (now - bgLast) / 1000 || 0.03); bgLast = now;
  try { let left = dt; while (left > 0) { const st = Math.min(0.05, left); update(st); NET.hostTick(st); left -= st; } } catch (e) { console.error(e); }
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { if (!bgWorker) { try { bgWorker = new Worker(URL.createObjectURL(new Blob(["setInterval(()=>postMessage(0),33)"], { type: "text/javascript" }))); bgWorker.onmessage = bgTick; } catch (e) { setInterval(bgTick, 33); } } bgLast = performance.now(); }
  else lastT = performance.now();
});
function initEngine() {
  cv = document.getElementById("game"); ctx = cv.getContext("2d");
  lightCv = document.createElement("canvas"); lightCv.width = 800; lightCv.height = 450; lctx = lightCv.getContext("2d");
  resize(); window.addEventListener("resize", resize);
  bindInput(); requestAnimationFrame(loop);
}

// 11-17 하이엔드: 층마다 공기 중 입자 (먼지·눈·불씨·포자·혼불) — 화면 안에서만, 시간으로 위치를 정해 상태 저장 없음
const ATMO = { f1: { n: 46, col: [255, 226, 170], sz: 1.6, vy: -6, vx: 4, a: 0.35, glow: 0 }, f2: { n: 70, col: [225, 240, 255], sz: 2.2, vy: 22, vx: -6, a: 0.55, glow: 0 },
  f3: { n: 60, col: [255, 150, 60], sz: 1.8, vy: -38, vx: 6, a: 0.85, glow: 1 }, f4: { n: 44, col: [170, 255, 140], sz: 2.4, vy: -8, vx: 3, a: 0.5, glow: 1 }, f5: { n: 36, col: [190, 150, 255], sz: 3.0, vy: -14, vx: 0, a: 0.6, glow: 1 } };
function drawAtmo(g, r) {
  const A = ATMO[(r.th || FLOORS[0]).room]; if (!A || view.x0 == null) return; const t = G.time || 0, W = view.x1 - view.x0, H = view.y1 - view.y0;
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < A.n; i++) { const h1 = Math.sin(i * 127.1) * 43758.5453 % 1, h2 = Math.sin(i * 311.7) * 24634.6345 % 1, h3 = Math.sin(i * 74.7) * 9631.123 % 1;
    const sp = 0.6 + Math.abs(h3) * 0.8, x = view.x0 + (((Math.abs(h1) * W + t * A.vx * sp + Math.sin(t * 0.7 + i) * 18) % W) + W) % W, y = view.y0 + (((Math.abs(h2) * H + t * A.vy * sp) % H) + H) % H;
    const tw = 0.55 + 0.45 * Math.sin(t * (1.5 + Math.abs(h3) * 2) + i), s2 = A.sz * (0.6 + Math.abs(h3)), al = A.a * tw;
    if (A.glow) { const gr = g.createRadialGradient(x, y, 0, x, y, s2 * 5); gr.addColorStop(0, `rgba(${A.col[0]},${A.col[1]},${A.col[2]},${al * 0.5})`); gr.addColorStop(1, `rgba(${A.col[0]},${A.col[1]},${A.col[2]},0)`); g.fillStyle = gr; g.fillRect(x - s2 * 5, y - s2 * 5, s2 * 10, s2 * 10); }
    g.fillStyle = `rgba(${A.col[0]},${A.col[1]},${A.col[2]},${al})`; g.beginPath(); g.arc(x, y, s2, 0, 7); g.fill(); }
  g.restore();
}
// ======================================================================
// 하이엔드 그래픽 (11-17 사용자: "상업작에 비해 퀄리티가 너무 떨어져" → "무료중에 하이엔드 방식, 무조건 하이엔드")
// WebGL2 지연 조명 + HDR 후처리. 2D 캔버스 그림은 그대로 두고 세 겹으로 나눠 GPU 에서 합친다.
//  ① 바닥: 방 그림(albedo) + 노멀맵(Depth Anything V2 Small + 밝기 높이, tools/make_normals.py) → 등불·주인공·투사체·효과 빛이
//     돌 틈·조각 무늬를 따라 실제로 비추는 실시간 조명(디퓨즈 + 젖은 돌 반사광)
//  ② 캐릭터·소품 층: 같은 빛을 받음(평면), 어두운 곳에서도 보이게 최소 밝기
//  ③ 효과·글자 층: 빛을 받지 않고 스스로 빛남(블룸 대상)
//  → HDR(반정밀 부동소수) 버퍼 → 밝은 부분 추출·2단계 가우스 블러 블룸 → 하이라이트 롤오프 톤매핑 → 층별 색 보정·비네트·필름 그레인
// WebGL2 가 없거나 저사양 모드·설정 '고급 그래픽' 끔이면 예전 2D 그대로.
// ======================================================================
const GLR = { ok: null, gl: null, cv: null, a: null, b: null, tex: {}, fb: {}, prog: {}, roomKey: null, nKey: null, hasN: false, half: false, fail: 0 };
function glOn() {
  if (SAVE && SAVE.settings && (SAVE.settings.low || SAVE.settings.hq === false)) { if (GLR.cv) GLR.cv.style.display = "none"; if (cv) cv.style.opacity = ""; return false; }
  if (GLR.ok === null) glInit();
  if (!GLR.ok) return false;
  GLR.cv.style.display = ""; cv.style.opacity = "0"; return true;
}
function glInit() {
  GLR.ok = false;
  try {
    const c = document.createElement("canvas"); c.id = "gamegl"; c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;display:block;pointer-events:none;background:#07060a;";
    const gl = c.getContext("webgl2", { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
    if (!gl) return;
    GLR.half = !!gl.getExtension("EXT_color_buffer_float") || !!gl.getExtension("EXT_color_buffer_half_float");
    gl.getExtension("OES_texture_float_linear");
    cv.parentNode.insertBefore(c, cv); // 2D 캔버스(입력 받는 곳)는 위에 투명하게 남김
    GLR.cv = c; GLR.gl = gl;
    GLR.a = document.createElement("canvas").getContext("2d"); GLR.b = document.createElement("canvas").getContext("2d"); GLR.o = document.createElement("canvas").getContext("2d");
    const V = "#version 300 es\nin vec2 p; out vec2 uv; void main(){ uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }";
    const SCENE = `#version 300 es
precision highp float; in vec2 uv; out vec4 o;
uniform sampler2D tAlb, tNrm, tA, tB, tO; uniform int hasN; uniform ivec4 shI;
uniform vec2 scr; uniform vec3 vw; uniform vec2 room; uniform vec4 bnd;
uniform vec4 L[40]; uniform vec3 LC[40]; uniform int nL;
uniform vec3 amb; uniform float ambA, specK; uniform vec2 atex;
void main(){
  vec2 px = vec2(uv.x * scr.x, (1.0 - uv.y) * scr.y);
  vec2 w = (px - vw.yz) / vw.x;
  vec2 ruv = w / room;
  vec3 col = vec3(0.0);
  if (ruv.x >= 0.0 && ruv.y >= 0.0 && ruv.x <= 1.0 && ruv.y <= 1.0) {
    vec3 alb = texture(tAlb, ruv).rgb;
    bool inner = w.x > bnd.x && w.x < bnd.z && w.y > bnd.y && w.y < bnd.w;
    vec3 N = vec3(0.0, 0.0, 1.0); float hgt = 0.5;
    if (hasN == 1 && inner) { vec4 nn = texture(tNrm, ruv); N = normalize(nn.xyz * 2.0 - 1.0); hgt = nn.a; }
    { // 방 그림(벽·잔해·소품 포함) 밝기 기울기 → 잔 굴곡을 더함 (벽은 이것만)
      vec3 lw = vec3(0.299, 0.587, 0.114); float e = 1.5;
      float lx = dot(texture(tAlb, ruv + vec2(atex.x * e, 0.0)).rgb, lw) - dot(texture(tAlb, ruv - vec2(atex.x * e, 0.0)).rgb, lw);
      float ly = dot(texture(tAlb, ruv + vec2(0.0, atex.y * e)).rgb, lw) - dot(texture(tAlb, ruv - vec2(0.0, atex.y * e)).rgb, lw);
      float k = inner ? 1.2 : 2.6; N = normalize(N + vec3(-lx * k, -ly * k, 0.0)); }
    vec3 lit = amb * (0.85 + 0.3 * hgt); vec3 spec = vec3(0.0);
    for (int i = 0; i < 40; i++) { if (i >= nL) break;
      vec4 l = L[i]; vec2 d = l.xy - w; float dist = length(d); if (dist > l.z) continue;
      float att = 1.0 - dist / l.z; att *= att;
      if (i == shI.x || i == shI.y || i == shI.z || i == shI.w) { // 실시간 그림자: 빛 쪽으로 걸어가며 영웅·소품 실루엣에 막히는지
        vec2 dir = d / max(dist, 1.0); float reach = min(dist - 30.0, 150.0); float occ = 0.0;
        for (int k = 1; k <= 10; k++) { float t = float(k) / 10.0 * reach; if (t <= 0.0) break; vec2 ws = w + dir * t; vec2 sp = ws * vw.x + vw.yz; vec2 su = vec2(sp.x / scr.x, 1.0 - sp.y / scr.y);
          float a = texture(tO, su).a; occ = max(occ, smoothstep(0.35, 0.8, a) * (1.0 - float(k) * 0.055)); }
        att *= 1.0 - occ * 0.82;
      }
      vec3 Lv = normalize(vec3(d, l.z * 0.32 + 40.0));
      float df = max(dot(N, Lv), 0.0);
      lit += LC[i] * l.w * att * (0.22 + 0.88 * df);
      vec3 H = normalize(Lv + vec3(0.0, 0.0, 1.0));
      spec += LC[i] * l.w * att * pow(max(dot(N, H), 0.0), 28.0) * specK * (0.4 + hgt);
    }
    col = alb * lit + spec * alb * 1.6;
  }
  vec4 a = texture(tA, uv);
  vec3 la = vec3(ambA);
  for (int i = 0; i < 40; i++) { if (i >= nL) break; vec4 l = L[i]; vec2 d = l.xy - w; float dist = length(d); if (dist > l.z) continue; float att = 1.0 - dist / l.z; la += LC[i] * l.w * att * att * 0.6; }
  la = min(la, vec3(1.4));
  vec3 rim = vec3(0.0);
  if (a.a > 0.05) for (int j = 0; j < 4; j++) { int i = j == 0 ? shI.x : j == 1 ? shI.y : j == 2 ? shI.z : shI.w; if (i < 0 || i >= nL) continue;
    vec4 l = L[i]; vec2 d = l.xy - w; float dist = length(d); if (dist > l.z * 1.3) continue; float att = 1.0 - dist / (l.z * 1.3); vec2 dl = d / max(dist, 1.0);
    float a2 = texture(tA, uv + vec2(dl.x, -dl.y) * vec2(3.5 / scr.x, 3.5 / scr.y)).a; rim += LC[i] * l.w * att * clamp(a.a - a2, 0.0, 1.0) * 0.8; }
  col = col * (1.0 - a.a) + a.rgb * la + rim * a.a;
  vec4 b = texture(tB, uv);
  col = col * (1.0 - b.a) + b.rgb;
  o = vec4(col, 1.0);
}`;
    const BRIGHT = `#version 300 es
precision highp float; in vec2 uv; out vec4 o; uniform sampler2D t; uniform vec2 px; uniform float thr;
void main(){ vec3 c = vec3(0.0);
  c += texture(t, uv + px * vec2(-1.0, -1.0)).rgb; c += texture(t, uv + px * vec2(1.0, -1.0)).rgb; c += texture(t, uv + px * vec2(-1.0, 1.0)).rgb; c += texture(t, uv + px * vec2(1.0, 1.0)).rgb; c *= 0.25;
  float l = max(max(c.r, c.g), c.b); float k = smoothstep(thr, thr + 0.35, l); o = vec4(c * k, 1.0); }`;
    const BLUR = `#version 300 es
precision highp float; in vec2 uv; out vec4 o; uniform sampler2D t; uniform vec2 dir;
void main(){ vec3 c = texture(t, uv).rgb * 0.2270270;
  c += texture(t, uv + dir * 1.3846154).rgb * 0.3162162; c += texture(t, uv - dir * 1.3846154).rgb * 0.3162162;
  c += texture(t, uv + dir * 3.2307692).rgb * 0.0702703; c += texture(t, uv - dir * 3.2307692).rgb * 0.0702703; o = vec4(c, 1.0); }`;
    const FINAL = `#version 300 es
precision highp float; in vec2 uv; out vec4 o; uniform sampler2D tS, tB1, tB2; uniform float bloom, time, vig, grain; uniform vec3 tintS, tintH; uniform vec2 scr; uniform vec4 WV[4]; uniform int nW; uniform float lowHp;
vec3 roll(vec3 c){ vec3 k = max(c - 0.78, 0.0); return min(c, 0.78) + k / (1.0 + k * 1.6); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 off = vec2(0.0); float ab = 0.0; vec2 pp = vec2(uv.x * scr.x, (1.0 - uv.y) * scr.y);
  for (int i = 0; i < 4; i++) { if (i >= nW) break; vec4 v = WV[i]; vec2 d = pp - v.xy; float dist = length(d); float wdt = v.z * 0.14 + 10.0; float band = exp(-pow((dist - v.z) / wdt, 2.0)); vec2 n = d / max(dist, 1.0); off += n * band * v.w; ab += band * v.w; }
  vec2 u2 = uv - vec2(off.x, -off.y) / scr; vec2 ca = vec2(off.x, -off.y) / scr * 0.35;
  vec3 c = vec3(texture(tS, u2 + ca).r, texture(tS, u2).g, texture(tS, u2 - ca).b) + (texture(tB1, u2).rgb * 0.75 + texture(tB2, u2).rgb * 0.55) * bloom;
  c += vec3(1.0, 0.85, 0.6) * min(ab, 20.0) * 0.004;
  c = roll(c);
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(c, c * tintS, (1.0 - smoothstep(0.0, 0.45, l)) * 0.35);
  c = mix(c, c * tintH, smoothstep(0.45, 1.0, l) * 0.25);
  c = mix(vec3(l), c, 1.08);
  c = (c - 0.5) * 1.04 + 0.5;
  vec2 q = uv - 0.5; q.x *= scr.x / scr.y; float v = 1.0 - smoothstep(0.42, 1.05, length(q)) * vig; c *= v;
  c = mix(c, vec3(0.55, 0.02, 0.02), smoothstep(0.38, 1.0, length(q)) * lowHp);
  c += (hash(uv * scr + fract(time) * 91.7) - 0.5) * grain;
  o = vec4(clamp(c, 0.0, 1.0), 1.0); }`;
    const mk = (fs) => {
      const pr = gl.createProgram();
      for (const [t, s] of [[gl.VERTEX_SHADER, V], [gl.FRAGMENT_SHADER, fs]]) { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); gl.attachShader(pr, sh); }
      gl.bindAttribLocation(pr, 0, "p"); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
      const u = {}; const n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const inf = gl.getActiveUniform(pr, i), nm = inf.name.replace(/\[0\]$/, ""); u[nm] = gl.getUniformLocation(pr, inf.name); }
      return { pr, u };
    };
    GLR.prog = { scene: mk(SCENE), bright: mk(BRIGHT), blur: mk(BLUR), final: mk(FINAL) };
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    for (const k of ["alb", "nrm", "a", "b", "occ"]) GLR.tex[k] = glTex(gl);
    c.addEventListener("webglcontextlost", (e) => { e.preventDefault(); GLR.ok = false; c.style.display = "none"; cv.style.opacity = ""; });
    GLR.ok = true;
  } catch (e) { console.warn("고급 그래픽 끔:", e && e.message); GLR.ok = false; if (GLR.cv) GLR.cv.remove(); }
}
function glTex(gl) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0])); return t;
}
function glFbo(name, w, h) {
  const gl = GLR.gl; let f = GLR.fb[name]; if (f && f.w === w && f.h === h) return f;
  if (f) { gl.deleteFramebuffer(f.fb); gl.deleteTexture(f.t); }
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  if (GLR.half) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null); else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE && GLR.half) { GLR.half = false; gl.deleteFramebuffer(fb); gl.deleteTexture(t); delete GLR.fb[name]; return glFbo(name, w, h); }
  return (GLR.fb[name] = { fb, t, w, h });
}
// 2D 층 캔버스를 화면 크기에 맞추고 비움
function glLayers() {
  const W = cv.width, H = cv.height;
  for (const g of [GLR.a, GLR.b]) { if (g.canvas.width !== W || g.canvas.height !== H) { g.canvas.width = W; g.canvas.height = H; } g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); }
  if (GLR.cv.width !== W || GLR.cv.height !== H) { GLR.cv.width = W; GLR.cv.height = H; }
  const o = GLR.o, ow = Math.max(1, W >> 2), oh = Math.max(1, H >> 2); if (o.canvas.width !== ow || o.canvas.height !== oh) { o.canvas.width = ow; o.canvas.height = oh; } o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, ow, oh);
}
// 그림자를 만드는 가림 그림: 같은 변환의 1/4 크기로 실루엣만
function occDraw(g, img, args) { const m = g.getTransform(), o = GLR.o; o.setTransform(m.a / 4, m.b / 4, m.c / 4, m.d / 4, m.e / 4, m.f / 4); o.globalAlpha = 1; o.drawImage(img, ...args); }
// flip: 2D 캔버스(위가 0)를 GL(아래가 0) 화면 좌표에 맞춤. 방 그림은 세계 좌표로 직접 읽어서 뒤집지 않음.
function glUp(t, src, premul, flip) {
  const gl = GLR.gl; gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premul); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, premul ? gl.BROWSER_DEFAULT_WEBGL : gl.NONE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
}
const _hx = {};
function hexRGB(c) {
  if (_hx[c]) return _hx[c]; let v = [1, 0.85, 0.6];
  if (typeof c === "string" && c[0] === "#") { const s = c.length === 4 ? c.slice(1).split("").map((x) => x + x).join("") : c.slice(1, 7), n = parseInt(s, 16); if (Number.isFinite(n)) v = [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  return (_hx[c] = v);
}
// 이 장면의 빛 목록 (예전 2D 어둠 구멍과 같은 곳 + 색)
function glLights(r) {
  const th0 = r.th || FLOORS[0], th = G.midnight ? Object.assign({}, th0, { light: "#7f9fff" }) : th0, p = G.p, out = [];
  const add = (x, y, R, I, col, sh) => { if (out.length < 40 && Number.isFinite(x) && Number.isFinite(y) && R > 0 && I > 0.01) out.push([x, y, R, I, col, sh || 0]); };
  const warm = [1, 0.78, 0.52], tl = hexRGB(th.light);
  add(p.x, p.y - 30, 560 * (1 + (p.light || 0)) * (curseOn("dark") ? 0.72 : 1) + Math.sin(G.time * 7) * 6, 0.82, warm);
  for (const h of G.units) if (h.kind === "hero" && h !== p && h.alive) add(h.x, h.y - 30, h.team === 0 ? 420 : 330, 0.75, h.team === 0 ? warm : [1, 0.45, 0.4]);
  for (const l of r.lamps || []) { const fl = 0.85 + Math.sin(G.time * 6 + l.ph) * 0.1 + Math.sin(G.time * 13 + l.ph * 2) * 0.05; add(l.x, l.y + 40, 300, 0.95 * fl, tl, 1); }
  for (const u of G.units) if (u.alive && u.kind === "boss") add(u.x, u.y - 30, 300, 0.6, u.ph2 ? [1, 0.3, 0.25] : [0.6, 0.45, 1]);
  for (const h of r.haz) if (h.kind === "lava" || h.kind === "soul") add(h.x, h.y, h.rx * 2.2, 0.8, h.kind === "lava" ? [1, 0.45, 0.15] : [0.7, 0.4, 1], 1);
  for (const f of G.fx) if (f.k === "ring" || f.k === "boltDown" || f.k === "beam" || f.k === "sig") add(f.x, f.y, (f.r || 200) * 1.3, 1.1 * (1 - f.t / f.max), hexRGB(f.col || "#fff0c0"));
  for (const f of G.fx) if (f.k === "death" && f.t < 0.35) add(f.x, f.y - 20, (f.r || 30) * 6 + 90, 0.9 * (1 - f.t / 0.35), [0.78, 0.65, 1]); // 쓰러질 때 순간 빛
  for (const t of G.tele) if (t.shape === "circle") add(t.x, t.y, t.r * 1.15, 0.45, [1, 0.35, 0.3]);
  for (const z of G.zones) add(z.x, z.y, (z.r || 120) * 1.3, 0.45, hexRGB(z.col || "#ff9a6a"));
  for (const pr of G.projs) add(pr.x, pr.y, 150, 0.55, hexRGB(pr.col || "#ffd8a0"));
  for (const d of G.drops) if (d.type !== "gold") add(d.x, d.y, 140, 0.5, d.type === "stairs" ? [0.5, 0.75, 1] : [1, 0.85, 0.5]);
  return out;
}
const GL_GRADE = { f1: [[0.86, 0.9, 1.08], [1.08, 1.0, 0.88]], f2: [[0.82, 0.92, 1.12], [1.0, 1.04, 1.08]], f3: [[0.95, 0.82, 0.86], [1.12, 0.98, 0.82]], f4: [[0.84, 0.98, 0.9], [1.04, 1.06, 0.88]], f5: [[0.9, 0.82, 1.1], [1.06, 0.94, 1.08]] };
const _LA = new Float32Array(160), _LC = new Float32Array(120);
function glRender(r, shx, shy) {
  const gl = GLR.gl, W = cv.width, H = cv.height, P = GLR.prog;
  // 방 그림·노멀맵 (방이 바뀌거나 다시 그려졌을 때만 올림)
  if (GLR.roomKey !== r.cache) { glUp(GLR.tex.alb, r.cache, false, false); GLR.roomKey = r.cache; }
  const th = r.th || FLOORS[0], nk = "room_" + th.room + "_" + r.bg + "_n", nim = IMG[nk];
  if (GLR.nKey !== nk || (!GLR.hasN && nim && nim.naturalWidth)) { GLR.hasN = !!(nim && nim.naturalWidth); if (GLR.hasN) glUp(GLR.tex.nrm, nim, false, false); GLR.nKey = nk; }
  glUp(GLR.tex.a, GLR.a.canvas, true, true); glUp(GLR.tex.b, GLR.b.canvas, true, true); glUp(GLR.tex.occ, GLR.o.canvas, true, true);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  const S = glFbo("scene", W, H), w2 = Math.max(1, W >> 2), h2 = Math.max(1, H >> 2), w3 = Math.max(1, W >> 3), h3 = Math.max(1, H >> 3);
  const B1 = glFbo("b1", w2, h2), B1t = glFbo("b1t", w2, h2), B2 = glFbo("b2", w3, h3), B2t = glFbo("b2t", w3, h3);
  const bindT = (u, unit, t) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(u, unit); };
  const draw = (f, w, h) => { gl.bindFramebuffer(gl.FRAMEBUFFER, f ? f.fb : null); gl.viewport(0, 0, w, h); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  // ① 장면 (바닥 조명 + 캐릭터 층 + 효과 층)
  const sc = P.scene; gl.useProgram(sc.pr);
  bindT(sc.u.tAlb, 0, GLR.tex.alb); bindT(sc.u.tNrm, 1, GLR.tex.nrm); bindT(sc.u.tA, 2, GLR.tex.a); bindT(sc.u.tB, 3, GLR.tex.b); bindT(sc.u.tO, 4, GLR.tex.occ);
  gl.uniform1i(sc.u.hasN, GLR.hasN ? 1 : 0); gl.uniform2f(sc.u.scr, W, H); gl.uniform3f(sc.u.vw, view.s, view.ox + shx * view.s, view.oy + shy * view.s);
  gl.uniform2f(sc.u.room, RW, RH); gl.uniform2f(sc.u.atex, 1 / r.cache.width, 1 / r.cache.height); gl.uniform4f(sc.u.bnd, BL - 4, BT - 4, BR + 4, BB + 4);
  const Ls = glLights(r); _LA.fill(0); _LC.fill(0);
  Ls.forEach((l, i) => { _LA[i * 4] = l[0]; _LA[i * 4 + 1] = l[1]; _LA[i * 4 + 2] = l[2]; _LA[i * 4 + 3] = l[3]; _LC[i * 3] = l[4][0]; _LC[i * 3 + 1] = l[4][1]; _LC[i * 3 + 2] = l[4][2]; });
  { const cx = (view.x0 + view.x1) / 2, cy = (view.y0 + view.y1) / 2, cand = Ls.map((l, i) => [i, l]).filter(([, l]) => l[5]).sort((a, b) => Math.hypot(a[1][0] - cx, a[1][1] - cy) - Math.hypot(b[1][0] - cx, b[1][1] - cy)).slice(0, 4).map(([i]) => i);
    while (cand.length < 4) cand.push(-1); gl.uniform4i(sc.u.shI, cand[0], cand[1], cand[2], cand[3]); } // 화면 가운데에 가까운 등불 4개만 그림자
  gl.uniform4fv(sc.u.L, _LA); gl.uniform3fv(sc.u.LC, _LC); gl.uniform1i(sc.u.nL, Ls.length);
  const dark = G.mode === "duel" ? 0.66 : curseOn("dark") ? 0.32 : roomLocked() ? 0.56 : 0.64, tl = hexRGB(th.light);
  gl.uniform3f(sc.u.amb, dark * (0.8 + tl[0] * 0.2), dark * (0.8 + tl[1] * 0.2), dark * (0.85 + tl[2] * 0.25));
  gl.uniform1f(sc.u.ambA, curseOn("dark") ? 0.55 : 0.8); gl.uniform1f(sc.u.specK, 0.55);
  draw(S, W, H);
  // ② 블룸 (1/4·1/8 해상도 가우스)
  const br = P.bright; gl.useProgram(br.pr); bindT(br.u.t, 0, S.t); gl.uniform2f(br.u.px, 1 / W, 1 / H); gl.uniform1f(br.u.thr, 0.9); draw(B1, w2, h2);
  const bl = P.blur; gl.useProgram(bl.pr);
  bindT(bl.u.t, 0, B1.t); gl.uniform2f(bl.u.dir, 1 / w2, 0); draw(B1t, w2, h2);
  bindT(bl.u.t, 0, B1t.t); gl.uniform2f(bl.u.dir, 0, 1 / h2); draw(B1, w2, h2);
  bindT(bl.u.t, 0, B1.t); gl.uniform2f(bl.u.dir, 1 / w3, 0); draw(B2t, w3, h3);
  bindT(bl.u.t, 0, B2t.t); gl.uniform2f(bl.u.dir, 0, 1 / h3); draw(B2, w3, h3);
  bindT(bl.u.t, 0, B2.t); gl.uniform2f(bl.u.dir, 2 / w3, 0); draw(B2t, w3, h3);
  bindT(bl.u.t, 0, B2t.t); gl.uniform2f(bl.u.dir, 0, 2 / h3); draw(B2, w3, h3);
  // ③ 마무리 (하이라이트 롤오프·층별 색 보정·비네트·그레인)
  const fi = P.final; gl.useProgram(fi.pr); bindT(fi.u.tS, 0, S.t); bindT(fi.u.tB1, 1, B1.t); bindT(fi.u.tB2, 2, B2.t);
  gl.uniform1f(fi.u.bloom, 0.7); gl.uniform1f(fi.u.time, G.time || 0); gl.uniform1f(fi.u.vig, 0.55); gl.uniform1f(fi.u.grain, 0.022); gl.uniform2f(fi.u.scr, W, H);
  const grade = GL_GRADE[th.room] || [[0.88, 0.9, 1.06], [1.06, 1.0, 0.9]];
  { const p = G.p, f = p && p.alive ? p.hp / p.maxHp : 1; gl.uniform1f(fi.u.lowHp, f < 0.3 ? (0.3 - f) / 0.3 * 0.55 * (0.65 + 0.35 * Math.sin((G.time || 0) * 7)) + 0.12 : 0); }
  gl.uniform3fv(fi.u.tintS, grade[0]); gl.uniform3fv(fi.u.tintH, grade[1]);
  { const WVa = new Float32Array(16); let n = 0; // 큰 기술·보스 내려찍기 → 화면이 일렁이는 충격파
    for (const f of G.fx) { if (n >= 4) break; if (!(f.k === "ring" || f.k === "boltDown" || f.k === "sig") || (f.r || 0) < 140 || !f.max) continue; const k = clamp(f.t / f.max, 0, 1);
      const sx2 = f.x * view.s + view.ox + shx * view.s, sy2 = f.y * view.s + view.oy + shy * view.s, R = (f.r || 200) * (0.25 + 0.95 * k) * view.s;
      WVa.set([sx2, sy2, R, (1 - k) * 12 * (SAVE && SAVE.settings.shake === false ? 0.4 : 1) * view.dpr], n * 4); n++; }
    gl.uniform4fv(fi.u.WV, WVa); gl.uniform1i(fi.u.nW, n); }
  draw(null, W, H);
}

// 11-18 괴이한 방: 떠도는 혼불(도깨비불) — 위아래로 일렁이고 둘레에 작은 불씨가 돈다. 효과 층에 그려 블룸으로 빛남
function drawEvt(g, d) {
  const E = (typeof EVENTS !== "undefined" && EVENTS[d.k]) || { ic: "❔", name: "괴이한 기운" }, t = G.time, y = d.y - 66 + Math.sin(t * 2.2) * 8, a = d.used ? 0.25 : 1;
  g.save(); g.globalAlpha = a; g.globalCompositeOperation = "lighter";
  const R = 58 + Math.sin(t * 3.1) * 6, gr = g.createRadialGradient(d.x, y, 2, d.x, y, R);
  gr.addColorStop(0, "rgba(220,240,255,0.95)"); gr.addColorStop(0.25, "rgba(120,170,255,0.75)"); gr.addColorStop(0.6, "rgba(110,60,220,0.28)"); gr.addColorStop(1, "rgba(80,30,160,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(d.x, y, R, 0, 7); g.fill();
  for (let i = 0; i < 7; i++) { const q = t * 1.4 + i * 0.9, rx = d.x + Math.cos(q) * 62, ry = y + Math.sin(q) * 22 - 6; const s = 5 + Math.sin(t * 5 + i) * 2;
    const g2 = g.createRadialGradient(rx, ry, 0, rx, ry, s * 3); g2.addColorStop(0, "rgba(190,220,255,0.9)"); g2.addColorStop(1, "rgba(120,90,255,0)"); g.fillStyle = g2; g.beginPath(); g.arc(rx, ry, s * 3, 0, 7); g.fill(); }
  g.globalCompositeOperation = "source-over"; g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(d.x, d.y + 10, 46, 12, 0, 0, 7); g.fill();
  const li = IMG.obj_evt; if (li && li.naturalWidth) { const h = 130, w = h * li.naturalWidth / li.naturalHeight; g.drawImage(li, d.x - w / 2, d.y + 12 - h, w, h); } else { g.font = "42px serif"; g.textAlign = "center"; g.fillText(E.ic, d.x, y + 14); }
  g.textAlign = "center"; g.font = '700 19px "Do Hyeon"'; g.lineWidth = 4; g.strokeStyle = "#000"; const tx = d.used ? E.name : E.name + " · 다가가기"; g.strokeText(tx, d.x, d.y + 44); g.fillStyle = d.used ? "#a99fb8" : "#d8c8ff"; g.fillText(tx, d.x, d.y + 44);
  g.restore();
}

// 11-18 상점 진열 (다시 진열 때도 씀)
function shopBuy(u, d) {
  u.gold -= d.price; d.sold = true; sfx("coin");
  if (d.what === "herb") healUnit(u, u.maxHp * 0.4);
  else if (d.what === "item" && d.k === "coin") { if (u.remote) NET.reward({ coin: 1 }); else gainCoin(1, "원정 상점"); }
  else if (d.what === "item") { u.baseMods.push(SHOP_ITEMS[d.k].m); (u.shopItems = u.shopItems || []).push(d.k); recalc(u); addText(u.x, u.y - 100, SHOP_ITEMS[d.k].name + "!", "#ffe08a", 22); }
  else if (d.what === "act") { G.drops.push({ type: "act", k: d.k, x: u.x, y: u.y + 90 }); }
  else { takeBoon(u, d.k); addText(u.x, u.y - 100, BOONS[d.k].name + "!", "#c9a0ff", 22); }
  saveGame();
}
// 11-19 보부상: 혼자 할 땐 바닥에 물건을 깔지 않고, 보부상에게 다가가면 상점 창이 열림 (위 문으로 들어오다 다시 진열 종을 밟던 문제)
const shopNpc = () => !(G.opt && G.opt.multi);
function makeStock() { const out = []; stockShop(out); return out; }
function drawMerchant(g, d) {
  const im = IMG.npc_bobusang, t = G.time, near = G.p && Math.hypot(G.p.x - d.x, G.p.y - d.y) < 170;
  g.save(); g.fillStyle = "rgba(0,0,0,0.42)"; g.beginPath(); g.ellipse(d.x, d.y + 8, 62, 16, 0, 0, 7); g.fill();
  const gr = g.createRadialGradient(d.x, d.y - 70, 4, d.x, d.y - 70, 150); gr.addColorStop(0, "rgba(255,210,130,0.22)"); gr.addColorStop(1, "rgba(255,180,90,0)"); g.fillStyle = gr; g.beginPath(); g.arc(d.x, d.y - 70, 150, 0, 7); g.fill();
  if (im && im.complete && im.naturalWidth) { const h = 190, w = h * im.naturalWidth / im.naturalHeight, by = Math.sin(t * 2) * 2; g.drawImage(im, d.x - w / 2, d.y - h + 10 + by, w, h); }
  // 그림이 아직 없으면 빛만 (이모지 금지)
  g.font = '700 20px "Do Hyeon"'; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#000"; const tx = near ? "보부상 · 다가가면 상점" : "보부상";
  g.strokeText(tx, d.x, d.y + 36); g.fillStyle = "#ffe08a"; g.fillText(tx, d.x, d.y + 36);
  g.restore();
}
function shopPm() { return (1 + (G.mode === "endless" ? G.endlessN / 12 : G.floor - 1) * 0.45) * ((typeof dailyRule === "function" && dailyRule("shop")) || 1); }
function stockShop(out) {
  const pm = shopPm();
  const stat = ["speed", "power", "armor", "eye", "wind"].sort(() => Math.random() - 0.5).slice(0, 2);
  const bk = rollBoons(1, G.p.lvl)[0];
  const list = [{ what: "herb" }, { what: "item", k: stat[0] }, { what: "item", k: stat[1] }, ...(bk ? [{ what: "boon", k: bk, price: 140 }] : []), { what: "act", k: rollActive(), price: 120 }, Math.random() < 0.35 ? { what: "item", k: "coin" } : { what: "herb" }];
  list.forEach((it, i) => { const x = RW / 2 + ((i % 3) - 1) * 260, y = RH / 2 - 60 + Math.floor(i / 3) * 210;
    const base = it.price || (it.what === "herb" ? SHOP_ITEMS.herb.price : SHOP_ITEMS[it.k].price);
    (out || G.drops).push(Object.assign({ type: "shop", price: Math.round(base * (it.k === "coin" ? 1 : pm)), x, y }, it)); });
}
function drawForge(g, d) {
  const im = IMG.obj_forge, M = ASSETS.meta && ASSETS.meta.obj_forge;
  if (im && im.naturalWidth) { const H = 210, sc = M ? H * M.s : H / im.naturalHeight; g.save(); if (d.used) g.filter = "grayscale(0.7) brightness(0.65)"; g.drawImage(im, d.x - (M ? M.fx * sc : im.naturalWidth * sc / 2), d.y + 40 - (M ? M.fy * sc : im.naturalHeight * sc), im.naturalWidth * sc, im.naturalHeight * sc); g.restore(); }
  g.save(); g.font = '700 18px "Do Hyeon"'; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#000"; const tx = d.used ? "불이 꺼진 대장간" : `떠돌이 대장간 · 엽전 ${d.price}`; g.strokeText(tx, d.x, d.y + 70); g.fillStyle = d.used ? "#8a8a9a" : (G.p && G.p.gold || 0) >= d.price ? "#ffe08a" : "#a99"; g.fillText(tx, d.x, d.y + 70); g.restore();
}
// 11-21 보호막: 가는 선 → 발밑 부적 결계(천천히 도는 고리, 밝은 글씨만 빛나게) + 몸 둘레 옅은 빛막. 보호막이 많을수록 진하게
function drawWard(g, u) {
  const k = Math.min(1, u.shield / Math.max(1, u.maxHp * 0.35)), t = G.time, pul = 0.75 + Math.sin(t * 3) * 0.12, im = IMG.fx_ward;
  g.save();
  const bub = g.createRadialGradient(u.x, u.y - 40, 10, u.x, u.y - 40, 58); bub.addColorStop(0, "rgba(160,220,255,0)"); bub.addColorStop(0.75, `rgba(150,210,255,${0.10 + 0.12 * k})`); bub.addColorStop(1, "rgba(150,210,255,0)");
  g.fillStyle = bub; g.beginPath(); g.arc(u.x, u.y - 40, 58, 0, 7); g.fill();
  g.restore();
}
// 11-27 발밑 결계 고리 — 캐릭터를 그리기 전에 그려 발 아래 깔림 (서 있을 때 고리가 몸 위에 얹혀 보이던 것)
function drawWardRing(g, u) {
  const k = Math.min(1, u.shield / Math.max(1, u.maxHp * 0.35)), t = G.time, pul = 0.75 + Math.sin(t * 3) * 0.12, im = IMG.fx_ward;
  g.save(); g.translate(u.x, u.y + u.r * 0.6); g.scale(1, 0.42);
  if (im && im.naturalWidth) { g.rotate(t * 0.6); g.globalCompositeOperation = "lighter"; g.globalAlpha = (0.4 + 0.4 * k) * pul; const R = 66; g.drawImage(im, -R, -R, R * 2, R * 2); }
  else { g.strokeStyle = `rgba(150,210,255,${0.3 + 0.3 * k})`; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 54, 0, 7); g.stroke(); }
  g.restore();
}
function drawShopRe(g, d) {
  const t = G.time, y = d.y - 30 + Math.sin(t * 3) * 3; if (G.p && Math.hypot(G.p.x - d.x, G.p.y - d.y) > 100) d.away = true; // 한 번 쓰면 떨어졌다 와야 다시
  g.save(); g.fillStyle = "rgba(0,0,0,0.4)"; g.beginPath(); g.ellipse(d.x, d.y + 6, 34, 10, 0, 0, 7); g.fill();
  const gr = g.createRadialGradient(d.x, y, 2, d.x, y, 40); gr.addColorStop(0, "rgba(255,230,150,0.55)"); gr.addColorStop(1, "rgba(255,200,90,0)"); g.fillStyle = gr; g.beginPath(); g.arc(d.x, y, 40, 0, 7); g.fill();
  { const bi = IMG.ui_ic_sound; if (bi && bi.naturalWidth) g.drawImage(bi, d.x - 24, y - 24, 48, 48); } g.textAlign = "center"; // 11-20 2.7.15: 이모지 종 → 수묵 종 그림
  g.font = '700 18px "Do Hyeon"'; g.lineWidth = 4; g.strokeStyle = "#000"; const tx = `다시 진열 · 엽전 ${d.price}`; g.strokeText(tx, d.x, d.y + 34); g.fillStyle = (G.p.gold || 0) >= d.price ? "#ffe08a" : "#a99"; g.fillText(tx, d.x, d.y + 34);
  g.restore();
}
