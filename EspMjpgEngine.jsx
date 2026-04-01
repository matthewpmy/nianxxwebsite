import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════
//  ESP FACE EDITOR  v17 (ESP32 OPTIMIZED & BUGFIXED)
//  · 修复：彻底解决 lerpMP 和 React Fragment 子节点级联报错
//  · ESP32 专属导出：JSON 索引表内置绝对 Byte Offset，支持 fseek()
//  · 首位默认：default_loop 回归第一位
//  · 椭圆口型：说话(talking)采用完美椭圆+动态张合参数
// ═══════════════════════════════════════════════════════════════

const VW = 320, VH = 240;
const LOOP_F  = 90;
const TRANS_F = 15; 

const clamp   = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const lerp    = (a,b,t)   => a+(b-a)*t;
const lerpMP  = (a,b,t)   => a.map((v,i)=>lerp(v,b[i],t));
const eio     = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;

// ─────────────────────────────────────────────────────────────
//  嘴巴路径插值（14点贝塞尔）
// ─────────────────────────────────────────────────────────────
const MP = {
  default:      [188,126,  188,126,   183.772,150, 160,150,  136.228,150, 132,126,   132,126],
  default_up:   [186,124,  186,124,   182,148,   160,149,  138,148,   134,124,   134,124],
  very_happy:   [206.15,127, 206.15,127, 199.204,143, 160.15,143, 121.097,143, 114.15,127, 114.15,127],
  sleep:        [179,147.5, 179,147.5,  179,156,   160,156,   141,156,   141,147.5, 141,147.5],
  sad:          [188,150.158, 188,150.158, 183.772,126.158, 160,126.158, 136.228,126.158, 132,150.158, 132,150.158],
  sad_slight:   [187,148,   187,148,   183,127,   160,127.5, 137,127,   133,148,   133,148],
  angry:        [174.424,144, 174.424,144, 172.234,132, 159.924,132, 147.614,132, 145.424,144, 145.424,144],
  cry:          [179,146,   179,146,    176.131,130, 160,130,   143.869,130, 141,146,   141,146],
  cry_slight:   [178,144,   178,144,   175.5,131,  160,131,   144.5,131,  142,144,   142,144],
  worried:      [186,132,   186,137,    175,141,   160,139,   145,141,   134,137,   134,132],
  worried_up:   [186,130.5, 186,135,    175,139,   160,137.5, 145,139,   134,135,   134,130.5],
  worried_down: [186,133.5, 186,139,    175,143,   160,141.5, 145,143,   134,139,   134,133.5],
  wink:         [167,147.5, 167,147.5,  163,150,   160,150,   157,150,   153,147.5, 153,147.5],
  question:     [170,145,   170,145,    165,145,   160,145,   155,145,   150,145,   150,145],
  anchor:       [168,136,   168,136,    164,138,   160,138,   156,138,   152,136,   152,136],
};

const mpToD  = p => `M${p[0]},${p[1]} C${p[2]},${p[3]} ${p[4]},${p[5]} ${p[6]},${p[7]} C${p[8]},${p[9]} ${p[10]},${p[11]} ${p[12]},${p[13]}`;

