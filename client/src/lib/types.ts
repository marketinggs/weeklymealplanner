export interface DayMeals {
  lunch: string;
  dinner: string;
}

export interface MealPlan {
  monday: DayMeals;
  tuesday: DayMeals;
  wednesday: DayMeals;
  thursday: DayMeals;
  friday: DayMeals;
  saturday: DayMeals;
  sunday: DayMeals;
  numberOfPeople?: number;
}

export interface GroceryCategory {
  name: string;
  items: string[];
}

export interface GroceryListResponse {
  categories: GroceryCategory[];
}
