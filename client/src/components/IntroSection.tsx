import { Card } from "@/components/ui/card";

export default function IntroSection() {
  return (
    <section className="mb-10">
      <Card className="overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-1 p-8">
            <h2 className="text-2xl font-bold mb-4">Plan Your Week, Get Your Grocery List</h2>
            <p className="text-gray-600 mb-6">
              Fill in your lunch and dinner plans for the week, and we'll generate a complete grocery list with all the ingredients you need.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <span className="font-semibold">1</span>
                </div>
                <p className="text-sm">Enter your meals</p>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <span className="font-semibold">2</span>
                </div>
                <p className="text-sm">Generate grocery list</p>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <span className="font-semibold">3</span>
                </div>
                <p className="text-sm">Shop with ease</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 relative">
            <img 
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Organized meal planning setup" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
