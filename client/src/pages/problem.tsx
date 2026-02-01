import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

export default function Problem() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-48 px-6 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">The Crisis</span>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-12">Silent<br/><span className="italic opacity-30">Extinction.</span></h1>
          <div className="grid md:grid-cols-2 gap-12 text-xl font-light leading-relaxed text-muted-foreground">
            <p>Every year, thousands of majestic species are pushed closer to the brink. Poaching, habitat loss, and climate change are not just headlines, they are immediate threats that affect what you and your future loved ones will have access to experience. 
            </p>
            <p>Although supporting Wildlife conservation often feels distant, expensive, and inaccessible. Wyldstone is a student led Canadian JA Company that is dedicated to protecting endangered animals one bracelet at a time. </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
