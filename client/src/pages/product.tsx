import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { getProductBySlug } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";

const ProductGalleryLightbox = ({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) => {
  const [index, setIndex] = useState(initialIndex);
  const currentImage = images[index];

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [onClose, goPrev, goNext]
  );

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Product image gallery"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-10 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Close gallery"
      >
        <X className="h-6 w-6" aria-hidden />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-8 w-8" aria-hidden />
      </button>

      <div
        className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          src={currentImage}
          alt=""
          className="max-h-[90vh] w-auto max-w-full object-contain"
          draggable={false}
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="h-8 w-8" aria-hidden />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60">
        {index + 1} / {images.length}
      </div>
    </motion.div>
  );
};

export default function ProductPage() {
  const params = useParams<{ productSlug: string }>();
  const product = params?.productSlug ? getProductBySlug(params.productSlug) : undefined;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const images = product.galleryImages ?? [product.image];
  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

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
          <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden border border-border">
            {images.map((src, idx) => {
              const isSingleImage = images.length === 1;
              const isThreeFirst = images.length === 3 && idx === 0;
              const buttonClassName = isSingleImage
                ? "relative col-span-2 aspect-[4/5] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                : isThreeFirst
                  ? "relative col-span-2 aspect-[2/1] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                  : "relative aspect-square overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg";
              return (
              <button
                type="button"
                key={idx}
                onClick={() => openLightbox(idx)}
                className={buttonClassName}
                aria-label={`View image ${idx + 1} of ${product.name}`}
              >
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
              );
            })}
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

      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <ProductGalleryLightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
