import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { 
  ArrowRight, ArrowUpRight, Map, Settings, ShoppingCart, 
  Building, Bot, LineChart, Sparkles, MessageSquare, 
  Smartphone, LayoutDashboard, Globe, Layers, Zap, ShieldCheck,
  Utensils, Calendar, Navigation, Store, Clock, Ticket, Baby, Camera, HelpCircle, Coffee,
  Users, Database, Orbit
} from 'lucide-react';
import ButtonWithIcon from './components/ui/button-witn-icon';
import ArrowButton from './components/ui/arrow-button';
import { ShinyButton } from './components/ui/shiny-button';
import { Face, DEFAULT_ANIMS, evalKf, calcRhythm, LOOP_F } from './EspMjpgEngine';
import { AuroraBackground } from './components/ui/aurora-background';
import { X } from 'lucide-react';

// --- 0. 样式变量 (code.md) ---
const GRAPHIC_BG = "bg-[#f4f7fb]";
const GRID_DOTS = "radial-gradient(#cbd5e1 1px, transparent 1px)";
const SOFT_SHADOW = "shadow-[0_20px_40px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]";
const FLOATING_SHADOW = "shadow-[0_30px_60px_rgba(14,165,233,0.05),0_4px_10px_rgba(0,0,0,0.02)]";

// Graphic 01: 资讯
const GraphicOne = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden`}>
    <div className="absolute inset-0" style={{ backgroundImage: GRID_DOTS, backgroundSize: '24px 24px', opacity: 0.6 }} />
    <div className="absolute w-[60%] h-[50%] bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm -translate-y-6 translate-x-8" />
    <div className="absolute w-[60%] h-[50%] bg-white/60 rounded-xl border border-white/60 backdrop-blur-md translate-y-6 -translate-x-8" />
    <div className={`relative z-10 w-[65%] h-[60%] bg-white rounded-2xl border border-white ${FLOATING_SHADOW} p-5 flex flex-col justify-between transition-transform duration-700 hover:-translate-y-2`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <div className="w-1/3 h-2.5 bg-slate-200 rounded-full" />
          <div className="w-1/5 h-2 bg-slate-100 rounded-full" />
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="w-full h-2 bg-slate-100 rounded-full" />
        <div className="w-[90%] h-2 bg-slate-100 rounded-full" />
        <div className="w-[60%] h-2 bg-slate-100 rounded-full" />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between">
        <div className="w-16 h-6 bg-blue-50 rounded-md" />
        <div className="w-16 h-6 bg-slate-50 rounded-md" />
      </div>
    </div>
  </div>
);

// Graphic 02: 呼叫响应
const GraphicTwo = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden`}>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '100% 32px', opacity: 0.3 }} />
    <div className={`relative z-10 w-48 h-48 bg-white rounded-full border border-white ${FLOATING_SHADOW} flex items-center justify-center transition-transform duration-700 hover:scale-105`}>
      <div className="absolute w-[120%] h-[120%] border border-blue-100 rounded-full animate-[spin_10s_linear_infinite]">
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-300 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute w-[140%] h-[140%] border border-slate-100 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-6 bg-slate-200 rounded-full" />
        <div className="w-1.5 h-12 bg-blue-200 rounded-full" />
        <div className="w-1.5 h-16 bg-blue-400 rounded-full" />
        <div className="w-1.5 h-10 bg-blue-200 rounded-full" />
        <div className="w-1.5 h-5 bg-slate-200 rounded-full" />
      </div>
    </div>
  </div>
);

// Graphic 03: 需求感知
const GraphicThree = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden p-8`}>
    <div className="absolute inset-0" style={{ backgroundImage: GRID_DOTS, backgroundSize: '16px 16px', opacity: 0.5 }} />
    <div className="relative z-10 w-full h-full grid grid-cols-3 grid-rows-2 gap-4 transition-transform duration-700 hover:-translate-y-1">
      <div className={`col-span-2 row-span-2 bg-white rounded-2xl border border-white ${SOFT_SHADOW} p-4 flex flex-col`}>
        <div className="w-20 h-3 bg-slate-200 rounded-full mb-6" />
        <div className="flex-1 flex items-end gap-3 px-2">
          <div className="w-full h-[40%] bg-slate-100 rounded-t-md" />
          <div className="w-full h-[60%] bg-blue-100 rounded-t-md" />
          <div className="w-full h-[80%] bg-blue-300 rounded-t-md" />
          <div className="w-full h-[50%] bg-slate-100 rounded-t-md" />
          <div className="w-full h-[90%] bg-blue-400 rounded-t-md" />
        </div>
      </div>
      <div className={`col-span-1 row-span-1 bg-white rounded-2xl border border-white ${SOFT_SHADOW} flex items-center justify-center relative overflow-hidden`}>
        <div className="w-14 h-14 rounded-full border-[6px] border-slate-100 relative">
          <div className="absolute -top-1 -right-1 w-[22px] h-[22px] border-[6px] border-blue-400 rounded-tr-full" style={{ borderBottomWidth: 0, borderLeftWidth: 0 }} />
        </div>
      </div>
      <div className={`col-span-1 row-span-1 bg-white rounded-2xl border border-white ${SOFT_SHADOW} p-4 flex flex-col justify-between`}>
        <div className="w-12 h-2.5 bg-slate-200 rounded-full" />
        <div className="space-y-1.5">
          <div className="w-full h-5 bg-blue-50 rounded flex items-center px-1"><div className="w-1/2 h-1 bg-blue-300 rounded-full" /></div>
          <div className="w-full h-5 bg-slate-50 rounded flex items-center px-1"><div className="w-1/3 h-1 bg-slate-300 rounded-full" /></div>
        </div>
      </div>
    </div>
  </div>
);

// Graphic 04: 全程伴游
const GraphicFour = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden`}>
    <div className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-green-200 to-transparent top-1/2 -translate-y-1/2 rotate-12 opacity-50" />
    <div className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-green-200 to-transparent top-1/2 -translate-y-1/2 -rotate-12 opacity-50" />
    <div className={`relative z-10 w-[70%] h-[70%] bg-white/90 backdrop-blur-xl rounded-2xl border border-white ${FLOATING_SHADOW} flex flex-col overflow-hidden transition-transform duration-700 hover:scale-[1.02]`}>
      <div className="h-12 border-b border-slate-50 flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <div className="w-16 h-2 bg-slate-100 rounded-full ml-2" />
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex gap-3 w-[80%]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-200 to-green-400 shrink-0 shadow-inner flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-sm p-3 space-y-2">
            <div className="w-[90%] h-2 bg-slate-200 rounded-full" />
            <div className="w-[60%] h-2 bg-slate-200 rounded-full" />
          </div>
        </div>
        <div className="flex gap-3 w-[70%] self-end">
          <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl rounded-tr-sm p-3 space-y-2">
            <div className="w-full h-2 bg-green-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Graphic 05: 商品智荐
