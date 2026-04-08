"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, UtensilsCrossed } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { FoodEntry } from "@/lib/food-data";

function FoodBubble({
  food,
  onSelect,
}: {
  food: FoodEntry;
  onSelect: (food: FoodEntry) => void;
}) {
  return (
    <Card
      className="aspect-square cursor-pointer overflow-hidden rounded-3xl border-0 p-0 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={() => onSelect(food)}
    >
      <Image
        src={food.coverImage}
        alt={food.name}
        width={480}
        height={480}
        className="h-full w-full object-cover"
      />
    </Card>
  );
}

function FoodBubbleGrid({
  foods,
  onSelect,
}: {
  foods: FoodEntry[];
  onSelect: (food: FoodEntry) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {foods.map((food) => (
        <FoodBubble key={food.id} food={food} onSelect={onSelect} />
      ))}
    </div>
  );
}

function FoodTabContent({
  country,
  foods,
  onSelect,
}: {
  country: string;
  foods: FoodEntry[];
  onSelect: (food: FoodEntry) => void;
}) {
  return (
    <TabsContent value={country} className="mt-6">
      <FoodBubbleGrid foods={foods} onSelect={onSelect} />
    </TabsContent>
  );
}

function FoodTabs({
  countries,
  foodsByCountry,
  onSelect,
  value,
  onValueChange,
}: {
  countries: string[];
  foodsByCountry: Record<string, FoodEntry[]>;
  onSelect: (food: FoodEntry) => void;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        {countries.map((country) => (
          <TabsTrigger key={country} value={country}>
            {country}
          </TabsTrigger>
        ))}
      </TabsList>
      {countries.map((country) => (
        <FoodTabContent
          key={country}
          country={country}
          foods={foodsByCountry[country]}
          onSelect={onSelect}
        />
      ))}
    </Tabs>
  );
}

function FoodModalImage({ food }: { food: FoodEntry }) {
  return (
    <div className="aspect-[4/3] w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-full sm:w-56 sm:aspect-auto">
      <Image
        src={food.coverImage}
        alt={food.name}
        width={400}
        height={300}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function FoodModalHeader({ food }: { food: FoodEntry }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-xl font-bold text-foreground">{food.name}</h2>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{food.nameEn}</p>
        <Badge>{food.country}</Badge>
      </div>
    </div>
  );
}

function FoodModalIngredients({ ingredients }: { ingredients: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-sm font-medium text-foreground">Ingredients</h3>
      <ul className="ml-4 list-disc space-y-0.5 text-sm text-muted-foreground">
        {ingredients.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function FoodModalRestaurants({
  restaurants,
}: {
  restaurants: FoodEntry["restaurants"];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <UtensilsCrossed className="size-4" />
        Recommended Restaurants
      </h3>
      <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
        {restaurants.map((r) => (
          <li key={r.name} className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 size-3.5 flex-shrink-0" />
            <span>
              <span className="text-foreground">{r.name}</span> — {r.location}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FoodModal({ food }: { food: FoodEntry }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row">
      <FoodModalImage food={food} />
      <div className="flex flex-1 flex-col gap-4">
        <FoodModalHeader food={food} />
        <FoodModalIngredients ingredients={food.ingredients} />
        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
          {food.description}
        </p>
        <FoodModalRestaurants restaurants={food.restaurants} />
      </div>
    </div>
  );
}

export default function FoodGallery({ foods }: { foods: FoodEntry[] }) {
  const [selectedFood, setSelectedFood] = useState<FoodEntry | null>(null);
  const isOpen = selectedFood !== null;

  const countries = Array.from(new Set(foods.map((f) => f.country))).sort();
  const [activeTab, setActiveTab] = useState(countries[0]);
  const foodsByCountry = countries.reduce<Record<string, FoodEntry[]>>(
    (acc, country) => {
      acc[country] = foods.filter((f) => f.country === country);
      return acc;
    },
    {}
  );

  return (
    <>
      <FoodTabs
        countries={countries}
        foodsByCountry={foodsByCountry}
        onSelect={setSelectedFood}
        value={activeTab}
        onValueChange={setActiveTab}
      />

      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && setSelectedFood(null)}
      >
        <DialogContent className="sm:max-w-2xl sm:rounded-2xl">
          <DialogTitle className="sr-only">
            {selectedFood?.name ?? "Food details"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Food details and description
          </DialogDescription>
          {selectedFood && <FoodModal food={selectedFood} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
