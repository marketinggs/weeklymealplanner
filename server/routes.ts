import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mealPlanSchema, groceryListSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate grocery list from meal plan
  app.post("/api/generate-grocery-list", async (req: Request, res: Response) => {
    try {
      // Validate the incoming meal plan
      const validationResult = mealPlanSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const mealPlan = validationResult.data;
      
      // Count number of non-empty meals
      let mealCount = 0;
      Object.keys(mealPlan).forEach(day => {
        const dayData = mealPlan[day as keyof typeof mealPlan];
        if (dayData.lunch && dayData.lunch.trim()) mealCount++;
        if (dayData.dinner && dayData.dinner.trim()) mealCount++;
      });
      
      if (mealCount === 0) {
        return res.status(400).json({ message: "Please provide at least one meal" });
      }
      
      // Prepare meals for OpenAI API
      const meals: string[] = [];
      Object.keys(mealPlan).forEach(day => {
        const dayData = mealPlan[day as keyof typeof mealPlan];
        if (dayData.lunch && dayData.lunch.trim()) {
          meals.push(`${day.charAt(0).toUpperCase() + day.slice(1)} Lunch: ${dayData.lunch}`);
        }
        if (dayData.dinner && dayData.dinner.trim()) {
          meals.push(`${day.charAt(0).toUpperCase() + day.slice(1)} Dinner: ${dayData.dinner}`);
        }
      });
      
      // Create prompt for OpenAI API
      const prompt = `
        I need to make a grocery list for the following meals for the week:
        ${meals.join("\n")}
        
        Please organize the ingredients into categories like Produce, Meat, Dairy, Pantry, etc.
        
        For each ingredient, include quantities when possible and combine similar ingredients.
        
        Output your response in this JSON format:
        {
          "categories": [
            {
              "name": "Category Name",
              "items": ["Ingredient 1 with quantity", "Ingredient 2 with quantity", ...]
            },
            ...
          ]
        }
      `;
      
      try {
        // Call OpenAI API
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: "You are a helpful assistant that generates grocery lists from meal plans. Always respond with properly formatted JSON." 
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });
        
        // Extract JSON from response
        const responseContent = response.choices[0].message.content;
        
        if (!responseContent) {
          return res.status(500).json({ message: "Empty response from OpenAI API" });
        }
        
        try {
          // Parse the JSON response
          const groceryListData = JSON.parse(responseContent);
          
          // Validate the grocery list format
          const validationResult = groceryListSchema.safeParse(groceryListData);
          
          if (!validationResult.success) {
            console.error("Invalid grocery list format:", groceryListData);
            return res.status(500).json({ message: "Invalid grocery list format received" });
          }
          
          // Save the meal plan and grocery list (optional)
          await storage.saveMealPlanWithGroceryList(mealPlan, groceryListData);
          
          // Return the grocery list
          return res.status(200).json(groceryListData);
          
        } catch (error) {
          console.error("Error parsing OpenAI response:", error);
          return res.status(500).json({ message: "Failed to parse grocery list from response" });
        }
      } catch (error) {
        console.error("OpenAI API error:", error);
        return res.status(500).json({ message: "Failed to generate grocery list from OpenAI API" });
      }
    } catch (error) {
      console.error("Generate grocery list error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
