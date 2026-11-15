// Beam 시리즈(libraries.dev, MIT) 연결: 테두리 빛 · 생각하는 구슬 · 음성 링 · 음성 빛
// React 컴포넌트를 일반 HTML 위에 작은 섬처럼 올립니다. vendor 폴더에 함께 넣어 외부 서버 없이 동작합니다.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BorderBeam } from 'border-beam';
import { ThinkingOrb } from 'thinking-orbs';
import { VoiceRing } from 'voice-ring';
import { VoiceBeam } from 'voice-glow';

const h = React.createElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 이미 있는 요소를 React 감싸개 안으로 옮겨 넣습니다 (요소와 이벤트는 그대로 유지)
function wrap(el, Comp, props) {
  const cs = getComputedStyle(el);
  const host = document.createElement('div');
  host.className = 'island ' + (el.dataset.islandClass || '');
  host.style.display = cs.display.startsWith('inline') ? 'inline-block' : cs.display === 'grid' ? 'block' : 'block';
  el.before(host);
  const Slot = () => {
    const ref = React.useRef(null);
    React.useLayoutEffect(() => { ref.current.appendChild(el); }, []);
    return h('div', { ref, style: { display: 'contents' } });
  };
  const root = createRoot(host);
  const render = (p) => root.render(h(Comp, { borderRadius: parseFloat(cs.borderTopLeftRadius) || undefined, ...props, ...p }, h(Slot)));
  render({});
  return { render, host };
}

// data-beam="md | sm | line | pulse-inner | pulse-outside"
export function mountBeams(scope = document) {
  scope.querySelectorAll('[data-beam]:not([data-beam-done])').forEach((el) => {
    el.dataset.beamDone = '1';
    const size = el.dataset.beam || 'md';
    const light = el.dataset.beamTheme === 'light';
    const ctl = wrap(el, BorderBeam, {
      size,
      colorVariant: el.dataset.beamColor || 'ocean',
      theme: light ? 'light' : 'dark',
      strength: +(el.dataset.beamStrength || 1),
      duration: el.dataset.beamDuration ? +el.dataset.beamDuration : undefined,
      brightness: size === 'pulse-outside' ? undefined : 1.7,
      active: !reduced,
    });
    el._beam = ctl;
  });
}
export const setBeamActive = (el, on) => el?._beam?.render({ active: on && !reduced });

// 생각하는 구슬: 상태를 바꿀 때마다 다시 그립니다
export function orb(host, { state = 'working', size = 20, theme = 'dark' } = {}) {
  const root = createRoot(host);
  let cur = { state, size, theme };
  const draw = () => root.render(h(ThinkingOrb, { ...cur, 'aria-label': host.getAttribute('aria-label') || undefined, paused: reduced }));
  draw();
  return { set: (p) => { cur = { ...cur, ...p }; draw(); } };
}

// 음성 링: level 은 0~1 값을 매 프레임 읽어 가는 함수
export function voiceRing(host, { size = 260, level, direction }) {
  const root = createRoot(host);
  let cur = { state: 'idle', emotion: 'calm', stream: null };
  const draw = () => root.render(h(VoiceRing, { size, theme: 'dark', level, direction, hoverBend: true, sensitivity: 0.9, ...cur }));
  draw();
  return { set: (p) => { cur = { ...cur, ...p }; draw(); } };
}

// 음성 빛: 요소 아래쪽 가장자리에서 목소리 크기만큼 솟아오르는 빛
export function voiceBeam(el, { level, type = 'default' }) {
  const ctl = wrap(el, VoiceBeam, { level, type, colorVariant: 'ocean', theme: 'dark', idle: 0.12, flow: 60 });
  return { set: (p) => ctl.render(p) };
}
