"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Point. Snap. Decide.
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Take a photo of any dish or menu item and instantly get cuisine type,
          flavor profile, key ingredients, and a health indicator.
        </p>
      </div>

      <Button
        size="lg"
        className="text-lg px-8 py-6 rounded-full"
        onClick={() => router.push("/analyze")}
      >
        📸 Scan a Dish
      </Button>

      <div className="grid grid-cols-3 gap-6 text-sm text-muted-foreground mt-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span>Identify cuisine</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">🌶️</span>
          <span>Flavor profile</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">💚</span>
          <span>Health score</span>
        </div>
      </div>
    </div>
  );
}
