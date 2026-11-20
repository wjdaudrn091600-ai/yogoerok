// ===== 요괴록 — 조선 요괴 토벌기 · 데이터 =====
// 효과(fx) 기본 단위: proj 투사체 / arc 근접 부채꼴 / dash 돌진 / blink 순간이동 / nova 주변 폭발 / zone 장판
// strike 지연 낙하 / buff 강화 / heal 회복·보호막 / summon 소환 / chain 연쇄 번개 / beam 직선 광선 / orbit 회전체 / repeat 반복
// 피해 수치 d 는 공격력 배수

const RARITY = { 1: { name: "일반", col: "#b8b2c6" }, 2: { name: "희귀", col: "#6db6ff" }, 3: { name: "영웅", col: "#c38bff" }, 4: { name: "전설", col: "#ffb547" }, 5: { name: "보스 전용", col: "#ff5a4d" } };

// 해금 방식: start 기본 / mission 미션 / special 특수 미션 / floor 층 도달 / gacha 가챠
const CHARS = [
  { id: "musa", name: "강휘", job: "무사", unlock: { type: "start" }, col: "#e0534f", hp: 230, atk: 25, spd: 255, range: "근접",
    basic: { name: "환도 베기", cd: 0.45, fx: [{ t: "arc", d: 1, r: 105, ang: 1.9, col: "#ffcf8a" }] },
    sk: [
      { name: "베어 가르기", ic: "⚔️", cd: 6, desc: "앞으로 돌진하며 지나간 적에게 160% 피해", fx: [{ t: "dash", dist: 260, d: 1.6, col: "#ffcf8a" }] },
      { name: "회오리 베기", ic: "🌀", cd: 8, desc: "주변 적에게 200% 피해 + 밀쳐냄", fx: [{ t: "nova", r: 165, d: 2.0, knock: 140, col: "#ffcf8a" }] },
      { name: "철벽 자세", ic: "🛡️", cd: 14, desc: "4초 동안 받는 피해 -50%, 최대 체력 20% 보호막", fx: [{ t: "buff", dur: 4, dr: 0.5, col: "#ffd27a" }, { t: "heal", shield: 0.2 }] },
      { name: "검기 폭풍", ic: "🌪️", cd: 40, ult: true, desc: "2.4초 동안 주변을 8번 베어 각 130% 피해", fx: [{ t: "repeat", n: 8, gap: 0.3, fx: { t: "nova", r: 220, d: 1.3, col: "#ffb547", follow: true } }] },
    ] },
  { id: "archer", name: "설아", job: "궁수", unlock: { type: "mission", reqs: [{ stat: "kills", n: 300, text: "요괴 300마리" }], text: "요괴 300마리 처치 (누적)" }, col: "#6db6ff", hp: 185, atk: 22, spd: 265, range: "원거리",
    basic: { name: "각궁 사격", cd: 0.42, fx: [{ t: "proj", d: 1, spd: 900, life: 0.75, r: 8, col: "#cfe8ff", shape: "arrow" }] },
    sk: [
      { name: "세 갈래 화살", ic: "🏹", cd: 5, desc: "화살 5발을 부채꼴로 쏴 각 110% 피해", fx: [{ t: "proj", n: 5, spread: 0.5, d: 1.1, spd: 950, life: 0.7, r: 8, col: "#cfe8ff", shape: "arrow", pierce: 1 }] },
      { name: "바람 구르기", ic: "💨", cd: 7, desc: "커서 쪽으로 구르며 잠깐 무적", fx: [{ t: "dash", dist: 240, d: 0, inv: 0.45, col: "#cfe8ff" }] },
      { name: "화살비", ic: "🌧️", cd: 11, desc: "커서 위치에 3초 동안 화살비 (초당 120% 피해, 느려짐)", fx: [{ t: "zone", r: 150, dur: 3, dps: 1.2, slow: 0.4, col: "#9fd1ff", at: "cursor" }] },
      { name: "천궁 일시", ic: "☄️", cd: 38, ult: true, desc: "모든 적을 꿰뚫는 거대한 화살 (650% 피해)", fx: [{ t: "beam", len: 1400, w: 70, d: 6.5, col: "#bfe3ff", delay: 0.35 }] },
    ] },
  { id: "spear", name: "도윤", job: "창병", unlock: { type: "mission", reqs: [{ stat: "bosses", n: 5, text: "보스 5마리" }], text: "보스 5마리 처치 (누적)" }, col: "#7aa2c8", hp: 250, atk: 21, spd: 245, range: "근접(긴)",
    basic: { name: "창 찌르기", cd: 0.55, fx: [{ t: "arc", d: 1.1, r: 160, ang: 0.6, col: "#d5e6ff" }] },
    sk: [
      { name: "돌격 찌르기", ic: "🔱", cd: 6, desc: "길게 돌진하며 180% 피해", fx: [{ t: "dash", dist: 320, d: 1.8, col: "#d5e6ff" }] },
      { name: "창 휘두르기", ic: "🌀", cd: 8, desc: "넓게 휘둘러 170% 피해 + 크게 밀쳐냄", fx: [{ t: "nova", r: 190, d: 1.7, knock: 220, col: "#d5e6ff" }] },
      { name: "투창", ic: "🎯", cd: 9, desc: "모든 적을 꿰뚫는 창을 던져 260% 피해, 느려짐", fx: [{ t: "proj", d: 2.6, spd: 1000, life: 1, r: 14, col: "#e4efff", shape: "spear", pierce: 99, slow: 0.5 }] },
      { name: "백창진", ic: "⚡", cd: 42, ult: true, desc: "커서 주변에 창 14자루를 떨어뜨려 각 200% 피해", fx: [{ t: "strike", n: 14, scatter: 220, r: 80, d: 2.0, delay: 0.6, stagger: 0.08, col: "#d5e6ff" }] },
    ] },
  { id: "monk", name: "무진", job: "권법가", unlock: { type: "mission", reqs: [{ stat: "rooms", n: 80, text: "방 80개" }], text: "방 80개 정리 (누적)" }, col: "#ff9a4d", hp: 240, atk: 19, spd: 275, range: "근접",
    basic: { name: "연타", cd: 0.3, fx: [{ t: "arc", d: 0.8, r: 85, ang: 1.4, col: "#ffd08a" }] },
    sk: [
      { name: "비룡각", ic: "🦶", cd: 6, desc: "날아차기로 돌진 후 착지 폭발 150%+150%", fx: [{ t: "dash", dist: 240, d: 1.5, col: "#ffd08a" }, { t: "nova", r: 130, d: 1.5, col: "#ffd08a" }] },
      { name: "기공파", ic: "🔆", cd: 7, desc: "큰 기공 덩어리 220% 피해 + 밀쳐냄", fx: [{ t: "proj", d: 2.2, spd: 700, life: 0.9, r: 30, col: "#ffcf5a", pierce: 99, knock: 160 }] },
      { name: "금강불괴", ic: "🧘", cd: 15, desc: "5초 동안 받는 피해 -60%, 체력 12% 회복", fx: [{ t: "buff", dur: 5, dr: 0.6, col: "#ffcf5a" }, { t: "heal", pct: 0.12 }] },
      { name: "백렬권", ic: "👊", cd: 36, ult: true, desc: "1.6초 동안 앞쪽을 16번 때려 각 90% 피해", fx: [{ t: "repeat", n: 16, gap: 0.1, fx: { t: "arc", d: 0.9, r: 130, ang: 1.2, col: "#ffcf5a", aim: true } }] },
    ] },
  { id: "gunner", name: "철매", job: "포수", unlock: { type: "mission", reqs: [{ stat: "maxLevel", n: 18, text: "한 판 레벨 18" }], text: "한 판에서 레벨 18 달성" }, col: "#ff6a4d", hp: 190, atk: 30, spd: 250, range: "원거리",
    basic: { name: "화승총", cd: 0.8, fx: [{ t: "proj", d: 1, spd: 1300, life: 0.6, r: 7, col: "#ffe2a0" }] },
    sk: [
      { name: "산탄 사격", ic: "💥", cd: 5, desc: "가까이 산탄 7발, 각 70% 피해 + 밀쳐냄", fx: [{ t: "proj", n: 7, spread: 0.7, d: 0.7, spd: 1100, life: 0.32, r: 7, col: "#ffd27a", knock: 60 }] },
      { name: "화약 구르기", ic: "🧨", cd: 8, desc: "구르며 자리에 폭발 140% 남김", fx: [{ t: "nova", r: 120, d: 1.4, col: "#ff8a3d" }, { t: "dash", dist: 230, d: 0, inv: 0.4, col: "#ffb07a" }] },
      { name: "화약 단지", ic: "💣", cd: 10, desc: "커서에 단지를 던져 1초 뒤 큰 폭발 320% + 기절", fx: [{ t: "strike", n: 1, r: 150, d: 3.2, delay: 1, stun: 1, col: "#ff7a3d" }] },
      { name: "홍이포 포격", ic: "🎆", cd: 40, ult: true, desc: "커서 주변에 포탄 8발, 각 280% 피해", fx: [{ t: "strike", n: 8, scatter: 230, r: 120, d: 2.8, delay: 0.8, stagger: 0.18, col: "#ff6a3d" }] },
    ] },
  { id: "priest", name: "연화", job: "무녀", unlock: { type: "special", reqs: [{ stat: "bossHighHp", n: 3, text: "체력 60% 이상으로 보스 3번" }, { stat: "rooms", n: 60, text: "방 60개" }], text: "체력 60% 이상 남기고 보스 3번 + 방 60개" }, col: "#ff8fc8", hp: 200, atk: 18, spd: 260, range: "원거리",
    basic: { name: "방울 파동", cd: 0.5, fx: [{ t: "proj", d: 1.15, spd: 700, life: 0.8, r: 12, col: "#ffd6ef", pierce: 2 }] }, // 11-15 혼자서도 싸울 수 있게
    sk: [
      { name: "방울 울림", ic: "🔔", cd: 7, desc: "주변 적 1.2초 기절 + 180% 피해", fx: [{ t: "nova", r: 220, d: 1.8, stun: 1.2, col: "#ffd6ef" }] },
      { name: "치유의 춤", ic: "💗", cd: 12, desc: "체력 25% 회복", fx: [{ t: "heal", pct: 0.25 }] },
      { name: "오방기 결계", ic: "🎏", cd: 13, desc: "자기 자리에 5초 결계 (적 느려짐·초당 140% 피해, 안에서 받는 피해 -30%)", fx: [{ t: "zone", r: 200, dur: 5, dps: 1.4, slow: 0.45, guard: 0.3, col: "#ff9ad5", at: "self" }] },
      { name: "신내림", ic: "✨", cd: 45, ult: true, desc: "8초 동안 공격력 +60%·공격 속도 +40%, 체력 30% 회복", fx: [{ t: "buff", dur: 8, atk: 0.6, as: 0.4, col: "#ffb3e0" }, { t: "heal", pct: 0.3 }] },
    ] },
  { id: "necro", name: "흑운", job: "강령술사", unlock: { type: "special", reqs: [{ stat: "bossLowHp", n: 2, text: "체력 15% 이하로 보스 2번" }, { stat: "deaths", n: 5, text: "5번 쓰러지기" }], text: "체력 15% 이하로 보스 2번 + 5번 쓰러지기" }, col: "#9b7bff", hp: 190, atk: 20, spd: 250, range: "원거리",
    basic: { name: "원혼 구슬", cd: 0.55, fx: [{ t: "proj", d: 1, spd: 650, life: 1, r: 11, col: "#a98bff", home: 2.5 }] },
    sk: [
      { name: "원혼 소환", ic: "👻", cd: 9, desc: "원혼 2마리를 10초 동안 부름", fx: [{ t: "summon", kind: "ghost", n: 2, dur: 10 }] },
      { name: "생명 흡수", ic: "🩸", cd: 8, desc: "직선 광선 200% 피해, 맞힌 적마다 체력 3% 회복", fx: [{ t: "beam", len: 600, w: 40, d: 2.0, col: "#b06bff", drain: 0.03 }] },
      { name: "공포", ic: "😱", cd: 12, desc: "주변 적 2초 동안 크게 느려짐 + 밀쳐냄", fx: [{ t: "nova", r: 230, d: 0.6, slow: 0.7, slowDur: 2, knock: 180, col: "#8a5bff" }] },
      { name: "망자의 군단", ic: "💀", cd: 46, ult: true, desc: "해골 병사 6명을 12초 동안 부름", fx: [{ t: "summon", kind: "skeleton", n: 6, dur: 12 }] },
    ] },
  { id: "assassin", name: "야명", job: "자객", unlock: { type: "special", reqs: [{ stat: "fastClear", n: 5, text: "10초 안에 방 정리 5번" }, { stat: "elites", n: 20, text: "정예 20마리" }], text: "10초 안에 방 정리 5번 + 정예 20마리" }, col: "#ff4d6a", hp: 180, atk: 24, spd: 290, range: "근접",
    basic: { name: "쌍단검", cd: 0.32, fx: [{ t: "arc", d: 0.85, r: 90, ang: 1.5, col: "#ff9aa8" }] },
    sk: [
      { name: "그림자 이동", ic: "🌑", cd: 5, desc: "커서로 순간이동, 도착 지점 150% 피해", fx: [{ t: "blink", dist: 330 }, { t: "nova", r: 110, d: 1.5, col: "#ff6a85" }] },
      { name: "표창", ic: "✴️", cd: 4, desc: "빠른 표창 3발, 각 100% 피해", fx: [{ t: "proj", n: 3, spread: 0.25, d: 1, spd: 1200, life: 0.6, r: 9, col: "#ffc1cb", shape: "star", pierce: 1 }] },
      { name: "은신", ic: "🕶️", cd: 14, desc: "3초 동안 적이 놓침, 이동 +40%, 다음 공격 치명타", fx: [{ t: "buff", dur: 3, stealth: true, spd: 0.4, crit: 1, col: "#ff8fa3" }] },
      { name: "그림자 난도", ic: "🗡️", cd: 38, ult: true, desc: "가까운 적 8명에게 차례로 날아가 각 260% 피해", fx: [{ t: "flurry", n: 8, d: 2.6, gap: 0.12 }] },
    ] },
  { id: "dosa", name: "청운", job: "도사", unlock: { type: "floor", n: 2, reqs: [{ stat: "curses", n: 3, text: "저주 스테이지 3번" }], text: "스토리 2층 도달 + 저주 스테이지 3번" }, col: "#5fd4c4", hp: 185, atk: 23, spd: 255, range: "원거리",
    basic: { name: "부적 던지기", cd: 0.5, fx: [{ t: "proj", d: 1, spd: 760, life: 0.9, r: 10, col: "#ffe08a", shape: "talisman", home: 3 }] },
    sk: [
      { name: "화염 부적", ic: "🔥", cd: 6, desc: "부딪히면 폭발 200% 피해 + 불태움", fx: [{ t: "proj", d: 2.0, spd: 750, life: 1, r: 14, col: "#ff8a3d", shape: "talisman", explode: 120, burn: 3 }] },
      { name: "축지법", ic: "🌫️", cd: 7, desc: "커서로 순간이동", fx: [{ t: "blink", dist: 380 }] },
      { name: "뇌우 부적", ic: "⚡", cd: 9, desc: "번개가 적 6명에게 튀며 각 170% 피해", fx: [{ t: "chain", n: 6, d: 1.7, range: 420, col: "#9fe8ff" }] },
      { name: "오행진", ic: "☯️", cd: 42, ult: true, desc: "커서에 6초 동안 큰 진 (초당 220% 피해, 크게 느려짐)", fx: [{ t: "zone", r: 260, dur: 6, dps: 2.2, slow: 0.6, col: "#5fd4c4", at: "cursor", rune: true }] },
    ] },
  { id: "yinyang", name: "백야", job: "음양사", unlock: { type: "floor", n: 3, reqs: [{ stat: "skillsUsed", n: 800, text: "스킬 800번" }], text: "스토리 3층 도달 + 스킬 800번 사용" }, col: "#e8e3f5", hp: 195, atk: 19, spd: 255, range: "원거리",
    basic: { name: "음양 구슬", cd: 0.48, fx: [{ t: "proj", d: 1, spd: 720, life: 0.9, r: 11, col: "#f5f2ff", alt: "#2a2440" }] },
    sk: [
      { name: "태극 구슬", ic: "⚪", cd: 9, desc: "8초 동안 흑백 구슬 4개가 주위를 돌며 피해 (각 90%)", fx: [{ t: "orbit", n: 4, dur: 8, r: 110, d: 0.9, col: "#f5f2ff", alt: "#2a2440" }] },
      { name: "음양 반전", ic: "🔄", cd: 10, desc: "주변 160% 피해, 체력 10% 회복", fx: [{ t: "nova", r: 170, d: 1.6, col: "#f5f2ff" }, { t: "heal", pct: 0.1 }] },
      { name: "식신 부르기", ic: "📜", cd: 13, desc: "종이 식신 3마리를 9초 동안 부름", fx: [{ t: "summon", kind: "shikigami", n: 3, dur: 9 }] },
      { name: "태극 대폭발", ic: "☯️", cd: 44, ult: true, desc: "커서에 1.2초 뒤 거대 폭발 750% + 기절", fx: [{ t: "strike", n: 1, r: 300, d: 7.5, delay: 1.2, stun: 1.5, col: "#e8e3f5", taeguk: true }] },
    ] },
  { id: "summoner", name: "소담", job: "소환사", unlock: { type: "floor", n: 4, reqs: [{ stat: "petsOwned", n: 8, text: "펫 8종" }], text: "스토리 4층 도달 + 펫 8종 모으기" }, col: "#3fd0d8", hp: 200, atk: 19, spd: 255, range: "원거리",
    basic: { name: "영혼 화살", cd: 0.55, fx: [{ t: "proj", d: 1, spd: 760, life: 0.85, r: 10, col: "#9ff3f8" }] },
    sk: [
      { name: "영호 소환", ic: "🐯", cd: 12, desc: "영혼 호랑이를 14초 동안 부름 (강함)", fx: [{ t: "summon", kind: "tiger", n: 1, dur: 14 }] },
      { name: "영조 소환", ic: "🐦", cd: 9, desc: "멀리서 쏘는 영혼 새 3마리를 10초 동안 부름", fx: [{ t: "summon", kind: "bird", n: 3, dur: 10 }] },
      { name: "영혼 연결", ic: "💠", cd: 13, desc: "체력 18% 회복, 소환수 6초 강화 (+60%)", fx: [{ t: "heal", pct: 0.18 }, { t: "buff", dur: 6, summonBoost: 0.6, col: "#9ff3f8" }] },
      { name: "사신수 강림", ic: "🐉", cd: 48, ult: true, desc: "청룡·백호·주작·현무를 13초 동안 부름", fx: [{ t: "summon", kind: "guardian", n: 4, dur: 13 }] },
    ] },
  { id: "berserker", name: "거칠", job: "광전사", unlock: { type: "floor", n: 5, reqs: [{ stat: "elites", n: 60, text: "정예 60마리" }], text: "스토리 5층 도달 + 정예 60마리" }, col: "#ff6b3d", hp: 290, atk: 26, spd: 245, range: "근접",
    basic: { name: "쌍도끼", cd: 0.65, fx: [{ t: "arc", d: 1.2, r: 120, ang: 2.4, col: "#ffb08a" }] },
    sk: [
      { name: "도끼 던지기", ic: "🪓", cd: 6, desc: "꿰뚫는 도끼 200% 피해", fx: [{ t: "proj", d: 2.0, spd: 800, life: 0.8, r: 18, col: "#ffcfb0", shape: "axe", pierce: 99 }] },
      { name: "도약 내려찍기", ic: "⛰️", cd: 8, desc: "커서로 뛰어올라 착지 240% + 기절", fx: [{ t: "blink", dist: 300, leap: true }, { t: "nova", r: 160, d: 2.4, stun: 0.8, col: "#ff9a5a" }] },
      { name: "광폭화", ic: "😤", cd: 15, desc: "6초 동안 공격력 +50%, 공격 속도 +50%, 피해 흡혈 10%", fx: [{ t: "buff", dur: 6, atk: 0.5, as: 0.5, ls: 0.1, col: "#ff5a3d" }] },
      { name: "피의 회오리", ic: "🌪️", cd: 40, ult: true, desc: "3초 동안 회전하며 12번 각 150% 피해, 받는 피해 -40%", fx: [{ t: "buff", dur: 3, dr: 0.4, col: "#ff5a3d" }, { t: "repeat", n: 12, gap: 0.25, fx: { t: "nova", r: 190, d: 1.5, col: "#ff6b3d", follow: true } }] },
    ] },
  { id: "moon", name: "월영", job: "월하검희", unlock: { type: "gacha" }, col: "#c9b8ff", hp: 215, atk: 25, spd: 280, range: "근접", rare: 4,
    basic: { name: "쌍월도", cd: 0.36, fx: [{ t: "arc", d: 0.95, r: 115, ang: 2.2, col: "#e6dcff" }] },
    sk: [
      { name: "초승달 검기", ic: "🌙", cd: 4, desc: "꿰뚫는 초승달 검기 190% 피해", fx: [{ t: "proj", d: 1.9, spd: 900, life: 0.7, r: 26, col: "#e6dcff", shape: "crescent", pierce: 99 }] },
      { name: "월광 보법", ic: "💫", cd: 6, desc: "커서로 미끄러지며 지나간 적 140% 피해, 무적", fx: [{ t: "dash", dist: 280, d: 1.4, inv: 0.4, col: "#e6dcff" }] },
      { name: "만월", ic: "🌕", cd: 11, desc: "주변 220% 피해, 적 2초 느려짐", fx: [{ t: "nova", r: 200, d: 2.2, slow: 0.5, slowDur: 2, col: "#d9ccff" }] },
      { name: "월하난무", ic: "🌸", cd: 36, ult: true, desc: "적 10명에게 차례로 베어들고 마지막에 만월 폭발", fx: [{ t: "flurry", n: 10, d: 2.4, gap: 0.1 }, { t: "nova", r: 260, d: 3, col: "#e6dcff", delay: 1.1 }] },
    ] },
  { id: "thunder", name: "천뢰", job: "뇌전장군", unlock: { type: "gacha" }, col: "#ffe14d", hp: 260, atk: 24, spd: 250, range: "근접(긴)", rare: 4,
    basic: { name: "뇌전 언월도", cd: 0.55, fx: [{ t: "arc", d: 1.05, r: 140, ang: 1.8, col: "#fff2a0" }, { t: "chain", n: 2, d: 0.35, range: 260, col: "#fff2a0", chance: 0.35 }] },
    sk: [
      { name: "뇌창", ic: "⚡", cd: 5, desc: "번개 창 직선 220% 피해", fx: [{ t: "beam", len: 700, w: 46, d: 2.2, col: "#fff27a" }] },
      { name: "벼락 강림", ic: "🌩️", cd: 8, desc: "커서에 벼락, 260% + 1초 기절", fx: [{ t: "strike", n: 1, r: 140, d: 2.6, delay: 0.45, stun: 1, col: "#fff27a", bolt: true }] },
      { name: "천둥 갑옷", ic: "🛡️", cd: 15, desc: "6초 동안 받는 피해 -35%, 주변 적에게 초당 80% 감전", fx: [{ t: "buff", dur: 6, dr: 0.35, aura: 0.8, col: "#fff27a" }] },
      { name: "뇌신강림", ic: "🐲", cd: 44, ult: true, desc: "방 전체에 벼락 16번, 각 260%", fx: [{ t: "strike", n: 16, scatter: 9999, r: 120, d: 2.6, delay: 0.5, stagger: 0.12, col: "#fff27a", bolt: true, targetEnemies: true }] },
    ] },
  { id: "fox", name: "여우비", job: "구미호", unlock: { type: "gacha" }, col: "#ff8a3d", hp: 205, atk: 23, spd: 275, range: "원거리", rare: 4,
    basic: { name: "여우불", cd: 0.45, fx: [{ t: "proj", n: 2, spread: 0.18, d: 0.65, spd: 720, life: 0.9, r: 10, col: "#7fd8ff", home: 3.5 }] },
    sk: [
      { name: "여우불 부채", ic: "🔥", cd: 5, desc: "푸른 불 7개, 각 90% 피해 (따라감)", fx: [{ t: "proj", n: 7, spread: 1.2, d: 0.9, spd: 650, life: 1.1, r: 11, col: "#7fd8ff", home: 3 }] },
      { name: "매혹", ic: "💋", cd: 10, desc: "맞은 적 2.2초 홀림(멈춤) + 150% 피해", fx: [{ t: "proj", d: 1.5, spd: 800, life: 0.9, r: 20, col: "#ff8fc8", shape: "heart", stun: 2.2, pierce: 3 }] },
      { name: "꼬리 감추기", ic: "🦊", cd: 8, desc: "커서로 순간이동, 1초 무적, 자리에 여우불 폭발 120%", fx: [{ t: "nova", r: 120, d: 1.2, col: "#7fd8ff" }, { t: "blink", dist: 300 }, { t: "buff", dur: 1, inv: true, col: "#ff8a3d" }] },
      { name: "구미 여우불", ic: "🌟", cd: 40, ult: true, desc: "10초 동안 여우불 9개가 돌다가 가까운 적을 쫓아감", fx: [{ t: "orbit", n: 9, dur: 10, r: 120, d: 1.2, col: "#7fd8ff", seek: true }] },
    ] },
  { id: "reaper", name: "명부", job: "저승차사", unlock: { type: "gacha" }, col: "#b06bff", hp: 240, atk: 24, spd: 260, range: "근접(긴)", rare: 4,
    basic: { name: "저승 사슬", cd: 0.55, fx: [{ t: "arc", d: 1.05, r: 150, ang: 1.0, col: "#d2a8ff" }] },
    sk: [
      { name: "사슬 당기기", ic: "⛓️", cd: 6, desc: "사슬을 던져 맞은 적을 끌어오고 160% 피해", fx: [{ t: "proj", d: 1.6, spd: 1000, life: 0.6, r: 16, col: "#d2a8ff", shape: "chain", pull: true, pierce: 3 }] },
      { name: "명부 기록", ic: "📕", cd: 10, desc: "커서에 표식, 4초 동안 초당 160% 피해", fx: [{ t: "zone", r: 140, dur: 4, dps: 1.6, slow: 0.3, col: "#9b5bff", at: "cursor" }] },
      { name: "혼 거두기", ic: "💜", cd: 12, desc: "주변 170% 피해, 맞힌 적마다 체력 4% 회복", fx: [{ t: "nova", r: 190, d: 1.7, drain: 0.04, col: "#b06bff" }] },
      { name: "저승문", ic: "🚪", cd: 46, ult: true, desc: "커서에 5초 동안 저승문 (초당 300%, 체력 15% 이하 적 25% 확률 즉사)", fx: [{ t: "zone", r: 240, dur: 5, dps: 3.0, slow: 0.5, execute: 0.15, col: "#7b3bff", at: "cursor", rune: true }] },
    ] },
  // --- 가챠 A급 ---
  { id: "haerang", name: "해랑", job: "수군장", unlock: { type: "gacha" }, col: "#5fc8ff", hp: 245, atk: 23, spd: 260, range: "근접",
    basic: { name: "물결 베기", cd: 0.5, fx: [{ t: "arc", d: 1, r: 135, ang: 1.8, col: "#9fe0ff" }] },
    sk: [
      { name: "물살 가르기", ic: "🌊", cd: 6, desc: "물살처럼 돌진하며 170% 피해", fx: [{ t: "dash", dist: 270, d: 1.7, col: "#9fe0ff" }] },
      { name: "거북 방패", ic: "🛡️", cd: 13, desc: "4초 동안 받는 피해 -50% + 보호막 25%", fx: [{ t: "buff", dur: 4, dr: 0.5, col: "#5fc8ff" }, { t: "heal", shield: 0.25 }] },
      { name: "소용돌이", ic: "🌀", cd: 11, desc: "4초 동안 내 주변 소용돌이 (초당 130%, 느려짐)", fx: [{ t: "zone", r: 200, dur: 4, dps: 1.3, slow: 0.4, col: "#5fc8ff", at: "self", follow: true }] },
      { name: "거북선 포격", ic: "⛵", cd: 40, ult: true, desc: "적에게 포탄 10발, 각 280%", fx: [{ t: "strike", n: 10, scatter: 9999, r: 110, d: 2.8, delay: 0.6, stagger: 0.12, col: "#9fe0ff", targetEnemies: true }] },
    ] },
  { id: "danbi", name: "단비", job: "매사냥꾼", unlock: { type: "gacha" }, col: "#d9a46a", hp: 195, atk: 24, spd: 275, range: "원거리",
    basic: { name: "사냥 화살", cd: 0.42, fx: [{ t: "proj", d: 1, spd: 950, life: 0.76, r: 8, col: "#ffe2b0", shape: "arrow" }] },
    sk: [
      { name: "매 날리기", ic: "🦅", cd: 10, desc: "사냥매 2마리를 10초 동안 부름", fx: [{ t: "summon", kind: "bird", n: 2, dur: 10 }] },
      { name: "연사", ic: "🏹", cd: 5, desc: "화살 4발, 각 120%", fx: [{ t: "proj", n: 4, spread: 0.3, d: 1.2, spd: 1000, life: 0.75, r: 8, col: "#ffe2b0", shape: "arrow" }] },
      { name: "올가미 덫", ic: "🪤", cd: 11, desc: "커서에 5초 덫 (크게 느려짐, 초당 100%)", fx: [{ t: "zone", r: 150, dur: 5, dps: 1.0, slow: 0.6, col: "#d9a46a", at: "cursor" }] },
      { name: "매의 폭풍", ic: "🌪️", cd: 38, ult: true, desc: "2초 동안 따라가는 화살 24발, 각 140%", fx: [{ t: "repeat", n: 8, gap: 0.25, fx: { t: "proj", n: 3, spread: 0.8, d: 1.4, spd: 850, life: 1.1, r: 8, col: "#ffe2b0", shape: "arrow", home: 4 } }] },
    ] },
  // --- 가챠 SS급 ---
  { id: "cheonrang", name: "천랑", job: "백호신장", unlock: { type: "gacha" }, col: "#e8f4ff", hp: 290, atk: 28, spd: 270, range: "근접(긴)",
    basic: { name: "백호 언월도", cd: 0.5, fx: [{ t: "arc", d: 1.15, r: 160, ang: 2.0, col: "#e8f4ff" }] },
    sk: [
      { name: "백호 돌격", ic: "🐅", cd: 6, desc: "돌진 240% + 끝에 160% 폭발, 무적", fx: [{ t: "dash", dist: 360, d: 2.4, inv: 0.3, col: "#e8f4ff" }, { t: "nova", r: 150, d: 1.6, col: "#e8f4ff", delay: 0.2 }] },
      { name: "백호의 포효", ic: "📢", cd: 10, desc: "넓게 140% + 1.2초 기절", fx: [{ t: "nova", r: 260, d: 1.4, stun: 1.2, col: "#e8f4ff" }] },
      { name: "백호 혼령", ic: "🐯", cd: 14, desc: "백호 혼령을 12초 동안 부름", fx: [{ t: "summon", kind: "tiger", n: 1, dur: 12 }] },
      { name: "백호신 강림", ic: "⚡", cd: 42, ult: true, desc: "10초 동안 공격력 +70%·공격 속도 +50%, 주변을 10번 각 180%", fx: [{ t: "buff", dur: 10, atk: 0.7, as: 0.5, col: "#e8f4ff" }, { t: "repeat", n: 10, gap: 0.5, fx: { t: "nova", r: 230, d: 1.8, col: "#e8f4ff", follow: true } }] },
    ] },
  { id: "hwaryeon", name: "화련", job: "주작무녀", unlock: { type: "gacha" }, col: "#ff7a3d", hp: 230, atk: 27, spd: 275, range: "원거리",
    basic: { name: "주작 불씨", cd: 0.45, fx: [{ t: "proj", n: 2, spread: 0.2, d: 0.7, spd: 760, life: 0.74, r: 11, col: "#ff9a3d", home: 2.5, burn: 2 }] },
    sk: [
      { name: "주작 깃털", ic: "🪶", cd: 5, desc: "따라가는 불깃털 6개, 각 130% + 불태움", fx: [{ t: "proj", n: 6, spread: 1.2, d: 1.3, spd: 700, life: 1.1, r: 12, col: "#ff9a3d", home: 3, burn: 3 }] },
      { name: "불사의 날개", ic: "🔥", cd: 14, desc: "체력 20% 회복 + 1.5초 무적", fx: [{ t: "heal", pct: 0.2 }, { t: "buff", dur: 1.5, inv: true, col: "#ff7a3d" }] },
      { name: "화염 방울진", ic: "🔔", cd: 12, desc: "커서에 5초 불의 진 (초당 220%)", fx: [{ t: "zone", r: 200, dur: 5, dps: 2.2, col: "#ff7a3d", at: "cursor", rune: true }] },
      { name: "주작 강림", ic: "🐦‍🔥", cd: 44, ult: true, desc: "적에게 불벼락 12번 각 340% + 체력 25% 회복", fx: [{ t: "strike", n: 12, scatter: 9999, r: 120, d: 3.4, delay: 0.6, stagger: 0.1, col: "#ff7a3d", targetEnemies: true }, { t: "heal", pct: 0.25 }] },
    ] },
  // 봉냥이: 수인. 출발할 때마다 늑대인간(남) / 구미호(여) 중 랜덤
  // ===== 11-12 추가 가챠 영웅 (C 4 · B 3 · A 2 · S 1 · SS 1) + 이스터에그 영웅 1 =====
  { id: "dolsoe", name: "돌쇠", job: "의병 농부", unlock: { type: "gacha" }, col: "#c9a46a", hp: 240, atk: 22, spd: 250, range: "근접",
    basic: { name: "쇠스랑 찍기", cd: 0.55, fx: [{ t: "arc", d: 1, r: 120, ang: 1.6, col: "#e0c48a" }] },
    sk: [
      { name: "논두렁 돌진", ic: "🐂", cd: 7, desc: "앞으로 돌진하며 150% 피해", fx: [{ t: "dash", dist: 240, d: 1.5, col: "#e0c48a" }] },
      { name: "쇠스랑 휘돌리기", ic: "🌾", cd: 9, desc: "주변 적에게 170% 피해", fx: [{ t: "nova", r: 170, d: 1.7, col: "#e0c48a" }] },
      { name: "막걸리 한 사발", ic: "🍶", cd: 15, desc: "체력 20% 회복 + 5초 공격력 +20%", fx: [{ t: "heal", pct: 0.2 }, { t: "buff", dur: 5, atk: 0.2, col: "#f2e2b0" }] },
      { name: "의병 봉기", ic: "🔥", cd: 45, ult: true, desc: "의병 3명을 12초 동안 부름", fx: [{ t: "summon", kind: "militia", n: 3, dur: 12 }] },
    ] },
  { id: "pojol", name: "삼식", job: "포졸", unlock: { type: "gacha" }, col: "#d65a4a", hp: 235, atk: 21, spd: 255, range: "근접",
    basic: { name: "육모방망이", cd: 0.5, fx: [{ t: "arc", d: 1, r: 115, ang: 1.5, col: "#ff9a8a" }] },
    sk: [
      { name: "포승줄 던지기", ic: "🪢", cd: 7, desc: "줄을 던져 150% 피해 + 1초 기절", fx: [{ t: "proj", d: 1.5, spd: 800, life: 0.6, r: 12, col: "#e8d0a0", stun: 1 }] },
      { name: "게 섰거라!", ic: "📣", cd: 10, desc: "주변 적 1.2초 기절 + 120% 피해", fx: [{ t: "nova", r: 190, d: 1.2, stun: 1.2, col: "#ff9a8a" }] },
      { name: "순라 돌기", ic: "🏮", cd: 12, desc: "6초 동안 이동 속도 +35%, 받는 피해 -20%", fx: [{ t: "buff", dur: 6, spd: 0.35, dr: 0.2, col: "#ffb08a" }] },
      { name: "포도청 출동", ic: "🚨", cd: 42, ult: true, desc: "적에게 방망이 8번 내려치기, 각 220%", fx: [{ t: "strike", n: 8, scatter: 9999, r: 95, d: 2.2, delay: 0.5, stagger: 0.12, col: "#ff9a8a", targetEnemies: true }] },
    ] },
  { id: "yakcho", name: "초롱", job: "약초꾼", unlock: { type: "gacha" }, col: "#7fe08a", hp: 200, atk: 19, spd: 265, range: "원거리",
    basic: { name: "약초 주머니", cd: 0.5, fx: [{ t: "proj", d: 1, spd: 780, life: 0.75, r: 10, col: "#a8f0a0" }] },
    sk: [
      { name: "쑥 연기", ic: "🌿", cd: 8, desc: "4초 동안 연기 장판 (초당 90%, 느려짐)", fx: [{ t: "zone", r: 150, dur: 4, dps: 0.9, slow: 0.35, col: "#7fe08a" }] },
      { name: "독초 세 갈래", ic: "🍃", cd: 6, desc: "독초 3발 각 120% + 중독", fx: [{ t: "proj", n: 3, spread: 0.5, d: 1.2, spd: 820, life: 0.7, r: 10, col: "#8fdc5a", burn: 3 }] },
      { name: "인삼 달인 물", ic: "🫚", cd: 16, desc: "체력 30% 회복", fx: [{ t: "heal", pct: 0.3 }] },
      { name: "백초 비", ic: "🌧️", cd: 40, ult: true, desc: "약초 비 12번 각 180%, 내 체력 15% 회복", fx: [{ t: "strike", n: 12, scatter: 9999, r: 90, d: 1.8, delay: 0.5, stagger: 0.1, col: "#7fe08a", targetEnemies: true }, { t: "heal", pct: 0.15 }] },
    ] },
  { id: "namu", name: "곰배", job: "나무꾼", unlock: { type: "gacha" }, col: "#b07a4a", hp: 250, atk: 21, spd: 245, range: "중거리",
    basic: { name: "도끼 던지기", cd: 0.62, fx: [{ t: "proj", d: 1.1, spd: 700, life: 0.6, r: 13, col: "#d8a070", pierce: 1 }] },
    sk: [
      { name: "통나무 굴리기", ic: "🪵", cd: 8, desc: "꿰뚫는 통나무 200% + 밀쳐냄", fx: [{ t: "proj", d: 2, spd: 600, life: 1.1, r: 26, col: "#c88a50", pierce: 9, knock: 140 }] },
      { name: "도끼 회오리", ic: "🪓", cd: 9, desc: "주변 160% 2번", fx: [{ t: "repeat", n: 2, gap: 0.3, fx: { t: "nova", r: 160, d: 1.6, col: "#d8a070" } }] },
      { name: "산사람 근성", ic: "💪", cd: 14, desc: "보호막 25% + 5초 받는 피해 -25%", fx: [{ t: "heal", shield: 0.25 }, { t: "buff", dur: 5, dr: 0.25, col: "#c88a50" }] },
      { name: "금도끼 은도끼", ic: "✨", cd: 44, ult: true, desc: "금·은 도끼 10개를 사방으로 각 260%", fx: [{ t: "proj", n: 10, spread: 6.28, d: 2.6, spd: 650, life: 1.0, r: 16, col: "#ffd84a", alt: "#d8e4f0", pierce: 3 }] },
    ] },
  { id: "geommu", name: "설화", job: "검무 기생", unlock: { type: "gacha" }, col: "#ff7ab0", hp: 215, atk: 24, spd: 285, range: "근접",
    basic: { name: "쌍검 춤", cd: 0.38, fx: [{ t: "arc", d: 0.75, r: 115, ang: 2.2, col: "#ffb0d0" }] },
    sk: [
      { name: "꽃잎 걸음", ic: "🌸", cd: 6, desc: "순간이동 + 그 자리 150% 피해", fx: [{ t: "blink", dist: 260 }, { t: "nova", r: 140, d: 1.5, col: "#ffb0d0" }] },
      { name: "칼춤 연무", ic: "🗡️", cd: 9, desc: "주변 6번 베기 각 60%", fx: [{ t: "repeat", n: 6, gap: 0.12, fx: { t: "nova", r: 150, d: 0.6, col: "#ff7ab0" } }] },
      { name: "부채 가림", ic: "🪭", cd: 13, desc: "2초 무적 + 공격 속도 +30% 5초", fx: [{ t: "buff", dur: 2, inv: true, col: "#ffd0e0" }, { t: "buff", dur: 5, as: 0.3, col: "#ff7ab0" }] },
      { name: "진주성 검무", ic: "💮", cd: 40, ult: true, desc: "적 사이를 넘나들며 10번 베기 각 200%", fx: [{ t: "flurry", n: 10, d: 2, gap: 0.1 }] },
    ] },
  { id: "mudang", name: "만신", job: "큰무당", unlock: { type: "gacha" }, col: "#e85a5a", hp: 205, atk: 24, spd: 260, range: "원거리",
    basic: { name: "방울 소리", cd: 0.48, fx: [{ t: "proj", d: 1, spd: 760, life: 0.8, r: 10, col: "#ffd060", home: 1.2 }] },
    sk: [
      { name: "오방기 휘날림", ic: "🎏", cd: 8, desc: "다섯 색 깃발 5발 각 110%", fx: [{ t: "proj", n: 5, spread: 0.9, d: 1.1, spd: 760, life: 0.8, r: 10, col: "#ff5a5a", alt: "#5ab0ff" }] },
      { name: "작두 타기", ic: "⚔️", cd: 10, desc: "3초 무적 + 주변 초당 120%", fx: [{ t: "buff", dur: 3, inv: true, col: "#ff8a5a" }, { t: "zone", r: 170, dur: 3, dps: 1.2, col: "#e85a5a", at: "self", follow: true }] },
      { name: "넋 달래기", ic: "🕯️", cd: 12, desc: "혼령 2명을 10초 부름", fx: [{ t: "summon", kind: "ghost", n: 2, dur: 10 }] },
      { name: "대굿", ic: "🥁", cd: 45, ult: true, desc: "큰 굿판: 6초 동안 넓은 장판 초당 200%, 적 느려짐", fx: [{ t: "zone", r: 320, dur: 6, dps: 2.0, slow: 0.4, col: "#e85a5a", rune: true }] },
    ] },
  { id: "hwarang", name: "사다함", job: "화랑", unlock: { type: "gacha" }, col: "#ffb547", hp: 235, atk: 24, spd: 270, range: "근접(긴)",
    basic: { name: "화랑 검", cd: 0.46, fx: [{ t: "arc", d: 1, r: 140, ang: 1.6, col: "#ffd27a" }] },
    sk: [
      { name: "임전무퇴", ic: "🛡️", cd: 12, desc: "6초 동안 공격력 +30%, 받는 피해 -20%", fx: [{ t: "buff", dur: 6, atk: 0.3, dr: 0.2, col: "#ffd27a" }] },
      { name: "말발굽 돌격", ic: "🐎", cd: 7, desc: "길게 돌진 180%", fx: [{ t: "dash", dist: 320, d: 1.8, col: "#ffb547", inv: 0.3 }] },
      { name: "풍월 검기", ic: "🌙", cd: 8, desc: "꿰뚫는 검기 3발 각 150%", fx: [{ t: "proj", n: 3, spread: 0.35, d: 1.5, spd: 900, life: 0.6, r: 14, col: "#ffe0a0", pierce: 4 }] },
      { name: "신라의 별", ic: "⭐", cd: 44, ult: true, desc: "별빛 낙하 7번 각 300%", fx: [{ t: "strike", n: 7, scatter: 260, r: 120, d: 3, delay: 0.6, stagger: 0.15, col: "#ffd27a" }] },
    ] },
  { id: "eosa", name: "이몽룡", job: "암행어사", unlock: { type: "gacha" }, col: "#8ab4ff", hp: 230, atk: 25, spd: 270, range: "근접",
    basic: { name: "마패 치기", cd: 0.45, fx: [{ t: "arc", d: 1.05, r: 125, ang: 1.7, col: "#c0d8ff" }] },
    sk: [
      { name: "암행어사 출두야!", ic: "📯", cd: 11, desc: "주변 적 1.5초 기절 + 160%", fx: [{ t: "nova", r: 230, d: 1.6, stun: 1.5, col: "#ffd84a" }] },
      { name: "마패 빛", ic: "🔆", cd: 7, desc: "꿰뚫는 빛 220%", fx: [{ t: "proj", d: 2.2, spd: 1100, life: 0.6, r: 18, col: "#ffe680", pierce: 9 }] },
      { name: "변복 잠행", ic: "👒", cd: 13, desc: "4초 은신 + 다음 공격 치명타 + 이동 +30%", fx: [{ t: "buff", dur: 4, stealth: true, spd: 0.3, crit: true, col: "#8ab4ff" }] },
      { name: "역졸 총출동", ic: "🧑‍⚖️", cd: 42, ult: true, desc: "역졸 4명 12초 + 적에게 낙인 6번 각 220%", fx: [{ t: "summon", kind: "soldier", n: 4, dur: 12 }, { t: "strike", n: 6, scatter: 9999, r: 100, d: 2.2, delay: 0.5, stagger: 0.12, col: "#ffd84a", targetEnemies: true }] },
    ] },
  { id: "sorikun", name: "소리", job: "소리꾼", unlock: { type: "gacha" }, col: "#ff9a6a", hp: 210, atk: 25, spd: 265, range: "원거리",
    basic: { name: "북장단", cd: 0.45, fx: [{ t: "proj", d: 1, spd: 820, life: 0.8, r: 12, col: "#ffc09a" }] },
    sk: [
      { name: "진양조", ic: "🎶", cd: 8, desc: "느린 소리 장판 5초 (초당 100%, 적 느려짐)", fx: [{ t: "zone", r: 200, dur: 5, dps: 1, slow: 0.5, col: "#ff9a6a" }] },
      { name: "휘모리", ic: "🥁", cd: 7, desc: "빠른 장단 8발 각 80%", fx: [{ t: "repeat", n: 8, gap: 0.08, fx: { t: "proj", d: 0.8, spd: 900, life: 0.7, r: 10, col: "#ffc09a" } }] },
      { name: "얼씨구!", ic: "👏", cd: 13, desc: "6초 동안 공격 속도 +35%, 체력 15% 회복", fx: [{ t: "buff", dur: 6, as: 0.35, col: "#ffd0a0" }, { t: "heal", pct: 0.15 }] },
      { name: "한바탕 판소리", ic: "🎤", cd: 44, ult: true, desc: "온 방에 울리는 소리 400% + 1.5초 기절", fx: [{ t: "nova", r: 9999, d: 4, stun: 1.5, col: "#ff9a6a" }] },
    ] },
  { id: "eulji", name: "을지문덕", job: "고구려 대장군", unlock: { type: "gacha" }, col: "#5ab0ff", hp: 285, atk: 27, spd: 260, range: "근접(긴)",
    basic: { name: "대장군 창", cd: 0.48, fx: [{ t: "arc", d: 1.1, r: 160, ang: 1.3, col: "#a0d0ff" }] },
    sk: [
      { name: "살수 대첩", ic: "🌊", cd: 10, desc: "물살 장판 5초 (초당 150%, 느려짐) + 밀쳐냄", fx: [{ t: "zone", r: 230, dur: 5, dps: 1.5, slow: 0.45, col: "#5ab0ff" }, { t: "nova", r: 230, d: 1, knock: 160, col: "#5ab0ff" }] },
      { name: "철기 돌격", ic: "🐎", cd: 7, desc: "무적 돌진 220%", fx: [{ t: "dash", dist: 340, d: 2.2, col: "#a0d0ff", inv: 0.4 }] },
      { name: "고구려 군단", ic: "🚩", cd: 14, desc: "고구려 병사 3명 14초", fx: [{ t: "summon", kind: "soldier", n: 3, dur: 14 }] },
      { name: "여수장우중문시", ic: "📜", cd: 46, ult: true, desc: "적 장수를 꾸짖는 시: 온 방 500% + 8초 공격력 +40%", fx: [{ t: "nova", r: 9999, d: 5, col: "#a0d0ff" }, { t: "buff", dur: 8, atk: 0.4, col: "#5ab0ff" }] },
    ] },
  { id: "haemosu", name: "해모수", job: "천제의 아들", unlock: { type: "gacha" }, col: "#ffd84a", hp: 245, atk: 30, spd: 280, range: "원거리",
    basic: { name: "햇살 화살", cd: 0.38, fx: [{ t: "proj", d: 1, spd: 1100, life: 0.7, r: 10, col: "#fff0a0", shape: "arrow", pierce: 1 }] },
    sk: [
      { name: "오룡거 질주", ic: "🐉", cd: 7, desc: "다섯 용 수레로 돌진 250%", fx: [{ t: "dash", dist: 360, d: 2.5, col: "#ffd84a", inv: 0.4 }] },
      { name: "태양 화살비", ic: "☀️", cd: 9, desc: "햇살 화살 9발 각 130%", fx: [{ t: "proj", n: 9, spread: 1.2, d: 1.3, spd: 1000, life: 0.7, r: 10, col: "#ffe680", shape: "arrow" }] },
      { name: "천제의 가호", ic: "👑", cd: 15, desc: "8초 동안 공격력 +40%, 보호막 30%", fx: [{ t: "buff", dur: 8, atk: 0.4, col: "#ffd84a" }, { t: "heal", shield: 0.3 }] },
      { name: "하늘 문 열림", ic: "🌞", cd: 48, ult: true, desc: "하늘에서 햇빛 기둥 14번 각 380%", fx: [{ t: "strike", n: 14, scatter: 9999, r: 120, d: 3.8, delay: 0.6, stagger: 0.09, col: "#ffe680", targetEnemies: true, bolt: true }] },
    ] },
  { id: "jipsin", name: "짚신", job: "허수아비 장군", unlock: { type: "special", secret: true, reqs: [{ stat: "dummyKills", n: 200, text: "연습장 허수아비 200번 쓰러뜨리기" }, { stat: "storyClear", n: 1, text: "스토리 전체 클리어" }], text: "??? (숨은 영웅)" }, col: "#d8b870", hp: 260, atk: 24, spd: 255, range: "근접",
    basic: { name: "지푸라기 주먹", cd: 0.45, fx: [{ t: "arc", d: 1, r: 120, ang: 1.6, col: "#f0d890" }] },
    sk: [
      { name: "짚단 날리기", ic: "🌾", cd: 6, desc: "짚단 5발 각 110%", fx: [{ t: "proj", n: 5, spread: 0.8, d: 1.1, spd: 760, life: 0.7, r: 12, col: "#f0d890" }] },
      { name: "허수아비 바꿔치기", ic: "🎭", cd: 10, desc: "순간이동 + 그 자리 미끼 폭발 180%", fx: [{ t: "nova", r: 160, d: 1.8, col: "#f0d890" }, { t: "blink", dist: 280 }] },
      { name: "백 번 쓰러져도", ic: "💪", cd: 18, desc: "체력 35% 회복 + 5초 받는 피해 -40%", fx: [{ t: "heal", pct: 0.35 }, { t: "buff", dur: 5, dr: 0.4, col: "#d8b870" }] },
      { name: "허수아비 군단", ic: "🎎", cd: 44, ult: true, desc: "허수아비 병사 5명 14초", fx: [{ t: "summon", kind: "scarecrow", n: 5, dur: 14 }] },
    ] },
  { id: "bong", name: "봉냥이", job: "수인", unlock: { type: "special", reqs: [{ stat: "storyClear", n: 1, text: "스토리 전체 완료" }, { stat: "endlessBest", n: 30, text: "무한의 방 30번째 방" }, { stat: "raidClear", n: 1, text: "보스 레이드 완료" }], text: "스토리 전체 완료 + 무한의 방 30번째 방 + 보스 레이드 완료" }, col: "#ffb36b", hp: 235, atk: 23, spd: 275, range: "근접/원거리",
    forms: {
      wolf: { formName: "늑대인간", art: "bong_wolf", hp: 265, atk: 25, spd: 265, range: "근접",
        basic: { name: "늑대 발톱", cd: 0.38, fx: [{ t: "arc", d: 1.0, r: 110, ang: 2.0, col: "#e3e7f0" }] } },
      fox: { formName: "구미호", art: "bong_fox", hp: 205, atk: 23, spd: 290, range: "원거리",
        basic: { name: "여우 구슬", cd: 0.42, fx: [{ t: "proj", n: 2, spread: 0.2, d: 0.62, spd: 760, life: 0.85, r: 10, col: "#ffb36b", home: 3 }] } },
    },
    basic: { name: "발톱", cd: 0.4, fx: [{ t: "arc", d: 1, r: 110, ang: 2, col: "#e3e7f0" }] },
    sk: [
      { name: "야성의 할퀴기", ic: "🐾", cd: 5, desc: "돌진하며 할퀴어 170% 피해", fx: [{ t: "dash", dist: 260, d: 1.7, col: "#ffcf9a" }] },
      { name: "달밤 도약", ic: "🌙", cd: 7, desc: "커서로 뛰어올라 착지 200% + 기절", fx: [{ t: "blink", dist: 320, leap: true }, { t: "nova", r: 150, d: 2.0, stun: 0.7, col: "#ffcf9a" }] },
      { name: "울부짖음", ic: "🐺", cd: 13, desc: "주변 적 1.5초 겁먹게(느려짐) + 공격력 +35% 6초", fx: [{ t: "nova", r: 230, d: 0.6, slow: 0.6, slowDur: 1.5, col: "#ffcf9a" }, { t: "buff", dur: 6, atk: 0.35, col: "#ffb36b" }] },
      { name: "야수 해방", ic: "🔥", cd: 40, ult: true, desc: "10초 동안 공격력 +60%·공격 속도 +60%·흡혈 8%, 주변에 여우불 6개", fx: [{ t: "buff", dur: 10, atk: 0.6, as: 0.6, ls: 0.08, col: "#ff8a3d" }, { t: "orbit", n: 6, dur: 10, r: 115, d: 0.9, col: "#ffb36b" }] },
    ] },
];
const CHAR = Object.fromEntries(CHARS.map((c) => [c.id, c]));
// 형태가 있는 캐릭터는 출발할 때 형태를 정해 합친다
function charDef(id, form) {
  const c = CHAR[id];
  if (!c.forms) return c;
  const f = c.forms[form] || Object.values(c.forms)[0];
  return Object.assign({}, c, f, { form, formName: f.formName });
}
const charArt = (id, form) => (CHAR[id].forms ? (CHAR[id].forms[form] || Object.values(CHAR[id].forms)[0]).art : id);
const UNLOCK_TYPE = { start: "기본", mission: "임무 해금", special: "특수 임무", floor: "층 도달", gacha: "뽑기" };

