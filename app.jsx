import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { 
  ArrowRight, ArrowUpRight, Map, Settings, ShoppingCart, 
  Building, Bot, LineChart, Sparkles, MessageSquare, 
  Smartphone, LayoutDashboard, Globe, Layers, Zap, ShieldCheck,
  Utensils, Calendar, Navigation, Store, Clock, Ticket, Baby, Camera, HelpCircle, Coffee
} from 'lucide-react';
import ButtonWithIcon from './components/ui/button-witn-icon';
import ArrowButton from './components/ui/arrow-button';
import { ShinyButton } from './components/ui/shiny-button';

// --- 1. 工具函数 ---
const cn = (...classes) => classes.filter(Boolean).join(' ');

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const TOURIST_TABS = [
  { value: "tab-1", label: "基于目的地的服务能力", icon: Map },
  { value: "tab-2", label: "每位游客独一无二的伴游记忆", icon: Layers },
  { value: "tab-3", label: "趣味性随身机器人", icon: Bot },
];

const INTERNAL_TABS = [
  { value: "tab-a", label: "操作类功能", icon: Settings },
  { value: "tab-b", label: "流程类功能", icon: LineChart },
  { value: "tab-c", label: "设计类功能", icon: Sparkles },
];

const useScrollReveal = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [delay]);

  return [domRef, isVisible];
};

// --- 2. ESP32 动画引擎核心逻辑 (提取 default_loop) ---
const LOOP_F = 90;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const lerpMP = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const eio = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const MP = {
  default: [188, 126, 188, 126, 183.772, 150, 160, 150, 136.228, 150, 132, 126, 132, 126],
  default_up: [186, 124, 186, 124, 182, 148, 160, 149, 138, 148, 134, 124, 134, 124],
};
const mpToD = p => `M${p[0]},${p[1]} C${p[2]},${p[3]} ${p[4]},${p[5]} ${p[6]},${p[7]} C${p[8]},${p[9]} ${p[10]},${p[11]} ${p[12]},${p[13]}`;

const K = (f, mk, ex = {}) => ({ f, mouth: [...MP[mk || "default"]], fx: 0, fy: 0, sx: 1, sy: 1, rot: 0, ...ex });

const defaultAnim = {
  keyframes: [K(0, "default"), K(22, "default_up"), K(45, "default"), K(67, "default_up"), K(89, "default")]
};

function evalKf(anim, frame) {
  const kfs = anim.keyframes;
  let p = kfs[0], n = kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    if (frame >= kfs[i].f && frame <= kfs[i + 1].f) { p = kfs[i]; n = kfs[i + 1]; break; }
  }
  if (p === n) return { ...p };
  const t = eio(clamp((frame - p.f) / (n.f - p.f), 0, 1));
  return {
    mouth: lerpMP(p.mouth, n.mouth, t),
    fx: lerp(p.fx || 0, n.fx || 0, t),
    fy: lerp(p.fy || 0, n.fy || 0, t),
    sx: lerp(p.sx || 1, n.sx || 1, t),
    sy: lerp(p.sy || 1, n.sy || 1, t),
    rot: lerp(p.rot || 0, n.rot || 0, t),
  };
}

function calcRhythm(f) {
  const s = Math.sin;
  let bX = 0, bY = 0, blinkSc = 1, mouthWobble = 0, tilt = 0, scaleX = 1, scaleY = 1;
  const breathPhase = s(f * 0.105);
  scaleY = 1 + breathPhase * 0.025;
  scaleX = 1 - breathPhase * 0.012;
  bY = breathPhase * 3;
  const seg = Math.floor(f / 30) % 3;
  const segP = eio(clamp((f % 30) / 20, 0, 1));
  tilt = seg === 0 ? lerp(0, -2.5, segP) : seg === 1 ? lerp(-2.5, 2.5, segP) : lerp(2.5, 0, segP);
  bX = tilt * 0.4;
  mouthWobble = breathPhase * 1.2;
  if (f >= 28 && f <= 29) blinkSc = 0.05;
  else if (f >= 68 && f <= 70) blinkSc = f === 69 ? 0.05 : 0.3;
  return { bX, bY, blinkSc, mouthWobble, tilt, scaleX, scaleY };
}

const Esp32Face = ({ frame, expressionId }) => {
  const expId = expressionId || 'default_loop';
  const st = evalKf(defaultAnim, frame);
  const r = calcRhythm(expId, frame);

  const fx = r.bX + (st.fx || 0);
  const fy = r.bY + (st.fy || 0);
  const rot = r.tilt + (st.rot || 0);
  const sx = r.scaleX * (st.sx || 1);
  const sy = r.scaleY * (st.sy || 1);

  const finalTransform = `translate(${160 + fx}, ${120 + fy}) rotate(${rot}) scale(${sx}, ${sy}) translate(-160, -120)`;

  return (
    <svg viewBox="0 0 320 240" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <g transform={finalTransform}>
        <path
          d={mpToD(st.mouth)}
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          transform={r.mouthWobble ? `translate(0, ${r.mouthWobble})` : undefined}
        />
        <g style={{ transformOrigin: '160px 112px', transform: `scaleY(${r.blinkSc})` }}>
          <ellipse cx="80" cy="112" rx="16" ry="24" fill="white" />
          <ellipse cx="240" cy="112" rx="16" ry="24" fill="white" />
        </g>
      </g>
    </svg>
  );
};

