// ===== 수집품 (사용자 요청 11-10) =====
// 칭호 30 (가챠 10 · 미션 10 · 특수 5 · 스토리 5)
// 아티팩트 55 (가챠 15 · 미션 20 · 특수 10 = 45, + 스토리 10 — 스토리 진행으로만 얻음, 효과는 모든 모드)
// 펫 40 (가챠 10 · 미션 15 · 특수 5 · 랜덤 드롭 5 · 스토리 5)
// how: gacha 가챠 / mission 미션 / special 특수 미션 / story 스토리 / drop 랜덤 획득.  c: 조건 { stat, n, text }
const HOW_NAME = { gacha: "뽑기", mission: "임무", special: "특수 임무", story: "스토리", drop: "랜덤 획득", secret: "숨은 보상" };
const A_ = (name, rar, desc, m, how, c, en) => ({ name, rar, desc, m, how, c, en, img: null });
const ARTIFACTS = {
  // --- 가챠 15 ---
  a_whet: A_("숫돌", 1, "공격력 +6%", { atk: 0.06 }, "gacha", null, "a whetstone with a sharp blade edge"),
  a_sandal: A_("짚신", 1, "이동 속도 +7%", { spd: 0.07 }, "gacha", null, "a pair of woven straw sandals"),
  a_pouch: A_("약초 주머니", 1, "최대 체력 +8%", { hp: 0.08 }, "gacha", null, "a cloth pouch of healing herbs"),
  a_coin: A_("복 엽전", 1, "엽전 획득 +20%", { gold: 0.2 }, "gacha", null, "an old Korean brass coin with a square hole on a red string"),
  a_badge: A_("포졸 패", 1, "받는 피해 -5%", { dr: 0.05 }, "gacha", null, "a wooden Joseon guard identification tag"),
  a_wick: A_("긴 심지", 2, "시야 밝기 +25%, 치명타 +4%", { light: 0.25, crit: 0.04 }, "gacha", null, "a long glowing lantern wick on a small brass holder"),
  a_scroll: A_("병법서", 2, "스킬 대기 -8%", { cdr: 0.08 }, "gacha", null, "a rolled ancient war strategy scroll"),
  a_talis: A_("호신 부적", 2, "방마다 체력 10% 보호막", { shieldRoom: 0.1 }, "gacha", null, "a yellow paper protective talisman with red ink"),
  a_bell: A_("풍경", 2, "공격 속도 +10%", { as: 0.1 }, "gacha", null, "a bronze temple wind chime bell"),
  a_charm: A_("노리개", 2, "치명타 +7%", { crit: 0.07 }, "gacha", null, "a colorful Korean norigae tassel ornament with jade"),
  a_mirror: A_("청동 거울", 3, "맞으면 공격자에게 120% 반사, 받는 피해 -5%", { thorns: 1.2, dr: 0.05 }, "gacha", null, "an ancient round bronze mirror with engraved patterns"),
  a_fang: A_("범 송곳니", 3, "치명타 피해 +30%, 치명타 +5%", { critdmg: 0.3, crit: 0.05 }, "gacha", null, "a large tiger fang necklace"),
  a_pearl: A_("여의주", 3, "궁극기 대기 -18%, 스킬 대기 -5%", { ultcd: 0.18, cdr: 0.05 }, "gacha", null, "a glowing dragon pearl orb with swirling mist"),
  a_crown: A_("금관", 4, "공격력 +15%, 최대 체력 +15%, 엽전 +25%", { atk: 0.15, hp: 0.15, gold: 0.25 }, "gacha", null, "a Silla golden crown with jade ornaments"),
  a_wing: A_("삼족오 깃", 4, "한 판에 한 번 쓰러져도 체력 50%로 일어남", { revive: 1 }, "gacha", null, "a glowing golden feather of the three-legged sun crow"),
  // --- 미션 20 ---
  a_arrowhead: A_("사냥꾼 화살촉", 1, "공격력 +5%", { atk: 0.05 }, "mission", { stat: "kills", n: 100, text: "요괴 100마리" }, "an iron arrowhead on a leather cord"),
  a_skullneck: A_("해골 목걸이", 2, "치명타 +5%", { crit: 0.05 }, "mission", { stat: "kills", n: 500, text: "요괴 500마리" }, "a necklace of small carved bone skulls"),
  a_hundred: A_("천인참 칼날", 3, "공격력 +12%", { atk: 0.12 }, "mission", { stat: "kills", n: 2000, text: "요괴 2000마리" }, "a broken legendary sword blade glowing red"),
  a_horn: A_("보스의 뿔", 2, "보스에게 주는 피해 +10%", { bossDmg: 0.1 }, "mission", { stat: "bosses", n: 5, text: "보스 5마리" }, "a large curved demon horn"),
  a_warhorn: A_("왕의 뿔피리", 3, "보스 피해 +20%, 공격력 +5%", { bossDmg: 0.2, atk: 0.05 }, "mission", { stat: "bosses", n: 20, text: "보스 20마리" }, "an ornate royal war horn with gold bands"),
  a_staff: A_("나그네 지팡이", 1, "이동 속도 +8%", { spd: 0.08 }, "mission", { stat: "rooms", n: 50, text: "방 50개 정리" }, "a gnarled wooden traveler's walking staff with a gourd"),
  a_map: A_("미궁 지도", 2, "이동 +10%, 스킬 대기 -5%", { spd: 0.1, cdr: 0.05 }, "mission", { stat: "rooms", n: 200, text: "방 200개 정리" }, "an old rolled parchment dungeon map"),
  a_woodsword: A_("수련 목검", 1, "공격 속도 +8%", { as: 0.08 }, "mission", { stat: "maxLevel", n: 15, text: "한 판 레벨 15" }, "a wooden practice sword"),
  a_beads: A_("깨달음 염주", 2, "스킬 대기 -10%", { cdr: 0.1 }, "mission", { stat: "maxLevel", n: 30, text: "한 판 레벨 30" }, "a Buddhist prayer bead bracelet glowing softly"),
  a_hourglass: A_("무한 모래시계", 2, "궁극기 대기 -10%", { ultcd: 0.1 }, "mission", { stat: "endlessBest", n: 15, text: "무한의 방 15번째 방" }, "an ornate hourglass with glowing sand"),
  a_lamp: A_("끝없는 등잔", 3, "밝기 +30%, 초당 체력 0.3% 회복", { light: 0.3, regen: 0.003 }, "mission", { stat: "endlessBest", n: 40, text: "무한의 방 40번째 방" }, "a small clay oil lamp with an eternal flame"),
  a_gloves: A_("결투 장갑", 1, "치명타 +6%", { crit: 0.06 }, "mission", { stat: "duelWins", n: 3, text: "1대1 대전 3승" }, "a pair of leather dueling gauntlets"),
  a_belt: A_("승자의 띠", 3, "공격력 +8%, 최대 체력 +8%", { atk: 0.08, hp: 0.08 }, "mission", { stat: "duelWins", n: 12, text: "1대1 대전 12승" }, "a champion's red silk belt with a gold buckle"),
  a_luckcharm: A_("뽑기 행운 부적", 2, "엽전 +25%, 코인 드롭 +10%", { gold: 0.25, coinLuck: 0.1 }, "mission", { stat: "pulls", n: 30, text: "뽑기 30번" }, "a lucky golden pig charm"),
  a_box: A_("수집가 상자", 1, "최대 체력 +10%", { hp: 0.1 }, "mission", { stat: "charsOwned", n: 6, text: "영웅 6명" }, "a lacquered mother-of-pearl treasure box"),
  a_banner: A_("영웅의 깃발", 3, "공격력 +7%, 받는 피해 -5%", { atk: 0.07, dr: 0.05 }, "mission", { stat: "charsOwned", n: 12, text: "영웅 12명" }, "a small heroic war banner with a tiger emblem"),
  a_mark: A_("정예 사냥 표식", 2, "치명타 피해 +25%", { critdmg: 0.25 }, "mission", { stat: "elites", n: 30, text: "정예 요괴 30마리" }, "a carved bone hunting mark token with claw scratches"),
  a_key: A_("보물 사냥꾼 열쇠", 2, "엽전 +30%, 코인 드롭 +15%", { gold: 0.3, coinLuck: 0.15 }, "mission", { stat: "chests", n: 20, text: "보물상자 20개" }, "an ornate golden treasure key"),
  a_book: A_("스킬 수련서", 2, "스킬 대기 -7%", { cdr: 0.07 }, "mission", { stat: "skillsUsed", n: 500, text: "스킬 500번 사용" }, "a thick martial arts technique manual book"),
  a_knot: A_("동료의 매듭", 1, "초당 체력 0.2% 회복, 최대 체력 +6%", { regen: 0.002, hp: 0.06 }, "mission", { stat: "multiPlays", n: 3, text: "멀티 3번" }, "a Korean decorative maedeup friendship knot"),
  // --- 특수 미션 10 ---
  a_jade: A_("무결의 옥", 3, "받는 피해 -10%", { dr: 0.1 }, "special", { stat: "noHitFloor", n: 1, text: "맞지 않고 스테이지 끝내기" }, "a flawless white jade disc"),
  a_bloodoath: A_("피의 서약", 3, "피해의 4% 흡혈", { ls: 0.04 }, "special", { stat: "bossLowHp", n: 1, text: "체력 15% 이하로 보스 처치" }, "a blood-red oath dagger"),
  a_galebell: A_("질풍 방울", 3, "이동 +10%, 공격 속도 +8%", { spd: 0.1, as: 0.08 }, "special", { stat: "fastClear", n: 3, text: "10초 안에 방 정리 3번" }, "a silver bell with wind swirls"),
  a_ironheart: A_("강철 심장", 3, "최대 체력 +15%", { hp: 0.15 }, "special", { stat: "bossHighHp", n: 3, text: "체력 60% 이상으로 보스 3번" }, "a glowing iron heart amulet"),
  a_sunmirror: A_("태양 거울", 4, "공격력 +10%, 치명타 +5%", { atk: 0.1, crit: 0.05 }, "special", { stat: "storyClear", n: 1, text: "스토리 완료" }, "a radiant golden sun mirror"),
  a_undying: A_("불사의 깃", 4, "한 판에 한 번 쓰러져도 일어남", { revive: 1 }, "special", { stat: "deaths", n: 10, text: "10번 쓰러지기" }, "a phoenix feather wrapped in red thread"),
  a_drumstick: A_("천둥 북채", 4, "치명타 때 번개가 3명에게 튐", { critArc: 1 }, "special", { stat: "endlessBest", n: 30, text: "무한의 방 30번째 방" }, "a pair of thunder drumsticks crackling with lightning"),
  a_corpseflower: A_("시체꽃", 3, "적이 죽을 때 주변 100% 폭발", { corpse: 1 }, "special", { stat: "kills", n: 1000, text: "요괴 1000마리" }, "an eerie dark red corpse flower"),
  a_reaperclaw: A_("사신의 손톱", 4, "체력 8% 이하 적을 25% 확률로 즉시 처치", { execute: 0.08 }, "special", { stat: "bosses", n: 30, text: "보스 30마리" }, "a long black reaper claw"),
  a_echobell: A_("메아리 종", 4, "스킬 사용 시 15% 확률로 대기 초기화", { echo: 0.15 }, "special", { stat: "skillsUsed", n: 2000, text: "스킬 2000번 사용" }, "a temple bell emitting glowing sound rings"),
  // --- 스토리 10 (스토리 진행으로만 얻음, 효과는 모든 모드) ---
  s_bless: A_("달래 할멈의 부적", 2, "최대 체력 +10%, 초당 체력 0.3% 회복", { hp: 0.1, regen: 0.003 }, "story", { stat: "story_start", n: 1, text: "스토리 시작" }, "an old grandmother's handmade cloth charm"),
  s_shard: A_("깨진 등잔 조각", 2, "공격력 +8%, 밝기 +20%", { atk: 0.08, light: 0.2 }, "story", { stat: "story_boss1", n: 1, text: "1층 최종보스" }, "a cracked lantern glass shard glowing amber"),
  s_helm: A_("서리 장군 투구", 3, "받는 피해 -10%, 최대 체력 +8%", { dr: 0.1, hp: 0.08 }, "story", { stat: "story_boss2", n: 1, text: "2층 최종보스" }, "a frost general's ice-covered helmet"),
  s_chain: A_("불꽃 귀신의 사슬", 3, "공격력 +14%, 기본 공격 불태움", { atk: 0.14, burn: 1 }, "story", { stat: "story_boss3", n: 1, text: "3층 최종보스" }, "a burning chain wreathed in flames"),
  s_toadcrown: A_("두꺼비 왕관", 3, "흡혈 3%, 최대 체력 +10%", { ls: 0.03, hp: 0.1 }, "story", { stat: "story_boss4", n: 1, text: "4층 최종보스" }, "a small slimy golden toad king crown"),
  s_ledger: A_("염라의 명부", 4, "체력 10% 이하 적 25% 확률 즉시 처치, 치명타 +6%", { execute: 0.1, crit: 0.06 }, "story", { stat: "story_boss5", n: 1, text: "5층 최종보스" }, "the underworld king's black ledger book with purple flames"),
  s_oil: A_("훔친 등기름", 2, "공격 속도 +8%, 초당 체력 0.3% 회복", { as: 0.08, regen: 0.003 }, "story", { stat: "storyMini", n: 3, text: "스토리 중간보스 3마리" }, "a small jar of stolen lamp oil"),
  s_mask: A_("도깨비 탈", 3, "치명타 +10%, 엽전 +15%", { crit: 0.1, gold: 0.15 }, "story", { stat: "storyMini", n: 8, text: "스토리 중간보스 8마리" }, "a red Korean dokkaebi goblin mask"),
  s_wing: A_("반디의 날개", 2, "이동 속도 +8%", { spd: 0.08 }, "story", { stat: "story_floor2", n: 1, text: "스토리 2층 도달" }, "a pair of tiny glowing firefly wings"),
  s_gat: A_("무영의 갓", 4, "공격력 +12%, 최대 체력 +12%, 받는 피해 -6%", { atk: 0.12, hp: 0.12, dr: 0.06 }, "story", { stat: "storyClear", n: 2, text: "스토리 2번 완료" }, "a traditional Korean black horsehair gat hat"),
};
const ART_KEYS = Object.keys(ARTIFACTS);
const isStoryArt = (k) => ARTIFACTS[k] && ARTIFACTS[k].how === "story";

// 펫 40
const P_ = (name, rar, desc, pet, m, how, c, en) => ({ name, rar, desc, pet, m: m || null, how, c, en, img: null });
const PETS = {
  // --- 가챠 10 ---
  p_dog: P_("삽살이", 1, "1.4초마다 물기 (공격력 50%)", { kind: "melee", t: 1.4, d: 0.5 }, null, "gacha", null, "a cute fluffy Korean sapsali shaggy dog puppy"),
  p_cat: P_("고양이 나비", 1, "엽전 +25%, 가끔 엽전 물어옴", { kind: "gold", t: 6 }, { gold: 0.25 }, "gacha", null, "a cute chubby orange tabby cat with a tiny coin pouch"),
  p_bird: P_("까치", 2, "1.1초마다 깃털 (공격력 55%)", { kind: "shoot", t: 1.1, d: 0.55 }, null, "gacha", null, "a cute small Korean magpie bird"),
  p_turtle: P_("돌거북", 2, "받는 피해 -8%, 10초마다 보호막 6%", { kind: "shield", t: 10, v: 0.06 }, { dr: 0.08 }, "gacha", null, "a cute small stone-shelled turtle"),
  p_goblin: P_("꼬마 도깨비", 3, "2초마다 방망이 폭발 (120%), 코인 드롭 +30%", { kind: "slam", t: 2, d: 1.2 }, { coinLuck: 0.3 }, "gacha", null, "a cute tiny Korean dokkaebi goblin with a club"),
  p_fox: P_("아기 여우", 3, "0.9초마다 여우불 (60%, 따라감)", { kind: "shoot", t: 0.9, d: 0.6, home: true }, null, "gacha", null, "a cute baby fox with two tails and a blue flame"),
  p_dragon: P_("아기 이무기", 4, "1.2초마다 여의주 빛 (90%), 공격력 +6%", { kind: "shoot", t: 1.2, d: 0.9, pierce: true }, { atk: 0.06 }, "gacha", null, "a cute baby imugi serpent dragon holding a pearl"),
  p_haetae: P_("아기 해태", 4, "8초마다 보호막 10%, 공격력 +5%", { kind: "shield", t: 8, v: 0.1 }, { atk: 0.05 }, "gacha", null, "a cute baby haetae, the Korean lion-like guardian beast with a horn"),
  p_phoenix: P_("봉황 병아리", 4, "6초마다 체력 6% 회복", { kind: "heal", t: 6, v: 0.06 }, null, "gacha", null, "a cute baby phoenix chick with rainbow flame feathers"),
  p_girin: P_("아기 기린", 3, "8초마다 체력 5% 회복 + 보호막 5%", { kind: "heal", t: 8, v: 0.05 }, { hp: 0.05 }, "gacha", null, "a cute baby qilin"),
  p_bulgasari: P_("아기 불가사리", 3, "받는 피해 -10%, 2초마다 땅 내려치기 (110%)", { kind: "slam", t: 2, d: 1.1 }, { dr: 0.1 }, "gacha", null, "a cute baby bulgasari"),
  p_samjok: P_("아기 삼족오", 4, "1초마다 태양 깃털 (80%, 꿰뚫음), 치명타 +5%", { kind: "shoot", t: 1.0, d: 0.8, pierce: true }, { crit: 0.05 }, "gacha", null, "a cute baby three-legged sun crow"),
  // 숨은 보스펫 (11-12): 층 보스 100번 처치 — 얻기 전에는 목록·미션에 안 보임
  p_bossking: P_("꼬마 도깨비 왕", 4, "공격력 +10%, 2초마다 방망이 내려치기 (주변 150%·기절)", { kind: "slam", t: 2, d: 1.5 }, { atk: 0.1 }, "secret", { stat: "floorBossKills", n: 100, text: "층 보스 100번 처치" }, "a cute chibi baby version of the Shadow Dokkaebi King: tiny horned dokkaebi with a broken black gat hat, black robe and a little studded club with violet dokkaebi-fire"),
  p_yongma: P_("아기 용마", 4, "이동 속도 +12%, 1.6초마다 번개 사슬 4명 (70%)", { kind: "chain", t: 1.6, d: 0.7 }, { spd: 0.12 }, "gacha", null, "a cute baby dragon-horse"),
  p_whitetiger: P_("백호 새끼", 3, "1초마다 할퀴기 (공격력 90%)", { kind: "melee", t: 1.0, d: 0.9 }, null, "gacha", null, "a cute white tiger cub with blue stripes"),
  // --- 미션 15 ---
  p_squirrel: P_("다람쥐", 1, "엽전 +15%, 가끔 엽전 물어옴", { kind: "gold", t: 7 }, { gold: 0.15 }, "mission", { stat: "kills", n: 100, text: "요괴 100마리" }, "a cute chipmunk holding an acorn"),
  p_owl: P_("부엉이", 1, "1.3초마다 깃털 (공격력 45%)", { kind: "shoot", t: 1.3, d: 0.45 }, null, "mission", { stat: "rooms", n: 50, text: "방 50개" }, "a cute round horned owl"),
  p_mole: P_("두더지", 1, "엽전 +20%", { kind: "gold", t: 5 }, { gold: 0.2 }, "mission", { stat: "chests", n: 10, text: "보물상자 10개" }, "a cute mole with tiny goggles and a shovel"),
  p_firefly: P_("반딧불이", 1, "밝기 +30%, 1.5초마다 빛 (40%)", { kind: "shoot", t: 1.5, d: 0.4, home: true }, { light: 0.3 }, "mission", { stat: "endlessBest", n: 10, text: "무한의 방 10번째 방" }, "a cute big glowing firefly"),
  p_goose: P_("거위", 2, "1.2초마다 쪼기 (공격력 60%)", { kind: "melee", t: 1.2, d: 0.6 }, null, "mission", { stat: "duelWins", n: 3, text: "1대1 3승" }, "a cute angry white goose"),
  p_rabbit: P_("옥토끼", 2, "이동 속도 +8%", { kind: "none" }, { spd: 0.08 }, "mission", { stat: "maxLevel", n: 10, text: "한 판 레벨 10" }, "a cute jade moon rabbit with a pestle"),
  p_raccoon: P_("너구리", 2, "코인 드롭 +20%", { kind: "gold", t: 8 }, { coinLuck: 0.2 }, "mission", { stat: "pulls", n: 20, text: "뽑기 20번" }, "a cute raccoon dog (neoguri) with a leaf on its head"),
  p_otter: P_("수달", 2, "1초마다 조약돌 (공격력 50%)", { kind: "shoot", t: 1.0, d: 0.5 }, null, "mission", { stat: "rooms", n: 150, text: "방 150개" }, "a cute river otter holding a pebble"),
  p_crane: P_("두루미", 3, "7초마다 체력 5% 회복", { kind: "heal", t: 7, v: 0.05 }, null, "mission", { stat: "bosses", n: 5, text: "보스 5마리" }, "a cute red-crowned crane chick"),
  p_bear: P_("반달곰 새끼", 3, "2.2초마다 땅 내려치기 (130%)", { kind: "slam", t: 2.2, d: 1.3 }, null, "mission", { stat: "kills", n: 800, text: "요괴 800마리" }, "a cute Asiatic black bear cub with a white moon mark"),
  p_hawk: P_("송골매", 3, "0.8초마다 급강하 (공격력 55%)", { kind: "shoot", t: 0.8, d: 0.55 }, null, "mission", { stat: "elites", n: 20, text: "정예 20마리" }, "a cute small falcon"),
  p_deer: P_("꽃사슴", 2, "초당 체력 0.3% 회복", { kind: "none" }, { regen: 0.003 }, "mission", { stat: "charsOwned", n: 5, text: "영웅 5명" }, "a cute spotted fawn with flowers"),
  p_boar: P_("아기 멧돼지", 2, "1.1초마다 들이받기 (70%)", { kind: "melee", t: 1.1, d: 0.7 }, null, "mission", { stat: "kills", n: 300, text: "요괴 300마리" }, "a cute striped baby wild boar"),
  p_bat: P_("꼬마 박쥐", 2, "흡혈 2%, 1.2초마다 물기 (45%)", { kind: "shoot", t: 1.2, d: 0.45, home: true }, { ls: 0.02 }, "mission", { stat: "skillsUsed", n: 300, text: "스킬 300번" }, "a cute little fruit bat"),
  p_monkey: P_("원숭이", 2, "1초마다 열매 던지기 (50%)", { kind: "shoot", t: 1.0, d: 0.5 }, null, "mission", { stat: "multiPlays", n: 2, text: "멀티 2번" }, "a cute little monkey holding a peach"),
  // --- 특수 미션 5 ---
  p_firefox: P_("불여우", 4, "0.8초마다 불꽃 (70%, 불태움)", { kind: "shoot", t: 0.8, d: 0.7, burn: true, home: true }, null, "special", { stat: "noHitFloor", n: 1, text: "맞지 않고 스테이지 끝내기" }, "a cute fire fox made of flames"),
  p_icesprite: P_("얼음 정령", 4, "3초마다 주변 적 1초 얼림", { kind: "freeze", t: 3, d: 0.4 }, null, "special", { stat: "bossHighHp", n: 2, text: "체력 60% 이상으로 보스 2번" }, "a cute small ice spirit made of crystals"),
  p_thunderbird: P_("번개 새", 4, "1.6초마다 번개 사슬 4명 (60%)", { kind: "chain", t: 1.6, d: 0.6 }, null, "special", { stat: "fastClear", n: 5, text: "10초 안에 방 정리 5번" }, "a cute thunderbird chick crackling with lightning"),
  p_shadowcat: P_("그림자 고양이", 4, "치명타 +8%, 치명타 피해 +20%", { kind: "melee", t: 1.0, d: 0.6 }, { crit: 0.08, critdmg: 0.2 }, "special", { stat: "bossLowHp", n: 2, text: "체력 15% 이하로 보스 2번" }, "a cute black shadow cat with glowing purple eyes"),
  p_goldtoad: P_("황금 두꺼비", 4, "엽전 +50%, 코인 드롭 +30%", { kind: "gold", t: 4 }, { gold: 0.5, coinLuck: 0.3 }, "special", { stat: "endlessBest", n: 35, text: "무한의 방 35번째 방" }, "a cute golden toad sitting on coins"),
  // --- 랜덤 획득 5 (몬스터 0.2% · 정예 2% · 보스 5%) ---
  p_wisp: P_("도깨비불 정령", 2, "1초마다 불씨 (50%, 따라감)", { kind: "shoot", t: 1.0, d: 0.5, home: true }, null, "drop", null, "a cute tiny blue dokkaebi fire spirit"),
  p_skeldog: P_("해골 강아지", 2, "1.2초마다 물기 (65%)", { kind: "melee", t: 1.2, d: 0.65 }, null, "drop", null, "a cute little skeleton puppy"),
  p_slime: P_("아기 점액", 2, "9초마다 보호막 7%", { kind: "shield", t: 9, v: 0.07 }, null, "drop", null, "a cute tiny purple slime blob"),
  p_batfairy: P_("박쥐 요정", 3, "흡혈 3%", { kind: "none" }, { ls: 0.03 }, "drop", null, "a cute bat fairy with tiny wings"),
  p_stonespirit: P_("돌 정령", 3, "받는 피해 -10%", { kind: "none" }, { dr: 0.1 }, "drop", null, "a cute small stone golem spirit with glowing runes"),
  // --- 스토리 5 ---
  p_bandi: P_("반디", 2, "밝기 +40%, 1.3초마다 빛 (50%)", { kind: "shoot", t: 1.3, d: 0.5, home: true }, { light: 0.4 }, "story", { stat: "story_start", n: 1, text: "스토리 시작" }, "a cute glowing firefly spirit girl, tiny"),
  p_halmicat: P_("할멈의 고양이", 2, "8초마다 체력 4% 회복", { kind: "heal", t: 8, v: 0.04 }, null, "story", { stat: "story_boss1", n: 1, text: "1층 최종보스" }, "a cute old grey cat wearing a tiny hanbok vest"),
  p_frostfox: P_("서리 여우", 3, "3.5초마다 주변 적 얼림", { kind: "freeze", t: 3.5, d: 0.3 }, null, "story", { stat: "story_boss2", n: 1, text: "2층 최종보스" }, "a cute frost fox with icy blue fur"),
  p_salamander: P_("화염 도롱뇽", 3, "0.9초마다 불꽃 (60%, 불태움)", { kind: "shoot", t: 0.9, d: 0.6, burn: true }, null, "story", { stat: "story_boss3", n: 1, text: "3층 최종보스" }, "a cute fire salamander with glowing lava spots"),
  p_crow: P_("저승 까마귀", 4, "1.4초마다 번개 사슬 5명 (70%)", { kind: "chain", t: 1.4, d: 0.7 }, { crit: 0.05 }, "story", { stat: "story_boss5", n: 1, text: "5층 최종보스" }, "a cute underworld crow with purple soul flames"),
};
const PET_KEYS = Object.keys(PETS);
const PET_DROP = { mob: 0.002, elite: 0.02, boss: 0.05 };

// 칭호 30
const T_ = (name, rar, desc, m, how, c) => ({ name, rar, desc, m, how, c });
const TITLES = {
  // --- 가챠 10 ---
  t_walker: T_("어둠 걷는 자", 1, "이동 속도 +4%", { spd: 0.04 }, "gacha"),
  t_lucky: T_("운수 좋은 날", 1, "엽전 +15%", { gold: 0.15 }, "gacha"),
  t_iron: T_("무쇠 심장", 1, "받는 피해 -3%", { dr: 0.03 }, "gacha"),
  t_swift: T_("번개 손", 2, "공격 속도 +7%", { as: 0.07 }, "gacha"),
  t_sage: T_("도를 깨친 자", 2, "스킬 대기 -6%", { cdr: 0.06 }, "gacha"),
  t_hawk: T_("매의 눈동자", 2, "치명타 +5%", { crit: 0.05 }, "gacha"),
  t_lamp: T_("꺼지지 않는 등불", 2, "초당 체력 0.2% 회복, 밝기 +15%", { regen: 0.002, light: 0.15 }, "gacha"),
  t_coin: T_("엽전 부자", 3, "엽전 +30%, 코인 드롭 +15%", { gold: 0.3, coinLuck: 0.15 }, "gacha"),
  t_storm: T_("폭풍을 부르는 자", 3, "궁극기 대기 -12%", { ultcd: 0.12 }, "gacha"),
  t_heaven: T_("하늘이 고른 자", 4, "공격력 +8%, 치명타 +5%, 치명타 피해 +15%", { atk: 0.08, crit: 0.05, critdmg: 0.15 }, "gacha"),
  // --- 미션 10 ---
  t_first: T_("첫 사냥꾼", 1, "공격력 +3%", { atk: 0.03 }, "mission", { stat: "kills", n: 50, text: "요괴 50마리" }),
  t_hundred: T_("백인참", 2, "공격력 +5%", { atk: 0.05 }, "mission", { stat: "kills", n: 500, text: "요괴 500마리" }),
  t_slayer: T_("보스 잡는 자", 3, "보스에게 주는 피해 +15%", { bossDmg: 0.15 }, "mission", { stat: "bosses", n: 10, text: "보스 10마리" }),
  t_explorer: T_("미궁 탐험가", 2, "이동 +5%, 엽전 +10%", { spd: 0.05, gold: 0.1 }, "mission", { stat: "rooms", n: 100, text: "방 100개" }),
  t_veteran: T_("백전노장", 3, "최대 체력 +8%", { hp: 0.08 }, "mission", { stat: "maxLevel", n: 25, text: "한 판 레벨 25" }),
  t_endless: T_("끝없는 도전자", 3, "궁극기 대기 -8%, 공격력 +4%", { ultcd: 0.08, atk: 0.04 }, "mission", { stat: "endlessBest", n: 25, text: "무한의 방 25번째 방" }),
  t_duelist: T_("결투의 달인", 3, "치명타 +6%", { crit: 0.06 }, "mission", { stat: "duelWins", n: 10, text: "1대1 10승" }),
  t_collector: T_("수집가", 2, "코인 드롭 +15%", { coinLuck: 0.15 }, "mission", { stat: "charsOwned", n: 10, text: "영웅 10명" }),
  t_gambler: T_("뽑기의 신", 3, "엽전 +20%, 코인 드롭 +10%", { gold: 0.2, coinLuck: 0.1 }, "mission", { stat: "pulls", n: 100, text: "뽑기 100번" }),
  t_together: T_("함께하는 등불", 2, "초당 체력 0.3% 회복", { regen: 0.003 }, "mission", { stat: "multiPlays", n: 5, text: "멀티 5번" }),
  // --- 특수 미션 5 ---
  t_flawless: T_("무결", 4, "받는 피해 -8%", { dr: 0.08 }, "special", { stat: "noHitFloor", n: 3, text: "맞지 않고 스테이지 3번" }),
  t_brink: T_("벼랑 끝의 승리", 4, "흡혈 3%, 공격력 +5%", { ls: 0.03, atk: 0.05 }, "special", { stat: "bossLowHp", n: 3, text: "체력 15% 이하로 보스 3번" }),
  t_gale: T_("질풍", 3, "이동 +8%, 공격 속도 +6%", { spd: 0.08, as: 0.06 }, "special", { stat: "fastClear", n: 10, text: "10초 안에 방 정리 10번" }),
  t_unyielding: T_("불굴", 3, "최대 체력 +10%", { hp: 0.1 }, "special", { stat: "deaths", n: 20, text: "20번 쓰러지기" }),
  t_legend: T_("전설의 사냥꾼", 4, "치명타 피해 +30%", { critdmg: 0.3 }, "special", { stat: "elites", n: 100, text: "정예 100마리" }),
  // --- 스토리 5 ---
  // 요괴록 도감 층 완성 (11-12)
  t_dex1: T_("석굴의 기록자", 2, "공격력 +4%", { atk: 0.04 }, "special", { stat: "dex_f1", n: 11, text: "1층 도감 11종 완성" }),
  t_dex2: T_("서리의 기록자", 2, "최대 체력 +4%", { hp: 0.04 }, "special", { stat: "dex_f2", n: 11, text: "2층 도감 11종 완성" }),
  t_dex3: T_("불길의 기록자", 3, "공격력 +5%", { atk: 0.05 }, "special", { stat: "dex_f3", n: 11, text: "3층 도감 11종 완성" }),
  t_dex4: T_("늪의 기록자", 3, "치명타 +5%", { crit: 0.05 }, "special", { stat: "dex_f4", n: 11, text: "4층 도감 11종 완성" }),
  t_dex5: T_("요괴록의 주인", 4, "공격력 +8%, 최대 체력 +8%", { atk: 0.08, hp: 0.08 }, "special", { stat: "dexAll", n: 55, text: "요괴록 도감 55종 모두 완성" }),
  t_new: T_("초보 토벌꾼", 1, "최대 체력 +3%", { hp: 0.03 }, "story", { stat: "story_start", n: 1, text: "스토리 시작" }),
  t_cave: T_("석굴을 지난 자", 2, "받는 피해 -4%", { dr: 0.04 }, "story", { stat: "story_floor2", n: 1, text: "스토리 2층 도달" }),
  t_flame: T_("불길을 넘은 자", 3, "공격력 +6%", { atk: 0.06 }, "story", { stat: "story_floor4", n: 1, text: "스토리 4층 도달" }),
  t_dawn: T_("새벽을 연 사람", 4, "치명타 +6%, 치명타 피해 +25%", { crit: 0.06, critdmg: 0.25 }, "story", { stat: "storyClear", n: 1, text: "스토리 완료" }),
  t_king: T_("미궁의 왕", 4, "공격력 +8%, 최대 체력 +8%, 스킬 대기 -6%", { atk: 0.08, hp: 0.08, cdr: 0.06 }, "story", { stat: "storyClear", n: 3, text: "스토리 3번 완료" }),
};
const TITLE_KEYS = Object.keys(TITLES);
const gachaPool = (T) => Object.keys(T).filter((k) => T[k].how === "gacha");

for (const k of ART_KEYS) ARTIFACTS[k].img = "ic_" + k;
for (const k of PET_KEYS) PETS[k].img = "ic_" + k;

// 11-20 설명 글 컨셉 대개편 (gen_concept_text.py 가 만듦 — 직접 고치지 말고 캐시 수정 뒤 다시 실행)
const CONCEPT_TEXT = {
"boon:atk": {
"name": "날 선 칼",
"lore": "대장간 불에 사흘 밤낮 벼려 서슬이 시퍼레진 칼이라 한다.",
"desc": "공격력 +12%"
},
"boon:hp": {
"name": "두꺼운 갑옷",
"lore": "산군의 발톱도 튕겨냈다는 쇠비늘 갑옷이 고갯마루에 전하지.",
"desc": "최대 체력 +15%"
},
"boon:spd": {
"name": "바람 신발",
"lore": "신고 달리면 한양 천 리도 하룻밤이라 하더라.",
"desc": "이동 속도 +10%"
},
"boon:as": {
"name": "가벼운 손",
"lore": "소매 속에서 손이 먼저 나간다더니 눈 깜짝할 새였지.",
"desc": "기본 공격 속도 +15%"
},
"boon:crit": {
"name": "매의 눈",
"lore": "백 걸음 밖 반딧불도 놓치지 않는 매의 눈이라 하지.",
"desc": "치명타 확률 +8%"
},
"boon:cdr": {
"name": "부적 다발",
"lore": "무당이 붉은 먹으로 쓴 부적 한 다발이면 주문이 절로 돈다.",
"desc": "스킬 대기 -8%"
},
"boon:dr": {
"name": "돌 피부",
"lore": "돌장승 곁에서 자란 아이는 살갗이 돌 같다지.",
"desc": "받는 피해 -7%"
},
"boon:regen": {
"name": "약초 주머니",
"lore": "산삼 뿌리 말린 약초 주머니를 품으면 상처가 절로 아물더라.",
"desc": "초당 체력 0.4% 회복"
},
"boon:gold": {
"name": "복주머니",
"lore": "복주머니 끈을 맨 날엔 엽전이 비 오듯 쏟아졌다더라.",
"desc": "엽전 획득 +30%"
},
"boon:critdmg": {
"name": "급소 찌르기",
"lore": "급소를 한 번 찔린 귀신은 다시 일어난 적이 없다지.",
"desc": "치명타 피해 +35%"
},
"boon:ls": {
"name": "피의 맹세",
"lore": "피로 맺은 맹세는 어긴 자의 목숨을 가져간다 하지.",
"desc": "준 피해의 4%만큼 체력을 빨아들임"
},
"boon:thorns": {
"name": "가시 갑옷",
"lore": "가시나무 숲에서 갑옷을 지은 대장장이의 손이 성할 날 없었지.",
"desc": "맞으면 때린 자에게 내 공격력의 150%를 되돌려줌"
},
"boon:multi": {
"name": "갈래 기운",
"lore": "한 줄기 기운이 갈래갈래 흩어져 날아간다 하지.",
"desc": "화살 +1 (원거리 기본 공격)"
},
"boon:wide": {
"name": "넓은 베기",
"lore": "한 번 휘두르면 풀밭이 눕고 귀신도 물러선다지.",
"desc": "근접 공격 범위 +20%, 폭발 범위 +15%"
},
"boon:burn": {
"name": "불씨 깃든 칼",
"lore": "도깨비불을 칼날에 앉히면 닿는 것마다 타들어 간다지.",
"desc": "기본 공격이 적을 불태움 (3초 동안 60%)"
},
"boon:chill": {
"name": "서릿발 칼",
"lore": "삼동 서릿발을 먹인 칼은 닿기만 해도 몸이 얼어붙는다.",
"desc": "기본 공격이 적을 1초 동안 느리게 만듦"
},
"boon:shieldRoom": {
"name": "호신 부적",
"lore": "문턱을 넘을 때마다 호신 부적이 은은히 빛났다.",
"desc": "방에 들어갈 때마다 체력 15%만큼 보호막"
},
"boon:ultcd": {
"name": "깨달음",
"lore": "참선 삼 년에 문득 한 소식을 얻으니 천지가 환하더라.",
"desc": "궁극기(R) 대기 -20%"
},
"boon:arc": {
"name": "꼬리 문 벼락",
"lore": "벼락이 한 놈을 치면 곁의 놈에게 꼬리를 문다지.",
"desc": "치명타가 터지면 번개가 3명에게 튐 (80%)"
},
"boon:explode": {
"name": "송장 불벼락",
"lore": "한 맺힌 원귀가 스러질 때 송장이 터져 불벼락이 쳤다.",
"desc": "적이 죽으면 주변에 100% 폭발"
},
"boon:glass": {
"name": "깨질 옥검",
"lore": "옥으로 빚은 칼은 천하를 가르나 한 번 부딪히면 깨진다지.",
"desc": "공격력 +40%, 받는 피해 +15%"
},
"boon:execute": {
"name": "저승사자 낫",
"lore": "저승사자가 낫을 들면 명이 다한 자는 이름이 지워진다지.",
"desc": "체력 12% 이하 적을 맞힐 때마다 25% 확률로 즉시 처치 (보스 제외)"
},
"boon:echo": {
"name": "산울림",
"lore": "빈 골짜기에서 외친 주문이 산울림 되어 되돌아오더라.",
"desc": "스킬을 쓸 때 25% 확률로 대기 초기화"
},
"boon:duo_blade": {
"name": "검귀의 눈",
"lore": "칼 쓰는 귀신은 눈빛만으로도 약점을 꿰뚫는다 하지.",
"desc": "[조합] 매의 눈+급소 찌르기 → 치명타 +10%, 치명타 피해 +40%"
},
"boon:duo_thorn": {
"name": "가시 철벽",
"lore": "가시 돋친 성벽 앞에선 호랑이도 꼬리를 말았다지.",
"desc": "[조합] 가시 갑옷+돌 피부 → 받는 피해 -10%, 반사 +100%"
},
"boon:duo_blood": {
"name": "피바람",
"lore": "피비린 바람이 한바탕 불면 칼춤이 멎을 줄 몰랐다지.",
"desc": "[조합] 피의 맹세+가벼운 손 → 피해 흡수 +3%, 공격 속도 +20%"
},
"boon:duo_flame": {
"name": "불꽃 회오리",
"lore": "불길이 칼끝을 타고 돌며 온 들판을 붉게 휩쓸었다지.",
"desc": "[조합] 불씨 깃든 칼+넓은 베기 → 공격력 +15%, 범위 +15%"
},
"boon:duo_sage": {
"name": "도사의 경지",
"lore": "부적과 산울림을 다스리는 도사는 시간마저 접는다지.",
"desc": "[조합] 부적 다발+산울림 → 스킬 대기 -10%, 산울림 +10%"
},
"boon:phoenixPerk": {
"name": "봉황 깃털",
"lore": "잿더미 속에서도 다시 날아오른 봉황의 깃털이라지.",
"desc": "한 번 쓰러져도 체력 40%로 일어남"
},
"active:ac_earth_bolt": {
"name": "지신 구슬",
"lore": "지신이 노하면 흙덩이가 솟구쳐 적을 쓰러뜨린다지.",
"desc": "구슬 1발이 각각 220% 피해를 주고 기절시킴"
},
"active:ac_frost_chain": {
"name": "서리 사슬",
"lore": "북녘 원귀가 끌고 다녔다는 얼음 사슬은 한 번 울면 사방이 언다지.",
"desc": "적 5명에게 튀며 각 160%"
},
"active:ac_thunder_ward": {
"name": "벽력 결계",
"lore": "뇌공이 부적 둘레에 벼락을 둘러 사악한 것을 막았다지.",
"desc": "내 자리에 결계를 펼침 (안에서 받는 피해 -28%, 적에게 초당 90%)"
},
"active:ac_wind_dash": {
"name": "질풍 돌격",
"lore": "산바람을 타고 내달리면 고갯길도 한달음이라 하였다.",
"desc": "돌진 200% + 끝에 120% 폭발 · 밀쳐냄"
},
"active:ac_poison_field": {
"name": "독안개",
"lore": "독버섯 숲에서 피어오른 안개는 닿는 이마다 시들게 했다지.",
"desc": "가리킨 곳에 5초간 독안개 (초당 130%)"
},
"active:ac_poison_dash": {
"name": "독무 질주",
"lore": "독사 요괴가 지나간 자리엔 풀도 눕고 냄새만 남았다지.",
"desc": "돌진 200% + 끝에 120% 폭발 · 중독"
},
"active:ac_fire_field": {
"name": "불바다",
"lore": "도깨비불이 번져 한밤 들판이 온통 붉게 타올랐다지.",
"desc": "가리킨 곳에 5초간 불바다 (초당 130%)"
},
"active:ac_wind_beam": {
"name": "바람 가르기",
"lore": "대숲을 가르던 매서운 바람이 한 줄기 칼날이 되었다지.",
"desc": "일직선으로 쏘는 바람줄기 340%"
},
"active:ac_wind_field": {
"name": "돌개바람",
"lore": "고개 너머 돌개바람이 한자리에 눌러앉아 떠나지 않았다지.",
"desc": "가리킨 곳에 5초간 돌개바람 (초당 130%)"
},
"active:ac_light_bolt": {
"name": "서광 구슬",
"lore": "새벽 절집 등불에서 떨어진 빛 한 알이 어둠을 꿰뚫었다지.",
"desc": "구슬 1발 각 220%, 체력 6% 회복"
},
"active:ac_fire_burst": {
"name": "홍염 작렬",
"lore": "성난 불의 요괴가 숨을 몰아 내쉬면 사방이 화르르 탔다지.",
"desc": "주변 240% 폭발 · 불태움"
},
"active:ac_dark_chain": {
"name": "저승 사슬",
"lore": "저승사자의 허리춤에서 풀려난 사슬은 이름을 부르며 따른다지.",
"desc": "적 5명에게 튀며 각 160%"
},
"active:ac_water_chain": {
"name": "물귀신 사슬",
"lore": "깊은 소의 물귀신은 사슬처럼 발목을 휘감아 끌어당긴다지.",
"desc": "적 5명에게 튀며 각 160%"
},
"active:ac_earth_beam": {
"name": "지맥 관통",
"lore": "산맥의 뼈대를 타고 솟은 기운이 한 줄로 땅을 갈랐다지.",
"desc": "일직선으로 쏘는 땅기운 줄기 340%"
},
"active:ac_dark_bolt": {
"name": "흡혼 구슬",
"lore": "굶주린 혼이 뭉친 검은 구슬은 맞은 이의 기운을 빨아 먹는다지.",
"desc": "구슬 1발 각 220% · 피를 빨아 회복"
},
"active:ac_dark_ward": {
"name": "야음 결계",
"lore": "해 진 뒤 무당이 먹물로 금을 그으면 밤이 담이 된다지.",
"desc": "내 자리에 결계를 펼침 (안에서 받는 피해 -28%, 적에게 초당 90%)"
},
"active:ac_poison_beam": {
"name": "독룡 줄기",
"lore": "독룡이 내뱉은 숨결이 한 줄기로 뻗어 숲을 시들게 했다지.",
"desc": "일직선으로 쏘는 독기 줄기 340%"
},
"active:ac_frost_ward": {
"name": "설한 결계",
"lore": "겨울 산신이 눈서리로 둘러친 울타리엔 잡귀도 못 든다지.",
"desc": "내 자리에 결계를 펼침 (안에서 받는 피해 -28%, 적에게 초당 90%)"
},
"active:ac_frost_bless": {
"name": "서리 가호",
"lore": "눈 내린 서낭당 앞에서 빌면 서릿발 같은 기운이 깃든다지.",
"desc": "7초간 공격력 +15%·공격 속도 +10%, 체력 8% 회복"
},
"active:ac_wind_orbit": {
"name": "풍륜 부적",
"lore": "무당이 날린 부적이 바람을 타고 몸을 맴돌았다지.",
"desc": "7초 동안 4개가 몸을 돌며 각 85%"
},
"active:ac_water_dash": {
"name": "급류 돌격",
"lore": "장마철 여울물이 불어나듯 거침없이 몰아쳤다고 전한다.",
"desc": "돌진 200% + 끝에 120% 폭발 · 느려짐·밀쳐냄"
},
"active:ac_earth_burst": {
"name": "땅울음",
"lore": "땅속에 잠자던 지신이 깨어나 발을 구르면 산도 휘청였다지.",
"desc": "주변 240% 폭발 · 기절"
},
"active:ac_thunder_burst": {
"name": "날벼락",
"lore": "하늘이 노하여 내리친 날벼락에 마을 느티나무가 쪼개졌다지.",
"desc": "주변 240% 폭발 · 짧은 기절"
},
"active:ac_dark_field": {
"name": "흑암 늪",
"lore": "달 없는 밤 늪가에 고인 어둠은 발을 붙들고 놓지 않는다지.",
"desc": "가리킨 곳에 5초간 어둠이 깔림 (초당 130%)"
},
"active:ac_dark_rain": {
"name": "먹물비",
"lore": "먹구름 아래 검은 빗방울이 지붕을 두드리면 화를 입는다지.",
"desc": "가리킨 곳 주변에 5번 떨어져 각 170%"
},
"active:ac_water_field": {
"name": "물귀신 늪",
"lore": "비 온 뒤 생긴 웅덩이마다 물귀신이 손을 뻗고 기다린다지.",
"desc": "가리킨 곳에 5초간 물늪이 고임 (초당 130%)"
},
"active:ac_frost_beam": {
"name": "서릿발",
"lore": "한겨울 처마 끝 서릿발이 곧게 뻗어 적을 꿰뚫었다지.",
"desc": "일직선으로 쏘는 서리 줄기 340%"
},
"active:ac_light_burst": {
"name": "해돋이",
"lore": "해돋이 때 절간 종소리와 함께 퍼진 빛이 어둠을 몰아냈다지.",
"desc": "주변 240% 폭발, 체력 6% 회복"
},
"active:ac_thunder_bless": {
"name": "뇌신 가호",
"lore": "뇌신께 정화수를 올리면 번갯불 같은 기운이 깃든다 하였다.",
"desc": "7초간 공격력 +15%·공격 속도 +10%, 체력 8% 회복"
},
"active:ac_soul_burst": {
"name": "혼불 작렬",
"lore": "터져 나온 혼불이 닿으면 낙인처럼 약한 곳이 드러난다지.",
"desc": "주변 240% 폭발 · 받는 피해 +20% 표식"
},
"active:ac_thunder_orbit": {
"name": "뇌공 구슬",
"lore": "뇌공이 구슬을 굴리자 번갯불이 주위를 빙글 맴돌았다지.",
"desc": "7초 동안 4개가 몸을 돌며 각 85%"
},
"active:ac_light_field": {
"name": "달빛 서린 터",
"lore": "보름달이 머문 자리에선 다친 짐승도 상처가 아문다 했지.",
"desc": "가리킨 곳에 5초간 달빛이 고인다 (초당 130%), 체력 6% 회복"
},
"active:ac_soul_orbit": {
"name": "혼불 맴돌이",
"lore": "혼불 네 개가 무당 곁을 맴돌며 밤새 지켰다 하지.",
"desc": "7초 동안 혼불 4개가 돌며 각 85%"
},
"active:ac_light_rain": {
"name": "별똥비",
"lore": "그믐밤 하늘이 갈라지며 별똥이 비처럼 쏟아졌다더라.",
"desc": "가리킨 곳 둘레에 5번 내리꽂혀 각 170%, 체력 6% 회복"
},
"active:ac_dark_beam": {
"name": "먹빛 줄기",
"lore": "붓끝에서 먹 한 획 그으니 어둠이 칼날처럼 곧게 뻗었다.",
"desc": "곧게 뻗는 먹빛 줄기 340%"
},
"active:ac_dark_burst": {
"name": "먹물 터짐",
"lore": "먹물 항아리가 깨지자 어둠이 사방으로 터져 나갔다.",
"desc": "주변 240% 폭발 · 흡혈"
},
"active:ac_dark_dash": {
"name": "그림자 달음",
"lore": "그림자는 주인보다 먼저 달려가 적의 목덜미를 문다.",
"desc": "돌진 200% + 끝에 120% 폭발 · 흡혈"
},
"active:ac_frost_dash": {
"name": "서리 달음",
"lore": "서릿발 밟고 달리면 지나온 길이 하얗게 얼어붙지.",
"desc": "돌진 200% + 끝에 120% 폭발 · 느려짐"
},
"active:ac_light_beam": {
"name": "달빛 줄기",
"lore": "달빛 한 줄기가 귀신 낀 골짜기를 곧게 갈랐다지.",
"desc": "곧게 뻗는 빛줄기 340%, 체력 6% 회복"
},
"active:ac_dark_bless": {
"name": "먹빛 가호",
"lore": "먹빛 두루마기 걸친 무당이 어둠의 가호를 빌었다.",
"desc": "7초 공격력 +15%·공격 속도 +10%, 체력 8% 회복"
},
"active:ac_soul_beam": {
"name": "혼불 줄기",
"lore": "저승길 밝히던 혼불이 한 줄로 모여 적을 꿰뚫었다.",
"desc": "곧게 뻗는 혼불 줄기 340%"
},
"active:ac_poison_bless": {
"name": "독기 가호",
"lore": "독초 달인 물로 부적을 적시면 몸에 독기가 돈다지.",
"desc": "7초 공격력 +15%·공격 속도 +10%, 체력 8% 회복"
},
"active:ac_thunder_field": {
"name": "벼락 서린 터",
"lore": "벼락 맞은 대추나무 아래엔 잡귀가 얼씬도 못 했다.",
"desc": "가리킨 곳에 5초간 벼락이 내린다 (초당 130%)"
},
"active:ac_fire_chain": {
"name": "불똥 사슬",
"lore": "도깨비불이 이 놈 저 놈 옮겨 붙으며 사슬처럼 이어졌다.",
"desc": "적 5명에게 튀며 각 160%"
},
"active:ac_wind_rain": {
"name": "바람 소나기",
"lore": "산마루 회오리가 한바탕 몰아치며 소나기처럼 내리쳤다.",
"desc": "가리킨 곳 둘레에 5번 내리꽂혀 각 170%"
},
"active:ac_earth_bless": {
"name": "지신 가호",
"lore": "산신령께 막걸리 올리니 땅이 든든히 받쳐 주었다.",
"desc": "7초 공격력 +15%·공격 속도 +10%, 체력 8% 회복"
},
"active:ac_earth_field": {
"name": "흙먼지 터",
"lore": "누런 흙먼지가 자욱한 곳엔 발 디딘 요괴가 오래 못 버텼다.",
"desc": "가리킨 곳에 5초간 흙먼지가 인다 (초당 130%)"
},
"active:ac_poison_chain": {
"name": "독기 사슬",
"lore": "독 묻은 침이 이 놈 저 놈 옮겨 가며 퍼져 나갔다.",
"desc": "적 5명에게 튀며 각 160%"
},
"active:ac_soul_bless": {
"name": "혼불 가호",
"lore": "혼불을 입에 머금고 빌면 넋이 한결 가벼워진다지.",
"desc": "7초 공격력 +15%·공격 속도 +10%, 체력 8% 회복"
},
"active:ac_light_chain": {
"name": "달빛 사슬",
"lore": "달빛이 고리처럼 이어져 어둠 속 요괴를 하나씩 엮었다.",
"desc": "적 5명에게 튀며 각 160%, 체력 6% 회복"
},
"active:ac_fire_bolt": {
"name": "벼린 불화살",
"lore": "대장간에서 벼린 부적 화살엔 불씨가 깃들어 있었다.",
"desc": "탄 1발 각 297% · 불태움"
},
"active:ac_wind_bolt": {
"name": "벼린 바람살",
"lore": "바람을 벼려 쏜 살은 맞은 요괴를 멀리 날려 보냈다.",
"desc": "탄 1발 각 297% · 밀쳐냄"
},
"active:ac_poison_bolt": {
"name": "벼린 독침",
"lore": "독을 먹여 벼린 침 한 방에 요괴도 스르르 시들었다.",
"desc": "탄 1발 각 297% · 중독"
},
"active:ac_soul_dash": {
"name": "벼린 혼달음",
"lore": "벼린 혼불이 적을 스치면 그 이름에 저승 낙인이 찍혔다.",
"desc": "돌진 270% + 끝에 162% 폭발 · 받는 피해 +20% 표식"
},
"active:ac_fire_ward": {
"name": "벼린 불결계",
"lore": "불씨를 빙 둘러 놓으니 잡귀는 다가서지도 못했다.",
"desc": "내 자리에 결계 (안에서 피해 -31%, 적 초당 122%)"
},
"active:ac_light_orbit": {
"name": "벼린 달무리",
"lore": "벼린 달무리 네 줄기가 밤새 주인 곁을 돌며 지켰다.",
"desc": "7초 동안 4개가 돌며 각 115%, 체력 8% 회복"
},
"active:ac_thunder_bolt": {
"name": "벼린 벼락살",
"lore": "벼락 맞은 쇠로 만든 살은 맞으면 한동안 넋을 잃는다지.",
"desc": "탄 1발 각 297% · 짧은 기절"
},
"active:ac_water_orbit": {
"name": "벼린 물맴이",
"lore": "개울물 구슬 네 개가 도르르 돌며 사악한 기운을 씻었다.",
"desc": "7초 동안 4개가 돌며 각 115%"
},
"active:ac_light_ward": {
"name": "벼린 달결계",
"lore": "달빛으로 친 금줄 안에선 귀신도 힘을 쓰지 못했다지.",
"desc": "내 자리에 결계 (안에서 피해 -31%, 적 초당 122%), 체력 8% 회복"
},
"active:ac_wind_bless": {
"name": "벼린 바람굿",
"lore": "바람굿 한 판에 풍신이 내려와 몸이 새털처럼 가벼웠다.",
"desc": "7초 공격력 +20%·공격 속도 +14%, 체력 11% 회복"
},
"active:ac_fire_beam": {
"name": "벼린 불줄기",
"lore": "벼린 화염이 한 줄로 뻗어 고목도 요괴도 재가 되었다.",
"desc": "곧게 뻗는 불줄기 459%"
},
"active:ac_water_rain": {
"name": "비수 소나기",
"lore": "처마 끝 빗방울이 칼날처럼 벼려져 내린다는 소나기 괴담이다.",
"desc": "가리킨 곳 주변에 6번 떨어져 각 230%"
},
"active:ac_wind_burst": {
"name": "칼바람",
"lore": "고갯마루 칼바람이 한꺼번에 터지면 갓도 날아간다지.",
"desc": "주변 324% 폭발 · 밀쳐냄"
},
"active:ac_earth_dash": {
"name": "바위치기",
"lore": "산신의 바위가 굴러 내려 길 위의 것을 모조리 짓눌렀다지.",
"desc": "돌진 270% + 끝에 162% 폭발 · 기절"
},
"active:ac_water_burst": {
"name": "물보라",
"lore": "용왕의 노여움이 물기둥으로 솟아 뭍것들을 밀어냈다 한다.",
"desc": "주변 324% 폭발 · 느려짐·밀쳐냄"
},
"active:ac_fire_orbit": {
"name": "도깨비불",
"lore": "도깨비불 네 덩이가 주인 곁을 맴돌며 밤길을 지켰다지.",
"desc": "7초 동안 4개가 돌며 각 115%"
},
"active:ac_frost_bolt": {
"name": "서리살",
"lore": "삼동 설한풍을 화살촉에 얼려 쏘았다는 사냥꾼의 이야기다.",
"desc": "서리 구슬 1발, 각 297% · 느려짐"
},
"active:ac_poison_rain": {
"name": "독침비",
"lore": "독초 달인 물이 먹구름에 섞여 내렸다는 흉흉한 소문이다.",
"desc": "가리킨 곳 주변에 6번 떨어져 각 230%"
},
"active:ac_dark_orbit": {
"name": "먹구슬",
"lore": "먹빛 어둠이 구슬이 되어 저승길 나그네를 따라 돈다지.",
"desc": "7초 동안 4개가 돌며 각 115%"
},
"active:ac_frost_burst": {
"name": "서리꽃",
"lore": "한지 창에 피던 서리꽃이 한순간에 사방으로 터져 번졌다.",
"desc": "주변 324% 폭발 · 느려짐"
},
"active:ac_fire_bless": {
"name": "불의 가호",
"lore": "무당이 불꽃 앞에 빌면 몸에 뜨거운 기운이 깃든다지.",
"desc": "7초 동안 공격력 +20%·공격 속도 +14%, 체력 11% 회복"
},
"active:ac_poison_orbit": {
"name": "독나비떼",
"lore": "독 묻은 나비 떼가 주인 둘레를 돌며 날개를 떤다지.",
"desc": "7초 동안 4개가 돌며 각 115%"
},
"active:ac_fire_dash": {
"name": "불수레",
"lore": "불수레가 고갯길을 내달리면 풀 한 포기 남지 않았다지.",
"desc": "돌진 270% + 끝에 162% 폭발 · 불태움"
},
"active:ac_frost_field": {
"name": "서리터",
"lore": "서리 귀신이 밟고 간 자리엔 풀도 얼어붙어 눈물만 남았다.",
"desc": "가리킨 곳에 5초간 서리가 내린 자리를 만든다 (초당 176%)"
},
"active:ac_thunder_beam": {
"name": "벼락줄기",
"lore": "뇌공이 북을 두드리면 하늘에서 한 줄기 불벼락이 꽂힌다.",
"desc": "곧게 뻗는 번개줄기 459%"
},
"active:ac_thunder_dash": {
"name": "뇌공 질주",
"lore": "번개를 타고 달린 장수가 닿는 곳마다 천둥이 울렸다지.",
"desc": "돌진 360% + 끝에 216% 폭발 · 짧은 기절"
},
"active:ac_frost_rain": {
"name": "얼음우박",
"lore": "한여름에도 삼십 리 밖까지 우박이 쏟아졌다는 괴이한 해다.",
"desc": "가리킨 곳 주변에 7번 떨어져 각 306%"
},
"active:ac_water_beam": {
"name": "용천수",
"lore": "용의 입에서 뿜은 물줄기가 바위도 꿰뚫었다고들 한다.",
"desc": "곧게 뿜는 물줄기 612%"
},
"active:ac_poison_ward": {
"name": "독안개진",
"lore": "독무가 자욱한 진 안에서는 범도 쉬이 들어서지 못했다지.",
"desc": "내 자리에 결계 (안에서 피해 -34%, 적 초당 162%)"
},
"active:ac_soul_rain": {
"name": "혼불비",
"lore": "스러진 혼불이 비처럼 쏟아져 원한을 갚으러 내려온다지.",
"desc": "가리킨 곳 주변에 7번 떨어져 각 306%"
},
"active:ac_poison_burst": {
"name": "독꽃",
"lore": "독버섯 갓이 터지면 퍼진 포자에 숲이 시들어 갔다지.",
"desc": "주변 432% 폭발 · 중독"
},
"active:ac_wind_chain": {
"name": "바람사슬",
"lore": "바람신이 던진 쇠사슬이 이놈 저놈을 줄줄이 꿰었다지.",
"desc": "적 7명에게 튀며 각 288%"
},
"active:ac_water_ward": {
"name": "수막진",
"lore": "물장막이 둘러서면 날 선 것도 무디어진다고 전해진다.",
"desc": "내 자리에 결계 (안에서 피해 -34%, 적 초당 162%)"
},
"active:ac_soul_ward": {
"name": "넋 울타리",
"lore": "죽은 이의 넋이 울타리 되어 산 사람을 에워싼다지.",
"desc": "내 자리에 결계 (안에서 피해 -34%, 적 초당 162%)"
},
"active:ac_earth_rain": {
"name": "낙석비",
"lore": "산이 노하면 돌덩이가 비처럼 쏟아진다는 말이 있다.",
"desc": "가리킨 곳 주변에 7번 떨어져 각 306%"
},
"active:ac_soul_bolt": {
"name": "넋화살",
"lore": "넋을 깎아 만든 화살에 맞으면 저승 문이 열려 보인다지.",
"desc": "구슬 2발, 각 396% · 받는 피해 +20% 표식"
},
"active:ac_soul_field": {
"name": "혼불밭",
"lore": "혼불이 모여 밭을 이루면 산 것은 발을 디디지 못한다.",
"desc": "가리킨 곳에 6초간 혼불이 서린 자리를 만든다 (초당 234%)"
},
"active:ac_earth_orbit": {
"name": "돌도깨비",
"lore": "바위 도깨비 다섯이 주인을 둘러싸고 덩실덩실 돌았다지.",
"desc": "8초 동안 5개가 돌며 각 153%"
},
"active:ac_light_dash": {
"name": "서광 질주",
"lore": "새벽 빛줄기를 타고 달리면 상처마저 아문다고 전한다.",
"desc": "돌진 360% + 끝에 216% 폭발, 체력 11% 회복"
},
"active:ac_frost_orbit": {
"name": "눈꽃 고리",
"lore": "눈꽃 다섯 송이가 찬바람을 두르고 주인을 맴돈다지.",
"desc": "8초 동안 5개가 돌며 각 153%"
},
"active:ac_earth_chain": {
"name": "산신 사슬",
"lore": "산신이 땅의 맥을 사슬 삼아 뭇 놈을 줄줄이 엮었다지.",
"desc": "적 8명에게 튀며 각 384%"
},
"active:ac_earth_ward": {
"name": "지신의 결계",
"lore": "지신이 발을 구르면 땅이 일어나 나그네를 감싼다지",
"desc": "내 자리에 결계 (안에서 받는 피해 -39%, 적 초당 216%)"
},
"active:ac_water_bolt": {
"name": "용왕 물구슬",
"lore": "용왕이 뱉은 물구슬은 바위도 뚫고 적을 밀어낸다지",
"desc": "탄 2발 각 528% · 느려짐·밀쳐냄"
},
"active:ac_water_bless": {
"name": "용왕의 가호",
"lore": "용왕이 내린 물 한 모금에 지친 몸이 다시 일어난다지",
"desc": "8초 동안 공격력 +36%·공격 속도 +24%, 체력 19% 회복"
},
"active:ac_wind_ward": {
"name": "풍백의 결계",
"lore": "풍백이 부채질하면 바람 담이 서서 화살도 비껴간다지",
"desc": "내 자리에 결계 (안에서 받는 피해 -39%, 적 초당 216%)"
},
"active:ac_soul_chain": {
"name": "넋 잇는 사슬",
"lore": "죽은 넋과 넋을 엮은 사슬이 산 자를 하나씩 휘감는다",
"desc": "적 8명에게 튀며 각 384%"
},
"active:ac_thunder_rain": {
"name": "낙뢰비",
"lore": "먹구름이 울면 하늘이 벼락을 쏟아 마을을 쓸었다지",
"desc": "가리킨 곳 주변에 8번 떨어지며 각 408%"
},
"active:ac_fire_rain": {
"name": "별똥비",
"lore": "개벽의 밤, 하늘이 찢겨 불별이 쏟아졌다 전한다",
"desc": "가리킨 곳 주변에 9번 떨어지며 각 544% + 마지막 대폭발 960%"
},
"active:ac_thunder_chain": {
"name": "뇌신의 사슬",
"lore": "뇌신이 사슬을 휘두르니 번개가 줄줄이 적을 꿰었다",
"desc": "적 9명에게 튀며 각 512% + 벼락 10번"
},
"active:ac_light_bless": {
"name": "봉황의 가호",
"lore": "재가 된 봉황이 불꽃으로 되살아나 곁을 지킨다지",
"desc": "9초 동안 공격력 +48%·공격 속도 +32%, 체력 26% 회복 + 5초 무적"
},
"active:bx_shadow": {
"name": "그림자 탈",
"lore": "그림자 우두머리가 벗어 둔 가면엔 아직 어둠이 살아 있다지",
"desc": "순간이동하며 그림자 고리 2번 (각 300%) → 그림자 분신 3명 12초 → 4초 무적"
},
"active:bx_flame": {
"name": "화귀의 사슬",
"lore": "불꽃 귀신이 끌던 사슬엔 꺼지지 않는 원한이 타오른다",
"desc": "불꽃 돌진 3연속 (각 260%) → 8초 동안 몸에 불길 (초당 300%) + 공격력 +40%"
},
"active:bx_frost": {
"name": "서리장군 창",
"lore": "서리 장군이 창을 꽂은 자리마다 겨울이 따라온다지",
"desc": "십자 얼음창 4방향 (각 450%) → 방 넓게 3초 얼림"
},
"active:bx_toad": {
"name": "독주머니",
"lore": "두꺼비 왕이 독주머니를 터뜨리면 늪이 되어 번진다지",
"desc": "가리킨 곳으로 뛰어올라 착지 400% → 독 늪 8초 (초당 350%, 크게 느려짐) + 흡혈 10%"
},
"active:bx_reaper": {
"name": "염라의 낫",
"lore": "염라가 낫을 한번 휘두르면 저승문이 활짝 열린다지",
"desc": "혼령 탄 소용돌이 (12발 각 200%) → 가리킨 곳에 저승문 6초 (초당 400%, 체력 25% 이하 25% 확률 즉사)"
},
"active:bx_golem": {
"name": "수문장 돌",
"lore": "수문장은 돌로 빚어져 끝내 버티면 산도 물러선다지",
"desc": "받는 피해 -50% 5초 + 퍼지는 지진 고리 3번 (각 400%, 기절) + 돌기둥 낙하 8번"
},
"skill:cq_rock": {
"name": "돌팔매",
"lore": "아이도 쥐는 돌 한 알이 도깨비 이마를 깬다지",
"desc": "돌을 던져 150% 피해"
},
"skill:cq_cut": {
"name": "짧은 베기",
"lore": "주막 칼잡이가 숨 한 번 쉴 새에 긋는 짧은 칼질이라",
"desc": "앞쪽 160% 피해"
},
"skill:cq_needle": {
"name": "독침",
"lore": "보부상 짐 속 독침 하나면 호랑이도 비틀댄다지",
"desc": "독침 140% + 4초 중독"
},
"skill:cq_spin": {
"name": "회전 베기",
"lore": "몸을 팽이처럼 돌리면 사방의 잡귀가 물러난다지",
"desc": "주변 170% 피해"
},
"skill:cq_volley": {
"name": "연발 화살",
"lore": "포수의 활시위가 울리면 화살이 줄지어 날아간다지",
"desc": "화살 4발 각 130%"
},
"skill:cq_fireball": {
"name": "불덩이",
"lore": "도깨비불을 둥글게 뭉쳐 던지면 닿는 곳에서 터진다지",
"desc": "부딪히면 폭발 240%"
},
"skill:cq_chain": {
"name": "번개 사슬",
"lore": "번개가 이 사람 저 사람 건너뛰며 죄를 묻는다지",
"desc": "번개가 6명에게 튀며 각 220%"
},
"skill:cq_flash": {
"name": "천둥 일섬",
"lore": "천둥이 울리자 하늘에서 한 줄기 빛이 내리꽂혔다",
"desc": "직선 광선 520% + 기절"
},
"skill:cw_hop": {
"name": "발 구르기",
"lore": "발을 쾅 구르면 땅이 튕겨 몸이 앞으로 나간다지",
"desc": "가리킨 곳 쪽으로 짧게 돌진"
},
"skill:cw_run": {
"name": "빠른 걸음",
"lore": "축지법을 익히기 전, 나그네가 먼저 배우는 걸음이라",
"desc": "3초 동안 이동 +45%"
},
"skill:cw_shadow": {
"name": "그림자 걸음",
"lore": "달빛 아래 제 그림자를 밟고 건너가는 요괴의 걸음이라",
"desc": "가리킨 곳으로 순간이동"
},
"skill:cw_rush": {
"name": "돌진 베기",
"lore": "칼을 앞세워 몸째 부딪치는 무사의 막무가내 칼질이라",
"desc": "돌진하며 150% 피해"
},
"skill:cw_burst": {
"name": "축지 폭발",
"lore": "축지로 사라졌다 내려앉는 자리마다 땅이 터진다지",
"desc": "순간이동 후 착지 180%"
},
"skill:cw_wind": {
"name": "바람 장막",
"lore": "바람이 몸을 두르면 칼도 화살도 스치고 지나간다지",
"desc": "4초 동안 이동 +30%, 받는 피해 -30%"
},
"skill:cw_bolt": {
"name": "번개 이동",
"lore": "번개가 되어 내달리는 동안엔 저승사자도 못 잡는다지",
"desc": "번개처럼 돌진 260%, 무적"
},
"skill:cw_time": {
"name": "축지법",
"lore": "도사가 한 걸음에 천 리를 접었다는 축지의 비법이라 전한다.",
"desc": "순간이동하며 주변 적을 2초 동안 멈추고, 1.5초 동안 무적"
},
"skill:ce_aid": {
"name": "쑥뜸 손길",
"lore": "주막 할멈이 쑥을 찧어 상처에 붙여 주던 손길이지.",
"desc": "체력 14% 회복"
},
"skill:ce_board": {
"name": "널판 방패",
"lore": "뱃사공이 부서진 널빤지 하나로 파도를 버텼다는 이야기지.",
"desc": "체력 18%만큼 보호막"
},
"skill:ce_frost": {
"name": "서리 고리",
"lore": "한겨울 서리 귀신이 숨을 불면 마을 우물도 얼어붙었다지.",
"desc": "주변 적을 1.2초 동안 얼리고 90% 피해"
},
"skill:ce_vine": {
"name": "가시 덩굴",
"lore": "무덤가 가시덩굴은 지나는 발목을 놓아주지 않는다 했다.",
"desc": "가리킨 곳에 4초 동안 덩굴이 돋아 적을 느리게 하고 초당 90% 피해"
},
"skill:ce_spring": {
"name": "약수터",
"lore": "깊은 산골 약수터에서는 지친 나그네도 기운을 얻었다지.",
"desc": "6초 동안 초당 체력 4% 회복"
},
"skill:ce_wall": {
"name": "철벽",
"lore": "장승처럼 꿈쩍 않고 버티면 어떤 칼날도 무뎌진다 하였다.",
"desc": "4초 동안 받는 피해 -55%"
},
"skill:ce_sanct": {
"name": "오색 금줄",
"lore": "무당이 오색 끈으로 둘러친 자리엔 잡귀가 들지 못했다.",
"desc": "5초 동안 결계를 펼침 (안에서 받는 피해 -40%, 적에게 초당 130% 피해)"
},
"skill:ce_immortal": {
"name": "불사의 맹세",
"lore": "저승사자 앞에서 목숨 걸고 맺은 맹세는 명부도 지운다지.",
"desc": "3초 동안 무적 + 체력 30% 회복"
},
"skill:cr_boom": {
"name": "벽력탄",
"lore": "묵은 화약 독이 터지자 팔도가 한밤에도 환했다고 한다.",
"desc": "주변에 380% 피해를 주는 폭발"
},
"skill:cr_dogs": {
"name": "원혼 부르기",
"lore": "억울히 죽은 넋들이 주인의 부름에 개처럼 달려 나온다.",
"desc": "원혼 3마리를 10초 동안 부림"
},
"skill:cr_meteor": {
"name": "별똥비",
"lore": "밤하늘의 별이 쏟아진 날, 고을마다 불기둥이 솟았다지.",
"desc": "가리킨 곳 주변에 별똥별 6개가 떨어져 각 280% 피해"
},
"skill:cr_storm": {
"name": "화살 소나기",
"lore": "활 잘 쏘던 장수의 원한이 바람 속에서 화살로 돈다지.",
"desc": "가리킨 곳에 5초 동안 화살 폭풍 (초당 220% 피해)"
},
"skill:cr_dragon": {
"name": "용화",
"lore": "승천 못 한 이무기가 토해 낸 불길이 산을 태웠다 한다.",
"desc": "길게 뻗는 불길로 650% 피해"
},
"skill:cr_march": {
"name": "백골 행렬",
"lore": "달 없는 밤이면 백골들이 줄지어 고갯길을 넘는다지.",
"desc": "해골 병사 5명을 12초 동안 부림"
},
"skill:cr_thunder": {
"name": "뇌신 강림",
"lore": "뇌공이 북을 치면 하늘이 갈라지고 악귀가 떨었다 하더라.",
"desc": "적에게 벼락 14번, 각 300% 피해"
},
"skill:cr_heaven": {
"name": "천지개벽",
"lore": "하늘과 땅이 다시 갈라지던 날의 태초 이야기라 전한다.",
"desc": "방 전체에 900% 피해 + 2.5초 기절"
},
"shop:herb": {
"name": "약초 한 줌",
"lore": "보부상 짐 속 약초 한 줌이 열 의원보다 낫다 했지.",
"desc": "체력 40% 회복"
},
"shop:speed": {
"name": "날쌘 영약",
"lore": "산삼 달인 물을 마시면 몸이 바람처럼 가벼워진다지.",
"desc": "이번 원정 동안 공격 속도 +15%"
},
"shop:power": {
"name": "괴력 부적",
"lore": "무당이 붉은 먹으로 그린 부적엔 장사의 힘이 깃든다.",
"desc": "이번 원정 동안 공격력 +10%"
},
"shop:armor": {
"name": "철갑",
"lore": "대장장이가 도깨비불로 벼려 낸 갑옷은 칼도 튕겨 냈다.",
"desc": "이번 원정 동안 최대 체력 +15%"
},
"shop:eye": {
"name": "매의 깃",
"lore": "천 리 밖 쥐 한 마리도 놓치지 않던 매의 깃이라 한다.",
"desc": "이번 원정 동안 치명타 +6%"
},
"shop:wind": {
"name": "바람 짚신",
"lore": "도깨비가 신고 달리면 발자국이 바람에 지워졌다지.",
"desc": "이번 원정 동안 이동 속도 +10%"
},
"shop:coin": {
"name": "뽑기 패",
"lore": "보부상이 복을 점치라며 슬쩍 쥐여 주는 뽑기 패다.",
"desc": "뽑기 패 1개"
},
"art:a_whet": {
"name": "숫돌",
"lore": "장터 대장간 숫돌에는 수많은 칼의 한이 갈려 있다지.",
"desc": "공격력 +6%"
},
"art:a_sandal": {
"name": "짚신",
"lore": "천 리 길 나선 나그네의 짚신은 닳을수록 가벼웠다지.",
"desc": "이동 속도 +7%"
},
"art:a_pouch": {
"name": "약초 주머니",
"lore": "주막 아낙이 허리춤에 달아 준 주머니에서 쑥 냄새가 난다.",
"desc": "최대 체력 +8%"
},
"art:a_coin": {
"name": "복 엽전",
"lore": "정월 첫날 복 자 새긴 엽전을 품으면 재물이 따른다지.",
"desc": "엽전 획득 +20%"
},
"art:a_badge": {
"name": "포졸 패",
"lore": "포졸 패를 찬 이에게는 잡귀도 함부로 덤비지 못했다.",
"desc": "받는 피해 -5%"
},
"art:a_wick": {
"name": "긴 심지",
"lore": "긴 심지 등불은 어둠 속 요괴의 눈빛까지 비춘다 하였다.",
"desc": "시야 밝기 +25%, 치명타 +4%"
},
"art:a_scroll": {
"name": "병법서",
"lore": "전장을 누빈 장수의 손때가 밴 책이라, 펼치면 길이 보인다고 하지.",
"desc": "스킬 대기 -8%"
},
"art:a_talis": {
"name": "호신 부적",
"lore": "무당이 피로 쓴 붉은 글씨가 악귀의 발길을 막아 준다지.",
"desc": "방마다 체력의 10%만큼 보호막"
},
"art:a_bell": {
"name": "풍경",
"lore": "처마 끝 맑은 소리에 잡귀가 놀라 달아난다는 절집의 물건이라.",
"desc": "공격 속도 +10%"
},
"art:a_charm": {
"name": "노리개",
"lore": "고운 매듭 사이로 행운이 스민다 하여 아낙들이 품에 지녔다지.",
"desc": "치명타 +7%"
},
"art:a_mirror": {
"name": "청동 거울",
"lore": "요괴의 참모습을 비춘다는 거울이라, 흉한 기운도 되받아 낸다.",
"desc": "맞으면 때린 적에게 120%를 되돌리고, 받는 피해 -5%"
},
"art:a_fang": {
"name": "범 송곳니",
"lore": "산군의 송곳니를 몸에 지니면 범의 사나움이 깃든다 전해진다.",
"desc": "치명타 피해 +30%, 치명타 +5%"
},
"art:a_pearl": {
"name": "여의주",
"lore": "용이 품던 구슬이라, 뜻하는 대로 때가 흐른다 하였다.",
"desc": "궁극기(R) 대기 -18%, 스킬 대기 -5%"
},
"art:a_crown": {
"name": "금관",
"lore": "옛 왕의 무덤에서 나온 금빛 관이라, 쓴 자에게 복이 모인다지.",
"desc": "공격력 +15%, 최대 체력 +15%, 엽전 +25%"
},
"art:a_wing": {
"name": "삼족오 깃",
"lore": "해 속에 산다는 세 발 까마귀의 깃이라, 꺼진 목숨도 되살린다.",
"desc": "한 판에 한 번 쓰러져도 체력 50%로 일어남"
},
"art:a_arrowhead": {
"name": "사냥꾼 화살촉",
"lore": "늙은 포수가 호랑이 잡던 날 쓴 화살촉이 아직 날카롭다.",
"desc": "공격력 +5%"
},
"art:a_skullneck": {
"name": "해골 목걸이",
"lore": "무덤가 해골로 엮은 목걸이라, 한 번 걸면 눈빛이 달라진다지.",
"desc": "치명타 +5%"
},
"art:a_hundred": {
"name": "천인참 칼날",
"lore": "천 명의 목을 벴다는 칼의 파편이라, 날이 아직도 운다.",
"desc": "공격력 +12%"
},
"art:a_horn": {
"name": "대요괴의 뿔",
"lore": "팔도를 떨게 한 대요괴의 이마에서 부러진 뿔이라 전해진다.",
"desc": "우두머리 요괴에게 주는 피해 +10%"
},
"art:a_warhorn": {
"name": "군왕 각적",
"lore": "요괴 왕이 불던 뿔피리라, 소리가 울리면 큰 놈들도 움찔한다.",
"desc": "우두머리 요괴에게 주는 피해 +20%, 공격력 +5%"
},
"art:a_staff": {
"name": "나그네 지팡이",
"lore": "팔도를 떠돈 길손의 지팡이라, 짚으면 걸음이 가벼워진다지.",
"desc": "이동 속도 +8%"
},
"art:a_map": {
"name": "요괴굴 지도",
"lore": "보부상이 먹으로 그려 판 지도라, 굴의 길목이 빼곡히 적혔다.",
"desc": "이동 속도 +10%, 스킬 대기 -5%"
},
"art:a_woodsword": {
"name": "수련 목검",
"lore": "산사 동자승이 닳도록 휘두른 목검이라 손에 착 감긴다지.",
"desc": "공격 속도 +8%"
},
"art:a_beads": {
"name": "깨달음 염주",
"lore": "백팔 번뇌를 굴리다 얻은 깨달음이 알알이 배어 있다 한다.",
"desc": "스킬 대기 -10%"
},
"art:a_hourglass": {
"name": "만년 모래시계",
"lore": "한 알 떨어질 때마다 한 해가 간다는 저승 모래시계라 한다.",
"desc": "궁극기(R) 대기 -10%"
},
"art:a_lamp": {
"name": "끝없는 등잔",
"lore": "기름이 마르지 않는 등잔이라, 불빛 아래선 상처도 아문다지.",
"desc": "밝기 +30%, 초당 체력 0.3% 회복"
},
"art:a_gloves": {
"name": "결투 깍지",
"lore": "명궁이 마지막 한 판에 끼었다는 엄지 깍지라고 전해진다.",
"desc": "치명타 +6%"
},
"art:a_belt": {
"name": "승전띠",
"lore": "싸움마다 이긴 장수가 두른 허리띠라, 두르면 기운이 솟는다.",
"desc": "공격력 +8%, 최대 체력 +8%"
},
"art:a_luckcharm": {
"name": "복 부적",
"lore": "주막 뒷방 무당이 복을 빌어 써 준 부적이라, 엽전이 따른다지.",
"desc": "엽전 +25%, 떨어지는 엽전 +10%"
},
"art:a_box": {
"name": "나무 궤",
"lore": "보부상이 온갖 잡동사니를 담아 다니던 낡은 궤짝이라 한다.",
"desc": "최대 체력 +10%"
},
"art:a_banner": {
"name": "의병 깃발",
"lore": "의병이 높이 든 깃발이라, 바라보면 겁이 사라진다 한다.",
"desc": "공격력 +7%, 받는 피해 -5%"
},
"art:a_mark": {
"name": "사냥 낙인",
"lore": "저승사자가 눈여겨본 자에게 찍는다는 붉은 낙인이라 한다.",
"desc": "치명타 피해 +25%"
},
"art:a_key": {
"name": "곳간 열쇠",
"lore": "도깨비 곳간을 열었다는 녹슨 열쇠라, 엽전 냄새를 잘 맡는다지.",
"desc": "엽전 +30%, 떨어지는 엽전 +15%"
},
"art:a_book": {
"name": "도술 비급",
"lore": "도사의 손때 묻은 비급이라, 읽을수록 손놀림이 빨라진다.",
"desc": "스킬 대기 -7%"
},
"art:a_knot": {
"name": "동심 매듭",
"lore": "함께 걷는 이의 무사를 비는 동심결 매듭이라 한다.",
"desc": "초당 체력 0.2% 회복, 최대 체력 +6%"
},
"art:a_jade": {
"name": "무결의 옥",
"lore": "티 하나 없는 옥이라, 몸에 지니면 재앙이 비켜 간다지.",
"desc": "받는 피해 -10%"
},
"art:a_bloodoath": {
"name": "피의 맹세",
"lore": "맹세를 어긴 자의 피가 부적에 스며 마르지 않는다는 말이 있다.",
"desc": "준 피해의 4%만큼 체력을 되찾음"
},
"art:a_galebell": {
"name": "질풍 방울",
"lore": "방울이 울면 바람이 먼저 달려가 길을 연다고 보부상이 말하지.",
"desc": "이동 속도 +10%, 공격 속도 +8%"
},
"art:a_ironheart": {
"name": "무쇠 심장",
"lore": "대장간 불에 오래 달군 무쇠 심장은 칼날도 튕겨낸다지.",
"desc": "최대 체력 +15%"
},
"art:a_sunmirror": {
"name": "해돋이 거울",
"lore": "해 뜰 녘 첫 빛을 담은 거울이라 어둠 속 요괴도 눈을 못 뜬다.",
"desc": "공격력 +10%, 치명타 +5%"
},
"art:a_undying": {
"name": "불사의 깃",
"lore": "저승 문턱에서 돌아온 새가 떨군 깃이라 전해진다.",
"desc": "한 판에 한 번, 쓰러져도 다시 일어남"
},
"art:a_drumstick": {
"name": "천둥 북채",
"lore": "뇌공이 쥐던 북채로 두드리면 하늘이 먼저 운다고 한다.",
"desc": "치명타가 터질 때 번개가 3명에게 튐"
},
"art:a_corpseflower": {
"name": "시체꽃",
"lore": "주검 위에 핀 꽃은 지는 순간 붉은 숨을 터뜨린다고 한다.",
"desc": "적이 죽으면 주변이 100% 위력으로 폭발함"
},
"art:a_reaperclaw": {
"name": "저승사자 손톱",
"lore": "저승사자가 명부에 이름을 긋던 손톱 끝이라 하더라.",
"desc": "체력 8% 이하인 적을 25% 확률로 즉시 처치"
},
"art:a_echobell": {
"name": "산울림 종",
"lore": "산마루에서 울린 종소리는 끝내 되돌아와 다시 운다지.",
"desc": "스킬을 쓸 때 15% 확률로 대기 시간 초기화"
},
"art:s_bless": {
"name": "달래 할멈의 부적",
"lore": "달래 할멈이 밤새 접어 건넨 부적이라 온기가 가시지 않는다.",
"desc": "최대 체력 +10%, 초당 체력 0.3% 회복"
},
"art:s_shard": {
"name": "깨진 등잔 조각",
"lore": "깨진 등잔 조각에도 남은 불씨가 길을 비춘다고 하지.",
"desc": "공격력 +8%, 밝기 +20%"
},
"art:s_helm": {
"name": "서리 장군 투구",
"lore": "서리 장군이 쓰던 투구라 쓰면 겨울바람도 비껴간다지.",
"desc": "받는 피해 -10%, 최대 체력 +8%"
},
"art:s_chain": {
"name": "불꽃 귀신의 사슬",
"lore": "불꽃 귀신이 끌고 다니던 사슬은 지금도 붉게 달아 있다.",
"desc": "공격력 +14%, 기본 공격이 적을 불태움"
},
"art:s_toadcrown": {
"name": "두꺼비 왕관",
"lore": "두꺼비 왕이 못에서 쓰던 관이라 쓴 자의 기운을 불린다지.",
"desc": "준 피해의 3%만큼 체력 회복, 최대 체력 +10%"
},
"art:s_ledger": {
"name": "염라의 명부",
"lore": "염라의 명부에 이름이 적히면 목숨은 이미 끝난 것이라.",
"desc": "체력 10% 이하인 적을 25% 확률로 즉시 처치, 치명타 +6%"
},
"art:s_oil": {
"name": "훔친 등기름",
"lore": "주막 등잔에서 몰래 훔친 기름이라 불꽃이 더 오래 탄다지.",
"desc": "공격 속도 +8%, 초당 체력 0.3% 회복"
},
"art:s_mask": {
"name": "도깨비 탈",
"lore": "도깨비 탈을 쓰면 복이 굴러들고 엽전이 절로 모인다지.",
"desc": "치명타 +10%, 엽전 획득 +15%"
},
"art:s_wing": {
"name": "반디의 날개",
"lore": "반디의 날개는 어둠 속에서도 가볍게 길을 찾아 날아간다.",
"desc": "이동 속도 +8%"
},
"art:s_gat": {
"name": "무영의 갓",
"lore": "무영이라는 떠돌이가 쓰던 갓이라 그림자조차 닿지 못했다.",
"desc": "공격력 +12%, 최대 체력 +12%, 받는 피해 -6%"
},
"pet:p_dog": {
"name": "삽살이",
"lore": "삽살개는 귀신을 쫓는다 하여 집집마다 마당을 지켰다.",
"desc": "1.4초마다 적을 물어뜯음 (공격력 50%)"
},
"pet:p_cat": {
"name": "고양이 나비",
"lore": "주막 고양이 나비는 엽전 냄새를 기가 막히게 맡는다지.",
"desc": "엽전 획득 +25%, 가끔 엽전을 물어옴"
},
"pet:p_bird": {
"name": "까치",
"lore": "아침 까치가 울면 반가운 손님이 온다는 말이 있지.",
"desc": "1.1초마다 깃털을 날림 (공격력 55%)"
},
"pet:p_turtle": {
"name": "돌거북",
"lore": "산처럼 느리고 바위처럼 단단한 거북이 길손을 지킨다지.",
"desc": "받는 피해 -8%, 10초마다 보호막 6%"
},
"pet:p_goblin": {
"name": "아기 도깨비",
"lore": "꼬마 도깨비가 방망이를 휘두르면 금은이 쏟아진다더라.",
"desc": "2초마다 방망이로 내리쳐 폭발 (120%), 엽전 획득 +30%"
},
"pet:p_fox": {
"name": "아기 여우",
"lore": "구미호가 되기 전 아기 여우도 여우불은 제법 다룬다지.",
"desc": "0.9초마다 적을 따라가는 여우불을 날림 (60%)"
},
"pet:p_dragon": {
"name": "아기 이무기",
"lore": "용이 되지 못한 이무기도 여의주 빛 한 줄기는 품었다.",
"desc": "1.2초마다 여의주 빛을 쏨 (90%), 공격력 +6%"
},
"pet:p_haetae": {
"name": "아기 해태",
"lore": "해태는 시비를 가리고 화재를 막는 영물이라 전해진다.",
"desc": "8초마다 보호막 10%, 공격력 +5%"
},
"pet:p_phoenix": {
"name": "아기 봉황",
"lore": "봉황 알에서 갓 나온 병아리의 날갯짓에도 온기가 돈다.",
"desc": "6초마다 체력 6% 회복"
},
"pet:p_girin": {
"name": "아기 기린",
"lore": "기린이 지나간 풀은 밟히지 않고 상처도 아문다고 하지.",
"desc": "8초마다 체력 5% 회복 + 보호막 5%"
},
"pet:p_bulgasari": {
"name": "아기 불가사리",
"lore": "쇠를 먹고 자란 불가사리는 땅을 내려치면 산이 울린다지.",
"desc": "받는 피해 -10%, 2초마다 땅을 내려침 (110%)"
},
"pet:p_samjok": {
"name": "아기 삼족오",
"lore": "해 속에 산다는 세 발 까마귀의 아직 솜털 가시지 않은 새끼라지.",
"desc": "1초마다 태양 깃털을 날려 80% 피해, 적을 꿰뚫음. 치명타 +5%"
},
"pet:p_bossking": {
"name": "아기 도깨비 왕",
"lore": "방망이 하나로 팔도 도깨비를 호령하던 왕의 철없는 막내라지.",
"desc": "공격력 +10%. 2초마다 방망이를 내려쳐 주변 적에게 150% 피해, 기절"
},
"pet:p_yongma": {
"name": "아기 용마",
"lore": "용이 되다 만 말이 한밤 냇가에서 번개를 먹고 자랐다지.",
"desc": "이동 속도 +12%. 1.6초마다 번개 사슬이 4명에게 70% 피해"
},
"pet:p_whitetiger": {
"name": "아기 백호",
"lore": "산신령이 타고 다닌다던 백호가 낳은 막내 새끼라지.",
"desc": "1초마다 할퀴어 공격력의 90% 피해"
},
"pet:p_squirrel": {
"name": "다람쥐",
"lore": "도토리 대신 엽전을 볼주머니에 숨겨 두는 영악한 놈이지.",
"desc": "엽전 +15%, 가끔 엽전을 물어옴"
},
"pet:p_owl": {
"name": "부엉이",
"lore": "밤이면 고목 위에서 저승길 지나는 이를 지켜본다는 새라지.",
"desc": "1.3초마다 깃털을 날려 공격력의 45% 피해"
},
"pet:p_mole": {
"name": "두더지",
"lore": "땅속 깊이 묻힌 엽전 냄새를 용케도 맡아 파낸다지.",
"desc": "엽전 +20%"
},
"pet:p_firefly": {
"name": "반딧불이",
"lore": "무덤가 혼불인 줄 놀라지 마라, 길 밝히는 작은 등불이지.",
"desc": "밝기 +30%. 1.5초마다 빛을 쏘아 40% 피해"
},
"pet:p_goose": {
"name": "거위",
"lore": "서낭당 앞을 지키며 낯선 이를 먼저 알아본다는 거위라지.",
"desc": "1.2초마다 쪼아서 공격력의 60% 피해"
},
"pet:p_rabbit": {
"name": "옥토끼",
"lore": "달 속에서 떡방아 찧다 내려온 하얀 토끼라 전해진다.",
"desc": "이동 속도 +8%"
},
"pet:p_raccoon": {
"name": "너구리",
"lore": "보부상 짐 사이를 드나들며 엽전 냄새를 따라다니는 놈이지.",
"desc": "떨어지는 엽전 +20%"
},
"pet:p_otter": {
"name": "수달",
"lore": "개울가 조약돌을 모아 두었다 요괴에게 던지는 재간둥이라지.",
"desc": "1초마다 조약돌을 던져 공격력의 50% 피해"
},
"pet:p_crane": {
"name": "참새",
"lore": "처마 밑 참새가 곁에서 짹짹이면 아픈 몸도 절로 가벼워진다지.",
"desc": "7초마다 체력 5% 회복"
},
"pet:p_bear": {
"name": "아기 반달곰",
"lore": "단군 어머니의 먼 후손이라 땅을 치는 힘이 남다르다지.",
"desc": "2.2초마다 땅을 내려쳐 130% 피해"
},
"pet:p_hawk": {
"name": "송골매",
"lore": "임금께 바치던 매의 핏줄이라 한번 노린 것은 놓치지 않지.",
"desc": "0.8초마다 급강하해 공격력의 55% 피해"
},
"pet:p_deer": {
"name": "꽃사슴",
"lore": "십장생의 하나로 걷는 곳마다 풀이 돋는다고 전해진다.",
"desc": "초당 체력 0.3% 회복"
},
"pet:p_boar": {
"name": "아기 멧돼지",
"lore": "산신 심부름을 가다 길을 잃고 요괴 소굴로 든 새끼지.",
"desc": "1.1초마다 들이받아 70% 피해"
},
"pet:p_bat": {
"name": "아기 박쥐",
"lore": "복을 부른다 해도 밤에 우는 소리는 영 섬뜩하다지.",
"desc": "흡혈 2%. 1.2초마다 물어서 45% 피해"
},
"pet:p_monkey": {
"name": "원숭이",
"lore": "산중 주막 뒤뜰 감나무에서 열매를 훔쳐 던지던 개구쟁이라지.",
"desc": "1초마다 열매를 던져 50% 피해"
},
"pet:p_firefox": {
"name": "불여우",
"lore": "꼬리 아홉 달리기 전부터 불씨를 품고 태어난 여우라지.",
"desc": "0.8초마다 불꽃을 쏘아 70% 피해, 불태움"
},
"pet:p_icesprite": {
"name": "서리동자",
"lore": "삼동 눈보라 속에서 태어나 입김만으로 개울을 얼린다지.",
"desc": "3초마다 주변 적을 1초 동안 얼림"
},
"pet:p_thunderbird": {
"name": "벼락새",
"lore": "먹구름 속에서 울다가 벼락을 타고 내려온다는 새라지.",
"desc": "1.6초마다 번개 사슬이 4명에게 60% 피해"
},
"pet:p_shadowcat": {
"name": "먹괭이",
"lore": "달 없는 밤 먹물 속에서 걸어 나와 소리 없이 노린다지.",
"desc": "치명타 +8%, 치명타 피해 +20%"
},
"pet:p_goldtoad": {
"name": "황금 두꺼비",
"lore": "복덩이로 불리며 집안에 들면 재물이 마르지 않는다 했지.",
"desc": "엽전 +50%, 떨어지는 엽전 +30%"
},
"pet:p_wisp": {
"name": "도깨비불",
"lore": "도깨비가 흘리고 간 불씨가 정을 붙여 따라다니게 되었다지.",
"desc": "1초마다 적을 따라가는 불씨를 날려 50% 피해"
},
"pet:p_skeldog": {
"name": "해골 삽살",
"lore": "저승길 어귀에서 주인을 기다리다 뼈만 남은 삽살개라지.",
"desc": "1.2초마다 물어서 65% 피해"
},
"pet:p_slime": {
"name": "물컹이",
"lore": "비 오는 날 우물가 이끼에서 스르르 솟은 말랑한 것이지.",
"desc": "9초마다 보호막 7%"
},
"pet:p_batfairy": {
"name": "복박쥐",
"lore": "복을 물어다 준다는 박쥐 중에 요술을 익힌 영물이라지.",
"desc": "흡혈 3%"
},
"pet:p_stonespirit": {
"name": "돌장승",
"lore": "고갯마루 돌무더기에 깃들어 길손을 지키는 돌의 넋이지.",
"desc": "받는 피해 -10%"
},
"pet:p_bandi": {
"name": "반디",
"lore": "반디 한 마리가 쓰러진 길손의 앞길을 밝혀 주었다 전한다.",
"desc": "밝기 +40%. 1.3초마다 빛을 쏘아 50% 피해"
},
"pet:p_halmicat": {
"name": "할멈의 고양이",
"lore": "할멈 무릎에서 졸던 고양이는 저승길도 제집 마당처럼 드나들었다더라",
"desc": "8초마다 체력 4% 회복"
},
"pet:p_frostfox": {
"name": "서리 여우",
"lore": "겨울 산 눈밭에 발자국 없이 나타나 입김으로 길손을 얼렸다는 여우다",
"desc": "3.5초마다 주변 적을 얼림"
},
"pet:p_salamander": {
"name": "불도롱",
"lore": "아궁이 불씨를 삼킨 도롱뇽이 천 년을 묵어 불을 뿜게 되었다지",
"desc": "0.9초마다 불꽃을 쏘아 불태움 (60%)"
},
"pet:p_crow": {
"name": "저승 까마귀",
"lore": "저승사자의 서찰을 물고 다니며 죽을 이의 지붕 위에서 운다는 까마귀다",
"desc": "1.4초마다 번개 사슬이 적 5명을 침 (70%)"
},
"title:t_walker": {
"name": "어둠 걷는 자",
"lore": "달 없는 밤에도 등불 없이 고갯길을 넘는 이가 있었다지",
"desc": "이동 속도 +4%"
},
"title:t_lucky": {
"name": "운수 좋은 날",
"lore": "길 가다 엽전 꾸러미를 주운 날은 주막 국밥도 거저 얻었다지",
"desc": "엽전 +15%"
},
"title:t_iron": {
"name": "무쇠 심장",
"lore": "도깨비 방망이에 맞고도 웃었다는 사내의 가슴은 무쇠였다지",
"desc": "받는 피해 -3%"
},
"title:t_swift": {
"name": "번개 손",
"lore": "눈 한 번 깜짝할 새 부적 열 장을 던졌다는 무당의 손이라",
"desc": "공격 속도 +7%"
},
"title:t_sage": {
"name": "도를 깨친 자",
"lore": "삼 년 면벽 끝에 숨결 하나로 기운을 다스리게 된 이의 칭호다",
"desc": "스킬 대기 -6%"
},
"title:t_hawk": {
"name": "매의 눈동자",
"lore": "백 걸음 밖 반딧불의 날갯짓도 놓치지 않았다는 눈이라지",
"desc": "치명타 +5%"
},
"title:t_lamp": {
"name": "꺼지지 않는 등불",
"lore": "바람이 불고 비가 쏟아져도 끝내 꺼지지 않았다는 길잡이 등불이라",
"desc": "초당 체력 0.2% 회복, 밝기 +15%"
},
"title:t_coin": {
"name": "엽전 부자",
"lore": "엽전 꿰미가 대들보를 휘게 했다는 소문난 보부상 부자의 이름이라",
"desc": "엽전 +30%, 엽전 떨어짐 +15%"
},
"title:t_storm": {
"name": "폭풍을 부르는 자",
"lore": "손짓 한 번에 먹구름이 몰려와 팔도가 어두워졌다고 전하는 이다",
"desc": "궁극기(R) 대기 -12%"
},
"title:t_heaven": {
"name": "하늘이 고른 자",
"lore": "하늘이 점지해 태어날 때 혼불이 세 번 번쩍였다고 전하는 이라",
"desc": "공격력 +8%, 치명타 +5%, 치명타 피해 +15%"
},
"title:t_first": {
"name": "첫 사냥꾼",
"lore": "요괴록에 처음으로 제 손으로 잡은 요괴를 적어 넣은 사냥꾼이라",
"desc": "공격력 +3%"
},
"title:t_hundred": {
"name": "백인참",
"lore": "요괴 백을 베고서야 칼집에 칼을 넣었다는 사냥꾼의 별칭이라",
"desc": "공격력 +5%"
},
"title:t_slayer": {
"name": "우두머리 잡이",
"lore": "고을마다 두려워하던 우두머리 요괴의 목을 거둔 이에게 붙는 말이라",
"desc": "보스에게 주는 피해 +15%"
},
"title:t_explorer": {
"name": "굴속 나그네",
"lore": "굴속 깊이 들어가 길을 그려 돌아온 나그네에게 붙던 이름이라",
"desc": "이동 속도 +5%, 엽전 +10%"
},
"title:t_veteran": {
"name": "백전노장",
"lore": "수많은 밤을 요괴와 싸우며 흉터마다 이야기를 새긴 노장이라",
"desc": "최대 체력 +8%"
},
"title:t_endless": {
"name": "끝없는 도전자",
"lore": "쓰러져도 등불 들고 다시 일어나 굴 밑바닥까지 걸어간 도전자라",
"desc": "궁극기(R) 대기 -8%, 공격력 +4%"
},
"title:t_duelist": {
"name": "결투의 달인",
"lore": "칼끝이 닿기 전에 상대의 빈틈을 먼저 읽었다는 검객의 칭호다",
"desc": "치명타 +6%"
},
"title:t_collector": {
"name": "조각 줍는 이",
"lore": "찢겨 흩어진 요괴록 쪽을 하나둘 주워 모은 이에게 붙은 이름이라",
"desc": "엽전 떨어짐 +15%"
},
"title:t_gambler": {
"name": "신들린 제비",
"lore": "제비를 뽑을 때마다 신령이 손을 잡아 이끌었다는 소문이 돌았지",
"desc": "엽전 +20%, 엽전 떨어짐 +10%"
},
"title:t_together": {
"name": "함께하는 등불",
"lore": "혼자 든 등불은 약해도 둘이 들면 밤길이 환하다는 말이 있지",
"desc": "초당 체력 0.3% 회복"
},
"title:t_flawless": {
"name": "무결",
"lore": "싸움이 끝나도 옷깃에 흙 한 점 묻지 않았다는 사람의 칭호라",
"desc": "받는 피해 -8%"
},
"title:t_brink": {
"name": "벼랑 끝의 승리",
"lore": "숨이 넘어가던 벼랑 끝에서 적의 기운을 빼앗아 일어섰다지",
"desc": "입힌 피해의 3%만큼 체력 회복, 공격력 +5%"
},
"title:t_gale": {
"name": "질풍",
"lore": "고갯마루를 바람처럼 지나가 뒤늦게 나뭇잎만 흔들렸다지",
"desc": "이동 속도 +8%, 공격 속도 +6%"
},
"title:t_unyielding": {
"name": "불굴",
"lore": "아홉 번 쓰러져도 아홉 번 다시 일어선 이의 굳센 뜻이라",
"desc": "최대 체력 +10%"
},
"title:t_legend": {
"name": "전설의 사냥꾼",
"lore": "주막마다 그 이름을 읊으며 술잔을 올린다는 전설 속 사냥꾼이라",
"desc": "치명타 피해 +30%"
},
"title:t_dex1": {
"name": "석굴의 기록자",
"lore": "석굴 벽에 새겨진 요괴의 내력을 먹으로 옮겨 적은 이의 칭호다",
"desc": "공격력 +4%"
},
"title:t_dex2": {
"name": "서리의 기록자",
"lore": "서리 내린 고개의 요괴를 빠짐없이 적어 넣은 자에게 붙은 이름이라지.",
"desc": "최대 체력 +4%"
},
"title:t_dex3": {
"name": "불길의 기록자",
"lore": "불길 속 요괴의 이름까지 요괴록에 새겨 넣은 이에게 내린 호라지.",
"desc": "공격력 +5%"
},
"title:t_dex4": {
"name": "늪의 기록자",
"lore": "안개 낀 늪의 요괴까지 하나도 빼놓지 않고 적은 이를 이리 불렀다.",
"desc": "치명타 +5%"
},
"title:t_dex5": {
"name": "요괴록의 주인",
"lore": "찢긴 요괴록을 끝내 한 권으로 이어 낸 이만이 얻는 이름이라지.",
"desc": "공격력 +8%, 최대 체력 +8%"
},
"title:t_new": {
"name": "초보 토벌꾼",
"lore": "갓 등불을 받아 든 토벌꾼에게 주막 어른들이 붙여 준 이름이다.",
"desc": "최대 체력 +3%"
},
"title:t_cave": {
"name": "석굴을 지난 자",
"lore": "어둠 깊은 석굴에서 살아 나온 자는 몸이 돌처럼 단단해진다지.",
"desc": "받는 피해 -4%"
},
"title:t_flame": {
"name": "불길을 넘은 자",
"lore": "불길을 헤치고 걸어 나온 자의 소매엔 아직 불씨가 남았다지.",
"desc": "공격력 +6%"
},
"title:t_dawn": {
"name": "새벽을 연 사람",
"lore": "밤새 요괴와 맞서다 첫닭 울음과 함께 돌아선 이의 이름이다.",
"desc": "치명타 +6%, 치명타 피해 +25%"
},
"title:t_king": {
"name": "미궁의 왕",
"lore": "끝없는 미궁을 다스려 요괴들마저 고개를 숙였다고 전해진다.",
"desc": "공격력 +8%, 최대 체력 +8%, 스킬 대기 -6%"
},
"curse:dark": {
"name": "어둠의 저주",
"lore": "저승 어귀의 먹구름이 눈앞을 덮으면 등불도 멀리 닿지 못한다지.",
"desc": "시야가 좁아져요"
},
"curse:blood": {
"name": "피의 저주",
"lore": "원혼의 핏빛 한이 몸에 스며 작은 상처도 깊어진다고 한다.",
"desc": "받는 피해 +25%"
},
"curse:wither": {
"name": "메마름의 저주",
"lore": "혼불이 말라붙은 땅에서는 어떤 약도 제 힘을 내지 못한다지.",
"desc": "회복 효과 절반"
},
"curse:haste": {
"name": "질주의 저주",
"lore": "도깨비 바람이 요괴의 발에 붙으면 그림자도 따라잡지 못한다.",
"desc": "요괴가 20% 빨라져요"
},
"curse:swarm": {
"name": "무리의 저주",
"lore": "한 마리를 베면 열이 몰려온다는 백귀야행의 저주라지.",
"desc": "방마다 요괴 +40%"
},
"curse:armor": {
"name": "강철의 저주",
"lore": "녹슨 갑옷 귀신이 요괴들 몸에 쇳빛 껍질을 입혀 놓았다고 한다.",
"desc": "요괴가 받는 피해 -20%"
},
"curse:grudge": {
"name": "원한의 저주",
"lore": "한 맺힌 채 쓰러진 요괴는 끝내 가만히 눕지 못한다지.",
"desc": "쓰러진 요괴가 잠시 뒤 터져요"
},
"curse:seal": {
"name": "봉인의 저주",
"lore": "무당이 붙인 붉은 봉인 부적이 손끝의 기운을 꽁꽁 묶는다지.",
"desc": "스킬·액티브 대기 시간 +30%"
},
"hbasic:musa": {
"name": "환도 베기",
"lore": "강휘의 허리에 찬 낡은 환도는 요괴를 벨 때마다 날이 닳았다지.",
"desc": "환도를 휘둘러 앞의 적을 벤다"
},
"hsk:musa#0": {
"name": "베어 가르기",
"lore": "바람보다 먼저 길을 열고 지나간 자리엔 갈라진 그림자만 남았다.",
"desc": "앞으로 돌진하며 지나간 적에게 160% 피해"
},
"hsk:musa#1": {
"name": "회오리 베기",
"lore": "한 바퀴 돌면 사방의 귀신이 낙엽처럼 흩날렸다고 전해진다.",
"desc": "주변 적에게 200% 피해 + 밀쳐냄"
},
"hsk:musa#2": {
"name": "철벽 자세",
"lore": "두 발을 땅에 박고 칼을 세우면 성벽도 부럽지 않았다지.",
"desc": "4초 동안 받는 피해 -50%, 최대 체력 20% 보호막"
},
"hsk:musa#3": {
"name": "검기 폭풍",
"lore": "칼끝에서 일어난 푸른 검기가 폭풍이 되어 온 사방을 쓸었다.",
"desc": "2.4초 동안 주변을 8번 베어 각 130% 피해"
},
"hbasic:archer": {
"name": "각궁 사격",
"lore": "설아가 아끼는 뿔 활은 시위 소리만으로도 잡귀가 물러났다지.",
"desc": "각궁으로 화살을 쏘아 적을 맞힌다"
},
"hsk:archer#0": {
"name": "세 갈래 화살",
"lore": "한 번 시위를 당기면 화살이 꽃잎처럼 활짝 퍼졌다고 한다.",
"desc": "화살 5발을 부채꼴로 쏴 각 110% 피해"
},
"hsk:archer#1": {
"name": "바람 구르기",
"lore": "설아는 바람결에 몸을 맡겨 칼날 사이를 스치듯 빠져나갔다.",
"desc": "가리킨 쪽으로 구르며 잠깐 무적"
},
"hsk:archer#2": {
"name": "화살비",
"lore": "먹구름 낀 하늘에서 화살이 소나기처럼 쏟아졌다는 전설이라지.",
"desc": "가리킨 곳에 3초 동안 화살비 (초당 120% 피해, 적이 느려짐)"
},
"hsk:archer#3": {
"name": "천궁 일시",
"lore": "하늘을 겨눈 단 한 발이 온 요괴의 심장을 꿰뚫었다고 전한다.",
"desc": "모든 적을 꿰뚫는 거대한 화살 (650% 피해)"
},
"hbasic:spear": {
"name": "창 찌르기",
"lore": "도윤의 긴 창은 한 번 내지르면 어둠도 한 치 물러섰다지.",
"desc": "창을 곧게 내질러 앞의 적을 찌른다"
},
"hsk:spear#0": {
"name": "돌격 찌르기",
"lore": "창끝을 앞세워 달리면 막아선 귀신도 길을 비켰다고 한다.",
"desc": "길게 돌진하며 180% 피해"
},
"hsk:spear#1": {
"name": "창 휘두르기",
"lore": "긴 창자루가 크게 한 바퀴 돌면 무리가 우수수 나가떨어졌다지.",
"desc": "넓게 휘둘러 170% 피해 + 크게 밀쳐냄"
},
"hsk:spear#2": {
"name": "투창",
"lore": "한 번 던진 창은 돌아오지 않는다 했으나, 적을 다 꿰고서야 멈췄다지.",
"desc": "모든 적을 꿰뚫는 창을 던져 260% 피해, 느려짐"
},
"hsk:spear#3": {
"name": "백창진",
"lore": "하늘이 갈라지듯 창비가 내리니 진 안에 선 자 살아 나간 이 없다지.",
"desc": "가리킨 곳 주변에 창 14자루를 떨어뜨려 각 200% 피해"
},
"hbasic:monk": {
"name": "연타",
"lore": "맨주먹이 쉴 틈 없이 오가니 바위도 먼지가 되었다지.",
"desc": "주먹을 빠르게 연달아 내질러 가까운 적을 친다"
},
"hsk:monk#0": {
"name": "비룡각",
"lore": "한 번 솟구쳐 발을 뻗으면 용이 하늘을 가르는 듯했다지.",
"desc": "날아차기로 돌진 후 착지 폭발 150%+150%"
},
"hsk:monk#1": {
"name": "장풍",
"lore": "숨을 모아 내뻗은 손끝에서 산바람이 터져 나왔다 한다.",
"desc": "큰 기운 덩어리를 날려 220% 피해 + 밀쳐냄"
},
"hsk:monk#2": {
"name": "금강불괴",
"lore": "절간 쇠종처럼 몸이 울릴 뿐 어떤 칼날도 살을 못 뚫었다지.",
"desc": "5초 동안 받는 피해 -60%, 체력 12% 회복"
},
"hsk:monk#3": {
"name": "백렬권",
"lore": "한 호흡에 백 번을 친다던 소문, 허풍만은 아니었다지.",
"desc": "1.6초 동안 앞쪽을 16번 때려 각 90% 피해"
},
"hbasic:gunner": {
"name": "화승총",
"lore": "심지에 불을 붙이면 산 너머 호랑이도 걸음을 멈췄다지.",
"desc": "화승총을 쏘아 멀리 있는 적을 맞힌다"
},
"hsk:gunner#0": {
"name": "벌떼 사격",
"lore": "총구를 벗어난 쇳알이 벌떼처럼 흩어져 앞을 쓸었다지.",
"desc": "가까운 적에게 쇠알 7발, 각 70% 피해 + 밀쳐냄"
},
"hsk:gunner#1": {
"name": "화약 구르기",
"lore": "구른 자리마다 화약 냄새가 남더니 이내 펑 하고 터졌다지.",
"desc": "구르며 지나간 자리에 폭발 140%를 남김"
},
"hsk:gunner#2": {
"name": "화약 단지",
"lore": "단지 속 화약이 한꺼번에 터지면 주막 지붕이 날아간다 했다.",
"desc": "가리킨 곳에 단지를 던져 1초 뒤 큰 폭발 320% + 기절"
},
"hsk:gunner#3": {
"name": "홍이포 포격",
"lore": "서양 배를 막던 큰 대포가 이번엔 요괴 무리 위로 불을 뿜는다.",
"desc": "가리킨 곳 주변에 포탄 8발, 각 280% 피해"
},
"hbasic:priest": {
"name": "방울 물결",
"lore": "무녀가 방울을 흔들면 맑은 소리가 물결처럼 번져 나갔다지.",
"desc": "방울을 흔들어 퍼지는 소리로 가까운 적을 친다"
},
"hsk:priest#0": {
"name": "방울 울림",
"lore": "귀신도 방울 소리 앞에서는 잠시 얼어붙는다 하지.",
"desc": "주변 적 1.2초 기절 + 180% 피해"
},
"hsk:priest#1": {
"name": "살풀이춤",
"lore": "굿판에서 춤사위 하나로 맺힌 살을 풀어 몸을 돌보았다지.",
"desc": "체력 25% 회복"
},
"hsk:priest#2": {
"name": "오방기 결계",
"lore": "다섯 빛깔 깃발을 꽂으면 그 안은 요괴도 함부로 못 드는 땅이라.",
"desc": "자기 자리에 5초 결계 (적 느려짐·초당 140% 피해, 안에서 받는 피해 -30%)"
},
"hsk:priest#3": {
"name": "신내림",
"lore": "신이 몸에 내리면 무녀의 눈빛부터 달라진다고들 하지.",
"desc": "8초 동안 공격력 +60%·공격 속도 +40%, 체력 30% 회복"
},
"hbasic:necro": {
"name": "원혼 구슬",
"lore": "한 맺힌 넋이 뭉쳐 푸른 구슬이 되어 떠돈다지.",
"desc": "원혼이 깃든 구슬을 날려 적을 맞힌다"
},
"hsk:necro#0": {
"name": "원혼 부르기",
"lore": "무덤가에서 이름을 세 번 부르면 떠돌던 넋이 곁에 선다지.",
"desc": "원혼 2마리를 10초 동안 부름"
},
"hsk:necro#1": {
"name": "흡혼광",
"lore": "푸른 빛줄기가 산 자의 기운을 빨아 흑운의 몸에 채웠다지.",
"desc": "직선 광선 200% 피해, 맞힌 적마다 체력 3% 회복"
},
"hsk:necro#2": {
"name": "혼비백산",
"lore": "으스스한 기운이 번지면 담 큰 자도 다리가 풀렸다지.",
"desc": "주변 적 2초 동안 크게 느려짐 + 밀쳐냄"
},
"hsk:necro#3": {
"name": "백골 행렬",
"lore": "버려진 싸움터의 백골들이 북소리에 맞춰 일어섰다 한다.",
"desc": "해골 병사 6명을 12초 동안 부름"
},
"hbasic:assassin": {
"name": "쌍단검",
"lore": "달빛 아래 두 칼날이 엇갈리면 소리 없이 끝났다지.",
"desc": "두 단검으로 가까운 적을 빠르게 벤다"
},
"hsk:assassin#0": {
"name": "그림자 건너기",
"lore": "자객은 그림자에서 그림자로 건너뛰어 어느새 등 뒤에 선다지.",
"desc": "가리킨 곳으로 순간이동, 도착 지점 150% 피해"
},
"hsk:assassin#1": {
"name": "표창",
"lore": "소매 속에서 번쩍인 쇠별 셋이 어둠을 갈랐다지.",
"desc": "빠른 표창 3발, 각 100% 피해"
},
"hsk:assassin#2": {
"name": "그림자 두르기",
"lore": "숨을 죽이고 어둠에 몸을 섞으면 눈앞에 서도 보지 못한다지.",
"desc": "3초 동안 적이 놓치고, 이동 +40%, 다음 공격은 치명타"
},
"hsk:assassin#3": {
"name": "그림자 난도",
"lore": "한 줄기 검은 바람이 지나간 뒤에야 적들은 쓰러졌다지.",
"desc": "가까운 적 8명에게 차례로 날아가 각 260% 피해"
},
"hbasic:dosa": {
"name": "부적 던지기",
"lore": "붉은 먹으로 쓴 부적 한 장이 칼보다 매서울 때가 있다지.",
"desc": "부적을 던져 적을 맞힌다"
},
"hsk:dosa#0": {
"name": "화염 부적",
"lore": "주사로 불 화 자를 그리면 닿는 곳마다 불길이 일었다지.",
"desc": "부딪히면 폭발 200% 피해 + 불태움"
},
"hsk:dosa#1": {
"name": "축지법",
"lore": "땅을 접어 걷는다는 도사의 비술, 천 리도 한걸음이라.",
"desc": "가리킨 곳으로 순간이동"
},
"hsk:dosa#2": {
"name": "뇌우 부적",
"lore": "먹구름 낀 밤 도사가 부적을 사르면 번개가 줄줄이 내리꽂혔다지",
"desc": "번개가 적 6명에게 튀며 각각 170% 피해"
},
"hsk:dosa#3": {
"name": "오행진",
"lore": "오행의 기운으로 그은 진 안에선 요괴도 발이 무거워진다",
"desc": "가리킨 곳에 6초 동안 큰 진을 펼친다 (초당 220% 피해, 크게 느려짐)"
},
"hbasic:yinyang": {
"name": "음양 구슬",
"lore": "흑과 백이 맞물려 도는 구슬에 음양사의 숨결이 깃들었다",
"desc": "흑백 구슬을 날려 적을 맞힌다"
},
"hsk:yinyang#0": {
"name": "태극 구슬",
"lore": "흑백 두 빛이 얽혀 주인 곁을 맴도는 작은 태극이라지",
"desc": "8초 동안 흑백 구슬 4개가 주위를 돌며 피해를 준다 (각 90%)"
},
"hsk:yinyang#1": {
"name": "음양 반전",
"lore": "음이 양이 되고 양이 음이 되니 상처도 뒤집힌다는 말이 있지",
"desc": "주변에 160% 피해, 체력 10% 회복"
},
"hsk:yinyang#2": {
"name": "식신 부르기",
"lore": "오려 낸 종이에 이름을 불러 넣으면 식신이 걸어 나온다지",
"desc": "종이 식신 3마리를 9초 동안 부른다"
},
"hsk:yinyang#3": {
"name": "태극파천",
"lore": "하늘과 땅이 갈라지는 소리가 나더니 태극이 터졌다고 한다",
"desc": "가리킨 곳에 1.2초 뒤 거대한 폭발, 750% 피해와 기절"
},
"hbasic:summoner": {
"name": "영혼 화살",
"lore": "죽은 이의 넋을 시위에 얹어 쏘면 길 잃은 혼이 길을 찾는다",
"desc": "영혼 화살을 쏘아 적을 맞힌다"
},
"hsk:summoner#0": {
"name": "영호 소환",
"lore": "산신의 곁을 지키던 영험한 호랑이 넋이 부름에 응한다",
"desc": "영혼 호랑이를 14초 동안 부른다 (강함)"
},
"hsk:summoner#1": {
"name": "영조 소환",
"lore": "산 너머 먼 곳까지 눈 밝은 영혼 새가 날아 적을 쫓는다지",
"desc": "멀리서 쏘는 영혼 새 3마리를 10초 동안 부른다"
},
"hsk:summoner#2": {
"name": "영혼 연결",
"lore": "부리는 이와 부림받는 넋이 한 줄 실로 이어져 숨을 나눈다",
"desc": "체력 18% 회복, 부림 6초 동안 강화 (+60%)"
},
"hsk:summoner#3": {
"name": "사신수 강림",
"lore": "동서남북 네 방위를 지키는 신령이 한자리에 내려선다",
"desc": "청룡·백호·주작·현무를 13초 동안 부른다"
},
"hbasic:berserker": {
"name": "쌍도끼",
"lore": "산중 나무꾼 못지않게 거친 사내가 양손에 도끼를 쥐었다",
"desc": "양손의 도끼를 휘둘러 가까운 적을 벤다"
},
"hsk:berserker#0": {
"name": "도끼 던지기",
"lore": "던진 도끼가 바람을 가르고 요괴의 뼈마디를 꿰뚫는다",
"desc": "꿰뚫는 도끼를 던져 200% 피해"
},
"hsk:berserker#1": {
"name": "도약 내려찍기",
"lore": "산비탈을 박차고 솟은 사내가 땅이 울리도록 내려앉았다",
"desc": "가리킨 곳으로 뛰어올라 착지하며 240% 피해와 기절"
},
"hsk:berserker#2": {
"name": "광폭화",
"lore": "눈이 붉게 뒤집히면 사내는 아픔도 두려움도 잊는다고 한다",
"desc": "6초 동안 공격력 +50%, 공격 속도 +50%, 입힌 피해의 10%만큼 체력 회복"
},
"hsk:berserker#3": {
"name": "피의 회오리",
"lore": "도끼날이 붉은 바람을 일으키니 가까이 선 자가 없었다",
"desc": "3초 동안 회전하며 12번 각 150% 피해, 받는 피해 -40%"
},
"hbasic:moon": {
"name": "쌍월도",
"lore": "초승달 닮은 두 자루 칼이 달빛 아래 춤을 춘다지",
"desc": "두 자루 월도로 가까운 적을 벤다"
},
"hsk:moon#0": {
"name": "초승달 검기",
"lore": "칼끝에서 풀려난 달빛 한 줄기가 어둠을 가른다",
"desc": "꿰뚫는 초승달 검기로 190% 피해"
},
"hsk:moon#1": {
"name": "월광 보법",
"lore": "달빛 위를 걷듯 스치니 베인 줄도 모르고 쓰러진다지",
"desc": "가리킨 곳으로 미끄러지며 지나간 적에게 140% 피해, 그동안 무적"
},
"hsk:moon#2": {
"name": "만월",
"lore": "보름달이 차오르는 밤엔 검희의 칼도 가장 환히 빛난다",
"desc": "주변 220% 피해, 적 2초 동안 느려짐"
},
"hsk:moon#3": {
"name": "월하난무",
"lore": "달 아래 열 명을 차례로 베고 끝에 보름달을 터뜨린다",
"desc": "적 10명에게 차례로 베어들고 마지막에 만월 폭발"
},
"hbasic:thunder": {
"name": "뇌전 언월도",
"lore": "푸른 번개가 날을 타고 흐르는 장군의 큰 칼이다",
"desc": "번개 서린 언월도로 가까운 적을 벤다"
},
"hsk:thunder#0": {
"name": "뇌창",
"lore": "하늘이 내려 던진 번개 창 하나가 한 줄로 요괴를 꿰뚫는다",
"desc": "번개 창이 직선으로 날아가 220% 피해"
},
"hsk:thunder#1": {
"name": "벼락 강림",
"lore": "장군이 칼을 치켜들자 맑은 하늘에서 벼락이 떨어졌다",
"desc": "가리킨 곳에 벼락, 260% 피해와 1초 기절"
},
"hsk:thunder#2": {
"name": "천둥 갑옷",
"lore": "우레 소리가 몸에 감겨 쇠 갑옷보다 단단히 지켜 준다",
"desc": "6초 동안 받는 피해 -35%, 주변 적에게 초당 80% 감전"
},
"hsk:thunder#3": {
"name": "뇌신강림",
"lore": "뇌신이 노하자 팔도 하늘이 갈라지고 벼락이 비처럼 쏟아졌다",
"desc": "방 전체에 벼락 16번, 각 260% 피해"
},
"hbasic:fox": {
"name": "여우불",
"lore": "구미호가 입에 문 여우구슬에서 푸른 불꽃이 피어난다",
"desc": "푸른 여우불을 날려 적을 태운다"
},
"hsk:fox#0": {
"name": "여우불 부채",
"lore": "부채를 한 번 펼치면 푸른 혼불이 줄줄이 뒤를 쫓는다",
"desc": "푸른 불 7개가 따라가며 각 90% 피해"
},
"hsk:fox#1": {
"name": "매혹",
"lore": "여우의 눈과 마주친 이는 제 이름도 잊고 멍하니 서 있다지",
"desc": "맞은 적 2.2초 동안 홀려 멈춤 + 150% 피해"
},
"hsk:fox#2": {
"name": "꼬리 감추기",
"lore": "꼬리 아홉을 감추고 사라진 여우는 어느새 등 뒤에 서 있더라지.",
"desc": "가리킨 곳으로 순간이동, 1초 무적, 그 자리에 여우불 폭발 120%"
},
"hsk:fox#3": {
"name": "구미 여우불",
"lore": "구미호의 아홉 꼬리마다 여우불이 하나씩 깃들었다고 전하지.",
"desc": "10초 동안 여우불 9개가 돌다가 가까운 적을 쫓아감"
},
"hbasic:reaper": {
"name": "저승 사슬",
"lore": "저승차사의 사슬에 묶인 혼은 이승으로 돌아가지 못한다고 하지.",
"desc": "사슬을 휘둘러 가까운 적을 친다."
},
"hsk:reaper#0": {
"name": "사슬 당기기",
"lore": "던진 사슬이 한 번 감기면 이름 불린 혼은 끌려오고 만다.",
"desc": "사슬을 던져 맞은 적을 끌어오고 160% 피해"
},
"hsk:reaper#1": {
"name": "명부 기록",
"lore": "명부에 이름이 오른 자는 먹물이 마르기 전에 저승길에 선다.",
"desc": "가리킨 곳에 표식, 4초 동안 초당 160% 피해"
},
"hsk:reaper#2": {
"name": "혼 거두기",
"lore": "차사가 낫을 휘두르면 흩어진 혼이 그의 품으로 모여든다지.",
"desc": "주변 170% 피해, 맞힌 적마다 체력 4% 회복"
},
"hsk:reaper#3": {
"name": "저승문",
"lore": "닫힌 저승문이 열리면 목숨 얼마 안 남은 자부터 빨려 든다.",
"desc": "가리킨 곳에 5초 동안 저승문 (초당 300%, 체력 15% 이하 적 25% 확률 즉사)"
},
"hbasic:haerang": {
"name": "물결 베기",
"lore": "수군장의 칼끝이 지나간 자리엔 파도 같은 흔적만 남았다.",
"desc": "칼을 휘둘러 앞의 적을 물결처럼 벤다."
},
"hsk:haerang#0": {
"name": "물살 가르기",
"lore": "물살을 타고 적진을 가르는 수군장의 배는 멈출 줄 몰랐다.",
"desc": "물살처럼 돌진하며 170% 피해"
},
"hsk:haerang#1": {
"name": "거북 방패",
"lore": "거북 등딱지처럼 단단한 방패는 왜적의 칼도 튕겨 냈다지.",
"desc": "4초 동안 받는 피해 -50% + 보호막 25%"
},
"hsk:haerang#2": {
"name": "소용돌이",
"lore": "바다가 성이 나면 소용돌이가 일어 배도 사람도 삼킨다 했다.",
"desc": "4초 동안 내 주변 소용돌이 (초당 130%, 느려짐)"
},
"hsk:haerang#3": {
"name": "거북선 포격",
"lore": "거북선 용머리에서 불을 뿜자 온 바다가 화약 내로 가득했지.",
"desc": "적에게 포탄 10발, 각 280%"
},
"hbasic:danbi": {
"name": "사냥 화살",
"lore": "매사냥꾼의 화살은 바람 소리보다 먼저 날아간다 했지.",
"desc": "가까운 적을 향해 화살을 쏜다."
},
"hsk:danbi#0": {
"name": "매 날리기",
"lore": "휘파람 한 번이면 사냥매가 구름을 뚫고 내려온다 하더라.",
"desc": "사냥매 2마리를 10초 동안 부름"
},
"hsk:danbi#1": {
"name": "연달아 쏘기",
"lore": "시위를 놓는 손이 보이지 않아 화살이 줄지어 날았다 하지.",
"desc": "화살 4발, 각 120%"
},
"hsk:danbi#2": {
"name": "올가미 덫",
"lore": "산짐승도 요괴도 올가미 줄에 발이 걸리면 도망치지 못했지.",
"desc": "가리킨 곳에 5초 동안 덫 (크게 느려짐, 초당 100%)"
},
"hsk:danbi#3": {
"name": "매의 폭풍",
"lore": "하늘이 매 떼로 어두워지더니 화살이 비처럼 쏟아졌다더라.",
"desc": "2초 동안 따라가는 화살 24발, 각 140%"
},
"hbasic:cheonrang": {
"name": "백호 언월도",
"lore": "백호신장이 쥔 언월도는 달빛처럼 희고 호랑이 발톱처럼 날카롭다.",
"desc": "언월도를 크게 휘둘러 앞의 적을 벤다."
},
"hsk:cheonrang#0": {
"name": "백호 돌격",
"lore": "흰 호랑이가 내달리면 산도 길을 비켜 주었다고 전하지.",
"desc": "돌진 240% + 끝에 160% 폭발, 무적"
},
"hsk:cheonrang#1": {
"name": "백호의 포효",
"lore": "백호의 포효가 골짜기를 울리면 요괴도 다리가 풀렸다 하지.",
"desc": "넓게 140% + 1.2초 기절"
},
"hsk:cheonrang#2": {
"name": "백호 혼령",
"lore": "백호의 옛 혼령이 신장의 부름에 안개 속에서 걸어 나왔다.",
"desc": "백호 혼령을 12초 동안 부름"
},
"hsk:cheonrang#3": {
"name": "백호신 강림",
"lore": "서쪽의 수호신이 몸에 내리니 신장의 두 눈이 금빛으로 타올랐다.",
"desc": "10초 동안 공격력 +70%·공격 속도 +50%, 주변을 10번 각 180%"
},
"hbasic:hwaryeon": {
"name": "주작 불씨",
"lore": "주작의 날갯짓에서 떨어진 불씨는 꺼지지 않고 무녀 곁을 맴돈다.",
"desc": "가까운 적을 향해 불씨를 날린다."
},
"hsk:hwaryeon#0": {
"name": "주작 깃털",
"lore": "주작이 깃을 털자 붉은 깃털마다 불이 붙어 적을 좇았다지.",
"desc": "따라가는 불깃털 6개, 각 130% + 불태움"
},
"hsk:hwaryeon#1": {
"name": "불사의 날개",
"lore": "재가 된 새가 다시 날아오르듯 무녀도 불길 속에서 일어선다.",
"desc": "체력 20% 회복 + 1.5초 무적"
},
"hsk:hwaryeon#2": {
"name": "화염 방울진",
"lore": "무녀가 방울을 울리며 춤추면 땅에 붉은 불의 진이 그려졌다.",
"desc": "가리킨 곳에 5초 동안 불의 진 (초당 220%)"
},
"hsk:hwaryeon#3": {
"name": "주작 강림",
"lore": "남쪽 하늘이 갈라지고 주작이 내린 불벼락이 온 땅을 태웠다.",
"desc": "적에게 불벼락 12번 각 340% + 체력 25% 회복"
},
"hbasic:dolsoe": {
"name": "쇠스랑 찍기",
"lore": "논밭 갈던 쇠스랑도 의병의 손에 들리면 창이 되었다지.",
"desc": "쇠스랑을 내리찍어 앞의 적을 친다."
},
"hsk:dolsoe#0": {
"name": "논두렁 돌진",
"lore": "논두렁을 달리던 다리 힘으로 돌쇠는 적진까지 단숨에 뛰었다.",
"desc": "앞으로 돌진하며 150% 피해"
},
"hsk:dolsoe#1": {
"name": "쇠스랑 휘돌리기",
"lore": "쇠스랑을 휘휘 돌리면 볏단 베듯 적이 나가떨어졌다 하지.",
"desc": "주변 적에게 170% 피해"
},
"hsk:dolsoe#2": {
"name": "막걸리 한 사발",
"lore": "농사일 끝에 들이켜는 한 사발에 없던 힘도 솟는다 했지.",
"desc": "체력 20% 회복 + 5초 동안 공격력 +20%"
},
"hsk:dolsoe#3": {
"name": "의병 봉기",
"lore": "나라가 어지러우면 호미 든 이웃들이 하나둘 모여들었다.",
"desc": "의병 3명을 12초 동안 부름"
},
"hbasic:pojol": {
"name": "육모방망이",
"lore": "포졸의 허리춤에서 떠난 적 없는 여섯 모 난 몽둥이라.",
"desc": "방망이를 휘둘러 가까운 적을 친다"
},
"hsk:pojol#0": {
"name": "포승줄 던지기",
"lore": "한번 걸리면 도깨비도 풀지 못한다던 포도청의 붉은 줄이다.",
"desc": "줄을 던져 150% 피해 + 1초 기절"
},
"hsk:pojol#1": {
"name": "게 섰거라!",
"lore": "포졸이 외치면 달아나던 놈도 발이 땅에 붙는다지.",
"desc": "주변 적 1.2초 기절 + 120% 피해"
},
"hsk:pojol#2": {
"name": "순라 돌기",
"lore": "밤길을 도는 순라꾼의 발걸음은 귀신도 피해 갔다 한다.",
"desc": "6초 동안 이동 속도 +35%, 받는 피해 -20%"
},
"hsk:pojol#3": {
"name": "포도청 출동",
"lore": "북소리 울리면 포도청 문이 열리고 포졸들이 쏟아졌지.",
"desc": "적에게 방망이를 8번 내려치기, 각 220% 피해"
},
"hbasic:yakcho": {
"name": "약초 주머니",
"lore": "산을 오르내리며 캔 풀뿌리가 가득 든 낡은 주머니다.",
"desc": "약초를 던져 적을 맞힌다"
},
"hsk:yakcho#0": {
"name": "쑥 연기",
"lore": "쑥을 태운 연기는 잡귀를 쫓고 독한 기운도 흩는다 했다.",
"desc": "4초 동안 연기를 피워 초당 90% 피해, 적을 느리게 함"
},
"hsk:yakcho#1": {
"name": "독초 세 갈래",
"lore": "뿌리 셋 갈라진 독초는 한 모금에 범도 눕힌다 하더라.",
"desc": "독초 3발 각 120% 피해 + 중독"
},
"hsk:yakcho#2": {
"name": "인삼 달인 물",
"lore": "백 년 묵은 산삼을 달인 물은 죽다 산 이도 일으킨다.",
"desc": "체력 30% 회복"
},
"hsk:yakcho#3": {
"name": "백초 비",
"lore": "온갖 풀잎이 비처럼 쏟아지니 상처마저 아물었다는 전설이다.",
"desc": "약초 비 12번 각 180% 피해, 내 체력 15% 회복"
},
"hbasic:namu": {
"name": "도끼 던지기",
"lore": "나무 베던 손도끼도 던지면 날아가 적의 뼈를 가른다.",
"desc": "도끼를 던져 적을 맞힌다"
},
"hsk:namu#0": {
"name": "통나무 굴리기",
"lore": "산비탈에서 굴러 내린 통나무에 호랑이도 비켜섰다 한다.",
"desc": "꿰뚫는 통나무 200% 피해 + 밀쳐냄"
},
"hsk:namu#1": {
"name": "도끼 회오리",
"lore": "도끼를 휘두르면 바람이 일어 낙엽도 적도 흩날린다.",
"desc": "주변에 160% 피해를 2번 줌"
},
"hsk:namu#2": {
"name": "산사람 근성",
"lore": "산에서 자란 몸은 웬만한 매질엔 꿈쩍도 않는 법이지.",
"desc": "보호막 25% + 5초 동안 받는 피해 -25%"
},
"hsk:namu#3": {
"name": "금도끼 은도끼",
"lore": "산신령이 건넨 금도끼와 은도끼가 사방에서 날아든다.",
"desc": "금·은 도끼 10개를 사방으로 던져 각 260% 피해"
},
"hbasic:geommu": {
"name": "쌍검 춤",
"lore": "두 자루 칼이 나비처럼 날면 구경하던 이도 넋을 잃었다.",
"desc": "쌍검으로 가까운 적을 벤다"
},
"hsk:geommu#0": {
"name": "꽃잎 걸음",
"lore": "꽃잎 지듯 사뿐히 걸으면 어느새 적의 코앞에 서 있다.",
"desc": "순간이동 + 그 자리에 150% 피해"
},
"hsk:geommu#1": {
"name": "칼춤 연무",
"lore": "소맷자락 따라 칼빛이 번지면 연무처럼 아득해진다.",
"desc": "주변을 6번 베기, 각 60% 피해"
},
"hsk:geommu#2": {
"name": "부채 가림",
"lore": "활짝 편 부채 뒤로 모습을 감추면 칼날도 비껴간다.",
"desc": "2초 무적 + 5초 동안 공격 속도 +30%"
},
"hsk:geommu#3": {
"name": "진주성 검무",
"lore": "진주성에서 왜장을 안고 뛰어든 논개의 넋이 깃든 춤이라.",
"desc": "적 사이를 넘나들며 10번 베기, 각 200% 피해"
},
"hbasic:mudang": {
"name": "방울 소리",
"lore": "무당이 흔드는 방울이 울리면 귀신이 먼저 고개를 든다.",
"desc": "방울 소리의 기운을 날려 적을 맞힌다"
},
"hsk:mudang#0": {
"name": "오방기 휘날림",
"lore": "청·홍·황·백·흑 다섯 깃발이 사방의 잡귀를 몰아낸다.",
"desc": "다섯 색 깃발 5발, 각 110% 피해"
},
"hsk:mudang#1": {
"name": "작두 타기",
"lore": "시퍼런 작두날 위에서도 신이 내리면 발이 베이지 않는다.",
"desc": "3초 무적 + 주변에 초당 120% 피해"
},
"hsk:mudang#2": {
"name": "넋 달래기",
"lore": "한 맺힌 넋을 달래면 이승에 남아 곁을 지켜 준다.",
"desc": "혼령 2명을 10초 동안 부름"
},
"hsk:mudang#3": {
"name": "대굿",
"lore": "징과 꽹과리가 밤새 울리는 큰 굿판엔 잡귀도 발을 못 뗀다.",
"desc": "큰 굿판을 벌여 6초 동안 넓은 자리에 초당 200% 피해, 적을 느리게 함"
},
"hbasic:hwarang": {
"name": "화랑 검",
"lore": "신라 화랑이 허리에 차고 산천을 누비던 곧은 칼이다.",
"desc": "검으로 가까운 적을 벤다"
},
"hsk:hwarang#0": {
"name": "임전무퇴",
"lore": "싸움에 나서면 물러서지 않는다는 화랑의 세속오계다.",
"desc": "6초 동안 공격력 +30%, 받는 피해 -20%"
},
"hsk:hwarang#1": {
"name": "말발굽 돌격",
"lore": "사다함이 말을 달려 적진으로 뛰어들던 기세 그대로다.",
"desc": "길게 돌진하며 180% 피해"
},
"hsk:hwarang#2": {
"name": "풍월 검기",
"lore": "풍월을 읊조리며 휘두르면 검기가 바람처럼 갈라 나간다지.",
"desc": "적을 꿰뚫는 검기 3발, 각 150%"
},
"hsk:hwarang#3": {
"name": "신라의 별",
"lore": "새벽 하늘의 별이 화랑의 칼끝 따라 쏟아졌다고 전한다.",
"desc": "별빛이 7번 떨어져 각 300%"
},
"hbasic:eosa": {
"name": "마패 치기",
"lore": "임금이 내린 마패, 말 대신 악당의 머리를 먼저 울린다.",
"desc": "마패로 가까운 적을 내려친다."
},
"hsk:eosa#0": {
"name": "암행어사 출두야!",
"lore": "'출두야!' 외침 한마디에 탐관오리의 다리가 풀렸다지.",
"desc": "주변 적을 1.5초 기절시키고 160% 피해"
},
"hsk:eosa#1": {
"name": "마패 빛",
"lore": "마패에 새긴 말이 빛으로 달려 어둠을 뚫는다지.",
"desc": "적을 꿰뚫는 빛 220%"
},
"hsk:eosa#2": {
"name": "변복 잠행",
"lore": "남루한 옷 한 벌이면 어사도 길손으로 감쪽같이 사라지지.",
"desc": "4초 동안 몸을 숨기고, 다음 공격은 치명타, 이동 속도 +30%"
},
"hsk:eosa#3": {
"name": "역졸 총출동",
"lore": "마패를 높이 들면 역졸들이 사방에서 몰려든다지.",
"desc": "역졸 4명을 12초 동안 부리고, 적에게 낙인 6번 각 220%"
},
"hbasic:sorikun": {
"name": "북장단",
"lore": "북채 한 번에 장단이 터지면 잡귀도 어깨를 들썩인다지.",
"desc": "북을 두드려 가까운 적을 친다."
},
"hsk:sorikun#0": {
"name": "진양조",
"lore": "느릿한 진양조 가락에 산도 숨을 늦춘다고 하지.",
"desc": "느린 소리가 서린 자리를 5초간 만들어 초당 100% 피해, 적 느려짐"
},
"hsk:sorikun#1": {
"name": "휘모리",
"lore": "휘모리장단이 몰아치면 귀신도 박자를 놓친다지.",
"desc": "빠른 장단 8발, 각 80%"
},
"hsk:sorikun#2": {
"name": "얼씨구!",
"lore": "추임새 한마디에 지친 몸도 어깨춤이 절로 난다지.",
"desc": "6초 동안 공격 속도 +35%, 체력 15% 회복"
},
"hsk:sorikun#3": {
"name": "한바탕 판소리",
"lore": "한바탕 소리가 터지면 온 집이 들썩이고 귀신이 넋을 잃지.",
"desc": "온 방에 울리는 소리 400%, 1.5초 기절"
},
"hbasic:eulji": {
"name": "대장군 창",
"lore": "고구려 대장군이 쥔 창은 수나라 군사를 꿰뚫었다지.",
"desc": "창으로 가까운 적을 찌른다."
},
"hsk:eulji#0": {
"name": "살수 대첩",
"lore": "살수의 강물을 터뜨려 수나라 대군을 휩쓸었다고 전한다.",
"desc": "물살이 서린 자리를 5초간 만들어 초당 150% 피해, 적 느려짐, 밀쳐냄"
},
"hsk:eulji#1": {
"name": "철기 돌격",
"lore": "철갑 두른 말들이 달려 나가면 막을 자가 없었다지.",
"desc": "무적 상태로 돌진해 220%"
},
"hsk:eulji#2": {
"name": "고구려 군단",
"lore": "깃발 아래 고구려 병사들이 땅에서 일어선다고 하지.",
"desc": "고구려 병사 3명을 14초 동안 부린다"
},
"hsk:eulji#3": {
"name": "여수장우중문시",
"lore": "붓끝으로 적장을 꾸짖은 시 한 수가 십만 대군을 물렸다지.",
"desc": "적 장수를 꾸짖는 시: 온 방 500%, 8초 동안 공격력 +40%"
},
"hbasic:haemosu": {
"name": "햇살 화살",
"lore": "해모수가 쏜 햇살은 어둠 속 요괴의 눈을 먼저 태웠다지.",
"desc": "햇살 화살을 쏜다."
},
"hsk:haemosu#0": {
"name": "오룡거 질주",
"lore": "다섯 용이 끄는 수레가 하늘길을 내달렸다고 전한다.",
"desc": "다섯 용 수레로 돌진해 250%"
},
"hsk:haemosu#1": {
"name": "태양 화살비",
"lore": "해가 쏟아내는 빛줄기가 비 되어 내린다고 하지.",
"desc": "햇살 화살 9발, 각 130%"
},
"hsk:haemosu#2": {
"name": "천제의 가호",
"lore": "천제의 아들에게 하늘이 내려준 가호가 몸을 감싼다지.",
"desc": "8초 동안 공격력 +40%, 보호막 30%"
},
"hsk:haemosu#3": {
"name": "하늘 문 열림",
"lore": "하늘 문이 열리면 햇빛 기둥이 땅을 내리꽂았다지.",
"desc": "하늘에서 햇빛 기둥 14번, 각 380%"
},
"hbasic:jipsin": {
"name": "지푸라기 주먹",
"lore": "볏짚 속에 든 건 설움뿐, 그래도 주먹은 제법 맵다지.",
"desc": "짚으로 만든 주먹으로 가까운 적을 친다."
},
"hsk:jipsin#0": {
"name": "짚단 날리기",
"lore": "묶은 짚단을 풀어 던지면 바람 타고 날카롭게 날아간다지.",
"desc": "짚단 5발, 각 110%"
},
"hsk:jipsin#1": {
"name": "허수아비 바꿔치기",
"lore": "논두렁 허수아비가 대신 서고 장군은 어느새 저만치 있지.",
"desc": "순간이동, 떠난 자리에서 미끼가 터져 180%"
},
"hsk:jipsin#2": {
"name": "백 번 쓰러져도",
"lore": "백 번 쓰러져도 짚 한 줌 추스르면 다시 일어난다지.",
"desc": "체력 35% 회복, 5초 동안 받는 피해 -40%"
},
"hsk:jipsin#3": {
"name": "허수아비 군단",
"lore": "들판의 허수아비들이 장군 부름에 줄지어 걸어 나온다지.",
"desc": "허수아비 병사 5명을 14초 동안 부린다"
},
"hbasic:bong": {
"name": "발톱",
"lore": "고양이 발톱 같지만 요괴 가죽도 단번에 긁어낸다지.",
"desc": "발톱으로 가까운 적을 할퀸다."
},
"hsk:bong#0": {
"name": "야성의 할퀴기",
"lore": "들짐승의 피가 끓으면 발톱이 먼저 앞서 나간다지.",
"desc": "돌진하며 할퀴어 170% 피해"
},
"hsk:bong#1": {
"name": "달밤 도약",
"lore": "보름달 밤이면 담장 위도 한달음에 넘어간다지.",
"desc": "가리킨 곳으로 뛰어올라 착지 시 200% + 기절"
},
"hsk:bong#2": {
"name": "울부짖음",
"lore": "산중 호랑이를 닮은 울음 한 번에 숲의 짐승이 모두 숨을 죽였다지",
"desc": "주변 적을 1.5초 동안 겁먹어 느려지게 하고, 6초 동안 공격력 +35%"
},
"hsk:bong#3": {
"name": "야수 해방",
"lore": "묶어 둔 짐승의 넋을 풀자 여우불이 달무리처럼 몸을 감쌌다지",
"desc": "10초 동안 공격력 +60%, 공격 속도 +60%, 흡혈 8%. 주변에 여우불 6개가 맴돈다"
}
};

(function () {
  const T = { boon: typeof BOONS !== "undefined" && BOONS, active: typeof ACTIVES !== "undefined" && ACTIVES, skill: typeof SKILLS !== "undefined" && SKILLS, shop: typeof SHOP_ITEMS !== "undefined" && SHOP_ITEMS, art: typeof ARTIFACTS !== "undefined" && ARTIFACTS, pet: typeof PETS !== "undefined" && PETS, title: typeof TITLES !== "undefined" && TITLES, curse: typeof CURSES !== "undefined" && CURSES };
  const C = {}; for (const ch of (typeof CHARS !== "undefined" ? CHARS : [])) C[ch.id] = ch;
  for (const full in CONCEPT_TEXT) { const [cat, k] = full.split(":"), v = CONCEPT_TEXT[full]; let o = null;
    if (cat === "hbasic") o = C[k] && C[k].basic; else if (cat === "hsk") { const [id, i] = k.split("#"); o = C[id] && C[id].sk && C[id].sk[+i]; } else o = T[cat] && T[cat][k];
    if (!o) continue; o.name = v.name; o.desc = v.desc; o.lore = v.lore; }
})();

// 11-21 영어 사전 (gen_i18n.py 가 만듦 — 고칠 땐 art_raw/i18n_en_cache.json 고치고 다시 실행)
const I18N_EN = {"게임 화면":"Game Screen","요괴록":"Yogoerok","조선 요괴 토벌기":"Joseon Yokai Hunt","아이디: {0}":"ID: {0}","개발자":"Developer","PC 앱 설치":"Install PC App","로그아웃":"Log Out","지금 영웅":"Current Hero","강휘":"Ganghwi","무사":"Warrior","주말 혼불 축제":"Weekend Soulfire Festival","· 오늘은 판에서 얻는 혼불":"· Soulfire earned per run today","{0}배":"×{0}","오늘의 괴담":"Daily Tale","오늘의 영웅":"Hero of the Day","흑운 · 강령술사":"Black Cloud · Necromancer","바람 걸음 — 이동 속도 +{0}% · 재사용 -{1}%":"Wind Step — Move Speed +{0}% · Cooldown -{1}%","거인의 밤 — 정예 요괴 {0}배":"Night of Giants — Elite yokai ×{0}","오늘 첫 도전":"First Run Today","보상 ×{0}":"Loot ×{0}","주막 창고":"Tavern Storehouse","쉬는 동안에도 혼불이 쌓여요 · 시간당 {0}":"Soulfire gathers even while you rest · {0} per hour","쌓이는 중":"Gathering","출정":"Set Out","스토리":"Story","다섯 장의 이야기 · 도달 {0}장":"A tale in five chapters · Reached Chapter {0}","무한의 방":"Endless Rooms","끝없이 내려가는 방":"Rooms that descend forever","보스 레이드":"Boss Raid","장 보스 다섯 연속":"Five Chapter Bosses in a row","{0}대{1} 대전":"{0}v{1} Duel","{0}판 {1}선승 · {2}승":"Best of {0}, first to {1} · {2} wins","연습장":"Training Ground","모든 영웅 체험 · 허수아비":"Try every hero · Scarecrow","개발자 맵":"Developer Map","보스·상점·스킬 확인":"Check bosses, shops, skills","오늘의 토벌령":"Today's Bounty","지정 요괴를 토벌하면 코인 {0} · 셋 다 토벌하면 코인 +{1}, 강화 조각 +{2} (매일 새로)":"Defeat the marked yokai for {0} jade · Defeat all three for +{1} jade and +{2} blessing shards (renews daily)","물귀신":"Water Ghost","{0}장 중간보스":"Chapter {0} Mid-Boss","불여우":"Fire Fox","불꽃 귀신":"Flame Ghost","{0}장 보스":"Chapter {0} Boss","영웅":"Heroes","스킬":"Skills","뽑기":"Summon","무료":"Free","소지품":"Belongings","혼불 제단":"Soulfire Altar","토벌 시즌":"Hunt Season","임무":"Missions","도감":"Bestiary","기록":"Records","함께하기":"Co-op","도움말":"Help","설정":"Settings","출석 {0}일째":"Day {0} Attendance","{0}일 ✓":"Day {0} ✓","{0}일":"Day {0}","코인 +{0}":"Jade +{0}","매일 들어오면 받아요. {0}일 연속이면 큰 보상":"Claim daily when you log in. Hit a {0}-day streak for a big reward.","받기":"Claim","요괴록 · 조선 요괴 토벌기":"Yogoerok · Chronicle of the Joseon Yokai Hunt","아이디":"ID","비밀번호":"Password","닉네임":"Nickname","(새 계정 만들 때 · {0}자까지, 나중에 설정에서 바꿀 수 있어요)":"(For new accounts · up to {0} characters, changeable later in Settings)","게임에서 보일 이름":"Name shown in game","자동 로그인 (다음부터 바로 시작)":"Auto login (start instantly next time)","로그인":"Log In","새 계정 만들기":"Create Account","▶ 바로 시작 (게스트)":"▶ Quick Start (Guest)","☁️ 같은 아이디로 로그인하면 PC·폰 어디서든 이어서 해요 · v{0}":"☁️ Log in with the same ID to continue on PC or phone · v{0}","바로 시작 (게스트)":"Quick Start (Guest)","같은 아이디로 로그인하면 PC·폰 어디서든 이어서 해요 · v{0}":"Log in with the same ID to continue on PC or phone · v{0}","오늘 할 일":"Today's Tasks","{0}개 남음":"{0} left","출석":"Check-in","무료 뽑기":"Free Summon","토벌령 {0}/{1}":"Bounty {0}/{1}","← 뒤로":"← Back","📖 스토리 모드 · 영웅 선택":"📖 Story Mode · Choose Hero","코인":"Jade","SS급":"Rank SS","천랑":"Cheonrang","백호신장":"White Tiger General","추천":"Pick","화련":"Hwaryeon","주작무녀":"Vermilion Bird Shaman","해모수":"Haemosu","천제의 아들":"Son of the Heavenly Emperor","S급":"Rank S","월영":"Woleong","월하검희":"Moonlit Sword Gisaeng","천뢰":"Cheonroe","뇌전장군":"Thunder General","여우비":"Yeouobi","구미호":"Gumiho","명부":"Myeongbu","저승차사":"Jeoseung Saja","을지문덕":"Eulji Mundeok","고구려 대장군":"Goguryeo Grand General","A급":"Rank A","해랑":"Haerang","수군장":"Naval Commander","단비":"Danbi","매사냥꾼":"Falconer","이몽룡":"Yi Mongryong","암행어사":"Secret Royal Inspector","소리":"Sori","소리꾼":"Pansori Singer","특수 임무":"Special Mission","짚신":"Jipsin","허수아비 장군":"Scarecrow General","봉냥이":"Bongnyang-i","수인":"Beastkin","B급":"Rank B","연화":"Yeonhwa","무녀":"Shaman","흑운":"Heugun","강령술사":"Necromancer","야명":"Yamyeong","자객":"Assassin","층 도달":"Floor Reached","청운":"Cheongun","도사":"Taoist Sage","백야":"Baekya","음양사":"Yin-Yang Master","소담":"Sodam","소환사":"Summoner","거칠":"Geochil","광전사":"Berserker","설화":"Seolhwa","검무 기생":"Sword-Dance Gisaeng","만신":"Mansin","큰무당":"High Shaman","사다함":"Sadaham","화랑":"Hwarang","C급":"Rank C","기본":"Basic","임무 해금":"Unlock via Quest","설아":"Seola","궁수":"Archer","도윤":"Doyun","창병":"Spearman","무진":"Mujin","권법가":"Martial Artist","철매":"Cheolmae","포수":"Musketeer","돌쇠":"Dolsoe","의병 농부":"Militia Farmer","삼식":"Samsik","포졸":"Constable","초롱":"Chorong","약초꾼":"Herbalist","곰배":"Gombae","나무꾼":"Woodcutter","강휘 · 무사":"Ganghwi · Warrior","“칼은 무겁게, 마음은 가볍게. 그게 내 아버지의 가르침이었다.”":"\"Heavy blade, light heart. That was my father's teaching.\"","체력 {0} · 공격 {1} · 이동 {2} · 근접 · 사거리 {3} · 속성":"HP {0} · ATK {1} · Speed {2} · Melee · Range {3} · Element","불":"Fire","숙련 Lv.{0}":"Mastery Lv.{0}","{0}/{1} · 이 영웅 공격력·체력 +{2}% (판을 할수록 올라요)":"{0}/{1} · This hero's ATK & HP +{2}% (grows as you play)","강화 +{0}":"Blessing +{0}","조각 {0} / 다음 강화 {1} · 성공 {2}% · 단계마다 공격·체력 +{3}%":"Shards {0} / Next blessing {1} · Success {2}% · Each tier: ATK & HP +{3}%","강화":"Blessing","전직":"Class Advance","정보":"Info","좌클릭":"Left Click","환도 베기":"Hwando Slash","기본 공격 · {0}초":"Basic attack · {0}s","베어 가르기":"Cleaving Slash","· {0}초":"· {0}s","바람보다 먼저 길을 열고 지나간 자리엔 갈라진 그림자만 남았다.":"He opened the path before the wind, and only split shadows remained where he passed.","앞으로 돌진하며 지나간 적에게 {0}% 피해":"Dash forward, dealing {0}% damage to enemies passed through","회오리 베기":"Whirlwind Slash","한 바퀴 돌면 사방의 귀신이 낙엽처럼 흩날렸다고 전해진다.":"They say one full turn scattered the ghosts on every side like fallen leaves.","주변 적에게 {0}% 피해 + 밀쳐냄":"Deal {0}% damage to nearby enemies + knockback","철벽 자세":"Iron Wall Stance","두 발을 땅에 박고 칼을 세우면 성벽도 부럽지 않았다지.":"Feet planted, blade raised, even a fortress wall would have envied him.","{0}초 동안 받는 피해 -{1}%, 최대 체력 {2}% 보호막":"Damage taken -{1}% for {0}s, plus a shield worth {2}% max HP","검기 폭풍":"Sword Qi Storm","칼끝에서 일어난 푸른 검기가 폭풍이 되어 온 사방을 쓸었다.":"Blue sword qi rose from the blade's tip, grew into a storm, and swept in every direction.","{0}초 동안 주변을 {1}번 베어 각 {2}% 피해":"Slash nearby foes {1} times over {0}s, each hit dealing {2}% damage","원정 중 레벨이 되면 둘 중 하나를 골라요 (그 원정 동안)":"When you level up during a run, choose one of two (for that run only)","{0}차":"Tier {0}","검호":"Blade Master","공격력 +{0}% · 치명타 피해 +{1}%":"ATK +{0}% · Critical hit damage +{1}%","✨ {0}번 스킬이 '날선'으로 바뀜 · 위력 +{1}%":"✨ Skill {0} becomes 'Keen' · Power +{1}%","철벽무사":"Ironwall Warrior","최대 체력 +{0}% · 받는 피해 -{1}% · 반사 {2}%":"Max HP +{0}% · Damage taken -{1}% · Reflect {2}%","✨ {0}번 스킬이 '날선'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"✨ Skill {0} becomes 'Keen' · Cooldown -{1}% · Power +{2}%","검성":"Sword Sage","✨ {0}번 스킬이 '깊은'으로 바뀜 · 위력 +{1}%":"✨ Skill {0} becomes 'Deep' · Power +{1}%","불괴장군":"Unbroken General","✨ {0}번 스킬이 '깊은'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"✨ Skill {0} becomes 'Deep' · Cooldown -{1}% · Power +{2}%","검신":"Sword God","✨ {0}번 스킬이 '극(極)'으로 바뀜 · 위력 +{1}%":"✨ Skill {0} becomes 'Apex' · Power +{1}%","천하대장군":"Great General of the Realm","✨ {0}번 스킬이 '극(極)'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"✨ Skill {0} becomes 'Apex' · Cooldown -{1}% · Power +{2}%","{0}차 각성":"Tier {0} Awakening","검선":"Sword Immortal","✨ {0}번 스킬이 '각성'으로 바뀜 · 위력 +{1}%":"✨ Skill {0} becomes 'Awakened' · Power +{1}%","금강대장군":"Diamond Great General","✨ {0}번 스킬이 '각성'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"✨ Skill {0} becomes 'Awakened' · Cooldown -{1}% · Power +{2}%","{0}차 초월":"Tier {0} Transcendence","검제":"Sword Emperor","✨ 모든 스킬이 '초월'으로 바뀜 · 위력 +{0}%":"✨ All skills become 'Transcendent' · Power +{0}%","만고대장군":"Eternal Great General","✨ 모든 스킬이 '초월'으로 바뀜 · 대기 -{0}% · 위력 +{1}%":"✨ All skills become 'Transcendent' · Cooldown -{0}% · Power +{1}%","등급":"Rank","(기본 능력 ×{0})":"(Base stats ×{0})","얻는 법":"How to Get","속성":"Element","· 공격 방식":"· Attack Style","근접":"Melee","· 사거리":"· Range","근접 투지":"Melee Grit","받는 피해 -{0}% · 최대 체력 +{1}% · 흡혈 {2}% · 이동 속도 +{3}%":"Damage taken -{0}% · Max HP +{1}% · Lifesteal {2}% · Move speed +{3}%","조각":"Shards","· 강화":"· Blessing","장착 스킬":"Equipped Skills","/{0} 칸 바꿈":"/{0} slots changed","시작 장:":"Start Chapter:","{0}장":"Chapter {0}","난이도:":"Difficulty:","쉬움":"Easy","보통":"Normal","어려움":"Hard","매우 어려움":"Very Hard","보상(엽전·경험·혼불) 쉬움 ×{0} · 보통 ×{1} · 어려움 ×{2} · 매우 어려움 ×{3}":"Rewards (coins · EXP · Soulfire): Easy ×{0} · Normal ×{1} · Hard ×{2} · Very Hard ×{3}","금기 계약":"Taboo Pact","저주를 걸고 내려가면 하나마다 혼불 +{0}%":"Descend under curses: +{0}% Soulfire for each","시야가 좁아져요":"Your vision narrows","어둠":"Darkness","받는 피해 +{0}%":"Damage taken +{0}%","피":"Blood","회복 효과 절반":"Healing halved","메마름":"Drought","요괴가 {0}% 빨라져요":"Yokai are {0}% faster","질주":"Rush","방마다 요괴 +{0}%":"Yokai +{0}% per room","무리":"Horde","요괴가 받는 피해 -{0}%":"Yokai take -{0}% damage","강철":"Steel","쓰러진 요괴가 잠시 뒤 터져요":"Fallen yokai explode shortly after","원한":"Grudge","스킬·액티브 대기 시간 +{0}%":"Skill & active item cooldown +{0}%","봉인":"Seal","고르지 않으면 평소처럼":"Skip to play as usual","이 영웅로 출발 ▶":"Start with This Hero ▶","📜 이 영웅 스킬 바꾸기":"📜 Change Hero Skills","이 영웅로 출발":"Start with This Hero","스토리 모드 · 영웅 선택":"Story Mode · Choose Hero","{0}번 스킬이 '날선'으로 바뀜 · 위력 +{1}%":"Skill {0} becomes Keen · Power +{1}%","{0}번 스킬이 '날선'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"Skill {0} becomes Keen · Cooldown -{1}% · Power +{2}%","{0}번 스킬이 '깊은'으로 바뀜 · 위력 +{1}%":"Skill {0} becomes Deep · Power +{1}%","{0}번 스킬이 '깊은'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"Skill {0} becomes Deep · Cooldown -{1}% · Power +{2}%","{0}번 스킬이 '극(極)'으로 바뀜 · 위력 +{1}%":"Skill {0} becomes Apex · Power +{1}%","{0}번 스킬이 '극(極)'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"Skill {0} becomes Apex · Cooldown -{1}% · Power +{2}%","{0}번 스킬이 '각성'으로 바뀜 · 위력 +{1}%":"Skill {0} becomes Awakened · Power +{1}%","{0}번 스킬이 '각성'으로 바뀜 · 대기 -{1}% · 위력 +{2}%":"Skill {0} becomes Awakened · Cooldown -{1}% · Power +{2}%","모든 스킬이 '초월'으로 바뀜 · 위력 +{0}%":"All skills become Transcendent · Power +{0}%","모든 스킬이 '초월'으로 바뀜 · 대기 -{0}% · 위력 +{1}%":"All skills become Transcendent · Cooldown -{0}% · Power +{1}%","이 영웅 스킬 바꾸기":"Change Hero Skills","🧑 영웅":"🧑 Heroes","📜 스킬":"📜 Skills","🔮 보물":"🔮 Relics","🐾 펫":"🐾 Pets","🏷️ 칭호":"🏷️ Titles","⭐ 이번 주 길한 영웅 · 해랑 (수군장)":"⭐ This Week's Featured Hero · Haerang (Naval Commander)","A급 영웅이 나오면":"When an A-rank hero appears,","확률로 해랑 · {0}일 뒤 바뀜":"chance it's Haerang · Changes in {0} days","🧑 영웅 뽑기":"🧑 Hero Summon","모두 모았어요!":"All collected!","백호신장 · 보유":"White Tiger General · Owned","주작무녀 · 보유":"Vermilion Bird Shaman · Owned","천제의 아들 · 보유":"Son of Heaven · Owned","월하검희 · 보유":"Moonlit Sword Maiden · Owned","뇌전장군 · 보유":"Thunder General · Owned","구미호 · 보유":"Gumiho · Owned","저승차사 · 보유":"Jeoseung Saja · Owned","고구려 대장군 · 보유":"Goguryeo Grand General · Owned","수군장 · 보유":"Naval Commander · Owned","매사냥꾼 · 보유":"Falconer · Owned","암행어사 · 보유":"Secret Royal Inspector · Owned","소리꾼 · 보유":"Pansori Singer · Owned","검무 기생 · 보유":"Sword-Dance Gisaeng · Owned","큰무당 · 보유":"Grand Shaman · Owned","화랑 · 보유":"Hwarang · Owned","의병 농부 · 보유":"Righteous Army Farmer · Owned","포졸 · 보유":"Constable · Owned","약초꾼 · 보유":"Herbalist · Owned","나무꾼 · 보유":"Woodcutter · Owned","{0}% · 조각 {1}~{2}개 (해금 {3}개) · 바로 획득 {4}%":"{0}% · {1}~{2} shards ({3} to unlock) · Instant {4}%","나머지: 가진 영웅 조각 {0}~{1}개 (강화용)":"Otherwise: {0}~{1} shards of an owned hero (for upgrades)","보장까지 {0}회 · 지금":"Pity in {0} Summons · Now","회째":"th Summon","오늘 무료 {0}회":"{0} free today","{0}회 ·":"{0}× ·","🪙 코인: 원정 성적 · 요괴·상자·보스 · 임무 · 출석 ·":"🪙 Jade: Expedition Results · Yokai·Chests·Bosses · Missions · Attendance ·","🎲 확률 보기":"🎲 View Odds","보물":"Relics","펫":"Pets","칭호":"Titles","이번 주 길한 영웅 · 해랑 (수군장)":"This Week's Featured Hero · Haerang (Naval Commander)","영웅 뽑기":"Hero Summon","코인: 원정 성적 · 요괴·상자·보스 · 임무 · 출석 ·":"Jade: Expedition Results · Yokai·Chests·Bosses · Missions · Attendance ·","확률 보기":"View Odds","보물 · 펫 · 칭호":"Relics · Pets · Titles","보물 {0}":"Relics {0}","눌러서 끼우고 빼요 · 대전에서는 적용 안 돼요":"Tap to equip or remove · Not applied in Duels","🔮 보물 {0}/{1}":"🔮 Relics {0}/{1}","🐾 펫 {0}/{1}":"🐾 Pets {0}/{1}","🏷️ 칭호 {0}/{1}":"🏷️ Titles {0}/{1}","숫돌":"Whetstone","일반 · +{0}":"Common · +{0}","장터 대장간 숫돌에는 수많은 칼의 한이 갈려 있다지.":"They say the whetstone at the market forge is ground with the sorrows of countless blades.","공격력 +{0}%":"Attack +{0}%","조각 {0}/{1} · 성공 {2}%":"Shards {0}/{1} · Success {2}%","얻는 법: 뽑기":"How to get: Summon","천 리 길 나선 나그네의 짚신은 닳을수록 가벼웠다지.":"The straw sandals of a traveler on a thousand-li road grew lighter the more they wore thin.","이동 속도 +{0}%":"Move Speed +{0}%","약초 주머니":"Herb Pouch","주막 아낙이 허리춤에 달아 준 주머니에서 쑥 냄새가 난다.":"The pouch the tavern woman tied at your waist smells of mugwort.","최대 체력 +{0}%":"Max HP +{0}%","복 엽전":"Fortune Coin","정월 첫날 복 자 새긴 엽전을 품으면 재물이 따른다지.":"Keep a coin engraved with the character for fortune on the first day of the new year, and wealth will follow.","엽전 획득 +{0}%":"Coin Gain +{0}%","포졸 패":"Constable's Tag","포졸 패를 찬 이에게는 잡귀도 함부로 덤비지 못했다.":"Even lesser spirits dared not lunge at one who wore a constable's tag.","받는 피해 -{0}%":"Damage Taken -{0}%","긴 심지":"Long Wick","희귀 · +{0}":"Rare · +{0}","긴 심지 등불은 어둠 속 요괴의 눈빛까지 비춘다 하였다.":"A lantern with a long wick is said to light even the gleaming eyes of yokai in the dark.","시야 밝기 +{0}%, 치명타 +{1}%":"Vision Brightness +{0}%, Critical Hit +{1}%","병법서":"Art of War","전장을 누빈 장수의 손때가 밴 책이라, 펼치면 길이 보인다고 하지.":"Worn by the hands of a general who strode the battlefield, this book is said to show you the way once opened.","스킬 대기 -{0}%":"Skill Cooldown -{0}%","호신 부적":"Guardian Talisman","무당이 피로 쓴 붉은 글씨가 악귀의 발길을 막아 준다지.":"The red characters a shaman wrote in blood are said to bar the path of evil spirits.","방마다 체력의 {0}%만큼 보호막":"Shield of {0}% of HP each room","풍경":"Wind Chime","처마 끝 맑은 소리에 잡귀가 놀라 달아난다는 절집의 물건이라.":"A temple charm whose clear ring at the eaves sends lesser spirits fleeing in fright.","공격 속도 +{0}%":"Attack Speed +{0}%","노리개":"Norigae","고운 매듭 사이로 행운이 스민다 하여 아낙들이 품에 지녔다지.":"Luck is said to seep through its fine knots, so women kept it close to their hearts.","치명타 +{0}%":"Critical Hit +{0}%","청동 거울":"Bronze Mirror","영웅 · +{0}":"Hero · +{0}","요괴의 참모습을 비춘다는 거울이라, 흉한 기운도 되받아 낸다.":"A mirror said to reveal a yokai's true form, it casts baleful energy right back.","맞으면 때린 적에게 {0}%를 되돌리고, 받는 피해 -{1}%":"When hit, reflect {0}% back to the attacker; Damage Taken -{1}%","범 송곳니":"Tiger Fang","산군의 송곳니를 몸에 지니면 범의 사나움이 깃든다 전해진다.":"Carry the fang of the Mountain Lord, and the tiger's ferocity will dwell within you, so the tale goes.","치명타 피해 +{0}%, 치명타 +{1}%":"Critical Damage +{0}%, Critical Hit +{1}%","여의주":"Yeouiju","용이 품던 구슬이라, 뜻하는 대로 때가 흐른다 하였다.":"A pearl once held by a dragon, it is said to bend time to your will.","궁극기(R) 대기 -{0}%, 스킬 대기 -{1}%":"Ultimate (R) Cooldown -{0}%, Skill Cooldown -{1}%","금관":"Golden Crown","전설 · +{0}":"Legendary · +{0}","옛 왕의 무덤에서 나온 금빛 관이라, 쓴 자에게 복이 모인다지.":"A golden crown from an ancient king's tomb. They say fortune gathers to whoever wears it.","공격력 +{0}%, 최대 체력 +{1}%, 엽전 +{2}%":"ATK +{0}%, Max HP +{1}%, Coins +{2}%","삼족오 깃":"Samjogo Feather","해 속에 산다는 세 발 까마귀의 깃이라, 꺼진 목숨도 되살린다.":"A feather of the three-legged crow said to dwell in the sun. It can rekindle a life already snuffed out.","한 판에 한 번 쓰러져도 체력 {0}%로 일어남":"Once per run, rise again with {0}% HP after falling","사냥꾼 화살촉":"Hunter's Arrowhead","늙은 포수가 호랑이 잡던 날 쓴 화살촉이 아직 날카롭다.":"The arrowhead an old hunter used the day he felled the tiger is still sharp.","얻는 법: 임무 · 요괴 {0}마리":"How to get: Mission · Defeat {0} yokai","해골 목걸이":"Skull Necklace","무덤가 해골로 엮은 목걸이라, 한 번 걸면 눈빛이 달라진다지.":"A necklace strung from skulls of the graveyard. They say your gaze changes once you put it on.","천인참 칼날":"Blade of a Thousand Heads","천 명의 목을 벴다는 칼의 파편이라, 날이 아직도 운다.":"A shard of a sword that took a thousand heads. Its edge still weeps.","대요괴의 뿔":"Great Yokai's Horn","팔도를 떨게 한 대요괴의 이마에서 부러진 뿔이라 전해진다.":"Said to be the horn snapped from the brow of a great yokai who made all eight provinces tremble.","우두머리 요괴에게 주는 피해 +{0}%":"Damage to boss yokai +{0}%","얻는 법: 임무 · 보스 {0}마리":"How to get: Mission · Defeat {0} bosses","군왕 각적":"Warlord's Horn","요괴 왕이 불던 뿔피리라, 소리가 울리면 큰 놈들도 움찔한다.":"A horn once blown by a yokai king. When it sounds, even the big ones flinch.","우두머리 요괴에게 주는 피해 +{0}%, 공격력 +{1}%":"Damage to boss yokai +{0}%, ATK +{1}%","나그네 지팡이":"Wanderer's Staff","팔도를 떠돈 길손의 지팡이라, 짚으면 걸음이 가벼워진다지.":"The staff of a traveler who roamed all eight provinces. Lean on it and your steps grow light.","얻는 법: 임무 · 방 {0}개 정리":"How to get: Mission · Clear {0} rooms","요괴굴 지도":"Yokai Den Map","보부상이 먹으로 그려 판 지도라, 굴의 길목이 빼곡히 적혔다.":"A map a peddler drew in ink and sold. Every passage of the den is crowded onto it.","이동 속도 +{0}%, 스킬 대기 -{1}%":"Move Speed +{0}%, Skill cooldown -{1}%","수련 목검":"Training Wooden Sword","산사 동자승이 닳도록 휘두른 목검이라 손에 착 감긴다지.":"A wooden sword swung worn by a young monk at a mountain temple. It fits the hand perfectly.","얻는 법: 임무 · 한 판 레벨 {0}":"How to get: Mission · Reach level {0} in a run","깨달음 염주":"Enlightenment Beads","백팔 번뇌를 굴리다 얻은 깨달음이 알알이 배어 있다 한다.":"Said to hold, bead by bead, the enlightenment won by counting the hundred and eight torments.","만년 모래시계":"Ten-Thousand-Year Hourglass","한 알 떨어질 때마다 한 해가 간다는 저승 모래시계라 한다.":"An hourglass of the underworld, where each falling grain is said to mark a year.","궁극기(R) 대기 -{0}%":"Ultimate (R) cooldown -{0}%","얻는 법: 임무 · 무한의 방 {0}번째 방":"How to get: Mission · Reach Endless Rooms room {0}","끝없는 등잔":"Everlasting Lamp","기름이 마르지 않는 등잔이라, 불빛 아래선 상처도 아문다지.":"A lamp whose oil never runs dry. Beneath its glow, even wounds are said to close.","밝기 +{0}%, 초당 체력 {1}% 회복":"Brightness +{0}%, Restore {1}% HP per second","결투 깍지":"Duelist's Thumb Ring","명궁이 마지막 한 판에 끼었다는 엄지 깍지라고 전해진다.":"Said to be the thumb ring a master archer wore in his final match.","얻는 법: 임무 · {0}대{1} 대전 {2}승":"How to get: Mission · Win {2} {0}v{1} Duels","승전띠":"Victory Sash","싸움마다 이긴 장수가 두른 허리띠라, 두르면 기운이 솟는다.":"The sash of a general who won every battle. Tie it on and your spirit surges.","복 부적":"Fortune Talisman","주막 뒷방 무당이 복을 빌어 써 준 부적이라, 엽전이 따른다지.":"A talisman a shaman in the tavern's back room wrote with a prayer for luck. Coins are said to follow it.","엽전 +{0}%, 떨어지는 엽전 +{1}%":"Coins +{0}%, Dropped coins +{1}%","얻는 법: 임무 · 뽑기 {0}번":"How to get: Mission · Summon {0} times","나무 궤":"Wooden Chest","보부상이 온갖 잡동사니를 담아 다니던 낡은 궤짝이라 한다.":"An old chest in which a peddler carried all manner of odds and ends.","얻는 법: 임무 · 영웅 {0}명":"How to get: Mission · Own {0} heroes","의병 깃발":"Righteous Army Banner","의병이 높이 든 깃발이라, 바라보면 겁이 사라진다 한다.":"A banner raised high by the righteous army. Gaze upon it and fear is said to vanish.","공격력 +{0}%, 받는 피해 -{1}%":"ATK +{0}%, Damage taken -{1}%","사냥 낙인":"Hunter's Brand","저승사자가 눈여겨본 자에게 찍는다는 붉은 낙인이라 한다.":"A red brand the jeoseung saja is said to burn into those it has marked.","치명타 피해 +{0}%":"Critical hit damage +{0}%","얻는 법: 임무 · 정예 요괴 {0}마리":"How to get: Mission · Defeat {0} elite yokai","곳간 열쇠":"Storehouse Key","도깨비 곳간을 열었다는 녹슨 열쇠라, 엽전 냄새를 잘 맡는다지.":"A rusty key said to have opened a dokkaebi's storehouse. It has a nose for brass coins.","얻는 법: 임무 · 보물상자 {0}개":"How to get: Mission · Open {0} treasure chests","도술 비급":"Sorcery Manual","도사의 손때 묻은 비급이라, 읽을수록 손놀림이 빨라진다.":"Worn by a Taoist sage's own hands, this manual quickens your fingers the more you read it.","얻는 법: 임무 · 스킬 {0}번 사용":"How to get: Mission · Use skills {0} times","동심 매듭":"Twin-Heart Knot","함께 걷는 이의 무사를 비는 동심결 매듭이라 한다.":"They say this dongsimgyeol knot carries a prayer for the safety of whoever walks beside you.","초당 체력 {0}% 회복, 최대 체력 +{1}%":"Restore {0}% HP per second, Max HP +{1}%","얻는 법: 임무 · 멀티 {0}번":"How to get: Mission · Play multiplayer {0} times","무결의 옥":"Flawless Jade","티 하나 없는 옥이라, 몸에 지니면 재앙이 비켜 간다지.":"Jade without a single flaw. Carry it, and calamity is said to pass you by.","얻는 법: 특수 임무 · 맞지 않고 스테이지 끝내기":"How to get: Special Mission · Clear a Stage without taking damage","피의 맹세":"Blood Oath","맹세를 어긴 자의 피가 부적에 스며 마르지 않는다는 말이 있다.":"They say the blood of an oath-breaker seeps into the talisman and never dries.","준 피해의 {0}%만큼 체력을 되찾음":"Recover HP equal to {0}% of damage dealt","얻는 법: 특수 임무 · 체력 {0}% 이하로 보스 처치":"How to get: Special Mission · Defeat a boss with HP at {0}% or below","질풍 방울":"Gale Bell","방울이 울면 바람이 먼저 달려가 길을 연다고 보부상이 말하지.":"The Peddlers say that when this bell rings, the wind runs ahead to clear the road.","이동 속도 +{0}%, 공격 속도 +{1}%":"Move Speed +{0}%, Attack Speed +{1}%","얻는 법: 특수 임무 · {0}초 안에 방 정리 {1}번":"How to get: Special Mission · Clear {1} rooms within {0} seconds","무쇠 심장":"Iron Heart","대장간 불에 오래 달군 무쇠 심장은 칼날도 튕겨낸다지.":"An iron heart long tempered in Forge fire, said to turn away even blades.","얻는 법: 특수 임무 · 체력 {0}% 이상으로 보스 {1}번":"How to get: Special Mission · Defeat a boss {1} times with HP at {0}% or above","해돋이 거울":"Sunrise Mirror","해 뜰 녘 첫 빛을 담은 거울이라 어둠 속 요괴도 눈을 못 뜬다.":"A mirror that holds the first light of dawn. Even yokai in the dark cannot open their eyes before it.","공격력 +{0}%, 치명타 +{1}%":"Attack +{0}%, Critical Hit +{1}%","얻는 법: 특수 임무 · 스토리 완료":"How to get: Special Mission · Complete the story","불사의 깃":"Feather of Deathlessness","저승 문턱에서 돌아온 새가 떨군 깃이라 전해진다.":"Legend says a bird returned from the threshold of the underworld and let this feather fall.","한 판에 한 번, 쓰러져도 다시 일어남":"Once per run, rise again after falling","얻는 법: 특수 임무 · {0}번 쓰러지기":"How to get: Special Mission · Fall {0} times","천둥 북채":"Thunder Drumstick","뇌공이 쥐던 북채로 두드리면 하늘이 먼저 운다고 한다.":"Strike with the drumstick once held by the Thunder Lord, and the heavens are said to weep first.","치명타가 터질 때 번개가 {0}명에게 튐":"On a critical hit, lightning jumps to {0} enemies","얻는 법: 특수 임무 · 무한의 방 {0}번째 방":"How to get: Special Mission · Reach room {0} in Endless Rooms","시체꽃":"Corpse Flower","주검 위에 핀 꽃은 지는 순간 붉은 숨을 터뜨린다고 한다.":"A flower that blooms on the dead is said to burst with a crimson breath the moment it wilts.","적이 죽으면 주변이 {0}% 위력으로 폭발함":"When an enemy dies, it explodes nearby for {0}% power","얻는 법: 특수 임무 · 요괴 {0}마리":"How to get: Special Mission · Defeat {0} yokai","저승사자 손톱":"Jeoseung Saja's Nail","저승사자가 명부에 이름을 긋던 손톱 끝이라 하더라.":"They say this is the nail tip with which a jeoseung saja struck names from the ledger.","체력 {0}% 이하인 적을 {1}% 확률로 즉시 처치":"{1}% chance to instantly slay enemies with HP at {0}% or below","얻는 법: 특수 임무 · 보스 {0}마리":"How to get: Special Mission · Defeat {0} bosses","산울림 종":"Echo Bell","산마루에서 울린 종소리는 끝내 되돌아와 다시 운다지.":"A bell tolled on the mountain ridge always returns in the end, and rings once more.","스킬을 쓸 때 {0}% 확률로 대기 시간 초기화":"{0}% chance to reset cooldown when using a skill","얻는 법: 특수 임무 · 스킬 {0}번 사용":"How to get: Special Mission · Use skills {0} times","스토리 (스토리를 진행해야만 얻어요)":"Story (Only obtainable by progressing the story)","달래 할멈의 부적":"Grandma Dallae's Talisman","달래 할멈이 밤새 접어 건넨 부적이라 온기가 가시지 않는다.":"Grandma Dallae folded this talisman all night long before handing it over, and its warmth has yet to fade.","최대 체력 +{0}%, 초당 체력 {1}% 회복":"Max HP +{0}%, Restore {1}% HP per second","얻는 법: 스토리 · 스토리 시작":"How to get: Story · Begin the story","깨진 등잔 조각":"Broken Lantern Shard","깨진 등잔 조각에도 남은 불씨가 길을 비춘다고 하지.":"Even a broken lantern shard keeps a lingering ember to light the way, so they say.","공격력 +{0}%, 밝기 +{1}%":"Attack +{0}%, Brightness +{1}%","얻는 법: 스토리 · {0}층 최종보스":"How to get: Story · Final boss of Floor {0}","서리 장군 투구":"Frost General's Helm","서리 장군이 쓰던 투구라 쓰면 겨울바람도 비껴간다지.":"Worn by the Frost General, this helm lets even the winter wind slip past you.","받는 피해 -{0}%, 최대 체력 +{1}%":"Damage Taken -{0}%, Max HP +{1}%","불꽃 귀신의 사슬":"Flame Ghost's Chain","불꽃 귀신이 끌고 다니던 사슬은 지금도 붉게 달아 있다.":"The chain the flame ghost dragged behind it still glows red-hot.","공격력 +{0}%, 기본 공격이 적을 불태움":"Attack +{0}%, Basic attacks burn enemies","두꺼비 왕관":"Toad King's Crown","두꺼비 왕이 못에서 쓰던 관이라 쓴 자의 기운을 불린다지.":"Once worn by the Toad King in his pond, they say it swells the energy of whoever wears it.","준 피해의 {0}%만큼 체력 회복, 최대 체력 +{1}%":"Heal for {0}% of damage dealt, Max HP +{1}%","염라의 명부":"Yeomra's Ledger","염라의 명부에 이름이 적히면 목숨은 이미 끝난 것이라.":"Once your name is written in Yeomra's Ledger, your life is already over.","체력 {0}% 이하인 적을 {1}% 확률로 즉시 처치, 치명타 +{2}%":"{1}% chance to instantly slay enemies at {0}% HP or below, critical hit +{2}%","훔친 등기름":"Stolen Lamp Oil","주막 등잔에서 몰래 훔친 기름이라 불꽃이 더 오래 탄다지.":"Oil sneaked from a tavern lamp, they say its flame burns all the longer.","공격 속도 +{0}%, 초당 체력 {1}% 회복":"Attack speed +{0}%, recover {1}% HP per second","얻는 법: 스토리 · 스토리 중간보스 {0}마리":"How to get: Story · Defeat {0} Story mid-bosses","도깨비 탈":"Dokkaebi Mask","도깨비 탈을 쓰면 복이 굴러들고 엽전이 절로 모인다지.":"Wear a dokkaebi mask, they say, and fortune rolls in while brass coins gather by themselves.","치명타 +{0}%, 엽전 획득 +{1}%":"Critical hit +{0}%, coin gain +{1}%","반디의 날개":"Firefly's Wing","반디의 날개는 어둠 속에서도 가볍게 길을 찾아 날아간다.":"The firefly's wing flits lightly through the dark and always finds its way.","얻는 법: 스토리 · 스토리 {0}층 도달":"How to get: Story · Reach Floor {0} in Story","무영의 갓":"Muyeong's Gat","무영이라는 떠돌이가 쓰던 갓이라 그림자조차 닿지 못했다.":"A hat once worn by a wanderer named Muyeong, so not even a shadow could touch him.","공격력 +{0}%, 최대 체력 +{1}%, 받는 피해 -{2}%":"Attack +{0}%, Max HP +{1}%, damage taken -{2}%","얻는 법: 스토리 · 스토리 {0}번 완료":"How to get: Story · Complete Story {0} times","보물 {0}/{1}":"Relics {0}/{1}","펫 {0}/{1}":"Pets {0}/{1}","칭호 {0}/{1}":"Titles {0}/{1}","📅 일일":"📅 Daily","🗓️ 주간":"🗓️ Weekly","📆 월간":"📆 Monthly","🏆 업적":"🏆 Achievements","🔓 영웅 해금":"🔓 Unlock Heroes","🎁 모두 받기 ({0})":"🎁 Claim All ({0})","일일 임무는 매일 새로 시작해요.":"Daily quests reset every day.","요괴 {0}마리":"Defeat {0} yokai","방 {0}개 정리":"Clear {0} rooms","보스 {0}마리":"Defeat {0} bosses","스킬 {0}번":"Use skills {0} times","보물상자 {0}개":"Open {0} chests","일일":"Daily","주간":"Weekly","월간":"Monthly","업적":"Achievements","영웅 해금":"Unlock Heroes","모두 받기 ({0})":"Claim All ({0})","주간 임무는 매주 새로 시작해요.":"Weekly quests reset every week.","보스 레이드 완료":"Boss Raid cleared","{0}대{1} {2}승":"{0}v{1} · {2} wins","바꾸기":"Change","아이디: {0} (로그인할 때만 써요)":"ID: {0} (only used to log in)","배경 음악":"Music","음악 크기":"Music Volume","효과음 크기":"SFX Volume","보스 음악 크기":"Boss Music Volume","(보통 음악 대비)":"(relative to normal music)","음성":"Voice","보스·이야기":"Boss & Story","화면":"Display","화면 확대":"Zoom","({0} = 방 전체)":"({0} = whole room)","화면 흔들림":"Screen Shake","흔들림 세기":"Shake Intensity","피해 숫자 보이기":"Show Damage Numbers","타격 멈칫":"Hit Stop","치명타·처치 순간":"Critical Hits · Kills","효과 밝기":"Effect Brightness","(번쩍임이 부담되면 낮추세요)":"(Lower this if flashing bothers you)","글자 크게":"Large Text","작은 휴대폰에서 읽기 편하게":"Easier to read on small phones","공격 예고 진하게":"Bold Attack Warnings","붉은 공격 영역에 굵은 노란 테두리 — 작은 화면·색이 잘 안 보일 때":"Adds a thick yellow outline to red attack zones — for small screens or trouble seeing colors","조작 · 도움":"Controls · Assist","자동 공격":"Auto Attack","켜면 근처 요괴를 기본 공격으로 알아서 공격 — 스킬·구르기는 직접":"When on, your basic attack hits nearby yokai automatically — skills and dodge rolls stay manual","도움 모드":"Assist Mode","쓰러질 때마다 받는 피해 -{0}%, 최대 -{1}% · 스토리·무한의 방, 지금 -{2}%":"Each defeat reduces damage taken by {0}%, up to -{1}% · Story & Endless Rooms, now -{2}%","엽전·코인 줍기 범위":"Coin & Jade Pickup Range","진동":"Vibration","앱·게임패드: 크게 맞거나 보스를 쓰러뜨릴 때":"App/gamepad: when hit hard or when a boss falls","그래픽 · 성능":"Graphics · Performance","고급 그래픽":"High-End Graphics","실시간 조명·빛 번짐·색 보정 — 끊기면 끄세요":"Real-time lighting, bloom, color grading — turn off if it stutters","저사양 모드":"Low-Spec Mode","화면 선명도·불빛·파편 줄이기 — 폰이 끊길 때":"Reduces sharpness, lights, and debris — for when your phone lags","절전 모드":"Power Saver","초당 {0}번 그리기 — 휴대폰이 뜨겁거나 배터리를 아낄 때":"Draws {0} frames per second — for hot phones or saving battery","정보 보내기":"Data Sharing","익명 통계·오류 보내기":"Send anonymous stats & errors","게임 개선용 · 아이디·닉네임은 보내지 않아요":"Used to improve the game · Your ID and nickname are never sent","그림 내려받기":"Download Art","필요한 것만 먼저 받는 중 (판마다 필요한 그림만)":"Downloading only what's needed first (just the art for each run)","남은 그림 모두 받기 (약 {0}MB)":"Download All Remaining Art (about {0}MB)","필요한 것만 받기":"Download Only What's Needed","키 설정":"Key Bindings","📜 정보 · 확률 · 약관 · 계정":"📜 Info · Odds · Terms · Account","의견 보내기":"Send Feedback","음악: 한입 미스터리 채널 국악 · 장별 음악·효과음·보스 음성":"Music: Korean traditional music from the Hanip Mystery channel · Chapter music, sound effects, boss voices","게임 판: v{0}":"Game Version: v{0}","정보 · 확률 · 약관 · 계정":"Info · Odds · Terms · Account","플레이 방법":"How to Play","조작":"Controls","이동":"Move","(방향키도 돼요)":"(Arrow keys work too)","기본 공격":"Basic Attack","또는":"or","왼 Shift":"Left Shift","— 마우스 쪽으로, 누르고 있으면 계속":"— toward the mouse; hold to keep attacking","우클릭":"Right-click","· 궁극기":"· Ultimate","— 마우스 쪽으로 나가요":"— fires toward the mouse","구르기":"Dodge Roll","(잠깐 무적) · 액티브":"(brief invincibility) · Active Item","· 멈춤":"· Pause","· 레벨업 강화는":"· For level-up blessings,","키는 설정 → 키 설정에서 바꿀 수 있어요.":"You can change keys in Settings → Key Bindings.","게임패드":"Gamepad","왼스틱 이동 · 오른스틱 조준 · A 공격 · B 구르기 · X/Y/RB/RT 스킬 · LB 액티브 · LT 표적 바꾸기 · Start 멈춤":"Left stick move · Right stick aim · A attack · B dodge roll · X/Y/RB/RT skills · LB active item · LT switch target · Start pause","방과 문":"Rooms & Doors","요괴가 있는 방에 들어가면 다 쓰러뜨릴 때까지 문이 잠겨요. 정리하면 문 안으로 걸어가 다음 방으로.":"When you enter a room with yokai, the doors stay locked until all are defeated. Once it's clear, walk through a door to the next room.","붉은 영역":"Red zones","은 곧 공격이 떨어지는 자리 — 밖으로 피하거나 구르세요.":"mark where an attack is about to land — step out or dodge roll.","방마다 보물 상자·약수 우물(체력 가득)·보부상(상점)·괴이한 방(설화 속 선택)·시련의 방이 섞여 나와요.":"Rooms vary: relic chests, healing spring wells (full HP), Peddlers (shop), Strange Rooms (choices from folk tales), and trial rooms.","이야기(스토리)":"Story","다섯 장, 장마다 {0}스테이지 — {1}번째에 중간보스, {2}번째에 장 보스. 보스를 쓰러뜨리면 홍살문 안에 {3}초 서서 다음으로.":"Five Chapters, {0} Stages each — a mini-boss at Stage {1}, a Chapter boss at Stage {2}. After defeating a boss, stand inside the Red Gate for {3} seconds to move on.","장 사이사이 이야기 장면이 나오고, 앞 장 보스를 쓰러뜨리면 이야기 지도에서 다음 장이 열려요.":"Story scenes play between chapters. Defeat the previous Chapter's boss to unlock the next one on the story map.","스테이지를 넘어갈 때 체력 {0}% 회복 (매우 어려움은 회복 없음).":"Recover {0}% HP when moving to the next Stage (no recovery on Very Hard).","무한의 방 · 보스 레이드":"Endless Rooms · Boss Raid","무한의 방: 문을 골라 끝없이 내려가요. {0}번째 방마다 보스.":"Endless Rooms: Pick a door and descend without end. A boss awaits every {0}th room.","보스 레이드: 장 보스 {0}마리를 차례로. 보스를 쓰러뜨릴 때마다 강화 하나, 보부상에게 엽전으로 정비하고 홍살문에 서면 다음 보스가 나와요.":"Boss Raid: Face {0} Chapter bosses in turn. Each boss you defeat grants one blessing. Restock with coins at the Peddler, then stand at the Red Gate to summon the next boss.","성장":"Growth","레벨이 오르면 강화 셋 중 하나를 골라요. 같은 강화를 겹치면 레벨이 올라요. 짝이 맞는 두 강화를 모으면 조합 강화가 나와요.":"When you level up, choose one of three blessings. Taking the same blessing again raises its level. Collect two matching blessings to unlock a combo blessing.","액티브는 하나만 들 수 있어요. 같은 것을 또 주우면 레벨 업.":"You can carry only one active item. Pick up the same one again to level it up.","판이 끝나도 혼불이 남아요 — 혼불 제단에서 모든 영웅을 강하게.":"Soulfire remains after a run ends — strengthen every hero at the Soulfire Altar.","근접 영웅은 기본 특성 '근접 투지'로 피해의 일부를 체력으로 흡수해요(흡혈). '피의 맹세' 같은 강화·전직으로 더 늘어요.":"Melee heroes have the base trait 'Melee Fury', absorbing part of their damage as HP (lifesteal). Blessings like 'Blood Oath' and class advances increase it further.","엽전과 코인":"Coins and Jade","엽전: 판 안에서만 쓰는 돈 — 보부상에게 물건을 사요.":"Brass coins: Money used only within a run — buy goods from the Peddler.","코인: 판이 끝나도 남아요 — 뽑기(영웅·스킬·보물·펫·칭호)에 써요.":"Jade coins: They remain after a run — spend them on Summons (heroes, skills, relics, pets, titles).","함께하기 · 친구와 함께":"Co-op · With Friends","방 만들기 (방장)":"Create Room (Host)","모드를 고르면 방 코드가 나와요 · 친구에게 코드를 알려 주세요":"Pick a mode to get a room code · Share the code with your friend","스토리 협동":"Story Co-op","둘이서 다섯 장의 이야기를":"Five Chapters, Together","무한의 방 협동":"Endless Rooms Co-op","보스 레이드 협동":"Boss Raid Co-op","레벨 {0} · {1}판 {2}선승":"Level {0} · Best of {1}, first to {2}","코드로 참가":"Join by Code","친구가 알려 준 방 코드 {0}자리를 넣어요":"Enter the {0}-digit room code your friend gave you","방 코드 {0}자리":"{0}-digit room code","참가":"Join","안내":"Info","인터넷이 필요해요. 둘 다 같은 버전(오른쪽 아래 숫자)이어야 해요.":"Internet required. Both players must have the same version (number at bottom right).","협동: 두 사람이 같은 방에서 함께 싸워요. 둘이면 요괴가 조금 더 많고 튼튼해져요. 한 명이 쓰러지면 다음 스테이지에서 체력 {0}%로 일어나요.":"Co-op: Two players fight together in the same room. With two, yokai are a bit more numerous and sturdier. If one falls, they rise again at {0}% HP in the next Stage.","경험치는 둘 다 받고, 엽전·코인은 주운 사람이 가져요. 상인은 방장만 이용해요.":"Both players receive EXP; coins and jade go to whoever picks them up. Only the host can use the Peddler.","{0}대{1} 대전: 친구와 레벨 {2}으로 맞춰 {3}판 {4}선승 (보물·펫·칭호 빠짐).":"{0}v{1} Duel: Match levels with a friend at Level {2}, best of {3}, first to {4} (relics, pets, and titles excluded).","'바꾸기'를 누른 뒤 원하는 키나 마우스 버튼을 누르세요. 다른 동작과 겹치면 서로 바뀌어요. (방향키는 언제나 이동으로도 쓸 수 있어요)":"Press 'Change', then press the key or mouse button you want. If it overlaps another action, the two swap. (Arrow keys can always be used for movement.)","화면 버튼":"On-Screen Buttons","스킬 버튼 크기":"Skill Button Size","조이스틱 크기":"Joystick Size","(폰)":"(Phone)","버튼 투명도":"Button Opacity","(낮을수록 투명)":"(lower = more transparent)","버튼 기본값":"Reset Buttons","위로 이동":"Move Up","아래로 이동":"Move Down","왼쪽 이동":"Move Left","오른쪽 이동":"Move Right","기본 공격 (보조키)":"Basic Attack (Alt)","스킬 {0}":"Skill {0}","스킬 {0} (궁극기)":"Skill {0} (Ultimate)","스킬 {0} (보조키)":"Skill {0} (Alt)","구르기 (회피)":"Dodge Roll","액티브":"Active Item","액티브 잠금 / 풀기":"Lock / Unlock Active","대상 고정 (타겟팅)":"Lock On (Targeting)","멈춤 메뉴":"Pause Menu","기본값으로":"Reset to Default","완료":"Done","등불 사당의 제단":"Lantern Shrine Altar","쓰러뜨린 요괴의 넋은 혼불이 되어 남아요. 판에서 쓰러져도 혼불은 그대로 — 바쳐서 토벌대 모두를 강하게.":"The souls of fallen yokai linger as Soulfire. Even if you fall in a run, your Soulfire remains — offer it to strengthen the entire hunting party.","가진 혼불":"Soulfire Owned","· 지금까지 모은 혼불 {0}":"· Total Soulfire collected: {0}","등불 심지":"Lantern Wick","아직 없음":"None yet","다음:":"Next:","벼린 날":"Honed Edge","길한 점괘":"Auspicious Omen","치명타 확률 +{0}%":"Critical hit chance +{0}%","날랜 걸음":"Swift Stride","혼불 갑주":"Soulfire Armor","엽전 주머니":"Coin Pouch","판 시작 엽전 +{0}":"Starting coins +{0}","운명의 실":"Thread of Fate","레벨 업 강화 다시 뽑기 {0}번 (판마다)":"Level-up blessing rerolls: {0} (per run)","넷째 부적":"Fourth Talisman","레벨 업 때 강화를 {0}개 중에서 골라요":"Choose from {0} blessings on level-up","저승 뱃사공의 덤":"Ferryman's Bonus","판마다 한 번, 쓰러져도 다시 일어나요":"Once per run, rise again even after you fall","넋 거두기":"Soul Harvest","판에서 얻는 혼불 +{0}%":"Soulfire gained per run +{0}%","제단 강화는 모든 영웅에게 적용돼요 ({0}대{1} 대전·함께하기 제외)":"Altar blessings apply to all heroes (except {0}v{1} Duel · Co-op)","📜 토벌 기록":"📜 Hunt Records","주간 순위표 (무한의 방)":"Weekly Leaderboard (Endless Rooms)","최근 {0}판 · 가장 많이 잡은 판 {1}마리 · 최고 연격 {2} · 최고 무한의 방 {3}":"Last {0} runs · Most kills in a run: {1} · Best combo {2} · Best Endless Rooms {3}","아직 기록이 없어요. 첫 토벌을 떠나 보세요!":"No records yet. Set out on your first hunt!","토벌 기록":"Hunt Records","📜 이야기 다시 보기":"📜 Replay Story","찢긴 요괴록 이야기 {0}/{1} · 장면을 누르면 음성과 함께 다시 봐요":"Torn Yogoerok tales {0}/{1} · Tap a scene to replay it with voice","찢어진 요괴록":"The Torn Yogoerok","첫째 마당 · 잊힌 석굴":"Act One · The Forgotten Grotto","긁힌 이름":"The Scratched Name","석굴 한복판":"Heart of the Grotto","궁궐 같은 석굴":"The Palace-like Grotto","그림자 도깨비 왕":"Shadow Dokkaebi King","첫째 장을 되찾다":"Chapter One Reclaimed","둘째 마당 · 얼어붙은 동굴":"Act Two · The Frozen Cave","얼음 속 병사들":"Soldiers in the Ice","얼음 골짜기":"Ice Valley","녹슨 깃발":"Rusted Banner","서리 장군":"Frost General","장군의 이름":"The General's Name","셋째 마당 · 불타는 대장간":"Act Three · The Burning Forge","낯익은 칼":"A Familiar Blade","쇠 먹는 짐승":"Iron-Eating Beast","무영의 거래":"Muyeong's Bargain","불 도깨비 왕":"Fire Dokkaebi King","타지 않는 장":"The Page That Won't Burn","넷째 마당 · 독 안개 늪":"Act Four · Poison Mist Swamp","이름 장터":"The Name Market","안개 속의 미소":"A Smile in the Mist","엽전 세는 소리":"The Sound of Counting Coins","늪 두꺼비 왕":"Swamp Toad King","걷히는 안개":"The Lifting Mist","다섯째 마당 · 저승 궁궐":"Act Five · Palace of the Underworld","??? — 아직 가 보지 못한 이야기":"??? — A tale not yet reached","이야기 다시 보기":"Replay Story","🏮 토벌 시즌":"🏮 Bounty Season","{0}월 토벌 시즌":"Month {0} Bounty Season","판을 할 때마다 경험이 쌓여요 (방·처치·완주·오늘의 괴담). 시즌은 {0}일 뒤 새로 시작해요.":"Every run earns experience (rooms · kills · clears · Daily Tale). A new season begins in {0} days.","/{0}단계":"/Tier {0}","다음 단계까지 {0}":"{0} to next tier","코인 {0}":"Jade {0}","혼불 {0}":"Soulfire {0}","가진 영웅 조각 {0}":"Hero shards owned: {0}","코인 {0} · 혼불 {1}":"Jade {0} · Soulfire {1}","코인 {0} · 혼불 {1} · 시즌 완주!":"Jade {0} · Soulfire {1} · Season complete!","📖 이야기 지도":"📖 Story Map","잊힌 석굴":"Forgotten Grotto","얼어붙은 동굴":"Frozen Cave","불타는 대장간":"Burning Forge","독 안개 늪":"Poison Mist Swamp","저승 궁궐":"Underworld Palace","요괴 속성: 그림자 · 약점 빛·번개 · 보스 그림자 우두머리":"Yokai element: Shadow · Weak to Light·Lightning · Boss: Shadow Chieftain","다시 걷기":"Walk Again","서장 다시 보기":"Replay Prologue","이야기 지도":"Story Map","요괴 속성: 불 · 약점 물·서리 · 보스 불꽃 귀신":"Yokai element: Fire · Weak to Water·Frost · Boss: Flame Ghost","불편했던 곳, 좋았던 곳, 바라는 것 무엇이든 적어 주세요. 아이디·닉네임은 함께 보내지 않아요.":"Tell us anything: what felt off, what you liked, what you wish for. Your ID and nickname are not sent with it.","버그":"Bug","밸런스(어려움·쉬움)":"Balance (too hard/easy)","그림·소리":"Art & Sound","재미·제안":"Fun & Ideas","기타":"Other","예) {0}장 보스 방에서 화면이 멈췄어요 / 궁수가 너무 약해요":"e.g. The screen froze in the Chapter {0} boss room / The archer is too weak","함께 가는 정보: 게임 버전 {0} · 기기 종류 · 지금 모드":"Sent along: game version {0} · device type · current mode","보내기":"Send","닫기":"Close","그림 받는 방식":"Art Download Mode","한 번 받은 그림은 기기에 보관돼 다음부터 바로 열려요. 언제든 설정에서 바꿀 수 있어요.":"Art you download is stored on your device and opens instantly next time. You can change this anytime in Settings.","전체 받기":"Download All","약 {0}MB · 와이파이 권장":"About {0}MB · Wi-Fi recommended","지금 뒤에서 모두 받아 두고, 받는 동안에도 바로 플레이할 수 있어요. 다 받으면 어떤 모드든 기다림 없이 시작해요.":"Downloads everything in the background, and you can play right away in the meantime. Once it's done, every mode starts with no waiting.","필요한 것만 먼저":"Essentials First","판마다 약 {0}~{1}MB · 데이터 절약":"About {0}–{1}MB per run · Saves data","판에 들어갈 때 그 판에 필요한 그림만 받아요. 나머지는 플레이하면서 조금씩 받고, 설정에서 '남은 그림 모두 받기'로 언제든 더 받을 수 있어요.":"Only the art needed for a run is downloaded when you enter it. The rest arrives bit by bit as you play, and you can fetch it all anytime with 'Download Remaining Art' in Settings.","🎲 확률 공개":"🎲 Summon Rates","📄 이용약관":"📄 Terms of Service","🔒 개인정보":"🔒 Privacy","🎨 크레딧·라이선스":"🎨 Credits & Licenses","🐞 버그 신고":"🐞 Report a Bug","👤 계정":"👤 Account","아래 확률은 게임이 실제로 뽑을 때 쓰는 값에서 자동으로 만든 표예요. 뽑기는 게임 안 재화(코인·엽전)로만 하며, 현재 현금 결제는 없어요.":"The rates below are tables generated automatically from the values the game actually uses when summoning. Summons use in-game currency only (jade coins and brass coins), and there are currently no cash payments.","🎰 영웅 뽑기 ({0}회 코인 {1} · {2}회 {3})":"🎰 Hero Summon ({0}× jade {1} · {2}× {3})","결과":"Result","{0}회 확률":"{0}× Rate","영웅 {0}명당":"Per hero (of {0})","내용":"Details","SS급 영웅 ({0}명)":"SS-rank Heroes ({0})","조각 {0}~{1}개 (해금 {2}개) · 아직 없는 영웅이면 {3}% 확률로 바로 해금":"{0}–{1} shards (unlock needs {2}) · If you don't own the hero yet, {3}% chance to unlock instantly","S급 영웅 ({0}명)":"S-rank Heroes ({0})","A급 영웅 ({0}명)":"A-rank Heroes ({0})","B급 영웅 ({0}명)":"B-rank Heroes ({0})","C급 영웅 ({0}명)":"C-rank Heroes ({0})","가진 영웅 조각 {0}~{1}개":"{0}–{1} shards of an owned hero","강화 재료":"Blessing materials","보장: 영웅이 {0}번 연속 안 나오면 {1}번째에 반드시 영웅 (A급 {2}% · S급 {3}% · SS급 {4}%). 영웅이 나오면 보장 횟수는 {5}으로 돌아가요.":"Pity: If no hero appears {0} times in a row, a hero is guaranteed on pull #{1} (A-rank {2}% · S-rank {3}% · SS-rank {4}%). When a hero appears, the pity count resets to {5}.","⭐ 이번 주 길한 영웅: 해랑(A급) — A급이 나오면 {0}%는 해랑, 나머지는 같은 등급 다른 영웅이 고르게. {1}회 해랑 확률 {2}%":"⭐ This Week's Featured Hero: Haerang (A-rank) — When an A-rank appears, {0}% of the time it's Haerang; otherwise another hero of the same rank is chosen evenly. {1}× Haerang rate {2}%","영웅 목록":"Hero List","SS: 천랑, 화련, 해모수":"SS: Cheonrang, Hwaryeon, Haemosu","S: 월영, 천뢰, 여우비, 명부, 을지문덕":"S: Woryeong, Cheonroe, Yeoubi, Myeongbu, Eulji Mundeok","A: 해랑, 단비, 이몽룡, 소리":"A: Haerang, Danbi, Yi Mongryong, Sori","B: 설화, 만신, 사다함":"B: Seolhwa, Mansin, Sadaham","C: 돌쇠, 삼식, 초롱, 곰배":"C: Dolsoe, Samsik, Chorong, Gombae","📜 스킬 뽑기 (칸마다 따로)":"📜 Skill Summon (separate per slot)","칸":"Slot","D급":"Rank D","{0}종 · {1}종당 {2}%":"{0} types · {2}% per {1} type(s)","R (궁극기)":"R (Ultimate)","🏺 보물 뽑기 ({0}회 코인 {1} · {2}회 {3})":"🏺 Summon Relic ({0}× jade {1} · {2}× {3})","종류":"Types","전설":"Legendary","희귀":"Rare","일반":"Common","🐾 펫 뽑기 ({0}회 코인 {1} · {2}회 {3})":"🐾 Summon Pet ({0}× jade {1} · {2}× {3})","🏷 칭호 뽑기 ({0}회 코인 {1} · {2}회 {3})":"🏷 Summon Title ({0}× jade {1} · {2}× {3})","{0}회 뽑기: 보물·펫·칭호는 {1}번째까지 희귀 이상이 없으면 {2}번째가 희귀 이상으로 바뀌어요.":"{0}× Summon: for relics, pets, and titles, if no Rare or better appears by pull #{1}, pull #{2} becomes Rare or better (pity).","⬆️ 강화 성공 확률":"⬆️ Blessing Success Rate","영웅 강화(최대 +{0})·보물·펫 강화(최대 +{1}) 모두 이 표를 따라요. 실패하면 단계는 그대로이고 쓴 조각은 사라져요.":"Hero blessings (max +{0}) and relic/pet blessings (max +{1}) all follow this table. On failure, the level stays the same and the shards used are lost.","이용약관":"Terms of Service","크레딧·라이선스":"Credits · Licenses","버그 신고":"Report Bug","보물 뽑기 ({0}회 코인 {1} · {2}회 {3})":"Summon Relic ({0}× jade {1} · {2}× {3})","확률 공개":"Drop Rates","개인정보":"Privacy","계정":"Account","영웅 뽑기 ({0}회 코인 {1} · {2}회 {3})":"Summon Hero ({0}× jade {1} · {2}× {3})","이번 주 길한 영웅: 해랑(A급) — A급이 나오면 {0}%는 해랑, 나머지는 같은 등급 다른 영웅이 고르게. {1}회 해랑 확률 {2}%":"This week's Featured Hero: Haerang (Rank A) — when a Rank A comes up, {0}% is Haerang; the rest is split evenly among other heroes of the same rank. {1}× Haerang chance: {2}%","스킬 뽑기 (칸마다 따로)":"Summon Skill (per slot)","펫 뽑기 ({0}회 코인 {1} · {2}회 {3})":"Summon Pet ({0}× jade {1} · {2}× {3})","칭호 뽑기 ({0}회 코인 {1} · {2}회 {3})":"Summon Title ({0}× jade {1} · {2}× {3})","강화 성공 확률":"Blessing Success Rate","이용약관 (요약)":"Terms of Service (Summary)","요괴록(이하 '게임')은 요괴록 개발팀가 제공하며, 게임을 이용하면 이 약관에 동의한 것으로 봐요.":"Yogoerok (the \"Game\") is provided by the Yogoerok dev team. By playing the Game, you agree to these terms.","계정은 본인만 써야 하며 남에게 팔거나 빌려주면 안 돼요. 비밀번호 관리 책임은 이용자에게 있어요.":"Your account is for your use only and must not be sold or lent to others. You are responsible for keeping your password safe.","코인·엽전·조각·물건 등 게임 안 재화는 게임 안에서만 쓰는 것으로, 현금으로 바꾸거나 다른 사람에게 팔 수 없어요.":"In-game goods such as jade, coins, shards, and items are for use inside the Game only and cannot be exchanged for cash or sold to others.","버그·해킹 도구·자동 프로그램으로 얻은 재화나 기록은 회수하거나 계정 이용을 제한할 수 있어요.":"Goods or records gained through bugs, hacking tools, or automated programs may be taken back, and account access may be restricted.","멀티플레이에서 욕설·괴롭힘·부적절한 닉네임은 금지이며, 닉네임은 바꾸도록 요청하거나 제한할 수 있어요.":"Profanity, harassment, and inappropriate nicknames are forbidden in multiplayer. We may ask you to change your nickname or restrict it.","게임은 업데이트로 내용·밸런스·확률이 바뀔 수 있고, 확률이 바뀌면 이 화면의 확률표가 함께 바뀌어요.":"Updates may change the Game's content, balance, and rates. If rates change, the rate table on this screen changes with them.","서비스를 끝낼 때는 최소 {0}일 전에 게임 안에서 알려요.":"If the service ends, we will announce it in the Game at least {0} days in advance.","문의: jmg{0}@gmail.com":"Contact: jmg{0}@gmail.com","개인정보 처리방침":"Privacy Policy","모으는 정보":"Information We Collect",": 아이디(로그인용 — 이메일 모양 번호로 바꿔 저장), 비밀번호(암호화되어 저장, 개발자도 볼 수 없음), 닉네임, 게임 진행 저장 데이터. 실명·전화번호·실제 이메일은 받지 않아요.":": ID (for login — stored converted into an email-style number), password (stored encrypted; even the developer cannot see it), nickname, and game save data. We do not collect your real name, phone number, or real email.","쓰는 곳":"How We Use It",": 로그인, 여러 기기에서 이어 하기(클라우드 저장), 멀티플레이 상대에게 닉네임 표시.":": Login, continuing play across devices (cloud save), and showing your nickname to multiplayer opponents.","맡기는 곳":"Entrusted Services",": Google Firebase(로그인·저장, 미국 등 Google 서버). 멀티플레이는 PeerJS 연결 서버를 거쳐 기기끼리 직접 연결돼 상대에게 IP 주소가 보일 수 있어요. 글꼴은 Google Fonts 에서 받아요.":": Google Firebase (login and saving; Google servers in the US and elsewhere). Multiplayer connects devices directly via the PeerJS connection server, so your IP address may be visible to your opponent. Fonts are loaded from Google Fonts.","통계·오류 보고":"Stats & Error Reports","무작위 기기 번호로만":"by random device ID only","모아요. 아이디·닉네임·IP 주소는 저장하지 않아요. 설정 → 「익명 통계·오류 보내기」에서 끌 수 있어요. 보관: 오류 보고 약 {0}일, 사용 통계 약 {1}년.":". We do not store your ID, nickname, or IP address. You can turn this off in Settings → \"Send Anonymous Stats & Errors\". Retention: error reports about {0} days, usage stats about {1} years.","나라 밖으로 옮겨지는 정보":"Data Transferred Abroad",": 게임을 하는 동안 인터넷으로 수시로 보내져요. Google LLC(미국, Firebase — 로그인·저장, 계정 삭제 때까지) · Functional Software, Inc.(미국, Sentry — 오류 보고, 약 {0}일) · PostHog, Inc.(미국, 사용 통계, 약 {1}년). 원하지 않으면 통계·오류 보고를 끄거나 계정을 지우면 돼요.":": Sent over the internet from time to time while you play. Google LLC (US, Firebase — login and saving, until account deletion) · Functional Software, Inc. (US, Sentry — error reports, about {0} days) · PostHog, Inc. (US, usage stats, about {1} years). If you prefer not to, turn off stats and error reports or delete your account.",": 직접 적어 보낸 글과 게임 버전·기기 종류·모드만 오류 보고와 같은 곳(Sentry, 미국)으로 가요. 아이디·닉네임은 보내지 않아요. 약 {0}일 보관.":": Only the text you write yourself, plus the game version, device type, and mode, goes to the same place as error reports (Sentry, US). Your ID and nickname are not sent. Kept for about {0} days.","순위표":"Leaderboard",": 순위표가 열리면 무한의 방 기록과 닉네임·영웅이 다른 이용자에게 보여요.":": When the leaderboard is open, your Endless Rooms record, nickname, and hero are shown to other players.","보관 기간":"Retention Period",": 계정을 지울 때까지. 설정 → 정보 → 계정 삭제에서 언제든 바로 지울 수 있고, 지우면 서버의 저장 데이터와 로그인 정보가 함께 지워져요.":": Until you delete your account. You can delete it instantly at any time in Settings → Info → Delete Account, which also erases your server save data and login information.","만 {0}세 미만":"Under Age {0}",": 보호자 동의 없이 가입하지 않도록 해 주세요.":": Please do not sign up without a guardian's consent.","문의·열람·정정·삭제 요청":"Inquiries · Access · Correction · Deletion Requests","만든 것들 · 라이선스":"Credits · Licenses","AI 사용 고지":"AI Use Notice",": 영웅·요괴·배경 그림 일부와 동작 프레임은 생성형 AI(Google Gemini)로 만든 뒤 사람이 고르고 다듬었어요. 음악은 Google Lyria, 음성·효과음은 ElevenLabs 로 만들었어요.":": Some hero, yokai, and background art and animation frames were made with generative AI (Google Gemini), then selected and refined by hand. Music was made with Google Lyria, and voices and sound effects with ElevenLabs.","{0}D 동작: Adobe Mixamo (게임 사용 허용) · {1}D 렌더: Blender":"{0}D motion: Adobe Mixamo (game use permitted) · {1}D render: Blender","그림 확대: Real-ESRGAN (BSD-{0}-Clause) · 바닥 입체 지도: Depth Anything V{1} Small (Apache-{2})":"Image upscaling: Real-ESRGAN (BSD-{0}-Clause) · Floor depth map: Depth Anything V{1} Small (Apache-{2})","글꼴: East Sea Dokdo · Song Myung · Nanum Brush Script · Yeon Sung · Do Hyeon · Gowun Dodum (SIL Open Font License {0})":"Fonts: East Sea Dokdo · Song Myung · Nanum Brush Script · Yeon Sung · Do Hyeon · Gowun Dodum (SIL Open Font License {0})","멀티플레이 연결: PeerJS (MIT) · 로그인·저장: Google Firebase":"Multiplayer connection: PeerJS (MIT) · Login & saves: Google Firebase","게임 기획·프로그래밍·검수: 요괴록 개발팀":"Game design, programming, QA: Yogoerok Dev Team","아이디:":"ID:","· 닉네임:":"· Nickname:","계정 삭제":"Delete Account","이 계정의 서버 저장 데이터와 로그인 정보, 이 기기의 저장을 모두 지워요.":"Erases this account's server data and login info, plus everything saved on this device.","되돌릴 수 없어요.":"This can't be undone.","확인을 위해 아이디를 그대로 적어 주세요":"Type your ID exactly to confirm","아래 내용을 복사해서 문의처로 보내 주세요. 아이디·비밀번호는 들어가지 않아요.":"Copy the text below and send it to support. Your ID and password are not included.","📋 복사":"📋 Copy","복사":"Copy","📖 요괴록 도감":"📖 Yogoerok Bestiary","{0}/{1} · 잡은 요괴를 누르면 설화와 토벌 요령이 열려요 ({2}번: 요령 · {3}번: 토벌 완료 도장)":"{0}/{1} · Tap a slain yokai to open its tale and hunting tips (#{2}: tips · #{3}: Bounty-cleared stamp)","{0}장 · 잊힌 석굴":"Chapter {0} · Forgotten Grotto","장 보스 · 근거리 ·":"Chapter Boss · Melee ·","그림자":"Shadow","중간보스 · 근거리 ·":"Mid-boss · Melee ·","중간보스 · 원거리 ·":"Mid-boss · Ranged ·","{0}장 · 얼어붙은 동굴":"Chapter {0} · Frozen Cave","장 보스 · 원거리 ·":"Chapter Boss · Ranged ·","서리":"Frost","{0}장 · 불타는 대장간":"Chapter {0} · Burning Forge","{0}장 · 독 안개 늪":"Chapter {0} · Poison Mist Swamp","독":"Poison","{0}장 · 저승 궁궐":"Chapter {0} · Underworld Palace","저승":"Underworld","일반 요괴":"Common Yokai","아직 못 만남":"Not yet met","엘리트 특성":"Elite Traits","엘리트 요괴 머리 위에 이름이 보여요":"Names appear above elite yokai","신속":"Swift","빠르게 움직임":"Moves fast","받는 피해 {0}% 줄임":"Takes {0}% less damage","분열":"Splitting","쓰러지면 작은 요괴 둘로 갈라짐":"Splits into two small yokai when slain","폭발":"Explosive","쓰러지면 잠시 뒤 폭발 — 피하세요":"Explodes shortly after falling — dodge it","재생":"Regenerating","체력이 계속 차오름":"Health keeps refilling","흡혈":"Lifesteal","때릴 때마다 체력을 빨아들임 — 맞지 않는 게 최선":"Drains health with every hit — best not to get hit","보호막":"Shield","몇 초마다 파란 보호막 — 깨지면 그때 몰아치기":"Blue shield every few seconds — strike hard once it breaks","순간이동":"Teleport","가까이 순간이동 — 나타난 자리를 바로 치기":"Teleports close — hit where it appears","조합 강화":"Synergy Blessings","두 강화를 모두 가지면 레벨업 때 나와요":"Appears on level-up if you have both blessings","매의 눈 + 급소 찌르기":"Hawk Eye + Vital Strike","가시 갑옷 + 돌 피부":"Thorn Armor + Stone Skin","피의 맹세 + 가벼운 손":"Blood Oath + Light Hands","불씨 깃든 칼 + 넓은 베기":"Ember Blade + Wide Slash","부적 다발 + 산울림":"Talisman Bundle + Mountain Echo","요괴록 도감":"Yogoerok Bestiary","주간 순위표":"Weekly Leaderboard","무한의 방 · 이번 주 가장 깊이 내려간 방 · 월요일마다 새로 · 내 기록 아직 없음":"Endless Rooms · Deepest room reached this week · Resets every Monday · No record yet","불러오는 중…":"Loading…","순위표는 로그인(계정 연동)해야 볼 수 있어요.":"You need to log in (link an account) to view the leaderboard.","설아 · 궁수":"Seola · Archer","“바람 소리를 읽으면 화살은 저절로 간다.”":"“Read the voice of the wind, and the arrow finds its own way.”","체력 {0} · 공격 {1} · 이동 {2} · 원거리 · 사거리 {3} · 속성":"HP {0} · ATK {1} · Move {2} · Ranged · Range {3} · Element","물":"Water","각궁 사격":"Horn Bow Shot","세 갈래 화살":"Triple Arrow","한 번 시위를 당기면 화살이 꽃잎처럼 활짝 퍼졌다고 한다.":"They say a single pull of the string sent arrows blooming outward like petals.","화살 {0}발을 부채꼴로 쏴 각 {1}% 피해":"Fire {0} arrows in a fan, each dealing {1}% damage","바람 구르기":"Wind Roll","설아는 바람결에 몸을 맡겨 칼날 사이를 스치듯 빠져나갔다.":"Seola gave herself to the wind and slipped between the blades as if brushing past them.","가리킨 쪽으로 구르며 잠깐 무적":"Dodge roll toward the target direction with brief invincibility","화살비":"Arrow Rain","먹구름 낀 하늘에서 화살이 소나기처럼 쏟아졌다는 전설이라지.":"Legend says arrows poured down like a squall from the storm-clouded sky.","가리킨 곳에 {0}초 동안 화살비 (초당 {1}% 피해, 적이 느려짐)":"Arrow rain on the target area for {0}s ({1}% damage per second, slows enemies)","천궁 일시":"Heavenly Bow Shot","하늘을 겨눈 단 한 발이 온 요괴의 심장을 꿰뚫었다고 전한다.":"It is told that a single shot aimed at the heavens pierced the heart of every yokai.","모든 적을 꿰뚫는 거대한 화살 ({0}% 피해)":"A giant arrow that pierces all enemies ({0}% damage)","신궁":"Divine Archer","치명타 확률 +{0}% · 기본 공격 속도 +{1}%":"Critical hit chance +{0}% · Basic attack speed +{1}%","바람사수":"Wind Marksman","이동 속도 +{0}% · 스킬 대기 -{1}%":"Move speed +{0}% · Skill cooldown -{1}%","천궁수":"Sky Archer","폭풍궁사":"Storm Archer","궁신":"Archery God","천풍궁주":"Lord of Heaven's Wind Bow","신궁선":"Divine Bow Sage","풍백궁주":"Lord of the Wind Spirit Bow","천궁제":"Emperor of the Heavenly Bow","천풍신궁":"Heavenwind Divine Bow","요괴 {0}마리 처치 (누적)":"Defeat {0} yokai (cumulative)","원거리":"Ranged","거리 유지":"Keep Distance","공격력 -{0}% (멀리서 안전하게 싸우는 대가)":"ATK -{0}% (the price of fighting safely from afar)","만신 · 큰무당":"Mansin · Grand Shaman","“굿판엔 산 사람과 죽은 사람이 함께 서지.”":"“At a gut ritual, the living and the dead stand side by side.”","방울 소리":"Bell Chime","오방기 휘날림":"Five Banners Flutter","청·홍·황·백·흑 다섯 깃발이 사방의 잡귀를 몰아낸다.":"Five flags of blue, red, yellow, white, and black drive off stray spirits from every direction.","다섯 색 깃발 {0}발, 각 {1}% 피해":"{0} five-colored banners, each dealing {1}% damage","작두 타기":"Blade Dance","시퍼런 작두날 위에서도 신이 내리면 발이 베이지 않는다.":"Once the spirit descends, not even a razor-sharp blade will cut the feet.","{0}초 무적 + 주변에 초당 {1}% 피해":"{0}s invincibility + {1}% damage per second to nearby enemies","넋 달래기":"Soothe the Souls","한 맺힌 넋을 달래면 이승에 남아 곁을 지켜 준다.":"Soothe a soul bound by sorrow, and it will linger in this world to guard your side.","혼령 {0}명을 {1}초 동안 부름":"Summon {0} spirits for {1}s","대굿":"Grand Gut","징과 꽹과리가 밤새 울리는 큰 굿판엔 잡귀도 발을 못 뗀다.":"At a great ritual where gongs and kkwaenggwari ring all night, even stray spirits cannot move a foot.","큰 굿판을 벌여 {0}초 동안 넓은 자리에 초당 {1}% 피해, 적을 느리게 함":"Hold a grand ritual for {0}s, dealing {1}% damage per second over a wide area and slowing enemies","당골":"Danggol","스킬 대기 -{0}% · 공격력 +{1}%":"Skill cooldown -{0}% · ATK +{1}%","점바치":"Fortune Teller","방마다 보호막 {0}% · 초당 체력 {1}% 회복":"Shield {0}% each room · Recover {1}% HP per second","큰만신":"Great Mansin","작두무당":"Blade Shaman","국무당":"State Shaman","신어미":"Spirit Mother","나라만신":"National Mansin","대신어미":"Grand Spirit Mother","바리공주":"Princess Bari","천신어미":"Heavenly Spirit Mother","영웅 뽑기 · 조각 {0}개":"Hero Summon · {0} shards","여우비 · 구미호":"Yeoubi · Gumiho","“천 년을 기다렸어. 사람의 마음 하나 알려고.”":"“I waited a thousand years, just to understand one human heart.”","여우불":"Foxfire","여우불 부채":"Foxfire Fan","부채를 한 번 펼치면 푸른 혼불이 줄줄이 뒤를 쫓는다":"Open the fan once, and blue Soulfire trails after it in a line.","푸른 불 {0}개가 따라가며 각 {1}% 피해":"{0} blue flames follow, each dealing {1}% damage","매혹":"Charm","여우의 눈과 마주친 이는 제 이름도 잊고 멍하니 서 있다지":"They say whoever meets a fox's eyes forgets their own name and stands there dazed.","맞은 적 {0}초 동안 홀려 멈춤 + {1}% 피해":"Enemies hit are enthralled and frozen for {0}s + {1}% damage","꼬리 감추기":"Hidden Tails","꼬리 아홉을 감추고 사라진 여우는 어느새 등 뒤에 서 있더라지.":"The fox that hid her nine tails and vanished was said to be standing right behind you before you knew it.","가리킨 곳으로 순간이동, {0}초 무적, 그 자리에 여우불 폭발 {1}%":"Teleport to the targeted spot, invulnerable for {0}s, then foxfire explodes there for {1}%","구미 여우불":"Nine-Tail Foxfire","구미호의 아홉 꼬리마다 여우불이 하나씩 깃들었다고 전하지.":"It is told that a foxfire dwells in each of the gumiho's nine tails.","{0}초 동안 여우불 {1}개가 돌다가 가까운 적을 쫓아감":"For {0}s, {1} foxfires orbit you, then chase nearby enemies","여우불사":"Foxfire Adept","공격력 +{0}% · 치명타 확률 +{1}%":"Attack +{0}% · Critical Hit Chance +{1}%","매혹술사":"Charmcaster","이동 속도 +{0}% · 흡혈 {1}%":"Move Speed +{0}% · Lifesteal {1}%","천호":"Celestial Fox","대매혹사":"Grand Charmer","구미신":"Nine-Tail Deity","천호신녀":"Celestial Fox Priestess","천년구미":"Thousand-Year Nine-Tails","천호선녀":"Celestial Fox Maiden","구미천신":"Nine-Tail Heavenly God","만년천호":"Ten-Thousand-Year Celestial Fox","미궁으로 내려가는 중":"Descending into the labyrinth","약수 우물은 체력을 가득 채워 줘요":"Healing spring wells fully restore your HP","그림 없이 먼저 들어가기":"Enter Without Art","{0}% 아래로 내려가면 분노":"Rage below {0}% HP","분노":"Rage","엽전 — 원정 중 상점에서 써요":"Coins — spend them at shops during an expedition","엽전":"Coins","멈춤 · 소리 · 키 설정 (Esc)":"Pause · Sound · Keys (Esc)","액티브 잠금 (L)":"Active Item Lock (L)","{0} 스테이지 · 요괴 속성: 그림자 (약점 빛·번개)":"Stage {0} · Yokai Element: Shadow (weak to Light · Lightning)","{0}장 · 잊힌 석굴 · {1}/{2} 스테이지 · 그림자 속성":"Chapter {0} · Forgotten Grotto · Stage {1}/{2} · Shadow Element","서낭당 소원":"Seonang Shrine Wish","미궁 들머리 서낭당에 정화수 한 그릇을 올린다. 소원은 하나만 빌 수 있다.":"You set a bowl of clear water before the Seonang Shrine at the labyrinth's mouth. Only one wish may be made.","기운을 주소서":"Grant Me Strength","강화 '두꺼운 갑옷' — 최대 체력 +{0}%":"Blessing 'Thick Armor' — Max HP +{0}%","재물을 주소서":"Grant Me Fortune","엽전 {0}":"{0} coins","몸 성히 해 주소서":"Keep Me Whole","이번 원정 최대 체력 +{0}%":"Max HP +{0}% this expedition","큰 것을 주소서":"Grant Me Greatness","강화 '피의 맹세'·'넓은 베기' — 대신 판 내내 무리의 저주 (방마다 요괴 +{0}%)":"Blessings 'Blood Oath' · 'Wide Slash' — but a Horde Curse lingers all run (+{0}% yokai per room)","{0}~{1} 키로도 고를 수 있어요":"You can also choose with keys {0}–{1}","잠시 후 고를 수 있어요…":"You can choose in a moment…","숨 한 번, 시위 한 번.":"One breath, one bowstring.","{0}장 {1}스테이지":"Chapter {0} · Stage {1}","궁수 · Lv.{0}":"Archer · Lv.{0}","공격력":"Attack","체력":"HP","치명타":"Critical Hit","받는 피해":"Damage Taken","스킬 대기":"Skill Cooldown","이번 판 강화":"Blessings This Run","{0}개":"×{0}","아직 고른 강화가 없어요":"No blessings chosen yet","강화를 누르면 설명이 나와요":"Tap a blessing to see its description","액티브 없음 — 요괴·상자·보부상에게서 얻어요":"No active item — get one from yokai, chests, or Peddlers","계속하기":"Resume","저장 후 나가기":"Save & Exit","원정 그만두기":"Abandon Run","저장하면":"If you save,","부터 레벨·물건 그대로 이어서 해요":" — you'll pick up from there with your level and items intact","소리 · 키 설정":"Sound · Keys","🗺️ 지도":"🗺️ Map","얼굴 = 지금 있는 방 · 나무패 = 방 종류(보스·중간보스·상점·우물·보물·정예·괴이한 방·시련) · 붉은 문 = 홍살문 · 흐린 방은 안 가 본 방":"Face = current room · Wooden tag = room type (Boss, Mini-boss, Shop, Well, Relic, Elite, Strange Room, Trial) · Red door = Red Gate · Faded rooms = unvisited","닫기 (M)":"Close (M)","지도":"Map","기운이 차오른다":"Energy swells","레벨 {0}":"Level {0}","강화를 하나 고르세요":"Choose a blessing","날 선 칼":"Keen Blade","새 강화":"New Blessing","대장간 불에 사흘 밤낮 벼려 서슬이 시퍼레진 칼이라 한다.":"They say this blade was forged three days and nights in the smithy fire, until its edge turned a deep, cold blue.","두꺼운 갑옷":"Thick Armor","산군의 발톱도 튕겨냈다는 쇠비늘 갑옷이 고갯마루에 전하지.":"A suit of iron-scale armor that even the Mountain Lord's claws could not pierce is told of up on the mountain pass.","산삼 뿌리 말린 약초 주머니를 품으면 상처가 절로 아물더라.":"Keep a pouch of dried wild ginseng root close, and your wounds will mend on their own.","초당 체력 {0}% 회복":"Restore {0}% HP per second","넘기기 · 엽전 +{0}":"Skip · Coins +{0}","보부상":"Peddler","어서 오시오, 토벌꾼 양반! 등짐 풀어 놓을 테니 천천히 보시구려.":"Welcome, good bounty hunter! I'll unpack my pack, so take your time looking.","내 엽전":"My Coins","소모품":"Consumables","회복 약초":"Healing Herb","체력 {0}% 회복":"Restore {0}% HP","찜하면 다시 진열해도 남아요":"Marked items stay after a restock","찜":"Mark","장비 · 이번 원정 동안":"Gear · This run","바람 짚신":"Wind Sandals","이번 원정 동안 이동 속도 +{0}%":"Move speed +{0}% for this run","철갑":"Iron Armor","이번 원정 동안 최대 체력 +{0}%":"Max HP +{0}% for this run","강화 · 희귀":"Blessing · Rare","깨달음":"Enlightenment","액티브 · 기본":"Active Item · Common","낙석비":"Rockfall Rain","가리킨 곳 주변에 {0}번 떨어져 각 {1}%":"Falls {0} times around the target, {1}% each","뽑기 패":"Summon Token","뽑기 패 {0}개":"{0} Summon Tokens","🔔 다시 진열 · 엽전 {0}":"🔔 Restock · {0} coins","나가기 (Esc)":"Leave (Esc)","다시 진열 · 엽전 {0}":"Restock · {0} coins","떠돌이 대장간":"Wandering Forge","녹일 강화를 고르면 엽전":"Choose a blessing to melt down. It costs coins","을 내고, 새 강화 셋 중 하나로 다시 벼려요. (한 단계만 녹아요)":" to reforge it into one of three new blessings. (Only one tier melts away.)","그만두기":"Cancel","설아 · 궁수 — 한 갈래를 골라요 (이번 원정 동안)":"Seola · Archer — Choose a path (this run)","🗡️ 공격의 길":"🗡️ Path of Offense","치명타 확률 +NaN% · 기본 공격 속도 +NaN%":"Critical hit chance +NaN% · Basic attack speed +NaN%","✨ undefined번 스킬이 'undefined'으로 바뀜 · 위력 +{0}%":"✨ Skill undefined becomes 'undefined' · Power +{0}%","🛡️ 수호·기술의 길":"🛡️ Path of Guard & Technique","이동 속도 +NaN% · 스킬 대기 -NaN%":"Move speed +NaN% · Skill cooldown -NaN%","✨ undefined번 스킬이 'undefined'으로 바뀜 · 대기 -{0}% · 위력 +{1}%":"✨ Skill undefined becomes 'undefined' · Cooldown -{0}% · Power +{1}%","공격의 길":"Path of Offense","undefined번 스킬이 'undefined'으로 바뀜 · 위력 +{0}%":"Skill undefined becomes 'undefined' · Power +{0}%","수호·기술의 길":"Path of Guardian & Skill","undefined번 스킬이 'undefined'으로 바뀜 · 대기 -{0}% · 위력 +{1}%":"Skill #undefined becomes 'undefined' · Cooldown -{0}% · Power +{1}%","도깨비 씨름판":"Dokkaebi Wrestling Ring","모닥불 가에서 외뿔 도깨비가 씨름 상대를 찾고 있다. \"이기면 내 금은보화를 주지! 지면… 네 기운을 좀 얻어 가겠다!\"":"By the campfire, a one-horned dokkaebi is looking for a wrestling opponent. \"Win, and I'll give you my gold and silver! Lose... and I'll take a bit of your energy!\"","씨름 한판!":"Wrestle!","{0}% 엽전 +{1}·강화 하나 / {2}% 체력 -{3}%":"{0}% coins +{1} · one blessing / {2}% HP -{3}%","메밀묵을 바친다":"Offer Buckwheat Jelly","엽전 -{0} → 강화 하나":"Coins -{0} → one blessing","조용히 지나간다":"Slip Past Quietly","아무 일도 없음":"Nothing happens","구미호의 여우 구슬":"The Gumiho's Fox Bead","어둠 속에서 고운 여인이 푸른 구슬을 내민다. \"이 구슬을 머금으면 힘이 솟을 거예요… 대신 조금, 아주 조금만 생기를 주세요.\"":"From the darkness, a lovely woman holds out a blue bead. \"Hold this bead in your mouth and strength will surge... In return, give me a little, just a little of your life.\"","구슬을 받는다":"Take the Bead","이번 판 공격력 +{0}%, 최대 체력 -{1}%":"This run: ATK +{0}%, Max HP -{1}%","부적을 꺼내 쫓는다":"Drive Her Off with a Talisman","장승의 물음":"The Jangseung's Question","천하대장군과 지하여장군이 길을 막고 묻는다. \"우리 땅의 이야기를 아는 자만 지나가라.\"":"The General of Heaven and the General of the Underworld block the road and ask, \"Only one who knows the tales of our land may pass.\"","마을 어귀에 서서 마을을 지킨다는 나무·돌 기둥은?":"What wooden or stone post stands at a village entrance to guard it?","석등":"Stone lantern","장승":"Jangseung","굴뚝":"Chimney","삼신할미의 실타래":"Samsin Halmi's Thread","희미한 등불 아래 할머니가 실을 감고 있다. \"먼 길 가는구나. 무엇이 필요하냐?\"":"Beneath a dim lantern, an old grandmother winds thread. \"You travel a long road, child. What do you need?\"","기운을 북돋아 주세요":"Lift My Spirits","강화 하나 고르기":"Choose one blessing","상처를 돌봐 주세요":"Tend My Wounds","체력 전부 회복 + 보호막 {0}%":"Fully restore HP + {0}% shield","저승사자의 장부":"The Reaper's Ledger","검은 갓을 쓴 저승사자가 장부를 넘긴다. \"네 이름이 아직 여기 없구나. 원한다면 한 줄 지워 주지… 값은 받겠다.\"":"A jeoseung saja in a black gat turns the pages of his ledger. \"Your name is not written here yet. If you wish, I can strike a line for you... but I'll take a price.\"","이름을 지워 달라":"Strike My Name","이번 판 쓰러져도 한 번 다시 일어남, 최대 체력 -{0}%":"This run: rise once after falling, Max HP -{0}%","필요 없다":"No Need","엽전 +{0} (저승사자가 길 값을 놓고 감)":"Coins +{0} (the reaper leaves a toll behind)","떠도는 보부상":"Wandering Peddler","등짐을 진 보부상이 쉬어 가는 중이다. \"요괴 잡는 데 쓸 만한 물건이 있소. 싸게 드리리다.\"":"A peddler with a pack on his back is resting. \"I've got goods fit for hunting yokai. I'll give you a fair price.\"","물건을 산다":"Buy Goods","엽전 -{0} → 액티브 기술 하나":"Coins -{0} → one active item","약초를 산다":"Buy Herbs","엽전 -{0} → 약초 {1}개":"Coins -{0} → {1} herbs","길만 묻는다":"Just Ask the Way","혼불 +{0}":"Soulfire +{0}","정화수 한 그릇":"Bowl of Pure Water","장독대 위에 정화수가 놓여 있다. 누군가 소원을 빌다 떠난 자리다.":"A bowl of pure water sits atop the jar stand. Someone made a wish here and left.","엽전 +{0}":"Coins +{0}","요괴를 물리칠 힘을 주소서":"Grant Me Strength Against Yokai","이번 판 치명타 +{0}%":"This run: critical hit +{0}%","들썩이는 궤짝":"Rattling Chest","자물쇠 달린 궤짝이 저 혼자 들썩인다. 안에서 무언가 긁는 소리가 난다…":"A locked chest rattles on its own. Something is scratching from inside...","열어 본다":"Open It","보물 또는 요괴! (요괴면 쓰러뜨린 뒤 큰 보상)":"Relic or yokai! (If a yokai, great reward once defeated)","부적을 붙여 봉인한다":"Seal with a Talisman","달빛 우물":"Moonlit Well","우물 속에 달이 두 개 떠 있다. 하나는 하늘의 달, 하나는… 우물 바닥에서 손짓하는 무언가.":"Two moons float in the well. One is the moon in the sky; the other... something beckoning from the bottom of the well.","두레박을 내린다":"Lower the Bucket","{0}% 체력 전부 회복 / {1}% 물귀신이 잡아당겨 체력 -{2}%":"{0}% fully restore HP / {1}% a water ghost drags you down, HP -{2}%","동전을 던져 소원을 빈다":"Toss a Coin and Wish","엽전 -{0} → 이번 판 행운(치명타 +{1}%)":"Coins -{0} → luck this run (critical hit +{1}%)","뚜껑을 덮는다":"Cover the Well","해태의 시험":"The Haetae's Trial","불을 먹는다는 해태가 앞을 막는다. \"정직한 자에게는 복을, 거짓된 자에게는 벌을.\"":"The haetae, said to devour fire, blocks the way. \"Fortune for the honest, punishment for the false.\"","가진 엽전을 모두 내보인다":"Show all your coins","엽전이 {0} 이상이면 두 배로(최대 +{1}), 아니면 강화 하나":"{0}+ coins: doubled (max +{1}); otherwise, one blessing","조금 숨긴다":"Hide a few","{0}% 엽전 +{1} / {2}% 엽전 절반 잃음":"{0}% +{1} coins / {2}% lose half your coins","꺼지지 않는 화로":"The Unquenched Brazier","대장간 귀신이 버리고 간 화로에 아직 불씨가 살아 있다. 무기를 달구면 더 날카로워질 것 같다.":"An ember still lives in the brazier the forge ghost left behind. Heat your weapon in it, and it may grow sharper.","무기를 달군다":"Heat your weapon","체력 -{0}% → 이번 판 공격력 +{1}%":"HP -{0}% → ATK +{1}% this run","손을 녹인다":"Warm your hands","까치의 보은":"The Magpie's Gratitude","날개를 다친 까치가 퍼덕이고 있다. 옛이야기 속 까치는 은혜를 꼭 갚는다고 했다.":"A magpie with an injured wing flutters on the ground. In the old tales, a magpie always repays a kindness.","약초로 날개를 감싸 준다":"Wrap its wing with herbs","갈 길이 바쁘다":"Hurry on your way","도깨비 윷판":"Dokkaebi Yut Game","도깨비들이 윷을 던지며 내기를 하고 있다. \"한 판 끼어 볼 텐가? 걸고 싶은 만큼 걸어!\"":"The dokkaebi are casting yut sticks and placing bets. \"Care to join a round? Wager as much as you dare!\"","엽전 {0}을 건다":"Wager {0} coins","윷({0}칸)·모({1}칸)면 엽전 +{2}, 도·개·걸이면 잃음":"Yut ({0} spaces) or Mo ({1} spaces): +{2} coins; Do, Gae, or Geol: lose your wager","구경만 한다":"Just watch","굿판의 무당":"The Shaman's Ritual","어둠 속에서 굿판이 벌어지고 있다. 무당이 북을 치며 묻는다. \"무슨 액을 막아 줄꼬?\"":"A ritual is underway in the darkness. The shaman beats her drum and asks, \"What misfortune shall I ward off?\"","몸의 액을 막아 주오":"Ward off harm to my body","이번 판 받는 피해 -{0}%":"Damage taken -{0}% this run","재물의 액을 막아 주오":"Ward off loss of fortune","이번 판 엽전 획득 +{0}%":"Coin gain +{0}% this run","앞길의 액을 막아 주오":"Ward off trouble ahead","이번 판 이동 속도 +{0}%":"Move speed +{0}% this run","장 보스 · 근거리 · 그림자 속성":"Chapter Boss · Melee · Shadow","그림자 우두머리":"Shadow Chieftain","연격":"Combo","무적":"Invincible","좋아!":"Nice!","거침없이":"Unstoppable","쓰러졌습니다":"You have fallen","주모 홍매":"Innkeeper Hongmae","이야기 값 · 혼불 +{0}":"Story fee · Soulfire +{0}","설아 숙련":"Seola Mastery","+{0} 경험 · 다음까지 {1}":"+{0} EXP · {1} to next","피해 기록":"Damage Log","초당 {0}":"{0}/sec","다음엔":"Next time","구르기(Space)는 잠깐 무적이에요. 붉은 영역이 사라지기 직전에 굴러 보세요.":"Dodge roll (Space) grants brief invincibility. Try rolling just before the red zone vanishes.","{0}장 {1}":"Chapter {0} {1}","도달":"Reached","처치":"Defeated","최대 연격":"Max Combo","레벨":"Level","코인 보상":"Jade Reward","🔥 혼불":"🔥 Soulfire","{0}장 도달":"Reached Chapter {0}","다음 목표":"Next Goal","혼불 제단 · 엽전 주머니 {0}단계":"Soulfire Altar · Coin Pouch Tier {0}","임무 · 방 {0}개 정리":"Mission · Clear {0} rooms","🎯 받을 수 있는 임무 보상이 있어요!":"🎯 Mission rewards are ready to claim!","다시 도전":"Try Again","처음 화면":"Main Menu","📸 기록 카드":"📸 Record Card","기록 카드":"Record Card","혼불":"Soulfire","받을 수 있는 임무 보상이 있어요!":"Mission rewards are ready to claim!","어서":"Hurry","어서 와":"Come on in","어서 와요,":"Welcome,","어서 와요, 토":"Welcome, hun","어서 와요, 토벌꾼":"Welcome, hunter","어서 와요, 토벌꾼 양":"Welcome, hunter, si","어서 와요, 토벌꾼 양반.":"Welcome, hunter.","어서 와요, 토벌꾼 양반. 미":"Welcome, hunter. The lab","어서 와요, 토벌꾼 양반. 미궁에":"Welcome, hunter. Into the labyrinth","어서 와요, 토벌꾼 양반. 미궁에 처":"Welcome, hunter. Into the labyrinth for the fir","어서 와요, 토벌꾼 양반. 미궁에 처음":"Welcome, hunter. Into the labyrinth for the first time","어서 와요, 토벌꾼 양반. 미궁에 처음 들어":"Welcome, hunter. You went into the labyrinth for the first time","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다":"Welcome, hunter. You went into the labyrinth for the first time and","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나":"Welcome, hunter. You went into the labyrinth for the first time and came","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온":"Welcome, hunter. You went into the labyrinth for the first time and came out","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네.":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth.","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. If you fa","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's o","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 —":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay —","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit, as Soulfire","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit, as Soulfire","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and rem","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까,":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so,","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so the al","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so at the altar","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so at the altar off","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so offer it at the altar and","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고 다":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so offer it at the altar and go","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고 다시":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so offer it at the altar and then, again","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고 다시 내려":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so offer it at the altar and head back dow","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고 다시 내려가":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so offer it at the altar and head back down","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고 다시 내려가 봐요":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so offer it at the altar and head back down, go on","어서 와요, 토벌꾼 양반. 미궁에 처음 들어갔다 나온 얼굴이네. 쓰러져도 괜찮아요 — 요괴 넋은 혼불이 되어 남으니까, 제단에 바치고 다시 내려가 봐요.":"Welcome, hunter. You have the face of one fresh from their first trip into the labyrinth. Even if you fall, it's okay — a yokai's spirit becomes Soulfire and remains, so offer it at the altar and head back down.","오류: Script error.  · v{0}":"Error: Script error.  · v{0}","바람 신발":"Wind Shoes","신고 달리면 한양 천 리도 하룻밤이라 하더라.":"They say that in these shoes, even the thousand li to Hanyang is a single night's run.","가벼운 손":"Nimble Hands","기본 공격 속도 +{0}%":"Basic attack speed +{0}%","소매 속에서 손이 먼저 나간다더니 눈 깜짝할 새였지.":"They say the hand leaps from the sleeve before you know it—quick as a blink.","매의 눈":"Hawk Eye","백 걸음 밖 반딧불도 놓치지 않는 매의 눈이라 하지.":"A hawk's eye, they say, that misses not even a firefly a hundred paces away.","부적 다발":"Talisman Bundle","무당이 붉은 먹으로 쓴 부적 한 다발이면 주문이 절로 돈다.":"With a bundle of talismans inked in red by a shaman, the spells cast themselves.","돌 피부":"Stone Skin","돌장승 곁에서 자란 아이는 살갗이 돌 같다지.":"A child raised beside a stone totem pole, they say, grows skin hard as stone.","복주머니":"Lucky Pouch","복주머니 끈을 맨 날엔 엽전이 비 오듯 쏟아졌다더라.":"The day the lucky pouch was tied, they say, brass coins poured down like rain.","급소 찌르기":"Vital Strike","급소를 한 번 찔린 귀신은 다시 일어난 적이 없다지.":"A ghost struck once in its weak spot, they say, has never risen again.","준 피해의 {0}%만큼 체력을 빨아들임":"Drains HP equal to {0}% of damage dealt","피로 맺은 맹세는 어긴 자의 목숨을 가져간다 하지.":"An oath sealed in blood, they say, claims the life of whoever breaks it.","가시 갑옷":"Thorn Armor","맞으면 때린 자에게 내 공격력의 {0}%를 되돌려줌":"When hit, reflect {0}% of your attack damage to the attacker","가시나무 숲에서 갑옷을 지은 대장장이의 손이 성할 날 없었지.":"The smith who forged armor in the thornwood never had a day of unscarred hands.","갈래 기운":"Forked Energy","화살 +{0} (원거리 기본 공격)":"Arrows +{0} (ranged basic attack)","한 줄기 기운이 갈래갈래 흩어져 날아간다 하지.":"They say a single strand of energy splits and scatters in flight.","넓은 베기":"Wide Slash","근접 공격 범위 +{0}%, 폭발 범위 +{1}%":"Melee range +{0}%, blast radius +{1}%","한 번 휘두르면 풀밭이 눕고 귀신도 물러선다지.":"One sweep lays the grass flat, and even ghosts step back.","불씨 깃든 칼":"Ember Blade","기본 공격이 적을 불태움 ({0}초 동안 {1}%)":"Basic attacks burn enemies ({1}% over {0}s)","도깨비불을 칼날에 앉히면 닿는 것마다 타들어 간다지.":"Set a dokkaebi fire upon the blade, and all it touches smolders away.","서릿발 칼":"Frostbite Blade","기본 공격이 적을 {0}초 동안 느리게 만듦":"Basic attacks slow enemies for {0}s","삼동 서릿발을 먹인 칼은 닿기만 해도 몸이 얼어붙는다.":"A blade fed on the frost of midwinter freezes the body at a mere touch.","방에 들어갈 때마다 체력 {0}%만큼 보호막":"Gain a shield equal to {0}% of HP on entering a room","문턱을 넘을 때마다 호신 부적이 은은히 빛났다.":"Each time one crossed a threshold, the protective talisman glowed softly.","참선 삼 년에 문득 한 소식을 얻으니 천지가 환하더라.":"After three years of meditation, sudden enlightenment came, and heaven and earth grew bright.","꼬리 문 벼락":"Trailing Thunderbolt","치명타가 터지면 번개가 {0}명에게 튐 ({1}%)":"On a critical hit, lightning jumps to {0} enemies ({1}%)","벼락이 한 놈을 치면 곁의 놈에게 꼬리를 문다지.":"When thunder strikes one foe, it bites on to the next at its side.","송장 불벼락":"Corpse Firestorm","적이 죽으면 주변에 {0}% 폭발":"Slain enemies explode for {0}% damage nearby","한 맺힌 원귀가 스러질 때 송장이 터져 불벼락이 쳤다.":"When a vengeful ghost fell, the corpse burst and fire thundered down.","깨질 옥검":"Brittle Jade Sword","공격력 +{0}%, 받는 피해 +{1}%":"Attack +{0}%, damage taken +{1}%","옥으로 빚은 칼은 천하를 가르나 한 번 부딪히면 깨진다지.":"A jade blade can cleave the world, yet one clash shatters it.","저승사자 낫":"Reaper's Scythe","체력 {0}% 이하 적을 맞힐 때마다 {1}% 확률로 즉시 처치 (보스 제외)":"Hitting an enemy at {0}% HP or below has a {1}% chance to instantly slay it (bosses excluded)","저승사자가 낫을 들면 명이 다한 자는 이름이 지워진다지.":"When the jeoseung saja raises his scythe, the names of the doomed are wiped away.","산울림":"Mountain Echo","스킬을 쓸 때 {0}% 확률로 대기 초기화":"{0}% chance to reset cooldown when using a skill","빈 골짜기에서 외친 주문이 산울림 되어 되돌아오더라.":"A spell shouted into an empty valley came back as a mountain echo.","검귀의 눈":"Sword Ghost's Eye","[조합] 매의 눈+급소 찌르기 → 치명타 +{0}%, 치명타 피해 +{1}%":"[Synergy] Hawk Eye + Vital Strike → Crit chance +{0}%, crit damage +{1}%","칼 쓰는 귀신은 눈빛만으로도 약점을 꿰뚫는다 하지.":"They say a sword-wielding ghost pierces any weakness with a glance alone.","가시 철벽":"Thorn Bulwark","[조합] 가시 갑옷+돌 피부 → 받는 피해 -{0}%, 반사 +{1}%":"[Synergy] Thorn Armor + Stone Skin → Damage taken -{0}%, reflect +{1}%","가시 돋친 성벽 앞에선 호랑이도 꼬리를 말았다지.":"Before a thorn-studded wall, even the tiger tucked its tail.","피바람":"Blood Wind","[조합] 피의 맹세+가벼운 손 → 피해 흡수 +{0}%, 공격 속도 +{1}%":"[Synergy] Blood Oath + Light Hands → Lifesteal +{0}%, attack speed +{1}%","피비린 바람이 한바탕 불면 칼춤이 멎을 줄 몰랐다지.":"Once the blood-reeking wind began to blow, the sword dance would not stop.","불꽃 회오리":"Flame Whirlwind","[조합] 불씨 깃든 칼+넓은 베기 → 공격력 +{0}%, 범위 +{1}%":"[Synergy] Ember Blade + Wide Slash → Attack +{0}%, range +{1}%","불길이 칼끝을 타고 돌며 온 들판을 붉게 휩쓸었다지.":"Flames coiled along the blade's tip and swept the whole field red.","도사의 경지":"Taoist Sage's Realm","[조합] 부적 다발+산울림 → 스킬 대기 -{0}%, 산울림 +{1}%":"[Synergy] Talisman Bundle + Mountain Echo → Skill cooldown -{0}%, Mountain Echo +{1}%","부적과 산울림을 다스리는 도사는 시간마저 접는다지.":"The Taoist sage who commands talismans and echoes folds even time itself.","봉황 깃털":"Phoenix Feather","한 번 쓰러져도 체력 {0}%로 일어남":"Revive with {0}% HP after falling once","잿더미 속에서도 다시 날아오른 봉황의 깃털이라지.":"They say it is a feather of the phoenix that rose again from the ashes.","서리 사슬":"Frost Chain","적 {0}명에게 튀며 각 {1}%":"Bounces to {0} enemies, {1}% each","북녘 원귀가 끌고 다녔다는 얼음 사슬은 한 번 울면 사방이 언다지.":"The ice chain dragged by a northern vengeful ghost freezes all around when it rings but once.","벽력 결계":"Thunderclap Ward","내 자리에 결계를 펼침 (안에서 받는 피해 -{0}%, 적에게 초당 {1}%)":"Deploy a ward at your spot (damage taken inside -{0}%, deals {1}% per second to enemies)","뇌공이 부적 둘레에 벼락을 둘러 사악한 것을 막았다지.":"The Lord of Thunder ringed the talisman with lightning to ward off evil.","질풍 돌격":"Gale Charge","돌진 {0}% + 끝에 {1}% 폭발 · 밀쳐냄":"Dash {0}% + {1}% blast at the end · knockback","산바람을 타고 내달리면 고갯길도 한달음이라 하였다.":"Ride the mountain wind, and even a steep pass is crossed in a single breath.","독안개":"Poison Mist","가리킨 곳에 {0}초간 독안개 (초당 {1}%)":"Poison mist at target for {0}s ({1}% per sec)","독버섯 숲에서 피어오른 안개는 닿는 이마다 시들게 했다지.":"They say the mist rising from the poison-mushroom forest withered all it touched.","독무 질주":"Toxic Dash","돌진 {0}% + 끝에 {1}% 폭발 · 중독":"Dash {0}% + {1}% blast at the end · Poison","독사 요괴가 지나간 자리엔 풀도 눕고 냄새만 남았다지.":"They say where the viper yokai passed, the grass lay flat and only the stench remained.","불바다":"Sea of Fire","가리킨 곳에 {0}초간 불바다 (초당 {1}%)":"Sea of fire at target for {0}s ({1}% per sec)","도깨비불이 번져 한밤 들판이 온통 붉게 타올랐다지.":"They say dokkaebi fire spread until the midnight fields blazed red.","바람 가르기":"Wind Slash","일직선으로 쏘는 바람줄기 {0}%":"Straight wind stream {0}%","대숲을 가르던 매서운 바람이 한 줄기 칼날이 되었다지.":"They say the biting wind that split the bamboo grove became a single blade.","흡혼 구슬":"Soul-Drain Orb","구슬 {0}발 각 {1}% · 피를 빨아 회복":"{0} orbs, {1}% each · Lifesteal","굶주린 혼이 뭉친 검은 구슬은 맞은 이의 기운을 빨아 먹는다지.":"They say the black orbs, formed of starving souls, suck the energy from whoever they strike.","돌개바람":"Whirlwind","가리킨 곳에 {0}초간 돌개바람 (초당 {1}%)":"Whirlwind at target for {0}s ({1}% per sec)","고개 너머 돌개바람이 한자리에 눌러앉아 떠나지 않았다지.":"They say a whirlwind beyond the pass settled in one spot and never left.","홍염 작렬":"Crimson Blaze","주변 {0}% 폭발 · 불태움":"{0}% blast around you · Burn","성난 불의 요괴가 숨을 몰아 내쉬면 사방이 화르르 탔다지.":"They say when the enraged fire yokai exhaled, everything around went up in flames.","독룡 줄기":"Venom Dragon Beam","일직선으로 쏘는 독기 줄기 {0}%":"Straight venom stream {0}%","독룡이 내뱉은 숨결이 한 줄기로 뻗어 숲을 시들게 했다지.":"They say the venom dragon's breath shot out in one stream and withered the forest.","설한 결계":"Frostbound Ward","겨울 산신이 눈서리로 둘러친 울타리엔 잡귀도 못 든다지.":"They say not even lesser spirits can enter the fence of snow and frost the winter mountain god raised.","서리 가호":"Frost Blessing","{0}초간 공격력 +{1}%·공격 속도 +{2}%, 체력 {3}% 회복":"{0}s: ATK +{1}%, attack speed +{2}%, restore {3}% HP","눈 내린 서낭당 앞에서 빌면 서릿발 같은 기운이 깃든다지.":"They say praying before a snow-covered Seonang Shrine fills you with frost-sharp energy.","풍륜 부적":"Wind Wheel Talisman","{0}초 동안 {1}개가 몸을 돌며 각 {2}%":"For {0}s, {1} orbit you, {2}% each","무당이 날린 부적이 바람을 타고 몸을 맴돌았다지.":"They say the talismans the shaman cast rode the wind and circled around her.","날벼락":"Thunderbolt","주변 {0}% 폭발 · 짧은 기절":"{0}% blast around you · Short stun","하늘이 노하여 내리친 날벼락에 마을 느티나무가 쪼개졌다지.":"They say a thunderbolt struck down by the angry heavens split the village zelkova tree.","서릿발":"Frost Spike","일직선으로 쏘는 서리 줄기 {0}%":"Straight frost stream {0}%","한겨울 처마 끝 서릿발이 곧게 뻗어 적을 꿰뚫었다지.":"They say a midwinter frost spike from the eaves shot straight out and pierced the foe.","뇌신 가호":"Thunder God's Blessing","뇌신께 정화수를 올리면 번갯불 같은 기운이 깃든다 하였다.":"It was said that offering clear water to the Thunder God fills you with lightning-like energy.","뇌공 구슬":"Thunder Orb","뇌공이 구슬을 굴리자 번갯불이 주위를 빙글 맴돌았다지.":"They say when the Thunder Lord rolled his orbs, lightning swirled round and round.","서리 달음":"Frost Dash","돌진 {0}% + 끝에 {1}% 폭발 · 느려짐":"Dash {0}% + {1}% blast at the end · Slow","서릿발 밟고 달리면 지나온 길이 하얗게 얼어붙지.":"Run across the frost, and the path behind you freezes white.","독기 가호":"Venom Blessing","{0}초 공격력 +{1}%·공격 속도 +{2}%, 체력 {3}% 회복":"{0}s: ATK +{1}%, attack speed +{2}%, restore {3}% HP","독초 달인 물로 부적을 적시면 몸에 독기가 돈다지.":"They say soaking a talisman in water boiled with poison herbs sends venom coursing through your body.","산이 노하면 돌덩이가 비처럼 쏟아진다는 말이 있다.":"There's a saying that when the mountain is angered, boulders pour down like rain.","용천수":"Dragon Spring","곧게 뿜는 물줄기 {0}%":"Straight water jet {0}%","용의 입에서 뿜은 물줄기가 바위도 꿰뚫었다고들 한다.":"They say the water jet spewed from the dragon's mouth pierced even solid rock.","벼락 서린 터":"Lightning Ground","가리킨 곳에 {0}초간 벼락이 내린다 (초당 {1}%)":"Lightning strikes target for {0}s ({1}% per sec)","벼락 맞은 대추나무 아래엔 잡귀가 얼씬도 못 했다.":"Beneath a jujube tree struck by lightning, not even a lesser spirit dared to show itself.","지신 구슬":"Earth Spirit Orb","구슬 {0}발이 각각 {1}% 피해를 주고 기절시킴":"{0} orbs deal {1}% damage each and stun","지신이 노하면 흙덩이가 솟구쳐 적을 쓰러뜨린다지.":"They say when the earth spirit is angered, clods of earth surge up and fell the foe.","불똥 사슬":"Ember Chain","도깨비불이 이 놈 저 놈 옮겨 붙으며 사슬처럼 이어졌다.":"Dokkaebi fire leapt from one foe to the next, linking them like a chain.","흑암 늪":"Blackshade Mire","가리킨 곳에 {0}초간 어둠이 깔림 (초당 {1}%)":"Darkness settles on the target area for {0}s ({1}% per sec)","달 없는 밤 늪가에 고인 어둠은 발을 붙들고 놓지 않는다지.":"They say the darkness pooled by the marsh on a moonless night seizes your feet and never lets go.","바람 소나기":"Wind Shower","가리킨 곳 둘레에 {0}번 내리꽂혀 각 {1}%":"Strikes around the target area {0} times, {1}% each","산마루 회오리가 한바탕 몰아치며 소나기처럼 내리쳤다.":"A whirlwind from the mountain ridge swept in and lashed down like a sudden shower.","먹물비":"Inkrain","먹구름 아래 검은 빗방울이 지붕을 두드리면 화를 입는다지.":"They say that when black raindrops beat upon the roof beneath dark clouds, misfortune follows.","벼린 물맴이":"Honed Whirligig","{0}초 동안 {1}개가 돌며 각 {2}%":"{1} orbit for {0}s, {2}% each","개울물 구슬 네 개가 도르르 돌며 사악한 기운을 씻었다.":"Four beads of brook water spun round and washed away the wicked energy.","저승 사슬":"Underworld Chains","저승사자의 허리춤에서 풀려난 사슬은 이름을 부르며 따른다지.":"They say chains loosed from a jeoseung saja's waist follow you, calling out your name.","별똥비":"Meteor Shower","가리킨 곳 둘레에 {0}번 내리꽂혀 각 {1}%, 체력 {2}% 회복":"Strikes around the target area {0} times, {1}% each, restores {2}% HP","그믐밤 하늘이 갈라지며 별똥이 비처럼 쏟아졌다더라.":"On a moonless night the sky split open, and shooting stars poured down like rain, so it is told.","혼불 가호":"Soulfire Grace","혼불을 입에 머금고 빌면 넋이 한결 가벼워진다지.":"They say that if you hold a soulfire in your mouth and pray, your spirit grows much lighter.","그림자 달음":"Shadow Dash","돌진 {0}% + 끝에 {1}% 폭발 · 흡혈":"Dash {0}% + {1}% blast at the end · Lifesteal","그림자는 주인보다 먼저 달려가 적의 목덜미를 문다.":"A shadow runs ahead of its master and bites the foe at the nape of the neck.","독기 사슬":"Venom Chain","독 묻은 침이 이 놈 저 놈 옮겨 가며 퍼져 나갔다.":"The venom-laced spit leapt from one wretch to the next and spread.","물보라":"Spray","주변 {0}% 폭발 · 느려짐·밀쳐냄":"{0}% blast around you · Slow · Knockback","용왕의 노여움이 물기둥으로 솟아 뭍것들을 밀어냈다 한다.":"The Dragon King's wrath is said to have risen as pillars of water and shoved back the creatures of the land.","달빛 서린 터":"Moonlit Ground","가리킨 곳에 {0}초간 달빛이 고인다 (초당 {1}%), 체력 {2}% 회복":"Moonlight pools on the target area for {0}s ({1}% per sec), restores {2}% HP","보름달이 머문 자리에선 다친 짐승도 상처가 아문다 했지.":"They say that even wounded beasts find their wounds closing where the full moon lingers.","넋화살":"Soul Arrow","구슬 {0}발, 각 {1}% · 받는 피해 +{2}% 표식":"{0} orbs, {1}% each · Mark: +{2}% damage taken","넋을 깎아 만든 화살에 맞으면 저승 문이 열려 보인다지.":"They say that if you are struck by an arrow carved from a soul, you will glimpse the gates of the underworld swing open.","벼린 불화살":"Honed Fire Arrow","탄 {0}발 각 {1}% · 불태움":"{0} shots, {1}% each · Burn","대장간에서 벼린 부적 화살엔 불씨가 깃들어 있었다.":"A spark of fire dwelt within the talisman arrow honed at the forge.","벼린 바람살":"Honed Wind Arrow","탄 {0}발 각 {1}% · 밀쳐냄":"{0} shots, {1}% each · Knockback","바람을 벼려 쏜 살은 맞은 요괴를 멀리 날려 보냈다.":"The arrow, honed from the wind itself, sent any yokai it struck flying far away.","벼린 독침":"Honed Poison Needle","탄 {0}발 각 {1}% · 중독":"{0} shots, {1}% each · Poison","독을 먹여 벼린 침 한 방에 요괴도 스르르 시들었다.":"One jab of the poison-fed needle, and even a yokai withered away.","벼린 불결계":"Honed Fire Ward","내 자리에 결계 (안에서 피해 -{0}%, 적 초당 {1}%)":"Ward at your position (-{0}% damage taken inside, enemies take {1}% per sec)","불씨를 빙 둘러 놓으니 잡귀는 다가서지도 못했다.":"With embers laid in a ring around, not even the lesser spirits could draw near.","야음 결계":"Nightfall Ward","해 진 뒤 무당이 먹물로 금을 그으면 밤이 담이 된다지.":"They say that when a shaman draws a line in ink after sunset, the night itself becomes a wall.","넋 잇는 사슬":"Soul-Linking Chain","죽은 넋과 넋을 엮은 사슬이 산 자를 하나씩 휘감는다":"A chain woven from the souls of the dead coils around the living, one by one","벼린 벼락살":"Honed Thunder Arrow","탄 {0}발 각 {1}% · 짧은 기절":"{0} shots, {1}% each · Short stun","벼락 맞은 쇠로 만든 살은 맞으면 한동안 넋을 잃는다지.":"They say that anyone struck by an arrow made of lightning-struck iron loses their senses for a while.","먹구슬":"Ink Orb","먹빛 어둠이 구슬이 되어 저승길 나그네를 따라 돈다지.":"They say the ink-black darkness becomes an orb and circles the traveler on the road to the underworld.","해돋이":"Sunrise","주변 {0}% 폭발, 체력 {1}% 회복":"{0}% blast around you, restores {1}% HP","해돋이 때 절간 종소리와 함께 퍼진 빛이 어둠을 몰아냈다지.":"They say the light that spread with the temple bell at sunrise drove the darkness away.","벼린 바람굿":"Honed Wind Rite","바람굿 한 판에 풍신이 내려와 몸이 새털처럼 가벼웠다.":"At one round of the wind rite the wind god descended, and the body felt light as a feather.","벼린 불줄기":"Honed Flame Stream","곧게 뻗는 불줄기 {0}%":"Straight stream of fire {0}%","벼린 화염이 한 줄로 뻗어 고목도 요괴도 재가 되었다.":"A honed blaze stretched in a single line, and ancient trees and yokai alike turned to ash.","칼바람":"Blade Wind","주변 {0}% 폭발 · 밀쳐냄":"{0}% nearby blast · Knockback","고갯마루 칼바람이 한꺼번에 터지면 갓도 날아간다지.":"They say when the blade winds of the mountain pass burst all at once, even your gat is blown away.","먹빛 가호":"Ink Ward","먹빛 두루마기 걸친 무당이 어둠의 가호를 빌었다.":"A shaman in an ink-black durumagi prayed for the protection of darkness.","도깨비불":"Dokkaebi Fire","도깨비불 네 덩이가 주인 곁을 맴돌며 밤길을 지켰다지.":"Four dokkaebi fires circled their master, guarding the night road, so they say.","서광 질주":"Dawn Dash","돌진 {0}% + 끝에 {1}% 폭발, 체력 {2}% 회복":"Dash {0}% + {1}% blast at the end, restore {2}% HP","새벽 빛줄기를 타고 달리면 상처마저 아문다고 전한다.":"It is told that if you ride the beam of dawn light, even your wounds will heal.","서리살":"Frost Arrow","서리 구슬 {0}발, 각 {1}% · 느려짐":"{0} frost orbs, {1}% each · Slow","삼동 설한풍을 화살촉에 얼려 쏘았다는 사냥꾼의 이야기다.":"The tale of a hunter who froze the bitter midwinter wind onto his arrowheads and let fly.","먹물 터짐":"Ink Burst","주변 {0}% 폭발 · 흡혈":"{0}% nearby blast · Lifesteal","먹물 항아리가 깨지자 어둠이 사방으로 터져 나갔다.":"When the ink jar shattered, darkness burst out in every direction.","서광 구슬":"Dawn Orb","구슬 {0}발 각 {1}%, 체력 {2}% 회복":"{0} orbs, {1}% each, restore {2}% HP","새벽 절집 등불에서 떨어진 빛 한 알이 어둠을 꿰뚫었다지.":"A single grain of light fallen from a temple lantern at dawn pierced the darkness, they say.","독침비":"Poison Needle Rain","독초 달인 물이 먹구름에 섞여 내렸다는 흉흉한 소문이다.":"An ominous rumor says water brewed from poison herbs mixed with the dark clouds and rained down.","서리꽃":"Frost Bloom","주변 {0}% 폭발 · 느려짐":"{0}% nearby blast · Slow","한지 창에 피던 서리꽃이 한순간에 사방으로 터져 번졌다.":"Frost flowers blooming on the hanji window burst and spread in every direction in an instant.","혼불비":"Soulfire Rain","스러진 혼불이 비처럼 쏟아져 원한을 갚으러 내려온다지.":"Fallen soulfires pour down like rain, come to repay their grudges, they say.","불의 가호":"Flame Ward","{0}초 동안 공격력 +{1}%·공격 속도 +{2}%, 체력 {3}% 회복":"For {0}s: ATK +{1}% · Attack Speed +{2}%, restore {3}% HP","무당이 불꽃 앞에 빌면 몸에 뜨거운 기운이 깃든다지.":"When a shaman prays before the flames, a burning energy settles into the body.","지신의 결계":"Earth Spirit Barrier","내 자리에 결계 (안에서 받는 피해 -{0}%, 적 초당 {1}%)":"Barrier at your spot (damage taken inside -{0}%, enemies take {1}% per second)","지신이 발을 구르면 땅이 일어나 나그네를 감싼다지":"When the earth spirit stamps its foot, the ground rises to cradle the wanderer.","달빛 줄기":"Moonbeam","곧게 뻗는 빛줄기 {0}%, 체력 {1}% 회복":"Straight beam {0}%, restore {1}% HP","달빛 한 줄기가 귀신 낀 골짜기를 곧게 갈랐다지.":"A single ray of moonlight split the haunted valley clean through, they say.","독나비떼":"Poison Butterflies","독 묻은 나비 떼가 주인 둘레를 돌며 날개를 떤다지.":"A swarm of venom-dusted butterflies circles their master, wings aquiver, they say.","불수레":"Fire Cart","돌진 {0}% + 끝에 {1}% 폭발 · 불태움":"Dash {0}% + {1}% blast at the end · Burn","불수레가 고갯길을 내달리면 풀 한 포기 남지 않았다지.":"When the fire cart raced down the mountain road, not a blade of grass was left.","서리터":"Frost Ground","가리킨 곳에 {0}초간 서리가 내린 자리를 만든다 (초당 {1}%)":"Creates frosted ground at the target spot for {0}s ({1}% per second)","서리 귀신이 밟고 간 자리엔 풀도 얼어붙어 눈물만 남았다.":"Where the frost ghost trod, even the grass froze, leaving only tears.","넋 울타리":"Spirit Fence","죽은 이의 넋이 울타리 되어 산 사람을 에워싼다지.":"The souls of the dead become a fence and surround the living, they say.","벼락줄기":"Thunderbolt","곧게 뻗는 번개줄기 {0}%":"Straight lightning bolt {0}%","뇌공이 북을 두드리면 하늘에서 한 줄기 불벼락이 꽂힌다.":"When the Thunder Lord beats his drum, a bolt of fiery lightning strikes down from the sky.","뇌공 질주":"Thunder Dash","돌진 {0}% + 끝에 {1}% 폭발 · 짧은 기절":"Dash {0}% + {1}% blast at the end · Brief stun","번개를 타고 달린 장수가 닿는 곳마다 천둥이 울렸다지.":"A general who rode the lightning made thunder roar wherever he touched down, they say.","얼음우박":"Ice Hail","한여름에도 삼십 리 밖까지 우박이 쏟아졌다는 괴이한 해다.":"A strange year, they say, when hail poured down even in midsummer, as far as thirty li around.","독안개진":"Poison Mist Formation","독무가 자욱한 진 안에서는 범도 쉬이 들어서지 못했다지.":"Not even a tiger could easily enter a formation thick with poison mist.","독꽃":"Poison Bloom","주변 {0}% 폭발 · 중독":"{0}% nearby blast · Poison","독버섯 갓이 터지면 퍼진 포자에 숲이 시들어 갔다지.":"When a poison mushroom's cap burst, the spreading spores withered the forest.","바람사슬":"Wind Chain","바람신이 던진 쇠사슬이 이놈 저놈을 줄줄이 꿰었다지.":"They say the chains flung by the Wind God strung one foe after another.","눈꽃 고리":"Snowflake Ring","눈꽃 다섯 송이가 찬바람을 두르고 주인을 맴돈다지.":"Five snowflakes, wrapped in cold wind, are said to circle their master.","풍백의 결계":"Pungbaek's Ward","풍백이 부채질하면 바람 담이 서서 화살도 비껴간다지":"When Pungbaek fans the air, a wall of wind rises and even arrows glance aside.","달빛 사슬":"Moonlight Chain","적 {0}명에게 튀며 각 {1}%, 체력 {2}% 회복":"Bounces to {0} enemies for {1}% each, restoring {2}% HP","달빛이 고리처럼 이어져 어둠 속 요괴를 하나씩 엮었다.":"Moonlight linked like rings and bound the yokai of the dark, one by one.","낙뢰비":"Thunderfall","가리킨 곳 주변에 {0}번 떨어지며 각 {1}%":"Strikes {0} times around the target spot for {1}% each","먹구름이 울면 하늘이 벼락을 쏟아 마을을 쓸었다지":"When the black clouds wailed, the sky poured out lightning and swept the village.","혼불 맴돌이":"Soulfire Orbit","{0}초 동안 혼불 {1}개가 돌며 각 {2}%":"For {0}s, {1} Soulfires orbit you for {2}% each","혼불 네 개가 무당 곁을 맴돌며 밤새 지켰다 하지.":"Four Soulfires circled the shaman and kept watch through the night, they say.","먹빛 줄기":"Ink Streak","곧게 뻗는 먹빛 줄기 {0}%":"A straight streak of ink for {0}%","붓끝에서 먹 한 획 그으니 어둠이 칼날처럼 곧게 뻗었다.":"One stroke of ink from the brush tip, and the darkness stretched straight as a blade.","물귀신 사슬":"Water Ghost Chain","깊은 소의 물귀신은 사슬처럼 발목을 휘감아 끌어당긴다지.":"The water ghost of the deep pool coils round ankles like a chain and drags them down, they say.","땅울음":"Earthcry","주변 {0}% 폭발 · 기절":"Explodes nearby for {0}% · Stun","땅속에 잠자던 지신이 깨어나 발을 구르면 산도 휘청였다지.":"When the earth spirit sleeping underground awoke and stamped its foot, even the mountains swayed.","물귀신 늪":"Water Ghost Mire","가리킨 곳에 {0}초간 물늪이 고임 (초당 {1}%)":"Creates a watery mire at the target spot for {0}s ({1}% per sec)","비 온 뒤 생긴 웅덩이마다 물귀신이 손을 뻗고 기다린다지.":"In every puddle left after the rain, a water ghost waits with outstretched hand.","돌도깨비":"Stone Dokkaebi","바위 도깨비 다섯이 주인을 둘러싸고 덩실덩실 돌았다지.":"Five rock dokkaebi, they say, danced merrily in a ring around their master.","용왕 물구슬":"Dragon King's Water Orb","탄 {0}발 각 {1}% · 느려짐·밀쳐냄":"{0} orbs for {1}% each · Slow · Knockback","용왕이 뱉은 물구슬은 바위도 뚫고 적을 밀어낸다지":"The water orbs spat by the Dragon King pierce even rock and push foes away.","벼린 달결계":"Honed Moon Ward","내 자리에 결계 (안에서 피해 -{0}%, 적 초당 {1}%), 체력 {2}% 회복":"Ward at your spot (damage taken -{0}% inside, enemies take {1}% per sec), restores {2}% HP","달빛으로 친 금줄 안에선 귀신도 힘을 쓰지 못했다지.":"Within the sacred rope woven of moonlight, even ghosts could not use their power.","비수 소나기":"Dagger Downpour","처마 끝 빗방울이 칼날처럼 벼려져 내린다는 소나기 괴담이다.":"A tale of a downpour in which raindrops from the eaves are honed into blades as they fall.","혼불밭":"Soulfire Field","가리킨 곳에 {0}초간 혼불이 서린 자리를 만든다 (초당 {1}%)":"Creates a Soulfire-haunted patch at the target spot for {0}s ({1}% per sec)","혼불이 모여 밭을 이루면 산 것은 발을 디디지 못한다.":"When Soulfires gather into a field, no living thing can set foot there.","급류 돌격":"Torrent Charge","돌진 {0}% + 끝에 {1}% 폭발 · 느려짐·밀쳐냄":"Charge for {0}% + {1}% explosion at the end · Slow · Knockback","장마철 여울물이 불어나듯 거침없이 몰아쳤다고 전한다.":"It is told that it rushed on unchecked, like rapids swelling in the monsoon.","벼린 혼달음":"Honed Soul Dash","돌진 {0}% + 끝에 {1}% 폭발 · 받는 피해 +{2}% 표식":"Charge for {0}% + {1}% explosion at the end · Mark: damage taken +{2}%","벼린 혼불이 적을 스치면 그 이름에 저승 낙인이 찍혔다.":"When a honed Soulfire grazed a foe, the brand of the underworld was seared upon its name.","벼린 달무리":"Honed Moon Halo","{0}초 동안 {1}개가 돌며 각 {2}%, 체력 {3}% 회복":"For {0}s, {1} orbs circle you for {2}% each, restoring {3}% HP","벼린 달무리 네 줄기가 밤새 주인 곁을 돌며 지켰다.":"Four rays of the honed moon halo circled their master and guarded them all night.","용왕의 가호":"Dragon King's Grace","용왕이 내린 물 한 모금에 지친 몸이 다시 일어난다지":"One sip of water granted by the Dragon King, and the weary body rises once more.","혼불 작렬":"Soulfire Burst","주변 {0}% 폭발 · 받는 피해 +{1}% 표식":"Explodes nearby for {0}% · Mark: damage taken +{1}%","터져 나온 혼불이 닿으면 낙인처럼 약한 곳이 드러난다지.":"Where the bursting Soulfire touches, weak spots are revealed like a brand.","산신 사슬":"Mountain Spirit Chain","산신이 땅의 맥을 사슬 삼아 뭇 놈을 줄줄이 엮었다지.":"The Mountain Spirit took the veins of the earth for chains and bound the whole lot in a row.","흙먼지 터":"Dust Ground","가리킨 곳에 {0}초간 흙먼지가 인다 (초당 {1}%)":"Dust rises at the target spot for {0}s ({1}% per sec)","누런 흙먼지가 자욱한 곳엔 발 디딘 요괴가 오래 못 버텼다.":"No yokai that set foot in the thick yellow dust lasted long.","지맥 관통":"Earthvein Pierce","일직선으로 쏘는 땅기운 줄기 {0}%":"A straight beam of earth energy for {0}%","산맥의 뼈대를 타고 솟은 기운이 한 줄로 땅을 갈랐다지.":"Energy rising along the bones of the mountain range split the earth in a single line.","바위치기":"Rock Smash","돌진 {0}% + 끝에 {1}% 폭발 · 기절":"Charge {0}% + {1}% blast at the end · Stun","산신의 바위가 굴러 내려 길 위의 것을 모조리 짓눌렀다지.":"They say the Mountain God's boulder rolled down and crushed everything on the road.","지신 가호":"Earth Spirit's Favor","산신령께 막걸리 올리니 땅이 든든히 받쳐 주었다.":"An offering of makgeolli to the mountain spirit, and the earth held firm beneath their feet.","수막진":"Water Veil Ward","물장막이 둘러서면 날 선 것도 무디어진다고 전해진다.":"It is told that when the water veil rises, even the sharpest blade grows dull.","혼불 줄기":"Soulfire Stream","곧게 뻗는 혼불 줄기 {0}%":"Straight Soulfire stream {0}%","저승길 밝히던 혼불이 한 줄로 모여 적을 꿰뚫었다.":"The Soulfire that lit the road to the underworld gathered into one line and pierced the foe.","가리킨 곳 주변에 {0}번 떨어지며 각 {1}% + 마지막 대폭발 {2}%":"Falls {0} times around the target, {1}% each + final massive explosion {2}%","개벽의 밤, 하늘이 찢겨 불별이 쏟아졌다 전한다":"They say on the night of the world's dawning, the sky tore open and stars of fire poured down.","뇌신의 사슬":"Thunder God's Chain","적 {0}명에게 튀며 각 {1}% + 벼락 {2}번":"Chains to {0} enemies, {1}% each + {2} lightning strikes","뇌신이 사슬을 휘두르니 번개가 줄줄이 적을 꿰었다":"The Thunder God swung his chain, and lightning pierced the foes one after another.","봉황의 가호":"Phoenix's Blessing","{0}초 동안 공격력 +{1}%·공격 속도 +{2}%, 체력 {3}% 회복 + {4}초 무적":"For {0}s: ATK +{1}%, Attack Speed +{2}%, restore {3}% HP + {4}s invincibility","재가 된 봉황이 불꽃으로 되살아나 곁을 지킨다지":"They say the phoenix, turned to ash, was reborn in flame and stands guard at your side.","그림자 탈":"Shadow Mask","순간이동하며 그림자 고리 {0}번 (각 {1}%) → 그림자 분신 {2}명 {3}초 → {4}초 무적":"Teleport with {0} shadow rings ({1}% each) → {2} shadow clones for {3}s → {4}s invincibility","그림자 우두머리가 벗어 둔 가면엔 아직 어둠이 살아 있다지":"They say the mask shed by the shadow chieftain still holds living darkness.","화귀의 사슬":"Fire Ghost's Chain","불꽃 돌진 {0}연속 (각 {1}%) → {2}초 동안 몸에 불길 (초당 {3}%) + 공격력 +{4}%":"{0} flame charges in a row ({1}% each) → body ablaze for {2}s ({3}% per sec) + ATK +{4}%","불꽃 귀신이 끌던 사슬엔 꺼지지 않는 원한이 타오른다":"An unquenchable grudge still burns in the chain the fire ghost dragged.","서리장군 창":"Frost General's Spear","십자 얼음창 {0}방향 (각 {1}%) → 방 넓게 {2}초 얼림":"Cross ice spears in {0} directions ({1}% each) → freezes a wide area of the room for {2}s","서리 장군이 창을 꽂은 자리마다 겨울이 따라온다지":"They say winter follows wherever the Frost General plants his spear.","독주머니":"Venom Sac","가리킨 곳으로 뛰어올라 착지 {0}% → 독 늪 {1}초 (초당 {2}%, 크게 느려짐) + 흡혈 {3}%":"Leap to the target, landing {0}% → poison swamp for {1}s ({2}% per sec, heavy slow) + {3}% lifesteal","두꺼비 왕이 독주머니를 터뜨리면 늪이 되어 번진다지":"They say when the Toad King bursts his venom sac, it spreads into a swamp.","염라의 낫":"Yeomra's Scythe","혼령 탄 소용돌이 ({0}발 각 {1}%) → 가리킨 곳에 저승문 {2}초 (초당 {3}%, 체력 {4}% 이하 {5}% 확률 즉사)":"Spirit vortex ({0} shots, {1}% each) → underworld gate at the target for {2}s ({3}% per sec, {5}% chance of instant kill at {4}% HP or below)","염라가 낫을 한번 휘두르면 저승문이 활짝 열린다지":"They say with a single swing of Yeomra's scythe, the gates of the underworld swing wide.","수문장 돌":"Gatekeeper's Stone","받는 피해 -{0}% {1}초 + 퍼지는 지진 고리 {2}번 (각 {3}%, 기절) + 돌기둥 낙하 {4}번":"Damage taken -{0}% for {1}s + {2} spreading quake rings ({3}% each, Stun) + {4} falling stone pillars","수문장은 돌로 빚어져 끝내 버티면 산도 물러선다지":"They say the gatekeeper is carved of stone, and if he holds out, even mountains yield.","돌팔매":"Stone Throw","돌을 던져 {0}% 피해":"Throw a stone for {0}% damage","아이도 쥐는 돌 한 알이 도깨비 이마를 깬다지":"They say even a child's pebble can crack a dokkaebi's brow.","짧은 베기":"Short Slash","앞쪽 {0}% 피해":"{0}% damage ahead","주막 칼잡이가 숨 한 번 쉴 새에 긋는 짧은 칼질이라":"A short cut the tavern swordsman makes in the space of a single breath.","독침":"Poison Needle","독침 {0}% + {1}초 중독":"Poison needle {0}% + poison for {1}s","보부상 짐 속 독침 하나면 호랑이도 비틀댄다지":"They say a single poison needle from a peddler's pack can stagger even a tiger.","회전 베기":"Spin Slash","주변 {0}% 피해":"{0}% damage around you","몸을 팽이처럼 돌리면 사방의 잡귀가 물러난다지":"They say when you spin like a top, the lesser spirits on all sides fall back.","연발 화살":"Rapid Arrows","화살 {0}발 각 {1}%":"{0} arrows, {1}% each","포수의 활시위가 울리면 화살이 줄지어 날아간다지":"They say when the hunter's bowstring sings, arrows fly out in a line.","불덩이":"Fireball","부딪히면 폭발 {0}%":"Explodes on impact {0}%","도깨비불을 둥글게 뭉쳐 던지면 닿는 곳에서 터진다지":"They say a dokkaebi fire rolled into a ball bursts wherever it lands.","번개 사슬":"Chain Lightning","번개가 {0}명에게 튀며 각 {1}%":"Lightning jumps to {0} enemies, {1}% each","번개가 이 사람 저 사람 건너뛰며 죄를 묻는다지":"They say the lightning leaps from one to the next, demanding an answer for their sins.","천둥 일섬":"Thunder Flash","직선 광선 {0}% + 기절":"Straight beam {0}% + Stun","천둥이 울리자 하늘에서 한 줄기 빛이 내리꽂혔다":"Thunder rumbled, and a single shaft of light struck down from the heavens.","발 구르기":"Stomp Dash","가리킨 곳 쪽으로 짧게 돌진":"Dash a short distance toward the target","발을 쾅 구르면 땅이 튕겨 몸이 앞으로 나간다지":"They say a mighty stomp makes the earth spring you forward.","빠른 걸음":"Swift Stride","{0}초 동안 이동 +{1}%":"Move speed +{1}% for {0}s","축지법을 익히기 전, 나그네가 먼저 배우는 걸음이라":"The first pace a wanderer learns before mastering the art of shrinking the earth.","그림자 걸음":"Shadow Step","가리킨 곳으로 순간이동":"Teleport to the target","달빛 아래 제 그림자를 밟고 건너가는 요괴의 걸음이라":"The stride of a yokai who crosses the night by stepping on its own shadow beneath the moon.","돌진 베기":"Charging Slash","돌진하며 {0}% 피해":"Dash forward, dealing {0}% damage","칼을 앞세워 몸째 부딪치는 무사의 막무가내 칼질이라":"A reckless warrior's blow, blade first and body right behind it.","축지 폭발":"Earthshrink Blast","순간이동 후 착지 {0}%":"{0}% damage on landing after teleport","축지로 사라졌다 내려앉는 자리마다 땅이 터진다지":"They say the ground bursts wherever one lands after vanishing in a shrunken stride.","바람 장막":"Wind Veil","{0}초 동안 이동 +{1}%, 받는 피해 -{2}%":"Move speed +{1}%, damage taken -{2}% for {0}s","바람이 몸을 두르면 칼도 화살도 스치고 지나간다지":"They say when the wind wraps your body, blades and arrows merely graze past.","번개 이동":"Lightning Rush","번개처럼 돌진 {0}%, 무적":"Dash like lightning, dealing {0}% damage; invulnerable","번개가 되어 내달리는 동안엔 저승사자도 못 잡는다지":"Even the jeoseung saja cannot catch you while you race as lightning.","축지법":"Shrinking the Earth","순간이동하며 주변 적을 {0}초 동안 멈추고, {1}초 동안 무적":"Teleport, freezing nearby enemies for {0}s; invulnerable for {1}s","도사가 한 걸음에 천 리를 접었다는 축지의 비법이라 전한다.":"It is told to be the Taoist sage's secret art of folding a thousand li into a single step.","쑥뜸 손길":"Mugwort Touch","주막 할멈이 쑥을 찧어 상처에 붙여 주던 손길이지.":"The touch of the old Tavern granny, pressing pounded mugwort onto your wounds.","널판 방패":"Plank Shield","체력 {0}%만큼 보호막":"Shield equal to {0}% of HP","뱃사공이 부서진 널빤지 하나로 파도를 버텼다는 이야기지.":"The tale of a boatman who weathered the waves on one broken plank.","서리 고리":"Frost Ring","주변 적을 {0}초 동안 얼리고 {1}% 피해":"Freeze nearby enemies for {0}s and deal {1}% damage","한겨울 서리 귀신이 숨을 불면 마을 우물도 얼어붙었다지.":"When the midwinter frost ghost exhaled, even the village well froze over.","가시 덩굴":"Thorn Vines","가리킨 곳에 {0}초 동안 덩굴이 돋아 적을 느리게 하고 초당 {1}% 피해":"Vines sprout at the target for {0}s, slowing enemies and dealing {1}% damage per second","무덤가 가시덩굴은 지나는 발목을 놓아주지 않는다 했다.":"They say thorn vines by the graves never let go of a passing ankle.","약수터":"Healing Spring","{0}초 동안 초당 체력 {1}% 회복":"Restore {1}% HP per second for {0}s","깊은 산골 약수터에서는 지친 나그네도 기운을 얻었다지.":"At a healing spring deep in the mountains, even the weariest wanderer regains strength.","철벽":"Iron Wall","{0}초 동안 받는 피해 -{1}%":"Damage taken -{1}% for {0}s","장승처럼 꿈쩍 않고 버티면 어떤 칼날도 무뎌진다 하였다.":"Stand unmoving as a jangseung, and any blade, they said, will dull.","오색 금줄":"Five-Color Rope","{0}초 동안 결계를 펼침 (안에서 받는 피해 -{1}%, 적에게 초당 {2}% 피해)":"Cast a barrier for {0}s (damage taken inside -{1}%, enemies take {2}% damage per second)","무당이 오색 끈으로 둘러친 자리엔 잡귀가 들지 못했다.":"No lesser spirit could enter the ground the shaman ringed with five-colored cord.","불사의 맹세":"Oath of Immortality","{0}초 동안 무적 + 체력 {1}% 회복":"Invulnerable for {0}s + restore {1}% HP","저승사자 앞에서 목숨 걸고 맺은 맹세는 명부도 지운다지.":"They say an oath sworn with your life before the jeoseung saja can erase a name from the ledger of the dead.","벽력탄":"Thunderbolt Bomb","주변에 {0}% 피해를 주는 폭발":"Explosion dealing {0}% damage to nearby enemies","묵은 화약 독이 터지자 팔도가 한밤에도 환했다고 한다.":"When the old powder jar burst, they say all eight provinces glowed bright at midnight.","원혼 부르기":"Summon Vengeful Spirits","원혼 {0}마리를 {1}초 동안 부림":"Command {0} vengeful spirits for {1}s","억울히 죽은 넋들이 주인의 부름에 개처럼 달려 나온다.":"Souls who died with grievance rush out like hounds at their master's call.","가리킨 곳 주변에 별똥별 {0}개가 떨어져 각 {1}% 피해":"{0} shooting stars fall around the target, each dealing {1}% damage","밤하늘의 별이 쏟아진 날, 고을마다 불기둥이 솟았다지.":"The night the stars rained down, pillars of fire rose in every village.","화살 소나기":"Arrow Shower","가리킨 곳에 {0}초 동안 화살 폭풍 (초당 {1}% 피해)":"Arrow storm at the target for {0}s ({1}% damage per second)","활 잘 쏘던 장수의 원한이 바람 속에서 화살로 돈다지.":"They say the grudge of a master-archer general still circles in the wind as arrows.","용화":"Dragon Fire","길게 뻗는 불길로 {0}% 피해":"Long stream of flame dealing {0}% damage","승천 못 한 이무기가 토해 낸 불길이 산을 태웠다 한다.":"They say the flames spat out by an imugi that never ascended burned the mountain.","백골 행렬":"Procession of Bones","해골 병사 {0}명을 {1}초 동안 부림":"Command {0} skeleton soldiers for {1}s","달 없는 밤이면 백골들이 줄지어 고갯길을 넘는다지.":"On moonless nights, they say, the white bones cross the mountain pass in file.","뇌신 강림":"Thunder God's Descent","적에게 벼락 {0}번, 각 {1}% 피해":"Lightning strikes enemies {0} times, {1}% damage each","뇌공이 북을 치면 하늘이 갈라지고 악귀가 떨었다 하더라.":"When the Thunder Lord beat his drums, the heavens split and evil spirits trembled.","천지개벽":"Cleaving of Heaven and Earth","방 전체에 {0}% 피해 + {1}초 기절":"{0}% damage to the whole room + {1}s stun","하늘과 땅이 다시 갈라지던 날의 태초 이야기라 전한다.":"A tale from the dawn of time, they say, of the day heaven and earth parted anew.","삼단 베기":"Triple Slash","앞쪽을 세 번 베어 각 {0}%":"Slash ahead 3 times, {0}% each","일도양단":"One-Stroke Split","거대한 검기 {0}% (모든 적 꿰뚫음)":"Giant sword wave {0}% (pierces all enemies)","연환 구르기":"Rolling Volley","구르며 화살 {0}발 (각 {1}%)":"Dodge roll and fire {0} arrows ({1}% each)","만궁 난사":"Full-Draw Barrage","{0}초 동안 화살 {1}발이 사방으로 (각 {2}%, 따라감)":"For {0}s, fire {1} arrows in all directions ({2}% each, homing)","창벽":"Spear Wall","{0}초 동안 받는 피해 -{1}%, 반사 {2}%":"For {0}s, damage taken -{1}%, reflect {2}%","용아창":"Dragon Fang Spear","세 번 찌르는 긴 창격 각 {0}%":"Long spear thrusts 3 times, {0}% each","섬전보":"Lightning Step","번개처럼 두 번 돌진 (각 {0}%)":"Dash twice like lightning ({0}% each)","천수관음장":"Thousand-Hand Palm","{0}초 동안 주변을 {1}번 각 {2}%":"For {0}s, strike surroundings {1} times, {2}% each","연막탄":"Smoke Bomb","자리에 연막 {0}초 (적 느려짐, 안에서 피해 -{1}%)":"Smoke cloud for {0}s (enemies slowed, damage taken inside -{1}%)","관통탄":"Piercing Shot","모두 꿰뚫는 탄 {0}%":"Shot piercing all enemies {0}%","오색 방울":"Five-Color Bells","따라가는 방울 {0}개 각 {1}%":"{0} homing bells, {1}% each","천신 강림":"Heavenly Descent","{0}초 동안 받는 피해 -{1}%, 초당 체력 {2}% 회복, 주변 초당 {3}%":"For {0}s, damage taken -{1}%, recover {2}% HP per sec, {3}% per sec to nearby enemies","뼈 감옥":"Bone Prison","커서의 적 {0}초 가둠 + {1}%":"Trap enemies at cursor for {0}s + {1}%","망령 걸음":"Wraith Step","순간이동 후 원혼 {0}마리":"Teleport, then summon {0} vengeful spirits","앞쪽 {0}%, 반드시 치명타":"{0}% ahead, always a critical hit","천살":"Heaven's Slaughter","모든 적에게 차례로 날아가 각 {0}%":"Fly to every enemy in turn, {0}% each","부적 결계":"Talisman Ward","보호막 {0}% + {1}초 동안 피해 -{2}%":"Shield {0}% + damage taken -{2}% for {1}s","삼매진화":"Samadhi Fire","따라가는 화염 부적 {0}장 각 {1}% 폭발":"{0} homing flame talismans, {1}% explosion each","음양 바꾸기":"Yin-Yang Swap","순간이동, 떠난 자리·도착 자리 {0}% 폭발":"Teleport; explodes for {0}% at both departure and arrival points","팔괘진":"Eight Trigrams Formation","{0}초 동안 구슬 {1}개가 돌며 각 {2}%":"For {0}s, {1} orbs circle you, {2}% each","영혼 늑대":"Spirit Wolves","영혼 늑대 {0}마리 {1}초":"{0} spirit wolves for {1}s","황룡 소환":"Summon Yellow Dragon","황룡을 {0}초 동안 부름 (매우 강함)":"Call the Yellow Dragon for {0}s (very strong)","피의 함성":"Blood Cry","주변 적 {0}초 기절, {1}초 동안 공격력 +{2}%":"Stun nearby enemies for {0}s, ATK +{2}% for {1}s","대지 가르기":"Earthsplitter","땅을 갈라 직선 {0}%":"Split the ground in a line, {0}%","달그림자":"Moon Shadow","{0}초 무적, 끝나면 주변 {1}%":"Invincible for {0}s, then {1}% to nearby enemies","삼월참":"Three Moons Slash","초승달 검기 {0}개 각 {1}%":"{0} crescent sword waves, {1}% each","뇌광 돌격":"Thunder Charge","번개 돌진 {0}% + 끝에 벼락":"Lightning dash {0}% + lightning strike at the end","피뢰침":"Lightning Rod","커서에 {0}초 피뢰침 (초당 {1}% 감전)":"Lightning rod at cursor for {0}s ({1}% shock per sec)","여우 둔갑":"Fox Guise","{0}초 동안 이동 +{1}%, 은신":"Move speed +{1}% and stealth for {0}s","구미호 본색":"Gumiho's True Form","{0}초 동안 공격력 +{1}%, 여우불 {2}개 회전":"ATK +{1}% for {0}s, {2} fox fires orbit you","저승 걸음":"Netherworld Stride","돌진하며 지나간 적 {0}%, 무적":"Dash through enemies for {0}% damage, invincible","명부 낙인":"Brand of the Ledger","주변 적 {0}초 느려짐 + {1}초 동안 받는 피해 +{2}%":"Nearby enemies slowed for {0}s + take {2}% more damage for {1}s","약초 한 줌":"Handful of Herbs","보부상 짐 속 약초 한 줌이 열 의원보다 낫다 했지.":"They say a handful of herbs from a peddler's pack beats ten physicians.","날쌘 영약":"Swift Elixir","이번 원정 동안 공격 속도 +{0}%":"Attack speed +{0}% for this expedition","산삼 달인 물을 마시면 몸이 바람처럼 가벼워진다지.":"Drink a wild ginseng decoction, and your body turns light as the wind.","괴력 부적":"Talisman of Might","이번 원정 동안 공격력 +{0}%":"ATK +{0}% for this expedition","무당이 붉은 먹으로 그린 부적엔 장사의 힘이 깃든다.":"A talisman drawn by a shaman in red ink holds a strongman's might.","대장장이가 도깨비불로 벼려 낸 갑옷은 칼도 튕겨 냈다.":"Armor forged by a blacksmith in dokkaebi fire turned even blades aside.","매의 깃":"Hawk Feather","이번 원정 동안 치명타 +{0}%":"Critical hit +{0}% for this expedition","천 리 밖 쥐 한 마리도 놓치지 않던 매의 깃이라 한다.":"Said to be the feather of a hawk that never missed a mouse a thousand li away.","도깨비가 신고 달리면 발자국이 바람에 지워졌다지.":"When a dokkaebi ran in them, his footprints were erased by the wind.","보부상이 복을 점치라며 슬쩍 쥐여 주는 뽑기 패다.":"A summon token the peddler slips into your hand, telling you to try your luck.","한 판 레벨 {0}":"Run Level {0}","무한의 방 {0}번째 방":"Endless Rooms: Room {0}","{0}대{1} 대전 {2}승":"{0}v{1} Duel: {2} wins","뽑기 {0}번":"Summon {0} times","영웅 {0}명":"{0} heroes","정예 요괴 {0}마리":"{0} elite yokai","스킬 {0}번 사용":"Use skills {0} times","멀티 {0}번":"Multiplayer {0} times","맞지 않고 스테이지 끝내기":"Clear a Stage without being hit","체력 {0}% 이하로 보스 처치":"Defeat a boss at {0}% HP or less","{0}초 안에 방 정리 {1}번":"Clear a room within {0}s, {1} times","체력 {0}% 이상으로 보스 {1}번":"Defeat a boss with {0}%+ HP, {1} times","스토리 완료":"Complete the story","{0}번 쓰러지기":"Fall {0} times","스토리 시작":"Begin the story","{0}층 최종보스":"Floor {0} final boss","스토리 중간보스 {0}마리":"Defeat {0} story mid-bosses","스토리 {0}층 도달":"Reach Floor {0} in the story","스토리 {0}번 완료":"Complete the story {0} times","삽살이":"Sapsali","{0}초마다 적을 물어뜯음 (공격력 {1}%)":"Bites an enemy every {0}s ({1}% ATK)","삽살개는 귀신을 쫓는다 하여 집집마다 마당을 지켰다.":"Sapsal hounds were said to drive off ghosts, and guarded the yard of every home.","고양이 나비":"Nabi the Cat","엽전 획득 +{0}%, 가끔 엽전을 물어옴":"Coin gain +{0}%, sometimes fetches coins","주막 고양이 나비는 엽전 냄새를 기가 막히게 맡는다지.":"Nabi, the tavern cat, has a marvelous nose for brass coins.","까치":"Magpie","{0}초마다 깃털을 날림 (공격력 {1}%)":"Flings feathers every {0}s ({1}% ATK)","아침 까치가 울면 반가운 손님이 온다는 말이 있지.":"They say when a magpie calls at dawn, a welcome guest is on the way.","돌거북":"Stone Turtle","받는 피해 -{0}%, {1}초마다 보호막 {2}%":"Damage taken -{0}%, shield {2}% every {1}s","산처럼 느리고 바위처럼 단단한 거북이 길손을 지킨다지.":"Slow as a mountain and hard as rock, the turtle guards the weary traveler.","아기 도깨비":"Baby Dokkaebi","{0}초마다 방망이로 내리쳐 폭발 ({1}%), 엽전 획득 +{2}%":"Slams its club every {0}s for an explosion ({1}%), coin gain +{2}%","꼬마 도깨비가 방망이를 휘두르면 금은이 쏟아진다더라.":"They say when a little dokkaebi swings his club, gold and silver come pouring out.","아기 여우":"Baby Fox","{0}초마다 적을 따라가는 여우불을 날림 ({1}%)":"Every {0}s, launches homing foxfire ({1}%)","구미호가 되기 전 아기 여우도 여우불은 제법 다룬다지.":"Even before becoming a gumiho, a fox cub is said to handle foxfire quite well.","아기 이무기":"Baby Imugi","{0}초마다 여의주 빛을 쏨 ({1}%), 공격력 +{2}%":"Every {0}s, fires a beam of orb light ({1}%). ATK +{2}%","용이 되지 못한 이무기도 여의주 빛 한 줄기는 품었다.":"Even an imugi that never became a dragon kept a single ray of the wish-orb's light.","아기 해태":"Baby Haetae","{0}초마다 보호막 {1}%, 공격력 +{2}%":"Every {0}s, shield {1}%. ATK +{2}%","해태는 시비를 가리고 화재를 막는 영물이라 전해진다.":"The haetae is said to be a sacred beast that judges right from wrong and wards off fire.","아기 봉황":"Baby Phoenix","{0}초마다 체력 {1}% 회복":"Every {0}s, restores {1}% HP","봉황 알에서 갓 나온 병아리의 날갯짓에도 온기가 돈다.":"Even the flutter of a chick fresh from a phoenix egg carries a gentle warmth.","아기 기린":"Baby Qilin","{0}초마다 체력 {1}% 회복 + 보호막 {2}%":"Every {0}s, restores {1}% HP + shield {2}%","기린이 지나간 풀은 밟히지 않고 상처도 아문다고 하지.":"They say the grass a qilin passes is never trampled, and wounds close in its wake.","아기 불가사리":"Baby Bulgasari","받는 피해 -{0}%, {1}초마다 땅을 내려침 ({2}%)":"Damage taken -{0}%. Every {1}s, slams the ground ({2}%)","쇠를 먹고 자란 불가사리는 땅을 내려치면 산이 울린다지.":"Raised on iron, a bulgasari is said to make the mountains ring when it strikes the earth.","아기 삼족오":"Baby Samjogo","{0}초마다 태양 깃털을 날려 {1}% 피해, 적을 꿰뚫음. 치명타 +{2}%":"Every {0}s, hurls a sun feather for {1}% damage, piercing enemies. Critical hit +{2}%","해 속에 산다는 세 발 까마귀의 아직 솜털 가시지 않은 새끼라지.":"A fledgling of the three-legged crow that lives in the sun, still clad in down.","아기 도깨비 왕":"Baby Dokkaebi King","공격력 +{0}%. {1}초마다 방망이를 내려쳐 주변 적에게 {2}% 피해, 기절":"ATK +{0}%. Every {1}s, smashes a club down, dealing {2}% damage to nearby enemies and stunning them","층 보스 {0}번 처치":"Defeat Floor bosses {0} times","방망이 하나로 팔도 도깨비를 호령하던 왕의 철없는 막내라지.":"The carefree youngest child of the king who ruled every dokkaebi in the land with a single club.","아기 용마":"Baby Dragon Horse","이동 속도 +{0}%. {1}초마다 번개 사슬이 {2}명에게 {3}% 피해":"Move speed +{0}%. Every {1}s, chain lightning hits {2} enemies for {3}% damage","용이 되다 만 말이 한밤 냇가에서 번개를 먹고 자랐다지.":"A horse that almost became a dragon, raised on lightning by a midnight stream.","아기 백호":"Baby White Tiger","{0}초마다 할퀴어 공격력의 {1}% 피해":"Every {0}s, claws for {1}% of ATK as damage","산신령이 타고 다닌다던 백호가 낳은 막내 새끼라지.":"The youngest cub of the white tiger the Mountain Spirit is said to ride.","다람쥐":"Squirrel","엽전 +{0}%, 가끔 엽전을 물어옴":"Coins +{0}%. Occasionally fetches coins","도토리 대신 엽전을 볼주머니에 숨겨 두는 영악한 놈이지.":"A cunning little rascal who stuffs his cheeks with coins instead of acorns.","부엉이":"Owl","{0}초마다 깃털을 날려 공격력의 {1}% 피해":"Every {0}s, hurls a feather for {1}% of ATK as damage","방 {0}개":"Clear {0} rooms","밤이면 고목 위에서 저승길 지나는 이를 지켜본다는 새라지.":"A bird said to watch from an old tree at night as travelers pass along the road to the underworld.","두더지":"Mole","엽전 +{0}%":"Coins +{0}%","땅속 깊이 묻힌 엽전 냄새를 용케도 맡아 파낸다지.":"Somehow it sniffs out coins buried deep underground and digs them up.","반딧불이":"Firefly","밝기 +{0}%. {1}초마다 빛을 쏘아 {2}% 피해":"Brightness +{0}%. Every {1}s, fires light for {2}% damage","무덤가 혼불인 줄 놀라지 마라, 길 밝히는 작은 등불이지.":"Don't be startled, thinking it a Soulfire by the graves. It's just a little lantern lighting your way.","거위":"Goose","{0}초마다 쪼아서 공격력의 {1}% 피해":"Every {0}s, pecks for {1}% of ATK as damage","서낭당 앞을 지키며 낯선 이를 먼저 알아본다는 거위라지.":"A goose said to guard the front of the Seonang Shrine and spot strangers first.","옥토끼":"Jade Rabbit","달 속에서 떡방아 찧다 내려온 하얀 토끼라 전해진다.":"They say this white rabbit came down from the moon, where it pounded rice cakes.","너구리":"Raccoon Dog","떨어지는 엽전 +{0}%":"Dropped coins +{0}%","보부상 짐 사이를 드나들며 엽전 냄새를 따라다니는 놈이지.":"A rascal that slips in and out of the Peddler's packs, following the scent of coins.","수달":"Otter","{0}초마다 조약돌을 던져 공격력의 {1}% 피해":"Every {0}s, throws a pebble for {1}% of ATK as damage","개울가 조약돌을 모아 두었다 요괴에게 던지는 재간둥이라지.":"A clever little thing that gathers pebbles by the brook and hurls them at yokai.","참새":"Sparrow","처마 밑 참새가 곁에서 짹짹이면 아픈 몸도 절로 가벼워진다지.":"They say when a sparrow chirps beside you under the eaves, an aching body grows light on its own.","아기 반달곰":"Baby Moon Bear","{0}초마다 땅을 내려쳐 {1}% 피해":"Every {0}s, slams the ground for {1}% damage","단군 어머니의 먼 후손이라 땅을 치는 힘이 남다르다지.":"A distant descendant of Dangun's mother, they say, with an uncommon power to strike the earth.","송골매":"Gyrfalcon","{0}초마다 급강하해 공격력의 {1}% 피해":"Dives every {0}s for {1}% of ATK as damage","정예 {0}마리":"{0} elites","임금께 바치던 매의 핏줄이라 한번 노린 것은 놓치지 않지.":"Of the blood of hawks offered to the king, it never loses what it has set its eyes on.","꽃사슴":"Spotted Deer","십장생의 하나로 걷는 곳마다 풀이 돋는다고 전해진다.":"One of the Ten Symbols of Longevity; grass is said to sprout wherever it walks.","아기 멧돼지":"Baby Boar","{0}초마다 들이받아 {1}% 피해":"Rams every {0}s for {1}% damage","산신 심부름을 가다 길을 잃고 요괴 소굴로 든 새끼지.":"A piglet sent on an errand for the Mountain Spirit, who lost its way and wandered into a yokai den.","아기 박쥐":"Baby Bat","흡혈 {0}%. {1}초마다 물어서 {2}% 피해":"Lifesteal {0}%. Bites every {1}s for {2}% damage","복을 부른다 해도 밤에 우는 소리는 영 섬뜩하다지.":"Though said to bring fortune, its cry in the night is downright chilling.","원숭이":"Monkey","{0}초마다 열매를 던져 {1}% 피해":"Throws fruit every {0}s for {1}% damage","산중 주막 뒤뜰 감나무에서 열매를 훔쳐 던지던 개구쟁이라지.":"A rascal who stole persimmons from the tree in a mountain tavern's back yard and pelted folk with them.","{0}초마다 불꽃을 쏘아 {1}% 피해, 불태움":"Fires a flame every {0}s for {1}% damage, burns","꼬리 아홉 달리기 전부터 불씨를 품고 태어난 여우라지.":"A fox born with an ember in its heart, long before it grew nine tails.","서리동자":"Frost Boy","{0}초마다 주변 적을 {1}초 동안 얼림":"Freezes nearby enemies for {1}s every {0}s","삼동 눈보라 속에서 태어나 입김만으로 개울을 얼린다지.":"Born in the blizzards of deep winter, it can freeze a stream with its breath alone.","벼락새":"Thunderbird","{0}초마다 번개 사슬이 {1}명에게 {2}% 피해":"Every {0}s, chain lightning hits {1} enemies for {2}% damage","먹구름 속에서 울다가 벼락을 타고 내려온다는 새라지.":"A bird that cries within the storm clouds and descends riding the lightning.","먹괭이":"Ink Cat","치명타 +{0}%, 치명타 피해 +{1}%":"Critical hit +{0}%, critical damage +{1}%","체력 {0}% 이하로 보스 {1}번":"Defeat a boss {1} times at {0}% HP or less","달 없는 밤 먹물 속에서 걸어 나와 소리 없이 노린다지.":"On moonless nights it walks out of the ink and stalks in silence.","황금 두꺼비":"Golden Toad","복덩이로 불리며 집안에 들면 재물이 마르지 않는다 했지.":"Called a bundle of luck; once it enters a house, wealth never runs dry.","{0}초마다 적을 따라가는 불씨를 날려 {1}% 피해":"Launches a homing ember every {0}s for {1}% damage","도깨비가 흘리고 간 불씨가 정을 붙여 따라다니게 되었다지.":"An ember dropped by a dokkaebi grew fond of folk and began to follow them.","해골 삽살":"Skull Sapsal","{0}초마다 물어서 {1}% 피해":"Bites every {0}s for {1}% damage","저승길 어귀에서 주인을 기다리다 뼈만 남은 삽살개라지.":"A sapsal hound that waited for its master at the mouth of the road to the underworld until only bones remained.","물컹이":"Squishy","{0}초마다 보호막 {1}%":"Shield {1}% every {0}s","비 오는 날 우물가 이끼에서 스르르 솟은 말랑한 것이지.":"A soft thing that slid up from the moss by the well on a rainy day.","복박쥐":"Fortune Bat","흡혈 {0}%":"Lifesteal {0}%","복을 물어다 준다는 박쥐 중에 요술을 익힌 영물이라지.":"Among the bats said to carry fortune in their mouths, this one is a spirit beast that learned sorcery.","돌장승":"Stone Jangseung","고갯마루 돌무더기에 깃들어 길손을 지키는 돌의 넋이지.":"A stone spirit dwelling in the cairn at the mountain pass, guarding travelers.","반디":"Firefly","반디 한 마리가 쓰러진 길손의 앞길을 밝혀 주었다 전한다.":"It is told that a single firefly lit the way ahead for a fallen traveler.","할멈의 고양이":"Granny's Cat","할멈 무릎에서 졸던 고양이는 저승길도 제집 마당처럼 드나들었다더라":"The cat that dozed on Granny's lap came and went on the road to the underworld as if it were her own yard.","서리 여우":"Frost Fox","{0}초마다 주변 적을 얼림":"Freezes nearby enemies every {0}s","겨울 산 눈밭에 발자국 없이 나타나 입김으로 길손을 얼렸다는 여우다":"A fox that appeared on the snowfields of winter mountains without leaving a track and froze travelers with its breath.","불도롱":"Fire Newt","{0}초마다 불꽃을 쏘아 불태움 ({1}%)":"Fires a flame every {0}s, burns ({1}%)","아궁이 불씨를 삼킨 도롱뇽이 천 년을 묵어 불을 뿜게 되었다지":"A salamander that swallowed an ember from the hearth, and after a thousand years learned to breathe fire.","저승 까마귀":"Underworld Crow","{0}초마다 번개 사슬이 적 {1}명을 침 ({2}%)":"Every {0}s, chain lightning strikes {1} enemies ({2}%)","저승사자의 서찰을 물고 다니며 죽을 이의 지붕 위에서 운다는 까마귀다":"A crow that carries the reaper's letters and caws on the roof of one fated to die.","어둠 걷는 자":"Walker in Darkness","달 없는 밤에도 등불 없이 고갯길을 넘는 이가 있었다지":"There was one who crossed the mountain pass even on moonless nights, without a lantern.","운수 좋은 날":"A Lucky Day","길 가다 엽전 꾸러미를 주운 날은 주막 국밥도 거저 얻었다지":"On the day one found a string of brass coins on the road, even the tavern's gukbap came free.","도깨비 방망이에 맞고도 웃었다는 사내의 가슴은 무쇠였다지":"They say the man who laughed even when struck by a dokkaebi's club had a chest of solid iron.","번개 손":"Lightning Hand","눈 한 번 깜짝할 새 부적 열 장을 던졌다는 무당의 손이라":"The hand of a shaman said to have thrown ten talismans in the blink of an eye.","도를 깨친 자":"The Enlightened","삼 년 면벽 끝에 숨결 하나로 기운을 다스리게 된 이의 칭호다":"The title of one who, after three years facing a wall, learned to govern energy with a single breath.","매의 눈동자":"Hawk's Eye","백 걸음 밖 반딧불의 날갯짓도 놓치지 않았다는 눈이라지":"They say these eyes missed not even a firefly's wingbeat a hundred paces away.","꺼지지 않는 등불":"Undying Lantern","초당 체력 {0}% 회복, 밝기 +{1}%":"Restore {0}% HP per second, Brightness +{1}%","바람이 불고 비가 쏟아져도 끝내 꺼지지 않았다는 길잡이 등불이라":"A guiding lantern that never went out, though wind blew and rain poured down.","엽전 부자":"Coin Tycoon","엽전 +{0}%, 엽전 떨어짐 +{1}%":"Coins +{0}%, Coin Drops +{1}%","엽전 꿰미가 대들보를 휘게 했다는 소문난 보부상 부자의 이름이라":"The name of a famed rich Peddler, whose strings of coins were said to bend the rafters.","폭풍을 부르는 자":"Stormcaller","손짓 한 번에 먹구름이 몰려와 팔도가 어두워졌다고 전하는 이다":"It is told that at a single wave of this one's hand, dark clouds gathered and all eight provinces fell into shadow.","하늘이 고른 자":"Heaven's Chosen","공격력 +{0}%, 치명타 +{1}%, 치명타 피해 +{2}%":"ATK +{0}%, Critical Hit +{1}%, Critical Damage +{2}%","하늘이 점지해 태어날 때 혼불이 세 번 번쩍였다고 전하는 이라":"Chosen by Heaven, it is said that Soulfire flashed three times at this one's birth.","첫 사냥꾼":"First Hunter","요괴록에 처음으로 제 손으로 잡은 요괴를 적어 넣은 사냥꾼이라":"A hunter who first wrote in the Yogoerok a yokai caught by their own hand.","백인참":"Hundred-Slayer","요괴 백을 베고서야 칼집에 칼을 넣었다는 사냥꾼의 별칭이라":"The nickname of a hunter who sheathed their blade only after cutting down a hundred yokai.","우두머리 잡이":"Chief Slayer","보스에게 주는 피해 +{0}%":"Damage to Bosses +{0}%","고을마다 두려워하던 우두머리 요괴의 목을 거둔 이에게 붙는 말이라":"A name given to one who claimed the head of a chief yokai that every village feared.","굴속 나그네":"Cave Wanderer","이동 속도 +{0}%, 엽전 +{1}%":"Move Speed +{0}%, Coins +{1}%","굴속 깊이 들어가 길을 그려 돌아온 나그네에게 붙던 이름이라":"A name given to the wanderer who went deep into the caves and returned with a map of the way.","백전노장":"Battle-Hardened Veteran","수많은 밤을 요괴와 싸우며 흉터마다 이야기를 새긴 노장이라":"A veteran who fought yokai through countless nights, with a story carved into every scar.","끝없는 도전자":"Endless Challenger","궁극기(R) 대기 -{0}%, 공격력 +{1}%":"Ultimate (R) Cooldown -{0}%, ATK +{1}%","쓰러져도 등불 들고 다시 일어나 굴 밑바닥까지 걸어간 도전자라":"A challenger who, though felled, rose again with lantern in hand and walked to the very bottom of the cave.","결투의 달인":"Duel Master","칼끝이 닿기 전에 상대의 빈틈을 먼저 읽었다는 검객의 칭호다":"The title of a swordsman who read his foe's opening before the blade's tip ever touched.","조각 줍는 이":"Shard Gatherer","엽전 떨어짐 +{0}%":"Coin Drops +{0}%","찢겨 흩어진 요괴록 쪽을 하나둘 주워 모은 이에게 붙은 이름이라":"A name given to one who gathered, one by one, the torn and scattered pages of the Yogoerok.","신들린 제비":"Spirit-Touched Lot","제비를 뽑을 때마다 신령이 손을 잡아 이끌었다는 소문이 돌았지":"Rumor had it that every time they drew lots, a spirit guided their hand.","함께하는 등불":"Shared Lantern","혼자 든 등불은 약해도 둘이 들면 밤길이 환하다는 말이 있지":"They say a lantern held alone is faint, but when two hold it, the night road shines bright.","무결":"Flawless","맞지 않고 스테이지 {0}번":"Clear {0} Stages without being hit","싸움이 끝나도 옷깃에 흙 한 점 묻지 않았다는 사람의 칭호라":"The title of one whose collar bore not a speck of dust even after the battle was done.","벼랑 끝의 승리":"Victory at the Brink","입힌 피해의 {0}%만큼 체력 회복, 공격력 +{1}%":"Restore HP equal to {0}% of damage dealt, ATK +{1}%","숨이 넘어가던 벼랑 끝에서 적의 기운을 빼앗아 일어섰다지":"They say that at the cliff's edge, with their last breath fading, they seized the foe's energy and rose again.","질풍":"Gale","고갯마루를 바람처럼 지나가 뒤늦게 나뭇잎만 흔들렸다지":"They passed over the mountain pass like the wind, and only afterward did the leaves tremble.","불굴":"Indomitable","아홉 번 쓰러져도 아홉 번 다시 일어선 이의 굳센 뜻이라":"The unyielding will of one who fell nine times and rose nine times again.","전설의 사냥꾼":"Legendary Hunter","주막마다 그 이름을 읊으며 술잔을 올린다는 전설 속 사냥꾼이라":"A hunter of legend, whose name is spoken in every Tavern as cups are raised in toast.","석굴의 기록자":"Chronicler of the Grotto","{0}층 도감 {1}종 완성":"Floor {0} Bestiary: {1} entries complete","석굴 벽에 새겨진 요괴의 내력을 먹으로 옮겨 적은 이의 칭호다":"The title of one who copied in ink the histories of yokai carved upon the grotto walls.","서리의 기록자":"Chronicler of the Frost","서리 내린 고개의 요괴를 빠짐없이 적어 넣은 자에게 붙은 이름이라지.":"They say this name was given to one who recorded every yokai of the frost-covered pass, without omission.","불길의 기록자":"Chronicler of the Flames","불길 속 요괴의 이름까지 요괴록에 새겨 넣은 이에게 내린 호라지.":"A title bestowed on one who inscribed even the names of yokai in the flames into the Yogoerok.","늪의 기록자":"Chronicler of the Marsh","안개 낀 늪의 요괴까지 하나도 빼놓지 않고 적은 이를 이리 불렀다.":"So they called one who recorded every yokai of the misty marsh, leaving none out.","요괴록의 주인":"Master of the Yogoerok","요괴록 도감 {0}종 모두 완성":"Complete all {0} Yogoerok Bestiary entries","찢긴 요괴록을 끝내 한 권으로 이어 낸 이만이 얻는 이름이라지.":"They say only one who mends the torn Yogoerok into a single volume earns this name.","초보 토벌꾼":"Novice Hunter","갓 등불을 받아 든 토벌꾼에게 주막 어른들이 붙여 준 이름이다.":"The name the Tavern elders give a hunter who has just taken up a lantern.","석굴을 지난 자":"One Who Passed the Grotto","어둠 깊은 석굴에서 살아 나온 자는 몸이 돌처럼 단단해진다지.":"They say one who walks out of the deep, dark grotto alive grows hard as stone.","불길을 넘은 자":"One Who Crossed the Flames","불길을 헤치고 걸어 나온 자의 소매엔 아직 불씨가 남았다지.":"They say embers still cling to the sleeves of one who walked out through the flames.","새벽을 연 사람":"Dawnbringer","밤새 요괴와 맞서다 첫닭 울음과 함께 돌아선 이의 이름이다.":"The name of one who fought yokai all night and turned homeward at the first rooster's crow.","미궁의 왕":"King of the Labyrinth","공격력 +{0}%, 최대 체력 +{1}%, 스킬 대기 -{2}%":"ATK +{0}%, Max HP +{1}%, skill cooldown -{2}%","끝없는 미궁을 다스려 요괴들마저 고개를 숙였다고 전해진다.":"It is told that he ruled the endless labyrinth until even the yokai bowed their heads.","어둠의 저주":"Curse of Darkness","저승 어귀의 먹구름이 눈앞을 덮으면 등불도 멀리 닿지 못한다지.":"When the black clouds at the gates of the underworld veil your sight, even a lantern's light won't reach far.","피의 저주":"Curse of Blood","원혼의 핏빛 한이 몸에 스며 작은 상처도 깊어진다고 한다.":"The blood-red grudge of vengeful spirits seeps into the body, and even small wounds run deep.","메마름의 저주":"Curse of Drought","혼불이 말라붙은 땅에서는 어떤 약도 제 힘을 내지 못한다지.":"They say on land where Soulfire has dried up, no medicine works as it should.","질주의 저주":"Curse of Swiftness","도깨비 바람이 요괴의 발에 붙으면 그림자도 따라잡지 못한다.":"When the dokkaebi wind clings to a yokai's feet, not even its shadow can keep up.","무리의 저주":"Curse of the Horde","한 마리를 베면 열이 몰려온다는 백귀야행의 저주라지.":"The curse of the Hundred Demons' Parade, they say: cut down one and ten more come swarming.","강철의 저주":"Curse of Iron","녹슨 갑옷 귀신이 요괴들 몸에 쇳빛 껍질을 입혀 놓았다고 한다.":"A ghost of rusted armor is said to have clad the yokai in shells of iron.","원한의 저주":"Curse of Grudge","한 맺힌 채 쓰러진 요괴는 끝내 가만히 눕지 못한다지.":"They say a yokai that falls full of grudge never lies still.","봉인의 저주":"Curse of Sealing","무당이 붙인 붉은 봉인 부적이 손끝의 기운을 꽁꽁 묶는다지.":"A red sealing talisman placed by a shaman binds the energy at your fingertips tight.","환도를 휘둘러 앞의 적을 벤다":"Swing the hwando to slash enemies ahead","강휘의 허리에 찬 낡은 환도는 요괴를 벨 때마다 날이 닳았다지.":"Ganghwi's old hwando at his hip wore thinner with every yokai it cut.","각궁으로 화살을 쏘아 적을 맞힌다":"Fire arrows from the horn bow to hit enemies","설아가 아끼는 뿔 활은 시위 소리만으로도 잡귀가 물러났다지.":"Seola's cherished horn bow—the twang of its string alone sent lesser spirits fleeing.","보스 {0}마리 처치 (누적)":"Defeat {0} bosses (cumulative)","근접(긴)":"Melee (Long)","창 찌르기":"Spear Thrust","창을 곧게 내질러 앞의 적을 찌른다":"Thrust the spear straight to pierce enemies ahead","도윤의 긴 창은 한 번 내지르면 어둠도 한 치 물러섰다지.":"With every thrust of Doyun's long spear, the darkness gave way by an inch.","돌격 찌르기":"Charging Thrust","길게 돌진하며 {0}% 피해":"Dash far forward for {0}% damage","창끝을 앞세워 달리면 막아선 귀신도 길을 비켰다고 한다.":"Run with the spear tip leading, and even ghosts standing in the way would step aside.","창 휘두르기":"Spear Sweep","넓게 휘둘러 {0}% 피해 + 크게 밀쳐냄":"Sweep wide for {0}% damage + heavy knockback","긴 창자루가 크게 한 바퀴 돌면 무리가 우수수 나가떨어졌다지.":"When the long shaft came around in a great circle, the horde fell in droves.","투창":"Spear Throw","모든 적을 꿰뚫는 창을 던져 {0}% 피해, 느려짐":"Hurl a spear piercing all enemies for {0}% damage, slows","한 번 던진 창은 돌아오지 않는다 했으나, 적을 다 꿰고서야 멈췄다지.":"They say a thrown spear never returns—this one stopped only after skewering every foe.","백창진":"Hundred Spear Formation","가리킨 곳 주변에 창 {0}자루를 떨어뜨려 각 {1}% 피해":"Rain {0} spears around the target area, each dealing {1}% damage","하늘이 갈라지듯 창비가 내리니 진 안에 선 자 살아 나간 이 없다지.":"The spear-rain fell as if the sky had split; none who stood within the formation walked out alive.","방 {0}개 정리 (누적)":"Clear {0} rooms (cumulative)","연타":"Flurry","주먹을 빠르게 연달아 내질러 가까운 적을 친다":"Throw rapid punches to strike nearby enemies","맨주먹이 쉴 틈 없이 오가니 바위도 먼지가 되었다지.":"Bare fists flew without a moment's rest, and even boulders turned to dust.","비룡각":"Flying Dragon Kick","날아차기로 돌진 후 착지 폭발 {0}%+{1}%":"Dash with a flying kick, then landing blast {0}%+{1}%","한 번 솟구쳐 발을 뻗으면 용이 하늘을 가르는 듯했다지.":"They say one leap and a kick looked like a dragon splitting the sky.","장풍":"Palm Blast","큰 기운 덩어리를 날려 {0}% 피해 + 밀쳐냄":"Hurl a great mass of energy: {0}% damage + knockback","숨을 모아 내뻗은 손끝에서 산바람이 터져 나왔다 한다.":"They say a mountain gale burst from fingertips thrust out after a held breath.","금강불괴":"Diamond Body","{0}초 동안 받는 피해 -{1}%, 체력 {2}% 회복":"Damage taken -{1}% for {0}s, restore {2}% HP","절간 쇠종처럼 몸이 울릴 뿐 어떤 칼날도 살을 못 뚫었다지.":"The body merely rang like a temple bell, and no blade could pierce the flesh.","백렬권":"Hundred-Strike Fist","{0}초 동안 앞쪽을 {1}번 때려 각 {2}% 피해":"Strike ahead {1} times over {0}s, {2}% damage each","한 호흡에 백 번을 친다던 소문, 허풍만은 아니었다지.":"The rumor of a hundred blows in a single breath was no mere boast.","한 판에서 레벨 {0} 달성":"Reach level {0} in a single run","화승총":"Matchlock","화승총을 쏘아 멀리 있는 적을 맞힌다":"Fire a matchlock to hit distant enemies","심지에 불을 붙이면 산 너머 호랑이도 걸음을 멈췄다지.":"Once the fuse was lit, even a tiger beyond the mountain halted in its tracks.","벌떼 사격":"Swarm Shot","가까운 적에게 쇠알 {0}발, 각 {1}% 피해 + 밀쳐냄":"Fire {0} iron pellets at nearby enemies, {1}% damage each + knockback","총구를 벗어난 쇳알이 벌떼처럼 흩어져 앞을 쓸었다지.":"Pellets leaving the muzzle scattered like a swarm of bees and swept the field ahead.","화약 구르기":"Powder Roll","구르며 지나간 자리에 폭발 {0}%를 남김":"Leave {0}% explosions along your roll path","구른 자리마다 화약 냄새가 남더니 이내 펑 하고 터졌다지.":"A whiff of gunpowder lingered wherever he rolled, then burst with a bang.","화약 단지":"Powder Jar","가리킨 곳에 단지를 던져 {0}초 뒤 큰 폭발 {1}% + 기절":"Throw a jar at the target; after {0}s, a big explosion: {1}% damage + stun","단지 속 화약이 한꺼번에 터지면 주막 지붕이 날아간다 했다.":"They say when the powder in the jar goes off all at once, it blows the Tavern roof away.","홍이포 포격":"Hongipo Barrage","가리킨 곳 주변에 포탄 {0}발, 각 {1}% 피해":"Fire {0} cannonballs around the target, {1}% damage each","서양 배를 막던 큰 대포가 이번엔 요괴 무리 위로 불을 뿜는다.":"The great cannon that once held off foreign ships now spits fire upon a horde of yokai.","체력 {0}% 이상 남기고 보스 {1}번 + 방 {2}개":"Defeat bosses {1} times with {0}%+ HP left + clear {2} rooms","방울 물결":"Bell Ripple","방울을 흔들어 퍼지는 소리로 가까운 적을 친다":"Shake the bell and strike nearby enemies with the spreading sound","무녀가 방울을 흔들면 맑은 소리가 물결처럼 번져 나갔다지.":"When the shaman shook her bell, a clear sound spread outward like ripples.","방울 울림":"Bell Toll","주변 적 {0}초 기절 + {1}% 피해":"Stun nearby enemies for {0}s + {1}% damage","귀신도 방울 소리 앞에서는 잠시 얼어붙는다 하지.":"They say even ghosts freeze for a moment before the sound of the bell.","살풀이춤":"Salpuri Dance","굿판에서 춤사위 하나로 맺힌 살을 풀어 몸을 돌보았다지.":"At the gut ritual, a single dance move loosed the knotted curse and soothed the body.","오방기 결계":"Five-Direction Barrier","자기 자리에 {0}초 결계 (적 느려짐·초당 {1}% 피해, 안에서 받는 피해 -{2}%)":"Barrier at your spot for {0}s (enemies slowed, {1}% damage/s, damage taken inside -{2}%)","다섯 빛깔 깃발을 꽂으면 그 안은 요괴도 함부로 못 드는 땅이라.":"Plant the five-colored flags, and even yokai dare not set foot within.","신내림":"Spirit Possession","신이 몸에 내리면 무녀의 눈빛부터 달라진다고들 하지.":"They say when a god descends upon her, the shaman's gaze changes first.","체력 {0}% 이하로 보스 {1}번 + {2}번 쓰러지기":"Defeat bosses {1} times at {0}% HP or lower + fall {2} times","원혼 구슬":"Vengeful Orb","원혼이 깃든 구슬을 날려 적을 맞힌다":"Hurl an orb haunted by a vengeful spirit to hit enemies","한 맺힌 넋이 뭉쳐 푸른 구슬이 되어 떠돈다지.":"Grudge-bound souls gather into a blue orb and drift about.","원혼 {0}마리를 {1}초 동안 부름":"Summon {0} vengeful spirits for {1}s","무덤가에서 이름을 세 번 부르면 떠돌던 넋이 곁에 선다지.":"Call a name three times at the grave, and a wandering soul stands beside you.","흡혼광":"Soul-Drain Beam","직선 광선 {0}% 피해, 맞힌 적마다 체력 {1}% 회복":"Straight beam: {0}% damage, restore {1}% HP per enemy hit","푸른 빛줄기가 산 자의 기운을 빨아 흑운의 몸에 채웠다지.":"The blue beam drained the energy of the living and filled Heugun's body with it.","혼비백산":"Scatter in Terror","주변 적 {0}초 동안 크게 느려짐 + 밀쳐냄":"Nearby enemies greatly slowed for {0}s + knockback","으스스한 기운이 번지면 담 큰 자도 다리가 풀렸다지.":"When the eerie chill spread, even the boldest felt their legs give way.","해골 병사 {0}명을 {1}초 동안 부름":"Summon {0} skeleton soldiers for {1}s","버려진 싸움터의 백골들이 북소리에 맞춰 일어섰다 한다.":"They say white bones from a forsaken battlefield rose to the beat of a drum.","{0}초 안에 방 정리 {1}번 + 정예 {2}마리":"Clear {1} rooms + {2} elites within {0}s","쌍단검":"Twin Daggers","두 단검으로 가까운 적을 빠르게 벤다":"Slash nearby enemies rapidly with two daggers","달빛 아래 두 칼날이 엇갈리면 소리 없이 끝났다지.":"When two blades crossed beneath the moonlight, it ended without a sound.","그림자 건너기":"Shadow Crossing","가리킨 곳으로 순간이동, 도착 지점 {0}% 피해":"Teleport to the target, {0}% damage at arrival point","자객은 그림자에서 그림자로 건너뛰어 어느새 등 뒤에 선다지.":"They say an assassin leaps from shadow to shadow and is standing behind you before you know it.","표창":"Throwing Stars","빠른 표창 {0}발, 각 {1}% 피해":"{0} swift throwing stars, {1}% damage each","소매 속에서 번쩍인 쇠별 셋이 어둠을 갈랐다지.":"Three iron stars flashed from a sleeve and split the dark, so the tale goes.","그림자 두르기":"Shadow Cloak","{0}초 동안 적이 놓치고, 이동 +{1}%, 다음 공격은 치명타":"Enemies miss for {0}s, Move Speed +{1}%, next attack is a critical hit","숨을 죽이고 어둠에 몸을 섞으면 눈앞에 서도 보지 못한다지.":"Hold your breath and melt into the dark, and they say even one standing before you will not see you.","그림자 난도":"Shadow Slaughter","가까운 적 {0}명에게 차례로 날아가 각 {1}% 피해":"Dash through {0} nearby enemies in turn, {1}% damage each","한 줄기 검은 바람이 지나간 뒤에야 적들은 쓰러졌다지.":"Only after a single black wind had passed did the foes fall, so they say.","저주 스테이지 {0}번":"Cursed Stage {0} times","스토리 {0}층 도달 + 저주 스테이지 {1}번":"Reach Story Floor {0} + Cursed Stage {1} times","부적 던지기":"Talisman Throw","부적을 던져 적을 맞힌다":"Hurl a talisman to strike enemies","붉은 먹으로 쓴 부적 한 장이 칼보다 매서울 때가 있다지.":"At times, a single talisman inked in red is said to cut sharper than any blade.","화염 부적":"Flame Talisman","부딪히면 폭발 {0}% 피해 + 불태움":"Explodes on impact for {0}% damage + burn","주사로 불 화 자를 그리면 닿는 곳마다 불길이 일었다지.":"When the character for fire was drawn in cinnabar, flames rose wherever it touched, they say.","땅을 접어 걷는다는 도사의 비술, 천 리도 한걸음이라.":"A Taoist sage's secret art of folding the earth beneath his feet—a thousand li in a single step.","뇌우 부적":"Thunderstorm Talisman","번개가 적 {0}명에게 튀며 각각 {1}% 피해":"Lightning chains to {0} enemies, {1}% damage each","먹구름 낀 밤 도사가 부적을 사르면 번개가 줄줄이 내리꽂혔다지":"On a night of dark clouds, when the sage burned a talisman, lightning struck down one bolt after another, they say.","오행진":"Five Elements Array","가리킨 곳에 {0}초 동안 큰 진을 펼친다 (초당 {1}% 피해, 크게 느려짐)":"Spread a great array at the target for {0}s ({1}% damage per second, heavily slows)","오행의 기운으로 그은 진 안에선 요괴도 발이 무거워진다":"Within an array drawn with the energy of the five elements, even yokai grow heavy of foot.","스토리 {0}층 도달 + 스킬 {1}번 사용":"Reach Story Floor {0} + use skills {1} times","음양 구슬":"Yin-Yang Orb","흑백 구슬을 날려 적을 맞힌다":"Fling a black-and-white orb to strike enemies","흑과 백이 맞물려 도는 구슬에 음양사의 숨결이 깃들었다":"The breath of a yin-yang master dwells in this orb, black and white turning in each other's grip.","태극 구슬":"Taegeuk Orbs","{0}초 동안 흑백 구슬 {1}개가 주위를 돌며 피해를 준다 (각 {2}%)":"For {0}s, {1} black-and-white orbs circle you and deal damage ({2}% each)","흑백 두 빛이 얽혀 주인 곁을 맴도는 작은 태극이라지":"A tiny taegeuk, they say, of black and white light entwined, circling its master.","음양 반전":"Yin-Yang Reversal","주변에 {0}% 피해, 체력 {1}% 회복":"{0}% damage to nearby enemies, restore {1}% HP","음이 양이 되고 양이 음이 되니 상처도 뒤집힌다는 말이 있지":"When yin becomes yang and yang becomes yin, even wounds are turned over, so the saying goes.","식신 부르기":"Summon Shikigami","종이 식신 {0}마리를 {1}초 동안 부른다":"Summon {0} paper shikigami for {1}s","오려 낸 종이에 이름을 불러 넣으면 식신이 걸어 나온다지":"Call a name into a cut-out of paper, and a shikigami steps forth, they say.","태극파천":"Taegeuk Heaven-Splitter","가리킨 곳에 {0}초 뒤 거대한 폭발, {1}% 피해와 기절":"After {0}s, a massive explosion at the target: {1}% damage and stun","하늘과 땅이 갈라지는 소리가 나더니 태극이 터졌다고 한다":"They say a sound of heaven and earth splitting rang out, and then the taegeuk burst.","펫 {0}종":"{0} pet types","스토리 {0}층 도달 + 펫 {1}종 모으기":"Reach Story Floor {0} + collect {1} pet types","영혼 화살":"Spirit Arrow","영혼 화살을 쏘아 적을 맞힌다":"Fire a spirit arrow to strike enemies","죽은 이의 넋을 시위에 얹어 쏘면 길 잃은 혼이 길을 찾는다":"Set a dead soul upon the bowstring and loose it, and the lost spirit finds its way.","영호 소환":"Summon Spirit Tiger","영혼 호랑이를 {0}초 동안 부른다 (강함)":"Summon a spirit tiger for {0}s (powerful)","산신의 곁을 지키던 영험한 호랑이 넋이 부름에 응한다":"The sacred tiger spirit that once guarded the mountain god's side answers the call.","영조 소환":"Summon Spirit Birds","멀리서 쏘는 영혼 새 {0}마리를 {1}초 동안 부른다":"Summon {0} ranged spirit birds for {1}s","산 너머 먼 곳까지 눈 밝은 영혼 새가 날아 적을 쫓는다지":"Spirit birds with keen eyes fly beyond the mountains to hunt down foes, they say.","영혼 연결":"Spirit Link","체력 {0}% 회복, 부림 {1}초 동안 강화 (+{2}%)":"Restore {0}% HP, empower your summons for {1}s (+{2}%)","부리는 이와 부림받는 넋이 한 줄 실로 이어져 숨을 나눈다":"Master and bound soul are joined by a single thread, sharing one breath.","사신수 강림":"Descent of the Four Guardians","청룡·백호·주작·현무를 {0}초 동안 부른다":"Summon the Azure Dragon, White Tiger, Vermilion Bird, and Black Tortoise for {0}s","동서남북 네 방위를 지키는 신령이 한자리에 내려선다":"The spirits who guard the four directions—east, west, south, and north—descend upon a single spot.","스토리 {0}층 도달 + 정예 {1}마리":"Reach Story Floor {0} + defeat {1} elites","쌍도끼":"Twin Axes","양손의 도끼를 휘둘러 가까운 적을 벤다":"Swing your axes to cleave nearby enemies","산중 나무꾼 못지않게 거친 사내가 양손에 도끼를 쥐었다":"A man as rough as any mountain woodcutter grips an axe in each hand.","도끼 던지기":"Axe Throw","꿰뚫는 도끼를 던져 {0}% 피해":"Hurl a piercing axe for {0}% damage","던진 도끼가 바람을 가르고 요괴의 뼈마디를 꿰뚫는다":"The hurled axe splits the wind and pierces the yokai to the bone.","도약 내려찍기":"Leaping Slam","가리킨 곳으로 뛰어올라 착지하며 {0}% 피해와 기절":"Leap to the target area and land for {0}% damage and a stun","산비탈을 박차고 솟은 사내가 땅이 울리도록 내려앉았다":"Kicking off the mountainside, the man soared, then crashed down until the earth rang.","광폭화":"Berserk","{0}초 동안 공격력 +{1}%, 공격 속도 +{2}%, 입힌 피해의 {3}%만큼 체력 회복":"For {0}s: attack +{1}%, attack speed +{2}%, heal {3}% of damage dealt","눈이 붉게 뒤집히면 사내는 아픔도 두려움도 잊는다고 한다":"They say that once his eyes roll red, the man forgets both pain and fear.","피의 회오리":"Blood Whirlwind","{0}초 동안 회전하며 {1}번 각 {2}% 피해, 받는 피해 -{3}%":"Spin for {0}s, hitting {1} times for {2}% damage each; damage taken -{3}%","도끼날이 붉은 바람을 일으키니 가까이 선 자가 없었다":"The axe blades stirred a crimson wind, and none dared stand close.","쌍월도":"Twin Crescent Blades","두 자루 월도로 가까운 적을 벤다":"Slash nearby enemies with two crescent blades","초승달 닮은 두 자루 칼이 달빛 아래 춤을 춘다지":"Two blades shaped like crescent moons are said to dance beneath the moonlight.","초승달 검기":"Crescent Wave","꿰뚫는 초승달 검기로 {0}% 피해":"Piercing crescent sword energy deals {0}% damage","칼끝에서 풀려난 달빛 한 줄기가 어둠을 가른다":"A single ray of moonlight, freed from the blade's tip, cleaves the dark.","월광 보법":"Moonlight Step","가리킨 곳으로 미끄러지며 지나간 적에게 {0}% 피해, 그동안 무적":"Glide to the target area, dealing {0}% damage to enemies passed; invincible meanwhile","달빛 위를 걷듯 스치니 베인 줄도 모르고 쓰러진다지":"They pass as if walking on moonlight, and foes fall without knowing they were cut.","만월":"Full Moon","주변 {0}% 피해, 적 {1}초 동안 느려짐":"{0}% damage around you; enemies slowed for {1}s","보름달이 차오르는 밤엔 검희의 칼도 가장 환히 빛난다":"On nights when the full moon swells, Geomhui's blade shines brightest.","월하난무":"Moonlit Frenzy","적 {0}명에게 차례로 베어들고 마지막에 만월 폭발":"Slash {0} enemies in turn, then end with a Full Moon explosion","달 아래 열 명을 차례로 베고 끝에 보름달을 터뜨린다":"Beneath the moon she cuts down ten in turn, then bursts the full moon at the end.","뇌전 언월도":"Thunder Glaive","번개 서린 언월도로 가까운 적을 벤다":"Slash nearby enemies with a lightning-wreathed glaive","푸른 번개가 날을 타고 흐르는 장군의 큰 칼이다":"The general's great blade, with blue lightning flowing along its edge.","뇌창":"Thunder Spear","번개 창이 직선으로 날아가 {0}% 피해":"A lightning spear flies in a straight line for {0}% damage","하늘이 내려 던진 번개 창 하나가 한 줄로 요괴를 꿰뚫는다":"A lightning spear hurled down from the heavens pierces the yokai in a single line.","벼락 강림":"Lightning Descent","가리킨 곳에 벼락, {0}% 피해와 {1}초 기절":"Lightning strikes the target area for {0}% damage and a {1}s stun","장군이 칼을 치켜들자 맑은 하늘에서 벼락이 떨어졌다":"When the general raised his blade, lightning fell from a clear sky.","천둥 갑옷":"Thunder Armor","{0}초 동안 받는 피해 -{1}%, 주변 적에게 초당 {2}% 감전":"For {0}s: damage taken -{1}%, shock nearby enemies for {2}% per second","우레 소리가 몸에 감겨 쇠 갑옷보다 단단히 지켜 준다":"The roar of thunder wraps around the body, guarding it better than iron armor.","뇌신강림":"Thunder God's Descent","방 전체에 벼락 {0}번, 각 {1}% 피해":"Lightning strikes the whole room {0} times for {1}% damage each","뇌신이 노하자 팔도 하늘이 갈라지고 벼락이 비처럼 쏟아졌다":"When the Thunder God raged, the skies over all eight provinces split and lightning poured down like rain.","푸른 여우불을 날려 적을 태운다":"Hurl blue foxfire to burn enemies","구미호가 입에 문 여우구슬에서 푸른 불꽃이 피어난다":"Blue flames bloom from the fox bead the gumiho holds in her mouth.","사슬을 휘둘러 가까운 적을 친다.":"Swing a chain to strike nearby enemies.","저승차사의 사슬에 묶인 혼은 이승으로 돌아가지 못한다고 하지.":"A soul bound by the jeoseung saja's chain can never return to this world, they say.","사슬 당기기":"Chain Pull","사슬을 던져 맞은 적을 끌어오고 {0}% 피해":"Throw a chain to pull in the enemy hit and deal {0}% damage","던진 사슬이 한 번 감기면 이름 불린 혼은 끌려오고 만다.":"Once the thrown chain coils, the soul whose name is called is dragged in.","명부 기록":"Ledger Entry","가리킨 곳에 표식, {0}초 동안 초당 {1}% 피해":"Mark the target area for {0}s, dealing {1}% damage per second","명부에 이름이 오른 자는 먹물이 마르기 전에 저승길에 선다.":"Whoever's name is written in the ledger stands on the road to the underworld before the ink dries.","혼 거두기":"Soul Harvest","주변 {0}% 피해, 맞힌 적마다 체력 {1}% 회복":"{0}% damage around you; heal {1}% HP per enemy hit","차사가 낫을 휘두르면 흩어진 혼이 그의 품으로 모여든다지.":"When the reaper swings his scythe, scattered souls are said to gather into his arms.","저승문":"Underworld Gate","가리킨 곳에 {0}초 동안 저승문 (초당 {1}%, 체력 {2}% 이하 적 {3}% 확률 즉사)":"Open an Underworld Gate at the target area for {0}s ({1}% per second; enemies below {2}% HP have a {3}% chance of instant death)","닫힌 저승문이 열리면 목숨 얼마 안 남은 자부터 빨려 든다.":"When the shut gate of the underworld opens, those with little life left are drawn in first.","물결 베기":"Wave Slash","칼을 휘둘러 앞의 적을 물결처럼 벤다.":"Swing your blade to cut down enemies ahead like a rolling wave.","수군장의 칼끝이 지나간 자리엔 파도 같은 흔적만 남았다.":"Where the naval commander's blade passed, only a trace like a wave remained.","물살 가르기":"Tide Cleave","물살처럼 돌진하며 {0}% 피해":"Charge like a current, dealing {0}% damage","물살을 타고 적진을 가르는 수군장의 배는 멈출 줄 몰랐다.":"Riding the current through the enemy ranks, the commander's ship knew no stopping.","거북 방패":"Turtle Shield","{0}초 동안 받는 피해 -{1}% + 보호막 {2}%":"Damage taken -{1}% for {0}s + {2}% shield","거북 등딱지처럼 단단한 방패는 왜적의 칼도 튕겨 냈다지.":"Hard as a turtle's shell, the shield is said to have turned aside even the invaders' blades.","소용돌이":"Whirlpool","{0}초 동안 내 주변 소용돌이 (초당 {1}%, 느려짐)":"Whirlpool around you for {0}s ({1}% per sec, slows)","바다가 성이 나면 소용돌이가 일어 배도 사람도 삼킨다 했다.":"When the sea grows wrathful, whirlpools rise and swallow ships and men alike.","거북선 포격":"Turtle Ship Barrage","적에게 포탄 {0}발, 각 {1}%":"{0} cannonballs at enemies, {1}% each","거북선 용머리에서 불을 뿜자 온 바다가 화약 내로 가득했지.":"When fire spat from the turtle ship's dragon head, the whole sea reeked of gunpowder.","사냥 화살":"Hunting Arrow","가까운 적을 향해 화살을 쏜다.":"Fire an arrow at a nearby enemy.","매사냥꾼의 화살은 바람 소리보다 먼저 날아간다 했지.":"They say the falconer's arrow flies ahead of the sound of the wind.","매 날리기":"Release Hawks","사냥매 {0}마리를 {1}초 동안 부름":"Summon {0} hunting hawks for {1}s","휘파람 한 번이면 사냥매가 구름을 뚫고 내려온다 하더라.":"One whistle, and the hunting hawks are said to pierce the clouds and descend.","연달아 쏘기":"Rapid Fire","화살 {0}발, 각 {1}%":"{0} arrows, {1}% each","시위를 놓는 손이 보이지 않아 화살이 줄지어 날았다 하지.":"The hand releasing the string could not be seen, and the arrows flew in a line.","올가미 덫":"Snare Trap","가리킨 곳에 {0}초 동안 덫 (크게 느려짐, 초당 {1}%)":"Trap at target spot for {0}s (heavy slow, {1}% per sec)","산짐승도 요괴도 올가미 줄에 발이 걸리면 도망치지 못했지.":"Beast or yokai, once a foot caught the snare, none could escape.","매의 폭풍":"Hawk Storm","{0}초 동안 따라가는 화살 {1}발, 각 {2}%":"{1} homing arrows over {0}s, {2}% each","하늘이 매 떼로 어두워지더니 화살이 비처럼 쏟아졌다더라.":"The sky darkened with a flock of hawks, and arrows poured down like rain.","백호 언월도":"White Tiger Glaive","언월도를 크게 휘둘러 앞의 적을 벤다.":"Swing the glaive wide to cut down enemies ahead.","백호신장이 쥔 언월도는 달빛처럼 희고 호랑이 발톱처럼 날카롭다.":"The glaive in the White Tiger General's grip is pale as moonlight and sharp as a tiger's claw.","백호 돌격":"White Tiger Charge","돌진 {0}% + 끝에 {1}% 폭발, 무적":"Charge for {0}% + {1}% blast at the end, invincible","흰 호랑이가 내달리면 산도 길을 비켜 주었다고 전하지.":"It is told that when the white tiger ran, even mountains made way.","백호의 포효":"White Tiger's Roar","넓게 {0}% + {1}초 기절":"Wide area {0}% + {1}s stun","백호의 포효가 골짜기를 울리면 요괴도 다리가 풀렸다 하지.":"When the White Tiger's roar echoed through the valley, even yokai went weak at the knees.","백호 혼령":"White Tiger Spirit","백호 혼령을 {0}초 동안 부름":"Summon the White Tiger Spirit for {0}s","백호의 옛 혼령이 신장의 부름에 안개 속에서 걸어 나왔다.":"At the General's call, the White Tiger's ancient spirit strode out of the mist.","백호신 강림":"White Tiger Descent","{0}초 동안 공격력 +{1}%·공격 속도 +{2}%, 주변을 {3}번 각 {4}%":"For {0}s: attack +{1}%, attack speed +{2}%, strike surroundings {3} times, {4}% each","서쪽의 수호신이 몸에 내리니 신장의 두 눈이 금빛으로 타올랐다.":"As the guardian of the west descended upon him, the General's eyes blazed gold.","주작 불씨":"Vermilion Ember","가까운 적을 향해 불씨를 날린다.":"Hurl an ember at a nearby enemy.","주작의 날갯짓에서 떨어진 불씨는 꺼지지 않고 무녀 곁을 맴돈다.":"Embers shed from the Vermilion Bird's wingbeats never die out, but drift around the shaman.","주작 깃털":"Vermilion Feather","따라가는 불깃털 {0}개, 각 {1}% + 불태움":"{0} homing fire feathers, {1}% each + burn","주작이 깃을 털자 붉은 깃털마다 불이 붙어 적을 좇았다지.":"When the Vermilion Bird shook its plumage, every red feather caught fire and chased the foe.","불사의 날개":"Wings of Rebirth","체력 {0}% 회복 + {1}초 무적":"Restore {0}% HP + {1}s invincibility","재가 된 새가 다시 날아오르듯 무녀도 불길 속에서 일어선다.":"Like a bird turned to ash taking wing again, the shaman rises from the flames.","화염 방울진":"Bell of Flames","가리킨 곳에 {0}초 동안 불의 진 (초당 {1}%)":"Fire formation at target spot for {0}s ({1}% per sec)","무녀가 방울을 울리며 춤추면 땅에 붉은 불의 진이 그려졌다.":"As the shaman danced, ringing her bells, a crimson formation of fire was traced upon the ground.","주작 강림":"Vermilion Bird Descent","적에게 불벼락 {0}번 각 {1}% + 체력 {2}% 회복":"{0} fire bolts at enemies, {1}% each + restore {2}% HP","남쪽 하늘이 갈라지고 주작이 내린 불벼락이 온 땅을 태웠다.":"The southern sky split open, and the fire the Vermilion Bird sent down scorched the whole land.","쇠스랑 찍기":"Pitchfork Strike","쇠스랑을 내리찍어 앞의 적을 친다.":"Slam the pitchfork down on the enemy ahead.","논밭 갈던 쇠스랑도 의병의 손에 들리면 창이 되었다지.":"They say even a pitchfork that tilled the fields became a spear in a righteous soldier's hand.","논두렁 돌진":"Paddy Dash","앞으로 돌진하며 {0}% 피해":"Dash forward, dealing {0}% damage","논두렁을 달리던 다리 힘으로 돌쇠는 적진까지 단숨에 뛰었다.":"With the legs that once raced along the paddy ridges, Dolsoe leapt into the enemy ranks in a single bound.","쇠스랑 휘돌리기":"Pitchfork Whirl","주변 적에게 {0}% 피해":"{0}% damage to nearby enemies","쇠스랑을 휘휘 돌리면 볏단 베듯 적이 나가떨어졌다 하지.":"Spin the pitchfork round and round, and the foes fell like cut sheaves of rice.","막걸리 한 사발":"Bowl of Makgeolli","체력 {0}% 회복 + {1}초 동안 공격력 +{2}%":"Restore {0}% HP + {2}% attack for {1}s","농사일 끝에 들이켜는 한 사발에 없던 힘도 솟는다 했지.":"A bowl gulped down after the farm work, they say, brings strength from nowhere.","의병 봉기":"Righteous Uprising","의병 {0}명을 {1}초 동안 부름":"Summon {0} militiamen for {1}s","나라가 어지러우면 호미 든 이웃들이 하나둘 모여들었다.":"When the land fell into chaos, neighbors with hoes in hand gathered one by one.","육모방망이":"Hexagonal Truncheon","방망이를 휘둘러 가까운 적을 친다":"Swing the truncheon at nearby enemies","포졸의 허리춤에서 떠난 적 없는 여섯 모 난 몽둥이라.":"A six-sided club that has never left a constable's waist.","포승줄 던지기":"Rope Throw","줄을 던져 {0}% 피해 + {1}초 기절":"Throw a rope for {0}% damage + {1}s stun","한번 걸리면 도깨비도 풀지 못한다던 포도청의 붉은 줄이다.":"The red cord of the constabulary—once caught, not even a dokkaebi can break free.","게 섰거라!":"Halt!","포졸이 외치면 달아나던 놈도 발이 땅에 붙는다지.":"When a constable shouts, even a fleeing rogue's feet are rooted to the ground.","순라 돌기":"Night Patrol","{0}초 동안 이동 속도 +{1}%, 받는 피해 -{2}%":"Move speed +{1}%, damage taken -{2}% for {0}s","밤길을 도는 순라꾼의 발걸음은 귀신도 피해 갔다 한다.":"Even ghosts, they say, stepped aside from the footsteps of the night watchman.","포도청 출동":"Constabulary Dispatch","적에게 방망이를 {0}번 내려치기, 각 {1}% 피해":"Strike the enemy {0} times with the truncheon, {1}% damage each","북소리 울리면 포도청 문이 열리고 포졸들이 쏟아졌지.":"When the drum sounded, the constabulary gates flew open and constables poured out.","약초를 던져 적을 맞힌다":"Throw herbs at enemies","산을 오르내리며 캔 풀뿌리가 가득 든 낡은 주머니다.":"A worn pouch full of roots dug up while wandering the mountains.","쑥 연기":"Mugwort Smoke","{0}초 동안 연기를 피워 초당 {1}% 피해, 적을 느리게 함":"Release smoke for {0}s, dealing {1}% damage per second and slowing enemies","쑥을 태운 연기는 잡귀를 쫓고 독한 기운도 흩는다 했다.":"The smoke of burning mugwort drives off lesser spirits and scatters foul vapors.","독초 세 갈래":"Triple Poison Herb","독초 {0}발 각 {1}% 피해 + 중독":"{0} poison herbs, {1}% damage each + poison","뿌리 셋 갈라진 독초는 한 모금에 범도 눕힌다 하더라.":"A poison herb with three-forked roots, they say, fells even a tiger in a single sip.","인삼 달인 물":"Ginseng Decoction","백 년 묵은 산삼을 달인 물은 죽다 산 이도 일으킨다.":"Water simmered from hundred-year wild ginseng can raise even one who has crawled back from death.","백초 비":"Hundred-Herb Rain","약초 비 {0}번 각 {1}% 피해, 내 체력 {2}% 회복":"{0} herb rains, {1}% damage each, restore {2}% HP","온갖 풀잎이 비처럼 쏟아지니 상처마저 아물었다는 전설이다.":"Legend tells of leaves of every herb pouring down like rain, so that even wounds closed.","중거리":"Mid-Range","도끼를 던져 적을 맞힌다":"Throw an axe at enemies","나무 베던 손도끼도 던지면 날아가 적의 뼈를 가른다.":"Even a woodcutter's hatchet, once thrown, flies on to split an enemy's bones.","통나무 굴리기":"Log Roll","꿰뚫는 통나무 {0}% 피해 + 밀쳐냄":"Piercing log, {0}% damage + knockback","산비탈에서 굴러 내린 통나무에 호랑이도 비켜섰다 한다.":"They say even tigers stepped aside from a log rolling down the mountain slope.","도끼 회오리":"Axe Whirlwind","주변에 {0}% 피해를 {1}번 줌":"Deal {0}% damage {1} times around you","도끼를 휘두르면 바람이 일어 낙엽도 적도 흩날린다.":"Swing the axe and the wind rises, scattering fallen leaves and foes alike.","산사람 근성":"Mountain Grit","보호막 {0}% + {1}초 동안 받는 피해 -{2}%":"{0}% shield + damage taken -{2}% for {1}s","산에서 자란 몸은 웬만한 매질엔 꿈쩍도 않는 법이지.":"A body raised in the mountains won't flinch at an ordinary beating.","금도끼 은도끼":"Golden Axe, Silver Axe","금·은 도끼 {0}개를 사방으로 던져 각 {1}% 피해":"Hurl {0} gold and silver axes in all directions, {1}% damage each","산신령이 건넨 금도끼와 은도끼가 사방에서 날아든다.":"The gold and silver axes offered by the mountain spirit fly in from every side.","쌍검 춤":"Twin Blade Dance","쌍검으로 가까운 적을 벤다":"Slash nearby enemies with twin swords","두 자루 칼이 나비처럼 날면 구경하던 이도 넋을 잃었다.":"When the two blades fluttered like butterflies, even the onlookers were left entranced.","꽃잎 걸음":"Petal Step","순간이동 + 그 자리에 {0}% 피해":"Teleport + {0}% damage at the spot","꽃잎 지듯 사뿐히 걸으면 어느새 적의 코앞에 서 있다.":"Step light as a falling petal, and you stand before your foe before they know it.","칼춤 연무":"Sword Dance Mist","주변을 {0}번 베기, 각 {1}% 피해":"Slash around {0} times, {1}% damage each","소맷자락 따라 칼빛이 번지면 연무처럼 아득해진다.":"As blade-light trails the sleeve, all fades like drifting mist.","부채 가림":"Fan Veil","{0}초 무적 + {1}초 동안 공격 속도 +{2}%":"{0}s invincible + {2}% attack speed for {1}s","활짝 편 부채 뒤로 모습을 감추면 칼날도 비껴간다.":"Hide behind the opened fan, and even blades glance away.","진주성 검무":"Jinju Fortress Sword Dance","적 사이를 넘나들며 {0}번 베기, 각 {1}% 피해":"Weave through enemies, slashing {0} times, {1}% damage each","진주성에서 왜장을 안고 뛰어든 논개의 넋이 깃든 춤이라.":"A dance haunted by the spirit of Nongae, who leapt into the river clasping the enemy general at Jinju Fortress.","방울 소리의 기운을 날려 적을 맞힌다":"Hurl the energy of the bell's chime at enemies","무당이 흔드는 방울이 울리면 귀신이 먼저 고개를 든다.":"When the shaman's bells ring, the ghosts are first to raise their heads.","화랑 검":"Hwarang Sword","검으로 가까운 적을 벤다":"Slash nearby enemies with the sword","신라 화랑이 허리에 차고 산천을 누비던 곧은 칼이다.":"A straight blade the Silla Hwarang wore at the waist as they roamed mountains and rivers.","임전무퇴":"Never Retreat in Battle","{0}초 동안 공격력 +{1}%, 받는 피해 -{2}%":"{0}s: attack +{1}%, damage taken -{2}%","싸움에 나서면 물러서지 않는다는 화랑의 세속오계다.":"One of the Hwarang's Five Precepts: once in battle, never step back.","말발굽 돌격":"Hoofbeat Charge","사다함이 말을 달려 적진으로 뛰어들던 기세 그대로다.":"The very fury of Sadaham, spurring his horse into the enemy lines.","풍월 검기":"Wind-Moon Sword Qi","적을 꿰뚫는 검기 {0}발, 각 {1}%":"{0} sword qi blasts pierce enemies, {1}% each","풍월을 읊조리며 휘두르면 검기가 바람처럼 갈라 나간다지.":"Chant of wind and moon as you swing, and the sword qi parts the air like a gale.","신라의 별":"Star of Silla","별빛이 {0}번 떨어져 각 {1}%":"Starlight falls {0} times, {1}% each","새벽 하늘의 별이 화랑의 칼끝 따라 쏟아졌다고 전한다.":"They say the stars of the dawn sky poured down along the Hwarang's blade tip.","마패 치기":"Mapae Strike","마패로 가까운 적을 내려친다.":"Strike nearby enemies with the mapae.","임금이 내린 마패, 말 대신 악당의 머리를 먼저 울린다.":"The king's mapae—before any horse, it rings a villain's head.","암행어사 출두야!":"Secret Inspector Arrives!","주변 적을 {0}초 기절시키고 {1}% 피해":"Stun nearby enemies for {0}s and deal {1}% damage","'출두야!' 외침 한마디에 탐관오리의 다리가 풀렸다지.":"At a single cry of \"Chuldu-ya!\", the corrupt official's legs gave out.","마패 빛":"Mapae Light","적을 꿰뚫는 빛 {0}%":"Piercing light, {0}% damage","마패에 새긴 말이 빛으로 달려 어둠을 뚫는다지.":"The horse engraved on the mapae gallops forth as light, piercing the dark.","변복 잠행":"Disguised Sneak","{0}초 동안 몸을 숨기고, 다음 공격은 치명타, 이동 속도 +{1}%":"Hide for {0}s; next attack is a critical hit; move speed +{1}%","남루한 옷 한 벌이면 어사도 길손으로 감쪽같이 사라지지.":"In a set of ragged clothes, even an inspector vanishes into a mere wayfarer.","역졸 총출동":"Runners Mobilized","역졸 {0}명을 {1}초 동안 부리고, 적에게 낙인 {2}번 각 {3}%":"Command {0} runners for {1}s; brand enemies {2} times, {3}% each","마패를 높이 들면 역졸들이 사방에서 몰려든다지.":"Raise the mapae high, and the runners rush in from every side.","북장단":"Drum Rhythm","북을 두드려 가까운 적을 친다.":"Beat the drum to strike nearby enemies.","북채 한 번에 장단이 터지면 잡귀도 어깨를 들썩인다지.":"When one stroke of the drumstick bursts into rhythm, even lesser spirits sway their shoulders.","진양조":"Jinyangjo","느린 소리가 서린 자리를 {0}초간 만들어 초당 {1}% 피해, 적 느려짐":"Create a zone of slow sound for {0}s: {1}% damage per second, slows enemies","느릿한 진양조 가락에 산도 숨을 늦춘다고 하지.":"They say even the mountains slow their breath to the languid jinyangjo tune.","휘모리":"Hwimori","빠른 장단 {0}발, 각 {1}%":"{0} rapid beats, {1}% each","휘모리장단이 몰아치면 귀신도 박자를 놓친다지.":"When the hwimori rhythm storms in, even ghosts lose the beat.","얼씨구!":"Eolssigu!","{0}초 동안 공격 속도 +{1}%, 체력 {2}% 회복":"{0}s: attack speed +{1}%, restore {2}% HP","추임새 한마디에 지친 몸도 어깨춤이 절로 난다지.":"At a single cheer, even a weary body breaks into a shoulder dance.","한바탕 판소리":"Grand Pansori","온 방에 울리는 소리 {0}%, {1}초 기절":"Sound resounds through the room, {0}% damage, {1}s stun","한바탕 소리가 터지면 온 집이 들썩이고 귀신이 넋을 잃지.":"When the great song bursts forth, the whole house shakes and ghosts lose their wits.","대장군 창":"General's Spear","창으로 가까운 적을 찌른다.":"Thrust at nearby enemies with the spear.","고구려 대장군이 쥔 창은 수나라 군사를 꿰뚫었다지.":"The spear of the Goguryeo grand general is said to have pierced the Sui army.","살수 대첩":"Battle of Salsu","물살이 서린 자리를 {0}초간 만들어 초당 {1}% 피해, 적 느려짐, 밀쳐냄":"Create a rushing-water zone for {0}s: {1}% damage per second, slows and knocks back enemies","살수의 강물을 터뜨려 수나라 대군을 휩쓸었다고 전한다.":"They say the river Salsu was unleashed and swept away the great Sui host.","철기 돌격":"Iron Cavalry Charge","무적 상태로 돌진해 {0}%":"Charge while invincible for {0}%","철갑 두른 말들이 달려 나가면 막을 자가 없었다지.":"When the armored horses thundered forth, none could stand in their way.","고구려 군단":"Goguryeo Legion","고구려 병사 {0}명을 {1}초 동안 부린다":"Command {0} Goguryeo soldiers for {1}s","깃발 아래 고구려 병사들이 땅에서 일어선다고 하지.":"Beneath the banner, Goguryeo soldiers are said to rise from the earth.","여수장우중문시":"Poem to General Yu Zhongwen","적 장수를 꾸짖는 시: 온 방 {0}%, {1}초 동안 공격력 +{2}%":"A poem rebuking the enemy general: {0}% to the whole room, ATK +{2}% for {1}s","붓끝으로 적장을 꾸짖은 시 한 수가 십만 대군을 물렸다지.":"A single poem, brushed to scold the enemy general, is said to have turned back a hundred thousand troops.","햇살 화살":"Sunray Arrow","햇살 화살을 쏜다.":"Fire a sunray arrow.","해모수가 쏜 햇살은 어둠 속 요괴의 눈을 먼저 태웠다지.":"The sunlight Haemosu loosed is said to have scorched the eyes of yokai in the dark first.","오룡거 질주":"Five-Dragon Chariot Dash","다섯 용 수레로 돌진해 {0}%":"Charge in a five-dragon chariot for {0}%","다섯 용이 끄는 수레가 하늘길을 내달렸다고 전한다.":"They say the chariot drawn by five dragons raced along the road of heaven.","태양 화살비":"Sun Arrow Rain","햇살 화살 {0}발, 각 {1}%":"{0} sunray arrows, {1}% each","해가 쏟아내는 빛줄기가 비 되어 내린다고 하지.":"The beams the sun pours out are said to fall like rain.","천제의 가호":"Heavenly Emperor's Favor","{0}초 동안 공격력 +{1}%, 보호막 {2}%":"ATK +{1}% and {2}% shield for {0}s","천제의 아들에게 하늘이 내려준 가호가 몸을 감싼다지.":"The protection Heaven granted the Heavenly Emperor's son is said to wrap around his body.","하늘 문 열림":"Gates of Heaven Open","하늘에서 햇빛 기둥 {0}번, 각 {1}%":"{0} sunlight pillars from the sky, {1}% each","하늘 문이 열리면 햇빛 기둥이 땅을 내리꽂았다지.":"When the gates of heaven opened, pillars of sunlight are said to have struck down upon the earth.","연습장 허수아비 {0}번 쓰러뜨리기":"Defeat Training Ground scarecrows {0} times","스토리 전체 클리어":"Clear the entire story","??? (숨은 영웅)":"??? (Hidden Hero)","지푸라기 주먹":"Straw Fist","짚으로 만든 주먹으로 가까운 적을 친다.":"Strike nearby enemies with a fist of straw.","볏짚 속에 든 건 설움뿐, 그래도 주먹은 제법 맵다지.":"Only sorrow is stuffed inside the straw, yet the fist hits plenty hard, they say.","짚단 날리기":"Straw Bundle Toss","짚단 {0}발, 각 {1}%":"{0} straw bundles, {1}% each","묶은 짚단을 풀어 던지면 바람 타고 날카롭게 날아간다지.":"Hurled loose, the bound straw is said to ride the wind and fly sharp.","허수아비 바꿔치기":"Scarecrow Swap","순간이동, 떠난 자리에서 미끼가 터져 {0}%":"Teleport; a decoy left behind explodes for {0}%","논두렁 허수아비가 대신 서고 장군은 어느새 저만치 있지.":"A scarecrow from the paddy ridge stands in his place, and the general is already far off.","백 번 쓰러져도":"Though Felled a Hundred Times","체력 {0}% 회복, {1}초 동안 받는 피해 -{2}%":"Restore {0}% HP; damage taken -{2}% for {1}s","백 번 쓰러져도 짚 한 줌 추스르면 다시 일어난다지.":"Even felled a hundred times, gather a handful of straw and he rises again, they say.","허수아비 군단":"Scarecrow Legion","허수아비 병사 {0}명을 {1}초 동안 부린다":"Command {0} scarecrow soldiers for {1}s","들판의 허수아비들이 장군 부름에 줄지어 걸어 나온다지.":"At the general's call, the scarecrows of the field are said to march out in rows.","스토리 전체 완료":"Story fully completed","스토리 전체 완료 + 무한의 방 {0}번째 방 + 보스 레이드 완료":"Complete the entire story + reach Endless Rooms room {0} + complete Boss Raid","근접/원거리":"Melee/Ranged","늑대인간":"Werewolf","늑대 발톱":"Wolf Claw","여우 구슬":"Fox Bead","발톱":"Claw","발톱으로 가까운 적을 할퀸다.":"Slash nearby enemies with claws.","고양이 발톱 같지만 요괴 가죽도 단번에 긁어낸다지.":"It looks like a cat's claw, yet it is said to rake through yokai hide in one stroke.","야성의 할퀴기":"Feral Slash","돌진하며 할퀴어 {0}% 피해":"Dash and slash for {0}% damage","들짐승의 피가 끓으면 발톱이 먼저 앞서 나간다지.":"When the blood of the wild beast boils, the claws are said to strike first.","달밤 도약":"Moonlit Leap","가리킨 곳으로 뛰어올라 착지 시 {0}% + 기절":"Leap to the target spot; landing deals {0}% + stun","보름달 밤이면 담장 위도 한달음에 넘어간다지.":"They say that on a full-moon night, even a high wall is cleared in a single bound.","울부짖음":"Howl","주변 적을 {0}초 동안 겁먹어 느려지게 하고, {1}초 동안 공격력 +{2}%":"Frightens nearby enemies, slowing them for {0}s. ATK +{2}% for {1}s","산중 호랑이를 닮은 울음 한 번에 숲의 짐승이 모두 숨을 죽였다지":"One cry like a mountain tiger's, and every beast in the forest held its breath.","야수 해방":"Beast Unleashed","{0}초 동안 공격력 +{1}%, 공격 속도 +{2}%, 흡혈 {3}%. 주변에 여우불 {4}개가 맴돈다":"For {0}s: ATK +{1}%, Attack Speed +{2}%, lifesteal {3}%. {4} foxfires orbit you.","묶어 둔 짐승의 넋을 풀자 여우불이 달무리처럼 몸을 감쌌다지":"Once the bound beast's spirit was freed, foxfire wrapped around the body like a halo around the moon.","먹물 요괴":"Ink Yokai","피박쥐":"Blood Bat","해골 궁수":"Skeleton Archer","돌 도깨비":"Stone Dokkaebi","그림자 자객":"Shadow Assassin","꼬마 도깨비":"Little Dokkaebi","꼭두 인형":"Kkokdu Puppet","종이 귀신":"Paper Ghost","장승 요괴":"Jangseung Yokai","독두꺼비":"Poison Toad","각시탈 원귀":"Gaksital Vengeful Spirit","솟대 까마귀":"Sotdae Crow","둔갑 너구리":"Shapeshifting Raccoon Dog","저승 염라 사자":"Yeomra's Jeoseung Saja","돌 수문장":"Stone Gatekeeper","이무기":"Imugi","불가사리":"Bulgasari","장산범":"Jangsanbeom","어둑시니":"Eodeoksini","강철이":"Gangcheori","그슨대":"Geuseundae","두억시니":"Dueoksini","외다리 도깨비":"One-Legged Dokkaebi","박쥐 요괴왕":"Bat Yokai King","두더지 장군":"Mole General","객귀":"Gaekgwi","도깨비불 무리":"Dokkaebi Fire Swarm","석장승":"Stone Jangseung","동장군":"General Winter","설귀":"Snow Ghost","백곰 신장":"White Bear Guardian","빙호":"Ice Tiger","서리 늑대 우두머리":"Frost Wolf Alpha","고드름 궁수 귀신":"Icicle Archer Ghost","눈 도깨비":"Snow Dokkaebi","서리 학":"Frost Crane","성난 조왕신":"Wrathful Jowangsin","불개":"Bulgae","쇠도깨비 대장장이":"Iron Dokkaebi Smith","화차 귀신":"Hwacha Ghost","용암 두꺼비":"Lava Toad","대장장이 원귀":"Smith's Vengeful Spirit","화조":"Fire Bird","왕지네":"Giant Centipede","거미 여인":"Spider Woman","구렁이":"Great Serpent","달걀귀신":"Egg Ghost","버섯 요괴":"Mushroom Yokai","거머리 요괴":"Leech Yokai","독두꺼비 장군":"Poison Toad General","망량":"Mangryang","강림도령":"Gangnim Doryeong","우두마면":"Udumamyeon","저승 판관":"Jeoseung Judge","해치 수문장":"Haetae Gatekeeper","원귀 장수":"Vengeful General","손각시":"Songaksi","몽달귀신":"Mongdal Ghost","처녀귀신":"Maiden Ghost","저승 문지기 거인":"Underworld Gatekeeper Giant","마을 뒷산, 오래된 무덤 석굴. 돌 틈마다 도깨비불이 깜빡인다.\n반디: \"첫째 장의 냄새가 나. 아주 가까워.\"\n달래 할멈: \"첫째 장은 그림자 도깨비 왕이 직접 쥐고 있다. 졸개들이 석굴 곳곳을 지키고 있을 게다.\"\n달래 할멈: \"등불을 꺼뜨리지 마라. 이 아래 어둠은 사람의 이름부터 잊게 만드니.\"\n나: \"이름을 잊는다고요?\"\n달래 할멈: \"다녀오면 알려 주마. 어서 가거라.\"":"The old tomb grotto on the hill behind the village. Dokkaebi fire flickers in every crack of the stone.\nBandi: \"I can smell the first chapter. It's very close.\"\nGrandma Dallae: \"The Shadow Dokkaebi King holds the first chapter himself. His minions will be guarding every corner of the grotto.\"\nGrandma Dallae: \"Don't let your lantern go out. The darkness down there makes people forget their own names first.\"\nMe: \"Forget their names?\"\nGrandma Dallae: \"I'll tell you when you come back. Now go.\"","해설":"Narration","마을 뒷산, 오래된 무덤 석굴. 돌 틈마다 도깨비불이 깜빡인다.":"The old tomb grotto on the hill behind the village. Dokkaebi fire flickers in every crack of the stone.","첫째 장의 냄새가 나. 아주 가까워.":"I can smell the first chapter. It's very close.","달래 할멈":"Grandma Dallae","첫째 장은 그림자 도깨비 왕이 직접 쥐고 있다. 졸개들이 석굴 곳곳을 지키고 있을 게다.":"The Shadow Dokkaebi King holds the first chapter himself. His minions will be guarding every corner of the grotto.","등불을 꺼뜨리지 마라. 이 아래 어둠은 사람의 이름부터 잊게 만드니.":"Don't let your lantern go out. The darkness down there makes people forget their own names first.","나":"Me","이름을 잊는다고요?":"Forget their names?","다녀오면 알려 주마. 어서 가거라.":"I'll tell you when you come back. Now go.","숨을 쉬면 입김이 그대로 얼어붙는 동굴.\n반디: \"둘째 장은 얼음 동굴의 장군이 갑옷 속에 품었대. 동장군과 눈 귀신이 그 장군을 따른다나 봐.\"\n무영: \"이 동굴의 장군은 원래 요괴가 아니었다.\"\n나: \"그럼 사람이었어요?\"\n무영: \"이 땅을 지키다 눈 속에서 얼어 죽은 장수다. 원한이 그를 붙잡고 있다.\"":"A cave where your breath freezes the moment it leaves your lips.\nBandi: \"They say the general of the ice cave hides the second chapter inside his armor. General Winter and the snow ghosts follow him.\"\nMuyeong: \"The general of this cave was not always a yokai.\"\nMe: \"Then he was a man?\"\nMuyeong: \"A commander who froze to death in the snow, defending this land. Now his bitterness holds him here.\"","숨을 쉬면 입김이 그대로 얼어붙는 동굴.":"A cave where your breath freezes the moment it leaves your lips.","둘째 장은 얼음 동굴의 장군이 갑옷 속에 품었대. 동장군과 눈 귀신이 그 장군을 따른다나 봐.":"They say the general of the ice cave hides the second chapter inside his armor. General Winter and the snow ghosts follow him.","무영":"Muyeong","이 동굴의 장군은 원래 요괴가 아니었다.":"The general of this cave was not always a yokai.","그럼 사람이었어요?":"Then he was a man?","이 땅을 지키다 눈 속에서 얼어 죽은 장수다. 원한이 그를 붙잡고 있다.":"A commander who froze to death in the snow, defending this land. Now his bitterness holds him here.","요괴들이 무기를 벼리는 지하 대장간. 망치 소리가 심장처럼 울린다.\n무영: \"셋째 장은 불 도깨비 왕의 화로 속에 있다. 여기부터는 진짜다.\"\n반디: \"요괴들이 무기를 만들고 있어. 누구랑 싸우려는 거지?\"\n무영: \"사람이겠지. 미궁 밖으로 나갈 준비를 하는 거다.\"":"An underground forge where yokai temper their weapons. The hammering pounds like a heartbeat.\nMuyeong: \"The third chapter lies in the Fire Dokkaebi King's furnace. From here on, it's the real thing.\"\nBandi: \"The yokai are making weapons. Who are they planning to fight?\"\nMuyeong: \"Humans, I'd wager. They're preparing to march out of the labyrinth.\"","요괴들이 무기를 벼리는 지하 대장간. 망치 소리가 심장처럼 울린다.":"An underground forge where yokai temper their weapons. The hammering pounds like a heartbeat.","셋째 장은 불 도깨비 왕의 화로 속에 있다. 여기부터는 진짜다.":"The third chapter lies in the Fire Dokkaebi King's furnace. From here on, it's the real thing.","요괴들이 무기를 만들고 있어. 누구랑 싸우려는 거지?":"The yokai are making weapons. Who are they planning to fight?","사람이겠지. 미궁 밖으로 나갈 준비를 하는 거다.":"Humans, I'd wager. They're preparing to march out of the labyrinth.","썩은 물과 독 안개가 빛마저 삼키는 늪.\n반디: \"넷째 장은 늪 두꺼비 왕이 통째로 삼켜 버렸어. 구미호랑 물귀신도 이 늪에 산대.\"\n무영: \"안개 속에서는 눈보다 귀를 믿어라. 그리고 아무 약속도 하지 마라.\"":"A swamp where rotten water and poison mist swallow even the light.\nBandi: \"The Swamp Toad King swallowed the fourth chapter whole. They say gumiho and water ghosts live in this swamp too.\"\nMuyeong: \"In the mist, trust your ears over your eyes. And make no promises to anyone.\"","썩은 물과 독 안개가 빛마저 삼키는 늪.":"A swamp where rotten water and poison mist swallow even the light.","넷째 장은 늪 두꺼비 왕이 통째로 삼켜 버렸어. 구미호랑 물귀신도 이 늪에 산대.":"The Swamp Toad King swallowed the fourth chapter whole. They say gumiho and water ghosts live in this swamp too.","안개 속에서는 눈보다 귀를 믿어라. 그리고 아무 약속도 하지 마라.":"In the mist, trust your ears over your eyes. And make no promises to anyone.","미궁의 맨 아래. 산 사람이 와서는 안 되는 곳.\n저승사자가 마지막 장을 명부 사이에 끼워 두고, 요괴록의 주인을 기다리고 있다.\n반디: \"여기 너무 조용해. 내 빛도 작아지는 것 같아.\"\n나: \"반디, 내 등불 옆에 붙어 있어.\"":"The very bottom of the labyrinth. A place no living soul should come.\nThe jeoseung saja has tucked the last chapter among the ledgers of the dead, and waits for the master of the Yogoerok.\nBandi: \"It's so quiet here. Even my light feels like it's shrinking.\"\nMe: \"Bandi, stay close to my lantern.\"","미궁의 맨 아래. 산 사람이 와서는 안 되는 곳.":"The very bottom of the labyrinth. A place no living soul should come.","저승사자가 마지막 장을 명부 사이에 끼워 두고, 요괴록의 주인을 기다리고 있다.":"The jeoseung saja has tucked the last chapter among the ledgers of the dead, and waits for the master of the Yogoerok.","여기 너무 조용해. 내 빛도 작아지는 것 같아.":"It's so quiet here. Even my light feels like it's shrinking.","반디, 내 등불 옆에 붙어 있어.":"Bandi, stay close to my lantern.","조선 팔도의 요괴를 붓으로 묶어 둔 책이 있었다. 사람들은 그 책을 요괴록이라 불렀다.\n어느 그믐밤, 책을 모셔 둔 사당에 검은 바람이 불어닥쳤다.\n그림자 도깨비 왕: \"이까짓 종이 쪼가리에 우리가 몇백 년을 갇혀 있었단 말이냐!\"\n책은 다섯 갈래로 찢겼고, 풀려난 요괴들은 땅 밑 미궁으로 숨어들었다.\n달래 할멈: \"늦었구나. 아니, 아직 늦지 않았다. 네가 왔으니.\"\n달래 할멈: \"찢긴 장을 모두 되찾아 다시 묶어라. 그러지 못하면 요괴가 이 땅을 덮는다.\"\n반디: \"안녕! 나는 이 책의 정령 반디야. 찢긴 장이 있는 곳은 내가 느낄 수 있어.\"\n나: \"길을 알려 줘. 내가 다녀올게.\"":"There was once a book that bound the yokai of all eight provinces of Joseon with a brush. People called it the Yogoerok.\nOn a moonless night, a black wind swept into the shrine where the book was kept.\nShadow Dokkaebi King: \"Hundreds of years, locked away by a scrap of paper like this!\"\nThe book was torn into five parts, and the freed yokai slipped into the labyrinth beneath the earth.\nGrandma Dallae: \"You're late. No... not too late. Not now that you're here.\"\nGrandma Dallae: \"Win back every torn chapter and bind them anew. If you fail, the yokai will cover this land.\"\nBandi: \"Hello! I'm Bandi, the spirit of this book. I can sense where the torn chapters are.\"\nMe: \"Show me the way. I'll go.\"","조선 팔도의 요괴를 붓으로 묶어 둔 책이 있었다. 사람들은 그 책을 요괴록이라 불렀다.":"There was once a book that bound the yokai of all eight provinces of Joseon with a brush. People called it the Yogoerok.","어느 그믐밤, 책을 모셔 둔 사당에 검은 바람이 불어닥쳤다.":"On a moonless night, a black wind swept into the shrine where the book was kept.","이까짓 종이 쪼가리에 우리가 몇백 년을 갇혀 있었단 말이냐!":"Hundreds of years, locked away by a scrap of paper like this!","책은 다섯 갈래로 찢겼고, 풀려난 요괴들은 땅 밑 미궁으로 숨어들었다.":"The book was torn into five parts, and the freed yokai slipped into the labyrinth beneath the earth.","늦었구나. 아니, 아직 늦지 않았다. 네가 왔으니.":"You're late. No... not too late. Not now that you're here.","찢긴 장을 모두 되찾아 다시 묶어라. 그러지 못하면 요괴가 이 땅을 덮는다.":"Win back every torn chapter and bind them anew. If you fail, the yokai will cover this land.","안녕! 나는 이 책의 정령 반디야. 찢긴 장이 있는 곳은 내가 느낄 수 있어.":"Hello! I'm Bandi, the spirit of this book. I can sense where the torn chapters are.","길을 알려 줘. 내가 다녀올게.":"Show me the way. I'll go.","어둠 속에서 두억시니와 외다리 도깨비가 길을 막아선다.\n반디: \"이 녀석들, 찢어진 첫째 장의 기운을 먹고 덩치가 커졌어!\"\n무영: \"큰 놈일수록 발밑이 느리다. 옆으로 돌아라.\"\n나: \"하나씩 묶어 두자.\"":"Out of the darkness, a dueoksini and a one-legged dokkaebi block the path.\nBandi: \"These guys fed on the energy of the torn first chapter and grew huge!\"\nMuyeong: \"The bigger they are, the slower their feet. Circle around them.\"\nMe: \"Let's bind them one by one.\"","어둠 속에서 두억시니와 외다리 도깨비가 길을 막아선다.":"Out of the darkness, a dueoksini and a one-legged dokkaebi block the path.","이 녀석들, 찢어진 첫째 장의 기운을 먹고 덩치가 커졌어!":"These guys fed on the energy of the torn first chapter and grew huge!","큰 놈일수록 발밑이 느리다. 옆으로 돌아라.":"The bigger they are, the slower their feet. Circle around them.","하나씩 묶어 두자.":"Let's bind them one by one.","석굴 맨 안쪽. 검은 도포에 깨진 갓을 쓴 도깨비 왕이 방망이를 어깨에 걸쳤다.\n그림자 도깨비 왕: \"책 따위로 우리를 다시 묶겠다고?\"\n그림자 도깨비 왕: \"금 나와라 뚝딱! 아니지, 너의 목이나 나와라!\"\n반디: \"저 방망이를 부러뜨리면 첫째 장이 풀려날 거야!\"":"Deep within the grotto, the dokkaebi king in a black robe and a cracked gat rests his club on his shoulder.\nShadow Dokkaebi King: \"You think a mere book can bind us again?\"\nShadow Dokkaebi King: \"Gold, come out, ttukttak! Ah, no... how about your head instead!\"\nBandi: \"If we break that club, the first chapter will be freed!\"","석굴 맨 안쪽. 검은 도포에 깨진 갓을 쓴 도깨비 왕이 방망이를 어깨에 걸쳤다.":"Deep within the grotto, the dokkaebi king in a black robe and a cracked gat rests his club on his shoulder.","책 따위로 우리를 다시 묶겠다고?":"You think a mere book can bind us again?","금 나와라 뚝딱! 아니지, 너의 목이나 나와라!":"Gold, come out, ttukttak! Ah, no... how about your head instead!","저 방망이를 부러뜨리면 첫째 장이 풀려날 거야!":"If we break that club, the first chapter will be freed!","방망이가 부러지자 찢긴 첫째 장이 반딧불처럼 날아와 책에 붙었다.\n그림자 도깨비 왕: \"웃기지 마라. 책을 찢게 만든 건 내가 아니다. 진짜 주인은 저 아래에 있지.\"\n반디: \"진짜 주인? 무슨 소리야?\"\n무영: \"신경 쓰지 마라. 요괴는 지는 순간에도 거짓말을 한다.\"\n하지만 무영의 손은 칼자루를 꽉 쥐고 있었다.\n반디: \"아래층에서 찬 바람이 불어와. 둘째 장이야.\"":"As the club snapped, the torn first chapter drifted over like a firefly and fastened itself to the book.\nShadow Dokkaebi King: \"Don't make me laugh. I'm not the one who made the book tear. The true master is down below.\"\nBandi: \"The true master? What does he mean?\"\nMuyeong: \"Pay it no mind. Yokai lie even in the moment of defeat.\"\nYet Muyeong's hand gripped his sword hilt tightly.\nBandi: \"A cold wind is blowing up from the floor below. It's the second chapter.\"","방망이가 부러지자 찢긴 첫째 장이 반딧불처럼 날아와 책에 붙었다.":"As the club snapped, the torn first chapter drifted over like a firefly and fastened itself to the book.","웃기지 마라. 책을 찢게 만든 건 내가 아니다. 진짜 주인은 저 아래에 있지.":"Don't make me laugh. I'm not the one who made the book tear. The true master is down below.","진짜 주인? 무슨 소리야?":"The true master? What are you talking about?","신경 쓰지 마라. 요괴는 지는 순간에도 거짓말을 한다.":"Pay it no mind. A yokai lies even in the moment of defeat.","하지만 무영의 손은 칼자루를 꽉 쥐고 있었다.":"Yet Muyeong's hand was gripping his sword hilt tight.","아래층에서 찬 바람이 불어와. 둘째 장이야.":"A cold wind is blowing up from the floor below. It's Chapter Two.","흰 털을 늘어뜨린 장산범이 누군가의 목소리를 흉내 내며 부른다.\n장산범: \"이리 와. 이리 와 보렴.\"\n반디: \"할멈 목소리야! 할멈이 여기 왜?\"\n무영: \"대답하지 마라. 저 소리는 사람이 아니다.\"":"A white-furred Jangsanbeom calls out, mimicking someone's voice.\nJangsanbeom: \"Come here. Come here, child.\"\nBandi: \"That's Grandma's voice! Why is she here?\"\nMuyeong: \"Don't answer. That sound is not a person.\"","흰 털을 늘어뜨린 장산범이 누군가의 목소리를 흉내 내며 부른다.":"A white-furred Jangsanbeom calls out, mimicking someone's voice.","이리 와. 이리 와 보렴.":"Come here. Come here, child.","할멈 목소리야! 할멈이 여기 왜?":"That's Grandma's voice! Why is she here?","대답하지 마라. 저 소리는 사람이 아니다.":"Don't answer. That sound is not a person.","얼어붙은 두정갑, 고드름이 맺힌 월도. 원한을 품고 죽은 장군이 일어선다.\n서리 장군: \"이 땅을 지키다 얼어 죽은 나를, 너희가 기억이나 하느냐!\"\n나: \"기억하려고 왔습니다. 당신 부대의 깃발도 가져왔어요.\"\n서리 장군: \"깃발이라고? 거짓말 마라! 칼로 증명해라!\"":"Frozen studded armor, a crescent blade hung with icicles. A general who died in bitter resentment rises.\nFrost General: \"I froze to death guarding this land. Do you even remember me?!\"\nMe: \"I came to remember. I even brought your regiment's banner.\"\nFrost General: \"A banner? Don't lie to me! Prove it with your blade!\"","얼어붙은 두정갑, 고드름이 맺힌 월도. 원한을 품고 죽은 장군이 일어선다.":"Frozen studded armor, a crescent blade hung with icicles. A general who died in bitter resentment rises.","이 땅을 지키다 얼어 죽은 나를, 너희가 기억이나 하느냐!":"I froze to death guarding this land. Do you even remember me?!","기억하려고 왔습니다. 당신 부대의 깃발도 가져왔어요.":"I came to remember. I even brought your regiment's banner.","깃발이라고? 거짓말 마라! 칼로 증명해라!":"A banner? Don't lie to me! Prove it with your blade!","얼음이 녹으며 장군의 원한도 함께 풀려 갔다.\n서리 장군: \"내 이름을 불러 준 이가 있었구나. 고맙다, 토벌꾼.\"\n장군은 둘째 장을 내밀고, 병사들의 그림자와 함께 눈처럼 흩어졌다.\n무영: \"다음은 불이다. 쇠가 녹는 냄새가 올라오는군.\"":"As the ice melted, the general's grudge thawed with it.\nFrost General: \"So someone did call out my name. Thank you, bounty hunter.\"\nThe general held out Chapter Two, then scattered like snow along with his soldiers' shadows.\nMuyeong: \"Fire is next. I smell melting iron rising.\"","얼음이 녹으며 장군의 원한도 함께 풀려 갔다.":"As the ice melted, the general's grudge thawed with it.","내 이름을 불러 준 이가 있었구나. 고맙다, 토벌꾼.":"So someone did call out my name. Thank you, bounty hunter.","장군은 둘째 장을 내밀고, 병사들의 그림자와 함께 눈처럼 흩어졌다.":"The general held out Chapter Two, then scattered like snow along with his soldiers' shadows.","다음은 불이다. 쇠가 녹는 냄새가 올라오는군.":"Fire is next. I smell melting iron rising.","쇠를 먹고 자라는 불가사리가 모루를 통째로 삼키고 있다.\n반디: \"저 녀석이 대장간 무쇠를 다 먹으면 칼도 안 들어가!\"\n무영: \"그 전에 끝낸다. 따라와라.\"":"A bulgasari, grown fat on iron, is swallowing an anvil whole.\nBandi: \"If that thing eats all the forge's iron, our blades won't cut at all!\"\nMuyeong: \"We finish it before then. Follow me.\"","쇠를 먹고 자라는 불가사리가 모루를 통째로 삼키고 있다.":"A bulgasari, grown fat on iron, is swallowing an anvil whole.","저 녀석이 대장간 무쇠를 다 먹으면 칼도 안 들어가!":"If that thing eats all the forge's iron, our blades won't cut at all!","그 전에 끝낸다. 따라와라.":"We finish it before then. Follow me.","용암 같은 갈기, 불타는 붉은 옷. 불 도깨비 왕이 쇠못 박힌 방망이를 화로에서 꺼낸다.\n불 도깨비 왕: \"셋째 장? 이 불 속에 던져 넣었지. 꺼내 가 보시게!\"\n불 도깨비 왕: \"이름 없는 사냥꾼도 왔구먼. 이번엔 무엇을 팔러 왔나?\"\n무영: \"입 다물어라.\"":"A mane like lava, robes of blazing red. The Fire Dokkaebi King pulls an iron-studded club from the furnace.\nFire Dokkaebi King: \"Chapter Three? I threw it into this fire. Go on, fetch it out!\"\nFire Dokkaebi King: \"The nameless hunter has come too, eh? What are you here to sell this time?\"\nMuyeong: \"Shut your mouth.\"","용암 같은 갈기, 불타는 붉은 옷. 불 도깨비 왕이 쇠못 박힌 방망이를 화로에서 꺼낸다.":"A mane like lava, robes of blazing red. The Fire Dokkaebi King pulls an iron-studded club from the furnace.","셋째 장? 이 불 속에 던져 넣었지. 꺼내 가 보시게!":"Chapter Three? I threw it into this fire. Go on, fetch it out!","이름 없는 사냥꾼도 왔구먼. 이번엔 무엇을 팔러 왔나?":"The nameless hunter has come too, eh? What are you here to sell this time?","입 다물어라.":"Shut your mouth.","화로가 식자 잿더미 속에서 타지 않은 셋째 장이 나왔다. 요괴록은 불에 타지 않는다.\n반디: \"셋째 장 뒷면에, 이름이 비어 있는 칸이 하나 있어.\"\n달래 할멈: \"들리느냐. 이제 늪이다. 숨을 아껴라.\"\n달래 할멈: \"그리고 무영에게 전해라. 빈칸은 언젠가 채워진다고.\"":"When the furnace cooled, an unburnt Chapter Three emerged from the ashes. The Yogoerok does not burn.\nBandi: \"On the back of Chapter Three, there's one blank space where a name should be.\"\nGrandma Dallae: \"Can you hear me? A swamp lies ahead now. Save your breath.\"\nGrandma Dallae: \"And tell Muyeong this: a blank space is filled in someday.\"","화로가 식자 잿더미 속에서 타지 않은 셋째 장이 나왔다. 요괴록은 불에 타지 않는다.":"When the furnace cooled, an unburnt Chapter Three emerged from the ashes. The Yogoerok does not burn.","셋째 장 뒷면에, 이름이 비어 있는 칸이 하나 있어.":"On the back of Chapter Three, there's one blank space where a name should be.","들리느냐. 이제 늪이다. 숨을 아껴라.":"Can you hear me? A swamp lies ahead now. Save your breath.","그리고 무영에게 전해라. 빈칸은 언젠가 채워진다고.":"And tell Muyeong this: a blank space is filled in someday.","아홉 꼬리를 늘어뜨린 여인이 안개 속에서 웃는다. 구미호다.\n구미호: \"요괴록에 다시 갇히느니, 너의 간을 먹고 사람이 되겠다.\"\n구미호: \"아니면 거래할까? 저 사냥꾼의 이름을 찾아 주지. 대신 그 책을 내놓으렴.\"\n무영: \"들을 것 없다. 칼을 뽑아라.\"":"A woman trailing nine tails laughs in the mist. A gumiho.\nGumiho: \"Rather than be sealed in the Yogoerok again, I'll eat your liver and become human.\"\nGumiho: \"Or shall we bargain? I'll find that hunter's name for you. In exchange, hand over that book.\"\nMuyeong: \"Don't listen. Draw your blade.\"","아홉 꼬리를 늘어뜨린 여인이 안개 속에서 웃는다. 구미호다.":"A woman trailing nine tails laughs in the mist. A gumiho.","요괴록에 다시 갇히느니, 너의 간을 먹고 사람이 되겠다.":"Rather than be sealed in the Yogoerok again, I'll eat your liver and become human.","아니면 거래할까? 저 사냥꾼의 이름을 찾아 주지. 대신 그 책을 내놓으렴.":"Or shall we bargain? I'll find that hunter's name for you. In exchange, hand over that book.","들을 것 없다. 칼을 뽑아라.":"Don't listen. Draw your blade.","동전 목걸이를 주렁주렁 단 거대한 금두꺼비가 갓을 쓰고 앉아 있다.\n늪 두꺼비 왕: \"개굴! 그 장은 아주 맛있었지. 너도 맛 좀 볼까?\"":"A giant golden toad, draped in strings of coins, sits wearing a gat.\nSwamp Toad King: \"Ribbit! That chapter was delicious. Care for a taste yourself?\"","동전 목걸이를 주렁주렁 단 거대한 금두꺼비가 갓을 쓰고 앉아 있다.":"A giant golden toad, draped in strings of coins, sits wearing a gat.","개굴! 그 장은 아주 맛있었지. 너도 맛 좀 볼까?":"Ribbit! That chapter was delicious. Care for a taste yourself?","두꺼비 왕이 넷째 장을 토하자, 늪의 안개가 걷혔다.\n반디: \"마지막 장은 저승에 있어. 살아 있는 사람은 못 가는 곳인데.\"\n무영: \"요괴를 쫓는 자는 이미 반쯤 저승 사람이다. 가자.\"\n무영: \"이번엔 끝까지 간다. 이번엔 혼자가 아니니까.\"":"When the Toad King spat out Chapter Four, the swamp mist lifted.\nBandi: \"The last chapter is in the underworld. The living can't go there.\"\nMuyeong: \"One who hunts yokai is already half a dweller of the underworld. Let's go.\"\nMuyeong: \"This time I go all the way. This time, I'm not alone.\"","두꺼비 왕이 넷째 장을 토하자, 늪의 안개가 걷혔다.":"When the Toad King spat out Chapter Four, the swamp mist lifted.","마지막 장은 저승에 있어. 살아 있는 사람은 못 가는 곳인데.":"The last chapter is in the underworld. The living can't go there.","요괴를 쫓는 자는 이미 반쯤 저승 사람이다. 가자.":"One who hunts yokai is already half a dweller of the underworld. Let's go.","이번엔 끝까지 간다. 이번엔 혼자가 아니니까.":"This time I go all the way. This time, I'm not alone.","저승의 문지기들":"Gatekeepers of the Underworld","소머리와 말머리를 한 옥졸, 붓을 든 판관, 해치 수문장이 길을 막는다.\n판관: \"이름이 명부에 없는 자는 이 문을 지날 수 없다.\"\n판관: \"거기, 이름 없는 사냥꾼. 너는 십 년 전에 이미 값을 치렀다. 돌아가라.\"\n무영: \"이번엔 값을 받으러 왔다.\"":"Ox-headed and horse-headed jailers, a brush-wielding magistrate, and a haetae gate guardian block the path.\nMagistrate: \"None whose name is absent from the register may pass this gate.\"\nMagistrate: \"You there, nameless hunter. You already paid your price ten years ago. Turn back.\"\nMuyeong: \"This time, I've come to collect.\"","소머리와 말머리를 한 옥졸, 붓을 든 판관, 해치 수문장이 길을 막는다.":"Ox-headed and horse-headed jailers, a brush-wielding magistrate, and a haetae gate guardian block the path.","판관":"Magistrate","이름이 명부에 없는 자는 이 문을 지날 수 없다.":"None whose name is absent from the register may pass this gate.","거기, 이름 없는 사냥꾼. 너는 십 년 전에 이미 값을 치렀다. 돌아가라.":"You there, nameless hunter. You already paid your price ten years ago. Turn back.","이번엔 값을 받으러 왔다.":"This time, I've come to collect.","저승사자":"Jeoseung Saja","검은 갓, 검은 도포, 붉은 오랏줄. 저승사자가 명부를 펼친다.\n저승사자: \"요괴록에 묶인 것들도, 그 책을 쥔 너도, 결국은 모두 내 장부에 적힌다.\"\n저승사자: \"사냥꾼. 이번엔 무엇을 내놓겠느냐. 남은 것은 목숨뿐일 텐데.\"\n나: \"이번엔 아무것도 내놓지 않아. 되찾으러 왔으니까.\"":"A black gat, a black robe, a crimson rope. The Jeoseung Saja unfurls the register.\nJeoseung Saja: \"Those bound in the Yogoerok, and you who hold that book—all will be written in my ledger in the end.\"\nJeoseung Saja: \"Hunter. What will you give up this time? Only your life remains.\"\nMe: \"I'll give up nothing this time. I came to take it back.\"","검은 갓, 검은 도포, 붉은 오랏줄. 저승사자가 명부를 펼친다.":"A black gat, a black robe, a crimson rope. The Jeoseung Saja unfurls the register.","요괴록에 묶인 것들도, 그 책을 쥔 너도, 결국은 모두 내 장부에 적힌다.":"Those bound in the Yogoerok, and you who hold that book—all will be written in my ledger in the end.","사냥꾼. 이번엔 무엇을 내놓겠느냐. 남은 것은 목숨뿐일 텐데.":"Hunter. What will you give up this time? Only your life remains.","이번엔 아무것도 내놓지 않아. 되찾으러 왔으니까.":"I'll give up nothing this time. I came to take it back.","다섯째 장":"Chapter Five","명부가 덮이고, 다섯째 장이 마지막으로 요괴록에 묶였다.\n토벌꾼은 판관의 붓을 들어, 셋째 장 뒷면의 빈칸에 한 글자씩 이름을 적었다.\n반디: \"무영. 아니, 이제 진짜 이름으로 불러야겠네.\"\n무영: \"오래 잊고 있었다. 내 이름이 이렇게 생겼었군.\"\n찢어졌던 책이 한 권으로 붙으며, 미궁의 요괴들이 한 줄기 빛이 되어 책 속으로 빨려 들어갔다.":"The registry closed, and the fifth chapter was bound into the Yogoerok at last.\nThe hunter took up the magistrate's brush and wrote a name, one character at a time, in the blank space on the back of the third chapter.\nBandi: \"Muyeong. No, now we have to call you by your true name.\"\nMuyeong: \"I forgot it for so long. So this is what my name looks like.\"\nAs the torn book joined into one volume, the yokai of the labyrinth turned into a single stream of light and were drawn into its pages.","명부가 덮이고, 다섯째 장이 마지막으로 요괴록에 묶였다.":"The registry closed, and the fifth chapter was bound into the Yogoerok at last.","토벌꾼은 판관의 붓을 들어, 셋째 장 뒷면의 빈칸에 한 글자씩 이름을 적었다.":"The hunter took up the magistrate's brush and wrote a name, one character at a time, in the blank space on the back of the third chapter.","무영. 아니, 이제 진짜 이름으로 불러야겠네.":"Muyeong. No, now we have to call you by your true name.","오래 잊고 있었다. 내 이름이 이렇게 생겼었군.":"I forgot it for so long. So this is what my name looks like.","찢어졌던 책이 한 권으로 붙으며, 미궁의 요괴들이 한 줄기 빛이 되어 책 속으로 빨려 들어갔다.":"As the torn book joined into one volume, the yokai of the labyrinth turned into a single stream of light and were drawn into its pages.","다시 묶인 요괴록":"The Yogoerok, Bound Anew","토벌꾼이 미궁을 나서자 마을에 아침 해가 떠올랐다.\n달래 할멈: \"잘했다. 다섯 장이 모두 돌아왔구나.\"\n달래 할멈: \"하지만 기억해라. 요괴록은 언제든 다시 찢어질 수 있는 책이란다.\"\n반디: \"그땐 또 같이 가면 되지! 그렇지?\"\n미궁 깊은 곳에서는 아직 책에 묶이지 않은 요괴들이 끝없이 몰려오고 있었다.":"As the hunter stepped out of the labyrinth, the morning sun rose over the village.\nGranny Dallae: \"Well done. All five chapters have come home.\"\nGranny Dallae: \"But remember this: the Yogoerok is a book that can be torn apart again at any time.\"\nBandi: \"Then we'll just go together again! Right?\"\nDeep in the labyrinth, yokai not yet bound to the book kept pouring forth without end.","토벌꾼이 미궁을 나서자 마을에 아침 해가 떠올랐다.":"As the hunter stepped out of the labyrinth, the morning sun rose over the village.","잘했다. 다섯 장이 모두 돌아왔구나.":"Well done. All five chapters have come home.","하지만 기억해라. 요괴록은 언제든 다시 찢어질 수 있는 책이란다.":"But remember this: the Yogoerok is a book that can be torn apart again at any time.","그땐 또 같이 가면 되지! 그렇지?":"Then we'll just go together again! Right?","미궁 깊은 곳에서는 아직 책에 묶이지 않은 요괴들이 끝없이 몰려오고 있었다.":"Deep in the labyrinth, yokai not yet bound to the book kept pouring forth without end.","석굴 벽에 누군가 칼끝으로 새긴 표식이 남아 있다.\n반디: \"이거, 요괴 토벌꾼의 표식이야. 오래전에도 누가 여기 내려왔었나 봐.\"\n표식 옆에 이름이 하나 적혀 있었지만, 긁혀서 읽을 수가 없었다.\n무영: \"남의 이름을 들여다보는 취미라도 있나.\"\n반디: \"깜짝이야! 누, 누구세요?\"\n무영: \"무영이라 불러라. 너희보다 먼저 이 미궁을 쫓던 사람이다.\"\n무영: \"그림자 도깨비 왕은 등불이 흔들릴 때 덤빈다. 발걸음을 멈추지 마라.\"":"A mark carved with a blade's tip remains on the cave wall.\nBandi: \"This is a yokai hunter's mark. Someone must have come down here long ago, too.\"\nA name had been written beside the mark, but it was scratched out and unreadable.\nMuyeong: \"Do you make a hobby of peering at other people's names?\"\nBandi: \"Eek! Wh-who are you?\"\nMuyeong: \"Call me Muyeong. I chased this labyrinth before you ever did.\"\nMuyeong: \"The Shadow Dokkaebi King strikes when the lantern flickers. Never stop moving.\"","석굴 벽에 누군가 칼끝으로 새긴 표식이 남아 있다.":"A mark carved with a blade's tip remains on the cave wall.","이거, 요괴 토벌꾼의 표식이야. 오래전에도 누가 여기 내려왔었나 봐.":"This is a yokai hunter's mark. Someone must have come down here long ago, too.","표식 옆에 이름이 하나 적혀 있었지만, 긁혀서 읽을 수가 없었다.":"A name had been written beside the mark, but it was scratched out and unreadable.","남의 이름을 들여다보는 취미라도 있나.":"Do you make a hobby of peering at other people's names?","깜짝이야! 누, 누구세요?":"Eek! Wh-who are you?","무영이라 불러라. 너희보다 먼저 이 미궁을 쫓던 사람이다.":"Call me Muyeong. I chased this labyrinth before you ever did.","그림자 도깨비 왕은 등불이 흔들릴 때 덤빈다. 발걸음을 멈추지 마라.":"The Shadow Dokkaebi King strikes when the lantern flickers. Never stop moving.","깊이 들어갈수록 석굴은 무덤이 아니라 궁궐처럼 넓어졌다.\n반디: \"저기 봐. 찢긴 종이 조각이 불빛을 따라 날고 있어.\"\n무영: \"첫째 장이 우릴 부르는 거다. 그리고 그 녀석도.\"\n멀리서 방망이로 바위를 두드리는 소리가 울렸다. 쿵, 쿵.":"The deeper they went, the more the cave widened, not like a tomb but like a palace.\nBandi: \"Look there. Scraps of torn paper are flying along the light.\"\nMuyeong: \"The first chapter is calling us. And so is that fellow.\"\nFrom afar came the sound of a club pounding on rock. Thud, thud.","깊이 들어갈수록 석굴은 무덤이 아니라 궁궐처럼 넓어졌다.":"The deeper they went, the more the cave widened, not like a tomb but like a palace.","저기 봐. 찢긴 종이 조각이 불빛을 따라 날고 있어.":"Look there. Scraps of torn paper are flying along the light.","첫째 장이 우릴 부르는 거다. 그리고 그 녀석도.":"The first chapter is calling us. And so is that fellow.","멀리서 방망이로 바위를 두드리는 소리가 울렸다. 쿵, 쿵.":"From afar came the sound of a club pounding on rock. Thud, thud.","얼음 벽 속에 병사들의 그림자가 줄지어 서 있다. 모두 창을 든 채 굳어 있었다.\n반디: \"다들 기다리는 것 같아. 누가 데리러 오기를.\"\n무영: \"아무도 오지 않았지. 그게 이 동굴이 얼어붙은 이유다.\"":"Shadows of soldiers stand in rows within the ice walls, all frozen with spears in hand.\nBandi: \"They seem to be waiting. For someone to come and fetch them.\"\nMuyeong: \"No one ever came. That is why this cave froze over.\"","얼음 벽 속에 병사들의 그림자가 줄지어 서 있다. 모두 창을 든 채 굳어 있었다.":"Shadows of soldiers stand in rows within the ice walls, all frozen with spears in hand.","다들 기다리는 것 같아. 누가 데리러 오기를.":"They seem to be waiting. For someone to come and fetch them.","아무도 오지 않았지. 그게 이 동굴이 얼어붙은 이유다.":"No one ever came. That is why this cave froze over.","동굴 깊은 곳, 녹슨 깃발 하나가 얼음에 꽂혀 있다.\n반디: \"깃발에 글자가 수놓여 있어. 이건 장군이 이끌던 부대의 이름이야.\"\n나: \"이 깃발, 가져가서 장군에게 보여 주자.\"\n무영: \"칼보다 마음이 먼저 나가는군. 나쁘지 않다.\"":"Deep in the cave, a rusted banner is planted in the ice.\nBandi: \"There are characters embroidered on the banner. It's the name of the unit the general led.\"\nMe: \"Let's take this banner and show it to the general.\"\nMuyeong: \"Your heart moves before your blade. Not bad.\"","동굴 깊은 곳, 녹슨 깃발 하나가 얼음에 꽂혀 있다.":"Deep in the cave, a rusted banner is planted in the ice.","깃발에 글자가 수놓여 있어. 이건 장군이 이끌던 부대의 이름이야.":"There are characters embroidered on the banner. It's the name of the unit the general led.","이 깃발, 가져가서 장군에게 보여 주자.":"Let's take this banner and show it to the general.","칼보다 마음이 먼저 나가는군. 나쁘지 않다.":"Your heart moves before your blade. Not bad.","모루 위에 반쯤 만들다 만 칼 한 자루가 놓여 있다. 손잡이에 낯익은 무늬가 새겨져 있었다.\n반디: \"무영, 이거 무영 칼이랑 무늬가 똑같아!\"\n무영: \"옛날에 잃어버린 칼이다. 신경 쓰지 마라.\"\n반디: \"신경 쓰지 말라는 말, 오늘만 세 번째야.\"":"A half-forged sword lies on the anvil. A familiar pattern is carved into its hilt.\nBandi: \"Muyeong, this pattern is exactly the same as your sword's!\"\nMuyeong: \"A blade I lost long ago. Pay it no mind.\"\nBandi: \"That's the third time today you've told me not to mind.\"","모루 위에 반쯤 만들다 만 칼 한 자루가 놓여 있다. 손잡이에 낯익은 무늬가 새겨져 있었다.":"A half-forged sword lies on the anvil. A familiar pattern is carved into its hilt.","무영, 이거 무영 칼이랑 무늬가 똑같아!":"Muyeong, this pattern is exactly the same as your sword's!","옛날에 잃어버린 칼이다. 신경 쓰지 마라.":"A blade I lost long ago. Pay it no mind.","신경 쓰지 말라는 말, 오늘만 세 번째야.":"That's the third time today you've told me not to mind.","용암이 흐르는 다리 위에서 무영이 걸음을 멈췄다.\n무영: \"들어 둬라. 십 년 전, 나도 너처럼 요괴록의 장을 쫓았다.\"\n무영: \"마지막 장 앞에서 나는 졌다. 그리고 저승사자와 거래를 했지.\"\n나: \"무슨 거래였어요?\"\n무영: \"내 이름을 주고, 목숨을 받았다. 그래서 나는 이름이 없다.\"\n반디: \"그래서 석굴 표식의 이름이 긁혀 있었던 거구나.\"":"On a bridge over flowing lava, Muyeong stopped walking.\nMuyeong: \"Listen well. Ten years ago, I too chased the chapters of the Yogoerok, just as you do.\"\nMuyeong: \"I lost before the final chapter. And I made a bargain with a jeoseung saja.\"\nMe: \"What kind of bargain?\"\nMuyeong: \"I gave my name and received my life. That is why I have no name.\"\nBandi: \"So that's why the name on the cave mark was scratched out.\"","용암이 흐르는 다리 위에서 무영이 걸음을 멈췄다.":"On a bridge over flowing lava, Muyeong stopped walking.","들어 둬라. 십 년 전, 나도 너처럼 요괴록의 장을 쫓았다.":"Listen well. Ten years ago, I too chased the chapters of the Yogoerok, just as you do.","마지막 장 앞에서 나는 졌다. 그리고 저승사자와 거래를 했지.":"I lost before the final chapter. And I made a bargain with a jeoseung saja.","무슨 거래였어요?":"What kind of bargain?","내 이름을 주고, 목숨을 받았다. 그래서 나는 이름이 없다.":"I gave my name and received my life. That is why I have no name.","그래서 석굴 표식의 이름이 긁혀 있었던 거구나.":"So that's why the name on the cave mark was scratched out.","안개 너머로 장터 불빛이 보인다. 늪 한가운데 열린 요괴들의 장이다.\n반디: \"저기 봐, 사람 그림자도 있어!\"\n무영: \"사람이 아니다. 이름을 팔아 버린 자들이지. 여기선 이름이 엽전 대신 쓰인다.\"\n나: \"무영, 당신 이름도 여기서 팔렸어요?\"\n무영: \"아니. 내 이름은 더 비싼 곳에 있다.\"":"Beyond the mist, the lights of a market glimmer. It is a yokai market, open in the heart of the swamp.\nBandi: \"Look, there are human shadows too!\"\nMuyeong: \"They're not human. They're those who sold off their names. Here, names are used in place of brass coins.\"\nMe: \"Muyeong, was your name sold here too?\"\nMuyeong: \"No. My name lies somewhere far more costly.\"","안개 너머로 장터 불빛이 보인다. 늪 한가운데 열린 요괴들의 장이다.":"Beyond the mist, the lights of a market glimmer. It is a yokai market, open in the heart of the swamp.","저기 봐, 사람 그림자도 있어!":"Look, there are human shadows too!","사람이 아니다. 이름을 팔아 버린 자들이지. 여기선 이름이 엽전 대신 쓰인다.":"They're not human. They're those who sold off their names. Here, names are used in place of brass coins.","무영, 당신 이름도 여기서 팔렸어요?":"Muyeong, was your name sold here too?","아니. 내 이름은 더 비싼 곳에 있다.":"No. My name lies somewhere far more costly.","늪 바닥이 울렁이며 거대한 동전 소리가 들려온다.\n반디: \"저 소리, 두꺼비 왕이 엽전을 세고 있어.\"\n무영: \"녀석은 욕심이 많다. 배가 부르면 느려지지.\"\n나: \"그럼 배부르게 해 주고 끝내자.\"":"The swamp floor heaves, and the clatter of enormous coins rises from below.\nBandi: \"That sound, it's the Toad King counting his brass coins.\"\nMuyeong: \"The brute is greedy. When his belly is full, he slows down.\"\nMe: \"Then let's feed him his fill and end this.\"","늪 바닥이 울렁이며 거대한 동전 소리가 들려온다.":"The swamp floor heaves, and the clatter of enormous coins rises from below.","저 소리, 두꺼비 왕이 엽전을 세고 있어.":"That sound, it's the Toad King counting his brass coins.","녀석은 욕심이 많다. 배가 부르면 느려지지.":"The brute is greedy. When his belly is full, he slows down.","그럼 배부르게 해 주고 끝내자.":"Then let's feed him his fill and end this.","명부의 서고":"The Registry Archive","끝없는 서고. 선반마다 사람들의 이름이 적힌 명부가 빼곡하다.\n반디: \"무영, 그럼 무영 이름도 여기 어딘가 있는 거야?\"\n무영: \"있었겠지. 지금은 지워진 자리만 남았을 거다.\"\n나: \"지워진 자리라도 찾으면, 다시 쓸 수 있지 않을까요.\"":"An endless archive. Every shelf is packed with registries bearing people's names.\nBandi: \"Muyeong, then is your name somewhere in here too?\"\nMuyeong: \"It must have been. Only an erased gap remains now, I'd wager.\"\nMe: \"Even if we only find the erased gap, couldn't we write it in again?\"","끝없는 서고. 선반마다 사람들의 이름이 적힌 명부가 빼곡하다.":"An endless archive. Every shelf is crammed with registers inscribed with people's names.","무영, 그럼 무영 이름도 여기 어딘가 있는 거야?":"Muyeong, so is your name somewhere in here too?","있었겠지. 지금은 지워진 자리만 남았을 거다.":"It would have been. Now only the erased spot must remain.","지워진 자리라도 찾으면, 다시 쓸 수 있지 않을까요.":"If we find even the erased spot, couldn't it be written again?","판관의 붓":"Judge's Brush","판관의 붓이 바닥에 떨어졌다. 붓끝에서 먹물 한 방울이 번져 글자가 되었다.\n반디: \"이 붓, 요괴록을 처음 쓴 붓이랑 같은 기운이야!\"\n나: \"이 붓이라면 빈칸을 채울 수 있어요. 무영, 당신 이름을요.\"\n무영: \"먼저 저승사자부터다.\"":"The Judge's Brush fell to the floor. A drop of ink spread from its tip and became a character.\nBandi: \"This brush has the same energy as the one that first wrote the Yogoerok!\"\nMe: \"With this brush, we can fill in the blank. Your name, Muyeong.\"\nMuyeong: \"The jeoseung saja come first.\"","판관의 붓이 바닥에 떨어졌다. 붓끝에서 먹물 한 방울이 번져 글자가 되었다.":"The Judge's Brush fell to the floor. A drop of ink spread from its tip and became a character.","이 붓, 요괴록을 처음 쓴 붓이랑 같은 기운이야!":"This brush has the same energy as the one that first wrote the Yogoerok!","이 붓이라면 빈칸을 채울 수 있어요. 무영, 당신 이름을요.":"With this brush, we can fill in the blank. Your name, Muyeong.","먼저 저승사자부터다.":"The jeoseung saja come first.","요괴 {0}마리 처치":"Defeat {0} yokai","보스 첫 처치":"Defeat your first boss","보스 {0}마리 처치":"Defeat {0} bosses","한 판에서 레벨 {0}":"Reach level {0} in one run","무한의 방 {0}번째 방 도달":"Reach room {0} in Endless Rooms","{0}대{1} 대전 첫 승리":"Win your first {0}v{1} Duel","뽑기 {0}번 뽑기":"Summon {0} times","영웅 {0}명 모으기":"Collect {0} heroes","[특수] 체력 {0}% 이상 남긴 채 보스 처치":"[Special] Defeat a boss with {0}%+ HP left","[특수] 내 체력 {0}% 이하에서 보스 처치":"[Special] Defeat a boss at {0}% HP or lower","[특수] 요괴 {0}마리 이상 방을 {1}초 안에 정리":"[Special] Clear a room of {0}+ yokai within {1}s","[특수] 맞지 않고 스테이지 하나 끝내기":"[Special] Clear a Stage without being hit","[특수] 스토리 {0}층 최종보스 처치":"[Special] Defeat the Story Floor {0} final boss","요괴록 {0}층 도감 완성 ({1}종)":"Complete the Yogoerok Floor {0} Bestiary ({1} types)","괴이한 방 {0}번 만나기":"Encounter {0} Strange Rooms","시련의 방 {0}번 통과":"Clear {0} Trial Rooms","오늘의 괴담 {0}번 도전":"Attempt the Daily Tale {0} times","연격 {0} 이어 가기":"Keep a {0} combo going","연격 {0} — 천하무쌍":"{0} combo — Peerless Under Heaven","혼불 {0} 모으기 (누적)":"Collect {0} Soulfire (total)","한 영웅 숙련 Lv.{0}":"Reach Mastery Lv.{0} with one hero","완벽 회피 {0}번":"Perform {0} Perfect Dodges","완벽 회피 {0}번 — 바람의 몸놀림":"{0} Perfect Dodges — Wind's Grace","한 영웅 숙련 Lv.{0} (옥 표식)":"Reach Mastery Lv.{0} with one hero (Jade Mark)","[숨은 업적] 층 보스 {0}번 처치 — 보스펫 '꼬마 도깨비 왕' 획득":"[Hidden] Defeat floor bosses {0} times — Earn boss pet 'Little Dokkaebi King'","[숨은 업적] 허수아비 {0}번 쓰러뜨리기 (+ 스토리 클리어 시 숨은 영웅 '짚신' 해금)":"[Hidden] Knock down scarecrows {0} times (+ Clear the story to unlock hidden hero 'Jipsin')","구르기(Space) 중에는 공격을 맞지 않아요":"You can't be hit while dodge rolling (Space)","붉은 영역은 곧 공격이 떨어지는 자리예요":"Red zones mark where an attack is about to land","보부상에게 다가가면 상점이 열려요":"Approach the Peddler to open the shop","혼불은 혼불 제단에서 모든 영웅을 강하게 해요":"Soulfire strengthens all heroes at the Soulfire Altar","같은 강화를 겹치면 레벨이 올라요":"Stacking the same blessing raises its level","요괴마다 약한 속성이 있어요 — 층 이름 아래를 보세요":"Each yokai has a weak element — check below the floor name","보스 전용":"Boss Only","번개":"Lightning","바람":"Wind","빛":"Light","대지":"Earth","혼":"Soul","저급":"Low","중급":"Mid","상급":"High","특급":"Supreme","정월 대보름에 부스럼을 막으려고 깨무는 것은?":"What do you crack open on the first full moon to ward off boils?","부럼":"Bureom (nuts)","송편":"Songpyeon","떡국":"Tteokguk","추석에 빚어 먹는 떡은?":"Which rice cake is shaped and eaten at Chuseok?","시루떡":"Sirutteok","인절미":"Injeolmi","두드리면 원하는 것이 나온다는 도깨비의 물건은?":"Which dokkaebi item gives you whatever you wish for when struck?","도깨비방망이":"Dokkaebi Club","요술 거울":"Magic Mirror","비단 부채":"Silk Fan","구미호의 꼬리는 몇 개일까?":"How many tails does a gumiho have?","아홉 개":"Nine","일곱 개":"Seven","다섯 개":"Five","'해와 달이 된 오누이'에서 오누이를 쫓은 짐승은?":"In \"The Sun and the Moon,\" what beast chased the siblings?","호랑이":"Tiger","여우":"Fox","곰":"Bear","견우와 직녀가 오작교에서 만나는 날은?":"On what day do Gyeonu and Jiknyeo meet on the Magpie Bridge?","칠월 칠석":"Chilseok (7th day of the 7th month)","단오":"Dano","동지":"Dongji","동짓날 귀신을 쫓으려고 먹는 음식은?":"What food is eaten on Dongji to ward off ghosts?","팥죽":"Red bean porridge","미역국":"Seaweed soup","수정과":"Sujeonggwa","아기가 태어나고 자라는 것을 돌본다는 신은?":"Which spirit watches over the birth and growth of children?","삼신할미":"Samsin Grandmother","조왕신":"Kitchen God","용왕":"Dragon King","설날 아침에 먹는 음식은?":"What food is eaten on Lunar New Year morning?","냉면":"Naengmyeon","삼계탕":"Samgyetang","칼은 무겁게, 마음은 가볍게. 그게 내 아버지의 가르침이었다.":"Heavy blade, light heart. That was my father's teaching.","앞장서겠소. 뒤는 맡기지.":"I'll take the lead. The rear is yours.","바람 소리를 읽으면 화살은 저절로 간다.":"Read the voice of the wind, and the arrow flies on its own.","창끝이 닿는 데까지가 내 땅이다.":"Wherever my spear tip reaches is my land.","길이에서 이기면 반은 이긴 거요.":"Win on reach, and you've won half the fight.","주먹은 미움이 아니라 고요에서 나온다.":"The fist springs not from hatred, but from stillness.","나무아미타불… 그럼 시작해 볼까.":"Namu Amitabul... Shall we begin?","화약 냄새가 나야 잠이 온다니까.":"I can't sleep without the smell of gunpowder.","심지 붙였어. 다들 귀 막아!":"Fuse is lit. Cover your ears, everyone!","방울이 울리면, 길 잃은 넋도 돌아온다.":"When the bells ring, even lost souls find their way home.","신령님, 오늘도 길을 밝혀 주소서.":"Spirits above, light my path once more today.","죽은 자는 거짓말을 하지 않지. 산 자보다 낫다.":"The dead never lie. Better company than the living.","일어나라. 아직 할 일이 남았다.":"Rise. There is still work to be done.","달이 없는 밤이 내 편이다.":"A moonless night is my ally.","…소리 내지 마.":"...Make no sound.","부적 한 장에 하늘과 땅의 이치가 다 들었다.":"A single talisman holds all the laws of heaven and earth.","급급여율령!":"Quick, quick, as the law commands!","음이 다하면 양이 오고, 양이 다하면 음이 온다.":"When yin ends, yang begins; when yang ends, yin returns.","오늘의 점괘는… 대길.":"Today's fortune is... great luck.","난 혼자 싸운 적이 없어. 늘 친구들이 있었지.":"I've never fought alone. I've always had friends.","얘들아, 나와!":"Come out, everyone!","생각은 끝나고 하는 거다.":"Think after it's over.","으아아아! 덤벼라!":"Aaaah! Come at me!","달빛 아래 한 번의 칼춤이면 충분해요.":"One sword dance beneath the moonlight is all I need.","달이 밝네요. 베기 좋은 밤이에요.":"The moon is bright. A fine night for cutting.","하늘이 노하면, 내가 그 노여움이다.":"When the heavens rage, I am that rage.","천둥 소리가 들리면 이미 늦은 거다.":"If you hear the thunder, it's already too late.","천 년을 기다렸어. 사람의 마음 하나 알려고.":"I waited a thousand years, just to understand one human heart.","여우비 오는 날엔 조심하는 게 좋아.":"Be careful on days of fox rain.","명부에 적힌 이름은 지워지지 않는다. 대개는.":"A name written in the registry is never erased. Usually.","때가 되었다.":"The time has come.","바다에서 살아남은 놈은 어디서든 살아남지.":"Whoever survives the sea can survive anywhere.","닻 올려라!":"Weigh anchor!","매가 먼저 본다. 나는 따라갈 뿐.":"The hawk sees first. I merely follow.","가자, 해동청.":"Let's go, Haedongcheong.","백두의 눈보라가 나를 길렀다.":"The blizzards of Baekdu raised me.","산의 주인이 내려간다.":"The lord of the mountain descends.","재가 되어도 다시 피어나는 게 주작이에요.":"Even turned to ash, the Vermilion Bird blooms again.","불꽃이여, 춤을 춰라.":"Flames, dance!","논밭 지키던 낫으로 나라도 지킨다.":"The sickle that guarded our fields will guard the realm.","이까짓 거, 모내기보다 쉽지!":"This? Easier than planting rice!","순라 돌다 보면 별의별 놈을 다 만나지.":"Walk the night patrol long enough and you'll meet all sorts.","독도 약도 한 뿌리에서 나와요.":"Poison and remedy grow from the same root.","다치면 말해요. 약은 넉넉해요.":"Tell me if you're hurt. I have plenty of medicine.","나무는 결 따라 쪼개야 잘 쪼개지는 법.":"Wood splits best along its grain.","어디, 한 번 패 볼까.":"Now, shall we give it a good whack?","춤이 칼이 되고, 칼이 춤이 되는 거예요.":"The dance becomes the blade, and the blade becomes the dance.","장단 맞춰 주세요.":"Keep the rhythm for me.","굿판엔 산 사람과 죽은 사람이 함께 서지.":"At a gut ritual, the living and the dead stand side by side.","어허, 신이 내리신다!":"Ahh, the spirit descends!","세속오계, 그중 임전무퇴.":"The Five Commandments of the Hwarang: never retreat in battle.","물러서지 않는다.":"I will not retreat.","마패 하나면 탐관오리도 요괴도 다 무릎 꿇지.":"One mapae seal, and corrupt officials and yokai alike kneel.","한 소리에 울고, 한 소리에 웃게 하는 게 소리꾼이오.":"A sorikkun makes you weep with one note and laugh with the next.","얼씨구, 한번 놀아 보세!":"Eolssigu! Let's make merry!","싸움에서 이기려면 먼저 마음에서 이겨야 한다.":"To win the battle, first win within your heart.","적의 계략은 이미 읽었다.":"I've already read the enemy's scheme.","하늘의 수레를 타고 내려온 지 오래구나.":"It's been long since I came down in the chariot of heaven.","하늘이 보고 있다.":"Heaven is watching.","새를 쫓던 허수아비가 이젠 요괴를 쫓는다네.":"The scarecrow that chased birds now chases yokai.","바람아, 도와다오!":"Wind, lend me your aid!","봉인 속에서 오래 잤더니 몸이 근질근질해.":"After sleeping so long in the seal, my body is itching to move.","냥! 아니, 크르릉!":"Meow! No, I mean—grrrowl!","화면 버튼 설정":"On-Screen Button Settings","왼쪽 아래 원":"The circle at bottom left","을 끌어서 이동해요.":"Drag it to move.","오른쪽 큰 칼 버튼":"The big sword button on the right","을 누르고 있으면 기본 공격 — 가장 가까운 요괴를 알아서 노려요.":"Hold it to attack — it automatically targets the nearest yokai.","작은 버튼":"Small buttons","은 스킬,":"is a skill,","는 궁극기,":"is the ultimate,","는 잠깐 무적,":"is brief invincibility,","는 주운 물건이에요.":"is your active item.","요괴를 손가락으로 누르면 그 요괴를 노려요(표적 고정).":"Tap a yokai with your finger to target it (target lock).","오른쪽 위 멈춤 버튼으로 멈추고, 설정의":"Pause with the top-right button. In Settings, turn on","을 켜면 공격 버튼을 누르지 않아도 돼요.":"and you won't need to press the attack button.","버튼이 작거나 가리면 설정 →":"If buttons are too small or in the way: Settings →","에서 크기·투명도를 바꿔요.":"to change size and opacity.","키보드를 연결했다면: 키 설정":"Keyboard connected? Key Settings","강화 '날 선 칼' — 공격력 +{0}%":"Blessing 'Keen Blade' — ATK +{0}%","강화 '불씨 깃든 칼'·'날 선 칼' — 대신 판 내내 강철의 저주 (요괴가 받는 피해 -{0}%)":"Blessings 'Emberforged Blade'·'Keen Blade' — instead, Curse of Steel for the whole run (yokai take -{0}% damage)","소리 · 화면 버튼 설정":"Sound · On-Screen Buttons","이 약초는 저 아랫마을 심마니한테서 떼 온 거요.":"I got this herb from a ginseng digger in the village below.","강화 · 일반":"Blessing · Common","구르기(구르기 버튼)는 잠깐 무적이에요. 붉은 영역이 사라지기 직전에 굴러 보세요.":"Dodge roll (the dodge roll button) grants brief invincibility. Roll just before the red zone disappears.","공격력 +{0}%, 최대 체력 +{1}%":"Attack +{0}%, Max HP +{1}%",": 켜져 있어요. 오류 보고(Sentry)는 오류가 난 때의 오류 내용·게임 버전·기기와 브라우저 종류·지금 모드를, 사용 통계(PostHog)는 판 시작·끝 같은 게임 안 행동을":": On. Error reports (Sentry) collect the error details, game version, device and browser type, and current mode when an error occurs. Usage stats (PostHog) collect in-game actions such as run start and end","소리·음악":"Sound & Music","언어 · Language":"Language · 언어","서장":"Prologue","자동":"Auto","지난 대사":"Past Dialogue","건너뛰기":"Skip","길을 알려 줘. 내가 다녀올":"Show me the way. I'll go and come back","WASD 로 움직여 보세요":"Move with WASD","마우스 왼쪽(또는 왼 Shift)으로 마우스 쪽을 공격해요":"Attack toward the cursor with Left Mouse (or Left Shift)","스킬: 마우스 오른쪽 · Q · E — 하나 써 보세요":"Skills: Right Mouse · Q · E — try one","임무 · 한 영웅 숙련 Lv.{0}":"Mission · Reach Mastery Lv.{0} with one hero","무한의 방 · {0}층 {1}스테이지":"Endless Rooms · Floor {0} Stage {1}","층마다 {0}스테이지 · 스테이지 끝마다 중간보스 · {1}스테이지에 층보스":"{0} Stages per Floor · Mid-boss at the end of each Stage · Floor boss at Stage {1}","♾️ 무한의 방 · {0}층 {1}/{2} 스테이지 · {3}번째 방 · 그림자 속성":"♾️ Endless Rooms · Floor {0} · Stage {1}/{2} · Room {3} · Shadow element","무한의 방 · {0}층 {1}/{2} 스테이지 · {3}번째 방 · 그림자 속성":"Endless Rooms · Floor {0} · Stage {1}/{2} · Room {3} · Shadow element","만신 숙련":"Grand Shaman Mastery","번째 방":"Room","보스 {0}마리를 차례로 · 사이마다 보부상과 다음 보스 홍살문":"Face {0} bosses in turn · A Peddler and a Red Gate to the next boss between fights","⚔️ {0}차 전직 · Lv.{1}":"⚔️ Class Advance {0} · Lv.{1}","여우비 · 구미호 — 한 갈래를 골라요 (이번 원정 동안)":"Yeoubi · Gumiho — Choose a path (for this expedition)","{0}차 전직 · Lv.{1}":"Class Advance {0} · Lv.{1}","🐉 보스 레이드 · {0} / {1}":"🐉 Boss Raid · {0} / {1}","매의 눈 Lv.{0}: 치명타 확률 +{1}% ×{2}":"Hawk Eye Lv.{0}: Critical hit chance +{1}% ×{2}","서릿발 칼 Lv.{0}: 기본 공격이 적을 {1}초 동안 느리게 만듦 ×{2}":"Frostblade Lv.{0}: Basic attacks slow enemies for {1}s ×{2}","보스 레이드 · {0} / {1}":"Boss Raid · {0} / {1}","{0}차 전직 · 여우비":"Class Advance {0} · Yeoubi","{0} / {1} · 그림자 우두머리":"{0} / {1} · Shadow Chieftain","일당백":"One Against a Hundred","신들린 칼":"Possessed Blade","분노!":"Rage!","그림자 우두머리의 공격이 빨라집니다":"The Shadow Chieftain attacks faster","도감 등록!":"Added to Bestiary!","천하무쌍":"Peerless","쓰러졌다…":"Fallen…","레이드 실패":"Raid Failed","여우비 숙련":"Yeoubi Mastery","강화·특성":"Blessings · Traits","날선 여우불 부채":"Keen Foxfire Fan","쓰러뜨린 것":"Defeated","· 가장 아팠던 것":"· Hurt Most By","(받은 피해의 {0}%)":"({0}% of damage taken)","연속 베기 — 세 번째 휘두름이 가장 셉니다. 두 번 맞은 뒤 뒤로 구르세요.":"Chain Slash — the third swing hits hardest. After taking two, dodge roll back.","보스 처치":"Boss Defeated","이번 판: 📖 새 요괴 피박쥐·솟대 까마귀·해골 궁수":"This run: 📖 New yokai: Blood Bat · Sotdae Crow · Skeleton Archer","임무 · 연격 {0} — 천하무쌍":"Mission · {0} combo — Peerless","새 요괴 피박쥐·솟대 까마귀·해골 궁수":"New yokai: Blood Bat · Sotdae Crow · Skeleton Archer","가벼운 손 Lv.{0}: 기본 공격 속도 +{1}% ×{2}":"Nimble Hands Lv.{0}: Basic attack speed +{1}% ×{2}","산울림 Lv.{0}: 스킬을 쓸 때 {1}% 확률로 대기 초기화 ×{2}":"Mountain Echo Lv.{0}: {1}% chance to reset cooldowns when using a skill ×{2}","메아리!":"Echo!","층 보스들을 줄줄이 상대하다니 배짱 한번 좋네. 다음엔 펫이랑 보물도 잘 맞춰 가요.":"Taking on the Floor bosses one after another—you've got guts. Next time, bring pets and relics that suit each other well.","소담 숙련":"Sodam Mastery","📖 새 요괴":"📖 New yokai","새 요괴":"New yokai","이번 판":"This run","그믐밤 요괴록을 찢은 장본인. 깨진 갓 아래 얼굴은 아무도 본 적이 없고, 방망이로 땅을 치면 그림자가 사람 수만큼 갈라진다.":"The one who tore apart the Yogoerok on the moonless night. No one has ever seen the face beneath the broken gat, and when the club strikes the ground, shadows split apart, one for every person present.","그믐밤 요괴록을 찢은 장본인.":"The one who tore apart the Yogoerok on the moonless night.","북방을 지키다 눈보라 속에 얼어 죽은 장군. 아무도 기억해 주지 않은 원한이 갑옷째 얼어붙어 다시 일어섰다.":"A general who froze to death in a blizzard while guarding the northern border. His grudge, remembered by no one, froze into his armor and rose again.","북방을 지키다 눈보라 속에 얼어 죽은 장군.":"A general who froze to death in a blizzard guarding the north.","대장간 화로에 버려진 불씨들이 모여 귀신이 되었다. 쇠가 녹는 냄새를 좋아하고, 화가 나면 하늘에서 불덩이를 부른다.":"Embers cast aside in the forge's furnace gathered and became a ghost. It loves the smell of melting iron, and when angered, it calls fireballs down from the sky.","대장간 화로에 버려진 불씨들이 모여 귀신이 되었다.":"Embers cast aside in the forge's furnace gathered and became a ghost.","늪을 통째로 삼키고 왕이 된 두꺼비. 넷째 장을 배 속에 넣고 독 안개로 늪을 덮었다. 혀가 몸길이의 세 배라는 소문이 있다.":"A toad that swallowed the whole swamp and became its king. It took Chapter Four into its belly and blanketed the marsh in poison mist. Rumor says its tongue is three times its body length.","늪을 통째로 삼키고 왕이 된 두꺼비.":"A toad that swallowed the whole swamp and became its king.","저승 명부를 들고 다니는 염라의 사자. 산 사람의 이름을 부르면 넋이 대답하고 끌려간다고 한다. 마지막 장을 명부 사이에 끼워 두었다.":"A jeoseung saja of Yeomra who carries the ledger of the underworld. They say when he calls a living person's name, the soul answers and is dragged away. He tucked the final chapter between the ledger's pages.","저승 명부를 들고 다니는 염라의 사자.":"A jeoseung saja of Yeomra who carries the ledger of the underworld.","석굴 입구를 천 년 동안 지킨 돌 수문장. 누가 지키라고 했는지는 잊었지만 지키는 일만은 잊지 않았다.":"A stone gatekeeper who has guarded the cave entrance for a thousand years. It has forgotten who ordered it to stand guard, but never forgot the guarding.","석굴 입구를 천 년 동안 지킨 돌 수문장.":"A stone gatekeeper who guarded the cave entrance for a thousand years.","천 년을 살아 꼬리 아홉을 얻은 여우. 사람의 간 백 개를 먹으면 사람이 된다는 말을 아직도 믿고 있다.":"A fox that lived a thousand years and earned nine tails. It still believes that eating a hundred human livers will make it human.","천 년을 살아 꼬리 아홉을 얻은 여우.":"A fox that lived a thousand years and earned nine tails.","용이 되지 못한 큰 구렁이. 여의주를 얻지 못한 원망으로 얼음 골짜기에 똬리를 틀었다.":"A great serpent that never became a dragon. Bitter at never winning the wish-granting pearl, it coiled itself in the ice valley.","용이 되지 못한 큰 구렁이.":"A great serpent that never became a dragon.","쇠붙이를 먹고 자라는 짐승. 바늘 하나로 시작해 성문 쇠빗장까지 삼켰다는 옛이야기가 있다. 불로도 죽지 않는다 하여 '불가살이'.":"A beast that grows by eating metal. An old tale says it began with a single needle and ended up swallowing even the iron bolt of a castle gate. Not even fire can kill it, hence the name 'bulgasari.'","쇠붙이를 먹고 자라는 짐승.":"A beast that grows by eating metal.","흰 털이 긴 산짐승. 사람 목소리를 흉내 내어 '이리 와' 하고 부른다. 대답하면 안 된다.":"A long-furred white mountain beast. It mimics human voices and calls, \"Come here.\" Never answer.","흰 털이 긴 산짐승.":"A long-furred white mountain beast.","어둠이 뭉쳐 생긴 요괴. 쳐다볼수록 커지고, 고개를 숙이면 작아진다는 어둑시니.":"A yokai born from clotted darkness. The eodukshini grows the more you stare at it, and shrinks when you bow your head.","어둠이 뭉쳐 생긴 요괴.":"A yokai born from clotted darkness.","지나가는 곳마다 가뭄이 든다는 쇠 기운의 용. 강철이가 지나간 들판엔 풀 한 포기 남지 않는다.":"A dragon of iron energy said to bring drought wherever it passes. Not a single blade of grass remains in fields Gangcheori has crossed.","지나가는 곳마다 가뭄이 든다는 쇠 기운의 용.":"A dragon of iron energy that brings drought wherever it passes.","물에 빠져 죽은 넋. 혼자 가기 외로워 물가 사람의 발목을 잡아끈다.":"The soul of one who drowned. Too lonely to go alone, it grabs the ankles of those by the water and drags them in.","물에 빠져 죽은 넋.":"The soul of one who drowned.","밤길 사람 뒤를 소리 없이 따라오는 그슨대. 돌아보면 사라지고, 다시 걸으면 한 걸음 더 가까이 있다.":"The geuseundae silently follows travelers on night roads. Look back and it vanishes; walk on, and it is one step closer.","밤길 사람 뒤를 소리 없이 따라오는 그슨대.":"The geuseundae silently follows travelers on night roads.","사람 머리를 짓누르는 커다란 귀신. 밤에 가위눌리는 건 두억시니가 앉아서라고 한다.":"A huge ghost that presses down on people's heads. They say nightmare paralysis comes from a dueoksini sitting on you.","사람 머리를 짓누르는 커다란 귀신.":"A huge ghost that presses down on people's heads.","다리가 하나뿐인 도깨비. 씨름을 좋아해서, 왼쪽으로 넘기면 쉽게 이긴다는 비법이 전해진다.":"A one-legged dokkaebi. It loves ssireum wrestling, and the secret handed down says you can beat it easily by tipping it to the left.","다리가 하나뿐인 도깨비.":"A one-legged dokkaebi.","석굴 박쥐들이 우두머리를 따라 요괴가 되었다. 피 냄새를 맡으면 떼로 몰려든다.":"The cave bats followed their leader and became yokai. At the scent of blood, they swarm in flocks.","석굴 박쥐들이 우두머리를 따라 요괴가 되었다.":"The cave bats followed their leader and became yokai.","땅속 길을 다 안다는 두더지 장군. 석굴이 무너지지 않는 건 이 장군이 굴을 받쳐서라고도 한다.":"A mole general who knows every path underground. Some say the cave has not collapsed because this general holds up its tunnels.","땅속 길을 다 안다는 두더지 장군.":"A mole general who knows every path underground.","객지에서 죽어 고향에 돌아가지 못한 넋. 길 가는 사람에게 붙어 함께 가려 한다.":"The soul of one who died far from home and never returned. It clings to travelers, wanting to go along.","객지에서 죽어 고향에 돌아가지 못한 넋.":"The soul of one who died far from home and never returned.","비 오는 밤 들판에 떠다니는 푸른 불. 따라가면 길을 잃는다.":"A blue flame drifting over the fields on rainy nights. Follow it and you will lose your way.","비 오는 밤 들판에 떠다니는 푸른 불.":"A blue flame drifting over the fields on rainy nights.","마을을 지키던 돌장승이 요괴의 기운을 먹고 움직이기 시작했다. 본래는 착한 수호신이었다.":"The stone jangseung that guarded the village fed on yokai energy and began to move. It was once a kindly guardian.","마을을 지키던 돌장승이 요괴의 기운을 먹고 움직이기 시작했다.":"The stone jangseung that guarded the village fed on yokai energy and began to move.","겨울을 몰고 오는 동장군. 입김 한 번에 강물이 얼고, 성질이 나면 우박을 뿌린다.":"General Winter, who brings the cold season. One breath freezes a river, and in a temper he rains down hail.","겨울을 몰고 오는 동장군.":"General Winter, who brings the cold season.","눈보라 속에서 길을 잃은 사람이 된 귀신. 하얀 옷 때문에 눈 속에서 보이지 않는다.":"A ghost that was once a traveler lost in a blizzard. Its white clothes make it invisible in the snow.","눈보라 속에서 길을 잃은 사람이 된 귀신.":"A ghost that was once a traveler lost in a blizzard.","북쪽 산신을 모시던 흰 곰. 얼음 동굴에 갇혀 신장(神將)이 되었다.":"A white bear that served the northern mountain god. Trapped in an ice cave, it became a divine general.","북쪽 산신을 모시던 흰 곰.":"A white bear that served the northern mountain god.","얼음 구슬을 품은 여우. 구미호의 먼 친척이라 자랑하지만 꼬리는 하나다.":"A fox holding an ice orb. It boasts of being a distant relative of the gumiho, but it has only one tail.","얼음 구슬을 품은 여우.":"A fox holding an ice orb.","서리 늑대 무리의 우두머리. 달이 뜨면 무리를 불러 사냥한다.":"Leader of the frost wolf pack. When the moon rises, it calls the pack to hunt.","서리 늑대 무리의 우두머리.":"Leader of the frost wolf pack.","고드름을 화살 삼아 쏘는 궁수 귀신. 살아서 명궁이었으나 얼음 골짜기에서 길을 잃었다.":"An archer ghost who shoots icicles as arrows. A master archer in life, he lost his way in the ice valley.","고드름을 화살 삼아 쏘는 궁수 귀신.":"An archer ghost who shoots icicles as arrows.","눈사람에 깃든 장난꾸러기 도깨비. 뚝딱 소리와 함께 눈덩이를 굴려 온다.":"A mischievous dokkaebi dwelling in a snowman. With a thunk, it comes rolling snowballs your way.","눈사람에 깃든 장난꾸러기 도깨비.":"A mischievous dokkaebi dwelling in a snowman.","학 천 마리가 얼어붙어 하나가 된 요괴. 날갯짓마다 눈보라가 인다.":"A yokai formed when a thousand cranes froze into one. Every flap of its wings stirs up a blizzard.","학 천 마리가 얼어붙어 하나가 된 요괴.":"A yokai formed when a thousand cranes froze into one.","부엌을 지키는 조왕신이 대장간 불에 노해 성난 신이 되었다. 화로를 함부로 다루는 자를 용서하지 않는다.":"Jowang, the kitchen god, was enraged by the forge fire and became a wrathful deity. He forgives no one who handles the furnace carelessly.","부엌을 지키는 조왕신이 대장간 불에 노해 성난 신이 되었다.":"Jowang, the kitchen god, was enraged by the forge fire and became a wrathful deity.","해와 달을 삼키려다 뜨거워 뱉었다는 불개. 일식·월식이 불개 짓이라는 옛말이 있다.":"The fire dog that tried to swallow the sun and moon, then spat them out, burned. Old tales blame eclipses on its mischief.","해와 달을 삼키려다 뜨거워 뱉었다는 불개.":"The fire dog that tried to swallow the sun and moon, then spat them out, burned.","대장간 쇠붙이에 깃든 도깨비. 망치질 소리에 맞춰 춤추듯 싸운다.":"A dokkaebi dwelling in forge iron. It fights as if dancing to the ring of the hammer.","대장간 쇠붙이에 깃든 도깨비.":"A dokkaebi dwelling in forge iron.","불타는 수레를 끄는 귀신. 죄 많은 넋을 실어 나른다는 화차.":"A ghost that pulls a blazing cart. The hwacha is said to carry sinful souls away.","불타는 수레를 끄는 귀신.":"A ghost that pulls a blazing cart.","불을 머금은 여우. 꼬리를 흔들면 도깨비불이 튄다.":"A fox that holds fire within. When it swishes its tail, goblin flames fly.","불을 머금은 여우.":"A fox that holds fire within.","용암 속에서 사는 두꺼비. 늪 두꺼비 왕의 사촌이라는데, 서로 사이가 나쁘다.":"A toad that lives in lava. Said to be cousin to the Swamp Toad King, though the two hate each other.","용암 속에서 사는 두꺼비.":"A toad that lives in lava.","칼을 다 벼리지 못하고 죽은 대장장이의 원귀. 아직도 모루 앞을 떠나지 못한다.":"The vengeful ghost of a smith who died before finishing his blade. He still cannot leave the anvil.","칼을 다 벼리지 못하고 죽은 대장장이의 원귀.":"The vengeful ghost of a smith who died before finishing his blade.","불꽃 깃털의 새. 지나간 하늘에 붉은 줄이 남는다.":"A bird with feathers of flame. A red streak lingers in the sky where it passes.","불꽃 깃털의 새.":"A bird with feathers of flame.","사람 키보다 긴 왕지네. 닭이 천적이라 닭 울음소리를 싫어한다.":"A giant centipede longer than a man is tall. Chickens are its natural enemy, so it loathes their crowing.","사람 키보다 긴 왕지네.":"A giant centipede longer than a man is tall.","늪가 오두막에 사는 거미 여인. 길 잃은 나그네를 묵어 가라 붙잡는다.":"A spider woman living in a hut by the swamp. She waylays lost travelers, bidding them stay the night.","늪가 오두막에 사는 거미 여인.":"A spider woman living in a hut by the swamp.","곳간을 지키던 업구렁이가 늪으로 쫓겨나 사나워졌다.":"The guardian serpent that once kept the granary was driven into the swamp, and grew savage.","얼굴에 눈·코·입이 없는 달걀귀신. 원한이 너무 깊어 얼굴마저 지워졌다.":"An egg ghost with no eyes, nose, or mouth. Its grudge ran so deep that even its face was erased.","얼굴에 눈·코·입이 없는 달걀귀신.":"An egg ghost with no eyes, nose, or mouth.","독 안개를 먹고 자란 버섯 요괴. 포자를 뿜어 늪을 넓힌다.":"A mushroom yokai raised on poison mist. It spews spores to spread the swamp.","독 안개를 먹고 자란 버섯 요괴.":"A mushroom yokai raised on poison mist.","늪의 피를 빨아 몸집이 커진 거머리 요괴.":"A leech yokai grown fat on the blood of the swamp.","두꺼비 왕의 오른팔 장군. 등의 혹마다 독이 가득하다.":"The Toad King's right-hand general. Every wart on his back brims with poison.","두꺼비 왕의 오른팔 장군.":"The Toad King's right-hand general.","물과 숲의 정령 망량. 사람 흉내를 내어 길을 묻고는 엉뚱한 길을 알려 준다.":"Mangnyang, spirit of water and forest. It mimics a person, asks the way, then points you down the wrong path.","물과 숲의 정령 망량.":"Mangnyang, spirit of water and forest.","저승차사 가운데 으뜸이라는 강림도령. 염라대왕도 함부로 못 한다는 담력의 차사.":"Gangnim Doryeong, foremost of the jeoseung saja. A reaper so bold that even King Yeomra dares not cross him.","저승차사 가운데 으뜸이라는 강림도령.":"Gangnim Doryeong, foremost of the jeoseung saja.","소 머리와 말 얼굴의 저승 옥졸. 둘이 늘 함께 다닌다.":"Ox-Head and Horse-Face, jailers of the underworld. The two always walk together.","소 머리와 말 얼굴의 저승 옥졸.":"Ox-Head and Horse-Face, jailers of the underworld.","망자의 죄를 저울질하는 저승 판관. 붓 한 획에 지옥과 극락이 갈린다.":"The underworld judge who weighs the sins of the dead. One stroke of his brush divides hell from paradise.","망자의 죄를 저울질하는 저승 판관.":"The underworld judge who weighs the sins of the dead.","옳고 그름을 가린다는 상상의 짐승 해치. 저승 문을 지키며 거짓말쟁이를 들이받는다.":"The haetae, a legendary beast said to tell right from wrong. It guards the gates of the underworld and gores liars.","옳고 그름을 가린다는 상상의 짐승 해치.":"The haetae, a legendary beast said to tell right from wrong.","억울하게 죽은 장수의 원귀. 아직 끝나지 않은 싸움을 계속하고 있다.":"The vengeful ghost of a general who died wronged. He fights on in a battle that never ended.","억울하게 죽은 장수의 원귀.":"The vengeful ghost of a general who died wronged.","혼례를 못 치르고 죽은 손각시. 신부 옷차림 그대로 저승을 떠돈다.":"A songakshi, a maiden who died before her wedding. She wanders the underworld still in her bridal garb.","혼례를 못 치르고 죽은 손각시.":"A songakshi, a maiden who died before her wedding.","장가를 못 가고 죽은 총각 귀신 몽달귀신. 짝을 찾아 헤맨다.":"Mongdal, the ghost of a bachelor who died unwed. He roams in search of a bride.","장가를 못 가고 죽은 총각 귀신 몽달귀신.":"Mongdal, the ghost of a bachelor who died unwed.","긴 머리를 풀어 헤친 처녀귀신. 한을 풀어 줄 사람을 기다린다.":"A maiden ghost with long, unbound hair. She waits for someone to ease her sorrow.","긴 머리를 풀어 헤친 처녀귀신.":"A maiden ghost with long, unbound hair.","저승 소식을 이승에 전한다는 까마귀. 지붕 위에서 울면 누군가 떠난다고 했다.":"A crow said to carry word from the underworld. When it cried from a rooftop, they said someone would soon depart.","저승 소식을 이승에 전한다는 까마귀.":"A crow said to carry word from the underworld.","저승 맨 바깥 문을 지키는 거인. 산 사람의 발소리는 천 리 밖에서도 듣는다.":"A giant guarding the outermost gate of the underworld. He can hear a living man's footsteps from a thousand li away.","저승 맨 바깥 문을 지키는 거인.":"A giant guarding the outermost gate of the underworld.","벼루에 엎질러진 먹물이 요괴록의 기운을 먹고 굴러다닌다.":"Ink spilled from an inkstone feeds on the energy of Yogoerok and rolls about.","피 냄새를 따라 날아드는 박쥐 떼.":"A swarm of bats drawn by the scent of blood.","석굴에 묻힌 옛 병사의 뼈가 활을 들었다.":"The bones of an old soldier buried in a stone cave have taken up a bow.","돌무더기에 깃든 도깨비. 몸통 박치기를 좋아한다.":"A dokkaebi dwelling in a pile of stones. It loves to charge headlong.","돌무더기에 깃든 도깨비.":"A dokkaebi dwelling in a pile of stones.","들판의 도깨비불이 주술을 배웠다.":"A will-o'-the-wisp of the fields has learned sorcery.","그림자 도깨비 왕의 그림자에서 떨어져 나온 자객.":"An assassin split off from the shadow of the Shadow Dokkaebi King.","키는 작아도 심술은 큰 꼬마 도깨비.":"A small dokkaebi, short in stature but big on spite.","상여를 장식하던 꼭두 인형이 혼자 걸어 다닌다.":"A kkokdu figure that once adorned a funeral bier now walks on its own.","찢긴 요괴록 종이가 바람을 타고 귀신이 되었다.":"A torn page of Yogoerok rode the wind and became a ghost.","마을 어귀 장승이 요괴 기운에 홀려 돌진한다.":"A jangseung from the village gate, bewitched by yokai energy, charges forward.","늪의 독을 품은 두꺼비.":"A toad full of swamp poison.","각시탈을 쓴 원귀. 탈 속 얼굴은 아무도 모른다.":"A vengeful ghost in a gaksi mask. No one knows the face beneath.","각시탈을 쓴 원귀.":"A vengeful ghost in a gaksi mask.","솟대 위에 앉아 있던 나무 새가 까마귀 요괴가 되었다.":"The wooden bird perched atop the sotdae has become a crow yokai.","사람으로 둔갑하는 너구리. 순식간에 자리를 바꾼다.":"A tanuki that shapeshifts into a human. It swaps places in the blink of an eye.","사람으로 둔갑하는 너구리.":"A tanuki that shapeshifts into a human.","장 도달":"Chapter Reached","얻는 법: 스토리 · 스토리 {0}장 도달":"How to get: Story · Reach Chapter {0} in Story","스토리 {0}장 도달":"Reach Chapter {0} in the story","스토리 {0}장 도달 + 저주 스테이지 {1}번":"Reach Story Chapter {0} + Cursed Stage {1} times","스토리 {0}장 도달 + 스킬 {1}번 사용":"Reach Story Chapter {0} + use skills {1} times","스토리 {0}장 도달 + 펫 {1}종 모으기":"Reach Story Chapter {0} + collect {1} pet types","스토리 {0}장 도달 + 정예 {1}마리":"Reach Story Chapter {0} + defeat {1} elites","요괴록 {0}장 도감 완성 ({1}종)":"Complete the Yogoerok Chapter {0} Bestiary ({1} types)","[숨은 업적] 장 보스 {0}번 처치 — 보스펫 '아기 도깨비 왕' 획득":"[Hidden] Defeat chapter bosses {0} times — Earn boss pet 'Baby Dokkaebi King'","요괴마다 약한 속성이 있어요 — 장 이름 아래를 보세요":"Each yokai has a weak element — check below the chapter name","장 보스들을 줄줄이 상대하다니 배짱 한번 좋네. 다음엔 펫이랑 보물도 잘 맞춰 가요.":"Taking on the Chapter bosses one after another—you've got guts. Next time, bring pets and relics that suit each other well.","이 아래엔 두꺼비가 왕 노릇을 한다오.":"Down below, a toad plays at being king.","엽전만 있으면 요괴 잡을 물건은 다 있소이다.":"Got coins? Then I've got everything you need to hunt yokai.","엽전 {0} · 모자라요":"{0} coins · Not enough","엽전이 모자라요":"Not enough coins","이번 원정 동안 계속 적용":"Lasts for this whole run","토벌 시즌 경험 +{0}":"Hunt Season XP +{0}","공지":"Notices","새 영웅 합류":"New Hero Joins","눌러서 계속":"Tap to continue","눌러서 계속 · {0}/{1}":"Tap to continue · {0}/{1}","{0}급":"Rank {0}","이 영웅으로 출발 ▶":"Start with This Hero ▶","이 영웅으로 출발":"Start with This Hero","구르기 버튼으로 구르는 동안에는 공격을 맞지 않아요":"You can't be hit while rolling with the roll button","설치·낙하·순간이동 스킬은 자리를 고를 수 있어요.":"Placed, falling and teleport skills let you choose a spot.","스킬 버튼을 끌어서":"Drag the skill button","자리를 고르고 떼면 시전 (그냥 누르면 가까운 적에게)":"to choose a spot, then release to cast (just tap to target the nearest enemy)","구르기 버튼":"roll button","오른쪽 위":"Tap the","작은 지도":"mini-map","를 누르면":"at the top right to","공격":"Attack","오른쪽 큰 칼 버튼 (누르고 있으면 연속, 가까운 요괴 쪽으로)":"Big sword button on the right (hold to keep attacking, aims at the nearest yokai)","스킬 버튼을 끌어 자리를 고르고 떼면 시전":"Drag the skill button to choose a spot, then release to cast","액티브 칸의 자물쇠를 눌러 풀어요":"tap the lock on the active slot to unlock","자물쇠를 눌러 풀기":"tap the lock to unlock","멈춤 · 소리":"Pause · Sound","나가기":"Leave"};

// 11-21 영어 번역층 (출시 전 해외판 준비). 코드 곳곳의 한국어를 다 고치지 않고, 화면에 나오는 글자를 그 자리에서 바꾼다.
// - 문서의 글(텍스트 노드·placeholder·title·aria-label)은 MutationObserver 로, 판 화면 글(canvas fillText)은 함수 감싸기로.
// - 사전 키는 '숫자를 {0},{1}… 로 바꾼 한국어' → 같은 꼴이면 숫자만 바꿔 끼움 ("체력 +12%" ↔ "체력 +{0}%").
// - 기본은 꺼짐(한국어). 설정의 언어에서 English 를 고르면 켜짐. I18N.collect 가 켜지면 사전에 없는 글을 모은다(번역 만들기용).
const I18N = (() => {
  const HAN = /[가-힣]/;
  let lang = "ko";
  try { lang = localStorage.getItem("ygr_lang") || "ko"; } catch (e) { }
  const D = (typeof I18N_EN !== "undefined" && I18N_EN) || {};
  const miss = new Set(), seen = new WeakSet(), cache = new Map();
  const norm = (s) => { const nums = []; const k = s.replace(/\d+(?:[.,]\d+)*/g, (m) => { nums.push(m); return "{" + (nums.length - 1) + "}"; }); return [k, nums]; };
  function tr(s) {
    if (!s || !HAN.test(s)) return s;
    const c = cache.get(s); if (c !== undefined) return c;
    const lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0], core = s.trim();
    const [k, nums] = norm(core); let out = s;
    const e = D[k];
    if (e != null) out = lead + e.replace(/\{(\d+)\}/g, (m, i) => (nums[+i] != null ? nums[+i] : m)) + tail;
    else { // 사전에 통째로 없으면 구분자( · , : , — , 쉼표, 가운뎃점)로 나눠 조각마다 번역해서 이어 붙임 (예: "강화 이름 Lv.2: 효과 ×3")
      const parts = core.split(/( · |: | — |, |·| \(|\) |\)$| ×)/); let all = parts.length > 1;
      const tp = parts.map((x) => { if (!HAN.test(x)) return x; const y = tr1(x); if (y === null) { all = false; return x; } return y; });
      if (all) out = lead + tp.join("") + tail; else if (I18N.collect) miss.add(k);
    }
    if (cache.size > 20000) cache.clear(); cache.set(s, out); return out;
  }
  function tr1(x) { const lead = x.match(/^\s*/)[0], tail = x.match(/\s*$/)[0], c = x.trim(); let [k, nums] = norm(c); let e = D[k];
    if (e == null) { const m = c.match(/^(.*?)\s*Lv\.(\d+)$/); if (m && D[norm(m[1])[0]] != null) return lead + D[norm(m[1])[0]] + " Lv." + m[2] + tail; return null; }
    return lead + e.replace(/\{(\d+)\}/g, (mm, i) => (nums[+i] != null ? nums[+i] : mm)) + tail; }
  const on = () => lang === "en" || I18N.collect;
  function node(n) {
    if (n.nodeType === 3) { if (HAN.test(n.nodeValue)) { const t = tr(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; } return; }
    if (n.nodeType !== 1 || n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
    for (const a of ["placeholder", "title", "aria-label", "alt"]) { const v = n.getAttribute && n.getAttribute(a); if (v && HAN.test(v)) n.setAttribute(a, tr(v)); }
    if (n.tagName === "TEXTAREA" || n.tagName === "INPUT") return;
    for (let c = n.firstChild; c; c = c.nextSibling) node(c);
  }
  function start() {
    if (!on() || I18N._mo) return;
    document.documentElement.lang = lang === "en" ? "en" : "ko";
    node(document.body);
    I18N._mo = new MutationObserver((ms) => { for (const m of ms) { if (m.type === "characterData") node(m.target); else for (const a of m.addedNodes) node(a); } });
    I18N._mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    const P = CanvasRenderingContext2D.prototype;
    for (const f of ["fillText", "strokeText", "measureText"]) { const o = P[f]; P[f] = function (t, ...a) { return o.call(this, typeof t === "string" ? tr(t) : t, ...a); }; }
  }
  const I18N = { tr, start, get lang() { return lang; }, collect: false, miss,
    set(l) { lang = l; try { localStorage.setItem("ygr_lang", l); } catch (e) { } location.reload(); },
    dump() { return [...miss]; } };
  // 등급 이름 '영웅'은 캐릭터 '영웅'과 같은 글자라 사전으로는 구분이 안 됨 → 영어일 때 등급 이름만 직접 바꿈
  if (lang === "en") { const RN = { "일반": "Common", "희귀": "Rare", "영웅": "Epic", "전설": "Legendary", "보스 전용": "Boss" };
    for (const T of [typeof RARITY !== "undefined" && RARITY, typeof ACT_TIER !== "undefined" && ACT_TIER]) if (T) for (const k in T) if (T[k] && RN[T[k].name]) T[k].name = RN[T[k].name]; }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else setTimeout(start, 0);
  return I18N;
})();

// 11-21 공지창 (상업용 게임 방식: 접속하면 새 공지가 있을 때 자동으로 뜸 · 왼쪽 목록/오른쪽 내용 · '오늘 하루 보지 않기' · 메인 위 '공지' 버튼에 빨간 점)
// 새 공지는 맨 위에 추가하고 id 를 올린다. 영어는 en 에 직접 적는다(번역 사전을 거치지 않음).
const NOTICES = [
  { id: 3, type: "공지", date: "2026-11-21", img: "ui_mode_story",
    title: "요괴록 CBT(시험판)에 오신 것을 환영해요",
    body: ["요괴록을 먼저 해 봐 주셔서 고마워요. 지금은 정식 출시 전 시험판이에요.",
      "불편한 점, 버그, 좋았던 점을 <b>설정 → 의견 보내기</b>(판이 끝난 결과 화면에도 있어요)로 보내 주세요. 하나하나 읽고 고쳐요.",
      "시험판 기간에는 균형(난이도·보상)이 자주 바뀔 수 있어요.",
      "정식 출시 때 시험판 진행 기록을 어떻게 할지는 따로 공지로 알려 드려요.",
      "문의: jmg98916@gmail.com"],
    en: { title: "Welcome to the Yogoerok CBT (test build)",
      body: ["Thank you for playing Yogoerok early. This is a test build before the official launch.",
        "Please send anything that felt off, bugs, or things you enjoyed via <b>Settings → Send Feedback</b> (also on the results screen after a run). We read every one.",
        "Balance (difficulty and rewards) may change often during the test.",
        "How test progress will be handled at launch will be announced separately.",
        "Contact: jmg98916@gmail.com"] } },
  { id: 4, type: "업데이트", date: "2026-11-21", img: "ui_c_altar",
    title: "3.0 업데이트 — 더 매끄럽게, 더 조선답게",
    body: ["<b>새 영웅 획득 연출</b> — 뽑기에서 새 영웅이 나오면 전체 화면으로 맞이해요. 조각도 금빛으로 반짝여요.",
      "<b>공지창</b> — 업데이트와 소식을 여기서 바로 볼 수 있어요(메인 위 '공지').","<b>판 초반 끊김 크게 줄임</b> — 그림을 미리 풀어 두어 최신 폰에서 첫 30초 끊김이 거의 사라졌어요.",
      "<b>떠돌이 대장간</b> — 쉬는 방에 가끔 나타나요. 엽전으로 가진 강화 하나를 다른 강화로 다시 벼려요.",
      "<b>소원 우물</b> — 약수를 마신 뒤 마른 우물에 엽전을 던지면 강화 하나를 골라요(가끔 나타나요).",
      "<b>보스 등장</b> — 이름 아래에 그 요괴의 내력 한 줄이 나와요.",
      "<b>수묵 붓글씨 로고</b>, 혼불 제단·주막 창고·설정·함께하기 화면 그림을 새로 다듬었어요.",
      "보스 레이드는 스토리 2장 보스를 쓰러뜨리면 열려요.",
      "강화가 아주 많이 쌓이면 넘는 몫은 절반만 붙어요(한쪽으로 지나치게 강해지는 것 방지).",
      "English (beta) — 설정 → 언어에서 고를 수 있어요."],
    en: { title: "Update 3.0 — Smoother, and more Joseon",
      body: ["<b>New hero reveal</b> — when you summon a new hero, it gets a full-screen welcome. Shards sparkle in gold, too.",
        "<b>Notices</b> — check updates and news right here ('Notices' at the top of the main screen).","<b>Much less stutter at the start of a run</b> — images are now pre-decoded, so the first 30 seconds are smooth on modern phones.",
        "<b>Wandering Forge</b> — sometimes appears in rest rooms. Spend coins to reforge one of your blessings into another.",
        "<b>Wishing Well</b> — after drinking from the spring, toss coins into the dry well to pick a blessing (appears sometimes).",
        "<b>Boss entrances</b> — a line of each yokai's lore now appears under its name.",
        "New <b>ink-brush logo</b>, and refreshed art for the Soulfire Altar, Tavern Storehouse, Settings and Co-op screens.",
        "Boss Raid unlocks after defeating the Chapter 2 boss in Story.",
        "When blessings stack very high, the excess counts for half (prevents runaway builds).",
        "English (beta) — choose it in Settings → Language."] } },
  { id: 1, type: "안내", date: "2026-11-21", img: "ui_c_daily",
    title: "알아 두면 좋은 것",
    body: ["처음이라면 <b>스토리</b>부터 시작해요. 1장 보스를 쓰러뜨리면 무한의 방·대전·함께하기가 열려요.",
      "쓰러져도 <b>혼불</b>은 남아요. 혼불 제단에 바치면 모든 영웅이 강해져요.",
      "구르는 동안에는 공격을 맞지 않아요. 붉은 영역은 곧 공격이 떨어지는 자리예요.",
      "폰이 뜨겁거나 끊기면 설정 → 그래픽·성능에서 '절전 모드'나 '저사양 모드'를 켜 보세요."],
    en: { title: "Good to know",
      body: ["New here? Start with <b>Story</b>. Defeating the Chapter 1 boss unlocks Endless Rooms, Duel and Co-op.",
        "Even if you fall, your <b>Soulfire</b> remains. Offer it at the Soulfire Altar to strengthen every hero.",
        "You can't be hit while dodge-rolling. Red areas mark where attacks are about to land.",
        "If your phone gets hot or stutters, try 'Power Saving' or 'Low-spec Mode' in Settings → Graphics · Performance."] } },
];
