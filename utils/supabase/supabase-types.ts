export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			exercise: {
				Row: {
					description: string | null;
					id: string;
					name: string | null;
				};
				Insert: {
					description?: string | null;
					id: string;
					name?: string | null;
				};
				Update: {
					description?: string | null;
					id?: string;
					name?: string | null;
				};
				Relationships: [];
			};
			food: {
				Row: {
					carbohydrates: number | null;
					created_at: string;
					energy: number | null;
					fat: number | null;
					fibre: number | null;
					id: string;
					name: string;
					protein: number | null;
					salt: number | null;
					sugar: number | null;
					user_id: string;
				};
				Insert: {
					carbohydrates?: number | null;
					created_at?: string;
					energy?: number | null;
					fat?: number | null;
					fibre?: number | null;
					id?: string;
					name: string;
					protein?: number | null;
					salt?: number | null;
					sugar?: number | null;
					user_id?: string;
				};
				Update: {
					carbohydrates?: number | null;
					created_at?: string;
					energy?: number | null;
					fat?: number | null;
					fibre?: number | null;
					id?: string;
					name?: string;
					protein?: number | null;
					salt?: number | null;
					sugar?: number | null;
					user_id?: string;
				};
				Relationships: [];
			};
			ingredient: {
				Row: {
					amount: number | null;
					created_at: string;
					food_id: string | null;
					id: string;
					recipe_id: string;
					unit: string | null;
				};
				Insert: {
					amount?: number | null;
					created_at?: string;
					food_id?: string | null;
					id?: string;
					recipe_id: string;
					unit?: string | null;
				};
				Update: {
					amount?: number | null;
					created_at?: string;
					food_id?: string | null;
					id?: string;
					recipe_id?: string;
					unit?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "ingredient_food_id_fkey";
						columns: ["food_id"];
						isOneToOne: false;
						referencedRelation: "product";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "ingredient_recipe_id_fkey";
						columns: ["recipe_id"];
						isOneToOne: false;
						referencedRelation: "recipe";
						referencedColumns: ["id"];
					},
				];
			};
			journal_day: {
				Row: {
					created_at: string;
					energy: number;
					id: string;
					journal_date: string;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					energy?: number;
					id?: string;
					journal_date?: string;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					energy?: number;
					id?: string;
					journal_date?: string;
					user_id?: string | null;
				};
				Relationships: [];
			};
			journal_entry: {
				Row: {
					amount: number;
					created_at: string;
					day_id: string | null;
					food_id: string;
					id: string;
					meal_time: Database["public"]["Enums"]["MealTime"];
					time: string | null;
					unit_id: string;
				};
				Insert: {
					amount: number;
					created_at?: string;
					day_id?: string | null;
					food_id: string;
					id?: string;
					meal_time?: Database["public"]["Enums"]["MealTime"];
					time?: string | null;
					unit_id: string;
				};
				Update: {
					amount?: number;
					created_at?: string;
					day_id?: string | null;
					food_id?: string;
					id?: string;
					meal_time?: Database["public"]["Enums"]["MealTime"];
					time?: string | null;
					unit_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "journal_entry_unit_id_fkey";
						columns: ["unit_id"];
						isOneToOne: false;
						referencedRelation: "unit";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "public_journal_entry_day_id_fkey";
						columns: ["day_id"];
						isOneToOne: false;
						referencedRelation: "journal_day";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "public_journal_entry_food_id_fkey";
						columns: ["food_id"];
						isOneToOne: false;
						referencedRelation: "food";
						referencedColumns: ["id"];
					},
				];
			};
			journal_note: {
				Row: {
					created_at: string;
					day_id: string;
					id: string;
					text: string;
					time: string;
				};
				Insert: {
					created_at?: string;
					day_id?: string;
					id?: string;
					text: string;
					time?: string;
				};
				Update: {
					created_at?: string;
					day_id?: string;
					id?: string;
					text?: string;
					time?: string;
				};
				Relationships: [
					{
						foreignKeyName: "journal_note_day_id_fkey";
						columns: ["day_id"];
						isOneToOne: false;
						referencedRelation: "journal_day";
						referencedColumns: ["id"];
					},
				];
			};
			meal: {
				Row: {
					created_at: string;
					date: string;
					id: string;
					meal: string;
					meal_type: string;
					recipe_id: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					date: string;
					id?: string;
					meal: string;
					meal_type: string;
					recipe_id?: string | null;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					date?: string;
					id?: string;
					meal?: string;
					meal_type?: string;
					recipe_id?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "meal_plan_recipe_id_fkey";
						columns: ["recipe_id"];
						isOneToOne: false;
						referencedRelation: "recipe";
						referencedColumns: ["id"];
					},
				];
			};
			meal_entry: {
				Row: {
					amount: number;
					created_at: string;
					food_id: string;
					id: string;
					meal_id: string;
					unit_id: string;
				};
				Insert: {
					amount: number;
					created_at?: string;
					food_id: string;
					id?: string;
					meal_id: string;
					unit_id: string;
				};
				Update: {
					amount?: number;
					created_at?: string;
					food_id?: string;
					id?: string;
					meal_id?: string;
					unit_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "meal_entry_food_id_fkey";
						columns: ["food_id"];
						isOneToOne: false;
						referencedRelation: "food";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "meal_entry_meal_id_fkey";
						columns: ["meal_id"];
						isOneToOne: false;
						referencedRelation: "meals";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "meal_entry_unit_id_fkey";
						columns: ["unit_id"];
						isOneToOne: false;
						referencedRelation: "unit";
						referencedColumns: ["id"];
					},
				];
			};
			meals: {
				Row: {
					consumed_at: string;
					day_id: string;
					id: string;
					name: string;
				};
				Insert: {
					consumed_at?: string;
					day_id: string;
					id?: string;
					name: string;
				};
				Update: {
					consumed_at?: string;
					day_id?: string;
					id?: string;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: "meals_day_id_fkey";
						columns: ["day_id"];
						isOneToOne: false;
						referencedRelation: "journal_day";
						referencedColumns: ["id"];
					},
				];
			};
			product: {
				Row: {
					created_at: string;
					id: string;
					name: string;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					id?: string;
					name: string;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					user_id?: string | null;
				};
				Relationships: [];
			};
			recipe: {
				Row: {
					description: string | null;
					id: string;
					name: string;
					portions: number | null;
					source: string | null;
					time: number | null;
					user_id: string;
				};
				Insert: {
					description?: string | null;
					id?: string;
					name: string;
					portions?: number | null;
					source?: string | null;
					time?: number | null;
					user_id?: string;
				};
				Update: {
					description?: string | null;
					id?: string;
					name?: string;
					portions?: number | null;
					source?: string | null;
					time?: number | null;
					user_id?: string;
				};
				Relationships: [];
			};
			recipe_step: {
				Row: {
					id: string;
					recipe_id: string | null;
					step_number: number;
					text: string;
				};
				Insert: {
					id?: string;
					recipe_id?: string | null;
					step_number: number;
					text: string;
				};
				Update: {
					id?: string;
					recipe_id?: string | null;
					step_number?: number;
					text?: string;
				};
				Relationships: [
					{
						foreignKeyName: "instruction_steps_recipe_id_fkey";
						columns: ["recipe_id"];
						isOneToOne: false;
						referencedRelation: "recipe";
						referencedColumns: ["id"];
					},
				];
			};
			shopping_list: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					name: string;
					owner_id: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name: string;
					owner_id?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name?: string;
					owner_id?: string;
				};
				Relationships: [];
			};
			shopping_list_category: {
				Row: {
					created_at: string;
					id: number;
					name: string;
					position: number;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
					position: number;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
					position?: number;
				};
				Relationships: [];
			};
			shopping_list_item: {
				Row: {
					created_at: string;
					id: string;
					product_id: string;
					shopping_list_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					product_id: string;
					shopping_list_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					product_id?: string;
					shopping_list_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "shopping_list_entry_shopping_list_id_fkey";
						columns: ["shopping_list_id"];
						isOneToOne: false;
						referencedRelation: "shopping_list";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "shopping_list_item_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "product";
						referencedColumns: ["id"];
					},
				];
			};
			unit: {
				Row: {
					created_at: string;
					food_id: string | null;
					grams: number;
					id: string;
					measurement: Database["public"]["Enums"]["measurement"] | null;
					name: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					food_id?: string | null;
					grams?: number;
					id?: string;
					measurement?: Database["public"]["Enums"]["measurement"] | null;
					name: string;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					food_id?: string | null;
					grams?: number;
					id?: string;
					measurement?: Database["public"]["Enums"]["measurement"] | null;
					name?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "unit_food_id_fkey";
						columns: ["food_id"];
						isOneToOne: false;
						referencedRelation: "food";
						referencedColumns: ["id"];
					},
				];
			};
			warmup: {
				Row: {
					description: string | null;
					duration: number | null;
					id: string;
					session_id: string | null;
				};
				Insert: {
					description?: string | null;
					duration?: number | null;
					id: string;
					session_id?: string | null;
				};
				Update: {
					description?: string | null;
					duration?: number | null;
					id?: string;
					session_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "warmup_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "workoutsession";
						referencedColumns: ["id"];
					},
				];
			};
			workoutsession: {
				Row: {
					date: string | null;
					description: string | null;
					id: string;
				};
				Insert: {
					date?: string | null;
					description?: string | null;
					id?: string;
				};
				Update: {
					date?: string | null;
					description?: string | null;
					id?: string;
				};
				Relationships: [];
			};
			workoutsessionexercise: {
				Row: {
					created_at: string;
					exercise_id: string | null;
					id: string;
					repetitions: number | null;
					sequence: number | null;
					session_id: string | null;
					weight: number | null;
				};
				Insert: {
					created_at?: string;
					exercise_id?: string | null;
					id?: string;
					repetitions?: number | null;
					sequence?: number | null;
					session_id?: string | null;
					weight?: number | null;
				};
				Update: {
					created_at?: string;
					exercise_id?: string | null;
					id?: string;
					repetitions?: number | null;
					sequence?: number | null;
					session_id?: string | null;
					weight?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "workoutsessionexercise_exercise_id_fkey";
						columns: ["exercise_id"];
						isOneToOne: false;
						referencedRelation: "exercise";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "workoutsessionexercise_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "workoutsession";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			fetch_or_create_journal_day: {
				Args: {
					p_journal_date: string;
					p_energy_value: number;
				};
				Returns: {
					id: string;
					entry_date: string;
					energy: number;
				}[];
			};
		};
		Enums: {
			MealTime: "breakfast" | "lunch" | "dinner" | "snack";
			measurement: "mass" | "volume";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;
