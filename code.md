import React from 'react';

// ==========================================
// 顶级 SaaS 级: "白玻拟物"与线框层叠风格组件
// ==========================================

// 通用底层样式变量
const GRAPHIC_BG = "bg-[#f4f7fb]"; // 极淡的蓝灰色背景
const GRID_DOTS = "radial-gradient(#cbd5e1 1px, transparent 1px)"; // 细微波点
const SOFT_SHADOW = "shadow-[0_20px_40px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]"; // 顶级空气感阴影
const FLOATING_SHADOW = "shadow-[0_30px_60px_rgba(14,165,233,0.05),0_4px_10px_rgba(0,0,0,0.02)]"; // 带有淡蓝色晕染的悬浮投影

// Graphic 01: 资讯 (层叠的信息面板与结构化数据)
const GraphicOne = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden`}>
    <div className="absolute inset-0" style={{ backgroundImage: GRID_DOTS, backgroundSize: '24px 24px', opacity: 0.6 }}></div>
    
    {/* 背景层：虚化的骨架屏 */}
    <div className="absolute w-[60%] h-[50%] bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm -translate-y-6 translate-x-8"></div>
    <div className="absolute w-[60%] h-[50%] bg-white/60 rounded-xl border border-white/60 backdrop-blur-md translate-y-6 -translate-x-8"></div>

    {/* 核心层：主信息卡片 */}
    <div className={`relative z-10 w-[65%] h-[60%] bg-white rounded-2xl border border-white ${FLOATING_SHADOW} p-5 flex flex-col justify-between transition-transform duration-700 hover:-translate-y-2`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <div className="w-1/3 h-2.5 bg-slate-200 rounded-full"></div>
          <div className="w-1/5 h-2 bg-slate-100 rounded-full"></div>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="w-full h-2 bg-slate-100 rounded-full"></div>
        <div className="w-[90%] h-2 bg-slate-100 rounded-full"></div>
        <div className="w-[60%] h-2 bg-slate-100 rounded-full"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between">
        <div className="w-16 h-6 bg-blue-50 rounded-md"></div>
        <div className="w-16 h-6 bg-slate-50 rounded-md"></div>
      </div>
    </div>
  </div>
);

// Graphic 02: 呼叫响应 (柔和的语音交互界面骨架)
const GraphicTwo = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden`}>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '100% 32px', opacity: 0.3 }}></div>

    {/* 语音呼叫悬浮中心 */}
    <div className={`relative z-10 w-48 h-48 bg-white rounded-full border border-white ${FLOATING_SHADOW} flex items-center justify-center transition-transform duration-700 hover:scale-105`}>
      {/* 音波律动圆环 (结构化) */}
      <div className="absolute w-[120%] h-[120%] border border-blue-100 rounded-full animate-[spin_10s_linear_infinite]">
         <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-300 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="absolute w-[140%] h-[140%] border border-slate-100 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

      {/* 内部音波条 */}
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-6 bg-slate-200 rounded-full"></div>
        <div className="w-1.5 h-12 bg-blue-200 rounded-full"></div>
        <div className="w-1.5 h-16 bg-blue-400 rounded-full"></div>
        <div className="w-1.5 h-10 bg-blue-200 rounded-full"></div>
        <div className="w-1.5 h-5 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

