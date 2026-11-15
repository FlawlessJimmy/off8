// OFF8 홈 — 스크롤, 첫 화면 실시간 대시보드, 엑셀→대시보드 흐름, 모듈 조립, AI 상담, 샘플 대시보드
import { kpi, line, hbars, donut, table, feed, steps, card, pill, animateIn, fmt, SAMPLES, board } from './dash.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap;
const hasGsap = !!gsap;
if (hasGsap) gsap.registerPlugin(ScrollTrigger, window.Flip);
const I = '#6336E8', I2 = '#A18CF5', I3 = '#DAD2FF', INK = '#101010';

// Beam 시리즈는 따로 불러오고, 실패해도 페이지는 그대로 동작합니다
let isl = null;
const islReady = import('./islands.js?v=1').then((m) => (isl = m)).catch((e) => { console.warn('Beam 효과를 불러오지 못했습니다', e); return null; });

// ---------- 부드러운 스크롤 ----------
let lenis = null;
if (window.Lenis && !reduced) {
  lenis = new Lenis({ lerp: 0.09 });
  window.lenis = lenis;
  if (hasGsap) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const el = id.length > 1 && document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  if (lenis) lenis.scrollTo(el, { offset: id === '#top' ? 0 : -70, duration: 1.2 });
  else el.scrollIntoView({ behavior: 'smooth' });
});

// ---------- 상단 메뉴 ----------
const nav = $('#nav');
const menuBtn = $('.menu-btn');
const navLinks = $('#navLinks');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
onScroll();
addEventListener('scroll', onScroll, { passive: true });
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// ---------- 나타나기 · 숫자 올라가기 ----------
function countUp(el) {
  const to = +el.dataset.n;
  if (reduced || !hasGsap) { el.textContent = fmt(to); return; }
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(o.v)) });
}
const io = new IntersectionObserver((ents) => ents.forEach((en) => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  en.target.querySelectorAll('[data-n]').forEach(countUp);
  io.unobserve(en.target);
}), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
$$('.reveal, .reveal-line').forEach((el) => io.observe(el));

document.addEventListener('pointermove', (e) => {
  const el = e.target.closest && e.target.closest('.spot');
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}, { passive: true });

// 화면에 처음 보일 때 한 번 실행
const once = (el, fn, threshold = 0.25) => {
  const o = new IntersectionObserver((ents) => { if (ents.some((x) => x.isIntersecting)) { o.disconnect(); fn(); } }, { threshold });
  o.observe(el);
};

// ---------- 첫 화면: 실시간으로 움직이는 대시보드 ----------
const heroApp = $('#heroApp');
const FEED = [
  ['쿠팡 발주서 61건 → 입고 예정에 반영', 'ok'],
  ['공급사 A 주문서 · 같은 상품 12개 자동 연결', 'ai'],
  ['필터 4입 재고 12개 · 안전재고 미만 알림', 'warn'],
  ['네이버 정산 장부 대조 완료 · 차이 0원', 'ok'],
  ['톡톡 문의 “배송 언제 와요?” AI 답변 완료', 'ai'],
  ['일간 리포트 카카오톡 발송', 'ok'],
  ['3PL 발주서 양식으로 24건 변환', 'ok'],
];
heroApp.innerHTML = `
  <div class="hero-kpis">
    ${kpi({ label: '오늘 매출', value: 348.2, unit: '만원', f: 'dec', delta: '▲ 12.4%', hero: true })}
    ${kpi({ label: '신규 주문', value: 214, unit: '건', delta: '▲ 31건' })}
    ${kpi({ label: '재고 경고', value: 6, unit: '개', delta: '안전재고 미만', tone: 'down' })}
    ${kpi({ label: 'AI 1차 응대', value: 94, unit: '%', f: 'pct', delta: '▲ 6%p' })}
  </div>
  <div class="hero-row">
    ${card('매출 흐름', line({ series: [{ name: '쿠팡', data: [2.1, 2.4, 2.2, 2.9, 3.1, 2.8, 3.4, 3.2, 3.6, 3.3, 3.9, 4.1, 3.8, 4.4], color: I }, { name: '네이버', data: [1.2, 1.1, 1.5, 1.4, 1.3, 1.8, 1.7, 1.6, 2.0, 1.9, 1.8, 2.2, 2.4, 2.3], color: INK }], labels: ['11/2', '11/5', '11/8', '11/11', '11/14'] }), { tag: '최근 14일 · 백만원' })}
    ${card('자동화 기록', feed(FEED.slice(0, 5).map(([text, t], i) => ({ text, t, time: i ? `${i * 3}분 전` : '방금' }))), { tag: '오늘 128건' })}
  </div>
  <div class="hero-row hero-row-b">
    ${card('발주·입고', table(['품목', '수량', '입고 예정', '상태'], [['자동급수기 2L', '240', '11/18', pill('run', '입고 예정')], ['필터 4입', '600', '11/17', pill('wait')], ['세라믹 볼 S', '180', '11/16', pill('ok', '입고 완료')]]), { tag: '쿠팡 · 공급사 통합' })}
    ${card('상담 처리', donut([{ name: 'AI 해결', v: 78, color: I }, { name: '담당자', v: 22, color: I3 }], { center: '<b>78%</b>', sub: 'AI 해결' }))}
  </div>`;
