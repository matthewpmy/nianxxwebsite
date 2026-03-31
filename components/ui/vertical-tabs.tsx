"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Map, MessageSquare, Sparkles, Calendar, Camera, Zap, Layers, Globe, Navigation, Smartphone, Bot, Settings, ShoppingCart, Ticket, LineChart, Clock, Utensils, ArrowLeft, ArrowRight } from "lucide-react";

const AUTO_PLAY_DURATION = 5000;

export function VerticalTabs({ 
  items = [], 
  defaultIndex = 0, 
  isDark = false,
  title = "",
  subtitle = ""
}) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused || items.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, handleNext, items.length]);

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const activeItem = items[activeIndex] || { title: "", description: "", image: "" };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
        {/* Left Column: Content */}
        <div className={cn(
          "flex flex-col pt-4",
          isDark ? "text-white" : ""
        )}>
          {title && (
            <div className={cn("space-y-1 mb-8 lg:mb-10", isDark ? "text-white" : "")}>
              <h3 className={cn(
                "tracking-tighter text-2xl md:text-3xl lg:text-4xl font-medium whitespace-nowrap",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {title}
              </h3>
              {subtitle && (
                <span className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.3em] block ml-0.5",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {subtitle}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col space-y-0">
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={item.id || index}
                  onClick={() => handleTabClick(index)}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className={cn(
                    "group relative flex items-start gap-3 md:gap-4 py-4 md:py-5 text-left transition-all duration-500 border-t",
                    isActive
                      ? isDark ? "text-white border-white/30" : "text-slate-900 border-slate-200/50"
                      : isDark 
                        ? "text-slate-400 border-slate-800 hover:text-white" 
                        : "text-slate-500/60 border-slate-200/50 hover:text-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-[2px]",
                    isDark ? "bg-slate-800" : "bg-slate-200"
                  )}>
                    {isActive && (
                      <motion.div
                        key={`progress-${index}-${isPaused}`}
                        className={cn(
                          "absolute top-0 left-0 w-full origin-top",
                          isDark ? "bg-cyan-400" : "bg-blue-500"
                        )}
                        initial={{ height: "0%" }}
                        animate={
                          isPaused ? { height: "0%" } : { height: "100%" }
                        }
                        transition={{
                          duration: AUTO_PLAY_DURATION / 1000,
                          ease: "linear",
                        }}
                      />
                    )}
                  </div>

                  <span className={cn(
                    "text-[9px] md:text-[10px] font-medium mt-0.5 md:mt-1 tabular-nums shrink-0",
                    isActive ? "opacity-80" : "opacity-40"
                  )}>
                    /{item.number}
                  </span>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3">
                      <item.icon 
                        size={16} 
                        className={cn(
                          "transition-colors duration-500 shrink-0",
                          isActive 
                            ? (isDark ? "text-cyan-400" : "text-blue-500") 
                            : "opacity-50"
                        )} 
                      />
                      <span
                        className={cn(
                          "text-base md:text-lg lg:text-xl font-normal tracking-tight transition-colors duration-500 whitespace-nowrap",
                          isActive ? "" : ""
                        )}
                      >
                        {item.title}
                      </span>
                    </div>

                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className={cn(
                            "text-xs md:text-sm font-normal leading-relaxed pl-6 md:pl-8 mt-1",
                            isDark ? "text-slate-400" : "text-slate-500"
                          )}>
                            {item.description}
                          </p>
                          
                          {item.details && item.details.length > 0 && (
                            <div className="space-y-2 md:space-y-3 pl-6 md:pl-8 mt-3 md:mt-4">
                              {item.details.map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-2 md:gap-3">
                                  <div className={cn(
                                    "w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
                                    isDark ? "bg-slate-800" : "bg-slate-100"
                                  )}>
                                    <detail.icon 
                                      size={12} 
                                      className={isDark ? "text-cyan-400" : "text-slate-600"} 
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className={cn(
                                      "text-xs md:text-sm font-medium whitespace-nowrap",
                                      isDark ? "text-white" : "text-slate-700"
                                    )}>{detail.title}</p>
                                    <p className={cn(
                                      "text-[10px] md:text-xs leading-relaxed",
                                      isDark ? "text-slate-500" : "text-slate-500"
                                    )}>{detail.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Image */}
        <div className={cn(
          "flex flex-col justify-end h-full",
          isDark ? "text-white" : ""
        )}>
          <div
            className="relative group/gallery"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={cn(
              "relative aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11] rounded-2xl md:rounded-[2rem] overflow-hidden",
              isDark ? "bg-slate-800" : "bg-slate-100"
            )}>
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 260, damping: 32 },
                    opacity: { duration: 0.4 },
                  }}
                  className="absolute inset-0 w-full h-full cursor-pointer"
                >
                  {activeItem.image ? (
                    <img
                      src={activeItem.image}
                      alt={activeItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={cn(
                      "w-full h-full flex items-center justify-center",
                      isDark 
                        ? "bg-gradient-to-br from-cyan-900/30 to-purple-900/30" 
                        : "bg-gradient-to-br from-blue-100/50 to-purple-100/50"
                    )}>
                      <div className="text-center">
                        {activeItem.icon && (
                          <activeItem.icon 
                            size={60} 
                            className={isDark ? "text-cyan-400 mx-auto mb-3" : "text-blue-500 mx-auto mb-3"} 
                          />
                        )}
                        <p className={isDark ? "text-slate-400" : "text-slate-500"}>{activeItem.title}</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6 md:p-8">
                    <div className="text-white">
                      <p className="text-lg md:text-xl font-medium mb-2">{activeItem.title}</p>
                      <p className="text-sm text-white/70">{activeItem.description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className={cn(
                    "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all active:scale-90",
                    isDark 
                      ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" 
                      : "bg-white/80 backdrop-blur-md border border-slate-200/50 text-slate-700 hover:bg-white"
                  )}
                  aria-label="Previous"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className={cn(
                    "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all active:scale-90",
                    isDark 
                      ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" 
                      : "bg-white/80 backdrop-blur-md border border-slate-200/50 text-slate-700 hover:bg-white"
                  )}
                  aria-label="Next"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerticalTabs;