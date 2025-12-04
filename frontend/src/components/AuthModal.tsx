"use client";

import * as React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Typography,
	Alert,
} from "@mui/material";
import { getBrowserClient } from "@/lib/supabase";
import { isUPennEmail } from "@/lib/auth";

export type AuthModalProps = {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
};

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
	const [email, setEmail] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [emailSent, setEmailSent] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validate UPenn email
		if (!isUPennEmail(email)) {
			setError("Not from UPenn. Please use your UPenn email (e.g., yourname@sas.upenn.edu)");
			return;
		}

		setLoading(true);

		try {
			const supabase = getBrowserClient();

			console.log("Attempting to send magic link to:", email);
			console.log("Redirect URL:", `${window.location.origin}/auth/callback`);

			// Send magic link
			const { data, error: authError } = await supabase.auth.signInWithOtp({
				email: email.toLowerCase().trim(),
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					shouldCreateUser: true,
				},
			});

			console.log("Supabase response:", { data, error: authError });

			if (authError) {
				console.error("Auth error details:", authError);
				throw authError;
			}

			setEmailSent(true);
		} catch (err: any) {
			console.error("Full error:", err);
			setError(err.message || "Failed to send verification email");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setEmail("");
		setError(null);
		setEmailSent(false);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Verify Your UPenn Email</DialogTitle>
			<DialogContent>
				{!emailSent ? (
					<Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							To post a message, please verify your UPenn email address. We'll send you a
							magic link to sign in.
						</Typography>
						<TextField
							label="UPenn Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="yourname@sas.upenn.edu"
							required
							fullWidth
							autoFocus
							error={!!error}
							helperText={error}
						/>
					</Box>
				) : (
					<Box sx={{ pt: 2 }}>
						<Alert severity="success">
							<Typography variant="body2">
								<strong>Check your inbox!</strong>
							</Typography>
							<Typography variant="body2" sx={{ mt: 1 }}>
								We've sent a verification link to <strong>{email}</strong>. Click the link in
								the email to verify your account and post your message.
							</Typography>
						</Alert>
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				{!emailSent && (
					<Button type="submit" onClick={handleSubmit} disabled={loading} variant="contained">
						{loading ? "Sending..." : "Send Verification Email"}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
