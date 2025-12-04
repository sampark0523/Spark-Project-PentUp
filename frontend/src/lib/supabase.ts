import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient {
	if (browserClient) return browserClient;
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	console.log("Supabase URL:", url);
	console.log("Anon Key (first 20 chars):", anonKey?.substring(0, 20) + "...");

	if (!url || !anonKey) {
		throw new Error(
			"Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment."
		);
	}
	browserClient = createClient(url, anonKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
		},
	});
	return browserClient;
}

export function createServerClient(): SupabaseClient {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceKey =
		process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !serviceKey) {
		throw new Error("Supabase environment variables are not configured.");
	}
	return createClient(url, serviceKey);
}

export type MessageRow = {
	id: number;
	recipients: string;
	body: string;
	color: string;
	created_at: string;
};