// ─────────────────────────────────────────────────────────────
//  SVG 元素渲染配置 (已将所有 Fragment 替换为严格的 <g>，防止级联报错)
// ─────────────────────────────────────────────────────────────
const EXP = {
  default_loop: {
    label:'🙂 默认', color:'#4A90D9', mouthKey: 'default',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 112px', transform:`scaleY(${eyeSc})`}}>
        <ellipse cx="80"  cy="112" rx="16" ry="24" fill="white"/>
        <ellipse cx="240" cy="112" rx="16" ry="24" fill="white"/>
      </g>
    ),
    renderAcc: () => null,
  },
  talking: {
    label:'💬 说话', color:'#4CAF50', mouthKey: 'anchor',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 112px', transform:`scaleY(${eyeSc})`}}>
        <ellipse cx="80"  cy="112" rx="16" ry="24" fill="white"/>
        <ellipse cx="240" cy="112" rx="16" ry="24" fill="white"/>
      </g>
    ),
    renderSpecialMouth: (extras) => {
      const talk = extras?.talk || 0;
      return <ellipse cx="160" cy="142" rx="16" ry={4 + talk * 14} fill="white" />;
    },
    renderAcc: () => null,
  },
  open_eye: {
    label:'😳 专注', color:'#26C6DA', mouthKey: 'default',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 112px', transform:`scaleY(${eyeSc})`}}>
        <ellipse cx="80"  cy="112" rx="24" ry="36" fill="white"/>
        <ellipse cx="240" cy="112" rx="24" ry="36" fill="white"/>
      </g>
    ),
    renderAcc: () => null,
  },
  very_happy: {
    label:'😆 大笑', color:'#FFD600', mouthKey: 'very_happy',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 94px', transform:`scaleY(${eyeSc})`}}>
        <path d="M96 100C96 100 93.5839 88 80 88C66.4162 88 64 100 64 100" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M256 100C256 100 253.584 88 240 88C226.416 88 224 100 224 100" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none"/>
      </g>
    ),
    renderAcc: ({blush}) => (
      <g>
        <circle opacity={0.2 * (blush||1)} cx="68" cy="139" r="12" fill="#FF0000"/>
        <circle opacity={0.2 * (blush||1)} cx="252" cy="139" r="12" fill="#FF0000"/>
      </g>
    ),
  },
  sleep: {
    label:'😴 熟睡', color:'#7E57C2', mouthKey: 'sleep',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 104px', transform:`scaleY(${eyeSc})`}}>
        <path d="M104 100C104 100 100.98 108 84.0001 108C67.0203 108 64 100 64 100" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M256 100C256 100 252.98 108 236 108C219.02 108 216 100 216 100" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none"/>
      </g>
    ),
    renderAcc: ({snore}) => {
      const s = snore||0; if(s <= 0.02) return null;
      return (
        <g opacity={s}>
          <path d="M289.862 47.9951C292.481 44.8946 290.307 40.0002 286.117 40.0002L256.883 40C254.5 40 252 42.4 252 44.875C252 47.65 254.5 49.75 256.883 49.75H274.352L253.436 70.6799C250.519 74.1055 252.693 79 256.883 79H286.117C288.4 79 290.99 76.5 290.99 74.125C290.99 71.35 288.4 69.25 286.117 69.25H268.642L289.564 48.3201L289.862 47.9951Z" fill="#5D6AE4"/>
          <path d="M304.358 13.5101C305.835 11.7611 304.609 9.00009 302.246 9.00009L285.754 9C283.37 9 283 11.017 283 11.75C283 14.25 285 14.5 285.754 14.5H295.609L283.81 26.3066C282.165 28.239 283.391 31 285.754 31H302.246C304.629 31 304.994 28.934 304.994 28.25C304.994 25.75 303 25.5 302.246 25.5H292.388L304.19 13.6934L304.358 13.5101Z" fill="#5D6AE4"/>
        </g>
      );
    },
  },
  sad: {
    label:'🥺 难过', color:'#5C8DB8', mouthKey: 'sad',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 112px', transform:`scaleY(${eyeSc})`}}>
        <ellipse cx="88" cy="112.158" rx="16" ry="24" fill="white"/>
        <ellipse cx="232" cy="112.158" rx="16" ry="24" fill="white"/>
      </g>
    ),
    renderAcc: () => null,
  },
  angry: {
    label:'😡 生气', color:'#EF5350', mouthKey: 'angry',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 107px', transform:`scaleY(${eyeSc})`}}>
        <path d="M87.7582 77C97.9226 81.8596 108.963 87.0847 118.29 91.4719C119.657 95.7102 120.424 100.454 120.424 105.463C120.424 123.433 110.574 138 98.4238 138C86.2736 138 76.4238 123.433 76.4238 105.463C76.4238 93.2173 80.9987 82.5522 87.7582 77Z" fill="white"/>
        <path d="M232.347 77C222.414 81.8596 211.624 87.0847 202.509 91.4719C201.173 95.7102 200.424 100.454 200.424 105.463C200.424 123.433 210.05 138 221.924 138C233.798 138 243.424 123.433 243.424 105.463C243.424 93.2173 238.953 82.5522 232.347 77Z" fill="white"/>
      </g>
    ),
    renderAcc: () => null,
  },
  cry: {
    label:'😭 大哭', color:'#2D91FF', mouthKey: 'cry',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 100px', transform:`scaleY(${eyeSc})`}}>
        <path d="M88 80C101.255 80 112 96.1177 112 116C112 117.08 111.968 118.149 111.906 119.205C111.662 123.352 106.934 125.369 102.972 124.119C98.6961 122.77 93.7588 122 88.5 122C82.9434 122 77.7458 122.86 73.3085 124.354C69.2974 125.704 64.3864 123.739 64.1132 119.516C64.0383 118.359 64 117.186 64 116C64 96.1177 74.745 80 88 80Z" fill="white"/>
        <path d="M232 79.9995C245.255 79.9995 256 96.1173 256 116C256 117.079 255.968 118.148 255.906 119.204C255.662 123.351 250.934 125.368 246.972 124.118C242.696 122.769 237.759 122 232.5 122C226.943 122 221.746 122.859 217.309 124.353C213.297 125.704 208.386 123.739 208.113 119.515C208.038 118.358 208 117.186 208 116C208 96.1173 218.745 79.9995 232 79.9995Z" fill="white"/>
      </g>
    ),
    renderAcc: ({tear}) => {
      const t = tear||0; if(t <= 0.02) return null;
      return (
        <g>
          <rect x="82" y="122" width="12" height={t * 80} rx="6" fill="#2D91FF" opacity={0.95}/>
          <rect x="226" y="122" width="12" height={t * 80} rx="6" fill="#2D91FF" opacity={0.95}/>
        </g>
      );
    },
  },
  very_worried: {
    label:'😟 委屈', color:'#FF7043', mouthKey: 'worried',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 112px', transform:`scaleY(${eyeSc})`}}>
        <ellipse cx="96" cy="112" rx="16" ry="24" fill="white"/>
        <ellipse cx="224" cy="112" rx="16" ry="24" fill="white"/>
      </g>
    ),
    renderSpecialMouth: () => (
      <path d="M132 132C132.602 125.881 141.338 120 160 120C178.662 120 187.398 125.881 188 132C188.188 133.904 187.343 135.617 186.091 137.072C182.219 141.573 175.454 141.155 169.862 139.161C163.484 136.886 156.516 136.886 150.138 139.161C144.546 141.155 137.781 141.573 133.909 137.072C132.657 135.617 131.813 133.904 132 132Z" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    renderAcc: ({tear}) => {
      const t = tear||0; if(t <= 0.02) return null;
      return <path d="M248 46.3696C248 46.3696 230 86.3696 248 86.3696C266 86.3696 248 46.3696 248 46.3696Z" fill={`rgba(45,145,255,${t})`}/>;
    },
  },
  question: {
    label:'❓ 疑问', color:'#F9DC00', mouthKey: 'question',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 113px', transform:`scaleY(${eyeSc})`}}>
        <path d="M118.207 80.6127C134.357 83.4611 143.987 105.408 139.716 129.633C138.98 133.805 134.865 136.316 130.694 135.581L87.6719 127.995C83.5005 127.259 80.4926 123.492 81.2282 119.32C85.4998 95.0948 102.057 77.7649 118.207 80.6127Z" fill="white"/>
        <path d="M225.434 99.5194C241.584 102.368 251.214 124.315 246.942 148.54C246.207 152.711 242.092 155.223 237.92 154.487L194.898 146.901C190.727 146.166 187.719 142.399 188.454 138.227C192.726 114.002 209.283 96.6717 225.434 99.5194Z" fill="white"/>
        <path d="M164.251 136.473C153.491 134.575 148.74 146.301 148.347 152.514L173.71 156.986C175.557 151.03 175.012 138.37 164.251 136.473Z" fill="white"/>
      </g>
    ),
    renderAcc: () => (
      <g>
        <path d="M247.368 77.6095V72.2071C251.346 72.2071 254.571 68.579 254.571 64.1035C254.571 59.628 251.346 56 247.368 56C243.39 56 240.165 59.628 240.165 64.1035" stroke="#F9DC00" strokeWidth="4.11839" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M247.368 92.0157C249.854 92.0157 251.87 90 251.87 87.5137C251.87 85.0273 249.854 83.0117 247.368 83.0117C244.881 83.0117 242.866 85.0273 242.866 87.5137C242.866 90 244.881 92.0157 247.368 92.0157Z" fill="#F9DC00"/>
      </g>
    ),
  },
  happy_wink: {
    label:'😉 调皮', color:'#66BB6A', mouthKey: 'wink',
    renderEyes: (eyeSc) => (
      <g style={{transformOrigin:'160px 112px', transform:`scaleY(${eyeSc})`}}>
        <ellipse cx="112" cy="112.158" rx="16" ry="24" fill="white"/>
        <path d="M184 112C186.904 110 195.01 106 204.198 106" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M224 112C221.096 110 212.99 106 203.802 106" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none"/>
      </g>
    ),
    renderAcc: ({blush}) => {
      const b = blush||1;
      return (
        <g>
          <circle opacity={0.2*b} cx="68" cy="139" r="12" fill="#FF0000"/>
          <circle opacity={0.2*b} cx="252" cy="139" r="12" fill="#FF0000"/>
          <path d="M143 151.218C143 145.023 147.925 140 154 140H166C172.075 140 177 145.023 177 151.218V166.662C177 174.89 171.33 181.985 163.428 183.644C161.166 184.119 158.834 184.119 156.572 183.644C148.67 181.985 143 174.89 143 166.662V151.218Z" fill="#FF6969"/>
          <rect x="158" y="140" width="4" height="21" fill="black"/>
        </g>
      );
    },
  },
};

