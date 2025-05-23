import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Printer, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GroceryListResponse } from "@/lib/types";
import ShoppingTips from "./ShoppingTips";

interface GroceryListProps {
  groceryList: GroceryListResponse | null;
  isLoading: boolean;
}

export default function GroceryList({ groceryList, isLoading }: GroceryListProps) {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (groceryList && !isLoading) {
      setLastUpdated(new Date());
    }
  }, [groceryList, isLoading]);
  
  const handlePrintList = () => {
    window.print();
  };
  
  const handleCopyList = () => {
    if (!groceryList) return;
    
    let copyText = "Your Grocery List\n\n";
    
    groceryList.categories.forEach(category => {
      copyText += `${category.name}:\n`;
      category.items.forEach(item => {
        copyText += `- ${item}\n`;
      });
      copyText += "\n";
    });
    
    navigator.clipboard.writeText(copyText)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Copied!",
          description: "Grocery list copied to clipboard",
          variant: "default",
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Error",
          description: "Failed to copy grocery list",
          variant: "destructive",
        });
      });
  };
  
  // Calculate stats
  const categoryCount = groceryList?.categories.length || 0;
  const ingredientCount = groceryList?.categories.reduce(
    (total, category) => total + category.items.length, 0
  ) || 0;
  
  return (
    <section id="grocery-list-container" className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Grocery List</h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-primary"
                    onClick={handleCopyList}
                    disabled={isLoading || !groceryList}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-5 w-5 mr-1 text-green-500" />
                        <span className="text-sm text-green-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 mr-1" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-primary"
                    onClick={handlePrintList}
                    disabled={isLoading || !groceryList}
                  >
                    <Printer className="h-5 w-5 mr-1" />
                    <span className="text-sm">Print</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="h-10 w-10 text-primary mb-4 animate-spin" />
                    <p>Generating your grocery list...</p>
                  </div>
                ) : groceryList ? (
                  <div className="space-y-6">
                    {groceryList.categories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="category-group">
                        <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          {category.name}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => {
                            const id = `item-${categoryIndex}-${itemIndex}`;
                            return (
                              <li key={id} className="flex items-start">
                                <Checkbox id={id} className="mt-1" />
                                <Label htmlFor={id} className="ml-2 text-gray-700 cursor-pointer">
                                  {item}
                                </Label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <ShoppingTips 
            categoryCount={categoryCount}
            ingredientCount={ingredientCount}
            lastUpdated={lastUpdated}
          />
        </div>
      </div>
    </section>
  );
}
