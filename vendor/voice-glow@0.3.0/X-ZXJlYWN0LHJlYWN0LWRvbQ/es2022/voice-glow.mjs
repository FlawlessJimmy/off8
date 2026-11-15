/* esm.sh - voice-glow@0.3.0 */
import{jsxs as Xe,Fragment as sa,jsx as B}from"react/jsx-runtime";import{forwardRef as Za,useId as Ja,useRef as fe,useState as Z,useEffect as ee,useCallback as tt,useMemo as la}from"react";function fa(t){let e=t.trim(),a=e.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(a){let o=a[1].length===3?a[1].split("").map(n=>n+n).join(""):a[1];return[parseInt(o.slice(0,2),16),parseInt(o.slice(2,4),16),parseInt(o.slice(4,6),16)]}let i=e.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);return i?[Math.round(+i[1]),Math.round(+i[2]),Math.round(+i[3])]:null}function Ya(t){let e=fa(t);return e?`rgb(${e[0]}, ${e[1]}, ${e[2]})`:null}function Ze(t){let e=fa(t);return e?`${e[0]}, ${e[1]}, ${e[2]}`:null}var Qa={dark:{strokeOpacity:1.16,innerOpacity:.47,bloomOpacity:.89,innerShadow:"rgba(255, 255, 255, 0.1)",saturation:1.2,brightness:1.1},light:{strokeOpacity:1.2,innerOpacity:.85,bloomOpacity:.5,innerShadow:"rgba(0, 0, 0, 0.08)",saturation:1.6,brightness:.95,hueRange:40,hueDuration:8.5,hueBase:5,strength:.8,bandStrength:1.7}},le=[{x:0,w:74,h:46,band:0},{x:-36,w:54,h:40,band:1},{x:36,w:54,h:40,band:1},{x:-72,w:48,h:32,band:2},{x:72,w:48,h:32,band:2},{x:-108,w:42,h:26,band:1},{x:108,w:42,h:26,band:1}],er=36,tr=er*le.length,ar={colorful:{dark:["rgb(255, 70, 120)","rgb(60, 190, 255)","rgb(175, 70, 255)","rgb(60, 220, 130)","rgb(255, 150, 40)","rgb(90, 100, 255)","rgb(40, 200, 190)"],light:["rgb(255, 201, 21)","rgb(126, 196, 255)","rgb(180, 40, 230)","rgb(235, 100, 160)","rgb(255, 176, 122)","rgb(154, 160, 255)","rgb(127, 217, 238)"]},mono:{dark:["rgb(215, 215, 215)","rgb(180, 180, 180)","rgb(190, 190, 190)","rgb(160, 160, 160)","rgb(170, 170, 170)","rgb(150, 150, 150)","rgb(155, 155, 155)"],light:["rgb(60, 60, 60)","rgb(90, 90, 90)","rgb(85, 85, 85)","rgb(110, 110, 110)","rgb(105, 105, 105)","rgb(125, 125, 125)","rgb(120, 120, 120)"]},ocean:{dark:["rgb(80, 140, 255)","rgb(40, 200, 230)","rgb(120, 90, 255)","rgb(30, 170, 210)","rgb(160, 80, 240)","rgb(60, 110, 255)","rgb(40, 190, 180)"],light:["rgb(40, 100, 240)","rgb(20, 160, 200)","rgb(90, 60, 230)","rgb(20, 130, 180)","rgb(130, 50, 220)","rgb(40, 80, 230)","rgb(20, 150, 150)"]},sunset:{dark:["rgb(255, 110, 60)","rgb(255, 180, 40)","rgb(255, 60, 90)","rgb(255, 210, 80)","rgb(240, 70, 140)","rgb(255, 140, 50)","rgb(230, 50, 110)"],light:["rgb(235, 80, 30)","rgb(230, 150, 10)","rgb(230, 30, 70)","rgb(225, 175, 30)","rgb(215, 40, 110)","rgb(235, 110, 20)","rgb(205, 30, 90)"]},forest:{dark:["rgb(70, 220, 120)","rgb(40, 200, 180)","rgb(140, 230, 80)","rgb(30, 170, 140)","rgb(190, 235, 70)","rgb(50, 190, 110)","rgb(30, 150, 120)"],light:["rgb(30, 170, 80)","rgb(20, 150, 130)","rgb(90, 180, 30)","rgb(20, 130, 100)","rgb(130, 180, 20)","rgb(30, 150, 80)","rgb(20, 120, 90)"]},candy:{dark:["rgb(255, 90, 170)","rgb(255, 120, 220)","rgb(210, 80, 255)","rgb(255, 150, 190)","rgb(180, 110, 255)","rgb(255, 70, 140)","rgb(230, 100, 240)"],light:["rgb(235, 40, 140)","rgb(230, 70, 190)","rgb(180, 40, 230)","rgb(235, 100, 160)","rgb(150, 70, 230)","rgb(230, 30, 110)","rgb(200, 60, 210)"]},ice:{dark:["rgb(150, 230, 255)","rgb(90, 200, 255)","rgb(190, 240, 255)","rgb(120, 190, 255)","rgb(160, 220, 250)","rgb(80, 170, 255)","rgb(200, 235, 255)"],light:["rgb(30, 160, 220)","rgb(20, 130, 210)","rgb(60, 180, 230)","rgb(40, 120, 220)","rgb(50, 160, 220)","rgb(20, 110, 220)","rgb(70, 170, 230)"]},gold:{dark:["rgb(255, 200, 70)","rgb(255, 170, 40)","rgb(255, 220, 110)","rgb(240, 150, 30)","rgb(255, 235, 140)","rgb(230, 160, 40)","rgb(250, 210, 90)"],light:["rgb(200, 140, 10)","rgb(190, 120, 0)","rgb(210, 160, 30)","rgb(180, 110, 0)","rgb(205, 170, 40)","rgb(175, 115, 5)","rgb(195, 150, 20)"]}};function rr(t,e){let a=t.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);return a?`rgba(${a[1]}, ${a[2]}, ${a[3]}, ${e.toFixed(2)})`:t}function yt(t,e=1){return Math.max(.5,Math.round(t*e*100)/100)}function or(t,e){return`calc(50% + (var(--vb-cx-${e}) + var(--vb-x${t}-${e})) * var(--vb-w-${e}) * var(--vb-z-${e}, 1))`}function xt({id:t,colors:e,alpha:a,sw:i,sh:o,y:n,fade:r,count:l}){return(l?le.slice(0,l):le).map((s,d)=>{let g=a>=1?e[d%e.length]:rr(e[d%e.length],a),v=`calc(${Math.round(s.w*i)}px * var(--vb-w-${t}) * var(--vb-z-${t}, 1))`,f=`calc(${Math.round(s.h*o)}px * var(--vb-h-${t}) * var(--vb-l${d}-${t}) * var(--vb-z-${t}, 1))`,h=`calc(100% + (${n}px + var(--vb-y${d}-${t})) * var(--vb-z-${t}, 1))`;return`radial-gradient(ellipse ${v} ${f} at ${or(d,t)} ${h}, ${g} 0%, transparent ${r}%)`}).join(`,
    `)}function ir(t){let{id:e,borderRadius:a,borderWidth:i,strokeOpacity:o,innerOpacity:n,bloomOpacity:r,innerShadow:l,colorVariant:s,colors:d,brightness:g,saturation:v,theme:f,hueBase:h=0,glowSize:p=1,glowWidth:C=1,glowHeight:O=1,strokeScale:S=1,innerScale:H=1,innerHeight:D=1,bloomScale:I=1,bloomHeight:E=1,coreSize:G=1,coreLight:N=0,coreLightWidth:U=1,coreLightHeight:te=1,rangeWidth:T=1,rangeHeight:J=1,softness:ae=1,distortion:W=!1,scale:V=1}=t,A=Math.round(28*V*10)/10,j=Math.round(9*V*10)/10,z=Math.max(0,a-i),c=Math.round(Math.max(40,Math.min(95,70*ae))),L=w=>C*w,y=w=>O*w,k=w=>Math.round(w*10)/10,m=`var(--vb-z-${e}, 1)`,$=w=>`calc(${k(w)}px * ${m})`,b=f==="dark",R=ar[s][b?"dark":"light"].map((w,F)=>{let q=d?.[F];return q&&Ya(q)||w}),Y=s==="mono"?.6:1,$e=(o*Y).toFixed(2),we=(n*Y).toFixed(2),Ce=(r*Y).toFixed(2),re=g.toFixed(2),oe=v.toFixed(2),ie=`hue-rotate(calc(var(--voice-hue-base, ${h}deg) + var(--vb-hue-${e})))`,Oe=W?` url(#vb-distort-${e})`:"",Te=`filter: ${ie} brightness(${re}) saturate(${oe});`,rt=`filter: ${ie} brightness(${re}) saturate(${oe})${Oe};`,ot=`filter: blur(${$(yt(10,p))}) ${ie} brightness(${re}) saturate(${oe});`,it=`filter: blur(${$(yt(10,p))}) ${ie} brightness(${re}) saturate(${oe})${Oe};`,be=`calc(50% + var(--vb-cx-${e}) * var(--vb-w-${e}) * ${m})`,ze=`calc(100% + (2px + var(--vb-cy-${e})) * ${m})`,nt=b?`radial-gradient(ellipse calc(${k(30*G)}px * var(--vb-w-${e}) * ${m}) calc(${k(30*G)}px * var(--vb-h-${e}) * ${m}) at ${be} ${ze}, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.14) 30%, transparent 65%)`:`radial-gradient(ellipse calc(${k(40*G)}px * var(--vb-w-${e}) * ${m}) calc(${k(30*G)}px * var(--vb-h-${e}) * ${m}) at ${be} ${ze}, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.22) 35%, transparent 70%)`,st=xt({id:e,colors:R,alpha:1,sw:L(S),sh:y(S),y:2,fade:c}),lt=xt({id:e,colors:R,alpha:.46,sw:L(.9*H),sh:y(.9*H*D),y:0,fade:c}),dt=xt({id:e,colors:R,alpha:b?.9:.7,sw:L(1.15*I),sh:y(1.5*I*E),y:0,fade:Math.min(95,c+2)}),ne=(w,F,q,Q=0)=>`radial-gradient(ellipse calc(${k(w*T)}px * var(--vb-w-${e}) * var(--vb-mw-${e}) * ${m}) calc((${k(F*J)}px * var(--vb-h-${e}) + var(--vb-bh-${e})) * ${m}) at ${be} calc(100% + var(--vb-cy-${e}) * ${m}), white 0%, rgba(255, 255, 255, 0.5) ${q}%${Q>0?`, rgba(255, 255, 255, ${Q}) 85%`:""}, transparent 100%)`,ue=(w,F)=>`opacity: calc(var(--vb-opacity-${e}, 1) * var(--vb-glow-${e}) * ${F} * var(--voice-${w}-opacity, 1) * var(--voice-strength, 1));`,Fe=(w,F,q,Q)=>`${w} {
  ${F}
  position: absolute;
  inset: 0;
  border-radius: ${$(a)};
  background: ${lt};
  box-shadow: inset 0 0 ${$(j)} 1px ${l};
  -webkit-mask-image:
    ${ne(170,64,45,.3)},
    linear-gradient(white, transparent ${$(A)}, transparent calc(100% - ${A}px * ${m}), white),
    linear-gradient(to right, white, transparent ${$(A)}, transparent calc(100% - ${A}px * ${m}), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    ${ne(170,64,45,.3)},
    linear-gradient(white, transparent ${$(A)}, transparent calc(100% - ${A}px * ${m}), white),
    linear-gradient(to right, white, transparent ${$(A)}, transparent calc(100% - ${A}px * ${m}), white);
  mask-composite: intersect, add;
  pointer-events: none;
  /* Its own compositing layer: WebKit otherwise re-rasterizes the
     filtered layer into the parent every frame on the CPU (a phone-sized
     host runs at a sixth of the frame rate without this). */
  will-change: transform;
  z-index: 1;
  ${q}
  ${ue("inner",we)}
  ${Q}
}`;return`
@property --vb-opacity-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-voice-beam="${e}"] {
  position: relative;
  border-radius: ${a}px;
  overflow: hidden;
  --vb-h-${e}: 0.8;
  --vb-w-${e}: 1;
${le.map((w,F)=>`  --vb-x${F}-${e}: ${w.x}px;
  --vb-l${F}-${e}: 1;
  --vb-y${F}-${e}: 0px;`).join(`
`)}
  --vb-glow-${e}: 0.4;
  --vb-z-${e}: 1;
  --vb-cx-${e}: 0px;
  --vb-cy-${e}: 0px;
  --vb-bh-${e}: 0px;
  --vb-bendA-${e}: 0;
  --vb-mw-${e}: 1;
  --vb-hue-${e}: 0deg;
  --vb-level-${e}: 0;
}

[data-voice-beam="${e}"][data-active] {
  animation: vb-fade-in-${e} 0.6s ease forwards;
}

[data-voice-beam="${e}"][data-fading] {
  animation: vb-fade-out-${e} 0.5s ease forwards;
}

/* Stroke \u2014 the colours painted into the 1px edge ring, masked to the centred ellipse. */
[data-voice-beam="${e}"][data-active]::after,
[data-voice-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${$(z)};
  padding: ${$(i)};
  clip-path: inset(0 round ${$(a)});
  background:
    ${nt},
    ${st};
  -webkit-mask:
    ${ne(170,64,45)},
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    ${ne(170,64,45)},
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  /* Its own compositing layer: WebKit otherwise re-rasterizes the
     filtered layer into the parent every frame on the CPU (a phone-sized
     host runs at a sixth of the frame rate without this). */
  will-change: transform;
  z-index: 2;
  ${ue("stroke",$e)}
  ${Te}
}

/* Inner glow \u2014 soft light inside the element, faded off at the corners.
   With distortion on, this copy is clipped to ABOVE the band line (the
   polygon the driver writes each frame) and a mirror layer below carries
   the displacement filter, so only the glow under the line warps. */
${Fe(`[data-voice-beam="${e}"][data-active]::before,
[data-voice-beam="${e}"][data-fading]::before`,'content: "";',W?`clip-path: var(--vb-clip-above-${e}, inset(0 round ${a}px));`:`clip-path: inset(0 round ${a}px);`,Te)}
${W?Fe(`[data-voice-beam="${e}"][data-active] [data-voice-beam-warp="inner"],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-warp="inner"]`,"display: block;",`clip-path: var(--vb-clip-below-${e}, inset(0 round ${a}px));`,rt):""}

/* Bloom \u2014 the blurred halo, tallest of the three, above the content. */
[data-voice-beam="${e}"] [data-voice-beam-bloom],
[data-voice-beam="${e}"] [data-voice-beam-warp] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${$(z)};
  pointer-events: none;
  /* Its own compositing layer: WebKit otherwise re-rasterizes the
     filtered layer into the parent every frame on the CPU (a phone-sized
     host runs at a sixth of the frame rate without this). */
  will-change: transform;
  opacity: 0;
}

[data-voice-beam="${e}"] [data-voice-beam-bloom],
[data-voice-beam="${e}"] [data-voice-beam-warp="bloom"] {
  -webkit-mask: ${ne(200,130,35)};
  mask: ${ne(200,130,35)};
  background: ${dt};
  z-index: 3;
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-bloom] {
  display: block;
  clip-path: ${W?`var(--vb-clip-above-${e}, inset(0 round ${a}px))`:`inset(0 round ${a}px)`};
  ${ue("bloom",Ce)}
  ${ot}
}
${W?`
[data-voice-beam="${e}"][data-active] [data-voice-beam-warp="bloom"],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-warp="bloom"] {
  display: block;
  clip-path: var(--vb-clip-below-${e}, inset(0 round ${a}px));
  ${ue("bloom",Ce)}
  ${it}
}