// ===== 액티브 (Space) — 원정 중 랜덤으로 얻어 1개만 들기 =====
// 사용자 요청 11-10: 기본 50 · 저급 25 · 중급 15 · 상급 7 · 특급 3 (총 100) + 보스 전용 6 (따로 특수 제작)
// 속성 10 × 형태 10 조합으로 만들고, 등급이 오를수록 위력·범위·추가 효과가 커진다.
const ACT_TIER = { 1: { name: "기본", col: "#b8b2c6" }, 2: { name: "저급", col: "#7fd18b" }, 3: { name: "중급", col: "#6db6ff" }, 4: { name: "상급", col: "#c38bff" }, 5: { name: "특급", col: "#ffb547" }, 6: { name: "보스 전용", col: "#ff5a4d" } };
const ACT_EL = [
  { k: "fire", n: "화염", ic: "🔥", col: "#ff7a3d", o: { burn: 3 } },
  { k: "frost", n: "서리", ic: "❄️", col: "#9fe8ff", o: { slow: 0.5, slowDur: 2 } },
  { k: "thunder", n: "번개", ic: "⚡", col: "#fff27a", o: { stun: 0.6 } },
  { k: "poison", n: "독", ic: "☠️", col: "#8fdc5a", o: { burn: 4, slow: 0.25 } },
  { k: "wind", n: "바람", ic: "🌪️", col: "#cfeaff", o: { knock: 160 } },
  { k: "light", n: "빛", ic: "✨", col: "#ffe9a0", o: { heal: 0.06 } },
  { k: "dark", n: "어둠", ic: "🌑", col: "#9b6bff", o: { drain: 0.02 } },
  { k: "earth", n: "대지", ic: "🪨", col: "#d9b27a", o: { stun: 1 } },
  { k: "water", n: "물", ic: "💧", col: "#5fc8ff", o: { slow: 0.4, knock: 80 } },
  { k: "soul", n: "혼", ic: "👻", col: "#c9a0ff", o: { mark: 0.2 } },
];
const ACT_FORM = [
  { k: "bolt", n: "탄", cd: 7, make: (e, p) => [{ t: "proj", n: 1 + Math.floor(p / 1.6), spread: 0.35, d: 2.2 * p, spd: 950, life: 0.9, r: 14, col: e.col, pierce: p > 1.7 ? 99 : 1, home: 2, ...e.o }], desc: (p) => `${1 + Math.floor(p / 1.6)}발 탄 각 ${Math.round(220 * p)}%` },
  { k: "burst", n: "폭발", cd: 10, make: (e, p) => [{ t: "nova", r: 170 + 40 * p, d: 2.4 * p, col: e.col, ...e.o }], desc: (p) => `주변 ${Math.round(240 * p)}% 폭발` },
  { k: "field", n: "장판", cd: 12, make: (e, p) => [{ t: "zone", r: 140 + 30 * p, dur: 4 + p, dps: 1.3 * p, slow: e.o.slow || 0.2, col: e.col, at: "cursor", rune: p > 2 }], desc: (p) => `커서에 ${Math.round(4 + p)}초 장판 (초당 ${Math.round(130 * p)}%)` },
  { k: "rain", n: "낙하", cd: 12, make: (e, p) => [{ t: "strike", n: Math.round(3 + p * 2), scatter: 210, r: 90, d: 1.7 * p, delay: 0.5, stagger: 0.1, col: e.col, stun: e.o.stun, bolt: e.k === "thunder" }], desc: (p) => `커서 주변 ${Math.round(3 + p * 2)}번 낙하 각 ${Math.round(170 * p)}%` },
  { k: "beam", n: "광선", cd: 9, make: (e, p) => [{ t: "beam", len: 800 + 150 * p, w: 50 + 15 * p, d: 3.4 * p, col: e.col, delay: 0.2, stun: e.o.stun, drain: e.o.drain }], desc: (p) => `직선 광선 ${Math.round(340 * p)}%` },
  { k: "chain", n: "사슬", cd: 9, make: (e, p) => [{ t: "chain", n: Math.round(3 + p * 2), d: 1.6 * p, range: 450, col: e.col, stun: e.o.stun }], desc: (p) => `적 ${Math.round(3 + p * 2)}명에게 튀며 각 ${Math.round(160 * p)}%` },
  { k: "orbit", n: "회전체", cd: 16, make: (e, p) => [{ t: "orbit", n: Math.round(2 + p * 1.5), dur: 6 + p, r: 115, d: 0.85 * p, col: e.col, seek: p > 2 }], desc: (p) => `${Math.round(6 + p)}초 동안 ${Math.round(2 + p * 1.5)}개가 돌며 각 ${Math.round(85 * p)}%` },
  { k: "dash", n: "돌진", cd: 8, make: (e, p) => [{ t: "dash", dist: 260 + 30 * p, d: 2 * p, inv: 0.4, col: e.col }, { t: "nova", r: 120 + 20 * p, d: 1.2 * p, col: e.col, ...e.o }], desc: (p) => `돌진 ${Math.round(200 * p)}% + 끝에 ${Math.round(120 * p)}% 폭발` },
  { k: "ward", n: "결계", cd: 18, make: (e, p) => [{ t: "zone", r: 180 + 20 * p, dur: 4 + p, dps: 0.9 * p, slow: 0.3, guard: Math.min(0.6, 0.2 + 0.08 * p), col: e.col, at: "self" }], desc: (p) => `내 자리에 결계 (안에서 피해 -${Math.round(Math.min(0.6, 0.2 + 0.08 * p) * 100)}%, 적 초당 ${Math.round(90 * p)}%)` },
  { k: "bless", n: "축복", cd: 22, make: (e, p) => [{ t: "buff", dur: 6 + p, atk: 0.15 * p, as: 0.1 * p, col: e.col }, { t: "heal", pct: 0.08 * p, shield: 0.05 * p }], desc: (p) => `${Math.round(6 + p)}초 공격력 +${Math.round(15 * p)}%·공격 속도 +${Math.round(10 * p)}%, 체력 ${Math.round(8 * p)}% 회복` },
];
const TIER_POW = { 1: 1, 2: 1.35, 3: 1.8, 4: 2.4, 5: 3.2 };
const TIER_WORD = { 1: "", 2: "날카로운 ", 3: "맹렬한 ", 4: "천상의 ", 5: "태초의 " };
const ACTIVES = {};
(function buildActives() {
  // 고정 순서 섞기 (판마다 같은 결과): 특급은 대표 조합 3개
  const combos = [];
  for (const e of ACT_EL) for (const f of ACT_FORM) combos.push([e, f]);
  let seed = 7; const rnd2 = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const top = ["fire.rain", "thunder.chain", "light.bless"];
  const rest = combos.filter(([e, f]) => !top.includes(e.k + "." + f.k)).sort(() => rnd2() - 0.5);
  const order = rest.concat(combos.filter(([e, f]) => top.includes(e.k + "." + f.k)));
  const tiers = [].concat(Array(50).fill(1), Array(25).fill(2), Array(15).fill(3), Array(7).fill(4), Array(3).fill(5));
  order.forEach(([e, f], i) => {
    const t = tiers[i], p = TIER_POW[t], extra = e.o.heal && f.k !== "bless" ? `, 체력 ${Math.round(e.o.heal * 100 * p)}% 회복` : "";
    const fx = f.make(e, p); if (e.o.heal && f.k !== "bless") fx.push({ t: "heal", pct: e.o.heal * p });
    ACTIVES[`ac_${e.k}_${f.k}`] = { name: `${TIER_WORD[t]}${e.n} ${f.n}`, ic: e.ic, rar: t, cd: Math.round(f.cd * (1 - (t - 1) * 0.05)), desc: f.desc(p) + extra + (["bolt", "burst", "dash"].includes(f.k) ? elDesc(e) : ""), fx };
  });
  function elDesc(e) { return e.k === "fire" ? " · 불태움" : e.k === "frost" ? " · 느려짐" : e.k === "thunder" ? " · 짧은 기절" : e.k === "poison" ? " · 중독" : e.k === "wind" ? " · 밀쳐냄" : e.k === "dark" ? " · 흡혈" : e.k === "earth" ? " · 기절" : e.k === "water" ? " · 느려짐·밀쳐냄" : e.k === "soul" ? " · 받는 피해 +20% 표식" : ""; }
})();
// --- 보스 전용 6 (특수 제작: 보스 패턴을 본뜬 여러 단계 기술, 전용 아이콘·받침대) ---
Object.assign(ACTIVES, {
  bx_shadow: { name: "그림자 우두머리의 가면", ic: "🎭", img: "ic_bx_shadow", rar: 6, boss: "b_boss", cd: 24, desc: "순간이동하며 그림자 고리 2번 (각 300%) → 그림자 분신 3명 12초 → 4초 무적", fx: [{ t: "blink", dist: 360 }, { t: "repeat", n: 2, gap: 0.35, fx: { t: "nova", r: 230, d: 3, col: "#8a6bff", follow: true } }, { t: "summon", kind: "shade", n: 3, dur: 12 }, { t: "buff", dur: 4, inv: true, col: "#8a6bff" }] },
  bx_flame: { name: "불꽃 귀신의 사슬", ic: "⛓️", img: "ic_bx_flame", rar: 6, boss: "b_boss2", cd: 22, desc: "불꽃 돌진 3연속 (각 260%) → 8초 동안 몸에 불길 (초당 300%) + 공격력 +40%", fx: [{ t: "repeat", n: 3, gap: 0.3, fx: { t: "dash", dist: 260, d: 2.6, inv: 0.25, col: "#ff6a3d" } }, { t: "zone", r: 190, dur: 8, dps: 3, col: "#ff6a3d", at: "self", follow: true, delay: 0.9 }, { t: "buff", dur: 8, atk: 0.4, col: "#ff6a3d" }] },
  bx_frost: { name: "서리 장군의 창", ic: "🧊", img: "ic_bx_frost", rar: 6, boss: "b_boss3", cd: 20, desc: "십자 얼음창 4방향 (각 450%) → 방 넓게 3초 얼림", fx: [{ t: "proj", n: 4, spread: 6.28, d: 4.5, spd: 1100, life: 1.2, r: 18, col: "#bff3ff", shape: "spear", pierce: 99, slow: 0.6 }, { t: "nova", r: 440, d: 1.5, stun: 3, col: "#9fe8ff", delay: 0.4 }] },
  bx_toad: { name: "두꺼비 왕의 독주머니", ic: "🐸", img: "ic_bx_toad", rar: 6, boss: "b_boss4", cd: 20, desc: "커서로 뛰어올라 착지 400% → 독 늪 8초 (초당 350%, 크게 느려짐) + 흡혈 10%", fx: [{ t: "blink", dist: 420, leap: true }, { t: "nova", r: 220, d: 4, stun: 0.8, col: "#8fdc5a" }, { t: "zone", r: 260, dur: 8, dps: 3.5, slow: 0.6, col: "#8fdc5a", at: "self" }, { t: "buff", dur: 8, ls: 0.1, col: "#8fdc5a" }] },
  bx_reaper: { name: "염라의 낫", ic: "💀", img: "ic_bx_reaper", rar: 6, boss: "b_boss5", cd: 26, desc: "혼령 탄 소용돌이 (12발 각 200%) → 커서에 저승문 6초 (초당 400%, 체력 25% 이하 25% 확률 즉사)", fx: [{ t: "proj", n: 12, spread: 6.28, d: 2, spd: 650, life: 1.3, r: 13, col: "#c38bff", home: 3 }, { t: "zone", r: 280, dur: 6, dps: 4, slow: 0.5, execute: 0.25, col: "#7b3bff", at: "cursor", rune: true }] },
  bx_golem: { name: "수문장의 지진 돌", ic: "🗿", img: "ic_bx_golem", rar: 6, boss: "b_boss6", cd: 22, desc: "받는 피해 -50% 5초 + 퍼지는 지진 고리 3번 (각 400%, 기절) + 돌기둥 낙하 8번", fx: [{ t: "buff", dur: 5, dr: 0.5, col: "#d9b27a" }, { t: "repeat", n: 3, gap: 0.5, fx: { t: "nova", r: 330, d: 4, stun: 1, col: "#d9b27a", follow: true } }, { t: "strike", n: 8, scatter: 9999, r: 90, d: 3, delay: 0.6, stagger: 0.12, col: "#d9b27a", targetEnemies: true }] },
});
// 특급 3종은 효과를 한 번 더 손봄
ACTIVES.ac_fire_rain.name = "태초의 유성우"; ACTIVES.ac_fire_rain.fx.push({ t: "nova", r: 260, d: 3, burn: 3, col: "#ffb547", delay: 1.2 }); ACTIVES.ac_fire_rain.desc += " + 마지막 대폭발 960%";
ACTIVES.ac_thunder_chain.name = "태초의 뇌신 사슬"; ACTIVES.ac_thunder_chain.fx.push({ t: "strike", n: 10, scatter: 9999, r: 110, d: 3, delay: 0.5, stagger: 0.1, col: "#fff27a", bolt: true, targetEnemies: true }); ACTIVES.ac_thunder_chain.desc += " + 벼락 10번";
ACTIVES.ac_light_bless.name = "태초의 불사조 축복"; ACTIVES.ac_light_bless.fx.push({ t: "buff", dur: 5, inv: true, col: "#ffe9a0" }); ACTIVES.ac_light_bless.desc += " + 5초 무적";
const ACT_KEYS = Object.keys(ACTIVES).filter((k) => !ACTIVES[k].boss);
const BOSS_ACT = Object.fromEntries(Object.keys(ACTIVES).filter((k) => ACTIVES[k].boss).map((k) => [ACTIVES[k].boss, k]));
const ACT_WEIGHT = { 1: 10, 2: 5, 3: 2.2, 4: 0.8, 5: 0.35, 6: 0 };