heroApp.querySelectorAll('.w-table .w-tr').forEach((r) => r.style.setProperty('--cols', 4));
// 기록 목록 높이를 고정해, 새 줄이 들어와도 창 크기가 변하지 않게 합니다
const heroFeed = heroApp.querySelector('.w-feed');
function fixFeed() { heroFeed.style.height = ''; heroFeed.style.height = heroFeed.offsetHeight + 'px'; heroFeed.classList.add('is-fixed'); }
let fi = 5;
function heroLive() {
  const ul = heroApp.querySelector('.w-feed');
  const [text, t] = FEED[fi++ % FEED.length];
  const li = document.createElement('li');
  li.innerHTML = `<i class="w-feed-ic is-${t}"></i><span>${text}</span><time>방금</time>`;
  ul.querySelectorAll('time').forEach((tm, i) => (tm.textContent = `${(i + 1) * 3}분 전`));
  ul.prepend(li);
  const last = ul.lastElementChild;
  if (hasGsap) {
    // 기존 줄은 한 칸 아래로 밀리고, 맨 아래 줄은 창 밖으로 사라집니다 (창 크기는 그대로)
    const rowH = li.offsetHeight;
    gsap.from([...ul.children].slice(1), { y: -rowH, duration: 0.6, ease: 'power3.out' });
    gsap.from(li, { opacity: 0, x: -12, duration: 0.6, ease: 'power3.out' });
    gsap.to(last, { opacity: 0, duration: 0.3, onComplete: () => last.remove() });
  } else last.remove();
  const [sales, orders] = heroApp.querySelectorAll('.hero-kpis [data-count]');
  bump(sales, +(0.9 + Math.random() * 4.2).toFixed(1));
  bump(orders, 1 + Math.floor(Math.random() * 3));
}
function bump(el, add) {
  const from = +el.dataset.count, to = +(from + add).toFixed(1), f = el.dataset.f;
  el.dataset.count = to;
  if (!hasGsap) { el.textContent = fmt(to, f); return; }
  const o = { v: from };
  gsap.to(o, { v: to, duration: 0.9, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v, f)) });
  gsap.fromTo(el, { y: -3 }, { y: 0, duration: 0.5, ease: 'power2.out' });
}
// 등장: 흩어진 엑셀 시트가 날아와 대시보드의 각 칸이 됩니다
const SHEETS = ['매출_쿠팡.xlsx', '주문내역.xlsx', '재고현황.xlsx', '톡톡_문의.csv', '채널별_매출.xlsx', '자동화_로그.xlsx', '발주서_1114.xlsx', '상담_집계.xlsx'];
const SCATTER = [[-0.08, 0.02, -14], [0.34, -0.08, 9], [0.72, 0.0, -6], [0.86, 0.36, 12], [-0.12, 0.42, 8], [0.62, 0.62, -10], [0.02, 0.8, -7], [0.44, 0.9, 13]];
function heroAssemble() {
  const vis = $('.hero-visual');
  const tiles = [...heroApp.querySelectorAll('.hero-kpis .w-kpi, .hero-row .w-card')];
  const vb = vis.getBoundingClientRect();
  const sheets = tiles.map((t, i) => {
    const el = document.createElement('div');
    el.className = 'hs';
    el.innerHTML = `<b>${SHEETS[i % SHEETS.length]}</b><i></i>`;
    vis.appendChild(el);
    const [sx, sy, rot] = SCATTER[i % SCATTER.length];
    gsap.set(el, { left: sx * vb.width, top: sy * vb.height, rotation: rot, opacity: 0, scale: 0.6 });
    return el;
  });
  gsap.set(tiles, { opacity: 0 });
  const tl = gsap.timeline({ delay: 0.55, onComplete: () => { sheets.forEach((s) => s.remove()); fixFeed(); } });
  // 1) 흩어진 엑셀 파일이 하나씩 나타납니다
  tl.to(sheets, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.07 }, 0);
  // 2) 각자 대시보드 칸 자리로 날아가 그 크기로 펴집니다
  tiles.forEach((t, i) => {
    tl.to(sheets[i], {
      left: () => t.getBoundingClientRect().left - vis.getBoundingClientRect().left,
      top: () => t.getBoundingClientRect().top - vis.getBoundingClientRect().top,
      width: () => t.offsetWidth, height: () => t.offsetHeight, rotation: 0,
      duration: 0.85, ease: 'power3.inOut',
    }, 0.9 + i * 0.07);
    // 3) 시트가 사라지며 진짜 칸이 드러납니다
    tl.to(sheets[i], { opacity: 0, duration: 0.3 }, 1.7 + i * 0.07)
      .to(t, { opacity: 1, duration: 0.35 }, 1.62 + i * 0.07);
  });
  tl.add(() => animateIn(heroApp, { skipCards: true }), 1.75);
}
requestAnimationFrame(() => {
  if (hasGsap && !reduced) heroAssemble();
  else { animateIn(heroApp); fixFeed(); }
  if (!reduced) setTimeout(() => setInterval(() => { if (!document.hidden && heroApp.getBoundingClientRect().bottom > 0) heroLive(); }, 3200), 3500);
});
addEventListener('resize', () => heroFeed.classList.contains('is-fixed') && fixFeed());