/* Processing drops the distortion: the driver marks the wrapper once the
   warp has faded out, the warp layers leave the paint and the base layers
   give up their split at the band line. */
[data-voice-beam="${e}"][data-voice-warp="off"]::before,
[data-voice-beam="${e}"][data-voice-warp="off"] [data-voice-beam-bloom] {
  clip-path: inset(0 round ${a}px);
}

[data-voice-beam="${e}"][data-voice-warp="off"] [data-voice-beam-warp] {
  display: none;
}`:""}

/* Epicentre \u2014 a soft white wash at the source, under the band line (the
   driver's clip; unclipped when no line is drawn), sitting above every
   glow layer and the band's halo so the centre reads lighter than the
   band (same z as the band canvases, painted after them). Sized by the voice like the
   other layers; off unless \`coreLight\` is set (the light theme sets it).
   Up to 1 it is the wash's opacity; past 1 the solid white core widens
   too, for a centre that stays lighter than a strong band. It follows the
   glow's presence but not \`strength\`, which would only dim it. */
${N>0?(()=>{let w=Math.max(0,Math.min(2,N-1)),F=Math.min(1,w),q=Math.max(0,w-1),Q=1+.3*w,ct=k(45*F+27*q),ht=k(40+25*F+15*q),bt=Math.min(1,.55+.35*F+.1*q).toFixed(2),ut=k(72+14*F+8*q);return`[data-voice-beam="${e}"] [data-voice-beam-core] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${$(z)};
  overflow: hidden;
  pointer-events: none;
  /* Its own compositing layer: WebKit otherwise re-rasterizes the
     filtered layer into the parent every frame on the CPU (a phone-sized
     host runs at a sixth of the frame rate without this). */
  will-change: transform;
  /* The blur sits on this wrapper and the band-line clip on the child,
     so the cut edge is blurred too rather than left hard. */
  filter: blur(${$(yt(8,p))});
  z-index: 4;
}