// ─────────────────────────────────────────────────────────────
//  循环动画弹性节律系统
// ─────────────────────────────────────────────────────────────
function calcRhythm(id, f) {
  const s = x => Math.sin(x);
  let bX=0, bY=0, blinkSc=1, mouthWobble=0, tilt=0, scaleX=1, scaleY=1;
  const breathPhase = s(f * 0.105);

  switch(id){
    case 'default_loop':
      scaleY = 1 + breathPhase * 0.025; scaleX = 1 - breathPhase * 0.012; bY = breathPhase * 3;
      const seg = Math.floor(f / 30) % 3; const segP = eio(clamp((f % 30) / 20, 0, 1));
      tilt = seg===0 ? lerp(0,-2.5,segP) : seg===1 ? lerp(-2.5,2.5,segP) : lerp(2.5,0,segP);
      bX = tilt * 0.4; mouthWobble = breathPhase * 1.2;
      if(f>=28&&f<=29) blinkSc=0.05; else if(f>=68&&f<=70) blinkSc=f===69?0.05:0.3;
      break;
    case 'talking':
      scaleY = 1 + s(f*0.2)*0.015; bY = s(f*0.2)*2; bX = s(f*0.05)*1;
      if(f>=42&&f<=43) blinkSc=0.1;
      break;
    case 'open_eye':
      scaleY = 1 + breathPhase * 0.01; bY = breathPhase * 1.2;
      const sS = Math.floor(f / 15) % 4; const sP = eio(clamp((f % 15) / 10, 0, 1));
      const tgs = [-4, 4, -4, 0]; tilt = lerp(tgs[(sS+3)%4], tgs[sS], sP); bX = tilt * 0.3;
      if(f===52||f===53) blinkSc=f===52?0.1:0.6;
      break;
    case 'very_happy':
      const bounce = Math.abs(s(f * 0.21));
      scaleY = 1 + bounce * 0.06; scaleX = 1 - bounce * 0.03;
      bY = -bounce * 5 + s(f*0.42)*1.5; bX = s(f * 0.14) * 2.5; tilt = s(f * 0.14) * 3;
      mouthWobble = bounce * 2.5;
      break;
    case 'sleep':
      const db = s(f * 0.052);
      scaleY = 1 + db * 0.04; scaleX = 1 - db * 0.02;
      bY = db * 12 + s(f*0.031)*2; bX = s(f * 0.023) * 2; tilt = s(f * 0.023) * 1.5;
      break;
    case 'sad':
      scaleY = 1 - breathPhase * 0.015 + 0.01; bY = s(f*0.084)*6 + 3; bX = s(f*0.06)*2;
      tilt = -1.5 + s(f*0.06)*1; mouthWobble = s(f*0.21)*2.5 * (0.5 + 0.5*s(f*0.07));
      if(f>=42&&f<=43) blinkSc=f===42?0.2:0.5;
      break;
    case 'angry':
      const shake = s(f*0.42)*2.5 + s(f*0.7)*1;
      scaleX = 1 + Math.abs(s(f*0.42))*0.025; scaleY = 1 - Math.abs(s(f*0.42))*0.015;
      bY = s(f*0.315)*3; bX = shake; tilt = shake * 0.8; mouthWobble = s(f*0.42)*1.5;
      break;
    case 'cry':
      const sob = 0.5 + 0.5*s(f*0.21);
      scaleY = 1 - sob * 0.02; scaleX = 1 + sob * 0.01;
      bY = s(f*0.157)*4 + sob*3; bX = s(f*0.31)*sob*1.5; tilt = s(f*0.31)*sob*1.5; mouthWobble = -sob*2.5;
      if(f>=22&&f<=23) blinkSc=f===22?0.1:0.4; if(f>=58&&f<=59) blinkSc=f===58?0.1:0.4;
      break;
    case 'very_worried':
      scaleY = 1 + s(f*0.105)*0.015; bY = s(f*0.105)*2.5; bX = s(f*0.21)*2 + s(f*0.35)*0.8;
      tilt = s(f*0.21)*2 + s(f*0.35)*0.5; mouthWobble = s(f*0.21)*1.5;
      if(f>=38&&f<=39) blinkSc=0.1; if(f>=72&&f<=73) blinkSc=0.1;
      break;
    case 'question':
      const tC = s(f * 0.07); tilt = tC * 6; scaleX = 1 - Math.abs(tC) * 0.01;
      bY = s(f*0.105)*3.5; bX = tilt * 0.5;
      if(f===40||f===41) blinkSc=f===40?0.2:0.6;
      break;
    case 'happy_wink':
      const b2 = Math.abs(s(f*0.175)); scaleY = 1 + b2 * 0.04; scaleX = 1 - b2 * 0.02;
      bY = -b2*4 + 1; bX = s(f*0.14)*2.5; tilt = s(f*0.14)*2.5; mouthWobble = s(f*0.21)*1.5;
      break;
  }
  return { bX, bY, blinkSc, mouthWobble, tilt, scaleX, scaleY };
}

// ─────────────────────────────────────────────────────────────
//  关键帧模型 (含完整空间参数 & talk)
// ─────────────────────────────────────────────────────────────
const K = (f, mk, ex={}) => ({ 
  f, mouth:[...MP[mk||'default']], 
  snore:0, tear:0, blush:0, shake:0, talk:0,
  fx:0, fy:0, sx:1, sy:1, rot:0, ...ex 
});

function evalKf(anim, frame) {
  const kfs = anim.keyframes;
  if(!kfs||!kfs.length) return null;
  if(kfs.length===1) return {...kfs[0]};
  let p=kfs[0], n=kfs[kfs.length-1];
  for(let i=0;i<kfs.length-1;i++){
    if(frame>=kfs[i].f && frame<=kfs[i+1].f){ p=kfs[i]; n=kfs[i+1]; break; }
  }
  if(p===n) return {...p};
  const rawt = clamp((frame-p.f)/(n.f-p.f),0,1);
  const t = eio(rawt);
  
  return {
    mouth: lerpMP(p.mouth, n.mouth, t),
    snore: lerp(p.snore||0, n.snore||0, t),
    tear:  lerp(p.tear||0,  n.tear||0,  t),
    blush: lerp(p.blush||0, n.blush||0, t),
    shake: lerp(p.shake||0, n.shake||0, t),
    talk:  lerp(p.talk||0,  n.talk||0,  t),
    fx:    lerp(p.fx||0,    n.fx||0,    t),
    fy:    lerp(p.fy||0,    n.fy||0,    t),
    sx:    lerp(p.sx||1,    n.sx||1,    t),
    sy:    lerp(p.sy||1,    n.sy||1,    t),
    rot:   lerp(p.rot||0,   n.rot||0,   t),
  };
}

// ─────────────────────────────────────────────────────────────
//  纯物理闭眼过渡算法 (单图渲染，解决重影)
// ─────────────────────────────────────────────────────────────
function blendBlinkBridge(idA, idB, animA, animB, rawT) {
  const t = clamp(rawT, 0, 1);
  const CLOSE_T = 0.5; // 0.5 时瞬间切换 SVG，绝无重影
  
  let eyeSc, activeId;
  if (t < CLOSE_T) {
    const p = eio(t / CLOSE_T); 
    eyeSc = Math.max(1 - p, 0.01);
    activeId = idA;
  } else {
    const p = eio((t - CLOSE_T) / (1 - CLOSE_T));
    eyeSc = Math.max(p, 0.01);
    activeId = idB;
  }

  const stA = evalKf(animA, LOOP_F - 1) || {mouth: [...MP.anchor]};
  const stB = evalKf(animB, 0) || {mouth: [...MP.anchor]};
  
  let mouth;
  if (t < CLOSE_T) {
    mouth = lerpMP(stA.mouth, MP.anchor, eio(t / CLOSE_T));
  } else {
    mouth = lerpMP(MP.anchor, stB.mouth, eio((t - CLOSE_T) / (1 - CLOSE_T)));
  }

  const blendedExtras = {
    snore: lerp(stA.snore||0, stB.snore||0, t),
    tear:  lerp(stA.tear||0,  stB.tear||0,  t),
    blush: lerp(stA.blush||0, stB.blush||0, t),
    shake: lerp(stA.shake||0, stB.shake||0, t),
    talk:  lerp(stA.talk||0,  stB.talk||0,  t),
    fx:    lerp(stA.fx||0,    stB.fx||0,    t),
    fy:    lerp(stA.fy||0,    stB.fy||0,    t),
    sx:    lerp(stA.sx||1,    stB.sx||1,    t),
    sy:    lerp(stA.sy||1,    stB.sy||1,    t),
    rot:   lerp(stA.rot||0,   stB.rot||0,   t),
  };

  return { activeId, mouth, eyeSc, blendedExtras };
}

// ─────────────────────────────────────────────────────────────
//  脸部渲染核心
// ─────────────────────────────────────────────────────────────
function FaceContent({ expId, mouth, frame=0, eyeSc=1, extras={}, animated=false }) {
  const exp = EXP[expId];
  if(!exp) return null;

  let r_bX=0, r_bY=0, r_blinkSc=1, mouthWobble=0, shakeX=0;
  let r_tilt=0, r_scaleX=1, r_scaleY=1;

  if(animated){
    const r = calcRhythm(expId, frame);
    r_bX=r.bX; r_bY=r.bY; r_blinkSc=r.blinkSc;
    mouthWobble=r.mouthWobble||0;
    r_tilt=r.tilt||0; r_scaleX=r.scaleX||1; r_scaleY=r.scaleY||1;
    shakeX = (extras.shake||0)>0.05 ? Math.sin(frame*0.63)*(extras.shake||0)*6 : 0;
  }

  const finalEyeSc = eyeSc * r_blinkSc;

  // 融合动画自带节律与编辑器属性
  const fx = r_bX + shakeX + (extras.fx || 0);
  const fy = r_bY + (extras.fy || 0);
  const rot = r_tilt + (extras.rot || 0);
  const sx = r_scaleX * (extras.sx || 1);
  const sy = r_scaleY * (extras.sy || 1);

  const finalTransform = `translate(${fx},${fy}) translate(160,120) rotate(${rot}) scale(${sx},${sy}) translate(-160,-120)`;

  const hideNormalMouth = expId === 'happy_wink' || expId === 'question';
  const mouthEl = hideNormalMouth ? null
    : exp.renderSpecialMouth
    ? exp.renderSpecialMouth(extras)
    : <path d={mpToD(mouth)} stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" transform={mouthWobble ? `translate(0,${mouthWobble})` : undefined}/>;

  return (
    <g transform={finalTransform}>
      <g>
        {expId !== 'cry' && exp.renderAcc({...extras, frame})}
      </g>
      {mouthEl}
      <g>
        {exp.renderEyes(finalEyeSc)}
        {expId === 'cry' && (
          <g>
            {exp.renderAcc({...extras, frame})}
          </g>
        )}
      </g>
    </g>
  );
}

