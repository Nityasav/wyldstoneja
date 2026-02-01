import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Problem from "@/pages/problem";
import Solution from "@/pages/solution";
import Impact from "@/pages/impact";
import Team from "@/pages/team";
import Onboarding from "@/pages/onboarding";

const ONBOARDING_STORAGE_KEY = "wyldstone_onboarding_complete";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/problem" component={Problem} />
      <Route path="/solution" component={Solution} />
      <Route path="/impact" component={Impact} />
      <Route path="/team" component={Team} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [onboardingComplete, setOnboardingComplete] = useState(() =>
    typeof window !== "undefined" &&
    !!window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
  );

  const showOnboarding = location === "/" && !onboardingComplete;

  const handleOnboardingComplete = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    }
    setOnboardingComplete(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {showOnboarding ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Router />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