// Graphic 03: 需求感知 (Bento Box 数据分析面板)
const GraphicThree = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden p-8`}>
    <div className="absolute inset-0" style={{ backgroundImage: GRID_DOTS, backgroundSize: '16px 16px', opacity: 0.5 }}></div>

    <div className="relative z-10 w-full h-full grid grid-cols-3 grid-rows-2 gap-4 transition-transform duration-700 hover:-translate-y-1">
      {/* 大数据块 */}
      <div className={`col-span-2 row-span-2 bg-white rounded-2xl border border-white ${SOFT_SHADOW} p-4 flex flex-col`}>
        <div className="w-20 h-3 bg-slate-200 rounded-full mb-6"></div>
        <div className="flex-1 flex items-end gap-3 px-2">
          <div className="w-full h-[40%] bg-slate-100 rounded-t-md"></div>
          <div className="w-full h-[60%] bg-blue-100 rounded-t-md"></div>
          <div className="w-full h-[80%] bg-blue-300 rounded-t-md"></div>
          <div className="w-full h-[50%] bg-slate-100 rounded-t-md"></div>
          <div className="w-full h-[90%] bg-blue-400 rounded-t-md"></div>
        </div>
      </div>
      {/* 右侧小块1 - 饼图骨架 */}
      <div className={`col-span-1 row-span-1 bg-white rounded-2xl border border-white ${SOFT_SHADOW} flex items-center justify-center relative overflow-hidden`}>
         <div className="w-16 h-16 rounded-full border-[6px] border-slate-100 relative">
            <div className="absolute top-0 right-0 w-8 h-8 border-[6px] border-blue-400 rounded-tr-full" style={{ borderBottomWidth: 0, borderLeftWidth: 0 }}></div>
         </div>
      </div>
      {/* 右侧小块2 - 指标骨架 */}
      <div className={`col-span-1 row-span-1 bg-white rounded-2xl border border-white ${SOFT_SHADOW} p-4 flex flex-col justify-between`}>
         <div className="w-12 h-2.5 bg-slate-200 rounded-full"></div>
         <div className="space-y-1.5">
           <div className="w-full h-5 bg-blue-50 rounded flex items-center px-1"><div className="w-1/2 h-1 bg-blue-300 rounded-full"></div></div>
           <div className="w-full h-5 bg-slate-50 rounded flex items-center px-1"><div className="w-1/3 h-1 bg-slate-300 rounded-full"></div></div>
         </div>
      </div>
    </div>
  </div>
);

// Graphic 04: 全程伴游 (AI 核心浮窗与对话线框)
const GraphicFour = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden`}>
    <div className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent top-1/2 -translate-y-1/2 rotate-12 opacity-50"></div>
    <div className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent top-1/2 -translate-y-1/2 -rotate-12 opacity-50"></div>

    {/* 主交互窗口 */}
    <div className={`relative z-10 w-[70%] h-[70%] bg-white/90 backdrop-blur-xl rounded-2xl border border-white ${FLOATING_SHADOW} flex flex-col overflow-hidden transition-transform duration-700 hover:scale-[1.02]`}>
      {/* 顶部导航骨架 */}
      <div className="h-12 border-b border-slate-50 flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
        <div className="w-16 h-2 bg-slate-100 rounded-full ml-2"></div>
      </div>
      
      {/* 内部对话内容区 */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* AI 消息模块 */}
        <div className="flex gap-3 w-[80%]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 shrink-0 shadow-inner flex items-center justify-center">
             <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-sm p-3 space-y-2">
             <div className="w-[90%] h-2 bg-slate-200 rounded-full"></div>
             <div className="w-[60%] h-2 bg-slate-200 rounded-full"></div>
          </div>
        </div>
        {/* 用户消息模块 */}
        <div className="flex gap-3 w-[70%] self-end">
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl rounded-tr-sm p-3 space-y-2">
             <div className="w-full h-2 bg-blue-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Graphic 05: 商品智荐 (立体层叠的精美卡片系统)