const GraphicFive = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden perspective-[1000px]`}>
    <div className="absolute w-64 h-64 bg-green-100/50 rounded-full blur-[50px]" />
    <div className="relative w-48 h-64 transition-transform duration-700 group hover:-translate-y-2" style={{ transformStyle: 'preserve-3d' }}>
      <div className={`absolute inset-0 bg-white rounded-xl border border-slate-100 ${SOFT_SHADOW} transform rotate-6 translate-x-4 translate-y-2 origin-bottom-right p-4 flex flex-col opacity-80`}>
        <div className="w-full aspect-square bg-slate-100 rounded-lg mb-3" />
        <div className="w-2/3 h-2 bg-slate-200 rounded-full" />
      </div>
      <div className={`absolute inset-0 bg-white rounded-xl border border-slate-100 ${SOFT_SHADOW} transform -rotate-3 -translate-x-4 translate-y-1 origin-bottom-left p-4 flex flex-col opacity-90`}>
        <div className="w-full aspect-square bg-slate-100 rounded-lg mb-3" />
        <div className="w-2/3 h-2 bg-slate-200 rounded-full" />
      </div>
      <div className={`absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl border border-white ${FLOATING_SHADOW} p-4 flex flex-col transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-4`}>
        <div className="w-full aspect-square bg-green-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute w-[150%] h-4 bg-white/40 rotate-45 transform translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[100%]" />
          <div className="w-12 h-12 border-2 border-green-200 rounded-md" />
        </div>
        <div className="w-3/4 h-3 bg-slate-800/10 rounded-full mb-2" />
        <div className="w-1/2 h-2 bg-slate-300 rounded-full mb-auto" />
        <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-2">
          <div className="w-8 h-3 bg-green-400/20 rounded-full" />
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-0.5 bg-white rounded-full relative"><div className="w-0.5 h-3 bg-white rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Graphic 06: 一站式预约 (多合一预订面板与打孔票务)
const GraphicSix = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden p-6`}>
    <div className="absolute inset-0" style={{ backgroundImage: GRID_DOTS, backgroundSize: '20px 20px', opacity: 0.6 }}></div>

    {/* 主干聚合面板 */}
    <div className={`relative z-10 w-[90%] h-[85%] bg-white/95 backdrop-blur-xl rounded-2xl border border-white ${FLOATING_SHADOW} p-4 flex gap-4 transition-transform duration-700 hover:scale-[1.02]`}>
      
      {/* 左侧：服务聚合菜单 (隐喻一站式选择) */}
      <div className="w-[35%] h-full flex flex-col gap-2.5 border-r border-slate-50 pr-4">
        <div className="w-16 h-2.5 bg-slate-200 rounded-full mb-2"></div>
        
        {/* 激活的服务分类 */}
        <div className="w-full h-9 bg-green-50 rounded-lg flex items-center px-2.5 gap-2.5 border border-green-100">
          <div className="w-4 h-4 bg-green-200 rounded flex-shrink-0"></div>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="w-1/2 h-1.5 bg-green-400 rounded-full"></div>
            <div className="w-1/3 h-1 bg-green-200 rounded-full"></div>
          </div>
        </div>
        
        {/* 未激活的服务分类 */}
        <div className="w-full h-9 flex items-center px-2.5 gap-2.5">
          <div className="w-4 h-4 bg-slate-100 rounded flex-shrink-0"></div>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="w-2/3 h-1.5 bg-slate-200 rounded-full"></div>
            <div className="w-1/2 h-1 bg-slate-100 rounded-full"></div>
          </div>
        </div>

        <div className="w-full h-9 flex items-center px-2.5 gap-2.5">
          <div className="w-4 h-4 bg-slate-100 rounded flex-shrink-0"></div>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="w-1/2 h-1.5 bg-slate-200 rounded-full"></div>
            <div className="w-1/4 h-1 bg-slate-100 rounded-full"></div>
          </div>
        </div>

        {/* 底部一键预订按钮 */}
        <div className="mt-auto w-full h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm shadow-green-500/20">
          <div className="w-16 h-1.5 bg-white/80 rounded-full"></div>
        </div>
      </div>

      {/* 右侧：多订单叠放与打孔票据 (隐喻所有预订生成一张凭证) */}
      <div className="flex-1 h-full relative flex flex-col items-center justify-center">
         {/* 底层阴影卡片 - 表现多订单合并 */}
         <div className="absolute w-[80%] h-[90%] bg-slate-50 rounded-xl border border-slate-100 transform translate-y-3 -rotate-6 opacity-60"></div>
         <div className="absolute w-[85%] h-[90%] bg-white rounded-xl border border-slate-100 transform translate-y-1.5 rotate-3 opacity-80 shadow-sm"></div>
         
         {/* 顶层主票据 */}
         <div className={`relative w-[90%] h-[95%] bg-gradient-to-b from-green-50/40 to-white rounded-xl border border-slate-100 ${SOFT_SHADOW} flex flex-col overflow-hidden`}>
            
            {/* 票务核心信息区 */}
            <div className="h-[40%] p-4 flex flex-col justify-center gap-3">
               <div className="flex justify-between items-center px-1">
                 <div className="w-8 h-2.5 bg-green-300 rounded-full"></div>
                 <div className="flex-1 mx-3 border-b-2 border-dotted border-green-200 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-green-300"></div>
                 </div>
                 <div className="w-8 h-2.5 bg-green-300 rounded-full"></div>
               </div>
               <div className="flex justify-between px-1">
                 <div className="w-10 h-1.5 bg-slate-300 rounded-full"></div>
                 <div className="w-10 h-1.5 bg-slate-300 rounded-full"></div>
               </div>
            </div>

            {/* 物理打孔与虚线分割 */}
            <div className="relative w-full h-0">
               <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-slate-200"></div>
               {/* 左右缺口 - 完美伪造物理纸张裁剪感 */}
               <div className="absolute top-0 -left-3 w-6 h-6 bg-white rounded-full border border-slate-100 -translate-y-1/2 shadow-inner"></div>
               <div className="absolute top-0 -right-3 w-6 h-6 bg-white rounded-full border border-slate-100 -translate-y-1/2 shadow-inner"></div>
            </div>

            {/* 条码与价格结算区 */}
            <div className="flex-1 p-4 flex flex-col justify-between items-center">
               <div className="w-full flex justify-between items-end mb-2">
                 <div className="flex flex-col gap-1.5">
                   <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                   <div className="w-16 h-2 bg-slate-300 rounded-full"></div>
                 </div>
                 <div className="w-10 h-3 bg-green-500 rounded-full"></div>
               </div>
               
               {/* 拟物条形码骨架 */}
               <div className="w-full h-8 flex gap-[3px] items-center justify-center opacity-30 mt-auto">
                 <div className="w-1 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-2 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-1.5 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-0.5 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-2 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-1 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-0.5 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-1.5 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-2 h-full bg-slate-800 rounded-sm"></div>
                 <div className="w-1 h-full bg-slate-800 rounded-sm"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
);

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

