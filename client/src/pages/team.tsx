import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="mx-auto max-w-7xl px-6 flex justify-between items-center glass rounded-full py-3 px-8 mx-6">
        <Link href="/">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-serif font-black tracking-tighter text-primary cursor-pointer">
            WYLDSTONE
          </motion.div>
        </Link>
        <div className="hidden md:flex items-center space-x-12">
          {[
            { label: "Problem", path: "/problem" },
            { label: "Solution", path: "/solution" },
            { label: "Impact", path: "/impact" },
            { label: "Team", path: "/team" }
          ].map((item, i) => (
            <Link key={item.label} href={item.path}>
              <motion.a 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 hover:text-primary transition-colors cursor-pointer"
              >
                {item.label}
              </motion.a>
            </Link>
          ))}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default function Team() {
  const members = [
    { name: "Elena Stone", role: "Founder & Creative Lead" },
    { name: "Dr. Marcus Thorne", role: "Conservation Director" },
    { name: "Sarah Chen", role: "Sustainability Officer" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-48 px-6 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">The Humans</span>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-12">Meet the<br/><span className="italic opacity-30">Wyldstone Team.</span></h1>
          
          {/* Large Team Photo Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full aspect-[21/9] bg-stone-100 rounded-2xl mb-20 overflow-hidden relative flex items-center justify-center border border-border"
          >
            <div className="absolute inset-0 bg-stone-200/50" />
            <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-black">Wyldstone Collective Photo</span>
          </motion.div>

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
    </div>
  );
}
