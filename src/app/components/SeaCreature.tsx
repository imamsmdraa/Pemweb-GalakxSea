import { motion } from "motion/react";
import { SeaCreature as SeaCreatureType } from "../../utils/supabase";
import { useMemo } from "react";

interface SeaCreatureProps {
  creature: SeaCreatureType;
  onClick: () => void;
  index: number;
}

export function SeaCreature({ creature, onClick, index }: SeaCreatureProps) {
  const position = useMemo(() => {
    const seed = creature.id.charCodeAt(0) + index;
    const leftPosition = ((seed * 37) % 70) + 15;
    return leftPosition;
  }, [creature.id, index]);

  const floatAnimation = useMemo(() => {
    const seed = creature.id.charCodeAt(0);
    return {
      y: [0, (seed % 20) - 10, 0],
      x: [0, (seed % 10) - 5, 0],
    };
  }, [creature.id]);

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        top: `${creature.depth * 2}px`,
        left: `${position}%`
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15, rotate: 5 }}
      animate={floatAnimation}
      transition={{
        initial: { duration: 0.5 },
        hover: { duration: 0.3 },
        default: {
          duration: 4 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      onClick={onClick}
    >
      <div className="relative">
        <motion.img
          src={creature.imageUrl}
          alt={creature.name}
          className="w-16 h-16 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover rounded-full border-4 border-white/30 shadow-xl group-hover:border-white/60 transition-all"
          whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
        />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
          {creature.name}
        </div>
      </div>
    </motion.div>
  );
}
