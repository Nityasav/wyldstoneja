import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Problem", path: "/problem" },
  { label: "Solution", path: "/solution" },
  { label: "Impact", path: "/impact" },
  { label: "Team", path: "/team" }
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHome ? "py-4" : "py-8"}`}>
      <div className={`mx-auto max-w-7xl px-6 flex justify-between items-center transition-all duration-500 ${scrolled || !isHome ? "bg-white/80 backdrop-blur-xl border border-black/5 shadow-lg rounded-full py-3 px-8 mx-4 md:mx-6" : "mx-6"}`}>
        <Link href="/">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className={`text-xl font-serif font-black tracking-tighter cursor-pointer transition-colors duration-300 ${scrolled || !isHome ? "text-primary" : "text-white"}`}
          >
            WYLDSTONE
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item, i) => (
            <Link key={item.label} href={item.path}>
              <motion.a 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300 cursor-pointer ${scrolled || !isHome ? "text-foreground/60 hover:text-primary" : "text-white/70 hover:text-white"}`}
              >
                {item.label}
              </motion.a>
            </Link>
          ))}
          <Button variant="ghost" size="icon" className={`rounded-full transition-all duration-300 ${scrolled || !isHome ? "hover:bg-primary hover:text-white text-primary" : "text-white hover:bg-white/20"}`}>
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Button variant="ghost" size="icon" className={`rounded-full transition-all duration-300 ${scrolled || !isHome ? "text-primary" : "text-white"}`}>
            <ShoppingBag className="h-4 w-4" />
          </Button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-2 transition-colors duration-300 ${scrolled || !isHome ? "text-primary" : "text-white"}`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 mt-4 mx-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-black/5 p-8 flex flex-col items-center space-y-6">
              {navItems.map((item) => (
                <Link key={item.label} href={item.path}>
                  <a className="text-sm font-black uppercase tracking-[0.4em] text-primary hover:text-accent transition-colors">
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