// --- 3. 数据集 ---
const TOURIST_QUERIES = [
  [
    { id: "q1", icon: Utensils, label: "周边有什么好吃的？" },
    { id: "q2", icon: Calendar, label: "景区今天有什么活动？" },
    { id: "q3", icon: Map, label: "有没有小众路线推荐？" },
    { id: "q4", icon: Sparkles, label: "我想要不一样的体验！" },
  ],
  [
    { id: "q5", icon: Navigation, label: "帮我规划明天行程" },
    { id: "q6", icon: Store, label: "酒店附近有便利店吗？" },
    { id: "q7", icon: Clock, label: "几点去排队比较好？" },
    { id: "q8", icon: Ticket, label: "哪里可以买特价票？" },
  ],
  [
    { id: "q9", icon: Baby, label: "带小孩适合去哪里？" },
    { id: "q10", icon: Camera, label: "哪里拍照最出片？" },
    { id: "q11", icon: HelpCircle, label: "洗手间怎么走？" },
    { id: "q12", icon: Coffee, label: "附近有喝咖啡的地方吗？" },
  ],
];

const TOURIST_FEATURES = [
  { id: "map", label: "景点推荐与预订", icon: Map, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200", description: "整合实时运营状态与口碑，提供无缝体验预订与精准推荐。" },
  { id: "message", label: "即时呼叫服务", icon: MessageSquare, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200", description: "语音交互，随时响应延迟退房、活动报名等即时需求。" },
  { id: "memory", label: "延续性伴游记忆", icon: Sparkles, image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1200", description: "持续感知游客偏好，记忆延续，告别千篇一律的机械推荐。" },
  { id: "robot", label: "现实场景交互", icon: Bot, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200", description: "联动线下随身机器人与硬件，跨越屏幕主动提供人性化服务。" },
];

const INTERNAL_FEATURES = [
  { id: "zap", label: "操作类：减错提效", icon: Zap, image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=1200", description: "酒店开关房、货盘追踪、PMS系统与票务状态实时自动更新。" },
  { id: "layers", label: "流程类：稳定复制", icon: Layers, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200", description: "智能派发工单，自动生成运营日报、月报及全渠道营销文案。" },
  { id: "chart", label: "思考类：辅助决策", icon: LineChart, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200", description: "深度智能问数分析，市场动态代理调价，数据驱动的精准推荐。" },
  { id: "design", label: "设计类：统一高效", icon: Sparkles, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200", description: "AIGC 高质量海报与短视频生成，符合企业特性的定制 IP 建模。" },
  { id: "settings", label: "定制类：降本增效", icon: Settings, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200", description: "游客合照智能优化，自动化满意度问卷，精准规划专属电子地图。" },
];

// --- Feature Carousel Component ---
function FeatureCarouselSection({ features, theme = "light" }) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-slate-900" : "bg-blue-500";
  const chipActiveBg = isDark ? "bg-white text-slate-900" : "bg-white text-blue-500";
  const chipInactiveBg = isDark ? "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white" : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white";
  const iconActiveColor = isDark ? "text-slate-900" : "text-blue-500";
  const iconInactiveColor = isDark ? "text-white/40" : "text-white/40";
  const headerBg = isDark ? "bg-white/10 border-white/20 text-white/80" : "bg-white border border-slate-200 text-slate-600";

  const currentIndex = ((step % features.length) + features.length) % features.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index) => {
    const diff = (index - currentIndex + features.length) % features.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, 4000);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index) => {
    const diff = index - currentIndex;
    const len = features.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full flex flex-col">
      <div className={cn("w-full min-h-[200px] md:min-h-[280px] relative z-30 flex flex-col items-center justify-center overflow-hidden px-8 py-8", bgColor)}>
        <div className="relative w-full h-full flex items-center justify-center z-20">
          {features.map((feature, index) => {
            const isActive = index === currentIndex;
            const distance = index - currentIndex;
            const wrappedDistance = wrap(-(features.length / 2), features.length / 2, distance);

            return (
              <motion.div
                key={feature.id}
                style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                animate={{
                  y: wrappedDistance * ITEM_HEIGHT,
                  opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 22,
                  mass: 1,
                }}
                className="absolute flex items-center justify-start"
              >
                <button
                  onClick={() => handleChipClick(index)}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className={cn(
                    "relative flex items-center gap-4 px-6 md:px-8 py-3 rounded-full transition-all duration-700 text-left group border",
                    isActive ? chipActiveBg : chipInactiveBg
                  )}
                >
                  <div className={cn("flex items-center justify-center transition-colors duration-500", isActive ? iconActiveColor : iconInactiveColor)}>
                    <feature.icon size={18} strokeWidth={2} />
                  </div>
                  <span className="font-medium text-sm md:text-[15px] tracking-tight whitespace-nowrap">
                    {feature.label}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className={cn("w-full min-h-[300px] md:min-h-[400px] relative flex items-center justify-center overflow-hidden", isDark ? "bg-slate-800/50" : "bg-slate-50")}>
        <div className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center">
          {features.map((feature, index) => {
            const status = getCardStatus(index);
            const isActive = status === "active";
            const isPrev = status === "prev";
            const isNext = status === "next";

            return (
              <motion.div
                key={feature.id}
                initial={false}
                animate={{
                  x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                  scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                  opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                  rotate: isPrev ? -3 : isNext ? 3 : 0,
                  zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 25,
                  mass: 0.8,
                }}
                className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden border-4 md:border-6 bg-background origin-center"
              >
                <img
                  src={feature.image}
                  alt={feature.label}
                  className={cn("w-full h-full object-cover transition-all duration-700", isActive ? "" : "grayscale blur-[2px] brightness-75")}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                    >
                      <div className={cn("px-4 py-1.5 rounded-full text-[11px] font-normal uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-border/50", headerBg)}>
                        {index + 1} • {feature.label}
                      </div>
                      <p className="text-white font-normal text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight">
                        {feature.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={cn("absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}>
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                  <span className="text-white/80 text-[10px] font-normal uppercase tracking-[0.3em] font-mono">Live Demo</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SurfaceCard = ({ children, className = "", delay = 0, hover = true }) => {
  const [ref, isVisible] = useScrollReveal(delay);
  return (
    <div 
      ref={ref} 
      className={`relative transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/60 backdrop-blur-2xl rounded-[32px] p-8 border border-white shadow-[0_4px_24px_-1px_rgba(0,0,0,0.04),0_0_1px_0_rgba(0,0,0,0.1)] ${hover ? 'hover:shadow-[0_12px_48px_-4px_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.1)] hover:-translate-y-1' : ''} overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/50 pointer-events-none"></div>
      {children}
    </div>
  );
};

const GlowButton = ({ children, primary = false, className = "", ...props }) => {
  return (
    <button 
      className={`relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-medium transition-all duration-300 active:scale-[0.98] group overflow-hidden ${primary ? 'text-white' : 'bg-white text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 hover:border-slate-300'} ${className}`} 
      {...props}
    >
      {primary && (
        <>
          <span className="absolute inset-0 bg-slate-900 group-hover:bg-slate-800 transition-colors"></span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-600/40 via-cyan-500/40 to-fuchsia-500/40 blur-md transition-opacity duration-500 pointer-events-none"></span>
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

const InteractiveArrowButton = ({ children, className, primary = true, size = "default", ...props }) => {
  const isLg = size === "lg";
  const bgClass = primary ? "bg-blue-600" : "bg-slate-900";
  const hoverBgClass = primary ? "group-hover:bg-slate-900" : "group-hover:bg-blue-600";

  return (
    <button className={cn("group flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent p-0 font-normal shadow-none hover:bg-transparent transition-transform active:scale-95 outline-none", className)} {...props}>
      <span className={cn("rounded-full font-semibold text-white duration-500 ease-in-out transition-colors shadow-md z-10 flex items-center", 
        bgClass, hoverBgClass,
        isLg ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"
      )}>
        {children}
      </span>
      <div className={cn("relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white duration-500 ease-in-out transition-colors shadow-md -ml-3", 
        bgClass, hoverBgClass,
        isLg ? "h-12 w-12" : "h-10 w-10"
      )}>
        <ArrowUpRight className={cn("absolute -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10", isLg ? "h-5 w-5" : "h-4 w-4")} />
        <ArrowUpRight className={cn("absolute -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2", isLg ? "h-5 w-5" : "h-4 w-4")} />
      </div>
    </button>
  );
};

const MagnifyingLens = ({ size = 92 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M365.424 335.392L342.24 312.192L311.68 342.736L334.88 365.936L365.424 335.392Z" fill="#B0BDC6" />
    <path d="M358.08 342.736L334.88 319.552L319.04 335.392L342.24 358.584L358.08 342.736Z" fill="#DFE9EF" />
    <path d="M352.368 321.808L342.752 312.192L312.208 342.752L321.824 352.36L352.368 321.808Z" fill="#B0BDC6" />
    <path d="M332 332C260 404 142.4 404 69.6001 332C-2.3999 260 -2.3999 142.4 69.6001 69.6C141.6 -3.20003 259.2 -2.40002 332 69.6C404.8 142.4 404.8 260 332 332ZM315.2 87.2C252 24 150.4 24 88.0001 87.2C24.8001 150.4 24.8001 252 88.0001 314.4C151.2 377.6 252.8 377.6 315.2 314.4C377.6 252 377.6 150.4 315.2 87.2Z" fill="#DFE9EF" />
    <path d="M319.2 319.2C254.4 384 148.8 384 83.2001 319.2C18.4001 254.4 18.4001 148.8 83.2001 83.2C148 18.4 253.6 18.4 319.2 83.2C384 148.8 384 254.4 319.2 319.2ZM310.4 92C250.4 32 152 32 92.0001 92C32.0001 152 32.0001 250.4 92.0001 310.4C152 370.4 250.4 370.4 310.4 310.4C370.4 250.4 370.4 152 310.4 92Z" fill="#7A858C" />
    <path d="M484.104 428.784L373.8 318.472L318.36 373.912L428.672 484.216L484.104 428.784Z" fill="#333333" />
    <path d="M471.664 441.224L361.344 330.928L330.8 361.48L441.12 471.76L471.664 441.224Z" fill="#575B5E" />
    <path d="M495.2 423.2C504 432 432.8 504 423.2 495.2L417.6 489.6C408.8 480.8 480 408.8 489.6 417.6L495.2 423.2Z" fill="#B0BDC6" />
    <path d="M483.2 435.2C492 444 444.8 492 435.2 483.2L429.6 477.6C420.8 468.8 468 420.8 477.6 429.6L483.2 435.2Z" fill="#DFE9EF" />
  </svg>
);

const MagnifiedBento = () => {
  const containerRef = useRef(null);
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);

  const clipPath = useMotionTemplate`circle(32px at calc(50% + ${lensX}px - 10px) calc(50% + ${lensY}px - 10px))`;
  const inverseMask = useMotionTemplate`radial-gradient(circle 32px at calc(50% + ${lensX}px - 10px) calc(50% + ${lensY}px - 10px), transparent 100%, black 100%)`;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden h-[260px] md:h-[300px]">
          <div className="relative h-full w-full flex flex-col items-center justify-center">
            
            <motion.div
              style={{ WebkitMaskImage: inverseMask, maskImage: inverseMask }}
              className="flex flex-col gap-4 w-full h-full justify-center"
            >
              {TOURIST_QUERIES.map((row, rowIndex) => (
                <motion.div
                  key={`row-${rowIndex}`}
                  className="flex gap-4 w-max"
                  animate={{ x: rowIndex % 2 === 0 ? ["0%", "-33.333%"] : ["-33.333%", "0%"] }}
                  transition={{ duration: 35, ease: "linear", repeat: Infinity }}
                >
                  {[...row, ...row, ...row].map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex gap-2.5 bg-white/60 backdrop-blur-sm whitespace-nowrap w-fit text-slate-600 p-2.5 px-4 items-center border border-slate-200/60 shadow-sm rounded-full text-sm font-medium"
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="absolute inset-0 flex flex-col gap-4 justify-center pointer-events-none select-none z-10"
              style={{ clipPath }}
            >
              {TOURIST_QUERIES.map((row, rowIndex) => (
                <motion.div
                  key={`row-reveal-${rowIndex}`}
                  className="flex gap-4 w-max"
                  animate={{ x: rowIndex % 2 === 0 ? ["0%", "-33.333%"] : ["-33.333%", "0%"] }}
                  transition={{ duration: 35, ease: "linear", repeat: Infinity }}
                >
                  {[...row, ...row, ...row].map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}-reveal`}
                      className="flex gap-2.5 bg-white/90 backdrop-blur-md whitespace-nowrap w-fit text-slate-800 p-2.5 px-4 items-center border border-slate-300 shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-full text-sm font-bold scale-[1.15] transform-gpu origin-center"
                    >
                      <item.icon size={16} className="text-slate-700" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="absolute z-40 cursor-grab active:cursor-grabbing drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
              drag
              dragMomentum={false}
              dragConstraints={containerRef}
              style={{ top: 'calc(50% - 50px)', left: 'calc(50% - 50px)', x: lensX, y: lensY }}
            >
              <div className="relative">
                <MagnifyingLens size={100} />
                <div className="absolute top-[8px] left-[8px] w-[64px] h-[64px] rounded-full bg-white/10 pointer-events-none shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)]" />
              </div>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-20"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-20"></div>
    </div>
  );
};

const RobotContainerSVG = () => (
  <img 
    src="/cell_bg.png"
    alt="Robot Container"
    width="512"
    height="516"
    className="w-full h-full object-contain"
  />
);

const IconoirIcons = {
  Map: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/>
      <path d="M9 4v13M15 7v13"/>
    </svg>
  ),
  ForkSpoon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  ),
  Ticket: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
      <path d="M13 5v2M13 17v2M13 11v2"/>
    </svg>
  ),
  BuildingHospital: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>
    </svg>
  ),
  Bot: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/>
      <rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>
    </svg>
  ),
  Camera: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  ),
};

const HeroRobotAvatar = () => {
  const [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
  const [frame, setFrame] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [currentExpression, setCurrentExpression] = useState('default_loop');
  const containerRef = useRef(null);

  const expressionList = [
    'default_loop',
    'talking', 
    'open_eye', 
    'very_happy', 
    'happy_wink',
    'sad',
    'angry',
    'cry',
    'very_worried',
    'sleep',
    'question',
  ];

  const triggerRandomExpression = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * expressionList.length);
    setCurrentExpression(expressionList[randomIndex]);
    setTimeout(() => setCurrentExpression('default_loop'), 2000);
  }, []);

  useEffect(() => {
    let timer = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_F);
    }, 1000 / 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.15) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxOffset = 50;
      
      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;
      
      setMousePosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, deltaX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, deltaY)),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const orbitalFeatures = [
    { 
      Icon: IconoirIcons.Map, 
      label: "景点推荐", 
      desc: "精准推荐游玩点",
      chat: [
        { role: "user", text: "附近有什么好玩的景点推荐吗？" },
        { role: "assistant", text: "根据您现在的位置，我推荐「荔波小七孔」景区，距离约15公里，风景秀丽，建议游览3-4小时。现在预约门票可享8折优惠哦～" },
      ]
    },
    { 
      Icon: IconoirIcons.ForkSpoon, 
      label: "餐饮预约", 
      desc: "地道美食发现",
      chat: [
        { role: "user", text: "附近有什么好吃的？" },
        { role: "assistant", text: "推荐您尝尝当地的酸汤鱼！距离最近的「苗家酸汤鱼」餐厅步行仅5分钟，评分4.8星，需要我帮您预约座位吗？" },
      ]
    },
    { 
      Icon: IconoirIcons.Ticket, 
      label: "活动报名", 
      desc: "精彩活动参与",
      chat: [
        { role: "user", text: "今晚有什么活动可以参加？" },
        { role: "assistant", text: "今晚8点有「苗族篝火晚会」，包含民族歌舞表演和互动游戏。门票68元/人，包含特色烧烤。需要我帮您报名吗？" },
      ]
    },
    { 
      Icon: IconoirIcons.BuildingHospital, 
      label: "酒店服务", 
      desc: "贴心入住体验",
      chat: [
        { role: "user", text: "可以帮我延迟退房吗？" },
        { role: "assistant", text: "好的，已为您办理延迟退房至下午2点。如需其他服务，随时呼叫我～" },
      ]
    },
    { 
      Icon: IconoirIcons.Bot, 
      label: "AI伴游", 
      desc: "专属智能助手",
      chat: [
        { role: "user", text: "明天天气怎么样？" },
        { role: "assistant", text: "明天多云转晴，气温18-26℃，适合出行。建议上午游览景区，下午可在酒店休息享受温泉～" },
      ]
    },
    { 
      Icon: IconoirIcons.Camera, 
      label: "趣味拍照", 
      desc: "智能合照留念",
      chat: [
        { role: "user", text: "帮我拍张照留念" },
        { role: "assistant", text: "好的！站在这个位置，看向镜头，3...2...1茄子！📸 照片已保存到您的相册，要不要加个滤镜或者生成AI漫画版？" },
      ]
    },
  ];

  const calculateNodePosition = (index, total, radius, offset = 15) => {
    const angle = ((index / total) * 360 + rotationAngle) * (Math.PI / 180);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    return { x: x + nx * offset, y: y + ny * offset };
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full h-full max-w-[600px] max-h-[600px] flex items-center justify-center pointer-events-auto"
    >
      {/* Robot Background */}
      <div className="absolute inset-0 flex items-center justify-center z-0 scale-[0.75]">
        <RobotContainerSVG />
      </div>

      {/* Outer Ring */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-slate-200/30 flex items-center justify-center z-0"></div>

      {/* Orbital Nodes */}
      {orbitalFeatures.map((feature, index) => {
        const pos = calculateNodePosition(index, orbitalFeatures.length, 260, 25);
        const IconComponent = feature.Icon;
        const isSelected = hoveredFeature === feature.label;
        
        const handleClick = () => {
          if (!isSelected) {
            const targetAngle = (index / orbitalFeatures.length) * 360;
            setRotationAngle(270 - targetAngle);
          }
          setHoveredFeature(isSelected ? null : feature.label);
          triggerRandomExpression();
        };
        
        return (
          <div
            key={feature.label}
            className="absolute flex items-center justify-center"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              zIndex: isSelected ? 100 : 10,
            }}
          >
            <div 
              className="relative group"
              onClick={handleClick}
            >
              {/* Node */}
              <div className={cn(
                "w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer",
                isSelected 
                  ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-blue-400 text-white scale-110 shadow-blue-200" 
                  : "bg-white border-2 border-slate-200 text-slate-600 hover:scale-110 hover:border-blue-400 hover:bg-blue-50"
              )}>
                <IconComponent />
              </div>

              {/* Chat Popup Modal */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                    style={{ zIndex: 1000 }}
                  >
                    {/* Chat Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <div className="text-white scale-75">
                          <IconComponent />
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{feature.label}</div>
                        <div className="text-white/80 text-xs">{feature.desc}</div>
                      </div>
                    </div>
                    {/* Chat Messages */}
                    <div className="p-4 space-y-3 bg-slate-50 max-h-40 overflow-y-auto">
                      {feature.chat.map((msg, idx) => (
                        <div key={idx} className={cn(
                          "flex gap-2",
                          msg.role === "user" && "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                            msg.role === "user" 
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white" 
                              : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
                          )}>
                            {msg.role === "user" ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></svg>
                            )}
                          </div>
                          <div className={cn(
                            "flex-1 px-3 py-2 rounded-2xl text-xs leading-relaxed shadow-sm",
                            msg.role === "user" 
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-tr-sm" 
                              : "bg-white text-slate-700 rounded-tl-sm border border-slate-200"
                          )}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Input Box */}
                    <div className="p-3 bg-white border-t border-slate-200">
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 rounded-xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 shrink-0">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <input 
                          type="text" 
                          placeholder="输入消息..." 
                          className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                        />
                        <button className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* Center Avatar */}
      <motion.div 
        className="relative z-10 flex items-center justify-center w-[440px] h-[330px] cursor-pointer"
        animate={{ x: mousePos.x, y: mousePos.y - 15 }} 
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        onClick={triggerRandomExpression}
      >
        <Esp32Face frame={frame} expressionId={currentExpression} />
      </motion.div>
    </motion.div>
  );
};

const AUTO_PLAY_INTERVAL = 4000;
const ITEM_HEIGHT = 70;

export function FeatureCarousel({ features, theme = "light" }) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex = ((step % features.length) + features.length) % features.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index) => {
    const diff = (index - currentIndex + features.length) % features.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index) => {
    const diff = index - currentIndex;
    const len = features.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  const isDark = theme === "dark";
  const bgColors = isDark
    ? { container: "bg-[#0f172a]", overlay: "from-[#0f172a]", gradient: "bg-gradient-to-b from-[#0f172a] via-[#0f172a]/80 to-transparent" }
    : { container: "bg-slate-50", overlay: "from-slate-50", gradient: "bg-gradient-to-b from-slate-50 via-slate-50/90 to-transparent" };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8">
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-slate-200/50 shadow-xl bg-white">

        <div className={cn("w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16", bgColors.container)}>
          <div className={cn("absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b z-40", bgColors.gradient)} />
          <div className={cn("absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t z-40", bgColors.gradient)} />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {features.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(-(features.length / 2), features.length / 2, distance);

              return (
                <motion.div
                  key={feature.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                      isActive
                        ? isDark ? "bg-white/10 text-cyan-400 border-white/20 z-10" : "bg-white text-blue-600 border-slate-200 z-10"
                        : isDark ? "text-white/60 border-white/20 hover:border-white/40 hover:text-white" : "text-slate-500 border-transparent hover:border-white/40 hover:text-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? (isDark ? "text-cyan-400" : "text-blue-600") : "text-slate-400"
                      )}
                    >
                      <feature.icon size={18} strokeWidth={2} />
                    </div>

                    <span className="font-medium text-sm md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className={cn("flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l", isDark ? "bg-slate-900/50 border-slate-800" : "bg-secondary/30 border-slate-200/20")}>
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {features.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                  className={cn("absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 origin-center", isDark ? "border-slate-800 bg-slate-900" : "border-background bg-background")}
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive ? "grayscale-0 blur-0" : "grayscale blur-[2px] brightness-75"
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className={cn("px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border", isDark ? "bg-white/10 text-white border-white/20 backdrop-blur-md" : "bg-background text-foreground border-border/50")}>
                          {index + 1} • {feature.label}
                        </div>
                        <p className="text-white font-normal text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={cn("absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}>
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <span className="text-white/80 text-[10px] font-medium uppercase tracking-[0.3em] font-mono">
                      Live Session
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const TabsContext = React.createContext();

const Tabs = ({ value, onValueChange, children }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    {children}
  </TabsContext.Provider>
);

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));

const TabsTrigger = React.forwardRef(({ value, className, children, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isActive = selectedValue === value;
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(value)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});

const TabsContent = React.forwardRef(({ value, className, children, ...props }, ref) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  if (selectedValue !== value) return null;
  return (
    <div ref={ref} role="tabpanel" className={className} {...props}>
      {children}
    </div>
  );
});

export function PillMorphTabs({ items = [], defaultValue, onValueChange, className, headerLeft }) {
  const first = items[0]?.value ?? "tab-0";
  const [value, setValue] = useState(defaultValue ?? first);
  const listRef = useRef(null);
  const triggerRefs = useRef({});
  const [indicator, setIndicator] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const measure = useCallback(() => {
    const list = listRef.current;
    const activeEl = triggerRefs.current[value];
    if (!list || !activeEl) {
      setIndicator(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const tRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: tRect.left - listRect.left + list.scrollLeft,
      width: tRect.width,
    });
  }, [value]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    Object.values(triggerRefs.current).forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    setIsExpanding(true);
    const id = window.setTimeout(() => setIsExpanding(false), 300);
    return () => window.clearTimeout(id);
  }, [value]);

  useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value, onValueChange]);

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={value} onValueChange={(v) => setValue(v)}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 w-full">
          {headerLeft && <div className="flex-1">{headerLeft}</div>}
          
          <div
            ref={listRef}
            className={cn(
              "relative inline-flex items-center gap-1 p-1 rounded-full shrink-0",
              "bg-slate-100/80 backdrop-blur-sm"
            )}
          >
            {indicator && (
              <motion.div
                layout
                initial={false}
                animate={{
                  left: indicator.left,
                  width: indicator.width,
                  scaleY: isExpanding ? 1.05 : 1,
                  borderRadius: 999,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute pointer-events-none top-1 bottom-1 rounded-full bg-white shadow-sm border border-slate-200/50"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                }}
              />
            )}
            <TabsList className="relative flex gap-1 z-10">
              {items.map((it) => {
                const isActive = it.value === value;
                return (
                  <TabsTrigger
                    key={it.value}
                    value={it.value}
                    ref={(el) => (triggerRefs.current[it.value] = el)}
                    className={cn(
                      "relative px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2",
                      isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {it.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        <div className="relative w-full">
          {items.map((it) => (
            <TabsContent key={it.value} value={it.value} className="outline-none">
              {it.panel}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* --- 导航：悬浮药丸 (Floating Pill Nav) --- */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
        <nav className={`pointer-events-auto transition-all duration-500 ease-out flex items-center justify-between px-2 py-2 rounded-full ${isScrolled ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/80 w-full max-w-4xl' : 'bg-transparent border border-transparent w-full max-w-7xl px-0'}`}>
          <div className="flex items-center gap-2 px-4 cursor-pointer">
            <img src="/logo.png" alt="NIANXX" className="h-7" />
          </div>
          
          <div className={`hidden md:flex items-center gap-2 ${isScrolled ? '' : 'bg-white/50 backdrop-blur-md rounded-full px-4 border border-white/60 shadow-sm'}`}>
            {['解决方案', '产品功能', '落地案例'].map((item) => (
              <a key={item} href={`#${item}`} className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 rounded-full transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="px-2">
            <ShinyButton size="small">联系我们</ShinyButton>
          </div>
        </nav>
      </div>

      {/* --- Section 1: Hero (Animated Face) --- */}
      <section className="relative min-h-[90vh] pt-40 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/80 via-cyan-50/50 to-fuchsia-50/50 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 flex flex-col items-start pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm text-slate-500 text-xs font-semibold mb-8 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              基于酒店 / 景区 / 目的地
            </div>
            
            <h1 className="text-5xl md:text-[5rem] font-bold tracking-tighter text-slate-900 leading-[1.05] mb-6">
              陌生之处<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500">不再孤身一人。</span>
            </h1>
            
            <p className="text-xl font-medium text-slate-700 mb-6 flex items-center gap-2">行中服务与消费 AI 智能体</p>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md font-light">
              通过部署私有化 AI 智能体，为您的游客重塑行中服务与消费体验。
            </p>
            
            <div className="flex flex-wrap gap-4">
              <GlowButton primary>查看产品体系 <ArrowRight size={16} /></GlowButton>
              <GlowButton>了解合作方式</GlowButton>
            </div>
          </div>

          <div className="lg:col-span-6 h-[600px] relative hidden lg:flex items-center justify-center scale-100 origin-center">
             <HeroRobotAvatar />
          </div>
        </div>
      </section>

      {/* --- Section 2: 市场洞察 --- */}
      <section className="py-24 relative z-10 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-12 mb-24">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                <span className="text-blue-600 bg-blue-100/50 px-2 py-1 rounded-xl">40%</span> 的行程消费<br/>发生于抵达之后。
              </h2>
              <p className="text-lg text-slate-500 font-light leading-relaxed">
                餐饮、体验、购物与交通消费持续发生，却分散且低效。在最接近交易的黄金节点，市场亟需一个<strong className="font-bold text-slate-700">懂场景、懂游客、懂本地供给</strong>的智能入口。
              </p>
            </div>
            
            <div className="relative w-full h-[300px] md:h-[350px] -mx-6 md:mx-0">
               <MagnifiedBento />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent -z-10"></div>
            
            <SurfaceCard delay={100} hover={false} className="!bg-white/40 opacity-70">
              <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Pre-trip</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">行前市场 <span className="text-sm font-normal text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">高度饱和</span></h3>
              <p className="text-sm text-slate-500 mb-6">流量垄断于平台，目的地沦为被动供应商。</p>
            </SurfaceCard>

            <SurfaceCard delay={200} hover={false} className="!border-blue-300 !bg-gradient-to-b from-white to-blue-50/50 shadow-xl transform md:-translate-y-4 ring-1 ring-blue-500/10">
              <div className="absolute top-0 inset-x-0 h-1 bg-blue-500"></div>
              <div className="text-xs font-bold text-blue-500 mb-3 uppercase tracking-widest flex items-center gap-1"><Sparkles size={14}/> Mid-trip (Nianxx)</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">行中市场 <span className="text-sm font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">亟待重组</span></h3>
              <p className="text-sm text-slate-600 mb-6 font-medium">游客已在目的地，消费随机发生，缺乏智能入口。</p>
            </SurfaceCard>

            <SurfaceCard delay={300} hover={false} className="!bg-white/40 opacity-70">
              <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Post-trip</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">行后市场 <span className="text-sm font-normal text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">成熟沉淀</span></h3>
              <p className="text-sm text-slate-500 mb-6">消费已结束，形成评价影响下一次决策。</p>
            </SurfaceCard>
          </div>
        </div>
      </section>

      {/* --- Section 3: 解决方案 --- */}
      <section id="解决方案" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">以服务重塑信任。</h2>
            <p className="text-xl text-slate-500 font-light mb-12">为每一个目的地，打造私有 AI 智能体。</p>

            <div className="grid md:grid-cols-3 gap-6 auto-rows-[280px]">
              <SurfaceCard delay={0} className="md:col-span-2 row-span-2 flex flex-col justify-between group !p-10 md:!p-12">
                 <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[80px] pointer-events-none"></div>
                 <div>
                   <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-8"><ShieldCheck size={20} className="text-blue-600"/></div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-6">私有核心资产</h3>
                   <div className="grid sm:grid-cols-2 gap-4">
                     {['平台是自己的', '品牌是自己的', '游客关系是自己的', '数据主权是自己的'].map(item => (
                       <div key={item} className="flex items-center gap-3 text-slate-600 font-medium bg-white/60 py-2.5 px-4 rounded-xl border border-white">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {item}
                       </div>
                     ))}
                   </div>
                 </div>
                 <p className="mt-8 text-slate-500 text-sm leading-relaxed max-w-md relative z-10">游客接触到的，是目的地专属的智能助手。它负责问答、导览、推荐、预约与转化，持续连接服务与交易。</p>
              </SurfaceCard>

              <SurfaceCard delay={100} className="flex flex-col">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shrink-0"><Settings size={18} className="text-slate-700"/></div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">专属 AI 定制</h3>
                 <p className="text-slate-500 font-light text-sm">深度融合品牌特征与业务逻辑，快速完成私有化部署。</p>
              </SurfaceCard>

              <SurfaceCard delay={200} className="flex flex-col">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shrink-0"><Map size={18} className="text-slate-700"/></div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">本地数据知识</h3>
                 <p className="text-slate-500 font-light text-sm">本地团队持续标注，让 AI 像原住民一样理解目的地的空间与细节。</p>
              </SurfaceCard>
            </div>

            <div className="mt-24">
              <div className="mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">服务先行，消费自然发生。</h3>
                <p className="text-lg text-slate-500 font-light">服务越自然，消费越顺畅。</p>
              </div>

              <p className="text-slate-600 text-lg font-light mb-12 max-w-3xl">帮助目的地销售的，不只是自己的商品，而是整个目的地的行中消费：</p>

              <div className="grid md:grid-cols-3 gap-8">
                <SurfaceCard delay={0} className="!bg-gradient-to-br !from-blue-50 !to-blue-100/30 border-blue-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-200/50 flex items-center justify-center">
                      <Building size={18} className="text-blue-600"/>
                    </div>
                    <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">第一层</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">目的地自营</h4>
                  <div className="flex flex-wrap gap-2">
                    {['客房升级', '餐饮', '纪念品', '门票加购', '园区二销', '增值服务'].map(item => (
                      <span key={item} className="px-3 py-1.5 bg-white/80 rounded-full text-slate-600 text-sm font-medium border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </SurfaceCard>

                <SurfaceCard delay={100} className="!bg-gradient-to-br !from-green-50 !to-green-100/30 border-green-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-200/50 flex items-center justify-center">
                      <Store size={18} className="text-green-600"/>
                    </div>
                    <span className="text-green-600 font-bold text-sm uppercase tracking-wider">第二层</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">本地全品类</h4>
                  <div className="flex flex-wrap gap-2">
                    {['周边餐厅', '咖啡', '交通接驳', '租车', '本地特产', '周边景点'].map(item => (
                      <span key={item} className="px-3 py-1.5 bg-white/80 rounded-full text-slate-600 text-sm font-medium border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </SurfaceCard>

                <SurfaceCard delay={200} className="!bg-gradient-to-br !from-amber-50 !to-amber-100/30 border-amber-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200/50 flex items-center justify-center">
                      <Sparkles size={18} className="text-amber-600"/>
                    </div>
                    <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">第三层</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">新体验经济</h4>
                  <div className="flex flex-wrap gap-2">
                    {['非遗体验', '手工课程', '徒步', '私人导览', '农场体验', '民俗活动'].map(item => (
                      <span key={item} className="px-3 py-1.5 bg-white/80 rounded-full text-slate-600 text-sm font-medium border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </SurfaceCard>
              </div>

              <p className="text-slate-500 text-base font-light mt-8 text-center">等本地特色供给</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 4: 产品功能 (Feature108 Style) --- */}
      <section id="产品功能" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-6 text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
              <Sparkles size={12} /> 产品功能
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">一个智能体，两幅面孔。</h2>
            <p className="text-lg text-slate-500 font-light max-w-2xl">对外伴游，对内赋能。不仅是单点工具，更是完整商业系统。</p>
          </div>

          {/* 游客看见什么 */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">游客看见什么</h3>
              <p className="text-slate-500 max-w-xl mx-auto">对外伴游，让每一位游客享受专属服务体验</p>
            </div>
            <FeatureCarouselSection 
              features={TOURIST_FEATURES} 
              theme="light" 
            />
          </div>

          {/* 内部看见什么 */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">内部看见什么</h3>
              <p className="text-slate-500 max-w-xl mx-auto">对内赋能，让运营效率提升数倍</p>
            </div>
            <FeatureCarouselSection 
              features={INTERNAL_FEATURES} 
              theme="dark" 
            />
          </div>
        </div>
      </section>

      {/* --- Section 5: 落地案例 --- */}
      <section id="落地案例" className="py-32 relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">落地案例验证。</h2>
            <p className="text-lg text-slate-500 font-light">首批项目已在贵州落地，覆盖景区、温泉、酒店等，进入真实运营阶段。</p>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-6 px-6 gap-6 hide-scrollbar snap-x snap-mandatory">
            {[
              { name: '荔波小七孔', ai: '七妹智能体', type: '景区' },
              { name: '凯里下司古镇', ai: '阿糯智能体', type: '古镇' },
              { name: '息烽天沐温泉', ai: '沐沐智能体', type: '温泉度假区' },
              { name: '云从朵花酒店', ai: '朵朵智能体', type: '酒店' },
            ].map((item, i) => (
              <SurfaceCard key={i} delay={i * 100} className="min-w-[280px] !p-6 group cursor-pointer snap-center shrink-0">
                <div className="h-40 bg-slate-100 rounded-2xl mb-6 relative overflow-hidden border border-slate-200/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase text-slate-600 shadow-sm">{item.type}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <Bot size={14} className="text-blue-500"/> {item.ai}
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 6: CTA 合作与 Footer (黑底沉浸感) --- */}
      <section id="合作方式" className="pt-20 pb-10 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[40px] p-10 md:p-20 relative overflow-hidden shadow-2xl border border-slate-800">
           <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           <div className="grid lg:grid-cols-2 gap-16 relative z-10">
             <div>
               <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">让接入更轻，<br/>让增量更快发生。</h2>
               <p className="text-slate-400 font-light mb-12 max-w-md">无论是单个景区酒店，还是全域文旅规划，我们都能提供在不改变现有业务基础上的开箱即用方案。</p>
               
               <div className="flex flex-col sm:flex-row gap-4">
                 <ShinyButton>获取合作方案</ShinyButton>
               </div>
             </div>

             <div className="flex flex-col justify-center gap-10 lg:pl-16 lg:border-l border-white/10">
               <div>
                 <div className="flex items-center gap-3 mb-3 text-white text-xl"><Building size={20}/> <span className="font-bold">面向景区、酒店业主</span></div>
                 <p className="text-sm text-slate-400 font-light leading-relaxed mb-3">提供私有智能体建设服务，快速拥有游客端 AI 入口与内部智能运营系统。</p>
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-3 text-white text-xl"><Globe size={20}/> <span className="font-bold">面向政府与文旅机构</span></div>
                 <p className="text-sm text-slate-400 font-light leading-relaxed mb-3">以游客数据为基础构建数字伴游基础设施，连接交通枢纽与公共场所。</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* 极简底部 */}
      <footer id="联系我们" className="py-12 text-center relative z-10 flex flex-col items-center">
         <div className="flex items-center gap-2 mb-4">
           <img src="/logo1.png" alt="NIANXX" className="h-8" />
         </div>
         <p className="text-sm text-slate-500 font-medium mb-8">陌生之处，不再孤身一人</p>
         <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-slate-500 font-medium bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
           <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> znkj@nianxx.com</span>
           <span className="hidden md:block w-px h-4 bg-slate-200"></span>
           <span className="flex items-center gap-2"><Map size={14}/> 贵阳高新区金阳科技产业园</span>
         </div>
      </footer>
    </div>
  );
}