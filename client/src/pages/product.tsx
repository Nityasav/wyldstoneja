import React from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { getProductBySlug } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ productSlug: string }>();
  const product = params?.productSlug ? getProductBySlug(params.productSlug) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-48 px-6 container mx-auto text-center">
          <p className="text-xl text-muted-foreground mb-6">This bracelet was not found.</p>
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Back to collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 container mx-auto max-w-6xl">
        <Link href="/#collection" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
          <span className="text-sm font-medium">Back to collection</span>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
              Spirit Animal
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-muted-foreground mb-8">${product.price}</p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Hand-carved silver charm paired with high-quality gem beads. $10 total. Direct donations to conservation.
            </p>
            <Link href="/#collection">
              <Button
                size="lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-accent font-bold uppercase tracking-wider"
                aria-label="Back to collection"
              >
                Back to collection
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