// ===== 원정 중 강화 (레벨업·아이템 방) =====
const BOONS = {
  atk: { name: "날 선 칼", ic: "🗡️", rar: 1, desc: "공격력 +12%", m: { atk: 0.12 } },
  hp: { name: "두꺼운 갑옷", ic: "🥋", rar: 1, desc: "최대 체력 +15%", m: { hp: 0.15 } },
  spd: { name: "바람 신발", ic: "👟", rar: 1, desc: "이동 속도 +10%", m: { spd: 0.1 } },
  as: { name: "가벼운 손", ic: "🤲", rar: 1, desc: "기본 공격 속도 +15%", m: { as: 0.15 } },
  crit: { name: "매의 눈", ic: "👁️", rar: 1, desc: "치명타 확률 +8%", m: { crit: 0.08 } },
  cdr: { name: "부적 다발", ic: "📿", rar: 1, desc: "스킬 대기 -8%", m: { cdr: 0.08 } },
  dr: { name: "돌 피부", ic: "🪨", rar: 1, desc: "받는 피해 -7%", m: { dr: 0.07 } },
  regen: { name: "약초 주머니", ic: "🌿", rar: 1, desc: "초당 체력 0.4% 회복", m: { regen: 0.004 } },
  gold: { name: "복주머니", ic: "👛", rar: 1, desc: "엽전 획득 +30%", m: { gold: 0.3 } },
  critdmg: { name: "급소 찌르기", ic: "🎯", rar: 2, desc: "치명타 피해 +35%", m: { critdmg: 0.35 } },
  ls: { name: "피의 맹세", ic: "🩸", rar: 2, desc: "피해의 4% 흡혈", m: { ls: 0.04 } },
  thorns: { name: "가시 갑옷", ic: "🌵", rar: 2, desc: "맞으면 공격자에게 내 공격력 150% 반사", m: { thorns: 1.5 } },
  multi: { name: "갈래 기운", ic: "🔱", rar: 2, desc: "투사체 +1 (원거리 기본 공격)", m: { multi: 1 } },
  wide: { name: "넓은 베기", ic: "🌙", rar: 2, desc: "근접 공격 범위 +20%, 폭발 범위 +15%", m: { area: 0.18 } },
  burn: { name: "화염 깃든 무기", ic: "🔥", rar: 2, desc: "기본 공격에 불태움 (3초 동안 60%)", m: { burn: 1 } },
  chill: { name: "서리 깃든 무기", ic: "❄️", rar: 2, desc: "기본 공격이 적을 1초 느리게", m: { chill: 1 } },
  shieldRoom: { name: "방패 주문", ic: "🛡️", rar: 2, desc: "방에 들어갈 때마다 체력 15% 보호막", m: { shieldRoom: 0.15 } },
  ultcd: { name: "깨달음", ic: "🧠", rar: 2, desc: "궁극기(R) 대기 -20%", m: { ultcd: 0.2 } },
  arc: { name: "연쇄 번개", ic: "⚡", rar: 3, desc: "치명타 때 번개가 3명에게 튐 (80%)", m: { critArc: 1 } },
  explode: { name: "시체 폭발", ic: "💥", rar: 3, desc: "적이 죽을 때 주변 100% 폭발", m: { corpse: 1 } },
  glass: { name: "유리 대포", ic: "🔮", rar: 3, desc: "공격력 +40%, 받는 피해 +15%", m: { atk: 0.4, dr: -0.15 } },
  execute: { name: "사신의 낫", ic: "⚰️", rar: 3, desc: "체력 12% 이하 적을 맞힐 때마다 25% 확률로 즉시 처치 (보스 제외)", m: { execute: 0.12 } },
  echo: { name: "메아리", ic: "🔊", rar: 3, desc: "스킬 사용 시 25% 확률로 대기 초기화", m: { echo: 0.25 } },
  // 조합 패시브 (11-16, Hades 듀오 은총처럼): req 의 패시브를 모두 가졌을 때만 나옴
  duo_blade: { name: "검귀의 눈", ic: "⚔️", rar: 3, duo: 1, req: ["crit", "critdmg"], desc: "[조합] 매의 눈+급소 찌르기 → 치명타 +10%, 치명타 피해 +40%", m: { crit: 0.1, critdmg: 0.4 } },
  duo_thorn: { name: "가시 철벽", ic: "🛡️", rar: 3, duo: 1, req: ["thorns", "dr"], desc: "[조합] 가시 갑옷+돌 피부 → 받는 피해 -10%, 반사 +100%", m: { dr: 0.1, thorns: 1.0 } },
  duo_blood: { name: "피바람", ic: "🌪️", rar: 3, duo: 1, req: ["ls", "as"], desc: "[조합] 피의 맹세+가벼운 손 → 흡혈 +3%, 공격 속도 +20%", m: { ls: 0.03, as: 0.2 } },
  duo_flame: { name: "불꽃 회오리", ic: "🔥", rar: 3, duo: 1, req: ["burn", "wide"], desc: "[조합] 화염 무기+넓은 베기 → 공격력 +15%, 범위 +15%", m: { atk: 0.15, area: 0.15 } },
  duo_sage: { name: "도사의 경지", ic: "☯️", rar: 3, duo: 1, req: ["cdr", "echo"], desc: "[조합] 부적 다발+메아리 → 스킬 대기 -10%, 메아리 +10%", m: { cdr: 0.1, echo: 0.1 } },
  phoenixPerk: { name: "불사조 깃털", ic: "🪶", rar: 4, desc: "한 번 쓰러져도 체력 40%로 일어남", m: { revive: 1 } },
};
const BOON_KEYS = Object.keys(BOONS);

