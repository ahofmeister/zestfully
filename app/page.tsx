import { Calendar, CheckCircle, ChefHat, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
	return (
		<main className="">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold tracking-tight mb-4">Zestfully</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Start here, every day
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader className="text-center">
							<CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
							<CardTitle>Habit Tracking</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<p className="text-muted-foreground mb-4">
								Build better habits and track your daily progress.
							</p>
							<Link href="/habits">
								<Button>Track Habits</Button>
							</Link>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow relative">
						<Badge className="absolute top-4 right-4" variant="secondary">
							Soon
						</Badge>
						<CardHeader className="text-center">
							<ChefHat className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
							<CardTitle className="text-muted-foreground">
								Recipe Collection
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<p className="text-muted-foreground mb-4">
								Browse and save your favorite recipes in one place.
							</p>
							<Button disabled variant="secondary">
								Coming Soon
							</Button>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow relative">
						<Badge className="absolute top-4 right-4" variant="secondary">
							Soon
						</Badge>
						<CardHeader className="text-center">
							<Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
							<CardTitle className="text-muted-foreground">
								Meal Planner
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<p className="text-muted-foreground mb-4">
								Plan your meals for the week with our easy-to-use calendar.
							</p>
							<Button disabled variant="secondary">
								Coming Soon
							</Button>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow relative">
						<Badge className="absolute top-4 right-4" variant="secondary">
							Soon
						</Badge>
						<CardHeader className="text-center">
							<ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
							<CardTitle className="text-muted-foreground">
								Shopping List
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<p className="text-muted-foreground mb-4">
								Generate shopping lists based on your meal plan.
							</p>
							<Button disabled variant="secondary">
								Coming Soon
							</Button>
						</CardContent>
					</Card>
				</div>

				<div className="mt-20 text-center">
					<h2 className="text-3xl font-bold mb-8">Why Zestfully?</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div>
							<h3 className="text-xl font-semibold mb-2">
								Build Better Habits
							</h3>
							<p className="text-muted-foreground">
								Track your daily routines and create lasting positive changes in
								your life.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">Stay Organized</h3>
							<p className="text-muted-foreground">
								Keep all aspects of your daily life in one convenient place.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">Make Progress</h3>
							<p className="text-muted-foreground">
								See your growth over time and stay motivated to reach your
								goals.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
