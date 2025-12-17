import {
	drizzle,
	type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "server-only";

import {
	type DrizzleConfig,
	type ExtractTablesWithRelations,
	sql,
} from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { type JwtPayload, jwtDecode } from "jwt-decode";
import * as schema from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";

const config = {
	casing: "snake_case",
	schema,
} satisfies DrizzleConfig<typeof schema>;

declare namespace global {
	let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient: ReturnType<typeof postgres>;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is not set");
}

if (process.env.NODE_ENV !== "production") {
	if (!global.postgresSqlClient) {
		global.postgresSqlClient = postgres(databaseUrl, { prepare: false });
	}
	postgresSqlClient = global.postgresSqlClient;
} else {
	postgresSqlClient = postgres(databaseUrl, { prepare: false });
}

export const db = drizzle({
	client: postgresSqlClient,
	...config,
	logger: false,
});

export async function rlsDb() {
	const client = await createClient();
	const { data } = await client.auth.getSession();
	const accessToken = data.session?.access_token ?? "";
	const token = decode(accessToken);

	const runTransaction = ((transaction, config) => {
		return db.transaction(async (tx) => {
			try {
				await tx.execute(sql`
					select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(token))}', TRUE);
					select set_config('request.jwt.claim.sub', '${sql.raw(token.sub ?? "")}', TRUE);
					set local role ${sql.raw(token.role ?? "anon")};
				`);

				const result = await transaction(tx);

				await tx.execute(sql`
					select set_config('request.jwt.claims', NULL, TRUE);
					select set_config('request.jwt.claim.sub', NULL, TRUE);
					reset role;
				`);

				return result;
			} catch (error) {
				console.error("Transaction failed:", {
					error,
					message: error instanceof Error ? error.message : "Unknown error",
					stack: error instanceof Error ? error.stack : undefined,
					userId: token.sub,
					role: token.role,
				});
				throw error;
			}
		}, config);
	}) as typeof db.transaction;

	return {
		runTransaction,
	};
}

function decode(accessToken: string) {
	try {
		return jwtDecode<JwtPayload & { role: string }>(accessToken);
	} catch {
		return { role: "anon" } as JwtPayload & { role: string };
	}
}

export async function dbTransaction<T>(
	fn: (
		tx: PgTransaction<
			PostgresJsQueryResultHKT,
			typeof schema,
			ExtractTablesWithRelations<typeof schema>
		>,
	) => Promise<T>,
): Promise<T> {
	const client = await rlsDb();
	return client.runTransaction(fn);
}