// 아티팩트·펫·칭호 표는 collect.js

// ===== 가챠 비용·확률 =====
const GACHA = {
  char: { name: "영웅 뽑기", cost: 5, cost10: 45, pity: 20, rate: 0.07, desc: "뽑기 전용 영웅 4명. 20번 안에 반드시 1명. 이미 가진 영웅은 별(★)이 올라 공격력·체력 +6% (최대 ★5)" },
  art: { name: "보물 뽑기", cost: 2, cost10: 18, rates: { 1: 0.58, 2: 0.3, 3: 0.1, 4: 0.02 }, desc: "같은 보물는 조각으로 바뀌어요 · 보관함에서 조각으로 강화 (+1 당 효과 +20%, 최대 +5, 단계마다 성공 확률 낮아짐)" },
  pet: { name: "펫 뽑기", cost: 3, cost10: 27, rates: { 1: 0.55, 2: 0.3, 3: 0.12, 4: 0.03 }, desc: "같은 펫은 조각으로 바뀌어요 · 보관함에서 조각으로 강화 (+1 당 효과 +20%, 최대 +5, 단계마다 성공 확률 낮아짐)" },
  title: { name: "칭호 뽑기", cost: 1, cost10: 9, rates: { 1: 0.6, 2: 0.28, 3: 0.1, 4: 0.02 }, desc: "같은 칭호는 엽전 80개로 바뀜" },
};
// 가챠 실패 시 위로 보상(캐릭터 뽑기)
const CHAR_CONSOLE = [{ w: 60, gold: 60 }, { w: 30, gold: 120 }, { w: 10, coin: 1 }];

// ===== 코인 수급 =====
// 1. 랜덤: 몬스터 0.6%, 정예 5%, 보물상자 30%, 보스 40%
// 2. 상점: 엽전 300개 = 코인 1개 / 가챠를 엽전으로 바로 돌릴 때도 코인 1개 = 엽전 300
// 재화: 금화(원정 중 몬스터·상자가 떨어뜨림, 원정 상점에서 사용, 끝나면 사라짐) / 엽전(원정이 끝나면 성적만큼 지급, 가챠·상점)
// 3. 층 도달: 스토리 새 층 첫 도달 4개, 무한의 방 최고 기록 10방마다 2개
// 4. 미션: 미션마다 1~6개
const COIN_DROP = { mob: 0.006, elite: 0.05, chest: 0.3, boss: 0.4 };
const SHOP_COIN = { price: 300, daily: 99 };
const COIN_YEOP = 300;

// ===== 미션 =====
const MISSIONS = [
  { id: "k50", stat: "kills", n: 50, coin: 1, name: "요괴 50마리 처치" },
  { id: "k150", stat: "kills", n: 150, coin: 2, name: "요괴 150마리 처치" },
  { id: "k500", stat: "kills", n: 500, coin: 3, name: "요괴 500마리 처치" },
  { id: "k1500", stat: "kills", n: 1500, coin: 5, name: "요괴 1500마리 처치" },
  { id: "b1", stat: "bosses", n: 1, coin: 1, name: "보스 첫 처치" },
  { id: "b3", stat: "bosses", n: 3, coin: 2, name: "보스 3마리 처치" },
  { id: "b10", stat: "bosses", n: 10, coin: 4, name: "보스 10마리 처치" },
  { id: "r40", stat: "rooms", n: 40, coin: 2, name: "방 40개 정리" },
  { id: "r150", stat: "rooms", n: 150, coin: 4, name: "방 150개 정리" },
  { id: "lv12", stat: "maxLevel", n: 12, coin: 2, name: "한 판에서 레벨 12" },
  { id: "lv25", stat: "maxLevel", n: 25, coin: 4, name: "한 판에서 레벨 25" },
  { id: "e10", stat: "endlessBest", n: 10, coin: 2, name: "무한의 방 10번째 방 도달" },
  { id: "e25", stat: "endlessBest", n: 25, coin: 4, name: "무한의 방 25번째 방 도달" },
  { id: "e50", stat: "endlessBest", n: 50, coin: 6, name: "무한의 방 50번째 방 도달" },
  { id: "d1", stat: "duelWins", n: 1, coin: 1, name: "1대1 대전 첫 승리" },
  { id: "d5", stat: "duelWins", n: 5, coin: 3, name: "1대1 대전 5승" },
  { id: "d15", stat: "duelWins", n: 15, coin: 5, name: "1대1 대전 15승" },
  { id: "g10", stat: "pulls", n: 10, coin: 2, name: "뽑기 10번 뽑기" },
  { id: "c3", stat: "charsOwned", n: 3, coin: 2, name: "영웅 3명 모으기" },
  { id: "c8", stat: "charsOwned", n: 8, coin: 4, name: "영웅 8명 모으기" },
  { id: "sp1", stat: "bossHighHp", n: 1, coin: 3, name: "[특수] 체력 60% 이상 남긴 채 보스 처치" },
  { id: "sp2", stat: "bossLowHp", n: 1, coin: 3, name: "[특수] 내 체력 15% 이하에서 보스 처치" },
  { id: "sp3", stat: "fastClear", n: 1, coin: 3, name: "[특수] 요괴 5마리 이상 방을 10초 안에 정리" },
  { id: "sp4", stat: "noHitFloor", n: 1, coin: 5, name: "[특수] 맞지 않고 스테이지 하나 끝내기" },
  { id: "sp5", stat: "storyClear", n: 1, coin: 6, name: "[특수] 스토리 5층 최종보스 처치" },
  { id: "dex1", stat: "dex_f1", n: 11, coin: 8, name: "요괴록 1층 도감 완성 (11종)" }, { id: "dex2", stat: "dex_f2", n: 11, coin: 8, name: "요괴록 2층 도감 완성 (11종)" },
  { id: "dex3", stat: "dex_f3", n: 11, coin: 10, name: "요괴록 3층 도감 완성 (11종)" }, { id: "dex4", stat: "dex_f4", n: 11, coin: 10, name: "요괴록 4층 도감 완성 (11종)" },
  { id: "dex5", stat: "dex_f5", n: 11, coin: 12, name: "요괴록 5층 도감 완성 (11종)" }, { id: "dexAll", stat: "dexAll", n: 55, coin: 30, name: "요괴록 도감 55종 모두 완성" },
  // 11-18 새 시스템 미션 (괴이한 방·시련·오늘의 괴담·연격·혼불·숙련)
  { id: "ev5", stat: "events", n: 5, coin: 2, name: "괴이한 방 5번 만나기" },
  { id: "ev25", stat: "events", n: 25, coin: 5, name: "괴이한 방 25번 만나기" },
  { id: "tr3", stat: "trials", n: 3, coin: 3, name: "시련의 방 3번 통과" },
  { id: "tr15", stat: "trials", n: 15, coin: 8, name: "시련의 방 15번 통과" },
  { id: "dy3", stat: "dailyRuns", n: 3, coin: 3, name: "오늘의 괴담 3번 도전" },
  { id: "dy15", stat: "dailyRuns", n: 15, coin: 10, name: "오늘의 괴담 15번 도전" },
  { id: "cb30", stat: "maxCombo", n: 30, coin: 2, name: "연격 30 이어 가기" },
  { id: "cb80", stat: "maxCombo", n: 80, coin: 5, name: "연격 80 이어 가기" },
  { id: "cb150", stat: "maxCombo", n: 150, coin: 10, name: "연격 150 — 천하무쌍" },
  { id: "so300", stat: "soulTotal", n: 300, coin: 3, name: "혼불 300 모으기 (누적)" },
  { id: "so2000", stat: "soulTotal", n: 2000, coin: 10, name: "혼불 2000 모으기 (누적)" },
  { id: "ms5", stat: "mastMax", n: 5, coin: 4, name: "한 영웅 숙련 Lv.5" },
  { id: "pd10", stat: "perfectDodge", n: 10, coin: 3, name: "완벽 회피 10번" },
  { id: "pd100", stat: "perfectDodge", n: 100, coin: 10, name: "완벽 회피 100번 — 바람의 몸놀림" },
  { id: "ms10", stat: "mastMax", n: 10, coin: 15, name: "한 영웅 숙련 Lv.10 (옥 표식)" },
  { id: "sec_boss100", stat: "floorBossKills", n: 100, coin: 20, secret: true, name: "[숨은 업적] 층 보스 100번 처치 — 보스펫 '꼬마 도깨비 왕' 획득" },
  { id: "sec_dummy200", stat: "dummyKills", n: 200, coin: 8, secret: true, name: "[숨은 업적] 허수아비 200번 쓰러뜨리기 (+ 스토리 클리어 시 숨은 영웅 '짚신' 해금)" },
];

// ===== 층 테마·스토리 =====
const FLOORS = [
  { name: "잊힌 석굴", room: "f1", wall: ["#2b2633", "#3d3547", "#17141c"], light: "#ffb547", enemies: ["slime", "bat", "skel", "kkoma", "kkokdu"], boss: "b_boss", bossName: "그림자 우두머리", hazard: null, bgm: "f1_cave" },
  { name: "얼어붙은 동굴", room: "f2", wall: ["#1f2b3a", "#2f4258", "#0f1622"], light: "#9fe8ff", enemies: ["slime", "bat", "skel", "brute", "jongi", "jangseung"], boss: "b_boss3", bossName: "서리 장군", hazard: "ice", bgm: "f2_ice" },
  { name: "불타는 대장간", room: "f3", wall: ["#33201a", "#4d2c20", "#1a0f0b"], light: "#ff8a3d", enemies: ["bat", "skel", "brute", "wisp", "kkoma", "jangseung"], boss: "b_boss2", bossName: "불꽃 귀신", hazard: "lava", bgm: "f3_forge" },
  { name: "독 안개 늪", room: "f4", wall: ["#1f2a24", "#2c3b33", "#0e1511"], light: "#b48cff", enemies: ["slime", "skel", "brute", "wisp", "clone", "dukkeobi", "gaksi"], boss: "b_boss4", bossName: "늪 두꺼비 왕", hazard: "poison", bgm: "f4_swamp" },
  { name: "저승 궁궐", room: "f5", wall: ["#2a1a2e", "#40263f", "#140b16"], light: "#c38bff", enemies: ["bat", "skel", "brute", "wisp", "clone", "sotdae", "neoguri", "gaksi"], boss: "b_boss5", bossName: "저승 염라 사자", hazard: "soul", bgm: "f5_underworld" },
];
const STAGES_PER_FLOOR = 10; // 층마다 10스테이지: 5번째 중간보스, 10번째 층 보스 (사용자 요청 11-11)
const RAID_ORDER = ["b_boss", "b_boss3", "b_boss2", "b_boss4", "b_boss5"]; // 11-12: 층보스 5마리
// 레벨업 필요 경험치 (사용자 요청 11-10: 레벨업 빠르게) — 몬스터 하나가 4~9, 레벨 2까지 약 3마리
const expNeed = (lv) => Math.round(10 + lv * 7 + lv * lv * 0.35);
const STORY = {
  open: { img: "sc_open", title: "찢어진 요괴록", text: "조선 팔도의 요괴를 붓으로 묶어 둔 책, 『요괴록』.\n어느 그믐밤, 그림자 도깨비 왕이 책을 다섯 갈래로 찢어 버렸다. 풀려난 요괴들은 땅 밑 다섯 층의 미궁으로 숨어들었다.\n달래 할멈이 찢긴 표지를 건넸다. \"찢긴 장을 모두 되찾아 다시 묶어라. 그러지 못하면 요괴가 이 땅을 덮는다.\"\n책의 정령 반디가 반딧불처럼 빛나며 앞장섰다." },
  1: { img: "st_halmi", title: "1층 · 잊힌 석굴 — 첫째 장", text: "오래된 무덤 석굴. 돌 틈마다 도깨비불이 깜빡인다.\n달래 할멈: \"첫째 장은 그림자 도깨비 왕이 직접 쥐고 있다. 녀석의 졸개들이 석굴 곳곳을 지키고 있을 게다.\"" },
  f1_mid: { img: "sc_f1_mid", title: "석굴 한복판", text: "어둠 속에서 머리를 부수는 두억시니와 외다리 도깨비가 길을 막는다.\n반디: \"이 녀석들, 찢어진 첫째 장의 기운을 먹고 덩치가 커졌어. 하나씩 묶어 두자!\"" },
  f1_boss: { img: "sc_f1_boss", title: "그림자 도깨비 왕", text: "석굴 맨 안쪽, 검은 도포에 깨진 갓을 쓴 도깨비 왕이 방망이를 어깨에 걸쳤다.\n\"책 따위로 우리를 다시 묶겠다고? 금 나와라 뚝딱— 아니, 네 목이나 나와라!\"" },
  f1_clear: { img: "sc_f1_clear", title: "첫째 장을 되찾다", text: "방망이가 부러지자 찢긴 첫째 장이 반딧불처럼 날아와 책에 붙었다.\n반디: \"아직 네 장이 남았어. 아래층에서 찬 바람이 불어와.\"" },
  2: { img: "st_bandi", title: "2층 · 얼어붙은 동굴 — 둘째 장", text: "숨을 쉬면 입김이 얼어붙는 동굴.\n반디: \"둘째 장은 얼음 동굴의 장군이 갑옷 속에 품었대. 동장군과 눈 귀신이 장군을 따른다나 봐.\"" },
  f2_mid: { img: "sc_f2_mid", title: "얼음 골짜기", text: "흰 털을 늘어뜨린 장산범이 누군가의 목소리를 흉내 내며 부른다. \"이리 와…\"\n무영: \"대답하지 마라. 저 소리는 사람이 아니다.\"" },
  f2_boss: { img: "sc_f2_boss", title: "서리 장군", text: "얼어붙은 두정갑, 고드름이 맺힌 월도. 원한을 품고 죽은 장군이 일어선다.\n\"이 땅을 지키다 얼어 죽은 나를… 너희가 기억이나 하느냐!\"" },
  f2_clear: { img: "sc_f2_clear", title: "둘째 장", text: "얼음이 녹으며 장군의 원한도 풀려 사라졌다. 둘째 장이 책에 묶였다.\n무영: \"다음은 불이다. 쇠가 녹는 냄새가 올라오는군.\"" },
  3: { img: "st_muyeong", title: "3층 · 불타는 대장간 — 셋째 장", text: "요괴들이 무기를 벼리는 지하 대장간.\n무영이 갓을 꾹 누르며 말했다. \"셋째 장은 불 도깨비 왕의 화로 속에 있다. 여기부터는 진짜다. 쉬지 말고 움직여.\"" },
  f3_mid: { img: "sc_f3_mid", title: "쇠 먹는 짐승", text: "쇠를 먹고 자라는 불가사리가 모루를 통째로 삼키고 있다.\n반디: \"저 녀석이 다 먹기 전에 막아야 해. 대장간 무쇠를 다 먹으면 칼도 안 들어가!\"" },
  f3_boss: { img: "sc_f3_boss", title: "불 도깨비 왕", text: "용암 같은 갈기, 불타는 붉은 옷. 불 도깨비 왕이 쇠못 박힌 방망이를 화로에서 꺼낸다.\n\"셋째 장? 이 불 속에 던져 넣었지. 꺼내 가 보시게!\"" },
  f3_clear: { img: "sc_f3_clear", title: "셋째 장", text: "화로가 식자 잿더미 속에서 타지 않은 셋째 장이 나왔다. 요괴록은 불에 타지 않는다.\n달래 할멈의 목소리가 바람에 실려 왔다. \"이제 늪이다. 숨을 아껴라.\"" },
  4: { img: "st_bandi", title: "4층 · 독 안개 늪 — 넷째 장", text: "썩은 물과 독 안개가 빛마저 삼키는 늪.\n반디: \"넷째 장은 늪 두꺼비 왕이 통째로 삼켜 버렸어. 구미호랑 물귀신도 이 늪에 산대.\"" },
  f4_mid: { img: "sc_f4_mid", title: "안개 속의 미소", text: "아홉 꼬리를 늘어뜨린 여인이 안개 속에서 웃는다. 구미호다.\n\"요괴록에 다시 갇히느니, 네 간을 먹고 사람이 되겠다.\"" },
  f4_boss: { img: "sc_f4_boss", title: "늪 두꺼비 왕", text: "동전 목걸이를 주렁주렁 단 거대한 금두꺼비가 갓을 쓰고 앉아 있다.\n\"개굴! 그 장은 아주 맛있었지. 너도 맛 좀 볼까?\"" },
  f4_clear: { img: "sc_f4_clear", title: "넷째 장", text: "두꺼비 왕이 넷째 장을 토해 내니 늪의 안개가 걷혔다.\n반디: \"마지막 장은… 저승에 있어. 살아 있는 사람은 못 가는 곳인데.\"\n무영: \"요괴를 쫓는 자는 이미 반쯤 저승 사람이다. 가자.\"" },
  5: { img: "st_muyeong", title: "5층 · 저승 궁궐 — 다섯째 장", text: "미궁의 맨 아래, 산 사람이 와서는 안 되는 곳.\n저승사자가 마지막 장을 명부 사이에 끼워 두고, 요괴록의 주인을 기다리고 있다." },
  f5_mid: { img: "sc_f5_mid", title: "저승의 문지기들", text: "소머리와 말머리를 한 옥졸, 붓을 든 판관, 해치 수문장이 길을 막는다.\n판관: \"이름이 명부에 없는 자는 이 문을 지날 수 없다.\"" },
  f5_boss: { img: "sc_f5_boss", title: "저승사자", text: "검은 갓, 검은 도포, 붉은 오랏줄. 저승사자가 명부를 펼친다.\n\"요괴록에 묶인 것들도, 그 책을 쥔 너도… 결국은 모두 내 장부에 적힌다.\"" },
  f5_clear: { img: "sc_f5_clear", title: "다섯째 장", text: "명부가 덮이고, 다섯째 장이 마지막으로 요괴록에 묶였다.\n찢어졌던 책이 한 권으로 붙으며, 미궁 곳곳의 요괴들이 한 줄기 빛이 되어 책 속으로 빨려 들어갔다." },
  end: { img: "sc_end", title: "다시 묶인 요괴록", text: "토벌꾼이 미궁을 나서자 마을에 아침 해가 떠올랐다.\n달래 할멈이 책을 받아 들고 웃었다. \"잘했다. 하지만 기억해라. 요괴록은 언제든 다시 찢어질 수 있는 책이란다.\"\n— 미궁 깊은 곳에서는 아직 책에 묶이지 않은 요괴들이 끝없이 몰려온다. (무한의 방이 기다립니다)" },
};

