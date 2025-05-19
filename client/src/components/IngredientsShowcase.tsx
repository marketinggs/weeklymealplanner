import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function IngredientsShowcase() {
  return (
    <section className="mb-12">
      <Card className="overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-4">Fresh Ingredients for Tasty Meals</h2>
            <p className="text-gray-600 mb-6">
              Our AI-powered grocery list helps you plan efficiently, reduce food waste, and create delicious meals all week long.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Reduce Waste</h3>
                  <p className="mt-1 text-sm text-gray-500">Buy exactly what you need for your planned meals.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Save Time</h3>
                  <p className="mt-1 text-sm text-gray-500">Shop efficiently with an organized list.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Eat Better</h3>
                  <p className="mt-1 text-sm text-gray-500">Plan diverse, nutritious meals ahead of time.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Save Money</h3>
                  <p className="mt-1 text-sm text-gray-500">Avoid impulse purchases with a prepared list.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 gap-2">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Fresh vegetables and ingredients" 
              className="w-full h-full object-cover"
            />
            
            <img 
              src="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Fresh fruits in market display" 
              className="w-full h-full object-cover"
            />
            
            <img 
              src="https://images.unsplash.com/photo-1615485291234-9d694218aeb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Assortment of cooking spices" 
              className="w-full h-full object-cover"
            />
            
            <img 
              src="https://images.unsplash.com/photo-1604881991720-f91add269bed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Person meal planning with notebook" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
