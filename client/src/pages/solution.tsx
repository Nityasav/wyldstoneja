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
            <p>Wyldstone bridges the gap between luxury and conservation. By creating beautiful, accessible Moissanite bracelets, we turn everyday style into a powerful tool for global change.</p>
            <p>Our direct-to-cause model ensures that for every $15 bracelet, a significant portion goes directly to specialized charities focused on the animal you choose.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
