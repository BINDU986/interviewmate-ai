"use client";

import React, { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type BotState =
  | "idle"
  | "greeting"
  | "speaking"
  | "listening"
  | "thinking"
  | "success"
  | "completed";

export type BotSize = "xs" | "sm" | "md" | "lg" | "xl";

interface InterviewMateBotProps {
  state?: BotState;
  size?: BotSize;
  className?: string;
  showStatusBadge?: boolean;
  statusText?: string;
  interactive?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  xs: { box: 36, headW: 28, headH: 24, glow: 4 },
  sm: { box: 52, headW: 42, headH: 36, glow: 8 },
  md: { box: 100, headW: 80, headH: 70, glow: 16 },
  lg: { box: 210, headW: 168, headH: 148, glow: 28 },
  xl: { box: 280, headW: 224, headH: 196, glow: 36 },
};

export const InterviewMateBot: React.FC<InterviewMateBotProps> = ({
  state = "idle",
  size = "md",
  className = "",
  showStatusBadge = false,
  statusText,
  interactive = false,
  onClick,
}) => {
  const uniqueId = useId().replace(/:/g, "_");
  const dimensions = sizeMap[size] || sizeMap.md;

  // Status label text lookup
  const defaultStatusLabels: Record<BotState, string> = {
    idle: "Ready",
    greeting: "Welcome!",
    speaking: "Speaking...",
    listening: "Listening...",
    thinking: "Analyzing...",
    success: "Great Job!",
    completed: "Interview Done",
  };

  const currentLabel = statusText || defaultStatusLabels[state];

  // Colors based on state
  const isCyanDominant = state === "speaking" || state === "listening" || state === "idle";
  const isVioletDominant = state === "thinking";
  const isSuccess = state === "success" || state === "completed";

  const primaryGlow = isSuccess
    ? "rgba(16, 185, 129, 0.45)"
    : isVioletDominant
    ? "rgba(139, 124, 255, 0.55)"
    : "rgba(39, 211, 232, 0.55)";

  const ringColor = isSuccess
    ? "#10B981"
    : isVioletDominant
    ? "#8B7CFF"
    : "#27D3E8";

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        interactive ? "cursor-pointer transition-transform hover:scale-105" : ""
      } ${className}`}
      onClick={onClick}
    >
      {/* Outer Soundwave / Halo Pulse Rings (for speaking or listening states) */}
      {(state === "speaking" || state === "listening" || state === "thinking") && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0.85, opacity: 0.7 }}
            animate={{
              scale: state === "speaking" ? [0.95, 1.25, 0.95] : [0.9, 1.15, 0.9],
              opacity: [0.6, 0.1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: state === "speaking" ? 1.5 : 2.2,
              ease: "easeInOut",
            }}
            style={{
              width: dimensions.box * 1.35,
              height: dimensions.box * 1.35,
              borderRadius: "50%",
              border: `2px solid ${ringColor}`,
              boxShadow: `0 0 25px ${primaryGlow}`,
            }}
          />
          {size !== "xs" && size !== "sm" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{
                scale: [1, 1.45, 1],
                opacity: [0.35, 0.05, 0.35],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                delay: 0.4,
                ease: "easeInOut",
              }}
              style={{
                width: dimensions.box * 1.55,
                height: dimensions.box * 1.55,
                borderRadius: "50%",
                border: `1px dashed ${ringColor}`,
              }}
            />
          )}
        </div>
      )}

      {/* Main Bot SVG Chassis & Head */}
      <motion.div
        animate={
          state === "thinking"
            ? { y: [-2, 2, -2], rotate: [-1, 1, -1] }
            : state === "speaking"
            ? { y: [-3, 3, -3] }
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: state === "thinking" ? 2 : 3.5,
          ease: "easeInOut",
        }}
        style={{
          width: dimensions.box,
          height: dimensions.box,
          filter: `drop-shadow(0 4px ${dimensions.glow}px ${primaryGlow})`,
        }}
        className="relative flex items-center justify-center"
      >
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          className="overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id={`chassisGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E2A47" />
              <stop offset="50%" stopColor="#121A2D" />
              <stop offset="100%" stopColor="#0B1020" />
            </linearGradient>

            <linearGradient id={`visorGrad_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#040711" />
              <stop offset="100%" stopColor="#0B1020" />
            </linearGradient>

            <linearGradient id={`neonRim_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#27D3E8" />
              <stop offset="50%" stopColor="#8B7CFF" />
              <stop offset="100%" stopColor="#27D3E8" />
            </linearGradient>

            <linearGradient id={`earGrad_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#27D3E8" />
              <stop offset="100%" stopColor="#8B7CFF" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id={`eyeGlow_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dual Antenna Base & Stem */}
          <rect x="96" y="16" width="8" height="18" rx="4" fill="#22324D" />
          <motion.circle
            cx="100"
            cy="14"
            r="7"
            fill={ringColor}
            animate={{
              r: state === "listening" || state === "speaking" ? [6, 9, 6] : [6, 7.5, 6],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ filter: `drop-shadow(0 0 6px ${ringColor})` }}
          />

          {/* Left Ear / Audio Sensor */}
          <g>
            <rect x="22" y="74" width="12" height="42" rx="6" fill={`url(#earGrad_${uniqueId})`} />
            <motion.line
              x1="28"
              y1="82"
              x2="28"
              y2="108"
              stroke="#F4F7FB"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={
                state === "listening"
                  ? { strokeWidth: [2, 4, 2], stroke: ["#FFFFFF", "#27D3E8", "#FFFFFF"] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </g>

          {/* Right Ear / Audio Sensor */}
          <g>
            <rect x="166" y="74" width="12" height="42" rx="6" fill={`url(#earGrad_${uniqueId})`} />
            <motion.line
              x1="172"
              y1="82"
              x2="172"
              y2="108"
              stroke="#F4F7FB"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={
                state === "listening"
                  ? { strokeWidth: [2, 4, 2], stroke: ["#FFFFFF", "#8B7CFF", "#FFFFFF"] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
            />
          </g>

          {/* Bot Futuristic Head Chassis */}
          <rect
            x="32"
            y="32"
            width="136"
            height="126"
            rx="38"
            fill={`url(#chassisGrad_${uniqueId})`}
            stroke={`url(#neonRim_${uniqueId})`}
            strokeWidth="3.5"
          />

          {/* Subtle Top Metallic Highlight Arc */}
          <path
            d="M 52 46 Q 100 38 148 46"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Visor Screen Outer Rim */}
          <rect
            x="44"
            y="54"
            width="112"
            height="86"
            rx="24"
            fill={`url(#visorGrad_${uniqueId})`}
            stroke="#182338"
            strokeWidth="2"
          />

          {/* Glass Visor Reflection Sheen */}
          <path
            d="M 48 64 Q 100 56 152 64 L 150 78 Q 100 70 50 78 Z"
            fill="rgba(255, 255, 255, 0.06)"
          />

          {/* LED EYES */}
          {state === "success" || state === "completed" ? (
            // Happy Arched Eyes (^_^)
            <g filter={`url(#eyeGlow_${uniqueId})`}>
              <path
                d="M 64 92 Q 76 74 88 92"
                fill="none"
                stroke="#10B981"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 112 92 Q 124 74 136 92"
                fill="none"
                stroke="#10B981"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          ) : state === "thinking" ? (
            // Swirling / Orbiting Thinking Eyes
            <g filter={`url(#eyeGlow_${uniqueId})`}>
              <motion.circle
                cx="76"
                cy="88"
                r="11"
                fill="#8B7CFF"
                animate={{ cx: [74, 80, 74], cy: [86, 90, 86] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="124"
                cy="88"
                r="11"
                fill="#8B7CFF"
                animate={{ cx: [122, 128, 122], cy: [86, 90, 86] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
              {/* Pupil highlights */}
              <circle cx="78" cy="85" r="3.5" fill="#FFFFFF" />
              <circle cx="126" cy="85" r="3.5" fill="#FFFFFF" />
            </g>
          ) : (
            // Expressive Glowing LED Eyes (Default, Speaking, Listening, Greeting, Idle)
            <g filter={`url(#eyeGlow_${uniqueId})`}>
              {/* Left Eye */}
              <motion.g
                animate={
                  state === "listening"
                    ? { scale: [1, 1.15, 1] }
                    : { scaleY: [1, 1, 0.1, 1, 1] }
                }
                transition={{
                  repeat: Infinity,
                  duration: state === "listening" ? 1.8 : 4.5,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
                style={{ originX: "76px", originY: "88px" }}
              >
                <rect
                  x="64"
                  y="76"
                  width="24"
                  height="24"
                  rx="9"
                  fill="#27D3E8"
                />
                <circle cx="73" cy="83" r="3.5" fill="#FFFFFF" />
              </motion.g>

              {/* Right Eye */}
              <motion.g
                animate={
                  state === "listening"
                    ? { scale: [1, 1.15, 1] }
                    : { scaleY: [1, 1, 0.1, 1, 1] }
                }
                transition={{
                  repeat: Infinity,
                  duration: state === "listening" ? 1.8 : 4.5,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
                style={{ originX: "124px", originY: "88px" }}
              >
                <rect
                  x="112"
                  y="76"
                  width="24"
                  height="24"
                  rx="9"
                  fill="#8B7CFF"
                />
                <circle cx="121" cy="83" r="3.5" fill="#FFFFFF" />
              </motion.g>
            </g>
          )}

          {/* LED MOUTH / WAVEFORM BAR */}
          {state === "speaking" ? (
            // Dynamic Fluctuating Audio Spectrum Mouth
            <g>
              <motion.line
                x1="80"
                y1="120"
                x2="80"
                y2="120"
                stroke="#27D3E8"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y1: [116, 124, 116], y2: [124, 116, 124] }}
                transition={{ repeat: Infinity, duration: 0.35 }}
              />
              <motion.line
                x1="88"
                y1="114"
                x2="88"
                y2="126"
                stroke="#27D3E8"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y1: [112, 126, 112], y2: [128, 114, 128] }}
                transition={{ repeat: Infinity, duration: 0.42 }}
              />
              <motion.line
                x1="96"
                y1="110"
                x2="96"
                y2="130"
                stroke="#FFFFFF"
                strokeWidth="4.5"
                strokeLinecap="round"
                animate={{ y1: [108, 128, 108], y2: [132, 112, 132] }}
                transition={{ repeat: Infinity, duration: 0.38 }}
              />
              <motion.line
                x1="104"
                y1="110"
                x2="104"
                y2="130"
                stroke="#FFFFFF"
                strokeWidth="4.5"
                strokeLinecap="round"
                animate={{ y1: [110, 126, 110], y2: [130, 114, 130] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
              <motion.line
                x1="112"
                y1="114"
                x2="112"
                y2="126"
                stroke="#8B7CFF"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y1: [114, 126, 114], y2: [126, 114, 126] }}
                transition={{ repeat: Infinity, duration: 0.36 }}
              />
              <motion.line
                x1="120"
                y1="118"
                x2="120"
                y2="122"
                stroke="#8B7CFF"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y1: [116, 122, 116], y2: [124, 118, 124] }}
                transition={{ repeat: Infinity, duration: 0.45 }}
              />
            </g>
          ) : state === "success" || state === "completed" ? (
            // Smiling LED Curve
            <path
              d="M 82 118 Q 100 132 118 118"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              filter={`url(#eyeGlow_${uniqueId})`}
            />
          ) : state === "listening" ? (
            // Smooth Calm Listening Wave
            <motion.path
              d="M 82 120 Q 91 114 100 120 Q 109 126 118 120"
              fill="none"
              stroke="#27D3E8"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 82 120 Q 91 114 100 120 Q 109 126 118 120",
                  "M 82 120 Q 91 126 100 120 Q 109 114 118 120",
                  "M 82 120 Q 91 114 100 120 Q 109 126 118 120",
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          ) : (
            // Idle / Greeting Sleek Horizontal Bar
            <line
              x1="86"
              y1="120"
              x2="114"
              y2="120"
              stroke="#27D3E8"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          )}

          {/* Bottom Collar Accent */}
          <path
            d="M 72 168 L 128 168 L 120 182 L 80 182 Z"
            fill="#182338"
            stroke="rgba(39, 211, 232, 0.4)"
            strokeWidth="1.5"
          />
          <circle cx="100" cy="175" r="3" fill="#27D3E8" />
        </svg>
      </motion.div>

      {/* Optional Status Badge Pill */}
      {showStatusBadge && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isSuccess
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
              : isVioletDominant
              ? "bg-violet-950/60 text-violet-300 border-violet-500/30"
              : "bg-cyan-950/60 text-cyan-300 border-cyan-500/30"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full animate-ping ${
              isSuccess
                ? "bg-emerald-400"
                : isVioletDominant
                ? "bg-violet-400"
                : "bg-cyan-400"
            }`}
          />
          <span>{currentLabel}</span>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewMateBot;
