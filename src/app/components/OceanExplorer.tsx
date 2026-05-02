import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { DepthIndicator } from "./DepthIndicator";
import { SeaCreature } from "./SeaCreature";
import { CreatureModal } from "./CreatureModal";
import { BubbleEffect } from "./BubbleEffect";
import { SeaCreature as SeaCreatureType } from "../../utils/supabase";

interface OceanExplorerProps {
  creatures: SeaCreatureType[];
}

export function OceanExplorer({ creatures }: OceanExplorerProps) {
  const [selectedCreature, setSelectedCreature] = useState<SeaCreatureType | null>(null);
  const [scrollDepth, setScrollDepth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const maxDepth = creatures.length > 0 ? Math.max(...creatures.map(c => c.depth), 11000) : 11000;
  const containerHeight = maxDepth * 2 + 1000;

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "rgb(135, 206, 235)",
      "rgb(70, 130, 180)",
      "rgb(25, 60, 110)",
      "rgb(15, 30, 60)",
      "rgb(5, 10, 25)",
      "rgb(0, 0, 0)"
    ]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrolled = window.scrollY;
        const depth = (scrolled / 2);
        setScrollDepth(depth);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div
        ref={containerRef}
        style={{
          backgroundColor,
          minHeight: `${containerHeight}px`
        }}
        className="relative overflow-hidden"
      >
        <div className="sticky top-0 left-0 w-full h-screen pointer-events-none">
          <DepthIndicator depth={scrollDepth} />
          <BubbleEffect />
        </div>

        <div className="absolute top-0 left-0 w-full">
          <div className="h-screen flex items-center justify-center">
            <div className="text-center text-white space-y-4 px-4">
              <motion.h1
                className="text-5xl md:text-7xl font-bold"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Eksplorasi Laut Dalam
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Scroll ke bawah untuk menjelajahi kedalaman samudra
              </motion.p>
              <motion.div
                className="text-4xl mt-8"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ↓
              </motion.div>
            </div>
          </div>

          <div className="relative" style={{ height: `${containerHeight - 1000}px` }}>
            {creatures.map((creature, index) => (
              <SeaCreature
                key={creature.id}
                creature={creature}
                index={index}
                onClick={() => setSelectedCreature(creature)}
              />
            ))}

            <div className="absolute" style={{ top: "200px", left: "10%" }}>
              <div className="text-white/60 text-lg font-semibold">0m - Permukaan</div>
            </div>
            <div className="absolute" style={{ top: "400px", left: "15%" }}>
              <div className="text-white/60 text-lg font-semibold">200m - Zona Epipelagik</div>
            </div>
            <div className="absolute" style={{ top: "2000px", left: "85%" }}>
              <div className="text-white/60 text-lg font-semibold">1000m - Zona Bathypelagik</div>
            </div>
            <div className="absolute" style={{ top: "8000px", left: "20%" }}>
              <div className="text-white/60 text-lg font-semibold">4000m - Zona Abisopelagik</div>
            </div>
            <div className="absolute" style={{ top: "20000px", left: "70%" }}>
              <div className="text-white/60 text-lg font-semibold">10000m - Palung Mariana</div>
            </div>
          </div>
        </div>
      </motion.div>

      <CreatureModal
        creature={selectedCreature}
        onClose={() => setSelectedCreature(null)}
      />
    </>
  );
}
