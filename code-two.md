import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, Sparkles } from 'lucide-react';

// ==========================================
// 数据字典 (Data Layer) - 直接在这里替换您的图片链接
// ==========================================
const TOURIST_CARDS = [
  { 
    id: 't1', 
    type: 'tourist', 
    title: '景点推荐与预订', 
    desc: '整合实时运营状态与口碑，提供无缝体验预订与精准推荐。', 
    detailedDesc: '深度打通目的地实时客流、天气状况与全网真实口碑，通过大模型引擎构建动态知识图谱。不仅能为游客提供个性化的避障与游玩路线规划，更从底层打通了支付与核销系统。真正实现从“种草-决策-预订-体验”的无缝闭环。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Tourist+Image+01' 
  },
  { 
    id: 't2', 
    type: 'tourist', 
    title: '即时呼叫服务', 
    desc: '语音交互，随时响应延迟退房、活动报名等即时需求。', 
    detailedDesc: '搭载支持多语种、带有情感计算的自然语言处理引擎。无论是清晨要求延迟退房，还是深夜的紧急求助呼叫，系统均能做到毫秒级精准意图识别并自动流转工单给相应部门。提供 7x24 小时零延迟、带有温度的专属管家服务。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Tourist+Image+02' 
  },
  { 
    id: 't3', 
    type: 'tourist', 
    title: '延续性伴游记忆', 
    desc: '持续感知游客偏好，记忆延续，告别千篇一律的机械推荐。', 
    detailedDesc: 'AI 智能体会持续学习并记录游客的每一次交互、偏好标签与消费习惯，沉淀为专属 User Profile。当游客跨越不同场景，或下一次复游时，服务能做到无缝接续，主动屏蔽已排斥选项，真正实现“越用越懂你”的陪伴。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Tourist+Image+03' 
  },
  { 
    id: 't4', 
    type: 'tourist', 
    title: '现实场景交互', 
    desc: '联动线下随身机器人与硬件，跨越屏幕主动提供人性化服务。', 
    detailedDesc: '突破数字屏幕限制，让 AI 拥有物理载体。系统深度联动景区内的智能向导车、酒店配送机器人及 IoT 硬件。当游客靠近特定区域时，不仅手机端有向导推送，实体机器人也能主动识别、迎宾带路，打造虚实共生的未来文旅体验。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Tourist+Image+04' 
  }
];

