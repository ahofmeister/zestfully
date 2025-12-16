import { resolve } from "node:path";
import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
	dialect: "postgresql",
	schema: "./drizzle/schema.ts",
	out: "./drizzle/migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL,
		ssl: true,
	},
});
