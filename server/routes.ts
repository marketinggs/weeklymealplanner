import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import { mealPlanSchema, groceryListSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDebKfjD2imDtKnPl52VbCVS_auT_FwTDM';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

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
      
      // Prepare meals for Gemini API
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
      
      // Create prompt for Gemini API
      const prompt = `
        I need to make a grocery list for the following meals for the week:
        ${meals.join("\n")}
        
        Please organize the ingredients into categories like Produce, Meat, Dairy, Pantry, etc.
        
        For each ingredient, include quantities when possible and combine similar ingredients.
        
        Format the response as a JSON object with this structure:
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
      
      // Call Gemini API
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API error:", errorData);
        return res.status(500).json({ message: "Failed to generate grocery list from Gemini API" });
      }
      
      const data = await response.json() as any;
      
      // Extract text from response
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        return res.status(500).json({ message: "Empty response from Gemini API" });
      }
      
      // Extract JSON from response text
      let jsonMatch;
      try {
        // Look for JSON object in the response
        jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
          return res.status(500).json({ message: "Could not extract grocery list from response" });
        }
        
        const groceryListData = JSON.parse(jsonMatch[0]);
        
        // Validate the grocery list format
        const validationResult = groceryListSchema.safeParse(groceryListData);
        
        if (!validationResult.success) {
          return res.status(500).json({ message: "Invalid grocery list format received" });
        }
        
        // Save the meal plan and grocery list (optional)
        await storage.saveMealPlanWithGroceryList(mealPlan, groceryListData);
        
        // Return the grocery list
        return res.status(200).json(groceryListData);
      } catch (error) {
        console.error("Error parsing Gemini response:", error);
        return res.status(500).json({ message: "Failed to parse grocery list from response" });
      }
    } catch (error) {
      console.error("Generate grocery list error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
