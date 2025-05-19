import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ShoppingTipsProps {
  categoryCount: number;
  ingredientCount: number;
  lastUpdated: Date | null;
}

export default function ShoppingTips({ categoryCount, ingredientCount, lastUpdated }: ShoppingTipsProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Shopping Tips</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <div className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0">
              <Check className="h-full w-full" />
            </div>
            <span>Check your pantry before shopping to avoid duplicates</span>
          </li>
          <li className="flex items-start">
            <div className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0">
              <Check className="h-full w-full" />
            </div>
            <span>Buy produce that's in season for better flavor and value</span>
          </li>
          <li className="flex items-start">
            <div className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0">
              <Check className="h-full w-full" />
            </div>
            <span>Shop the perimeter of the store first for fresh items</span>
          </li>
          <li className="flex items-start">
            <div className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0">
              <Check className="h-full w-full" />
            </div>
            <span>Consider ingredient substitutions if items aren't available</span>
          </li>
        </ul>
        
        <img 
          src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Organized pantry with ingredients" 
          className="w-full h-48 object-cover rounded-lg mt-6 mb-4"
        />
        
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h4 className="font-medium text-gray-900 mb-2">Weekly Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Meals:</p>
              <p className="font-medium">14</p>
            </div>
            <div>
              <p className="text-gray-500">Categories:</p>
              <p className="font-medium">{categoryCount}</p>
            </div>
            <div>
              <p className="text-gray-500">Ingredients:</p>
              <p className="font-medium">{ingredientCount}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated:</p>
              <p className="font-medium">
                {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
