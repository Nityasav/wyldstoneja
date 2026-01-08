import React from "react";
import { motion } from "framer-motion";

export default function Team() {
  const members = [
    { name: "Elena Stone", role: "Founder & Creative Lead" },
    { name: "Dr. Marcus Thorne", role: "Conservation Director" },
    { name: "Sarah Chen", role: "Sustainability Officer" }
  ];

  return (
    <div className="min-h-screen pt-32 px-6 container mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">The Humans</span>
        <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-20">Meet the<br/><span className="italic opacity-30">Guardians.</span></h1>
        <div className="grid md:grid-cols-3 gap-12">
          {members.map((m, i) => (
            <div key={i} className="group cursor-default">
              <div className="aspect-[3/4] bg-stone-100 mb-6 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
                <div className="w-full h-full bg-stone-200" /> {/* Placeholder for team photos */}
              </div>
              <h3 className="text-2xl font-serif mb-1">{m.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">{m.role}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
