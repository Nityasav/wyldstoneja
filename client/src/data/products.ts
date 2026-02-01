import amurImage from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (1).jpeg";
import aureliusImage from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02.jpeg";
import taliseImage from "@assets/generated_images/minimalist_beaded_bracelet_with_silver_charm_in_nature.jpeg";
import aureliasGallery1 from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (4).jpeg";
import aureliasGallery2 from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.03.jpeg";
import aureliasGallery3 from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (3).jpeg";
import amurGallery1 from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (6).jpeg";
import amurGallery2 from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (5).jpeg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  galleryImages?: string[];
};

export const products: Product[] = [
  {
    id: "aurelius",
    slug: "aurelias",
    name: "Aurelius",
    price: 10,
    image: amurImage,
    galleryImages: [amurImage, aureliasGallery1, aureliasGallery2, aureliasGallery3],
  },
  {
    id: "amur",
    slug: "amur",
    name: "Amur",
    price: 10,
    image: aureliusImage,
    galleryImages: [aureliusImage, amurGallery1, amurGallery2],
  },
  { id: "talise", slug: "talise", name: "Talise", price: 10, image: taliseImage },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