// --- 2. ESP32 动画引擎核心逻辑 (使用 EspMjpgEngine 导入的版本) ---

// Face 组件已从 EspMjpgEngine.jsx 导入

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
  { id: "zap", label: "操作类：减错提效", icon: Zap, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200", description: "酒店开关房、货盘追踪、PMS系统与票务状态实时自动更新。" },
  { id: "layers", label: "流程类：稳定复制", icon: Layers, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200", description: "智能派发工单，自动生成运营日报、月报及全渠道营销文案。" },
  { id: "chart", label: "思考类：辅助决策", icon: LineChart, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200", description: "深度智能问数分析，市场动态代理调价，数据驱动的精准推荐。" },
  { id: "design", label: "设计类：统一高效", icon: Sparkles, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200", description: "AIGC 高质量海报与短视频生成，符合企业特性的定制 IP 建模。" },
  { id: "settings", label: "定制类：降本增效", icon: Settings, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200", description: "游客合照智能优化，自动化满意度问卷，精准规划专属电子地图。" },
];

// ==========================================
// 方案 B: 浅色全息枢纽数据字典
// ==========================================
const CORE_TITLE = "私有核心资产";
const METRICS = [
  { value: "24/7", label: "全天候", icon: Clock },
  { value: "99.9%", label: "响应速度", icon: Zap },
  { value: "∞", label: "持续学习", icon: Sparkles },
];

const FEATURES = [
  { id: "platform", title: "平台私有化", desc: "独立部署，数据自主。深度定制、安全可控、灵活扩展。", color: "blue", icon: ShieldCheck },
  { id: "brand", title: "品牌独立化", desc: "定制IP，形象统一。打造专属品牌形象与用户认知。", color: "indigo", icon: Building },
  { id: "relationship", title: "关系资产化", desc: "用户关系，深度沉淀。建立持续优化的用户粘性。", color: "emerald", icon: Users },
  { id: "data", title: "数据自主化", desc: "第一方数据，安全可控。数据驱动精准运营决策。", color: "violet", icon: Database },
];

// ==========================================
// 浅色全息枢纽组件
// ==========================================
const ConceptLightNexus = () => (
  <section id="解决方案" className="min-h-screen bg-[#f8fafc] overflow-hidden flex items-center justify-center py-24 relative">
    {/* 浅色网格与环境光 */}
    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none"></div>

    <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex flex-col items-center">
      
      {/* 顶部玻璃态 HUD (Data Strip) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 flex flex-wrap justify-between items-center mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
      >
         <div className="text-slate-800 pr-8 border-r border-slate-200">
           <h2 className="text-[28px] font-bold tracking-tight">{CORE_TITLE}</h2>
           <p className="text-xs text-blue-500 mt-1 uppercase tracking-widest font-semibold">Core Infrastructure</p>
         </div>
         <div className="flex flex-1 justify-around pl-4">
           {METRICS.map((m, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: i * 0.1 }}
               viewport={{ once: true }}
               className="flex flex-col items-center"
             >
                <span className="text-[28px] md:text-[32px] font-extrabold text-slate-800">{m.value}</span>
                <span className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1 font-medium"><m.icon className="w-3.5 h-3.5 text-blue-400"/> {m.label}</span>
             </motion.div>
           ))}
         </div>
      </motion.div>

      {/* 中心能量枢纽布局 */}
      <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-auto md:min-h-[600px] mt-10 flex items-center justify-center">
         
         {/* 发光中心球 (Light Core) */}
         <motion.div 
           initial={{ scale: 0, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.3 }}
           viewport={{ once: true }}
           className="w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-white to-blue-50 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.2),inset_0_10px_20px_rgba(255,255,255,1)] z-20 border-4 border-white animate-[pulse_4s_ease-in-out_infinite] shrink-0"
         >
            <Orbit className="w-14 h-14 md:w-16 md:h-16 text-blue-500" strokeWidth={1.5} />
            <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-ping"></div>
         </motion.div>

         {/* 环绕卡片 (Orbiting Cards) */}
         <div className="absolute inset-0">
            {FEATURES.map((feature, i) => {
              const positions = [
                "top-0 left-0 md:top-10 md:left-10",
                "top-0 right-0 md:top-10 md:right-10",
                "bottom-0 left-0 md:bottom-10 md:left-10",
                "bottom-0 right-0 md:bottom-10 md:right-10"
              ];
              const colors = [
                { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-500", line: "from-blue-200 to-transparent" },
                { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-500", line: "from-indigo-200 to-transparent" },
                { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-500", line: "from-emerald-200 to-transparent" },
                { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-500", line: "from-violet-200 to-transparent" }
              ];
              const lineStyles = [
                 `top-[50%] left-[100%] w-32 h-px bg-gradient-to-r ${colors[i].line} transform rotate-45 origin-left`,
                 `top-[50%] right-[100%] w-32 h-px bg-gradient-to-l ${colors[i].line} transform -rotate-45 origin-right`,
                 `top-[50%] left-[100%] w-32 h-px bg-gradient-to-r ${colors[i].line} transform -rotate-45 origin-left`,
                 `top-[50%] right-[100%] w-32 h-px bg-gradient-to-l ${colors[i].line} transform rotate-45 origin-right`
              ];
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className={`absolute ${positions[i]} w-[45%] md:w-[320px] bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl hover:bg-white transition-all duration-300 group cursor-pointer z-30 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2`}
                >
                   <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 ${colors[i].bg} rounded-xl flex items-center justify-center border ${colors[i].border}`}>
                         <feature.icon className={`w-6 h-6 ${colors[i].text}`} />
                      </div>
                      <h3 className="text-slate-800 font-bold text-lg">{feature.title}</h3>
                   </div>
                   <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                   {/* 隐喻连接线 */}
                   <div className={`hidden md:block absolute ${lineStyles[i]} pointer-events-none`}></div>
                </motion.div>
              )
            })}
         </div>
      </div>
    </div>
  </section>
);

const CASES = [
  { 
    name: '荔波小七孔', 
    ai: '七妹智能体', 
    type: '景区', 
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    desc: '世界自然遗产地，游客可通过七妹智能体获取实时导览、景点推荐与门票预约服务。'
  },
  { 
    name: '凯里下司古镇', 
    ai: '阿糯智能体', 
    type: '古镇', 
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800',
    desc: '体验当地特色民俗文化，阿糯智能体提供专属导览与手工艺品预约服务。'
  },
  { 
    name: '息烽天沐温泉', 
    ai: '沐沐智能体', 
    type: '温泉度假区', 
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    desc: '沐沐智能体为游客提供温泉预约、水疗推荐与周边餐饮指引服务。'
  },
  { 
    name: '云从朵花酒店', 
    ai: '朵朵智能体', 
    type: '酒店', 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    desc: '朵朵智能体提供入住指引、客房服务与本地旅游推荐，打造智能入住体验。'
  },
];

// ==========================================
// 游客视角卡片数据 (code-two.md)
// ==========================================
const TOURIST_CARDS = [
  { 
    id: 't1', 
    type: 'tourist', 
    title: '景点推荐与预订', 
    desc: '整合实时运营状态与口碑，提供无缝体验预订与精准推荐。', 
    detailedDesc: '深度打通目的地实时客流、天气状况与全网真实口碑，通过大模型引擎构建动态知识图谱。不仅能为游客提供个性化的避障与游玩路线规划，更从底层打通了支付与核销系统。真正实现从"种草-决策-预订-体验"的无缝闭环。', 
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200' 
  },
  { 
    id: 't2', 
    type: 'tourist', 
    title: '即时呼叫服务', 
    desc: '语音交互，随时响应延迟退房、活动报名等即时需求。', 
    detailedDesc: '搭载支持多语种、带有情感计算的自然语言处理引擎。无论是清晨要求延迟退房，还是深夜的紧急求助呼叫，系统均能做到毫秒级精准意图识别并自动流转工单给相应部门。提供 7x24 小时零延迟、带有温度的专属管家服务。', 
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200' 
  },
  { 
    id: 't3', 
    type: 'tourist', 
    title: '延续性伴游记忆', 
    desc: '持续感知游客偏好，记忆延续，告别千篇一律的机械推荐。', 
    detailedDesc: 'AI 智能体会持续学习并记录游客的每一次交互、偏好标签与消费习惯，沉淀为专属 User Profile。当游客跨越不同场景，或下一次复游时，服务能做到无缝接续，主动屏蔽已排斥选项，真正实现"越用越懂你"的陪伴。', 
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1200' 
  },
  { 
    id: 't4', 
    type: 'tourist', 
    title: '现实场景交互', 
    desc: '联动线下随身机器人与硬件，跨越屏幕主动提供人性化服务。', 
    detailedDesc: '突破数字屏幕限制，让 AI 拥有物理载体。系统深度联动景区内的智能向导车、酒店配送机器人及 IoT 硬件。当游客靠近特定区域时，不仅手机端有向导推送，实体机器人也能主动识别、迎宾带路，打造虚实共生的未来文旅体验。', 
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200' 
  }
];

// ==========================================
// 内部视角卡片数据 (code-two.md)
// ==========================================
const INTERNAL_CARDS = [
  { 
    id: 'i1', 
    type: 'internal', 
    title: '操作类：减错提效', 
    desc: '酒店开关房、货盘追踪、PMS系统与票务状态实时自动更新。', 
    detailedDesc: '针对日常操作提供 RPA 级别系统赋能。员工无需跨系统反复录入，智能体能自动同步 PMS 房态、执行库存盘点、货盘追踪及多渠道票务状态更新。将一线员工从枯燥操作中解放，实现真正降本与减错。', 
    image: 'https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=1200' 
  },
  { 
    id: 'i2', 
    type: 'internal', 
    title: '流程类：稳定复制', 
    desc: '智能派发工单，自动生成运营日报、月报及全渠道营销文案。', 
    detailedDesc: '将企业优秀运营经验沉淀为算法模型。全天候监听业务异常节点并智能流转工单。同时基于海量数据，一键自动生成高度结构化的日/月报，更能批量生成符合小红书、抖音等语境的高转化营销文案。', 
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200' 
  },
  { 
    id: 'i3', 
    type: 'internal', 
    title: '思考类：辅助决策', 
    desc: '深度智能问数分析，市场动态代理调价，数据驱动的精准推荐。', 
    detailedDesc: '为管理层配备 24 小时在线的数据科学家。支持自然语言"问数"交互，秒级生成可视化洞察。更具备市场动态调价功能，依据竞品动态与供需曲线自动计算最优收益率价格，实现敏捷商业决策。', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200' 
  },
  { 
    id: 'i4', 
    type: 'internal', 
    title: '设计类：统一高效', 
    desc: 'AIGC 高质量海报与短视频生成，符合企业特性的定制 IP 建模。', 
    detailedDesc: '突破内容创作产能瓶颈。内置专属品牌微调大模型，输入简单 Prompt 即可大批量生成活动海报、短视频脚本，乃至构建符合品牌调性的 3D 虚拟 IP。保证品牌视觉高度统一，将物料产出周期缩短至秒级。', 
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200' 
  },
  { 
    id: 'i5', 
    type: 'internal', 
    title: '定制类：降本增效', 
    desc: '游客合照智能优化，自动化满意度问卷，精准规划专属电子地图。', 
    detailedDesc: '关注高频服务触点创新。利用端侧 AI 为游客自动合成完美打卡合照提升分享意愿；在最佳情绪触点自动触发交互问卷；基于游客偏好一键生成专属纪念地图，用极低边际成本创造无量情绪价值。', 
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200' 
  }
];

// ==========================================
// 沉浸式详情弹窗组件
// ==========================================
const DetailModal = ({ card, onClose }) => {
  if (!card) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.15)] border border-white/40 flex flex-col md:flex-row overflow-hidden animate-[in_0.3s_ease-out]">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        {/* 左侧大图展示区 */}
        <div className="w-full md:w-[45%] bg-slate-50 min-h-[300px] md:min-h-[500px] flex items-center justify-center p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm bg-slate-100">
            <img 
              src={card.image} 
              alt={card.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 右侧文本区 */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 font-semibold text-[12px] uppercase tracking-wider rounded-md mb-6 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> {card.type === 'tourist' ? 'Tourist Perspective' : 'Internal Perspective'}
          </div>
          <h2 className="text-[32px] md:text-[40px] font-bold text-slate-900 leading-tight tracking-tight mb-4">{card.title}</h2>
          <p className="text-[18px] text-slate-600 font-medium mb-8 pb-8 border-b border-slate-100 leading-relaxed">{card.desc}</p>
          <div className="space-y-6 text-[16px] text-slate-500 leading-[1.8] font-normal">
            {card.detailedDesc.split('。').filter(Boolean).map((s, i) => <p key={i}>{s + '。'}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 画廊卡片组件
// ==========================================
const GalleryCard = ({ card, onSelect }) => {
  return (
    <div className="shrink-0 w-[85vw] md:w-[40vw] h-[55vh] md:h-[65vh] flex flex-col group cursor-pointer" onClick={() => onSelect(card)}>
      <div className="w-full h-full bg-white rounded-3xl p-2 shadow-sm shadow-slate-200/20 border border-white flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-sm">
         
         {/* 图片容器区 */}
         <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
              {card.type}
            </div>
         </div>

         {/* 文本区 */}
         <div className="p-6 h-32 flex flex-col justify-center" dir="ltr">
            <h3 className="text-[22px] font-bold text-slate-900 tracking-tight">{card.title}</h3>
            <div className="mt-2 flex items-center text-blue-500 font-semibold text-sm opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              查阅详情 <ArrowRight className="w-4 h-4 ml-1" />
            </div>
         </div>
      </div>
    </div>
  );
};

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

  useEffect(() => {
    setStep(0);
  }, [features]);

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
    <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row min-h-[500px] md:min-h-[550px] border border-slate-200/50 shadow-xl">
      <div className={cn("w-full md:w-[45%] min-h-[350px] md:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-12 py-10", bgColor)}>
        <div className="relative w-full h-full flex items-center justify-center md:justify-start z-20">
          {features.map((feature, index) => {
            const isActive = index === currentIndex;
            const distance = index - currentIndex;
            const wrappedDistance = wrap(-(features.length / 2), features.length / 2, distance);

            return (
              <motion.div
                key={feature.id}
                style={{
                  height: ITEM_HEIGHT,
                  width: "fit-content",
                }}
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
                className="absolute flex items-center justify-start md:justify-start"
              >
                <button
                  onClick={() => handleChipClick(index)}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className={cn(
                    "relative flex items-center gap-4 px-8 py-4 rounded-full transition-all duration-700 text-left group border",
                    isActive
                      ? "bg-white text-blue-500 border-white z-10 shadow-lg"
                      : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                  )}
                >
                  <div className={cn("flex items-center justify-center transition-colors duration-500", isActive ? iconActiveColor : iconInactiveColor)}>
                    <feature.icon size={20} strokeWidth={2} />
                  </div>
                  <span className="font-medium text-base tracking-tight whitespace-nowrap">
                    {feature.label}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className={cn("flex-1 min-h-[400px] md:h-full relative flex items-center justify-center py-10 md:py-12 px-6 md:px-10 overflow-hidden", isDark ? "bg-slate-800/50" : "bg-slate-50")}>
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
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 25,
                  mass: 0.8,
                }}
                className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-6 bg-background origin-center"
              >
                <img
                  src={feature.image}
                  alt={feature.label}
                  className={cn("w-full h-full object-cover transition-all duration-700", isActive ? "grayscale-0" : "grayscale blur-[2px] brightness-75")}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                    >
                      <div className={cn("px-4 py-1.5 rounded-full text-[11px] font-normal uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-border/50", isDark ? "bg-white/10 border-white/20 text-white/80" : "bg-white border border-slate-200 text-slate-600")}>
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

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-20"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-20"></div>
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
    setTimeout(() => setCurrentExpression('default_loop'), 5000);
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
                {isSelected && (() => {
                  const angle = (index / orbitalFeatures.length) * 360 + rotationAngle;
                  const rad = angle * (Math.PI / 180);
                  const isLeft = Math.cos(rad) < 0;
                  
                  return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: isLeft ? 20 : -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: isLeft ? 20 : -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden",
                      isLeft ? "left-full ml-4" : "right-full mr-4"
                    )}
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
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* Center Avatar */}
      <motion.div 
        className="relative z-10 flex items-center justify-center w-[320px] h-[240px] cursor-pointer select-none"
        style={{ userSelect: 'none' }}
        animate={{ x: mousePos.x, y: mousePos.y - 15 }} 
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        onClick={triggerRandomExpression}
      >
        <Face expId={currentExpression} mouth={evalKf(DEFAULT_ANIMS.default_loop, frame)?.mouth || [188, 126, 188, 126, 183.772, 150, 160, 150, 136.228, 150, 132, 126, 132, 126]} frame={frame} animated={true} size={320} />
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

// --- Spatial Product Showcase Component (新版：左边同心圆Face，右边展开卡片) ---
function SpatialProductShowcase({ features, mode = 'tourist' }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [frame, setFrame] = useState(0);
  const [currentExpression, setCurrentExpression] = useState('default_loop');
  const isTourist = mode === 'tourist';

  const expressionList = ['default_loop', 'talking', 'open_eye', 'very_happy', 'happy_wink', 'sad', 'angry', 'sleep', 'question'];

  useEffect(() => {
    let timer = setInterval(() => {
      setFrame(f => (f + 1) % LOOP_F);
    }, 1000 / 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * expressionList.length);
      setCurrentExpression(expressionList[randomIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* 左侧：简洁的 Face 展示 */}
        <motion.div 
          key={mode + '-left'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-auto flex-shrink-0"
        >
          <div className={cn(
            "relative w-72 h-72 mx-auto",
            "flex items-center justify-center"
          )}>
            {/* 柔和的光晕背景 */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "absolute inset-0 rounded-full blur-3xl",
                isTourist ? "bg-blue-400/20" : "bg-green-400/20"
              )}
            />
            
            {/* 玻璃质感圆环 */}
            <div className={cn(
              "absolute inset-0 rounded-full border-2 backdrop-blur-sm",
              isTourist 
                ? "bg-blue-50/30 border-blue-200/50" 
                : "bg-green-50/30 border-green-200/50"
            )} />

            {/* Face */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Face 
                expId={currentExpression}
                mouth={evalKf(DEFAULT_ANIMS[currentExpression], frame)?.mouth}
                frame={frame}
                size={200}
                animated={true}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* 右侧：卡片网格 */}
        <motion.div 
          key={mode + '-right'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className={cn(
                  "group relative rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden",
                  activeIndex === index
                    ? cn(
                        isTourist ? "ring-2 ring-blue-400 shadow-xl shadow-blue-100/50" : "ring-2 ring-green-400 shadow-xl shadow-green-100/50",
                        "bg-white"
                      )
                    : "bg-slate-50/80 hover:bg-white border border-slate-200/60 hover:border-slate-300 hover:shadow-lg"
                )}
              >
                {/* 顶部装饰条 */}
                <div className={cn(
                  "h-1 w-full transition-all duration-300",
                  activeIndex === index
                    ? isTourist ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-transparent group-hover:bg-slate-200"
                )} />
                
                <div className="p-5">
                  {/* 图标和标题 */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                      activeIndex === index
                        ? isTourist ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-green-500 text-white shadow-lg shadow-green-200"
                        : isTourist 
                          ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200" 
                          : "bg-green-100 text-green-600 group-hover:bg-green-200"
                    )}>
                      <feature.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h4 className={cn(
                        "font-semibold text-[15px] leading-tight mb-0.5",
                        activeIndex === index 
                          ? isTourist ? "text-blue-700" : "text-green-700"
                          : "text-slate-800"
                      )}>
                        {feature.label}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>

                  {/* 展开的图片 */}
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                          <img 
                            src={feature.image} 
                            alt={feature.label}
                            className="w-full h-full object-cover"
                          />
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                          )} />
                          <div className="absolute bottom-2.5 left-3">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[11px] font-medium text-white backdrop-blur-sm",
                              isTourist ? "bg-blue-500/90" : "bg-green-500/90"
                            )}>
                              {feature.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* 详细描述 */}
                        <p className="text-sm text-slate-600 leading-relaxed px-0.5">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 点击提示 */}
                  {!activeIndex && (
                    <div className={cn(
                      "text-xs font-medium transition-colors duration-200 mt-2",
                      isTourist ? "text-blue-500/70" : "text-green-500/70",
                      "group-hover:text-blue-500/90"
                    )}>
                      点击查看详情 →
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
  const [activeTab, setActiveTab] = useState('tourist');
  const [selectedCase, setSelectedCase] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedCard ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedCard]);

  const useSmoothHorizontalScroll = (ref) => {
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      let isAnimating = false;
      let targetDelta = 0;
      let animationFrameId;

      const lerp = (start, end, factor) => start + (end - start) * factor;

      const update = () => {
        if (Math.abs(targetDelta) > 0.5) {
          const step = lerp(0, targetDelta, 0.06); 
          el.scrollBy({ left: step, behavior: 'auto' });
          targetDelta -= step;
          animationFrameId = requestAnimationFrame(update);
        } else {
          targetDelta = 0;
          isAnimating = false;
        }
      };

      const handleWheel = (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; 
        if (e.deltaY === 0) return;

        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        const currentScroll = Math.abs(Math.round(el.scrollLeft));
        const isRtl = getComputedStyle(el).direction === 'rtl';

        if ((e.deltaY > 0 && currentScroll < maxScrollLeft - 2) || (e.deltaY < 0 && currentScroll > 2)) {
            e.preventDefault();
            const multiplier = isRtl ? -2 : 2; 
            targetDelta += e.deltaY * multiplier;
            targetDelta = Math.max(-1200, Math.min(1200, targetDelta));

            if (!isAnimating) {
              isAnimating = true;
              animationFrameId = requestAnimationFrame(update);
            }
        }
      };

      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        el.removeEventListener('wheel', handleWheel);
        cancelAnimationFrame(animationFrameId);
      };
    }, [ref]);
  };

  useSmoothHorizontalScroll(scrollRef1);
  useSmoothHorizontalScroll(scrollRef2);

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
          
          <div className={`hidden md:flex items-center gap-2 ${isScrolled ? '' : 'bg-white/50 backdrop-blur-md rounded-full px-2 border border-white/60 shadow-sm'}`}>
            {['解决方案', '产品功能', '落地案例'].map((item) => (
              <a key={item} href={`#${item}`} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 rounded-full transition-colors">
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
      <AuroraBackground className="min-h-[90vh] pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            className="lg:col-span-6 flex flex-col items-start pt-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
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
          </motion.div>

          <motion.div 
            className="lg:col-span-6 h-[600px] relative hidden lg:flex items-center justify-center scale-100 origin-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
             <HeroRobotAvatar />
          </motion.div>
        </div>
      </AuroraBackground>

      {/* --- Section 2: 市场洞察 --- */}
      <section className="py-24 relative z-10 bg-white">
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

      {/* --- Section 3: 私有核心资产 (Light Nexus) --- */}
      <ConceptLightNexus />

      {/* --- Section 3.5: 信任驱动消费 (Feature Rows) --- */}
      <section className="py-16 lg:py-20 relative z-10 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-500 font-semibold text-[13px] mb-6 border border-blue-100">
              <Sparkles size={12} className="mr-1.5" /> 消费闭环
            </span>
            <h3 className="text-[44px] md:text-[56px] font-extrabold leading-tight text-slate-900 mb-6 tracking-tight">信任驱动消费，服务连接一切。</h3>
            <p className="text-[18px] md:text-[20px] text-slate-500 max-w-2xl mx-auto">从需求到交易，AI 智能体全程陪伴，构建完整的旅游服务生态。</p>
          </motion.div>

          {/* Feature Rows Container */}
          <div className="relative w-full">
            {/* Center Timeline Axis */}
            <div className="absolute left-1/2 top-[5%] bottom-[5%] w-px border-l border-dashed border-slate-200 -translate-x-1/2 hidden lg:block z-0" />

            {/* Row 1: 资讯 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative flex flex-col lg:flex-row items-center justify-between w-full mb-20 group"
            >
              {/* Center Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-9 h-9 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-[14px] font-semibold text-slate-700 z-10 transition-transform group-hover:scale-110 duration-300 group-hover:text-blue-500 group-hover:border-blue-100">
                  01
                </div>
              </div>

              {/* Image Area */}
              <div className="w-full lg:w-[45%] mb-6 lg:mb-0 lg:pr-8 lg:pl-4">
                <GraphicOne />
              </div>

              {/* Text Area */}
              <div className="w-full lg:w-[45%] lg:pl-8">
                <div className="flex items-center mb-3">
                  <span className="text-[12px] font-bold tracking-widest uppercase text-blue-400">
                    服务构建信任
                  </span>
                  <div className="h-px w-8 bg-blue-100 ml-4" />
                </div>
                <h4 className="text-[32px] leading-tight font-bold text-slate-900 mb-5 tracking-tight">资讯获取</h4>
                <p className="text-slate-500 text-[17px] leading-relaxed mb-8">
                  整合实时运营状态与口碑数据，智能推荐最适合游客的景点与体验，提供无缝预订服务。
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2.5" />
                    景点推荐
                  </div>
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2.5" />
                    实时数据
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 2: 呼叫响应 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative flex flex-col lg:flex-row-reverse items-center justify-between w-full mb-20 group"
            >
              {/* Center Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-9 h-9 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-[14px] font-semibold text-slate-700 z-10 transition-transform group-hover:scale-110 duration-300 group-hover:text-blue-500 group-hover:border-blue-100">
                  02
                </div>
              </div>

              {/* Image Area */}
              <div className="w-full lg:w-[45%] mb-6 lg:mb-0 lg:pl-8">
                <GraphicTwo />
              </div>

              {/* Text Area */}
              <div className="w-full lg:w-[45%] lg:pr-8">
                <div className="flex items-center mb-3">
                  <span className="text-[12px] font-bold tracking-widest uppercase text-blue-400">
                    服务构建信任
                  </span>
                  <div className="h-px w-8 bg-blue-100 ml-4" />
                </div>
                <h4 className="text-[32px] leading-tight font-bold text-slate-900 mb-5 tracking-tight">呼叫响应</h4>
                <p className="text-slate-500 text-[17px] leading-relaxed mb-8">
                  自然语音交互，随时响应延迟退房、活动报名等即时需求，让贴心服务始终零距离。
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2.5" />
                    24/7响应
                  </div>
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2.5" />
                    即时需求
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 3: 需求感知 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative flex flex-col lg:flex-row items-center justify-between w-full mb-20 group"
            >
              {/* Center Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-9 h-9 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-[14px] font-semibold text-slate-700 z-10 transition-transform group-hover:scale-110 duration-300 group-hover:text-blue-500 group-hover:border-blue-100">
                  03
                </div>
              </div>

              {/* Image Area */}
              <div className="w-full lg:w-[45%] mb-6 lg:mb-0 lg:pr-8 lg:pl-4">
                <GraphicThree />
              </div>

              {/* Text Area */}
              <div className="w-full lg:w-[45%] lg:pl-8">
                <div className="flex items-center mb-3">
                  <span className="text-[12px] font-bold tracking-widest uppercase text-blue-400">
                    服务构建信任
                  </span>
                  <div className="h-px w-8 bg-blue-100 ml-4" />
                </div>
                <h4 className="text-[32px] leading-tight font-bold text-slate-900 mb-5 tracking-tight">需求感知</h4>
                <p className="text-slate-500 text-[17px] leading-relaxed mb-8">
                  持续感知游客偏好，智能收集并分析个性化需求，前置性地提供定制化服务建议。
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2.5" />
                    个性化
                  </div>
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2.5" />
                    深度分析
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 4: 全程伴游 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative flex flex-col lg:flex-row-reverse items-center justify-between w-full mb-20 group"
            >
              {/* Center Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-9 h-9 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-[14px] font-semibold text-slate-700 z-10 transition-transform group-hover:scale-110 duration-300 group-hover:text-green-600 group-hover:border-green-200">
                  04
                </div>
              </div>

              {/* Image Area */}
              <div className="w-full lg:w-[45%] mb-6 lg:mb-0 lg:pl-8">
                <GraphicFour />
              </div>

              {/* Text Area */}
              <div className="w-full lg:w-[45%] lg:pr-8">
                <div className="flex items-center mb-3">
                  <span className="text-[12px] font-bold tracking-widest uppercase text-green-500">
                    信任驱动交易
                  </span>
                  <div className="h-px w-8 bg-green-100 ml-4" />
                </div>
                <h4 className="text-[32px] leading-tight font-bold text-slate-900 mb-5 tracking-tight">全程伴游</h4>
                <p className="text-slate-500 text-[17px] leading-relaxed mb-8">
                  专属AI智能体全程陪伴，从接机入网到离境送机，提供无缝衔接的贴心陪伴式体验。
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2.5" />
                    全程陪伴
                  </div>
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2.5" />
                    贴心服务
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 5: 商品智荐 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative flex flex-col lg:flex-row items-center justify-between w-full mb-20 group"
            >
              {/* Center Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-9 h-9 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-[14px] font-semibold text-slate-700 z-10 transition-transform group-hover:scale-110 duration-300 group-hover:text-green-600 group-hover:border-green-200">
                  05
                </div>
              </div>

              {/* Image Area */}
              <div className="w-full lg:w-[45%] mb-6 lg:mb-0 lg:pr-8 lg:pl-4">
                <GraphicFive />
              </div>

              {/* Text Area */}
              <div className="w-full lg:w-[45%] lg:pl-8">
                <div className="flex items-center mb-3">
                  <span className="text-[12px] font-bold tracking-widest uppercase text-green-500">
                    信任驱动交易
                  </span>
                  <div className="h-px w-8 bg-green-100 ml-4" />
                </div>
                <h4 className="text-[32px] leading-tight font-bold text-slate-900 mb-5 tracking-tight">商品智荐</h4>
                <p className="text-slate-500 text-[17px] leading-relaxed mb-8">
                  基于游客即时偏好与当下所处场景，智能推荐精选商品，让优质产品主动找到目标客户。
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2.5" />
                    精选推荐
                  </div>
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2.5" />
                    智能匹配
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 6: 一站式预约 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative flex flex-col lg:flex-row-reverse items-center justify-between w-full group"
            >
              {/* Center Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-9 h-9 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-[14px] font-semibold text-slate-700 z-10 transition-transform group-hover:scale-110 duration-300 group-hover:text-green-600 group-hover:border-green-200">
                  06
                </div>
              </div>

              {/* Image Area */}
              <div className="w-full lg:w-[45%] mb-6 lg:mb-0 lg:pl-8">
                <GraphicSix />
              </div>

              {/* Text Area */}
              <div className="w-full lg:w-[45%] lg:pr-8">
                <div className="flex items-center mb-3">
                  <span className="text-[12px] font-bold tracking-widest uppercase text-green-500">
                    信任驱动交易
                  </span>
                  <div className="h-px w-8 bg-green-100 ml-4" />
                </div>
                <h4 className="text-[32px] leading-tight font-bold text-slate-900 mb-5 tracking-tight">一站式预约</h4>
                <p className="text-slate-500 text-[17px] leading-relaxed mb-8">
                  打破业务孤岛，整合目的地所有服务资源，一站式完成门票、餐饮、住宿等全部预约需求。
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2.5" />
                    一站式
                  </div>
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2.5" />
                    全流程
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Section 4: 产品功能 (Z-Pattern Horizontal Gallery) --- */}
      <section id="产品功能" className="py-20 relative z-10 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-6 mb-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-[13px] mb-6 border border-indigo-100">
              <Sparkles size={12} className="mr-1.5" /> 产品功能
            </span>
            <h2 className="text-[44px] md:text-[56px] font-extrabold leading-tight text-slate-900 mb-4 tracking-tight">
              一个智能体，两副面孔
            </h2>
            <p className="text-[18px] text-slate-500 max-w-2xl mx-auto">
              面向游客的贴心陪伴，面向内部的智能运营，一个智能体，双重价值创造。
            </p>
          </motion.div>
        </div>

        {/* Z-Pattern Horizontal Gallery */}
        <div className="w-full overflow-hidden">
          
          {/* Chapter 1: 游客视角 (LTR) */}
          <div className="relative w-full flex items-center py-12">
            <div className="absolute pointer-events-none whitespace-nowrap text-[15vw] font-black text-slate-900/5 leading-none select-none top-[20%] font-sans tracking-tighter mix-blend-multiply opacity-50">
              TOURIST PERSPECTIVE
            </div>
            
            <div 
              ref={scrollRef1}
              dir="ltr" 
              className="relative z-10 w-full flex items-center gap-8 overflow-x-auto hide-scrollbar px-[8vw] py-8"
            >
              
              {/* Intro Card */}
              <div className="shrink-0 w-[80vw] md:w-[30vw] flex flex-col justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-bold text-[11px] mb-4 uppercase tracking-widest w-fit">
                  Chapter 01
                </span>
                <h3 className="text-[38px] md:text-[52px] font-bold text-slate-900 leading-[1.1] tracking-tight">
                  游客视角<br/>沉浸探索
                </h3>
                <p className="text-slate-500 mt-5 text-[15px] md:text-[17px] leading-relaxed max-w-sm">
                  无微不至的陪伴体验，打破数字与现实的边界，让每一次旅程都充满温度。
                </p>
                <div className="mt-8 flex items-center text-slate-400 text-sm font-semibold tracking-wider animate-pulse">
                   滑动探索 <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>

              {/* Tourist Cards */}
              {TOURIST_CARDS.map(card => (
                <GalleryCard key={card.id} card={card} onSelect={setSelectedCard} />
              ))}

              <div className="shrink-0 w-[5vw]"></div>
            </div>
          </div>


          {/* Z-Axis Transition */}
          <div className="w-full flex justify-center py-8">
             <div className="w-px h-20 bg-gradient-to-b from-blue-200 to-transparent"></div>
          </div>


          {/* Chapter 2: 内部视角 (RTL) */}
          <div className="relative w-full flex items-center pb-16">
            <div className="absolute pointer-events-none whitespace-nowrap text-[15vw] font-black text-slate-900/5 leading-none select-none top-[20%] font-sans tracking-tighter mix-blend-multiply opacity-50 right-0 transform translate-x-[10%]">
              INTERNAL PERSPECTIVE
            </div>
            
            <div 
              ref={scrollRef2}
              dir="rtl" 
              className="relative z-10 w-full flex items-center gap-8 overflow-x-auto hide-scrollbar px-[8vw] py-8"
            >
              
              {/* Intro Card */}
              <div className="shrink-0 w-[80vw] md:w-[30vw] flex flex-col justify-center items-end text-right" dir="ltr">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-bold text-[11px] mb-4 uppercase tracking-widest w-fit">
                  Chapter 02
                </span>
                <h3 className="text-[38px] md:text-[52px] font-bold text-slate-900 leading-[1.1] tracking-tight">
                  内部视角<br/>效率革命
                </h3>
                <p className="text-slate-500 mt-5 text-[15px] md:text-[17px] leading-relaxed max-w-sm ml-auto">
                  从繁杂的流程中解脱，让系统自动化接管日常营运与决策辅助。
                </p>
                <div className="mt-8 flex items-center text-slate-400 text-sm font-semibold tracking-wider animate-pulse flex-row-reverse">
                   滑动探索 <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
                </div>
              </div>

              {/* Internal Cards */}
              {INTERNAL_CARDS.map(card => (
                <GalleryCard key={card.id} card={card} onSelect={setSelectedCard} />
              ))}

              <div className="shrink-0 w-[5vw]"></div>
            </div>
          </div>

        </div>

        {/* Global Styles for Scroll */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Detail Modal */}
        <DetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      </section>

      {/* --- Section 5: 落地案例 --- */}
      <section id="落地案例" className="py-32 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">落地案例验证</h2>
            <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">首批项目已在贵州落地，覆盖景区、温泉、酒店等，进入真实运营阶段。</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            {/* 左侧详情 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200"
              >
                <img 
                  src={CASES[selectedCase].image} 
                  alt={CASES[selectedCase].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {CASES[selectedCase].type}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3">{CASES[selectedCase].name}</h3>
                  <p className="text-sm text-white/80 flex items-center gap-2 mt-1">
                    <Bot size={14} className="text-blue-400" />
                    {CASES[selectedCase].ai}
                  </p>
                  <p className="text-sm text-white/70 mt-3 leading-relaxed">{CASES[selectedCase].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 右侧卡片列表 */}
            <div className="flex flex-col gap-3">
              {CASES.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedCase(i)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 group",
                    selectedCase === i 
                      ? "bg-blue-50 border-2 border-blue-300 shadow-lg" 
                      : "bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                  )}
                >
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-lg font-semibold mb-0.5 transition-colors",
                      selectedCase === i ? "text-blue-600" : "text-slate-900"
                    )}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500">{item.type} · {item.ai}</p>
                  </div>
                  {selectedCase === i ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-100 shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <ArrowRight size={20} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                  )}
                </motion.div>
              ))}

              {/* 查看全部按钮 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: CASES.length * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer mt-auto"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <ArrowRight size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">查看全部</h3>
                  <p className="text-sm text-slate-500">探索更多落地案例</p>
                </div>
              </motion.div>
            </div>
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