// ---------- 작동 방식: 엑셀 파일이 대시보드가 되기까지 ----------
const FILES = [
  { n: '쿠팡_발주서_1114.xlsx', h: ['상품명', '수량', '입고일'], tag: ['상품', '수량', '날짜'], r: [['[펫]자동급수기 2리터 WH', '240', '11/18'], ['실리콘매트_L', '120', '11/19'], ['필터4입_정품', '600', '11/17']], at: [4, 8, -6] },
  { n: '공급사A_주문서.xlsx', h: ['품목', '주문수량', '단가'], tag: ['상품', '수량', '금액'], r: [['자동 급수기 2L 화이트', '300', '12,400'], ['필터(4개입)', '600', '2,100'], ['실리콘 매트 L', '150', '6,800']], at: [52, 4, 5] },
  { n: '3PL_재고현황.xlsx', h: ['SKU', '재고', '위치'], tag: ['상품', '재고', '창고'], r: [['PW-2L-WH', '18', 'A-03'], ['MAT-L', '26', 'B-11'], ['FT-4P', '12', 'A-07']], at: [10, 46, 4] },
  { n: '네이버_정산_11월.xlsx', h: ['주문번호', '결제금액', '수수료'], tag: ['주문', '금액', '수수료'], r: [['2026111403821', '38,900', '2,140'], ['2026111403822', '12,400', '682'], ['2026111403830', '25,800', '1,419']], at: [56, 40, -4] },
  { n: '톡톡_문의내역.csv', csv: 1, h: ['고객', '문의', '시간'], tag: ['고객', '문의', '시간'], r: [['김○진', '배송 언제 와요?', '10:42'], ['최○우', '필터에서 물이…', '11:05'], ['정○희', '색상 교환', '11:20']], at: [30, 70, 7] },
];
const flStage = $('#flowStage');
// 위: 대시보드 업로드 자리 · 아래: 폴더 (서류가 폴더에서 위로 올라갑니다)
flStage.insertAdjacentHTML('afterbegin', `<div class="fl-zone" id="flZone"><span><svg class="logo-svg"><use href="#off8-logo"/></svg>대시보드로 올리기</span></div>
  <div class="fl-folder" id="flFolder"><i class="ff-back"></i><i class="ff-paper p2"></i><i class="ff-paper"></i></div>`);
$('#flMatch').insertAdjacentHTML('beforebegin', `<div class="fl-front" id="flFront"><i class="ff-front"><svg class="logo-svg"><use href="#off8-logo"/></svg></i>
  <span class="ff-label"><b id="flCount">0</b> / 5 · OFF8로 올리는 중</span><span class="ff-bar"><i id="flBar"></i></span></div>`);
const LAND = [[4, 7, -6], [53, 5, 5], [8, 27, 4], [55, 26, -4], [30, 15, 7]];
$('#flFiles').innerHTML = FILES.map((f, i) => `<div class="xf${f.csv ? ' is-csv' : ''}" style="left:29.5%;top:60%;--rot:${LAND[i][2]}deg;z-index:${i + 1}">
  <div class="xf-h">${f.n}<small>${f.r.length + 41}행</small></div>
  <div class="xf-g">${f.h.map((h, k) => `<span class="hd">${h}<em>${f.tag[k]}</em></span>`).join('')}${f.r.flat().map((c) => `<span>${c}</span>`).join('')}</div>
  <i class="xf-scan"></i></div>`).join('');
const PAIRS = [['[펫]자동급수기 2리터 WH', '자동 급수기 2L 화이트', '98%'], ['실리콘매트_L', '실리콘 매트 L', '96%'], ['필터4입_정품', '필터(4개입)', '91%'], ['세라믹볼 S 아이보리', '새 상품으로 등록', 'new']];
$('#flMatch').innerHTML = `<div class="fl-col left"><h5>쿠팡 발주서</h5>${PAIRS.map((p) => `<div class="fl-item">${p[0]}</div>`).join('')}</div>
  <div class="fl-col right"><h5>공급사 주문서 · 상품 목록</h5>${PAIRS.map((p) => `<div class="fl-item">${p[1]}</div>`).join('')}</div>
  <svg class="fl-lines"></svg>`;
$('#flDash').innerHTML = `
  ${kpi({ label: '오늘 매출', value: 3482000, unit: '원', hero: true })}
  ${kpi({ label: '입고 예정', value: 1140, unit: '개' })}
  ${kpi({ label: '재고 경고', value: 3, unit: '개', delta: '알림 발송', tone: 'down' })}
  ${kpi({ label: '정산 차이', value: 0, unit: '원', delta: '대조 완료' })}
  ${card('채널별 매출', line({ series: [{ name: '쿠팡', data: [2.2, 2.9, 2.8, 3.4, 3.6, 3.9, 4.4], color: I }, { name: '네이버', data: [1.1, 1.4, 1.8, 1.6, 2.0, 1.8, 2.3], color: INK }], labels: ['11/8', '11/10', '11/12', '11/14'], legend: false }), { cls: 'fl-t' })}
  ${card('재고', hbars([{ name: '자동급수기 2L', v: 18, safe: 40, max: 100 }, { name: '실리콘 매트 L', v: 26, safe: 30, max: 100 }, { name: '필터 4입', v: 12, safe: 50, max: 100 }], { unit: '개', warn: true }), { cls: 'fl-t' })}
  ${card('자동화 기록', feed([{ text: '파일 5개 · 양식 자동 인식', time: '방금' }, { text: '같은 상품 3개 자동 연결 · 새 상품 1개 등록', t: 'ai', time: '방금' }, { text: '재고 경고 3건 카카오톡 알림', t: 'warn', time: '방금' }]), { cls: 'fl-w' })}`;
