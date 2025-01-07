import { Database } from "@/utils/supabase/supabase-types";

export type Food = Database["public"]["Tables"]["food"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipe"]["Row"];
export type NewIngredient =
  Database["public"]["Tables"]["ingredient"]["Insert"];
export type NewRecipe = Database["public"]["Tables"]["recipe"]["Insert"] & {
  ingredients: NewIngredient[];
};

export type NewMealPlan = Database["public"]["Tables"]["meal"]["Insert"];
export type MealPlan = Database["public"]["Tables"]["meal"]["Row"];

export type ShoppingList = Database["public"]["Tables"]["shopping_list"]["Row"];
export type ShoppingListItem =
  Database["public"]["Tables"]["shopping_list_item"]["Row"];
export type Product = Database["public"]["Tables"]["product"]["Row"];

export type ShoppingListWithEntriesAndProduct = ShoppingList & {
  entries: ShoppingListItemWithProduct[];
};

export type ShoppingListItemWithProduct = ShoppingListItem & {
  product: Product;
};
