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
	const [otp, setOtp] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [emailSent, setEmailSent] = React.useState(false);

	const handleSendCode = async (e: React.FormEvent) => {
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

			console.log("Attempting to send OTP code to:", email);

			// Send OTP code (no redirect URL = sends a code instead of magic link)
			const { data, error: authError } = await supabase.auth.signInWithOtp({
				email: email.toLowerCase().trim(),
				options: {
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
			setError(err.message || "Failed to send verification code");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const supabase = getBrowserClient();

			console.log("Attempting to verify OTP code");

			// Verify the OTP code
			const { data, error: verifyError } = await supabase.auth.verifyOtp({
				email: email.toLowerCase().trim(),
				token: otp.trim(),
				type: 'email',
			});

			console.log("Verify response:", { data, error: verifyError });

			if (verifyError) {
				console.error("Verify error details:", verifyError);
				throw verifyError;
			}

			// Verify UPenn email
			const userEmail = data.user?.email;
			if (!userEmail || !isUPennEmail(userEmail)) {
				await supabase.auth.signOut();
				throw new Error("Not a valid UPenn email address");
			}

			console.log("Verification successful!");
			onSuccess();
		} catch (err: any) {
			console.error("Full error:", err);
			setError(err.message || "Invalid verification code");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setEmail("");
		setOtp("");
		setError(null);
		setEmailSent(false);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Verify Your UPenn Email</DialogTitle>
			<DialogContent>
				{!emailSent ? (
					<Box component="form" onSubmit={handleSendCode} sx={{ pt: 2 }}>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							To post a message, please verify your UPenn email address. We'll send you a
							6-digit verification code.
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
					<Box component="form" onSubmit={handleVerifyCode} sx={{ pt: 2 }}>
						<Alert severity="success" sx={{ mb: 2 }}>
							<Typography variant="body2">
								<strong>Check your inbox!</strong>
							</Typography>
							<Typography variant="body2" sx={{ mt: 1 }}>
								We've sent a 6-digit code to <strong>{email}</strong>.
							</Typography>
						</Alert>
						<TextField
							label="Verification Code"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							placeholder="123456"
							required
							fullWidth
							autoFocus
							error={!!error}
							helperText={error}
							inputProps={{ maxLength: 6 }}
						/>
						<Button
							onClick={() => {
								setEmailSent(false);
								setOtp("");
								setError(null);
							}}
							sx={{ mt: 2 }}
							size="small"
						>
							Use a different email
						</Button>
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				{!emailSent ? (
					<Button type="submit" onClick={handleSendCode} disabled={loading} variant="contained">
						{loading ? "Sending..." : "Send Code"}
					</Button>
				) : (
					<Button type="submit" onClick={handleVerifyCode} disabled={loading} variant="contained">
						{loading ? "Verifying..." : "Verify Code"}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