function drawMatchLines() {
  const wrap = $('#flMatch');
  const svg = wrap.querySelector('.fl-lines');
  const L = $$('.fl-col.left .fl-item', wrap), R = $$('.fl-col.right .fl-item', wrap);
  const box = wrap.getBoundingClientRect();
  if (!box.width) return;
  // 크기가 바뀌어도 같은 배지를 다시 씁니다 (움직임 연결이 끊기지 않게)
  let badges = $$('.fl-badge', wrap);
  if (!badges.length) badges = PAIRS.map((p) => {
    const b = document.createElement('span');
    b.className = 'fl-badge' + (p[2] === 'new' ? ' is-new' : '');
    b.textContent = p[2] === 'new' ? '새 상품' : p[2];
    wrap.appendChild(b);
    return b;
  });
  const sc = box.width / wrap.offsetWidth || 1;
  svg.innerHTML = L.map((l, i) => {
    const a = l.getBoundingClientRect(), b = R[i].getBoundingClientRect();
    const x1 = (a.right - box.left) / sc, y1 = (a.top + a.height / 2 - box.top) / sc, x2 = (b.left - box.left) / sc, y2 = (b.top + b.height / 2 - box.top) / sc;
    const mx = (x1 + x2) / 2;
    badges[i].style.left = mx + 'px';
    badges[i].style.top = (y1 + y2) / 2 + 'px';
    return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" ${PAIRS[i][2] === 'new' ? 'stroke-dasharray="4 5" style="stroke:#e39b1b"' : ''}/>`;
  }).join('');
}
drawMatchLines();
const flSteps = $$('#flowSteps li');
let flStep = 0;
const setFlStep = (i) => { if (i === flStep) return; flStep = i; flSteps.forEach((li, k) => li.classList.toggle('is-on', k === i)); };
if (hasGsap && !reduced) {
  const xf = $$('.xf', flStage);
  gsap.set(xf, { scale: 0.5, rotation: 0, transformOrigin: '50% 100%' });
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
  const O = 1.9; // 업로드 장면 길이만큼 뒤 장면을 미룹니다
  // 0) 올리기: 폴더가 열리고 서류가 한 장씩 대시보드로 올라갑니다
  const cnt = $('#flCount');
  tl.to('.ff-front', { rotationX: -32, duration: 0.35, ease: 'power2.out' }, 0.05)
    .to('#flBar', { width: '100%', duration: 1.25, ease: 'none', onUpdate() { cnt.textContent = Math.min(5, Math.floor(this.progress() * 5 + 0.15)); } }, 0.25);
  xf.forEach((el, i) => {
    const t0 = 0.2 + i * 0.22;
    tl.to(el, { top: `${LAND[i][1]}%`, duration: 0.75, ease: 'power3.out' }, t0)
      .to(el, { left: `${LAND[i][0]}%`, duration: 0.75, ease: 'sine.inOut' }, t0)
      .to(el, { scale: 1, rotation: LAND[i][2], duration: 0.75, ease: 'back.out(1.3)' }, t0)
      .fromTo('#flZone', { boxShadow: '0 0 0 0 rgba(161,140,245,0)' }, { boxShadow: '0 0 0 4px rgba(161,140,245,.18)', duration: 0.12, yoyo: true, repeat: 1, immediateRender: false }, t0 + 0.55);
  });
  tl.to('.ff-front', { rotationX: 0, duration: 0.3 }, 1.45)
    .to(['#flFolder', '#flFront'], { y: 40, opacity: 0, duration: 0.45, ease: 'power2.in' }, 1.6)
  // 1) 읽기: 파일이 가지런히 모이고, 머리글이 인식됩니다
    .to('#flZone', { opacity: 0, scale: 1.03, duration: 0.5 }, O + 0.2)
    .to(xf, { left: (i) => `${6 + (i % 2) * 48}%`, top: (i) => `${5 + Math.floor(i / 2) * 31}%`, rotation: 0, duration: 1 }, O + 0.3)
    .to($$('.xf-scan', flStage), { opacity: 1, top: '75%', duration: 0.8, stagger: 0.06 }, O + 1.2)
    .to($$('.xf-g .hd em', flStage), { opacity: 1, duration: 0.25, stagger: 0.03 }, O + 1.4)
    .to($$('.xf-scan', flStage), { opacity: 0, duration: 0.2 }, O + 2.1)
  // 2) 맞추기: 다르게 적은 같은 상품을 연결합니다
    .to(xf, { scale: 0.6, opacity: 0, y: -20, duration: 0.6, stagger: 0.04 }, O + 2.4)
    .to('#flMatch', { opacity: 1, duration: 0.5 }, O + 2.8)
    .from($$('.fl-item', flStage), { x: (i) => (i < 4 ? -20 : 20), opacity: 0, duration: 0.5, stagger: 0.05 }, O + 2.8)
    .fromTo('#flMatch .fl-lines', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7 }, O + 3.2)
    .from('#flMatch .fl-badge', { scale: 0, opacity: 0, duration: 0.3, stagger: 0.08 }, O + 3.6)
  // 3) 보기: 한 장의 대시보드로
    .to('#flMatch', { opacity: 0, scale: 0.94, duration: 0.5 }, O + 4.6)
    .to('#flDash', { opacity: 1, duration: 0.3 }, O + 4.9)
    .from($$('#flDash > *'), { y: 40, scale: 0.85, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, O + 4.9)
    .to({}, { duration: 0.6 });
  let st = null;
  st = ScrollTrigger.create({
    trigger: '#flow', pin: '.flow-pin', start: 'top top', end: () => '+=' + Math.round(innerHeight * 3.4), scrub: true,
    onRefresh: () => { drawMatchLines(); },
    onUpdate: (s) => {
      tl.progress(s.progress);
      const t = tl.time();
      setFlStep(t < 2.1 ? 0 : t < 4.3 ? 1 : t < 6.5 ? 2 : 3);
    },
  });
  // 줄 위치는 글꼴이 다 그려진 뒤 다시 잽니다
  document.fonts?.ready.then(() => { drawMatchLines(); ScrollTrigger.refresh(); });
} else {
  $('#flFiles').style.display = 'none';
  ['#flZone', '#flFolder', '#flFront'].forEach((s) => ($(s).style.display = 'none'));
  $('#flDash').style.opacity = 1;
  setFlStep(3);
}

