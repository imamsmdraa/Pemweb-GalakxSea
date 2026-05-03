import { motion } from "motion/react";

interface WaveProps {
  height?: number;
  opacity?: number;
}

export function Wave({ height = 140, opacity = 1 }: WaveProps) {
  return (
    <motion.div
      className="relative w-full overflow-hidden bg-gradient-to-b from-transparent via-blue-400/10 to-blue-500/20"
      style={{ height, opacity }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Layer 1 - Foreground Wave - Fast */}
      <motion.svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        animate={{ x: [0, -1440, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.6)" />
            <stop offset="100%" stopColor="rgba(96, 165, 250, 0.8)" />
          </linearGradient>
          <filter id="blur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>
        <path
          d="M 0,80 Q 180,40 360,80 T 720,80 T 1080,80 T 1440,80 L 1440,160 L 0,160 Z"
          fill="url(#wave1)"
          filter="url(#blur1)"
        />
      </motion.svg>

      {/* Layer 2 - Mid Wave - Medium Speed */}
      <motion.svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        animate={{ x: [0, 1440, 0] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(186, 230, 253, 0.4)" />
            <stop offset="100%" stopColor="rgba(125, 211, 252, 0.6)" />
          </linearGradient>
          <filter id="blur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>
        <path
          d="M 0,100 Q 180,60 360,100 T 720,100 T 1080,100 T 1440,100 L 1440,160 L 0,160 Z"
          fill="url(#wave2)"
          filter="url(#blur2)"
        />
      </motion.svg>

      {/* Layer 3 - Background Wave - Slow */}
      <motion.svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        animate={{ x: [0, -960, 0] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(224, 242, 254, 0.25)" />
            <stop offset="100%" stopColor="rgba(173, 216, 230, 0.4)" />
          </linearGradient>
          <filter id="blur3">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>
        <path
          d="M 0,110 Q 180,70 360,110 T 720,110 T 1080,110 T 1440,110 L 1440,160 L 0,160 Z"
          fill="url(#wave3)"
          filter="url(#blur3)"
        />
      </motion.svg>

      {/* Layer 4 - Subtle Accent Wave */}
      <motion.svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        animate={{ x: [0, 1440, 0] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <linearGradient id="wave4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(225, 233, 244, 0.15)" />
            <stop offset="100%" stopColor="rgba(191, 219, 254, 0.25)" />
          </linearGradient>
        </defs>
        <path
          d="M 0,120 Q 180,85 360,120 T 720,120 T 1080,120 T 1440,120 L 1440,160 L 0,160 Z"
          fill="url(#wave4)"
        />
      </motion.svg>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}