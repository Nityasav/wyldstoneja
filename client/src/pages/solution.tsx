import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

export default function Solution() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-48 px-6 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Our Approach</span>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-12">Jewelry with<br/><span className="italic opacity-30">Vigilance.</span></h1>
          <div className="grid md:grid-cols-2 gap-12 text-xl font-light leading-relaxed text-muted-foreground">
            <p>Wyldstone calls on you to help us with our journey to save wildlife. By creating beautiful, accessible bead bracelets, we turn everyday style into a powerful symbol for global change. </p>
            <p>Each bracelet features beads in popular colours like white, blue, black, red, and more. Along with an animal charm that reflects the cause. Which means for every $10 bracelet purchased, we get closer to protecting wildlife and adopting vulnerable zoo animals. We offer handmade beaded charm bracelets designed to raise awareness and funds for wildlife conservation.
            .</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
