import { motion } from "motion/react";

interface DepthIndicatorProps {
  depth: number;
}

export function DepthIndicator({ depth }: DepthIndicatorProps) {
  return (
    <motion.div
      className="fixed top-8 right-8 bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 shadow-lg z-50"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-white/70 text-sm font-medium mb-1">Kedalaman</div>
      <div className="text-white text-3xl font-bold">{Math.round(depth)}m</div>
    </motion.div>
  );
}
