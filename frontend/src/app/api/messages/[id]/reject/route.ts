import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const messageId = id;
	
	if (!messageId) {
		return NextResponse.json({ error: "Message ID required" }, { status: 400 });
	}

	const supabase = createServerClient();
	const { error } = await supabase
		.from("messages")
		.delete()
		.eq("id", messageId);

	if (error) {
		console.error("Reject message error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ 
		message: "Message rejected and deleted successfully"
	}, { status: 200 });
}

