import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { SeaCreature } from "../../utils/supabase";

interface CreatureModalProps {
  creature: SeaCreature | null;
  onClose: () => void;
}

export function CreatureModal({ creature, onClose }: CreatureModalProps) {
  if (!creature) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-blue-900/90 to-black/90 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img
              src={creature.imageUrl}
              alt={creature.name}
              className="w-full h-64 md:h-96 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {creature.name}
            </h2>
            <div className="text-blue-300 text-lg mb-4">
              Kedalaman: {creature.depth} meter
            </div>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              {creature.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
