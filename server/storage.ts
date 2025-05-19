import { mealPlans, MealPlan, GroceryList } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  saveMealPlanWithGroceryList(mealPlan: MealPlan, groceryList: GroceryList): Promise<void>;
  getMealPlanWithGroceryList(id: number): Promise<any | undefined>;
}

export class DatabaseStorage implements IStorage {
  async saveMealPlanWithGroceryList(mealPlan: MealPlan, groceryList: GroceryList): Promise<void> {    
    const mealPlanRecord = {
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
    
    await db.insert(mealPlans).values(mealPlanRecord);
  }

  async getMealPlanWithGroceryList(id: number): Promise<any | undefined> {
    const [record] = await db.select().from(mealPlans).where(eq(mealPlans.id, id));
    return record;
  }
}

// Keep MemStorage for backward compatibility
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

// Switch to database storage
export const storage = new DatabaseStorage();
