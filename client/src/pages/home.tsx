import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Heart, Leaf, Globe, Shield, Menu, X, ShoppingBag, ArrowDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";

// Assets
import heroImage from "@assets/generated_images/minimalist_beaded_bracelet_with_silver_charm_in_nature.jpeg";
import abstractBg from "@assets/generated_images/abstract_nature_textures_for_background.png";
import { Link } from "wouter";

// UI Components
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-black">
      <motion.div style={ { y: y1, opacity } } className="absolute inset-0 z-0">
        <img src={heroImage} alt="Nature" className="w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />
      </motion.div>

      <div className="container relative z-10 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-serif font-black text-white leading-[0.9] mb-8 tracking-tighter text-glow">
            WYLDSTONE<br/><span className="italic font-light opacity-80">Bracelets.</span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col items-center">
            <p className="max-w-xl text-white/70 text-lg mb-12 font-light tracking-wide leading-relaxed">
              Beaded bracelets with silver charms. <br/>$10 that changes the world.
            </p>
          </motion.div>
        </motion.div>
      </div>

      </section>
  );
};

const ProductSection = () => {
  return (
    <section id="collection" className="py-40 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-8">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Personalized Impact</span>
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">Choose Your<br/><span className="italic opacity-30">Spirit Animal</span></h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-md text-muted-foreground text-xl font-light leading-relaxed">
            Every bracelet is paired with high-quality gem beads, and hand-crafted. $10 total. Direct donations to wildlife conservation. 
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.article
              key={p.id}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Image: full bleed, consistent crop */}
              <img
                src={p.image}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay for text readability */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                aria-hidden
              />
              {/* Content overlay: bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="relative z-10">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-white mb-3 group-hover:text-accent transition-colors duration-300 leading-tight tracking-tight w-full">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xl font-light text-white">${p.price}</span>
                    <span className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <Link href={`/${p.slug}`}>
                        <Button
                          size="sm"
                          className="rounded-full bg-white text-primary hover:bg-accent hover:text-primary font-bold text-xs uppercase tracking-wider px-5 py-2 min-w-fit"
                          aria-label={`Learn more about ${p.name}`}
                        >
                          Learn More
                        </Button>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const ImpactStatement = () => {
  return (
    <section className="py-60 bg-black text-white relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        className="absolute inset-0 z-0"
      >
        <img src={abstractBg} alt="" className="w-full h-full object-cover scale-125" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-serif leading-[1.1] text-center tracking-tighter"
          >
            "Wyldstone is committed to protecting <span className="italic text-accent">endangered species</span> and <span className="opacity-40">vulnerable zoo animals.</span>"
          </motion.h2>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-background">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left" style={ { scaleX } } />
      <Navbar />
      <Hero />
      <ProductSection />
      <ImpactStatement />
      
      <footer className="py-20 bg-background border-t">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-serif font-black tracking-tighter">WYLDSTONE</div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
            © 2026 Crafted with purpose.
          </p>
          <div className="flex gap-12 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.removeItem("wyldstone_onboarding_complete");
                  window.location.href = "/";
                }
              }}
              className="text-[10px] uppercase tracking-widest font-bold hover:text-accent transition-colors"
              aria-label="Find your spirit animal again"
            >
              Find yours again
            </button>
            {["Instagram", "Journal", "Impact"].map(l => (
              <a key={l} href="#" className="text-[10px] uppercase tracking-widest font-bold hover:text-accent transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
