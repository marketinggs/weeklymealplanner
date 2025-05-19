import { mealPlans, MealPlan, GroceryList } from "@shared/schema";

export interface IStorage {
  saveMealPlanWithGroceryList(mealPlan: MealPlan, groceryList: GroceryList): Promise<void>;
  getMealPlanWithGroceryList(id: number): Promise<any | undefined>;
}

export class MemStorage implements IStorage {
  private mealPlansData: Map<number, any>;
  private currentId: number;

  constructor() {
    this.mealPlansData = new Map();
    this.currentId = 1;
  }

  async saveMealPlanWithGroceryList(mealPlan: MealPlan, groceryList: GroceryList): Promise<void> {
    const id = this.currentId++;
    
    const mealPlanRecord = {
      id,
      monday_lunch: mealPlan.monday.lunch || "",
      monday_dinner: mealPlan.monday.dinner || "",
      tuesday_lunch: mealPlan.tuesday.lunch || "",
      tuesday_dinner: mealPlan.tuesday.dinner || "",
      wednesday_lunch: mealPlan.wednesday.lunch || "",
      wednesday_dinner: mealPlan.wednesday.dinner || "",
      thursday_lunch: mealPlan.thursday.lunch || "",
      thursday_dinner: mealPlan.thursday.dinner || "",
      friday_lunch: mealPlan.friday.lunch || "",
      friday_dinner: mealPlan.friday.dinner || "",
      saturday_lunch: mealPlan.saturday.lunch || "",
      saturday_dinner: mealPlan.saturday.dinner || "",
      sunday_lunch: mealPlan.sunday.lunch || "",
      sunday_dinner: mealPlan.sunday.dinner || "",
      grocery_list: groceryList
    };
    
    this.mealPlansData.set(id, mealPlanRecord);
  }

  async getMealPlanWithGroceryList(id: number): Promise<any | undefined> {
    return this.mealPlansData.get(id);
  }
}

// Use in-memory storage
export const storage = new MemStorage();
