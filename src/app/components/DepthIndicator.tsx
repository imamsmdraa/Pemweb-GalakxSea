import { motion } from "motion/react";

interface DepthIndicatorProps {
  depth: number;
}

export function DepthIndicator({ depth }: DepthIndicatorProps) {
  return (
    <motion.div
      className="fixed left-1/2 top-[58%] z-40 w-[min(100vw-2rem,1280px)] -translate-x-1/2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-12">
        <div className="absolute left-0 top-1/2 h-px w-[46%] -translate-y-1/2 border-t border-dashed border-white/45" />
        <div className="absolute right-0 top-1/2 h-px w-[46%] -translate-y-1/2 border-t border-dashed border-white/45" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-white">
          <div className="text-sm font-semibold text-white/75">Kedalaman</div>
          <div className="mt-1 text-2xl font-bold leading-none">{Math.round(depth)} m</div>
        </div>
      </div>
    </motion.div>
  );
}