// ---------- 모듈 조립 ----------
const COMMON = [
  { id: 'excel', name: '엑셀 자동화', d: '여러 파일을 한 번에 올리고 양식을 자동 인식, 기존 양식 그대로 내보내기' },
  { id: 'match', name: '자동 매칭·학습', d: '다르게 적은 같은 상품을 연결하고 확정 결과를 다음부터 적용' },
  { id: 'report', name: '이력·리포트·알림', d: '반영 전 미리보기와 되돌리기, 일간·월간 리포트, 카카오톡·노션 알림' },
];
const MODULES = [
  { id: 'sales', name: '매출·순이익', d: '채널별 매출 집계, 원가·수수료 반영 순이익, 경쟁사 가격 추적', price: 15000 },
  { id: 'ai', name: 'AI 고객상담', d: '네이버 톡톡·자사몰 상담 통합, AI 1차 응대, 담당자 연결, AS 단계 관리', price: 29000 },
  { id: 'order', name: '발주·입고', d: '쿠팡 발주서와 공급사 주문서 통합, 3PL 발주서 변환, 입고 일정', price: 15000 },
  { id: 'stock', name: '재고·출고', d: '선입선출 재고, 출고 시 자동 차감, 실사 보정, 물류 이동 추적', price: 15000 },
  { id: 'settle', name: '정산·장부', d: '날짜별 환율·요율, 수익 분배·급여 계산, 장부 대조, 직원 모바일 입력', price: 15000 },
];
const WIDGET = {
  excel: () => card('엑셀 자동화', `<div class="w-files"><span class="w-file">쿠팡_발주서</span><span class="w-file">공급사A_주문서</span><span class="w-file">3PL_재고</span><span class="w-file is-csv">톡톡_문의</span></div><div class="w-progress"><i></i></div><p style="margin:8px 0 0;font-size:12px;color:#62626d">파일 5개 · 양식 자동 인식 완료</p>`, { span: 2, tag: '공통', cls: 'is-common' }),
  report: () => card('이력·알림', feed([{ text: '일간 리포트 카카오톡 발송', time: '08:30' }, { text: '재고 경고 3건 알림', t: 'warn', time: '09:12' }, { text: '변경 이력 저장 · 되돌리기 가능', t: 'ai', time: '10:05' }]), { span: 2, tag: '공통', cls: 'is-common' }),
  sales: () => card('매출·순이익', line({ series: [{ name: '매출', data: [31, 33, 36, 35, 41, 44.6, 48.2], color: I }, { name: '순이익', data: [6.1, 6.8, 7.4, 7.1, 8.6, 9.2, 10.4], color: INK }], labels: ['5월', '7월', '9월', '11월'] }), { span: 4, tag: '백만원' }),
  ai: () => card('AI 고객상담', `<ul class="w-chats"><li><span class="av">김</span><p>배송 언제 와요?</p>${pill('ok', 'AI')}</li><li><span class="av">최</span><p>필터에서 물이 새요</p>${pill('run', '연결')}</li><li><span class="av">정</span><p>색상 교환 되나요?</p>${pill('ok', 'AI')}</li></ul><p style="margin:10px 0 0;font-size:12px;color:#62626d">AI 1차 해결 <b style="color:${I}">78%</b> · 첫 응답 9초</p>`, { span: 2 }),
  order: () => card('발주·입고', table(['품목', '수량', '입고', '상태'], [['자동급수기 2L', '240', '11/18', pill('run', '예정')], ['필터 4입', '600', '11/17', pill('wait', '확인')], ['세라믹 볼 S', '180', '11/16', pill('ok')]]), { span: 3 }),
  stock: () => card('재고·출고', hbars([{ name: '자동급수기 2L', v: 18, safe: 40, max: 120 }, { name: '실리콘 매트 L', v: 26, safe: 30, max: 120 }, { name: '스테인리스 볼', v: 92, safe: 30, max: 120 }, { name: '필터 4입', v: 12, safe: 50, max: 120 }], { unit: '개', warn: true }), { span: 3, tag: '세로선 = 안전재고' }),
  settle: () => card('정산·장부 대조', table(['거래처', '장부', '입금', '상태'], [['광저우 ○○무역', '3,820,000', '3,820,000', pill('ok', '일치')], ['이우 ○○상행', '1,140,000', '1,096,000', pill('bad', '차이')], ['선전 ○○전자', '2,560,000', '2,560,000', pill('ok', '일치')]]), { span: 6, tag: '날짜별 환율 반영' }),
};
WIDGET.match = () => card('자동 매칭·학습', `<div style="display:grid;grid-template-columns:88px minmax(0,1fr);gap:12px;align-items:center">${donut([{ name: '자동', v: 78, color: I }, { name: '확인', v: 15, color: I2 }, { name: '신규', v: 7, color: I3 }], { center: '<b style="font-size:16px">78%</b>' }).replace('class="w-donut"', 'class="w-donut" style="width:88px;margin:0"')}</div>`, { span: 2, tag: '공통', cls: 'is-common' });

