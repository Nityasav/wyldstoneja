import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import impactImage from "@assets/generated_images/image.png";

export default function Impact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-48 px-6 container mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto"
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
          <div className="mt-16 grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div className="text-xl font-light text-muted-foreground space-y-6 text-left">
              <p>
                At Wyldstone, we are committed to protecting our planet and the wildlife that depends on it. Amur tigers, like Mazy, are the largest of all tiger subspecies and are critically endangered due to poaching and habitat loss.
              </p>
              <p>
                We are proud to support the Toronto Zoo, whose work in research, animal care, population management, and education plays a critical role in protecting endangered species. The Zoo helps maintain healthy populations and supports long-term conservation efforts both in captivity and in the wild.
              </p>
              <p>
                As part of our conservation mission, Wyldstone is working toward symbolically adopting Mazy. This initiative allows us to contribute directly to the protection of endangered wildlife and reinforces our commitment to preserving nature for future generations. Together, we can help safeguard vulnerable species and the ecosystems they reside in.
              </p>
            </div>
            <div>
              <div className="rounded-2xl overflow-hidden border border-border">
                <img
                  src={impactImage}
                  alt="Wyldstone impact and conservation"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="mt-3 text-lg text-muted-foreground italic">Mazy</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
