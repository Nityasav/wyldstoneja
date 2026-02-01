import amurImage from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (1).jpeg";
import aureliusImage from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02.jpeg";
import taliseImage from "@assets/generated_images/minimalist_beaded_bracelet_with_silver_charm_in_nature.jpeg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export const products: Product[] = [
  { id: "aurelius", slug: "aurelias", name: "Aurelius", price: 10, image: amurImage },
  { id: "amur", slug: "amur", name: "Amur", price: 10, image: aureliusImage },
  { id: "talise", slug: "talise", name: "Talise", price: 10, image: taliseImage },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
