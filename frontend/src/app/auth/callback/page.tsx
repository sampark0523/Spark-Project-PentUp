"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { getBrowserClient } from "@/lib/supabase";
import { isUPennEmail } from "@/lib/auth";
import { HomeButton } from "@/components/HomeButton";

function AuthCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleAuth = async () => {
			try {
				const supabase = getBrowserClient();

				console.log("Auth callback started");
				console.log("Full URL:", window.location.href);

				// Check for error in URL hash first
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

				// Give Supabase time to automatically process the URL
				// The detectSessionInUrl option will handle the magic link
				console.log("Waiting for Supabase to process session...");
				await new Promise(resolve => setTimeout(resolve, 2000));

				// Check for session
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();

				console.log("Session:", session);
				console.log("Session error:", sessionError);

				if (sessionError) {
					throw sessionError;
				}

				if (!session) {
					throw new Error("No session found. Please try requesting a new magic link.");
				}

				// Verify UPenn email
				const email = session.user?.email;
				if (!email || !isUPennEmail(email)) {
					await supabase.auth.signOut();
					throw new Error("Not a valid UPenn email address");
				}

				console.log("Authentication successful!");

				// Check if there's a pending message to submit
				const pendingMessageStr = localStorage.getItem('pendingMessage');
				if (pendingMessageStr) {
					try {
						const pendingMessage = JSON.parse(pendingMessageStr);
						console.log("Found pending message, submitting:", pendingMessage);

						// Submit the pending message
						const res = await fetch('/api/messages', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${session.access_token}`,
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
								localStorage.setItem('flaggedMessage', responseData.message);
							}
						} else {
							console.error("Failed to submit pending message:", await res.text());
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

export default function AuthCallbackPage() {
	return (
		<Suspense
			fallback={
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
						<Box sx={{ textAlign: "center" }}>
							<CircularProgress />
							<Typography variant="h6" sx={{ mt: 2 }}>
								Loading...
							</Typography>
						</Box>
					</Box>
				</>
			}
		>
			<AuthCallbackContent />
		</Suspense>
	);
}
