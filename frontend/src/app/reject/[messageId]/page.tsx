"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase";

export default function RejectPage() {
	const params = useParams();
	const router = useRouter();
	const messageId = params.messageId as string;
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		async function rejectMessage() {
			if (!messageId) {
				setStatus("error");
				setMessage("Missing message ID");
				return;
			}

			try {
				const supabase = getBrowserClient();
				const { data: { session } } = await supabase.auth.getSession();
				
				if (!session) {
					setStatus("error");
					setMessage("Please sign in to reject messages");
					return;
				}

				const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
				if (!supabaseUrl) {
					setStatus("error");
					setMessage("Server configuration error");
					return;
				}

				const response = await fetch(`${supabaseUrl}/functions/v1/reject-message`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${session.access_token}`,
					},
					body: JSON.stringify({ messageId }),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
					throw new Error(errorData.error || `Request failed: ${response.status}`);
				}

				const result = await response.json();
				setStatus("success");
				setMessage(`Message ${messageId} has been rejected and deleted.`);
			} catch (error: any) {
				setStatus("error");
				setMessage(error.message || "Failed to reject message");
			}
		}

		rejectMessage();
	}, [messageId]);

	return (
		<div style={{ 
			fontFamily: "Arial, sans-serif", 
			padding: "40px 20px", 
			textAlign: "center",
			maxWidth: "600px",
			margin: "0 auto"
		}}>
			{status === "loading" && (
				<>
					<h1>Rejecting message...</h1>
					<p>Please wait...</p>
				</>
			)}
			{status === "success" && (
				<>
					<h1 style={{ color: "#f44336" }}>✗ Message Rejected</h1>
					<p>{message}</p>
				</>
			)}
			{status === "error" && (
				<>
					<h1 style={{ color: "#f44336" }}>✗ Error</h1>
					<p>{message}</p>
				</>
			)}
		</div>
	);
}

