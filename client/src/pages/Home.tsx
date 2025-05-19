import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MealPlan, GroceryListResponse } from "@/lib/types";
import MealPlanForm from "@/components/MealPlanForm";
import GroceryList from "@/components/GroceryList";
import IntroSection from "@/components/IntroSection";
import { ClipboardList } from "lucide-react";

export default function Home() {
  const [groceryList, setGroceryList] = useState<GroceryListResponse | null>(null);
  const { toast } = useToast();
  
  const generateGroceryList = useMutation({
    mutationFn: async (mealPlan: MealPlan) => {
      const response = await apiRequest("POST", "/api/generate-grocery-list", mealPlan);
      return response.json();
    },
    onSuccess: (data: GroceryListResponse) => {
      setGroceryList(data);
      toast({
        title: "Success!",
        description: "Your grocery list has been generated.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate grocery list. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg text-white">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">Weekly Meal Planner</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <IntroSection />
        
        <MealPlanForm 
          onSubmit={(mealPlan) => generateGroceryList.mutate(mealPlan)}
          isLoading={generateGroceryList.isPending}
        />
        
        {(groceryList || generateGroceryList.isPending) && (
          <GroceryList 
            groceryList={groceryList}
            isLoading={generateGroceryList.isPending}
          />
        )}
      </main>
      
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-primary rounded text-white">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="font-semibold">Weekly Meal Planner</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-sm text-gray-400">
                Powered by OpenAI. Create your perfect grocery list with AI assistance.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
