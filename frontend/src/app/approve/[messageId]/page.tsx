"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase";
import { HomeButton } from "@/components/HomeButton";

export default function ApprovePage() {
	const params = useParams();
	const router = useRouter();
	const messageId = params.messageId as string;
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		async function approveMessage() {
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
					setMessage("Please sign in to approve messages");
					return;
				}

				const response = await fetch(`/api/messages/${messageId}/approve`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
					throw new Error(errorData.error || `Request failed: ${response.status}`);
				}

				const result = await response.json();
				setStatus("success");
				setMessage(`Message ${messageId} has been approved successfully!`);
			} catch (error: any) {
				setStatus("error");
				setMessage(error.message || "Failed to approve message");
			}
		}

		approveMessage();
	}, [messageId]);

	return (
		<>
			<HomeButton />
			<div style={{
				fontFamily: "Arial, sans-serif",
				padding: "40px 20px",
				textAlign: "center",
				maxWidth: "600px",
				margin: "0 auto"
			}}>
				{status === "loading" && (
				<>
					<h1>Approving message...</h1>
					<p>Please wait...</p>
				</>
			)}
			{status === "success" && (
				<>
					<h1 style={{ color: "#4CAF50" }}>✓ Message Approved Successfully</h1>
					<p>{message}</p>
					<p>The message will now be visible on the website.</p>
				</>
			)}
			{status === "error" && (
				<>
					<h1 style={{ color: "#f44336" }}>✗ Error</h1>
					<p>{message}</p>
				</>
			)}
			</div>
		</>
	);
}

