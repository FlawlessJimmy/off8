// 대시보드 화면 조각(숫자 카드, 선 그래프, 막대, 도넛, 표, 기록)을 만들고 움직이는 곳
// 화면 속 숫자와 이름은 모두 시연용입니다.

// 영어 모드: i18n.js가 있으면 그 사전으로 바꾸고, 없으면 그대로 둡니다
const I18 = typeof window !== 'undefined' ? window.i18n : null;
export const EN = !!(I18 && I18.isEn);
export const T = (s) => (I18 && typeof s === 'string' ? I18.t(s) : s);
const Tc = (c) => (typeof c === 'string' && c.trim().startsWith('<') ? c : T(c)); // 태그로 시작하는 칸(배지 등)은 그대로

export const fmt = (n, f) => {
  if (f === 'pct') return n.toFixed(n % 1 ? 1 : 0);
  if (f === 'dec') return n.toFixed(1);
  if (f === 'dec2') return n.toFixed(2);
  return Math.round(n).toLocaleString('ko-KR');
};

// 숫자 + 단위. 영어일 때 원은 숫자 앞 ₩, 건·개 같은 세는 단위는 뺍니다
const UNIT_EN = { '원': ['₩', ''], '백만원': ['₩', 'M'], '원/위안': ['₩', '/CNY'], '원/월': ['₩', '/mo'] };
export function numUnit(v, unit = '') {
  if (!EN) return `${v}<small>${unit}</small>`;
  const [pre, suf] = UNIT_EN[unit] || ['', T(unit)];
  return `${pre ? `<small class="pre">${pre}</small>` : ''}${v}${suf ? `<small>${suf}</small>` : ''}`;
}

// ---------- 조각 ----------
export function kpi({ label, value, unit = '', f = 'int', delta, tone = 'up', hero }) {
  return `<div class="w-kpi${hero ? ' is-hero' : ''}">
    <span class="w-label">${T(label)}</span>
    <b class="w-num">${numUnit(`<span data-count="${value}" data-f="${f}">${fmt(value, f)}</span>`, unit)}</b>
    ${delta ? `<span class="w-delta ${tone}">${T(delta)}</span>` : ''}
  </div>`;
}

