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
            <p>Every year, thousands of majestic species are pushed closer to the brink. Poaching, habitat loss, and climate change are not just headlines—they are immediate threats to the balance of our planet.</p>
            <p>Wildlife conservation often feels distant, expensive, and inaccessible. Most people want to help but don't know where to start or if their contribution truly matters.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
