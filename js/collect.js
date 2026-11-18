// ===== 수집품 (사용자 요청 11-10) =====
// 칭호 30 (가챠 10 · 미션 10 · 특수 5 · 스토리 5)
// 아티팩트 55 (가챠 15 · 미션 20 · 특수 10 = 45, + 스토리 10 — 스토리 진행으로만 얻음, 효과는 모든 모드)
// 펫 40 (가챠 10 · 미션 15 · 특수 5 · 랜덤 드롭 5 · 스토리 5)
// how: gacha 가챠 / mission 미션 / special 특수 미션 / story 스토리 / drop 랜덤 획득.  c: 조건 { stat, n, text }
const HOW_NAME = { gacha: "가챠", mission: "미션", special: "특수 미션", story: "스토리", drop: "랜덤 획득", secret: "숨은 보상" };
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
  a_arrowhead: A_("사냥꾼 화살촉", 1, "공격력 +5%", { atk: 0.05 }, "mission", { stat: "kills", n: 100, text: "몬스터 100마리" }, "an iron arrowhead on a leather cord"),
  a_skullneck: A_("해골 목걸이", 2, "치명타 +5%", { crit: 0.05 }, "mission", { stat: "kills", n: 500, text: "몬스터 500마리" }, "a necklace of small carved bone skulls"),
  a_hundred: A_("천인참 칼날", 3, "공격력 +12%", { atk: 0.12 }, "mission", { stat: "kills", n: 2000, text: "몬스터 2000마리" }, "a broken legendary sword blade glowing red"),
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
  a_luckcharm: A_("뽑기 행운 부적", 2, "엽전 +25%, 코인 드롭 +10%", { gold: 0.25, coinLuck: 0.1 }, "mission", { stat: "pulls", n: 30, text: "가챠 30번" }, "a lucky golden pig charm"),
  a_box: A_("수집가 상자", 1, "최대 체력 +10%", { hp: 0.1 }, "mission", { stat: "charsOwned", n: 6, text: "캐릭터 6명" }, "a lacquered mother-of-pearl treasure box"),
  a_banner: A_("영웅의 깃발", 3, "공격력 +7%, 받는 피해 -5%", { atk: 0.07, dr: 0.05 }, "mission", { stat: "charsOwned", n: 12, text: "캐릭터 12명" }, "a small heroic war banner with a tiger emblem"),
  a_mark: A_("정예 사냥 표식", 2, "치명타 피해 +25%", { critdmg: 0.25 }, "mission", { stat: "elites", n: 30, text: "정예 몬스터 30마리" }, "a carved bone hunting mark token with claw scratches"),
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
  a_corpseflower: A_("시체꽃", 3, "적이 죽을 때 주변 100% 폭발", { corpse: 1 }, "special", { stat: "kills", n: 1000, text: "몬스터 1000마리" }, "an eerie dark red corpse flower"),
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
  p_squirrel: P_("다람쥐", 1, "엽전 +15%, 가끔 엽전 물어옴", { kind: "gold", t: 7 }, { gold: 0.15 }, "mission", { stat: "kills", n: 100, text: "몬스터 100마리" }, "a cute chipmunk holding an acorn"),
  p_owl: P_("부엉이", 1, "1.3초마다 깃털 (공격력 45%)", { kind: "shoot", t: 1.3, d: 0.45 }, null, "mission", { stat: "rooms", n: 50, text: "방 50개" }, "a cute round horned owl"),
  p_mole: P_("두더지", 1, "엽전 +20%", { kind: "gold", t: 5 }, { gold: 0.2 }, "mission", { stat: "chests", n: 10, text: "보물상자 10개" }, "a cute mole with tiny goggles and a shovel"),
  p_firefly: P_("반딧불이", 1, "밝기 +30%, 1.5초마다 빛 (40%)", { kind: "shoot", t: 1.5, d: 0.4, home: true }, { light: 0.3 }, "mission", { stat: "endlessBest", n: 10, text: "무한의 방 10번째 방" }, "a cute big glowing firefly"),
  p_goose: P_("거위", 2, "1.2초마다 쪼기 (공격력 60%)", { kind: "melee", t: 1.2, d: 0.6 }, null, "mission", { stat: "duelWins", n: 3, text: "1대1 3승" }, "a cute angry white goose"),
  p_rabbit: P_("옥토끼", 2, "이동 속도 +8%", { kind: "none" }, { spd: 0.08 }, "mission", { stat: "maxLevel", n: 10, text: "한 판 레벨 10" }, "a cute jade moon rabbit with a pestle"),
  p_raccoon: P_("너구리", 2, "코인 드롭 +20%", { kind: "gold", t: 8 }, { coinLuck: 0.2 }, "mission", { stat: "pulls", n: 20, text: "가챠 20번" }, "a cute raccoon dog (neoguri) with a leaf on its head"),
  p_otter: P_("수달", 2, "1초마다 조약돌 (공격력 50%)", { kind: "shoot", t: 1.0, d: 0.5 }, null, "mission", { stat: "rooms", n: 150, text: "방 150개" }, "a cute river otter holding a pebble"),
  p_crane: P_("두루미", 3, "7초마다 체력 5% 회복", { kind: "heal", t: 7, v: 0.05 }, null, "mission", { stat: "bosses", n: 5, text: "보스 5마리" }, "a cute red-crowned crane chick"),
  p_bear: P_("반달곰 새끼", 3, "2.2초마다 땅 내려치기 (130%)", { kind: "slam", t: 2.2, d: 1.3 }, null, "mission", { stat: "kills", n: 800, text: "몬스터 800마리" }, "a cute Asiatic black bear cub with a white moon mark"),
  p_hawk: P_("송골매", 3, "0.8초마다 급강하 (공격력 55%)", { kind: "shoot", t: 0.8, d: 0.55 }, null, "mission", { stat: "elites", n: 20, text: "정예 20마리" }, "a cute small falcon"),
  p_deer: P_("꽃사슴", 2, "초당 체력 0.3% 회복", { kind: "none" }, { regen: 0.003 }, "mission", { stat: "charsOwned", n: 5, text: "캐릭터 5명" }, "a cute spotted fawn with flowers"),
  p_boar: P_("아기 멧돼지", 2, "1.1초마다 들이받기 (70%)", { kind: "melee", t: 1.1, d: 0.7 }, null, "mission", { stat: "kills", n: 300, text: "몬스터 300마리" }, "a cute striped baby wild boar"),
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
  t_first: T_("첫 사냥꾼", 1, "공격력 +3%", { atk: 0.03 }, "mission", { stat: "kills", n: 50, text: "몬스터 50마리" }),
  t_hundred: T_("백인참", 2, "공격력 +5%", { atk: 0.05 }, "mission", { stat: "kills", n: 500, text: "몬스터 500마리" }),
  t_slayer: T_("보스 잡는 자", 3, "보스에게 주는 피해 +15%", { bossDmg: 0.15 }, "mission", { stat: "bosses", n: 10, text: "보스 10마리" }),
  t_explorer: T_("미궁 탐험가", 2, "이동 +5%, 엽전 +10%", { spd: 0.05, gold: 0.1 }, "mission", { stat: "rooms", n: 100, text: "방 100개" }),
  t_veteran: T_("백전노장", 3, "최대 체력 +8%", { hp: 0.08 }, "mission", { stat: "maxLevel", n: 25, text: "한 판 레벨 25" }),
  t_endless: T_("끝없는 도전자", 3, "궁극기 대기 -8%, 공격력 +4%", { ultcd: 0.08, atk: 0.04 }, "mission", { stat: "endlessBest", n: 25, text: "무한의 방 25번째 방" }),
  t_duelist: T_("결투의 달인", 3, "치명타 +6%", { crit: 0.06 }, "mission", { stat: "duelWins", n: 10, text: "1대1 10승" }),
  t_collector: T_("수집가", 2, "코인 드롭 +15%", { coinLuck: 0.15 }, "mission", { stat: "charsOwned", n: 10, text: "캐릭터 10명" }),
  t_gambler: T_("뽑기의 신", 3, "엽전 +20%, 코인 드롭 +10%", { gold: 0.2, coinLuck: 0.1 }, "mission", { stat: "pulls", n: 100, text: "가챠 100번" }),
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
