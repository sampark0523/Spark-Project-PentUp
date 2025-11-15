"use client";

import * as React from "react";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { AuthModal } from "./AuthModal";
import { getBrowserClient } from "@/lib/supabase";

const presetColors = [
	"#ef4444",
	"#f59e0b",
	"#10b981",
	"#3b82f6",
	"#8b5cf6",
	"#f43f5e",
	"#6b7280",
];

export type MessageInput = {
	recipients: string;
	body: string;
	color: string;
};

export function MessageForm({ onSubmitted }: { onSubmitted?: () => void }) {
	const [form, setForm] = React.useState<MessageInput>({ recipients: "", body: "", color: presetColors[3] });
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [showAuthModal, setShowAuthModal] = React.useState(false);
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	// Check authentication status on mount
	React.useEffect(() => {
		const checkAuth = async () => {
			const supabase = getBrowserClient();
			const { data } = await supabase.auth.getSession();
			setIsAuthenticated(!!data.session);
		};
		checkAuth();

		// Listen for auth changes
		const supabase = getBrowserClient();
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			setIsAuthenticated(!!session);
			if (event === "SIGNED_IN") {
				setShowAuthModal(false);
			}
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// Check if user is authenticated
		const supabase = getBrowserClient();
		const { data: { session } } = await supabase.auth.getSession();

		if (!session) {
			// Show auth modal if not authenticated
			setShowAuthModal(true);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${session.access_token}`,
				},
				body: JSON.stringify(form),
			});
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j.error || `Request failed: ${res.status}`);
			}
			setForm({ recipients: "", body: "", color: presetColors[3] });
			onSubmitted?.();
		} catch (err: any) {
			setError(err.message ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
				<Stack spacing={2}>
					<TextField
						label="To"
						value={form.recipients}
						onChange={(e) => setForm((f) => ({ ...f, recipients: e.target.value }))}
						required
						fullWidth
					/>
					<TextField
						label="Message"
						value={form.body}
						onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
						multiline
						minRows={3}
						required
						fullWidth
					/>
					<TextField
						label="Color"
						select
						value={form.color}
						onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
					>
						{presetColors.map((c) => (
							<MenuItem key={c} value={c}>
								<Stack direction="row" spacing={1} alignItems="center">
									<Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: c }} />
									<span>{c}</span>
								</Stack>
							</MenuItem>
						))}
					</TextField>
					<Button type="submit" variant="contained" disabled={loading}>
						{loading ? "Submitting..." : "Submit"}
					</Button>
					{error && <Box sx={{ color: "error.main", fontSize: 14 }}>{error}</Box>}
				</Stack>
			</Box>

			<AuthModal
				open={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				onSuccess={() => {
					setShowAuthModal(false);
					// Re-submit the form after successful authentication
					handleSubmit(new Event("submit") as any);
				}}
			/>
		</>
	);
}
