// Supabase Edge Function to approve a message

// @ts-ignore - Deno is available at runtime in Supabase Edge Functions
Deno.serve(async (req) => {
	// Handle CORS preflight requests
	if (req.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		});
	}

	try {
		// Support both GET (from email links) and POST requests
		let messageId;
		let token;
		
		if (req.method === "GET") {
			const url = new URL(req.url);
			messageId = url.searchParams.get("messageId");
			token = url.searchParams.get("token");
		} else {
			const body = await req.json();
			messageId = body.messageId;
			token = body.token;
		}
		
		// Verify token for security
		// @ts-ignore
		const expectedToken = Deno.env.get("APPROVAL_TOKEN");
		if (expectedToken && token !== expectedToken) {
			if (req.method === "GET") {
				return new Response(
					`<html><body><h1>Unauthorized</h1><p>Invalid token. Please use the link from your email.</p></body></html>`,
					{
						status: 401,
						headers: { "Content-Type": "text/html" },
					}
				);
			}
			return new Response(
				JSON.stringify({ error: "Unauthorized: Invalid token" }),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		if (!messageId) {
			return new Response(
				JSON.stringify({ error: "Missing 'messageId' field" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Get Supabase client
		// @ts-ignore
		const supabaseUrl = Deno.env.get("SUPABASE_URL");
		// @ts-ignore
		const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

		if (!supabaseUrl || !supabaseServiceKey) {
			const errorMsg = "Supabase configuration missing";
			if (req.method === "GET") {
				return new Response(
					`<html><body><h1>Configuration Error</h1><p>${errorMsg}</p></body></html>`,
					{
						status: 500,
						headers: { "Content-Type": "text/html" },
					}
				);
			}
			return new Response(
				JSON.stringify({ error: errorMsg }),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Create Supabase client with service role key
		const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Update message to approved
		const { data, error } = await supabase
			.from("messages")
			.update({ approved: true })
			.eq("id", messageId)
			.select("id,recipients,body,color,created_at,approved")
			.single();

		if (error) {
			console.error("Approve message error:", error);
			return new Response(
				JSON.stringify({ error: error.message }),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		if (!data) {
			if (req.method === "GET") {
				return new Response(
					`<html><body><h1>Message Not Found</h1><p>Message ID ${messageId} was not found.</p></body></html>`,
					{
						status: 404,
						headers: { "Content-Type": "text/html" },
					}
				);
			}
			return new Response(
				JSON.stringify({ error: "Message not found" }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Return HTML for GET requests (clickable from email), JSON for POST
		if (req.method === "GET") {
			return new Response(
				`<html>
					<head><title>Message Approved</title></head>
					<body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
						<h1 style="color: #4CAF50;">✓ Message Approved Successfully</h1>
						<p>Message ID: <strong>${messageId}</strong></p>
						<p>The message has been approved and will now be visible on the website.</p>
						<p><a href="${supabaseUrl?.replace('.supabase.co', '').replace('https://', 'https://supabase.com/dashboard/project/') || 'https://supabase.com/dashboard'}">View in Supabase Dashboard</a></p>
					</body>
				</html>`,
				{
					status: 200,
					headers: { 
						"Content-Type": "text/html",
						"Access-Control-Allow-Origin": "*",
					},
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Message approved successfully",
				data,
			}),
			{
				status: 200,
				headers: { 
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			}
		);
	} catch (err) {
		console.error("Error in approve-message function:", err);
		return new Response(
			JSON.stringify({ error: err.toString() }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
});