const INTERNAL_CARDS = [
  { 
    id: 'i1', 
    type: 'internal', 
    title: '操作类：减错提效', 
    desc: '酒店开关房、货盘追踪、PMS系统与票务状态实时自动更新。', 
    detailedDesc: '针对日常操作提供 RPA 级别系统赋能。员工无需跨系统反复录入，智能体能自动同步 PMS 房态、执行库存盘点、货盘追踪及多渠道票务状态更新。将一线员工从枯燥操作中解放，实现真正降本与减错。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Internal+Image+01' 
  },
  { 
    id: 'i2', 
    type: 'internal', 
    title: '流程类：稳定复制', 
    desc: '智能派发工单，自动生成运营日报、月报及全渠道营销文案。', 
    detailedDesc: '将企业优秀运营经验沉淀为算法模型。全天候监听业务异常节点并智能流转工单。同时基于海量数据，一键自动生成高度结构化的日/月报，更能批量生成符合小红书、抖音等语境的高转化营销文案。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Internal+Image+02' 
  },
  { 
    id: 'i3', 
    type: 'internal', 
    title: '思考类：辅助决策', 
    desc: '深度智能问数分析，市场动态代理调价，数据驱动的精准推荐。', 
    detailedDesc: '为管理层配备 24 小时在线的数据科学家。支持自然语言“问数”交互，秒级生成可视化洞察。更具备市场动态调价功能，依据竞品动态与供需曲线自动计算最优收益率价格，实现敏捷商业决策。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Internal+Image+03' 
  },
  { 
    id: 'i4', 
    type: 'internal', 
    title: '设计类：统一高效', 
    desc: 'AIGC 高质量海报与短视频生成，符合企业特性的定制 IP 建模。', 
    detailedDesc: '突破内容创作产能瓶颈。内置专属品牌微调大模型，输入简单 Prompt 即可大批量生成活动海报、短视频脚本，乃至构建符合品牌调性的 3D 虚拟 IP。保证品牌视觉高度统一，将物料产出周期缩短至秒级。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Internal+Image+04' 
  },
  { 
    id: 'i5', 
    type: 'internal', 
    title: '定制类：降本增效', 
    desc: '游客合照智能优化，自动化满意度问卷，精准规划专属电子地图。', 
    detailedDesc: '关注高频服务触点创新。利用端侧 AI 为游客自动合成完美打卡合照提升分享意愿；在最佳情绪触点自动触发交互问卷；基于游客偏好一键生成专属纪念地图，用极低边际成本创造无量情绪价值。', 
    image: 'https://placehold.co/800x600/f8fafc/94a3b8?text=Internal+Image+05' 
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
      <div className="w-full h-full bg-white rounded-3xl p-2 shadow-xl shadow-slate-200/50 border border-white flex flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-4 hover:shadow-2xl">
         
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


// ==========================================
// 主应用：Z-Pattern 视差长卷 (平滑阻尼版)
// ==========================================
export default function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  useEffect(() => {
    document.body.style.overflow = selectedCard ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedCard]);

  // 高级滚轮动量劫持 (Lerp Momentum Scroll Engine)
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

  const globalStyles = `
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      <style>{globalStyles}</style>

      {/* 顶部极简品牌区 */}
      <header className="w-full pt-16 pb-4 px-8 flex justify-between items-center z-20">
         <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
           AI
         </div>
         <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
           One Agent · Two Faces
         </span>
      </header>

      {/* ======================================= */}
      {/* Chapter 1: 游客视角 (LTR) */}
      {/* ======================================= */}
      <div className="relative w-full flex items-center">
        <div className="absolute pointer-events-none whitespace-nowrap text-[18vw] font-black text-slate-900/5 leading-none select-none top-[15%] font-sans tracking-tighter mix-blend-multiply opacity-50">
          TOURIST PERSPECTIVE
        </div>
        
        <div ref={scrollRef1} dir="ltr" className="relative z-10 w-full flex items-center gap-8 overflow-x-auto hide-scrollbar px-[10vw] py-16">
          
          <div className="shrink-0 w-[80vw] md:w-[35vw] flex flex-col justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-bold text-[11px] mb-4 uppercase tracking-widest w-fit">
              Chapter 01
            </span>
            <h2 className="text-[44px] md:text-[64px] font-bold text-slate-900 leading-[1.1] tracking-tight">
              游客视角<br/>沉浸探索
            </h2>
            <p className="text-slate-500 mt-5 text-[16px] md:text-[18px] leading-relaxed max-w-sm">
              无微不至的陪伴体验，打破数字与现实的边界，让每一次旅程都充满温度。
            </p>
            <div className="mt-8 flex items-center text-slate-400 text-sm font-semibold tracking-wider animate-pulse">
               向下滚动滑行 <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>

          {TOURIST_CARDS.map(card => (
            <GalleryCard key={card.id} card={card} onSelect={setSelectedCard} />
          ))}

          <div className="shrink-0 w-[5vw]"></div>
        </div>
      </div>


      {/* ======================================= */}
      {/* 优美的 Z 轴视觉过渡带 */}
      {/* ======================================= */}
      <div className="w-full flex justify-center py-4">
         <div className="w-px h-24 bg-gradient-to-b from-blue-200 to-transparent"></div>
      </div>


      {/* ======================================= */}
      {/* Chapter 2: 内部视角 (RTL) */}
      {/* ======================================= */}
      <div className="relative w-full flex items-center pb-24">
        <div className="absolute pointer-events-none whitespace-nowrap text-[18vw] font-black text-slate-900/5 leading-none select-none top-[15%] font-sans tracking-tighter mix-blend-multiply opacity-50 right-0 transform translate-x-[10%]">
          INTERNAL PERSPECTIVE
        </div>
        
        <div ref={scrollRef2} dir="rtl" className="relative z-10 w-full flex items-center gap-8 overflow-x-auto hide-scrollbar px-[10vw] py-16">
          
          <div className="shrink-0 w-[80vw] md:w-[35vw] flex flex-col justify-center items-end text-right" dir="ltr">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-bold text-[11px] mb-4 uppercase tracking-widest w-fit">
              Chapter 02
            </span>
            <h2 className="text-[44px] md:text-[64px] font-bold text-slate-900 leading-[1.1] tracking-tight">
              内部视角<br/>效率革命
            </h2>
            <p className="text-slate-500 mt-5 text-[16px] md:text-[18px] leading-relaxed max-w-sm ml-auto">
              从繁杂的流程中解脱，让系统自动化接管日常营运与决策辅助。
            </p>
            <div className="mt-8 flex items-center text-slate-400 text-sm font-semibold tracking-wider animate-pulse flex-row-reverse">
               向下滚动滑行 <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
            </div>
          </div>

          {INTERNAL_CARDS.map(card => (
            <GalleryCard key={card.id} card={card} onSelect={setSelectedCard} />
          ))}

          <div className="shrink-0 w-[5vw]"></div>
        </div>
      </div>

      <DetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />

    </div>
  );
}