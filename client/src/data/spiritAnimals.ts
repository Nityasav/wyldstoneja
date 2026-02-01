/**
 * Spirit animals and quiz questions for the onboarding journey.
 */
import amurResultImage from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (6).jpeg";
import taliseResultImage from "@assets/generated_images/minimalist_beaded_bracelet_with_silver_charm_in_nature.jpeg";
import aureliusResultImage from "@assets/generated_images/WhatsApp Image 2026-01-15 at 23.24.02 (1).jpeg";

export type SpiritAnimalId = "tiger" | "turtle" | "red-panda";

export interface SpiritAnimal {
  id: SpiritAnimalId;
  name: string;
  tagline: string;
  cause: string;
  description: string;
  image: string;
}

export const SPIRIT_ANIMALS: SpiritAnimal[] = [
  {
    id: "tiger",
    name: "Amur",
    tagline: "Strength and boldness",
    cause: "Anti-Poaching",
    description:
      "Your spirit animal is the Tiger. You lead with courage and conviction. Your bracelet supports anti-poaching efforts and the protection of big cats in the wild.",
    image: amurResultImage,
  },
  {
    id: "turtle",
    name: "Talise",
    tagline: "Patience and longevity",
    cause: "Ocean & Habitat",
    description:
      "Your spirit animal is the Turtle. You value steadiness and the long view. Your bracelet supports ocean conservation and the protection of marine habitats.",
    image: taliseResultImage,
  },
  {
    id: "red-panda",
    name: "Aurelias",
    tagline: "Curiosity and uniqueness",
    cause: "Endangered Species",
    description:
      "Your spirit animal is the Red Panda. You embrace curiosity and the rare. Your bracelet supports endangered species and vulnerable wildlife.",
    image: aureliusResultImage,
  },
];

export interface QuizOption {
  label: string;
  animalId: SpiritAnimalId;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What matters most to you?",
    options: [
      { label: "Courage and standing up for what's right", animalId: "tiger" },
      { label: "Steady progress and lasting change", animalId: "turtle" },
      { label: "Curiosity and protecting the rare", animalId: "red-panda" },
    ],
  },
  {
    id: "q2",
    question: "How do you recharge?",
    options: [
      { label: "Taking action and moving forward", animalId: "tiger" },
      { label: "Slowing down and going with the flow", animalId: "turtle" },
      { label: "Exploring and discovering something new", animalId: "red-panda" },
    ],
  },
  {
    id: "q3",
    question: "Which cause is closest to your heart?",
    options: [
      { label: "Stopping poaching and protecting big cats", animalId: "tiger" },
      { label: "Ocean and marine habitat conservation", animalId: "turtle" },
      { label: "Saving endangered and vulnerable species", animalId: "red-panda" },
    ],
  },
];

const ANIMAL_ORDER: SpiritAnimalId[] = ["tiger", "turtle", "red-panda"];

/**
 * Tally answers by animalId and return the winning spirit animal id.
 * Tie-break: first in SPIRIT_ANIMALS order.
 */
export const getRecommendedAnimalId = (answers: Record<string, SpiritAnimalId>): SpiritAnimalId => {
  const counts: Record<SpiritAnimalId, number> = {
    tiger: 0,
    turtle: 0,
    "red-panda": 0,
  };
  for (const animalId of Object.values(answers)) {
    counts[animalId] = (counts[animalId] ?? 0) + 1;
  }
  let maxCount = 0;
  let winner: SpiritAnimalId = "tiger";
  for (const id of ANIMAL_ORDER) {
    if (counts[id] > maxCount) {
      maxCount = counts[id];
      winner = id;
    }
  }
  return winner;
};
