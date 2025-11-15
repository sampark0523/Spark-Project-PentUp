import { NextRequest, NextResponse } from "next/server";
import { createServerClient, getBrowserClient } from "@/lib/supabase";
import { isUPennEmail } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
	const supabase = createServerClient();
	const { data, error } = await supabase
		.from("messages")
		.select("id,recipients,body,color,created_at")
		.order("created_at", { ascending: false });
	if (error) {
		console.error("GET /api/messages error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
	// Verify authentication
	const authHeader = req.headers.get("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return NextResponse.json(
			{ error: "Unauthorized. Please sign in with your UPenn email." },
			{ status: 401 }
		);
	}

	const token = authHeader.replace("Bearer ", "");

	// Verify the token with Supabase
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
	}

	const supabase = createClient(url, anonKey);
	const { data: { user }, error: authError } = await supabase.auth.getUser(token);

	if (authError || !user) {
		return NextResponse.json(
			{ error: "Invalid authentication token" },
			{ status: 401 }
		);
	}

	// Verify UPenn email
	if (!user.email || !isUPennEmail(user.email)) {
		return NextResponse.json(
			{ error: "Only UPenn students can post messages" },
			{ status: 403 }
		);
	}

	// Process the message
	const payload = await req.json();
	const { recipients, body, color } = payload ?? {};
	if (!recipients || !body) {
		return NextResponse.json({ error: "Missing 'recipients' or 'body'" }, { status: 400 });
	}

	const serverSupabase = createServerClient();
	const { data, error } = await serverSupabase
		.from("messages")
		.insert({ recipients, body, color: color || "#f0f0f0", user_email: user.email })
		.select("id,recipients,body,color,created_at")
		.single();

	if (error) {
		console.error("POST /api/messages error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data, { status: 201 });
}