[data-voice-beam="${e}"] [data-voice-beam-core] > div {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse calc(${k(120*U*Q*V)}px * var(--vb-w-${e}) * ${m}) calc((${k(70*te*Q*V)}px * var(--vb-h-${e}) + var(--vb-bh-${e})) * ${m}) at ${be} calc(100% + var(--vb-cy-${e}) * ${m}), white 0%, white ${ct}%, rgba(255, 255, 255, ${bt}) ${ht}%, transparent ${ut}%);
  clip-path: var(--vb-clip-below-${e}, none);
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-core],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-core] {
  display: block;
  opacity: calc(var(--vb-opacity-${e}, 1) * min(1, var(--vb-glow-${e}) * ${Math.min(1,N).toFixed(2)} * ${(1.6+1.4*w).toFixed(2)}) * var(--voice-core-light-opacity, 1));
}
`})():""}
/* Band \u2014 the canvas the driver draws the bend's contour on: an organic
   bell with chromatic fringes. Fades with the root, follows the strength
   and turns with the hue drift like the other layers. */
[data-voice-beam="${e}"] [data-voice-beam-band],
[data-voice-beam="${e}"] [data-voice-beam-band-halo] {
  display: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Its own compositing layer: WebKit otherwise re-rasterizes the
     filtered layer into the parent every frame on the CPU (a phone-sized
     host runs at a sixth of the frame rate without this). */
  will-change: transform;
  z-index: 4;
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-band],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-band],
[data-voice-beam="${e}"][data-active] [data-voice-beam-band-halo],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-band-halo] {
  display: block;
  opacity: calc(var(--vb-opacity-${e}, 1) * var(--voice-band-opacity, 1) * var(--voice-strength, 1));
  /* The blur vars are 0 where the canvas blurs its own strokes; where the
     2D context has no filter (WebKit) the driver sets them and the layers
     are blurred here instead \u2014 the ridge on the band canvas, its wider
     halo on the canvas beneath. */
  filter: blur(var(--vb-band-blur-${e}, 0px)) ${ie} brightness(${re}) saturate(${oe});
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-band-halo],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-band-halo] {
  filter: blur(var(--vb-band-halo-blur-${e}, 0px)) ${ie} brightness(${re}) saturate(${oe});
}

/* Resolution. The soft layers \u2014 inner light and its warp mirror, bloom and
   its mirror, the epicentre \u2014 are rastered at half size and scaled back
   up by the compositor: the box is halved, every length inside rides the
   layer's factor \`--vb-z\` at 0.5 (the driver also writes the band-line
   clips at half scale), and the will-change transform is rastered
   pre-scale where the engine does that (Chromium, Safari 18). For blurred
   gradients that is the same picture at a quarter of the raster and
   filter work, which is what a phone at 3x runs out of. The 1px stroke
   stays full-res on every screen: at half size it is half a CSS pixel,
   which a 3x phone rasters into a faint smear instead of the hairline,
   and the layer is cheap (no blur). The component sets
   \`data-voice-halfres\`. */
[data-voice-beam="${e}"][data-voice-halfres]::before,
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-warp],
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-core] {
  --vb-z-${e}: 0.5;
  inset: auto;
  left: 0;
  top: 0;
  width: 50%;
  height: 50%;
  transform: translateZ(0) scale(2);
  transform-origin: 0 0;
}
${W?`[data-voice-beam="${e}"][data-voice-halfres][data-active]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-fading]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-active] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-voice-halfres][data-fading] [data-voice-beam-bloom] {
  clip-path: var(--vb-clip-above-z-${e}, inset(0 round ${$(a)}));
}
[data-voice-beam="${e}"][data-voice-halfres][data-active] [data-voice-beam-warp],
[data-voice-beam="${e}"][data-voice-halfres][data-fading] [data-voice-beam-warp] {
  clip-path: var(--vb-clip-below-z-${e}, inset(0 round ${$(a)}));
}
/* Processing (warp off): the mirrors are gone, so the base layers paint
   the whole box again \u2014 this must outweigh the split above. */
