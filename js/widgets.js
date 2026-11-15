// 위젯 대시보드: 칸을 끌어 옮기고 모서리를 당겨 크기를 바꾸면, 칸 크기에 맞춰 보여 주는 데이터 양이 바뀝니다.
import { line, hbars, donut, table, pill, fmt, animateIn } from './dash.js?v=3';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const gsap = window.gsap;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const I = '#6336E8', I2 = '#A18CF5', I3 = '#DAD2FF', INK = '#101010';
const ROW = 120, GAP = 12;

// ---------- 시연용 데이터 ----------
const days = Array.from({ length: 28 }, (_, i) => i);
const COUPANG = days.map((i) => +(2.2 + i * 0.07 + Math.sin(i * 0.9) * 0.35 + (i % 7 === 5 ? 0.5 : 0)).toFixed(2));
const NAVER = days.map((i) => +(1.1 + i * 0.04 + Math.cos(i * 0.7) * 0.25).toFixed(2));
const FX = days.map((i) => +(188.6 + i * 0.1 + Math.sin(i * 0.6) * 0.8).toFixed(1));
const dayLabel = (i) => `${10 + Math.floor((i + 18) / 31)}/${((i + 18) % 31) + 1}`;
const STOCK = [['자동급수기 2L', 18, 40], ['필터 4입', 12, 50], ['실리콘 매트 L', 26, 30], ['스테인리스 볼', 92, 30], ['세라믹 볼 S', 64, 30], ['자동급수기 4L', 41, 25], ['스마트 급식기', 33, 20], ['정수 필터 2입', 7, 30], ['방수 매트 M', 58, 25]];
const ORDERS = [['쿠팡 로켓그로스', '자동급수기 2L', 240, '11/18', 'run', '입고 예정'], ['공급사 A', '필터 4입', 600, '11/17', 'wait', '확인 필요'], ['공급사 B', '세라믹 볼 S', 180, '11/16', 'ok', '입고 완료'], ['3PL 물류', '실리콘 매트 L', 120, '11/19', 'new', '발주서 변환'], ['쿠팡 로켓그로스', '스마트 급식기', 90, '11/20', 'run', '입고 예정'], ['공급사 A', '정수 필터 2입', 400, '11/21', 'wait', '확인 필요'], ['공급사 C', '방수 매트 M', 150, '11/22', 'run', '입고 예정']];
const LEDGER = [['11/14', '광저우 ○○무역', '3,820,000', '3,820,000', '0', 'ok', '일치'], ['11/13', '이우 ○○상행', '1,140,000', '1,096,000', '44,000', 'bad', '환율 차이'], ['11/13', '선전 ○○전자', '2,560,000', '2,560,000', '0', 'ok', '일치'], ['11/12', '광저우 ○○무역', '760,000', '—', '760,000', 'wait', '누락'], ['11/11', '이우 ○○상행', '980,000', '980,000', '0', 'ok', '일치'], ['11/10', '선전 ○○전자', '1,420,000', '1,420,000', '0', 'ok', '일치'], ['11/09', '광저우 ○○무역', '2,110,000', '2,090,000', '20,000', 'bad', '요율 차이']];
const CHATS = [['김○진', '배송 언제 와요?', 'ok', 'AI 해결'], ['최○우', '필터에서 물이 새요', 'run', '담당자'], ['정○희', '색상 교환 되나요?', 'ok', 'AI 해결'], ['오○민', '대량 구매 문의', 'wait', '확인 중'], ['한○수', '송장 번호 알려 주세요', 'ok', 'AI 해결'], ['유○나', '타이머가 안 맞아요', 'run', '담당자']];

// 칸 안쪽 높이 (머리글 제외)
const bodyH = (h) => h * ROW + (h - 1) * GAP - 24 - 30;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const big = (num, unit, sub, tone = '') => `<div class="wg-big">${num}<small>${unit}</small></div>${sub ? `<div class="wg-sub ${tone}">${sub}</div>` : ''}`;
const chartIn = (html, hpx) => html.replace('class="w-chart"', `class="w-chart" style="height:${Math.max(36, hpx)}px"`);
const rowsFit = (h, head = 34) => Math.max(1, Math.floor((bodyH(h) - head - 4) / 41));

