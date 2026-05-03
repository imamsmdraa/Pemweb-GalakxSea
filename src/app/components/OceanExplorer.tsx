import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { DepthIndicator } from "./DepthIndicator";
import { SeaCreature } from "./SeaCreature";
import { CreatureModal } from "./CreatureModal";
import { BubbleEffect } from "./BubbleEffect";
import { Wave } from "./wave";
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
        <div className="pointer-events-none sticky top-0 left-0 z-10 h-screen w-full overflow-hidden">
          <DepthIndicator depth={scrollDepth} />
          <BubbleEffect />
        </div>

        <div className="absolute top-0 left-0 w-full">
          <div className="flex h-screen items-center justify-center px-4">
            <div className="max-w-4xl text-center text-white">
              <motion.h1
                className="text-balance text-5xl font-extrabold leading-none tracking-[-0.04em] md:text-7xl lg:text-8xl"
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                Eksplorasi Laut Dalam
              </motion.h1>
              <motion.p
                className="mt-4 text-lg font-medium text-white/90 md:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.25 }}
              >
                Scroll ke bawah untuk menjelajahi kedalaman samudra
              </motion.p>
              <motion.div
                className="mt-28 text-6xl font-light text-white"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                ↓
              </motion.div>
            </div>
          </div>

          <Wave height={140} opacity={0.95} />

          <div className="relative" style={{ height: `${containerHeight - 1000}px` }}>
            {creatures.map((creature, index) => (
              <SeaCreature
                key={creature.id}
                creature={creature}
                index={index}
                onClick={() => setSelectedCreature(creature)}
              />
            ))}
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