[data-voice-beam="${e}"][data-voice-halfres][data-voice-warp="off"]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-voice-warp="off"] [data-voice-beam-bloom] {
  clip-path: inset(0 round ${$(a)});
}`:`[data-voice-beam="${e}"][data-voice-halfres][data-active]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-fading]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-active] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-voice-halfres][data-fading] [data-voice-beam-bloom] {
  clip-path: inset(0 round ${$(a)});
}`}
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-core] > div {
  clip-path: var(--vb-clip-below-z-${e}, none);
}
@keyframes vb-fade-in-${e} {
  to { --vb-opacity-${e}: 1; }
}

@keyframes vb-fade-out-${e} {
  from { --vb-opacity-${e}: 1; }
  to { --vb-opacity-${e}: 0; }
}

[data-voice-beam="${e}"][data-paused],
[data-voice-beam="${e}"][data-paused]::after,
[data-voice-beam="${e}"][data-paused]::before,
[data-voice-beam="${e}"][data-paused] [data-voice-beam-bloom] {
  animation-play-state: paused !important;
}
`}var Se=null;function ma(){if(typeof window>"u")return null;let t=window;return t.AudioContext??t.webkitAudioContext??null}function to(){return ma()!=null}function $a(){let t=ma();return t?(Se||(Se=new t),Se.state==="suspended"&&Se.resume().catch(()=>{}),Se):null}var Mt=new WeakMap;function nr(t){let e=$a();if(!e||t.getAudioTracks().length===0)return null;let a=Mt.get(t);a||(a={node:e.createMediaStreamSource(t),refs:0},Mt.set(t,a)),a.refs+=1;let i=e.createAnalyser();i.fftSize=1024,i.smoothingTimeConstant=.5,a.node.connect(i);let o=!1;return{analyser:i,release:()=>{if(!o){o=!0;try{a.node.disconnect(i)}catch{}if(a.refs-=1,a.refs<=0){try{a.node.disconnect()}catch{}Mt.delete(t)}}}}}var wa={gather:0,offset:0,stretch:0,heldLevel:0,cornerFollow:0},da=new WeakMap;function sr(t){let e=da.get(t);return e||(e={level:0,bands:[0,0,0],phase:0,motion:{...wa},t:0,lastTs:0,warp:1,drift:0,fast:0,fastBands:[0,0,0]},da.set(t,e)),e}var at=new Set;new Float32Array(le.length);new Float32Array(le.length);var me=null,kt=0,lr=1e3/60-2,dr=22,cr=500,hr=4e3,et=0,St=!1,Je=!1,ve=0,ca=0,ya=Math.PI*2,br=5,ur=1.7,gr=[[80,300],[300,2e3],[2e3,6e3]];function pe(t){return t<0?0:t>1?1:t}function vr(t,e){let a=e/2;return((t+a)%e+e)%e-a}function pr(t,e){let a=t/(e/2+4);return Math.max(0,1-a*a)}function ha(t,e){if(t<=e)return 0;let a=(t-e)/Math.max(.001,1-e);return pe((1-Math.exp(-3*a))/(1-Math.exp(-3)))}function ke(t,e,a,i,o){let n=e>t?i:o,r=1-Math.exp(-a/Math.max(.001,n));return t+(e-t)*r}var fr=2,mr=.06,$r=.35,wr=.03,ba=.03,yr=!(typeof navigator<"u"&&/AppleWebKit/.test(navigator.userAgent)&&!/Chrome\/|Chromium\/|Edg\/|OPR\//.test(navigator.userAgent)),ua=.05,xr=6,Mr=12,Sr=.1,ga=.1,kr=170,Cr=64,va=56;function Or(t,e,a,i){let o=t<0?1-i:1+i,n=Math.max(.05,a*o),r=Math.exp(-Math.pow(Math.abs(t)/n,e)),l=Math.exp(-Math.pow(1/n,e));return Math.max(0,(r-l)/(1-l))}function Tr(t,e,a,i,o){if(a<=0||e<=0)return 0;let n=e*Math.max(0,Math.min(.98,i));if(t<=n)return 0;let r=Math.min(1,(t-n)/Math.max(1,e-n));return a*Math.pow(r,Math.max(.5,o))}function xa(t,e,a){return Math.max(0,Math.min(t,e/2,a/2))}function Ct(t,e,a,i=0){if(a<=0)return 0;let o=Math.min(t,e-t)-i;if(o>=a)return 0;if(o<=0)return a;let n=a-o;return a-Math.sqrt(Math.max(0,a*a-n*n))}function zr(t,e,a,i){let o=a/2+e.cx*e.w,n=kr*t.rangeWidth*e.w*e.mw,r=i*.82*Math.min(1,t.scale),l=Math.min(r,(Cr*t.rangeHeight*e.h+e.lift)*t.bandPosition),s=i-t.bandOffset,d=Math.min(1,e.corner*4),g=t.bandTail*(1-d*d*(3-2*d)),v=g>.001,f=v?t.bandTailOverflow:0,h=v?-f:o-n,p=v?a+f:o+n,C=[];for(let O=0;O<=va;O++){let S=h+(p-h)*O/va,H=Math.max(-1,Math.min(1,(S-o)/Math.max(1,n))),D=(S<o?o:a-o)+f,I=Or(H,t.bandCurve,t.bandSpread,t.bandSkew)+Tr(Math.abs(S-o),D,g,t.bandTailPosition,t.bandTailCurve),E=e.corner>0?Ct(S,a,xa(t.radius,a,i))*e.corner:0;C.push([S,s-l*I-E])}return C}function Fr(t,e,a,i,o){for(let[n,r]of[["",1],["-z",.5]]){let l=v=>(v*r).toFixed(1)+"px",s=a.map(([v,f])=>`${l(v)} ${l(f)}`),d=`polygon(0 ${l(o)}, ${s.join(", ")}, ${l(i)} ${l(o)})`,g=`polygon(0 0, ${l(i)} 0, ${l(i)} ${l(o)}, ${s.slice().reverse().join(", ")}, 0 ${l(o)})`;t.style.setProperty(`--vb-clip-below${n}-${e}`,d),t.style.setProperty(`--vb-clip-above${n}-${e}`,g)}}function Wr(t,e,a){let i=a;for(let l=0;l<e.length;l++)e[l][1]<i&&(i=e[l][1]);let o=Math.max(0,Math.min(.9,Math.floor((i-xr)/a/ua)*ua));if(o===t.filterTop)return;t.filterTop=o;let n=1+Math.max(Sr,Mr/a),r=t.filter;r.setAttribute("x",`${-ga*100}%`),r.setAttribute("width",`${(1+2*ga)*100}%`),r.setAttribute("y",`${(o*100).toFixed(0)}%`),r.setAttribute("height",`${((n-o)*100).toFixed(1)}%`)}function Pr(t,e,a){let{canvas:i,ctx:o,el:n,config:r}=t;if(!i||!o)return;let l=n.clientWidth,s=n.clientHeight;if(!l||!s)return;let d=Math.min(fr,typeof window<"u"&&window.devicePixelRatio||1),g=Math.round(l*d),v=Math.round(s*d);(i.width!==g||i.height!==v)&&(i.width=g,i.height=v),o.setTransform(d,0,0,d,0,0),o.clearRect(0,0,l,s);let f=t.haloCanvas,h=t.haloCtx;f&&h&&((f.width!==g||f.height!==v)&&(f.width=g,f.height=v),h.setTransform(d,0,0,d,0,0),h.clearRect(0,0,l,s));let p=Math.min(1,.6*r.bandStrength*e.strength);if(p<.005||r.bandWidth<=0)return;let C=r.theme==="dark",O=r.bandWidth*(1+.35*e.level),S=r.bandAberration*(.35+.65*e.level),H=(4+12*S)*r.scale,D=4*S*r.scale,I=(c,L)=>{o.beginPath(),o.moveTo(a[0][0]+c,a[0][1]+L);for(let y=1;y<a.length;y++)o.lineTo(a[y][0]+c,a[y][1]+L)},E={r:r.bandColors.above,g:r.bandColors.mid,c:r.bandColors.core,b:r.bandColors.below},G=(C?.42:.4)*p,N=14*O,U=3.5*r.bandWidth/2,te=U*d,T=typeof o.filter=="string",J=T?"0px":`${U.toFixed(2)}px`;t.cssBlur!==J&&(n.style.setProperty(`--vb-band-blur-${r.id}`,J),n.style.setProperty(`--vb-band-halo-blur-${r.id}`,T?"0px":`${(U*3).toFixed(2)}px`),t.cssBlur=J);let ae=[[1,.16],[.72,.2],[.46,.26],[.22,.34]],W=[{rgb:E.r,a:1,ox:D,oy:-H},{rgb:E.g,a:.55,ox:D*.35,oy:-H*.35},{rgb:E.b,a:1,ox:-D,oy:H},{rgb:E.c,a:.9,ox:0,oy:0}];o.lineCap="round",o.lineJoin="round",o.globalCompositeOperation="source-over";let V=a[0][0],A=a[a.length-1][0],j=(c,L)=>{let y=o.createLinearGradient(V,0,A,0),k=r.bandTail>0?.015:.18;return y.addColorStop(0,`rgba(${c}, 0)`),y.addColorStop(k,`rgba(${c}, ${L.toFixed(3)})`),y.addColorStop(1-k,`rgba(${c}, ${L.toFixed(3)})`),y.addColorStop(1,`rgba(${c}, 0)`),y},z=!T&&h?h:o;T&&(o.filter=`blur(${(te*3).toFixed(1)}px)`),z.lineCap="round",z.lineJoin="round",z.strokeStyle=j(E.c,G*.3),z.lineWidth=N*2.2,z.beginPath(),z.moveTo(a[0][0],a[0][1]);for(let c=1;c<a.length;c++)z.lineTo(a[c][0],a[c][1]);z.stroke(),T&&(o.filter=`blur(${te.toFixed(1)}px)`);for(let c of W)for(let[L,y]of ae)o.strokeStyle=j(c.rgb,G*c.a*y),o.lineWidth=Math.max(.6,N*L),I(c.ox,c.oy),o.stroke();T&&(o.filter="none"),o.globalCompositeOperation="source-over"}function Ar(t){return(1-Math.cos(ya*t))/2}function Lr(t,e){let a=t.analyser,i=t.time,o=t.freq;a.getFloatTimeDomainData(i);let n=0;for(let l=0;l<i.length;l++)n+=i[l]*i[l];e.level=Math.sqrt(n/i.length)*br*t.config.sensitivity,a.getByteFrequencyData(o);let r=a.context.sampleRate/a.fftSize;for(let l=0;l<3;l++){let[s,d]=gr[l],g=Math.max(0,Math.floor(s/r)),v=Math.min(o.length-1,Math.ceil(d/r)),f=0;for(let p=g;p<=v;p++)f+=o[p];let h=v>=g?f/(v-g+1)/255:0;e.bands[l]=h*ur*t.config.sensitivity}}var he={level:0,bands:[0,0,0]};function Ma(t){me=requestAnimationFrame(Ma);let e=et?t-et:0;if(et=t,St){if(Je=!Je,Je)return;t>=ca&&(St=!1,ve=0)}else e>dr?ve?t-ve>cr&&(St=!0,Je=!1,ca=t+hr):ve=t:ve=0;t-kt<lr||(kt=t,at.forEach(a=>{var i,o;let{el:n,config:r,source:l,s}=a,d=r.paused;if(d&&a.paintedConfig===r)return;let g=d?0:s.lastTs?Math.min(.05,(t-s.lastTs)/1e3):1/60;s.lastTs=t,s.t+=g;let v=s.t;if(!d)if(a.analyser)Lr(a,he);else{let b=l.getLevel?pe(l.getLevel()):0;he.level=b,he.bands[0]=b,he.bands[1]=b*(.72+.28*Math.sin(v*9.1)),he.bands[2]=b*(.6+.4*Math.sin(v*13.7+2))}let f=ha(he.level,r.threshold);s.level=ke(s.level,f,g,r.attack,r.release);for(let b=0;b<3;b++){let R=ha(he.bands[b],r.threshold*.6);s.bands[b]=ke(s.bands[b],R,g,r.attack,r.release*1.15),a.surface&&(s.fastBands[b]=ke(s.fastBands[b],R,g,r.attack*.6,ba))}a.surface&&(s.fast=ke(s.fast,f,g,r.attack*.6,ba));let h=tr*r.lobeSpacing;if(!d){let b=(i=l.getMotion)==null?void 0:i.call(l);s.motion=b?{gather:pe(b.gather),offset:b.offset??0,stretch:pe(b.stretch??0),heldLevel:pe(b.heldLevel??0),cornerFollow:pe(b.cornerFollow??0)}:wa}let p=s.motion,C=p.gather,O=n.clientWidth,S=n.clientHeight,H=r.reducedMotion?0:p.offset*h/2,D=1-C*.6,I=1-C*.45,E=1+C*.3*p.stretch,G=r.reducedMotion?.5:.5+.5*Math.sin(ya*v/r.breatheDuration),N=s.level+(1-s.level)*r.idle*G,U=Math.max(0,Math.min(1,(C-.25)/.75)),te=U*U*(3-2*U),T=Math.max(N,p.heldLevel*te),J=.15+.85*T,ae=.5+r.reach*T,W=(.85+r.spread*T)*E;r.flow!==0&&!r.reducedMotion&&(s.phase=((s.phase+r.flow*T*g)%h+h)%h,s.drift+=r.flow*T*g),n.style.setProperty(`--vb-level-${r.id}`,s.level.toFixed(3)),n.style.setProperty(`--vb-cx-${r.id}`,`${H.toFixed(1)}px`),n.style.setProperty(`--vb-mw-${r.id}`,I.toFixed(3));let V=r.bend*T;n.style.setProperty(`--vb-bh-${r.id}`,`${Math.max(0,V).toFixed(1)}px`);let A=r.bend>0?Math.min(1,V/r.bend):0;n.style.setProperty(`--vb-bendA-${r.id}`,A.toFixed(3));let j={cx:H,w:W,h:ae,mw:I,lift:V,strength:A,level:s.level,corner:C},z=O/2+H*W,c=30*r.scale*W,L=xa(r.radius,O,S),y=C*p.cornerFollow;n.style.setProperty(`--vb-cy-${r.id}`,`${(-Ct(z,O,L,c*1.4)*y).toFixed(1)}px`),s.warp=ke(s.warp,C>.02?0:1,g,$r,mr);let k=s.warp,m=a.displace!=null&&k<wr;if(m!==a.warpOff&&(a.warpOff=m,m?n.setAttribute("data-voice-warp","off"):n.removeAttribute("data-voice-warp")),O&&S&&(a.ctx||a.displace)){let b=zr(r,j,O,S);(a.displace&&!m||r.coreLight>0)&&Fr(n,r.id,b,O,S),a.filter&&!m&&yr&&Wr(a,b,S),a.ctx&&Pr(a,j,b)}if(a.displace&&!m){let b=r.reducedMotion?0:r.distortion*120*r.scale*(.15+.85*T)*k;a.displace.scale.baseVal=b,a.noiseShift&&(a.noiseShift.dx.baseVal=8*r.scale*Math.sin(v*.9),a.noiseShift.dy.baseVal=4*r.scale*Math.sin(v*.6+1.3))}n.style.setProperty(`--vb-glow-${r.id}`,J.toFixed(3)),n.style.setProperty(`--vb-h-${r.id}`,ae.toFixed(3)),n.style.setProperty(`--vb-w-${r.id}`,W.toFixed(3));for(let b=0;b<le.length;b++){let R=le[b],Y=vr(R.x*r.lobeSpacing+s.phase,h),$e=r.bands?.6+.7*s.bands[R.band]:1;n.style.setProperty(`--vb-x${b}-${r.id}`,`${(Y*D).toFixed(1)}px`),n.style.setProperty(`--vb-l${b}-${r.id}`,($e*pr(Y,h)).toFixed(3));let we=O/2+(H+Y*D)*W;n.style.setProperty(`--vb-y${b}-${r.id}`,`${(-Ct(we,O,L,c)*y).toFixed(1)}px`)}let $=r.staticColors||r.reducedMotion||r.hueRange===0?0:-r.hueRange+2*r.hueRange*Ar(v/r.hueDuration);n.style.setProperty(`--vb-hue-${r.id}`,`${$.toFixed(2)}deg`),(o=a.onLevel)==null||o.call(a,s.level),a.paintedConfig=r}))}function Hr(){me==null&&(kt=0,et=0,ve=0,me=requestAnimationFrame(Ma))}function Dr(){at.size===0&&me!=null&&(cancelAnimationFrame(me),me=null)}function Er(t,e,a,i){let o={el:t,config:e,source:a,onLevel:i,analyser:null,releaseAnalyser:null,time:null,freq:null,canvas:null,ctx:null,haloCanvas:null,haloCtx:null,displace:null,noiseShift:null,filter:null,filterTop:-1,s:sr(t),paintedConfig:null,cssBlur:null,warpOff:t.hasAttribute("data-voice-warp"),surface:null};e.distortion>0&&(o.displace=t.querySelector(":scope > svg feDisplacementMap"),o.noiseShift=t.querySelector(":scope > svg feOffset"),o.filter=t.querySelector(":scope > svg filter"));let n=t.querySelector(":scope > [data-voice-beam-band]");if(n){o.canvas=n,o.ctx=n.getContext("2d");let r=t.querySelector(":scope > [data-voice-beam-band-halo]");r&&(o.haloCanvas=r,o.haloCtx=r.getContext("2d"))}if(o.s.lastTs=0,a.stream){let r=nr(a.stream);r&&(o.analyser=r.analyser,o.releaseAnalyser=r.release,o.time=new Float32Array(r.analyser.fftSize),o.freq=new Uint8Array(r.analyser.frequencyBinCount))}return at.add(o),Hr(),()=>{var r;at.delete(o),(r=o.releaseAnalyser)==null||r.call(o),Dr()}}var Rr={scale:1,glowSize:1,strokeOpacity:1,innerOpacity:1,bloomOpacity:1,idle:.18,reach:1.2,spread:1.05,flow:48,bend:60,bandStrength:1.55,bandWidth:2.15,bandPosition:.35,bandCurve:1.75,bandSpread:.87,bandSkew:.12,bandOffset:-27,bandTail:.59,bandTailPosition:.67,bandTailCurve:2.4,bandTailOverflow:15,bandAberration:.89,distortion:.62,distortionDetail:2.3,glowWidth:.65,glowHeight:1.25,lobeSpacing:.85,rangeWidth:.75,rangeHeight:1,softness:1.07,coreSize:1,coreLight:0,coreLightWidth:1,coreLightHeight:1,strokeScale:1,innerScale:1,innerHeight:1,bloomScale:1,bloomHeight:1},qr={default:{},pill:{scale:.45,glowSize:.95,strokeOpacity:1.2,innerOpacity:.85,reach:1.35,spread:1.1,flow:0,bend:23,bandStrength:1.55,bandWidth:1.85,bandCurve:1.95,bandSpread:.38,bandOffset:-16,bandTail:0,distortion:.45,distortionDetail:3,glowWidth:.65,glowHeight:.95,lobeSpacing:.45,rangeWidth:.8,rangeHeight:.7,softness:.88,coreSize:.25,strokeScale:1.25,innerScale:.95,bloomScale:1.05,bloomHeight:2.25},mobile:{scale:1.25,spread:.45,reach:3,flow:60,bend:70,bandWidth:2.4,bandCurve:1.55,bandSpread:.9,bandOffset:-50,bandTail:.62,bandTailPosition:.42,bandTailCurve:2.7,bandTailOverflow:22,bandStrength:1.8,distortionDetail:2,glowWidth:1.15,glowHeight:2.1,lobeSpacing:1.35,rangeWidth:1.25,rangeHeight:1.2,softness:1.1}},Br={default:{brightness:1.15},pill:{brightness:1.35,saturation:1.5},mobile:{strength:1,brightness:1.2,saturation:1.5}},Ir={default:{},pill:{},mobile:{strength:1}};function Gr(t="default",e="dark"){return(e==="light"?Ir[t]:void 0)??Br[t]}var Ur={default:{bandStrength:1.7},pill:{bandStrength:2},mobile:{bandStrength:1.7}};function Vr(t="default",e="dark"){let a=qr[t],i={};return e==="light"&&(a.reach===void 0&&(i.reach=1.8),a.spread===void 0&&(i.spread=.8),a.coreLight===void 0&&(i.coreLight=1.8)),{...Rr,...i,...a,...e==="light"?Ur[t]:void 0}}var Ye={dark:{core:"255, 255, 255",above:"255, 70, 80",mid:"90, 255, 150",below:"80, 140, 255"},light:{core:"197, 139, 255",above:"255, 122, 182",mid:"126, 196, 255",below:"45, 255, 171"}},jr=1,Nr=16,Kr=6e4,pa=typeof navigator<"u"&&/AppleWebKit/.test(navigator.userAgent)&&!/Chrome\/|Chromium\/|Edg\/|OPR\//.test(navigator.userAgent),_r=(()=>{if(typeof document>"u")return!0;let t=document.createElement("canvas").getContext("2d");return!!t&&typeof t.filter=="string"})();function Xr(){let[t,e]=Z(()=>typeof window>"u"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");return ee(()=>{if(typeof window>"u")return;let a=window.matchMedia("(prefers-color-scheme: dark)"),i=o=>e(o.matches?"dark":"light");return a.addEventListener("change",i),()=>a.removeEventListener("change",i)},[]),t}function Zr(){let[t,e]=Z(()=>typeof window>"u"||!window.matchMedia?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches);return ee(()=>{if(typeof window>"u"||!window.matchMedia)return;let a=window.matchMedia("(prefers-reduced-motion: reduce)"),i=o=>e(o.matches);return a.addEventListener("change",i),()=>a.removeEventListener("change",i)},[]),t}function Jr(t,e){return t==="auto"?e:t}var ao=Za(function({children:t,type:e="default",look:a="glow",dotSize:i=1,dotGap:o=1,dotShape:n="round",lineWidth:r=1,lineGap:l=1,linePattern:s="rows",seeThrough:d=!1,texture:g=.6,gravity:v=1,surfaceHeight:f=1,surfaceCurve:h=1,surfaceTail:p=0,surfaceTailPosition:C=.6,surfaceTailCurve:O=2.4,surfaceFade:S=.2,scale:H,stream:D=null,level:I=0,sensitivity:E=3.1,threshold:G=.015,attack:N=.325,release:U=.86,idle:te,breatheDuration:T=5.2,reach:J,spread:ae,bands:W=!0,flow:V,motion:A=null,colorVariant:j="colorful",colors:z,bandColors:c,theme:L="dark",staticColors:y=!1,hueRange:k,hueDuration:m,active:$=!0,paused:b=!1,borderRadius:R,brightness:Y,saturation:$e,glowSize:we,strokeOpacity:Ce,innerOpacity:re,bloomOpacity:oe,bend:ie,bandStrength:Oe,bandWidth:Te,bandPosition:rt,bandCurve:ot,bandSpread:it,bandSkew:be,bandOffset:ze,bandTail:nt,bandTailPosition:st,bandTailCurve:lt,bandTailOverflow:dt,bandAberration:ne,distortion:ue,distortionDetail:Fe,glowWidth:w,glowHeight:F,lobeSpacing:q,rangeWidth:Q,rangeHeight:ct,softness:ht,coreSize:bt,coreLight:ut,coreLightWidth:Sa,coreLightHeight:ka,strokeScale:Ca,innerScale:Oa,innerHeight:Ta,bloomScale:za,bloomHeight:Fa,strength:Wa,className:Pa,style:Aa,css:Ot,onLevel:Tt,onActivate:gt,onDeactivate:vt,onAnimationEnd:pt,...La},ye){let de=Ja().replace(/:/g,"-"),Ha=Xr(),K=Jr(L,Ha),Da=z?z.join("|"):"",Ea=c?[c.core,c.above,c.mid,c.below].join("|"):"",u=Vr(e,K),P=Math.max(.05,H??u.scale),zt=we??u.glowSize,We=Ce??u.strokeOpacity,Pe=re??u.innerOpacity,Ae=oe??u.bloomOpacity,Ft=te??u.idle,Wt=J??u.reach,Pt=ae??u.spread,At=(V??u.flow)*P,Lt=(ie??u.bend)*P,Ht=Oe??u.bandStrength,Dt=(Te??u.bandWidth)*P,Et=rt??u.bandPosition,Rt=ot??u.bandCurve,qt=it??u.bandSpread,Bt=be??u.bandSkew,It=(ze??u.bandOffset)*P,Gt=nt??u.bandTail,Ut=st??u.bandTailPosition,Vt=lt??u.bandTailCurve,jt=(dt??u.bandTailOverflow)*P,Nt=ne??u.bandAberration,Ra=ue??u.distortion,Kt=(Fe??u.distortionDetail)/P,Le=(w??u.glowWidth)*P,He=(F??u.glowHeight)*P,_t=(q??u.lobeSpacing)*P,De=(Q??u.rangeWidth)*P,Ee=(ct??u.rangeHeight)*P,Re=ht??u.softness,qe=(bt??u.coreSize)*P,xe=Math.max(0,Math.min(3,ut??u.coreLight)),Xt=Sa??u.coreLightWidth,Zt=ka??u.coreLightHeight,Be=Ca??u.strokeScale,Ie=Oa??u.innerScale,Ge=Ta??u.innerHeight,Ue=za??u.bloomScale,Ve=Fa??u.bloomHeight,Jt=Zr(),Me=fe(null),[ce,Yt]=Z($),[se,Qt]=Z(!1),[ft,qa]=Z(!0),[Ba,Ia]=Z(null),[Ga,Ua]=Z(0);ee(()=>{if(!pa)return;let x=Me.current;if(!x)return;let M=()=>Ua(x.clientWidth*x.clientHeight);if(M(),typeof ResizeObserver>"u")return;let X=new ResizeObserver(M);return X.observe(x),()=>X.disconnect()},[]);let je="glow",Va=!1,ge=pa&&Ga>Kr?0:Ra;ee(()=>{if(R!=null)return;let x=Me.current;if(!x)return;let M=()=>{let _e=x.firstElementChild;if(!_e)return;let Xa=getComputedStyle(_e),wt=parseFloat(Xa.borderTopLeftRadius);!isNaN(wt)&&wt>0&&Ia(wt)};M();let X=new MutationObserver(M);return X.observe(x,{childList:!0,subtree:!1}),()=>X.disconnect()},[R,t]),ee(()=>{$&&!ce&&!se?Yt(!0):!$&&ce&&!se&&Qt(!0)},[$,ce,se]),ee(()=>{let x=Me.current;if(!x||typeof IntersectionObserver>"u")return;let M=new IntersectionObserver(X=>{for(let _e of X)qa(_e.isIntersecting)},{rootMargin:"256px"});return M.observe(x),()=>M.disconnect()},[]);let ja=tt(x=>{let M=x.animationName;M.includes("fade-out")?(Yt(!1),Qt(!1),vt?.()):M.includes("fade-in")&&gt?.(),pt?.(x)},[gt,vt,pt]),_=Qa[K],Ne=R??Ba??Nr,mt=Gr(e,K),Na=Wa??mt.strength??_.strength??1,ea=k??_.hueRange??24,ta=m??_.hueDuration??12,Ke=Y??mt.brightness??_.brightness,aa=$e??mt.saturation??_.saturation,ra=la(()=>ir({id:de,borderRadius:Ne,borderWidth:jr,strokeOpacity:_.strokeOpacity*We,innerOpacity:_.innerOpacity*Pe,bloomOpacity:_.bloomOpacity*Ae,innerShadow:_.innerShadow,colorVariant:j,colors:z,brightness:Ke,saturation:aa,theme:K,hueBase:_.hueBase??0,glowSize:zt*P,glowWidth:Le,glowHeight:He,strokeScale:Be,innerScale:Ie,innerHeight:Ge,bloomScale:Ue,bloomHeight:Ve,coreSize:qe,coreLight:xe,coreLightWidth:Xt,coreLightHeight:Zt,rangeWidth:De,rangeHeight:Ee,softness:Re,distortion:ge>0,scale:P}),[de,Ne,_,j,Da,Ke,aa,K,u,zt,We,Pe,Ae,P,Le,He,Be,Ie,Ge,Ue,Ve,qe,xe,Xt,Zt,De,Ee,Re,ge>0,je]),oa=la(()=>({id:de,sensitivity:Math.max(0,E),threshold:Math.max(0,Math.min(.95,G)),attack:Math.max(0,N),release:Math.max(0,U),idle:Math.max(0,Math.min(1,Ft)),breatheDuration:Math.max(.2,T),reach:Math.max(0,Wt),spread:Math.max(0,Pt),bands:W,flow:At,lobeSpacing:Math.max(.1,_t),bend:Math.max(0,Lt),bandStrength:Math.max(0,Ht),bandWidth:Math.max(0,Dt),bandPosition:Math.max(0,Et),bandCurve:Math.max(.3,Rt),bandSpread:Math.max(.05,qt),bandSkew:Math.max(-.9,Math.min(.9,Bt)),bandOffset:It,bandTail:Math.max(0,Math.min(1.5,Gt)),bandTailPosition:Math.max(0,Math.min(.98,Ut)),bandTailCurve:Math.max(.5,Vt),bandTailOverflow:Math.max(0,jt),bandAberration:Math.max(0,Math.min(1,Nt)),rangeWidth:De,rangeHeight:Ee,theme:K,bandColors:{core:c?.core&&Ze(c.core)||Ye[K].core,above:c?.above&&Ze(c.above)||Ye[K].above,mid:c?.mid&&Ze(c.mid)||Ye[K].mid,below:c?.below&&Ze(c.below)||Ye[K].below},distortion:Math.max(0,Math.min(1,ge)),coreLight:xe,scale:P,radius:Ne,hueRange:Math.max(0,ea),hueDuration:Math.max(.5,ta),staticColors:j==="mono"?!0:y,reducedMotion:Jt,paused:b,look:je,dotSize:Math.max(.1,i),dotGap:Math.max(.3,o),dotShape:n==="square"?"square":"round",lineWidth:Math.max(.05,r),lineGap:Math.max(.3,l),linePattern:s==="columns"||s==="grid"?s:"rows",seeThrough:d,texture:Math.max(0,Math.min(1,g)),gravity:Math.max(.05,v),surfaceHeight:Math.max(.1,f),surfaceCurve:Math.max(-3,Math.min(5,h)),surfaceTail:Math.max(-2,Math.min(3,p)),surfaceTailPosition:Math.max(0,Math.min(.98,C)),surfaceTailCurve:Math.max(.5,O),surfaceFade:Math.max(0,Math.min(1,S)),layers:{glowWidth:Le,glowHeight:He,innerScale:Ie,innerHeight:Ge,bloomScale:Ue,bloomHeight:Ve,strokeScale:Be,softness:Re,coreSize:qe,innerOpacity:Pe,bloomOpacity:Ae,strokeOpacity:We,brightness:Ke}}),[de,E,G,N,U,Ft,T,Wt,Pt,W,At,_t,Lt,Ht,Dt,Et,Rt,qt,Bt,It,Gt,Ut,Vt,jt,Nt,De,Ee,K,Ea,ge,xe,P,Ne,ea,ta,y,j,Jt,b,je,i,o,n,r,l,s,d,g,v,f,h,p,C,O,S,Le,He,Ie,Ge,Ue,Ve,Be,Re,qe,Pe,Ae,We,Ke]),ia=fe(I);ia.current=I;let $t=fe(Tt);$t.current=Tt;let na=fe(A);na.current=A,ee(()=>{if(!(ce||se)||!ft)return;let x=Me.current;return x?Er(x,oa,{stream:D,getLevel:()=>{let M=ia.current;return typeof M=="function"?M():M},getMotion:()=>{let M=na.current;return typeof M=="function"?M():M}},M=>{var X;return(X=$t.current)==null?void 0:X.call($t,M)}):void 0},[oa,D,ce,se,ft]);let Ka=tt(x=>{Me.current=x,typeof ye=="function"?ye(x):ye&&(ye.current=x)},[ye]),_a={...Aa??{},"--voice-strength":Math.max(0,Math.min(1,Na))};return Xe(sa,{children:[B("style",{children:Ot?`${ra}
${Ot.split("{id}").join(de)}`:ra}),Xe("div",{...La,ref:Ka,"data-voice-beam":de,"data-voice-type":e,"data-voice-look":je,"data-voice-halfres":"","data-active":ce&&!se?"":void 0,"data-fading":se?"":void 0,"data-paused":ce&&!se&&(!ft||b)?"":void 0,"data-listening":D?"":void 0,className:Pa,style:_a,onAnimationEnd:ja,children:[t,Va,B("div",{"data-voice-beam-bloom":!0}),ge>0&&Xe(sa,{children:[B("div",{"data-voice-beam-warp":"inner"}),B("div",{"data-voice-beam-warp":"bloom"})]}),!_r&&B("canvas",{"data-voice-beam-band-halo":!0,"aria-hidden":"true"}),B("canvas",{"data-voice-beam-band":!0,"aria-hidden":"true"}),xe>0&&B("div",{"data-voice-beam-core":!0,children:B("div",{})}),ge>0&&B("svg",{"aria-hidden":"true",width:"0",height:"0",style:{position:"absolute",pointerEvents:"none"},children:Xe("filter",{id:`vb-distort-${de}`,x:"-20%",y:"-20%",width:"140%",height:"140%",colorInterpolationFilters:"sRGB",children:[B("feTurbulence",{type:"fractalNoise",baseFrequency:`${(.012*Kt).toFixed(4)} ${(.05*Kt).toFixed(4)}`,numOctaves:2,seed:7,result:"noise"}),B("feOffset",{in:"noise",dx:"0",dy:"0",result:"moved"}),B("feColorMatrix",{in:"moved",type:"matrix",values:"1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1",result:"map"}),B("feDisplacementMap",{in:"SourceGraphic",in2:"map",scale:0,xChannelSelector:"R",yChannelSelector:"G"})]})})]})]})}),Yr={echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1};function Qe(){return typeof navigator<"u"&&typeof navigator.mediaDevices<"u"&&typeof navigator.mediaDevices.getUserMedia=="function"}function ro(t={}){let{constraints:e,autoStart:a=!1}=t,[i,o]=Z(null),[n,r]=Z(()=>Qe()?"idle":"unsupported"),[l,s]=Z(null),d=fe(null),g=fe(e);g.current=e;let v=tt(()=>{let h=d.current;d.current=null,h&&h.getTracks().forEach(p=>p.stop()),o(null),r(Qe()?"idle":"unsupported")},[]),f=tt(async()=>{if(!Qe())return r("unsupported"),null;if(d.current)return d.current;$a(),r("requesting"),s(null);try{let h=await navigator.mediaDevices.getUserMedia({audio:{...Yr,...g.current??{}}});d.current=h,o(h),r("live");let p=()=>{d.current===h&&(d.current=null,o(null),r("idle"))};return h.getAudioTracks().forEach(C=>C.addEventListener("ended",p)),h}catch(h){let p=h instanceof Error?h:new Error(String(h));return s(p),r(p.name==="NotAllowedError"||p.name==="SecurityError"?"denied":"error"),null}},[]);return ee(()=>{a&&f()},[a]),ee(()=>()=>{let h=d.current;d.current=null,h&&h.getTracks().forEach(p=>p.stop())},[]),{stream:i,state:n,error:l,supported:Qe(),start:f,stop:v}}var oo=!1;export{er as LOBE_SPACING,tr as LOBE_SPAN,oo as VOICE_SURFACE_LOOKS,ao as VoiceBeam,ao as default,$a as getAudioContext,to as isAudioSupported,fa as parseRgb,Vr as resolveVoiceDefaults,Gr as resolveVoiceStyle,Qa as themePresets,ro as useMicrophone,Rr as voiceDefaults,le as voiceLobes,ar as voicePalettes,qr as voiceTypePresets,Br as voiceTypeStyle};
//# sourceMappingURL=voice-glow.mjs.map