const on = new Set(['sales', 'order']);
const bb = $('#buildBoard');
bb.innerHTML = `<div class="cb-top"><svg class="logo-svg"><use href="#off8-logo"/></svg><span>우리 회사 대시보드 · 미리보기</span></div>` +
  [...COMMON, ...MODULES].map((m) => WIDGET[m.id]().replace('<section class="w-card', `<section data-w="${m.id}" class="w-card`)).join('');
bb.style.gridAutoFlow = 'row dense';
const wEl = (id) => bb.querySelector(`[data-w="${id}"]`);
// 켜진 모듈에 맞춰 칸 너비를 다시 나눠 빈자리가 생기지 않게 합니다
function layoutBoard() {
  MODULES.forEach((m) => { wEl(m.id).style.display = on.has(m.id) ? '' : 'none'; });
  wEl('sales').style.setProperty('--span', on.has('ai') ? 4 : 6);
  wEl('ai').style.setProperty('--span', on.has('sales') ? 2 : 6);
  const both = on.has('order') && on.has('stock');
  wEl('order').style.setProperty('--span', both ? 3 : 6);
  wEl('stock').style.setProperty('--span', both ? 3 : 6);
}
layoutBoard();

const btn = (m, fixed) => `<li><button type="button" class="bp-item${fixed ? ' is-fixed' : ''}" data-id="${m.id}" aria-pressed="${fixed || on.has(m.id)}" ${fixed ? 'aria-disabled="true"' : ''}><b>${m.name}</b><span class="sw"></span><small>${m.d}${m.price ? ` · 월 ${fmt(m.price)}원` : ''}</small></button></li>`;
$('#commonList').innerHTML = COMMON.map((m) => btn(m, true)).join('');
$('#moduleList').innerHTML = MODULES.map((m) => btn(m)).join('');

let priceShown = 69000;
function updatePrice() {
  const sel = MODULES.filter((m) => on.has(m.id));
  const raw = 39000 + sel.reduce((a, m) => a + m.price, 0);
  const pack = raw > 99000;
  const price = pack ? 99000 : raw;
  $('#priceNote').textContent = pack
    ? `전체 패키지 99,000원 적용 · 따로 고르면 ${fmt(raw)}원`
    : sel.length ? `기본료 39,000원 + 선택 모듈 ${sel.length}개` : '기본료 39,000원 · 공통 기능 3종';
  const el = $('#priceNum');
  if (!hasGsap) { el.textContent = fmt(price); return; }
  const o = { v: priceShown };
  priceShown = price;
  gsap.to(o, { v: price, duration: 0.6, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) });
}
updatePrice();
$('#moduleList').addEventListener('click', (e) => {
  const b = e.target.closest('.bp-item');
  if (!b) return;
  const id = b.dataset.id;
  const turnOn = !on.has(id);
  turnOn ? on.add(id) : on.delete(id);
  b.setAttribute('aria-pressed', turnOn);
  const w = wEl(id);
  if (hasGsap && window.Flip && !reduced) {
    const state = Flip.getState(bb.querySelectorAll('.w-card'));
    layoutBoard();
    Flip.from(state, {
      duration: 0.65, ease: 'power3.inOut', absolute: true, nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.88, duration: 0.35 }),
    });
    if (turnOn) animateIn(w, { delay: 0.25, quick: true });
  } else layoutBoard();
  updatePrice();
});
once(bb, () => animateIn(bb));

