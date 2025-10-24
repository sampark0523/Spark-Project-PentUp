import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

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
	const payload = await req.json();
	const { recipients, body, color } = payload ?? {};
	if (!recipients || !body) {
		return NextResponse.json({ error: "Missing 'recipients' or 'body'" }, { status: 400 });
	}
	const supabase = createServerClient();
	const { data, error } = await supabase
		.from("messages")
		.insert({ recipients, body, color: color || "#f0f0f0" })
		.select("id,recipients,body,color,created_at")
		.single();
	if (error) {
		console.error("POST /api/messages error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(data, { status: 201 });
}
