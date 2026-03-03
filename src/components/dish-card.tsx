"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DishAnalysis {
  dishName: string;
  cuisine: string;
  flavorProfile: string[];
  keyIngredients: string[];
  healthScore: number;
  healthLight: "green" | "yellow" | "red";
  healthReason: string;
}

const healthLightColors = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

const healthLightLabels = {
  green: "Healthy",
  yellow: "Moderate",
  red: "Indulgent",
};

export function DishCard({ analysis }: { analysis: DishAnalysis }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{analysis.dishName}</CardTitle>
        <CardDescription>
          <Badge variant="secondary" className="text-sm">
            {analysis.cuisine}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Flavor Profile */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Flavor Profile
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.flavorProfile.map((flavor) => (
              <Badge key={flavor} variant="outline">
                {flavor}
              </Badge>
            ))}
          </div>
        </div>

        {/* Key Ingredients */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Key Ingredients
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keyIngredients.map((ingredient) => (
              <Badge key={ingredient} variant="secondary">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {/* Health Indicator */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div
            className={`w-10 h-10 rounded-full ${healthLightColors[analysis.healthLight]} flex items-center justify-center text-white font-bold text-sm shrink-0`}
          >
            {analysis.healthScore}
          </div>
          <div>
            <p className="font-medium text-sm">
              {healthLightLabels[analysis.healthLight]} —{" "}
              {analysis.healthScore}/10
            </p>
            <p className="text-sm text-muted-foreground">
              {analysis.healthReason}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
