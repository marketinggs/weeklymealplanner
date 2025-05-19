import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  monday_lunch: text("monday_lunch"),
  monday_dinner: text("monday_dinner"),
  tuesday_lunch: text("tuesday_lunch"),
  tuesday_dinner: text("tuesday_dinner"),
  wednesday_lunch: text("wednesday_lunch"),
  wednesday_dinner: text("wednesday_dinner"),
  thursday_lunch: text("thursday_lunch"),
  thursday_dinner: text("thursday_dinner"),
  friday_lunch: text("friday_lunch"),
  friday_dinner: text("friday_dinner"),
  saturday_lunch: text("saturday_lunch"),
  saturday_dinner: text("saturday_dinner"),
  sunday_lunch: text("sunday_lunch"),
  sunday_dinner: text("sunday_dinner"),
  grocery_list: jsonb("grocery_list")
});

export const mealPlanSchema = z.object({
  monday: z.object({
    lunch: z.string().optional(),
    dinner: z.string().optional(),
  }),
  tuesday: z.object({
    lunch: z.string().optional(),
    dinner: z.string().optional(),
  }),
  wednesday: z.object({
    lunch: z.string().optional(),
    dinner: z.string().optional(),
  }),
  thursday: z.object({
    lunch: z.string().optional(),
    dinner: z.string().optional(),
  }),
  friday: z.object({
    lunch: z.string().optional(),
    dinner: z.string().optional(),
  }),
  saturday: z.object({
    lunch: z.string().optional(),
    dinner: z.string().optional(),
  }),
  sunday: z.object({
    lunch: z.string().optional(),
    dinner: z.string().optional(),
  })
});

export const groceryListSchema = z.object({
  categories: z.array(z.object({
    name: z.string(),
    items: z.array(z.string())
  }))
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({ 
  id: true,
  grocery_list: true 
});

export type MealPlan = z.infer<typeof mealPlanSchema>;
export type GroceryList = z.infer<typeof groceryListSchema>;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlanRecord = typeof mealPlans.$inferSelect;
