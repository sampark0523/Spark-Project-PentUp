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
	const { data, error } = await supabase
		.from("messages")
		.update({ approved: true })
		.eq("id", messageId)
		.select("id,recipients,body,color,created_at,approved")
		.single();

	if (error) {
		console.error("Approve message error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (!data) {
		return NextResponse.json({ error: "Message not found" }, { status: 404 });
	}

	return NextResponse.json({ 
		message: "Message approved successfully",
		data 
	}, { status: 200 });
}