function smooth(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
let uid = 0;
// series: [{ name, data:[], color }]
// 처음에는 600 너비로 그려 두고, 화면에 붙으면 실제 칸 크기(px)로 다시 그립니다.
// (늘려서 맞추면 점이 타원으로 찌그러지고 선 그리기 애니메이션이 중간에서 끊깁니다)
// 칸이 넓어지면 날짜마다 작은 점과 왼쪽 눈금 숫자가 더해져 더 자세히 보입니다.
function lineInner(W, H, { series, bars, id }, fine) {
  const padX = fine ? (W > 420 ? 34 : 14) : 14, padY = 14, padR = 14;
  const all = series.flatMap((s) => s.data).concat(bars ? bars.data : []);
  const max = Math.max(...all) * 1.12, min = 0;
  const x = (i, n) => padX + (i * (W - padX - padR)) / (n - 1);
  const y = (v) => H - padY - ((v - min) / (max - min)) * (H - padY * 2);
  const ticks = [0.25, 0.5, 0.75];
  const grid = ticks.map((t) => `<line x1="${fine ? padX : 0}" x2="${W}" y1="${(H * t).toFixed(1)}" y2="${(H * t).toFixed(1)}" />`).join('');
  let barsSvg = '';
  if (bars) {
    const n = bars.data.length, bw = ((W - padX - padR) / n) * 0.5;
    barsSvg = bars.data.map((v, i) => {
      const cx = padX + ((i + 0.5) * (W - padX - padR)) / n;
      return `<rect class="w-bar" x="${(cx - bw / 2).toFixed(1)}" y="${y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(H - padY - y(v)).toFixed(1)}" rx="4" fill="${bars.color || '#DAD2FF'}" />`;
    }).join('');
  }
  let extra = '';
  const paths = series.map((s, k) => {
    const pts = s.data.map((v, i) => [bars ? padX + ((i + 0.5) * (W - padX - padR)) / s.data.length : x(i, s.data.length), y(v)]);
    const d = smooth(pts);
    const last = pts[pts.length - 1];
    const area = k === 0 && !bars ? `<path class="w-area" d="${d} L${last[0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z" fill="url(#${id})" />` : '';
    // 점 사이가 넉넉하면 날짜마다 작은 점
    if (fine && pts.length > 1 && (pts[1][0] - pts[0][0]) > 16) {
      extra += pts.slice(0, -1).map((p) => `<circle class="w-pt" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6" fill="#fff" stroke="${s.color}" stroke-width="1.6" />`).join('');
    }
    return `${area}<path class="w-line" d="${d}" stroke="${s.color}" ${s.dash ? 'stroke-dasharray="5 6" data-dash="1"' : ''} /><circle class="w-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4.5" fill="#fff" stroke="${s.color}" stroke-width="2.5" />`;
  }).join('');
  // 넓은 칸: 왼쪽 눈금 숫자
  if (fine && W > 420) {
    extra += ticks.map((t) => {
      const v = max - ((H * t - padY) / (H - padY * 2)) * (max - min);
      return `<text class="w-ytick" x="0" y="${(H * t + 3.5).toFixed(1)}">${v >= 100 ? Math.round(v) : v.toFixed(1)}</text>`;
    }).join('');
  }
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${series[0].color}" stop-opacity=".22"/><stop offset="1" stop-color="${series[0].color}" stop-opacity="0"/></linearGradient></defs>
    <g class="w-grid">${grid}</g>${barsSvg}${paths}<g class="w-fine">${extra}</g>`;
}

export function line({ series, labels, h = 190, legend = true, bars }) {
  const id = 'g' + ++uid;
  // 이름 · 날짜는 그림 정보(data-line)에 담기 전에 바꿔 둡니다 (다시 그릴 때 한국어가 돌아오지 않게)
  series = series.map((s) => ({ ...s, name: T(s.name) }));
  if (bars) bars = { ...bars, name: T(bars.name) };
  labels = labels.map(T);
  const spec = { series: series.map((s) => ({ name: s.name, data: s.data, color: s.color, dash: !!s.dash })), bars: bars || null, id };
  const lg = legend ? `<div class="w-legend">${series.map((s) => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}${bars ? `<span><i style="background:${bars.color || '#DAD2FF'}"></i>${bars.name}</span>` : ''}</div>` : '';
  return `${lg}<svg class="w-chart" data-line="${encodeURIComponent(JSON.stringify(spec))}" viewBox="0 0 600 ${h}" preserveAspectRatio="none" aria-hidden="true">
    ${lineInner(600, h, spec, false)}</svg>
    <div class="w-xlabels">${labels.map((l) => `<span>${l}</span>`).join('')}</div>`;
}

// 실제 크기로 다시 그리기: 같은 자리의 요소는 좌표만 바꿔, 진행 중인 등장 애니메이션이 이어집니다
const ATTRS = ['d', 'cx', 'cy', 'x', 'y', 'width', 'height', 'x1', 'x2', 'y1', 'y2'];
function fitChart(svg) {
  const W = Math.round(svg.clientWidth), H = Math.round(svg.clientHeight);
  if (W < 24 || H < 24 || (svg._fw === W && svg._fh === H)) return;
  svg._fw = W; svg._fh = H;
  const spec = JSON.parse(decodeURIComponent(svg.dataset.line));
  const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tmp.innerHTML = lineInner(W, H, spec, true);
  const sel = '.w-grid line, .w-bar, .w-area, .w-line, .w-dot';
  const oldEls = [...svg.querySelectorAll(sel)], newEls = [...tmp.querySelectorAll(sel)];
  if (oldEls.length !== newEls.length) { svg.innerHTML = tmp.innerHTML; }
  else {
    oldEls.forEach((o, i) => ATTRS.forEach((a) => { const v = newEls[i].getAttribute(a); if (v !== null) o.setAttribute(a, v); }));
    const of = svg.querySelector('.w-fine'), nf = tmp.querySelector('.w-fine');
    if (of && nf) of.innerHTML = nf.innerHTML;
  }
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.classList.add('is-fit');
  // 아래 날짜 글자도 왼쪽 눈금 숫자만큼 들여 그래프와 줄을 맞춥니다
  const xl = svg.nextElementSibling;
  if (xl?.classList.contains('w-xlabels')) xl.style.paddingLeft = (W > 420 ? 20 : 0) + 'px';
}
if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
  const ro = new ResizeObserver((es) => es.forEach((e) => fitChart(e.target)));
  const watch = (root) => {
    if (root.matches?.('svg[data-line]')) ro.observe(root);
    root.querySelectorAll?.('svg[data-line]').forEach((s) => { if (!s._watched) { s._watched = 1; ro.observe(s); } });
  };
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && watch(n)))).observe(document.documentElement, { childList: true, subtree: true });
  watch(document);
}

export function hbars(items, { unit = '', warn } = {}) {
  const max = Math.max(...items.map((i) => i.max || i.v));
  return `<ul class="w-hbars">${items.map((it) => {
    const bad = warn && it.v < it.safe;
    return `<li><span class="w-hb-name">${T(it.name)}</span><span class="w-hb-track"><i class="w-hb-fill${bad ? ' is-warn' : ''}" style="width:${(it.v / max) * 100}%"></i>${it.safe ? `<em style="left:${(it.safe / max) * 100}%"></em>` : ''}</span><b>${fmt(it.v)}${T(unit)}</b></li>`;
  }).join('')}</ul>`;
}

// segments: [{ name, v, color }]
export function donut(segments, { center, sub } = {}) {
  const total = segments.reduce((a, s) => a + s.v, 0);
  const R = 52, C = 2 * Math.PI * R;
  let acc = 0;
  const arcs = segments.map((s) => {
    const len = (s.v / total) * C;
    const el = `<circle class="w-arc" r="${R}" cx="70" cy="70" stroke="${s.color}" stroke-dasharray="${len.toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-acc).toFixed(2)}" data-len="${len.toFixed(2)}" />`;
    acc += len;
    return el;
  }).join('');
  return `<div class="w-donut"><svg viewBox="0 0 140 140" aria-hidden="true"><circle r="${R}" cx="70" cy="70" class="w-arc-bg" />${arcs}</svg>
    <div class="w-donut-c">${center || ''}${sub ? `<small>${T(sub)}</small>` : ''}</div></div>
    <ul class="w-keys">${segments.map((s) => `<li><i style="background:${s.color}"></i>${T(s.name)}<b>${Math.round((s.v / total) * 100)}%</b></li>`).join('')}</ul>`;
}

const PILL = { ok: '완료', wait: '확인 필요', bad: '조치 필요', run: '진행 중', new: '신규' };
export const pill = (t, label) => `<span class="w-pill is-${t}">${T(label || PILL[t])}</span>`;
export function table(cols, rows) {
  return `<div class="w-table" role="table"><div class="w-tr w-th" role="row">${cols.map((c) => `<span role="columnheader">${T(c)}</span>`).join('')}</div>
    ${rows.map((r) => `<div class="w-tr" role="row">${r.map((c) => `<span role="cell">${Tc(c)}</span>`).join('')}</div>`).join('')}</div>`;
}

export function feed(items) {
  return `<ul class="w-feed">${items.map((i) => `<li><i class="w-feed-ic is-${i.t || 'ok'}"></i><span>${T(i.text)}</span><time>${T(i.time)}</time></li>`).join('')}</ul>`;
}

export function steps(list, at) {
  return `<ol class="w-steps">${list.map((s, i) => `<li class="${i < at ? 'is-done' : i === at ? 'is-now' : ''}"><i></i><span>${T(s)}</span></li>`).join('')}</ol>`;
}

export const card = (title, body, { span = 1, tag = '', cls = '' } = {}) =>
  `<section class="w-card ${cls}" style="--span:${span}"><header><h4>${T(title)}</h4>${tag ? `<span class="w-tag">${T(tag)}</span>` : ''}</header>${body}</section>`;

// ---------- 움직임 ----------
export function animateIn(root, { delay = 0, quick = false, skipCards = false } = {}) {
  const g = window.gsap;
  if (!g) return;
  const D = quick ? 0.7 : 1.1;
  const tl = g.timeline({ delay });
  // 빈 대상은 건너뛰어 경고가 쌓이지 않게 합니다
  const q = (sel) => root.querySelectorAll(sel);
  const from = (els, v, at) => { if (els.length) tl.from(els, v, at); };
  if (!skipCards) from(q('.w-card, .w-kpi'), { y: 14, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 }, 0);
  root.querySelectorAll('[data-count]').forEach((el) => {
    const to = +el.dataset.count, f = el.dataset.f, o = { v: 0 };
    tl.to(o, { v: to, duration: D * 1.2, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(o.v, f)) }, 0.1);
  });
  root.querySelectorAll('.w-line').forEach((p) => {
    if (p.dataset.dash) { tl.from(p, { opacity: 0, duration: 0.8 }, 0.5); return; }
    p.setAttribute('pathLength', '1');
    g.set(p, { strokeDasharray: 1.001, strokeDashoffset: 1.001 });
    tl.to(p, { strokeDashoffset: 0, duration: D * 1.3, ease: 'power2.inOut' }, 0.2);
  });
  from(q('.w-area'), { opacity: 0, duration: 0.9 }, 0.7);
  from(q('.w-dot'), { scale: 0, transformOrigin: 'center', duration: 0.4, ease: 'back.out(3)' }, D * 1.2);
  from(q('.w-fine'), { opacity: 0, duration: 0.6 }, D * 1.1);
  from(q('.w-bar'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.8, ease: 'power3.out', stagger: 0.03 }, 0.15);
  from(q('.w-hb-fill'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, ease: 'power3.out', stagger: 0.06 }, 0.2);
  from(q('.w-tr:not(.w-th), .w-feed li, .w-steps li, .w-keys li, .w-funnel i'), { x: -8, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.04 }, 0.3);
  root.querySelectorAll('.w-arc').forEach((a, i) => {
    const len = +a.dataset.len;
    tl.fromTo(a, { strokeDasharray: `0 999` }, { strokeDasharray: `${len} 999`, duration: 0.8, ease: 'power2.out' }, 0.3 + i * 0.12);
  });
  return tl;
}

// ---------- 업종별 샘플 대시보드 ----------
const I = '#6336E8', I2 = '#A18CF5', I3 = '#DAD2FF', INK = '#101010', G = '#16A06A', A = '#E39B1B', R = '#D9435A';
const days = (n) => Array.from({ length: n }, (_, i) => `${11}/${i + 2}`);

export const SAMPLES = [
  {
    id: 'seller', tab: '온라인 셀러', who: '쿠팡·네이버에서 판매하는 유통·수입 셀러',
    nav: ['대시보드', '발주·입고', '재고·출고', '매출', '정산', '고객상담'], active: 0,
    title: '오늘의 판매 현황', sub: '쿠팡 로켓그로스 · 네이버 스마트스토어 · 3PL 물류',
    kpis: [
      { label: '오늘 매출', value: 3482000, unit: '원', delta: '▲ 12.4%', hero: true },
      { label: '신규 주문', value: 214, unit: '건', delta: '▲ 31건' },
      { label: '출고 대기', value: 37, unit: '건', delta: '오후 4시 마감', tone: 'flat' },
      { label: '재고 경고', value: 6, unit: '개', delta: '안전재고 미만', tone: 'down' },
    ],
    body: () => [
      card('채널별 매출', line({ series: [{ name: '쿠팡', data: [2.1, 2.4, 2.2, 2.9, 3.1, 2.8, 3.4, 3.2, 3.6, 3.3, 3.9, 4.1, 3.8, 4.4], color: I }, { name: '네이버', data: [1.2, 1.1, 1.5, 1.4, 1.3, 1.8, 1.7, 1.6, 2.0, 1.9, 1.8, 2.2, 2.4, 2.3], color: INK }], labels: ['11/2', '11/4', '11/6', '11/8', '11/10', '11/12', '11/14'] }), { span: 2, tag: '최근 14일 · 백만원' }),
      card('재고 경고', hbars([{ name: '자동급수기 2L', v: 18, safe: 40, max: 120 }, { name: '실리콘 매트 L', v: 26, safe: 30, max: 120 }, { name: '스테인리스 볼', v: 92, safe: 30, max: 120 }, { name: '필터 4입', v: 12, safe: 50, max: 120 }, { name: '세라믹 볼 S', v: 64, safe: 30, max: 120 }], { unit: '개', warn: true }), { tag: '세로선 = 안전재고' }),
      card('발주·입고 현황', table(['발주처', '품목', '수량', '입고 예정', '상태'], [
        ['쿠팡 로켓그로스', '자동급수기 2L 화이트', '240', '11/18', pill('run', '입고 예정')],
        ['공급사 A', '필터 4입', '600', '11/17', pill('wait')],
        ['공급사 B', '세라믹 볼 S', '180', '11/16', pill('ok', '입고 완료')],
        ['3PL 물류', '실리콘 매트 L', '120', '11/19', pill('new', '발주서 변환')],
      ]), { span: 3, tag: '쿠팡 발주서 61건 자동 통합' }),
    ],
  },
  {
    id: 'maker', tab: '제조·판매', who: '직접 만들어 파는 반려가전 제조·판매사',
    nav: ['대시보드', '매출·순이익', '상담·AS', '발주', '리포트'], active: 0,
    title: '11월 매출과 AS 현황', sub: '자사몰 · 쿠팡 · 네이버 · 오프라인 대리점',
    kpis: [
      { label: '이번 달 매출', value: 48210000, unit: '원', delta: '▲ 8.1%', hero: true },
      { label: '순이익률', value: 21.6, unit: '%', f: 'pct', delta: '원가·수수료 반영', tone: 'flat' },
      { label: 'AS 진행', value: 14, unit: '건', delta: '오늘 3건 접수', tone: 'flat' },
      { label: 'AI 1차 응대', value: 94, unit: '%', f: 'pct', delta: '▲ 6%p' },
    ],
    body: () => [
      card('월별 매출과 순이익', line({ series: [{ name: '순이익', data: [6.1, 6.8, 7.4, 7.1, 8.6, 9.2, 10.4], color: I }], bars: { name: '매출', data: [31, 33, 36, 35, 41, 44.6, 48.2], color: I3 }, labels: ['5월', '6월', '7월', '8월', '9월', '10월', '11월'] }), { span: 2, tag: '백만원' }),
      card('상담·AS 단계', `<div class="w-funnel">${[['접수', 14, 100], ['확인 중', 9, 64], ['처리 중', 5, 36], ['완료 (이번 주)', 22, 88]].map(([n, v, w]) => `<div><span>${T(n)}</span><i style="width:${w}%"></i><b>${v}${T('건')}</b></div>`).join('')}</div>`, { tag: '카카오톡 알림 연동' }),
      card('AS 진행 목록', table(['접수 번호', '제품', '증상', '단계', '담당'], [
        ['AS-0412', '자동급수기 2L', '필터 누수', pill('run', '확인 중'), '이○준'],
        ['AS-0409', '스마트 급식기', '타이머 오류', pill('wait', '부품 대기'), '박○아'],
        ['AS-0405', '자동급수기 4L', '소음', pill('ok', '처리 완료'), '이○준'],
        ['AS-0401', '정수 필터', '교환 요청', pill('new', '접수'), 'AI 1차 응대'],
      ]), { span: 3 }),
    ],
  },
  {
    id: 'settle', tab: '수입·정산', who: '한국·중국 장부를 함께 쓰는 거래 사업자',
    nav: ['대시보드', '장부 대조', '환율·요율', '수익 분배', '직원 입력'], active: 0,
    title: '한중 거래 정산', sub: '엑셀 장부 74개 파일 이관 · 직원 모바일 입력',
    kpis: [
      { label: '이번 달 거래액', value: 248630000, unit: '원', delta: '위안 환산 포함', tone: 'flat', hero: true },
      { label: '장부 대조 불일치', value: 3, unit: '건', delta: '확인 필요', tone: 'down' },
      { label: '직원 모바일 입력', value: 61, unit: '건', delta: '이번 주' , tone: 'flat'},
      { label: '적용 환율', value: 191.4, unit: '원/위안', f: 'dec', delta: '날짜별 자동', tone: 'flat' },
    ],
    body: () => [
      card('일자별 거래액과 환율', line({ series: [{ name: '환율', data: [189.2, 189.9, 190.4, 190.1, 191.0, 190.6, 191.4], color: I }], bars: { name: '거래액', data: [180, 210, 160, 240, 220, 260, 230], color: I3 }, labels: ['11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14'], legend: true }), { span: 2, tag: '거래액 = 백만원' }),
      card('수익 분배', donut([{ name: '대표', v: 50, color: I }, { name: '파트너', v: 30, color: I2 }, { name: '직원 급여', v: 20, color: I3 }], { center: `<b>${T('4,120만')}</b>`, sub: '이번 달 순이익' }), { tag: '분배 비율 설정' }),
      card('장부 대조 결과', table(['날짜', '거래처', '한국 장부', '중국 장부', '차이', '상태'], [
        ['11/14', '광저우 ○○무역', '3,820,000', '3,820,000', '0', pill('ok', '일치')],
        ['11/13', '이우 ○○상행', '1,140,000', '1,096,000', '44,000', pill('bad', '환율 차이')],
        ['11/13', '선전 ○○전자', '2,560,000', '2,560,000', '0', pill('ok', '일치')],
        ['11/12', '광저우 ○○무역', '760,000', '—', '760,000', pill('wait', '누락')],
      ]), { span: 3 }),
    ],
  },
  {
    id: 'cs', tab: 'AI 상담 운영', who: '네이버 톡톡·자사몰 상담이 많은 판매사',
    nav: ['대시보드', '상담함', 'AI 답변 설정', '상담원', '리포트'], active: 0,
    title: '상담 운영 현황', sub: '네이버 톡톡 · 자사몰 채팅 · 전화 1차 응대',
    kpis: [
      { label: '이번 달 상담', value: 1096, unit: '건', delta: '▲ 734건', hero: true },
      { label: 'AI 1차 해결', value: 78, unit: '%', f: 'pct', delta: '▲ 9%p' },
      { label: '첫 응답 시간', value: 9, unit: '초', delta: '사람 평균 12분', tone: 'flat' },
      { label: '담당자 연결', value: 241, unit: '건', delta: 'AS·교환 위주', tone: 'flat' },
    ],
    body: () => [
      card('일별 상담 처리', line({ series: [{ name: '담당자 연결', data: [9, 7, 11, 8, 6, 10, 9], color: INK }], bars: { name: 'AI 해결', data: [31, 28, 40, 36, 30, 44, 38], color: I3 }, labels: ['월', '화', '수', '목', '금', '토', '일'] }), { span: 2, tag: '건' }),
      card('문의 유형', donut([{ name: '배송 조회', v: 41, color: I }, { name: 'AS 접수', v: 24, color: INK }, { name: '교환·반품', v: 21, color: I2 }, { name: '기타', v: 14, color: I3 }], { center: '<b>1,096</b>', sub: EN ? 'inquiries' : '건' })),
      card('최근 상담', table(['고객', '채널', '유형', '처리', '시간'], [
        ['김○진', '네이버 톡톡', '배송 조회', pill('ok', 'AI 해결'), '9초'],
        ['최○우', '자사몰 채팅', 'AS 접수', pill('run', '담당자 연결'), '14초'],
        ['정○희', '전화', '교환 문의', pill('ok', 'AI 해결'), '22초'],
        ['오○민', '네이버 톡톡', '대량 구매', pill('wait', '담당자 확인'), '11초'],
      ]), { span: 3 }),
    ],
  },
];

// 메뉴마다 맞는 아이콘 (20×20 선 아이콘)
const svgI = (body) => `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const IC = {
  grid: svgI('<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/>'),
  truck: svgI('<path d="M2.5 5.5h9v8h-9z"/><path d="M11.5 8.5h3l2.5 2.6v2.4h-5.5"/><circle cx="6" cy="14.5" r="1.6"/><circle cx="14" cy="14.5" r="1.6"/>'),
  boxes: svgI('<path d="M10 2.8l6.2 3.2v7.9L10 17.2 3.8 14V6z"/><path d="M3.8 6L10 9.2 16.2 6"/><path d="M10 9.2v8"/>'),
  chart: svgI('<path d="M3 16.5h14"/><path d="M4 13l4-4 3 2.6L16.5 5.5"/><path d="M12.8 5.5h3.7v3.7"/>'),
  coins: svgI('<ellipse cx="8" cy="6" rx="5" ry="2.2"/><path d="M3 6v3.6c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2V6"/><path d="M7.2 13.6c.3 1.1 2.3 1.9 4.8 1.9 2.8 0 5-1 5-2.2V9.7c0-1-1.5-1.9-3.6-2.1"/>'),
  ledger: svgI('<path d="M5 2.8h8.5l2 2v12.4H5z"/><path d="M8 7h5M8 10h5M8 13h3"/><path d="M5 2.8v14.4"/>'),
  chat: svgI('<path d="M3.2 5.2a2 2 0 012-2h9.6a2 2 0 012 2v6.4a2 2 0 01-2 2H9.2L5.6 16.6v-3H5.2a2 2 0 01-2-2z"/><path d="M7 7.6h6M7 10.2h4"/>'),
  wrench: svgI('<path d="M12.6 3.2a3.8 3.8 0 00-4.8 4.9L3.5 12.4a1.6 1.6 0 002.2 2.2L10 10.3a3.8 3.8 0 004.9-4.8l-2.2 2.2-2-.6-.6-2z"/>'),
  report: svgI('<path d="M5 2.8h7l3 3v11.4H5z"/><path d="M12 2.8v3h3"/><path d="M8 14v-3M10.5 14V9M13 14v-1.8"/>'),
  fx: svgI('<path d="M4 7h11l-3-3"/><path d="M16 13H5l3 3"/>'),
  pie: svgI('<path d="M10 3a7 7 0 107 7h-7z"/><path d="M12.5 2.6v5h5a5.6 5.6 0 00-5-5z"/>'),
  phone: svgI('<rect x="5.5" y="2.5" width="9" height="15" rx="2"/><path d="M8.6 14.6h2.8"/><path d="M8 7.6l1.6 1.6L12.6 6"/>'),
  spark: svgI('<path d="M9 2.8l1.4 4.1 4.1 1.4-4.1 1.4L9 13.8l-1.4-4.1-4.1-1.4 4.1-1.4z"/><path d="M15 12.2l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z"/>'),
  headset: svgI('<path d="M4 11V9.5a6 6 0 0112 0V11"/><rect x="3" y="10.5" width="3" height="4.5" rx="1"/><rect x="14" y="10.5" width="3" height="4.5" rx="1"/><path d="M15.5 15c0 1.4-1.5 2.2-3.5 2.2h-1"/>'),
  inbox: svgI('<path d="M3 11.5l2-7h10l2 7v4.5H3z"/><path d="M3 11.5h4l1 2h4l1-2h4"/>'),
};
const NAV_MAP = { '대시보드': 'grid', '발주·입고': 'truck', '발주': 'truck', '재고·출고': 'boxes', '매출': 'chart', '매출·순이익': 'chart', '정산': 'coins', '고객상담': 'chat', '상담·AS': 'wrench', '리포트': 'report', '장부 대조': 'ledger', '환율·요율': 'fx', '수익 분배': 'pie', '직원 입력': 'phone', '상담함': 'inbox', 'AI 답변 설정': 'spark', '상담원': 'headset' };
const navIc = (n) => IC[NAV_MAP[n]] || IC.grid;

export function board(s) {
  return `<div class="board" data-sample="${s.id}">
    <aside class="b-side">
      <div class="b-logo"><svg class="logo-svg" aria-label="OFF8"><use href="#off8-logo"/></svg><span>${T('워크스페이스')}</span></div>
      <nav>${s.nav.map((n, i) => `<span class="${i === s.active ? 'is-on' : ''}">${navIc(n)}${T(n)}</span>`).join('')}</nav>
      <div class="b-side-foot"><i class="b-live"></i>${T('엑셀 동기화 · 3분 전')}</div>
    </aside>
    <div class="b-main">
      <header class="b-top"><div><h3>${T(s.title)}</h3><p>${T(s.sub)}</p></div><span class="b-date">${T('2026.11.15 (일)')}</span></header>
      <div class="b-kpis">${s.kpis.map(kpi).join('')}</div>
      <div class="b-grid">${s.body().join('')}</div>
    </div>
  </div>`;
}
