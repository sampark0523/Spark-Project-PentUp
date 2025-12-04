// Supabase Edge Function for sending approval emails

// @ts-ignore - Deno is available at runtime in Supabase Edge Functions
Deno.serve(async (req) => {
	try {
		const { messageId, recipients, body, color, baseUrl } = await req.json();

		if (!messageId || !recipients || !body) {
			return new Response(
				JSON.stringify({ error: "Missing required fields: messageId, recipients, body" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Use Supabase Edge Functions directly with anon key in URL
		// Note: You may need to configure these functions in Supabase dashboard to not require auth
		// @ts-ignore
		const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
		// @ts-ignore
		const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
		// @ts-ignore
		const approvalToken = Deno.env.get("APPROVAL_TOKEN") || "default-token-change-me";
		
		// Include anon key and token in URL for security
		const approveUrl = `${supabaseUrl}/functions/v1/approve-message?messageId=${messageId}&token=${approvalToken}&anonKey=${supabaseAnonKey}`;
		const rejectUrl = `${supabaseUrl}/functions/v1/reject-message?messageId=${messageId}&token=${approvalToken}&anonKey=${supabaseAnonKey}`;
		
		// Also include instructions for manual approval via Supabase dashboard
		const supabaseDashboardUrl = supabaseUrl ? supabaseUrl.replace('.supabase.co', '').replace('https://', 'https://supabase.com/dashboard/project/') : 'https://supabase.com/dashboard';

		const emailBody = `
A new message on Pent Up requires your approval:

Message ID: ${messageId}
To: ${recipients}
Message: ${body}
Color: ${color || '#f0f0f0'}

TO APPROVE:
Send a POST request to: ${approveUrl}
Body: {"messageId": ${messageId}}

Or use curl:
curl -X POST ${approveUrl} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \\
  -d '{"messageId": ${messageId}}'

TO REJECT:
Send a POST request to: ${rejectUrl}
Body: {"messageId": ${messageId}}

Or use curl:
curl -X POST ${rejectUrl} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \\
  -d '{"messageId": ${messageId}}'

Alternatively, you can approve/reject directly in the Supabase dashboard:
${supabaseDashboardUrl} -> Table Editor -> messages -> Find ID ${messageId} -> Edit approved field
		`.trim();

		const htmlBody = `
		<h2>Message Approval Required</h2>
		<p>A new message on Pent Up requires your approval:</p>
		<ul>
			<li><strong>Message ID:</strong> ${messageId}</li>
			<li><strong>To:</strong> ${recipients}</li>
			<li><strong>Message:</strong> ${body}</li>
			<li><strong>Color:</strong> ${color || '#f0f0f0'}</li>
		</ul>
		
		<p>
			<a href="${approveUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">Approve</a>
			<a href="${rejectUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reject</a>
		</p>
		
		<p><strong>Or approve/reject via Supabase Dashboard:</strong></p>
		<p><a href="${supabaseDashboardUrl}">Open Supabase Dashboard</a> → Table Editor → messages → Find ID ${messageId} → Edit the <code>approved</code> field</p>
		`;

		// Use Supabase's email service 
		// supabaseUrl is already defined above
		
		// Try using Supabase's built-in email if available, otherwise use Resend
		// @ts-ignore
		const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
		// Use Resend's default domain or a verified domain from env
		// Default: onboarding@resend.dev (Resend's test domain)
		// @ts-ignore
		const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "Pent Up <onboarding@resend.dev>";
		// Default to verified email (zianasundrani@gmail.com)
		// @ts-ignore
		const RESEND_TO_EMAIL = Deno.env.get("RESEND_TO_EMAIL") || "zianasundrani@gmail.com";

		// Prefer Resend if configured, otherwise try Supabase email service
		if (RESEND_API_KEY) {
			// Use Resend API
			const response = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${RESEND_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					from: RESEND_FROM_EMAIL,
					to: RESEND_TO_EMAIL,
					subject: `Message Approval Required - ID: ${messageId}`,
					text: emailBody,
					html: htmlBody,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				let errorMessage = `Resend API error: ${response.status} - ${errorText}`;
				
				// Provide helpful error message for domain/recipient verification issues
				if (response.status === 403) {
					try {
						const errorData = JSON.parse(errorText);
						if (errorData.message) {
							if (errorData.message.includes("domain is not verified")) {
								errorMessage = `Domain verification error: ${errorData.message}. Please verify your domain at https://resend.com/domains or use the default domain (onboarding@resend.dev) by not setting RESEND_FROM_EMAIL.`;
							} else if (errorData.message.includes("testing emails to your own email")) {
								// Extract the verified email from the error message or use a default
								const verifiedEmail = errorData.message.match(/\(([^)]+)\)/)?.[1] || "zianasundrani@gmail.com";
								errorMessage = `Resend test account limitation: ${errorData.message}. To send to ziana@sas.upenn.edu, either:\n1. Verify a domain at https://resend.com/domains and set RESEND_FROM_EMAIL to use that domain\n2. Or set RESEND_TO_EMAIL to your verified email (${verifiedEmail}) to receive approval emails there.`;
							}
						}
					} catch {
						// Keep original error if parsing fails
					}
				}
				
				throw new Error(errorMessage);
			}

			const result = await response.json();

			return new Response(
				JSON.stringify({
					success: true,
					messageId: result.id,
					emailSentTo: RESEND_TO_EMAIL,
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			// No email service configured - return error with fallback info
			console.error("RESEND_API_KEY not found. Email cannot be sent.");
			return new Response(
				JSON.stringify({ 
					error: "Email service not configured. RESEND_API_KEY is missing.",
					fallback: {
						to: RESEND_TO_EMAIL,
						subject: `Message Approval Required - ID: ${messageId}`,
						body: emailBody,
						approveUrl,
						rejectUrl
					}
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (err) {
		console.error("Error in send-approval-email function:", err);
		return new Response(
			JSON.stringify({ error: err.toString() }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
});