function Face({ expId, mouth, frame=0, eyeSc=1, extras={}, animated=false, size }) {
  const W = size||VW, H = size ? Math.round(size*VH/VW) : VH;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width={W} height={H} style={{display:'block',flexShrink:0}}>
      <rect width={VW} height={VH} fill="black"/>
      <FaceContent expId={expId} mouth={mouth} frame={frame} eyeSc={eyeSc} extras={extras} animated={animated} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Canvas MJPG 渲染方法 (精准映射 SVG Transform)
// ─────────────────────────────────────────────────────────────
function drawSingleFace(ctx, expId, mouth, extras, eyeSc=1, frame=0) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,VW,VH);
  const exp = EXP[expId]; if(!exp) return;

  let r_bX=0, r_bY=0, r_blinkSc=1, mouthWobble=0, shakeX=0;
  let r_tilt=0, r_scaleX=1, r_scaleY=1;
  const r = calcRhythm(expId, frame);
  r_bX=r.bX; r_bY=r.bY; r_blinkSc=r.blinkSc;
  mouthWobble=r.mouthWobble||0;
  r_tilt=r.tilt||0; r_scaleX=r.scaleX||1; r_scaleY=r.scaleY||1;
  shakeX = (extras.shake||0)>0.05 ? Math.sin(frame*0.63)*(extras.shake||0)*6 : 0;

  const finalEyeSc = eyeSc * r_blinkSc;
  const fx = r_bX + shakeX + (extras.fx || 0);
  const fy = r_bY + (extras.fy || 0);
  const rot = r_tilt + (extras.rot || 0);
  const sx = r_scaleX * (extras.sx || 1);
  const sy = r_scaleY * (extras.sy || 1);

  ctx.save();
  ctx.translate(160 + fx, 120 + fy);
  ctx.rotate((rot * Math.PI)/180);
  ctx.scale(sx, sy);
  ctx.translate(-160, -120);

  // Accessories
  if ((extras.blush||0)>0 && (expId==='very_happy' || expId==='happy_wink')) {
      ctx.fillStyle=`rgba(255,0,0,${0.2 * extras.blush})`;
      ctx.beginPath(); ctx.arc(68,139,12,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(252,139,12,0,Math.PI*2); ctx.fill();
  }
  if (expId==='sleep' && (extras.snore||0)>0.02) {
      ctx.globalAlpha = extras.snore; ctx.fillStyle='#5D6AE4';
      ctx.fill(new Path2D('M289.862 47.9951C292.481 44.8946 290.307 40.0002 286.117 40.0002L256.883 40C254.5 40 252 42.4 252 44.875C252 47.65 254.5 49.75 256.883 49.75H274.352L253.436 70.6799C250.519 74.1055 252.693 79 256.883 79H286.117C288.4 79 290.99 76.5 290.99 74.125C290.99 71.35 288.4 69.25 286.117 69.25H268.642L289.564 48.3201L289.862 47.9951Z'));
      ctx.fill(new Path2D('M304.358 13.5101C305.835 11.7611 304.609 9.00009 302.246 9.00009L285.754 9C283.37 9 283 11.017 283 11.75C283 14.25 285 14.5 285.754 14.5H295.609L283.81 26.3066C282.165 28.239 283.391 31 285.754 31H302.246C304.629 31 304.994 28.934 304.994 28.25C304.994 25.75 303 25.5 302.246 25.5H292.388L304.19 13.6934L304.358 13.5101Z'));
      ctx.globalAlpha = 1;
  }
  if (expId==='question') {
      ctx.strokeStyle='#F9DC00'; ctx.lineWidth=4.12; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.stroke(new Path2D('M247.368 77.6095V72.2071C251.346 72.2071 254.571 68.579 254.571 64.1035C254.571 59.628 251.346 56 247.368 56C243.39 56 240.165 59.628 240.165 64.1035'));
      ctx.fillStyle='#F9DC00'; ctx.beginPath(); ctx.arc(247.368, 87.514, 4.5, 0, Math.PI*2); ctx.fill();
  }

  // Mouth
  ctx.save();
  if(mouthWobble) ctx.translate(0, mouthWobble);
  if(expId==='talking'){
      ctx.fillStyle='white';
      ctx.beginPath(); ctx.ellipse(160, 142, 16, 4 + (extras.talk||0)*14, 0, 0, Math.PI*2); ctx.fill();
  } else if(expId==='very_worried'){
      ctx.strokeStyle='white'; ctx.lineWidth=8; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.stroke(new Path2D('M132 132C132.602 125.881 141.338 120 160 120C178.662 120 187.398 125.881 188 132C188.188 133.904 187.343 135.617 186.091 137.072C182.219 141.573 175.454 141.155 169.862 139.161C163.484 136.886 156.516 136.886 150.138 139.161C144.546 141.155 137.781 141.573 133.909 137.072C132.657 135.617 131.813 133.904 132 132Z'));
  } else if(expId!=='happy_wink' && expId!=='question'){
      ctx.strokeStyle='white'; ctx.lineWidth=12; ctx.lineCap='round'; ctx.lineJoin='round';
      const p=mouth;
      ctx.beginPath(); ctx.moveTo(p[0],p[1]);
      ctx.bezierCurveTo(p[2],p[3],p[4],p[5],p[6],p[7]);
      ctx.bezierCurveTo(p[8],p[9],p[10],p[11],p[12],p[13]);
      ctx.stroke();
  }
  ctx.restore();

  // Eyes & special elements
  ctx.save();
  const originY = expId==='very_happy'?94 : expId==='sleep'?104 : expId==='angry'?107 : expId==='cry'?100 : expId==='question'?113 : 112;
  ctx.translate(160, originY); ctx.scale(1, finalEyeSc); ctx.translate(-160, -originY);
  
  ctx.fillStyle='white'; ctx.strokeStyle='white';
  switch(expId){
      case 'talking': case 'default_loop': case 'sad':
          ctx.beginPath(); ctx.ellipse(expId==='sad'?88:80, 112, 16, 24, 0, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(expId==='sad'?232:240, 112, 16, 24, 0, 0, Math.PI*2); ctx.fill();
          break;
      case 'open_eye':
          ctx.beginPath(); ctx.ellipse(80, 112, 24, 36, 0, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(240, 112, 24, 36, 0, 0, Math.PI*2); ctx.fill();
          break;
      case 'very_happy':
          ctx.lineWidth=12; ctx.lineCap='round';
          ctx.stroke(new Path2D('M96 100C96 100 93.5839 88 80 88C66.4162 88 64 100 64 100'));
          ctx.stroke(new Path2D('M256 100C256 100 253.584 88 240 88C226.416 88 224 100 224 100'));
          break;
      case 'sleep':
          ctx.lineWidth=12; ctx.lineCap='round';
          ctx.stroke(new Path2D('M104 100C104 100 100.98 108 84.0001 108C67.0203 108 64 100 64 100'));
          ctx.stroke(new Path2D('M256 100C256 100 252.98 108 236 108C219.02 108 216 100 216 100'));
          break;
      case 'angry':
          ctx.fill(new Path2D('M87.7582 77C97.9226 81.8596 108.963 87.0847 118.29 91.4719C119.657 95.7102 120.424 100.454 120.424 105.463C120.424 123.433 110.574 138 98.4238 138C86.2736 138 76.4238 123.433 76.4238 105.463C76.4238 93.2173 80.9987 82.5522 87.7582 77Z'));
          ctx.fill(new Path2D('M232.347 77C222.414 81.8596 211.624 87.0847 202.509 91.4719C201.173 95.7102 200.424 100.454 200.424 105.463C200.424 123.433 210.05 138 221.924 138C233.798 138 243.424 123.433 243.424 105.463C243.424 93.2173 238.953 82.5522 232.347 77Z'));
          break;
      case 'cry':
          ctx.fill(new Path2D('M88 80C101.255 80 112 96.1177 112 116C112 117.08 111.968 118.149 111.906 119.205C111.662 123.352 106.934 125.369 102.972 124.119C98.6961 122.77 93.7588 122 88.5 122C82.9434 122 77.7458 122.86 73.3085 124.354C69.2974 125.704 64.3864 123.739 64.1132 119.516C64.0383 118.359 64 117.186 64 116C64 96.1177 74.745 80 88 80Z'));
          ctx.fill(new Path2D('M232 79.9995C245.255 79.9995 256 96.1173 256 116C256 117.079 255.968 118.148 255.906 119.204C255.662 123.351 250.934 125.368 246.972 124.118C242.696 122.769 237.759 122 232.5 122C226.943 122 221.746 122.859 217.309 124.353C213.297 125.704 208.386 123.739 208.113 119.515C208.038 118.358 208 117.186 208 116C208 96.1173 218.745 79.9995 232 79.9995Z'));
          if ((extras.tear||0)>0.02) {
              ctx.fillStyle=`rgba(45,145,255,${extras.tear*0.95})`;
              if (ctx.roundRect) {
                  ctx.beginPath(); ctx.roundRect(82, 122, 12, extras.tear*80, 6); ctx.fill();
                  ctx.beginPath(); ctx.roundRect(226, 122, 12, extras.tear*80, 6); ctx.fill();
              } else {
                  ctx.fillRect(82, 122, 12, extras.tear*80);
                  ctx.fillRect(226, 122, 12, extras.tear*80);
              }
          }
          break;
      case 'very_worried':
          ctx.beginPath(); ctx.ellipse(96, 112, 16, 24, 0, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(224, 112, 16, 24, 0, 0, Math.PI*2); ctx.fill();
          if((extras.tear||0)>0.02){
              ctx.fillStyle=`rgba(45,145,255,${extras.tear})`;
              ctx.fill(new Path2D('M248 46.3696C248 46.3696 230 86.3696 248 86.3696C266 86.3696 248 46.3696 248 46.3696Z'));
          }
          break;
      case 'question':
          ctx.fill(new Path2D('M118.207 80.6127C134.357 83.4611 143.987 105.408 139.716 129.633C138.98 133.805 134.865 136.316 130.694 135.581L87.6719 127.995C83.5005 127.259 80.4926 123.492 81.2282 119.32C85.4998 95.0948 102.057 77.7649 118.207 80.6127Z'));
          ctx.fill(new Path2D('M225.434 99.5194C241.584 102.368 251.214 124.315 246.942 148.54C246.207 152.711 242.092 155.223 237.92 154.487L194.898 146.901C190.727 146.166 187.719 142.399 188.454 138.227C192.726 114.002 209.283 96.6717 225.434 99.5194Z'));
          ctx.fill(new Path2D('M164.251 136.473C153.491 134.575 148.74 146.301 148.347 152.514L173.71 156.986C175.557 151.03 175.012 138.37 164.251 136.473Z'));
          break;
      case 'happy_wink':
          ctx.beginPath(); ctx.ellipse(112, 112.158, 16, 24, 0, 0, Math.PI*2); ctx.fill();
          ctx.lineWidth=12; ctx.lineCap='round';
          ctx.stroke(new Path2D('M184 112C186.904 110 195.01 106 204.198 106'));
          ctx.stroke(new Path2D('M224 112C221.096 110 212.99 106 203.802 106'));
          
          ctx.fillStyle='#FF6969';
          ctx.fill(new Path2D('M143 151.218C143 145.023 147.925 140 154 140H166C172.075 140 177 145.023 177 151.218V166.662C177 174.89 171.33 181.985 163.428 183.644C161.166 184.119 158.834 184.119 156.572 183.644C148.67 181.985 143 174.89 143 166.662V151.218Z'));
          ctx.fillStyle='black'; ctx.fillRect(158, 140, 4, 21);
          break;
  }
  ctx.restore();
  ctx.restore();
}

function buildPlan(ids){
  let i=0; const p={loops:{},trans:{},total:0,ids};
  for(const id of ids){ p.loops[id]={start:i,len:LOOP_F}; i+=LOOP_F; }
  for(const a of ids) for(const b of ids){
    if(a===b) continue; p.trans[`${a}→${b}`]={start:i,len:TRANS_F}; i+=TRANS_F;
  }
  p.total=i; return p;
}

function* frameGen(anims){
  const ids=Object.keys(anims);
  for(const id of ids){
    const a=anims[id];
    for(let f=0;f<LOOP_F;f++){
      const st=evalKf(a,f) || {mouth:[...MP.anchor]};
      yield { type:'loop', expId:id, mouth:st.mouth, extras:st, eyeSc:1, frame:f, label:`${id} f${f}` };
    }
  }
  for(const a of ids) for(const b of ids){
    if(a===b) continue;
    for(let i=0;i<TRANS_F;i++){
      const t=(i+1)/(TRANS_F+1);
      const bl=blendBlinkBridge(a,b,anims[a],anims[b],t);
      yield { type:'trans', expId:bl.activeId, mouth:bl.mouth, extras:bl.blendedExtras, eyeSc:bl.eyeSc, frame:0, label:`${a}→${b}[${i}]` };
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  默认预设表 (顺序调整，default_loop归位第一！)
// ─────────────────────────────────────────────────────────────
const DEFAULT_ANIMS = {
  default_loop:  { label:'🙂 默认', color:'#4A90D9', easing:'sine', keyframes:[ K(0,'default'), K(22,'default_up'), K(45,'default'), K(67,'default_up'), K(89,'default') ]},
  talking:       { label:'💬 说话', color:'#4CAF50', easing:'inOut', keyframes:[ 
    K(0,'anchor',{talk:0}), K(12,'anchor',{talk:1, sy:1.02}), K(24,'anchor',{talk:0}), 
    K(38,'anchor',{talk:1, sy:1.02}), K(50,'anchor',{talk:0}), 
    K(65,'anchor',{talk:1, sy:1.02}), K(89,'anchor',{talk:0}) 
  ]},
  open_eye:      { label:'😳 专注', color:'#26C6DA', easing:'sine', keyframes:[ K(0,'default'), K(45,'default_up'), K(89,'default') ]},
  very_happy:    { label:'😆 大笑', color:'#FFD600', easing:'sine', keyframes:[ K(0,'very_happy',{blush:0.9}), K(45,'very_happy',{blush:1}), K(89,'very_happy',{blush:0.9}) ]},
  sleep:         { label:'😴 熟睡', color:'#7E57C2', easing:'sine', keyframes:[ K(0,'sleep',{snore:0}), K(22,'sleep',{snore:0.4}), K(44,'sleep',{snore:1}), K(67,'sleep',{snore:0.5}), K(89,'sleep',{snore:0}) ]},
  sad:           { label:'🥺 难过', color:'#5C8DB8', easing:'sine', keyframes:[ K(0,'sad',{tear:0.0}), K(20,'sad_slight',{tear:0.5}), K(40,'sad',{tear:1.0}), K(60,'sad_slight',{tear:0.8}), K(89,'sad',{tear:0.3}) ]},
  angry:         { label:'😡 生气', color:'#EF5350', easing:'inOut', keyframes:[ K(0,'angry',{shake:0}), K(8,'angry',{shake:1}), K(18,'angry',{shake:0.4}), K(28,'angry',{shake:1}), K(40,'angry',{shake:0.5}), K(55,'angry',{shake:0.8}), K(89,'angry',{shake:0}) ]},
  cry:           { label:'😭 大哭', color:'#2D91FF', easing:'sine', keyframes:[ K(0,'cry',{tear:0.5}), K(22,'cry_slight',{tear:1.0}), K(44,'cry',{tear:0.7}), K(67,'cry_slight',{tear:1.0}), K(89,'cry',{tear:0.5}) ]},
  very_worried:  { label:'😟 委屈', color:'#FF7043', easing:'sine', keyframes:[ K(0,'worried',{tear:0.0}), K(15,'worried_up',{tear:0.3}), K(30,'worried',{tear:0.5}), K(45,'worried_down',{tear:0.6}), K(60,'worried',{tear:0.4}), K(75,'worried_up',{tear:0.3}), K(89,'worried',{tear:0.0}) ]},
  question:      { label:'❓ 疑问', color:'#F9DC00', easing:'inOut', keyframes:[ K(0,'question'), K(89,'question') ]},
  happy_wink:    { label:'😉 调皮', color:'#66BB6A', easing:'sine', keyframes:[ K(0,'wink',{blush:0.8}), K(45,'wink',{blush:1}), K(89,'wink',{blush:0.8}) ]},
};

// ─────────────────────────────────────────────────────────────
//  生命周期状态机测试器 (FSM)
// ─────────────────────────────────────────────────────────────
function TransStateMachine({ anims, fromId, toId, size }) {
  const [gf, setGf] = useState(0); 
  const CYCLE_LEN = LOOP_F + TRANS_F + LOOP_F + TRANS_F; 
  
  useEffect(() => {
    let timer = setInterval(() => {
      setGf(f => (f + 1) % CYCLE_LEN);
    }, 1000 / 30);
    return () => clearInterval(timer);
  }, [CYCLE_LEN]);

  const W = size||VW, H = size ? Math.round(size*VH/VW) : VH;

  let comp = null;
  if (gf < LOOP_F) {
    const st = evalKf(anims[fromId], gf);
    comp = <FaceContent expId={fromId} mouth={st.mouth} frame={gf} extras={st} animated={true} />;
  } else if (gf < LOOP_F + TRANS_F) {
    const t = (gf - LOOP_F) / TRANS_F;
    const bl = blendBlinkBridge(fromId, toId, anims[fromId], anims[toId], t);
    comp = <FaceContent expId={bl.activeId} mouth={bl.mouth} frame={0} eyeSc={bl.eyeSc} extras={bl.blendedExtras} animated={false}/>;
  } else if (gf < LOOP_F + TRANS_F + LOOP_F) {
    const localF = gf - (LOOP_F + TRANS_F);
    const st = evalKf(anims[toId], localF);
    comp = <FaceContent expId={toId} mouth={st.mouth} frame={localF} extras={st} animated={true} />;
  } else {
    const t = (gf - (LOOP_F + TRANS_F + LOOP_F)) / TRANS_F;
    const bl = blendBlinkBridge(toId, fromId, anims[toId], anims[fromId], t);
    comp = <FaceContent expId={bl.activeId} mouth={bl.mouth} frame={0} eyeSc={bl.eyeSc} extras={bl.blendedExtras} animated={false}/>;
  }

  return (
    <div style={{ position:'relative' }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} width={W} height={H} style={{display:'block',flexShrink:0}}>
        <rect width={VW} height={VH} fill="black"/>
        {comp}
      </svg>
      <div style={{ position:'absolute', top: 10, left: 10, background: '#000000aa', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
        {gf < LOOP_F ? `▶ 播放 [${EXP[fromId].label}]` 
        : gf < LOOP_F+TRANS_F ? `⚡ 闭眼过渡 [${EXP[fromId].label}] -> [${EXP[toId].label}]`
        : gf < LOOP_F*2+TRANS_F ? `▶ 播放 [${EXP[toId].label}]` 
        : `⚡ 闭眼过渡 [${EXP[toId].label}] -> [${EXP[fromId].label}]`}
      </div>
    </div>
  );
}

const clone=v=>JSON.parse(JSON.stringify(v));

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const [anims,setAnims]   = useState(()=>clone(DEFAULT_ANIMS));
  const [selId,setSelId]   = useState('default_loop');
  const [selKf,setSelKf]   = useState(null);
  const [frame,setFrame]   = useState(0);
  const [playing,setPlaying]=useState(true);
  const [fps,setFps]       = useState(30);
  const [panel,setPanel]   = useState('edit'); 
  
  const [transFrom,setTransFrom]=useState('default_loop');
  const [transTo,  setTransTo  ]=useState('talking');

  const [expSt, setExpSt]  = useState('idle');
  const [expPct,setExpPct] = useState(0);
  const [expLbl,setExpLbl] = useState('');
  const [expRes,setExpRes] = useState(null);
  const offCv  = useRef(null);

  const anim   = anims[selId]||anims[Object.keys(anims)[0]];
  const curSt  = useMemo(()=>evalKf(anim,frame),[anim,frame]);
  const ids    = Object.keys(anims);
  const N      = ids.length;
  const ac     = anim.color||'#4A90D9';
  const selKfD = selKf!=null ? anim.keyframes[selKf] : null;

  // 即点即切循环播放器
  useEffect(()=>{
    if(!playing || panel !== 'edit') return;
    const timer = setInterval(()=>{
        setFrame(f => f >= LOOP_F - 1 ? 0 : f + 1);
    }, 1000 / fps);
    return()=>clearInterval(timer);
  },[playing, fps, panel]);

  const handleSelect = (id) => {
    if (id === selId) return;
    setSelId(id); setSelKf(null); setFrame(0);
  };

  const addKf=()=>{
    if(!curSt) return;
    const nkf={f:frame,mouth:[...curSt.mouth],snore:curSt.snore||0,tear:curSt.tear||0,blush:curSt.blush||0,shake:curSt.shake||0, talk:curSt.talk||0, fx:curSt.fx||0, fy:curSt.fy||0, sx:curSt.sx||1, sy:curSt.sy||1, rot:curSt.rot||0 };
    const kfs=[...clone(anim.keyframes),nkf].sort((a,b)=>a.f-b.f);
    setAnims(a=>({...a,[selId]:{...a[selId],keyframes:kfs}}));
    setSelKf(kfs.findIndex(k=>k.f===frame));
  };
  const delKf=idx=>{
    if(anim.keyframes.length<=1) return;
    const kfs=clone(anim.keyframes); kfs.splice(idx,1);
    setAnims(a=>({...a,[selId]:{...a[selId],keyframes:kfs}}));
    setSelKf(null);
  };
  const updKf=(idx,patch)=>{
    const kfs=clone(anim.keyframes); kfs[idx]={...kfs[idx],...patch};
    if('f' in patch) kfs.sort((a,b)=>a.f-b.f);
    setAnims(a=>({...a,[selId]:{...a[selId],keyframes:kfs}}));
  };

  const exportJSON=()=>{
    const b=new Blob([JSON.stringify(anims,null,2)],{type:'application/json'});
    const u=URL.createObjectURL(b); const el=document.createElement('a');
    el.href=u; el.download='esp_animations.json'; el.click(); URL.revokeObjectURL(u);
  };

  // 专为 ESP32 fseek 优化的导出逻辑
  const startExport=useCallback(async()=>{
    setExpSt('rendering'); setExpPct(0); setExpRes(null);
    const iids=Object.keys(anims); const plan=buildPlan(iids);
    const cv=offCv.current; const ctx=cv.getContext('2d');
    const enc=new TextEncoder(); const parts=[];
    let done=0; const total=plan.total; const gen=frameGen(anims);
    
    // ESP32 专属字节偏移表
    const espIndex = {
      total: total,
      anim: {},
      offsets: [],
      sizes: []
    };
    for(const k in plan.loops) espIndex.anim[k] = [plan.loops[k].start, plan.loops[k].len];
    for(const k in plan.trans) espIndex.anim[k] = [plan.trans[k].start, plan.trans[k].len];

    let currentOffset = 0;

    while(true){
      let fin=false;
      for(let b=0;b<8;b++){
        const{value,done:d}=gen.next(); if(d){fin=true;break;}
        const fData = value;
        setExpLbl(fData.label);
        
        drawSingleFace(ctx, fData.expId, fData.mouth, fData.extras, fData.eyeSc, fData.frame);

        const blob2=await new Promise(r=>cv.toBlob(r,'image/jpeg',0.85));
        const buf=new Uint8Array(await blob2.arrayBuffer());
        const hdrStr = `--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${buf.byteLength}\r\n\r\n`;
        const hdr = enc.encode(hdrStr);
        const tail = enc.encode('\r\n');
        
        parts.push(hdr); parts.push(buf); parts.push(tail);

        const totalBytes = hdr.byteLength + buf.byteLength + tail.byteLength;
        espIndex.offsets.push(currentOffset);
        espIndex.sizes.push(totalBytes);
        currentOffset += totalBytes;

        done++; setExpPct(Math.round(done/total*100));
      }
      if(fin) break;
      await new Promise(r=>setTimeout(r,0));
    }
    const mjpg=new Blob(parts,{type:'video/x-motion-jpeg'});
    setExpRes({mjpg,json:JSON.stringify(espIndex,null,0),plan}); setExpSt('done');
  },[anims]);

  const dl=(blob,name)=>{const u=URL.createObjectURL(blob);const el=document.createElement('a');el.href=u;el.download=name;el.click();URL.revokeObjectURL(u);};

  const PW = 280;

  return (
    <div style={{ height:'100vh', display:'flex', background:'#080810', color:'#ccc', fontFamily:'"JetBrains Mono",monospace', overflow:'hidden' }}>
      
      <canvas ref={offCv} width={VW} height={VH} style={{display:'none'}}/>

      {/* ════左侧：表情列表════ */}
      <div style={{ width:200, flexShrink:0, background:'#05050d', borderRight:'1px solid #15152a', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'20px 16px 12px', fontSize:11, letterSpacing:4, color:'#222', borderBottom:'1px solid #10101e', fontWeight: 800 }}>ESP FACE V17</div>
        <div style={{flex:1, padding:'8px 0'}}>
          {ids.map(id=>{
            const a=anims[id]; 
            const active = selId===id;
            return (
              <button key={id} onClick={()=>handleSelect(id)} style={{
                display:'flex', alignItems:'center', gap:10, position: 'relative', width:'100%', padding:'12px 16px',
                background: active ? `${a.color}18` : 'transparent', color: active ? a.color : '#555',
                border:'none', borderLeft:`3px solid ${active?a.color:'transparent'}`, cursor:'pointer', textAlign:'left',
                fontFamily:'inherit', fontSize:13, fontWeight: active?700:400, transition:'all 0.15s',
              }}>
                <span style={{fontSize:18, flexShrink:0}}>{a.label.split(' ')[0]}</span>
                <span style={{fontSize:13, lineHeight:1.2}}>{a.label.split(' ').slice(1).join(' ')}</span>
              </button>
            );
          })}
        </div>
        <div style={{padding:'8px', borderTop:'1px solid #10101e', display:'flex', flexDirection:'column'}}>
          <button onClick={exportJSON} style={sideBtn}>↓ 导出 JSON</button>
        </div>
      </div>

      {/* ════中间：主渲染区════ */}
      <div style={{ width: PW+40, flexShrink:0, borderRight:'1px solid #15152a', display:'flex', flexDirection:'column', padding:20, gap:14, overflowY:'auto' }}>
        <div style={{ borderRadius:10, overflow:'hidden', flexShrink:0, position: 'relative', boxShadow:`0 0 0 1px ${ac}44, 0 0 30px ${ac}18`, alignSelf:'center' }}>
            {curSt && <Face expId={selId} mouth={curSt.mouth} frame={frame} extras={curSt} animated={true} size={PW} />}
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:13,color:'#333'}}>F<span style={{color:ac,fontWeight:700}}>{String(frame).padStart(2,'0')}</span><span style={{color:'#222'}}> / {LOOP_F-1}</span></span>
          <div style={{display:'flex',gap:4}}>
            {[15,30,60].map(f=>(
              <button key={f} onClick={()=>setFps(f)} style={{ ...miniBtn, background:fps===f?`${ac}22`:'transparent', color:fps===f?ac:'#333', border:`1px solid ${fps===f?ac+'44':'#15152a'}` }}>{f}fps</button>
            ))}
          </div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>{setPlaying(false);setFrame(f=>Math.max(0,f-1));}} style={ctrlBtn}>◀</button>
          <button onClick={()=>setPlaying(p=>!p)} style={{ ...ctrlBtn, flex:1, background: playing?ac:'transparent', color: playing?'#000':'#666', borderColor: playing?ac:'#1e1e30', fontWeight:700 }}>{playing?'⏸ 暂停':'▶ 播放'}</button>
          <button onClick={()=>{setPlaying(false);setFrame(f=>Math.min(LOOP_F-1,f+1));}} style={ctrlBtn}>▶</button>
        </div>

        <div>
          <div style={{ position:'relative', height:36, borderRadius:6, background:'#0c0c1a', border:'1px solid #15152a', cursor:'crosshair' }} onClick={e=>{
            const r=e.currentTarget.getBoundingClientRect(); const f=Math.round(clamp((e.clientX-r.left)/r.width,0,1)*(LOOP_F-1));
            setPlaying(false); setFrame(f);
            let best=null,bestD=99; anim.keyframes.forEach((k,i)=>{const d=Math.abs(k.f-f);if(d<bestD){bestD=d;best=i;}});
            if(bestD<=3) setSelKf(best); else setSelKf(null);
          }}>
             <div style={{position:'absolute',top:0,left:0,height:'100%',borderRadius:6,width:`${(frame/(LOOP_F-1))*100}%`,background:`${ac}14`}}/>
             {anim.keyframes.map((k,i)=>(
               <div key={i} onClick={e=>{e.stopPropagation();setSelKf(i);setFrame(k.f);setPlaying(false);}} title={`F${k.f}`}
                 style={{ position:'absolute', left:`${(k.f/(LOOP_F-1))*100}%`, top:6, width:10, height:24, background:selKf===i?'#fff':ac, borderRadius:4, transform:'translateX(-5px)', cursor:'pointer', opacity:selKf===i?1:0.75 }}/>
             ))}
             <div style={{position:'absolute',left:`${(frame/(LOOP_F-1))*100}%`,top:0,width:2,height:'100%',background:'#ffffff40',pointerEvents:'none'}}/>
          </div>
        </div>

        <div style={{display:'flex',gap:6, marginTop: 10}}>
          <button onClick={addKf} style={{...ctrlBtn, flex:1, fontSize:12, color:'#3a8a5a', borderColor:'#1a3a2a'}}>＋ 新建关键帧</button>
          {selKf!=null&&<button onClick={()=>delKf(selKf)} style={{...ctrlBtn, color:'#8a3a3a', borderColor:'#3a1a1a'}}>删除</button>}
        </div>

        <div style={{display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid #15152a', flexShrink:0, marginTop:10}}>
          {[['edit','属性编辑'],['trans','状态机测试'],['export','MJPG导出']].map(([id,lb])=>(
            <button key={id} onClick={()=>setPanel(id)} style={{ flex:1, padding:'10px 0', border:'none', background: panel===id?'#15152a':'transparent', color: panel===id?ac:'#333', cursor:'pointer', fontFamily:'inherit', fontSize:13, borderRight:'1px solid #15152a' }}>{lb}</button>
          ))}
        </div>
      </div>

      {/* ════右侧：属性面板 / 状态机测试 / 导出 ════ */}
      <div style={{flex:1, overflowY:'auto', padding:24, display:'flex', flexDirection:'column', gap:20, minWidth:0}}>

        {panel==='edit' && (<>
          {!selKfD ? (
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div style={{fontSize:22,fontWeight:700,color:ac}}>{anim.label}</div>
              <div style={{fontSize:13,color:'#222',letterSpacing:2}}>点击左侧时间轴的色块，激活关键帧编辑器。</div>
            </div>
          ) : (
            <>
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <div style={{fontSize:20,fontWeight:700,color:ac}}>{anim.label}</div>
                <div style={{fontSize:12,color:'#222',letterSpacing:2}}>KF</div>
                <input type="number" min={0} max={LOOP_F-1} value={selKfD.f} onChange={e=>{const f=clamp(parseInt(e.target.value)||0,0,LOOP_F-1);updKf(selKf,{f});setFrame(f);}} style={{ width:56, background:'#0c0c1a', color:ac, border:`1.5px solid ${ac}55`, borderRadius:6, padding:'6px 8px', fontFamily:'inherit', fontSize:18, textAlign:'center'}}/>
              </div>

              {/* 空间弹性参数 */}
              <div style={{background:'#0c0c1a',border:'1px solid #15152a',borderRadius:10,padding:16}}>
                <div style={{fontSize:12,color:'#444',letterSpacing:2,marginBottom:16}}>空间形变 (Spatial Elasticity)</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                  {[
                    ['fx', 'X 位移', -30, 30, '#4A90D9'],
                    ['fy', 'Y 位移', -30, 30, '#26C6DA'],
                    ['sx', 'X 缩放 (挤压)', 0.5, 1.5, '#FFD600'],
                    ['sy', 'Y 缩放 (拉伸)', 0.5, 1.5, '#66BB6A'],
                    ['rot', '旋转角度', -25, 25, '#FF4081'],
                  ].map(([k,lb,min,max,c])=>(
                    <div key={k}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:11,color:'#666'}}>{lb}</span>
                        <span style={{fontSize:12,color:c,fontWeight:700}}>{Number(selKfD[k]||(k==='sx'||k==='sy'?1:0)).toFixed(2)}</span>
                      </div>
                      <input type="range" min={min} max={max} step={0.01} value={selKfD[k]||(k==='sx'||k==='sy'?1:0)} onChange={e=>updKf(selKf,{[k]:parseFloat(e.target.value)})} style={{width:'100%',accentColor:c,cursor:'pointer'}}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* 特效参数 */}
              <div style={{background:'#0c0c1a',border:'1px solid #15152a',borderRadius:10,padding:16}}>
                <div style={{fontSize:12,color:'#444',letterSpacing:2,marginBottom:16}}>附加特效 (Effects)</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                  {[ ['snore','Z泡','#7E57C2'], ['tear', '眼泪','#2D91FF'], ['blush','腮红','#E91E8C'], ['shake','高频抖动','#EF5350'], ['talk', '嘴巴张合', '#4CAF50'] ].map(([k,lb,c])=>(
                    <div key={k}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:11,color:'#666'}}>{lb}</span>
                        <span style={{fontSize:12,color:c,fontWeight:700}}>{Math.round((selKfD[k]||0)*100)}%</span>
                      </div>
                      <input type="range" min={0} max={1} step={0.01} value={selKfD[k]||0} onChange={e=>updKf(selKf,{[k]:parseFloat(e.target.value)})} style={{width:'100%',accentColor:c,cursor:'pointer'}}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* 嘴巴预设 */}
              <div>
                <div style={{fontSize:12,color:'#444',letterSpacing:2,marginBottom:10}}>嘴巴快选 (Mouth Presets)</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:6}}>
                  {Object.entries(MP).filter(([k])=>k!=='anchor').map(([k,pts])=>(
                    <button key={k} onClick={()=>updKf(selKf,{mouth:[...pts]})} style={{
                      background:'#0c0c1a', color:'#555', border:'1px solid #15152a', borderRadius:6, padding:'8px 6px', cursor:'pointer', fontFamily:'inherit', fontSize:11, transition:'all 0.1s',
                    }} onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;e.currentTarget.style.color=ac;}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#15152a';e.currentTarget.style.color='#555';}}>{k}</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>)}

        {panel==='trans' && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{fontSize:18,fontWeight:700,color:'#ccc'}}>全自动状态机测试 (FSM)</div>
            <div style={{fontSize:12,color:'#666'}}>严格生命周期：播放 A → 物理闭眼过渡 → 播放 B → 物理闭眼过渡</div>
            
            <div style={{display:'flex',gap:10}}>
              {[[transFrom,setTransFrom,'#26C6DA','表情 A'],[transTo,setTransTo,'#EC407A','表情 B']].map(([v,sv,c,lb])=>(
                <div key={lb} style={{flex:1}}>
                  <div style={{fontSize:10,color:c,marginBottom:5,letterSpacing:2}}>{lb}</div>
                  <select value={v} onChange={e=>sv(e.target.value)} style={{ width:'100%', background:'#0c0c1a', color:'#ccc', border:`1px solid ${c}44`, borderRadius:6, fontSize:12, padding:'8px 10px', fontFamily:'inherit' }}>
                    {ids.map(id=><option key={id} value={id}>{anims[id].label}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{borderRadius:10, overflow:'hidden', border:`1px solid ${ac}33`, alignSelf:'flex-start', boxShadow:`0 0 20px ${ac}18`}}>
              <TransStateMachine anims={anims} fromId={transFrom} toId={transTo} size={280}/>
            </div>
          </div>
        )}

        {/* 恢复并重写的 MJPG 导出 */}
        {panel==='export' && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{fontSize:18,fontWeight:700,color:'#ccc'}}>导出 ESP32 专属 MJPG (支持字节级跳转)</div>
            <div style={{background:'#0c0c1a',border:'1px solid #15152a',borderRadius:10,padding:16,lineHeight:2.2}}>
              <div style={{color:'#333',fontSize:12}}>总帧数</div>
              <div>
                <span style={{color:ac,fontWeight:700,fontSize:20}}>{N*LOOP_F+N*(N-1)*TRANS_F}</span>
                <span style={{color:'#333',fontSize:12}}> 帧 · 320×240</span>
              </div>
              <div style={{color:'#1e1e30',fontSize:11,marginTop:4}}>
                已嵌入字节偏移数组，ESP32 接收串口指令后，可直接 fseek 读取避免卡顿。
              </div>
            </div>

            {expSt==='rendering'&&(
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}><span style={{color:'#444'}}>{expLbl}</span><span style={{color:ac,fontWeight:700}}>{expPct}%</span></div>
                <div style={{height:8,background:'#15152a',borderRadius:4}}><div style={{height:'100%',background:ac,borderRadius:4,width:`${expPct}%`,transition:'width 0.15s'}}/></div>
              </div>
            )}
            {expSt==='idle'&&<button onClick={startExport} style={{...bigBtn,background:ac,color:'#000'}}>▶ 开始渲染</button>}
            {expSt==='rendering'&&<button style={{...bigBtn,background:'#15152a',color:'#222',cursor:'not-allowed'}}>渲染中 {expPct}%…</button>}
            {expSt==='done'&&expRes&&(
              <>
                <div style={{fontSize:13,color:'#3a8',padding:'8px 0'}}>✓ {expRes.plan.total} 帧渲染完成</div>
                <button onClick={()=>dl(expRes.mjpg,'esp_face_v17.mjpg')} style={{...bigBtn,background:'#0a2a1a',color:'#4a9',border:'1px solid #1a4a2a'}}>↓ esp_face_v17.mjpg</button>
                <button onClick={()=>dl(new Blob([expRes.json],{type:'application/json'}),'esp_face_index.json')} style={{...bigBtn,background:'#0a1a2a',color:'#49a',border:'1px solid #1a2a4a',marginTop:8}}>↓ esp_face_index.json (含 fseek 字节表)</button>
                <button onClick={()=>{setExpSt('idle');setExpRes(null);}} style={{...bigBtn,background:'transparent',color:'#333',border:'1px solid #1a1a2a',marginTop:8}}>重新导出</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── 样式常量 ─────────────────────────────────────────────────
const sideBtn = { display:'block', width:'100%', background:'transparent', color:'#333', border:'1px solid #15152a', borderRadius:6, padding:'8px 10px', cursor:'pointer', fontFamily:'inherit', fontSize:12, textAlign:'center', transition:'all 0.1s' };
const ctrlBtn = { background:'transparent', color:'#777', border:'1.5px solid #1e1e30', borderRadius:7, padding:'8px 14px', cursor:'pointer', fontFamily:'inherit', fontSize:13, minWidth:44 };
const miniBtn = { background:'transparent', color:'#444', border:'1px solid #15152a', borderRadius:5, padding:'4px 8px', cursor:'pointer', fontFamily:'inherit', fontSize:11 };
const bigBtn = { padding:'13px 20px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:14, fontWeight:700, width:'100%' };