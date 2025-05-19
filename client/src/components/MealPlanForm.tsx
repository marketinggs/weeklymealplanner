import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { MealPlan, DayMeals } from "@/lib/types";
import { sampleData } from "@/lib/sampleData";

interface MealPlanFormProps {
  onSubmit: (mealPlan: MealPlan) => void;
  isLoading: boolean;
}

const weekdays = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

export default function MealPlanForm({ onSubmit, isLoading }: MealPlanFormProps) {
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [filledInputs, setFilledInputs] = useState(0);
  const totalInputs = 14;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MealPlan>({
    defaultValues: {
      monday: { lunch: "", dinner: "" },
      tuesday: { lunch: "", dinner: "" },
      wednesday: { lunch: "", dinner: "" },
      thursday: { lunch: "", dinner: "" },
      friday: { lunch: "", dinner: "" },
      saturday: { lunch: "", dinner: "" },
      sunday: { lunch: "", dinner: "" },
    }
  });

  const formValues = watch();

  useEffect(() => {
    // Count filled inputs
    let filled = 0;
    weekdays.forEach(day => {
      if (formValues[day as keyof MealPlan]?.lunch?.trim()) filled++;
      if (formValues[day as keyof MealPlan]?.dinner?.trim()) filled++;
    });
    setFilledInputs(filled);
  }, [formValues]);

  const handleFillSampleData = () => {
    weekdays.forEach(day => {
      setValue(`${day}.lunch` as any, sampleData[day as keyof typeof sampleData].lunch);
      setValue(`${day}.dinner` as any, sampleData[day as keyof typeof sampleData].dinner);
    });
    
    setNotification({
      message: "Sample data loaded successfully",
      type: "success"
    });
    
    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const processForm = (data: MealPlan) => {
    if (filledInputs === 0) {
      setNotification({
        message: "Please fill in at least one meal before generating a grocery list",
        type: "error"
      });
      return;
    }
    
    onSubmit(data);
  };
  
  return (
    <section id="meal-planner-form" className="mb-12">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Your Weekly Meal Plan</h2>
          
          <form onSubmit={handleSubmit(processForm)} className="space-y-8">
            {notification && (
              <Alert variant={notification.type === "error" ? "destructive" : "default"}>
                <AlertDescription>
                  {notification.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {weekdays.map((day) => (
                <div key={day} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="font-medium text-lg mb-4 text-center capitalize">{day}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`${day}-lunch`} className="block text-sm font-medium text-gray-700 mb-1">
                        Lunch
                      </Label>
                      <Input
                        id={`${day}-lunch`}
                        placeholder={`e.g., ${day === "monday" ? "Grilled Chicken Salad" : day === "tuesday" ? "Turkey Sandwich" : "Quinoa Bowl"}`}
                        {...register(`${day}.lunch` as any)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`${day}-dinner`} className="block text-sm font-medium text-gray-700 mb-1">
                        Dinner
                      </Label>
                      <Input
                        id={`${day}-dinner`}
                        placeholder={`e.g., ${day === "monday" ? "Pasta Primavera" : day === "tuesday" ? "Beef Stir Fry" : "Salmon with Vegetables"}`}
                        {...register(`${day}.dinner` as any)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={handleFillSampleData}
                    className="text-amber-500 hover:text-amber-600"
                  >
                    Fill with sample data
                  </Button>
                </div>
                
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={filledInputs === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Get My Grocery List"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
