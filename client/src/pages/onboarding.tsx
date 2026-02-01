import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  SPIRIT_ANIMALS,
  QUIZ_QUESTIONS,
  getRecommendedAnimalId,
  type SpiritAnimalId,
} from "@/data/spiritAnimals";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const TOTAL_STEPS = 1 + QUIZ_QUESTIONS.length + 1; // welcome + questions + result

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SpiritAnimalId>>({});
  const stepRef = useRef<HTMLDivElement>(null);

  const isWelcome = currentStep === 0;
  const isResult = currentStep === TOTAL_STEPS - 1;
  const questionIndex = currentStep - 1;
  const currentQuestion = questionIndex >= 0 && questionIndex < QUIZ_QUESTIONS.length
    ? QUIZ_QUESTIONS[questionIndex]
    : null;

  const progressValue = TOTAL_STEPS <= 1 ? 0 : (currentStep / (TOTAL_STEPS - 1)) * 100;

  useEffect(() => {
    stepRef.current?.focus({ preventScroll: true });
  }, [currentStep]);

  const handleStart = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleAnswer = useCallback((questionId: string, animalId: SpiritAnimalId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: animalId }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const recommendedId = getRecommendedAnimalId(answers);
  const recommendedAnimal = SPIRIT_ANIMALS.find((a) => a.id === recommendedId) ?? SPIRIT_ANIMALS[0];

  const canProceed = isWelcome
    ? true
    : currentQuestion
      ? answers[currentQuestion.id] != null
      : true;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex-shrink-0 px-6 py-6">
        <div className="container mx-auto">
          <Progress
            value={progressValue}
            className="h-1 rounded-full"
            aria-label="Quiz progress"
          />
        </div>
      </header>

      <main
        ref={stepRef}
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
        tabIndex={-1}
        aria-live="polite"
        aria-label={isWelcome ? "Welcome" : isResult ? "Your result" : "Quiz question"}
      >
        <AnimatePresence mode="wait">
          {isWelcome && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto text-center"
            >
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
                Wyldstone
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter mb-6">
                Find your spirit animal
              </h1>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-10">
                A few quick questions to match you with the bracelet that speaks to you. $10 that changes the world.
              </p>
              <Button
                size="lg"
                className="rounded-none uppercase tracking-[0.3em] font-bold text-xs px-10 py-6"
                onClick={handleStart}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                aria-label="Start quiz"
              >
                Start
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {currentQuestion && !isResult && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tighter mb-10">
                {currentQuestion.question}
              </h2>
              <RadioGroup
                value={answers[currentQuestion.id] ?? ""}
                onValueChange={(value) => handleAnswer(currentQuestion.id, value as SpiritAnimalId)}
                className="grid gap-4"
                aria-label={currentQuestion.question}
              >
                {currentQuestion.options.map((opt) => (
                  <div
                    key={opt.animalId}
                    className="flex items-center space-x-3 border border-border p-4 rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors"
                  >
                    <RadioGroupItem
                      value={opt.animalId}
                      id={`${currentQuestion.id}-${opt.animalId}`}
                      aria-label={opt.label}
                    />
                    <Label
                      htmlFor={`${currentQuestion.id}-${opt.animalId}`}
                      className="flex-1 text-base font-normal cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex items-center justify-between mt-10 gap-4">
                <Button
                  variant="ghost"
                  className="rounded-none uppercase tracking-widest text-xs"
                  onClick={handleBack}
                  onKeyDown={(e) => e.key === "Enter" && handleBack()}
                  aria-label="Previous question"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  size="lg"
                  className="rounded-none uppercase tracking-[0.3em] font-bold text-xs px-10 py-6"
                  onClick={handleNext}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  disabled={!canProceed}
                  aria-label="Next question"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {isResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl mx-auto text-center"
            >
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
                Your spirit animal
              </span>
              <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tighter mb-4">
                {recommendedAnimal.name}
              </h2>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold mb-2">
                {recommendedAnimal.tagline} · Supports {recommendedAnimal.cause}
              </p>
              <div className="aspect-square max-w-xs mx-auto mb-8 rounded-lg overflow-hidden bg-muted">
                <img
                  src={recommendedAnimal.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-10">
                {recommendedAnimal.description}
              </p>
              <Button
                size="lg"
                className="rounded-none uppercase tracking-[0.3em] font-bold text-xs px-10 py-6"
                onClick={handleComplete}
                onKeyDown={(e) => e.key === "Enter" && handleComplete()}
                aria-label="See my bracelet and enter site"
              >
                See my bracelet
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
