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

export default function Impact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-48 px-6 container mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">The Numbers</span>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-20">Real Change,<br/><span className="italic opacity-30">Measured.</span></h1>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { label: "Sales Goal Units", value: "600" },
              { label: "Break-Even Units", value: "97" },
              { label: "Donation Rate", value: "10%" }
            ].map((stat, i) => (
              <div key={i} className="p-8 border border-border">
                <div className="text-4xl font-serif mb-2">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-16 text-xl font-light text-muted-foreground max-w-2xl mx-auto">Our goal is to sell 600 units by the end of the JA Program timeline, prioritizing direct-to-consumer sales at schools and community events.</p>
        </motion.div>
      </div>
    </div>
  );
}