// ---------- AI 상담: 채팅 ----------
const chatLog = $('#chatLog');
const SCRIPTS = {
  ship: {
    q: '어제 주문한 자동급수기 언제 받을 수 있나요?',
    think: [['listening', '문의 읽는 중'], ['searching', '주문 찾는 중']],
    a: '주문번호 1114-0382를 확인했습니다. 오늘 오후 출고되어 내일(11/16) 도착 예정입니다.',
    card: `<div class="msg-card"><div class="row"><span>상품</span><b>자동급수기 2L 화이트</b></div><div class="row"><span>상태</span><b>${pill('run', '출고 준비')}</b></div><div class="row"><span>송장</span><b>6091••••42</b></div>${steps(['주문', '출고', '배송 중', '도착'], 1)}</div>`,
  },
  as: {
    q: '급수기 필터 쪽에서 물이 새는 것 같아요.',
    think: [['listening', '문의 읽는 중'], ['solving', 'AS 기준 확인 중'], ['connecting', '담당자 연결 중']],
    a: '누수는 사진 확인이 필요해 AS 담당자에게 연결했습니다. 접수 번호는 AS-0412입니다.',
    card: `<div class="msg-card"><div class="row"><span>접수</span><b>AS-0412 · 필터 누수</b></div>${steps(['접수', '확인 중', '처리 중', '완료'], 1)}<div class="hand">● 담당자 이○준 · 평균 12분 안에 답변</div></div>`,
  },
  swap: {
    q: '화이트로 샀는데 그레이로 교환되나요?',
    think: [['listening', '문의 읽는 중'], ['searching', '재고 확인 중'], ['composing', '답변 쓰는 중']],
    a: '그레이 재고가 42개 있어 교환할 수 있습니다. 미개봉 상태라면 왕복 배송비 6,000원으로 바로 접수합니다.',
    card: `<div class="msg-card"><div class="row"><span>교환 상품</span><b>자동급수기 2L 그레이</b></div><div class="row"><span>재고</span><b>42개 ${pill('ok', '교환 가능')}</b></div><div class="row"><span>배송비</span><b>6,000원</b></div></div>`,
  },
  other: {
    think: [['listening', '문의 읽는 중'], ['solving', '답변 기준 찾는 중'], ['connecting', '담당자 연결 중']],
    a: '확인이 필요한 문의라 담당자에게 내용을 넘겼습니다. 평균 12분 안에 답변드립니다.',
    card: '',
  },
};
const pickScript = (t) => /배송|언제|도착|출고/.test(t) ? 'ship' : /새|누수|고장|AS|불량|수리|안 ?돼/.test(t) ? 'as' : /교환|반품|색|환불/.test(t) ? 'swap' : 'other';
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 120) : ms));
let chatBusy = false;
const scrollChat = () => { chatLog.scrollTop = chatLog.scrollHeight; };
function addMsg(cls, html) {
  const m = document.createElement('div');
  m.className = 'msg ' + cls;
  m.innerHTML = html;
  chatLog.appendChild(m);
  if (hasGsap && !reduced) gsap.from(m, { y: 10, opacity: 0, duration: 0.45, ease: 'power3.out' });
  scrollChat();
  return m;
}
async function runChat(key, text) {
  if (chatBusy) return;
  chatBusy = true;
  $$('#chatQuick button').forEach((b) => (b.disabled = true));
  const s = SCRIPTS[key];
  addMsg('me', text || s.q);
  await wait(500);
  const th = addMsg('ai think', `<span class="orb-host"></span><span class="tl"></span>`);
  await islReady;
  const o = isl ? isl.orb(th.querySelector('.orb-host'), { state: s.think[0][0], size: 20 }) : null;
  for (const [state, label] of s.think) {
    o?.set({ state });
    th.querySelector('.tl').textContent = label + '…';
    await wait(1100);
  }
  th.remove();
  const m = addMsg('ai', '<span class="tx"></span>');
  const tx = m.querySelector('.tx');
  for (let i = 1; i <= s.a.length; i++) { tx.textContent = s.a.slice(0, i); if (i % 3 === 0) { scrollChat(); await wait(16); } }
  if (s.card) { m.insertAdjacentHTML('beforeend', s.card); if (hasGsap && !reduced) gsap.from(m.lastElementChild, { y: 8, opacity: 0, duration: 0.5 }); }
  scrollChat();
  chatBusy = false;
  $$('#chatQuick button').forEach((b) => (b.disabled = false));
}
$('#chatQuick').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) runChat(b.dataset.q); });
$('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const t = $('#chatText').value.trim();
  if (!t) return;
  $('#chatText').value = '';
  runChat(pickScript(t), t);
});
addMsg('ai', '안녕하세요, 펫스토어 AI 상담원입니다. 주문·배송·교환·AS 무엇이든 물어보세요.');
once($('.chat'), () => setTimeout(() => runChat('ship'), 600), 0.5);

// 생각하는 구슬 다섯 가지 상태
islReady.then((m) => {
  if (!m) return;
  m.mountBeams();
  $$('#aiStates .orb-host').forEach((h) => m.orb(h, { state: h.dataset.orb, size: 20 }));
  setupVoice(m);
  ScrollTrigger?.refresh();
});

