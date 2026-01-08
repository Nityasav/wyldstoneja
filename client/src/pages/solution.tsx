import React from "react";
import { motion } from "framer-motion";

export default function Solution() {
  return (
    <div className="min-h-screen pt-32 px-6 container mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Our Approach</span>
        <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-12">Jewelry with<br/><span className="italic opacity-30">Vigilance.</span></h1>
        <div className="grid md:grid-cols-2 gap-12 text-xl font-light leading-relaxed text-muted-foreground">
          <p>Wyldstone bridges the gap between luxury and conservation. By creating beautiful, accessible Moissanite bracelets, we turn everyday style into a powerful tool for global change.</p>
          <p>Our direct-to-cause model ensures that for every $15 bracelet, a significant portion goes directly to specialized charities focused on the animal you choose.</p>
        </div>
      </motion.div>
    </div>
  );
}