const GraphicFive = () => (
  <div className={`relative w-full aspect-[16/10] ${GRAPHIC_BG} rounded-[2rem] flex items-center justify-center overflow-hidden perspective-[1000px]`}>
    {/* 柔和的环境中心光 */}
    <div className="absolute w-64 h-64 bg-blue-100/50 rounded-full blur-[50px]"></div>

    {/* 卡片组居中定位 */}
    <div className="relative w-48 h-64 transition-transform duration-700 group hover:-translate-y-2" style={{ transformStyle: 'preserve-3d' }}>
      
      {/* 底层卡片 */}
      <div className={`absolute inset-0 bg-white rounded-xl border border-slate-100 ${SOFT_SHADOW} transform rotate-6 translate-x-4 translate-y-2 origin-bottom-right p-4 flex flex-col opacity-80`}>
        <div className="w-full aspect-square bg-slate-100 rounded-lg mb-3"></div>
        <div className="w-2/3 h-2 bg-slate-200 rounded-full"></div>
      </div>

      {/* 中层卡片 */}
      <div className={`absolute inset-0 bg-white rounded-xl border border-slate-100 ${SOFT_SHADOW} transform -rotate-3 -translate-x-4 translate-y-1 origin-bottom-left p-4 flex flex-col opacity-90`}>
        <div className="w-full aspect-square bg-slate-100 rounded-lg mb-3"></div>
        <div className="w-2/3 h-2 bg-slate-200 rounded-full"></div>
      </div>

      {/* 顶层高亮卡片 */}
      <div className={`absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl border border-white ${FLOATING_SHADOW} p-4 flex flex-col transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-4`}>
        <div className="w-full aspect-square bg-blue-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute w-[150%] h-4 bg-white/40 rotate-45 transform translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[100%]"></div>
          {/* 商品骨架图标 */}
          <div className="w-12 h-12 border-2 border-blue-200 rounded-md"></div>
        </div>
        <div className="w-3/4 h-3 bg-slate-800/10 rounded-full mb-2"></div>
        <div className="w-1/2 h-2 bg-slate-300 rounded-full mb-auto"></div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-2">
          <div className="w-8 h-3 bg-blue-400/20 rounded-full"></div>
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-0.5 bg-white rounded-full relative"><div className="w-0.5 h-3 bg-white rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div></div>
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
        <div className="w-full h-9 bg-blue-50 rounded-lg flex items-center px-2.5 gap-2.5 border border-blue-100">
          <div className="w-4 h-4 bg-blue-200 rounded flex-shrink-0"></div>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="w-1/2 h-1.5 bg-blue-400 rounded-full"></div>
            <div className="w-1/3 h-1 bg-blue-200 rounded-full"></div>
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
        <div className="mt-auto w-full h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
          <div className="w-16 h-1.5 bg-white/80 rounded-full"></div>
        </div>
      </div>

      {/* 右侧：多订单叠放与打孔票据 (隐喻所有预订生成一张凭证) */}
      <div className="flex-1 h-full relative flex flex-col items-center justify-center">
         {/* 底层阴影卡片 - 表现多订单合并 */}
         <div className="absolute w-[80%] h-[90%] bg-slate-50 rounded-xl border border-slate-100 transform translate-y-3 -rotate-6 opacity-60"></div>
         <div className="absolute w-[85%] h-[90%] bg-white rounded-xl border border-slate-100 transform translate-y-1.5 rotate-3 opacity-80 shadow-sm"></div>
         
         {/* 顶层主票据 */}
         <div className={`relative w-[90%] h-[95%] bg-gradient-to-b from-blue-50/40 to-white rounded-xl border border-slate-100 ${SOFT_SHADOW} flex flex-col overflow-hidden`}>
            
            {/* 票务核心信息区 */}
            <div className="h-[40%] p-4 flex flex-col justify-center gap-3">
               <div className="flex justify-between items-center px-1">
                 <div className="w-8 h-2.5 bg-blue-300 rounded-full"></div>
                 <div className="flex-1 mx-3 border-b-2 border-dotted border-blue-200 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-blue-300"></div>
                 </div>
                 <div className="w-8 h-2.5 bg-blue-300 rounded-full"></div>
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
                 <div className="w-10 h-3 bg-blue-500 rounded-full"></div>
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

// ==========================================
// 页面与排版组件 (维持优雅不变)
// ==========================================

const FeatureRow = ({ number, eyebrow, title, description, features, graphic, reverse }) => {
  return (
    <div className={`relative flex flex-col md:flex-row items-center justify-between w-full mb-32 group ${reverse ? 'md:flex-row-reverse' : ''}`}>
      
      {/* 中心时间轴节点 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative w-9 h-9 bg-white rounded-full border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-[14px] font-semibold text-slate-700 z-10 transition-transform group-hover:scale-110 duration-300 group-hover:text-blue-500 group-hover:border-blue-100">
          {number}
        </div>
      </div>

      {/* 配图区域 */}
      <div className={`w-full md:w-[45%] mb-12 md:mb-0 ${reverse ? 'md:pl-8 lg:pl-16' : 'md:pr-8 lg:pr-16'}`}>
        {graphic}
      </div>

      {/* 文本区域 */}
      <div className={`w-full md:w-[45%] ${reverse ? 'md:pr-8 lg:pr-16' : 'md:pl-8 lg:pl-16'}`}>
        <div className="flex items-center mb-3">
          <span className="text-[12px] font-bold tracking-widest uppercase text-blue-400">
            {eyebrow}
          </span>
          <div className="h-px w-8 bg-blue-100 ml-4"></div>
        </div>
        
        <h3 className="text-[32px] leading-tight font-bold text-slate-900 mb-5 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-[17px] leading-relaxed mb-8">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 text-[14px] font-medium text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2.5"></div>
              {feature.text}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-32">
        
        {/* 顶部标题区域 */}
        <div className="text-center max-w-3xl mx-auto mb-32 flex flex-col items-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-500 font-semibold text-[13px] mb-6 border border-blue-100">
            全新体验引擎
          </span>
          <h2 className="text-[44px] md:text-[56px] font-extrabold leading-tight text-slate-900 mb-6 tracking-tight">
            全域智能服务蓝图
          </h2>
          <p className="text-slate-500 text-[18px] md:text-[20px] leading-relaxed max-w-2xl">
            通过无缝衔接的智能交互，打造从资讯感知到一站式交易的全场景闭环，让每一次旅行体验都无可挑剔。
          </p>
        </div>

        {/* 核心交替网格区域 */}
        <div className="relative w-full">
          {/* 极其克制的极细虚线中轴 */}
          <div className="absolute left-1/2 top-[5%] bottom-[5%] w-px border-l border-dashed border-slate-200 -translate-x-1/2 hidden md:block z-0"></div>

          <FeatureRow 
            number="01"
            eyebrow="服务构建信任"
            title="资讯获取"
            description="整合实时运营状态与口碑数据，智能推荐最适合游客的景点与体验，提供无缝预订服务。"
            graphic={<GraphicOne />}
            features={[{ text: "景点推荐" }, { text: "实时数据" }]}
            reverse={false}
          />

          <FeatureRow 
            number="02"
            eyebrow="服务构建信任"
            title="呼叫响应"
            description="自然语音交互，随时响应延迟退房、活动报名等即时需求，让贴心服务始终零距离。"
            graphic={<GraphicTwo />}
            features={[{ text: "24/7响应" }, { text: "即时需求" }]}
            reverse={true}
          />

          <FeatureRow 
            number="03"
            eyebrow="服务构建信任"
            title="需求感知"
            description="持续感知游客偏好，智能收集并分析个性化需求，前置性地提供定制化服务建议。"
            graphic={<GraphicThree />}
            features={[{ text: "个性化" }, { text: "深度分析" }]}
            reverse={false}
          />

          <FeatureRow 
            number="04"
            eyebrow="信任驱动交易"
            title="全程伴游"
            description="专属AI智能体全程陪伴，从接机入网到离境送机，提供无缝衔接的贴心陪伴式体验。"
            graphic={<GraphicFour />}
            features={[{ text: "全程陪伴" }, { text: "贴心服务" }]}
            reverse={true}
          />

          <FeatureRow 
            number="05"
            eyebrow="信任驱动交易"
            title="商品智荐"
            description="基于游客即时偏好与当下所处场景，智能推荐精选商品，让优质产品主动找到目标客户。"
            graphic={<GraphicFive />}
            features={[{ text: "精选推荐" }, { text: "智能匹配" }]}
            reverse={false}
          />

          <FeatureRow 
            number="06"
            eyebrow="信任驱动交易"
            title="一站式预约"
            description="打破业务孤岛，整合目的地所有服务资源，一站式完成门票、餐饮、住宿等全部预约需求。"
            graphic={<GraphicSix />}
            features={[{ text: "一站式" }, { text: "全流程" }]}
            reverse={true}
          />
          
        </div>
      </section>
    </div>
  );
}