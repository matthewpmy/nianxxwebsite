"use client"

import type React from "react"
import { useEffect } from "react"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ShinyButton({ children, onClick, className = "" }: ShinyButtonProps) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .shiny-cta {
        --shiny-cta-bg: #2563eb;
        --shiny-cta-bg-subtle: #1d4ed8;
        --shiny-cta-fg: #ffffff;
        --shiny-cta-highlight: #60a5fa;
        --shiny-cta-highlight-subtle: #93c5fd;
        --gradient-angle: 0deg;
        --gradient-angle-offset: 0deg;
        --gradient-percent: 5%;
        --gradient-shine: white;
        --duration: 3s;
        --shadow-size: 2px;
        --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);

        isolation: isolate;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        outline-offset: 4px;
        padding: 1.25rem 2.5rem;
        font-family: "Inter", sans-serif;
        font-size: 1rem;
        line-height: 1.2;
        font-weight: 500;
        border: 1px solid transparent;
        border-radius: 360px;
        color: var(--shiny-cta-fg);
        background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
          conic-gradient(
            from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
            transparent,
            var(--shiny-cta-highlight) var(--gradient-percent),
            var(--shiny-cta-fg) calc(var(--gradient-percent) * 2),
            var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
            transparent calc(var(--gradient-percent) * 4)
          ) border-box;
        box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
        transition: var(--transition);
        transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
      }

      .shiny-cta::before,
      .shiny-cta::after,
      .shiny-cta span::before {
        content: "";
        pointer-events: none;
        position: absolute;
        inset-inline-start: 50%;
        inset-block-start: 50%;
        translate: -50% -50%;
        z-index: -1;
      }

      .shiny-cta:active {
        translate: 0 1px;
      }

      .shiny-cta::before {
        --size: calc(100% - var(--shadow-size) * 3);
        --position: 2px;
        --space: calc(var(--position) * 2);
        width: var(--size);
        height: var(--size);
        background: radial-gradient(
          circle at var(--position) var(--position),
          white calc(var(--position) / 4),
          transparent 0
        ) padding-box;
        background-size: var(--space) var(--space);
        background-repeat: space;
        mask-image: conic-gradient(
          from calc(var(--gradient-angle) + 45deg),
          black,
          transparent 10% 90%,
          black
        );
        border-radius: inherit;
        opacity: 0.4;
        z-index: -1;
      }

      .shiny-cta::after {
        width: 100%;
        aspect-ratio: 1;
        background: linear-gradient(
          -50deg,
          transparent,
          var(--shiny-cta-highlight),
          transparent
        );
        mask-image: radial-gradient(circle at bottom, transparent 40%, black);
        opacity: 0.6;
      }

      .shiny-cta span {
        z-index: 1;
      }

      .shiny-cta span::before {
        --size: calc(100% + 1rem);
        width: var(--size);
        height: var(--size);
        box-shadow: inset 0 -1ex 2rem 4px var(--shiny-cta-highlight);
        opacity: 0;
        transition: opacity var(--transition);
      }

      .shiny-cta,
      .shiny-cta::before,
      .shiny-cta::after {
        animation: gradient-angle var(--duration) linear infinite paused;
      }

      @keyframes gradient-angle {
        to {
          --gradient-angle: 360deg;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <button className={`shiny-cta ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  )
}
