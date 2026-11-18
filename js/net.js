// ===== 등불 미궁: 온라인 멀티 (PeerJS) =====
// 방장(host)이 게임을 돌리고, 친구(guest)는 조작만 보내고 방장이 보낸 화면 상태를 그린다.
// 협동: 스토리·무한의 방 (둘 다 같은 편) / 대전: 1대1 (친구가 상대편)
"use strict";
const NET = {
  role: null, client: false, peer: null, conn: null, code: "", lobby: null, rin: null, guestHero: null, sentFx: new WeakSet(), sentTx: new WeakSet(),
  lastSnap: 0, roomSent: null, bannerSent: null, uid: 0, cmap: new Map(), sendT: 0,

  available() { return typeof Peer !== "undefined"; },
  idFor(code) { return "ygr1-" + code.toLowerCase(); }, // 요괴록 전용 (예전 등불미궁 방과 섞이지 않게)
  newCode() { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = ""; for (let i = 0; i < 5; i++) s += a[Math.floor(Math.random() * a.length)]; return s; },
  send(m) { if (this.conn && this.conn.open) try { this.conn.send(m); } catch (e) { } },
  leave() { try { this.conn && this.conn.close(); } catch (e) { } try { this.peer && this.peer.destroy(); } catch (e) { } Object.assign(this, { role: null, client: false, peer: null, conn: null, lobby: null, rin: null, guestHero: null }); },

  // ---------- 대기실 ----------
  host(mode, onUpdate, fixed) {
    this.leave(); this.role = "host"; this.code = fixed || this.newCode();
    this.lobby = { mode, floor: 1, guest: null, onUpdate };
    const peer = (this.peer = new Peer(this.idFor(this.code)));
    peer.on("error", (e) => { if (e.type === "unavailable-id") { this.code = this.newCode(); peer.destroy(); this.host(mode, onUpdate); } else UI.toast("연결 오류: " + e.type); });
    peer.on("open", () => onUpdate && onUpdate());
    peer.on("connection", (c) => {
      if (this.conn && this.conn.open) { c.on("open", () => { c.send({ t: "full" }); setTimeout(() => c.close(), 300); }); return; }
      this.conn = c;
      c.on("data", (m) => this.onHost(m));
      c.on("close", () => { this.conn = null; if (this.lobby) { this.lobby.guest = null; this.lobby.onUpdate && this.lobby.onUpdate(); } if (G && this.guestHero) { this.guestHero.alive = false; this.guestHero.left = true; UI.toast("친구가 나갔어요"); } });
    });
  },
  join(code, onUpdate) {
    this.leave(); this.role = "guest"; this.code = code.toUpperCase();
    this.lobby = { onUpdate, host: null };
    const peer = (this.peer = new Peer());
    peer.on("error", (e) => { UI.toast(e.type === "peer-unavailable" ? "그 코드의 방이 없어요" : "연결 오류: " + e.type); onUpdate && onUpdate("fail"); });
    peer.on("open", () => {
      const c = (this.conn = peer.connect(this.idFor(this.code), { reliable: true }));
      c.on("open", () => { c.send({ t: "hello", ver: GAME_VERSION, name: nick(), load: this.myLoad() }); onUpdate && onUpdate(); });
      c.on("data", (m) => this.onGuest(m));
      c.on("close", () => { if (NET.client) { UI.toast("방장과 연결이 끊어졌어요"); NET.client = false; G = null; UI.menu(); } this.conn = null; });
    });
  },
  // 친구가 보내는 내 캐릭터 준비물
  myLoad() {
    const S = SAVE, mods = [], arts = S.equip.arts.filter(Boolean);
    for (const a of arts) mods.push(scaleMods(ARTIFACTS[a].m, 1 + 0.2 * ((S.arts[a] || 1) - 1)));
    if (S.equip.pet && PETS[S.equip.pet].m) mods.push(scaleMods(PETS[S.equip.pet].m, 1 + 0.2 * ((S.pets[S.equip.pet] || 1) - 1)));
    if (S.equip.title) mods.push(TITLES[S.equip.title].m);
    const eq = S.skillEquip[S.sel] || {}, lv = {}; for (const k of Object.values(eq)) lv[k] = S.skills[k] || 1;
    return { char: S.sel, enh: (S.enh && S.enh[S.sel]) || 0, equip: eq, skillLv: lv, mods, pet: S.equip.pet, petLv: S.pets[S.equip.pet] || 1, title: S.equip.title };
  },
  onHost(m) {
    if (m.t === "hello") { this.lobby.guest = { name: m.name, load: m.load, ver: m.ver, ready: true }; this.send({ t: "lobby", mode: this.lobby.mode, host: nick(), ver: GAME_VERSION, char: SAVE.sel, diff: this.lobby.diff || "normal" }); this.lobby.onUpdate && this.lobby.onUpdate(); }
    else if (m.t === "load") { if (this.lobby && this.lobby.guest) { this.lobby.guest.load = m.load; this.lobby.onUpdate && this.lobby.onUpdate(); } }
    else if (m.t === "i") { this.rin = Object.assign(this.rin || { keys: {} }, m); this.rin.mouseT = m.mt ? performance.now() : -1e9; const h = this.guestHero; if (h && m.tseq && m.tseq !== h._tseq) { h._tseq = m.tseq; h.tx = clamp(m.tx, 0, RW); h.ty = clamp(m.ty, 0, RH); } }
    else if (m.t === "k") { const h = this.guestHero; if (h && G && !G.paused) useSkill(h, m.s, m.x != null ? aimClamp(h, m.x, m.y, placeInfo(h, m.s).range) : undefined); }
    else if (m.t === "lock") { const h = this.guestHero; if (h) { if (m.on == null) toggleActLock(h); else h.actLock = !!m.on; } } // 11-15 방 이동 뒤 풀리던 버그: 켜기·끄기 값으로
    else if (m.t === "boon") { const h = this.guestHero; if (h && BOONS[m.k]) takeBoon(h, m.k); }
    else if (m.t === "jobpick") { const h = this.guestHero; if (h && (h.jobs || []).length === m.tier) { applyJob(h, jobOptions(h.id, m.tier)[m.i]); jobCatchUp(h); } }
  },
  onGuest(m) {
    if (m.t === "full") { UI.toast("방이 가득 찼어요"); this.leave(); UI.multi(); }
    else if (m.t === "lobby") { this.lobby.host = { name: m.host, mode: m.mode, ver: m.ver, char: m.char, diff: m.diff || "normal" }; if (m.ver !== GAME_VERSION) UI.toast("⚠️ 방장과 게임 판이 달라요 (" + m.ver + "). 같은 최신 파일을 쓰세요", 5000); this.lobby.onUpdate && this.lobby.onUpdate(); }
    else if (m.t === "start") { needPack("fx"); if (SAVE) needPack(charPack(SAVE.sel)); needPack("f" + (m.floor || 1)); if (this.lobby && this.lobby.hostChar) needPack(charPack(this.lobby.hostChar)); this.startClient(m); }
    else if (m.t === "s") { this.applySnap(m); }
    else if (m.t === "lv") { UI.guestLevelUp(m.opts, m.lvl); }
    else if (m.t === "job") { UI.jobPick(m.tier, m.cid, (i) => this.send({ t: "jobpick", tier: m.tier, i })); }
    else if (m.t === "rw") { if (m.gold) SAVE.gold += m.gold; if (m.coin) { SAVE.coins += m.coin; UI.toast("🪙 코인 +" + m.coin); } saveGame(); }
    else if (m.t === "end") { this.clientEnd(m); }
    else if (m.t === "toast") UI.toast(m.s);
  },
  sendKey(s, at) { this.send(at ? { t: "k", s, x: Math.round(at.x), y: Math.round(at.y) } : { t: "k", s }); },
  reward(r) { this.send(Object.assign({ t: "rw" }, r)); },
  guestLevelUp(u) { this.send({ t: "lv", opts: rollBoons(3, u.lvl, u), lvl: u.lvl }); },

  // ---------- 방장: 출발 ----------
  hostStart(opt) {
    const g = this.lobby.guest; if (!g || !this.conn) { UI.toast("친구가 아직 안 들어왔어요"); return; }
    const L = g.load, duel = opt.mode === "duel";
    opt.multi = true; opt.guest = L;
    this.rin = { keys: {}, mouseT: -1e9 };
    UI.startRun(opt);
    if (!duel) { const msg = "👥 2인 협동 — 요괴 체력 +" + Math.round(PARTY_HP * 100) + "% · 공격력 +" + Math.round(PARTY_DMG * 100) + "% · 수 +" + Math.round(PARTY_CNT * 100) + "%"; setTimeout(() => { UI.toast(msg, 4000); this.send({ t: "toast", s: msg }); }, 1500); }
  },
  // newRun 안에서 불림: 친구 영웅 만들기
  makeGuestHero(opt, startLv) {
    const L = opt.guest, duel = opt.mode === "duel"; needPack(charPack(L.char));
    const form = CHAR[L.char].forms ? pick(Object.keys(CHAR[L.char].forms)) : null;
    const h = makeHero(L.char, { team: duel ? 1 : 0, form, lvl: startLv, mods: duel ? [] : L.mods, enh: duel ? 0 : L.enh, equip: L.equip, skillLv: L.skillLv, x: RW / 2 + 70, y: duel ? BT + 170 : RH / 2 + 120 });
    h.remote = true; h.ctrl = this.rin; h.guestName = this.lobby.guest.name;
    this.guestHero = h; G.p2 = h; G.units.push(h);
    if (!duel && L.pet && PETS[L.pet]) addPet(h, L.pet, L.petLv || 1);
    return h;
  },

  // ---------- 방장: 화면 상태 보내기 (초당 20번) ----------
  hostTick(dt) {
    if (this.role !== "host" || !G || !G.opt.multi || !this.conn) return;
    this.sendT -= dt; if (this.sendT > 0) return; this.sendT = 0.05;
    const id = (u) => u._id || (u._id = ++this.uid);
    const r = G.cur, snap = { t: "s", mode: G.mode, fl: G.floor, ef: G.eFloor || 0, stg: G.stage, en: G.endlessN, paused: !!G.paused, locked: roomLocked(), trans: G.trans ? [G.trans.mode, G.trans.t, G.trans.max] : null, sh: G.shake };
    if (this.roomSent !== r) { this.roomSent = r; snap.room = { key: G.curKey, type: r.type, bg: r.bg, obs: r.obs.map((o) => ({ x: o.x, y: o.y, r: o.r, kind: o.kind, prop: o.prop })), haz: r.haz.map((h) => ({ x: h.x, y: h.y, rx: h.rx, ry: h.ry, kind: h.kind, ph: h.ph })), decor: r.decor, deco3: r.deco3 || [] }; snap.map = [...G.rooms.values()].filter((x) => x.visited || true).map((x) => [x.x, x.y, x.type, x.visited ? 1 : 0, x.cleared ? 1 : 0, Object.keys(x.links).join("")]); }
    else if (Math.random() < 0.1) snap.map = [...G.rooms.values()].map((x) => [x.x, x.y, x.type, x.visited ? 1 : 0, x.cleared ? 1 : 0, Object.keys(x.links).join("")]);
    snap.ln = Object.fromEntries(Object.entries(r.links).map(([d, k]) => { const t = G.rooms.get(k); return [d, [t.type, t.visited ? 1 : 0, t.x, t.y]]; }));
    snap.u = G.units.filter((u) => u.alive || u.kind === "hero").map((u) => {
      const o = [id(u), u.kind, u.team, Math.round(u.x), Math.round(u.y), u.r, u.kind === "hero" ? u.art : u.img || "", u.flip ? 1 : 0, u.dash ? 2 : u.moving ? 1 : 0,
        +(u.atkAnim || 0).toFixed(2), +(u.skillAnim || 0).toFixed(2), +(u.hurtT || 0).toFixed(2), +(u.hitT || 0).toFixed(2), +(u.stunT || 0).toFixed(1),
        (u.invT > 0 || (u.buffs && hasBuff(u, "inv"))) ? 1 : 0, u.buffs && hasBuff(u, "stealth") ? 1 : 0, u.elite ? 1 : 0, u.ph2 ? 1 : 0, +(u.flash || 0).toFixed(2),
        Math.round(u.hp || 0), Math.round(u.maxHp || 0), Math.round(u.shield || 0), +(u.spawnT || 0).toFixed(2), u.e || "", +(u.life || 0).toFixed(1), u.burn ? 1 : 0, u.markT > 0 ? 1 : 0,
        u.kind === "boss" && (u.st === "charge" || u.flash > 0 || (u.st === "busy" && u.t > 0.4)) ? 1 : 0, (u.def && u.def.col) || "", u.kind === "hero" ? u.def.name + " · " + (u.jobName || u.def.job) + (u.formName ? "(" + u.formName + ")" : "") : u.name || "",
        u.alive ? 1 : 0, (u.buffs && (u.buffs.find((b) => b.col && (b.dr || b.atk || b.inv || b.aura)) || {}).col) || "", u.lvl || 0, u.jobName || "", +(u.face || 0).toFixed(2)];  /* 11-16 8방향 공격 모습용 */
      return o;
    });
    snap.p = G.projs.map((p) => [Math.round(p.x), Math.round(p.y), Math.round(p.vx), Math.round(p.vy), p.r, p.col, p.shape, p.team, p.alt || "", p.bimg || "", p.spin || 0]);
    snap.te = G.tele.map((t) => [t.shape, Math.round(t.x), Math.round(t.y), t.r || 0, +(t.a || 0).toFixed(3), t.w || 0, t.len || 0, +t.t.toFixed(2), t.max, t.friendly ? 1 : 0, t.col || "", t.bolt ? 1 : 0, t.taeguk ? 1 : 0, t.bcol || "", t.tk || ""]);
    snap.z = G.zones.map((z) => [Math.round(z.x), Math.round(z.y), z.r, z.dur, +z.t.toFixed(2), z.col, z.rune ? 1 : 0, z.vk || ""]);
    snap.d = G.drops.map((d) => ({ type: d.type, x: Math.round(d.x), y: Math.round(d.y), z: d.z || 0, k: d.k, lv: d.lv, price: d.price, what: d.what, sold: d.sold, open: d.open, used: d.used }));
    snap.o = G.orbs.map((o) => [Math.round(o.x || 0), Math.round(o.y || 0), o.col]);
    const fx = []; for (const f of G.fx) if (!this.sentFx.has(f)) { this.sentFx.add(f); const c = {}; for (const k in f) if (k !== "u" && typeof f[k] !== "object") c[k] = f[k]; if (f.u) { c.x = f.u.x; c.y = f.u.y; if (f.k === "beamTele") { c.y -= 14; } } fx.push(c); }
    snap.fx = fx;
    const tx = []; for (const t of G.texts) if (!this.sentTx.has(t)) { this.sentTx.add(t); tx.push([Math.round(t.x), Math.round(t.y), t.s, t.col, t.size, t.big ? 1 : 0]); } snap.tx = tx;
    if (G.banner && this.bannerSent !== G.banner) { this.bannerSent = G.banner; snap.bn = { text: G.banner.text, sub: G.banner.sub, t: G.banner.t, boss: G.banner.boss }; }
    const me = this.guestHero;
    if (me) snap.me = { id: id(me), lock: me.actLock ? 1 : 0, gold: me.gold || 0, lvl: me.lvl, exp: me.exp, cd: me.cd, act: me.active, boons: me.boons, sk: Object.fromEntries(Object.entries(me.sk).map(([k, v]) => [k, { ic: v.ic, icon: v.icon, cd: v.cd, name: v.name, desc: v.desc, grade: v.grade, id: v.id }])), basic: me.def.basic.name, alive: me.alive };
    snap.host = id(G.p); snap.hn = nick(); snap.cu = G.curse || null; snap.rn = G.raidN || 0; snap.hu = r.haz.map((h) => (h.up ? 1 : 0));
    if (G.mode === "duel") snap.duel = { round: G.duel.round, wins: G.duel.wins };
    if (G.bossUnit && G.bossUnit.alive) snap.boss = id(G.bossUnit);
    this.send(snap);
  },

  // ---------- 친구: 화면 상태 받아 그리기 ----------
  startClient(m) {
    this._packF = null; this._raidPacks = 0;
    this.client = true; this.cmap = new Map();
    $("#screens").innerHTML = ""; $("#hud").hidden = false; UI.closeModal();
    G = { client: true, mode: m.mode, floor: m.floor, stage: 1, endlessN: 0, units: [], projs: [], zones: [], tele: [], fx: [], parts: [], texts: [], drops: [], orbs: [], timers: [], rooms: new Map(), cur: null,
      time: 0, shake: 0, paused: false, over: false, banner: null, trans: null, p: null, opt: { mode: m.mode }, duel: m.mode === "duel" ? { round: 1, wins: [0, 0] } : null, kills: 0, unlocksAtStart: Object.keys(SAVE.chars).length };
    SAVE.stats.modes = SAVE.stats.modes || {}; SAVE.stats.modes[m.mode] = 1;
    UI.music(m.mode === "duel" ? "duel" : m.mode === "endless" ? "endless" : FLOORS[0].bgm);
  },
  applySnap(m) {
    if (!G || !G.client) return;
    if (G.cur && m.hu) G.cur.haz.forEach((h, i) => (h.up = !!m.hu[i]));
    Object.assign(G, { raidN: m.rn, curse: m.cu, mode: m.mode, floor: m.fl, eFloor: m.ef || G.eFloor, stage: m.stg, endlessN: m.en, locked: m.locked, paused: false, shake: Math.max(G.shake, m.sh || 0) });
    // 친구 화면: 층이 바뀌면 그 층 그림 묶음(보스·바닥·벽)을 받는다 (11-15 사용자: 친구 화면에 보스가 안 보이고 바닥이 늘 기본)
    { const f = ((G.mode === "endless" ? (G.eFloor || 1) : (G.floor || 1)) - 1) % 5 + 1;
      if (G.mode === "raid" && !this._raidPacks) { this._raidPacks = 1; for (let i = 1; i <= 5; i++) needPack("f" + i).then(() => { if (G && G.cur) G.cur.needBg = true; }); }
      if (this._packF !== f) { this._packF = f; needPack("f" + f).then(() => { if (G && G.cur) { G.cur.needBg = true; if (typeof warmRun === "function") warmRun(); } }); needPack("f" + (f % 5 + 1)); } }
    if (m.duel) G.duel = m.duel;
    if (m.room) {
      const R = { x: 0, y: 0, type: m.room.type, links: {}, visited: true, cleared: !m.locked, obs: m.room.obs, haz: m.room.haz, decor: m.room.decor, deco3: m.room.deco3 || [], bg: m.room.bg, laid: true, cache: null };
      buildRoom(R); G.cur = R; G.units = []; this.cmap = new Map(); G.trans = { t: 0.35, max: 0.35, mode: "in" };
      const music = G.mode === "duel" ? "duel" : R.type === "boss" ? (G.mode === "story" && G.stage === STAGES_PER_FLOOR ? "boss_final" : "boss") : G.mode === "endless" ? "endless" : theme().bgm; UI.music(music);
    }
    if (!G.cur) return;
    if (m.map) { G.rooms = new Map(); for (const [x, y, type, vis, cl, dirs] of m.map) G.rooms.set(x + "," + y, { x, y, type, visited: !!vis, cleared: !!cl, links: Object.fromEntries([...dirs].map((d) => [d, (x + DIRS[d][0]) + "," + (y + DIRS[d][1])])) }); }
    // 지금 방 위치·문 정보
    G.cur.links = {}; let cx = 0, cy = 0;
    for (const d in m.ln) { const [type, vis, x, y] = m.ln[d]; const k = x + "," + y; G.cur.links[d] = k; if (!G.rooms.has(k)) G.rooms.set(k, { x, y, type, visited: !!vis, links: {} }); else Object.assign(G.rooms.get(k), { type, visited: !!vis }); cx = x - DIRS[d][0]; cy = y - DIRS[d][1]; }
    const ck = cx + "," + cy; if (G.rooms.has(ck)) { const cr = G.rooms.get(ck); G.cur.x = cr.x; G.cur.y = cr.y; cr.visited = true; G.rooms.set(ck, Object.assign(cr, { links: G.cur.links })); }
    const seen = new Set(), list = [];
    for (const a of m.u) {
      const [id, kind, team, x, y, r, art, flip, mv, aa, sa, ht, hi, st, iv, sth, el, p2, fl, hp, mh, sh, sp, e, lf, bu, mk, bp, col, nm, alive, ring, lvl, jn, fc] = a;
      let u = this.cmap.get(id);
      if (!u) { u = { _id: id, kind, team, x, y, r, ph: id * 1.7, buffs: [], cd: {} }; this.cmap.set(id, u); }
      Object.assign(u, { kind, team, nx: x, ny: y, r, flip: !!flip, moving: mv === 1, dash: mv === 2 ? {} : null, atkAnim: aa, skillAnim: sa, hurtT: ht, hitT: hi, stunT: st, face: fc ?? u.face, invT: iv ? 1 : 0, elite: !!el, ph2: !!p2, flash: fl,
        hp, maxHp: mh, shield: sh, spawnT: sp, e, life: lf, burn: bu ? {} : null, markT: mk ? 1 : 0, st: bp ? "charge" : "move", t: 0, alive: !!alive, def: Object.assign(u.def || {}, { col, name: (nm || "").split(" · ")[0], job: kind === "hero" ? ((nm || "").split(" · ")[1] || "").replace(/(.*)/, "") : undefined }), name: nm });
      if (kind === "hero") { if (u.art !== art) needPack(charPack(art)); u.art = art; u.lvl = lvl; u.jobName = jn || null; } else u.img = art;
      u.buffs = []; if (sth) u.buffs.push({ stealth: true, t: 1 }); if (ring) u.buffs.push({ col: ring, dr: 1, t: 1 }); if (iv) u.buffs.push({ inv: true, t: 1 });
      if (Math.hypot(u.x - x, u.y - y) > 200) { u.x = x; u.y = y; }
      seen.add(id); list.push(u);
    }
    for (const id of [...this.cmap.keys()]) if (!seen.has(id)) this.cmap.delete(id);
    G.units = list;
    const me = m.me && this.cmap.get(m.me.id);
    if (me) {
      G.p = me; me.actLock = !!m.me.lock; me.gold = m.me.gold; me.lvl = m.me.lvl; me.exp = m.me.exp; me.cd = m.me.cd; me.active = m.me.act; me.boons = m.me.boons; me.sk = m.me.sk; me.def.basic = { name: m.me.basic }; me.def.name = (me.name || "").replace(/\(.*\)/, "").split(" · ")[0]; me.def.job = (me.name || "").replace(/\(.*\)/, "").split(" · ")[1]; me.formName = (me.name.match(/\((.*)\)/) || [])[1];
      if (!me.ctrl) me.ctrl = input;
      if (!G.hudBuilt) { G.hudBuilt = true; UI.buildHud(); }
    }
    G.bossUnit = m.boss ? this.cmap.get(m.boss) : null;
    G.bot = G.mode === "duel" ? this.cmap.get(m.host) : null;
    const hu = this.cmap.get(m.host); if (hu && m.hn) hu.guestName = m.hn;
    G.projs = m.p.map(([x, y, vx, vy, r, col, shape, team, alt, bimg, spin]) => ({ x, y, vx, vy, r, col, shape, team, alt: alt || null, bimg: bimg || null, spin, ang: Math.atan2(vy, vx) }));
    const prevTele = G.tele; G.tele = m.te.map(([shape, x, y, r, a, w, len, t, max, friendly, col, bolt, taeguk, bcol, tk]) => ({ shape, x, y, r, a, w, len, t, max, friendly: !!friendly, col, bolt, taeguk, bcol: bcol || null, tk: tk || null }));
    G.zones = m.z.map(([x, y, r, dur, t, col, rune, vk]) => ({ x, y, r, dur, t, col, rune, vk: vk || null }));
    G.drops = m.d; G.orbs = m.o.map(([x, y, col]) => ({ x, y, col }));
    for (const f of m.fx) G.fx.push(f);
    for (const [x, y, s, col, size, big] of m.tx) G.texts.push({ x, y, s, col, size, big, t: 0 });
    if (m.bn) G.banner = m.bn;
    if (m.trans && m.trans[0] === "out") G.trans = { mode: "out", t: m.trans[1], max: m.trans[2] };
    G.snapAt = performance.now();
  },
  clientUpdate(dt) {
    G.time += dt;
    for (const u of G.units) { if (u.nx != null) { const k = Math.min(1, dt * 14); u.x += (u.nx - u.x) * k; u.y += (u.ny - u.y) * k; } }
    for (const p of G.projs) { p.x += p.vx * dt; p.y += p.vy * dt; }
    for (const t of G.tele) t.t += dt;
    for (const z of G.zones) z.t += dt;
    for (const f of G.fx) f.t += dt; G.fx = G.fx.filter((f) => f.t < f.max);
    for (const t of G.texts) { t.y -= 50 * dt; t.t += dt; } G.texts = G.texts.filter((t) => t.t < 0.9);
    if (G.banner) { G.banner.t -= dt; if (G.banner.t <= 0) G.banner = null; }
    if (G.trans) { G.trans.t -= dt; if (G.trans.t <= 0) G.trans = null; }
    G.shake = Math.max(0, G.shake - dt * 40);
    // 조작 보내기 (초당 20번)
    this.sendT -= dt;
    if (this.sendT <= 0) { this.sendT = 0.05; this.send({ t: "i", mx: Math.round(input.mx), my: Math.round(input.my), mt: input.touch ? 0 : input.mouseT > 0 ? 1 : 0, touch: input.touch ? 1 : 0, kx: input.kx, ky: input.ky, atkHeld: input.atkHeld ? 1 : 0, tx: input.tx, ty: input.ty, tseq: input.tseq || 0 }); }
  },
  // 원정 끝: 방장 → 친구 결과·기록
  hostEnd(r) {
    if (this.role !== "host" || !G || !G.opt.multi) return;
    const h = this.guestHero;
    this.send({ t: "end", r: { coinRw: G.mode === "duel" ? (!r.win ? 2 : 0) : r.coinRw, mode: r.mode, win: G.mode === "duel" ? !r.win : r.win, storyDone: r.storyDone, kills: r.kills, rooms: r.rooms, floor: r.floor, stage: r.stage, endless: r.endless, lvl: h ? h.lvl : 1, duel: G.duel ? { wins: [G.duel.wins[1], G.duel.wins[0]] } : null, bosses: G.bossKills || 0 } });
  },
  clientEnd(m) {
    const r = m.r, S = SAVE.stats;
    S.kills = (S.kills || 0) + r.kills; S.rooms = (S.rooms || 0) + r.rooms; S.bosses = (S.bosses || 0) + (r.bosses || 0); S.maxLevel = Math.max(S.maxLevel || 0, r.lvl);
    if (r.mode === "story") { SAVE.story.maxFloor = Math.max(SAVE.story.maxFloor || 1, r.floor); if (r.storyDone) S.storyClear = (S.storyClear || 0) + 1; }
    if (r.mode === "endless") S.endlessBest = Math.max(S.endlessBest || 0, r.endless);
    if (r.mode === "duel" && r.win) S.duelWins = (S.duelWins || 0) + 1;
    SAVE.coins += r.coinRw || 0;
    checkUnlocks(); saveGame();
    r.coin = 0;
    G.p = G.p || { lvl: r.lvl }; G.unlocksAtStart = G.unlocksAtStart || 0;
    UI.result(Object.assign(r, { lvl: r.lvl }), true);
  },
};
