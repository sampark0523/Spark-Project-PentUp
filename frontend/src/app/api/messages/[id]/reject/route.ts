import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const messageId = id;
		
		if (!messageId) {
			return NextResponse.json({ error: "Message ID required" }, { status: 400 });
		}

		const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
		
		if (!url) {
			return NextResponse.json({ error: "Server configuration error: Missing SUPABASE_URL" }, { status: 500 });
		}
		
		if (!serviceKey) {
			console.warn("SUPABASE_SERVICE_ROLE_KEY not set, using anon key (may have RLS restrictions)");
		}

		// Use service role key to bypass RLS for admin operations
		const supabase = createClient(url, serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
		
		const { error } = await supabase
			.from("messages")
			.delete()
			.eq("id", messageId);

		if (error) {
			console.error("Reject message error:", error);
			return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
		}

		return NextResponse.json({ 
			message: "Message rejected and deleted successfully"
		}, { status: 200 });
	} catch (error: any) {
		console.error("Reject message error:", error);
		return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
	}
}

