"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { getBrowserClient } from "@/lib/supabase";
import { isUPennEmail } from "@/lib/auth";
import { HomeButton } from "@/components/HomeButton";

export default function AuthCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleAuth = async () => {
			try {
				const supabase = getBrowserClient();

				console.log("All URL params:", Object.fromEntries(searchParams.entries()));
				console.log("Full URL:", window.location.href);

				// Check for error in URL hash (Supabase puts errors in the hash)
				const hashParams = new URLSearchParams(window.location.hash.substring(1));
				const errorCode = hashParams.get("error_code");
				const errorDescription = hashParams.get("error_description");

				if (errorCode) {
					console.error("Error in URL:", errorCode, errorDescription);
					if (errorCode === "otp_expired") {
						throw new Error("This magic link has expired. Please request a new one.");
					}
					throw new Error(errorDescription || "Authentication failed");
				}

				// Let Supabase automatically handle the magic link
				// The detectSessionInUrl option in our client config will process the URL
				await new Promise(resolve => setTimeout(resolve, 500)); // Wait for Supabase to process URL

				// Now check if we have a session
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();

				console.log("Session after URL processing:", session);
				console.log("Session error:", sessionError);

				if (!session) {
					// Check URL hash for token_hash and type (Supabase may use hash instead of query params)
					let tokenHash = searchParams.get("token_hash") || hashParams.get("token_hash");
					let type = searchParams.get("type") || hashParams.get("type");

					console.log("Token hash:", tokenHash);
					console.log("Type:", type);

					if (tokenHash && type) {
						console.log("Manually verifying OTP...");
						const { data, error: verifyError } = await supabase.auth.verifyOtp({
							token_hash: tokenHash,
							type: type as any,
						});

						if (verifyError) {
							console.error("Verify OTP error:", verifyError);
							throw verifyError;
						}

						console.log("OTP verification data:", data);

						// Check the email
						const email = data.user?.email;
						if (!email || !isUPennEmail(email)) {
							await supabase.auth.signOut();
							throw new Error("Not a valid UPenn email address");
						}
					} else {
						throw new Error("No authentication data found. Please request a new magic link from the home page.");
					}
				} else {
					// We have a session, verify the email
					const email = session.user?.email;
					if (!email || !isUPennEmail(email)) {
						await supabase.auth.signOut();
						throw new Error("Not a valid UPenn email address");
					}
				}

				console.log("Authentication successful!");

				// Check if there's a pending message to submit
				const pendingMessageStr = localStorage.getItem('pendingMessage');
				if (pendingMessageStr) {
					try {
						const pendingMessage = JSON.parse(pendingMessageStr);
						console.log("Found pending message, submitting:", pendingMessage);

						// Get the current session for the auth token
						const { data: { session: currentSession } } = await supabase.auth.getSession();

						if (currentSession) {
							// Submit the pending message
							const res = await fetch('/api/messages', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									'Authorization': `Bearer ${currentSession.access_token}`,
								},
								body: JSON.stringify({
									recipients: pendingMessage.recipient,
									body: pendingMessage.message,
									color: pendingMessage.color,
								}),
							});

							if (res.ok) {
								const responseData = await res.json();
								console.log("Pending message submitted successfully!");
								localStorage.removeItem('pendingMessage');
								
								// Check if message was flagged
								if (responseData.message && responseData.message.includes("flagged")) {
									// Store flagged message in localStorage so it shows after redirect
									localStorage.setItem('flaggedMessage', responseData.message);
								}
							} else {
								console.error("Failed to submit pending message:", await res.text());
							}
						}
					} catch (err) {
						console.error("Error submitting pending message:", err);
					}
				}

				// Redirect to home page
				router.push("/");
			} catch (err: any) {
				console.error("Auth callback error:", err);
				setError(err.message || "Authentication failed");
			}
		};

		handleAuth();
	}, [router, searchParams]);

	return (
		<>
			<HomeButton />
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "#f5e6d3",
				}}
			>
				{error ? (
				<Alert severity="error" sx={{ maxWidth: 400 }}>
					<Typography variant="h6">Authentication Failed</Typography>
					<Typography variant="body2" sx={{ mt: 1 }}>
						{error}
					</Typography>
				</Alert>
			) : (
				<Box sx={{ textAlign: "center" }}>
					<CircularProgress />
					<Typography variant="h6" sx={{ mt: 2 }}>
						Verifying your UPenn email...
					</Typography>
				</Box>
			)}
			</Box>
		</>
	);
}