// ===== 몬스터 =====
const ENEMIES = {
  slime: { name: "먹물 요괴", img: "e_slime", hp: 70, dmg: 13, spd: 105, r: 26, ai: "chase", exp: 4 },
  bat: { name: "피박쥐", img: "e_bat", hp: 45, dmg: 10, spd: 190, r: 22, ai: "weave", exp: 4 },
  skel: { name: "해골 궁수", img: "e_skel", hp: 60, dmg: 14, spd: 85, r: 26, ai: "ranged", exp: 5, shot: { cd: 2.0, spd: 380 } },
  brute: { name: "돌 도깨비", img: "e_brute", hp: 190, dmg: 24, spd: 80, r: 36, ai: "charger", exp: 9 },
  wisp: { name: "도깨비불", img: "e_wisp", hp: 80, dmg: 20, spd: 70, r: 24, ai: "caster", exp: 7 },
  clone: { name: "그림자 자객", img: "e_clone", hp: 110, dmg: 22, spd: 140, r: 26, ai: "blinker", exp: 8 },
  // 11-15 사용자: 일반 몹이 단조로움 → 한국 설화 요괴 8종 추가 (행동은 기존 방식 재사용)
  kkoma: { name: "꼬마 도깨비", img: "e_kkoma", hp: 55, dmg: 11, spd: 150, r: 22, ai: "chase", exp: 4 },
  kkokdu: { name: "꼭두 인형", img: "e_kkokdu", hp: 90, dmg: 15, spd: 95, r: 26, ai: "chase", exp: 5 },
  jongi: { name: "종이 귀신", img: "e_jongi", hp: 50, dmg: 12, spd: 175, r: 24, ai: "weave", exp: 4 },
  jangseung: { name: "장승 요괴", img: "e_jangseung", hp: 200, dmg: 22, spd: 70, r: 38, ai: "charger", exp: 10 },
  dukkeobi: { name: "독두꺼비", img: "e_dukkeobi", hp: 120, dmg: 16, spd: 80, r: 28, ai: "chase", exp: 6 },
  gaksi: { name: "각시탈 원귀", img: "e_gaksi", hp: 95, dmg: 22, spd: 75, r: 26, ai: "caster", exp: 8 },
  sotdae: { name: "솟대 까마귀", img: "e_sotdae", hp: 55, dmg: 15, spd: 90, r: 24, ai: "ranged", exp: 6, shot: { cd: 1.8, spd: 420 } },
  neoguri: { name: "둔갑 너구리", img: "e_neoguri", hp: 100, dmg: 20, spd: 150, r: 24, ai: "blinker", exp: 8 },
};
// 보스 패턴
const BOSSES = {
  b_boss: { name: "그림자 우두머리", hp: 2400, dmg: 26, spd: 110, r: 62, style: "melee", pats: ["combo", "club", "clones", "ddukddak"], far: ["clones"] },
  b_boss3: { name: "서리 장군", hp: 3000, dmg: 30, spd: 95, r: 64, style: "ranged", pats: ["snipe", "icespear", "icecage", "glacier", "blizzard"], near: ["frostnova"] },
  b_boss2: { name: "불꽃 귀신", hp: 3600, dmg: 34, spd: 120, r: 62, style: "ranged", pats: ["flamewave", "meteor", "firewall", "eruption"], near: ["eruption"] },
  b_boss4: { name: "늪 두꺼비 왕", hp: 4300, dmg: 38, spd: 90, r: 72, style: "melee", pats: ["hops", "tongue", "spit", "leap", "summon"], far: ["tongue", "hops"] },
  b_boss5: { name: "저승 염라 사자", hp: 5200, dmg: 42, spd: 115, r: 64, style: "ranged", pats: ["soulhunt", "chains", "soulspiral", "judgment"], near: ["scythe", "blink"] },
  b_boss6: { name: "돌 수문장", hp: 3300, dmg: 36, spd: 85, r: 74, style: "melee", pats: ["slam", "fissure", "guard", "quake", "rockfall"], far: ["fissure"] },
};
// 11-12 새 층보스 3 + 새 중간보스 5 (art: 전용 그림이 없을 때 빌려 쓰는 보스 그림·효과)
Object.assign(BOSSES, {
  f_gumiho: { name: "구미호", hp: 3800, dmg: 36, spd: 125, r: 60, style: "ranged", pats: ["foxfire", "clones", "soulspiral", "judgment"], near: ["blink"], art: "b_boss", floor: true },
  f_imugi: { name: "이무기", hp: 4400, dmg: 38, spd: 105, r: 70, style: "melee", pats: ["club", "glacier", "tongue", "quake"], far: ["tongue"], art: "b_boss3", floor: true },
  f_bulgasari: { name: "불가사리", hp: 4800, dmg: 40, spd: 90, r: 74, style: "melee", pats: ["guard", "hops", "fissure", "eruption"], far: ["fissure"], art: "b_boss6", floor: true },
  m_jangsan: { name: "장산범", hp: 2600, dmg: 30, spd: 140, r: 56, style: "melee", pats: ["combo", "hops", "clones"], far: ["hops"], art: "b_boss3", mid: true },
  m_eodum: { name: "어둑시니", hp: 2500, dmg: 30, spd: 110, r: 60, style: "ranged", pats: ["judgment", "soulhunt", "chains"], near: ["blink"], art: "b_boss5", mid: true },
  m_gangcheol: { name: "강철이", hp: 2700, dmg: 31, spd: 135, r: 58, style: "melee", pats: ["magma", "hops", "eruption"], far: ["magma"], art: "b_boss2", mid: true },
  m_mulgwi: { name: "물귀신", hp: 2400, dmg: 29, spd: 115, r: 54, style: "ranged", pats: ["spit", "icecage", "tongue"], near: ["tongue"], art: "b_boss4", mid: true },
  m_geuseun: { name: "그슨대", hp: 2500, dmg: 31, spd: 120, r: 62, style: "ranged", pats: ["snipe", "chains", "clones"], near: ["blink"], art: "b_boss", mid: true },
});

// ===== v1.3.0 (11-12 사용자 요청): 층은 5층, 층보스 5마리(층마다 1), 층마다 전용 중간보스 10마리(그 층에서만 무작위) =====
// fx: 효과·투사체·예고 그림을 빌려 오는 보스(층 테마 색). mid: 중간보스, fl: 등장 층
const MB = (name, fl, style, pats, extra, fx) => Object.assign({ name, mid: true, fl, style, pats, art: fx, hp: 2300 + fl * 120, dmg: 28 + fl * 2, spd: style === "melee" ? 125 : 110, r: 58 }, extra || {});
Object.assign(BOSSES, {
  // 1층 잊힌 석굴 — 그림자·돌
  m_dueok: MB("두억시니", 1, "melee", ["club", "combo", "ddukddak"], { far: ["clones"], r: 64, hp: 2700 }, "b_boss"),
  m_oedari: MB("외다리 도깨비", 1, "melee", ["hops", "combo", "club"], { far: ["hops"], spd: 140 }, "b_boss"),
  m_bakjwi: MB("박쥐 요괴왕", 1, "ranged", ["foxfire", "soulhunt", "clones"], { near: ["blink"] }, "b_boss"),
  m_duduji: MB("두더지 장군", 1, "melee", ["fissure", "rockfall", "slam"], { far: ["fissure"] }, "b_boss6"),
  m_gaeksa: MB("객귀", 1, "ranged", ["chains", "snipe", "foxfire"], { near: ["blink"] }, "b_boss"),
  m_dokbul: MB("도깨비불 무리", 1, "ranged", ["foxfire", "soulspiral", "judgment"], { near: ["blink"], r: 52 }, "b_boss"),
  m_seokjang: MB("석장승", 1, "melee", ["guard", "quake", "slam"], { far: ["fissure"], r: 66, spd: 100 }, "b_boss6"),
  // 2층 얼어붙은 동굴 — 서리
  m_dongjang: MB("동장군", 2, "melee", ["glacier", "combo", "frostnova"], { far: ["glacier"], r: 64 }, "b_boss3"),
  m_seolgwi: MB("설귀", 2, "ranged", ["blizzard", "icecage", "snipe"], { near: ["frostnova"] }, "b_boss3"),
  m_baekgom: MB("백곰 신장", 2, "melee", ["club", "hops", "guard"], { far: ["hops"], r: 68 }, "b_boss3"),
  m_bingho: MB("빙호", 2, "ranged", ["icespear", "foxfire", "blizzard"], { near: ["blink"] }, "b_boss3"),
  m_seorirang: MB("서리 늑대 우두머리", 2, "melee", ["combo", "clones", "hops"], { far: ["clones"], spd: 145 }, "b_boss3"),
  m_goderum: MB("고드름 궁수 귀신", 2, "ranged", ["snipe", "icespear", "glacier"], { near: ["frostnova"] }, "b_boss3"),
  m_nunjangi: MB("눈 도깨비", 2, "melee", ["ddukddak", "frostnova", "club"], { far: ["hops"], r: 64 }, "b_boss3"),
  m_seorihak: MB("서리 학", 2, "ranged", ["icecage", "blizzard", "soulhunt"], { near: ["blink"] }, "b_boss3"),
  // 3층 불타는 대장간 — 불·쇠
  m_jowang: MB("성난 조왕신", 3, "ranged", ["firewall", "meteor", "eruption"], { near: ["eruption"] }, "b_boss2"),
  m_bulgae: MB("불개", 3, "melee", ["magma", "combo", "hops"], { far: ["magma"], spd: 145 }, "b_boss2"),
  m_soedok: MB("쇠도깨비 대장장이", 3, "melee", ["club", "guard", "quake"], { far: ["fissure"], r: 64 }, "b_boss2"),
  m_hwacha: MB("화차 귀신", 3, "melee", ["magma", "eruption", "fissure"], { far: ["magma"] }, "b_boss2"),
  m_bulyeowoo: MB("불여우", 3, "ranged", ["flamewave", "foxfire", "clones"], { near: ["blink"] }, "b_boss2"),
  m_yongamdu: MB("용암 두꺼비", 3, "melee", ["leap", "spit", "eruption"], { far: ["hops"], r: 66 }, "b_boss2"),
  m_daejang: MB("대장장이 원귀", 3, "melee", ["combo", "slam", "firewall"], { far: ["fissure"] }, "b_boss2"),
  m_hwajo: MB("화조", 3, "ranged", ["meteor", "flamewave", "soulhunt"], { near: ["blink"] }, "b_boss2"),
  // 4층 독 안개 늪 — 독·물
  m_jine: MB("왕지네", 4, "melee", ["combo", "spit", "tongue"], { far: ["tongue"], r: 64 }, "b_boss4"),
  m_geomi: MB("거미 여인", 4, "ranged", ["chains", "spit", "icecage"], { near: ["blink"] }, "b_boss4"),
  m_guryeong: MB("구렁이", 4, "melee", ["tongue", "club", "hops"], { far: ["tongue"], r: 68 }, "b_boss4"),
  m_dalgyal: MB("달걀귀신", 4, "ranged", ["judgment", "soulhunt", "chains"], { near: ["blink"] }, "b_boss4"),
  m_beoseot: MB("버섯 요괴", 4, "ranged", ["spit", "rockfall", "soulspiral"], { near: ["spit"], spd: 95 }, "b_boss4"),
  m_geomeori: MB("거머리 요괴", 4, "melee", ["tongue", "hops", "spit"], { far: ["tongue"] }, "b_boss4"),
  m_dokdu: MB("독두꺼비 장군", 4, "melee", ["leap", "guard", "spit"], { far: ["hops"], r: 66 }, "b_boss4"),
  m_mangryang: MB("망량", 4, "ranged", ["icecage", "spit", "foxfire"], { near: ["blink"] }, "b_boss4"),
  // 5층 저승 궁궐 — 저승
  m_gangrim: MB("강림도령", 5, "melee", ["scythe", "chains", "clones"], { far: ["clones"] }, "b_boss5"),
  m_umama: MB("우두마면", 5, "melee", ["club", "combo", "quake"], { far: ["hops"], r: 68 }, "b_boss5"),
  m_pangwan: MB("저승 판관", 5, "ranged", ["judgment", "chains", "snipe"], { near: ["blink"] }, "b_boss5"),
  m_haechi: MB("해치 수문장", 5, "melee", ["guard", "slam", "hops"], { far: ["hops"], r: 66 }, "b_boss5"),
  m_wongwi: MB("원귀 장수", 5, "melee", ["combo", "scythe", "fissure"], { far: ["clones"] }, "b_boss5"),
  m_songaksi: MB("손각시", 5, "ranged", ["soulhunt", "chains", "icecage"], { near: ["blink"] }, "b_boss5"),
  m_mongdal: MB("몽달귀신", 5, "ranged", ["soulspiral", "snipe", "judgment"], { near: ["blink"] }, "b_boss5"),
  m_cheonyeo: MB("처녀귀신", 5, "ranged", ["soulhunt", "judgment", "foxfire"], { near: ["blink"] }, "b_boss5"),
  m_jeoseungsae: MB("저승 까마귀", 5, "ranged", ["meteor", "soulhunt", "chains"], { near: ["blink"] }, "b_boss5"),
  m_munjigi: MB("저승 문지기 거인", 5, "melee", ["quake", "guard", "club"], { far: ["fissure"], r: 74, spd: 95, hp: 3400 }, "b_boss5"),
});
// 예전 층보스·새 보스를 층 중간보스로 옮김
Object.assign(BOSSES.b_boss6, { mid: true, fl: 1 }); Object.assign(BOSSES.m_geuseun, { fl: 1 }); Object.assign(BOSSES.m_eodum, { fl: 1 });
Object.assign(BOSSES.m_jangsan, { fl: 2 }); Object.assign(BOSSES.f_imugi, { mid: true, floor: false, fl: 2 });
Object.assign(BOSSES.m_gangcheol, { fl: 3 }); Object.assign(BOSSES.f_bulgasari, { mid: true, floor: false, fl: 3 });
Object.assign(BOSSES.m_mulgwi, { fl: 4 }); Object.assign(BOSSES.f_gumiho, { mid: true, floor: false, fl: 4 });
// 난이도 (사용자 요청 11-12): 스토리는 처음부터 고름 / 무한의 방은 1회차 클리어 → 어려움, 어려움 1회차 클리어 → 매우 어려움. 보상(rw)은 어려울수록 많이
const DIFF = { easy: { name: "쉬움", hp: 0.7, dmg: 0.7, rw: 0.7, col: "#7fe08a" }, normal: { name: "보통", hp: 1.1, dmg: 1.12, rw: 1, col: "#e8dcc4" },
  hard: { name: "어려움", hp: 1.6, dmg: 1.4, rw: 1.5, col: "#ffb547" }, hell: { name: "매우 어려움", hp: 2.6, dmg: 1.9, rw: 2, col: "#ff5a5a" } };
// 요괴 속성 상성 (사용자 요청 11-12): 층마다 요괴 속성, 유리한 공격 +10% · 불리한 공격 -5%
const YOKAI_EL = [
  { k: "shadow", n: "그림자", col: "#9b6bff", strong: ["light", "thunder"], weak: ["dark", "soul"] },
  { k: "frost", n: "서리", col: "#9fe8ff", strong: ["fire", "thunder"], weak: ["frost", "water"] },
  { k: "fire", n: "불", col: "#ff7a3d", strong: ["water", "frost"], weak: ["fire", "earth"] },
  { k: "poison", n: "독", col: "#8fdc5a", strong: ["wind", "light"], weak: ["poison", "water"] },
  { k: "soul", n: "저승", col: "#6fb8ff", strong: ["light", "fire"], weak: ["soul", "dark"] },
];
const EL_NAME = { fire: "불", frost: "서리", thunder: "번개", poison: "독", wind: "바람", light: "빛", dark: "어둠", earth: "대지", water: "물", soul: "혼" };
const AFF_UP = 0.10, AFF_DOWN = 0.05;
const MID_BY_FLOOR = [1, 2, 3, 4, 5].map((f) => Object.keys(BOSSES).filter((k) => BOSSES[k].mid && BOSSES[k].fl === f));
const MID_BOSSES = Object.keys(BOSSES).filter((k) => BOSSES[k].mid);
const FLOOR_BOSSES = Object.keys(BOSSES).filter((k) => !BOSSES[k].mid);
const MINIBOSS = { b_boss6: true };
// 패시브 중첩 단계별 효과 글 (사용자 요청 11-12: "5% → 10%"처럼 보이기). n = 중첩 수
const BOON_LBL = { atk: ["공격력 +", "%"], hp: ["최대 체력 +", "%"], spd: ["이동 속도 +", "%"], as: ["기본 공격 속도 +", "%"], crit: ["치명타 확률 +", "%"], cdr: ["스킬 대기 -", "%"],
  dr: ["받는 피해 -", "%"], regen: ["초당 체력 ", "% 회복"], gold: ["엽전 획득 +", "%"], critdmg: ["치명타 피해 +", "%"], ls: ["흡혈 ", "%"], thorns: ["반사 ", "%"], area: ["범위 +", "%"],
  shieldRoom: ["방마다 보호막 ", "%"], ultcd: ["궁극기 대기 -", "%"], execute: ["25% 확률 즉사 · 체력 ", "% 이하"], echo: ["대기 초기화 확률 ", "%"] };
const BOON_SPECIAL = { burn: (n) => `불태움 ${3 + 1.5 * (n - 1)}초`, chill: (n) => `느려짐 ${Math.min(75, 35 + 10 * (n - 1))}%`, arc: (n) => `번개 ${2 + n}명 · ${80 + 30 * (n - 1)}%`,
  explode: (n) => `폭발 ${100 + 50 * (n - 1)}%`, multi: (n) => `투사체 +${Math.min(3, n)}${n >= 3 ? " (최대)" : ""}`, phoenixPerk: (n) => `부활 ${n}번`, glass: (n) => `공격력 +${40 * n}%, 받는 피해 +${15 * n}%` };
function boonShow(k, n) {
  if (BOON_SPECIAL[k]) return BOON_SPECIAL[k](n);
  const m = BOONS[k].m, parts = [];
  for (const key in m) { const L = BOON_LBL[key]; if (!L) continue; const v = Math.round(Math.abs(m[key]) * n * 1000) / 10; const cap = typeof STAT_CAP !== "undefined" && STAT_CAP[key] && m[key] > 0 ? ` (최대 ${Math.round(STAT_CAP[key] * 1000) / 10}${L[1].trim() || "%"})` : ""; parts.push(L[0] + v + L[1] + cap); }
  return parts.join(", ") || BOONS[k].desc;
}
function boonChange(k, n) { return n ? `<p class="lvchg"><span>${boonShow(k, n)}</span> → <b>${boonShow(k, n + 1)}</b></p>` : ""; }

