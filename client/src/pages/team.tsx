import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import collectivePhoto from "@assets/generated_images/WhatsApp Image 2026-01-14 at 19.00.13.jpeg";
import memberPhoto1 from "@assets/generated_images/WhatsApp Image 2026-01-14 at 19.18.57 (1).jpeg";
import memberPhoto2 from "@assets/generated_images/WhatsApp Image 2026-01-14 at 19.18.57 (2).jpeg";
import memberPhoto3 from "@assets/generated_images/WhatsApp Image 2026-01-14 at 19.18.57.jpeg";

export default function Team() {
  const members = [
    { image: memberPhoto1 },
    { image: memberPhoto2 },
    { image: memberPhoto3 },
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
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-6">Meet the<br/><span className="italic opacity-30">Wyldstone Team.</span></h1>
          <p className="w-full text-center text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12">
            We are a  group of high schoolers from the Durham region united by our passion for making a difference. Our handmade bracelets symbolize teamwork and dedication, with proceeds supporting the animals at the Toronto Zoo. Together, we&apos;re crafting jewelry with a purpose.
          </p>
          
          {/* Wyldstone Collective Photo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full aspect-[3/2] rounded-2xl mb-20 overflow-hidden relative border border-border"
          >
            <img
              src={collectivePhoto}
              alt="Wyldstone Collective Photo"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {members.map((m, i) => (
              <div key={i} className="group cursor-default">
                <div className="aspect-[3/4] mb-6 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden rounded-lg">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
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
