import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Heart, Leaf, Globe, Shield, Menu, X, ShoppingBag, ArrowDown } from "lucide-react";

// Assets
import heroImage from "@assets/generated_images/hero_image_of_wyldstone_bracelet_in_nature.png";
import rhinoImage from "@assets/generated_images/rhino_charm_bracelet_product_shot.png";
import elephantImage from "@assets/generated_images/elephant_charm_bracelet_product_shot.png";
import polarBearImage from "@assets/generated_images/polar_bear_charm_bracelet_product_shot.png";
import pandaImage from "@assets/generated_images/panda_charm_bracelet_product_shot.png";
import abstractBg from "@assets/generated_images/abstract_luxury_nature_texture_background.png";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  { id: "rhino", name: "The Rhino Guardian", animal: "Rhino", cause: "Anti-Poaching", price: 15, image: rhinoImage },
  { id: "elephant", name: "The Gentle Giant", animal: "Elephant", cause: "Habitat Protection", price: 15, image: elephantImage },
  { id: "polar-bear", name: "The Arctic Spirit", animal: "Polar Bear", cause: "Arctic Preservation", price: 15, image: polarBearImage },
  { id: "panda", name: "The Bamboo Walker", animal: "Panda", cause: "Reforestation", price: 15, image: pandaImage }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "py-4" : "py-8"}`}>
      <div className={`mx-auto max-w-7xl px-6 flex justify-between items-center transition-all duration-500 ${scrolled ? "glass rounded-full py-3 px-8 mx-6" : ""}`}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-serif font-black tracking-tighter text-primary">
          WYLDSTONE
        </motion.div>
        <div className="hidden md:flex items-center space-x-12">
          {["Collection", "Impact", "Journal"].map((item, i) => (
            <motion.a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 hover:text-primary transition-colors"
            >
              {item}
            </motion.a>
          ))}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

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
          <Badge className="mb-8 bg-white/10 backdrop-blur-md text-white border-white/20 px-6 py-2 text-[10px] tracking-[0.4em] uppercase font-bold">
            Nature's Fine Jewelry
          </Badge>
          <h1 className="text-[clamp(3rem,12vw,9rem)] font-serif font-black text-white leading-[0.9] mb-8 tracking-tighter text-glow">
            RARE<br/><span className="italic font-light opacity-80">Purpose.</span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col items-center">
            <p className="max-w-xl text-white/70 text-lg mb-12 font-light tracking-wide leading-relaxed">
              Ethically sourced Moissanite meet wildlife conservation. <br/>$15 that changes the world.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-accent hover:text-white px-12 py-8 rounded-full text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl">
              Explore Collection
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        <span className="text-[10px] uppercase tracking-[0.5em] text-white/50 font-bold">Scroll</span>
      </motion.div>
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
            Every charm is hand-carved silver, paired with a brilliant moissanite. $15 total. Direct donations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50 border border-border">
          {products.map((p, i) => (
            <motion.div 
              key={p.id} 
              className="group relative aspect-[4/5] bg-background overflow-hidden p-12 flex flex-col justify-between"
              whileHover="hover"
            >
              <div className="z-10 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-4xl font-serif mb-2 group-hover:text-accent transition-colors duration-500">{p.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Supports {p.cause}</p>
                  </div>
                  <span className="text-2xl font-light">${p.price}</span>
                </div>
              </div>

              <motion.div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                <motion.img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-4/5 h-4/5 object-contain"
                  variants={ { hover: { scale: 1.1, rotate: 5 } } }
                />
              </motion.div>

              <div className="z-10 relative opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <Button className="w-full bg-primary text-white py-8 rounded-none uppercase tracking-[0.3em] font-bold text-xs">
                  Add to Cart
                </Button>
              </div>
            </motion.div>
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
            "A small piece of <span className="italic text-accent">luxury</span> that acts as a giant shield for the <span className="opacity-40">wild.</span>"
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
          <div className="flex gap-12">
            {["Instagram", "Journal", "Impact"].map(l => (
              <a key={l} href="#" className="text-[10px] uppercase tracking-widest font-bold hover:text-accent transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