// ===== 스킬 가챠 (Q·W·E·R 칸마다 따로) =====
// 등급 확률: D 50% / C 33% / B 11% / A 5.5% / S 0.5%. owner 가 있으면 그 캐릭터 고유 스킬
const SK_GRADE = { D: { p: 0.5, col: "#9b93a8" }, C: { p: 0.33, col: "#7fd18b" }, B: { p: 0.11, col: "#6db6ff" }, A: { p: 0.055, col: "#c38bff" }, S: { p: 0.005, col: "#ffb547" } };
const SK_GRADES = ["D", "C", "B", "A", "S"];
const SKILL_GACHA = { cost: { Q: 2, W: 2, E: 2, R: 3 }, cost10: { Q: 18, W: 18, E: 18, R: 27 }, maxLv: 5 };
const S_ = (slot, grade, name, ic, cd, desc, fx, owner) => ({ slot, grade, name, ic, cd, desc, fx, owner: owner || null, ult: slot === "R" });
const SKILLS = {
  // --- 공용 Q (공격) ---
  cq_rock: S_("Q", "D", "돌팔매", "🪨", 4, "돌을 던져 150% 피해", [{ t: "proj", d: 1.5, spd: 800, life: 0.8, r: 12, col: "#c9b79a" }]),
  cq_cut: S_("Q", "D", "짧은 베기", "🔪", 4, "앞쪽 160% 피해", [{ t: "arc", d: 1.6, r: 125, ang: 1.6, col: "#e0e0f0" }]),
  cq_needle: S_("Q", "C", "독침", "🪡", 4, "독침 140% + 4초 중독", [{ t: "proj", d: 1.4, spd: 1100, life: 0.7, r: 8, col: "#9bea6a", burn: 4 }]),
  cq_spin: S_("Q", "C", "회전 베기", "🌀", 5, "주변 170% 피해", [{ t: "nova", r: 155, d: 1.7, col: "#e0e0f0" }]),
  cq_volley: S_("Q", "B", "연발 화살", "🏹", 5, "화살 4발 각 130%", [{ t: "proj", n: 4, spread: 0.35, d: 1.3, spd: 950, life: 0.7, r: 8, col: "#cfe8ff", shape: "arrow" }]),
  cq_fireball: S_("Q", "B", "불덩이", "☄️", 6, "부딪히면 폭발 240%", [{ t: "proj", d: 2.4, spd: 700, life: 1, r: 18, col: "#ff8a3d", explode: 130, burn: 3 }]),
  cq_chain: S_("Q", "A", "번개 사슬", "⚡", 6, "번개가 6명에게 튀며 각 220%", [{ t: "chain", n: 6, d: 2.2, range: 460, col: "#fff27a" }]),
  cq_flash: S_("Q", "S", "천둥 일섬", "🌩️", 6, "직선 광선 520% + 기절", [{ t: "beam", len: 1100, w: 80, d: 5.2, stun: 0.8, col: "#fff27a", delay: 0.2 }]),
  // --- 공용 W (이동) ---
  cw_hop: S_("W", "D", "발 구르기", "👣", 6, "커서 쪽으로 짧게 돌진", [{ t: "dash", dist: 200, d: 0, inv: 0.25, col: "#cfd6e0" }]),
  cw_run: S_("W", "D", "빠른 걸음", "🏃", 10, "3초 동안 이동 +45%", [{ t: "buff", dur: 3, spd: 0.45, col: "#cfeaff" }]),
  cw_shadow: S_("W", "C", "그림자 걸음", "🌑", 6, "커서로 순간이동", [{ t: "blink", dist: 300 }]),
  cw_rush: S_("W", "C", "돌진 베기", "💨", 6, "돌진하며 150% 피해", [{ t: "dash", dist: 260, d: 1.5, col: "#e0e0f0" }]),
  cw_burst: S_("W", "B", "축지 폭발", "💥", 7, "순간이동 후 착지 180%", [{ t: "blink", dist: 340 }, { t: "nova", r: 140, d: 1.8, col: "#ffcf8a" }]),
  cw_wind: S_("W", "B", "바람 장막", "🌬️", 12, "4초 동안 이동 +30%, 받는 피해 -30%", [{ t: "buff", dur: 4, spd: 0.3, dr: 0.3, col: "#cfeaff" }]),
  cw_bolt: S_("W", "A", "번개 이동", "⚡", 6, "번개처럼 돌진 260%, 무적", [{ t: "dash", dist: 380, d: 2.6, inv: 0.5, col: "#fff27a" }]),
  cw_time: S_("W", "S", "시간 걷기", "⏳", 10, "순간이동 + 주변 적 2초 정지 + 1.5초 무적", [{ t: "blink", dist: 420 }, { t: "nova", r: 260, d: 1, stun: 2, col: "#ffe9a0" }, { t: "buff", dur: 1.5, inv: true, col: "#ffe9a0" }]),
  // --- 공용 E (방어·제어) ---
  ce_aid: S_("E", "D", "응급 처치", "🩹", 14, "체력 14% 회복", [{ t: "heal", pct: 0.14 }]),
  ce_board: S_("E", "D", "나무 방패", "🪵", 12, "체력 18% 보호막", [{ t: "heal", shield: 0.18 }]),
  ce_frost: S_("E", "C", "서리 고리", "❄️", 11, "주변 적 1.2초 얼림 + 90%", [{ t: "nova", r: 180, d: 0.9, stun: 1.2, col: "#9fe8ff" }]),
  ce_vine: S_("E", "C", "가시 덩굴", "🌿", 11, "커서에 4초 덩굴 (느려짐, 초당 90%)", [{ t: "zone", r: 160, dur: 4, dps: 0.9, slow: 0.5, col: "#7fd18b", at: "cursor" }]),
  ce_spring: S_("E", "B", "생명의 샘", "⛲", 15, "6초 동안 초당 체력 4% 회복", [{ t: "buff", dur: 6, regen: 0.04, col: "#7fe0ff" }]),
  ce_wall: S_("E", "B", "철벽", "🛡️", 13, "4초 동안 받는 피해 -55%", [{ t: "buff", dur: 4, dr: 0.55, col: "#ffd27a" }]),
  ce_sanct: S_("E", "A", "신성한 결계", "🔆", 14, "5초 결계 (안에서 받는 피해 -40%, 적 초당 130%)", [{ t: "zone", r: 210, dur: 5, dps: 1.3, slow: 0.35, guard: 0.4, col: "#ffe9a0", at: "self" }]),
  ce_immortal: S_("E", "S", "불멸의 맹세", "👼", 22, "3초 무적 + 체력 30% 회복", [{ t: "buff", dur: 3, inv: true, col: "#ffe9a0" }, { t: "heal", pct: 0.3 }]),
  // --- 공용 R (궁극기) ---
  cr_boom: S_("R", "D", "큰 폭발", "💣", 36, "주변 380% 폭발", [{ t: "nova", r: 230, d: 3.8, col: "#ff7a3d" }]),
  cr_dogs: S_("R", "D", "원혼 부르기", "👻", 38, "원혼 3마리 10초", [{ t: "summon", kind: "ghost", n: 3, dur: 10 }]),
  cr_meteor: S_("R", "C", "유성 낙하", "🌠", 38, "커서 주변 유성 6개 각 280%", [{ t: "strike", n: 6, scatter: 200, r: 110, d: 2.8, delay: 0.6, stagger: 0.15, col: "#ffb547" }]),
  cr_storm: S_("R", "C", "폭풍 화살", "🌧️", 36, "커서에 5초 화살 폭풍 (초당 220%)", [{ t: "zone", r: 220, dur: 5, dps: 2.2, slow: 0.4, col: "#9fd1ff", at: "cursor" }]),
  cr_dragon: S_("R", "B", "용의 숨결", "🐲", 36, "긴 화염 광선 650%", [{ t: "beam", len: 1100, w: 100, d: 6.5, col: "#ff8a3d", delay: 0.3 }]),
  cr_march: S_("R", "B", "망자의 행진", "💀", 42, "해골 병사 5명 12초", [{ t: "summon", kind: "skeleton", n: 5, dur: 12 }]),
  cr_thunder: S_("R", "A", "뇌신 강림", "🌩️", 40, "적에게 벼락 14번 각 300%", [{ t: "strike", n: 14, scatter: 9999, r: 120, d: 3.0, delay: 0.5, stagger: 0.1, col: "#fff27a", bolt: true, targetEnemies: true }]),
  cr_heaven: S_("R", "S", "천지개벽", "🌌", 50, "방 전체 900% + 2.5초 기절", [{ t: "nova", r: 9999, d: 9, stun: 2.5, col: "#ffe9a0" }]),

  // --- 캐릭터 고유 (그 캐릭터만 낄 수 있음) ---
  u_musa1: S_("Q", "B", "삼단 베기", "⚔️", 5, "앞쪽을 세 번 베어 각 120%", [{ t: "repeat", n: 3, gap: 0.15, fx: { t: "arc", d: 1.2, r: 130, ang: 1.8, col: "#ffcf8a", aim: true } }], "musa"),
  u_musa2: S_("R", "S", "일도양단", "🗡️", 40, "거대한 검기 1000% (모든 적 꿰뚫음)", [{ t: "beam", len: 1400, w: 140, d: 10, col: "#ffb547", delay: 0.45 }], "musa"),
  u_archer1: S_("W", "A", "연환 구르기", "🍃", 5, "구르며 화살 3발 (각 120%)", [{ t: "dash", dist: 240, d: 0, inv: 0.4, col: "#cfe8ff" }, { t: "proj", n: 3, spread: 0.4, d: 1.2, spd: 950, life: 0.7, r: 8, col: "#cfe8ff", shape: "arrow" }], "archer"),
  u_archer2: S_("R", "S", "만궁 난사", "🎇", 40, "3초 동안 화살 30발이 사방으로 (각 150%, 따라감)", [{ t: "repeat", n: 10, gap: 0.3, fx: { t: "proj", n: 3, spread: 6.28, d: 1.5, spd: 800, life: 1, r: 8, col: "#cfe8ff", shape: "arrow", home: 4 } }], "archer"),
  u_spear1: S_("E", "B", "창벽", "🧱", 12, "4초 동안 받는 피해 -40%, 반사 200%", [{ t: "buff", dur: 4, dr: 0.4, thorns: 2, col: "#d5e6ff" }], "spear"),
  u_spear2: S_("Q", "A", "용아창", "🐉", 6, "세 번 찌르는 긴 창격 각 180%", [{ t: "repeat", n: 3, gap: 0.12, fx: { t: "beam", len: 320, w: 50, d: 1.8, col: "#d5e6ff", aim: true } }], "spear"),
  u_monk1: S_("W", "B", "섬전보", "⚡", 5, "번개처럼 두 번 돌진 (각 130%)", [{ t: "dash", dist: 200, d: 1.3, col: "#ffd08a" }, { t: "dash", dist: 200, d: 1.3, col: "#ffd08a", delay: 0.25 }], "monk"),
  u_monk2: S_("R", "S", "천수관음장", "🙏", 38, "3초 동안 주변을 15번 각 140%", [{ t: "repeat", n: 15, gap: 0.2, fx: { t: "nova", r: 230, d: 1.4, col: "#ffcf5a", follow: true } }], "monk"),
  u_gunner1: S_("E", "B", "연막탄", "🌫️", 13, "자리에 연막 4초 (적 느려짐, 안에서 피해 -35%)", [{ t: "zone", r: 190, dur: 4, dps: 0.4, slow: 0.6, guard: 0.35, col: "#bdbdbd", at: "self" }], "gunner"),
  u_gunner2: S_("Q", "A", "관통탄", "🔫", 5, "모두 꿰뚫는 탄 320%", [{ t: "proj", d: 3.2, spd: 1600, life: 0.7, r: 9, col: "#ffe2a0", pierce: 99 }], "gunner"),
  u_priest1: S_("Q", "B", "오색 방울", "🎐", 4, "따라가는 방울 5개 각 100%", [{ t: "proj", n: 5, spread: 1.0, d: 1, spd: 650, life: 1.1, r: 11, col: "#ffd6ef", home: 3 }], "priest"),
  u_priest2: S_("R", "S", "천신 강림", "🌈", 46, "10초 동안 받는 피해 -80%, 초당 체력 5% 회복, 주변 초당 150%", [{ t: "buff", dur: 10, dr: 0.8, regen: 0.05, aura: 1.5, col: "#ffb3e0" }], "priest"),
  u_necro1: S_("E", "A", "뼈 감옥", "🦴", 12, "커서의 적 2.5초 가둠 + 160%", [{ t: "strike", n: 1, r: 160, d: 1.6, delay: 0.3, stun: 2.5, col: "#d8d0ff" }], "necro"),
  u_necro2: S_("W", "B", "망령 걸음", "👣", 6, "순간이동 후 원혼 1마리", [{ t: "blink", dist: 320 }, { t: "summon", kind: "ghost", n: 1, dur: 8 }], "necro"),
  u_assassin1: S_("Q", "A", "급소 찌르기", "🎯", 5, "앞쪽 380%, 반드시 치명타", [{ t: "arc", d: 3.8, r: 120, ang: 1.0, col: "#ff6a85", crit: true }], "assassin"),
  u_assassin2: S_("R", "S", "천살", "☠️", 40, "모든 적에게 차례로 날아가 각 400%", [{ t: "flurry", n: 16, d: 4, gap: 0.08 }], "assassin"),
  u_dosa1: S_("E", "B", "부적 결계", "📜", 12, "보호막 25% + 5초 동안 피해 -20%", [{ t: "heal", shield: 0.25 }, { t: "buff", dur: 5, dr: 0.2, col: "#ffe08a" }], "dosa"),
  u_dosa2: S_("Q", "S", "삼매진화", "🔥", 6, "따라가는 화염 부적 6장 각 230% 폭발", [{ t: "proj", n: 6, spread: 1.2, d: 2.3, spd: 700, life: 1.2, r: 13, col: "#ff8a3d", shape: "talisman", home: 4, explode: 100 }], "dosa"),
  u_yinyang1: S_("W", "A", "음양 바꾸기", "🔁", 7, "순간이동, 떠난 자리·도착 자리 160% 폭발", [{ t: "nova", r: 140, d: 1.6, col: "#8a80b0" }, { t: "blink", dist: 360 }, { t: "nova", r: 140, d: 1.6, col: "#f5f2ff" }], "yinyang"),
  u_yinyang2: S_("E", "B", "팔괘진", "☯️", 13, "5초 동안 구슬 8개가 돌며 각 90%", [{ t: "orbit", n: 8, dur: 5, r: 140, d: 0.9, col: "#f5f2ff", alt: "#2a2440" }], "yinyang"),
  u_summoner1: S_("Q", "B", "영혼 늑대", "🐺", 7, "영혼 늑대 2마리 8초", [{ t: "summon", kind: "wolf", n: 2, dur: 8 }], "summoner"),
  u_summoner2: S_("R", "S", "황룡 소환", "🐲", 50, "황룡을 15초 동안 부름 (매우 강함)", [{ t: "summon", kind: "dragon", n: 1, dur: 15 }], "summoner"),
  u_berserker1: S_("E", "A", "피의 함성", "📯", 13, "주변 적 1.5초 기절, 6초 동안 공격력 +40%", [{ t: "nova", r: 220, d: 0.5, stun: 1.5, col: "#ff5a3d" }, { t: "buff", dur: 6, atk: 0.4, col: "#ff5a3d" }], "berserker"),
  u_berserker2: S_("Q", "B", "대지 가르기", "🪓", 6, "땅을 갈라 직선 260%", [{ t: "beam", len: 520, w: 70, d: 2.6, col: "#ffb08a" }], "berserker"),
  u_moon1: S_("E", "A", "달그림자", "🌘", 10, "2초 무적, 끝나면 주변 260%", [{ t: "buff", dur: 2, inv: true, col: "#d9ccff" }, { t: "nova", r: 200, d: 2.6, col: "#e6dcff", delay: 2 }], "moon"),
  u_moon2: S_("Q", "S", "삼월참", "🌙", 4, "초승달 검기 3개 각 200%", [{ t: "proj", n: 3, spread: 0.5, d: 2, spd: 900, life: 0.7, r: 26, col: "#e6dcff", shape: "crescent", pierce: 99 }], "moon"),
  u_thunder1: S_("W", "A", "뇌광 돌격", "⚡", 6, "번개 돌진 240% + 끝에 벼락", [{ t: "dash", dist: 340, d: 2.4, inv: 0.3, col: "#fff27a" }, { t: "nova", r: 150, d: 1.6, stun: 0.6, col: "#fff27a", delay: 0.2 }], "thunder"),
  u_thunder2: S_("E", "B", "피뢰침", "🔱", 12, "커서에 5초 피뢰침 (초당 200% 감전)", [{ t: "zone", r: 180, dur: 5, dps: 2, col: "#fff27a", at: "cursor", rune: true }], "thunder"),
  u_fox1: S_("W", "B", "여우 둔갑", "🦊", 8, "3초 동안 이동 +50%, 은신", [{ t: "buff", dur: 3, spd: 0.5, stealth: true, col: "#ff8a3d" }], "fox"),
  u_fox2: S_("R", "S", "구미호 본색", "🌕", 40, "8초 동안 공격력 +80%, 여우불 9개 회전", [{ t: "buff", dur: 8, atk: 0.8, col: "#ff8a3d" }, { t: "orbit", n: 9, dur: 8, r: 130, d: 1.3, col: "#7fd8ff" }], "fox"),
  u_reaper1: S_("W", "A", "저승 걸음", "🚶", 6, "돌진하며 지나간 적 200%, 무적", [{ t: "dash", dist: 360, d: 2, inv: 0.4, col: "#b06bff" }], "reaper"),
  u_reaper2: S_("E", "B", "명부 낙인", "📕", 11, "주변 적 2초 느려짐 + 5초 동안 받는 피해 +25%", [{ t: "nova", r: 220, d: 0.8, slow: 0.5, slowDur: 2, mark: 0.25, col: "#9b5bff" }], "reaper"),
};
const SKILL_KEYS = Object.keys(SKILLS);

