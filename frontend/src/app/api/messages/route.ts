import { NextRequest, NextResponse } from "next/server";
import { createServerClient, getBrowserClient } from "@/lib/supabase";
import { isUPennEmail } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

async function sendApprovalEmail(messageId: number, recipients: string, body: string, color: string) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
		(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
	
	if (!supabaseUrl || !anonKey) {
		console.error('Missing Supabase configuration for email sending');
		return;
	}

	try {
		// Use Supabase Edge Function to send email (similar to how auth emails work)
		const response = await fetch(`${supabaseUrl}/functions/v1/send-approval-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${anonKey}`,
			},
			body: JSON.stringify({
				messageId,
				recipients,
				body,
				color,
				baseUrl,
			}),
		});

		const responseText = await response.text();
		
		if (!response.ok) {
			console.error('Email function error:', response.status, responseText);
			// Log the email details for manual sending if service not configured
			try {
				const errorData = JSON.parse(responseText);
				if (errorData.fallback) {
					console.log('=== APPROVAL EMAIL (Email service not configured) ===');
					console.log(`To: ${errorData.fallback.to}`);
					console.log(`Subject: ${errorData.fallback.subject}`);
					console.log(`Body:\n${errorData.fallback.body}`);
					console.log(`Approve URL: ${errorData.fallback.approveUrl}`);
					console.log(`Reject URL: ${errorData.fallback.rejectUrl}`);
					console.log('==========================================');
				}
			} catch {
				// If not JSON, just log the error
				console.error('Email sending failed:', responseText);
			}
			return;
		}

		const result = JSON.parse(responseText);
	} catch (error) {
		console.error('Failed to send approval email:', error);
	}
}

export async function GET() {
	const supabase = createServerClient();
	const { data, error } = await supabase
		.from("messages")
		.select("id,recipients,body,color,created_at")
		.eq("approved", true)
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

	// Moderate the message content
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	if (!supabaseUrl) {
		return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
	}

	try {
		const moderationResponse = await fetch(`${supabaseUrl}/functions/v1/moderate-message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${anonKey}`,
			},
			body: JSON.stringify({ text: body }),
		});

		if (!moderationResponse.ok) {
			console.error("Moderation service error:", await moderationResponse.text());
			return NextResponse.json(
				{ error: "Content moderation service unavailable. Please try again later." },
				{ status: 503 }
			);
		}

		const moderationResult = await moderationResponse.json();
		
		const isToxic = moderationResult.severe;
		
		// Insert message with approval status
		const serverSupabase = createServerClient();
		const { data, error } = await serverSupabase
			.from("messages")
			.insert({ 
				recipients, 
				body, 
				color: color || "#f0f0f0", 
				user_email: user.email,
				approved: !isToxic // Auto-approve if not severe, pending if severe
			})
			.select("id,recipients,body,color,created_at,approved")
			.single();

		if (error) {
			console.error("POST /api/messages error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// If message is flagged, send approval email automatically
		if (isToxic && data) {
			// Send email automatically - don't await to avoid blocking the response
			sendApprovalEmail(data.id, recipients, body, color || "#f0f0f0").catch(err => {
				console.error("Failed to send approval email:", err);
			});
			
			return NextResponse.json(
				{ 
					...data,
					message: "Your message has been flagged and is waiting for approval from a moderator. If approved, your message will be posted to the board." 
				}, 
				{ status: 201 }
			);
		}

		return NextResponse.json(data, { status: 201 });
	} catch (moderationError) {
		console.error("Moderation error:", moderationError);
		// If moderation fails, still insert but mark as pending
		const serverSupabase = createServerClient();
		const { data, error } = await serverSupabase
			.from("messages")
			.insert({ 
				recipients, 
				body, 
				color: color || "#f0f0f0", 
				user_email: user.email,
				approved: false // Pending approval if moderation fails
			})
			.select("id,recipients,body,color,created_at,approved")
			.single();

		if (error) {
			console.error("POST /api/messages error:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Send approval email automatically
		// (using Supabase Edge Function, similar to how Supabase sends auth emails)
		if (data) {
			sendApprovalEmail(data.id, recipients, body, color || "#f0f0f0").catch(err => {
				console.error("Failed to send approval email:", err);
			});
		}

		return NextResponse.json(
			{ 
				...data,
				message: "Your message has been flagged and is waiting for approval from a moderator. You will be notified once it's reviewed." 
			}, 
			{ status: 201 }
		);
	}
}
