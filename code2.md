// ==========================================
// 方案 B: 浅色全息枢纽 (Light Nexus)
// ==========================================
const ConceptLightNexus = () => (
  <section className="min-h-screen bg-[#f8fafc] overflow-hidden flex items-center justify-center py-24 animate-[fadeIn_0.5s_ease-out] relative">
    {/* 浅色网格与环境光 */}
    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none"></div>

    <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex flex-col items-center">
      
      {/* 顶部玻璃态 HUD (Data Strip) */}
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 flex flex-wrap justify-between items-center mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
         <div className="text-slate-800 pr-8 border-r border-slate-200">
           <h2 className="text-[28px] font-bold tracking-tight">{CORE_TITLE}</h2>
           <p className="text-xs text-blue-500 mt-1 uppercase tracking-widest font-semibold">Core Infrastructure</p>
         </div>
         <div className="flex flex-1 justify-around pl-4">
           {METRICS.map((m, i) => (
             <div key={i} className="flex flex-col items-center">
                <span className="text-[28px] md:text-[32px] font-extrabold text-slate-800">{m.value}</span>
                <span className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1 font-medium"><m.icon className="w-3.5 h-3.5 text-blue-400"/> {m.label}</span>
             </div>
           ))}
         </div>
      </div>

      {/* 中心能量枢纽布局 */}
      <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-auto md:h-[600px] flex items-center justify-center mt-10">
         
         {/* 发光中心球 (Light Core) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-white to-blue-50 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.2),inset_0_10px_20px_rgba(255,255,255,1)] z-20 border-4 border-white animate-[pulse_4s_ease-in-out_infinite]">
            <Orbit className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
            <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-[ping_3s_ease-out_infinite]"></div>
         </div>

         {/* 环绕卡片 (Orbiting Cards) */}
         <div className="absolute inset-0">
            {FEATURES.map((feature, i) => {
              const positions = [
                "top-0 left-0 md:top-10 md:left-10",
                "top-0 right-0 md:top-10 md:right-10",
                "bottom-0 left-0 md:bottom-10 md:left-10",
                "bottom-0 right-0 md:bottom-10 md:right-10"
              ];
              const lineStyles = [
                 "top-[50%] left-[100%] w-32 h-px bg-gradient-to-r from-blue-200 to-transparent transform rotate-45 origin-left",
                 "top-[50%] right-[100%] w-32 h-px bg-gradient-to-l from-blue-200 to-transparent transform -rotate-45 origin-right",
                 "top-[50%] left-[100%] w-32 h-px bg-gradient-to-r from-blue-200 to-transparent transform -rotate-45 origin-left",
                 "top-[50%] right-[100%] w-32 h-px bg-gradient-to-l from-blue-200 to-transparent transform rotate-45 origin-right"
              ];
              
              return (
                <div key={feature.id} className={`absolute ${positions[i]} w-[45%] md:w-[320px] bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl hover:bg-white transition-all duration-300 group cursor-pointer z-30 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2`}>
                   <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-${feature.color}-50 rounded-xl flex items-center justify-center border border-${feature.color}-100`}>
                         <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
                      </div>
                      <h3 className="text-slate-800 font-bold text-lg">{feature.title}</h3>
                   </div>
                   <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                   {/* 隐喻连接线 */}
                   <div className={`hidden md:block absolute ${lineStyles[i]} pointer-events-none`}></div>
                </div>
              )
            })}
         </div>
      </div>
    </div>
  </section>
);