// ===== 전직 (레벨 10·20·30에 두 갈래 중 하나) — 사용자 요청 11-10 =====
// 첫째 = 공격형(공격력·치명타·스킬 위력), 둘째 = 수호·기술형(체력·받는 피해·스킬 대기)
const JOB_NAMES = {
  dolsoe: [["의병", "쟁기꾼"], ["의병장", "철농부"], ["의병대장", "풍년신"]], pojol: [["포교", "순라군"], ["포도부장", "종사관"], ["포도대장", "금부도사"]],
  yakcho: [["약초의원", "독초꾼"], ["명의", "독술사"], ["신의", "백초선"]], namu: [["도끼꾼", "산사람"], ["산적두목", "산신 도끼"], ["산신령", "금도끼 장사"]],
  geommu: [["검무랑", "부채무희"], ["교방 명기", "칼춤 명인"], ["논개", "검무 대가"]], mudang: [["당골", "점바치"], ["큰만신", "작두무당"], ["국무당", "신어미"]],
  hwarang: [["낭도", "풍류도"], ["화랑", "국선"], ["풍월주", "호국화랑"]], eosa: [["수의", "봉명사신"], ["어사또", "직지사"], ["도어사", "영의정"]],
  sorikun: [["고수", "광대"], ["명창", "소리 명인"], ["국창", "가왕"]], eulji: [["말갈 기병장", "철기 대장"], ["고구려 대모달", "막리지 장군"], ["살수의 영웅", "천하 명장"]],
  haemosu: [["태양 사수", "오룡 기수"], ["천손", "해의 사자"], ["천제의 아들", "태양왕"]], jipsin: [["허수아비", "짚단 무사"], ["허수아비 대장", "들판 수호자"], ["허수아비 장군", "만년 허수아비"]],
  musa: [["검호", "철벽무사"], ["검성", "불괴장군"], ["검신", "천하대장군"]],
  archer: [["신궁", "바람사수"], ["천궁수", "폭풍궁사"], ["궁신", "천풍궁주"]],
  spear: [["창술가", "방패창병"], ["용창사", "철벽창장"], ["창신", "수호대장"]],
  monk: [["권사", "금강승"], ["권성", "불괴금강"], ["권신", "금강불괴존"]],
  gunner: [["저격수", "화약장"], ["명포수", "홍이포장"], ["총신", "천둥포장"]],
  priest: [["만신", "치유무녀"], ["대만신", "생명무녀"], ["신모", "천신무녀"]],
  necro: [["혼령술사", "망령수호자"], ["사령군주", "혼의 방패"], ["명계왕", "불사군주"]],
  assassin: [["그림자 칼", "은둔자"], ["야차", "그림자 장막"], ["무영살", "그림자 왕"]],
  dosa: [["화부도사", "결계도사"], ["진인", "결계진인"], ["천사", "대결계사"]],
  yinyang: [["음양박사", "식신술사"], ["태극사", "대식신사"], ["천문사", "신령술사"]],
  summoner: [["영수사", "계약자"], ["영수왕", "대계약자"], ["사신수주", "천계약자"]],
  berserker: [["부월장", "철갑부장"], ["광부장", "불괴부장"], ["천부신장", "철벽신장"]],
  moon: [["월검", "월영무"], ["만월검", "월광무희"], ["월신검", "천월무희"]],
  thunder: [["뇌장", "번개수호"], ["천뢰장", "뇌전방패"], ["뇌신장군", "천둥수호신"]],
  fox: [["여우불사", "매혹술사"], ["천호", "대매혹사"], ["구미신", "천호신녀"]],
  reaper: [["차사", "명부지기"], ["대차사", "명부판관"], ["염라사자", "명부대왕"]],
  bong: [["야수", "수호수인"], ["대야수", "강철수인"], ["수왕", "수호왕"]],
  haerang: [["수군검사", "방패수군"], ["수군장군", "철갑수군"], ["해신장", "거북선대장"]],
  danbi: [["매잡이", "덫사냥꾼"], ["응사", "숲의 수호자"], ["천응", "사냥왕"]],
  cheonrang: [["백호검", "백호방패"], ["백호대장", "백호수호신"], ["백호천신", "서방수호신"]],
  hwaryeon: [["불꽃무녀", "치유무녀"], ["주작사제", "불사무녀"], ["주작천녀", "남방수호신"]],
};
// 4차(각성, Lv.40)·5차(초월, Lv.50) 전직 (사용자 요청 11-13)
const JOB_NAMES_EX = {
  musa: [["검선", "금강대장군"], ["검제", "만고대장군"]], archer: [["신궁선", "풍백궁주"], ["천궁제", "천풍신궁"]],
  spear: [["용창선", "철옹대장"], ["창제", "만세수호장"]], monk: [["권선", "금강역사"], ["무극권제", "금강불괴신"]],
  gunner: [["신포수", "천둥포대장"], ["포신", "벽력신포장"]], priest: [["천무녀", "생명신모"], ["삼신할미", "천신모"]],
  necro: [["명계군주", "불사대군"], ["저승왕", "불멸군주"]], assassin: [["무영야차", "그림자 군주"], ["무형살신", "어둠의 왕"]],
  dosa: [["태을진인", "천라결계사"], ["옥황진인", "만겁결계주"]], yinyang: [["태극천사", "십이식신주"], ["음양천존", "만신령주"]],
  summoner: [["사신수왕", "천상계약자"], ["사신천주", "만수계약주"]], berserker: [["광천신장", "철갑천장"], ["파천부신", "불괴천신"]],
  moon: [["월하검선", "월광선녀"], ["월신검제", "항아"]], thunder: [["뇌공", "뇌전수호신"], ["뇌신", "천둥천왕"]],
  fox: [["천년구미", "천호선녀"], ["구미천신", "만년천호"]], reaper: [["저승대사자", "명부시왕"], ["저승왕 차사", "염라대왕"]],
  bong: [["야수왕", "강철수왕"], ["백수신", "만수수호신"]], haerang: [["해룡장", "거북선 제독"], ["사해용왕장", "삼도수군통제사"]],
  danbi: [["해동청", "숲의 왕"], ["천응신", "산군 사냥왕"]], cheonrang: [["백호천장", "서방천왕"], ["백호대신", "서방대수호신"]],
  hwaryeon: [["주작선녀", "불사조무녀"], ["주작천신", "남방대수호신"]],
  dolsoe: [["의병대원수", "풍년대신"], ["홍의장군", "농신"]], pojol: [["포도대장군", "의금부 판사"], ["좌포청 대장군", "금부대신"]],
  yakcho: [["어의", "백독술사"], ["의성", "백초신선"]], namu: [["산군", "금도끼 신선"], ["산신대왕", "은도끼 산신"]],
  geommu: [["검무 명인", "칼춤 대가"], ["의기 논개", "검무 성인"]], mudang: [["나라만신", "대신어미"], ["바리공주", "천신어미"]],
  hwarang: [["호국풍월주", "국선대사"], ["화랑대왕", "호국대국선"]], eosa: [["팔도어사", "대제학"], ["암행대어사", "영의정 대감"]],
  sorikun: [["가객", "판소리 명인"], ["가신", "만고가왕"]], eulji: [["살수대첩 영웅", "막리지 대장군"], ["고구려 군신", "천하대원수"]],
  haemosu: [["천손대왕", "오룡천자"], ["천제 해모수", "일월천왕"]], jipsin: [["허수아비 대원수", "들판 대수호자"], ["허수아비 왕", "천년 허수아비"]],
};
for (const k in JOB_NAMES) if (JOB_NAMES_EX[k]) JOB_NAMES[k].push(...JOB_NAMES_EX[k]);
const JOB_LEVELS = [10, 20, 30, 40, 50];
const JOB_TIER_NAME = ["1차 전직", "2차 전직", "3차 전직", "4차 전직 · 각성", "5차 전직 · 초월"];
// 캐릭터마다 다른 전직 능력 (사용자 요청 11-13: "모든 전직후 얻는 옵션이 같아"). [공격 갈래, 수비 갈래] 1차 기준 값, 차수마다 k배
const JOB_TRAITS = {
  musa: [{ atk: .10, critdmg: .20 }, { hp: .14, dr: .06, thorns: .08 }], archer: [{ crit: .06, as: .10 }, { spd: .08, cdr: .08 }],
  spear: [{ atk: .08, area: .12 }, { dr: .08, shieldRoom: .05 }], monk: [{ as: .12, ls: .02 }, { hp: .12, regen: .002 }],
  gunner: [{ critdmg: .30, crit: .04 }, { area: .15, cdr: .06 }], priest: [{ atk: .08, cdr: .08 }, { regen: .003, hp: .10 }],
  necro: [{ atk: .08, ls: .02 }, { hp: .10, shieldRoom: .06 }], assassin: [{ crit: .08, critdmg: .25 }, { spd: .10, dr: .05 }],
  dosa: [{ atk: .10, area: .10 }, { cdr: .10, dr: .05 }], yinyang: [{ cdr: .08, crit: .05 }, { shieldRoom: .06, regen: .002 }],
  summoner: [{ atk: .10, cdr: .06 }, { hp: .12, thorns: .10 }], berserker: [{ atk: .12, as: .08 }, { ls: .03, hp: .12 }],
  moon: [{ crit: .07, as: .08 }, { spd: .08, dr: .06 }], thunder: [{ atk: .08, area: .12 }, { dr: .08, thorns: .10 }],
  fox: [{ atk: .10, crit: .05 }, { spd: .08, ls: .02 }], reaper: [{ critdmg: .25, atk: .06 }, { ls: .03, dr: .05 }],
  bong: [{ as: .10, spd: .06 }, { hp: .15, regen: .002 }], haerang: [{ atk: .09, area: .10 }, { dr: .08, shieldRoom: .05 }],
  danbi: [{ crit: .06, as: .09 }, { spd: .09, cdr: .07 }], cheonrang: [{ atk: .10, critdmg: .18 }, { hp: .12, dr: .07 }],
  hwaryeon: [{ atk: .09, area: .10 }, { regen: .003, shieldRoom: .05 }], dolsoe: [{ atk: .10, as: .06 }, { hp: .16, dr: .04 }],
  pojol: [{ crit: .05, spd: .06 }, { dr: .08, thorns: .08 }], yakcho: [{ atk: .07, cdr: .08 }, { regen: .004, hp: .08 }],
  namu: [{ atk: .12, area: .08 }, { hp: .14, thorns: .08 }], geommu: [{ as: .10, crit: .05 }, { spd: .09, dr: .05 }],
  mudang: [{ cdr: .09, atk: .07 }, { shieldRoom: .06, regen: .002 }], hwarang: [{ atk: .09, crit: .05 }, { hp: .10, ls: .02 }],
  eosa: [{ critdmg: .22, crit: .04 }, { gold: .15, dr: .06 }], sorikun: [{ area: .14, cdr: .06 }, { regen: .003, spd: .06 }],
  eulji: [{ atk: .10, area: .10 }, { dr: .08, hp: .10 }], haemosu: [{ atk: .10, critdmg: .20 }, { ultcd: .10, shieldRoom: .05 }],
  jipsin: [{ thorns: .12, atk: .06 }, { hp: .18, dr: .05 }],
};
// 전직하면 스킬이 바뀜: 1~4차는 1·2·3·4번 칸 하나씩, 5차(초월)는 모든 스킬. 공격 갈래 = 위력, 수비 갈래 = 대기 시간
const JOB_SK_SLOT = ["Q", "W", "E", "R", "ALL"], JOB_SK_TAG = ["날선", "깊은", "극(極)", "각성", "초월"];
const JOB_K = [1, 1.15, 1.3, 1.45, 1.6]; // 11-13 밸런스: 5차까지 같은 갈래면 합 6.5배 (예전 8.5배)
// ===== 밸런스 상한 (사용자 요청 11-13: "궁극기 쿨타임 감소가 강화를 끝까지 하면 너무 자주 사용 가능" 같은 무너짐 막기) =====
// 패시브는 같은 것을 Lv.3까지. 능력치는 패시브·아티팩트·펫·칭호·전직·상점을 다 합쳐도 아래 값을 넘지 않는다.
const BOON_MAX = 3;
// ===== 근거리·원거리 밸런스 (사용자 요청 11-14: "원거리 캐릭터가 근접에 비해 게임 난이도가 압도적으로 쉬워") =====
// 같은 싸움 시뮬레이션(3층 보통, Lv.20 장비 없음, 원거리는 거리 벌리며 쏘기): 근거리 받은 피해 247% / 원거리 201%(정리 속도 비슷).
// 실제 플레이어는 더 잘 피하므로 차이는 더 크다 → 근거리에 '근접 투지', 원거리는 위력 조금 줄임
const ROLE_OF = (range) => (/원거리/.test(range) && !/근접/.test(range) ? "ranged" : /중거리|근접\/원거리/.test(range) ? "mid" : /근접\(긴\)/.test(range) ? "reach" : "melee");
// 같은 등급 안에서 많이 약했던 캐릭터 (11-15 사용자: 약한 캐릭터 밸런스 패치). 시뮬레이션(받은 피해·정리 시간)을 등급 중간값 근처로
const CHAR_TUNE = { archer: { atk: -0.04, hp: 0.00 }, assassin: { atk: 0.20, hp: 0.00 }, berserker: { atk: -0.25, hp: 0.00 }, bong: { atk: -0.15, hp: 0.00 }, cheonrang: { atk: -0.20, hp: 0.00 }, danbi: { atk: 0.06, hp: 0.00 }, dosa: { atk: 0.08, hp: 0.08 }, eosa: { atk: -0.23, hp: 0.00 }, eulji: { atk: -0.25, hp: 0.00 }, geommu: { atk: 0.20, hp: 0.00 }, gunner: { atk: -0.13, hp: 0.00 }, haerang: { atk: 0.30, hp: 0.00 }, hwaryeon: { atk: 0.02, hp: 0.00 }, monk: { atk: 0.21, hp: 0.00 }, moon: { atk: 0.06, hp: 0.00 }, mudang: { atk: 0.10, hp: 0.00 }, namu: { atk: 0.64, hp: 0.06 }, necro: { atk: 0.07, hp: 0.00 }, pojol: { atk: 0.18, hp: 0.12 }, priest: { atk: 0.26, hp: 0.25 }, reaper: { atk: 0.04, hp: 0.10 }, sorikun: { atk: 0.21, hp: 0.08 }, spear: { atk: -0.01, hp: 0.00 }, summoner: { atk: -0.25, hp: 0.00 }, thunder: { atk: 0.19, hp: 0.00 }, yakcho: { atk: 0.32, hp: 0.12 }, yinyang: { atk: 0.28, hp: 0.10 } }; // 11-15 등급 안 편차 줄이기(허수아비 딜 측정: 한 마리·무리 점수를 등급 중간값 쪽으로 70%)
for (const c of CHARS) { const t = CHAR_TUNE[c.id]; if (!t) continue; if (t.atk) c.atk = Math.round(c.atk * (1 + t.atk)); if (t.hp) c.hp = Math.round(c.hp * (1 + t.hp));
  if (c.forms) for (const f of Object.values(c.forms)) { if (t.atk && f.atk) f.atk = Math.round(f.atk * (1 + t.atk)); if (t.hp && f.hp) f.hp = Math.round(f.hp * (1 + t.hp)); } }
const ROLE_MODS = {
  melee: { name: "근접 투지", m: { dr: 0.14, hp: 0.16, ls: 0.03, spd: 0.08 }, desc: "받는 피해 -14% · 최대 체력 +16% · 흡혈 3% · 이동 속도 +8%" },
  reach: { name: "근접 투지", m: { dr: 0.09, hp: 0.11, ls: 0.02, spd: 0.05 }, desc: "받는 피해 -9% · 최대 체력 +11% · 흡혈 2% · 이동 속도 +5%" },
  mid: { name: "균형", m: { dr: 0.05, hp: 0.06 }, desc: "받는 피해 -5% · 최대 체력 +6%" },
  ranged: { name: "거리 유지", m: { atk: -0.08 }, desc: "공격력 -8% (멀리서 안전하게 싸우는 대가)" },
};
// 11-21 강화 인플레 막기: 넘는 만큼은 절반만 (Lv.50 공격만 고르면 강화로 공격 8.3배 → 약 6배, 아무거나 고르면 거의 그대로)
const SOFT_CAP = { atk: 0.6, as: 0.4, hp: 0.8 };
const STAT_CAP = { cdr: 0.40, ultcd: 0.30, echo: 0.25, crit: 0.80, critdmg: 2.0, as: 1.2, spd: 0.6, area: 0.8, dr: 0.6, ls: 0.10, regen: 0.01, thorns: 1.5, shieldRoom: 0.35, execute: 0.3 };
const ULT_MIN = 0.45; // 궁극기 대기는 모든 감소를 합쳐도 원래의 45% 아래로 내려가지 않는다
function jobSkillText(cid, tier, kind) {
  const slot = JOB_SK_SLOT[tier], lab = slot === "ALL" ? "모든 스킬" : `${{ Q: 1, W: 2, E: 3, R: 4 }[slot]}번 스킬`;
  return kind === "atk" ? `${lab}이 '${JOB_SK_TAG[tier]}'으로 바뀜 · 위력 +${slot === "ALL" ? 15 : 30}%` : `${lab}이 '${JOB_SK_TAG[tier]}'으로 바뀜 · 대기 -${slot === "ALL" ? 12 : 22}% · 위력 +10%`;
}
function jobModText(m) { return Object.entries(m).map(([k, v]) => { const L = BOON_LBL[k]; if (!L) return ""; const n = k === "regen" ? (v * 100).toFixed(1) : Math.round(v * 100); return L[0] + n + L[1]; }).filter(Boolean).join(" · "); }
function jobOptions(cid, tier) {
  const k = JOB_K[tier], names = JOB_NAMES[cid] || JOB_NAMES.musa, nm = names[tier] || names[2];
  const T = JOB_TRAITS[cid] || JOB_TRAITS.musa, scale = (o) => Object.fromEntries(Object.entries(o).map(([a, v]) => [a, +(v * k).toFixed(4)]));
  return ["atk", "def"].map((kind, b) => { const m = scale(T[b]); return { name: nm[b], kind, tier, m, skPow: kind === "atk" ? 0.06 * k : 0, desc: jobModText(m), skill: jobSkillText(cid, tier, kind) }; });
}
// ===== 저주 스테이지 — 사용자 요청 11-10. 대신 경험치·금화 1.5배 =====
const CURSES = {
  dark: { name: "어둠의 저주", ic: "🌑", desc: "시야가 좁아져요" },
  blood: { name: "피의 저주", ic: "🩸", desc: "받는 피해 +25%" },
  wither: { name: "메마름의 저주", ic: "🥀", desc: "회복 효과 절반" },
  haste: { name: "질주의 저주", ic: "💨", desc: "요괴가 20% 빨라져요" },
  // 11-12 추가
  swarm: { name: "무리의 저주", ic: "💀", desc: "방마다 요괴 +40%" },
  armor: { name: "강철의 저주", ic: "🛡️", desc: "요괴가 받는 피해 -20%" },
  grudge: { name: "원한의 저주", ic: "💥", desc: "쓰러진 요괴가 잠시 뒤 터져요" },
  seal: { name: "봉인의 저주", ic: "🔒", desc: "스킬·액티브 대기 시간 +30%" },
};
// 저주 확률 (사용자 요청 11-12: 너무 자주도, 너무 드물지도 않게)
// 스테이지마다 15% · 바로 앞 스테이지가 저주였으면 안 걸림 · 8스테이지 연속 없으면 45% · 10스테이지 연속 없으면 꼭 걸림 · 층 최종보스 스테이지와 첫 스테이지는 저주 없음
// → 평균 약 6~7스테이지에 1번 (스토리 50스테이지 중 약 7번)
const CURSE_P = 0.15, CURSE_PITY_N = 8, CURSE_PITY_P = 0.45, CURSE_SURE_N = 10;

// ===== 원정 상점 (엽전으로 사기, 효과는 그 원정 동안) — 사용자 요청 11-10 =====
const SHOP_ITEMS = {
  herb: { name: "회복 약초", ic: "🌿", desc: "체력 40% 회복", price: 35 },
  speed: { name: "공격 속도 영약", ic: "🧪", desc: "이번 원정 동안 공격 속도 +15%", price: 90, m: { as: 0.15 } },
  power: { name: "힘의 부적", ic: "📿", desc: "이번 원정 동안 공격력 +10%", price: 100, m: { atk: 0.1 } },
  armor: { name: "철갑", ic: "🥋", desc: "이번 원정 동안 최대 체력 +15%", price: 90, m: { hp: 0.15 } },
  eye: { name: "매의 깃", ic: "🪶", desc: "이번 원정 동안 치명타 +6%", price: 90, m: { crit: 0.06 } },
  wind: { name: "바람 신발", ic: "👟", desc: "이번 원정 동안 이동 속도 +10%", price: 80, m: { spd: 0.1 } },
  coin: { name: "뽑기 코인", ic: "🪙", desc: "뽑기 코인 1개", price: 260 },
};

// ===== 등급·사거리·조각·강화 — 사용자 요청 11-11 =====
// 등급이 높을수록 기본 체력·공격력이 높다 (C 기본·미션 < B 특수·층 < A 봉냥이 < S 가챠)
const CHAR_GRADE = { musa: "C", archer: "C", spear: "C", monk: "C", gunner: "C", priest: "B", necro: "B", assassin: "B", dosa: "B", yinyang: "B", summoner: "B", berserker: "B", bong: "A", moon: "S", thunder: "S", fox: "S", reaper: "S", haerang: "A", danbi: "A", cheonrang: "SS", hwaryeon: "SS", dolsoe: "C", pojol: "C", yakcho: "C", namu: "C", geommu: "B", mudang: "B", hwarang: "B", eosa: "A", sorikun: "A", eulji: "S", haemosu: "SS", jipsin: "A" };
const GRADE_INFO = { C: { mul: 1.0, col: "#9fb0c8" }, B: { mul: 1.12, col: "#6db6ff" }, A: { mul: 1.24, col: "#c38bff" }, S: { mul: 1.3, col: "#ffb547" }, SS: { mul: 1.45, col: "#ff5a8a" } };
// 기본 공격 사거리 (근거리 = 휘두르는 거리, 원거리 = 날아가는 거리)
const CHAR_RANGE = { dolsoe: 115, pojol: 110, yakcho: 560, namu: 420, geommu: 112, mudang: 600, hwarang: 140, eosa: 120, sorikun: 600, eulji: 165, haemosu: 820, jipsin: 115, musa: 110, archer: 760, spear: 170, monk: 88, gunner: 840, priest: 520, necro: 560, assassin: 92, dosa: 620, yinyang: 560, summoner: 600, berserker: 128, moon: 122, thunder: 150, fox: 540, reaper: 160, bong_wolf: 115, bong_fox: 500, haerang: 135, danbi: 720, cheonrang: 160, hwaryeon: 560 };
const SHARD = { unlockGacha: 40, hitShards: 20, rate: 0.03, pity: 30, maxEnh: 10, enhCost: (lv) => 5 * (lv + 1),
  // 강화 성공 확률: 단계가 오를수록 낮아짐 (사용자 요청 11-11) — +1 90% … +10 4%, 실패하면 단계 유지·조각은 사라짐
  enhRate: (lv) => [0.9, 0.75, 0.6, 0.45, 0.35, 0.25, 0.18, 0.12, 0.07, 0.04][lv] || 0.04, // 11-11 더 어렵게, 실패 시 환급 없음
  // 사용자 요청 11-11: 등급별 해금 조각 수, 한 번에 얻는 조각 수 상한, 아주 낮은 확률로 조각 없이 바로 획득
  need: { C: 20, B: 25, A: 30, S: 40, SS: 50 }, per: { C: [7, 12], B: [6, 11], A: [6, 10], S: [5, 8], SS: [4, 6] }, direct: { C: 0.08, B: 0.06, A: 0.05, S: 0.03, SS: 0.02 } };
const shardNeed = (id) => SHARD.need[CHAR_GRADE[id]] || SHARD.unlockGacha;
// 펫·아티팩트 조각 강화 (사용자 요청 11-12): 중복은 조각, 조각으로 강화(+5까지), 성공 확률은 캐릭터 강화와 같은 표, 실패 시 환급 없음
const ITEM_SHARD = { dup: { 1: 6, 2: 5, 3: 4, 4: 3 }, cost: (lv) => 4 + lv * 3, max: 5 };
const PET_RAR_MUL = { 1: 1.0, 2: 1.2, 3: 1.45, 4: 1.8 };
// 사거리 적용: 근거리는 휘두르는 반경, 원거리는 투사체 수명
(function applyRanges() {
  const fix = (basic, R) => { for (const fx of basic.fx) { if (fx.t === "arc") fx.r = R; if (fx.t === "proj") fx.life = +(R / fx.spd).toFixed(2); } };
  for (const c of CHARS) {
    if (c.forms) { for (const f in c.forms) if (CHAR_RANGE["bong_" + f]) fix(c.forms[f].basic, CHAR_RANGE["bong_" + f]); }
    else if (CHAR_RANGE[c.id]) fix(c.basic, CHAR_RANGE[c.id]);
  }
})();

// 가챠 영웅 등급별 확률 (사용자 요청 11-11): 높은 등급일수록 낮게. 당첨이면 그 영웅 조각 20개 (40개면 해금)
// 11-19 출시 준비: 캐릭터 순차 공개 (출시일 LAUNCH 를 정하면 RELEASE_PLAN 순서대로 2주마다 2명씩 열림. null 이면 모두 공개 — 지금은 꺼 둠)
const LAUNCH = null; // 예: "2027-01-15"
const RELEASE_STEP_DAYS = 14, RELEASE_PER_STEP = 2;
const RELEASE_PLAN = ["thunder", "fox", "haerang", "danbi", "geommu", "mudang", "hwarang", "eosa", "sorikun", "dolsoe", "pojol", "yakcho", "namu"]; // 일반 순차 공개 순서 (앞 4명 = 첫 배너)
// 11-19 사용자: 출시 전엔 아무도 모르니 일부를 걸러 시즌 패스 영웅으로 — 시즌 n(출시 달부터 n번째 달)에 SEASON_CHARS[n-1] 이 시즌 패스로 먼저 나오고, 그다음 시즌부터 일반 뽑기에 섞임
const SEASON_CHARS = ["haemosu", "hwaryeon", "cheonrang", "eulji", "moon", "reaper"];
const PICKUP_SHARE = 0.5; // 픽업 영웅: 같은 등급이 나왔을 때 50% 확률로 그 영웅
const GACHA_GRADE_RATE = { C: 0.06, B: 0.04, A: 0.025, S: 0.008, SS: 0.0015 }; // 11-12: C·B 영웅 추가
const PITY_GRADE = { A: 0.7, S: 0.25, SS: 0.05 };