// ---------- AI 상담: 음성 ----------
function setupVoice(m) {
  let level = 0, target = 0, dir = 0, dirT = 0, t0 = performance.now(), speaking = false;
  const lv = () => level;
  const dv = () => dir;
  const ring = m.voiceRing($('#voiceRing'), { size: Math.min(280, $('#voiceRing').clientWidth - 20), level: lv, direction: dv });
  m.voiceBeam($('#voiceCap'), { level: lv });
  const tick = (now) => {
    const t = (now - t0) / 1000;
    // 말하는 소리처럼 음절마다 오르내리는 크기
    target = speaking ? Math.max(0, 0.22 + 0.6 * Math.abs(Math.sin(t * 7.1)) * (0.55 + 0.45 * Math.sin(t * 1.9)) + (Math.random() - 0.5) * 0.12) : 0;
    level += (target - level) * 0.18;
    dir += (dirT - dir) * 0.05;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const LINES = [
    { who: '고객', text: '안녕하세요, 어제 주문한 급수기 배송 문의드려요.', state: 'listening', d: -0.7, ms: 3200 },
    { who: 'AI 상담원', text: '', state: 'processing', ms: 1400 },
    { who: 'AI 상담원', text: '주문 확인했습니다. 오늘 오후 출고되어 내일 도착 예정입니다.', state: 'speaking', d: 0.6, ms: 3800, emotion: 'positive' },
    { who: '고객', text: '혹시 오전에 받을 수 있을까요?', state: 'listening', d: -0.7, ms: 2400 },
    { who: 'AI 상담원', text: '', state: 'processing', ms: 1200 },
    { who: 'AI 상담원', text: '오전 도착 요청을 배송 메모에 남겼습니다. 문자로도 안내해 드릴게요.', state: 'speaking', d: 0.6, ms: 3800, emotion: 'positive' },
    { who: '통화 종료', text: '통화 요약을 상담 기록에 저장했습니다 · 배송 문의 · AI 해결', state: 'idle', d: 0, ms: 2600 },
  ];
  const vt = $('#voiceText'), vs = $('#voiceState'), play = $('#voicePlay'), mic = $('#voiceMic');
  let running = false, stream = null;
  play.addEventListener('click', async () => {
    if (running) return;
    stopMic();
    running = true;
    play.disabled = true;
    for (const L of LINES) {
      ring.set({ state: L.state, emotion: L.emotion || 'calm' });
      dirT = L.d ?? dirT;
      speaking = L.state === 'listening' || L.state === 'speaking';
      vs.textContent = { listening: '고객이 말하는 중', processing: '답변 준비 중', speaking: 'AI가 말하는 중', idle: '통화 종료' }[L.state];
      if (L.state === 'processing') vt.innerHTML = `<span class="who">${L.who}</span>주문 찾는 중…`;
      else {
        vt.innerHTML = `<span class="who">${L.who}</span><span class="tx"></span>`;
        const tx = vt.querySelector('.tx'), per = (L.ms * 0.75) / Math.max(1, L.text.length);
        for (let i = 1; i <= L.text.length; i++) { tx.textContent = L.text.slice(0, i); await wait(per); }
      }
      await wait(L.state === 'processing' ? L.ms : L.ms * 0.25);
    }
    speaking = false;
    ring.set({ state: 'idle', emotion: 'calm' });
    running = false;
    play.disabled = false;
    play.textContent = '다시 듣기';
  });
  function stopMic() {
    if (!stream) return;
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
    ring.set({ stream: null, state: 'idle' });
    mic.classList.remove('is-on');
    mic.textContent = '내 목소리로 해 보기';
    vs.textContent = '대기 중';
  }
  mic.addEventListener('click', async () => {
    if (stream) { stopMic(); return; }
    if (running) return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      ring.set({ stream, state: 'listening', emotion: 'calm' });
      mic.classList.add('is-on');
      mic.textContent = '마이크 끄기';
      vs.textContent = '듣는 중';
      vt.innerHTML = '<span class="who">내 목소리</span>말해 보세요. 목소리 크기에 맞춰 링이 움직입니다.';
    } catch {
      vt.innerHTML = '<span class="who">안내</span>마이크를 쓸 수 없어 통화 시연으로 대신 보여 드립니다.';
    }
  });
}

// ---------- 업종별 샘플 대시보드 ----------
const tabs = $('#sampleTabs'), sBody = $('#sampleBody');
tabs.innerHTML = SAMPLES.map((s, i) => `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-i="${i}">${s.tab}</button>`).join('');
let sCur = -1;
function showSample(i, animate = true) {
  if (i === sCur) return;
  sCur = i;
  const s = SAMPLES[i];
  $$('.tab', tabs).forEach((b, k) => b.setAttribute('aria-selected', k === i));
  $('#sampleWho').textContent = s.who;
  $('#sampleUrl').textContent = `app.off8.kr/${s.id}`;
  const draw = () => {
    sBody.innerHTML = board(s);
    if (animate) animateIn(sBody, { quick: true });
  };
  if (hasGsap && sBody.firstElementChild && !reduced) gsap.to(sBody, { opacity: 0, y: 6, duration: 0.2, onComplete: () => { draw(); gsap.to(sBody, { opacity: 1, y: 0, duration: 0.3 }); } });
  else draw();
}
showSample(0, false);
once(sBody, () => animateIn(sBody));
tabs.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) showSample(+b.dataset.i); });

// ---------- 문의 폼 (시연용: 화면에만 접수 표시) ----------
const form = $('#contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  form.hidden = true;
  $('#contactDone').hidden = false;
});

addEventListener('load', () => hasGsap && ScrollTrigger.refresh());
