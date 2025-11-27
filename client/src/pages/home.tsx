import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Heart, Leaf, Globe, Shield, Menu, X, ShoppingBag } from "lucide-react";

// Assets
import heroImage from "@assets/generated_images/hero_image_of_wyldstone_bracelet_in_nature.png";
import rhinoImage from "@assets/generated_images/rhino_charm_bracelet_product_shot.png";
import elephantImage from "@assets/generated_images/elephant_charm_bracelet_product_shot.png";
import polarBearImage from "@assets/generated_images/polar_bear_charm_bracelet_product_shot.png";
import pandaImage from "@assets/generated_images/panda_charm_bracelet_product_shot.png";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Types
interface Product {
  id: string;
  name: string;
  animal: string;
  cause: string;
  price: number;
  image: string;
  color: string;
}

const products: Product[] = [
  {
    id: "rhino",
    name: "The Rhino Guardian",
    animal: "Rhino",
    cause: "Anti-Poaching Units",
    price: 15,
    image: rhinoImage,
    color: "bg-stone-200"
  },
  {
    id: "elephant",
    name: "The Gentle Giant",
    animal: "Elephant",
    cause: "Habitat Preservation",
    price: 15,
    image: elephantImage,
    color: "bg-stone-300"
  },
  {
    id: "polar-bear",
    name: "The Arctic Spirit",
    animal: "Polar Bear",
    cause: "Climate Action",
    price: 15,
    image: polarBearImage,
    color: "bg-slate-200"
  },
  {
    id: "panda",
    name: "The Bamboo Walker",
    animal: "Panda",
    cause: "Reforestation",
    price: 15,
    image: pandaImage,
    color: "bg-green-100"
  }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-serif font-bold tracking-tighter text-primary"
        >
          WYLDSTONE
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {["Collection", "Our Mission", "Impact", "Journal"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide"
            >
              {item}
            </motion.a>
          ))}
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary hover:text-white transition-all">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-primary p-2">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t"
          >
            <div className="flex flex-col p-6 space-y-4">
              {["Collection", "Our Mission", "Impact", "Journal"].map((item) => (
                <a key={item} href="#" className="text-lg font-serif text-foreground" onClick={() => setIsOpen(false)}>
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Wyldstone Bracelet in Nature" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-6 text-white border-white/40 backdrop-blur-sm px-4 py-1 text-xs tracking-[0.2em] uppercase">
            Ethically Crafted
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-6 leading-tight tracking-tight">
            Wear Your <br/><span className="italic font-light">Wild</span> Side
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-white/90 mb-10 font-light leading-relaxed">
            Handcrafted Moissanite bracelets that protect the wild. 
            Choose your charm, choose your cause.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-white text-primary hover:bg-stone-100 text-md px-8 py-6 rounded-full shadow-xl">
                Shop the Collection
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm text-md px-8 py-6 rounded-full">
                Our Impact
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-widest">
          <span>Scroll</span>
          <div className="w-[1px] h-12 bg-white/50" />
        </div>
      </motion.div>
    </section>
  );
};

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-6 bg-stone-100">
        <motion.img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
          <Heart className="w-8 h-8 mb-3" />
          <p className="font-serif text-xl italic mb-2">Supports</p>
          <p className="text-lg font-medium uppercase tracking-widest">{product.cause}</p>
          <Button variant="outline" className="mt-6 border-white text-white hover:bg-white hover:text-primary rounded-full">
            Quick Add - ${product.price}
          </Button>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="font-serif text-2xl text-primary mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{product.animal} Charm</p>
        <p className="font-medium text-lg">${product.price}.00</p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    { icon: <Globe className="w-6 h-6" />, title: "Global Impact", description: "Partnered with wildlife conservancies worldwide." },
    { icon: <Leaf className="w-6 h-6" />, title: "Eco-Materials", description: "Recycled silver and ethically sourced Moissanite." },
    { icon: <Shield className="w-6 h-6" />, title: "Transparent Giving", description: "100% of net proceeds go directly to the cause." },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Mission = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-accent uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">Our Promise</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight text-primary">
              More than jewelry.<br/>A movement for the wild.
            </h2>
            <p className="text-lg text-muted-foreground leading-loose mb-10">
              Wyldstone was born from a simple idea: luxury should leave the world better than we found it. 
              Every bracelet is a pact between you and nature. When you wear the Rhino, you stand guard with the rangers. 
              When you wear the Polar Bear, you protect the ice.
            </p>
            <div className="flex justify-center">
              <Button variant="link" className="text-primary text-lg p-0 hover:text-accent decoration-accent underline-offset-8">
                Read our full story <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary blur-[120px]" />
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-serif font-bold mb-6">WYLDSTONE</h3>
            <p className="max-w-md text-white/60 leading-relaxed mb-8">
              Elevated jewelry for the eco-conscious. Join us in our mission to protect the world's most vulnerable species, one charm at a time.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">Instagram</div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">TikTok</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-6">Shop</h4>
            <ul className="space-y-4 text-white/60">
              <li className="hover:text-white cursor-pointer transition-colors">All Bracelets</li>
              <li className="hover:text-white cursor-pointer transition-colors">New Arrivals</li>
              <li className="hover:text-white cursor-pointer transition-colors">Gift Cards</li>
              <li className="hover:text-white cursor-pointer transition-colors">Track Order</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif mb-6">Company</h4>
            <ul className="space-y-4 text-white/60">
              <li className="hover:text-white cursor-pointer transition-colors">Our Mission</li>
              <li className="hover:text-white cursor-pointer transition-colors">Sustainability</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
          <p>© 2025 Wyldstone Jewelry. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-sans selection:bg-accent selection:text-primary">
      <Navbar />
      
      <Hero />
      
      <Features />
      
      <section id="collection" className="py-32 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-primary">The Collection</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Four distinct animals. Four urgent causes. One beautiful way to help.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
      
      <Mission />
      
      <section className="py-24 bg-stone-900 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-serif mb-8">Join the Pack</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10">Sign up for updates on new charms and conservation milestones.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button className="bg-accent text-primary hover:bg-accent/90 rounded-full px-8 py-4 h-auto font-medium">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