// ===== 일일·주간·월간 미션 (사용자 요청 11-11) — 기간이 시작될 때의 기록과의 차이로 셈 =====
const PERIOD_MISSIONS = {
  d: [{ id: "d_kill", stat: "kills", n: 100, coin: 1, name: "요괴 100마리" }, { id: "d_room", stat: "rooms", n: 15, coin: 1, name: "방 15개 정리" }, { id: "d_boss", stat: "bosses", n: 1, coin: 1, name: "보스 1마리" },
      { id: "d_skill", stat: "skillsUsed", n: 60, coin: 1, name: "스킬 60번" }, { id: "d_chest", stat: "chests", n: 3, coin: 1, name: "보물상자 3개" }],
  w: [{ id: "w_kill", stat: "kills", n: 1000, coin: 3, name: "요괴 1000마리" }, { id: "w_boss", stat: "bosses", n: 10, coin: 3, name: "보스 10마리" }, { id: "w_room", stat: "rooms", n: 120, coin: 3, name: "방 120개 정리" },
      { id: "w_raid", stat: "raidClear", n: 1, coin: 4, name: "보스 레이드 완료" }, { id: "w_duel", stat: "duelWins", n: 3, coin: 2, name: "1대1 3승" }],
  m: [{ id: "m_kill", stat: "kills", n: 5000, coin: 8, name: "요괴 5000마리" }, { id: "m_boss", stat: "bosses", n: 40, coin: 8, name: "보스 40마리" }, { id: "m_room", stat: "rooms", n: 600, coin: 8, name: "방 600개 정리" },
      { id: "m_story", stat: "storyClear", n: 1, coin: 10, name: "스토리 완료" }, { id: "m_chest", stat: "chests", n: 50, coin: 6, name: "보물상자 50개" }],
};
const PERIOD_NAME = { d: "일일", w: "주간", m: "월간" };

// ===================== 11-19 2.2 이야기 개편 (사용자: "스토리가 주가 되고 중간중간 전투", "스토리칸 전체 화면") =====================
// 장면마다 [말하는 사람, 대사] 줄. "나" = 지금 영웅(음성 없이 글만). 장마다 시작 → 3스테이지 → 중간보스(5) → 7스테이지 → 보스(10) → 마무리.
// 줄거리 축: 이름 없는 사냥꾼 무영 — 십 년 전 마지막 장 앞에서 저승사자에게 이름을 팔았다. 장마다 단서 하나씩.
const STORY_LINES = {
  open: [
    ["해설", "조선 팔도의 요괴를 붓으로 묶어 둔 책이 있었다. 사람들은 그 책을 요괴록이라 불렀다."],
    ["해설", "어느 그믐밤, 책을 모셔 둔 사당에 검은 바람이 불어닥쳤다."],
    ["그림자 도깨비 왕", "이까짓 종이 쪼가리에 우리가 몇백 년을 갇혀 있었단 말이냐!"],
    ["해설", "책은 다섯 갈래로 찢겼고, 풀려난 요괴들은 땅 밑 미궁으로 숨어들었다."],
    ["달래 할멈", "늦었구나. 아니, 아직 늦지 않았다. 네가 왔으니."],
    ["달래 할멈", "찢긴 장을 모두 되찾아 다시 묶어라. 그러지 못하면 요괴가 이 땅을 덮는다."],
    ["반디", "안녕! 나는 이 책의 정령 반디야. 찢긴 장이 있는 곳은 내가 느낄 수 있어."],
    ["나", "길을 알려 줘. 내가 다녀올게."],
  ],
  1: [
    ["해설", "마을 뒷산, 오래된 무덤 석굴. 돌 틈마다 도깨비불이 깜빡인다."],
    ["반디", "첫째 장의 냄새가 나. 아주 가까워."],
    ["달래 할멈", "첫째 장은 그림자 도깨비 왕이 직접 쥐고 있다. 졸개들이 석굴 곳곳을 지키고 있을 게다."],
    ["달래 할멈", "등불을 꺼뜨리지 마라. 이 아래 어둠은 사람의 이름부터 잊게 만드니."],
    ["나", "이름을 잊는다고요?"],
    ["달래 할멈", "다녀오면 알려 주마. 어서 가거라."],
  ],
  f1_s3: [
    ["해설", "석굴 벽에 누군가 칼끝으로 새긴 표식이 남아 있다."],
    ["반디", "이거, 요괴 토벌꾼의 표식이야. 오래전에도 누가 여기 내려왔었나 봐."],
    ["해설", "표식 옆에 이름이 하나 적혀 있었지만, 긁혀서 읽을 수가 없었다."],
    ["무영", "남의 이름을 들여다보는 취미라도 있나."],
    ["반디", "깜짝이야! 누, 누구세요?"],
    ["무영", "무영이라 불러라. 너희보다 먼저 이 미궁을 쫓던 사람이다."],
    ["무영", "그림자 도깨비 왕은 등불이 흔들릴 때 덤빈다. 발걸음을 멈추지 마라."],
  ],
  f1_mid: [
    ["해설", "어둠 속에서 두억시니와 외다리 도깨비가 길을 막아선다."],
    ["반디", "이 녀석들, 찢어진 첫째 장의 기운을 먹고 덩치가 커졌어!"],
    ["무영", "큰 놈일수록 발밑이 느리다. 옆으로 돌아라."],
    ["나", "하나씩 묶어 두자."],
  ],
  f1_s7: [
    ["해설", "깊이 들어갈수록 석굴은 무덤이 아니라 궁궐처럼 넓어졌다."],
    ["반디", "저기 봐. 찢긴 종이 조각이 불빛을 따라 날고 있어."],
    ["무영", "첫째 장이 우릴 부르는 거다. 그리고 그 녀석도."],
    ["해설", "멀리서 방망이로 바위를 두드리는 소리가 울렸다. 쿵, 쿵."],
  ],
  f1_boss: [
    ["해설", "석굴 맨 안쪽. 검은 도포에 깨진 갓을 쓴 도깨비 왕이 방망이를 어깨에 걸쳤다."],
    ["그림자 도깨비 왕", "책 따위로 우리를 다시 묶겠다고?"],
    ["그림자 도깨비 왕", "금 나와라 뚝딱! 아니지, 너의 목이나 나와라!"],
    ["반디", "저 방망이를 부러뜨리면 첫째 장이 풀려날 거야!"],
  ],
  f1_clear: [
    ["해설", "방망이가 부러지자 찢긴 첫째 장이 반딧불처럼 날아와 책에 붙었다."],
    ["그림자 도깨비 왕", "웃기지 마라. 책을 찢게 만든 건 내가 아니다. 진짜 주인은 저 아래에 있지."],
    ["반디", "진짜 주인? 무슨 소리야?"],
    ["무영", "신경 쓰지 마라. 요괴는 지는 순간에도 거짓말을 한다."],
    ["해설", "하지만 무영의 손은 칼자루를 꽉 쥐고 있었다."],
    ["반디", "아래층에서 찬 바람이 불어와. 둘째 장이야."],
  ],
  2: [
    ["해설", "숨을 쉬면 입김이 그대로 얼어붙는 동굴."],
    ["반디", "둘째 장은 얼음 동굴의 장군이 갑옷 속에 품었대. 동장군과 눈 귀신이 그 장군을 따른다나 봐."],
    ["무영", "이 동굴의 장군은 원래 요괴가 아니었다."],
    ["나", "그럼 사람이었어요?"],
    ["무영", "이 땅을 지키다 눈 속에서 얼어 죽은 장수다. 원한이 그를 붙잡고 있다."],
  ],
  f2_s3: [
    ["해설", "얼음 벽 속에 병사들의 그림자가 줄지어 서 있다. 모두 창을 든 채 굳어 있었다."],
    ["반디", "다들 기다리는 것 같아. 누가 데리러 오기를."],
    ["무영", "아무도 오지 않았지. 그게 이 동굴이 얼어붙은 이유다."],
  ],
  f2_mid: [
    ["해설", "흰 털을 늘어뜨린 장산범이 누군가의 목소리를 흉내 내며 부른다."],
    ["장산범", "이리 와. 이리 와 보렴."],
    ["반디", "할멈 목소리야! 할멈이 여기 왜?"],
    ["무영", "대답하지 마라. 저 소리는 사람이 아니다."],
  ],
  f2_s7: [
    ["해설", "동굴 깊은 곳, 녹슨 깃발 하나가 얼음에 꽂혀 있다."],
    ["반디", "깃발에 글자가 수놓여 있어. 이건 장군이 이끌던 부대의 이름이야."],
    ["나", "이 깃발, 가져가서 장군에게 보여 주자."],
    ["무영", "칼보다 마음이 먼저 나가는군. 나쁘지 않다."],
  ],
  f2_boss: [
    ["해설", "얼어붙은 두정갑, 고드름이 맺힌 월도. 원한을 품고 죽은 장군이 일어선다."],
    ["서리 장군", "이 땅을 지키다 얼어 죽은 나를, 너희가 기억이나 하느냐!"],
    ["나", "기억하려고 왔습니다. 당신 부대의 깃발도 가져왔어요."],
    ["서리 장군", "깃발이라고? 거짓말 마라! 칼로 증명해라!"],
  ],
  f2_clear: [
    ["해설", "얼음이 녹으며 장군의 원한도 함께 풀려 갔다."],
    ["서리 장군", "내 이름을 불러 준 이가 있었구나. 고맙다, 토벌꾼."],
    ["해설", "장군은 둘째 장을 내밀고, 병사들의 그림자와 함께 눈처럼 흩어졌다."],
    ["무영", "다음은 불이다. 쇠가 녹는 냄새가 올라오는군."],
  ],
  3: [
    ["해설", "요괴들이 무기를 벼리는 지하 대장간. 망치 소리가 심장처럼 울린다."],
    ["무영", "셋째 장은 불 도깨비 왕의 화로 속에 있다. 여기부터는 진짜다."],
    ["반디", "요괴들이 무기를 만들고 있어. 누구랑 싸우려는 거지?"],
    ["무영", "사람이겠지. 미궁 밖으로 나갈 준비를 하는 거다."],
  ],
  f3_s3: [
    ["해설", "모루 위에 반쯤 만들다 만 칼 한 자루가 놓여 있다. 손잡이에 낯익은 무늬가 새겨져 있었다."],
    ["반디", "무영, 이거 무영 칼이랑 무늬가 똑같아!"],
    ["무영", "옛날에 잃어버린 칼이다. 신경 쓰지 마라."],
    ["반디", "신경 쓰지 말라는 말, 오늘만 세 번째야."],
  ],
  f3_mid: [
    ["해설", "쇠를 먹고 자라는 불가사리가 모루를 통째로 삼키고 있다."],
    ["반디", "저 녀석이 대장간 무쇠를 다 먹으면 칼도 안 들어가!"],
    ["무영", "그 전에 끝낸다. 따라와라."],
  ],
  f3_s7: [
    ["해설", "용암이 흐르는 다리 위에서 무영이 걸음을 멈췄다."],
    ["무영", "들어 둬라. 십 년 전, 나도 너처럼 요괴록의 장을 쫓았다."],
    ["무영", "마지막 장 앞에서 나는 졌다. 그리고 저승사자와 거래를 했지."],
    ["나", "무슨 거래였어요?"],
    ["무영", "내 이름을 주고, 목숨을 받았다. 그래서 나는 이름이 없다."],
    ["반디", "그래서 석굴 표식의 이름이 긁혀 있었던 거구나."],
  ],
  f3_boss: [
    ["해설", "용암 같은 갈기, 불타는 붉은 옷. 불 도깨비 왕이 쇠못 박힌 방망이를 화로에서 꺼낸다."],
    ["불 도깨비 왕", "셋째 장? 이 불 속에 던져 넣었지. 꺼내 가 보시게!"],
    ["불 도깨비 왕", "이름 없는 사냥꾼도 왔구먼. 이번엔 무엇을 팔러 왔나?"],
    ["무영", "입 다물어라."],
  ],
  f3_clear: [
    ["해설", "화로가 식자 잿더미 속에서 타지 않은 셋째 장이 나왔다. 요괴록은 불에 타지 않는다."],
    ["반디", "셋째 장 뒷면에, 이름이 비어 있는 칸이 하나 있어."],
    ["달래 할멈", "들리느냐. 이제 늪이다. 숨을 아껴라."],
    ["달래 할멈", "그리고 무영에게 전해라. 빈칸은 언젠가 채워진다고."],
  ],
  4: [
    ["해설", "썩은 물과 독 안개가 빛마저 삼키는 늪."],
    ["반디", "넷째 장은 늪 두꺼비 왕이 통째로 삼켜 버렸어. 구미호랑 물귀신도 이 늪에 산대."],
    ["무영", "안개 속에서는 눈보다 귀를 믿어라. 그리고 아무 약속도 하지 마라."],
  ],
  f4_s3: [
    ["해설", "안개 너머로 장터 불빛이 보인다. 늪 한가운데 열린 요괴들의 장이다."],
    ["반디", "저기 봐, 사람 그림자도 있어!"],
    ["무영", "사람이 아니다. 이름을 팔아 버린 자들이지. 여기선 이름이 엽전 대신 쓰인다."],
    ["나", "무영, 당신 이름도 여기서 팔렸어요?"],
    ["무영", "아니. 내 이름은 더 비싼 곳에 있다."],
  ],
  f4_mid: [
    ["해설", "아홉 꼬리를 늘어뜨린 여인이 안개 속에서 웃는다. 구미호다."],
    ["구미호", "요괴록에 다시 갇히느니, 너의 간을 먹고 사람이 되겠다."],
    ["구미호", "아니면 거래할까? 저 사냥꾼의 이름을 찾아 주지. 대신 그 책을 내놓으렴."],
    ["무영", "들을 것 없다. 칼을 뽑아라."],
  ],
  f4_s7: [
    ["해설", "늪 바닥이 울렁이며 거대한 동전 소리가 들려온다."],
    ["반디", "저 소리, 두꺼비 왕이 엽전을 세고 있어."],
    ["무영", "녀석은 욕심이 많다. 배가 부르면 느려지지."],
    ["나", "그럼 배부르게 해 주고 끝내자."],
  ],
  f4_boss: [
    ["해설", "동전 목걸이를 주렁주렁 단 거대한 금두꺼비가 갓을 쓰고 앉아 있다."],
    ["늪 두꺼비 왕", "개굴! 그 장은 아주 맛있었지. 너도 맛 좀 볼까?"],
  ],
  f4_clear: [
    ["해설", "두꺼비 왕이 넷째 장을 토하자, 늪의 안개가 걷혔다."],
    ["반디", "마지막 장은 저승에 있어. 살아 있는 사람은 못 가는 곳인데."],
    ["무영", "요괴를 쫓는 자는 이미 반쯤 저승 사람이다. 가자."],
    ["무영", "이번엔 끝까지 간다. 이번엔 혼자가 아니니까."],
  ],
  5: [
    ["해설", "미궁의 맨 아래. 산 사람이 와서는 안 되는 곳."],
    ["해설", "저승사자가 마지막 장을 명부 사이에 끼워 두고, 요괴록의 주인을 기다리고 있다."],
    ["반디", "여기 너무 조용해. 내 빛도 작아지는 것 같아."],
    ["나", "반디, 내 등불 옆에 붙어 있어."],
  ],
  f5_s3: [
    ["해설", "끝없는 서고. 선반마다 사람들의 이름이 적힌 명부가 빼곡하다."],
    ["반디", "무영, 그럼 무영 이름도 여기 어딘가 있는 거야?"],
    ["무영", "있었겠지. 지금은 지워진 자리만 남았을 거다."],
    ["나", "지워진 자리라도 찾으면, 다시 쓸 수 있지 않을까요."],
  ],
  f5_mid: [
    ["해설", "소머리와 말머리를 한 옥졸, 붓을 든 판관, 해치 수문장이 길을 막는다."],
    ["판관", "이름이 명부에 없는 자는 이 문을 지날 수 없다."],
    ["판관", "거기, 이름 없는 사냥꾼. 너는 십 년 전에 이미 값을 치렀다. 돌아가라."],
    ["무영", "이번엔 값을 받으러 왔다."],
  ],
  f5_s7: [
    ["해설", "판관의 붓이 바닥에 떨어졌다. 붓끝에서 먹물 한 방울이 번져 글자가 되었다."],
    ["반디", "이 붓, 요괴록을 처음 쓴 붓이랑 같은 기운이야!"],
    ["나", "이 붓이라면 빈칸을 채울 수 있어요. 무영, 당신 이름을요."],
    ["무영", "먼저 저승사자부터다."],
  ],
  f5_boss: [
    ["해설", "검은 갓, 검은 도포, 붉은 오랏줄. 저승사자가 명부를 펼친다."],
    ["저승사자", "요괴록에 묶인 것들도, 그 책을 쥔 너도, 결국은 모두 내 장부에 적힌다."],
    ["저승사자", "사냥꾼. 이번엔 무엇을 내놓겠느냐. 남은 것은 목숨뿐일 텐데."],
    ["나", "이번엔 아무것도 내놓지 않아. 되찾으러 왔으니까."],
  ],
  f5_clear: [
    ["해설", "명부가 덮이고, 다섯째 장이 마지막으로 요괴록에 묶였다."],
    ["해설", "토벌꾼은 판관의 붓을 들어, 셋째 장 뒷면의 빈칸에 한 글자씩 이름을 적었다."],
    ["반디", "무영. 아니, 이제 진짜 이름으로 불러야겠네."],
    ["무영", "오래 잊고 있었다. 내 이름이 이렇게 생겼었군."],
    ["해설", "찢어졌던 책이 한 권으로 붙으며, 미궁의 요괴들이 한 줄기 빛이 되어 책 속으로 빨려 들어갔다."],
  ],
  end: [
    ["해설", "토벌꾼이 미궁을 나서자 마을에 아침 해가 떠올랐다."],
    ["달래 할멈", "잘했다. 다섯 장이 모두 돌아왔구나."],
    ["달래 할멈", "하지만 기억해라. 요괴록은 언제든 다시 찢어질 수 있는 책이란다."],
    ["반디", "그땐 또 같이 가면 되지! 그렇지?"],
    ["해설", "미궁 깊은 곳에서는 아직 책에 묶이지 않은 요괴들이 끝없이 몰려오고 있었다."],
  ],
};
// 장면 그림·제목 (새 장면 그림은 st2_*; 없으면 예전 그림)
const STORY_META = {
  1: ["st2_ch1", "첫째 마당 · 잊힌 석굴"], 2: ["st2_ch2", "둘째 마당 · 얼어붙은 동굴"], 3: ["st2_ch3", "셋째 마당 · 불타는 대장간"], 4: ["st2_ch4", "넷째 마당 · 독 안개 늪"], 5: ["st2_ch5", "다섯째 마당 · 저승 궁궐"],
  f1_s3: ["st2_f1_s3", "긁힌 이름"], f1_s7: ["st2_f1_s7", "궁궐 같은 석굴"], f2_s3: ["st2_f2_s3", "얼음 속 병사들"], f2_s7: ["st2_f2_s7", "녹슨 깃발"], f3_s3: ["st2_f3_s3", "낯익은 칼"],
  f3_s7: ["st2_f3_s7", "무영의 거래"], f4_s3: ["st2_f4_s3", "이름 장터"], f4_s7: ["st2_f4_s7", "엽전 세는 소리"], f5_s3: ["st2_f5_s3", "명부의 서고"], f5_s7: ["st2_f5_s7", "판관의 붓"],
  open: ["st2_open", "찢어진 요괴록"], end: ["st2_end", "다시 묶인 요괴록"],
  f1_mid: ["st2_f1_mid", "석굴 한복판"], f1_boss: ["st2_f1_boss", "그림자 도깨비 왕"], f1_clear: ["st2_f1_clear", "첫째 장을 되찾다"],
  f2_mid: ["st2_f2_mid", "얼음 골짜기"], f2_boss: ["st2_f2_boss", "서리 장군"], f2_clear: ["st2_f2_clear", "장군의 이름"],
  f3_mid: ["st2_f3_mid", "쇠 먹는 짐승"], f3_boss: ["st2_f3_boss", "불 도깨비 왕"], f3_clear: ["st2_f3_clear", "타지 않는 장"],
  f4_mid: ["st2_f4_mid", "안개 속의 미소"], f4_boss: ["st2_f4_boss", "늪 두꺼비 왕"], f4_clear: ["st2_f4_clear", "걷히는 안개"],
  f5_mid: ["st2_f5_mid", "저승의 문지기들"], f5_boss: ["st2_f5_boss", "저승사자"], f5_clear: ["st2_f5_clear", "다섯째 장"],
};
// 말하는 사람 → 얼굴 그림 키 (없으면 이름만)
const STORY_FACE = { "달래 할멈": "face_halmi", "반디": "face_bandi", "무영": "face_muyeong", "판관": "face_pangwan", "그림자 도깨비 왕": "b_boss", "서리 장군": "b_boss3", "불 도깨비 왕": "b_boss2", "늪 두꺼비 왕": "b_boss4", "저승사자": "b_boss5", "구미호": "f_gumiho", "장산범": "face_jangsanbeom" };
for (const [k, L] of Object.entries(STORY_LINES)) {
  const m = STORY_META[k], s = STORY[k] || (STORY[k] = { img: m ? m[0] : "sc_open", title: m ? m[1] : k, text: "" });
  if (m) { if (!s.imgOld && s.img !== m[0]) s.imgOld = s.img; s.img = m[0]; s.title = m[1]; }
  s.lines = L; s.text = L.map(([w, t]) => (w === "해설" ? t : `${w}: "${t}"`)).join("\n");
}
