import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ShoppingCart, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Meal Prep Made Simple
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan your meals, save time, and eat healthier with our comprehensive
            meal prepping tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Recipe Collection</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Browse and save your favorite recipes in one place.
              </p>
              <Link href="/recipes">
                <Button>View Recipes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Meal Planner</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Plan your meals for the week with our easy-to-use calendar.
              </p>
              <Link href="/planner">
                <Button>Start Planning</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Shopping List</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Generate shopping lists based on your meal plan.
              </p>
              <Link href="/shopping-list">
                <Button>View List</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Meal Prep?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-muted-foreground">
                Spend less time cooking during the week by preparing meals in
                advance.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Eat Healthier</h3>
              <p className="text-muted-foreground">
                Make better food choices by planning your meals ahead of time.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
              <p className="text-muted-foreground">
                Buy only what you need and use all your ingredients efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
