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
