import { motion } from "motion/react";

interface WaveProps {
  height?: number;
  fill?: string;
  opacity?: number;
}

export function Wave({ 
  height = 100, 
  fill = "rgba(135, 206, 235, 0.3)", 
  opacity = 1 
}: WaveProps) {
  return (
    <motion.div
      className="relative w-full overflow-hidden"
      style={{ height, opacity }}
    >
      {/* Layer 1 - Main Wave */}
      <motion.svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full"
        animate={{ x: [0, -1200, 0] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(135, 206, 235, 0.4)" />
            <stop offset="100%" stopColor="rgba(70, 130, 180, 0.6)" />
          </linearGradient>
        </defs>
        <path
          d="M 0,100 Q 300,50 600,100 T 1200,100 L 1200,200 L 0,200 Z"
          fill="url(#wave1)"
        />
      </motion.svg>

      {/* Layer 2 - Secondary Wave */}
      <motion.svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full"
        animate={{ x: [0, 1200, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(100, 180, 220, 0.3)" />
            <stop offset="100%" stopColor="rgba(50, 100, 150, 0.5)" />
          </linearGradient>
        </defs>
        <path
          d="M 0,120 Q 300,80 600,120 T 1200,120 L 1200,200 L 0,200 Z"
          fill="url(#wave2)"
        />
      </motion.svg>

      {/* Layer 3 - Tertiary Wave */}
      <motion.svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full"
        animate={{ x: [0, -800, 0] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(70, 160, 210, 0.2)" />
            <stop offset="100%" stopColor="rgba(30, 80, 130, 0.4)" />
          </linearGradient>
        </defs>
        <path
          d="M 0,140 Q 300,100 600,140 T 1200,140 L 1200,200 L 0,200 Z"
          fill="url(#wave3)"
        />
      </motion.svg>
    </motion.div>
  );
}