// 위젯 종류별로, 칸 크기(w×h)에 맞는 내용을 만듭니다
const TYPES = {
  sales: {
    name: '매출', render(w, h) {
      const n = h === 1 ? 7 : Math.min(28, 7 * w);
      const c = COUPANG.slice(-n), v = NAVER.slice(-n);
      const total = Math.round((sum(c) + sum(v)) * 100) / 100;
      const scope = `최근 ${n}일`;
      if (w === 1 && h === 1) return { scope, html: big(fmt(total, 'dec'), '백만원', '▲ 8.1% 지난주 대비', 'up') };
      const labels = [0, 0.33, 0.66, 1].map((t) => dayLabel(28 - n + Math.round(t * (n - 1))));
      if (h === 1) return { scope, html: `<div class="wg-split">${big(fmt(total, 'dec'), '백만원', '▲ 8.1%', 'up')}<div class="wg-spark">${chartIn(line({ series: [{ name: '합계', data: c.map((x, i) => x + v[i]), color: I }], labels: [], legend: false }), 46)}</div></div>` };
      const two = w >= 3;
      const series = two ? [{ name: '쿠팡', data: c, color: I }, { name: '네이버', data: v, color: INK }] : [{ name: '매출 합계', data: c.map((x, i) => +(x + v[i]).toFixed(2)), color: I }];
      const tableRows = h >= 3 && w >= 2;
      const ch = bodyH(h) - 40 - (two ? 22 : 22) - 18 - (tableRows ? 120 : 0);
      let html = `<div class="wg-kline"><b>${fmt(total, 'dec')}<small>백만원</small></b><span class="up">▲ 8.1%</span></div>` + chartIn(line({ series, labels }), ch);
      if (tableRows) html += table(['채널', '매출', '비중'], [['쿠팡', fmt(sum(c), 'dec') + '백만', Math.round((sum(c) / total) * 100) + '%'], ['네이버', fmt(sum(v), 'dec') + '백만', Math.round((sum(v) / total) * 100) + '%']]);
      return { scope, html };
    },
  },
  stock: {
    name: '재고', render(w, h) {
      const warn = STOCK.filter((s) => s[1] < s[2]).length;
      if (h === 1 && w === 1) return { scope: `경고 ${warn}개`, html: big(warn, '개', '안전재고 미만', 'down') };
      const n = Math.min(STOCK.length, Math.max(2, Math.floor(bodyH(h) / 27)));
      const items = [...STOCK].sort((a, b) => a[1] / a[2] - b[1] / b[2]).slice(0, n);
      return { scope: `${n}개 품목`, html: hbars(items.map(([name, v, safe]) => ({ name, v, safe, max: 100 })), { unit: '개', warn: true }) };
    },
  },
  order: {
    name: '발주·입고', render(w, h) {
      if (h === 1 && w === 1) return { scope: '이번 주', html: big(fmt(sum(ORDERS.map((o) => o[2]))), '개', '입고 예정') };
      const n = Math.min(ORDERS.length, rowsFit(h));
      const COLS = [[1, 5], [1, 2, 5], [1, 2, 3, 5], [0, 1, 2, 3, 5]][w - 1];
      const head = ['발주처', '품목', '수량', '입고 예정', '', '상태'];
      const rows = ORDERS.slice(0, n).map((o) => COLS.map((k) => (k === 5 ? pill(o[4], o[5]) : k === 2 ? fmt(o[2]) : o[k])));
      return { scope: `${n}건`, html: table(COLS.map((k) => head[k]), rows).replace(/class="w-tr/g, `style="--cols:${COLS.length}" class="w-tr`) };
    },
  },
  cs: {
    name: 'AI 상담', render(w, h) {
      if (h === 1 && w === 1) return { scope: '이번 달', html: big(78, '%', 'AI 1차 해결', 'up') };
      if (h === 1) return { scope: '이번 달', html: `<div class="wg-split">${big(78, '%', 'AI 1차 해결', 'up')}${big('9', '초', '첫 응답')}</div>` };
      const d = donut([{ name: 'AI 해결', v: 78, color: I }, { name: '담당자', v: 22, color: I3 }], { center: '<b>78%</b>', sub: 'AI 해결' });
      if (w === 1) return { scope: '1,096건', html: d.split('<ul')[0] };
      if (w === 2) return { scope: '1,096건', html: `<div class="wg-donut-row">${d}</div>` };
      const n = Math.min(CHATS.length, rowsFit(h, 0));
      return { scope: `최근 ${n}건`, html: `<div class="wg-donut-row wide">${d.split('<ul')[0]}<ul class="w-chats">${CHATS.slice(0, n).map((c) => `<li><span class="av">${c[0][0]}</span><p>${c[1]}</p>${pill(c[2], c[3])}</li>`).join('')}</ul></div>` };
    },
  },
  settle: {
    name: '장부 대조', render(w, h) {
      const bad = LEDGER.filter((l) => l[5] !== 'ok').length;
      if (h === 1 && w === 1) return { scope: '이번 주', html: big(bad, '건', '확인할 차이', 'down') };
      const n = Math.min(LEDGER.length, rowsFit(h));
      const COLS = [[1, 5], [1, 4, 5], [0, 1, 4, 5], [0, 1, 2, 3, 4, 5]][w - 1];
      const head = ['날짜', '거래처', '한국 장부', '중국 장부', '차이', '상태'];
      const rows = LEDGER.slice(0, n).map((l) => COLS.map((k) => (k === 5 ? pill(l[5], l[6]) : l[k])));
      return { scope: `${n}건`, html: table(COLS.map((k) => head[k]), rows).replace(/class="w-tr/g, `style="--cols:${COLS.length}" class="w-tr`) };
    },
  },
  fx: {
    name: '환율', render(w, h) {
      const n = h === 1 ? 7 : Math.min(28, 7 * w);
      const d = FX.slice(-n);
      if (w === 1 && h === 1) return { scope: '오늘', html: big(d[d.length - 1], '원/위안', '날짜별 자동 반영') };
      const labels = [0, 0.5, 1].map((t) => dayLabel(28 - n + Math.round(t * (n - 1))));
      if (h === 1) return { scope: `최근 ${n}일`, html: `<div class="wg-split">${big(d[d.length - 1], '원', '위안 기준')}<div class="wg-spark">${chartIn(line({ series: [{ name: '환율', data: d, color: I }], labels: [], legend: false }), 46)}</div></div>` };
      return { scope: `최근 ${n}일`, html: `<div class="wg-kline"><b>${d[d.length - 1]}<small>원/위안</small></b></div>` + chartIn(line({ series: [{ name: '환율', data: d.map((x) => x - 186), color: I }], labels, legend: false }), bodyH(h) - 40 - 18) };
    },
  },
};

const START = [['sales', 2, 2], ['stock', 1, 2], ['cs', 1, 2], ['order', 3, 2], ['fx', 1, 1], ['settle', 1, 1]];

export function mountWidgets() {
  const board = $('#wgBoard');
  if (!board) return;
  const frame = board.parentElement;
  const cursor = $('#wgCursor'), toast = $('#wgToast');
  const cols = () => (matchMedia('(max-width: 700px)').matches ? 2 : 4);

  function draw(el, animate) {
    const t = TYPES[el.dataset.type];
    const w = Math.min(+el.dataset.w, cols()), h = +el.dataset.h;
    el.style.setProperty('--w', w);
    el.style.setProperty('--h', h);
    const { scope, html } = t.render(w, h);
    el.querySelector('.scope').textContent = scope;
    el.querySelector('.wg-body').innerHTML = html;
    if (animate && gsap) {
      gsap.fromTo(el.querySelector('.scope'), { backgroundColor: '#e3dbff' }, { backgroundColor: '#f7f7fa', duration: 0.9 });
      animateIn(el.querySelector('.wg-body'), { quick: true, skipCards: true });
    }
  }
  function make(type, w, h) {
    const el = document.createElement('section');
    el.className = 'wg';
    el.dataset.type = type; el.dataset.w = w; el.dataset.h = h;
    el.innerHTML = `<header><span class="grip" aria-hidden="true"></span><h4>${TYPES[type].name}</h4><span class="scope"></span><button type="button" class="x" aria-label="${TYPES[type].name} 위젯 빼기">×</button></header><div class="wg-body"></div><span class="wg-rs" aria-hidden="true"></span>`;
    draw(el);
    return el;
  }
  const flip = (fn, extra = {}) => {
    if (!gsap || !window.Flip || reduced) { fn(); return; }
    const st = Flip.getState(board.children);
    fn();
    Flip.from(st, { duration: 0.45, ease: 'power3.inOut', nested: true, ...extra });
  };

  // 위젯 추가 칩
  const addBar = $('#wgAdd');
  function syncAdd() {
    const have = new Set($$('.wg', board).map((e) => e.dataset.type));
    addBar.innerHTML = Object.keys(TYPES).map((k) => `<button type="button" data-add="${k}" ${have.has(k) ? 'disabled' : ''}>+ ${TYPES[k].name}</button>`).join('');
  }
  addBar.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    stopDemo();
    const el = make(b.dataset.add, 2, 1);
    flip(() => board.appendChild(el), { onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 }) });
    animateIn(el.querySelector('.wg-body'), { quick: true, skipCards: true });
    bindDrag(el);
    syncAdd();
  });
  board.addEventListener('click', (e) => {
    const x = e.target.closest('.x');
    if (!x) return;
    stopDemo();
    const el = x.closest('.wg');
    flip(() => el.remove());
    syncAdd();
  });
  function reset() {
    board.innerHTML = '';
    START.forEach(([t, w, h]) => board.appendChild(make(t, w, h)));
    $$('.wg', board).forEach(bindDrag);
    syncAdd();
  }

  // ---------- 크기 바꾸기 ----------
  function setSize(el, w, h) {
    w = Math.max(1, Math.min(cols(), w)); h = Math.max(1, Math.min(3, h));
    if (+el.dataset.w === w && +el.dataset.h === h) return false;
    flip(() => { el.dataset.w = w; el.dataset.h = h; draw(el, true); });
    return true;
  }
  board.addEventListener('pointerdown', (e) => {
    const rs = e.target.closest('.wg-rs');
    if (!rs) return;
    e.preventDefault();
    stopDemo();
    const el = rs.closest('.wg');
    const colW = (board.clientWidth - GAP * (cols() - 1)) / cols();
    const sx = e.clientX, sy = e.clientY, w0 = +el.dataset.w, h0 = +el.dataset.h;
    el.classList.add('is-resize');
    const move = (ev) => setSize(el, w0 + Math.round((ev.clientX - sx) / (colW + GAP)), h0 + Math.round((ev.clientY - sy) / (ROW + GAP)));
    const up = () => { el.classList.remove('is-resize'); removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  });

  // ---------- 끌어 옮기기 ----------
  function moveTo(el, target) {
    const ws = [...board.children];
    const before = el.getBoundingClientRect();
    flip(() => (ws.indexOf(el) < ws.indexOf(target) ? target.after(el) : target.before(el)));
    return before;
  }
  function bindDrag(el) {
    if (!window.Draggable) return;
    Draggable.create(el, {
      trigger: el.querySelector('header'), type: 'x,y', zIndexBoost: true, dragClickables: false,
      onPress() { stopDemo(); },
      onDragStart() { el.classList.add('is-drag'); },
      onDrag() {
        // pointerX는 페이지 기준이라, 화면 기준 좌표(clientX)로 비교합니다
        const ev = this.pointerEvent.changedTouches ? this.pointerEvent.changedTouches[0] : this.pointerEvent;
        const px = ev.clientX, py = ev.clientY;
        const target = $$('.wg', board).find((o) => {
          if (o === el) return false;
          const r = o.getBoundingClientRect();
          return px > r.left && px < r.right && py > r.top && py < r.bottom;
        });
        if (!target) return;
        const a = el.getBoundingClientRect();
        moveTo(el, target);
        const b = el.getBoundingClientRect();
        gsap.set(el, { x: `+=${a.left - b.left}`, y: `+=${a.top - b.top}` });
        this.update();
      },
      onRelease() { el.classList.remove('is-drag'); gsap.to(el, { x: 0, y: 0, duration: 0.35, ease: 'power3.out' }); },
    });
  }

  // ---------- 자동 시연: 커서가 직접 옮기고 늘려 봅니다 ----------
  let demo = null, demoOn = false;
  function stopDemo() {
    if (!demoOn) return;
    demoOn = false;
    demo?.kill();
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
    say('직접 칸을 끌어 옮기고, 오른쪽 아래 모서리를 당겨 보세요.');
  }
  function say(t) {
    toast.textContent = t;
    gsap.fromTo(toast, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
  }
  const fr = () => frame.getBoundingClientRect();
  const corner = (el) => { const r = el.getBoundingClientRect(), f = fr(); return { x: r.right - f.left - 12, y: r.bottom - f.top - 12 }; };
  const head = (el) => { const r = el.getBoundingClientRect(), f = fr(); return { x: r.left - f.left + 26, y: r.top - f.top + 20 }; };
  const byType = (t) => board.querySelector(`[data-type="${t}"]`);
  function runDemo() {
    if (reduced || !gsap) return;
    demoOn = true;
    const tl = gsap.timeline({ onComplete: () => { demoOn = false; gsap.to(cursor, { opacity: 0, duration: 0.4 }); say('이제 직접 옮기고 늘려 보세요. 위젯을 더하거나 뺄 수도 있습니다.'); } });
    demo = tl;
    const goto = (p, d = 0.7) => tl.to(cursor, { x: () => p().x, y: () => p().y, duration: d, ease: 'power2.inOut' });
    const press = (on) => tl.to(cursor, { scale: on ? 0.85 : 1, duration: 0.12 });
    // 1) 매출 칸을 오른쪽으로 늘리기 → 기간이 길어지고 채널이 나뉩니다
    tl.set(cursor, { x: 40, y: 40, opacity: 0 }).to(cursor, { opacity: 1, duration: 0.3 })
      .add(() => say('칸을 넓히면 보여 주는 기간이 늘어납니다.'));
    goto(() => corner(byType('sales')));
    press(true);
    tl.add(() => setSize(byType('sales'), 3, 2)).to(cursor, { x: '+=' + 160, duration: 0.6, ease: 'power2.out' });
    press(false);
    tl.to({}, { duration: 1 });
    // 2) 재고 칸을 작게 → 숫자 하나만
    tl.add(() => say('작게 줄이면 꼭 필요한 숫자만 남습니다.'));
    goto(() => corner(byType('stock')));
    press(true);
    tl.add(() => setSize(byType('stock'), 1, 1)).to(cursor, { y: '-=' + 120, duration: 0.5, ease: 'power2.out' });
    press(false);
    tl.to({}, { duration: 1 });
    // 3) 발주 칸을 맨 앞으로 옮기기
    tl.add(() => say('원하는 자리로 끌어다 놓으면 나머지가 비켜 줍니다.'));
    goto(() => head(byType('order')));
    press(true);
    tl.add(() => byType('order').classList.add('is-drag'))
      .to(cursor, { x: () => head(byType('sales')).x, y: () => head(byType('sales')).y, duration: 0.8, ease: 'power2.inOut' })
      .add(() => { const o = byType('order'); moveTo(o, board.firstElementChild); o.classList.remove('is-drag'); });
    press(false);
    tl.to({}, { duration: 0.9 });
    // 4) 발주 칸을 아래로 늘리기 → 행이 늘어납니다
    tl.add(() => say('세로로 늘리면 더 많은 건수를 보여 줍니다.'));
    goto(() => corner(byType('order')));
    press(true);
    tl.add(() => setSize(byType('order'), 4, 3)).to(cursor, { y: '+=' + 130, x: '+=' + 60, duration: 0.6 });
    press(false);
    tl.to({}, { duration: 0.8 });
  }

  reset();
  const io = new IntersectionObserver((ents) => { if (ents[0].isIntersecting) { io.disconnect(); setTimeout(runDemo, 500); } }, { threshold: 0.45 });
  io.observe(frame);
  $('#wgReset').addEventListener('click', () => { stopDemo(); flip(reset); });
  let lastCols = cols();
  addEventListener('resize', () => { if (cols() !== lastCols) { lastCols = cols(); $$('.wg', board).forEach((e) => draw(e)); } });
}
